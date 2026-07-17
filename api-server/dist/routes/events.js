"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
const F = 'events';
const mapEvent = (e) => ({ ...e, posterUrl: (0, imageUrl_1.getImageUrl)(e.poster, F) });
// Only approved + active events are public. Past events are hidden unless ?past=1
// (an event counts as past once its end_date — or event_date if single-day — is behind us).
const LIVE = ["e.status='approved'", 'e.is_active=1'];
const UPCOMING = '(e.event_date IS NULL OR COALESCE(e.end_date, e.event_date) >= CURDATE())';
// ── Categories ───────────────────────────────────────────────────────────────
// Declared before '/:id' so the literal path wins over the param route.
router.get('/categories', async (_req, res, next) => {
    try {
        const rows = await (0, pool_1.query)('SELECT * FROM event_categories WHERE is_active=1 ORDER BY sort_order, id');
        res.json({ categories: rows });
    }
    catch (err) {
        next(err);
    }
});
// ── Listing ──────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
    try {
        const { category, emirate, search, featured, past, page = '1', pageSize = '25' } = req.query;
        const where = [...LIVE];
        const params = [];
        if (past !== '1')
            where.push(UPCOMING);
        if (category) {
            where.push('e.category_id=?');
            params.push(category);
        }
        if (emirate) {
            where.push('e.emirate=?');
            params.push(emirate);
        }
        if (featured === '1')
            where.push('e.is_featured=1');
        if (search) {
            where.push('(e.title LIKE ? OR e.description LIKE ? OR e.venue LIKE ? OR e.location LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        const whereSql = where.join(' AND ');
        const offset = (Number(page) - 1) * Number(pageSize);
        const totalRow = await (0, pool_1.queryOne)(`SELECT COUNT(*) AS total FROM events e WHERE ${whereSql}`, params);
        const items = await (0, pool_1.query)(`SELECT e.*, ec.name AS category_name, ec.icon AS category_icon
       FROM events e LEFT JOIN event_categories ec ON e.category_id=ec.id
       WHERE ${whereSql}
       ORDER BY e.is_featured DESC, e.event_date IS NULL, e.event_date ASC
       LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
        let catName = 'Events';
        if (category) {
            const cat = await (0, pool_1.queryOne)('SELECT name FROM event_categories WHERE id=?', [category]);
            if (cat)
                catName = cat.name;
        }
        res.json({ catName, items: items.map(mapEvent), total: totalRow?.total ?? 0, page: Number(page), pageSize: Number(pageSize) });
    }
    catch (err) {
        next(err);
    }
});
// ── Detail ───────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
    try {
        const item = await (0, pool_1.queryOne)(`SELECT e.*, ec.name AS category_name, ec.icon AS category_icon
       FROM events e LEFT JOIN event_categories ec ON e.category_id=ec.id
       WHERE e.id=? AND ${LIVE.join(' AND ')}`, [Number(req.params.id)]);
        if (!item)
            return res.status(404).json({ error: 'Not found' });
        res.json({ item: mapEvent(item) });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
