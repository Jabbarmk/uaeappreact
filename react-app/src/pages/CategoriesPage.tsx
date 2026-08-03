import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

// Where a category tag / grid item should go when tapped.
function catLink(cat: { id: number; group_name?: string }) {
  return cat.group_name === 'Doctors & Specialists' ? `/doctors?specialty=${cat.id}` : `/businesses?cat=${cat.id}`;
}

export default function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [query, setQuery] = useState(search);

  const { data } = useQuery({
    queryKey: ['categories', query],
    queryFn: () => api.get(`/categories?search=${encodeURIComponent(query)}`).then((r) => r.data),
  });

  const groups: Record<string, any[]> = data?.groups || {};

  // Filter-tag row: default = top-10 clicked categories; 2+ letters = categories starting with the text.
  const tagQuery = search.trim();
  const tagKey = tagQuery.length >= 2 ? tagQuery : '';
  const { data: tagData } = useQuery({
    queryKey: ['cat-tags', tagKey],
    queryFn: () => api.get(`/categories/tags?q=${encodeURIComponent(tagKey)}`).then((r) => r.data),
  });
  const tags: any[] = tagData || [];

  // Live business-name search: fires once 4+ characters are typed.
  const bizQuery = search.trim();
  const bizActive = bizQuery.length >= 4;
  const { data: bizData, isFetching: bizLoading } = useQuery({
    queryKey: ['cat-biz-search', bizQuery],
    queryFn: () => api.get(`/businesses/search?q=${encodeURIComponent(bizQuery)}`).then((r) => r.data),
    enabled: bizActive,
  });
  const bizResults: any[] = bizActive ? (bizData || []) : [];

  return (
    <>
      <div className="page-topbar">
        <span className="logo-icon"><i className="fas fa-map-marker-alt"></i></span>
        <h1>BUSINESS CATEGORIES</h1>
      </div>

      <div className="page-search">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search categories or businesses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') setQuery(search); }}
        />
        {search && <button className="filter-btn" onClick={() => { setSearch(''); setQuery(''); }}><i className="fas fa-times"></i></button>}
      </div>

      {/* Filter tags — top clicked categories by default, or categories starting with typed text */}
      {tags.length > 0 && (
        <div className="filter-tags">
          {tagKey && <span className="filter-tag-label">Starting “{tagKey}”:</span>}
          {tags.map((t) => (
            <span key={t.id} className="filter-tag" onClick={() => navigate(catLink(t))}>
              {t.icon ? `${t.icon} ` : ''}{t.name}
            </span>
          ))}
        </div>
      )}

      {/* Business-name results (4+ letters) */}
      {bizActive && (
        <div className="biz-name-results">
          <h3>Businesses{bizResults.length ? ` (${bizResults.length})` : ''}</h3>
          {bizLoading && bizResults.length === 0 ? (
            <div className="biz-name-empty">Searching…</div>
          ) : bizResults.length === 0 ? (
            <div className="biz-name-empty">No businesses found for “{bizQuery}”.</div>
          ) : (
            <div className="biz-name-list">
              {bizResults.map((b) => (
                <Link key={b.id} to={`/businesses/${b.id}`} className="biz-name-item">
                  <img src={b.imageUrl} alt="" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
                  <div className="bn-info">
                    <div className="bn-name">{b.name}</div>
                    <div className="bn-cat">{[b.category_name, b.emirate].filter(Boolean).join(' · ')}</div>
                  </div>
                  {Number(b.rating) > 0 && <span className="bn-rating"><i className="fas fa-star"></i> {Number(b.rating).toFixed(1)}</span>}
                  <i className="fas fa-chevron-right bn-chev"></i>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {Object.entries(groups).map(([groupName, cats]) => (
        <div className="biz-cat-group" key={groupName}>
          <h3>{groupName}</h3>
          <div className="biz-cat-grid">
            {cats.map((cat: any) => {
              // Doctors & Specialists sub-categories open the doctors listing for that specialty.
              const to = groupName === 'Doctors & Specialists' ? `/doctors?specialty=${cat.id}` : `/businesses?cat=${cat.id}`;
              return (
                <Link key={cat.id} to={to} className="biz-cat-item">
                  <div className="emoji">{cat.icon}</div>
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
