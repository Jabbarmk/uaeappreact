import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { getClassifiedFields } from '../constants/classifieds';

export default function ClassifiedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [active, setActive] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['classified', id],
    queryFn: () => api.get(`/classifieds/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.item) return <div style={{ padding: 40 }}>Not found. <Link to="/classifieds">Back</Link></div>;

  const item = data.item;
  const categoryLower = (item.category_name || '').toLowerCase();
  const detailFallbacks: Record<string, string> = {
    mobile: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop',
    car:    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop',
    estate: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop',
  };
  let fallback = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop';
  for (const [key, url] of Object.entries(detailFallbacks)) {
    if (categoryLower.includes(key)) { fallback = url; break; }
  }

  const gallery: string[] = (item.images && item.images.length ? item.images : [item.imageUrl]).filter(Boolean);
  const mainImage = gallery[active] || item.imageUrl;

  // Category-specific spec rows (only the ones that have a value).
  const specs = getClassifiedFields(item.category_name)
    .map((f) => [f.label, item[f.key]] as [string, unknown])
    .filter(([, v]) => v != null && v !== '');

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 style={{ flex: 1, fontSize: 15, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.title}</h1>
        <div className="right-actions">
          <i className="fas fa-heart" style={{ color: 'var(--warm)' }}></i>
          <i className="fas fa-share-alt"></i>
        </div>
      </div>

      <div style={{ position: 'relative', background: 'linear-gradient(135deg,#f8f9fc,#eef0f5)' }}>
        <img src={mainImage} alt={item.title} className="detail-image"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          loading="lazy" decoding="async" />
        {item.category_name && (
          <div style={{ position: 'absolute', top: 14, left: 14, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 50 }}>
            {item.category_name}
          </div>
        )}
      </div>

      {/* Thumbnail gallery */}
      {gallery.length > 1 && (
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px 0', overflowX: 'auto' }}>
          {gallery.map((g, i) => (
            <img key={i} src={g} alt="" onClick={() => setActive(i)}
              style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0, cursor: 'pointer', border: i === active ? '2px solid var(--primary)' : '2px solid transparent', opacity: i === active ? 1 : 0.7 }} />
          ))}
        </div>
      )}

      <div className="detail-body">
        <h1>{item.title}</h1>
        <p className="description">{(item.description || '').split('\n').map((l: string, i: number) => <span key={i}>{l}<br /></span>)}</p>

        <div className="detail-price-row">
          <div className="price-badge" style={{ fontSize: 16, padding: '8px 20px' }}>{item.currency} {Number(item.price).toLocaleString()}</div>
          {item.location && <div className="location-text"><i className="fas fa-map-marker-alt"></i> {item.location}</div>}
        </div>

        {specs.length > 0 && (
          <div className="detail-table">
            <h3>Item Details</h3>
            {specs.map(([label, value]) => (
              <div className="detail-row" key={label}>
                <span className="dt-label">{label}</span>
                <span className="dt-value">{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="detail-date">
          <i className="far fa-calendar-alt" style={{ marginRight: 6, color: 'var(--primary)' }}></i>
          Posted on: {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <a href="https://wa.me/" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'linear-gradient(135deg,#00B894,#00CEC9)', color: '#fff', borderRadius: 14, fontSize: 14, fontWeight: 700 }}>
            <i className="fab fa-whatsapp" style={{ fontSize: 18 }}></i> WhatsApp
          </a>
          <a href="tel:" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'var(--white)', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: 14, fontSize: 14, fontWeight: 700 }}>
            <i className="fas fa-phone" style={{ fontSize: 16 }}></i> Call
          </a>
        </div>

        <div style={{ marginTop: 16, padding: '14px 16px', background: 'linear-gradient(135deg,rgba(253,203,110,.15),rgba(243,156,18,.1))', borderRadius: 14, border: '1px solid rgba(243,156,18,.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#B7770D', marginBottom: 6 }}>
            <i className="fas fa-shield-alt" style={{ marginRight: 6 }}></i>Safety Tips
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>✓ Meet in a public, well-lit location</li>
            <li>✓ Inspect item carefully before payment</li>
            <li>✓ Never pay in advance via transfer</li>
          </ul>
        </div>
      </div>
    </>
  );
}
