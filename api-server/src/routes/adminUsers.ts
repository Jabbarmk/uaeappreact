import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { query, queryOne } from '../db/pool';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const STAFF_SECTIONS = ['sliders','main-categories','home-categories','popular-categories','business-categories','businesses','offers','classified-categories','classified-sections','classifieds','property-categories','real-estate-companies','properties','real-estate-projects','event-categories','events','jobs','profiles','pages','settings','users','approvals'];

// Approval type → table + display-title column mapping.
const APPROVAL_TABLES: Record<string, { table: string; titleCol: string }> = {
  business: { table: 'businesses', titleCol: 'name' },
  job: { table: 'jobs', titleCol: 'title' },
  classified: { table: 'classifieds', titleCol: 'title' },
  property: { table: 'properties', titleCol: 'title' },
  company: { table: 'real_estate_companies', titleCol: 'name' },
  project: { table: 'real_estate_projects', titleCol: 'name' },
  event: { table: 'events', titleCol: 'title' },
};

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
    const [businesses, jobs, classifieds, properties, companies, projects, events] = await Promise.all([
      query<any>(`SELECT b.id, b.name, b.emirate, b.created_at, b.category_id, b.requested_category_name,
                         bc.name AS category_name, u.name AS user_name, u.email AS user_email, 'business' AS type
                  FROM businesses b
                  LEFT JOIN users u ON b.user_id=u.id
                  LEFT JOIN business_categories bc ON b.category_id=bc.id
                  WHERE b.status='pending' ORDER BY b.created_at DESC`),
      query<any>(`SELECT j.id, j.title AS name, j.location AS emirate, j.posted_at AS created_at, u.name AS user_name, u.email AS user_email, 'job' AS type
                  FROM jobs j LEFT JOIN users u ON j.user_id=u.id WHERE j.status='pending' ORDER BY j.posted_at DESC`),
      query<any>(`SELECT c.id, c.title AS name, c.location AS emirate, c.created_at, u.name AS user_name, u.email AS user_email, 'classified' AS type
                  FROM classifieds c LEFT JOIN users u ON c.user_id=u.id WHERE c.status='pending' ORDER BY c.created_at DESC`),
      query<any>(`SELECT p.id, p.title AS name, p.emirate, p.created_at, pc.name AS category_name, u.name AS user_name, u.email AS user_email, 'property' AS type
                  FROM properties p LEFT JOIN users u ON p.user_id=u.id LEFT JOIN property_categories pc ON p.category_id=pc.id
                  WHERE p.status='pending' ORDER BY p.created_at DESC`),
      query<any>(`SELECT rc.id, rc.name, rc.emirate, rc.created_at, u.name AS user_name, u.email AS user_email, 'company' AS type
                  FROM real_estate_companies rc LEFT JOIN users u ON rc.user_id=u.id WHERE rc.status='pending' ORDER BY rc.created_at DESC`),
      query<any>(`SELECT pr.id, pr.name, pr.emirate, pr.created_at, u.name AS user_name, u.email AS user_email, 'project' AS type
                  FROM real_estate_projects pr LEFT JOIN users u ON pr.user_id=u.id WHERE pr.status='pending' ORDER BY pr.created_at DESC`),
      query<any>(`SELECT e.id, e.title AS name, e.emirate, e.created_at, ec.name AS category_name, u.name AS user_name, u.email AS user_email, 'event' AS type
                  FROM events e LEFT JOIN users u ON e.user_id=u.id LEFT JOIN event_categories ec ON e.category_id=ec.id
                  WHERE e.status='pending' ORDER BY e.created_at DESC`),
    ]);
    res.json({
      businesses, jobs, classifieds, properties, companies, projects, events,
      total: businesses.length + jobs.length + classifieds.length + properties.length + companies.length + projects.length + events.length,
    });
  } catch (err) { next(err); }
});

// All categories for the approval resolution dropdown.
router.get('/approvals/meta/categories', requireAdmin, async (_req, res, next) => {
  try {
    const rows = await query<any>('SELECT id, name, group_name FROM business_categories WHERE is_active=1 ORDER BY group_name, name');
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/approvals/:type/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params;
    const { action, category_id, new_category_name } = req.body as { action: 'approve' | 'reject'; category_id?: number | string; new_category_name?: string };
    const mapping = APPROVAL_TABLES[type];
    if (!mapping) return res.status(400).json({ error: 'Unknown approval type' });
    const table = mapping.table;
    const status = action === 'approve' ? 'approved' : 'rejected';
    const isActive = action === 'approve' ? 1 : 0;

    // For a business being approved, optionally resolve its category request:
    // create a brand-new category, or assign an existing one, then clear the request.
    if (type === 'business' && action === 'approve') {
      let resolvedId: number | null = null;
      const newName = (new_category_name || '').trim();
      if (newName) {
        const existing = await queryOne<any>('SELECT id FROM business_categories WHERE name=? LIMIT 1', [newName]);
        if (existing) resolvedId = existing.id;
        else {
          const r = await query<any>('INSERT INTO business_categories (name, group_name, sort_order, is_active) VALUES (?, ?, 0, 1)', [newName.slice(0, 100), 'General']) as any;
          resolvedId = r.insertId;
        }
      } else if (category_id) {
        resolvedId = Number(category_id);
      }
      if (resolvedId) {
        await query('UPDATE businesses SET category_id=?, requested_category_name=NULL WHERE id=?', [resolvedId, id]);
      }
    }

    await query(`UPDATE \`${table}\` SET status=?, is_active=? WHERE id=?`, [status, isActive, id]);

    // On approving a classified, default its expiry to 30 days out if unset.
    // Admins can adjust the date later from the Classifieds manager.
    if (table === 'classifieds' && action === 'approve') {
      await query('UPDATE classifieds SET expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id=? AND expires_at IS NULL', [id]);
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
});

export { STAFF_SECTIONS };
export default router;
