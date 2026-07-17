"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        let profile = await (0, pool_1.queryOne)('SELECT * FROM user_profiles WHERE id = ?', [id]);
        if (!profile) {
            profile = await (0, pool_1.queryOne)('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');
        }
        if (!profile)
            return res.status(404).json({ error: 'Not found' });
        const workExperience = profile.user_id
            ? await (0, pool_1.query)('SELECT * FROM user_work_experience WHERE user_id=? ORDER BY start_year DESC, start_month DESC', [profile.user_id])
            : [];
        res.json({ profile: { ...profile, photoUrl: (0, imageUrl_1.getImageUrl)(profile.photo, 'profiles'), workExperience } });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
