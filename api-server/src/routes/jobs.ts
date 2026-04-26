import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const search = (req.query.search as string) || '';
    let sql = 'SELECT * FROM jobs WHERE is_active = 1';
    const params: unknown[] = [];
    if (search) {
      sql += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY is_featured DESC, posted_at DESC';
    const jobs = await query(sql, params);

    const profile = await queryOne<any>('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');

    res.json({
      jobs,
      profile: profile ? { ...profile, photoUrl: getImageUrl(profile.photo, 'profiles') } : null,
    });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await queryOne<any>('SELECT * FROM jobs WHERE id = ?', [Number(req.params.id)]);
    if (!job) return res.status(404).json({ error: 'Not found' });
    const profile = await queryOne<any>('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');
    res.json({
      job,
      profile: profile ? { ...profile, photoUrl: getImageUrl(profile.photo, 'profiles') } : null,
    });
  } catch (err) { next(err); }
});

export default router;
