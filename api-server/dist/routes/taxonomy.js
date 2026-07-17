"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const router = (0, express_1.Router)();
// GET /api/skills?search=re  → up to 50 matching skills, most-used first
router.get('/skills', async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const params = [];
        let sql = 'SELECT id, name FROM skills';
        if (search) {
            sql += ' WHERE name LIKE ?';
            params.push(`%${search}%`);
        }
        sql += ' ORDER BY usage_count DESC, name ASC LIMIT 50';
        res.json(await (0, pool_1.query)(sql, params));
    }
    catch (err) {
        next(err);
    }
});
// GET /api/languages?search=ar
router.get('/languages', async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const params = [];
        let sql = 'SELECT id, name FROM languages';
        if (search) {
            sql += ' WHERE name LIKE ?';
            params.push(`%${search}%`);
        }
        sql += ' ORDER BY usage_count DESC, name ASC LIMIT 50';
        res.json(await (0, pool_1.query)(sql, params));
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
