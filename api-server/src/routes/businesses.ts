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

// Search endpoint — businesses by name (used by the categories-page live search)
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q as string) || '';
    const categoryId = req.query.category_id;
    let sql = `SELECT b.id, b.name, b.category_id, b.image, b.rating, b.emirate, bc.name AS category_name
               FROM businesses b LEFT JOIN business_categories bc ON bc.id = b.category_id
               WHERE b.is_active = 1`;
    const params: unknown[] = [];
    if (q) { sql += ' AND b.name LIKE ?'; params.push(`%${q}%`); }
    if (categoryId) { sql += ' AND b.category_id = ?'; params.push(categoryId); }
    sql += ' ORDER BY b.rating DESC, b.name ASC LIMIT 30';
    const results = await query<any>(sql, params);
    res.json(results.map((b) => ({ ...b, imageUrl: getImageUrl(b.image, 'businesses') })));
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

    // Group service items into named sections (+ a default section for legacy ungrouped items).
    const svcSectionRows = await query<any>('SELECT id, title FROM business_service_sections WHERE business_id=? ORDER BY sort_order, id', [id]).catch(() => []);
    const svcItems = (services as any[]).map((s) => ({ ...s, imageUrl: getImageUrl(s.image, 'businesses') }));
    const serviceSections = (svcSectionRows as any[]).map((sec) => ({
      id: sec.id, title: sec.title, items: svcItems.filter((it) => it.section_id === sec.id),
    })).filter((sec) => sec.items.length > 0);
    const ungrouped = svcItems.filter((it) => !it.section_id);
    if (ungrouped.length) serviceSections.unshift({ id: 0, title: 'Services & Solutions', items: ungrouped });

    // Dedicated cover media (multiple images + video), independent of the gallery.
    const coverRows = await query<any>('SELECT type, file FROM business_cover_media WHERE business_id=? ORDER BY sort_order, id', [id]).catch(() => []);
    const coverMedia = (coverRows as any[]).map((m) => ({ type: m.type, src: getImageUrl(m.file, 'cover') }));

    // Template-2 storefront products.
    const productRows = await query<any>('SELECT * FROM business_products WHERE business_id=? ORDER BY sort_order, id', [id]).catch(() => []);
    const products = (productRows as any[]).map((p) => ({ ...p, imageUrl: getImageUrl(p.image, 'businesses') }));

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
      serviceSections,
      coverMedia,
      products,
      testimonials,
      clients,
      vlogger,
      doctors,
    });
  } catch (err) { next(err); }
});

export default router;
