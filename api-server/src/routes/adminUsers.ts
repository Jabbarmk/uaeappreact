import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { query, queryOne } from '../db/pool';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const STAFF_SECTIONS = ['sliders','main-categories','home-categories','popular-categories','business-categories','businesses','offers','classified-categories','classified-sections','classifieds','jobs','profiles','pages','settings','users','approvals'];

// ── List users ────────────────────────────────────────────────────────────────
router.get('/', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', pageSize = '50', search } = req.query as Record<string, string>;
    const offset = (Number(page) - 1) * Number(pageSize);
    let sql = 'SELECT id, name, email, mobile, emirate, user_type, is_verified, is_active, created_at FROM users';
    const params: unknown[] = [];
    if (search) { sql += ' WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
    params.push(Number(pageSize), offset);
    const rows = await query<any>(sql, params);
    let countSql = 'SELECT COUNT(*) as total FROM users';
    const countParams: unknown[] = [];
    if (search) { countSql += ' WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?'; countParams.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const countRows = await query<any>(countSql, countParams);
    const total = countRows[0]?.total ?? 0;
    res.json({ rows, total });
  } catch (err) { next(err); }
});

// ── Search users (must be before /:id) ───────────────────────────────────────
router.get('/search', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const rows = await query<any>(
      'SELECT id, name, email, mobile FROM users WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ? ORDER BY name LIMIT 10',
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// ── Get single user ───────────────────────────────────────────────────────────
router.get('/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await queryOne<any>('SELECT id, name, email, mobile, emirate, user_type, is_verified, is_active FROM users WHERE id=?', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const perms = await queryOne<any>('SELECT permissions FROM staff_permissions WHERE user_id=?', [req.params.id]);
    res.json({ ...user, permissions: perms ? JSON.parse(perms.permissions as string) : [] });
  } catch (err) { next(err); }
});

// ── Create user ───────────────────────────────────────────────────────────────
router.post('/', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, mobile, password, emirate, user_type, is_active, permissions } = req.body as Record<string, any>;
    if (!name || !password) return res.status(400).json({ error: 'Name and password required' });
    const hash = await bcrypt.hash(password, 10);
    const result = await query<any>(
      'INSERT INTO users (name, email, mobile, password_hash, emirate, user_type, is_verified, is_active) VALUES (?,?,?,?,?,?,1,?)',
      [name, email?.toLowerCase() || null, mobile || null, hash, emirate || null, user_type || 'user', is_active !== undefined ? is_active : 1]
    ) as any;
    const newId = result.insertId;
    if (user_type === 'staff' && Array.isArray(permissions)) {
      await query('INSERT INTO staff_permissions (user_id, permissions) VALUES (?,?) ON DUPLICATE KEY UPDATE permissions=VALUES(permissions)', [newId, JSON.stringify(permissions)]);
    }
    res.json({ ok: true, id: newId });
  } catch (err) { next(err); }
});

// ── Update user ───────────────────────────────────────────────────────────────
router.put('/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, mobile, password, emirate, user_type, is_active, is_verified, permissions } = req.body as Record<string, any>;
    const user = await queryOne<any>('SELECT * FROM users WHERE id=?', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'Not found' });

    let hash = user.password_hash;
    if (password) hash = await bcrypt.hash(password, 10);

    await query('UPDATE users SET name=?,email=?,mobile=?,password_hash=?,emirate=?,user_type=?,is_active=?,is_verified=? WHERE id=?',
      [name || user.name, email?.toLowerCase() || user.email, mobile || user.mobile, hash, emirate || user.emirate, user_type || user.user_type, is_active !== undefined ? is_active : user.is_active, is_verified !== undefined ? is_verified : user.is_verified, req.params.id]);

    if (user_type === 'staff' && Array.isArray(permissions)) {
      await query('INSERT INTO staff_permissions (user_id, permissions) VALUES (?,?) ON DUPLICATE KEY UPDATE permissions=VALUES(permissions)', [req.params.id, JSON.stringify(permissions)]);
    } else if (user_type !== 'staff') {
      await query('DELETE FROM staff_permissions WHERE user_id=?', [req.params.id]);
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Delete user ───────────────────────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await query('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Staff sections list (for permission checkboxes) ───────────────────────────
router.get('/meta/sections', requireAdmin, (_req, res) => {
  res.json(STAFF_SECTIONS);
});

// ── Pending approvals ─────────────────────────────────────────────────────────
router.get('/approvals/pending', requireAdmin, async (_req, res, next) => {
  try {
    const [businesses, jobs, classifieds] = await Promise.all([
      query<any>(`SELECT b.id, b.name, b.emirate, b.created_at, u.name AS user_name, u.email AS user_email, 'business' AS type
                  FROM businesses b LEFT JOIN users u ON b.user_id=u.id WHERE b.status='pending' ORDER BY b.created_at DESC`),
      query<any>(`SELECT j.id, j.title AS name, j.location AS emirate, j.created_at, u.name AS user_name, u.email AS user_email, 'job' AS type
                  FROM jobs j LEFT JOIN users u ON j.user_id=u.id WHERE j.status='pending' ORDER BY j.created_at DESC`),
      query<any>(`SELECT c.id, c.title AS name, c.location AS emirate, c.created_at, u.name AS user_name, u.email AS user_email, 'classified' AS type
                  FROM classifieds c LEFT JOIN users u ON c.user_id=u.id WHERE c.status='pending' ORDER BY c.created_at DESC`),
    ]);
    res.json({ businesses, jobs, classifieds, total: businesses.length + jobs.length + classifieds.length });
  } catch (err) { next(err); }
});

router.post('/approvals/:type/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params;
    const { action } = req.body as { action: 'approve' | 'reject' };
    const table = type === 'business' ? 'businesses' : type === 'job' ? 'jobs' : 'classifieds';
    const status = action === 'approve' ? 'approved' : 'rejected';
    const isActive = action === 'approve' ? 1 : 0;
    await query(`UPDATE \`${table}\` SET status=?, is_active=? WHERE id=?`, [status, isActive, id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export { STAFF_SECTIONS };
export default router;
