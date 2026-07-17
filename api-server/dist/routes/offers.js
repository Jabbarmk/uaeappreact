"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
const UAE_EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
router.get('/', async (req, res, next) => {
    try {
        const { loc = 'Dubai', cat } = req.query;
        const dbEmirates = await (0, pool_1.query)('SELECT DISTINCT emirate FROM offers WHERE is_active=1 AND emirate IS NOT NULL AND emirate <> "" ORDER BY emirate');
        const emirates = [...new Set([...UAE_EMIRATES, ...dbEmirates.map((e) => e.emirate)])];
        const categories = await (0, pool_1.query)(`SELECT bc.id, bc.name, bc.icon FROM offers o
       JOIN business_categories bc ON o.category_id = bc.id WHERE o.is_active=1
       GROUP BY bc.id, bc.name, bc.icon, bc.sort_order
       ORDER BY bc.sort_order, bc.name`);
        const where = ['o.is_active = 1', 'o.emirate = ?'];
        const params = [loc];
        if (cat) {
            where.push('o.category_id = ?');
            params.push(cat);
        }
        const offers = await (0, pool_1.query)(`SELECT o.*, b.name AS business_name, b.logo AS business_logo, b.image AS business_image,
              b.address AS business_address, b.phone AS business_phone, b.whatsapp AS business_whatsapp,
              bc.name AS category_name
       FROM offers o
       JOIN businesses b ON o.business_id = b.id
       LEFT JOIN business_categories bc ON o.category_id = bc.id
       WHERE ${where.join(' AND ')}
       ORDER BY o.ranking DESC, o.created_at DESC`, params);
        res.json({
            emirates,
            selectedLoc: loc,
            selectedCat: cat || '',
            categories,
            offers: offers.map((o) => ({
                ...o,
                imageUrl: (0, imageUrl_1.getImageUrl)(o.image, 'offers'),
                logoUrl: (0, imageUrl_1.getImageUrl)(o.business_logo || o.business_image, 'businesses'),
            })),
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const offer = await (0, pool_1.queryOne)(`SELECT o.*, b.name AS business_name, b.logo AS business_logo, b.image AS business_image,
              b.address AS business_address, b.phone AS business_phone, b.whatsapp AS business_whatsapp,
              b.emirate AS business_emirate, bc.name AS category_name
       FROM offers o
       JOIN businesses b ON o.business_id = b.id
       LEFT JOIN business_categories bc ON o.category_id = bc.id
       WHERE o.id = ? AND o.is_active = 1`, [Number(req.params.id)]);
        if (!offer)
            return res.status(404).json({ error: 'Not found' });
        const reviews = await (0, pool_1.query)('SELECT * FROM offer_reviews WHERE offer_id = ? ORDER BY created_at DESC', [Number(req.params.id)]);
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
            : Number(offer.rating);
        res.json({
            offer: {
                ...offer,
                imageUrl: (0, imageUrl_1.getImageUrl)(offer.image, 'offers'),
                logoUrl: (0, imageUrl_1.getImageUrl)(offer.business_logo || offer.business_image, 'businesses'),
            },
            reviews,
            avgRating,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
