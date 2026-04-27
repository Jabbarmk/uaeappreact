import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

type GridCols = 1 | 2 | 3;

export default function OffersPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [grid, setGrid] = useState<GridCols>(() => {
    const saved = localStorage.getItem('offersGrid');
    return (saved === '2' ? 2 : saved === '3' ? 3 : 1) as GridCols;
  });

  const loc = params.get('loc') || 'Dubai';
  const cat = params.get('cat') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['offers', loc, cat],
    queryFn: () => api.get(`/offers?loc=${encodeURIComponent(loc)}&cat=${cat}`).then((r) => r.data),
  });

  const emirates: string[] = data?.emirates || ['Dubai', 'Abu Dhabi', 'Sharjah'];
  const categories: any[] = data?.categories || [];
  const offers: any[] = data?.offers || [];

  function changeGrid(n: GridCols) { setGrid(n); localStorage.setItem('offersGrid', String(n)); }

  const gridClass = grid === 1 ? 'offers-grid' : `offers-grid cols-${grid}`;

  return (
    <>
      <div className="page-topbar">
        <Link to="/" className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>OFFERS</h1>
        <div className="right-actions"></div>
      </div>

      {/* Location selector */}
      <div style={{ margin: '12px 16px', background: '#fff', borderRadius: 16, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(13,27,42,0.05)' }}>
        <i className="fas fa-map-marker-alt" style={{ color: '#6C5CE7', fontSize: 16 }}></i>
        <span style={{ fontSize: 12, color: '#9BA4B5', fontWeight: 600 }}>LOCATION</span>
        <select value={loc}
          onChange={(e) => navigate(`/offers?loc=${encodeURIComponent(e.target.value)}${cat ? `&cat=${cat}` : ''}`)}
          style={{ flex: 1, border: 'none', fontSize: 14, fontWeight: 700, color: '#1A1A2E', background: 'transparent', outline: 'none', cursor: 'pointer' }}>
          {emirates.map((em) => <option key={em} value={em}>{em}</option>)}
        </select>
        <i className="fas fa-chevron-down" style={{ color: '#9BA4B5', fontSize: 12, pointerEvents: 'none' }}></i>
      </div>

      {/* Category tabs */}
      <div style={{ margin: '0 0 14px', padding: '0 12px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as any}>
        <Link to={`/offers?loc=${encodeURIComponent(loc)}`}
          style={{ padding: '8px 16px', borderRadius: 999, background: !cat ? '#6C5CE7' : '#fff', color: !cat ? '#fff' : '#1A1A2E', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <i className="fas fa-fire" style={{ fontSize: 11 }}></i> All
        </Link>
        {categories.map((c: any) => (
          <Link key={c.id} to={`/offers?loc=${encodeURIComponent(loc)}&cat=${c.id}`}
            style={{ padding: '8px 16px', borderRadius: 999, background: String(c.id) === cat ? '#6C5CE7' : '#fff', color: String(c.id) === cat ? '#fff' : '#1A1A2E', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {c.icon && <span>{c.icon}</span>}
            {c.name}
          </Link>
        ))}
      </div>

      {/* Title + grid toggle */}
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A2E', margin: '0 0 2px' }}>
            Top Offers in <span style={{ color: '#6C5CE7' }}>{loc}</span>
          </h2>
          <span style={{ fontSize: 12, color: '#9BA4B5', fontWeight: 600 }}>{offers.length} offers</span>
        </div>
        <div className="grid-toggle">
          {([1, 2, 3] as GridCols[]).map((n) => (
            <button key={n} className={`grid-btn${grid === n ? ' active' : ''}`} onClick={() => changeGrid(n)}>
              {n === 1 && <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="4" rx="1"/><rect x="2" y="8" width="12" height="4" rx="1"/></svg>}
              {n === 2 && <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>}
              {n === 3 && <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="1" width="4" height="4" rx="1"/><rect x="6" y="1" width="4" height="4" rx="1"/><rect x="11" y="1" width="4" height="4" rx="1"/><rect x="1" y="7" width="4" height="4" rx="1"/><rect x="6" y="7" width="4" height="4" rx="1"/><rect x="11" y="7" width="4" height="4" rx="1"/></svg>}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div> : (
        <div className={gridClass}>
          {offers.length === 0 && (
            <div style={{ background: '#fff', padding: 32, borderRadius: 16, textAlign: 'center', color: '#9BA4B5', gridColumn: '1/-1' }}>
              <i className="fas fa-tag" style={{ fontSize: 32, marginBottom: 12, display: 'block', color: '#DDD' }}></i>
              No offers found in {loc}.
            </div>
          )}
          {offers.map((offer: any) => {
            const waLink = offer.business_whatsapp
              ? `https://wa.me/${offer.business_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I want to order: ${offer.title} (${offer.currency} ${Math.round(offer.price)})`)}`
              : null;
            const orderHref = waLink || (offer.business_phone ? `tel:${offer.business_phone}` : `/offers/${offer.id}`);
            const orderLabel = waLink ? 'Order Now' : offer.business_phone ? 'Call Now' : 'Order Now';
            const orderIcon = waLink ? 'fa-bolt' : offer.business_phone ? 'fa-phone' : 'fa-bolt';
            return (
              <div className="offer-card" key={offer.id}>
                <Link to={`/businesses/${offer.business_id}`} className="offer-biz-header">
                  <img src={offer.logoUrl} alt={offer.business_name} className="offer-biz-avatar"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop'; }}
                    loading="lazy" decoding="async" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="offer-biz-name">{offer.business_name}</div>
                    <div className="offer-biz-sub">
                      <i className="fas fa-map-marker-alt"></i>
                      {offer.emirate || offer.business_emirate || ''}
                      {offer.category_name && <><span>·</span><span>{offer.category_name}</span></>}
                    </div>
                  </div>
                  {offer.discount_percent && <div className="offer-discount-badge">-{Math.round(offer.discount_percent)}%</div>}
                </Link>
                <Link to={`/offers/${offer.id}`} style={{ display: 'block' }}>
                  <img src={offer.imageUrl} alt={offer.title} className="offer-img" loading="lazy" decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1000&fit=crop'; }} />
                </Link>
                <div className="offer-body">
                  <Link to={`/offers/${offer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="offer-title">{offer.title}</h3>
                    {offer.description && <p className="offer-desc">{offer.description.substring(0, 120)}…</p>}
                  </Link>
                  <div className="offer-price-row">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                      <span className="offer-price">{offer.currency} {Math.round(offer.price).toLocaleString()}</span>
                      {offer.original_price && offer.original_price > offer.price && (
                        <span className="offer-original">{offer.currency} {Math.round(offer.original_price).toLocaleString()}</span>
                      )}
                    </div>
                    <div className="offer-rating"><i className="fas fa-star"></i><span>{Number(offer.rating).toFixed(1)}</span></div>
                  </div>
                  <div className="offer-btns">
                    <Link to={`/offers/${offer.id}`} className="offer-btn" style={{ background: '#f0f2f8', color: '#1A1A2E' }}>
                      <i className="fas fa-book-open"></i> <span className="offer-btn-label">Read More</span>
                    </Link>
                    <a href={orderHref} target={waLink ? '_blank' : undefined} rel="noreferrer" className="offer-btn" style={{ background: '#6C5CE7', color: '#fff' }}>
                      <i className={`fas ${orderIcon}`}></i> <span className="offer-btn-label">{orderLabel}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .offers-grid{padding:0 20px 24px;display:grid;gap:16px;grid-template-columns:1fr}
        .offers-grid.cols-2{grid-template-columns:repeat(2,1fr);gap:12px;padding:0 12px 24px}
        .offers-grid.cols-3{grid-template-columns:repeat(3,1fr);gap:8px;padding:0 10px 24px}
        .offer-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 6px 28px rgba(13,27,42,0.09)}
        .offer-biz-header{display:flex;align-items:center;gap:10px;padding:12px 14px;text-decoration:none;color:inherit}
        .offer-biz-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0}
        .offer-biz-name{font-size:14px;font-weight:700;color:#1A1A2E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .offer-biz-sub{font-size:11px;color:#9BA4B5;display:flex;align-items:center;gap:4px}
        .offer-discount-badge{background:#FF6B6B;color:#fff;font-size:11px;font-weight:800;padding:4px 10px;border-radius:12px;flex-shrink:0}
        .offer-img{width:100%;object-fit:cover;display:block;aspect-ratio:3/4}
        .offer-body{padding:16px 18px 18px}
        .offer-title{font-size:16px;font-weight:800;color:#1A1A2E;margin:0 0 6px}
        .offer-desc{font-size:13px;color:#636E8A;line-height:1.5;margin:0 0 10px}
        .offer-price-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px}
        .offer-price{font-size:20px;font-weight:800;color:#6C5CE7}
        .offer-original{font-size:13px;color:#9BA4B5;text-decoration:line-through}
        .offer-rating{display:flex;align-items:center;gap:4px;background:#FFF5E7;border-radius:10px;padding:4px 10px}
        .offer-rating i{color:#FDCB6E;font-size:12px}
        .offer-rating span{font-size:12px;font-weight:700;color:#1A1A2E}
        .offer-btns{display:flex;gap:8px}
        .offer-btn{flex:1;padding:11px 0;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px}
        .cols-2 .offer-img,.cols-3 .offer-img{aspect-ratio:1/1}
        .cols-2 .offer-desc,.cols-3 .offer-desc{display:none}
        .cols-2 .offer-biz-sub,.cols-3 .offer-biz-sub{display:none}
        .cols-3 .offer-btn-label{display:none}
        .grid-toggle{display:flex;gap:4px;align-items:center}
        .grid-btn{width:30px;height:30px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;background:#f0f2f8}
        .grid-btn.active{background:#6C5CE7}
        .grid-btn svg rect{fill:#9BA4B5}
        .grid-btn.active svg rect{fill:#fff}
      `}</style>
    </>
  );
}
