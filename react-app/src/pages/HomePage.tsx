import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import api from '../api';

const SLIDER_FALLBACKS = [
  { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&fit=crop', title: 'Discover Dubai', sub: 'Find the best businesses near you', btn: 'Explore' },
  { img: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&fit=crop', title: 'Dubai Marina', sub: 'Premium classifieds & real estate', btn: 'Browse' },
  { img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&fit=crop', title: 'Career in UAE', sub: 'Thousands of jobs waiting for you', btn: 'Find Jobs' },
];

const SERVICES = [
  { to: '/categories',  icon: 'fa-store',          label: 'Businesses',  tone: 'purple' },
  { to: '/offers',      icon: 'fa-percent',        label: 'Offers',      tone: 'amber' },
  { to: '/events',      icon: 'fa-calendar-day',   label: 'Events',      tone: 'pink' },
  { to: '/jobs',        icon: 'fa-briefcase',      label: 'Jobs',        tone: 'teal' },
  { to: '/realestate',  icon: 'fa-building',       label: 'Real Estate', tone: 'teal' },
  { to: '/doctors',     icon: 'fa-user-md',        label: 'Doctors',     tone: 'pink' },
  { to: '/classifieds', icon: 'fa-tags',           label: 'Classifieds', tone: 'amber' },
  { to: '/universities',icon: 'fa-graduation-cap', label: 'Universities',tone: 'purple' },
  { to: '/profile',     icon: 'fa-file-alt',       label: 'Smart CV',    tone: 'purple' },
  { to: '/search',      icon: 'fa-search',         label: 'Search',      tone: 'teal' },
];

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

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: () => api.get('/home').then((r) => r.data),
  });

  if (isLoading) return <div className="loading">Loading…</div>;

  const sliders = data?.sliders?.length ? data.sliders : SLIDER_FALLBACKS;
  const sliderH: number = data?.sliderHeight || 650;
  const homeCats = data?.homeCategories || [];
  const popCats = data?.popularCategories || [];
  const stats = data?.stats || { businesses: 50, jobs: 30, classifieds: 100 };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search');
  };

  return (
    <>
      {/* ── Hero: brand + search ─────────────────────────────────────── */}
      <div className="hm-hero">
        <div className="hm-greet">{greeting()} 👋</div>
        <h1 className="hm-title">Find anything in <span>UAE</span></h1>
        <form className="hm-search" onSubmit={submitSearch}>
          <i className="fas fa-search"></i>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Businesses, offers, jobs, properties…" aria-label="Search" />
          <button type="submit">Search</button>
        </form>
        <div className="hm-hero-chips">
          <Link to="/businesses">Businesses</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/realestate">Properties</Link>
        </div>
      </div>

      {/* ── Services: primary navigation grid ────────────────────────── */}
      <div className="hm-section-head">
        <h2>Explore SmartUAE</h2>
      </div>
      <div className="hm-grid">
        {SERVICES.map((s) => (
          <Link key={s.to} to={s.to} className={`hm-tile ${s.tone}`}>
            <div className="hm-tile-icon"><i className={`fas ${s.icon}`}></i></div>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Admin promo slider (height now constrained) ──────────────── */}
      <Slider slides={sliders} />

      {/* ── Featured categories: horizontal scroll ───────────────────── */}
      {homeCats.length > 0 && (
        <>
          <div className="hm-section-head">
            <h2>Featured Categories</h2>
            <Link to="/categories">See all <i className="fas fa-chevron-right"></i></Link>
          </div>
          <div className="hm-cats">
            {homeCats.map((cat: any) => (
              <Link key={cat.id} to={`/businesses?cat=${cat.category_id}`} className="hm-cat">
                <div className="hm-cat-icon">{cat.icon}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ── Popular categories: image cards ──────────────────────────── */}
      <div className="hm-section-head">
        <h2>Popular Right Now</h2>
        <Link to="/categories">See all <i className="fas fa-chevron-right"></i></Link>
      </div>
      <div className="popular-cats">
        {(popCats.length ? popCats : [
          { id: 0, name: 'City Tours', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=267&fit=crop' },
          { id: 0, name: 'Restaurants', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=267&fit=crop' },
          { id: 0, name: 'Real Estate', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=267&fit=crop' },
          { id: 0, name: 'Car Rental', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=267&fit=crop' },
        ]).slice(0, 4).map((pc: any, i: number) => (
          <Link key={i} to={pc.id ? `/businesses?cat=${pc.id}` : '/businesses'} className="pop-cat-card">
            <img src={pc.imageUrl} alt={pc.name} loading="lazy" decoding="async" width="400" height="267"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${i % 2 ? '1555396273-367ea4eb4db5' : '1512453979798-5ea266f8880c'}?w=400&h=267&fit=crop`; }} />
            <div className="label">{pc.name}</div>
          </Link>
        ))}
      </div>

      {/* ── Stats: social proof ───────────────────────────────────────── */}
      <div className="hm-stats">
        <div className="hm-stat"><div className="hm-stat-num">{stats.businesses}+</div><div className="hm-stat-lbl">Businesses</div></div>
        <div className="hm-stat"><div className="hm-stat-num">{stats.jobs}+</div><div className="hm-stat-lbl">Active Jobs</div></div>
        <div className="hm-stat"><div className="hm-stat-num">{stats.classifieds}+</div><div className="hm-stat-lbl">Listings</div></div>
      </div>

      {/* ── Explore gallery ───────────────────────────────────────────── */}
      <div className="hm-section-head">
        <h2>Explore the best in UAE</h2>
      </div>
      <div className="gallery-row" style={{ marginBottom: 90 }}>
        {[
          ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', 'Dubai Skyline'],
          ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop', 'Burj Khalifa'],
          ['https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&h=300&fit=crop', 'Abu Dhabi'],
          ['https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=300&fit=crop', 'Dubai Marina'],
          ['https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=400&h=300&fit=crop', 'Palm Jumeirah'],
        ].map(([src, label]) => (
          <div key={label} className="gallery-item">
            <img src={src} alt={label} loading="lazy" decoding="async" width="400" height="300" />
            <div className="gallery-overlay">{label}</div>
          </div>
        ))}
      </div>

      <style>{`
        /* ── Hero ── */
        .hm-hero{background:linear-gradient(150deg,var(--primary) 0%,var(--primary-dark) 55%,#3E3277 100%);padding:26px 16px 22px;border-radius:0 0 26px 26px;position:relative;overflow:hidden}
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

        /* ── Services grid ── */
        .hm-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px 2px;padding:0 12px}
        .hm-tile{display:flex;flex-direction:column;align-items:center;gap:6px;text-decoration:none;padding:8px 2px;border-radius:14px;min-height:44px}
        .hm-tile-icon{width:50px;height:50px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:18px;transition:transform .15s ease}
        .hm-tile:active .hm-tile-icon{transform:scale(0.92)}
        .hm-tile span{font-size:10.5px;font-weight:700;color:var(--dark);text-align:center;line-height:1.2}
        .hm-tile.purple .hm-tile-icon{background:rgba(108,92,231,0.12);color:var(--primary)}
        .hm-tile.teal .hm-tile-icon{background:rgba(0,206,201,0.13);color:#00A8A3}
        .hm-tile.amber .hm-tile-icon{background:rgba(253,203,110,0.22);color:#E17055}
        .hm-tile.pink .hm-tile-icon{background:rgba(232,67,147,0.11);color:#E84393}

        /* ── Constrain admin slider height regardless of image size ── */
        .slide{height:${sliderH}px}
        .slide img{width:100%;height:100%;object-fit:cover}

        /* ── Featured categories: horizontal snap row ── */
        .hm-cats{display:flex;gap:10px;padding:0 16px 4px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .hm-cats::-webkit-scrollbar{display:none}
        .hm-cat{display:flex;flex-direction:column;align-items:center;gap:7px;text-decoration:none;flex-shrink:0;width:74px;padding:4px 0}
        .hm-cat-icon{width:60px;height:60px;border-radius:20px;background:#fff;border:1px solid #EEEDF5;box-shadow:0 3px 12px rgba(13,27,42,0.06);display:flex;align-items:center;justify-content:center;font-size:26px}
        .hm-cat span{font-size:11px;font-weight:600;color:var(--dark);text-align:center;line-height:1.25;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}

        /* ── Stats strip ── */
        .hm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:22px 16px 4px;background:linear-gradient(135deg,var(--primary),#8B5CF6,var(--accent));border-radius:20px;padding:18px 10px;box-shadow:0 10px 30px rgba(108,92,231,0.28)}
        .hm-stat{text-align:center}
        .hm-stat-num{color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px}
        .hm-stat-lbl{color:rgba(255,255,255,.8);font-size:11px;font-weight:600;margin-top:2px}
      `}</style>
    </>
  );
}
