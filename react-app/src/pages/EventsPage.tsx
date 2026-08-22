import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

type GridCols = 1 | 2 | 3;
const EMIRATES = ['All UAE', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) : '';

export default function EventsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [grid, setGrid] = useState<GridCols>(() => {
    const saved = localStorage.getItem('eventsGrid');
    return (saved === '2' ? 2 : saved === '3' ? 3 : 1) as GridCols;
  });

  const loc = params.get('loc') || 'All UAE';
  const cat = params.get('cat') || '';
  const emirate = loc === 'All UAE' ? '' : loc;

  const { data: catData } = useQuery({
    queryKey: ['event-categories'],
    queryFn: () => api.get('/events/categories').then((r) => r.data),
  });
  const { data, isLoading } = useQuery({
    queryKey: ['events', emirate, cat],
    queryFn: () => api.get(`/events?${emirate ? `emirate=${encodeURIComponent(emirate)}&` : ''}${cat ? `category=${cat}&` : ''}pageSize=60`).then((r) => r.data),
  });

  const categories: any[] = catData?.categories || [];
  const events: any[] = data?.items || [];

  const goto = (nextLoc: string, nextCat: string) =>
    navigate(`/events?loc=${encodeURIComponent(nextLoc)}${nextCat ? `&cat=${nextCat}` : ''}`);
  const changeGrid = (n: GridCols) => { setGrid(n); localStorage.setItem('eventsGrid', String(n)); };
  const gridClass = grid === 1 ? 'events-grid' : grid === 2 ? 'events-grid cols-2' : 'events-grid list';

  return (
    <>
      <div className="page-topbar">
        <Link to="/" className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>EVENTS</h1>
        <div className="right-actions">
          {/* Compact location selector (top-right) */}
          <label className="loc-pill">
            <i className="fas fa-map-marker-alt loc-pin"></i>
            <select value={loc} onChange={(e) => goto(e.target.value, cat)}>
              {EMIRATES.map((em) => <option key={em} value={em}>{em}</option>)}
            </select>
            <i className="fas fa-chevron-down loc-chev"></i>
          </label>
        </div>
      </div>

      {/* Category tabs */}
      <div className="cat-tabs">
        <button onClick={() => goto(loc, '')} className={`cat-tab${!cat ? ' active' : ''}`}>
          <i className="fas fa-calendar-day"></i> All
        </button>
        {categories.map((c: any) => (
          <button key={c.id} onClick={() => goto(loc, String(c.id))} className={`cat-tab${String(c.id) === cat ? ' active' : ''}`}>
            {c.icon && <span>{c.icon}</span>}{c.name}
          </button>
        ))}
      </div>

      {/* Title + grid toggle */}
      <div className="offers-head">
        <div>
          <h2 className="offers-head-title">Upcoming in <span>{loc}</span></h2>
          <span className="offers-head-count">{events.length} events</span>
        </div>
        <div className="grid-toggle">
          {([1, 2, 3] as GridCols[]).map((n) => (
            <button key={n} className={`grid-btn${grid === n ? ' active' : ''}`} onClick={() => changeGrid(n)}>
              {n === 1 && <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="4" rx="1"/><rect x="2" y="8" width="12" height="4" rx="1"/></svg>}
              {n === 2 && <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>}
              {n === 3 && <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="2" width="5" height="5" rx="1"/><rect x="8" y="2.4" width="7" height="1.6" rx="0.8"/><rect x="8" y="5.2" width="5" height="1.6" rx="0.8"/><rect x="1" y="9" width="5" height="5" rx="1"/><rect x="8" y="9.4" width="7" height="1.6" rx="0.8"/><rect x="8" y="12.2" width="5" height="1.6" rx="0.8"/></svg>}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div> : (
        <div className={gridClass}>
          {events.length === 0 && (
            <div style={{ background: '#fff', padding: '40px 24px', borderRadius: 18, textAlign: 'center', color: '#9BA4B5', gridColumn: '1/-1', border: '1px solid #F0F1F5', boxShadow: '0 4px 20px rgba(13,27,42,0.05)' }}>
              <i className="far fa-calendar" style={{ fontSize: 34, marginBottom: 14, display: 'block', color: '#DDD' }}></i>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No upcoming events in {loc}</div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>Try another location or category.</div>
            </div>
          )}
          {events.map((ev: any) => {
            const free = !(Number(ev.price) > 0);
            const wa = ev.organizer_whatsapp ? `https://wa.me/${String(ev.organizer_whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'd like to book for: ${ev.title}`)}` : null;
            const bookHref = ev.booking_url || wa || (ev.organizer_phone ? `tel:${ev.organizer_phone}` : `/events/${ev.id}`);
            const bookLabel = ev.booking_url ? 'Get Tickets' : wa ? 'Book' : ev.organizer_phone ? 'Call' : 'Details';
            const bookIcon = ev.booking_url ? 'fa-ticket-alt' : wa ? 'fa-whatsapp' : ev.organizer_phone ? 'fa-phone' : 'fa-arrow-right';
            const external = !!(ev.booking_url || wa);
            return (
              <div className="event-card" key={ev.id}>
                <Link to={`/events/${ev.id}`} className="event-media">
                  <img src={ev.posterUrl} alt={ev.title} className="event-img" loading="lazy" decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop'; }} />
                  {ev.category_name && <span className="event-cat-badge">{ev.category_icon ? `${ev.category_icon} ` : ''}{ev.category_name}</span>}
                  {ev.event_date && (
                    <span className="event-date-badge">
                      <b>{new Date(ev.event_date).getDate()}</b>
                      {new Date(ev.event_date).toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                  )}
                  <span className={`event-price-badge${free ? ' free' : ''}`}>{free ? 'FREE' : `${ev.currency || 'AED'} ${Math.round(ev.price)}`}</span>
                </Link>
                <div className="event-body">
                  <Link to={`/events/${ev.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="event-title">{ev.title}</h3>
                  </Link>
                  <div className="event-meta"><i className="far fa-calendar"></i> {fmtDate(ev.event_date)}{ev.start_time ? ` · ${ev.start_time}` : ''}</div>
                  {(ev.venue || ev.location) && <div className="event-meta"><i className="fas fa-map-marker-alt"></i> {ev.venue || ev.location}{ev.emirate ? `, ${ev.emirate}` : ''}</div>}
                  <div className="event-btns">
                    <Link to={`/events/${ev.id}`} className="event-btn" style={{ background: '#f0f2f8', color: '#1A1A2E' }}>
                      <i className="fas fa-circle-info"></i> <span className="event-btn-label">Details</span>
                    </Link>
                    <a href={bookHref} target={external ? '_blank' : undefined} rel="noreferrer" className="event-btn" style={{ background: 'var(--primary)', color: '#fff' }}>
                      <i className={`fas ${bookIcon}`}></i> <span className="event-btn-label">{bookLabel}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        /* ── Category tabs ── */
        .cat-tabs{display:flex;gap:8px;overflow-x:auto;padding:2px 16px;margin:6px 0 18px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .cat-tabs::-webkit-scrollbar{display:none}
        .cat-tab{padding:8px 15px;border-radius:999px;background:#fff;color:#1A1A2E;font-size:13px;font-weight:700;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:6px;flex-shrink:0;border:1px solid #ECECF3;box-shadow:0 1px 4px rgba(13,27,42,0.04);cursor:pointer;transition:background .15s,color .15s,box-shadow .15s}
        .cat-tab i{font-size:11px}
        .cat-tab.active{background:var(--primary);color:#fff;border-color:var(--primary);box-shadow:0 5px 14px rgba(var(--primary-rgb),0.28)}

        /* ── Section heading + grid toggle ── */
        .offers-head{padding:0 16px 15px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .offers-head-title{font-size:20px;font-weight:800;color:#1A1A2E;margin:0 0 3px;letter-spacing:-0.4px;line-height:1.2}
        .offers-head-title span{color:var(--primary)}
        .offers-head-count{font-size:12px;color:#9BA4B5;font-weight:600}

        /* ── Grid containers (unified 16px gutter) ── */
        .events-grid{padding:0 16px 32px;display:grid;gap:16px;grid-template-columns:1fr}
        .events-grid.cols-2{grid-template-columns:repeat(2,1fr);gap:12px}
        .events-grid.list{grid-template-columns:1fr;gap:12px}

        /* ── Event card ── */
        .event-card{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 20px rgba(13,27,42,0.07);border:1px solid #F0F1F5}
        .event-media{display:block;position:relative}
        .event-img{width:100%;height:auto;object-fit:contain;display:block;background:#F7F8FB}
        .event-cat-badge{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.55);color:#fff;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;backdrop-filter:blur(4px);max-width:calc(100% - 74px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .event-date-badge{position:absolute;top:10px;right:10px;background:#fff;border-radius:12px;padding:5px 10px;display:flex;flex-direction:column;align-items:center;line-height:1;color:var(--primary);font-size:10px;font-weight:700;text-transform:uppercase;box-shadow:0 4px 12px rgba(0,0,0,.18)}
        .event-date-badge b{font-size:16px;font-weight:800;color:#1A1A2E}
        .event-price-badge{position:absolute;bottom:10px;left:10px;background:var(--primary);color:#fff;font-size:12px;font-weight:800;padding:5px 12px;border-radius:999px;box-shadow:0 3px 9px rgba(var(--primary-rgb),0.32)}
        .event-price-badge.free{background:#00B894;box-shadow:0 3px 9px rgba(0,184,148,0.32)}
        .event-body{padding:14px 16px 16px}
        .event-title{font-size:16px;font-weight:800;color:#1A1A2E;margin:0 0 9px;line-height:1.32;letter-spacing:-0.2px}
        .event-meta{font-size:12.5px;color:#636E8A;display:flex;align-items:center;gap:7px;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .event-meta i{color:#9BA4B5;width:13px;flex-shrink:0}
        .event-btns{display:flex;gap:10px;margin-top:13px}
        .event-btn{flex:1;padding:12px 0;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:7px;transition:transform .12s;-webkit-tap-highlight-color:transparent}
        .event-btn i{font-size:13px}
        .event-btn:active{transform:scale(0.97)}

        /* ── Style 2: 2-column, compact + responsive text ── */
        .cols-2 .event-img{aspect-ratio:1/1;object-fit:cover}
        .cols-2 .event-meta{display:none}
        .cols-2 .event-body{padding:12px 12px 13px}
        .cols-2 .event-title{font-size:clamp(12px,3.4vw,15px);margin-bottom:0}
        .cols-2 .event-cat-badge{font-size:clamp(9px,2.6vw,11px);padding:4px 9px}
        .cols-2 .event-price-badge{font-size:clamp(10px,2.8vw,12px);padding:4px 10px}
        .cols-2 .event-date-badge b{font-size:14px}
        .cols-2 .event-btns{margin-top:11px}
        .cols-2 .event-btn{font-size:clamp(11px,3vw,13px);padding:10px 0;gap:5px}

        /* ── Style 3: horizontal list — image left, text right, buttons bottom ── */
        .events-grid.list .event-card{display:grid;grid-template-columns:134px 1fr;grid-template-areas:"img body";align-items:stretch}
        .events-grid.list .event-media{grid-area:img;align-self:stretch}
        .events-grid.list .event-img{width:100%;height:100%;min-height:100%;object-fit:cover;aspect-ratio:auto}
        .events-grid.list .event-date-badge{top:8px;right:auto;left:8px}
        .events-grid.list .event-cat-badge{display:none}
        .events-grid.list .event-price-badge{bottom:8px;left:8px}
        .events-grid.list .event-body{grid-area:body;padding:12px 14px 14px;display:flex;flex-direction:column}
        .events-grid.list .event-title{font-size:15px;margin-bottom:8px}
        .events-grid.list .event-btns{margin-top:auto}
        @media (max-width:420px){
          .events-grid.list .event-card{grid-template-columns:106px 1fr}
          .events-grid.list .event-title{font-size:14px}
          .events-grid.list .event-btn-label{display:none}
        }

        /* ── Top-right location pill ── */
        .loc-pill{display:inline-flex;align-items:center;gap:7px;background:#fff;border:1px solid #ECECF3;border-radius:999px;padding:8px 13px;box-shadow:0 2px 10px rgba(13,27,42,0.07);cursor:pointer;transition:box-shadow .15s}
        .loc-pill:hover{box-shadow:0 4px 14px rgba(13,27,42,0.11)}
        .loc-pill .loc-pin{color:var(--primary);font-size:13px}
        .loc-pill select{border:none;background:transparent;font-size:13px;font-weight:700;color:#1A1A2E;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;width:auto;padding:2px 6px}
        .loc-pill select option{padding:6px 10px}
        .loc-pill .loc-chev{color:#9BA4B5;font-size:10px;pointer-events:none}

        /* ── Grid toggle ── */
        .grid-toggle{display:flex;gap:5px;align-items:center;background:#EEF0F6;padding:4px;border-radius:11px}
        .grid-btn{width:30px;height:30px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;background:transparent;transition:background .15s}
        .grid-btn.active{background:var(--primary);box-shadow:0 3px 8px rgba(var(--primary-rgb),0.3)}
        .grid-btn svg rect{fill:#9BA4B5;transition:fill .15s}
        .grid-btn.active svg rect{fill:#fff}
      `}</style>
    </>
  );
}
