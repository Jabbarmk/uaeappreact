import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { ProfileButton } from '../components/Header';

const SLIDER_FALLBACKS = [
  { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&fit=crop', title: 'Discover Dubai', sub: 'Find the best businesses near you', btn: 'Explore' },
  { img: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&fit=crop', title: 'Dubai Marina', sub: 'Premium classifieds & real estate', btn: 'Browse' },
  { img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&fit=crop', title: 'Career in UAE', sub: 'Thousands of jobs waiting for you', btn: 'Find Jobs' },
];

// Fallback menu when home_menu_items is empty (mirrors the original hardcoded services).
const MENU_FALLBACK = [
  { id: 1,  label: 'Businesses',   link: '/categories',   icon: 'fa-store',          tone: 'purple', imageUrl: null },
  { id: 2,  label: 'Offers',       link: '/offers',       icon: 'fa-percent',        tone: 'amber',  imageUrl: null },
  { id: 3,  label: 'Events',       link: '/events',       icon: 'fa-calendar-day',   tone: 'pink',   imageUrl: null },
  { id: 4,  label: 'Jobs',         link: '/jobs',         icon: 'fa-briefcase',      tone: 'teal',   imageUrl: null },
  { id: 5,  label: 'Real Estate',  link: '/realestate',   icon: 'fa-building',       tone: 'teal',   imageUrl: null },
  { id: 6,  label: 'Doctors',      link: '/doctors',      icon: 'fa-user-md',        tone: 'pink',   imageUrl: null },
  { id: 7,  label: 'Classifieds',  link: '/classifieds',  icon: 'fa-tags',           tone: 'amber',  imageUrl: null },
  { id: 8,  label: 'Universities', link: '/universities', icon: 'fa-graduation-cap', tone: 'purple', imageUrl: null },
  { id: 9,  label: 'Smart CV',     link: '/profile',      icon: 'fa-file-alt',       tone: 'purple', imageUrl: null },
  { id: 10, label: 'Search',       link: '/search',       icon: 'fa-search',         tone: 'teal',   imageUrl: null },
];

const DEFAULT_LAYOUT = [
  { key: 'slider',      title: null,                      visible: true, order: 1, settings: {} as any },
  { key: 'featured',    title: 'Featured Categories',     visible: true, order: 2, settings: { style: 'scroll' } as any },
  { key: 'hero',        title: 'Find anything in UAE',    visible: true, order: 3, settings: {} as any },
  { key: 'explore',     title: 'Explore SmartUAE',        visible: true, order: 4, settings: { style: 'icons' } as any },
  { key: 'popular',     title: 'Popular Right Now',       visible: true, order: 5, settings: { size: 'm', rows: 1 } as any },
  { key: 'stats',       title: null,                      visible: true, order: 6, settings: {} as any },
  { key: 'collections', title: 'Explore the best in UAE', visible: true, order: 7, settings: {} as any },
];

// Advance a horizontal scroller one child at a time on a timer, looping.
function useAutoStep(ref: React.RefObject<HTMLElement | null>, enabled: boolean, seconds: number) {
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el || el.children.length === 0) return;
      const kids = Array.from(el.children) as HTMLElement[];
      const cur = kids.findIndex((k) => k.offsetLeft - el.offsetLeft >= el.scrollLeft - 4);
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      const next = atEnd ? 0 : Math.min(cur + 1, kids.length - 1);
      el.scrollTo({ left: kids[next].offsetLeft - el.offsetLeft, behavior: 'smooth' });
    }, Math.max(1, seconds || 4) * 1000);
    return () => clearInterval(t);
  }, [enabled, seconds, ref]);
}

function Slider({ slides }: { slides: any[] }) {
  const [cur, setCur] = useState(0);
  const total = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const curRef = useRef(0);

  // Slide's snap position is its left edge minus the container's left inset (16px).
  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    const child = track?.children[i] as HTMLElement | undefined;
    if (track && child) track.scrollTo({ left: child.offsetLeft - 16, behavior: 'smooth' });
  };

  // Keep the active dot in sync with whatever card is nearest the left inset.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    let best = 0, bestDist = Infinity;
    Array.from(track.children).forEach((ch, i) => {
      const d = Math.abs((ch as HTMLElement).offsetLeft - 16 - track.scrollLeft);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    if (best !== curRef.current) { curRef.current = best; setCur(best); }
  };

  useEffect(() => {
    const timer = setInterval(() => scrollToIndex((curRef.current + 1) % total), 4500);
    return () => clearInterval(timer);
  }, [total]);

  const go = (i: number) => { curRef.current = i; setCur(i); scrollToIndex(i); };

  return (
    <>
      <div className="slider-container" ref={trackRef} onScroll={onScroll}>
        {slides.map((slide, i) => {
          const slideTo = slide.button_link && slide.button_link !== '#'
            ? slide.button_link
            : slide.business_id
              ? `/businesses/${slide.business_id}`
              : null;
          const inner = (
            <>
              <img src={slide.imageUrl || slide.img} alt={slide.title}
                loading={i === 0 ? undefined : 'lazy'} decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = SLIDER_FALLBACKS[i % SLIDER_FALLBACKS.length].img; }} />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle || slide.sub}</p>
                {(slide.button_text || slide.btn) && (
                  <span className="slide-btn">{slide.button_text || slide.btn}</span>
                )}
              </div>
            </>
          );
          return slideTo
            ? <Link className="slide" key={i} to={slideTo}>{inner}</Link>
            : <div className="slide" key={i}>{inner}</div>;
        })}
      </div>
      <div className="slider-dots">
        {slides.map((_, i) => (
          <div key={i} className={`dot${i === cur ? ' active' : ''}`} onClick={() => go(i)} />
        ))}
      </div>
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function SectionHead({ title, link, size }: { title: string; link?: string; size?: number }) {
  return (
    <div className="hm-section-head">
      <h2 style={size ? { fontSize: size } : undefined}>{title}</h2>
      {link && <Link to={link}>See all <i className="fas fa-chevron-right"></i></Link>}
    </div>
  );
}

// ── Featured categories: scroll or grid ──────────────────────────────────────

const CAT_GAP = 10;

// Track the content-box width of an element.
function useContentWidth(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const upd = () => {
      const cs = getComputedStyle(el);
      setW(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
    };
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

// Continuous slow drift with a seamless loop. speed: 1 (slow) → 10 (fast).
// Content must be rendered twice; copyRef points at the first copy.
function useMarquee(ref: React.RefObject<HTMLElement | null>, copyRef: React.RefObject<HTMLElement | null>, enabled: boolean, speed: number) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const pps = Math.min(10, Math.max(1, Number(speed) || 3)) * 12; // px per second
    let raf = 0, last = performance.now(), paused = false;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; last = performance.now(); };
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);
    el.addEventListener('mousedown', pause);
    el.addEventListener('mouseup', resume);
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      if (!paused) {
        el.scrollLeft += pps * dt;
        const wrap = (copyRef.current?.offsetWidth || 0) + CAT_GAP;
        if (wrap > 0 && el.scrollLeft >= wrap) el.scrollLeft -= wrap;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('mousedown', pause);
      el.removeEventListener('mouseup', resume);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
    };
  }, [enabled, speed, ref, copyRef]);
}

function CatTile({ cat, w, iconSize, radiusPct, textInside, labelSize }: { cat: any; w: number | string; iconSize: number; radiusPct: number; textInside: boolean; labelSize: number }) {
  const radius = Math.round(iconSize * Math.min(50, Math.max(0, radiusPct)) / 100);
  if (textInside) {
    return (
      <Link to={`/businesses?cat=${cat.category_id}`} className="hm-cat" style={{ width: w }}>
        <div className="hm-cat-icon hm-cat-inside" style={{ width: iconSize, height: iconSize, borderRadius: radius }}>
          <span style={{ fontSize: Math.round(iconSize * 0.36), lineHeight: 1 }}>{cat.icon}</span>
          <span className="hm-cat-lbl-in" style={{ fontSize: labelSize - 1 }}>{cat.name}</span>
        </div>
      </Link>
    );
  }
  return (
    <Link to={`/businesses?cat=${cat.category_id}`} className="hm-cat" style={{ width: w }}>
      <div className="hm-cat-icon" style={{ width: iconSize, height: iconSize, borderRadius: radius, fontSize: Math.round(iconSize * 0.44) }}>
        {cat.icon}
      </div>
      <span style={{ fontSize: labelSize }}>{cat.name}</span>
    </Link>
  );
}

// Always-last "View More" tile → full categories page.
function MoreTile({ w, iconSize, radiusPct, textInside, labelSize }: { w: number | string; iconSize: number; radiusPct: number; textInside: boolean; labelSize: number }) {
  const radius = Math.round(iconSize * Math.min(50, Math.max(0, radiusPct)) / 100);
  const arrow = <i className="fas fa-arrow-right" style={{ color: 'var(--primary)' }}></i>;
  if (textInside) {
    return (
      <Link to="/categories" className="hm-cat" style={{ width: w }}>
        <div className="hm-cat-icon hm-cat-inside hm-cat-more" style={{ width: iconSize, height: iconSize, borderRadius: radius }}>
          <span style={{ fontSize: Math.round(iconSize * 0.30), lineHeight: 1 }}>{arrow}</span>
          <span className="hm-cat-lbl-in" style={{ fontSize: labelSize - 1 }}>View More</span>
        </div>
      </Link>
    );
  }
  return (
    <Link to="/categories" className="hm-cat" style={{ width: w }}>
      <div className="hm-cat-icon hm-cat-more" style={{ width: iconSize, height: iconSize, borderRadius: radius, fontSize: Math.round(iconSize * 0.36) }}>
        {arrow}
      </div>
      <span style={{ fontSize: labelSize }}>View More</span>
    </Link>
  );
}

function FeaturedSection({ cfg, cats }: { cfg: any; cats: any[] }) {
  const set = cfg.settings || {};
  const ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const contentW = useContentWidth(ref);
  const isGrid = set.style === 'grid';
  const auto = !isGrid && !!set.auto && cats.length > 1;
  const radiusPct = set.radius === undefined || set.radius === '' ? 33 : Number(set.radius);
  const textInside = set.textPos === 'inside';
  const titleSize = Number(set.titleSize) || 17;
  const labelSize = Number(set.textSize) || 11;
  useMarquee(ref, copyRef, auto, set.speed);
  if (!cats.length) return null;

  if (isGrid) {
    const cols = Math.min(6, Math.max(2, Number(set.columns) || 3));
    const maxRows = Number(set.maxRows) || 2;
    const shown = cats.slice(0, cols * maxRows - 1); // last cell is View More
    const cellW = contentW > 0 ? (contentW - CAT_GAP * (cols - 1)) / cols : 0;
    const iconSize = cellW > 0 ? Math.round(Math.min(cellW * 0.82, 130)) : 75;
    return (
      <>
        <SectionHead title={cfg.title || 'Featured Categories'} link="/categories" size={titleSize} />
        <div className="hm-cats-grid" ref={ref} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: CAT_GAP }}>
          {shown.map((cat: any) => <CatTile key={cat.id} cat={cat} w="auto" iconSize={iconSize} radiusPct={radiusPct} textInside={textInside} labelSize={labelSize} />)}
          <MoreTile w="auto" iconSize={iconSize} radiusPct={radiusPct} textInside={textInside} labelSize={labelSize} />
        </div>
      </>
    );
  }

  // Scroll mode: N full buttons + a peek of the next; sizes follow column count.
  const visCols = Math.min(6, Math.max(2, Number(set.visCols) || 4));
  const itemW = contentW > 0 ? (contentW - CAT_GAP * visCols) / (visCols + 0.45) : 84;
  const iconSize = Math.round(Math.min(itemW - 4, 130));
  const row = (r?: React.Ref<HTMLDivElement>) => (
    <div className="hm-cats-copy" ref={r} style={{ gap: CAT_GAP }}>
      {cats.map((cat: any) => <CatTile key={cat.id} cat={cat} w={Math.round(itemW)} iconSize={iconSize} radiusPct={radiusPct} textInside={textInside} labelSize={labelSize} />)}
      <MoreTile w={Math.round(itemW)} iconSize={iconSize} radiusPct={radiusPct} textInside={textInside} labelSize={labelSize} />
    </div>
  );

  return (
    <>
      <SectionHead title={cfg.title || 'Featured Categories'} link="/categories" size={titleSize} />
      <div className="hm-cats" ref={ref} style={{ gap: CAT_GAP }}>
        {row(copyRef)}
        {auto && row()}
      </div>
    </>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ cfg }: { cfg: any }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search');
  };
  const title = cfg.title || 'Find anything in UAE';
  // Color the last word (e.g. "UAE") with the accent, like the original design.
  const parts = title.trim().split(' ');
  const last = parts.pop();
  return (
    <div className="hm-hero">
      <div className="hm-greet">{greeting()} 👋</div>
      <h1 className="hm-title" style={{ fontSize: Number(cfg.settings?.titleSize) || 24 }}>{parts.join(' ')} <span>{last}</span></h1>
      <form className="hm-search" onSubmit={submitSearch}>
        <i className="fas fa-search"></i>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={cfg.settings?.placeholder || 'Businesses, offers, jobs, properties…'} aria-label="Search" />
        <button type="submit">Search</button>
      </form>
      <div className="hm-hero-chips">
        <Link to="/businesses">Businesses</Link>
        <Link to="/offers">Offers</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/realestate">Properties</Link>
      </div>
    </div>
  );
}

// ── Explore SmartUAE: icon grid or image cards ───────────────────────────────

function ExploreSection({ cfg, menu }: { cfg: any; menu: any[] }) {
  const set = cfg.settings || {};
  const ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const items = menu.length ? menu : MENU_FALLBACK;
  const imgStyle = set.style === 'images';
  const auto = !!set.auto && items.length > 1;
  const radiusPct = set.radius === undefined || set.radius === '' ? (imgStyle ? 15 : 32) : Math.min(50, Math.max(0, Number(set.radius)));
  const tileW = Number(set.tileW) || (imgStyle ? 118 : 50);
  const tileH = Number(set.tileH) || (imgStyle ? 84 : 63);
  const textSize = Number(set.textSize) || (imgStyle ? 11.5 : 10.5);
  const radius = Math.round(Math.min(tileW, tileH) * radiusPct / 100);
  useMarquee(ref, copyRef, auto, set.speed);

  const iconTile = (m: any) => (
    <Link key={m.id} to={m.link} className={`hm-tile ${m.tone}`} style={auto ? { width: tileW + 12 } : undefined}>
      <div className="hm-tile-icon" style={{ width: tileW, height: tileH, borderRadius: radius, fontSize: Math.round(tileW * 0.54) }}>
        {m.imageUrl && !m.icon
          ? <img src={m.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <i className={`fas ${m.icon || 'fa-star'}`}></i>}
      </div>
      <span style={{ fontSize: textSize }}>{m.label}</span>
    </Link>
  );

  const imgCard = (m: any) => (
    <Link key={m.id} to={m.link} className="hm-exp-card" style={{ width: tileW, borderRadius: radius }}>
      {m.imageUrl
        ? <img src={m.imageUrl} alt={m.label} loading="lazy" decoding="async" style={{ height: tileH }} />
        : <div className={`hm-exp-fallback ${m.tone}`} style={{ height: tileH }}><i className={`fas ${m.icon || 'fa-star'}`}></i></div>}
      <div className="hm-exp-label" style={{ fontSize: textSize }}>{m.label}</div>
    </Link>
  );

  const renderItem = imgStyle ? imgCard : iconTile;

  return (
    <>
      <SectionHead title={cfg.title || 'Explore SmartUAE'} size={Number(set.titleSize) || 17} />
      {imgStyle || auto ? (
        // Horizontal row; duplicated content when the marquee is on.
        <div className="hm-explore-row" ref={ref}>
          <div className="hm-exp-copy" ref={copyRef}>{items.map(renderItem)}</div>
          {auto && <div className="hm-exp-copy">{items.map(renderItem)}</div>}
        </div>
      ) : (
        <div className="hm-grid">
          {items.map(renderItem)}
        </div>
      )}
    </>
  );
}

// ── Popular: sized cards, 1-3 rows, optional auto-slide ──────────────────────

const POP_SIZES: Record<string, number> = { s: 132, m: 172, l: 224 };

function PopularSection({ cfg, cats }: { cfg: any; cats: any[] }) {
  const set = cfg.settings || {};
  const ref = useRef<HTMLDivElement>(null);
  useAutoStep(ref, !!set.auto, set.timer);
  const w = POP_SIZES[set.size] || POP_SIZES.m;
  const rows = Math.min(3, Math.max(1, Number(set.rows) || 1));
  const items = cats.length ? cats : [
    { id: 0, name: 'City Tours', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=267&fit=crop' },
    { id: 0, name: 'Restaurants', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=267&fit=crop' },
    { id: 0, name: 'Real Estate', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=267&fit=crop' },
    { id: 0, name: 'Car Rental', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=267&fit=crop' },
  ];

  return (
    <>
      <SectionHead title={cfg.title || 'Popular Right Now'} link="/categories" size={Number(set.titleSize) || 17} />
      <div className="hm-pop-track" ref={ref} style={{ gridTemplateRows: `repeat(${rows}, auto)` }}>
        {items.map((pc: any, i: number) => (
          <Link key={i} to={pc.id ? `/businesses?cat=${pc.id}` : '/businesses'} className="hm-pop-card" style={{ width: w }}>
            <img src={pc.imageUrl} alt={pc.name} loading="lazy" decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${i % 2 ? '1555396273-367ea4eb4db5' : '1512453979798-5ea266f8880c'}?w=400&h=267&fit=crop`; }} />
            <div className="label" style={{ fontSize: Number(set.textSize) || 12.5 }}>{pc.name}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────

function StatsSection({ cfg, stats }: { cfg: any; stats: any }) {
  const set = cfg.settings || {};
  return (
    <>
      {cfg.title && <SectionHead title={cfg.title} size={Number(set.titleSize) || 17} />}
      <div className="hm-stats">
        <div className="hm-stat"><div className="hm-stat-num">{stats.businesses}+</div><div className="hm-stat-lbl">{set.label1 || 'Businesses'}</div></div>
        <div className="hm-stat"><div className="hm-stat-num">{stats.jobs}+</div><div className="hm-stat-lbl">{set.label2 || 'Active Jobs'}</div></div>
        <div className="hm-stat"><div className="hm-stat-num">{stats.classifieds}+</div><div className="hm-stat-lbl">{set.label3 || 'Listings'}</div></div>
      </div>
    </>
  );
}

// ── Collections: "best in UAE" — one slider row of collection cards ──────────

function CollectionsSection({ cfg, collections }: { cfg: any; collections: any[] }) {
  const set = cfg.settings || {};
  if (!collections.length) return null;

  return (
    <>
      <SectionHead title={cfg.title || 'Explore the best in UAE'} link="/collections" size={Number(set.titleSize) || 17} />
      <div className="hm-col-track">
        {collections.map((col) => {
          const thumb = col.items.find((i: any) => i.imageUrl)?.imageUrl || null;
          return (
            <Link key={col.id} to={`/collections/${col.id}`} className="hm-col-card">
              {thumb
                ? <img src={thumb} alt={col.title} loading="lazy" decoding="async" />
                : <div className="hm-col-noimg"><i className="fas fa-images"></i></div>}
              <div className="hm-col-overlay">
                <div className="hm-col-name" style={{ fontSize: Number(set.textSize) || 13 }}>{col.title}</div>
                <div className="hm-col-biz">{col.items.length} place{col.items.length === 1 ? '' : 's'}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: () => api.get('/home').then((r) => r.data),
  });

  if (isLoading) return <div className="loading">Loading…</div>;

  const sliders = data?.sliders?.length ? data.sliders : SLIDER_FALLBACKS;
  const sliderH: number = data?.sliderHeight || 650;
  const sliderW: number | null = data?.sliderWidth || null;
  const homeCats = data?.homeCategories || [];
  const popCats = data?.popularCategories || [];
  const stats = data?.stats || { businesses: 50, jobs: 30, classifieds: 100 };
  const menu = data?.menu || [];
  const collections = data?.collections || [];
  const layout: any[] = data?.layout?.length ? data.layout : DEFAULT_LAYOUT;

  const renderSection = (cfg: any) => {
    switch (cfg.key) {
      case 'slider':      return (
        <div className="hm-slider-wrap" key="slider">
          {cfg.title && <SectionHead title={cfg.title} size={Number(cfg.settings?.titleSize) || 17} />}
          <Slider slides={sliders} />
        </div>
      );
      case 'featured':    return <FeaturedSection key="featured" cfg={cfg} cats={homeCats} />;
      case 'hero':        return <HeroSection key="hero" cfg={cfg} />;
      case 'explore':     return <ExploreSection key="explore" cfg={cfg} menu={menu} />;
      case 'popular':     return <PopularSection key="popular" cfg={cfg} cats={popCats} />;
      case 'stats':       return <StatsSection key="stats" cfg={cfg} stats={stats} />;
      case 'collections': return <CollectionsSection key="collections" cfg={cfg} collections={collections} />;
      default: return null;
    }
  };

  return (
    <>
      {/* ── Top app bar: logo + quick actions ────────────────────────── */}
      <header className="hm-topbar">
        <Link to="/" className="hm-topbar-logo" aria-label="SmartUAE home">
          <img src="/assets/images/smatuae.png" alt="SmartUAE" />
        </Link>
        <div className="hm-topbar-actions">
          <button type="button" className="hm-iconbtn" aria-label="Search"
            onClick={() => navigate('/search')}>
            <i className="fas fa-search"></i>
          </button>
          <ProfileButton />
        </div>
      </header>

      {[...layout].sort((a, b) => a.order - b.order).filter((s) => s.visible).map(renderSection)}

      <div style={{ height: 90 }} />

      <style>{`
        /* ── Top app bar ── */
        .hm-topbar{position:sticky;top:0;z-index:300;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;background:transparent;border-bottom:none}
        .hm-topbar-logo{display:flex;align-items:center;flex-shrink:0}
        .hm-topbar-logo img{height:26px;width:auto;display:block}
        .hm-topbar-actions{display:flex;align-items:center;gap:8px}
        .hm-iconbtn{width:38px;height:38px;border-radius:50%;background:#fff;border:1px solid #E5E8F0;box-shadow:0 2px 8px rgba(13,27,42,0.06);display:flex;align-items:center;justify-content:center;color:var(--dark);font-size:14px;cursor:pointer;transition:transform .12s ease,background .12s ease;padding:0}
        .hm-iconbtn:hover{background:#F7F6FC}
        .hm-iconbtn:active{transform:scale(0.92)}

        /* ── Slider wrap: spacing under the sticky bar ── */
        .hm-slider-wrap{margin-top:6px}

        /* ── Hero ── */
        .hm-hero{background:linear-gradient(150deg,var(--primary) 0%,var(--primary-dark) 55%,#3E3277 100%);padding:24px 16px 20px;border-radius:26px;margin:20px 12px 0;position:relative;overflow:hidden}
        .hm-hero::after{content:'';position:absolute;top:-70px;right:-70px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.07);pointer-events:none}
        .hm-hero::before{content:'';position:absolute;bottom:-90px;left:-50px;width:180px;height:180px;border-radius:50%;background:rgba(0,206,201,0.13);pointer-events:none}
        .hm-greet{color:rgba(255,255,255,.75);font-size:13px;font-weight:600;margin-bottom:4px}
        .hm-title{color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.4px;line-height:1.2;margin:0 0 16px}
        .hm-title span{color:#00CEC9}
        .hm-search{display:flex;align-items:center;gap:8px;background:#fff;border-radius:16px;padding:6px 6px 6px 16px;box-shadow:0 10px 28px rgba(0,0,0,0.18);position:relative;z-index:1}
        .hm-search i{color:#9BA4B5;font-size:14px;flex-shrink:0}
        .hm-search input{flex:1;border:none;outline:none;font-size:16px;font-family:inherit;color:#1A1A2E;background:transparent;min-width:0;padding:8px 0}
        .hm-search input::placeholder{color:#9BA4B5;font-size:14px}
        .hm-search button{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;border:none;border-radius:12px;padding:10px 16px;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;flex-shrink:0}
        .hm-hero-chips{display:flex;gap:8px;margin-top:14px;overflow-x:auto;scrollbar-width:none;position:relative;z-index:1}
        .hm-hero-chips::-webkit-scrollbar{display:none}
        .hm-hero-chips a{color:#fff;background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.22);border-radius:999px;padding:6px 13px;font-size:12px;font-weight:700;text-decoration:none;white-space:nowrap;flex-shrink:0}

        /* ── Section head ── */
        .hm-section-head{display:flex;align-items:center;justify-content:space-between;padding:20px 16px 12px}
        .hm-section-head h2{font-size:17px;font-weight:800;letter-spacing:-0.3px;color:var(--dark);margin:0}
        .hm-section-head a{color:var(--primary);font-size:12.5px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
        .hm-section-head a i{font-size:10px}

        /* ── Explore: icon tiles grid ── */
        .hm-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px 2px;padding:0 12px}
        .hm-tile{display:flex;flex-direction:column;align-items:center;gap:6px;text-decoration:none;padding:0;border-radius:14px;min-height:44px}
        .hm-tile-icon{width:50px;height:63px;border-radius:16px;display:flex;align-items:center;justify-content:center;padding:0;margin:0;font-size:27px;transition:transform .15s ease;overflow:hidden}
        .hm-tile:active .hm-tile-icon{transform:scale(0.92)}
        .hm-tile span{font-size:10.5px;font-weight:700;color:var(--dark);text-align:center;line-height:1.2}
        .hm-tile.purple .hm-tile-icon{background:rgba(var(--primary-rgb),0.12);color:var(--primary)}
        .hm-tile.teal .hm-tile-icon{background:rgba(0,206,201,0.13);color:#00A8A3}
        .hm-tile.amber .hm-tile-icon{background:rgba(253,203,110,0.22);color:#E17055}
        .hm-tile.pink .hm-tile-icon{background:rgba(232,67,147,0.11);color:#E84393}

        /* ── Explore: horizontal row (image cards or auto-sliding icons) ── */
        .hm-explore-row{display:flex;gap:10px;padding:0 16px 4px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .hm-explore-row::-webkit-scrollbar{display:none}
        .hm-exp-copy{display:flex;gap:10px;flex-shrink:0;align-items:flex-start}
        .hm-exp-card{flex-shrink:0;text-decoration:none;overflow:hidden;background:#fff;border:1px solid #EEEDF5;box-shadow:0 3px 12px rgba(13,27,42,0.06)}
        .hm-exp-card img{width:100%;object-fit:cover;display:block}
        .hm-exp-fallback{width:100%;display:flex;align-items:center;justify-content:center;font-size:30px}
        .hm-exp-fallback.purple{background:rgba(var(--primary-rgb),0.12);color:var(--primary)}
        .hm-exp-fallback.teal{background:rgba(0,206,201,0.13);color:#00A8A3}
        .hm-exp-fallback.amber{background:rgba(253,203,110,0.22);color:#E17055}
        .hm-exp-fallback.pink{background:rgba(232,67,147,0.11);color:#E84393}
        .hm-exp-label{padding:8px 6px;font-size:11.5px;font-weight:700;color:var(--dark);text-align:center;line-height:1.2}

        /* ── Constrain admin slider height/width regardless of image size ── */
        .slide{height:${sliderH}px;flex:0 0 ${sliderW ? `${sliderW}px` : '98%'};max-width:100%;background:transparent;box-shadow:none}
        .slide img{width:100%;height:100%;object-fit:cover}

        /* ── Featured categories ── */
        .hm-cats{display:flex;padding:0 16px 4px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .hm-cats::-webkit-scrollbar{display:none}
        .hm-cats-copy{display:flex;flex-shrink:0}
        .hm-cats-grid{display:grid;padding:0 16px 4px}
        .hm-cat{display:flex;flex-direction:column;align-items:center;gap:7px;text-decoration:none;flex-shrink:0;padding:4px 0}
        .hm-cat-icon{background:#fff;border:1px solid #EEEDF5;box-shadow:0 3px 12px rgba(13,27,42,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .hm-cat span{font-size:11px;font-weight:600;color:var(--dark);text-align:center;line-height:1.25;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .hm-cat-inside{flex-direction:column;gap:3px;padding:4px 3px;box-sizing:border-box}
        .hm-cat-more{background:rgba(var(--primary-rgb),0.10);border-color:rgba(var(--primary-rgb),0.18)}
        .hm-cat-lbl-in{font-size:10px;font-weight:700;color:var(--dark);text-align:center;line-height:1.15;max-width:100%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}

        /* ── Popular ── */
        .hm-pop-track{display:grid;grid-auto-flow:column;grid-auto-columns:max-content;gap:10px;padding:0 16px 4px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .hm-pop-track::-webkit-scrollbar{display:none}
        .hm-pop-card{position:relative;border-radius:16px;overflow:hidden;display:block;box-shadow:0 4px 14px rgba(13,27,42,0.10)}
        .hm-pop-card img{width:100%;aspect-ratio:3/2;object-fit:cover;display:block}
        .hm-pop-card .label{position:absolute;bottom:0;left:0;right:0;padding:18px 10px 8px;background:linear-gradient(transparent,rgba(0,0,0,0.72));color:#fff;font-size:12.5px;font-weight:700}

        /* ── Stats strip ── */
        .hm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:22px 16px 4px;background:linear-gradient(135deg,var(--primary),var(--secondary),var(--accent));border-radius:20px;padding:18px 10px;box-shadow:0 10px 30px rgba(var(--primary-rgb),0.28)}
        .hm-stat{text-align:center}
        .hm-stat-num{color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px}
        .hm-stat-lbl{color:rgba(255,255,255,.8);font-size:11px;font-weight:600;margin-top:2px}

        /* ── Collections slider ── */
        .hm-col-track{display:flex;gap:10px;padding:0 16px 10px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .hm-col-track::-webkit-scrollbar{display:none}
        .hm-col-card{position:relative;flex-shrink:0;width:150px;height:190px;border-radius:16px;overflow:hidden;cursor:pointer;box-shadow:0 4px 14px rgba(13,27,42,0.10);background:#DDE3F0;display:block;text-decoration:none}
        .hm-col-card img{width:100%;height:100%;object-fit:cover;display:block}
        .hm-col-noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9BA4B5;font-size:28px}
        .hm-col-overlay{position:absolute;bottom:0;left:0;right:0;padding:24px 10px 10px;background:linear-gradient(transparent,rgba(0,0,0,0.78))}
        .hm-col-name{color:#fff;font-size:13px;font-weight:700;line-height:1.25}
        .hm-col-biz{color:rgba(255,255,255,.85);font-size:10.5px;font-weight:600;margin-top:3px}
      `}</style>
    </>
  );
}
