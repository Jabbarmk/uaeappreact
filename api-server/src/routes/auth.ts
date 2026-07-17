import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { query, queryOne } from '../db/pool';
import { sendOtpEmail, sendOtpSms } from '../services/mailer';
import { requireUser } from '../middleware/userAuth';

const router = Router();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}

// ── Send OTP ──────────────────────────────────────────────────────────────────
router.post('/send-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, channel = 'email', type } = req.body as { identifier: string; channel: string; type: string };
    if (!identifier || !type) return res.status(400).json({ error: 'Missing fields' });

    const otp = generateOtp();
    const expires = otpExpiry();

    await query(
      'INSERT INTO user_otps (identifier, otp_code, otp_type, channel, expires_at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp_code=VALUES(otp_code), expires_at=VALUES(expires_at), used=0',
      [identifier.toLowerCase(), otp, type, channel, expires]
    );

    if (channel === 'sms') {
      await sendOtpSms(identifier, otp, type);
    } else {
      await sendOtpEmail(identifier, otp, type);
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Verify OTP ────────────────────────────────────────────────────────────────
router.post('/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, otp_code, type } = req.body as { identifier: string; otp_code: string; type: string };
    const record = await queryOne<any>(
      'SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [identifier.toLowerCase(), type]
    );
    if (!record || record.otp_code !== otp_code) return res.status(400).json({ error: 'Invalid or expired OTP' });
    await query('UPDATE user_otps SET used=1 WHERE id=?', [record.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, mobile, password, emirate, otp_code } = req.body as Record<string, string>;
    // OTP-only signup: email is verified, password is optional (kept for future use).
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const identifier = email.toLowerCase();

    // Verify the email signup OTP
    const otpRecord = await queryOne<any>(
      'SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [identifier, 'signup']
    );
    if (!otpRecord || otpRecord.otp_code !== otp_code) return res.status(400).json({ error: 'Invalid or expired OTP' });
    await query('UPDATE user_otps SET used=1 WHERE id=?', [otpRecord.id]);

    // Check duplicate
    {
      const exists = await queryOne('SELECT id FROM users WHERE email=?', [identifier]);
      if (exists) return res.status(400).json({ error: 'Email already registered' });
    }
    if (mobile) {
      const exists = await queryOne('SELECT id FROM users WHERE mobile=?', [mobile]);
      if (exists) return res.status(400).json({ error: 'Mobile already registered' });
    }

    const hash = password ? await bcrypt.hash(password, 10) : null;
    const result = await query<any>(
      'INSERT INTO users (name, email, mobile, password_hash, emirate, is_verified) VALUES (?, ?, ?, ?, ?, 1)',
      [name, identifier, mobile || null, hash, emirate || null]
    ) as any;

    const userId = result.insertId;
    (req.session as any).userId = userId;
    (req.session as any).userName = name;
    (req.session as any).userType = 'user';

    res.json({ ok: true, user: { id: userId, name, email, mobile, emirate, user_type: 'user' } });
  } catch (err) { next(err); }
});

// ── Login (password) — LEGACY/UNUSED ──────────────────────────────────────────
// Password login was removed from the UI in favour of OTP-only sign in. The
// endpoint and password_hash column are intentionally kept (not deleted) so a
// password flow can be re-enabled later without data loss.
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body as { identifier: string; password: string };
    if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await queryOne<any>(
      'SELECT * FROM users WHERE (email=? OR mobile=?) AND is_active=1',
      [identifier.toLowerCase(), identifier]
    );
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.password_hash) return res.status(401).json({ error: 'Use OTP login' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    (req.session as any).userId = user.id;
    (req.session as any).userName = user.name;
    (req.session as any).userType = user.user_type;

    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, emirate: user.emirate, user_type: user.user_type, avatar: user.avatar } });
  } catch (err) { next(err); }
});

// ── Login with OTP ────────────────────────────────────────────────────────────
router.post('/login-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, otp_code } = req.body as { identifier: string; otp_code: string };
    const otpRecord = await queryOne<any>(
      'SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [identifier.toLowerCase(), 'login']
    );
    if (!otpRecord || otpRecord.otp_code !== otp_code) return res.status(400).json({ error: 'Invalid or expired OTP' });
    await query('UPDATE user_otps SET used=1 WHERE id=?', [otpRecord.id]);

    const user = await queryOne<any>(
      'SELECT * FROM users WHERE (email=? OR mobile=?) AND is_active=1',
      [identifier.toLowerCase(), identifier]
    );
    if (!user) return res.status(404).json({ error: 'Account not found' });

    (req.session as any).userId = user.id;
    (req.session as any).userName = user.name;
    (req.session as any).userType = user.user_type;

    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, emirate: user.emirate, user_type: user.user_type, avatar: user.avatar } });
  } catch (err) { next(err); }
});

// ── Reset password ────────────────────────────────────────────────────────────
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, otp_code, new_password } = req.body as Record<string, string>;
    const otpRecord = await queryOne<any>(
      'SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [identifier.toLowerCase(), 'forgot']
    );
    if (!otpRecord || otpRecord.otp_code !== otp_code) return res.status(400).json({ error: 'Invalid or expired OTP' });
    await query('UPDATE user_otps SET used=1 WHERE id=?', [otpRecord.id]);

    const hash = await bcrypt.hash(new_password, 10);
    await query('UPDATE users SET password_hash=? WHERE email=? OR mobile=?', [hash, identifier.toLowerCase(), identifier]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Me / Logout ───────────────────────────────────────────────────────────────
router.get('/me', requireUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await queryOne<any>('SELECT id, name, email, mobile, emirate, user_type, avatar, is_verified FROM users WHERE id=?', [(req.session as any).userId]);
    if (!user) return res.status(401).json({ error: 'Not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => res.json({ ok: true }));
});

export default router;
