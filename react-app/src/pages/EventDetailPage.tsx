import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

const fmtDay = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }) : null;

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.get(`/events/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.item) return <div style={{ padding: 40 }}>Not found. <Link to="/events">Back</Link></div>;

  const ev = data.item;
  const images: string[] = data.images || [];
  const free = !(Number(ev.price) > 0);
  const wa = ev.organizer_whatsapp ? `https://wa.me/${String(ev.organizer_whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'd like to book for: ${ev.title}`)}` : null;

  const dateStr = ev.end_date && ev.end_date !== ev.event_date
    ? `${fmtDay(ev.event_date)} → ${fmtDay(ev.end_date)}`
    : fmtDay(ev.event_date);
  const timeStr = ev.start_time ? `${ev.start_time}${ev.end_time ? ` – ${ev.end_time}` : ''}` : null;

  const infoRows: [string, string, string | null][] = [
    ['fa-calendar-alt', 'Date', dateStr],
    ['fa-clock', 'Time', timeStr],
    ['fa-map-marker-alt', 'Venue', ev.venue || ev.location],
    ['fa-city', 'Emirate', ev.emirate],
    ['fa-user-tie', 'Organizer', ev.organizer],
    ['fa-phone', 'Contact', ev.organizer_phone],
  ].filter(([, , v]) => v) as [string, string, string][];

  return (
    <>
      <div className="page-topbar">
        <Link to="/events" className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 className="ev-topbar-title">{ev.title}</h1>
        <div className="right-actions"></div>
      </div>

      <div className="ev-page">
        {/* Poster */}
        <div className="ev-poster">
          <img src={ev.posterUrl} alt={ev.title}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop'; }}
            loading="lazy" decoding="async" />
          {ev.category_name && (
            <span className="ev-poster-cat">{ev.category_icon ? `${ev.category_icon} ` : ''}{ev.category_name}</span>
          )}
          <span className={`ev-poster-price${free ? ' free' : ''}`}>
            {free ? 'FREE ENTRY' : `${ev.currency || 'AED'} ${Math.round(ev.price).toLocaleString()}`}
          </span>
        </div>

        {/* Hero: title + when/where + CTA */}
        <section className="ev-card">
          {ev.category_name && <div className="ev-eyebrow">{ev.category_name}</div>}
          <h2 className="ev-title">{ev.title}</h2>

          {dateStr && (
            <div className="ev-subrow accent">
              <i className="far fa-calendar"></i>
              <span>{dateStr}{timeStr ? ` · ${timeStr}` : ''}</span>
            </div>
          )}
          {(ev.venue || ev.location) && (
            <div className="ev-subrow">
              <i className="fas fa-map-marker-alt"></i>
              <span>{ev.venue || ev.location}{ev.emirate ? `, ${ev.emirate}` : ''}</span>
            </div>
          )}

          <div className="ev-cta">
            {ev.booking_url && (
              <a href={ev.booking_url} target="_blank" rel="noreferrer" className="ev-btn primary">
                <i className="fas fa-ticket-alt"></i> Get Tickets
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="ev-btn whatsapp">
                <i className="fab fa-whatsapp"></i> Book on WhatsApp
              </a>
            )}
            {!ev.booking_url && !wa && ev.organizer_phone && (
              <a href={`tel:${ev.organizer_phone}`} className="ev-btn primary">
                <i className="fas fa-phone"></i> Call Organizer
              </a>
            )}
          </div>
        </section>

        {/* About */}
        {ev.description && (
          <section className="ev-card">
            <div className="ev-section-label">About this event</div>
            <p className="ev-desc">{ev.description}</p>
          </section>
        )}

        {/* Photos */}
        {images.length > 0 && (
          <section className="ev-card">
            <div className="ev-section-label">Photos</div>
            <div className="ev-gallery">
              {images.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noreferrer" className="ev-gallery-item">
                  <img src={src} alt={`${ev.title} photo ${i + 1}`} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Details */}
        {infoRows.length > 0 && (
          <section className="ev-card">
            <div className="ev-section-label">Event details</div>
            <div className="ev-info-list">
              {infoRows.map(([icon, label, val]) => (
                <div key={label} className="ev-info-row">
                  <div className="ev-info-icon"><i className={`fas ${icon}`}></i></div>
                  <div className="ev-info-text">
                    <div className="ev-info-label">{label}</div>
                    <div className="ev-info-val">{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(`${ev.venue || ev.location || ''} ${ev.emirate || 'UAE'}`)}`} target="_blank" rel="noreferrer" className="ev-maps">
              <i className="fas fa-directions"></i> Open in Maps
            </a>
          </section>
        )}
      </div>

      <style>{`
        .ev-topbar-title{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70vw}

        .ev-page{padding-bottom:36px;margin-top:-8px}

        /* Poster */
        .ev-poster{position:relative;margin:0 16px 18px;border-radius:20px;overflow:hidden;box-shadow:0 10px 34px rgba(13,27,42,0.14)}
        .ev-poster img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:#F7F8FB}
        .ev-poster-cat{position:absolute;top:14px;left:14px;background:rgba(0,0,0,0.55);color:#fff;font-size:12px;font-weight:700;padding:6px 13px;border-radius:999px;backdrop-filter:blur(6px);max-width:calc(100% - 28px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ev-poster-price{position:absolute;bottom:14px;left:14px;background:var(--primary);color:#fff;font-size:13px;font-weight:800;padding:6px 15px;border-radius:999px;box-shadow:0 4px 14px rgba(var(--primary-rgb),0.4)}
        .ev-poster-price.free{background:#00B894;box-shadow:0 4px 14px rgba(0,184,148,0.4)}

        /* Cards — consistent gutter + even vertical rhythm */
        .ev-card{background:#fff;margin:0 16px 14px;border-radius:20px;padding:22px 18px;box-shadow:0 2px 14px rgba(13,27,42,0.05);border:1px solid #F0F1F5}

        /* Hero typography */
        .ev-eyebrow{font-size:12px;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;color:var(--primary);margin-bottom:9px}
        .ev-title{font-size:24px;font-weight:800;color:#1A1A2E;letter-spacing:-0.5px;line-height:1.22;margin:0 0 16px}
        .ev-subrow{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;color:#636E8A;line-height:1.45;margin-bottom:8px}
        .ev-subrow:last-of-type{margin-bottom:0}
        .ev-subrow i{width:16px;text-align:center;color:#9BA4B5;margin-top:1px;flex-shrink:0}
        .ev-subrow.accent{color:var(--primary);font-weight:700}
        .ev-subrow.accent i{color:var(--primary)}

        /* CTA */
        .ev-cta{display:flex;gap:12px;margin-top:20px}
        .ev-btn{flex:1;padding:14px 0;border-radius:14px;font-size:14.5px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:9px;transition:transform .12s;-webkit-tap-highlight-color:transparent}
        .ev-btn:active{transform:scale(0.98)}
        .ev-btn.primary{background:var(--primary);color:#fff;box-shadow:0 6px 18px rgba(var(--primary-rgb),0.32)}
        .ev-btn.whatsapp{background:#25D366;color:#fff;box-shadow:0 6px 18px rgba(37,211,102,0.3)}

        /* Section label (Apple-style eyebrow) */
        .ev-section-label{font-size:12.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#9BA4B5;margin:0 0 14px}

        /* About paragraph — comfortable reading measure */
        .ev-desc{font-size:14.5px;line-height:1.75;color:#4B5563;margin:0;white-space:pre-wrap;letter-spacing:0.1px}

        /* Photos — horizontal scroll strip */
        .ev-gallery{display:flex;gap:10px;overflow-x:auto;margin:0 -18px;padding:0 18px 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .ev-gallery::-webkit-scrollbar{display:none}
        .ev-gallery-item{flex:0 0 auto;display:block;border-radius:14px;overflow:hidden;background:#F7F8FB}
        .ev-gallery-item img{height:172px;width:auto;max-width:280px;object-fit:cover;display:block}

        /* Details list — evenly spaced rows with hairline dividers */
        .ev-info-list{margin:-4px 0 0}
        .ev-info-row{display:flex;align-items:center;gap:13px;padding:13px 0}
        .ev-info-row + .ev-info-row{border-top:1px solid #F1F2F6}
        .ev-info-icon{width:36px;height:36px;background:#F4F3FF;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--primary);font-size:14px;flex-shrink:0}
        .ev-info-text{min-width:0}
        .ev-info-label{font-size:11.5px;color:#9BA4B5;font-weight:600;letter-spacing:0.2px;margin-bottom:2px}
        .ev-info-val{font-size:14.5px;color:#1A1A2E;font-weight:600;line-height:1.35;word-break:break-word}
        .ev-maps{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:16px;padding:13px 0;background:#F4F3FF;color:var(--primary);border-radius:13px;font-size:14px;font-weight:700;text-decoration:none;transition:background .15s}
        .ev-maps:active{background:#E9E7FD}
      `}</style>
    </>
  );
}
