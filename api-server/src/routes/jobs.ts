import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';
import { requireUser } from '../middleware/userAuth';
import {
  generateJobDescription, improveJobDescription, generateResponsibilities,
  generateQualifications, suggestSkills, suggestJobTitles,
  generateScreeningQuestions, generateSeoContent, type JobContext,
} from '../services/jobsAiService';

const router = Router();

const SORT_MAP: Record<string, string> = {
  newest: 'j.posted_at DESC',
  salary: 'j.salary_max DESC',
  relevance: 'j.is_featured DESC, j.posted_at DESC',
};

router.get('/', async (req, res, next) => {
  try {
    const q = req.query as Record<string, string>;
    let sql = 'SELECT j.* FROM jobs j WHERE j.is_active = 1 AND j.status = \'approved\'';
    const params: unknown[] = [];

    if (q.search) {
      sql += ' AND (j.title LIKE ? OR j.company LIKE ? OR j.description LIKE ?)';
      params.push(`%${q.search}%`, `%${q.search}%`, `%${q.search}%`);
    }
    if (q.location) { sql += ' AND j.location LIKE ?'; params.push(`%${q.location}%`); }
    if (q.emirate) { sql += ' AND j.emirate = ?'; params.push(q.emirate); }
    if (q.company) { sql += ' AND j.company LIKE ?'; params.push(`%${q.company}%`); }
    if (q.job_type) { sql += ' AND j.job_type = ?'; params.push(q.job_type); }
    if (q.work_model) { sql += ' AND j.work_model = ?'; params.push(q.work_model); }
    if (q.salary_min) { sql += ' AND j.salary_max >= ?'; params.push(Number(q.salary_min)); }
    if (q.salary_max) { sql += ' AND j.salary_min <= ?'; params.push(Number(q.salary_max)); }
    if (q.featured === '1') { sql += ' AND j.is_featured = 1'; }
    if (q.posted_within_days) { sql += ' AND j.posted_at >= DATE_SUB(NOW(), INTERVAL ? DAY)'; params.push(Number(q.posted_within_days)); }

    sql += ` ORDER BY ${SORT_MAP[q.sort] || SORT_MAP.relevance}`;
    const jobs = await query(sql, params);

    const profile = await queryOne<any>('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');

    res.json({
      jobs,
      profile: profile ? { ...profile, photoUrl: getImageUrl(profile.photo, 'profiles') } : null,
    });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await queryOne<any>('SELECT * FROM jobs WHERE id = ?', [Number(req.params.id)]);
    if (!job) return res.status(404).json({ error: 'Not found' });
    const profile = await queryOne<any>('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');
    const similar = await query<any>(
      `SELECT id, title, company, location, job_type, salary_min, salary_max, currency
       FROM jobs WHERE is_active = 1 AND status = 'approved' AND id != ?
       AND (job_type = ? OR location = ?) ORDER BY is_featured DESC, posted_at DESC LIMIT 6`,
      [job.id, job.job_type, job.location]
    );
    res.json({
      job,
      profile: profile ? { ...profile, photoUrl: getImageUrl(profile.photo, 'profiles') } : null,
      similarJobs: similar,
    });
  } catch (err) { next(err); }
});

// ── AI job-description assistant (logged-in users only; used while posting/editing a job) ──
function ctxFromBody(req: any): JobContext {
  const b = req.body || {};
  return {
    title: b.title, company: b.company, category: b.category, location: b.location,
    jobType: b.jobType || b.job_type, experienceLevel: b.experienceLevel,
    existingDescription: b.description || b.existingDescription,
  };
}

router.post('/ai/generate-description', requireUser, async (req, res, next) => {
  try { res.json(await generateJobDescription(ctxFromBody(req))); } catch (err) { next(err); }
});
router.post('/ai/improve-description', requireUser, async (req, res, next) => {
  try { res.json(await improveJobDescription(ctxFromBody(req))); } catch (err) { next(err); }
});
router.post('/ai/generate-responsibilities', requireUser, async (req, res, next) => {
  try { res.json(await generateResponsibilities(ctxFromBody(req))); } catch (err) { next(err); }
});
router.post('/ai/generate-qualifications', requireUser, async (req, res, next) => {
  try { res.json(await generateQualifications(ctxFromBody(req))); } catch (err) { next(err); }
});
router.post('/ai/suggest-skills', requireUser, async (req, res, next) => {
  try { res.json(await suggestSkills(ctxFromBody(req))); } catch (err) { next(err); }
});
router.post('/ai/suggest-titles', requireUser, async (req, res, next) => {
  try { res.json(await suggestJobTitles(ctxFromBody(req))); } catch (err) { next(err); }
});
router.post('/ai/generate-screening-questions', requireUser, async (req, res, next) => {
  try { res.json(await generateScreeningQuestions(ctxFromBody(req))); } catch (err) { next(err); }
});
router.post('/ai/generate-seo', requireUser, async (req, res, next) => {
  try { res.json(await generateSeoContent(ctxFromBody(req))); } catch (err) { next(err); }
});

export default router;
