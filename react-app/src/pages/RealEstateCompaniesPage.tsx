import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';

const isVideoFile = (v: string) => /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|$)/i.test(v || '');

export default function RealEstateCompaniesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['re-companies'], queryFn: () => api.get('/realestate/companies').then(r => r.data) });
  const items: any[] = data?.items || [];

  return (
    <>
      <div className="page-topbar">
        <Link to="/realestate" className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>Developers</h1>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: 16 }}>
          {items.map((c) => {
            // Vertical media card: admin-set image/video, else banner, else gradient.
            const media = c.cardMediaUrl || (c.banner ? c.bannerUrl : null);
            const video = media && isVideoFile(media);
            return (
              <Link key={c.id} to={`/realestate/companies/${c.id}`} className="rec-card">
                <div className="rec-media">
                  {video ? (
                    <video src={media} muted autoPlay loop playsInline preload="metadata" />
                  ) : media ? (
                    <img src={media} alt={c.name} loading="lazy" decoding="async" />
                  ) : (
                    <div className="rec-fallback">
                      <img src={c.logoUrl} alt={c.name} />
                    </div>
                  )}
                  {Number(c.is_featured) === 1 && <span className="rec-feat">★ Featured</span>}
                </div>
                <div className="rec-foot">
                  <img src={c.logoUrl} alt="" className="rec-logo" loading="lazy" />
                  <div style={{ minWidth: 0 }}>
                    <div className="rec-name">{c.name}</div>
                    {c.emirate && <div className="rec-loc"><i className="fas fa-map-marker-alt"></i> {c.emirate}</div>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <div style={{ height: 90 }} />

      <style>{`
        .rec-card{display:block;border-radius:18px;overflow:hidden;text-decoration:none;background:#fff;box-shadow:0 6px 20px rgba(13,27,42,0.12)}
        .rec-card:active{transform:scale(.97)}
        .rec-media{position:relative;aspect-ratio:3/4;background:#1B2838}
        .rec-media img,.rec-media video{width:100%;height:100%;object-fit:cover;display:block}
        .rec-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--primary),var(--primary-dark))}
        .rec-fallback img{width:64%;height:auto;max-height:64%;object-fit:contain;border-radius:18px;background:#fff;padding:8px}
        .rec-foot{display:flex;align-items:center;gap:9px;padding:10px 11px}
        .rec-logo{width:34px !important;height:34px !important;border-radius:10px;object-fit:cover;border:1px solid #EEEDF5;background:#fff;flex-shrink:0}
        .rec-name{color:var(--dark);font-size:13px;font-weight:800;line-height:1.2;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .rec-loc{color:var(--text-secondary);font-size:10.5px;font-weight:600;margin-top:2px}
        .rec-loc i{font-size:9px;margin-right:3px;color:var(--primary)}
        .rec-feat{position:absolute;top:10px;left:10px;background:rgba(255,255,255,0.92);color:var(--primary);font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;box-shadow:0 3px 10px rgba(0,0,0,.2)}
      `}</style>
    </>
  );
}
