"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        const search = req.query.search || '';
        let sql = 'SELECT * FROM jobs WHERE is_active = 1';
        const params = [];
        if (search) {
            sql += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        sql += ' ORDER BY is_featured DESC, posted_at DESC';
        const jobs = await (0, pool_1.query)(sql, params);
        const profile = await (0, pool_1.queryOne)('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');
        res.json({
            jobs,
            profile: profile ? { ...profile, photoUrl: (0, imageUrl_1.getImageUrl)(profile.photo, 'profiles') } : null,
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const job = await (0, pool_1.queryOne)('SELECT * FROM jobs WHERE id = ?', [Number(req.params.id)]);
        if (!job)
            return res.status(404).json({ error: 'Not found' });
        const profile = await (0, pool_1.queryOne)('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');
        res.json({
            job,
            profile: profile ? { ...profile, photoUrl: (0, imageUrl_1.getImageUrl)(profile.photo, 'profiles') } : null,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
