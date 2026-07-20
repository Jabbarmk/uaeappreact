import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import { fmtFee } from '../constants/education';

const UNI_FALLBACK = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=240&fit=crop';

export default function UniversitiesHubPage() {
  const [search, setSearch] = useState('');
  const { data } = useQuery({ queryKey: ['universities-hub'], queryFn: () => api.get('/universities').then((r) => r.data) });

  const institutionTypes: any[] = data?.institutionTypes || [];
  const courseCategories: any[] = data?.courseCategories || [];
  const studyLevels: any[] = data?.studyLevels || [];
  const universities: any[] = data?.universities || [];
  const featured: any[] = data?.featuredCourses || [];

  return (
    <>
      <div className="page-topbar">
        <span className="logo-icon"><i className="fas fa-graduation-cap"></i></span>
        <h1>UNIVERSITIES</h1>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search courses, universities…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') window.location.assign(`/universities/courses?search=${encodeURIComponent(search)}`); }} />
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 170 }}>
        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=340&fit=crop" alt="Universities"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(108,92,231,.85),rgba(0,206,201,.6))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Study in the UAE</div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>Universities &amp; Courses</div>
          <div style={{ color: 'rgba(255,255,255,.9)', fontSize: 13, marginTop: 8 }}>Diplomas, degrees, PhDs &amp; professional courses</div>
        </div>
      </div>

      {/* Study levels */}
      {studyLevels.length > 0 && (
        <>
          <div className="section-header"><h2>Browse by Study Level</h2><Link to="/universities/courses">All courses</Link></div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
            {studyLevels.map((l) => (
              <Link key={l.id} to={`/universities/courses?study_level=${l.id}`}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', background: '#fff', borderRadius: 50, boxShadow: '0 2px 8px rgba(0,0,0,.06)', textDecoration: 'none', color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
                <span>{l.icon}</span>{l.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Course categories */}
      {courseCategories.length > 0 && (
        <>
          <div className="section-header"><h2>Course Categories</h2></div>
          <div className="category-icons">
            {courseCategories.slice(0, 12).map((c) => (
              <Link key={c.id} to={`/universities/courses?course_category=${c.id}`} className="cat-icon-item">
                <div className="icon">{c.icon || '📚'}</div>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Featured courses */}
      {featured.length > 0 && (
        <>
          <div className="section-header"><h2>Featured Courses</h2><Link to="/universities/courses">View all</Link></div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 16px 12px', scrollbarWidth: 'none' }}>
            {featured.map((c) => (
              <Link key={c.id} to={`/universities/courses/${c.id}`}
                style={{ flexShrink: 0, width: 230, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,.08)', textDecoration: 'none' }}>
                <div style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', background: 'rgba(108,92,231,.1)', padding: '2px 8px', borderRadius: 50 }}>{c.level_icon} {c.level_name}</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 8, lineHeight: 1.3 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{c.university_name}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginTop: 6 }}>{fmtFee(c.fee_per_year, c.currency)}<small style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>/year</small></div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Institution type filter + universities */}
      <div className="section-header"><h2>Universities</h2><Link to="/universities/courses">Browse courses</Link></div>
      {institutionTypes.length > 0 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 10px', scrollbarWidth: 'none' }}>
          {institutionTypes.map((t) => (
            <Link key={t.id} to={`/universities/courses?institution_type=${t.id}`}
              style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 50, border: '1.5px solid rgba(108,92,231,.2)', background: '#fff', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              {t.icon} {t.name}
            </Link>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 16px 24px' }}>
        {universities.map((u) => (
          <Link key={u.id} to={`/universities/${u.id}`}
            style={{ display: 'flex', gap: 12, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)', textDecoration: 'none' }}>
            <img src={u.logoUrl} alt={u.name} style={{ width: 90, height: 90, objectFit: 'cover', flexShrink: 0, background: '#EEF1F5' }} loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = UNI_FALLBACK; }} />
            <div style={{ padding: '12px 12px 12px 0', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{u.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{u.institution_icon} {u.institution_type || 'University'}{u.emirate ? ` · ${u.emirate}` : ''}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 7 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{u.course_count} courses</span>
                {u.rating > 0 && <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>★ {Number(u.rating).toFixed(1)}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
