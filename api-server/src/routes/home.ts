import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

function safeParse(s: unknown) {
  try { return JSON.parse(String(s || '{}')); } catch { return {}; }
}

router.get('/', async (_req, res, next) => {
  try {
    const [sliders, mainCats, popCats, homeCats, sections, layoutRows, menuRows, collectionRows, collectionItems] = await Promise.all([
      query('SELECT * FROM sliders WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM main_categories WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM popular_categories WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM home_categories WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT * FROM classified_sections WHERE is_active = 1 ORDER BY sort_order'),
      query<any>('SELECT * FROM home_sections ORDER BY sort_order').catch(() => []),
      query<any>('SELECT * FROM home_menu_items WHERE is_active = 1 ORDER BY sort_order').catch(() => []),
      query<any>('SELECT * FROM home_collections WHERE is_active = 1 ORDER BY sort_order').catch(() => []),
      query<any>(`SELECT i.*, b.name AS business_name FROM home_collection_items i
                  LEFT JOIN businesses b ON b.id = i.business_id
                  WHERE i.is_active = 1 ORDER BY i.sort_order`).catch(() => []),
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

    // Admin-controlled home slider height (px) from site_settings.
    const sliderHeightRow = await queryOne<any>(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'home_slider_height'"
    ).catch(() => null);

    res.json({
      layout: (layoutRows as any[]).map((s) => ({
        key: s.section_key,
        title: s.title,
        visible: !!s.is_visible,
        order: s.sort_order,
        settings: safeParse(s.settings),
      })),
      menu: (menuRows as any[]).map((m) => ({
        ...m,
        imageUrl: m.image ? getImageUrl(m.image, 'home_menu') : null,
      })),
      collections: (collectionRows as any[]).map((c) => ({
        id: c.id,
        title: c.title,
        items: (collectionItems as any[]).filter((i) => i.collection_id === c.id).map((i) => ({
          id: i.id,
          title: i.title,
          description: i.description,
          business_id: i.business_id,
          business_name: i.business_name,
          imageUrl: i.image ? getImageUrl(i.image, 'collections') : null,
        })),
      })).filter((c) => c.items.length > 0),
      sliderHeight: Number(sliderHeightRow?.setting_value) || null,
      sliders: (sliders as any[]).map((s) => ({
        ...s,
        imageUrl: getImageUrl(s.image, 'slides'),
      })),
      mainCategories: mainCats,
      homeCategories: homeCats,
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
