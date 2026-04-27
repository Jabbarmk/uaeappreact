import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

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
const AdminLogin       = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminCrudPage    = lazy(() => import('./pages/admin/AdminCrudPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

function PageLoader() {
  return <div style={{ padding: 40, textAlign: 'center', color: '#6C5CE7' }}>Loading…</div>;
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
        </Route>

        {/* Admin login (no layout guard) */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Admin routes (guarded by AdminLayout) */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="sliders"               element={<AdminCrudPage />} />
          <Route path="main-categories"       element={<AdminCrudPage />} />
          <Route path="popular-categories"    element={<AdminCrudPage />} />
          <Route path="business-categories"   element={<AdminCrudPage />} />
          <Route path="businesses"            element={<AdminCrudPage />} />
          <Route path="offers"                element={<AdminCrudPage />} />
          <Route path="classified-categories" element={<AdminCrudPage />} />
          <Route path="classified-sections"   element={<AdminCrudPage />} />
          <Route path="classifieds"           element={<AdminCrudPage />} />
          <Route path="jobs"                  element={<AdminCrudPage />} />
          <Route path="profiles"              element={<AdminCrudPage />} />
          <Route path="pages"                 element={<AdminCrudPage />} />
          <Route path="settings"              element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
