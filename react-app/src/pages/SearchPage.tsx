import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { catGridStyle, catItemStyle, catEmojiStyle } from '../catItemStyle';

const TABS = [
  { key: 'keyword',    label: 'Business Keywords' },
  { key: 'offers',     label: 'Offers' },
  { key: 'events',     label: 'Events' },
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

  const { data: catsResp } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => api.get('/categories').then((r) => r.data as { groups: Record<string, { id: number; name: string; icon: string }[]>; itemStyle?: any }),
  });
  const allCatsData = catsResp?.groups;
  const itemSt = catsResp?.itemStyle || null;

  const { data: searchData, isFetching } = useQuery({
    queryKey: ['search', query, tab, page],
    queryFn: () => api.get(`/search?q=${encodeURIComponent(query)}&tab=${tab}&page=${page}`).then((r) => r.data),
    enabled: !!query,
  });

  // Live suggestions while typing (4+ letters, like the categories page) — debounced.
  const [liveQ, setLiveQ] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setLiveQ(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);
  const liveActive = liveQ.length >= 4 && liveQ !== query;
  const { data: liveData, isFetching: liveLoading } = useQuery({
    queryKey: ['search-live', liveQ, tab],
    queryFn: () => api.get(`/search?q=${encodeURIComponent(liveQ)}&tab=${tab}&page=1`).then((r) => r.data),
    enabled: liveActive,
  });
  const liveResults: any[] = liveActive ? (liveData?.results || []).slice(0, 8) : [];

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

  const resultRow = (r: any, i: number) => (
    <Link key={`${r.type}-${r.id}-${i}`}
      to={r.type === 'business' ? `/businesses/${r.id}`
        : r.type === 'job' ? `/jobs/${r.id}`
        : r.type === 'offer' ? `/offers/${r.id}`
        : r.type === 'event' ? `/events/${r.id}`
        : `/classifieds/${r.id}`}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#fff', borderRadius: 14, textDecoration: 'none', border: '1px solid #EEEDF5', boxShadow: '0 3px 12px rgba(13,27,42,0.05)' }}>
      {r.imageUrl ? (
        <img src={r.imageUrl} alt={r.name} style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0, background: 'rgba(var(--primary-rgb),0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
          {r.type === 'job' ? '💼' : r.type === 'classified' ? '🏷️' : r.type === 'offer' ? '💰' : r.type === 'event' ? '🎉' : '🏢'}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          {[r.category_name, r.emirate || r.company].filter(Boolean).join(' · ')}
          {r.price ? ` · AED ${Number(r.price).toLocaleString()}` : ''}
        </div>
      </div>
      <span style={{ fontSize: 11, background: 'rgba(var(--primary-rgb),0.08)', color: 'var(--primary)', padding: '3px 9px', borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>
        {r.type === 'job' ? 'Job' : r.type === 'classified' ? 'Ad' : r.type === 'offer' ? 'Offer' : r.type === 'event' ? 'Event' : 'Business'}
      </span>
    </Link>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 90 }}>

      {/* Hero search area */}
      <div style={{ background: 'linear-gradient(150deg,var(--primary) 0%,var(--primary-dark) 100%)', padding: '34px 16px 24px', borderRadius: '0 0 26px 26px', textAlign: 'center' }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.75)', letterSpacing: 2, textTransform: 'uppercase' }}>
            UAE's Own Search Engine
          </span>
        </div>
        <h1 style={{ fontSize: 23, fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: -0.4 }}>
          Search Anything in UAE
        </h1>

        {/* Search box */}
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 16, background: '#fff', padding: '6px 6px 6px 16px', boxShadow: '0 10px 28px rgba(0,0,0,0.18)' }}>
            <i className="fas fa-search" style={{ color: 'var(--text-light)', fontSize: 14, flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') doSearch(input); }}
              placeholder={`Search ${TABS.find((t) => t.key === tab)?.label || ''}…`}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, padding: '8px 0', background: 'transparent', color: 'var(--text)', minWidth: 0, fontFamily: 'inherit' }}
              autoFocus
            />
            {input && (
              <button onClick={() => { setInput(''); setQuery(''); inputRef.current?.focus(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0 4px', fontSize: 17, lineHeight: 1 }}>✕</button>
            )}
            <button onClick={() => doSearch(input)}
              style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Search
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, marginTop: 14, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => { setTab(t.key); if (query) setPage(1); }}
              style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 999, border: '1px solid', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                borderColor: tab === t.key ? '#fff' : 'rgba(255,255,255,0.3)',
                background: tab === t.key ? '#fff' : 'rgba(255,255,255,0.14)',
                color: tab === t.key ? 'var(--primary)' : '#fff' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live suggestions while typing (4+ letters, before pressing Search) */}
      {liveActive && (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '14px 16px 4px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, fontWeight: 600 }}>
            {liveLoading && liveResults.length === 0 ? 'Searching…' : `Suggestions for "${liveQ}"`}
          </div>
          {!liveLoading && liveResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '18px 0', color: 'var(--text-light)', fontSize: 14 }}>No matches for “{liveQ}”</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {liveResults.map(resultRow)}
          </div>
          {liveResults.length > 0 && (
            <button onClick={() => doSearch(liveQ)}
              style={{ display: 'block', margin: '12px auto 0', padding: '9px 26px', background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 999, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              See all results for “{liveQ}”
            </button>
          )}
        </div>
      )}

      {/* Search results */}
      {hasQuery && (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '14px 16px 24px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 600 }}>
            {isFetching && page === 1 ? 'Searching…' : `Results for "${query}"`}
          </div>
          {allResults.length === 0 && !isFetching && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-light)', fontSize: 15 }}>No results found</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allResults.map(resultRow)}
          </div>
          {hasMore && (
            <button onClick={() => setPage((p) => p + 1)} disabled={isFetching}
              style={{ display: 'block', margin: '16px auto 0', padding: '11px 32px', background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', color: '#fff', border: 'none', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              {isFetching ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}

      {/* Recent searches */}
      {!hasQuery && !liveActive && recent.length > 0 && (
        <div style={{ padding: '18px 16px 4px', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>Recent Searches</span>
            <button onClick={() => { clearRecent(); setRecent([]); }} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {recent.map((kw) => (
              <button key={kw} onClick={() => { setInput(kw); doSearch(kw); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid #EEEDF5', borderRadius: 999, background: '#fff', fontSize: 13, color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(13,27,42,0.04)', fontWeight: 600 }}>
                <i className="fas fa-history" style={{ fontSize: 11, color: 'var(--text-light)' }} /> {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top 10 most clicked categories — same card style as the Categories page */}
      {!hasQuery && !liveActive && topCats && topCats.length > 0 && (
        <div className="biz-cat-group" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 8px' }}>
            <h3 style={{ margin: 0, padding: 0, fontSize: 16, fontWeight: 700, color: 'var(--dark)' }}>🔥 Top Categories</h3>
            <Link to="/categories" style={{ fontSize: 12.5, color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>View all <i className="fas fa-chevron-right" style={{ fontSize: 10 }}></i></Link>
          </div>
          <div className="biz-cat-grid" style={catGridStyle(itemSt)}>
            {topCats.map((cat) => (
              <Link key={cat.id} to={`/businesses?cat=${cat.id}`} onClick={() => trackCatClick(cat.id)} className="biz-cat-item" style={catItemStyle(itemSt)}>
                <div className="emoji" style={catEmojiStyle(itemSt)}>{cat.icon || '📂'}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All categories grouped — same style as the Categories page */}
      {!hasQuery && !liveActive && (
        <>
          {groupEntries.map(([groupName, cats]) => (
            <div className="biz-cat-group" key={groupName}>
              <h3>{groupName}</h3>
              <div className="biz-cat-grid" style={catGridStyle(itemSt)}>
                {cats.map((cat) => (
                  <Link key={cat.id} to={`/businesses?cat=${cat.id}`} onClick={() => trackCatClick(cat.id)} className="biz-cat-item" style={catItemStyle(itemSt)}>
                    <div className="emoji" style={catEmojiStyle(itemSt)}>{cat.icon || '📂'}</div>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Intersection observer trigger */}
          {visibleGroups < totalGroups && <div ref={loaderRef} style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Loading more…</span>
          </div>}
        </>
      )}
    </div>
  );
}
