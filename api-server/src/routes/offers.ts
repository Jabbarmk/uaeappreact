import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

const UAE_EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

router.get('/', async (req, res, next) => {
  try {
    const { loc = 'Dubai', cat } = req.query as Record<string, string>;

    const dbEmirates = await query<{ emirate: string }>(
      'SELECT DISTINCT emirate FROM offers WHERE is_active=1 AND emirate IS NOT NULL AND emirate <> "" ORDER BY emirate'
    );
    const emirates = [...new Set([...UAE_EMIRATES, ...dbEmirates.map((e) => e.emirate)])];

    const categories = await query(
      `SELECT DISTINCT bc.id, bc.name, bc.icon FROM offers o
       JOIN business_categories bc ON o.category_id = bc.id WHERE o.is_active=1
       ORDER BY bc.sort_order, bc.name`
    );

    const where = ['o.is_active = 1', 'o.emirate = ?'];
    const params: unknown[] = [loc];
    if (cat) { where.push('o.category_id = ?'); params.push(cat); }

    const offers = await query<any>(
      `SELECT o.*, b.name AS business_name, b.logo AS business_logo, b.image AS business_image,
              b.address AS business_address, b.phone AS business_phone, b.whatsapp AS business_whatsapp,
              bc.name AS category_name
       FROM offers o
       JOIN businesses b ON o.business_id = b.id
       LEFT JOIN business_categories bc ON o.category_id = bc.id
       WHERE ${where.join(' AND ')}
       ORDER BY o.ranking DESC, o.created_at DESC`,
      params
    );

    res.json({
      emirates,
      selectedLoc: loc,
      selectedCat: cat || '',
      categories,
      offers: offers.map((o) => ({
        ...o,
        imageUrl: getImageUrl(o.image, 'offers'),
        logoUrl: getImageUrl(o.business_logo || o.business_image, 'businesses'),
      })),
    });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const offer = await queryOne<any>(
      `SELECT o.*, b.name AS business_name, b.logo AS business_logo, b.image AS business_image,
              b.address AS business_address, b.phone AS business_phone, b.whatsapp AS business_whatsapp,
              b.emirate AS business_emirate, bc.name AS category_name
       FROM offers o
       JOIN businesses b ON o.business_id = b.id
       LEFT JOIN business_categories bc ON o.category_id = bc.id
       WHERE o.id = ? AND o.is_active = 1`,
      [Number(req.params.id)]
    );
    if (!offer) return res.status(404).json({ error: 'Not found' });

    const reviews = await query<any>(
      'SELECT * FROM offer_reviews WHERE offer_id = ? ORDER BY created_at DESC',
      [Number(req.params.id)]
    );
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + Number(r.rating), 0) / reviews.length
        : Number(offer.rating);

    res.json({
      offer: {
        ...offer,
        imageUrl: getImageUrl(offer.image, 'offers'),
        logoUrl: getImageUrl(offer.business_logo || offer.business_image, 'businesses'),
      },
      reviews,
      avgRating,
    });
  } catch (err) { next(err); }
});

export default router;
