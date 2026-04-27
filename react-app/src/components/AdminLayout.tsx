import { useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

const ACCENT = '#0067C0';
const SIDEBAR_W = 220;
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const NAV_ITEMS = [
  { label: 'Dashboard',            path: '/admin',                       icon: '⊞' },
  { label: 'Sliders',              path: '/admin/sliders',               icon: '▶' },
  { label: 'Main Categories',      path: '/admin/main-categories',       icon: '⊟' },
  { label: 'Popular Categories',   path: '/admin/popular-categories',    icon: '★' },
  { label: 'Business Categories',  path: '/admin/business-categories',   icon: '◈' },
  { label: 'Businesses',           path: '/admin/businesses',            icon: '⬡' },
  { label: 'Offers',               path: '/admin/offers',                icon: '◇' },
  { label: 'Classified Cats',      path: '/admin/classified-categories', icon: '≡' },
  { label: 'Classified Sections',  path: '/admin/classified-sections',   icon: '⊞' },
  { label: 'Classifieds',          path: '/admin/classifieds',           icon: '◻' },
  { label: 'Jobs',                 path: '/admin/jobs',                  icon: '⊕' },
  { label: 'Profiles',             path: '/admin/profiles',              icon: '○' },
  { label: 'Pages',                path: '/admin/pages',                 icon: '□' },
  { label: 'Settings',             path: '/admin/settings',              icon: '⚙' },
];

function useAdminAuth() {
  return useQuery({
    queryKey: ['admin-me'],
    queryFn: () => api.get('/admin/me').then((r) => r.data),
    retry: false,
  });
}

function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#616161' }}>
      <span style={{ color: ACCENT, fontWeight: 600 }}>Admin</span>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#ccc' }}>›</span>
          <span style={{ textTransform: 'capitalize', color: i === parts.length - 1 ? '#1a1a1a' : '#616161' }}>
            {p.replace(/-/g, ' ')}
          </span>
        </span>
      ))}
    </div>
  );
}

function SidebarContent({ adminName, onNav, onLogout }: { adminName: string; onNav?: () => void; onLogout: () => void }) {
  const navStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '7px 14px', marginBottom: 1, borderRadius: 4,
    textDecoration: 'none', fontSize: 13,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? ACCENT : '#2a2a2a',
    background: isActive ? 'rgba(0,103,192,0.08)' : 'transparent',
    borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
  });

  return (
    <>
      {/* App brand */}
      <div style={{ padding: '13px 16px 11px', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, background: ACCENT, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>S</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1 }}>SMARTUAE</div>
          <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/admin'} style={navStyle} onClick={onNav}>
            <span style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0, fontFamily: 'inherit' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + sign out */}
      <div style={{ padding: '10px 6px', borderTop: '1px solid #E5E5E5' }}>
        <div style={{ padding: '5px 14px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {adminName?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <span style={{ fontSize: 12, color: '#333', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminName}</span>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 14px', border: '1px solid #E0E0E0', borderRadius: 4, background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          <span>⇥</span> Sign out
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { data, isLoading, isError } = useAdminAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: FONT, color: '#616161' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 28, height: 28, border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'win-spin 0.8s linear infinite', margin: '0 auto 10px' }} />
        Loading…
      </div>
    </div>
  );
  if (isError || !data) return <Navigate to="/admin/login" replace />;

  const handleLogout = async () => {
    try { await api.post('/admin/logout'); } finally {
      queryClient.clear();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: FONT, background: '#F3F3F3', overflow: 'hidden' }}>
      <style>{`
        /* Override mobile body constraints for admin */
        body { max-width: none !important; margin: 0 !important; padding-bottom: 0 !important; overflow: hidden !important; }
        @keyframes win-spin { to { transform: rotate(360deg); } }
        .win-sidebar { display: flex; }
        .win-hamburger { display: none; }
        @media (max-width: 768px) {
          .win-sidebar { display: none !important; }
          .win-hamburger { display: flex !important; }
        }
      `}</style>

      {/* Desktop sidebar (sticky) */}
      <aside className="win-sidebar" style={{ width: SIDEBAR_W, minWidth: SIDEBAR_W, flexShrink: 0, background: '#F9F9F9', borderRight: '1px solid #E5E5E5', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        <SidebarContent adminName={data.name} onLogout={handleLogout} />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 299, backdropFilter: 'blur(1px)' }} />
      )}

      {/* Mobile sidebar drawer */}
      <aside style={{ position: 'fixed', top: 0, left: drawerOpen ? 0 : -SIDEBAR_W - 10, width: SIDEBAR_W, height: '100vh', zIndex: 300, background: '#F9F9F9', borderRight: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column', transition: 'left 0.2s ease', boxShadow: drawerOpen ? '2px 0 20px rgba(0,0,0,0.15)' : 'none' }}>
        <SidebarContent adminName={data.name} onNav={() => setDrawerOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Title bar */}
        <header style={{ height: 46, minHeight: 46, background: '#fff', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
          <button className="win-hamburger" onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#333', padding: '4px 6px', borderRadius: 4, lineHeight: 1, alignItems: 'center' }} aria-label="Menu">☰</button>
          <Breadcrumb />
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>
              {data.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{data.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 48px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
