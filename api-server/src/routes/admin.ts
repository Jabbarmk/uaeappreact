import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { query, queryOne } from '../db/pool';
import { requireAdmin } from '../middleware/auth';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

const upload = multer({
  dest: path.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
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
      const [result] = await query<any>(sql, values) as any;
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

// ── Resource routes ──────────────────────────────────────────────────────────

router.use('/sliders', crudRoutes('sliders', 'slides'));
router.use('/main-categories', crudRoutes('main_categories'));
router.use('/popular-categories', crudRoutes('popular_categories', 'categories'));
router.use('/business-categories', crudRoutes('business_categories'));
router.use('/businesses', crudRoutes('businesses', 'businesses'));
router.use('/offers', crudRoutes('offers', 'offers'));
router.use('/classified-categories', crudRoutes('classified_categories'));
router.use('/classified-sections', crudRoutes('classified_sections'));
router.use('/classifieds', crudRoutes('classifieds', 'classifieds'));
router.use('/jobs', crudRoutes('jobs'));
router.use('/profiles', crudRoutes('user_profiles', 'profiles'));
router.use('/pages', crudRoutes('pages'));

export default router;
