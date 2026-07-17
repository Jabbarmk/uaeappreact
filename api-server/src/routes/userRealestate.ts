import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';
import { requireUser } from '../middleware/userAuth';

const router = Router();
router.use(requireUser);
const F = 'realestate';

const upload = multer({
  dest: path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)),
});

function uid(req: Request) { return (req.session as any).userId as number; }

async function saveUpload(file: Express.Multer.File, i = 0): Promise<string> {
  const destDir = path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + `/${F}/`;
  await fs.mkdir(destDir, { recursive: true });
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${i}${ext}`;
  await fs.rename(file.path, destDir + filename);
  return filename;
}

// Build a column/value pair list from an allowed field set.
function pick(body: Record<string, any>, fields: readonly string[]) {
  const cols: string[] = [];
  const vals: unknown[] = [];
  for (const f of fields) { cols.push(f); vals.push(body[f] === undefined || body[f] === '' ? null : body[f]); }
  return { cols, vals };
}

const PROPERTY_FIELDS = ['company_id', 'category_id', 'title', 'description', 'purpose', 'price', 'currency', 'rent_period', 'bedrooms', 'bathrooms', 'area_sqft', 'furnished', 'parking', 'amenities', 'location', 'emirate'] as const;
const COMPANY_FIELDS = ['name', 'about', 'phone', 'whatsapp', 'email', 'website', 'emirate', 'address'] as const;
const PROJECT_FIELDS = ['company_id', 'name', 'developer', 'location', 'emirate', 'description', 'starting_price', 'currency', 'handover', 'payment_plan'] as const;

// ── Properties ───────────────────────────────────────────────────────────────
router.get('/properties', async (req, res, next) => {
  try {
    const rows = await query<any>(`SELECT p.*, pc.name AS category_name FROM properties p
      LEFT JOIN property_categories pc ON p.category_id=pc.id WHERE p.user_id=? ORDER BY p.created_at DESC`, [uid(req)]);
    res.json(rows.map((p) => ({ ...p, imageUrl: getImageUrl(p.image, F) })));
  } catch (err) { next(err); }
});

router.get('/properties/:id', async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM properties WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const images = await query<any>('SELECT id, filename FROM property_images WHERE property_id=? ORDER BY sort_order, id', [p.id]);
    res.json({ ...p, imageUrl: getImageUrl(p.image, F), images: images.map((i) => ({ id: i.id, url: getImageUrl(i.filename, F) })) });
  } catch (err) { next(err); }
});

router.post('/properties', async (req, res, next) => {
  try {
    const body = req.body as Record<string, any>;
    if (!body.title) return res.status(400).json({ error: 'Title required' });
    const { cols, vals } = pick(body, PROPERTY_FIELDS);
    const allCols = ['user_id', ...cols, 'status', 'is_active'];
    const allVals = [uid(req), ...vals, 'pending', 0];
    const r = await query<any>(`INSERT INTO properties (${allCols.join(',')}) VALUES (${allCols.map(() => '?').join(',')})`, allVals) as any;
    res.json({ ok: true, id: r.insertId });
  } catch (err) { next(err); }
});

router.put('/properties/:id', async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM properties WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const { cols, vals } = pick(req.body, PROPERTY_FIELDS);
    const sets = [...cols.map((c) => `${c}=?`), "status='pending'", 'is_active=0'];
    await query(`UPDATE properties SET ${sets.join(',')} WHERE id=?`, [...vals, p.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.post('/properties/:id/images', upload.array('files', 12), async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM properties WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) return res.status(400).json({ error: 'No files' });
    const start = (await queryOne<any>('SELECT COALESCE(MAX(sort_order),-1)+1 AS n FROM property_images WHERE property_id=?', [p.id]))?.n ?? 0;
    const saved: { id: number; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const filename = await saveUpload(files[i], i);
      const r = await query<any>('INSERT INTO property_images (property_id, filename, sort_order) VALUES (?,?,?)', [p.id, filename, start + i]) as any;
      saved.push({ id: r.insertId, url: getImageUrl(filename, F) });
    }
    if (!p.image && saved.length) {
      const first = await queryOne<any>('SELECT filename FROM property_images WHERE property_id=? ORDER BY sort_order, id LIMIT 1', [p.id]);
      if (first) await query('UPDATE properties SET image=? WHERE id=?', [first.filename, p.id]);
    }
    res.json({ ok: true, images: saved });
  } catch (err) { next(err); }
});

router.delete('/properties/:id/images/:imageId', async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM properties WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const img = await queryOne<any>('SELECT * FROM property_images WHERE id=? AND property_id=?', [req.params.imageId, p.id]);
    if (!img) return res.status(404).json({ error: 'Image not found' });
    await query('DELETE FROM property_images WHERE id=?', [img.id]);
    if (p.image === img.filename) {
      const next = await queryOne<any>('SELECT filename FROM property_images WHERE property_id=? ORDER BY sort_order, id LIMIT 1', [p.id]);
      await query('UPDATE properties SET image=? WHERE id=?', [next?.filename || null, p.id]);
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Companies ────────────────────────────────────────────────────────────────
router.get('/companies', async (req, res, next) => {
  try {
    const rows = await query<any>('SELECT * FROM real_estate_companies WHERE user_id=? ORDER BY created_at DESC', [uid(req)]);
    res.json(rows.map((c) => ({ ...c, logoUrl: getImageUrl(c.logo, F), bannerUrl: getImageUrl(c.banner, F) })));
  } catch (err) { next(err); }
});

router.get('/companies/:id', async (req, res, next) => {
  try {
    const c = await queryOne<any>('SELECT * FROM real_estate_companies WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json({ ...c, logoUrl: getImageUrl(c.logo, F), bannerUrl: getImageUrl(c.banner, F) });
  } catch (err) { next(err); }
});

router.post('/companies', async (req, res, next) => {
  try {
    const body = req.body as Record<string, any>;
    if (!body.name) return res.status(400).json({ error: 'Company name required' });
    const { cols, vals } = pick(body, COMPANY_FIELDS);
    const allCols = ['user_id', ...cols, 'status', 'is_active'];
    const allVals = [uid(req), ...vals, 'pending', 0];
    const r = await query<any>(`INSERT INTO real_estate_companies (${allCols.join(',')}) VALUES (${allCols.map(() => '?').join(',')})`, allVals) as any;
    res.json({ ok: true, id: r.insertId });
  } catch (err) { next(err); }
});

router.put('/companies/:id', async (req, res, next) => {
  try {
    const c = await queryOne<any>('SELECT * FROM real_estate_companies WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!c) return res.status(404).json({ error: 'Not found' });
    const { cols, vals } = pick(req.body, COMPANY_FIELDS);
    const sets = [...cols.map((col) => `${col}=?`), "status='pending'", 'is_active=0'];
    await query(`UPDATE real_estate_companies SET ${sets.join(',')} WHERE id=?`, [...vals, c.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Logo / banner single-image uploads.
for (const kind of ['logo', 'banner'] as const) {
  router.post(`/companies/:id/${kind}`, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const c = await queryOne<any>('SELECT * FROM real_estate_companies WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
      if (!c) return res.status(404).json({ error: 'Not found' });
      if (!req.file) return res.status(400).json({ error: 'No file' });
      const filename = await saveUpload(req.file);
      await query(`UPDATE real_estate_companies SET ${kind}=? WHERE id=?`, [filename, c.id]);
      res.json({ ok: true, url: getImageUrl(filename, F) });
    } catch (err) { next(err); }
  });
}

// ── Projects (off-plan) ──────────────────────────────────────────────────────
router.get('/projects', async (req, res, next) => {
  try {
    const rows = await query<any>(`SELECT pr.*, c.name AS company_name FROM real_estate_projects pr
      LEFT JOIN real_estate_companies c ON pr.company_id=c.id WHERE pr.user_id=? ORDER BY pr.created_at DESC`, [uid(req)]);
    res.json(rows.map((p) => ({ ...p, imageUrl: getImageUrl(p.image, F) })));
  } catch (err) { next(err); }
});

router.get('/projects/:id', async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM real_estate_projects WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const images = await query<any>('SELECT id, filename FROM project_images WHERE project_id=? ORDER BY sort_order, id', [p.id]);
    res.json({ ...p, imageUrl: getImageUrl(p.image, F), images: images.map((i) => ({ id: i.id, url: getImageUrl(i.filename, F) })) });
  } catch (err) { next(err); }
});

router.post('/projects', async (req, res, next) => {
  try {
    const body = req.body as Record<string, any>;
    if (!body.name) return res.status(400).json({ error: 'Project name required' });
    const { cols, vals } = pick(body, PROJECT_FIELDS);
    const allCols = ['user_id', ...cols, 'status', 'is_active'];
    const allVals = [uid(req), ...vals, 'pending', 0];
    const r = await query<any>(`INSERT INTO real_estate_projects (${allCols.join(',')}) VALUES (${allCols.map(() => '?').join(',')})`, allVals) as any;
    res.json({ ok: true, id: r.insertId });
  } catch (err) { next(err); }
});

router.put('/projects/:id', async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM real_estate_projects WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const { cols, vals } = pick(req.body, PROJECT_FIELDS);
    const sets = [...cols.map((c) => `${c}=?`), "status='pending'", 'is_active=0'];
    await query(`UPDATE real_estate_projects SET ${sets.join(',')} WHERE id=?`, [...vals, p.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.post('/projects/:id/images', upload.array('files', 12), async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM real_estate_projects WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) return res.status(400).json({ error: 'No files' });
    const start = (await queryOne<any>('SELECT COALESCE(MAX(sort_order),-1)+1 AS n FROM project_images WHERE project_id=?', [p.id]))?.n ?? 0;
    const saved: { id: number; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const filename = await saveUpload(files[i], i);
      const r = await query<any>('INSERT INTO project_images (project_id, filename, sort_order) VALUES (?,?,?)', [p.id, filename, start + i]) as any;
      saved.push({ id: r.insertId, url: getImageUrl(filename, F) });
    }
    if (!p.image && saved.length) {
      const first = await queryOne<any>('SELECT filename FROM project_images WHERE project_id=? ORDER BY sort_order, id LIMIT 1', [p.id]);
      if (first) await query('UPDATE real_estate_projects SET image=? WHERE id=?', [first.filename, p.id]);
    }
    res.json({ ok: true, images: saved });
  } catch (err) { next(err); }
});

router.delete('/projects/:id/images/:imageId', async (req, res, next) => {
  try {
    const p = await queryOne<any>('SELECT * FROM real_estate_projects WHERE id=? AND user_id=?', [req.params.id, uid(req)]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const img = await queryOne<any>('SELECT * FROM project_images WHERE id=? AND project_id=?', [req.params.imageId, p.id]);
    if (!img) return res.status(404).json({ error: 'Image not found' });
    await query('DELETE FROM project_images WHERE id=?', [img.id]);
    if (p.image === img.filename) {
      const next = await queryOne<any>('SELECT filename FROM project_images WHERE project_id=? ORDER BY sort_order, id LIMIT 1', [p.id]);
      await query('UPDATE real_estate_projects SET image=? WHERE id=?', [next?.filename || null, p.id]);
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
