import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

const LIST_FALLBACKS = [
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=220&h=200&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=220&h=200&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=220&h=200&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=220&h=200&fit=crop',
];

export default function ClassifiedListPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [activeSearch, setActiveSearch] = useState(params.get('search') || '');

  const category = params.get('category') || '';
  const section = params.get('section') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['classifieds-list', category, section, activeSearch],
    queryFn: () => api.get(`/classifieds/list?category=${category}&section=${section}&search=${encodeURIComponent(activeSearch)}`).then((r) => r.data),
  });

  const items: any[] = data?.items || [];
  const catName = data?.catName || 'Classifieds';

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>{catName}</h1>
      </div>

      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 110 }}>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=220&fit=crop"
          alt={catName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(13,27,42,.65),rgba(108,92,231,.55))', display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
          <i className="fas fa-tags" style={{ color: '#fff', fontSize: 28, opacity: .9 }}></i>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{catName}</div>
            <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, marginTop: 2 }}>{items.length || 'Many'} items available</div>
          </div>
        </div>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search classifieds..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') setActiveSearch(search); }} />
      </div>

      <p style={{ padding: '0 16px 8px', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
        {catName} <span style={{ color: 'var(--primary)', fontWeight: 700 }}>({items.length} Results)</span>
      </p>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : (
        <div className="classified-list">
          {items.map((item: any, idx: number) => (
            <Link key={item.id} to={`/classifieds/${item.id}`} className="classified-list-item">
              <img src={item.imageUrl} alt={item.title} className="item-img" loading="lazy" decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = LIST_FALLBACKS[idx % LIST_FALLBACKS.length]; }} />
              <div className="item-info">
                <h3>{item.title}</h3>
                <p className="desc">{(item.description || '').substring(0, 65)}…</p>
                <div className="specs">
                  {item.age && <span className="spec-tag">Age: {item.age}</span>}
                  {item.model && <span className="spec-tag">{item.model}</span>}
                  {item.warranty && <span className="spec-tag">{item.warranty} warranty</span>}
                  {item.color && <span className="spec-tag">{item.color}</span>}
                </div>
                <div className="price-badge">{item.currency} {Number(item.price).toLocaleString()}</div>
                {item.location && <div className="location-text"><i className="fas fa-map-marker-alt"></i> {item.location}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
