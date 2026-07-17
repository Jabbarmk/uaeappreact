import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';
import { fmtPrice } from '../constants/realestate';

const FALLBACK = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=220&fit=crop';

export default function RealEstateProjectsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['re-projects'], queryFn: () => api.get('/realestate/projects').then(r => r.data) });
  const items: any[] = data?.items || [];

  return (
    <>
      <div className="page-topbar">
        <Link to="/realestate" className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>Off-Plan Projects</h1>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
          {items.map((p) => (
            <Link key={p.id} to={`/realestate/projects/${p.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
              <img src={p.imageUrl} alt={p.name} style={{ width: 120, height: 100, objectFit: 'cover', flexShrink: 0 }} loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} />
              <div style={{ padding: '12px 12px 12px 0', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary)', background: 'rgba(108,92,231,.1)', padding: '2px 8px', borderRadius: 50 }}>OFF-PLAN</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 5 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{p.company_name || p.developer} · {p.location}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>Handover {p.handover}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>From {fmtPrice(p.starting_price, p.currency)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
