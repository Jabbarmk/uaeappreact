PHP → React Conversion Prompt (Claude Code CLI / VS Code)
🎯 Role
You are a senior full-stack engineer. Your job is to convert all PHP pages in the current working directory (and its subfolders) into a modern React application without changing the user experience, visual design, or backend behavior.
📂 Scope
Source: All `.php` files in the current path folder (recursive).
Target: A new React frontend living in `./react-app/` (or `./frontend/` if that name is taken) plus a new Node.js/Express backend at `./api-server/` that replaces the PHP backend.
Final state: Zero PHP files remain in the folder. All PHP logic (data fetching, auth, DB queries, form processing) is ported to the new Node.js API. The original PHP files exist only temporarily during migration as reference, and are deleted in the final cleanup step.
🔒 Strict Constraints (DO NOT VIOLATE)
Pixel-perfect parity — the rendered React pages must look visually identical to the original PHP pages. Same layout, same spacing, same fonts, same colors, same hover states, same responsive breakpoints.
Do NOT modify or replace any image, icon, logo, font file, or static asset. Reuse the exact same files (copy or reference them).
Do NOT redesign, "improve," or "modernize" the UI. No new component libraries (no MUI, no Ant Design, no Bootstrap 5 swap-ins) unless the original PHP already used them — in that case, match the same version.
Port the backend faithfully — do not invent new behavior. Every PHP endpoint's input contract, output shape, status codes, error messages, validation rules, auth checks, and side effects must be reproduced exactly in the new Node.js API. If unsure how a PHP function behaves, read it carefully or ask before guessing.
Do NOT change URLs the user sees unless explicitly required by React Router. Preserve route paths (`/login`, `/dashboard`, `/products/123`, etc.).
Do NOT change form field names, validation rules, error messages, or success flows.
Preserve all JavaScript behavior already present in the PHP pages (jQuery snippets, vanilla JS, AJAX calls) — port the behavior faithfully into React.
Delete PHP files only in Step 6 after all pre-checks pass automatically (tests green, parity verified, git commit and tarball backup created). The deletion is destructive but recoverable from the backup; do not delete earlier than Step 6.
🛠️ Required Stack
Frontend (`./react-app/`)
React 18 with Vite + TypeScript
React Router v6 for routing
Axios (or `fetch`) for API calls to the new Node backend
CSS: copy the existing CSS/SCSS files exactly. Import them per-page or globally to match the original cascade. Do NOT convert to Tailwind, CSS-in-JS, or CSS Modules unless the original used them.
Backend (`./api-server/`)
Node.js 20+ with Express + TypeScript
Database driver matching the PHP code (e.g., `mysql2` if PHP used MySQLi/PDO-MySQL, `pg` for PostgreSQL). Reuse the same DB, same schema, same credentials via `.env`.
`bcrypt` if PHP used `password_hash` / `password_verify` — same hash format, no password resets needed.
`express-session` + `connect-*` session store to replicate PHP session behavior, OR JWT — match whichever the PHP app used.
`multer` for file uploads if any PHP page used `$_FILES`.
`zod` or `joi` for input validation (rules ported one-for-one from PHP validation logic).
Testing
Vitest + React Testing Library for frontend unit/component tests
Jest or Vitest + supertest for backend API tests
Playwright for end-to-end smoke tests
🚀 Performance Requirements (mandatory — performance is a feature, not a nice-to-have)
The new app must be measurably faster than the PHP original, especially for data-heavy pages and image rendering. The user-facing look and behavior do not change, only how things are delivered.
Performance budgets (must be met before sign-off)
Metric	Target
Lighthouse Performance score (mobile)	≥ 90
Largest Contentful Paint (LCP)	≤ 2.0s on 4G
First Input Delay / Interaction to Next Paint	≤ 100ms
Cumulative Layout Shift (CLS)	≤ 0.05
Time to Interactive (TTI)	≤ 3.0s on 4G
Initial JS bundle (gzipped)	≤ 200 KB
API p95 response time (cached)	≤ 50ms
API p95 response time (uncached)	≤ 300ms
Image p95 response time (cached)	≤ 30ms
Frontend performance rules
Route-level code splitting with `React.lazy` + `Suspense` — each page is its own chunk.
Vendor chunk splitting in Vite config so React, Router, and Axios cache independently of app code.
Server-driven data fetching with TanStack Query (React Query) — caching, deduplication, stale-while-revalidate, background refetch, request cancellation.
Virtualize long lists (>100 rows) with `@tanstack/react-virtual`. Tables, dropdowns with many options, comment threads — anything that previously dumped the whole list into the DOM in PHP.
Lazy-load images with `loading="lazy"` and `decoding="async"` on every `<img>` tag, except above-the-fold hero images which use `fetchpriority="high"`.
Reserve image space with explicit `width` and `height` (or aspect-ratio CSS) to keep CLS at zero. The visual size stays identical to the PHP version.
Prefetch likely-next routes on link hover (`<Link prefetch>`).
Memoize expensive renders with `React.memo`, `useMemo`, `useCallback` — but only where the React DevTools profiler shows a measurable gain. No defensive memoization.
Use React 18 `useTransition` / `useDeferredValue` for filter/search/sort interactions to keep typing smooth on large datasets.
Preconnect to the API origin and any font CDN in `<head>`.
Compress and modern-format fonts — woff2 only, `font-display: swap`, subset to the languages used.
Build assets with content hashes for long-term `Cache-Control: max-age=31536000, immutable`.
Backend performance rules
Database connection pool (mysql2/pg pool, size ≈ 2 × CPU cores). No per-request connection.
Replace SELECT * with explicit column lists matching what the page actually renders.
Index audit — for every query ported from PHP, check that the columns in `WHERE`, `JOIN`, and `ORDER BY` are indexed. Generate a `migrations/performance-indexes.sql` file with idempotent `CREATE INDEX IF NOT EXISTS` statements for any missing indexes and apply it automatically against the configured database. Log each index created in `MIGRATION_REPORT.md`.
Pagination by default on every list endpoint: `?page`, `?pageSize` (default 25, max 100). Return `{ data, total, page, pageSize }`. If the PHP page rendered "all rows," still paginate the API but have the React component request enough pages to fill the original UX.
N+1 elimination — collapse loops that fire one query per row into single `IN (...)` queries or JOINs.
Server-side filtering, sorting, and search — never ship a large dataset to the browser to filter client-side.
Response caching with Redis (or in-memory LRU as a fallback for dev) for read-heavy endpoints. Cache key = endpoint + sorted query params + auth scope. Default TTL 60s, invalidated on related write.
HTTP cache headers — `ETag` + `Cache-Control: private, max-age=...` on GET endpoints. Honor `If-None-Match` and return `304` when unchanged.
gzip/brotli compression via `compression` middleware for all JSON responses > 1 KB.
Streaming JSON for very large exports — never buffer megabytes in memory.
Prepared statements everywhere — both for security and for query plan caching.
Slow query log — log any query > 100ms with the SQL and parameters for review.
Image pipeline (since you specifically called out DB-stored images)
If the PHP app stores images in the database (BLOB columns) — common in legacy systems — the following is mandatory. The original images in the DB are not modified. The pipeline only changes how they are served.
Single image endpoint in Node: `GET /api/images/:id?w=&h=&fmt=` that:
Streams the BLOB from the DB using row streaming (`mysql2.createConnection().query().stream()` or `pg-query-stream`) — never loads the full BLOB into memory.
Pipes through `sharp` for on-the-fly resize/compress/format conversion.
Negotiates WebP/AVIF based on the `Accept` header; falls back to the original format for older browsers. Visual output is identical to the human eye — only encoding changes.
Sends `Cache-Control: public, max-age=31536000, immutable` and a strong `ETag` (hash of `id + width + format + version`).
Honors `If-None-Match` and returns `304` immediately on cache hits.
Two-tier cache:
Tier 1 (hot): in-memory LRU (e.g., `lru-cache`) holding the most-requested 500 rendered variants.
Tier 2 (warm): filesystem cache at `./api-server/cache/images/<id>/<width>.<fmt>` written on first render, served via `sendFile` thereafter. Bypasses DB entirely on cache hit.
Cache invalidation: when an image row is updated, bump a `version` column and include it in the cache key so old variants are naturally orphaned (cleaned up by a cron).
Responsive variants — the React `<img>` uses `srcset` and `sizes` so the browser picks the right size for the viewport. Generate `w=320, 640, 960, 1280, 1920` on demand. The displayed size, position, and styling remain identical to PHP.
BLOB storage stays as-is for this migration. The DB remains the source of truth for image bytes during this run. The pipeline above is fast enough to meet the budget without restructuring storage. Migration of BLOBs out of the database is documented in the Future Improvements section and is not part of this run.
Lazy loading — every `<img>` gets `loading="lazy"` (above-the-fold images get `fetchpriority="high"` instead) and `decoding="async"`. Reserved dimensions prevent layout shift.
Preload the LCP image on each page: `<link rel="preload" as="image" href="..." imagesrcset="..." imagesizes="...">`.
📋 Step-by-Step Plan (execute in order, confirm each step)
Step 1 — Discovery & Inventory
Recursively list every `.php` file in the current folder.
For each file, classify it as one of:
Page (renders HTML to the browser) → becomes a React route/component
Partial/Include (header, footer, sidebar) → becomes a React component
API/AJAX endpoint (returns JSON / processes form POST) → ports to a Node Express route
Asset/Config (db connection, helpers) → ports to Node config / service module
Save a table to `MIGRATION_INVENTORY.md`: `file path | type | target React component name | target route`.
Proceed immediately to Step 2 — do not pause.
Step 2 — Scaffold Frontend & Backend
Create `./react-app/` with Vite + React + TypeScript.
Create `./api-server/` with Express + TypeScript, structured as:
```
   api-server/
     src/
       routes/        # one file per logical PHP endpoint group
       controllers/
       middleware/    # auth, session, CSRF, error handler
       db/            # connection pool, query helpers
       services/      # business logic ported from PHP
       validators/    # zod/joi schemas
       app.ts
       server.ts
     tests/
     .env.example
   ```
Set up React Router with one route per PHP page from Step 1.
Configure Vite proxy so `/api/*` routes to the local Node API server during development.
Copy `images/`, `css/`, `fonts/`, and other static folders from the PHP project into `react-app/public/` — preserve exact filenames and paths.
Do NOT delete the original PHP files yet. They remain in place as a reference until Step 7.
Step 3 — Convert Pages (one at a time)
For each PHP page:
Open the PHP file. Identify three layers:
PHP server-side logic (data fetching, auth checks, DB queries, form processing, file uploads, session reads/writes) → port to a new Node.js Express route under `./api-server/src/routes/`. Same input contract, same output JSON shape, same status codes, same error messages — but apply the Backend performance rules (pagination, indexes, caching, prepared statements, no SELECT *).
HTML markup → ports to JSX verbatim (only attribute changes: `class` → `className`, `for` → `htmlFor`, self-closing tags, inline `style` → JS object). Add `loading="lazy"`, `decoding="async"`, and explicit `width`/`height` on every `<img>` — these do not change the visible result.
Inline JS / jQuery → re-implement as React state, effects, and handlers — same behavior, same DOM outcomes. Wrap data fetching in TanStack Query (`useQuery` / `useMutation`).
For DB queries: port the SQL (parameterized) into the Node service layer, but trim `SELECT *` to the columns actually used and add `LIMIT/OFFSET` pagination. Behavior must match — the page shows the same rows in the same order — but the network payload is leaner.
For auth/session: replicate PHP `$_SESSION` semantics in Express sessions. If the PHP app used `password_hash`, use `bcrypt.compare` against the same DB hash — existing user passwords must continue to work without resets.
For images served from the DB: route the React `<img src>` to the new `/api/images/:id` endpoint with `srcset` for responsive sizes. Same visual result, dramatically faster.
Use `useEffect` + TanStack Query in the React page to call the new Node endpoint.
Re-import the exact same CSS file the original page used. No style edits.
Compare the rendered React page to the original PHP page side-by-side at the same viewport width. They must match.
Run Lighthouse on the new page and confirm it meets the performance budget. If not, profile and fix before moving on.
Keep the original PHP file in place during this step — it is a reference only and is removed in Step 7.
Step 4 — Forms & Auth
Replicate every form: same fields, same names, same validation, same submit behavior.
The React app posts to the new Node API endpoints; cookies/sessions handled by `express-session` to mirror PHP's `$_SESSION` lifecycle.
If PHP used CSRF tokens, implement equivalent CSRF protection in Express (e.g., `csurf` or double-submit cookie) — same token field name on the form.
File uploads: replicate `$_FILES` handling using `multer` with the same field names and size/type limits.
Step 5 — Testing (mandatory)
Frontend unit/component tests (Vitest + RTL) for every converted page:
Page renders without crashing
All key elements present (headings, buttons, form fields)
Form submission calls the correct API endpoint with the correct payload
Loading and error states render correctly
Mock the API with MSW (Mock Service Worker).
Backend API tests (Vitest/Jest + supertest) for every Node endpoint:
Happy path returns expected JSON shape and status code
Validation errors match the original PHP error messages
Auth-protected routes reject unauthenticated requests with the same status code PHP returned
DB interactions tested against a test database or with a query mock
Parity tests (critical): for at least 5 representative endpoints, hit the original PHP endpoint and the new Node endpoint with identical inputs and assert the JSON responses are deeply equal (or document any intentional differences).
E2E smoke tests (Playwright) covering: login → main navigation → one full happy-path flow per major page.
Visual regression check: screenshot the original PHP pages and the new React pages at 1920×1080, 1366×768, and 375×667. Diff them. Flag any mismatch ≥ 2px.
Performance tests (mandatory — must pass before Step 6 cleanup):
Lighthouse CI runs on every page; fails the build if any score drops below the budget in the Performance Requirements table.
Backend load test with k6 or autocannon on the top 5 endpoints (by expected traffic): 50 virtual users for 30 seconds. Record p50/p95/p99 latency and throughput. Compare to the same test against the original PHP endpoints. The Node version must be at least as fast at p95 — ideally faster.
Image endpoint stress test: request 500 different image variants in parallel, verify cache hit rate climbs to >90% on the second pass and p95 stays under 30ms when cached.
Bundle size check with `vite-bundle-visualizer` — fail if initial JS exceeds the 200 KB gzipped budget.
All tests must pass. Report counts: `X/X frontend tests, Y/Y backend tests, Z/Z E2E tests, A/A perf tests passing` plus the Lighthouse scores and load-test latency table for every page.
Step 6 — Cleanup: Remove PHP
Execute this step automatically once all pre-checks pass. Do not pause for confirmation.
Pre-checks (must all evaluate `true` programmatically before proceeding — if any fails, fix the failing item and retry; do not skip):
[ ] All acceptance criteria from the list below are met.
[ ] All tests pass (frontend, backend, E2E, performance).
[ ] Visual regression diffs are ≤ 2px on every page.
[ ] At least 5 parity tests confirm Node endpoints return data equivalent to PHP endpoints.
[ ] Lighthouse, load-test, and image-cache benchmarks all meet the budgets.
[ ] A full git commit of the current state has been made on a branch named `php-to-react-migration`. If the folder is not a git repo, initialize one and commit before deleting anything.
[ ] A timestamped backup archive `_php-backup-YYYYMMDD-HHMMSS.tar.gz` of all PHP files and PHP-only assets has been created at the project root.
Cleanup actions (run in order, automatically):
Inventory pass — write to `CLEANUP_MANIFEST.md` every reference to PHP that will be removed:
All `.php` files in the folder (recursive)
`composer.json`, `composer.lock`, `vendor/` (if present)
`.htaccess` rules that route to PHP
`phpinfo`, `php.ini`, `.user.ini` files
Any `index.php` entry points
Apache/Nginx config snippets in the project that mention PHP-FPM
Hardcoded `.php` URLs in JS, CSS, HTML, or markdown files (search for `\.php` across all remaining files)
References in `README.md`, deployment scripts, Dockerfiles, `docker-compose.yml`, CI/CD configs (`.github/workflows/`, `.gitlab-ci.yml`)
`.gitignore` entries specific to PHP
PHP-only environment variables in `.env` files
Execute the deletions:
Delete every `.php` file.
Remove `vendor/`, `composer.*`.
Update `.htaccess` (or delete if it only existed for PHP) — replace with React Router-friendly rewrites that send all non-asset requests to `index.html`.
Update Dockerfile / docker-compose to drop the PHP-FPM and Apache/Nginx-PHP services; add Node service for `api-server` and a static-serve or nginx service for the built React app.
Update CI/CD configs: remove PHP install/test steps, add Node install/build/test steps for both `react-app` and `api-server`.
Update `README.md`: remove PHP setup instructions, replace with Node + React instructions.
Find-and-replace all `.php` URL references in remaining code with the new Node API paths.
Remove PHP-only env variables; add Node/DB env variables to `.env.example`.
Run all tests again (frontend, backend, E2E, performance) to confirm nothing broke after cleanup. If anything fails, fix it autonomously and re-run until green.
Run a final scan: `grep -r -i "php" .` (excluding `node_modules`, `.git`, and the backup archive) and append every remaining match to `MIGRATION_REPORT.md`. For each match, either remove it (if a real PHP reference) or note it as a documented false positive.
Commit the cleanup as a separate git commit titled `chore: remove PHP backend after React migration`.
Step 7 — Deliverables
At the end, produce:
A `MIGRATION_REPORT.md` with: files converted, routes mapped, Node API endpoints created, indexes added, test results, visual diff results, performance benchmark results (Lighthouse, k6, image cache), and the cleanup summary.
A `README.md` at the project root with: project overview, how to install and run both `react-app` and `api-server`, how to run tests, how to build for production, environment variable list, and deployment notes.
A `.env.example` in both `react-app/` (API base URL) and `api-server/` (DB, session secret, port, Redis URL).
The path to the backup archive (`_php-backup-YYYYMMDD-HHMMSS.tar.gz`).
A `FUTURE_IMPROVEMENTS.md` document (see template below) listing recommended follow-up work that is out of scope for this migration.
🛣️ Future Improvements (write this file at the end — do NOT execute any of it)
Generate `FUTURE_IMPROVEMENTS.md` containing the following items as recommended follow-up projects. These are intentionally excluded from the current migration:
1. Migrate image BLOBs out of the database into object storage
Why: For legacy systems with images stored as MySQL/PostgreSQL BLOB columns, moving them to object storage (S3, MinIO, Cloudflare R2, Azure Blob) or even local disk with paths in the DB is typically the single biggest long-term performance and cost win after the framework migration. BLOBs bloat database size, slow down backups, complicate replication, and force every image fetch to hit the DB even with a cache layer in front.
What it would involve:
Write a one-shot migration script that streams every image row out of the DB, computes a content hash, writes it to object storage at `images/<hash>.<ext>`, and updates the row to store the path/URL instead of the bytes.
Add a new column (e.g., `storage_path VARCHAR(255)`) alongside the existing BLOB column. Backfill it. Switch the API to read from `storage_path` first, falling back to BLOB during transition.
Once verified, drop the BLOB column in a separate migration and reclaim the disk space (`OPTIMIZE TABLE` for MySQL, `VACUUM FULL` for PostgreSQL).
Update the image endpoint to either redirect to a signed URL (if using cloud storage) or serve directly from local disk via `sendFile` — the in-memory and filesystem caches built in this migration can be dropped at that point.
Why it's deferred: It's an architectural change with its own backup, rollback, and testing concerns. It also depends on infrastructure decisions (which storage provider, what region, signed URL strategy, CDN in front) that should be made separately.
Estimated effort: 1-3 days depending on image volume and storage choice.
2. Add a CDN in front of the React build and image endpoint
Cloudflare, Fastly, or CloudFront in front of the static React assets and the `/api/images/*` endpoint will offload most read traffic from the origin and bring p95 image delivery under 10ms globally. Hash-based cache keys mean cache invalidation is automatic.
3. Server-side rendering or static generation for SEO-critical pages
If any page needs to be indexable by search engines or shared on social media with rich previews, consider migrating those specific pages to Next.js with SSR or ISR. The existing Vite SPA covers everything else.
4. Observability stack
Add OpenTelemetry tracing, structured JSON logs (pino), and a metrics endpoint (Prometheus) on the Node API. Hook into a free-tier observability platform (Grafana Cloud, Honeycomb, Sentry) for production visibility.
5. Background job queue
Any long-running operations currently done synchronously in request handlers (email sending, report generation, image batch processing) should move to a queue: BullMQ + Redis is the standard Node choice.
6. Database read replicas
Once traffic grows, point read-heavy endpoints at a read replica and reserve the primary for writes.
✅ Acceptance Criteria
[ ] Every PHP page has a corresponding React route.
[ ] Every PHP backend endpoint has a corresponding Node/Express endpoint with matching input/output.
[ ] Every page is visually identical to the original (verified by screenshots).
[ ] No image, icon, font, or stylesheet was modified.
[ ] All forms submit to the new Node endpoints with the same payloads as before.
[ ] User sessions and auth (existing password hashes) continue to work — no user needs to reset anything.
[ ] All tests pass: frontend, backend, parity, E2E.
[ ] Lighthouse Performance ≥ 90 on every page (mobile profile).
[ ] LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 100ms on every page.
[ ] Initial JS bundle ≤ 200 KB gzipped.
[ ] Backend load test shows the Node API at least as fast at p95 as the PHP original on every tested endpoint.
[ ] Image endpoint serves cached variants at p95 ≤ 30ms with >90% cache hit rate under load.
[ ] `npm run build` in `react-app/` produces a clean production bundle with zero errors and no console warnings on page load.
[ ] `npm run build` in `api-server/` produces a clean compiled output.
[ ] After Step 6: zero `.php` files remain in the folder, no PHP references in any config or code, all tests still pass, and a backup archive of the original PHP code exists.
🚦 Working Style — Autonomous End-to-End Execution
Run Steps 1 → 7 from start to finish without pausing for human input. Do not ask for confirmation, approval, or clarification at any point. Execute the full migration, including the destructive PHP cleanup in Step 6, automatically.
Operating rules during the autonomous run:
Decisions over questions. When the original PHP is ambiguous, make the most faithful reasonable interpretation, log the decision in `MIGRATION_REPORT.md` under a "Decisions Made" section, and keep moving.
Self-healing on test failure. If a test fails, diagnose, fix, and re-run automatically. Do not surface the failure as a question. Loop until all tests pass.
Self-healing on performance miss. If a Lighthouse score, load-test result, or image-cache benchmark falls below the budget, profile the bottleneck and apply additional optimizations from the performance rules (caching tier, query rewrite, bundle split, preload hint) until the budget is met.
Logged escape hatch only for true blockers. Stop only if a credential, third-party API key, or piece of infrastructure (DB host, Redis URL) is genuinely missing from `.env` or the environment and cannot be inferred or stubbed. In that case, write the missing item to `BLOCKERS.md`, complete every other step that does not depend on it, and finish the run.
Commit at every milestone. After each major step (scaffolding, every page conversion, cleanup) make a git commit with a clear message. This gives the user clean rollback points without needing to interact during the run.
One status update at the end. When everything is done, produce a single summary message with: total files converted, total endpoints created, all test counts, all performance numbers, the path to the backup archive, the path to `FUTURE_IMPROVEMENTS.md`, and a "Decisions Made" log.
The git commits and tarball backup created in Step 6's pre-checks are the user's safety net — they provide rollback without requiring real-time approval gates.
---
Begin immediately with Step 1. Do not ask questions. Do not pause. Run end-to-end through Step 7.