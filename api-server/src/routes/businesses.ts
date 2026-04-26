import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

// Search endpoint
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q as string) || '';
    const categoryId = req.query.category_id;
    let sql = 'SELECT id, name, category_id FROM businesses WHERE is_active = 1';
    const params: unknown[] = [];
    if (q) { sql += ' AND name LIKE ?'; params.push(`%${q}%`); }
    if (categoryId) { sql += ' AND category_id = ?'; params.push(categoryId); }
    sql += ' LIMIT 20';
    const results = await query(sql, params);
    res.json(results);
  } catch (err) { next(err); }
});

// Listings
router.get('/', async (req, res, next) => {
  try {
    const catId = req.query.cat;
    let sql = `SELECT b.id, b.name, b.description, b.image, b.address, b.phone, b.whatsapp,
               b.rating, b.distance, bc.name as category_name
               FROM businesses b
               LEFT JOIN business_categories bc ON b.category_id = bc.id
               WHERE b.is_active = 1`;
    const params: unknown[] = [];
    if (catId) { sql += ' AND b.category_id = ?'; params.push(catId); }
    sql += ' ORDER BY b.created_at DESC';
    const businesses = await query<any>(sql, params);

    let catName = 'All Businesses';
    if (catId) {
      const cat = await queryOne<{ name: string }>('SELECT name FROM business_categories WHERE id = ?', [catId]);
      if (cat) catName = cat.name;
    }

    res.json({
      catName,
      businesses: businesses.map((b) => ({ ...b, imageUrl: getImageUrl(b.image, 'businesses') })),
    });
  } catch (err) { next(err); }
});

// Detail
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const biz = await queryOne<any>(
      `SELECT b.*, bc.name AS category_name
       FROM businesses b
       LEFT JOIN business_categories bc ON b.category_id = bc.id
       WHERE b.id = ? AND b.is_active = 1`,
      [id]
    );
    if (!biz) return res.status(404).json({ error: 'Not found' });

    const [gallery, videos, reels, services, testimonials, clients] = await Promise.all([
      query('SELECT * FROM business_gallery WHERE business_id = ? ORDER BY sort_order', [id]),
      query('SELECT * FROM business_videos WHERE business_id = ? ORDER BY sort_order', [id]),
      query('SELECT * FROM business_reels WHERE business_id = ? ORDER BY sort_order', [id]),
      query('SELECT * FROM business_services WHERE business_id = ? ORDER BY sort_order', [id]),
      query('SELECT * FROM business_testimonials WHERE business_id = ? ORDER BY sort_order', [id]),
      query('SELECT * FROM business_clients WHERE business_id = ? ORDER BY sort_order', [id]),
    ]).catch(() => [[], [], [], [], [], []]);

    res.json({
      business: { ...biz, imageUrl: getImageUrl(biz.image, 'businesses'), logoUrl: getImageUrl(biz.logo, 'businesses') },
      gallery: (gallery as any[]).map((g) => ({ ...g, src: getImageUrl(g.image, 'businesses') })),
      videos,
      reels,
      services,
      testimonials,
      clients,
    });
  } catch (err) { next(err); }
});

export default router;
