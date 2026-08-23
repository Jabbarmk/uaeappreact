import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

const DEFAULT_SETTINGS = { timer: 4, radius: 24, padding: 16, style: 'fade' };

router.get('/', async (_req, res, next) => {
  try {
    const slides = await query<any>(
      'SELECT * FROM welcome_slides WHERE is_active = 1 ORDER BY sort_order, id'
    );
    const row = await queryOne<any>("SELECT setting_value FROM site_settings WHERE setting_key='welcome_screen'");
    let settings = DEFAULT_SETTINGS;
    try { settings = { ...DEFAULT_SETTINGS, ...JSON.parse(row?.setting_value || '{}') }; } catch { /* keep defaults */ }

    res.json({
      slides: slides.map((s) => ({ ...s, imageUrl: getImageUrl(s.image, 'welcome') })),
      settings,
    });
  } catch (err) { next(err); }
});

export default router;
