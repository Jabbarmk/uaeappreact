import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => api.get(`/offers/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.offer) return <div style={{ padding: 40 }}>Not found. <Link to="/offers">Back</Link></div>;

  const { offer, reviews, avgRating } = data;
  const waLink = offer.business_whatsapp
    ? `https://wa.me/${offer.business_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I want to order: ${offer.title} (${offer.currency} ${Math.round(offer.price)})`)}`
    : null;

  const COLORS = ['#6C5CE7','#00B894','#FD79A8','#FDCB6E','#0984E3','#E17055'];
  const infoRows = [
    ['fa-map-marker-alt', 'Location', offer.business_address],
    ['fa-calendar-alt', 'Valid from', offer.valid_from ? new Date(offer.valid_from).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null],
    ['fa-calendar-times', 'Valid until', offer.valid_to ? new Date(offer.valid_to).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null],
    ['fa-phone', 'Phone', offer.business_phone],
  ].filter(([, , v]) => v);

  return (
    <>
      <div className="page-topbar">
        <Link to="/offers" className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 style={{ fontSize: 15 }}>{(offer.title || '').substring(0, 30)}{offer.title?.length > 30 ? '…' : ''}</h1>
        <div className="right-actions"></div>
      </div>

      <div style={{ position: 'relative', margin: '0 16px 16px', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
        <img src={offer.imageUrl} alt={offer.title}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=500&fit=crop'; }}
          style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }}
          loading="lazy" decoding="async" />
        {offer.discount_percent && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#FF6B6B', color: '#fff', fontSize: 12, fontWeight: 800, padding: '5px 12px', borderRadius: 999 }}>
            -{Math.round(offer.discount_percent)}% OFF
          </div>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="fas fa-star" style={{ color: '#FDCB6E', fontSize: 11 }}></i>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{Number(avgRating).toFixed(1)}</span>
        </div>
      </div>

      <Link to={`/businesses/${offer.business_id}`}
        style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 16px 16px', background: '#fff', padding: 14, borderRadius: 16, textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 8px rgba(13,27,42,0.05)' }}>
        <img src={offer.logoUrl} alt={offer.business_name}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop'; }}
          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          loading="lazy" decoding="async" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E' }}>{offer.business_name}</div>
          <div style={{ fontSize: 12, color: '#636E8A' }}>
            {offer.emirate || offer.business_emirate || ''}
            {offer.category_name && ` · ${offer.category_name}`}
          </div>
        </div>
        <i className="fas fa-chevron-right" style={{ color: '#9BA4B5' }}></i>
      </Link>

      <div style={{ background: '#fff', margin: '0 16px 16px', borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 8px rgba(13,27,42,0.05)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A2E', margin: '0 0 10px' }}>{offer.title}</h2>
        {offer.description && <p style={{ fontSize: 14, color: '#636E8A', lineHeight: 1.6, margin: '0 0 16px' }}>{offer.description}</p>}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#6C5CE7' }}>{offer.currency} {Math.round(offer.price).toLocaleString()}</span>
          {offer.original_price && offer.original_price > offer.price && (
            <span style={{ fontSize: 15, color: '#9BA4B5', textDecoration: 'line-through' }}>{offer.currency} {Math.round(offer.original_price).toLocaleString()}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer"
              style={{ flex: 1, padding: '13px 0', background: '#25D366', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <i className="fab fa-whatsapp"></i> Order on WhatsApp
            </a>
          )}
          {offer.business_phone && (
            <a href={`tel:${offer.business_phone}`}
              style={{ flex: 1, padding: '13px 0', background: '#6C5CE7', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <i className="fas fa-phone"></i> Call Now
            </a>
          )}
          {!waLink && !offer.business_phone && (
            <Link to={`/businesses/${offer.business_id}`}
              style={{ flex: 1, padding: '13px 0', background: '#6C5CE7', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <i className="fas fa-store"></i> View Business
            </Link>
          )}
        </div>
      </div>

      {offer.details && (
        <div style={{ background: '#fff', margin: '0 16px 16px', borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 8px rgba(13,27,42,0.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 14px', color: '#1A1A2E' }}>Details</h3>
          <p style={{ fontSize: 14, color: '#636E8A', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{offer.details}</p>
        </div>
      )}

      {infoRows.length > 0 && (
        <div style={{ background: '#fff', margin: '0 16px 16px', borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 8px rgba(13,27,42,0.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 14px', color: '#1A1A2E' }}>Info</h3>
          {infoRows.map(([icon, label, val]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, background: '#f0f2f8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C5CE7', fontSize: 13, flexShrink: 0 }}>
                <i className={`fas ${icon}`}></i>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9BA4B5', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 14, color: '#1A1A2E', fontWeight: 500 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', margin: '0 16px 16px', borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 8px rgba(13,27,42,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: '#1A1A2E' }}>Reviews</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF5E7', padding: '4px 10px', borderRadius: 10 }}>
            <i className="fas fa-star" style={{ color: '#FDCB6E', fontSize: 12 }}></i>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{Number(avgRating).toFixed(1)}</span>
            <span style={{ fontSize: 11, color: '#9BA4B5' }}>({reviews.length})</span>
          </div>
        </div>
        {reviews.length === 0 ? (
          <p style={{ fontSize: 13, color: '#9BA4B5', textAlign: 'center', padding: '20px 0' }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map((r: any, i: number) => {
              const initial = (r.user_name || 'U')[0].toUpperCase();
              const bg = COLORS[initial.charCodeAt(0) % COLORS.length];
              return (
                <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 14, borderBottom: '1px solid #F0F2F8' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{initial}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>{r.user_name || 'Anonymous'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <i className="fas fa-star" style={{ color: '#FDCB6E', fontSize: 11 }}></i>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{Number(r.rating).toFixed(1)}</span>
                      </div>
                    </div>
                    {r.comment && <p style={{ fontSize: 13, color: '#636E8A', lineHeight: 1.5, margin: '4px 0 0' }}>{r.comment}</p>}
                    <div style={{ fontSize: 11, color: '#9BA4B5', marginTop: 4 }}>{new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ height: 24 }}></div>
    </>
  );
}
