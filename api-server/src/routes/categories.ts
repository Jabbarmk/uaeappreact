import { Router } from 'express';
import { query } from '../db/pool';

const router = Router();

// Track category click
router.post('/track/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await query(
      'INSERT INTO category_clicks (category_id, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1',
      [id]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Top 10 most clicked categories
router.get('/top', async (_req, res, next) => {
  try {
    const rows = await query<any>(
      `SELECT bc.id, bc.name, bc.icon, COALESCE(cc.count, 0) AS clicks
       FROM business_categories bc
       LEFT JOIN category_clicks cc ON bc.id = cc.category_id
       WHERE bc.is_active = 1
       ORDER BY clicks DESC, bc.sort_order ASC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// Filter-tag row: default = top-10 clicked categories; q (2+) = categories whose name starts with q.
router.get('/tags', async (req, res, next) => {
  try {
    const q = ((req.query.q as string) || '').trim();
    if (q.length >= 2) {
      const rows = await query<any>(
        `SELECT id, name, icon, group_name FROM business_categories
         WHERE is_active = 1 AND name LIKE ? ORDER BY name ASC LIMIT 15`,
        [`${q}%`]
      );
      return res.json(rows);
    }
    const rows = await query<any>(
      `SELECT bc.id, bc.name, bc.icon, bc.group_name, COALESCE(cc.count, 0) AS clicks
       FROM business_categories bc
       LEFT JOIN category_clicks cc ON bc.id = cc.category_id
       WHERE bc.is_active = 1
       ORDER BY clicks DESC, bc.sort_order ASC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const search = (req.query.search as string) || '';
    let sql = 'SELECT * FROM business_categories WHERE is_active = 1';
    const params: string[] = [];
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY sort_order';
    const categories = await query<any>(sql, params);

    // Group by group_name
    const groups: Record<string, any[]> = {};
    for (const cat of categories) {
      const g = cat.group_name || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(cat);
    }

    res.json({ groups });
  } catch (err) {
    next(err);
  }
});

export default router;
