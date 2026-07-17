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

// The "Other" bucket category that holds businesses with an unresolved category
// request until an admin assigns/creates a real one.
async function getOtherCategoryId(): Promise<number> {
  const row = await queryOne<any>("SELECT id FROM business_categories WHERE name='Other' LIMIT 1");
  if (row) return row.id;
  const r = await query<any>("INSERT INTO business_categories (name, group_name, icon, sort_order, is_active) VALUES ('Other','Other','📦',999,1)") as any;
  return r.insertId;
}

// Resolve the category for a business submission: an explicit category wins;
// otherwise a requested name parks it under "Other" and records the request.
async function resolveBusinessCategory(category_id?: string, requested_category_name?: string) {
  if (category_id) return { categoryId: Number(category_id), requestedName: null as string | null };
  const reqName = (requested_category_name || '').trim();
  if (reqName) return { categoryId: await getOtherCategoryId(), requestedName: reqName.slice(0, 100) };
  return { categoryId: null as number | null, requestedName: null as string | null };
}

// Insert any comma-separated names into a master taxonomy table (global, deduped).
async function upsertTaxonomy(table: 'skills' | 'languages', csv?: string | null) {
  if (!csv) return;
  const names = csv.split(',').map((s) => s.trim()).filter(Boolean);
  for (const name of names) {
    if (name.length > 100) continue;
    await query(
      `INSERT INTO ${table} (name, usage_count) VALUES (?, 1) ON DUPLICATE KEY UPDATE usage_count = usage_count + 1`,
      [name]
    );
  }
}

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
    const { name, category_id, requested_category_name, tagline, description, emirate, address, phone, whatsapp, email, website } = req.body as Record<string, string>;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const { categoryId, requestedName } = await resolveBusinessCategory(category_id, requested_category_name);
    const result = await query<any>(
      'INSERT INTO businesses (user_id, name, category_id, requested_category_name, tagline, description, emirate, address, phone, whatsapp, email, website, status, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,\'pending\',0)',
      [uid(req), name, categoryId, requestedName, tagline || null, description || null, emirate || null, address || null, phone || null, whatsapp || null, email || null, website || null]
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

router.put('/businesses/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const biz = await queryOne<any>('SELECT * FROM businesses WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!biz) return res.status(404).json({ error: 'Not found' });
    const { name, category_id, requested_category_name, tagline, description, emirate, address, phone, whatsapp, email, website } = req.body as Record<string, string>;
    const { categoryId, requestedName } = await resolveBusinessCategory(category_id, requested_category_name);
    await query('UPDATE businesses SET name=?,category_id=?,requested_category_name=?,tagline=?,description=?,emirate=?,address=?,phone=?,whatsapp=?,email=?,website=?,status=\'pending\' WHERE id=?',
      [name || biz.name, categoryId, requestedName, tagline || null, description || null, emirate || null, address || null, phone || null, whatsapp || null, email || null, website || null, req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── My Jobs ───────────────────────────────────────────────────────────────────
router.get('/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query<any>(
      'SELECT j.*, (SELECT COUNT(*) FROM job_applications a WHERE a.job_id=j.id) AS applicant_count FROM jobs j WHERE j.user_id=? ORDER BY j.posted_at DESC',
      [uid(req)]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, company, business_id, location, emirate, job_type, work_model, salary_min, salary_max, currency, description, requirements, benefits } = req.body as Record<string, string>;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const result = await query<any>(
      'INSERT INTO jobs (user_id, title, company, business_id, location, emirate, job_type, work_model, salary_min, salary_max, currency, description, requirements, benefits, status, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,\'pending\',0)',
      [uid(req), title, company || null, business_id || null, location || null, emirate || null, job_type || null, work_model || null, salary_min || null, salary_max || null, currency || 'AED', description || null, requirements || null, benefits || null]
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

router.put('/jobs/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await queryOne<any>('SELECT * FROM jobs WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!job) return res.status(404).json({ error: 'Not found' });
    const { title, company, business_id, location, emirate, job_type, work_model, salary_min, salary_max, currency, description, requirements, benefits } = req.body as Record<string, string>;
    await query('UPDATE jobs SET title=?,company=?,business_id=?,location=?,emirate=?,job_type=?,work_model=?,salary_min=?,salary_max=?,currency=?,description=?,requirements=?,benefits=?,status=\'pending\' WHERE id=?',
      [title || job.title, company || null, business_id || null, location || null, emirate || null, job_type || null, work_model || null, salary_min || null, salary_max || null, currency || 'AED', description || null, requirements || null, benefits || null, req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Applicants for one of my jobs ─────────────────────────────────────────────
router.get('/jobs/:id/applicants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await queryOne<any>('SELECT id, title FROM jobs WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!job) return res.status(404).json({ error: 'Not found' });
    const rows = await query<any>(
      `SELECT a.id AS application_id, a.status, a.applied_at, a.cover_letter,
              u.id AS user_id, u.name AS user_name, u.avatar,
              p.id AS profile_id, p.full_name, p.title, p.photo,
              p.experience_years, p.notice_period, p.location, p.visa_status
       FROM job_applications a
       JOIN users u ON u.id = a.user_id
       LEFT JOIN user_profiles p ON p.user_id = a.user_id
       WHERE a.job_id = ?
       ORDER BY a.applied_at DESC`,
      [req.params.id]
    );
    const applicants = rows.map((r) => ({
      ...r,
      photoUrl: r.photo ? getImageUrl(r.photo, 'profiles') : (r.avatar ? getImageUrl(r.avatar, 'avatars') : null),
    }));
    res.json({ job, applicants });
  } catch (err) { next(err); }
});

// ── My applications (jobs I applied to) ───────────────────────────────────────
router.get('/applied-jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query<any>(
      `SELECT a.id AS application_id, a.status AS application_status, a.applied_at,
              j.id, j.title, j.company, j.location, j.emirate, j.job_type, j.work_model
       FROM job_applications a
       JOIN jobs j ON j.id = a.job_id
       WHERE a.user_id = ?
       ORDER BY a.applied_at DESC`,
      [uid(req)]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/applications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { job_id, cover_letter } = req.body as Record<string, string>;
    if (!job_id) return res.status(400).json({ error: 'job_id required' });
    const job = await queryOne<any>('SELECT id, user_id FROM jobs WHERE id=?', [job_id]);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.user_id === uid(req)) return res.status(400).json({ error: 'You cannot apply to your own job' });
    const existing = await queryOne<any>('SELECT id FROM job_applications WHERE job_id=? AND user_id=?', [job_id, uid(req)]);
    if (existing) return res.status(409).json({ error: 'Already applied', alreadyApplied: true });
    const result = await query<any>(
      'INSERT INTO job_applications (job_id, user_id, cover_letter) VALUES (?,?,?)',
      [job_id, uid(req), cover_letter || null]
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

// Has the current user applied to this job? → { applied: boolean }
router.get('/applications/check/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await queryOne<any>('SELECT id FROM job_applications WHERE job_id=? AND user_id=?', [req.params.jobId, uid(req)]);
    res.json({ applied: !!existing });
  } catch (err) { next(err); }
});

// ── Skills / Languages: add a new global entry (used by the CV tag picker) ─────
router.post('/skills', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name || name.length > 100) return res.status(400).json({ error: 'Invalid name' });
    await query('INSERT INTO skills (name, usage_count) VALUES (?, 1) ON DUPLICATE KEY UPDATE usage_count = usage_count + 1', [name]);
    res.json({ ok: true, name });
  } catch (err) { next(err); }
});

router.post('/languages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name || name.length > 100) return res.status(400).json({ error: 'Invalid name' });
    await query('INSERT INTO languages (name, usage_count) VALUES (?, 1) ON DUPLICATE KEY UPDATE usage_count = usage_count + 1', [name]);
    res.json({ ok: true, name });
  } catch (err) { next(err); }
});

// ── My Classifieds ────────────────────────────────────────────────────────────
// Category-specific detail fields. The owner never sets status/expiry/is_active —
// those are controlled by the admin approval flow.
const CLASSIFIED_FIELDS = [
  'brand', 'model', 'color', 'condition_status',
  'storage', 'memory', 'battery_health', 'carrier_lock',
  'year', 'mileage', 'transmission', 'fuel_type',
  'furniture_type', 'material', 'dimensions',
] as const;

router.get('/classifieds', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query<any>('SELECT c.*, cc.name AS category_name FROM classifieds c LEFT JOIN classified_categories cc ON c.category_id=cc.id WHERE c.user_id=? ORDER BY c.created_at DESC', [uid(req)]);
    res.json(rows.map((c) => ({ ...c, imageUrl: getImageUrl(c.image, 'classifieds') })));
  } catch (err) { next(err); }
});

// Single classified (owner) with its image gallery — used by the edit form.
router.get('/classifieds/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const c = await queryOne<any>('SELECT * FROM classifieds WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!c) return res.status(404).json({ error: 'Not found' });
    const images = await query<any>('SELECT id, filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id', [c.id]);
    res.json({ ...c, imageUrl: getImageUrl(c.image, 'classifieds'), images: images.map((i) => ({ id: i.id, url: getImageUrl(i.filename, 'classifieds') })) });
  } catch (err) { next(err); }
});

router.post('/classifieds', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as Record<string, string>;
    const { title, description, price, currency, category_id, section_id, location } = body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const cols = ['user_id', 'title', 'description', 'price', 'currency', 'category_id', 'section_id', 'location', ...CLASSIFIED_FIELDS, 'status', 'is_active'];
    const vals: unknown[] = [uid(req), title, description || null, price || null, currency || 'AED', category_id || null, section_id || null, location || null,
      ...CLASSIFIED_FIELDS.map((f) => body[f] || null), 'pending', 0];
    const result = await query<any>(
      `INSERT INTO classifieds (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`,
      vals
    ) as any;
    res.json({ ok: true, id: result.insertId });
  } catch (err) { next(err); }
});

router.put('/classifieds/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cl = await queryOne<any>('SELECT * FROM classifieds WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!cl) return res.status(404).json({ error: 'Not found' });
    const body = req.body as Record<string, string>;
    const { title, description, price, currency, category_id, section_id, location } = body;
    // Editing sends the ad back for re-approval.
    const sets = ['title=?', 'description=?', 'price=?', 'currency=?', 'category_id=?', 'section_id=?', 'location=?',
      ...CLASSIFIED_FIELDS.map((f) => `${f}=?`), "status='pending'", 'is_active=0'];
    const vals: unknown[] = [title || cl.title, description || null, price || null, currency || 'AED', category_id || null, section_id || null, location || null,
      ...CLASSIFIED_FIELDS.map((f) => body[f] || null), req.params.id];
    await query(`UPDATE classifieds SET ${sets.join(',')} WHERE id=?`, vals);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Upload one or more gallery images for an owned classified.
router.post('/classifieds/:id/images', upload.array('files', 10), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cl = await queryOne<any>('SELECT * FROM classifieds WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!cl) return res.status(404).json({ error: 'Not found' });
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) return res.status(400).json({ error: 'No files' });
    const destDir = path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/classifieds/';
    await fs.mkdir(destDir, { recursive: true });
    const startOrder = (await queryOne<any>('SELECT COALESCE(MAX(sort_order),-1)+1 AS n FROM classified_images WHERE classified_id=?', [cl.id]))?.n ?? 0;
    const saved: { id: number; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = path.extname(f.originalname).toLowerCase() || '.jpg';
      const filename = `${Date.now()}-${i}${ext}`;
      await fs.rename(f.path, destDir + filename);
      const r = await query<any>('INSERT INTO classified_images (classified_id, filename, sort_order) VALUES (?,?,?)', [cl.id, filename, startOrder + i]) as any;
      saved.push({ id: r.insertId, url: getImageUrl(filename, 'classifieds') });
    }
    // Keep the primary thumbnail in sync if it was empty.
    if (!cl.image && saved.length) {
      const first = await queryOne<any>('SELECT filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id LIMIT 1', [cl.id]);
      if (first) await query('UPDATE classifieds SET image=? WHERE id=?', [first.filename, cl.id]);
    }
    res.json({ ok: true, images: saved });
  } catch (err) { next(err); }
});

// Remove a gallery image from an owned classified.
router.delete('/classifieds/:id/images/:imageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cl = await queryOne<any>('SELECT * FROM classifieds WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!cl) return res.status(404).json({ error: 'Not found' });
    const img = await queryOne<any>('SELECT * FROM classified_images WHERE id=? AND classified_id=?', [req.params.imageId, cl.id]);
    if (!img) return res.status(404).json({ error: 'Image not found' });
    await query('DELETE FROM classified_images WHERE id=?', [img.id]);
    // If we removed the primary thumbnail, promote the next image (or clear it).
    if (cl.image === img.filename) {
      const next = await queryOne<any>('SELECT filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id LIMIT 1', [cl.id]);
      await query('UPDATE classifieds SET image=? WHERE id=?', [next?.filename || null, cl.id]);
    }
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
    const fields = ['full_name','title','email','phone','whatsapp','linkedin','location','visa_status','notice_period','current_company','experience_years','technical_skills','work_experience','education_details','certifications','projects','languages'];
    const vals = fields.map((f) => req.body[f] ?? null);

    if (existing) {
      await query(`UPDATE user_profiles SET ${fields.map((f) => `\`${f}\`=?`).join(',')} WHERE user_id=?`, [...vals, uid(req)]);
    } else {
      await query(`INSERT INTO user_profiles (user_id,${fields.map((f) => `\`${f}\``).join(',')}) VALUES (?,${fields.map(() => '?').join(',')})`, [uid(req), ...vals]);
    }
    // Any newly typed skills/languages become globally available suggestions.
    await upsertTaxonomy('skills', req.body.technical_skills);
    await upsertTaxonomy('languages', req.body.languages);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
