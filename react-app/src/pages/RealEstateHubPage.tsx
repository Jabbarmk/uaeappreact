import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import { fmtPrice, priceSuffix } from '../constants/realestate';

const PROP_FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';

export default function RealEstateHubPage() {
  const [search, setSearch] = useState('');
  const { data } = useQuery({ queryKey: ['realestate-hub'], queryFn: () => api.get('/realestate').then(r => r.data) });

  const categories: any[] = data?.categories || [];
  const companies: any[] = data?.featuredCompanies || [];
  const sections: any[] = data?.sections || [];
  const projects: any[] = data?.projects || [];

  return (
    <>
      <div className="page-topbar">
        <span className="logo-icon"><i className="fas fa-building"></i></span>
        <h1>REAL ESTATE</h1>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search properties, areas…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') window.location.assign(`/realestate/properties?search=${encodeURIComponent(search)}`); }} />
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 180 }}>
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=360&fit=crop" alt="Real Estate"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(108,92,231,.85),rgba(0,206,201,.6))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Find your next home</div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>Properties across the UAE</div>
          <div style={{ color: 'rgba(255,255,255,.9)', fontSize: 13, marginTop: 8 }}>Rooms, flats, villas &amp; off-plan projects</div>
        </div>
      </div>

      {/* Category tiles */}
      <div className="category-icons">
        {categories.map((cat: any) => (
          <Link key={cat.id} to={`/realestate/properties?category=${cat.id}`} className="cat-icon-item">
            <div className="icon">{cat.icon || '🏠'}</div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Major players — big logo slider */}
      {companies.length > 0 && (
        <div>
          <div className="section-header">
            <h2>Major Developers</h2>
            <Link to="/realestate/companies">View all</Link>
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 16px 12px', scrollbarWidth: 'none' }}>
            {companies.map((c: any) => (
              <Link key={c.id} to={`/realestate/companies/${c.id}`}
                style={{ flexShrink: 0, width: 130, textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ width: 130, height: 130, borderRadius: 22, overflow: 'hidden', boxShadow: '0 6px 20px rgba(108,92,231,.18)', border: '1px solid rgba(108,92,231,.12)', background: '#fff' }}>
                  <img src={c.logoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Off-plan projects */}
      {projects.length > 0 && (
        <div>
          <div className="section-header">
            <h2>Off-Plan Projects</h2>
            <Link to="/realestate/projects">View all</Link>
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 16px 12px', scrollbarWidth: 'none' }}>
            {projects.map((p: any) => (
              <Link key={p.id} to={`/realestate/projects/${p.id}`}
                style={{ flexShrink: 0, width: 240, textDecoration: 'none', borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.08)' }}>
                <div style={{ position: 'relative', height: 130 }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = PROP_FALLBACK; }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>OFF-PLAN</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}><i className="fas fa-map-marker-alt" style={{ marginRight: 4, color: 'var(--primary)' }}></i>{p.location}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginTop: 6 }}>From {fmtPrice(p.starting_price, p.currency)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Property sections per category */}
      {sections.map((section: any) => (
        <div key={section.id}>
          <div className="section-header">
            <h2>{section.icon} {section.name}</h2>
            <Link to={`/realestate/properties?category=${section.id}`}>View all</Link>
          </div>
          <div className="classified-row">
            {section.items.map((item: any) => (
              <Link key={item.id} to={`/realestate/properties/${item.id}`} className="classified-card">
                <img src={item.imageUrl} alt={item.title} className="card-img" loading="lazy" decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).src = PROP_FALLBACK; }} />
                <div className="card-body">
                  <div className="price">{fmtPrice(item.price, item.currency)} <small>{priceSuffix(item.purpose, item.rent_period)}</small></div>
                  <div className="card-title">{item.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 24 }} />
    </>
  );
}
