"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
// Hub page data
router.get('/', async (_req, res, next) => {
    try {
        const [categories, sections] = await Promise.all([
            (0, pool_1.query)('SELECT * FROM classified_categories WHERE is_active = 1 ORDER BY sort_order'),
            (0, pool_1.query)('SELECT * FROM classified_sections WHERE is_active = 1 ORDER BY sort_order'),
        ]);
        const sectionsWithItems = await Promise.all(sections.map(async (s) => {
            const items = await (0, pool_1.query)('SELECT * FROM classifieds WHERE section_id = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY created_at DESC LIMIT 6', [s.id]);
            return {
                ...s,
                items: items.map((i) => ({ ...i, imageUrl: (0, imageUrl_1.getImageUrl)(i.image, 'classifieds') })),
            };
        }));
        res.json({ categories, sections: sectionsWithItems.filter((s) => s.items.length > 0) });
    }
    catch (err) {
        next(err);
    }
});
// Listing with filters
router.get('/list', async (req, res, next) => {
    try {
        const { category, section, search, page = '1', pageSize = '25' } = req.query;
        const where = ['c.is_active = 1', '(c.expires_at IS NULL OR c.expires_at > NOW())'];
        const params = [];
        if (category) {
            where.push('c.category_id = ?');
            params.push(category);
        }
        if (section) {
            where.push('c.section_id = ?');
            params.push(section);
        }
        if (search) {
            where.push('(c.title LIKE ? OR c.description LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        const offset = (Number(page) - 1) * Number(pageSize);
        const [[{ total }]] = await Promise.all([
            (0, pool_1.query)(`SELECT COUNT(*) as total FROM classifieds c WHERE ${where.join(' AND ')}`, params),
        ]);
        const items = await (0, pool_1.query)(`SELECT c.*, cc.name as category_name FROM classifieds c
       LEFT JOIN classified_categories cc ON c.category_id = cc.id
       WHERE ${where.join(' AND ')} ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
        let catName = 'Classifieds';
        if (category) {
            const cat = await (0, pool_1.queryOne)('SELECT name FROM classified_categories WHERE id = ?', [category]);
            if (cat)
                catName = cat.name;
        }
        res.json({
            catName,
            items: items.map((i) => ({ ...i, imageUrl: (0, imageUrl_1.getImageUrl)(i.image, 'classifieds') })),
            total,
            page: Number(page),
            pageSize: Number(pageSize),
        });
    }
    catch (err) {
        next(err);
    }
});
// Detail
router.get('/:id', async (req, res, next) => {
    try {
        const item = await (0, pool_1.queryOne)(`SELECT c.*, cc.name as category_name FROM classifieds c
       LEFT JOIN classified_categories cc ON c.category_id = cc.id
       WHERE c.id = ? AND c.is_active = 1 AND (c.expires_at IS NULL OR c.expires_at > NOW())`, [Number(req.params.id)]);
        if (!item)
            return res.status(404).json({ error: 'Not found' });
        const gallery = await (0, pool_1.query)('SELECT filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id', [item.id]);
        const images = gallery.map((g) => (0, imageUrl_1.getImageUrl)(g.filename, 'classifieds'));
        res.json({ item: { ...item, imageUrl: (0, imageUrl_1.getImageUrl)(item.image, 'classifieds'), images: images.length ? images : [(0, imageUrl_1.getImageUrl)(item.image, 'classifieds')] } });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
