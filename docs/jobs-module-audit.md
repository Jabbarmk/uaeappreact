# Jobs Module Audit — SmartUAE

Date: 2026-09-14
Scope: read-only audit of the existing Jobs module prior to any AI/CV-builder/ATS enhancement work, per `jobs-module-claude-code-prompt.md`.

---

## 1. Existing Jobs Frontend Routes / Pages / Components

| File | Route | Role |
|---|---|---|
| `react-app/src/pages/JobsPage.tsx` | `/jobs` | Public job list + search. Fetches `GET /api/jobs?search=`. Shows hero banner, a "Your Profile / Create CV" promo card, job card grid (company/salary/location/badge). |
| `react-app/src/pages/JobDetailPage.tsx` | `/jobs/:id` | Public job detail. Full description/requirements/benefits. "Apply Now" → `POST /api/user/applications` (redirects to login if unauthenticated). Detects `isOwnJob` via `job.user_id === user.id` and instead shows "View Applicants". Shows "already applied" state. |
| `react-app/src/pages/my/MyJobsPage.tsx` | `/my/jobs` | Logged-in user dashboard: "Posted Jobs" / "Applied Jobs" tabs. Posted jobs show status badge + applicant count. |
| `react-app/src/pages/my/MyJobFormPage.tsx` | `/my/jobs/new`, `/my/jobs/:id/edit` | Post/edit job form. Has a searchable "Company" field that can link to one of the user's own registered `businesses` (`business_id`) or fall back to free-typed company text. Emirate / Work Model selects from `react-app/src/constants/uae.ts`. sessionStorage draft-save when detouring to "+ Add new business". |
| `react-app/src/pages/my/MyJobApplicantsPage.tsx` | `/my/jobs/:id/applicants` | Applicant list for the user's own job. Shows photo/name/experience/notice period/location/visa status/cover letter + link to full CV (`/profile/:profile_id`). **Read-only** — no accept/reject controls. |
| `react-app/src/pages/my/MyCVPage.tsx` | `/my/cv` (CV editor) | Form-based CV builder (not document upload). Reads/writes `GET/PUT /api/user/cv`. Fields: name, title, contact, education, certifications, projects, `TagPicker` for skills/languages, work-experience sub-editor. |
| `react-app/src/pages/ProfilePage.tsx` | `/profile/:id` | Public "Smart CV" read-only viewer. `GET /api/profiles/:id`. |
| `react-app/src/pages/admin/AdminCrudPage.tsx` | `/admin/jobs`, `/admin/profiles` | Admin CRUD screens via `RESOURCE_CONFIGS['jobs']` (line 443) and `RESOURCE_CONFIGS['profiles']` (line 458). |
| `react-app/src/pages/admin/AdminApprovalsPage.tsx` | `/admin/approvals` | Unified moderation queue; includes a `'jobs'` tab among businesses/classifieds/properties/companies/projects/events/reviews. |
| `react-app/src/pages/admin/AdminDashboardPage.tsx` | `/admin` | Shows jobs count / pending count from `GET /api/admin/dashboard`. |
| `HomePage.tsx`, `SearchPage.tsx`, `WelcomeScreen.tsx`, `Header.tsx`, `BottomNav.tsx`, `App.tsx` | various | Navigation entries linking to `/jobs` only — no jobs business logic. |

**Admin jobs form config** (`AdminCrudPage.tsx:443-457`) exposes: `user_id` (user-search), `title`, `company` (plain text), `location`, `job_type` (select), `salary_min/max`, `currency`, `description`, `requirements`, `benefits`, `is_featured`, `is_active`.
**Gap:** it does **not** expose `business_id`, `emirate`, `work_model`, or `status`, even though all four are live DB columns used by the owner-facing flow in `user.ts`.

## 2. Existing Jobs Backend Routes / Controllers / Services

No dedicated jobs controller/service file exists. Logic is split across three route files:

- **`api-server/src/routes/jobs.ts`** — public read API:
  - `GET /api/jobs` — `SELECT * FROM jobs WHERE is_active = 1` (+ optional `search` on title/company/description), ordered `is_featured DESC, posted_at DESC`. Also bundles a single legacy `user_profiles` row (`profile`) used by the frontend promo card.
  - `GET /api/jobs/:id` — single job + same bundled profile.
  - Note: only filters on `is_active`, not `status` — currently safe only because `user.ts` always pairs `status='pending'` with `is_active=0` on insert; not enforced at the query level.

- **`api-server/src/routes/user.ts`** (session-gated via `requireUser`) — owner/candidate-side logic:
  - `GET/POST/PUT /api/user/jobs[/:id]` — post/edit own jobs. `POST` hardcodes `status='pending', is_active=0`; `PUT` resets `status='pending'` on every edit (forces re-moderation).
  - `GET /api/user/jobs/:id/applicants` — applicants to an owned job (`job_applications` ⋈ `users` ⋈ `user_profiles`).
  - `GET /api/user/applied-jobs` — jobs the current user applied to.
  - `POST /api/user/applications` — apply to a job; blocks self-apply and duplicate apply.
  - `GET /api/user/applications/check/:jobId` — has-applied boolean.
  - `GET/PUT /api/user/cv` — read/write own `user_profiles` row.
  - `GET/POST/PUT/DELETE /api/user/work-experience[/:id]` — CRUD on `user_work_experience`.
  - `POST /api/user/skills`, `POST /api/user/languages` — upsert into global tag lists.
  - **Gap:** no route anywhere transitions `job_applications.status` (`pending → shortlisted/rejected`); the enum and UI badge exist, nothing sets it besides the insert default.

- **`api-server/src/routes/admin.ts`**:
  - `router.use('/jobs', crudRoutes('jobs'))` (line 1154) — fully generic paginated CRUD factory (`crudRoutes`, defined lines 171-235). **No field allowlist** — an admin `PUT`/`POST` body can write any real column on `jobs`, including `user_id`/`status`/`is_active`.
  - Dashboard counts (lines 86-130) query `jobs` and `jobs WHERE status='pending'`.
  - Generic upload: `POST /api/admin/upload/:folder` (multer, 10MB, images only) and `POST /api/admin/upload-video/:folder` (60MB, images/video) — reusable for any folder including a future `jobs`/`resumes` folder.

- **`api-server/src/routes/profiles.ts`** — public CV/profile lookup (`GET /api/profiles/:id`), joined to `user_work_experience`.

## 3. Existing Jobs Models

No ORM/models layer exists in this codebase — all access is raw SQL via `mysql2` (`query`/`queryOne` helpers in `api-server/src/db/pool.ts`). "Models" are the table schemas themselves (§5).

## 4. Existing Jobs APIs (full list)

```
GET    /api/jobs
GET    /api/jobs/:id
GET    /api/user/jobs
POST   /api/user/jobs
PUT    /api/user/jobs/:id
GET    /api/user/jobs/:id/applicants
GET    /api/user/applied-jobs
POST   /api/user/applications
GET    /api/user/applications/check/:jobId
GET    /api/user/cv
PUT    /api/user/cv
GET    /api/user/work-experience
POST   /api/user/work-experience
PUT    /api/user/work-experience/:id
DELETE /api/user/work-experience/:id
POST   /api/user/skills
POST   /api/user/languages
GET    /api/profiles/:id
GET    /api/admin/jobs            (generic CRUD: list/paginated/search)
POST   /api/admin/jobs
PUT    /api/admin/jobs/:id
DELETE /api/admin/jobs/:id
GET    /api/admin/profiles        (generic CRUD)
POST/PUT/DELETE /api/admin/profiles[/:id]
GET/POST/PUT/DELETE /api/admin/work-experience[/:id]
POST   /api/admin/upload/:folder        (generic file upload, reusable)
POST   /api/admin/upload-video/:folder  (generic file upload, reusable)
```

## 5. Existing Database Tables Related to Jobs (live schema, verified via `DESCRIBE`/`SHOW CREATE TABLE` against `smartuae`)

**`jobs`** (68 tables exist live; `database.sql`'s checked-in baseline is stale/incomplete — see Note below):
```
id INT PK AUTO_INCREMENT
user_id INT NULL                -- poster (FK-less, references users.id by convention)
title VARCHAR(200)
company VARCHAR(200)            -- free text, NOT a FK
business_id INT NULL            -- optional soft link to `businesses`; NOT a FK constraint; currently 0/103 rows use it
company_logo VARCHAR(500)
salary_min/max DECIMAL(10,2)
currency VARCHAR(10) DEFAULT 'AED'
location VARCHAR(200)
emirate VARCHAR(50) NULL
job_type ENUM('Fulltime','Part Time','Contract','Freelance') DEFAULT 'Fulltime'
work_model ENUM('Remote','Hybrid','On-site') NULL
description/requirements/benefits TEXT
is_featured TINYINT DEFAULT 0
is_active TINYINT DEFAULT 1
status ENUM('pending','approved','rejected') DEFAULT 'approved'
posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```
No `FOREIGN KEY`/`CONSTRAINT` clauses at all (`SHOW CREATE TABLE jobs` confirmed).

**`job_applications`**:
```
id INT PK, job_id INT, user_id INT, cover_letter TEXT,
status ENUM('pending','shortlisted','rejected') DEFAULT 'pending',
applied_at TIMESTAMP,
UNIQUE KEY (job_id, user_id)
```

**`user_profiles`** (the only CV-like table; generic, not jobs-exclusive):
```
id, user_id NULL, full_name, title, photo, email, phone, whatsapp, linkedin,
location, visa_status, notice_period, experience_years, education,
current_company, work_experience, technical_skills, certifications,
education_details, projects, languages, is_active
```

**`user_work_experience`** — structured per-entry job history rows, FK'd to `user_profiles`.

**`skills`, `languages`** — global tag master lists with `usage_count`, used by `TagPicker` on the CV form.

**No `companies`, `candidates`, `resume`, `resume_versions`, `resume_templates`, `application_screening`, `job_trending_metrics`, or `ai_usage_logs` tables exist.** Confirmed via `SHOW TABLES LIKE '%resume%'`, `'%cv%'`, `'%candidate%'`, `'%compan%'` — only `real_estate_companies` exists (unrelated real-estate-domain table).

**Note on schema drift:** `database.sql` (the checked-in baseline, 266 lines) is stale — it omits `jobs.user_id/business_id/emirate/work_model/status`, omits `user_profiles.user_id/visa_status/notice_period`, and omits the `users`, `job_applications`, and `user_work_experience` tables entirely. `migrate2.sql` ("CV/Jobs feature additions") accounts for some of this drift (adds `job_applications`, `skills`, `languages`, ALTERs for `visa_status`/`notice_period`/`business_id`/`work_model`/`emirate`) but not all of it (`jobs.user_id`, `jobs.status`, and the `users` table itself are live but not traceable to any checked-in migration file — likely applied via an untracked deploy script). This audit relies on the **live DB schema** as ground truth, not `database.sql`.

## 6. Existing Job IDs / Application IDs / Statuses (live data snapshot)

- `jobs`: 103 rows (ids 1–103; 100 seeded by `migrate46.sql` + 3 original samples). All currently `status='approved'`, `is_active=1`, `business_id=NULL`.
- `job_applications`: 0 rows.
- `users`: 1 row (`user_type='user'`; no admin/staff rows in this table — admins live separately in `admin_users`).
- `user_profiles`: 2 rows, both legacy/demo (`user_id` is `NULL` on both — no real user has created a CV yet via `PUT /api/user/cv`).

## 7. Existing Company IDs

Not applicable — no `companies` table exists. Job "company" is either free text or (unused so far) a `business_id` pointing at the general-purpose `businesses` directory table.

## 8. Existing CV Tables and APIs

See §5 (`user_profiles`, `user_work_experience`) and §4 (`/api/user/cv`, `/api/user/work-experience`, `/api/profiles/:id`, `/api/admin/profiles`, `/api/admin/work-experience`). This is a **structured/form-based CV only** — there is no document (PDF/DOCX) upload, storage, or parsing anywhere in the codebase (verified: zero matches for "resume" across all `.ts` files in both `api-server` and `react-app`; no resume/cv/candidate tables live).

## 9. Existing Reusable Components / Infrastructure

- `crudRoutes(table, imageFolder?, opts?)` — generic admin CRUD factory (`admin.ts`), used by 15+ resources including jobs and profiles.
- `POST /api/admin/upload/:folder` / `POST /api/admin/upload-video/:folder` — generic multer-based upload, folder param is arbitrary, already the established pattern for every module's images (businesses, welcome slider, etc.) — reusable as-is for a jobs/resumes folder.
- `getImageUrl(filename, folder)` (`services/imageUrl.ts`) — centralized URL resolution, used consistently across jobs/profiles/user/admin routes.
- `TagPicker` component (frontend) — reusable multi-select-with-create-new pattern already wired to `skills`/`languages` global lists; a natural fit for AI-suggested skills later.
- Auth: `requireAdmin` (session `adminId` against `admin_users`), `requireUser` (session `userId` against `users`), `requireAdminOrStaff` (checks `users.user_type` — theoretical, no live staff/admin rows in `users` today). No employer/candidate role distinction exists; any `user_type='user'` account can both post and apply to jobs via the same session.
- No AI/LLM integration of any kind exists yet (zero matches for openai/anthropic/AI_API_KEY/gemini across the repo; no AI service file; no AI-related env var in `.env`/`.env.example`).

## 10. Missing Functionality (relative to the enhancement brief)

- No AI job-description assistant (generate/improve description, responsibilities, qualifications, skills, titles, screening questions, SEO content).
- No job draft/publish/unpublish/archive/duplicate lifecycle beyond the existing `pending/approved/rejected` + `is_active` flags; no expiry date, no application deadline, no vacancy count, no screening-questions field.
- No document-based CV upload/parsing/conversion (upload PDF/DOC/DOCX → AI-parsed → templated CV). Current CV is manual-entry-only.
- No CV templates (ATS vs. Normal design) or CV versioning (`resume_versions`/`resume_templates`/`resume_exports` equivalents).
- No employer ATS screening UI beyond a read-only applicant list — no status-change controls, no AI match score, no recruiter notes, no screening history.
- No job trending/recommended logic beyond `is_featured` + recency ordering — no views/saves/shares metrics table.
- No saved-jobs / job-alerts functionality.
- No advanced job search filters (category, salary range slider, experience level, remote/onsite/hybrid as a *filter* — the field exists on the model but isn't filterable in `GET /api/jobs`).
- Admin jobs CRUD screen doesn't expose `business_id`, `emirate`, `work_model`, `status`.
- No route to change `job_applications.status` (shortlist/reject) despite the enum and UI badge already existing.

## 11. Proposed Changes (high level — see plan below for approval)

Detailed in the implementation plan following this audit. Summary: extend `jobs`/`job_applications` schema conservatively (additive columns only), add new Jobs-only tables for AI logging, screening, trending metrics, and resume versions/templates, add a Jobs-scoped AI service with a mock provider by default, add application-status transition endpoints, enhance the admin jobs form and public search/filter UI, and add a document-upload CV path alongside the existing structured CV (never replacing it).

## 12. New Files Required

See implementation plan.

## 13. New Tables Required

See implementation plan — proposed: `job_trending_metrics`, `application_screening`, `ai_usage_logs`, `resume_versions`, `resume_templates` (only if approved; all additive, no existing table renamed/altered destructively).

## 14. Protected Files/Modules That Must Not Be Changed

Per the brief's protected-modules list, and confirmed by this audit to be genuinely separate from Jobs:
- `admin_users` / `api-server/src/middleware/auth.ts` (admin auth)
- `users` table core columns / `userAuth.ts` (end-user auth) — **may only be read, never altered**, since jobs/applications reference `users.id` by convention
- `businesses` module (`routes/businesses.ts`, `business_*` tables) — jobs only *optionally reads* `business_id`; must not modify business logic itself
- `real_estate_companies`, `realestate.ts` — unrelated, despite the name similarity to "companies"
- `classifieds`, `events`, `offers`, `universities`, `doctors`, `categories`, `homeLayout`, `welcome`, `pages`, `search`, `collections`, `taxonomy` routes/tables
- `crudRoutes` factory and `imageUrl.ts` service — **reused, not modified** (adding jobs-specific behavior must happen via new code, not by changing this shared factory's semantics)
- `skills`/`languages` global tables — reused as-is for AI-suggested skills, not restructured
