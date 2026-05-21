import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { useAuth } from './context/AuthContext';

const Home             = lazy(() => import('./pages/HomePage'));
const Categories       = lazy(() => import('./pages/CategoriesPage'));
const Businesses       = lazy(() => import('./pages/BusinessesPage'));
const BusinessDetail   = lazy(() => import('./pages/BusinessDetailPage'));
const Classifieds      = lazy(() => import('./pages/ClassifiedsPage'));
const ClassifiedList   = lazy(() => import('./pages/ClassifiedListPage'));
const ClassifiedDetail = lazy(() => import('./pages/ClassifiedDetailPage'));
const Jobs             = lazy(() => import('./pages/JobsPage'));
const JobDetail        = lazy(() => import('./pages/JobDetailPage'));
const Offers           = lazy(() => import('./pages/OffersPage'));
const OfferDetail      = lazy(() => import('./pages/OfferDetailPage'));
const Profile          = lazy(() => import('./pages/ProfilePage'));
const DynamicPage      = lazy(() => import('./pages/DynamicPage'));
const Search           = lazy(() => import('./pages/SearchPage'));

// Auth pages
const LoginPage  = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage  = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPage = lazy(() => import('./pages/auth/ForgotPage'));

// User pages
const UserProfilePage       = lazy(() => import('./pages/my/UserProfilePage'));
const MyBusinessesPage      = lazy(() => import('./pages/my/MyBusinessesPage'));
const MyBusinessFormPage    = lazy(() => import('./pages/my/MyBusinessFormPage'));
const MyJobsPage            = lazy(() => import('./pages/my/MyJobsPage'));
const MyJobFormPage         = lazy(() => import('./pages/my/MyJobFormPage'));
const MyClassifiedsPage     = lazy(() => import('./pages/my/MyClassifiedsPage'));
const MyClassifiedFormPage  = lazy(() => import('./pages/my/MyClassifiedFormPage'));
const MyCVPage              = lazy(() => import('./pages/my/MyCVPage'));

// Admin pages
const AdminLogin        = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminCrudPage     = lazy(() => import('./pages/admin/AdminCrudPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminUsersPage    = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminApprovalsPage = lazy(() => import('./pages/admin/AdminApprovalsPage'));

function PageLoader() {
  return <div style={{ padding: 40, textAlign: 'center', color: '#6C5CE7' }}>Loading…</div>;
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
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="businesses" element={<Businesses />} />
          <Route path="businesses/:id" element={<BusinessDetail />} />
          <Route path="classifieds" element={<Classifieds />} />
          <Route path="classifieds/list" element={<ClassifiedList />} />
          <Route path="classifieds/:id" element={<ClassifiedDetail />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="offers" element={<Offers />} />
          <Route path="offers/:id" element={<OfferDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="page/:slug" element={<DynamicPage />} />
          <Route path="search" element={<Search />} />

          {/* Protected user routes */}
          <Route element={<RequireAuth />}>
            <Route path="my/profile" element={<UserProfilePage />} />
            <Route path="my/businesses" element={<MyBusinessesPage />} />
            <Route path="my/businesses/new" element={<MyBusinessFormPage />} />
            <Route path="my/businesses/:id/edit" element={<MyBusinessFormPage />} />
            <Route path="my/jobs" element={<MyJobsPage />} />
            <Route path="my/jobs/new" element={<MyJobFormPage />} />
            <Route path="my/jobs/:id/edit" element={<MyJobFormPage />} />
            <Route path="my/classifieds" element={<MyClassifiedsPage />} />
            <Route path="my/classifieds/new" element={<MyClassifiedFormPage />} />
            <Route path="my/classifieds/:id/edit" element={<MyClassifiedFormPage />} />
            <Route path="my/cv" element={<MyCVPage />} />
          </Route>
        </Route>

        {/* Auth pages (no layout) */}
        <Route path="auth/login"  element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />
        <Route path="auth/forgot" element={<ForgotPage />} />

        {/* Admin login (no layout) */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Admin routes (guarded by AdminLayout) */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="sliders"               element={<AdminCrudPage />} />
          <Route path="main-categories"       element={<AdminCrudPage />} />
          <Route path="home-categories"       element={<AdminCrudPage />} />
          <Route path="popular-categories"    element={<AdminCrudPage />} />
          <Route path="business-categories"   element={<AdminCrudPage />} />
          <Route path="businesses"            element={<AdminCrudPage />} />
          <Route path="offers"                element={<AdminCrudPage />} />
          <Route path="classified-categories" element={<AdminCrudPage />} />
          <Route path="classified-sections"   element={<AdminCrudPage />} />
          <Route path="classifieds"           element={<AdminCrudPage />} />
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
