"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
router.get('/', async (_req, res, next) => {
    try {
        const [sliders, mainCats, popCats, homeCats, sections] = await Promise.all([
            (0, pool_1.query)('SELECT * FROM sliders WHERE is_active = 1 ORDER BY sort_order'),
            (0, pool_1.query)('SELECT * FROM main_categories WHERE is_active = 1 ORDER BY sort_order'),
            (0, pool_1.query)('SELECT * FROM popular_categories WHERE is_active = 1 ORDER BY sort_order'),
            (0, pool_1.query)('SELECT * FROM home_categories WHERE is_active = 1 ORDER BY sort_order'),
            (0, pool_1.query)('SELECT * FROM classified_sections WHERE is_active = 1 ORDER BY sort_order'),
        ]);
        const [[{ total: totalBiz }], [{ total: totalJobs }], [{ total: totalClassifieds }]] = await Promise.all([
            (0, pool_1.query)('SELECT COUNT(*) as total FROM businesses WHERE is_active = 1'),
            (0, pool_1.query)('SELECT COUNT(*) as total FROM jobs WHERE is_active = 1'),
            (0, pool_1.query)('SELECT COUNT(*) as total FROM classifieds WHERE is_active = 1'),
        ]);
        // Fetch top 6 classifieds per section
        const sectionsWithItems = await Promise.all(sections.map(async (section) => {
            const items = await (0, pool_1.query)('SELECT * FROM classifieds WHERE section_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 6', [section.id]);
            return { ...section, items };
        }));
        res.json({
            sliders: sliders.map((s) => ({
                ...s,
                imageUrl: (0, imageUrl_1.getImageUrl)(s.image, 'slides'),
            })),
            mainCategories: mainCats,
            homeCategories: homeCats,
            popularCategories: popCats.map((p) => ({
                ...p,
                imageUrl: (0, imageUrl_1.getImageUrl)(p.image, 'categories'),
            })),
            sections: sectionsWithItems.filter((s) => s.items.length > 0).map((s) => ({
                ...s,
                items: s.items.map((item) => ({
                    ...item,
                    imageUrl: (0, imageUrl_1.getImageUrl)(item.image, 'classifieds'),
                })),
            })),
            stats: { businesses: totalBiz, jobs: totalJobs, classifieds: totalClassifieds },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
