import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { PROPERTY_FIELDS, fmtPrice, priceSuffix } from '../constants/realestate';

const FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [active, setActive] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => api.get(`/realestate/properties/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.item) return <div style={{ padding: 40 }}>Not found. <Link to="/realestate">Back</Link></div>;

  const item = data.item;
  const company = item.company;
  const gallery: string[] = (item.images && item.images.length ? item.images : [item.imageUrl]).filter(Boolean);
  const mainImage = gallery[active] || item.imageUrl;

  const specs = PROPERTY_FIELDS
    .map((f) => [f.label, item[f.key]] as [string, unknown])
    .filter(([, v]) => v != null && v !== '');
  const amenities: string[] = (item.amenities || '').split(',').map((s: string) => s.trim()).filter(Boolean);

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
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} loading="lazy" decoding="async" />
        {item.category_name && (
          <div style={{ position: 'absolute', top: 14, left: 14, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 50 }}>
            {item.category_name}
          </div>
        )}
        {item.purpose && (
          <div style={{ position: 'absolute', top: 14, right: 14, background: item.purpose === 'Sale' ? 'var(--warm)' : 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 50 }}>
            For {item.purpose}
          </div>
        )}
      </div>

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

        <div className="detail-price-row">
          <div className="price-badge" style={{ fontSize: 16, padding: '8px 20px' }}>{fmtPrice(item.price, item.currency)} <small style={{ fontWeight: 600 }}>{priceSuffix(item.purpose, item.rent_period)}</small></div>
          {item.location && <div className="location-text"><i className="fas fa-map-marker-alt"></i> {item.location}{item.emirate ? `, ${item.emirate}` : ''}</div>}
        </div>

        {/* Key specs strip */}
        {specs.length > 0 && (
          <div className="detail-specs">
            {item.bedrooms && <div className="detail-spec"><div className="label">Bedrooms</div><div className="value">{item.bedrooms}</div></div>}
            {item.bathrooms && <div className="detail-spec"><div className="label">Bathrooms</div><div className="value">{item.bathrooms}</div></div>}
            {item.area_sqft && <div className="detail-spec"><div className="label">Area</div><div className="value">{item.area_sqft}</div></div>}
            {item.furnished && <div className="detail-spec"><div className="label">Furnishing</div><div className="value">{item.furnished}</div></div>}
          </div>
        )}

        {item.description && (
          <p className="description">{(item.description || '').split('\n').map((l: string, i: number) => <span key={i}>{l}<br /></span>)}</p>
        )}

        <div className="detail-table">
          <h3>Property Details</h3>
          {[['Type', item.category_name], ['Purpose', item.purpose], ['Parking', item.parking], ['Furnishing', item.furnished], ['Emirate', item.emirate]]
            .filter(([, v]) => v).map(([label, value]) => (
              <div className="detail-row" key={label as string}>
                <span className="dt-label">{label}</span>
                <span className="dt-value">{String(value)}</span>
              </div>
            ))}
        </div>

        {amenities.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>Amenities</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {amenities.map((a, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', background: 'rgba(108,92,231,.1)', borderRadius: 20, padding: '6px 14px' }}>
                  <i className="fas fa-check" style={{ marginRight: 6, fontSize: 10 }}></i>{a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Listing company */}
        {company && (
          <Link to={`/realestate/companies/${company.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, padding: 14, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,.06)', textDecoration: 'none' }}>
            <img src={company.logoUrl} alt={company.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Listed by</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{company.name}</div>
            </div>
            <span style={{ color: 'var(--primary)', fontSize: 18 }}>›</span>
          </Link>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <a href={company?.whatsapp ? `https://wa.me/${company.whatsapp}` : 'https://wa.me/'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'linear-gradient(135deg,#00B894,#00CEC9)', color: '#fff', borderRadius: 14, fontSize: 14, fontWeight: 700 }}>
            <i className="fab fa-whatsapp" style={{ fontSize: 18 }}></i> WhatsApp
          </a>
          <a href={company?.phone ? `tel:${company.phone}` : 'tel:'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'var(--white)', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: 14, fontSize: 14, fontWeight: 700 }}>
            <i className="fas fa-phone" style={{ fontSize: 16 }}></i> Call
          </a>
        </div>

        <div style={{ marginTop: 16, padding: '14px 16px', background: 'linear-gradient(135deg,rgba(253,203,110,.15),rgba(243,156,18,.1))', borderRadius: 14, border: '1px solid rgba(243,156,18,.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#B7770D', marginBottom: 6 }}>
            <i className="fas fa-shield-alt" style={{ marginRight: 6 }}></i>Safety Tips
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>✓ Verify the property and documents before paying</li>
            <li>✓ Never transfer a deposit before viewing</li>
            <li>✓ Deal through registered agents where possible</li>
          </ul>
        </div>
      </div>
    </>
  );
}
