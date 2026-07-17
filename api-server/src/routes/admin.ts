import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { query, queryOne } from '../db/pool';
import { requireAdmin } from '../middleware/auth';
import { getImageUrl } from '../services/imageUrl';
import { sendTestEmail } from '../services/mailer';

const router = Router();

const upload = multer({
  dest: path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ── File upload ───────────────────────────────────────────────────────────────

router.post('/upload/:folder', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = `${Date.now()}${ext}`;
    const destDir = path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + `/${req.params.folder}/`;
    await fs.mkdir(destDir, { recursive: true });
    await fs.rename(req.file.path, destDir + filename);
    res.json({ filename });
  } catch (err) { next(err); }
});

// ── Auth ──────────────────────────────────────────────────────────────────────

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as { username: string; password: string };
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await queryOne<any>('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    (req.session as any).adminId = user.id;
    (req.session as any).adminName = user.full_name;
    res.json({ ok: true, name: user.full_name });
  } catch (err) { next(err); }
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', requireAdmin, (req: Request, res: Response) => {
  res.json({ id: (req.session as any).adminId, name: (req.session as any).adminName });
});

// ── Settings ──────────────────────────────────────────────────────────────────

router.get('/settings', requireAdmin, async (_req, res, next) => {
  try {
    const rows = await query<any>('SELECT * FROM site_settings');
    const settings: Record<string, string> = {};
    rows.forEach((r) => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
  } catch (err) { next(err); }
});

router.put('/settings', requireAdmin, async (req, res, next) => {
  try {
    const entries = Object.entries(req.body as Record<string, string>);
    for (const [key, value] of entries) {
      await query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.post('/settings/test-email', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { to } = req.body as { to: string };
    if (!to) return res.status(400).json({ error: 'Recipient email required' });
    await sendTestEmail(to);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to send test email' });
  }
});

// ── Generic CRUD factory ──────────────────────────────────────────────────────

function crudRoutes(table: string, imageFolder?: string) {
  const r = Router();

  r.get('/', requireAdmin, async (req, res, next) => {
    try {
      const { page = '1', pageSize = '50', search } = req.query as Record<string, string>;
      const offset = (Number(page) - 1) * Number(pageSize);
      let sql = `SELECT * FROM \`${table}\``;
      const params: unknown[] = [];
      if (search) { sql += ' WHERE name LIKE ?'; params.push(`%${search}%`); }
      sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
      params.push(Number(pageSize), offset);
      const rows = await query<any>(sql, params);
      const [[{ total }]] = await Promise.all([
        query<{ total: number }>(`SELECT COUNT(*) as total FROM \`${table}\``),
      ]);
      res.json({ rows: imageFolder ? rows.map((r) => ({ ...r, imageUrl: getImageUrl(r.image, imageFolder) })) : rows, total });
    } catch (err) { next(err); }
  });

  r.post('/', requireAdmin, async (req, res, next) => {
    try {
      const fields = Object.keys(req.body);
      const values = Object.values(req.body);
      const sql = `INSERT INTO \`${table}\` (${fields.map((f) => `\`${f}\``).join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
      const result = await query<any>(sql, values) as any;
      res.json({ ok: true, id: result.insertId });
    } catch (err) { next(err); }
  });

  r.put('/:id', requireAdmin, async (req, res, next) => {
    try {
      const fields = Object.keys(req.body);
      const values = [...Object.values(req.body), Number(req.params.id)];
      const sql = `UPDATE \`${table}\` SET ${fields.map((f) => `\`${f}\` = ?`).join(',')} WHERE id = ?`;
      await query(sql, values);
      res.json({ ok: true });
    } catch (err) { next(err); }
  });

  r.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
      await query(`DELETE FROM \`${table}\` WHERE id = ?`, [Number(req.params.id)]);
      res.json({ ok: true });
    } catch (err) { next(err); }
  });

  return r;
}

// ── Business search (for slider linking) ─────────────────────────────────────

router.get('/businesses/search', requireAdmin, async (req, res, next) => {
  try {
    const q = (req.query.q as string) || '';
    if (q.length < 2) return res.json([]);
    const results = await query<any>(
      'SELECT id, name FROM businesses WHERE is_active = 1 AND name LIKE ? ORDER BY name LIMIT 10',
      [`%${q}%`]
    );
    res.json(results);
  } catch (err) { next(err); }
});

// ── Classifieds manager (full edit, images, expiry, approval) ─────────────────

const CLASSIFIED_EDIT_FIELDS = [
  'title', 'description', 'price', 'currency', 'category_id', 'section_id', 'location',
  'brand', 'model', 'color', 'condition_status',
  'storage', 'memory', 'battery_health', 'carrier_lock',
  'year', 'mileage', 'transmission', 'fuel_type',
  'furniture_type', 'material', 'dimensions',
  'status', 'is_active', 'expires_at',
];

// Dropdown metadata for the manager.
router.get('/manage-classifieds/meta', requireAdmin, async (_req, res, next) => {
  try {
    const [categories, sections] = await Promise.all([
      query<any>('SELECT id, name FROM classified_categories WHERE is_active=1 ORDER BY sort_order, name'),
      query<any>('SELECT id, name FROM classified_sections WHERE is_active=1 ORDER BY sort_order, name'),
    ]);
    res.json({ categories, sections });
  } catch (err) { next(err); }
});

// List all classifieds with owner + category, filterable by status/category/search.
router.get('/manage-classifieds', requireAdmin, async (req, res, next) => {
  try {
    const { page = '1', pageSize = '50', search, status, category } = req.query as Record<string, string>;
    const offset = (Number(page) - 1) * Number(pageSize);
    const where: string[] = [];
    const params: unknown[] = [];
    if (search)   { where.push('c.title LIKE ?'); params.push(`%${search}%`); }
    if (status)   { where.push('c.status = ?'); params.push(status); }
    if (category) { where.push('c.category_id = ?'); params.push(category); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const rows = await query<any>(
      `SELECT c.*, cc.name AS category_name, u.name AS user_name, u.email AS user_email,
              (c.expires_at IS NOT NULL AND c.expires_at <= NOW()) AS is_expired
       FROM classifieds c
       LEFT JOIN classified_categories cc ON c.category_id=cc.id
       LEFT JOIN users u ON c.user_id=u.id
       ${whereSql} ORDER BY c.id DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    const totalRow = await queryOne<any>(`SELECT COUNT(*) AS total FROM classifieds c ${whereSql}`, params);
    res.json({ rows: rows.map((r) => ({ ...r, imageUrl: getImageUrl(r.image, 'classifieds') })), total: totalRow?.total ?? 0 });
  } catch (err) { next(err); }
});

// Single classified with its image gallery.
router.get('/manage-classifieds/:id', requireAdmin, async (req, res, next) => {
  try {
    const c = await queryOne<any>('SELECT * FROM classifieds WHERE id=?', [req.params.id]);
    if (!c) return res.status(404).json({ error: 'Not found' });
    const images = await query<any>('SELECT id, filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id', [c.id]);
    res.json({ ...c, imageUrl: getImageUrl(c.image, 'classifieds'), images: images.map((i) => ({ id: i.id, url: getImageUrl(i.filename, 'classifieds') })) });
  } catch (err) { next(err); }
});

// Update any editable field (incl. status, is_active, expiry).
router.put('/manage-classifieds/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body as Record<string, any>;
    const fields = CLASSIFIED_EDIT_FIELDS.filter((f) => f in body);
    if (!fields.length) return res.json({ ok: true });
    const sets = fields.map((f) => `\`${f}\` = ?`).join(',');
    const values = fields.map((f) => {
      const v = body[f];
      if (f === 'expires_at') return v ? String(v).replace('T', ' ') : null;
      if (v === '' || v === undefined) return null;
      return v;
    });
    await query(`UPDATE classifieds SET ${sets} WHERE id=?`, [...values, Number(req.params.id)]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/manage-classifieds/:id', requireAdmin, async (req, res, next) => {
  try {
    await query('DELETE FROM classifieds WHERE id=?', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Upload gallery images for a classified.
router.post('/manage-classifieds/:id/images', requireAdmin, upload.array('files', 10), async (req, res, next) => {
  try {
    const c = await queryOne<any>('SELECT * FROM classifieds WHERE id=?', [req.params.id]);
    if (!c) return res.status(404).json({ error: 'Not found' });
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) return res.status(400).json({ error: 'No files' });
    const destDir = path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/classifieds/';
    await fs.mkdir(destDir, { recursive: true });
    const startOrder = (await queryOne<any>('SELECT COALESCE(MAX(sort_order),-1)+1 AS n FROM classified_images WHERE classified_id=?', [c.id]))?.n ?? 0;
    const saved: { id: number; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = path.extname(f.originalname).toLowerCase() || '.jpg';
      const filename = `${Date.now()}-${i}${ext}`;
      await fs.rename(f.path, destDir + filename);
      const r = await query<any>('INSERT INTO classified_images (classified_id, filename, sort_order) VALUES (?,?,?)', [c.id, filename, startOrder + i]) as any;
      saved.push({ id: r.insertId, url: getImageUrl(filename, 'classifieds') });
    }
    if (!c.image && saved.length) {
      const first = await queryOne<any>('SELECT filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id LIMIT 1', [c.id]);
      if (first) await query('UPDATE classifieds SET image=? WHERE id=?', [first.filename, c.id]);
    }
    res.json({ ok: true, images: saved });
  } catch (err) { next(err); }
});

router.delete('/manage-classifieds/:id/images/:imageId', requireAdmin, async (req, res, next) => {
  try {
    const img = await queryOne<any>('SELECT * FROM classified_images WHERE id=? AND classified_id=?', [req.params.imageId, req.params.id]);
    if (!img) return res.status(404).json({ error: 'Not found' });
    await query('DELETE FROM classified_images WHERE id=?', [img.id]);
    const c = await queryOne<any>('SELECT image FROM classifieds WHERE id=?', [req.params.id]);
    if (c && c.image === img.filename) {
      const next = await queryOne<any>('SELECT filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id LIMIT 1', [req.params.id]);
      await query('UPDATE classifieds SET image=? WHERE id=?', [next?.filename || null, req.params.id]);
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Resource routes ──────────────────────────────────────────────────────────

router.use('/sliders', crudRoutes('sliders', 'slides'));
router.use('/main-categories', crudRoutes('main_categories'));
router.use('/home-categories', crudRoutes('home_categories'));
router.use('/popular-categories', crudRoutes('popular_categories', 'categories'));
router.use('/business-categories', crudRoutes('business_categories'));
router.use('/businesses', crudRoutes('businesses', 'businesses'));
router.use('/offers', crudRoutes('offers', 'offers'));
router.use('/classified-categories', crudRoutes('classified_categories'));
router.use('/classified-sections', crudRoutes('classified_sections'));
router.use('/classifieds', crudRoutes('classifieds', 'classifieds'));
router.use('/property-categories', crudRoutes('property_categories'));
router.use('/real-estate-companies', crudRoutes('real_estate_companies', 'realestate'));
router.use('/properties', crudRoutes('properties', 'realestate'));
router.use('/real-estate-projects', crudRoutes('real_estate_projects', 'realestate'));
router.use('/event-categories', crudRoutes('event_categories'));
router.use('/events', crudRoutes('events', 'events'));
router.use('/jobs', crudRoutes('jobs'));
router.use('/profiles', crudRoutes('user_profiles', 'profiles'));
router.use('/pages', crudRoutes('pages'));
router.use('/work-experience', crudRoutes('user_work_experience'));

export default router;
