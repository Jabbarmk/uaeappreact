import { Router } from 'express';
import { query } from '../db/pool';

const router = Router();

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
