"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const imageUrl_1 = require("../services/imageUrl");
const router = (0, express_1.Router)();
const F = 'realestate';
const mapProp = (p) => ({ ...p, imageUrl: (0, imageUrl_1.getImageUrl)(p.image, F) });
const mapCompany = (c) => ({ ...c, logoUrl: (0, imageUrl_1.getImageUrl)(c.logo, F), bannerUrl: (0, imageUrl_1.getImageUrl)(c.banner, F) });
const mapProject = (p) => ({ ...p, imageUrl: (0, imageUrl_1.getImageUrl)(p.image, F) });
// ── Hub ──────────────────────────────────────────────────────────────────────
router.get('/', async (_req, res, next) => {
    try {
        const [categories, companies, projects] = await Promise.all([
            (0, pool_1.query)('SELECT * FROM property_categories WHERE is_active=1 ORDER BY sort_order, id'),
            (0, pool_1.query)("SELECT * FROM real_estate_companies WHERE is_featured=1 AND status='approved' AND is_active=1 ORDER BY sort_order, id"),
            (0, pool_1.query)("SELECT * FROM real_estate_projects WHERE status='approved' AND is_active=1 ORDER BY is_featured DESC, created_at DESC LIMIT 8"),
        ]);
        // Build a section per category that has live listings (a few items each).
        const sections = await Promise.all(categories.map(async (cat) => {
            const items = await (0, pool_1.query)("SELECT * FROM properties WHERE category_id=? AND status='approved' AND is_active=1 ORDER BY created_at DESC LIMIT 8", [cat.id]);
            return { id: cat.id, name: cat.name, icon: cat.icon, items: items.map(mapProp) };
        }));
        res.json({
            categories,
            featuredCompanies: companies.map(mapCompany),
            sections: sections.filter((s) => s.items.length > 0),
            projects: projects.map(mapProject),
        });
    }
    catch (err) {
        next(err);
    }
});
// ── Property listing with filters ────────────────────────────────────────────
router.get('/properties', async (req, res, next) => {
    try {
        const { category, purpose, emirate, search, bedrooms, page = '1', pageSize = '25' } = req.query;
        const where = ["p.status='approved'", 'p.is_active=1'];
        const params = [];
        if (category) {
            where.push('p.category_id=?');
            params.push(category);
        }
        if (purpose) {
            where.push('p.purpose=?');
            params.push(purpose);
        }
        if (emirate) {
            where.push('p.emirate=?');
            params.push(emirate);
        }
        if (bedrooms) {
            where.push('p.bedrooms=?');
            params.push(bedrooms);
        }
        if (search) {
            where.push('(p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        const whereSql = where.join(' AND ');
        const offset = (Number(page) - 1) * Number(pageSize);
        const totalRow = await (0, pool_1.queryOne)(`SELECT COUNT(*) AS total FROM properties p WHERE ${whereSql}`, params);
        const items = await (0, pool_1.query)(`SELECT p.*, pc.name AS category_name, c.name AS company_name
       FROM properties p
       LEFT JOIN property_categories pc ON p.category_id=pc.id
       LEFT JOIN real_estate_companies c ON p.company_id=c.id
       WHERE ${whereSql} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
        let catName = 'Properties';
        if (category) {
            const cat = await (0, pool_1.queryOne)('SELECT name FROM property_categories WHERE id=?', [category]);
            if (cat)
                catName = cat.name;
        }
        res.json({ catName, items: items.map(mapProp), total: totalRow?.total ?? 0, page: Number(page), pageSize: Number(pageSize) });
    }
    catch (err) {
        next(err);
    }
});
// ── Property detail ──────────────────────────────────────────────────────────
router.get('/properties/:id', async (req, res, next) => {
    try {
        const p = await (0, pool_1.queryOne)(`SELECT p.*, pc.name AS category_name FROM properties p
       LEFT JOIN property_categories pc ON p.category_id=pc.id
       WHERE p.id=? AND p.status='approved' AND p.is_active=1`, [Number(req.params.id)]);
        if (!p)
            return res.status(404).json({ error: 'Not found' });
        const gallery = await (0, pool_1.query)('SELECT filename FROM property_images WHERE property_id=? ORDER BY sort_order, id', [p.id]);
        const images = gallery.map((g) => (0, imageUrl_1.getImageUrl)(g.filename, F));
        let company = null;
        if (p.company_id) {
            const c = await (0, pool_1.queryOne)("SELECT id, name, logo, phone, whatsapp, email, website FROM real_estate_companies WHERE id=? AND status='approved' AND is_active=1", [p.company_id]);
            if (c)
                company = mapCompany(c);
        }
        res.json({ item: { ...mapProp(p), images: images.length ? images : [(0, imageUrl_1.getImageUrl)(p.image, F)], company } });
    }
    catch (err) {
        next(err);
    }
});
// ── Companies ────────────────────────────────────────────────────────────────
router.get('/companies', async (_req, res, next) => {
    try {
        const rows = await (0, pool_1.query)("SELECT * FROM real_estate_companies WHERE status='approved' AND is_active=1 ORDER BY is_featured DESC, sort_order, id");
        res.json({ items: rows.map(mapCompany) });
    }
    catch (err) {
        next(err);
    }
});
router.get('/companies/:id', async (req, res, next) => {
    try {
        const c = await (0, pool_1.queryOne)("SELECT * FROM real_estate_companies WHERE id=? AND status='approved' AND is_active=1", [Number(req.params.id)]);
        if (!c)
            return res.status(404).json({ error: 'Not found' });
        const [properties, projects] = await Promise.all([
            (0, pool_1.query)(`SELECT p.*, pc.name AS category_name FROM properties p
                  LEFT JOIN property_categories pc ON p.category_id=pc.id
                  WHERE p.company_id=? AND p.status='approved' AND p.is_active=1 ORDER BY p.created_at DESC`, [c.id]),
            (0, pool_1.query)("SELECT * FROM real_estate_projects WHERE company_id=? AND status='approved' AND is_active=1 ORDER BY created_at DESC", [c.id]),
        ]);
        res.json({ company: mapCompany(c), properties: properties.map(mapProp), projects: projects.map(mapProject) });
    }
    catch (err) {
        next(err);
    }
});
// ── Projects (off-plan) ──────────────────────────────────────────────────────
router.get('/projects', async (_req, res, next) => {
    try {
        const rows = await (0, pool_1.query)(`SELECT pr.*, c.name AS company_name FROM real_estate_projects pr
                                   LEFT JOIN real_estate_companies c ON pr.company_id=c.id
                                   WHERE pr.status='approved' AND pr.is_active=1 ORDER BY pr.is_featured DESC, pr.created_at DESC`);
        res.json({ items: rows.map(mapProject) });
    }
    catch (err) {
        next(err);
    }
});
router.get('/projects/:id', async (req, res, next) => {
    try {
        const pr = await (0, pool_1.queryOne)("SELECT * FROM real_estate_projects WHERE id=? AND status='approved' AND is_active=1", [Number(req.params.id)]);
        if (!pr)
            return res.status(404).json({ error: 'Not found' });
        const gallery = await (0, pool_1.query)('SELECT filename FROM project_images WHERE project_id=? ORDER BY sort_order, id', [pr.id]);
        const images = gallery.map((g) => (0, imageUrl_1.getImageUrl)(g.filename, F));
        let company = null;
        if (pr.company_id) {
            const c = await (0, pool_1.queryOne)("SELECT id, name, logo, phone, whatsapp, email, website FROM real_estate_companies WHERE id=?", [pr.company_id]);
            if (c)
                company = mapCompany(c);
        }
        res.json({ item: { ...mapProject(pr), images: images.length ? images : [(0, imageUrl_1.getImageUrl)(pr.image, F)], company } });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
