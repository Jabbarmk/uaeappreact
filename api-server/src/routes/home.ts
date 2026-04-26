import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [sliders, mainCats, popCats, sections] = await Promise.all([
      query('SELECT * FROM sliders WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM main_categories WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM popular_categories WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM classified_sections WHERE is_active = 1 ORDER BY sort_order'),
    ]);

    const [[{ total: totalBiz }], [{ total: totalJobs }], [{ total: totalClassifieds }]] =
      await Promise.all([
        query<{ total: number }>('SELECT COUNT(*) as total FROM businesses WHERE is_active = 1'),
        query<{ total: number }>('SELECT COUNT(*) as total FROM jobs WHERE is_active = 1'),
        query<{ total: number }>('SELECT COUNT(*) as total FROM classifieds WHERE is_active = 1'),
      ]);

    // Fetch top 6 classifieds per section
    const sectionsWithItems = await Promise.all(
      (sections as any[]).map(async (section) => {
        const items = await query(
          'SELECT * FROM classifieds WHERE section_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 6',
          [section.id]
        );
        return { ...section, items };
      })
    );

    res.json({
      sliders: (sliders as any[]).map((s) => ({
        ...s,
        imageUrl: getImageUrl(s.image, 'slides'),
      })),
      mainCategories: mainCats,
      popularCategories: (popCats as any[]).map((p) => ({
        ...p,
        imageUrl: getImageUrl(p.image, 'categories'),
      })),
      sections: sectionsWithItems.filter((s) => s.items.length > 0).map((s) => ({
        ...s,
        items: (s.items as any[]).map((item) => ({
          ...item,
          imageUrl: getImageUrl(item.image, 'classifieds'),
        })),
      })),
      stats: { businesses: totalBiz, jobs: totalJobs, classifieds: totalClassifieds },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
