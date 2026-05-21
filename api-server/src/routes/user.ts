import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';
import { requireUser } from '../middleware/userAuth';

const router = Router();
router.use(requireUser);

const upload = multer({
  dest: path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype));
  },
});

function uid(req: Request) { return (req.session as any).userId as number; }

// ── Upload avatar ─────────────────────────────────────────────────────────────
router.post('/avatar', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = `${Date.now()}${ext}`;
    const destDir = path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/avatars/';
    await fs.mkdir(destDir, { recursive: true });
    await fs.rename(req.file.path, destDir + filename);
    const url = `/assets/uploads/avatars/${filename}`;
    await query('UPDATE users SET avatar=? WHERE id=?', [url, uid(req)]);
    res.json({ ok: true, url });
  } catch (err) { next(err); }
});

// ── Profile ───────────────────────────────────────────────────────────────────
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await queryOne<any>('SELECT id, name, email, mobile, emirate, user_type, avatar, is_verified, created_at FROM users WHERE id=?', [uid(req)]);
    res.json(user);
  } catch (err) { next(err); }
});

router.put('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, mobile, emirate, current_password, new_password } = req.body as Record<string, string>;
    const user = await queryOne<any>('SELECT * FROM users WHERE id=?', [uid(req)]);
    if (!user) return res.status(404).json({ error: 'Not found' });

    if (new_password) {
      if (!current_password) return res.status(400).json({ error: 'Current password required' });
      const ok = await bcrypt.compare(current_password, user.password_hash || '');
      if (!ok) return res.status(400).json({ error: 'Current password incorrect' });
      const hash = await bcrypt.hash(new_password, 10);
      await query('UPDATE users SET password_hash=? WHERE id=?', [hash, uid(req)]);
    }

    await query('UPDATE users SET name=?, mobile=?, emirate=? WHERE id=?', [name || user.name, mobile || user.mobile, emirate || user.emirate, uid(req)]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── My Businesses ─────────────────────────────────────────────────────────────
router.get('/businesses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query<any>('SELECT b.*, bc.name AS category_name FROM businesses b LEFT JOIN business_categories bc ON b.category_id=bc.id WHERE b.user_id=? ORDER BY b.created_at DESC', [uid(req)]);
    res.json(rows.map((b) => ({ ...b, imageUrl: getImageUrl(b.image, 'businesses') })));
  } catch (err) { next(err); }
});

router.post('/businesses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category_id, tagline, description, emirate, address, phone, whatsapp, email, website } = req.body as Record<string, string>;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const result = await query<any>(
      'INSERT INTO businesses (user_id, name, category_id, tagline, description, emirate, address, phone, whatsapp, email, website, status, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,\'pending\',0)',
      [uid(req), name, category_id || null, tagline || null, description || null, emirate || null, address || null, phone || null, whatsapp || null, email || null, website || null]
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

router.put('/businesses/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const biz = await queryOne<any>('SELECT * FROM businesses WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!biz) return res.status(404).json({ error: 'Not found' });
    const { name, category_id, tagline, description, emirate, address, phone, whatsapp, email, website } = req.body as Record<string, string>;
    await query('UPDATE businesses SET name=?,category_id=?,tagline=?,description=?,emirate=?,address=?,phone=?,whatsapp=?,email=?,website=?,status=\'pending\' WHERE id=?',
      [name || biz.name, category_id || biz.category_id, tagline || null, description || null, emirate || null, address || null, phone || null, whatsapp || null, email || null, website || null, req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── My Jobs ───────────────────────────────────────────────────────────────────
router.get('/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query<any>('SELECT * FROM jobs WHERE user_id=? ORDER BY created_at DESC', [uid(req)]);
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, company, location, job_type, salary_min, salary_max, currency, description, requirements, benefits } = req.body as Record<string, string>;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const result = await query<any>(
      'INSERT INTO jobs (user_id, title, company, location, job_type, salary_min, salary_max, currency, description, requirements, benefits, status, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,\'pending\',0)',
      [uid(req), title, company || null, location || null, job_type || null, salary_min || null, salary_max || null, currency || 'AED', description || null, requirements || null, benefits || null]
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

router.put('/jobs/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await queryOne<any>('SELECT * FROM jobs WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!job) return res.status(404).json({ error: 'Not found' });
    const { title, company, location, job_type, salary_min, salary_max, currency, description, requirements, benefits } = req.body as Record<string, string>;
    await query('UPDATE jobs SET title=?,company=?,location=?,job_type=?,salary_min=?,salary_max=?,currency=?,description=?,requirements=?,benefits=?,status=\'pending\' WHERE id=?',
      [title || job.title, company || null, location || null, job_type || null, salary_min || null, salary_max || null, currency || 'AED', description || null, requirements || null, benefits || null, req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── My Classifieds ────────────────────────────────────────────────────────────
router.get('/classifieds', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query<any>('SELECT c.*, cc.name AS category_name FROM classifieds c LEFT JOIN classified_categories cc ON c.category_id=cc.id WHERE c.user_id=? ORDER BY c.created_at DESC', [uid(req)]);
    res.json(rows.map((c) => ({ ...c, imageUrl: getImageUrl(c.image, 'classifieds') })));
  } catch (err) { next(err); }
});

router.post('/classifieds', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, price, currency, category_id, section_id, location, brand, model, color, condition_status } = req.body as Record<string, string>;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const result = await query<any>(
      'INSERT INTO classifieds (user_id, title, description, price, currency, category_id, section_id, location, brand, model, color, condition_status, status, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,\'pending\',0)',
      [uid(req), title, description || null, price || null, currency || 'AED', category_id || null, section_id || null, location || null, brand || null, model || null, color || null, condition_status || null]
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

router.put('/classifieds/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cl = await queryOne<any>('SELECT * FROM classifieds WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!cl) return res.status(404).json({ error: 'Not found' });
    const { title, description, price, currency, category_id, section_id, location, brand, model, color, condition_status } = req.body as Record<string, string>;
    await query('UPDATE classifieds SET title=?,description=?,price=?,currency=?,category_id=?,section_id=?,location=?,brand=?,model=?,color=?,condition_status=?,status=\'pending\' WHERE id=?',
      [title || cl.title, description || null, price || null, currency || 'AED', category_id || null, section_id || null, location || null, brand || null, model || null, color || null, condition_status || null, req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Work Experience ───────────────────────────────────────────────────────────
router.get('/work-experience', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query<any>(
      'SELECT * FROM user_work_experience WHERE user_id=? ORDER BY start_year DESC, start_month DESC',
      [uid(req)]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/work-experience', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { job_title, company, location, start_month, start_year, end_month, end_year, is_current, description } = req.body as Record<string, any>;
    if (!job_title || !company) return res.status(400).json({ error: 'Job title and company required' });
    const result = await query<any>(
      'INSERT INTO user_work_experience (user_id, job_title, company, location, start_month, start_year, end_month, end_year, is_current, description) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [uid(req), job_title, company, location || null, start_month || null, start_year || null, end_month || null, end_year || null, is_current ? 1 : 0, description || null]
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

router.put('/work-experience/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = await queryOne<any>('SELECT * FROM user_work_experience WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!exp) return res.status(404).json({ error: 'Not found' });
    const { job_title, company, location, start_month, start_year, end_month, end_year, is_current, description } = req.body as Record<string, any>;
    await query(
      'UPDATE user_work_experience SET job_title=?, company=?, location=?, start_month=?, start_year=?, end_month=?, end_year=?, is_current=?, description=? WHERE id=?',
      [job_title || exp.job_title, company || exp.company, location || null, start_month || null, start_year || null, end_month || null, end_year || null, is_current ? 1 : 0, description || null, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/work-experience/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await query('DELETE FROM user_work_experience WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── My CV (user_profiles) ─────────────────────────────────────────────────────
router.get('/cv', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cv = await queryOne<any>('SELECT * FROM user_profiles WHERE user_id=?', [uid(req)]);
    if (!cv) return res.json(null);
    res.json({ ...cv, photoUrl: getImageUrl(cv.photo, 'profiles') });
  } catch (err) { next(err); }
});

router.put('/cv', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await queryOne<any>('SELECT id FROM user_profiles WHERE user_id=?', [uid(req)]);
    const fields = ['full_name','title','email','phone','whatsapp','linkedin','location','current_company','experience_years','technical_skills','work_experience','education_details','certifications','projects','languages'];
    const vals = fields.map((f) => req.body[f] ?? null);

    if (existing) {
      await query(`UPDATE user_profiles SET ${fields.map((f) => `\`${f}\`=?`).join(',')} WHERE user_id=?`, [...vals, uid(req)]);
    } else {
      await query(`INSERT INTO user_profiles (user_id,${fields.map((f) => `\`${f}\``).join(',')}) VALUES (?,${fields.map(() => '?').join(',')})`, [uid(req), ...vals]);
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
