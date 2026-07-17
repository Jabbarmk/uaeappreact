import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';

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
          {items.map((c) => (
            <Link key={c.id} to={`/realestate/companies/${c.id}`}
              style={{ textDecoration: 'none', background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 3px 14px rgba(0,0,0,.07)', textAlign: 'center', paddingBottom: 14 }}>
              <div style={{ height: 70, background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
                {c.banner && <img src={c.bannerUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .9 }} loading="lazy" />}
              </div>
              <img src={c.logoUrl} alt={c.name} style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', border: '3px solid #fff', marginTop: -32, background: '#fff' }} loading="lazy" />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 8, padding: '0 8px' }}>{c.name}</div>
              {c.emirate && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{c.emirate}</div>}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
