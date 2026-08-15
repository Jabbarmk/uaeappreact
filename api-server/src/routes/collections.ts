import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

// Public "best in UAE" collections: list + detail with items.
const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const rows = await query<any>(`
      SELECT c.id, c.title,
             (SELECT COUNT(*) FROM home_collection_items i WHERE i.collection_id = c.id AND i.is_active = 1) AS item_count,
             (SELECT i.image FROM home_collection_items i WHERE i.collection_id = c.id AND i.is_active = 1 ORDER BY i.sort_order LIMIT 1) AS thumb
      FROM home_collections c
      WHERE c.is_active = 1
      ORDER BY c.sort_order`);
    res.json(rows.filter((r) => r.item_count > 0).map((r) => ({
      id: r.id,
      title: r.title,
      itemCount: Number(r.item_count),
      thumbUrl: r.thumb ? getImageUrl(r.thumb, 'collections') : null,
    })));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const col = await queryOne<any>('SELECT id, title FROM home_collections WHERE id = ? AND is_active = 1', [req.params.id]);
    if (!col) return res.status(404).json({ error: 'Collection not found' });
    // Linked businesses supply emirate/coordinates unless the item has its own.
    const items = await query<any>(`
      SELECT i.id, i.title, i.description, i.business_id, b.name AS business_name, i.image,
             COALESCE(NULLIF(i.emirate, ''), b.emirate) AS emirate,
             COALESCE(i.latitude, b.latitude) AS latitude,
             COALESCE(i.longitude, b.longitude) AS longitude
      FROM home_collection_items i
      LEFT JOIN businesses b ON b.id = i.business_id
      WHERE i.collection_id = ? AND i.is_active = 1
      ORDER BY i.sort_order`, [req.params.id]);
    res.json({
      id: col.id,
      title: col.title,
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        business_id: i.business_id,
        business_name: i.business_name,
        emirate: i.emirate || null,
        latitude: i.latitude != null ? Number(i.latitude) : null,
        longitude: i.longitude != null ? Number(i.longitude) : null,
        imageUrl: i.image ? getImageUrl(i.image, 'collections') : null,
      })),
    });
  } catch (err) { next(err); }
});

export default router;
