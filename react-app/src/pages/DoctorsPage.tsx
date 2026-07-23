import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import DoctorCard, { docColor } from '../components/DoctorCard';
import DoctorPopup from '../components/DoctorPopup';

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

  return (
    <>
      {popup && <DoctorPopup doctor={popup} onClose={() => setPopup(null)} />}

      {/* Gradient header */}
      <div style={{ background: 'linear-gradient(135deg,#5B4BD1,#6C5CE7)', padding: '14px 16px 22px', borderRadius: '0 0 26px 26px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', flexShrink: 0 }}><i className="fas fa-arrow-left"></i></Link>
          <h1 style={{ flex: 1, margin: 0, fontSize: 24, fontWeight: 800 }}>Doctors</h1>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.2)', borderRadius: 50, padding: '7px 12px', fontSize: 13, fontWeight: 600 }}>
            <i className="fas fa-map-marker-alt"></i> {emirate || 'UAE'}
          </span>
        </div>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 50, padding: '6px 8px 6px 18px', marginTop: 16, boxShadow: '0 6px 18px rgba(0,0,0,.15)' }}>
          <i className="fas fa-search" style={{ color: '#9AA0AE' }}></i>
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') setParam('search', search); }}
            placeholder="Search doctor, specialty or clinic" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: '#333', fontFamily: 'inherit', minWidth: 0 }} />
          <button onClick={() => setParam('search', search)} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', border: 'none', color: '#fff', cursor: 'pointer', flexShrink: 0 }}><i className="fas fa-sliders-h"></i></button>
        </div>
      </div>

      {/* Browse by Specialty */}
      <div style={{ padding: '18px 0 4px' }}>
        <div className="section-header" style={{ marginBottom: 4 }}><h2>Browse by Specialty</h2>{specialty && <button onClick={() => setParam('specialty', '')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Clear</button>}</div>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '10px 16px', scrollbarWidth: 'none' }}>
          {specialties.map((s) => {
            const active = String(s.id) === specialty;
            const c = docColor(s.id);
            return (
              <button key={s.id} onClick={() => setParam('specialty', active ? '' : String(s.id))}
                style={{ flexShrink: 0, width: 74, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto', position: 'relative', boxShadow: active ? `0 0 0 3px #fff, 0 0 0 5px ${c.bg}` : '0 4px 12px rgba(0,0,0,.12)' }}>
                  {s.icon}
                  {active && <span style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: '#0E9F6E', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}><i className="fas fa-check"></i></span>}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: active ? c.bg : 'var(--text-secondary)', marginTop: 7, lineHeight: 1.2, textAlign: 'center' }}>{s.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 16px 10px', scrollbarWidth: 'none' }}>
        <Chip active={available_today === '1'} onClick={() => toggle('available_today')} icon="far fa-calendar-check" label="Available Today" />
        <Chip active={!!emirate} onClick={() => setParam('emirate', emirate ? '' : 'Dubai')} icon="fas fa-map-marker-alt" label={emirate || 'Nearby'} />
        <Chip active={top_rated === '1'} onClick={() => toggle('top_rated')} icon="far fa-star" label="Top Rated" />
        <button onClick={() => setParam('sort', sort === 'fee_low' ? 'fee_high' : sort === 'fee_high' ? '' : 'fee_low')}
          style={{ flexShrink: 0, width: 42, height: 40, borderRadius: 12, border: '1.5px solid rgba(108,92,231,.25)', background: sort ? 'var(--primary)' : '#fff', color: sort ? '#fff' : 'var(--primary)', cursor: 'pointer' }}>
          <i className="fas fa-sort"></i>
        </button>
      </div>

      {/* Recommended doctors */}
      <div className="section-header"><h2>{specialty ? (data?.specName || 'Doctors') : 'Recommended Doctors'}</h2><span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>{data?.total ?? 0} doctors</span></div>
      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No doctors found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 16px 28px' }}>
          {items.map((d) => <DoctorCard key={d.id} d={d} onOpen={setPopup} />)}
        </div>
      )}
    </>
  );
}

function Chip({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 12, border: `1.5px solid ${active ? 'var(--primary)' : 'rgba(108,92,231,.25)'}`, background: active ? 'var(--primary)' : '#fff', color: active ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      <i className={icon}></i> {label}
    </button>
  );
}
