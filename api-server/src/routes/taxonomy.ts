import { Router } from 'express';
import { query } from '../db/pool';

const router = Router();

// GET /api/skills?search=re  → up to 50 matching skills, most-used first
router.get('/skills', async (req, res, next) => {
  try {
    const search = (req.query.search as string) || '';
    const params: unknown[] = [];
    let sql = 'SELECT id, name FROM skills';
    if (search) { sql += ' WHERE name LIKE ?'; params.push(`%${search}%`); }
    sql += ' ORDER BY usage_count DESC, name ASC LIMIT 50';
    res.json(await query(sql, params));
  } catch (err) { next(err); }
});

// GET /api/languages?search=ar
router.get('/languages', async (req, res, next) => {
  try {
    const search = (req.query.search as string) || '';
    const params: unknown[] = [];
    let sql = 'SELECT id, name FROM languages';
    if (search) { sql += ' WHERE name LIKE ?'; params.push(`%${search}%`); }
    sql += ' ORDER BY usage_count DESC, name ASC LIMIT 50';
    res.json(await query(sql, params));
  } catch (err) { next(err); }
});

export default router;
