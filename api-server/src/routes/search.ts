import { Router } from 'express';
import { query } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

// Track a searched keyword
router.post('/track', async (req, res, next) => {
  try {
    const { keyword } = req.body as { keyword: string };
    if (!keyword?.trim()) return res.json({ ok: true });
    const kw = keyword.trim().toLowerCase();
    await query(
      'INSERT INTO search_keywords (keyword, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1',
      [kw]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Top searched keywords
router.get('/top-keywords', async (_req, res, next) => {
  try {
    const rows = await query<any>('SELECT keyword, count FROM search_keywords ORDER BY count DESC LIMIT 10');
    res.json(rows);
  } catch (err) { next(err); }
});

// Unified search
router.get('/', async (req, res, next) => {
  try {
    const q = ((req.query.q as string) || '').trim();
    const tab = (req.query.tab as string) || 'keyword';
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    if (!q) return res.json({ results: [], total: 0, tab });

    let results: any[] = [];
    let total = 0;

    if (tab === 'business' || tab === 'keyword') {
      const bizRows = await query<any>(
        `SELECT b.id, b.name, b.emirate, b.phone, bc.name AS category_name, b.image, 'business' AS type
         FROM businesses b
         LEFT JOIN business_categories bc ON b.category_id = bc.id
         WHERE b.is_active = 1 AND (b.name LIKE ? OR b.description LIKE ? OR b.tagline LIKE ?)
         ORDER BY b.name LIMIT ? OFFSET ?`,
        [`%${q}%`, `%${q}%`, `%${q}%`, pageSize, offset]
      );
      const [[{ total: bizTotal }]] = await query<any>(
        'SELECT COUNT(*) as total FROM businesses WHERE is_active = 1 AND (name LIKE ? OR description LIKE ? OR tagline LIKE ?)',
        [`%${q}%`, `%${q}%`, `%${q}%`]
      ) as any;
      results = [...results, ...bizRows.map((r: any) => ({ ...r, imageUrl: getImageUrl(r.image, 'businesses') }))];
      total += Number(bizTotal);
    }

    if (tab === 'jobs' || tab === 'keyword') {
      const jobRows = await query<any>(
        `SELECT id, title AS name, company, location AS emirate, job_type AS category_name, NULL AS image, 'job' AS type
         FROM jobs WHERE is_active = 1 AND (title LIKE ? OR company LIKE ? OR description LIKE ?)
         ORDER BY posted_at DESC LIMIT ? OFFSET ?`,
        [`%${q}%`, `%${q}%`, `%${q}%`, pageSize, offset]
      );
      const [[{ total: jobTotal }]] = await query<any>(
        'SELECT COUNT(*) as total FROM jobs WHERE is_active = 1 AND (title LIKE ? OR company LIKE ? OR description LIKE ?)',
        [`%${q}%`, `%${q}%`, `%${q}%`]
      ) as any;
      results = [...results, ...jobRows];
      total += Number(jobTotal);
    }

    if (tab === 'products' || tab === 'keyword') {
      const prodRows = await query<any>(
        `SELECT c.id, c.title AS name, c.location AS emirate, cc.name AS category_name, c.image, c.price, 'classified' AS type
         FROM classifieds c
         LEFT JOIN classified_categories cc ON c.category_id = cc.id
         LEFT JOIN classified_sections cs ON c.section_id = cs.id
         WHERE c.is_active = 1
           AND (cs.name NOT LIKE '%real estate%' OR cs.name IS NULL)
           AND (c.title LIKE ? OR c.description LIKE ?)
         ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
        [`%${q}%`, `%${q}%`, pageSize, offset]
      );
      results = [...results, ...prodRows.map((r: any) => ({ ...r, imageUrl: getImageUrl(r.image, 'classifieds') }))];
      total += prodRows.length;
    }

    if (tab === 'realestate') {
      const reRows = await query<any>(
        `SELECT c.id, c.title AS name, c.location AS emirate, cc.name AS category_name, c.image, c.price, 'classified' AS type
         FROM classifieds c
         LEFT JOIN classified_categories cc ON c.category_id = cc.id
         LEFT JOIN classified_sections cs ON c.section_id = cs.id
         WHERE c.is_active = 1
           AND cs.name LIKE '%real estate%'
           AND (c.title LIKE ? OR c.description LIKE ?)
         ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
        [`%${q}%`, `%${q}%`, pageSize, offset]
      );
      results = [...results, ...reRows.map((r: any) => ({ ...r, imageUrl: getImageUrl(r.image, 'classifieds') }))];
      total += reRows.length;
    }

    res.json({ results, total, tab, page, pageSize });
  } catch (err) { next(err); }
});

export default router;
