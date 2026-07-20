"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const pool_1 = require("../db/pool");
const auth_1 = require("../middleware/auth");
const imageUrl_1 = require("../services/imageUrl");
const mailer_1 = require("../services/mailer");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: path_1.default.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/tmp/',
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    },
});
// ── File upload ───────────────────────────────────────────────────────────────
router.post('/upload/:folder', auth_1.requireAdmin, upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: 'No file' });
        const ext = path_1.default.extname(req.file.originalname).toLowerCase() || '.jpg';
        const filename = `${Date.now()}${ext}`;
        const destDir = path_1.default.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + `/${req.params.folder}/`;
        await promises_1.default.mkdir(destDir, { recursive: true });
        await promises_1.default.rename(req.file.path, destDir + filename);
        res.json({ filename });
    }
    catch (err) {
        next(err);
    }
});
// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ error: 'Missing credentials' });
        const user = await (0, pool_1.queryOne)('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        req.session.adminId = user.id;
        req.session.adminName = user.full_name;
        res.json({ ok: true, name: user.full_name });
    }
    catch (err) {
        next(err);
    }
});
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
});
router.get('/me', auth_1.requireAdmin, (req, res) => {
    res.json({ id: req.session.adminId, name: req.session.adminName });
});
// ── Dashboard summary + analytics ─────────────────────────────────────────────
router.get('/dashboard', auth_1.requireAdmin, async (_req, res, next) => {
    try {
        const one = async (sql) => (await (0, pool_1.queryOne)(sql))?.n ?? 0;
        const [businesses, jobs, classifieds, properties, events, companies, projects, users, pBiz, pJob, pCls, pProp, pComp, pProj, pEvt, topBusinesses, topKeywords, topCategories, recentBusinesses,] = await Promise.all([
            one('SELECT COUNT(*) n FROM businesses'),
            one('SELECT COUNT(*) n FROM jobs'),
            one('SELECT COUNT(*) n FROM classifieds'),
            one('SELECT COUNT(*) n FROM properties'),
            one('SELECT COUNT(*) n FROM events'),
            one('SELECT COUNT(*) n FROM real_estate_companies'),
            one('SELECT COUNT(*) n FROM real_estate_projects'),
            one('SELECT COUNT(*) n FROM users'),
            one("SELECT COUNT(*) n FROM businesses WHERE status='pending'"),
            one("SELECT COUNT(*) n FROM jobs WHERE status='pending'"),
            one("SELECT COUNT(*) n FROM classifieds WHERE status='pending'"),
            one("SELECT COUNT(*) n FROM properties WHERE status='pending'"),
            one("SELECT COUNT(*) n FROM real_estate_companies WHERE status='pending'"),
            one("SELECT COUNT(*) n FROM real_estate_projects WHERE status='pending'"),
            one("SELECT COUNT(*) n FROM events WHERE status='pending'"),
            (0, pool_1.query)(`SELECT b.id, b.name, b.image, b.emirate, COALESCE(SUM(v.count),0) AS hits
                  FROM businesses b LEFT JOIN business_views v ON v.business_id=b.id
                  GROUP BY b.id ORDER BY hits DESC, b.id DESC LIMIT 6`),
            (0, pool_1.query)('SELECT keyword, count FROM search_keywords ORDER BY count DESC, keyword LIMIT 10'),
            (0, pool_1.query)(`SELECT bc.name, bc.icon, cc.count
                  FROM category_clicks cc JOIN business_categories bc ON bc.id=cc.category_id
                  ORDER BY cc.count DESC LIMIT 8`),
            (0, pool_1.query)('SELECT id, name, image, emirate, created_at FROM businesses ORDER BY created_at DESC LIMIT 5'),
        ]);
        res.json({
            counts: { businesses, jobs, classifieds, properties, events, companies, projects, users },
            pendingApprovals: pBiz + pJob + pCls + pProp + pComp + pProj + pEvt,
            pendingBreakdown: { businesses: pBiz, jobs: pJob, classifieds: pCls, properties: pProp, companies: pComp, projects: pProj, events: pEvt },
            topBusinesses: topBusinesses.map((b) => ({ ...b, hits: Number(b.hits), imageUrl: (0, imageUrl_1.getImageUrl)(b.image, 'businesses') })),
            topKeywords,
            topCategories,
            recentBusinesses: recentBusinesses.map((b) => ({ ...b, imageUrl: (0, imageUrl_1.getImageUrl)(b.image, 'businesses') })),
        });
    }
    catch (err) {
        next(err);
    }
});
// ── Settings ──────────────────────────────────────────────────────────────────
router.get('/settings', auth_1.requireAdmin, async (_req, res, next) => {
    try {
        const rows = await (0, pool_1.query)('SELECT * FROM site_settings');
        const settings = {};
        rows.forEach((r) => { settings[r.setting_key] = r.setting_value; });
        res.json(settings);
    }
    catch (err) {
        next(err);
    }
});
router.put('/settings', auth_1.requireAdmin, async (req, res, next) => {
    try {
        const entries = Object.entries(req.body);
        for (const [key, value] of entries) {
            await (0, pool_1.query)('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', [key, value, value]);
        }
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/settings/test-email', auth_1.requireAdmin, async (req, res) => {
    try {
        const { to } = req.body;
        if (!to)
            return res.status(400).json({ error: 'Recipient email required' });
        await (0, mailer_1.sendTestEmail)(to);
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to send test email' });
    }
});
function crudRoutes(table, imageFolder, opts = {}) {
    const r = (0, express_1.Router)();
    const searchCols = opts.searchCols ?? ['name'];
    const filterCols = opts.filterCols ?? [];
    r.get('/', auth_1.requireAdmin, async (req, res, next) => {
        try {
            const q = req.query;
            const page = q.page || '1';
            const pageSize = q.pageSize || '50';
            const search = q.search;
            const offset = (Number(page) - 1) * Number(pageSize);
            const where = [];
            const params = [];
            if (search) {
                where.push('(' + searchCols.map((c) => `\`${c}\` LIKE ?`).join(' OR ') + ')');
                searchCols.forEach(() => params.push(`%${search}%`));
            }
            for (const c of filterCols) {
                if (q[c] !== undefined && q[c] !== '') {
                    where.push(`\`${c}\` = ?`);
                    params.push(q[c]);
                }
            }
            const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
            const rows = await (0, pool_1.query)(`SELECT * FROM \`${table}\` ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
            const totalRow = await (0, pool_1.query)(`SELECT COUNT(*) as total FROM \`${table}\` ${whereSql}`, params);
            const total = totalRow[0]?.total ?? 0;
            res.json({ rows: imageFolder ? rows.map((r) => ({ ...r, imageUrl: (0, imageUrl_1.getImageUrl)(r.image, imageFolder) })) : rows, total });
        }
        catch (err) {
            next(err);
        }
    });
    r.post('/', auth_1.requireAdmin, async (req, res, next) => {
        try {
            const fields = Object.keys(req.body);
            const values = Object.values(req.body);
            const sql = `INSERT INTO \`${table}\` (${fields.map((f) => `\`${f}\``).join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
            const result = await (0, pool_1.query)(sql, values);
            res.json({ ok: true, id: result.insertId });
        }
        catch (err) {
            next(err);
        }
    });
    r.put('/:id', auth_1.requireAdmin, async (req, res, next) => {
        try {
            const fields = Object.keys(req.body);
            const values = [...Object.values(req.body), Number(req.params.id)];
            const sql = `UPDATE \`${table}\` SET ${fields.map((f) => `\`${f}\` = ?`).join(',')} WHERE id = ?`;
            await (0, pool_1.query)(sql, values);
            res.json({ ok: true });
        }
        catch (err) {
            next(err);
        }
    });
    r.delete('/:id', auth_1.requireAdmin, async (req, res, next) => {
        try {
            await (0, pool_1.query)(`DELETE FROM \`${table}\` WHERE id = ?`, [Number(req.params.id)]);
            res.json({ ok: true });
        }
        catch (err) {
            next(err);
        }
    });
    return r;
}
// ── Business search (for slider linking) ─────────────────────────────────────
router.get('/businesses/search', auth_1.requireAdmin, async (req, res, next) => {
    try {
        const q = req.query.q || '';
        if (q.length < 2)
            return res.json([]);
        const results = await (0, pool_1.query)('SELECT id, name FROM businesses WHERE is_active = 1 AND name LIKE ? ORDER BY name LIMIT 10', [`%${q}%`]);
        res.json(results);
    }
    catch (err) {
        next(err);
    }
});
// ── Classifieds manager (full edit, images, expiry, approval) ─────────────────
const CLASSIFIED_EDIT_FIELDS = [
    'title', 'description', 'price', 'currency', 'category_id', 'section_id', 'location',
    'brand', 'model', 'color', 'condition_status',
    'storage', 'memory', 'battery_health', 'carrier_lock',
    'year', 'mileage', 'transmission', 'fuel_type',
    'furniture_type', 'material', 'dimensions',
    'status', 'is_active', 'expires_at',
];
// Dropdown metadata for the manager.
router.get('/manage-classifieds/meta', auth_1.requireAdmin, async (_req, res, next) => {
    try {
        const [categories, sections] = await Promise.all([
            (0, pool_1.query)('SELECT id, name FROM classified_categories WHERE is_active=1 ORDER BY sort_order, name'),
            (0, pool_1.query)('SELECT id, name FROM classified_sections WHERE is_active=1 ORDER BY sort_order, name'),
        ]);
        res.json({ categories, sections });
    }
    catch (err) {
        next(err);
    }
});
// List all classifieds with owner + category, filterable by status/category/search.
router.get('/manage-classifieds', auth_1.requireAdmin, async (req, res, next) => {
    try {
        const { page = '1', pageSize = '50', search, status, category } = req.query;
        const offset = (Number(page) - 1) * Number(pageSize);
        const where = [];
        const params = [];
        if (search) {
            where.push('c.title LIKE ?');
            params.push(`%${search}%`);
        }
        if (status) {
            where.push('c.status = ?');
            params.push(status);
        }
        if (category) {
            where.push('c.category_id = ?');
            params.push(category);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const rows = await (0, pool_1.query)(`SELECT c.*, cc.name AS category_name, u.name AS user_name, u.email AS user_email,
              (c.expires_at IS NOT NULL AND c.expires_at <= NOW()) AS is_expired
       FROM classifieds c
       LEFT JOIN classified_categories cc ON c.category_id=cc.id
       LEFT JOIN users u ON c.user_id=u.id
       ${whereSql} ORDER BY c.id DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
        const totalRow = await (0, pool_1.queryOne)(`SELECT COUNT(*) AS total FROM classifieds c ${whereSql}`, params);
        res.json({ rows: rows.map((r) => ({ ...r, imageUrl: (0, imageUrl_1.getImageUrl)(r.image, 'classifieds') })), total: totalRow?.total ?? 0 });
    }
    catch (err) {
        next(err);
    }
});
// Single classified with its image gallery.
router.get('/manage-classifieds/:id', auth_1.requireAdmin, async (req, res, next) => {
    try {
        const c = await (0, pool_1.queryOne)('SELECT * FROM classifieds WHERE id=?', [req.params.id]);
        if (!c)
            return res.status(404).json({ error: 'Not found' });
        const images = await (0, pool_1.query)('SELECT id, filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id', [c.id]);
        res.json({ ...c, imageUrl: (0, imageUrl_1.getImageUrl)(c.image, 'classifieds'), images: images.map((i) => ({ id: i.id, url: (0, imageUrl_1.getImageUrl)(i.filename, 'classifieds') })) });
    }
    catch (err) {
        next(err);
    }
});
// Update any editable field (incl. status, is_active, expiry).
router.put('/manage-classifieds/:id', auth_1.requireAdmin, async (req, res, next) => {
    try {
        const body = req.body;
        const fields = CLASSIFIED_EDIT_FIELDS.filter((f) => f in body);
        if (!fields.length)
            return res.json({ ok: true });
        const sets = fields.map((f) => `\`${f}\` = ?`).join(',');
        const values = fields.map((f) => {
            const v = body[f];
            if (f === 'expires_at')
                return v ? String(v).replace('T', ' ') : null;
            if (v === '' || v === undefined)
                return null;
            return v;
        });
        await (0, pool_1.query)(`UPDATE classifieds SET ${sets} WHERE id=?`, [...values, Number(req.params.id)]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
router.delete('/manage-classifieds/:id', auth_1.requireAdmin, async (req, res, next) => {
    try {
        await (0, pool_1.query)('DELETE FROM classifieds WHERE id=?', [Number(req.params.id)]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// Upload gallery images for a classified.
router.post('/manage-classifieds/:id/images', auth_1.requireAdmin, upload.array('files', 10), async (req, res, next) => {
    try {
        const c = await (0, pool_1.queryOne)('SELECT * FROM classifieds WHERE id=?', [req.params.id]);
        if (!c)
            return res.status(404).json({ error: 'Not found' });
        const files = req.files || [];
        if (!files.length)
            return res.status(400).json({ error: 'No files' });
        const destDir = path_1.default.resolve(process.env.UPLOAD_PATH || '../assets/uploads') + '/classifieds/';
        await promises_1.default.mkdir(destDir, { recursive: true });
        const startOrder = (await (0, pool_1.queryOne)('SELECT COALESCE(MAX(sort_order),-1)+1 AS n FROM classified_images WHERE classified_id=?', [c.id]))?.n ?? 0;
        const saved = [];
        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const ext = path_1.default.extname(f.originalname).toLowerCase() || '.jpg';
            const filename = `${Date.now()}-${i}${ext}`;
            await promises_1.default.rename(f.path, destDir + filename);
            const r = await (0, pool_1.query)('INSERT INTO classified_images (classified_id, filename, sort_order) VALUES (?,?,?)', [c.id, filename, startOrder + i]);
            saved.push({ id: r.insertId, url: (0, imageUrl_1.getImageUrl)(filename, 'classifieds') });
        }
        if (!c.image && saved.length) {
            const first = await (0, pool_1.queryOne)('SELECT filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id LIMIT 1', [c.id]);
            if (first)
                await (0, pool_1.query)('UPDATE classifieds SET image=? WHERE id=?', [first.filename, c.id]);
        }
        res.json({ ok: true, images: saved });
    }
    catch (err) {
        next(err);
    }
});
router.delete('/manage-classifieds/:id/images/:imageId', auth_1.requireAdmin, async (req, res, next) => {
    try {
        const img = await (0, pool_1.queryOne)('SELECT * FROM classified_images WHERE id=? AND classified_id=?', [req.params.imageId, req.params.id]);
        if (!img)
            return res.status(404).json({ error: 'Not found' });
        await (0, pool_1.query)('DELETE FROM classified_images WHERE id=?', [img.id]);
        const c = await (0, pool_1.queryOne)('SELECT image FROM classifieds WHERE id=?', [req.params.id]);
        if (c && c.image === img.filename) {
            const next = await (0, pool_1.queryOne)('SELECT filename FROM classified_images WHERE classified_id=? ORDER BY sort_order, id LIMIT 1', [req.params.id]);
            await (0, pool_1.query)('UPDATE classifieds SET image=? WHERE id=?', [next?.filename || null, req.params.id]);
        }
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// ── Universities manager (set institution type + extras on a business) ─────────
// Metadata for the university & course forms.
router.get('/universities/meta', auth_1.requireAdmin, async (_req, res, next) => {
    try {
        const [institutionTypes, universities] = await Promise.all([
            (0, pool_1.query)('SELECT id, name FROM institution_types WHERE is_active=1 ORDER BY sort_order, name'),
            (0, pool_1.query)('SELECT b.id, b.name FROM businesses b JOIN university_profiles up ON up.business_id=b.id ORDER BY b.name'),
        ]);
        res.json({ institutionTypes, universities });
    }
    catch (err) {
        next(err);
    }
});
// List Universities-category businesses with their profile (if any).
router.get('/universities', auth_1.requireAdmin, async (_req, res, next) => {
    try {
        const rows = await (0, pool_1.query)(`SELECT b.id, b.name, b.emirate, b.logo, b.status, b.is_active,
              up.institution_type_id, up.ranking, up.campus_size, up.established_year,
              it.name AS institution_type,
              (up.business_id IS NOT NULL) AS is_university,
              (SELECT COUNT(*) FROM courses c WHERE c.business_id=b.id) AS course_count
       FROM businesses b
       LEFT JOIN university_profiles up ON up.business_id=b.id
       LEFT JOIN institution_types it ON it.id=up.institution_type_id
       WHERE b.category_id = (SELECT id FROM business_categories WHERE name='Universities' LIMIT 1)
       ORDER BY b.name`);
        res.json({ rows: rows.map((r) => ({ ...r, is_university: Number(r.is_university), course_count: Number(r.course_count), logoUrl: (0, imageUrl_1.getImageUrl)(r.logo, 'businesses') })) });
    }
    catch (err) {
        next(err);
    }
});
// Upsert the university profile for a business (marks it as a university).
router.put('/universities/:id', auth_1.requireAdmin, async (req, res, next) => {
    try {
        const b = Number(req.params.id);
        const { institution_type_id, ranking, campus_size, established_year } = req.body;
        await (0, pool_1.query)(`INSERT INTO university_profiles (business_id, institution_type_id, ranking, campus_size, established_year)
       VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE institution_type_id=VALUES(institution_type_id), ranking=VALUES(ranking), campus_size=VALUES(campus_size), established_year=VALUES(established_year)`, [b, institution_type_id || null, ranking || null, campus_size || null, established_year || null]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// Unmark a business as a university (removes profile; keeps the business).
router.delete('/universities/:id', auth_1.requireAdmin, async (req, res, next) => {
    try {
        await (0, pool_1.query)('DELETE FROM university_profiles WHERE business_id=?', [Number(req.params.id)]);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
// ── Resource routes ──────────────────────────────────────────────────────────
router.use('/institution-types', crudRoutes('institution_types', undefined, { searchCols: ['name'] }));
router.use('/course-categories', crudRoutes('course_categories', undefined, { searchCols: ['name'] }));
router.use('/study-levels', crudRoutes('study_levels', undefined, { searchCols: ['name'] }));
router.use('/courses', crudRoutes('courses', undefined, { searchCols: ['name'], filterCols: ['study_level_id', 'course_category_id', 'business_id'] }));
router.use('/sliders', crudRoutes('sliders', 'slides'));
router.use('/main-categories', crudRoutes('main_categories', undefined, { searchCols: ['name'] }));
router.use('/home-categories', crudRoutes('home_categories', undefined, { searchCols: ['name'] }));
router.use('/popular-categories', crudRoutes('popular_categories', 'categories', { searchCols: ['name'] }));
router.use('/business-categories', crudRoutes('business_categories', undefined, { searchCols: ['name'], filterCols: ['group_name', 'main_category_id'] }));
router.use('/businesses', crudRoutes('businesses', 'businesses', { searchCols: ['name'], filterCols: ['category_id', 'emirate'] }));
router.use('/offers', crudRoutes('offers', 'offers'));
router.use('/classified-categories', crudRoutes('classified_categories'));
router.use('/classified-sections', crudRoutes('classified_sections'));
router.use('/classifieds', crudRoutes('classifieds', 'classifieds'));
router.use('/property-categories', crudRoutes('property_categories'));
router.use('/real-estate-companies', crudRoutes('real_estate_companies', 'realestate'));
router.use('/properties', crudRoutes('properties', 'realestate'));
router.use('/real-estate-projects', crudRoutes('real_estate_projects', 'realestate'));
router.use('/event-categories', crudRoutes('event_categories'));
router.use('/events', crudRoutes('events', 'events'));
router.use('/jobs', crudRoutes('jobs'));
router.use('/profiles', crudRoutes('user_profiles', 'profiles'));
router.use('/pages', crudRoutes('pages'));
router.use('/work-experience', crudRoutes('user_work_experience'));
exports.default = router;
