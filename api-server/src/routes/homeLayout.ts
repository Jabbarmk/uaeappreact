import { Router } from 'express';
import pool, { query, queryOne } from '../db/pool';
import { requireAdmin } from '../middleware/auth';
import { getImageUrl } from '../services/imageUrl';

// Admin CRUD for the Home Layout CMS: section visibility/order/settings,
// the editable Explore SmartUAE menu, and "best in UAE" collections.
const router = Router();

router.use(requireAdmin);

// ── Full layout snapshot ──────────────────────────────────────────────────────

router.get('/', async (_req, res, next) => {
  try {
    const [sections, menu, collections, items] = await Promise.all([
      query<any>('SELECT * FROM home_sections ORDER BY sort_order'),
      query<any>('SELECT * FROM home_menu_items ORDER BY sort_order'),
      query<any>('SELECT * FROM home_collections ORDER BY sort_order'),
      query<any>(`SELECT i.*, b.name AS business_name FROM home_collection_items i
                  LEFT JOIN businesses b ON b.id = i.business_id ORDER BY i.sort_order`),
    ]);
    res.json({
      sections: sections.map((s) => ({ ...s, settings: safeParse(s.settings) })),
      menu: menu.map((m) => ({ ...m, imageUrl: m.image ? getImageUrl(m.image, 'home_menu') : null })),
      collections: collections.map((c) => ({
        ...c,
        items: items.filter((i) => i.collection_id === c.id).map((i) => ({
          ...i,
          imageUrl: i.image ? getImageUrl(i.image, 'collections') : null,
        })),
      })),
    });
  } catch (err) { next(err); }
});

function safeParse(s: unknown) {
  try { return JSON.parse(String(s || '{}')); } catch { return {}; }
}

// ── Sections ─────────────────────────────────────────────────────────────────

router.put('/sections/:key', async (req, res, next) => {
  try {
    const { title, is_visible, sort_order, settings } = req.body as any;
    await pool.query(
      'UPDATE home_sections SET title = ?, is_visible = ?, sort_order = ?, settings = ? WHERE section_key = ?',
      [title ?? null, is_visible ? 1 : 0, Number(sort_order) || 0, JSON.stringify(settings ?? {}), req.params.key]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Explore SmartUAE menu items ──────────────────────────────────────────────

router.post('/menu', async (req, res, next) => {
  try {
    const { label, link, icon, image, tone, is_active, sort_order } = req.body as any;
    if (!label || !link) return res.status(400).json({ error: 'label and link are required' });
    const [r]: any = await pool.query(
      'INSERT INTO home_menu_items (label, link, icon, image, tone, is_active, sort_order) VALUES (?,?,?,?,?,?,?)',
      [label, link, icon || null, image || null, tone || 'purple', is_active === false ? 0 : 1, Number(sort_order) || 0]
    );
    res.json({ ok: true, id: r.insertId });
  } catch (err) { next(err); }
});

router.put('/menu/:id', async (req, res, next) => {
  try {
    const { label, link, icon, image, tone, is_active, sort_order } = req.body as any;
    await pool.query(
      'UPDATE home_menu_items SET label=?, link=?, icon=?, image=?, tone=?, is_active=?, sort_order=? WHERE id=?',
      [label, link, icon || null, image || null, tone || 'purple', is_active ? 1 : 0, Number(sort_order) || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/menu/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM home_menu_items WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Collections ──────────────────────────────────────────────────────────────

router.post('/collections', async (req, res, next) => {
  try {
    const { title, is_active, sort_order } = req.body as any;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const [r]: any = await pool.query(
      'INSERT INTO home_collections (title, is_active, sort_order) VALUES (?,?,?)',
      [title, is_active === false ? 0 : 1, Number(sort_order) || 0]
    );
    res.json({ ok: true, id: r.insertId });
  } catch (err) { next(err); }
});

router.put('/collections/:id', async (req, res, next) => {
  try {
    const { title, is_active, sort_order } = req.body as any;
    await pool.query(
      'UPDATE home_collections SET title=?, is_active=?, sort_order=? WHERE id=?',
      [title, is_active ? 1 : 0, Number(sort_order) || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/collections/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM home_collections WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Collection items ─────────────────────────────────────────────────────────

router.post('/collections/:id/items', async (req, res, next) => {
  try {
    const col = await queryOne('SELECT id FROM home_collections WHERE id = ?', [req.params.id]);
    if (!col) return res.status(404).json({ error: 'Collection not found' });
    const { title, description, image, business_id, emirate, latitude, longitude, is_active, sort_order } = req.body as any;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const [r]: any = await pool.query(
      'INSERT INTO home_collection_items (collection_id, title, description, image, business_id, emirate, latitude, longitude, is_active, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [req.params.id, title, description || null, image || null, business_id || null, emirate || null,
       latitude === '' || latitude == null ? null : Number(latitude), longitude === '' || longitude == null ? null : Number(longitude),
       is_active === false ? 0 : 1, Number(sort_order) || 0]
    );
    res.json({ ok: true, id: r.insertId });
  } catch (err) { next(err); }
});

router.put('/items/:id', async (req, res, next) => {
  try {
    const { title, description, image, business_id, emirate, latitude, longitude, is_active, sort_order } = req.body as any;
    await pool.query(
      'UPDATE home_collection_items SET title=?, description=?, image=?, business_id=?, emirate=?, latitude=?, longitude=?, is_active=?, sort_order=? WHERE id=?',
      [title, description || null, image || null, business_id || null, emirate || null,
       latitude === '' || latitude == null ? null : Number(latitude), longitude === '' || longitude == null ? null : Number(longitude),
       is_active ? 1 : 0, Number(sort_order) || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/items/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM home_collection_items WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
