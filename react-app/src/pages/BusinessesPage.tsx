import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

const BIZ_FALLBACKS = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=480&h=270&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=480&h=270&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=480&h=270&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=480&h=270&fit=crop',
];

export default function BusinessesPage() {
  const [params] = useSearchParams();
  const catId = params.get('cat') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', catId],
    queryFn: () => api.get(`/businesses?cat=${catId}`).then((r) => r.data),
  });

  const businesses: any[] = data?.businesses || [];
  const catName: string = data?.catName || 'All Businesses';

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

      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 160, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=320&fit=crop"
          alt="UAE Business" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(108,92,231,0.75),rgba(0,206,201,0.55))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 }}>
          <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.8, marginBottom: 6 }}>Discover</div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{catName}</div>
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 6 }}>Top-rated businesses near you</div>
        </div>
      </div>

      <div className="tab-nav">
        <a href="#" className="active">Popular</a>
        <a href="#">Near Me</a>
      </div>

      {isLoading ? (
        <div className="loading" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : (
        <div className="biz-list">
          {businesses.map((biz: any, idx: number) => (
            <div className="biz-card" key={biz.id}>
              <img src={biz.imageUrl} alt={biz.name} className="biz-img"
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.assign(`/businesses/${biz.id}`)}
                onError={(e) => { (e.target as HTMLImageElement).src = BIZ_FALLBACKS[idx % BIZ_FALLBACKS.length]; }}
                loading="lazy" decoding="async" />
              <div className="biz-body">
                <div className="biz-rating"><i className="fas fa-star"></i> {Number(biz.rating).toFixed(1)}</div>
                <h3>{biz.name}</h3>
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
          ))}
        </div>
      )}

      <div className="page-search" style={{ marginBottom: 80 }}>
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search Company" />
      </div>
    </>
  );
}
