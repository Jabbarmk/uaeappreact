# Future Improvements

Items intentionally deferred from the migration scope to keep it clean and focused.

## Security
- **Persistent session store** — Replace the default in-memory session store with Redis (`connect-redis`) or `express-mysql-session`. In-memory sessions are lost on server restart and don't scale across multiple processes.
- **CSRF protection** — Add `csurf` or a custom double-submit cookie for admin POST/PUT/DELETE requests.
- **Rate limiting** — Apply `express-rate-limit` to `/api/admin/login` to mitigate brute-force attacks.
- **Helmet** — Add the `helmet` middleware to set security headers (CSP, HSTS, X-Frame-Options).

## Admin Panel
- The current `AdminDashboardPage` is a placeholder stub. A full admin UI (data tables, forms, image uploads) should be built using the existing `crudRoutes()` API endpoints.
- Image upload handling currently writes to `assets/uploads/` on the local filesystem. Switch to S3 or equivalent object storage before scaling.

## Frontend
- **Error boundaries** — Add React error boundaries around route-level components so one crashed page doesn't take down the entire SPA.
- **Offline support** — Add a service worker for basic shell caching.
- **Pagination UI** — `ClassifiedListPage` supports server-side pagination via `?page=` but the frontend currently doesn't expose page navigation controls.
- **Search debounce** — Topbar search fires a navigation on Enter; consider adding real-time suggestions with debounced queries.

## Testing
- **E2E tests** — Add Playwright tests for the golden path: home → category → business detail, classifieds browse, jobs search.
- **Admin CRUD tests** — The admin CRUD endpoints are untested. Add supertest tests for authenticated POST/PUT/DELETE flows.
- **Test coverage report** — Enable Vitest's `coverage` reporter (`@vitest/coverage-v8`) and set a minimum threshold.

## DevOps
- **CI pipeline** — Add a GitHub Actions workflow that runs `npm test` in both `api-server/` and `react-app/` on every push.
- **Docker Compose** — Add a `docker-compose.yml` so the MySQL + API + Vite dev server can be started with one command.
- **PM2 ecosystem file** — Add `ecosystem.config.js` for production process management of `api-server/`.
