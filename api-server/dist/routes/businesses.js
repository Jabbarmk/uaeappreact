"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
// Track business view by emirate
router.post('/view/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const emirate = req.body.emirate || 'Unknown';
        await (0, pool_1.query)('INSERT INTO business_views (business_id, emirate, count) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1', [id, emirate]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// Search endpoint
router.get('/search', async (req, res, next) => {
    try {
        const q = req.query.q || '';
        const categoryId = req.query.category_id;
        let sql = 'SELECT id, name, category_id FROM businesses WHERE is_active = 1';
        const params = [];
        if (q) {
            sql += ' AND name LIKE ?';
            params.push(`%${q}%`);
        }
        if (categoryId) {
            sql += ' AND category_id = ?';
            params.push(categoryId);
        }
        sql += ' LIMIT 20';
        const results = await (0, pool_1.query)(sql, params);
        res.json(results);
    }
    catch (err) {
        next(err);
    }
});
// Listings
router.get('/', async (req, res, next) => {
    try {
        const catId = req.query.cat;
        let sql = `SELECT b.id, b.name, b.description, b.image, b.address, b.phone, b.whatsapp,
               b.rating, b.distance, bc.name as category_name
               FROM businesses b
               LEFT JOIN business_categories bc ON b.category_id = bc.id
               WHERE b.is_active = 1`;
        const params = [];
        if (catId) {
            sql += ' AND b.category_id = ?';
            params.push(catId);
        }
        sql += ' ORDER BY b.created_at DESC';
        const businesses = await (0, pool_1.query)(sql, params);
        let catName = 'All Businesses';
        if (catId) {
            const cat = await (0, pool_1.queryOne)('SELECT name FROM business_categories WHERE id = ?', [catId]);
            if (cat)
                catName = cat.name;
        }
        res.json({
            catName,
            businesses: businesses.map((b) => ({ ...b, imageUrl: (0, imageUrl_1.getImageUrl)(b.image, 'businesses') })),
        });
    }
    catch (err) {
        next(err);
    }
});
// Detail
router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const biz = await (0, pool_1.queryOne)(`SELECT b.*, bc.name AS category_name
       FROM businesses b
       LEFT JOIN business_categories bc ON b.category_id = bc.id
       WHERE b.id = ? AND b.is_active = 1`, [id]);
        if (!biz)
            return res.status(404).json({ error: 'Not found' });
        const [gallery, videos, reels, services, testimonials, clients] = await Promise.all([
            (0, pool_1.query)('SELECT * FROM business_gallery WHERE business_id = ? ORDER BY sort_order', [id]),
            (0, pool_1.query)('SELECT * FROM business_videos WHERE business_id = ? ORDER BY sort_order', [id]),
            (0, pool_1.query)('SELECT * FROM business_reels WHERE business_id = ? ORDER BY sort_order', [id]),
            (0, pool_1.query)('SELECT * FROM business_services WHERE business_id = ? ORDER BY sort_order', [id]),
            (0, pool_1.query)('SELECT * FROM business_testimonials WHERE business_id = ? ORDER BY sort_order', [id]),
            (0, pool_1.query)('SELECT * FROM business_clients WHERE business_id = ? ORDER BY sort_order', [id]),
        ]).catch(() => [[], [], [], [], [], []]);
        const vlogger = await (0, pool_1.queryOne)('SELECT * FROM vlogger_profiles WHERE business_id=?', [id]).catch(() => null);
        const doctorRows = await (0, pool_1.query)(`SELECT d.*, sc.name AS specialty_name, sc.icon AS specialty_icon
       FROM doctors d LEFT JOIN business_categories sc ON sc.id=d.specialty_id
       WHERE d.business_id=? AND d.is_active=1 ORDER BY d.is_featured DESC, d.rating DESC`, [id]).catch(() => []);
        const doctors = doctorRows.map((d) => ({
            ...d,
            photoUrl: d.photo ? (0, imageUrl_1.getImageUrl)(d.photo, 'doctors') : null,
            hospital_name: biz.name, hospital_phone: biz.phone, hospital_whatsapp: biz.whatsapp,
            hospital_website: biz.website, hospital_emirate: biz.emirate, hospital_address: biz.address,
        }));
        res.json({
            business: { ...biz, imageUrl: (0, imageUrl_1.getImageUrl)(biz.image, 'businesses'), logoUrl: (0, imageUrl_1.getImageUrl)(biz.logo, 'businesses') },
            gallery: gallery.map((g) => ({ ...g, src: (0, imageUrl_1.getImageUrl)(g.image, 'businesses') })),
            videos,
            reels,
            services,
            testimonials,
            clients,
            vlogger,
            doctors,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
