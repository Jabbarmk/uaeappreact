import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

const DOCTOR_SELECT = `SELECT d.id, d.business_id, d.specialty_id, d.name, d.photo, d.qualification, d.experience_years,
  d.languages, d.gender, d.rating, d.review_count, d.consultation_fee, d.currency, d.availability, d.distance, d.about,
  d.is_featured, d.is_active,
  b.name AS hospital_name, b.logo AS hospital_logo, b.emirate AS hospital_emirate,
  b.phone AS hospital_phone, b.whatsapp AS hospital_whatsapp, b.website AS hospital_website, b.address AS hospital_address,
  sc.name AS specialty_name, sc.icon AS specialty_icon
  FROM doctors d
  JOIN businesses b ON b.id=d.business_id
  LEFT JOIN business_categories sc ON sc.id=d.specialty_id`;

const mapDoctor = (d: any) => ({
  ...d,
  photoUrl: d.photo ? getImageUrl(d.photo, 'doctors') : null,
  hospitalLogoUrl: getImageUrl(d.hospital_logo, 'businesses'),
});

// ── Hub ──────────────────────────────────────────────────────────────────────
router.get('/', async (_req, res, next) => {
  try {
    const [specialties, featured, emirates] = await Promise.all([
      query<any>(`SELECT bc.id, bc.name, bc.icon,
                    (SELECT COUNT(*) FROM doctors d WHERE d.specialty_id=bc.id AND d.is_active=1) AS doctor_count
                  FROM business_categories bc JOIN main_categories mc ON mc.id=bc.main_category_id
                  WHERE mc.name='Doctors & Specialists' AND bc.is_active=1 ORDER BY bc.sort_order, bc.id`),
      query<any>(`${DOCTOR_SELECT} WHERE d.is_active=1 AND b.is_active=1 ORDER BY d.is_featured DESC, d.rating DESC LIMIT 10`),
      query<any>(`SELECT DISTINCT b.emirate FROM doctors d JOIN businesses b ON b.id=d.business_id WHERE b.emirate IS NOT NULL ORDER BY b.emirate`),
    ]);
    const total = await queryOne<any>('SELECT COUNT(*) AS n FROM doctors WHERE is_active=1');
    res.json({ specialties, featured: featured.map(mapDoctor), emirates: emirates.map((e) => e.emirate), total: total?.n ?? 0 });
  } catch (err) { next(err); }
});

// ── Doctor listing with filters ──────────────────────────────────────────────
router.get('/list', async (req, res, next) => {
  try {
    const { specialty, hospital, emirate, search, available_today, top_rated, sort, page = '1', pageSize = '30' } = req.query as Record<string, string>;
    const where = ['d.is_active=1', 'b.is_active=1'];
    const params: unknown[] = [];
    if (specialty) { where.push('d.specialty_id=?'); params.push(specialty); }
    if (hospital)  { where.push('d.business_id=?'); params.push(hospital); }
    if (emirate)   { where.push('b.emirate=?'); params.push(emirate); }
    if (available_today === '1') where.push("d.availability LIKE 'Available Today%'");
    if (top_rated === '1') where.push('d.rating >= 4.5');
    if (search)    { where.push('(d.name LIKE ? OR sc.name LIKE ? OR b.name LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const whereSql = where.join(' AND ');

    let order = 'd.is_featured DESC, d.rating DESC';
    if (sort === 'fee_low') order = 'd.consultation_fee ASC';
    else if (sort === 'fee_high') order = 'd.consultation_fee DESC';
    else if (sort === 'rating' || top_rated === '1') order = 'd.rating DESC, d.review_count DESC';
    else if (sort === 'experience') order = 'd.experience_years DESC';

    const offset = (Number(page) - 1) * Number(pageSize);
    const totalRow = await queryOne<any>(`SELECT COUNT(*) AS total FROM doctors d JOIN businesses b ON b.id=d.business_id LEFT JOIN business_categories sc ON sc.id=d.specialty_id WHERE ${whereSql}`, params);
    const items = await query<any>(`${DOCTOR_SELECT} WHERE ${whereSql} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);

    let specName = 'Doctors';
    if (specialty) { const s = await queryOne<any>('SELECT name FROM business_categories WHERE id=?', [specialty]); if (s) specName = s.name; }
    res.json({ specName, items: items.map(mapDoctor), total: totalRow?.total ?? 0, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) { next(err); }
});

// ── Doctor detail ────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const d = await queryOne<any>(`${DOCTOR_SELECT} WHERE d.id=? AND d.is_active=1`, [Number(req.params.id)]);
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json({ item: mapDoctor(d) });
  } catch (err) { next(err); }
});

export default router;
