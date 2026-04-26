import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

export default function ClassifiedDetailPage() {
  const { id } = useParams<{ id: string }>();
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
        <img src={item.imageUrl} alt={item.title} className="detail-image"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          loading="lazy" decoding="async" />
        {item.category_name && (
          <div style={{ position: 'absolute', top: 14, left: 14, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 50 }}>
            {item.category_name}
          </div>
        )}
      </div>

      <div className="detail-body">
        <h1>{item.title}</h1>
        <p className="description">{(item.description || '').split('\n').map((l: string, i: number) => <span key={i}>{l}<br /></span>)}</p>

        <div className="detail-price-row">
          <div className="price-badge" style={{ fontSize: 16, padding: '8px 20px' }}>{item.currency} {Number(item.price).toLocaleString()}</div>
          {item.location && <div className="location-text"><i className="fas fa-map-marker-alt"></i> {item.location}</div>}
        </div>

        {(item.age || item.model || item.warranty || item.color) && (
          <div className="detail-specs">
            {item.age && <div className="detail-spec"><div className="label">Age</div><div className="value">{item.age}</div></div>}
            {item.model && <div className="detail-spec"><div className="label">Model</div><div className="value">{item.model}</div></div>}
            {item.warranty && <div className="detail-spec"><div className="label">Warranty</div><div className="value">{item.warranty}</div></div>}
            {item.color && <div className="detail-spec"><div className="label">Color</div><div className="value">{item.color}</div></div>}
          </div>
        )}

        <div className="detail-table">
          <h3>Item Details</h3>
          {[
            ['Storage Capacity', item.storage],
            ['Memory', item.memory],
            ['Condition', item.condition_status],
            ['Version', item.version],
            ['Battery Health', item.battery_health],
            ['Accompaniments', item.accompaniments],
            ['Carrier Lock', item.carrier_lock],
          ].filter(([, v]) => v).map(([label, value]) => (
            <div className="detail-row" key={label}>
              <span className="dt-label">{label}</span>
              <span className="dt-value">{value}</span>
            </div>
          ))}
        </div>

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
