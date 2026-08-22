import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { fmtPrice, priceSuffix } from '../constants/realestate';

const PROP_FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';

const DEFAULT_LAYOUT = [
  { key: 'banner',     on: 1, order: 1, title: '', style: 'scroll', auto: 0, speed: 3 },
  { key: 'categories', on: 1, order: 2, title: '', style: 'scroll', auto: 0, speed: 3 },
  { key: 'developers', on: 1, order: 3, title: 'Major Developers', style: 'scroll', auto: 0, speed: 3 },
  { key: 'projects',   on: 1, order: 4, title: 'Off-Plan Projects', style: 'scroll', auto: 0, speed: 3 },
  { key: 'listings',   on: 1, order: 5, title: '', style: 'scroll', auto: 0, speed: 3 },
];

// Continuous slow drift with seamless loop (content rendered twice when on).
function useMarquee(ref: React.RefObject<HTMLElement | null>, copyRef: React.RefObject<HTMLElement | null>, enabled: boolean, speed: number, gap = 14) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const pps = Math.min(10, Math.max(1, Number(speed) || 3)) * 12;
    let raf = 0, last = performance.now(), paused = false;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; last = performance.now(); };
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      if (!paused) {
        el.scrollLeft += pps * dt;
        const wrap = (copyRef.current?.offsetWidth || 0) + gap;
        if (wrap > 0 && el.scrollLeft >= wrap) el.scrollLeft -= wrap;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
    };
  }, [enabled, speed, ref, copyRef, gap]);
}

// Horizontal row that supports the marquee (duplicated content) or a 2-col grid.
function StyledRow({ cfg, children }: { cfg: any; children: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const auto = (cfg.style || 'scroll') === 'scroll' && !!cfg.auto && children.length > 1;
  useMarquee(ref, copyRef, auto, cfg.speed);
  if ((cfg.style || 'scroll') === 'grid') {
    return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '4px 16px 12px' }}>{children}</div>;
  }
  return (
    <div ref={ref} style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 16px 12px', scrollbarWidth: 'none' }}>
      <div ref={copyRef} style={{ display: 'flex', gap: 14, flexShrink: 0 }}>{children}</div>
      {auto && <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>{children}</div>}
    </div>
  );
}

// Admin banner slides: image/video, overlay text, link; auto-slides; height auto.
function ReBanner({ banners }: { banners: any[] }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setCur((c) => (c + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) {
    // Default hero when no admin slides exist.
    return (
      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 180 }}>
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=360&fit=crop" alt="Real Estate"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(var(--primary-rgb),.85),rgba(0,206,201,.6))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Find your next home</div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>Properties across the UAE</div>
          <div style={{ color: 'rgba(255,255,255,.9)', fontSize: 13, marginTop: 8 }}>Rooms, flats, villas &amp; off-plan projects</div>
        </div>
      </div>
    );
  }

  const b = banners[Math.min(cur, banners.length - 1)];
  const inner = (
    <div key={cur} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', animation: 'fadeIn .5s ease' }}>
      {b.videoUrl ? (
        <video src={b.videoUrl} autoPlay muted loop playsInline poster={b.imageUrl || undefined}
          style={{ width: '100%', height: 'auto', display: 'block' }} />
      ) : (
        <img src={b.imageUrl} alt={b.title || 'Real Estate'} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" decoding="async" />
      )}
      {(b.title || b.subtitle) && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%)' }}>
          {b.title && <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{b.title}</div>}
          {b.subtitle && <div style={{ color: 'rgba(255,255,255,.9)', fontSize: 13, marginTop: 6 }}>{b.subtitle}</div>}
        </div>
      )}
    </div>
  );
  const isExternal = b.link && /^https?:\/\//i.test(b.link);
  return (
    <div style={{ margin: 16 }}>
      {b.link
        ? isExternal
          ? <a href={b.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{inner}</a>
          : <Link to={b.link} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>
        : inner}
      {banners.length > 1 && (
        <div className="slider-dots" style={{ padding: '10px 0 0' }}>
          {banners.map((_, i) => <div key={i} className={`dot${i === cur ? ' active' : ''}`} onClick={() => setCur(i)} />)}
        </div>
      )}
    </div>
  );
}

export default function RealEstateHubPage() {
  const [search, setSearch] = useState('');
  const { data } = useQuery({ queryKey: ['realestate-hub'], queryFn: () => api.get('/realestate').then(r => r.data) });

  const categories: any[] = data?.categories || [];
  const companies: any[] = data?.featuredCompanies || [];
  const sections: any[] = data?.sections || [];
  const projects: any[] = data?.projects || [];
  const banners: any[] = data?.banners || [];

  // Admin layout config, defaults merged for any missing sections.
  let layout: any[] = Array.isArray(data?.layout) && data.layout.length ? data.layout : DEFAULT_LAYOUT;
  const known = new Set(layout.map((s: any) => s.key));
  layout = [...layout, ...DEFAULT_LAYOUT.filter((d) => !known.has(d.key))];
  const visible = layout.filter((s: any) => s.on).sort((a: any, b: any) => a.order - b.order);

  const head = (title: string, link?: string) => title && (
    <div className="section-header">
      <h2>{title}</h2>
      {link && <Link to={link}>View all</Link>}
    </div>
  );

  const SEC: Record<string, (cfg: any) => React.ReactNode> = {
    banner: () => <ReBanner banners={banners} />,
    categories: (cfg) => categories.length > 0 && (
      <div>
        {head(cfg.title || '')}
        {(cfg.style || 'scroll') === 'grid' || !cfg.auto ? (
          <div className="category-icons">
            {categories.map((cat: any) => (
              <Link key={cat.id} to={`/realestate/properties?category=${cat.id}`} className="cat-icon-item">
                <div className="icon">{cat.icon || '🏠'}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <StyledRow cfg={cfg}>
            {categories.map((cat: any) => (
              <Link key={cat.id} to={`/realestate/properties?category=${cat.id}`} className="cat-icon-item" style={{ width: 96, flexShrink: 0 }}>
                <div className="icon">{cat.icon || '🏠'}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </StyledRow>
        )}
      </div>
    ),
    developers: (cfg) => companies.length > 0 && (
      <div>
        {head(cfg.title || 'Major Developers', '/realestate/companies')}
        <StyledRow cfg={cfg}>
          {companies.map((c: any) => (
            <Link key={c.id} to={`/realestate/companies/${c.id}`}
              style={{ flexShrink: 0, width: (cfg.style === 'grid' ? undefined : 130), textDecoration: 'none', textAlign: 'center' }}>
              <div style={{ width: cfg.style === 'grid' ? '100%' : 130, aspectRatio: '1', borderRadius: 22, overflow: 'hidden', boxShadow: '0 6px 20px rgba(var(--primary-rgb),.18)', border: '1px solid rgba(var(--primary-rgb),.12)', background: '#fff' }}>
                <img src={c.logoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
            </Link>
          ))}
        </StyledRow>
      </div>
    ),
    projects: (cfg) => projects.length > 0 && (
      <div>
        {head(cfg.title || 'Off-Plan Projects', '/realestate/projects')}
        <StyledRow cfg={cfg}>
          {projects.map((p: any) => (
            <Link key={p.id} to={`/realestate/projects/${p.id}`}
              style={{ flexShrink: 0, width: cfg.style === 'grid' ? undefined : 240, textDecoration: 'none', borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.08)' }}>
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
        </StyledRow>
      </div>
    ),
    listings: (cfg) => sections.length > 0 && (
      <>
        {sections.map((section: any) => (
          <div key={section.id}>
            <div className="section-header">
              <h2>{section.icon} {section.name}</h2>
              <Link to={`/realestate/properties?category=${section.id}`}>View all</Link>
            </div>
            {(cfg.style || 'scroll') === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px 12px' }}>
                {section.items.map((item: any) => (
                  <Link key={item.id} to={`/realestate/properties/${item.id}`} className="classified-card" style={{ width: 'auto' }}>
                    <img src={item.imageUrl} alt={item.title} className="card-img" loading="lazy" decoding="async"
                      onError={(e) => { (e.target as HTMLImageElement).src = PROP_FALLBACK; }} />
                    <div className="card-body">
                      <div className="price">{fmtPrice(item.price, item.currency)} <small>{priceSuffix(item.purpose, item.rent_period)}</small></div>
                      <div className="card-title">{item.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        ))}
      </>
    ),
  };

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

      {visible.map((cfg: any) => {
        const render = SEC[cfg.key];
        const el = render ? render(cfg) : null;
        return el ? <div key={cfg.key}>{el}</div> : null;
      })}

      <div style={{ height: 24 }} />
    </>
  );
}
