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

const courseCount = '(SELECT COUNT(*) FROM courses c WHERE c.business_id=b.id AND c.is_active=1) AS course_count';

// ── Hub ──────────────────────────────────────────────────────────────────────
router.get('/', async (_req, res, next) => {
  try {
    const [institutionTypes, courseCategories, studyLevels, universities, featuredCourses] = await Promise.all([
      query('SELECT * FROM institution_types WHERE is_active=1 ORDER BY sort_order, id'),
      query('SELECT * FROM course_categories WHERE is_active=1 ORDER BY sort_order, id'),
      query('SELECT * FROM study_levels WHERE is_active=1 ORDER BY sort_order, id'),
      query<any>(`${UNI_SELECT.replace('b.rating,', `b.rating, ${courseCount},`)}
                  WHERE b.is_active=1 AND b.status='approved' ORDER BY b.rating DESC, b.id`),
      query<any>(`SELECT c.*, b.name AS university_name, b.logo AS university_logo, cc.name AS category_name, cc.icon AS category_icon, sl.name AS level_name, sl.icon AS level_icon
                  FROM courses c JOIN businesses b ON b.id=c.business_id
                  LEFT JOIN course_categories cc ON cc.id=c.course_category_id
                  LEFT JOIN study_levels sl ON sl.id=c.study_level_id
                  WHERE c.is_active=1 AND c.is_featured=1 AND b.is_active=1 ORDER BY c.created_at DESC LIMIT 8`),
    ]);
    res.json({
      institutionTypes, courseCategories, studyLevels,
      universities: (universities as any[]).map(mapUni),
      featuredCourses: (featuredCourses as any[]).map((c) => ({ ...c, universityLogoUrl: getImageUrl(c.university_logo, B) })),
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

// ── Course browse (global, cross-university) ─────────────────────────────────
router.get('/courses', async (req, res, next) => {
  try {
    const { course_category, study_level, institution_type, emirate, university, search, page = '1', pageSize = '30' } = req.query as Record<string, string>;
    const where = ['c.is_active=1', 'b.is_active=1'];
    const params: unknown[] = [];
    if (course_category)  { where.push('c.course_category_id=?'); params.push(course_category); }
    if (study_level)      { where.push('c.study_level_id=?'); params.push(study_level); }
    if (institution_type) { where.push('up.institution_type_id=?'); params.push(institution_type); }
    if (emirate)          { where.push('c.emirate=?'); params.push(emirate); }
    if (university)       { where.push('c.business_id=?'); params.push(university); }
    if (search)           { where.push('(c.name LIKE ? OR c.specialisation LIKE ? OR b.name LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const whereSql = where.join(' AND ');
    const offset = (Number(page) - 1) * Number(pageSize);

    const totalRow = await queryOne<any>(
      `SELECT COUNT(*) AS total FROM courses c JOIN businesses b ON b.id=c.business_id LEFT JOIN university_profiles up ON up.business_id=b.id WHERE ${whereSql}`, params
    );
    const items = await query<any>(
      `SELECT c.*, b.name AS university_name, b.logo AS university_logo, cc.name AS category_name, cc.icon AS category_icon, sl.name AS level_name, sl.icon AS level_icon
       FROM courses c JOIN businesses b ON b.id=c.business_id
       LEFT JOIN university_profiles up ON up.business_id=b.id
       LEFT JOIN course_categories cc ON cc.id=c.course_category_id
       LEFT JOIN study_levels sl ON sl.id=c.study_level_id
       WHERE ${whereSql} ORDER BY c.is_featured DESC, c.created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    res.json({ items: items.map((c) => ({ ...c, universityLogoUrl: getImageUrl(c.university_logo, B) })), total: totalRow?.total ?? 0, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) { next(err); }
});

// ── Course detail ────────────────────────────────────────────────────────────
router.get('/courses/:id', async (req, res, next) => {
  try {
    const c = await queryOne<any>(
      `SELECT c.*, cc.name AS category_name, cc.icon AS category_icon, sl.name AS level_name, sl.icon AS level_icon,
              b.id AS university_id, b.name AS university_name, b.logo AS university_logo, b.phone, b.whatsapp, b.email, b.website, b.emirate AS university_emirate
       FROM courses c JOIN businesses b ON b.id=c.business_id
       LEFT JOIN course_categories cc ON cc.id=c.course_category_id
       LEFT JOIN study_levels sl ON sl.id=c.study_level_id
       WHERE c.id=? AND c.is_active=1`,
      [Number(req.params.id)]
    );
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json({ item: { ...c, universityLogoUrl: getImageUrl(c.university_logo, B) } });
  } catch (err) { next(err); }
});

// ── University detail (info + courses grouped by study level) ────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const uni = await queryOne<any>(`${UNI_SELECT} WHERE b.id=? AND b.is_active=1`, [Number(req.params.id)]);
    if (!uni) return res.status(404).json({ error: 'Not found' });

    const courses = await query<any>(
      `SELECT c.*, cc.name AS category_name, cc.icon AS category_icon, sl.name AS level_name, sl.icon AS level_icon, sl.sort_order AS level_sort
       FROM courses c
       LEFT JOIN course_categories cc ON cc.id=c.course_category_id
       LEFT JOIN study_levels sl ON sl.id=c.study_level_id
       WHERE c.business_id=? AND c.is_active=1 ORDER BY sl.sort_order, c.name`,
      [uni.id]
    );

    // Group by study level for the hierarchy view.
    const groupsMap = new Map<string, any>();
    for (const c of courses) {
      const key = c.study_level_id || 0;
      if (!groupsMap.has(String(key))) groupsMap.set(String(key), { levelId: c.study_level_id, level: c.level_name || 'Other', icon: c.level_icon, sort: c.level_sort ?? 999, items: [] });
      groupsMap.get(String(key)).items.push(c);
    }
    const levelGroups = [...groupsMap.values()].sort((a, b) => a.sort - b.sort);
    const categories = [...new Map(courses.filter((c) => c.course_category_id).map((c) => [c.course_category_id, { id: c.course_category_id, name: c.category_name, icon: c.category_icon }])).values()];

    res.json({ university: mapUni(uni), levelGroups, categories, courseCount: courses.length });
  } catch (err) { next(err); }
});

export default router;
