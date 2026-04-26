# SMARTUAE — Migration Inventory
Generated: 2026-04-26

## PHP File Classification

| PHP File | Type | Target React Component | Target Route |
|---|---|---|---|
| `index.php` | Page | `HomePage` | `/` |
| `pages/categories.php` | Page | `CategoriesPage` | `/categories` |
| `pages/businesses.php` | Page | `BusinessesPage` | `/businesses` |
| `pages/business_detail.php` | Page | `BusinessDetailPage` | `/businesses/:id` |
| `pages/classifieds.php` | Page | `ClassifiedsPage` | `/classifieds` |
| `pages/classified_list.php` | Page | `ClassifiedListPage` | `/classifieds/list` |
| `pages/classified_detail.php` | Page | `ClassifiedDetailPage` | `/classifieds/:id` |
| `pages/jobs.php` | Page | `JobsPage` | `/jobs` |
| `pages/job_detail.php` | Page | `JobDetailPage` | `/jobs/:id` |
| `pages/offers.php` | Page | `OffersPage` | `/offers` |
| `pages/offer_detail.php` | Page | `OfferDetailPage` | `/offers/:id` |
| `pages/profile.php` | Page | `ProfilePage` | `/profile` |
| `pages/page.php` | Page | `DynamicPage` | `/page/:slug` |
| `pages/offline_projects.php` | Page | `OfflineProjectsPage` | `/offline-projects` |
| `pages/real_estate_players.php` | Page | `RealEstatePlayersPage` | `/real-estate-players` |
| `includes/header.php` | Partial | `Layout` + `Topbar` | — |
| `includes/footer.php` | Partial | `Layout` | — |
| `includes/topbar.php` | Partial | `Topbar` | — |
| `includes/bottom_nav.php` | Partial | `BottomNav` | — |
| `includes/config.php` | Asset/Config | `api-server/src/db/` + `.env` | — |
| `admin/login.php` | Page | `AdminLoginPage` | `/admin/login` |
| `admin/logout.php` | API/AJAX | `POST /api/admin/logout` | — |
| `admin/index.php` | Page | `AdminDashboardPage` | `/admin` |
| `admin/sliders.php` | Page | `AdminSlidersPage` | `/admin/sliders` |
| `admin/main_categories.php` | Page | `AdminMainCategoriesPage` | `/admin/main-categories` |
| `admin/popular_categories.php` | Page | `AdminPopularCategoriesPage` | `/admin/popular-categories` |
| `admin/business_categories.php` | Page | `AdminBusinessCategoriesPage` | `/admin/business-categories` |
| `admin/businesses.php` | Page | `AdminBusinessesPage` | `/admin/businesses` |
| `admin/offers.php` | Page | `AdminOffersPage` | `/admin/offers` |
| `admin/classified_categories.php` | Page | `AdminClassifiedCategoriesPage` | `/admin/classified-categories` |
| `admin/classified_sections.php` | Page | `AdminClassifiedSectionsPage` | `/admin/classified-sections` |
| `admin/classifieds.php` | Page | `AdminClassifiedsPage` | `/admin/classifieds` |
| `admin/jobs.php` | Page | `AdminJobsPage` | `/admin/jobs` |
| `admin/profiles.php` | Page | `AdminProfilesPage` | `/admin/profiles` |
| `admin/pages.php` | Page | `AdminPagesPage` | `/admin/pages` |
| `admin/settings.php` | Page | `AdminSettingsPage` | `/admin/settings` |
| `admin/includes/header.php` | Partial | `AdminLayout` | — |
| `admin/includes/footer.php` | Partial | `AdminLayout` | — |
| `admin/ajax/business_search.php` | API/AJAX | `GET /api/businesses/search` | — |

## Express API Endpoints

### Public API
| Method | Path | PHP Source | Description |
|---|---|---|---|
| GET | `/api/home` | `index.php` | Sliders, categories, sections, stats |
| GET | `/api/categories` | `pages/categories.php` | Business categories grouped |
| GET | `/api/businesses` | `pages/businesses.php` | Business listings (filter by cat) |
| GET | `/api/businesses/:id` | `pages/business_detail.php` | Business detail + gallery/services/testimonials |
| GET | `/api/businesses/search` | `admin/ajax/business_search.php` | Business search |
| GET | `/api/classifieds` | `pages/classifieds.php` | Classified sections + categories |
| GET | `/api/classifieds/list` | `pages/classified_list.php` | Classified listings (filter by cat/section/search) |
| GET | `/api/classifieds/:id` | `pages/classified_detail.php` | Classified detail |
| GET | `/api/jobs` | `pages/jobs.php` | Job listings (search) |
| GET | `/api/jobs/:id` | `pages/job_detail.php` | Job detail |
| GET | `/api/offers` | `pages/offers.php` | Offers (filter by emirate/category) |
| GET | `/api/offers/:id` | `pages/offer_detail.php` | Offer detail + reviews |
| GET | `/api/profiles/:id` | `pages/profile.php` | User profile/CV |
| GET | `/api/pages/:slug` | `pages/page.php` | Dynamic page by slug |

### Admin API (protected by session)
| Method | Path | PHP Source | Description |
|---|---|---|---|
| POST | `/api/admin/login` | `admin/login.php` | Admin login |
| POST | `/api/admin/logout` | `admin/logout.php` | Admin logout |
| GET/POST/PUT/DELETE | `/api/admin/sliders` | `admin/sliders.php` | Slider CRUD |
| GET/POST/PUT/DELETE | `/api/admin/main-categories` | `admin/main_categories.php` | Main category CRUD |
| GET/POST/PUT/DELETE | `/api/admin/popular-categories` | `admin/popular_categories.php` | Popular category CRUD |
| GET/POST/PUT/DELETE | `/api/admin/business-categories` | `admin/business_categories.php` | Business category CRUD |
| GET/POST/PUT/DELETE | `/api/admin/businesses` | `admin/businesses.php` | Business CRUD |
| GET/POST/PUT/DELETE | `/api/admin/offers` | `admin/offers.php` | Offer CRUD |
| GET/POST/PUT/DELETE | `/api/admin/classified-categories` | `admin/classified_categories.php` | Classified category CRUD |
| GET/POST/PUT/DELETE | `/api/admin/classified-sections` | `admin/classified_sections.php` | Classified section CRUD |
| GET/POST/PUT/DELETE | `/api/admin/classifieds` | `admin/classifieds.php` | Classified CRUD |
| GET/POST/PUT/DELETE | `/api/admin/jobs` | `admin/jobs.php` | Job CRUD |
| GET/POST/PUT/DELETE | `/api/admin/profiles` | `admin/profiles.php` | Profile CRUD |
| GET/POST/PUT/DELETE | `/api/admin/pages` | `admin/pages.php` | Dynamic page CRUD |
| GET/PUT | `/api/admin/settings` | `admin/settings.php` | Site settings |

## Database
- **Host:** localhost  
- **Name:** smartuae  
- **User:** root / no password  
- **Driver:** mysql2  
- **Key tables:** admin_users, site_settings, sliders, main_categories, popular_categories, business_categories, businesses, business_gallery, business_videos, business_reels, business_services, business_testimonials, business_clients, offers, offer_reviews, classified_categories, classified_sections, classifieds, jobs, user_profiles, pages

## Auth
- Session-based (`$_SESSION['admin_id']`)
- `password_verify()` / bcrypt
- No frontend user auth — admin only

## Static Assets to Copy
- `assets/css/style.css` → `react-app/public/assets/css/style.css`
- `assets/js/main.js` → `react-app/public/assets/js/main.js` (ported to React)
- `assets/images/` → `react-app/public/assets/images/`
- `assets/uploads/` → served by Express static middleware
