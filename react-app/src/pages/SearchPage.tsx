import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const TABS = [
  { key: 'keyword',    label: 'Keyword' },
  { key: 'business',   label: 'Business' },
  { key: 'products',   label: 'Products' },
  { key: 'realestate', label: 'Real Estate' },
  { key: 'jobs',       label: 'Jobs' },
];

const RECENT_KEY = 'uae_recent_searches';

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(kw: string) {
  const prev = getRecent().filter((k) => k !== kw);
  localStorage.setItem(RECENT_KEY, JSON.stringify([kw, ...prev].slice(0, 8)));
}
function clearRecent() { localStorage.removeItem(RECENT_KEY); }

export default function SearchPage() {
  const [tab, setTab] = useState('keyword');
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(getRecent);
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Visible category groups — load more on scroll
  const [visibleGroups, setVisibleGroups] = useState(3);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data: topCats } = useQuery({
    queryKey: ['top-categories'],
    queryFn: () => api.get('/categories/top').then((r) => r.data as { id: number; name: string; icon: string; clicks: number }[]),
  });

  const { data: allCatsData } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => api.get('/categories').then((r) => r.data.groups as Record<string, { id: number; name: string; icon: string }[]>),
  });

  const { data: searchData, isFetching } = useQuery({
    queryKey: ['search', query, tab, page],
    queryFn: () => api.get(`/search?q=${encodeURIComponent(query)}&tab=${tab}&page=${page}`).then((r) => r.data),
    enabled: !!query,
  });

  // Accumulate results across pages
  useEffect(() => {
    if (!searchData) return;
    if (page === 1) {
      setAllResults(searchData.results || []);
    } else {
      setAllResults((prev) => [...prev, ...(searchData.results || [])]);
    }
    setHasMore((searchData.results?.length || 0) === 20);
  }, [searchData, page]);

  // Reset page when query/tab changes
  useEffect(() => {
    setPage(1);
    setAllResults([]);
  }, [query, tab]);

  // Infinite scroll for categories
  useEffect(() => {
    if (!allCatsData) return;
    const groups = Object.keys(allCatsData);
    if (visibleGroups >= groups.length) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleGroups((v) => Math.min(v + 3, groups.length));
    }, { threshold: 0.1 });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [allCatsData, visibleGroups]);

  const doSearch = useCallback((kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    saveRecent(trimmed);
    setRecent(getRecent());
    setQuery(trimmed);
    api.post('/search/track', { keyword: trimmed }).catch(() => {});
  }, []);

  const trackCatClick = (id: number) => {
    api.post(`/categories/track/${id}`, {}).catch(() => {});
  };

  const groupEntries = allCatsData ? Object.entries(allCatsData).slice(0, visibleGroups) : [];
  const totalGroups = allCatsData ? Object.keys(allCatsData).length : 0;
  const hasQuery = !!query;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Segoe UI', Inter, sans-serif", paddingBottom: 80 }}>

      {/* Hero search area */}
      <div style={{ padding: '48px 20px 32px', textAlign: 'center' }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0067C0', letterSpacing: 2, textTransform: 'uppercase' }}>
            UAE's Own Search Engine
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: '0 0 24px', lineHeight: 1.2, fontFamily: "'Georgia', serif" }}>
          Search Anything in UAE
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => { setTab(t.key); if (query) setPage(1); }}
              style={{ padding: '6px 14px', borderRadius: 20, border: '1.5px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                borderColor: tab === t.key ? '#0067C0' : '#E0E0E0',
                background: tab === t.key ? '#0067C0' : '#fff',
                color: tab === t.key ? '#fff' : '#555' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #0067C0', borderRadius: 30, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 20px rgba(0,103,192,0.12)' }}>
            <i className="fas fa-search" style={{ color: '#0067C0', fontSize: 16, padding: '0 16px', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') doSearch(input); }}
              placeholder={`Search ${TABS.find((t) => t.key === tab)?.label || ''}…`}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, padding: '14px 0', background: 'transparent', color: '#1a1a1a' }}
              autoFocus
            />
            {input && (
              <button onClick={() => { setInput(''); setQuery(''); inputRef.current?.focus(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: '0 10px', fontSize: 18, lineHeight: 1 }}>✕</button>
            )}
            <button onClick={() => doSearch(input)}
              style={{ background: '#0067C0', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px 22px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search results */}
      {hasQuery && (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 24px' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
            {isFetching && page === 1 ? 'Searching…' : `Results for "${query}"`}
          </div>
          {allResults.length === 0 && !isFetching && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', fontSize: 15 }}>No results found</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {allResults.map((r: any, i) => (
              <Link key={`${r.type}-${r.id}-${i}`}
                to={r.type === 'business' ? `/businesses/${r.id}` : r.type === 'job' ? `/jobs/${r.id}` : `/classifieds/${r.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderRadius: 8, textDecoration: 'none', border: '1px solid #F0F0F0' }}>
                {r.imageUrl ? (
                  <img src={r.imageUrl} alt={r.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 6, flexShrink: 0, background: r.type === 'job' ? '#EBF3FB' : '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {r.type === 'job' ? '💼' : r.type === 'classified' ? '🏷️' : '🏢'}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {[r.category_name, r.emirate || r.company].filter(Boolean).join(' · ')}
                    {r.price ? ` · AED ${Number(r.price).toLocaleString()}` : ''}
                  </div>
                </div>
                <span style={{ fontSize: 11, background: r.type === 'job' ? '#EBF3FB' : r.type === 'classified' ? '#FFF3E0' : '#E8F5E9', color: r.type === 'job' ? '#0067C0' : r.type === 'classified' ? '#E65100' : '#2E7D32', padding: '3px 8px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                  {r.type === 'job' ? 'Job' : r.type === 'classified' ? 'Ad' : 'Business'}
                </span>
              </Link>
            ))}
          </div>
          {hasMore && (
            <button onClick={() => setPage((p) => p + 1)} disabled={isFetching}
              style={{ display: 'block', margin: '16px auto 0', padding: '10px 32px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              {isFetching ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}

      {/* Recent searches */}
      {!hasQuery && recent.length > 0 && (
        <div style={{ padding: '0 16px 24px', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>Recent Searches</span>
            <button onClick={() => { clearRecent(); setRecent([]); }} style={{ background: 'none', border: 'none', fontSize: 12, color: '#0067C0', cursor: 'pointer' }}>Clear</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {recent.map((kw) => (
              <button key={kw} onClick={() => { setInput(kw); doSearch(kw); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid #E0E0E0', borderRadius: 20, background: '#F9F9F9', fontSize: 13, color: '#333', cursor: 'pointer', fontFamily: 'inherit' }}>
                <i className="fas fa-history" style={{ fontSize: 11, color: '#aaa' }} /> {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top 10 most searched categories */}
      {!hasQuery && topCats && topCats.length > 0 && (
        <div style={{ padding: '0 16px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>🔥 Top Categories</span>
            <Link to="/categories" style={{ fontSize: 13, color: '#0067C0', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {topCats.map((cat) => (
              <Link key={cat.id} to={`/businesses?cat=${cat.id}`}
                onClick={() => trackCatClick(cat.id)}
                style={{ textDecoration: 'none', textAlign: 'center', padding: '12px 6px', borderRadius: 12, border: '1px solid #F0F0F0', background: '#FAFAFA' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{cat.icon || '📂'}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#333', lineHeight: 1.2 }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All categories grouped */}
      {!hasQuery && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 14, borderTop: '1px solid #F0F0F0', paddingTop: 20 }}>
            All Categories
          </div>
          {groupEntries.map(([groupName, cats]) => (
            <div key={groupName} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0067C0', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
                {groupName}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {cats.map((cat) => (
                  <Link key={cat.id} to={`/businesses?cat=${cat.id}`}
                    onClick={() => trackCatClick(cat.id)}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px', borderRadius: 10, border: '1px solid #F0F0F0', background: '#fff', gap: 4 }}>
                    <span style={{ fontSize: 22 }}>{cat.icon || '📂'}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#333', textAlign: 'center', lineHeight: 1.2 }}>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Intersection observer trigger */}
          {visibleGroups < totalGroups && <div ref={loaderRef} style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>Loading more…</span>
          </div>}
        </div>
      )}
    </div>
  );
}
