import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

const CLS_FALLBACKS = [
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop',
];

const DEFAULT_CATS = [
  { id: 0, icon: '📱', name: 'Mobiles' }, { id: 0, icon: '💻', name: 'Laptops' },
  { id: 0, icon: '🚗', name: 'Cars' },   { id: 0, icon: '🏠', name: 'Real Estate' },
  { id: 0, icon: '🛋️', name: 'Furniture' }, { id: 0, icon: '👔', name: 'Fashion' },
];

export default function ClassifiedsPage() {
  const [search, setSearch] = useState('');
  const { data } = useQuery({ queryKey: ['classifieds-hub'], queryFn: () => api.get('/classifieds').then((r) => r.data) });

  const categories: any[] = data?.categories || DEFAULT_CATS;
  const sections: any[] = data?.sections || [];

  return (
    <>
      <div className="page-topbar">
        <span className="logo-icon"><i className="fas fa-tags"></i></span>
        <h1>CLASSIFIEDS</h1>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search classifieds..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') window.location.assign(`/classifieds/list?search=${encodeURIComponent(search)}`); }} />
      </div>

      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 180 }}>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=360&fit=crop"
          alt="Classifieds" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,184,148,.80),rgba(0,206,201,.65))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
          <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Marketplace</div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>Buy &amp; Sell Anything</div>
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 8 }}>Thousands of items listed in UAE</div>
        </div>
      </div>

      <div className="category-icons">
        {categories.map((cat: any, i: number) => (
          <Link key={cat.id || i} to={cat.id ? `/classifieds/list?category=${cat.id}` : '/classifieds/list'} className="cat-icon-item">
            <div className="icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      {sections.map((section: any) => (
        <div key={section.id}>
          <div className="section-header">
            <h2>{section.name}</h2>
            <Link to={`/classifieds/list?section=${section.id}`}>View all</Link>
          </div>
          <div className="classified-row">
            {section.items.map((item: any, idx: number) => (
              <Link key={item.id} to={`/classifieds/${item.id}`} className="classified-card">
                <img src={item.imageUrl} alt={item.title} className="card-img" loading="lazy" decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).src = CLS_FALLBACKS[idx % CLS_FALLBACKS.length]; }} />
                <div className="card-body">
                  <div className="price">{item.currency} {Number(item.price).toLocaleString()} <small>/month</small></div>
                  <div className="card-title">{item.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
