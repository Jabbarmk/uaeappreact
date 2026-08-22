import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { bizThemeStyle } from '../bizTheme';

function renderStars(r: number) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= r) return <i key={i} className="fas fa-star"></i>;
    if (i + 0.5 <= r) return <i key={i} className="fas fa-star-half-alt"></i>;
    return <i key={i} className="far fa-star"></i>;
  });
}

// All reviews for a business — full page with close button.
export default function BusinessReviewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => api.get(`/businesses/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div className="loading">Loading…</div>;
  const biz = data?.business;
  const revList: any[] = data?.testimonials || [];
  const approved = revList.filter((r) => !r.status || r.status === 'approved');
  const avgRating = approved.length
    ? approved.reduce((s, r) => s + Number(r.rating || 5), 0) / approved.length
    : (biz?.rating ? Number(biz.rating) : 4.8);
  const barPct = (star: number) => approved.length
    ? Math.round(approved.filter((r) => Math.round(Number(r.rating || 5)) === star).length / approved.length * 100)
    : 0;

  return (
    <div className="biz-detail-v2" style={bizThemeStyle(biz?.color)}>
      <div className="pdx-top" style={{ position: 'sticky', top: 0, zIndex: 300, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fff', borderBottom: '1px solid #F1F1F6' }}>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 800, color: 'var(--dark)', margin: 0, paddingLeft: 88 }}>What Clients Say</h1>
        <button onClick={() => navigate(`/businesses/${id}`)} aria-label="Close"
          style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #ECECF2', background: '#fff', color: 'var(--dark)', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(13,27,42,0.05)', marginRight: 48 }}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="bs-page-wrap" style={{ padding: '16px 16px 48px' }}>
        <div className="bs-review-summary">
          <div className="bs-rev-avg">
            <div className="big-num">{avgRating.toFixed(1)}</div>
            <div className="stars">{renderStars(avgRating)}</div>
            <div className="cnt">{approved.length} reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((s) => (
              <div className="bs-bar-row" key={s}>
                <span className="n">{s}</span>
                <div className="bs-bar-track"><div className="bs-bar-fill" style={{ width: `${barPct(s)}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {revList.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No reviews yet</div>}
        {revList.map((rev: any, ri: number) => {
          const name = rev.client_name || rev.name || 'Customer';
          const co = rev.client_company || rev.company || '';
          const rating = Number(rev.rating || 5);
          return (
            <div className="bs-review-card" key={ri}>
              <div className="bs-rev-head">
                <div className="bs-rev-avatar">{rev.client_photo ? <img src={rev.client_photo} alt="" /> : (rev.avatar || name[0].toUpperCase())}</div>
                <div>
                  <div className="bs-rev-name">{name}{Number(rev.is_own) === 1 ? ' (You)' : ''}</div>
                  {co && <div className="bs-rev-co">{co}</div>}
                </div>
                {Number(rev.is_own) === 1 && rev.status === 'pending' && (
                  <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, background: '#FFF8E1', color: '#B26A00', borderRadius: 10, padding: '3px 9px' }}>⏳ Pending approval</span>
                )}
              </div>
              <div className="bs-rev-stars">{renderStars(rating)}</div>
              <div className="bs-rev-text">{rev.review || ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
