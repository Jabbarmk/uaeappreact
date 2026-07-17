"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const router = (0, express_1.Router)();
router.get('/:slug', async (req, res, next) => {
    try {
        const page = await (0, pool_1.queryOne)('SELECT * FROM pages WHERE slug = ? AND is_active = 1', [req.params.slug]);
        if (!page)
            return res.status(404).json({ error: 'Page not found' });
        res.json({ page });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
