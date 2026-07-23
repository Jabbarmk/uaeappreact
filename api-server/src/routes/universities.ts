import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();
const B = 'businesses';

const mapUni = (u: any) => ({ ...u, logoUrl: getImageUrl(u.logo, B), imageUrl: getImageUrl(u.image, B) });

// A "university" is a business that has a university_profiles row.
const UNI_SELECT = `SELECT b.id, b.name, b.logo, b.image, b.tagline, b.about, b.description,
  b.emirate, b.address, b.phone, b.whatsapp, b.email, b.website, b.rating, b.established_year,
  up.institution_type_id, up.ranking, up.campus_size, it.name AS institution_type, it.icon AS institution_icon
  FROM businesses b
  JOIN university_profiles up ON up.business_id=b.id
  LEFT JOIN institution_types it ON it.id=up.institution_type_id`;

const courseCount = `(SELECT COUNT(*) FROM university_courses uc WHERE uc.business_id=b.id AND uc.is_active=1) AS course_count`;

// An "offering" = university_courses row + its catalog course + its university.
const OFFERING_SELECT = `SELECT uc.id, uc.business_id, uc.course_id, uc.total_fee, uc.fee_per_year, uc.currency,
  uc.study_mode, uc.delivery, uc.location, uc.emirate, uc.intake, uc.eligibility, uc.application_deadline,
  uc.accreditation, uc.scholarships, uc.is_featured, uc.is_active,
  c.name AS name, c.specialisation, c.duration, c.description, c.image, c.course_category_id, c.study_level_id,
  cc.name AS category_name, cc.icon AS category_icon, sl.name AS level_name, sl.icon AS level_icon, sl.sort_order AS level_sort,
  b.id AS university_id, b.name AS university_name, b.logo AS university_logo
  FROM university_courses uc
  JOIN courses c ON c.id=uc.course_id
  JOIN businesses b ON b.id=uc.business_id
  LEFT JOIN course_categories cc ON cc.id=c.course_category_id
  LEFT JOIN study_levels sl ON sl.id=c.study_level_id
  LEFT JOIN university_profiles up ON up.business_id=b.id`;

// Course image comes from the catalog course; null image → frontend shows the fallback icon.
const mapOffering = (o: any) => ({ ...o, imageUrl: o.image ? getImageUrl(o.image, 'courses') : null, universityLogoUrl: getImageUrl(o.university_logo, B) });

// ── Hub ──────────────────────────────────────────────────────────────────────
router.get('/', async (_req, res, next) => {
  try {
    const [institutionTypes, courseCategories, studyLevels, universities, featuredCourses] = await Promise.all([
      query('SELECT * FROM institution_types WHERE is_active=1 ORDER BY sort_order, id'),
      query('SELECT * FROM course_categories WHERE is_active=1 ORDER BY sort_order, id'),
      query('SELECT * FROM study_levels WHERE is_active=1 ORDER BY sort_order, id'),
      query<any>(`${UNI_SELECT.replace('b.rating,', `b.rating, ${courseCount},`)}
                  WHERE b.is_active=1 AND b.status='approved' ORDER BY b.rating DESC, b.id`),
      query<any>(`${OFFERING_SELECT} WHERE uc.is_active=1 AND uc.is_featured=1 AND b.is_active=1 ORDER BY uc.created_at DESC LIMIT 8`),
    ]);
    res.json({
      institutionTypes, courseCategories, studyLevels,
      universities: (universities as any[]).map(mapUni),
      featuredCourses: (featuredCourses as any[]).map(mapOffering),
    });
  } catch (err) { next(err); }
});

// ── University listing (filter by institution type + search) ─────────────────
router.get('/list', async (req, res, next) => {
  try {
    const { institution_type, search, page = '1', pageSize = '25' } = req.query as Record<string, string>;
    const where = ["b.is_active=1", "b.status='approved'"];
    const params: unknown[] = [];
    if (institution_type) { where.push('up.institution_type_id=?'); params.push(institution_type); }
    if (search) { where.push('(b.name LIKE ? OR b.about LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    const whereSql = where.join(' AND ');
    const offset = (Number(page) - 1) * Number(pageSize);
    const totalRow = await queryOne<any>(`SELECT COUNT(*) AS total FROM businesses b JOIN university_profiles up ON up.business_id=b.id WHERE ${whereSql}`, params);
    const items = await query<any>(
      `${UNI_SELECT.replace('b.rating,', `b.rating, ${courseCount},`)} WHERE ${whereSql} ORDER BY b.rating DESC, b.id LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    res.json({ items: items.map(mapUni), total: totalRow?.total ?? 0, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) { next(err); }
});

// ── Course browse (global — each result is a university offering) ────────────
router.get('/courses', async (req, res, next) => {
  try {
    const { course_category, study_level, institution_type, emirate, university, search, page = '1', pageSize = '30' } = req.query as Record<string, string>;
    const where = ['uc.is_active=1', 'b.is_active=1'];
    const params: unknown[] = [];
    if (course_category)  { where.push('c.course_category_id=?'); params.push(course_category); }
    if (study_level)      { where.push('c.study_level_id=?'); params.push(study_level); }
    if (institution_type) { where.push('up.institution_type_id=?'); params.push(institution_type); }
    if (emirate)          { where.push('uc.emirate=?'); params.push(emirate); }
    if (university)       { where.push('uc.business_id=?'); params.push(university); }
    if (search)           { where.push('(c.name LIKE ? OR c.specialisation LIKE ? OR b.name LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const whereSql = where.join(' AND ');
    const offset = (Number(page) - 1) * Number(pageSize);

    const totalRow = await queryOne<any>(
      `SELECT COUNT(*) AS total FROM university_courses uc JOIN courses c ON c.id=uc.course_id JOIN businesses b ON b.id=uc.business_id LEFT JOIN university_profiles up ON up.business_id=b.id WHERE ${whereSql}`, params
    );
    const items = await query<any>(
      `${OFFERING_SELECT} WHERE ${whereSql} ORDER BY uc.is_featured DESC, uc.created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    res.json({ items: items.map(mapOffering), total: totalRow?.total ?? 0, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) { next(err); }
});

// ── Course (offering) detail ─────────────────────────────────────────────────
router.get('/courses/:id', async (req, res, next) => {
  try {
    const o = await queryOne<any>(
      `${OFFERING_SELECT.replace('b.id AS university_id, b.name AS university_name, b.logo AS university_logo',
        'b.id AS university_id, b.name AS university_name, b.logo AS university_logo, b.phone, b.whatsapp, b.email, b.website, b.emirate AS university_emirate')}
       WHERE uc.id=? AND uc.is_active=1`,
      [Number(req.params.id)]
    );
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json({ item: mapOffering(o) });
  } catch (err) { next(err); }
});

// ── University detail (info + offered courses grouped by study level) ────────
router.get('/:id', async (req, res, next) => {
  try {
    const uni = await queryOne<any>(`${UNI_SELECT} WHERE b.id=? AND b.is_active=1`, [Number(req.params.id)]);
    if (!uni) return res.status(404).json({ error: 'Not found' });

    const courses = await query<any>(
      `${OFFERING_SELECT} WHERE uc.business_id=? AND uc.is_active=1 ORDER BY sl.sort_order, c.name`,
      [uni.id]
    );

    const groupsMap = new Map<string, any>();
    for (const c of courses) {
      const key = c.study_level_id || 0;
      if (!groupsMap.has(String(key))) groupsMap.set(String(key), { levelId: c.study_level_id, level: c.level_name || 'Other', icon: c.level_icon, sort: c.level_sort ?? 999, items: [] });
      groupsMap.get(String(key)).items.push(mapOffering(c));
    }
    const levelGroups = [...groupsMap.values()].sort((a, b) => a.sort - b.sort);
    const categories = [...new Map(courses.filter((c) => c.course_category_id).map((c) => [c.course_category_id, { id: c.course_category_id, name: c.category_name, icon: c.category_icon }])).values()];

    res.json({ university: mapUni(uni), levelGroups, categories, courseCount: courses.length });
  } catch (err) { next(err); }
});

export default router;
