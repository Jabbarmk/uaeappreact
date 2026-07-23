import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

// Track business view by emirate
router.post('/view/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const emirate = (req.body.emirate as string) || 'Unknown';
    await query(
      'INSERT INTO business_views (business_id, emirate, count) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1',
      [id, emirate]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

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

    const vlogger = await queryOne<any>('SELECT * FROM vlogger_profiles WHERE business_id=?', [id]).catch(() => null);
    const doctorRows = await query<any>(
      `SELECT d.*, sc.name AS specialty_name, sc.icon AS specialty_icon
       FROM doctors d LEFT JOIN business_categories sc ON sc.id=d.specialty_id
       WHERE d.business_id=? AND d.is_active=1 ORDER BY d.is_featured DESC, d.rating DESC`,
      [id]
    ).catch(() => []);
    const doctors = (doctorRows as any[]).map((d) => ({
      ...d,
      photoUrl: d.photo ? getImageUrl(d.photo, 'doctors') : null,
      hospital_name: biz.name, hospital_phone: biz.phone, hospital_whatsapp: biz.whatsapp,
      hospital_website: biz.website, hospital_emirate: biz.emirate, hospital_address: biz.address,
    }));

    res.json({
      business: { ...biz, imageUrl: getImageUrl(biz.image, 'businesses'), logoUrl: getImageUrl(biz.logo, 'businesses') },
      gallery: (gallery as any[]).map((g) => ({ ...g, src: getImageUrl(g.image, 'businesses') })),
      videos,
      reels,
      services,
      testimonials,
      clients,
      vlogger,
      doctors,
    });
  } catch (err) { next(err); }
});

export default router;
