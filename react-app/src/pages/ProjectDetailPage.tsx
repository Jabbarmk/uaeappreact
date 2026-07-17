import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { fmtPrice } from '../constants/realestate';

const FALLBACK = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=600&fit=crop';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [active, setActive] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get(`/realestate/projects/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.item) return <div style={{ padding: 40 }}>Not found. <Link to="/realestate">Back</Link></div>;

  const item = data.item;
  const company = item.company;
  const gallery: string[] = (item.images && item.images.length ? item.images : [item.imageUrl]).filter(Boolean);
  const mainImage = gallery[active] || item.imageUrl;

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 style={{ flex: 1, fontSize: 15, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.name}</h1>
        <div className="right-actions"><i className="fas fa-share-alt"></i></div>
      </div>

      <div style={{ position: 'relative', background: 'linear-gradient(135deg,#f8f9fc,#eef0f5)' }}>
        <img src={mainImage} alt={item.name} className="detail-image"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', top: 14, left: 14, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 50 }}>OFF-PLAN PROJECT</div>
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
        <h1>{item.name}</h1>
        {item.developer && <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, marginTop: -6, marginBottom: 6 }}>by {item.developer}</div>}

        <div className="detail-price-row">
          <div className="price-badge" style={{ fontSize: 16, padding: '8px 20px' }}>From {fmtPrice(item.starting_price, item.currency)}</div>
          {item.location && <div className="location-text"><i className="fas fa-map-marker-alt"></i> {item.location}{item.emirate ? `, ${item.emirate}` : ''}</div>}
        </div>

        <div className="detail-specs">
          {item.handover && <div className="detail-spec"><div className="label">Handover</div><div className="value">{item.handover}</div></div>}
          {item.payment_plan && <div className="detail-spec"><div className="label">Payment Plan</div><div className="value">{item.payment_plan}</div></div>}
          {item.emirate && <div className="detail-spec"><div className="label">Emirate</div><div className="value">{item.emirate}</div></div>}
        </div>

        {item.description && (
          <p className="description">{(item.description || '').split('\n').map((l: string, i: number) => <span key={i}>{l}<br /></span>)}</p>
        )}

        {company && (
          <Link to={`/realestate/companies/${company.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, padding: 14, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,.06)', textDecoration: 'none' }}>
            <img src={company.logoUrl} alt={company.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Developer</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{company.name}</div>
            </div>
            <span style={{ color: 'var(--primary)', fontSize: 18 }}>›</span>
          </Link>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <a href={company?.whatsapp ? `https://wa.me/${company.whatsapp}` : 'https://wa.me/'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'linear-gradient(135deg,#00B894,#00CEC9)', color: '#fff', borderRadius: 14, fontSize: 14, fontWeight: 700 }}>
            <i className="fab fa-whatsapp" style={{ fontSize: 18 }}></i> Enquire
          </a>
          <a href={company?.phone ? `tel:${company.phone}` : 'tel:'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'var(--white)', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: 14, fontSize: 14, fontWeight: 700 }}>
            <i className="fas fa-phone" style={{ fontSize: 16 }}></i> Call
          </a>
        </div>
      </div>
    </>
  );
}
