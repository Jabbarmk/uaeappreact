import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock pages
import BottomNav from '../components/BottomNav';
import Topbar from '../components/Topbar';
import AdminLoginPage from '../pages/admin/AdminLoginPage';

// MSW handlers
const handlers = [
  http.get('/api/home', () => HttpResponse.json({
    sliders: [],
    mainCategories: [{ id: 1, name: 'Food', icon: '🍔' }],
    popularCategories: [],
    sections: [],
    stats: { businesses: 42, jobs: 15, classifieds: 88 },
  })),
  http.get('/api/categories', () => HttpResponse.json({
    groups: { 'Dining': [{ id: 1, name: 'Restaurants', icon: '🍽️' }] },
  })),
  http.get('/api/businesses', () => HttpResponse.json({
    catName: 'All Businesses',
    businesses: [{ id: 1, name: 'Test Biz', description: 'Great place', rating: 4.5, address: 'Dubai', imageUrl: '', phone: '' }],
  })),
  http.get('/api/classifieds', () => HttpResponse.json({ categories: [], sections: [] })),
  http.get('/api/classifieds/list', () => HttpResponse.json({ catName: 'Classifieds', items: [], total: 0, page: 1, pageSize: 25 })),
  http.get('/api/jobs', () => HttpResponse.json({ jobs: [
    { id: 1, title: 'React Developer', company: 'ACME', salary_min: 10000, salary_max: 15000, currency: 'AED', location: 'Dubai', job_type: 'Full Time', posted_at: new Date().toISOString() },
  ], profile: null })),
  http.get('/api/offers', () => HttpResponse.json({ emirates: ['Dubai'], selectedLoc: 'Dubai', selectedCat: '', categories: [], offers: [] })),
  http.post('/api/admin/login', () => HttpResponse.json({ ok: true, name: 'Admin' })),
];

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterAll(() => server.close());

function wrapper(ui: React.ReactElement, path = '/') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('BottomNav', () => {
  it('renders all nav items', () => {
    wrapper(<BottomNav />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Classifieds')).toBeInTheDocument();
    expect(screen.getByText('Offers')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
  });
});

describe('Topbar', () => {
  it('renders logo', () => {
    wrapper(<Topbar />);
    expect(screen.getByText('UAE')).toBeInTheDocument();
  });
  it('renders search input', () => {
    wrapper(<Topbar />);
    expect(screen.getByPlaceholderText('Search anything...')).toBeInTheDocument();
  });
});

describe('AdminLoginPage', () => {
  it('renders login form', () => {
    wrapper(<AdminLoginPage />, '/admin/login');
    expect(screen.getByText(/Admin Dashboard Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error on bad credentials', async () => {
    server.use(http.post('/api/admin/login', () => HttpResponse.json({ error: 'Invalid username or password' }, { status: 401 })));
    wrapper(<AdminLoginPage />, '/admin/login');
    const user = (await import('@testing-library/user-event')).default.setup();
    await user.type(screen.getByLabelText(/username/i), 'bad');
    await user.type(screen.getByLabelText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument());
  });
});

describe('HomePage lazy', () => {
  it('renders stats after API call', async () => {
    const { default: HomePage } = await import('../pages/HomePage');
    wrapper(<HomePage />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument(), { timeout: 5000 });
  });
});

describe('JobsPage lazy', () => {
  it('shows job listing', async () => {
    const { default: JobsPage } = await import('../pages/JobsPage');
    wrapper(<JobsPage />, '/jobs');
    await waitFor(() => expect(screen.getByText('React Developer')).toBeInTheDocument(), { timeout: 5000 });
  });
});

describe('CategoriesPage lazy', () => {
  it('shows category groups from API', async () => {
    const { default: CategoriesPage } = await import('../pages/CategoriesPage');
    wrapper(<CategoriesPage />, '/categories');
    await waitFor(() => expect(screen.getByText('Restaurants')).toBeInTheDocument(), { timeout: 5000 });
  });
});
