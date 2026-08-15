import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

// All "best in UAE" collections — 2-per-row grid with search.
export default function CollectionsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => api.get('/collections').then((r) => r.data),
  });

  const collections: any[] = (data || []).filter((c: any) =>
    c.title.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>Explore the best in UAE</h1>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search categories…" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : collections.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No categories found</div>
      ) : (
        <div className="colx-grid">
          {collections.map((c) => (
            <Link key={c.id} to={`/collections/${c.id}`} className="colx-card">
              {c.thumbUrl
                ? <img src={c.thumbUrl} alt={c.title} loading="lazy" decoding="async" />
                : <div className="colx-noimg"><i className="fas fa-images"></i></div>}
              <div className="colx-overlay">
                <div className="colx-name">{c.title}</div>
                <div className="colx-sub">{c.itemCount} place{c.itemCount === 1 ? '' : 's'}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div style={{ height: 90 }} />

      <style>{`
        .colx-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:4px 16px}
        .colx-card{position:relative;aspect-ratio:150/190;border-radius:16px;overflow:hidden;display:block;box-shadow:0 4px 14px rgba(13,27,42,0.10);background:#DDE3F0;text-decoration:none}
        .colx-card img{width:100%;height:100%;object-fit:cover;display:block}
        .colx-noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9BA4B5;font-size:30px}
        .colx-overlay{position:absolute;bottom:0;left:0;right:0;padding:26px 12px 11px;background:linear-gradient(transparent,rgba(0,0,0,0.78))}
        .colx-name{color:#fff;font-size:14px;font-weight:700;line-height:1.25}
        .colx-sub{color:rgba(255,255,255,.85);font-size:11px;font-weight:600;margin-top:3px}
      `}</style>
    </>
  );
}
