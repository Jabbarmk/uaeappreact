import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { useAuth } from './context/AuthContext';
import api from './api';

// ── Admin-set theme colors → CSS variable overrides ──────────────────────────

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const darken = (rgb: [number, number, number], f: number) => toHex(rgb[0] * f, rgb[1] * f, rgb[2] * f);
const lighten = (rgb: [number, number, number], f: number) =>
  toHex(rgb[0] + (255 - rgb[0]) * f, rgb[1] + (255 - rgb[1]) * f, rgb[2] + (255 - rgb[2]) * f);

function ThemeStyle() {
  const { data } = useQuery({
    queryKey: ['theme'],
    queryFn: () => api.get('/home/theme').then((r) => r.data),
    staleTime: 5 * 60_000,
    retry: false,
  });
  if (!data) return null;
  const vars: string[] = [];
  const p = data.primary ? parseHex(data.primary) : null;
  if (p) {
    vars.push(`--primary:${data.primary}`, `--primary-rgb:${p.join(', ')}`);
    // Derive dark/light shades unless the admin set them explicitly.
    vars.push(`--primary-dark:${data.primaryDark || darken(p, 0.84)}`);
    vars.push(`--primary-light:${data.primaryLight || lighten(p, 0.45)}`);
  } else {
    if (data.primaryDark) vars.push(`--primary-dark:${data.primaryDark}`);
    if (data.primaryLight) vars.push(`--primary-light:${data.primaryLight}`);
  }
  const s = data.secondary ? parseHex(data.secondary) : null;
  if (s) vars.push(`--secondary:${data.secondary}`, `--secondary-rgb:${s.join(', ')}`);
  if (data.accent) vars.push(`--accent:${data.accent}`);
  if (!vars.length) return null;
  return <style>{`:root{${vars.join(';')}}`}</style>;
}

const Home             = lazy(() => import('./pages/HomePage'));
const Categories       = lazy(() => import('./pages/CategoriesPage'));
const Businesses       = lazy(() => import('./pages/BusinessesPage'));
const BusinessDetail   = lazy(() => import('./pages/BusinessDetailPage'));
const Classifieds      = lazy(() => import('./pages/ClassifiedsPage'));
const ClassifiedList   = lazy(() => import('./pages/ClassifiedListPage'));
const ClassifiedDetail = lazy(() => import('./pages/ClassifiedDetailPage'));
const RealEstateHub    = lazy(() => import('./pages/RealEstateHubPage'));
const PropertyList     = lazy(() => import('./pages/PropertyListPage'));
const PropertyDetail   = lazy(() => import('./pages/PropertyDetailPage'));
const RealEstateCompanies = lazy(() => import('./pages/RealEstateCompaniesPage'));
const RealEstateCompany   = lazy(() => import('./pages/RealEstateCompanyPage'));
const RealEstateProjects  = lazy(() => import('./pages/RealEstateProjectsPage'));
const ProjectDetail    = lazy(() => import('./pages/ProjectDetailPage'));
const UniversitiesHub  = lazy(() => import('./pages/UniversitiesHubPage'));
const UniversityDetail = lazy(() => import('./pages/UniversityDetailPage'));
const CourseList       = lazy(() => import('./pages/CourseListPage'));
const CourseDetail     = lazy(() => import('./pages/CourseDetailPage'));
const Doctors          = lazy(() => import('./pages/DoctorsPage'));
const Jobs             = lazy(() => import('./pages/JobsPage'));
const JobDetail        = lazy(() => import('./pages/JobDetailPage'));
const Offers           = lazy(() => import('./pages/OffersPage'));
const OfferDetail      = lazy(() => import('./pages/OfferDetailPage'));
const Events           = lazy(() => import('./pages/EventsPage'));
const EventDetail      = lazy(() => import('./pages/EventDetailPage'));
const Profile          = lazy(() => import('./pages/ProfilePage'));
const DynamicPage      = lazy(() => import('./pages/DynamicPage'));
const Search           = lazy(() => import('./pages/SearchPage'));
const Collections      = lazy(() => import('./pages/CollectionsPage'));
const ShopProductDetail = lazy(() => import('./pages/ProductDetailPage'));
const BusinessReviews  = lazy(() => import('./pages/BusinessReviewsPage'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetailPage'));

// Auth pages
const LoginPage  = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage  = lazy(() => import('./pages/auth/SignupPage'));

// User pages
const UserProfilePage       = lazy(() => import('./pages/my/UserProfilePage'));
const MyBusinessesPage      = lazy(() => import('./pages/my/MyBusinessesPage'));
const MyBusinessFormPage    = lazy(() => import('./pages/my/MyBusinessFormPage'));
const MyJobsPage            = lazy(() => import('./pages/my/MyJobsPage'));
const MyJobFormPage         = lazy(() => import('./pages/my/MyJobFormPage'));
const MyJobApplicantsPage   = lazy(() => import('./pages/my/MyJobApplicantsPage'));
const MyClassifiedsPage     = lazy(() => import('./pages/my/MyClassifiedsPage'));
const MyClassifiedFormPage  = lazy(() => import('./pages/my/MyClassifiedFormPage'));
const MyPropertiesPage      = lazy(() => import('./pages/my/MyPropertiesPage'));
const MyPropertyFormPage    = lazy(() => import('./pages/my/MyPropertyFormPage'));
const MyCompaniesPage       = lazy(() => import('./pages/my/MyCompaniesPage'));
const MyCompanyFormPage     = lazy(() => import('./pages/my/MyCompanyFormPage'));
const MyProjectsPage        = lazy(() => import('./pages/my/MyProjectsPage'));
const MyProjectFormPage     = lazy(() => import('./pages/my/MyProjectFormPage'));
const MyCVPage              = lazy(() => import('./pages/my/MyCVPage'));

// Admin pages
const AdminLogin        = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminCrudPage     = lazy(() => import('./pages/admin/AdminCrudPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminUsersPage    = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminApprovalsPage = lazy(() => import('./pages/admin/AdminApprovalsPage'));
const AdminClassifiedsPage = lazy(() => import('./pages/admin/AdminClassifiedsPage'));
const AdminUniversitiesPage = lazy(() => import('./pages/admin/AdminUniversitiesPage'));
const AdminVloggersPage = lazy(() => import('./pages/admin/AdminVloggersPage'));
const AdminHospitalsPage = lazy(() => import('./pages/admin/AdminHospitalsPage'));
const AdminHomeLayoutPage = lazy(() => import('./pages/admin/AdminHomeLayoutPage'));
const AdminRealEstateLayoutPage = lazy(() => import('./pages/admin/AdminRealEstateLayoutPage'));

function PageLoader() {
  return <div style={{ padding: 40, textAlign: 'center', color: 'var(--primary)' }}>Loading…</div>;
}

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ThemeStyle />
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="businesses" element={<Businesses />} />
          <Route path="businesses/:id" element={<BusinessDetail />} />
          <Route path="businesses/:id/products/:pid" element={<ShopProductDetail />} />
          <Route path="businesses/:id/reviews" element={<BusinessReviews />} />
          <Route path="classifieds" element={<Classifieds />} />
          <Route path="classifieds/list" element={<ClassifiedList />} />
          <Route path="classifieds/:id" element={<ClassifiedDetail />} />
          <Route path="realestate" element={<RealEstateHub />} />
          <Route path="realestate/properties" element={<PropertyList />} />
          <Route path="realestate/properties/:id" element={<PropertyDetail />} />
          <Route path="realestate/companies" element={<RealEstateCompanies />} />
          <Route path="realestate/companies/:id" element={<RealEstateCompany />} />
          <Route path="realestate/projects" element={<RealEstateProjects />} />
          <Route path="realestate/projects/:id" element={<ProjectDetail />} />
          <Route path="universities" element={<UniversitiesHub />} />
          <Route path="universities/courses" element={<CourseList />} />
          <Route path="universities/courses/:id" element={<CourseDetail />} />
          <Route path="universities/:id" element={<UniversityDetail />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="offers" element={<Offers />} />
          <Route path="offers/:id" element={<OfferDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="page/:slug" element={<DynamicPage />} />
          <Route path="search" element={<Search />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/:id" element={<CollectionDetail />} />

          {/* Protected user routes */}
          <Route element={<RequireAuth />}>
            <Route path="my/profile" element={<UserProfilePage />} />
            <Route path="my/businesses" element={<MyBusinessesPage />} />
            <Route path="my/businesses/new" element={<MyBusinessFormPage />} />
            <Route path="my/businesses/:id/edit" element={<MyBusinessFormPage />} />
            <Route path="my/jobs" element={<MyJobsPage />} />
            <Route path="my/jobs/new" element={<MyJobFormPage />} />
            <Route path="my/jobs/:id/edit" element={<MyJobFormPage />} />
            <Route path="my/jobs/:id/applicants" element={<MyJobApplicantsPage />} />
            <Route path="my/classifieds" element={<MyClassifiedsPage />} />
            <Route path="my/classifieds/new" element={<MyClassifiedFormPage />} />
            <Route path="my/classifieds/:id/edit" element={<MyClassifiedFormPage />} />
            <Route path="my/properties" element={<MyPropertiesPage />} />
            <Route path="my/properties/new" element={<MyPropertyFormPage />} />
            <Route path="my/properties/:id/edit" element={<MyPropertyFormPage />} />
            <Route path="my/re-companies" element={<MyCompaniesPage />} />
            <Route path="my/re-companies/new" element={<MyCompanyFormPage />} />
            <Route path="my/re-companies/:id/edit" element={<MyCompanyFormPage />} />
            <Route path="my/projects" element={<MyProjectsPage />} />
            <Route path="my/projects/new" element={<MyProjectFormPage />} />
            <Route path="my/projects/:id/edit" element={<MyProjectFormPage />} />
            <Route path="my/cv" element={<MyCVPage />} />
          </Route>
        </Route>

        {/* Auth pages (no layout) */}
        <Route path="auth/login"  element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />

        {/* Admin login (no layout) */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Admin routes (guarded by AdminLayout) */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="home-layout"           element={<AdminHomeLayoutPage />} />
          <Route path="realestate-layout"     element={<AdminRealEstateLayoutPage />} />
          <Route path="sliders"               element={<AdminCrudPage />} />
          <Route path="main-categories"       element={<AdminCrudPage />} />
          <Route path="home-categories"       element={<AdminCrudPage />} />
          <Route path="popular-categories"    element={<AdminCrudPage />} />
          <Route path="business-categories"   element={<AdminCrudPage />} />
          <Route path="category-banners"      element={<AdminCrudPage />} />
          <Route path="businesses"            element={<AdminCrudPage />} />
          <Route path="offers"                element={<AdminCrudPage />} />
          <Route path="classified-categories" element={<AdminCrudPage />} />
          <Route path="classified-sections"   element={<AdminCrudPage />} />
          <Route path="classifieds"           element={<AdminClassifiedsPage />} />
          <Route path="property-categories"   element={<AdminCrudPage />} />
          <Route path="real-estate-companies" element={<AdminCrudPage />} />
          <Route path="properties"            element={<AdminCrudPage />} />
          <Route path="real-estate-projects"  element={<AdminCrudPage />} />
          <Route path="event-categories"      element={<AdminCrudPage />} />
          <Route path="events"                element={<AdminCrudPage />} />
          <Route path="institution-types"     element={<AdminCrudPage />} />
          <Route path="course-categories"     element={<AdminCrudPage />} />
          <Route path="study-levels"          element={<AdminCrudPage />} />
          <Route path="universities"          element={<AdminUniversitiesPage />} />
          <Route path="courses"               element={<AdminCrudPage />} />
          <Route path="vloggers"              element={<AdminVloggersPage />} />
          <Route path="hospitals"             element={<AdminHospitalsPage />} />
          <Route path="jobs"                  element={<AdminCrudPage />} />
          <Route path="profiles"              element={<AdminCrudPage />} />
          <Route path="work-experience"       element={<AdminCrudPage />} />
          <Route path="pages"                 element={<AdminCrudPage />} />
          <Route path="settings"              element={<AdminSettingsPage />} />
          <Route path="users"                 element={<AdminUsersPage />} />
          <Route path="approvals"             element={<AdminApprovalsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
