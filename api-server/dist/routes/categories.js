"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const router = (0, express_1.Router)();
// Track category click
router.post('/track/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await (0, pool_1.query)('INSERT INTO category_clicks (category_id, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1', [id]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// Top 10 most clicked categories
router.get('/top', async (_req, res, next) => {
    try {
        const rows = await (0, pool_1.query)(`SELECT bc.id, bc.name, bc.icon, COALESCE(cc.count, 0) AS clicks
       FROM business_categories bc
       LEFT JOIN category_clicks cc ON bc.id = cc.category_id
       WHERE bc.is_active = 1
       ORDER BY clicks DESC, bc.sort_order ASC
       LIMIT 10`);
        res.json(rows);
    }
    catch (err) {
        next(err);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const search = req.query.search || '';
        let sql = 'SELECT * FROM business_categories WHERE is_active = 1';
        const params = [];
        if (search) {
            sql += ' AND name LIKE ?';
            params.push(`%${search}%`);
        }
        sql += ' ORDER BY sort_order';
        const categories = await (0, pool_1.query)(sql, params);
        // Group by group_name
        const groups = {};
        for (const cat of categories) {
            const g = cat.group_name || 'Other';
            if (!groups[g])
                groups[g] = [];
            groups[g].push(cat);
        }
        res.json({ groups });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
