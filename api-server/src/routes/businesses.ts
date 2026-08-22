import { Router } from 'express';
import { requireUser } from '../middleware/userAuth';
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
    if (q) { sql += ' AND (b.name LIKE ? OR b.keywords LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
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
    let sql = `SELECT b.id, b.name, b.tagline, b.description, b.image, b.address, b.phone, b.whatsapp,
               b.rating, b.distance, b.emirate, b.featured, b.sort_order, b.latitude, b.longitude,
               b.is_verified, b.color, b.keywords,
               bc.name as category_name
               FROM businesses b
               LEFT JOIN business_categories bc ON b.category_id = bc.id
               WHERE b.is_active = 1`;
    const params: unknown[] = [];
    if (catId) { sql += ' AND b.category_id = ?'; params.push(catId); }
    sql += ' ORDER BY b.featured DESC, b.sort_order ASC, b.rating DESC, b.created_at DESC';
    const businesses = await query<any>(sql, params);

    let catName = 'All Businesses';
    let banners: any[] = [];
    if (catId) {
      const cat = await queryOne<{ name: string }>('SELECT name FROM business_categories WHERE id = ?', [catId]);
      if (cat) catName = cat.name;
      // Admin-managed top banners for this category — multiple rows auto-slide.
      const rows = await query<any>(
        'SELECT image, video, title, subtitle, link, business_id FROM category_banners WHERE category_id = ? AND is_active = 1 ORDER BY sort_order, id',
        [catId]
      ).catch(() => []);
      banners = (rows as any[]).filter((b) => b.image || b.video).map((b) => ({
        ...b,
        imageUrl: b.image ? getImageUrl(b.image, 'banners') : null,
        videoUrl: b.video ? getImageUrl(b.video, 'banners') : null,
      }));
    }
    const banner = banners[0] || null;

    // Admin-controlled listing image heights (px) from site_settings.
    const hRows = await query<any>(
      "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('biz_featured_img_height', 'biz_row_img_height')"
    ).catch(() => []);
    const hMap: Record<string, string> = {};
    hRows.forEach((r: any) => { hMap[r.setting_key] = r.setting_value; });

    res.json({
      catName,
      banner,
      banners,
      imgHeights: {
        featured: Number(hMap.biz_featured_img_height) || null,
        row: Number(hMap.biz_row_img_height) || null,
      },
      businesses: businesses.map((b) => ({ ...b, imageUrl: getImageUrl(b.image, 'businesses') })),
    });
  } catch (err) { next(err); }
});

// Detail
// Public product detail (active only; internal fields stripped).
router.get('/:id/products/:pid', async (req, res, next) => {
  try {
    const biz = await queryOne<any>(
      'SELECT id, name, whatsapp, phone, is_online_store, store_url, color FROM businesses WHERE id = ? AND is_active = 1',
      [req.params.id]);
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    const p = await queryOne<any>(
      "SELECT * FROM business_products WHERE id = ? AND business_id = ? AND (status='active' OR status IS NULL)",
      [req.params.pid, req.params.id]);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    const { cost_price, created_by, ...pub } = p;
    res.json({
      business: biz,
      product: { ...pub, imageUrl: pub.image ? getImageUrl(pub.image, 'businesses') : null },
    });
  } catch (err) { next(err); }
});

// ── User reviews (one per user per business; pending until approved) ──────────

router.post('/:id/reviews', requireUser, async (req, res, next) => {
  try {
    const uid = (req.session as any).userId as number;
    const bizId = Number(req.params.id);
    const rating = Math.min(5, Math.max(1, Number((req.body as any).rating) || 5));
    const text = String((req.body as any).review || '').trim().slice(0, 2000);
    if (!text) return res.status(400).json({ error: 'Review text is required' });
    const user = await queryOne<any>('SELECT name FROM users WHERE id=?', [uid]);
    await query(
      `INSERT INTO business_testimonials (business_id, user_id, client_name, rating, review, status, sort_order)
       VALUES (?,?,?,?,?,'pending',999)
       ON DUPLICATE KEY UPDATE rating=VALUES(rating), review=VALUES(review), status='pending', client_name=VALUES(client_name)`,
      [bizId, uid, user?.name || 'Customer', rating, text]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/:id/reviews', requireUser, async (req, res, next) => {
  try {
    const uid = (req.session as any).userId as number;
    await query('DELETE FROM business_testimonials WHERE business_id=? AND user_id=?', [Number(req.params.id), uid]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const viewerId = Number((req.session as any)?.userId) || 0;
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
      // Public sees approved reviews; the signed-in reviewer also sees their own pending/rejected one.
      query(`SELECT id, client_name, client_photo, client_company, rating, review, status, created_at,
                    (user_id IS NOT NULL AND user_id = ?) AS is_own
             FROM business_testimonials
             WHERE business_id = ? AND (status = 'approved' OR (user_id IS NOT NULL AND user_id = ?))
             ORDER BY sort_order, id DESC`, [viewerId, id, viewerId]),
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

    // Template-2 storefront products (public = active only; featured first; cost price stays internal).
    const productRows = await query<any>(
      "SELECT * FROM business_products WHERE business_id=? AND (status='active' OR status IS NULL) ORDER BY featured DESC, sort_order, id", [id]
    ).catch(() => []);
    const products = (productRows as any[]).map(({ cost_price, created_by, ...p }) => ({ ...p, imageUrl: getImageUrl(p.image, 'businesses') }));

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
      productCategories: (await query<any>(
        'SELECT * FROM business_product_categories WHERE business_id=? ORDER BY sort_order, name', [id]
      ).catch(() => [])).map((c: any) => ({ ...c, imageUrl: getImageUrl(c.image, 'businesses') })),
      productSubcategories: await query<any>(
        'SELECT category, name FROM business_product_subcategories WHERE business_id=? ORDER BY sort_order, name', [id]
      ).catch(() => []),
      clients: (clients as any[]).map((c) => ({ ...c, logoUrl: getImageUrl(c.logo, 'businesses') })),
      clientLogoSize: Number((await queryOne<any>(
        "SELECT setting_value FROM site_settings WHERE setting_key = 'biz_client_logo_size'"
      ).catch(() => null))?.setting_value) || null,
      vlogger,
      doctors,
    });
  } catch (err) { next(err); }
});

export default router;
