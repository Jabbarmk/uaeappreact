import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import api from '../api';

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];

// Haversine distance in km between two coordinates.
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// One collection (e.g. Top 10 Tourist Places) — 2-per-row item postcards with search,
// emirate filter chips and Near Me (mirrors the businesses listing behavior).
export default function CollectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sheet, setSheet] = useState<any | null>(null);
  const [emirate, setEmirate] = useState(''); // '' = UAE (all)
  const [nearMe, setNearMe] = useState(false);
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<'idle' | 'loading' | 'error'>('idle');

  const { data, isLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => api.get(`/collections/${id}`).then((r) => r.data),
  });

  const openNearMe = () => {
    setNearMe(true); setEmirate('');
    if (geo || geoState === 'loading') return;
    if (!navigator.geolocation) { setGeoState('error'); return; }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoState('idle'); },
      () => setGeoState('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const searched: any[] = useMemo(() => (data?.items || []).filter((i: any) =>
    i.title.toLowerCase().includes(search.trim().toLowerCase())), [data, search]);

  // Near Me: items with coordinates, within 5 km — else 10 km — else all by distance.
  const items: any[] = useMemo(() => {
    if (nearMe) {
      if (!geo) return [];
      const withDist = searched
        .filter((i) => i.latitude != null && i.longitude != null)
        .map((i) => ({ ...i, km: distanceKm(geo.lat, geo.lng, i.latitude, i.longitude) }))
        .sort((a, b) => a.km - b.km);
      const within5 = withDist.filter((i) => i.km <= 5);
      if (within5.length) return within5;
      const within10 = withDist.filter((i) => i.km <= 10);
      if (within10.length) return within10;
      return withDist;
    }
    return emirate ? searched.filter((i) => i.emirate === emirate) : searched;
  }, [searched, emirate, nearMe, geo]);

  const openItem = (item: any) => {
    if (item.business_id) navigate(`/businesses/${item.business_id}`);
    else setSheet(item);
  };

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>{data?.title || 'Collection'}</h1>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search…" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="emirate-chips">
        <button className={`emirate-chip${!nearMe && emirate === '' ? ' active' : ''}`} onClick={() => { setEmirate(''); setNearMe(false); }}>UAE</button>
        <button className={`emirate-chip${nearMe ? ' active' : ''}`} onClick={openNearMe}><i className="fas fa-location-arrow" style={{ fontSize: 10, marginRight: 4 }}></i>Near Me</button>
        {EMIRATES.map((em) => (
          <button key={em} className={`emirate-chip${!nearMe && emirate === em ? ' active' : ''}`} onClick={() => { setEmirate(em); setNearMe(false); }}>{em}</button>
        ))}
      </div>

      {nearMe && geoState === 'loading' && <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-secondary)' }}>Getting your location…</div>}
      {nearMe && geoState === 'error' && <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-secondary)' }}>Location unavailable — allow location access and try again.</div>}

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : items.length === 0 && !(nearMe && geoState !== 'idle') ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
          {nearMe ? 'No places with location info in this collection' : `No items found${emirate ? ` in ${emirate}` : ''}`}
        </div>
      ) : (
        <div className="colx-grid">
          {items.map((item) => (
            <div key={item.id} className="colx-card" onClick={() => openItem(item)} role="button" tabIndex={0}>
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />
                : <div className="colx-noimg"><i className="fas fa-image"></i></div>}
              <div className="colx-overlay">
                <div className="colx-name">{item.title}</div>
                {item.km != null
                  ? <div className="colx-sub"><i className="fas fa-location-arrow"></i> {item.km < 1 ? `${Math.round(item.km * 1000)} m` : `${item.km.toFixed(1)} km`} away</div>
                  : item.emirate
                    ? <div className="colx-sub"><i className="fas fa-map-marker-alt"></i> {item.emirate}</div>
                    : item.business_id && <div className="colx-sub"><i className="fas fa-link"></i> {item.business_name}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 90 }} />

      {/* Bottom sheet for unlinked items */}
      {sheet && (
        <div className="colx-sheet-wrap" onClick={() => setSheet(null)}>
          <div className="colx-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="colx-sheet-bar" />
            {sheet.imageUrl && <img className="colx-sheet-img" src={sheet.imageUrl} alt={sheet.title} />}
            <div className="colx-sheet-body">
              <h3>{sheet.title}</h3>
              {sheet.description && <p>{sheet.description}</p>}
              <button className="colx-sheet-close" onClick={() => setSheet(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .colx-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:4px 16px}
        .colx-card{position:relative;aspect-ratio:150/190;border-radius:16px;overflow:hidden;display:block;box-shadow:0 4px 14px rgba(13,27,42,0.10);background:#DDE3F0;cursor:pointer}
        .colx-card img{width:100%;height:100%;object-fit:cover;display:block}
        .colx-noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9BA4B5;font-size:30px}
        .colx-overlay{position:absolute;bottom:0;left:0;right:0;padding:26px 12px 11px;background:linear-gradient(transparent,rgba(0,0,0,0.78))}
        .colx-name{color:#fff;font-size:14px;font-weight:700;line-height:1.25}
        .colx-sub{color:rgba(255,255,255,.85);font-size:11px;font-weight:600;margin-top:3px}
        .colx-sub i{font-size:9px}
        .colx-sheet-wrap{position:fixed;inset:0;background:rgba(10,14,30,0.55);z-index:900;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .18s ease}
        .colx-sheet{background:#fff;border-radius:22px 22px 0 0;width:100%;max-width:480px;max-height:82vh;overflow-y:auto;animation:fadeInUp .22s ease}
        .colx-sheet-bar{width:42px;height:5px;border-radius:3px;background:#D9DEE9;margin:10px auto 4px}
        .colx-sheet-img{width:100%;max-height:260px;object-fit:cover;display:block}
        .colx-sheet-body{padding:16px 20px 26px}
        .colx-sheet-body h3{font-size:18px;font-weight:800;color:var(--dark);margin:0 0 8px}
        .colx-sheet-body p{font-size:13.5px;color:var(--text-secondary);line-height:1.55;margin:0 0 16px;white-space:pre-wrap}
        .colx-sheet-close{width:100%;padding:12px;border:none;border-radius:14px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer}
      `}</style>
    </>
  );
}
