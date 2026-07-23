import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

// KPI cards — each maps to a count from the dashboard summary.
const KPIS: { key: string; label: string; icon: string; bg: string; fg: string; to: string }[] = [
  { key: 'businesses',  label: 'Businesses',   icon: '🏢', bg: '#EAF2FE', fg: '#1D6FE0', to: '/admin/businesses' },
  { key: 'classifieds', label: 'Classifieds',  icon: '🏷️', bg: '#E7F8F1', fg: '#0E9F6E', to: '/admin/classifieds' },
  { key: 'properties',  label: 'Properties',   icon: '🏠', bg: '#F1EEFE', fg: '#6C5CE7', to: '/admin/properties' },
  { key: 'events',      label: 'Events',       icon: '🎉', bg: '#FDEEF3', fg: '#E14C8B', to: '/admin/events' },
  { key: 'companies',   label: 'RE Companies', icon: '◈',  bg: '#FEF4E6', fg: '#E8890C', to: '/admin/real-estate-companies' },
  { key: 'projects',    label: 'Projects',     icon: '🏗️', bg: '#EAF6FE', fg: '#0E86D4', to: '/admin/real-estate-projects' },
  { key: 'jobs',        label: 'Jobs',         icon: '💼', bg: '#EFEDFB', fg: '#5B4BD1', to: '/admin/jobs' },
  { key: 'users',       label: 'Users',        icon: '👤', bg: '#FBEDED', fg: '#D0473F', to: '/admin/users' },
];

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ECEFF3', borderRadius: 14, boxShadow: '0 1px 3px rgba(16,24,40,0.04)', ...style }}>
      {children}
    </div>
  );
}

function BarRow({ label, icon, value, max, sub }: { label: string; icon?: string; value: number; max: number; sub?: string }) {
  const pct = max > 0 ? Math.max(6, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
      {icon !== undefined && <span style={{ fontSize: 18, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#475467', flexShrink: 0 }}>{value.toLocaleString()}{sub ? ` ${sub}` : ''}</span>
        </div>
        <div style={{ height: 6, background: '#F1F3F7', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 5, background: `linear-gradient(90deg, ${ACCENT}, #35A0F0)` }} />
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ icon, title, action }: { icon: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #F0F2F5' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#101828' }}>{title}</span>
      </div>
      {action}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: me } = useQuery({
    queryKey: ['admin-me'],
    queryFn: () => api.get('/admin/me').then((r) => r.data as { id: number; name: string }),
    retry: false,
  });
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const now = new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const counts = data?.counts || {};
  const pending = data?.pendingApprovals ?? 0;
  const topBiz = data?.topBusinesses || [];
  const topKw = data?.topKeywords || [];
  const topCat = data?.topCategories || [];
  const maxBiz = Math.max(1, ...topBiz.map((b: any) => b.hits));
  const maxKw = Math.max(1, ...topKw.map((k: any) => k.count));
  const maxCat = Math.max(1, ...topCat.map((c: any) => c.count));

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1180 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(120deg, #0067C0 0%, #3B8AE0 55%, #00B8D4 100%)', borderRadius: 16, padding: '22px 26px', marginBottom: 20, color: '#fff', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 8px 24px rgba(0,103,192,0.22)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>📊</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{greeting}{me?.name ? `, ${me.name}` : ''}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 3 }}>{now}</div>
        </div>
        <Link to="/admin/approvals" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '10px 16px', textDecoration: 'none', color: '#fff', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
          <span style={{ fontSize: 22, fontWeight: 800 }}>{pending}</span>
          <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>Pending<br />Approvals {pending > 0 ? '→' : ''}</span>
        </Link>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(178px, 1fr))', gap: 12, marginBottom: 22 }}>
        {KPIS.map((k) => (
          <Link key={k.key} to={k.to} style={{ textDecoration: 'none' }}>
            <Card style={{ padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 13, transition: 'transform .12s, box-shadow .12s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: k.bg, color: k.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, flexShrink: 0 }}>{k.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 23, fontWeight: 800, color: '#101828', lineHeight: 1 }}>{isLoading ? '—' : (counts[k.key] ?? 0).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#667085', marginTop: 4, fontWeight: 600, whiteSpace: 'nowrap' }}>{k.label}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Analytics panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>

        {/* Most viewed businesses */}
        <Card>
          <PanelHeader icon="🔥" title="Most Viewed Businesses" action={<Link to="/admin/businesses" style={{ fontSize: 12, color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>View all</Link>} />
          <div style={{ padding: '6px 18px 14px' }}>
            {isLoading ? <Empty text="Loading…" /> : topBiz.length === 0 ? <Empty text="No view data yet." /> :
              topBiz.map((b: any) => <BarRow key={b.id} label={b.name} value={b.hits} max={maxBiz} sub="views" />)}
          </div>
        </Card>

        {/* Top searched keywords */}
        <Card>
          <PanelHeader icon="🔎" title="Top Searched Keywords" />
          <div style={{ padding: '14px 18px' }}>
            {isLoading ? <Empty text="Loading…" /> : topKw.length === 0 ? <Empty text="No searches yet." /> : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topKw.map((k: any, i: number) => {
                  const intensity = k.count / maxKw;
                  return (
                    <span key={k.keyword} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20,
                      background: `rgba(0,103,192,${0.06 + intensity * 0.14})`, color: ACCENT,
                      fontSize: 12 + Math.round(intensity * 3), fontWeight: 600, border: '1px solid rgba(0,103,192,0.12)',
                    }}>
                      {i < 3 && <span style={{ fontSize: 11 }}>{['🥇', '🥈', '🥉'][i]}</span>}
                      {k.keyword}
                      <span style={{ background: '#fff', color: '#475467', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{k.count}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Most clicked categories */}
        <Card>
          <PanelHeader icon="📂" title="Most Clicked Categories" action={<Link to="/admin/business-categories" style={{ fontSize: 12, color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>Manage</Link>} />
          <div style={{ padding: '6px 18px 14px' }}>
            {isLoading ? <Empty text="Loading…" /> : topCat.length === 0 ? <Empty text="No category clicks yet." /> :
              topCat.map((c: any, i: number) => <BarRow key={i} label={c.name} icon={c.icon || '📁'} value={c.count} max={maxCat} sub="clicks" />)}
          </div>
        </Card>

        {/* Recently added businesses */}
        <Card>
          <PanelHeader icon="🆕" title="Recently Added Businesses" />
          <div style={{ padding: '8px 12px 12px' }}>
            {isLoading ? <Empty text="Loading…" /> : (data?.recentBusinesses || []).length === 0 ? <Empty text="No businesses yet." /> :
              (data?.recentBusinesses || []).map((b: any) => (
                <Link key={b.id} to="/admin/businesses" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 6px', textDecoration: 'none', borderRadius: 8 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F6F9FE')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                  <img src={b.imageUrl} alt="" style={{ width: 38, height: 38, borderRadius: 9, objectFit: 'cover', background: '#EEF1F5', flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: '#98A2B3' }}>{b.emirate || '—'} · {new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                  </div>
                </Link>
              ))}
          </div>
        </Card>
      </div>

      {/* Management shortcuts */}
      <div style={{ fontSize: 12, fontWeight: 700, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Manage Content</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
        {MANAGE_TILES.map((t) => (
          <Link key={t.path} to={t.path}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', background: '#fff', border: '1px solid #ECEFF3', borderRadius: 12, textDecoration: 'none', transition: 'all .12s' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#BBD6F5'; el.style.background = '#F8FBFF'; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#ECEFF3'; el.style.background = '#fff'; }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: '#EAF2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: ACCENT, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ padding: '20px 4px', textAlign: 'center', color: '#98A2B3', fontSize: 13 }}>{text}</div>;
}

const MANAGE_TILES: { label: string; path: string; icon: string }[] = [
  { label: 'Sliders',             path: '/admin/sliders',               icon: '▶' },
  { label: 'Main Categories',     path: '/admin/main-categories',       icon: '⊟' },
  { label: 'Business Categories', path: '/admin/business-categories',   icon: '◈' },
  { label: 'Popular Categories',  path: '/admin/popular-categories',    icon: '★' },
  { label: 'Home Categories',     path: '/admin/home-categories',       icon: '⊞' },
  { label: 'Businesses',          path: '/admin/businesses',            icon: '⬡' },
  { label: 'Offers',              path: '/admin/offers',                icon: '◇' },
  { label: 'Classifieds',         path: '/admin/classifieds',           icon: '◻' },
  { label: 'Classified Cats',     path: '/admin/classified-categories', icon: '≡' },
  { label: 'Property Categories', path: '/admin/property-categories',   icon: '≡' },
  { label: 'Properties',          path: '/admin/properties',            icon: '⌂' },
  { label: 'RE Companies',        path: '/admin/real-estate-companies', icon: '◈' },
  { label: 'Off-Plan Projects',   path: '/admin/real-estate-projects',  icon: '⬢' },
  { label: 'Event Categories',    path: '/admin/event-categories',      icon: '≡' },
  { label: 'Events',              path: '/admin/events',                icon: '◉' },
  { label: 'Universities',        path: '/admin/universities',          icon: '🎓' },
  { label: 'Courses',             path: '/admin/courses',               icon: '📚' },
  { label: 'Institution Types',   path: '/admin/institution-types',     icon: '≡' },
  { label: 'Course Categories',   path: '/admin/course-categories',     icon: '≡' },
  { label: 'Study Levels',        path: '/admin/study-levels',          icon: '≡' },
  { label: 'Vloggers',            path: '/admin/vloggers',              icon: '📹' },
  { label: 'Hospitals & Doctors', path: '/admin/hospitals',             icon: '🏥' },
  { label: 'Jobs',                path: '/admin/jobs',                  icon: '⊕' },
  { label: 'Profiles',            path: '/admin/profiles',              icon: '○' },
  { label: 'Pages',               path: '/admin/pages',                 icon: '□' },
  { label: 'Users',               path: '/admin/users',                 icon: '👤' },
  { label: 'Settings',            path: '/admin/settings',              icon: '⚙' },
];
