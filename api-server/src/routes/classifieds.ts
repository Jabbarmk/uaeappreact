import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

// Hub page data
router.get('/', async (_req, res, next) => {
  try {
    const [categories, sections] = await Promise.all([
      query('SELECT * FROM classified_categories WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM classified_sections WHERE is_active = 1 ORDER BY sort_order'),
    ]);

    const sectionsWithItems = await Promise.all(
      (sections as any[]).map(async (s) => {
        const items = await query(
          'SELECT * FROM classifieds WHERE section_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 6',
          [s.id]
        );
        return {
          ...s,
          items: (items as any[]).map((i) => ({ ...i, imageUrl: getImageUrl(i.image, 'classifieds') })),
        };
      })
    );

    res.json({ categories, sections: sectionsWithItems.filter((s) => s.items.length > 0) });
  } catch (err) { next(err); }
});

// Listing with filters
router.get('/list', async (req, res, next) => {
  try {
    const { category, section, search, page = '1', pageSize = '25' } = req.query as Record<string, string>;
    const where: string[] = ['c.is_active = 1'];
    const params: unknown[] = [];
    if (category) { where.push('c.category_id = ?'); params.push(category); }
    if (section)  { where.push('c.section_id = ?');  params.push(section); }
    if (search)   { where.push('(c.title LIKE ? OR c.description LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const offset = (Number(page) - 1) * Number(pageSize);
    const [[{ total }]] = await Promise.all([
      query<{ total: number }>(
        `SELECT COUNT(*) as total FROM classifieds c WHERE ${where.join(' AND ')}`,
        params
      ),
    ]);

    const items = await query<any>(
      `SELECT c.*, cc.name as category_name FROM classifieds c
       LEFT JOIN classified_categories cc ON c.category_id = cc.id
       WHERE ${where.join(' AND ')} ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );

    let catName = 'Classifieds';
    if (category) {
      const cat = await queryOne<{ name: string }>('SELECT name FROM classified_categories WHERE id = ?', [category]);
      if (cat) catName = cat.name;
    }

    res.json({
      catName,
      items: items.map((i) => ({ ...i, imageUrl: getImageUrl(i.image, 'classifieds') })),
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (err) { next(err); }
});

// Detail
router.get('/:id', async (req, res, next) => {
  try {
    const item = await queryOne<any>(
      `SELECT c.*, cc.name as category_name FROM classifieds c
       LEFT JOIN classified_categories cc ON c.category_id = cc.id
       WHERE c.id = ?`,
      [Number(req.params.id)]
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ item: { ...item, imageUrl: getImageUrl(item.image, 'classifieds') } });
  } catch (err) { next(err); }
});

export default router;
