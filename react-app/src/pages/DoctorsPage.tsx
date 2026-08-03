import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import DoctorCard, { docColor } from '../components/DoctorCard';
import DoctorPopup from '../components/DoctorPopup';

const SANS = "-apple-system,'SF Pro Text','SF Pro Display','Segoe UI',Roboto,sans-serif";
const BLUE = '#007AFF';

export default function DoctorsPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [popup, setPopup] = useState<any>(null);

  const specialty = params.get('specialty') || '';
  const emirate = params.get('emirate') || '';
  const available_today = params.get('available_today') || '';
  const top_rated = params.get('top_rated') || '';
  const sort = params.get('sort') || '';
  const activeSearch = params.get('search') || '';

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
  };
  const toggle = (k: string) => setParam(k, params.get(k) === '1' ? '' : '1');

  const { data: hub } = useQuery({ queryKey: ['doctors-hub'], queryFn: () => api.get('/doctors').then((r) => r.data) });
  const { data, isLoading } = useQuery({
    queryKey: ['doctors-list', specialty, emirate, available_today, top_rated, sort, activeSearch],
    queryFn: () => api.get('/doctors/list', { params: { specialty, emirate, available_today, top_rated, sort, search: activeSearch, pageSize: 60 } }).then((r) => r.data),
  });

  const specialties: any[] = hub?.specialties || [];
  const items: any[] = data?.items || [];
  const activeSpec = specialties.find((s) => String(s.id) === specialty);

  return (
    <div style={{ fontFamily: SANS, background: '#F2F2F7', minHeight: '100vh', paddingBottom: 90 }}>
      {popup && <DoctorPopup doctor={popup} onClose={() => setPopup(null)} />}

      {/* Frosted sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(242,242,247,.82)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', padding: '10px 16px 12px', borderBottom: '1px solid rgba(0,0,0,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/categories" style={{ color: BLUE, fontSize: 22, textDecoration: 'none', width: 30 }}><i className="fas fa-chevron-left"></i></Link>
          <h1 style={{ flex: 1, margin: 0, fontSize: 22, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.6px' }}>{activeSpec ? activeSpec.name : 'Doctors'}</h1>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: BLUE, fontSize: 14, fontWeight: 600 }}><i className="fas fa-location-dot" style={{ fontSize: 12 }}></i> {emirate || 'UAE'}</span>
        </div>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(118,118,128,.12)', borderRadius: 12, padding: '9px 12px', marginTop: 12 }}>
          <i className="fas fa-search" style={{ color: '#8E8E93', fontSize: 15 }}></i>
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') setParam('search', search); }}
            placeholder="Search doctor, specialty or clinic" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#1C1C1E', fontFamily: SANS, minWidth: 0 }} />
          {search && <button onClick={() => { setSearch(''); setParam('search', ''); }} style={{ border: 'none', background: 'none', color: '#8E8E93', cursor: 'pointer' }}><i className="fas fa-circle-xmark"></i></button>}
        </div>
      </div>

      {/* Browse by specialty */}
      <div style={{ padding: '16px 0 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 2px' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1C1C1E', letterSpacing: '-0.3px' }}>Browse by Specialty</h2>
          {specialty && <button onClick={() => setParam('specialty', '')} style={{ border: 'none', background: 'none', color: BLUE, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Show all</button>}
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none' }}>
          {specialties.map((s) => {
            const active = String(s.id) === specialty;
            const c = docColor(s.id);
            return (
              <button key={s.id} onClick={() => setParam('specialty', active ? '' : String(s.id))}
                style={{ flexShrink: 0, width: 68, background: 'none', border: 'none', cursor: 'pointer', fontFamily: SANS, padding: 0 }}>
                <div style={{ width: 60, height: 60, borderRadius: 20, background: active ? c.bg : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto', boxShadow: active ? `0 6px 16px ${c.bg}55` : '0 1px 4px rgba(0,0,0,.06)', transition: 'all .15s' }}>
                  <span style={{ filter: active ? 'grayscale(0)' : 'none' }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? '#1C1C1E' : '#8E8E93', marginTop: 7, lineHeight: 1.2, textAlign: 'center' }}>{s.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 16px 10px', scrollbarWidth: 'none' }}>
        <Chip active={available_today === '1'} onClick={() => toggle('available_today')} icon="far fa-calendar-check" label="Available Today" />
        <Chip active={!!emirate} onClick={() => setParam('emirate', emirate ? '' : 'Dubai')} icon="fas fa-location-dot" label={emirate || 'Nearby'} />
        <Chip active={top_rated === '1'} onClick={() => toggle('top_rated')} icon="fas fa-star" label="Top Rated" />
        <Chip active={!!sort} onClick={() => setParam('sort', sort === 'fee_low' ? 'fee_high' : sort === 'fee_high' ? '' : 'fee_low')} icon="fas fa-arrow-down-short-wide" label={sort === 'fee_high' ? 'Fee: High' : sort === 'fee_low' ? 'Fee: Low' : 'Sort'} />
      </div>

      {/* Doctors list */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 8px' }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.4px' }}>{activeSpec ? activeSpec.name : 'Recommended'}</h2>
        <span style={{ color: '#8E8E93', fontSize: 14, fontWeight: 500 }}>{data?.total ?? 0} doctors</span>
      </div>
      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#8E8E93' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 44, textAlign: 'center', color: '#8E8E93' }}>No doctors found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
          {items.map((d) => <DoctorCard key={d.id} d={d} onOpen={setPopup} />)}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 20, border: 'none', background: active ? BLUE : '#fff', color: active ? '#fff' : '#3A3A3C', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: SANS, whiteSpace: 'nowrap', boxShadow: active ? 'none' : '0 1px 3px rgba(0,0,0,.05)' }}>
      <i className={icon} style={{ fontSize: 12 }}></i> {label}
    </button>
  );
}
