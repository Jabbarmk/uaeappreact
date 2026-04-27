import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const ACCENT = '#0067C0';

const TILES: { label: string; path: string; icon: string; desc: string }[] = [
  { label: 'Sliders',              path: '/admin/sliders',               icon: '▶',  desc: 'Homepage carousel' },
  { label: 'Main Categories',      path: '/admin/main-categories',       icon: '⊟',  desc: 'Top-level categories' },
  { label: 'Popular Categories',   path: '/admin/popular-categories',    icon: '★',  desc: 'Featured category cards' },
  { label: 'Business Categories',  path: '/admin/business-categories',   icon: '◈',  desc: 'Business groupings' },
  { label: 'Businesses',           path: '/admin/businesses',            icon: '⬡',  desc: 'Directory listings' },
  { label: 'Offers',               path: '/admin/offers',                icon: '◇',  desc: 'Promotions & deals' },
  { label: 'Classified Cats',      path: '/admin/classified-categories', icon: '≡',  desc: 'Ad categories' },
  { label: 'Classified Sections',  path: '/admin/classified-sections',   icon: '⊞',  desc: 'Ad section groups' },
  { label: 'Classifieds',          path: '/admin/classifieds',           icon: '◻',  desc: 'Classified ads' },
  { label: 'Jobs',                 path: '/admin/jobs',                  icon: '⊕',  desc: 'Job postings' },
  { label: 'Profiles',             path: '/admin/profiles',              icon: '○',  desc: 'Smart CV profiles' },
  { label: 'Pages',                path: '/admin/pages',                 icon: '□',  desc: 'Static content pages' },
  { label: 'Settings',             path: '/admin/settings',              icon: '⚙',  desc: 'Site configuration' },
];

export default function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ['admin-me'],
    queryFn: () => api.get('/admin/me').then((r) => r.data as { id: number; name: string }),
    retry: false,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const now = new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Inter', system-ui, sans-serif", maxWidth: 1100 }}>

      {/* Welcome card — Windows-style hero panel */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 6, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 48, height: 48, borderRadius: 6, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', flexShrink: 0 }}>⊞</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>
            {greeting}{data?.name ? `, ${data.name}` : ''}
          </div>
          <div style={{ fontSize: 13, color: '#616161', marginTop: 2 }}>{now}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>SMARTUAE Admin</div>
          <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600, marginTop: 2 }}>v1.0</div>
        </div>
      </div>

      {/* Section heading */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Content Management
      </div>

      {/* Windows-style tiles grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1, background: '#E5E5E5', border: '1px solid #E5E5E5', borderRadius: 6, overflow: 'hidden' }}>
        {TILES.map((tile) => (
          <Link
            key={tile.path}
            to={tile.path}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#fff', textDecoration: 'none', transition: 'background 0.1s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F0F6FF'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 4, background: '#EBF3FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: ACCENT, flexShrink: 0 }}>
              {tile.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tile.label}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tile.desc}</div>
            </div>
            <div style={{ marginLeft: 'auto', color: '#ccc', fontSize: 12, flexShrink: 0 }}>›</div>
          </Link>
        ))}
      </div>

      {/* Quick tips panel */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 6, padding: '14px 18px', marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: ACCENT }}>ℹ</span> Quick Reference
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '4px 24px' }}>
          {[
            ['Businesses → image field', 'Cover photo shown on listing cards'],
            ['Businesses → logo field', 'Logo shown on detail page header'],
            ['Offers → business_id', 'Must match an existing Business ID'],
            ['Sliders → sort_order', 'Lower number = appears first'],
            ['Profiles', 'Work exp format: Title|Company|Dates|Location'],
            ['Pages → slug', 'URL path, e.g. about-us → /page/about-us'],
          ].map(([label, note]) => (
            <div key={label} style={{ fontSize: 12, color: '#555', padding: '3px 0', borderBottom: '1px solid #F3F3F3' }}>
              <span style={{ fontWeight: 600, color: '#333' }}>{label}:</span> {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
