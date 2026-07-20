import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import { EMIRATES } from '../constants/realestate';
import { fmtFee } from '../constants/education';

export default function CourseListPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');

  const course_category = params.get('course_category') || '';
  const study_level = params.get('study_level') || '';
  const institution_type = params.get('institution_type') || '';
  const emirate = params.get('emirate') || '';
  const activeSearch = params.get('search') || '';

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
  };

  const { data: meta } = useQuery({ queryKey: ['universities-meta-hub'], queryFn: () => api.get('/universities').then((r) => r.data) });
  const { data, isLoading } = useQuery({
    queryKey: ['courses', course_category, study_level, institution_type, emirate, activeSearch],
    queryFn: () => api.get('/universities/courses', { params: { course_category, study_level, institution_type, emirate, search: activeSearch, pageSize: 60 } }).then((r) => r.data),
  });

  const items: any[] = data?.items || [];
  const sel: React.CSSProperties = { padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, background: '#fff', color: 'var(--text)', fontFamily: 'inherit' };

  return (
    <>
      <div className="page-topbar">
        <Link to="/universities" className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>Courses</h1>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search courses, universities…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') setParam('search', search); }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 16px 10px', scrollbarWidth: 'none' }}>
        <select value={study_level} onChange={(e) => setParam('study_level', e.target.value)} style={sel}>
          <option value="">All Levels</option>
          {(meta?.studyLevels || []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select value={course_category} onChange={(e) => setParam('course_category', e.target.value)} style={sel}>
          <option value="">All Categories</option>
          {(meta?.courseCategories || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={institution_type} onChange={(e) => setParam('institution_type', e.target.value)} style={sel}>
          <option value="">All Institutions</option>
          {(meta?.institutionTypes || []).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={emirate} onChange={(e) => setParam('emirate', e.target.value)} style={sel}>
          <option value="">All Emirates</option>
          {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <p style={{ padding: '0 16px 8px', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
        Courses <span style={{ color: 'var(--primary)', fontWeight: 700 }}>({items.length} Results)</span>
      </p>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No courses found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 24px' }}>
          {items.map((c) => (
            <Link key={c.id} to={`/universities/courses/${c.id}`}
              style={{ display: 'block', background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,.06)', textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', background: 'rgba(108,92,231,.1)', padding: '2px 8px', borderRadius: 50 }}>{c.level_icon} {c.level_name}</span>
                    {c.category_name && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', background: '#F2F3F7', padding: '2px 8px', borderRadius: 50 }}>{c.category_icon} {c.category_name}</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}><i className="fas fa-university" style={{ marginRight: 5, color: 'var(--primary)' }}></i>{c.university_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>{[c.duration, c.study_mode, c.delivery, c.emirate].filter(Boolean).join(' · ')}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{fmtFee(c.fee_per_year, c.currency)}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-light)' }}>/ year</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
