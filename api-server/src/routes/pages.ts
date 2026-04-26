import { Router } from 'express';
import { queryOne } from '../db/pool';

const router = Router();

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await queryOne<any>(
      'SELECT * FROM pages WHERE slug = ? AND is_active = 1',
      [req.params.slug]
    );
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ page });
  } catch (err) { next(err); }
});

export default router;
