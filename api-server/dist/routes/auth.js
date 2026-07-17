"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const pool_1 = require("../db/pool");
const mailer_1 = require("../services/mailer");
const userAuth_1 = require("../middleware/userAuth");
const router = (0, express_1.Router)();
function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}
function otpExpiry() {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}
// ── Send OTP ──────────────────────────────────────────────────────────────────
router.post('/send-otp', async (req, res, next) => {
    try {
        const { identifier, channel = 'email', type } = req.body;
        if (!identifier || !type)
            return res.status(400).json({ error: 'Missing fields' });
        const otp = generateOtp();
        const expires = otpExpiry();
        await (0, pool_1.query)('INSERT INTO user_otps (identifier, otp_code, otp_type, channel, expires_at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp_code=VALUES(otp_code), expires_at=VALUES(expires_at), used=0', [identifier.toLowerCase(), otp, type, channel, expires]);
        if (channel === 'sms') {
            await (0, mailer_1.sendOtpSms)(identifier, otp, type);
        }
        else {
            await (0, mailer_1.sendOtpEmail)(identifier, otp, type);
        }
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// ── Verify OTP ────────────────────────────────────────────────────────────────
router.post('/verify-otp', async (req, res, next) => {
    try {
        const { identifier, otp_code, type } = req.body;
        const record = await (0, pool_1.queryOne)('SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1', [identifier.toLowerCase(), type]);
        if (!record || record.otp_code !== otp_code)
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        await (0, pool_1.query)('UPDATE user_otps SET used=1 WHERE id=?', [record.id]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, mobile, password, emirate, otp_code } = req.body;
        // OTP-only signup: email is verified, password is optional (kept for future use).
        if (!name || !email)
            return res.status(400).json({ error: 'Name and email are required' });
        const identifier = email.toLowerCase();
        // Verify the email signup OTP
        const otpRecord = await (0, pool_1.queryOne)('SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1', [identifier, 'signup']);
        if (!otpRecord || otpRecord.otp_code !== otp_code)
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        await (0, pool_1.query)('UPDATE user_otps SET used=1 WHERE id=?', [otpRecord.id]);
        // Check duplicate
        {
            const exists = await (0, pool_1.queryOne)('SELECT id FROM users WHERE email=?', [identifier]);
            if (exists)
                return res.status(400).json({ error: 'Email already registered' });
        }
        if (mobile) {
            const exists = await (0, pool_1.queryOne)('SELECT id FROM users WHERE mobile=?', [mobile]);
            if (exists)
                return res.status(400).json({ error: 'Mobile already registered' });
        }
        const hash = password ? await bcrypt_1.default.hash(password, 10) : null;
        const result = await (0, pool_1.query)('INSERT INTO users (name, email, mobile, password_hash, emirate, is_verified) VALUES (?, ?, ?, ?, ?, 1)', [name, identifier, mobile || null, hash, emirate || null]);
        const userId = result.insertId;
        req.session.userId = userId;
        req.session.userName = name;
        req.session.userType = 'user';
        res.json({ ok: true, user: { id: userId, name, email, mobile, emirate, user_type: 'user' } });
    }
    catch (err) {
        next(err);
    }
});
// ── Login (password) — LEGACY/UNUSED ──────────────────────────────────────────
// Password login was removed from the UI in favour of OTP-only sign in. The
// endpoint and password_hash column are intentionally kept (not deleted) so a
// password flow can be re-enabled later without data loss.
router.post('/login', async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password)
            return res.status(400).json({ error: 'Missing fields' });
        const user = await (0, pool_1.queryOne)('SELECT * FROM users WHERE (email=? OR mobile=?) AND is_active=1', [identifier.toLowerCase(), identifier]);
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        if (!user.password_hash)
            return res.status(401).json({ error: 'Use OTP login' });
        const match = await bcrypt_1.default.compare(password, user.password_hash);
        if (!match)
            return res.status(401).json({ error: 'Invalid credentials' });
        req.session.userId = user.id;
        req.session.userName = user.name;
        req.session.userType = user.user_type;
        res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, emirate: user.emirate, user_type: user.user_type, avatar: user.avatar } });
    }
    catch (err) {
        next(err);
    }
});
// ── Login with OTP ────────────────────────────────────────────────────────────
router.post('/login-otp', async (req, res, next) => {
    try {
        const { identifier, otp_code } = req.body;
        const otpRecord = await (0, pool_1.queryOne)('SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1', [identifier.toLowerCase(), 'login']);
        if (!otpRecord || otpRecord.otp_code !== otp_code)
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        await (0, pool_1.query)('UPDATE user_otps SET used=1 WHERE id=?', [otpRecord.id]);
        const user = await (0, pool_1.queryOne)('SELECT * FROM users WHERE (email=? OR mobile=?) AND is_active=1', [identifier.toLowerCase(), identifier]);
        if (!user)
            return res.status(404).json({ error: 'Account not found' });
        req.session.userId = user.id;
        req.session.userName = user.name;
        req.session.userType = user.user_type;
        res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, emirate: user.emirate, user_type: user.user_type, avatar: user.avatar } });
    }
    catch (err) {
        next(err);
    }
});
// ── Reset password ────────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res, next) => {
    try {
        const { identifier, otp_code, new_password } = req.body;
        const otpRecord = await (0, pool_1.queryOne)('SELECT * FROM user_otps WHERE identifier=? AND otp_type=? AND used=0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1', [identifier.toLowerCase(), 'forgot']);
        if (!otpRecord || otpRecord.otp_code !== otp_code)
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        await (0, pool_1.query)('UPDATE user_otps SET used=1 WHERE id=?', [otpRecord.id]);
        const hash = await bcrypt_1.default.hash(new_password, 10);
        await (0, pool_1.query)('UPDATE users SET password_hash=? WHERE email=? OR mobile=?', [hash, identifier.toLowerCase(), identifier]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// ── Me / Logout ───────────────────────────────────────────────────────────────
router.get('/me', userAuth_1.requireUser, async (req, res, next) => {
    try {
        const user = await (0, pool_1.queryOne)('SELECT id, name, email, mobile, emirate, user_type, avatar, is_verified FROM users WHERE id=?', [req.session.userId]);
        if (!user)
            return res.status(401).json({ error: 'Not found' });
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
});
exports.default = router;
