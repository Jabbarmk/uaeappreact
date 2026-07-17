import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import { EMIRATES, PURPOSES, fmtPrice, priceSuffix } from '../constants/realestate';

const FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=220&h=200&fit=crop';

export default function PropertyListPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');

  const category = params.get('category') || '';
  const purpose = params.get('purpose') || '';
  const emirate = params.get('emirate') || '';
  const activeSearch = params.get('search') || '';

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
  };

  const { data: cats } = useQuery({ queryKey: ['realestate-hub-cats'], queryFn: () => api.get('/realestate').then(r => r.data.categories || []) });
  const categories: any[] = Array.isArray(cats) ? cats : [];

  const { data, isLoading } = useQuery({
    queryKey: ['properties-list', category, purpose, emirate, activeSearch],
    queryFn: () => api.get('/realestate/properties', { params: { category, purpose, emirate, search: activeSearch, pageSize: 50 } }).then((r) => r.data),
  });

  const items: any[] = data?.items || [];
  const catName = data?.catName || 'Properties';

  const sel: React.CSSProperties = { padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, background: '#fff', color: 'var(--text)', fontFamily: 'inherit' };

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>{catName}</h1>
      </div>

      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 110 }}>
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=220&fit=crop"
          alt={catName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(13,27,42,.6),rgba(108,92,231,.55))', display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
          <i className="fas fa-building" style={{ color: '#fff', fontSize: 28, opacity: .9 }}></i>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{catName}</div>
            <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, marginTop: 2 }}>{items.length} properties</div>
          </div>
        </div>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search properties, areas…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') setParam('search', search); }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 10px', scrollbarWidth: 'none' }}>
        <select value={category} onChange={(e) => setParam('category', e.target.value)} style={sel}>
          <option value="">All Types</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={purpose} onChange={(e) => setParam('purpose', e.target.value)} style={sel}>
          <option value="">Rent &amp; Sale</option>
          {PURPOSES.map((p) => <option key={p} value={p}>For {p}</option>)}
        </select>
        <select value={emirate} onChange={(e) => setParam('emirate', e.target.value)} style={sel}>
          <option value="">All Emirates</option>
          {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <p style={{ padding: '0 16px 8px', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
        {catName} <span style={{ color: 'var(--primary)', fontWeight: 700 }}>({items.length} Results)</span>
      </p>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No properties found.</div>
      ) : (
        <div className="classified-list">
          {items.map((item: any) => (
            <Link key={item.id} to={`/realestate/properties/${item.id}`} className="classified-list-item">
              <img src={item.imageUrl} alt={item.title} className="item-img" loading="lazy" decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }} />
              <div className="item-info">
                <h3>{item.title}</h3>
                <p className="desc">{(item.description || '').substring(0, 65)}…</p>
                <div className="specs">
                  {item.bedrooms && <span className="spec-tag"><i className="fas fa-bed" style={{ marginRight: 4 }}></i>{item.bedrooms}</span>}
                  {item.bathrooms && <span className="spec-tag"><i className="fas fa-bath" style={{ marginRight: 4 }}></i>{item.bathrooms}</span>}
                  {item.area_sqft && <span className="spec-tag"><i className="fas fa-ruler-combined" style={{ marginRight: 4 }}></i>{item.area_sqft}</span>}
                  {item.category_name && <span className="spec-tag">{item.category_name}</span>}
                </div>
                <div className="price-badge">{fmtPrice(item.price, item.currency)} <small style={{ fontWeight: 600 }}>{priceSuffix(item.purpose, item.rent_period)}</small></div>
                {item.location && <div className="location-text"><i className="fas fa-map-marker-alt"></i> {item.location}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div style={{ height: 24 }} />
    </>
  );
}
