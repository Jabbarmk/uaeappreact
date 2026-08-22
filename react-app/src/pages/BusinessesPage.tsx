import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { bizThemeStyle } from '../bizTheme';

// Category banners — one static, several auto-slide with a crossfade + dots.
function CatBannerSlider({ banners, catName }: { banners: any[]; catName: string }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setCur((c) => (c + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, [banners.length]);
  const banner = banners[Math.min(cur, banners.length - 1)];
  if (!banner) return null;

  const inner = (
    <div key={cur} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', animation: 'fadeIn .5s ease' }}>
      {banner.videoUrl ? (
        <video src={banner.videoUrl} autoPlay muted loop playsInline
          poster={banner.imageUrl || undefined}
          style={{ width: '100%', height: 'auto', display: 'block' }} />
      ) : (
        <img src={banner.imageUrl} alt={banner.title || catName}
          style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" decoding="async" />
      )}
      {(banner.title || banner.subtitle) && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%)' }}>
          {banner.title && <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{banner.title}</div>}
          {banner.subtitle && <div style={{ color: 'rgba(255,255,255,.9)', fontSize: 13, marginTop: 6 }}>{banner.subtitle}</div>}
        </div>
      )}
    </div>
  );
  const to = banner.business_id ? `/businesses/${banner.business_id}` : banner.link;
  return (
    <div style={{ margin: 16 }}>
      {to ? <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link> : inner}
      {banners.length > 1 && (
        <div className="slider-dots" style={{ padding: '10px 0 0' }}>
          {banners.map((_, i) => (
            <div key={i} className={`dot${i === cur ? ' active' : ''}`} onClick={() => setCur(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

const VerifiedTick = () => (
  <i className="fas fa-check-circle" title="Verified"
    style={{ color: '#1B95E0', fontSize: 13, marginLeft: 5, verticalAlign: 'middle' }}></i>
);

const BIZ_FALLBACKS = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=480&h=270&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=480&h=270&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=480&h=270&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=480&h=270&fit=crop',
];

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];

const isVideoFile = (v: string) => /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|$)/i.test(v || '');

// Haversine distance in km between two coordinates.
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function BusinessesPage() {
  const [params] = useSearchParams();
  const catId = params.get('cat') || '';

  const [tab, setTab] = useState<'popular' | 'nearme'>('popular');
  const [search, setSearch] = useState('');
  const [emirate, setEmirate] = useState(''); // '' = UAE (all)
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<'idle' | 'loading' | 'error'>('idle');

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', catId],
    queryFn: () => api.get(`/businesses?cat=${catId}`).then((r) => r.data),
  });

  const businesses: any[] = data?.businesses || [];
  const catName: string = data?.catName || 'All Businesses';
  const banners: any[] = data?.banners || (data?.banner ? [data.banner] : []);
  // Admin-controlled image heights (px) — null falls back to CSS defaults.
  const featImgH: number | null = data?.imgHeights?.featured || null;
  const rowImgH: number | null = data?.imgHeights?.row || null;

  const openNearMe = () => {
    setTab('nearme');
    if (geo || geoState === 'loading') return;
    if (!navigator.geolocation) { setGeoState('error'); return; }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoState('idle'); },
      () => setGeoState('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Text filter: matches business name OR its admin-set search keywords.
  const q = search.trim().toLowerCase();
  const searched = useMemo(
    () => (q ? businesses.filter((b) =>
      String(b.name || '').toLowerCase().includes(q) || String(b.keywords || '').toLowerCase().includes(q)
    ) : businesses),
    [businesses, q]
  );

  // Popular tab: optional emirate filter, server order (featured DESC, sort_order ASC).
  const popular = useMemo(
    () => (emirate ? searched.filter((b) => b.emirate === emirate) : searched),
    [searched, emirate]
  );
  const featured = popular.filter((b) => Number(b.featured) === 1);
  const regular = popular.filter((b) => Number(b.featured) !== 1);

  // Near Me tab: businesses with coordinates, within 5 km — else 10 km — else all by distance.
  const nearby = useMemo(() => {
    if (!geo) return [];
    const withDist = searched
      .filter((b) => b.latitude != null && b.longitude != null)
      .map((b) => ({ ...b, km: distanceKm(geo.lat, geo.lng, Number(b.latitude), Number(b.longitude)) }))
      .sort((a, b) => a.km - b.km);
    const within5 = withDist.filter((b) => b.km <= 5);
    if (within5.length) return within5;
    const within10 = withDist.filter((b) => b.km <= 10);
    if (within10.length) return within10;
    return withDist; // nothing within 10 km — show nearest anyway
  }, [searched, geo]);

  const renderBigCard = (biz: any, idx: number) => (
    <div className="biz-card" key={biz.id} style={bizThemeStyle(biz.color)}>
      {isVideoFile(biz.imageUrl) ? (
        <video src={biz.imageUrl} className="biz-img" muted autoPlay loop playsInline
          style={{ cursor: 'pointer', ...(featImgH ? { height: featImgH, aspectRatio: 'auto' } : {}) }}
          onClick={() => window.location.assign(`/businesses/${biz.id}`)} />
      ) : (
        <img src={biz.imageUrl} alt={biz.name} className="biz-img"
          style={{ cursor: 'pointer', ...(featImgH ? { height: featImgH, aspectRatio: 'auto' } : {}) }}
          onClick={() => window.location.assign(`/businesses/${biz.id}`)}
          onError={(e) => { (e.target as HTMLImageElement).src = BIZ_FALLBACKS[idx % BIZ_FALLBACKS.length]; }}
          loading="lazy" decoding="async" />
      )}
      <div className="biz-body">
        <div className="biz-rating"><i className="fas fa-star"></i> {Number(biz.rating).toFixed(1)}</div>
        <h3>{biz.name}{Number(biz.is_verified) === 1 && <VerifiedTick />}</h3>
        <div className="biz-type">{biz.description}</div>
        {biz.distance && <div className="biz-distance">{biz.distance}</div>}
        <div className="biz-address"><i className="fas fa-map-marker-alt"></i> {biz.address}</div>
        <div className="biz-actions">
          <button className="btn" onClick={() => navigator.share?.({ title: biz.name, url: `/businesses/${biz.id}` })}><i className="fas fa-share-alt"></i> Share</button>
          <a href={`tel:${biz.phone}`} className="btn btn-call"><i className="fas fa-phone"></i> Call</a>
          <Link to={`/businesses/${biz.id}`} className="btn-details"><i className="fas fa-eye"></i> View Details</Link>
        </div>
      </div>
    </div>
  );

  // Compact row — image left, content right, full-width action row at the bottom.
  const renderRow = (biz: any, idx: number) => {
    const wa = String(biz.whatsapp || biz.phone || '').replace(/\D/g, '');
    return (
      <div className="biz-row" key={biz.id} style={bizThemeStyle(biz.color)}>
        {isVideoFile(biz.imageUrl) ? (
          <video src={biz.imageUrl} className="biz-row-img" muted autoPlay loop playsInline
            style={rowImgH ? { minHeight: rowImgH } : undefined}
            onClick={() => window.location.assign(`/businesses/${biz.id}`)} />
        ) : (
          <img src={biz.imageUrl} alt={biz.name} className="biz-row-img"
            style={rowImgH ? { minHeight: rowImgH } : undefined}
            onClick={() => window.location.assign(`/businesses/${biz.id}`)}
            onError={(e) => { (e.target as HTMLImageElement).src = BIZ_FALLBACKS[idx % BIZ_FALLBACKS.length]; }}
            loading="lazy" decoding="async" />
        )}
        <div className="biz-row-body">
          <div className="biz-row-head">
            <h3>{biz.name}{Number(biz.is_verified) === 1 && <VerifiedTick />}</h3>
            <div className="biz-row-rating"><i className="fas fa-star"></i> {Number(biz.rating).toFixed(1)}</div>
          </div>
          {biz.tagline && <div className="biz-row-tagline">{biz.tagline}</div>}
          {biz.description && <div className="biz-row-type">{biz.description}</div>}
          <div className="biz-row-address">
            <i className="fas fa-map-marker-alt"></i> {biz.address}
            {biz.km != null && <span className="biz-row-km">{biz.km < 1 ? `${Math.round(biz.km * 1000)} m` : `${biz.km.toFixed(1)} km`}</span>}
          </div>
        </div>
        <div className="biz-row-foot">
          <a href={`tel:${biz.phone}`} className="biz-row-btn biz-row-btn-call"><i className="fas fa-phone"></i> Call</a>
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="biz-row-btn biz-row-btn-wa"><i className="fab fa-whatsapp"></i> WhatsApp</a>}
          <Link to={`/businesses/${biz.id}`} className="biz-row-btn biz-row-btn-details"><i className="fas fa-eye"></i> View Details</Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>{catName}</h1>
        <div className="right-actions">
          <span style={{ fontSize: 12, fontWeight: 600 }}>Help?</span>
          <i className="fab fa-whatsapp" style={{ color: '#25D366', fontSize: 24 }}></i>
        </div>
      </div>

      {banners.length > 0 ? (
        <CatBannerSlider banners={banners} catName={catName} />
      ) : (
        <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 160, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=320&fit=crop"
            alt="UAE Business" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy" decoding="async" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(var(--primary-rgb),0.75),rgba(0,206,201,0.55))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 }}>
            <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.8, marginBottom: 6 }}>Discover</div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{catName}</div>
            <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 6 }}>Top-rated businesses near you</div>
          </div>
        </div>
      )}

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search company or keyword…" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        {search && <button className="filter-btn" onClick={() => setSearch('')}><i className="fas fa-times"></i></button>}
      </div>

      <div className="tab-nav">
        <a href="#" className={tab === 'popular' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setTab('popular'); }}>Popular</a>
        <a href="#" className={tab === 'nearme' ? 'active' : ''} onClick={(e) => { e.preventDefault(); openNearMe(); }}>Near Me</a>
      </div>

      {tab === 'popular' && (
        <div className="emirate-chips">
          <button className={`emirate-chip${emirate === '' ? ' active' : ''}`} onClick={() => setEmirate('')}>UAE</button>
          {EMIRATES.map((em) => (
            <button key={em} className={`emirate-chip${emirate === em ? ' active' : ''}`} onClick={() => setEmirate(em)}>{em}</button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="loading" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : tab === 'popular' ? (
        <div className="biz-list">
          {featured.map(renderBigCard)}
          {regular.map(renderRow)}
          {popular.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9BA4B5' }}>No businesses found{emirate ? ` in ${emirate}` : ''}.</div>
          )}
        </div>
      ) : (
        <div className="biz-list">
          {geoState === 'loading' && <div style={{ padding: 40, textAlign: 'center', color: '#9BA4B5' }}>Getting your location…</div>}
          {geoState === 'error' && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9BA4B5' }}>
              Location unavailable. Please allow location access to see businesses near you.
            </div>
          )}
          {geo && nearby.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9BA4B5' }}>No businesses with location data found.</div>
          )}
          {geo && nearby.map(renderRow)}
        </div>
      )}

      <div style={{ height: 80 }} />
    </>
  );
}
