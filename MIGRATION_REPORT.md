# SMARTUAE PHP → React Migration Report

**Date:** 2026-04-26  
**Branch:** `php-to-react-migration`  
**Author:** Automated migration via phptoreact.md spec

---

## Summary

Fully migrated a PHP/MySQL XAMPP application (SMARTUAE business directory) to a modern decoupled stack:

| Layer | Before | After |
|---|---|---|
| Frontend | PHP templates + inline JS | React 18 + Vite + TypeScript SPA |
| Backend | PHP + PDO direct queries | Express 5 + TypeScript REST API |
| Auth | `$_SESSION['admin_id']` | express-session + bcrypt |
| Routing | Apache mod_rewrite + .htaccess | React Router v6 + Express routes |
| Build | None | Vite (code-split, lazy routes) |
| Tests | None | Vitest + supertest + MSW |

---

## File Counts

### PHP files removed: 39

| Directory | Count |
|---|---|
| `/` (root) | 1 (`index.php`) |
| `includes/` | 5 |
| `pages/` | 14 |
| `admin/` | 17 (incl. `ajax/`, `includes/`) |

Backup archived at: `_php-backup-20260426-170420.tar.gz`

### New files created: 92 (committed)

| Directory | Purpose |
|---|---|
| `api-server/src/` | Express + TypeScript API |
| `react-app/src/` | React SPA pages & components |

---

## Route Mapping

| PHP Page | React Route | Express Endpoint |
|---|---|---|
| `index.php` | `/` → `HomePage` | `GET /api/home` |
| `pages/categories.php` | `/categories` → `CategoriesPage` | `GET /api/categories` |
| `pages/businesses.php` | `/businesses` → `BusinessesPage` | `GET /api/businesses` |
| `pages/business_detail.php` | `/businesses/:id` → `BusinessDetailPage` | `GET /api/businesses/:id` |
| `pages/classifieds.php` | `/classifieds` → `ClassifiedsPage` | `GET /api/classifieds` |
| `pages/classified_list.php` | `/classifieds/list` → `ClassifiedListPage` | `GET /api/classifieds/list` |
| `pages/classified_detail.php` | `/classifieds/:id` → `ClassifiedDetailPage` | `GET /api/classifieds/:id` |
| `pages/jobs.php` | `/jobs` → `JobsPage` | `GET /api/jobs` |
| `pages/job_detail.php` | `/jobs/:id` → `JobDetailPage` | `GET /api/jobs/:id` |
| `pages/offers.php` | `/offers` → `OffersPage` | `GET /api/offers` |
| `pages/offer_detail.php` | `/offers/:id` → `OfferDetailPage` | `GET /api/offers/:id` |
| `pages/profile.php` | `/profile/:id` → `ProfilePage` | `GET /api/profiles/:id` |
| `pages/page.php` | `/page/:slug` → `DynamicPage` | `GET /api/pages/:slug` |
| `admin/login.php` | `/admin/login` → `AdminLoginPage` | `POST /api/admin/login` |
| `admin/index.php` | `/admin` → `AdminDashboardPage` | `GET /api/admin/me` |

Admin CRUD resources (all backed by `crudRoutes()` factory):  
`sliders`, `main-categories`, `popular-categories`, `business-categories`, `businesses`, `offers`, `classified-categories`, `classified-sections`, `classifieds`, `jobs`, `profiles`, `pages`, `settings`

---

## Test Results

### Backend (Vitest + supertest) — `api-server/tests/api.test.ts`
```
17/17 tests passing
```

Covers: home, categories (with search filter), businesses (list + search + detail 404), classifieds (list + paginated + detail 404), jobs (list + filter + detail 404), offers, pages 404, admin auth (bad creds 401, unauthenticated me 401).

### Frontend (Vitest + @testing-library/react + MSW) — `react-app/src/test/pages.test.tsx`
```
8/8 tests passing
```

Covers: BottomNav nav items, Topbar logo + search input, AdminLoginPage form + error handling, HomePage stats load, JobsPage listing, CategoriesPage groups.

---

## Architecture Decisions

1. **Single CSS file preserved** — Original `style.css` (67KB) copied to `react-app/public/assets/` and loaded via `index.html`. Zero style regressions.

2. **Image serving** — `assets/uploads/` and `assets/images/` served by Express static middleware; Vite dev proxy passes through to `:4000`.

3. **Admin CRUD factory** — `crudRoutes(table, imageFolder?)` generates standard GET/POST/PUT/DELETE for all 12 admin resources, replacing 19 repetitive PHP admin pages with ~30 lines of factory code.

4. **Session auth** — `express-session` with `SESSION_SECRET` from env. Session store is in-memory for dev; swap `store` option in `app.ts` for Redis/MySQL in production.

5. **Code splitting** — All 15 public routes + admin routes are `React.lazy` wrapped, giving per-route chunks via Vite's Rollup.

---

## Environment Variables

See `api-server/.env.example` for all required variables.

---

## Production Checklist

- [ ] Run `npm run build` in `react-app/` → static files in `react-app/dist/`
- [ ] Point Apache/Nginx DocumentRoot to `react-app/dist/`
- [ ] Confirm `.htaccess` SPA fallback rule is active
- [ ] Set `SESSION_SECRET` to a cryptographically random value
- [ ] Change `CORS_ORIGIN` to production domain
- [ ] Replace in-memory session store with Redis (`connect-redis`) or MySQL (`express-mysql-session`)
- [ ] Set `NODE_ENV=production` in `api-server/.env`
- [ ] Configure process manager (PM2) for `api-server/`
