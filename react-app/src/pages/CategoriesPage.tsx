import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

export default function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [query, setQuery] = useState(search);

  const { data } = useQuery({
    queryKey: ['categories', query],
    queryFn: () => api.get(`/categories?search=${encodeURIComponent(query)}`).then((r) => r.data),
  });

  const groups: Record<string, any[]> = data?.groups || {};

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
          placeholder="Search Business Categories"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') setQuery(search); }}
        />
        <button className="filter-btn"><i className="fas fa-sliders-h"></i></button>
      </div>

      <div className="filter-tags">
        <span className="filter-tag active">All</span>
        <span className="filter-tag">Colleges</span>
        <span className="filter-tag">Schools</span>
        <span className="filter-tag">Restaurants</span>
      </div>

      {Object.entries(groups).map(([groupName, cats]) => (
        <div className="biz-cat-group" key={groupName}>
          <h3>{groupName}</h3>
          <div className="biz-cat-grid">
            {cats.map((cat: any) => (
              <Link key={cat.id} to={`/businesses?cat=${cat.id}`} className="biz-cat-item">
                <div className="emoji">{cat.icon}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
