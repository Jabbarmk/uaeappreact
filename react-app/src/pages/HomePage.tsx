import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import api from '../api';

const SLIDER_FALLBACKS = [
  { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&fit=crop', title: 'Discover Dubai', sub: 'Find the best businesses near you', btn: 'Explore' },
  { img: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&fit=crop', title: 'Dubai Marina', sub: 'Premium classifieds & real estate', btn: 'Browse' },
  { img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&fit=crop', title: 'Career in UAE', sub: 'Thousands of jobs waiting for you', btn: 'Find Jobs' },
];

const CLS_FALLBACKS = [
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop',
];

function Slider({ slides }: { slides: any[] }) {
  const [cur, setCur] = useState(0);
  const total = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCur((c) => (c + 1) % total), 4000);
    return () => clearInterval(timer);
  }, [total]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${cur * 100}%)`;
    }
  }, [cur]);

  return (
    <div className="slider-container">
      <div className="slider-track" ref={trackRef}>
        {slides.map((slide, i) => (
          <div className="slide" key={i}>
            <img src={slide.imageUrl || slide.img} alt={slide.title || slide.title}
              loading={i === 0 ? undefined : 'lazy'} decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).src = SLIDER_FALLBACKS[i % SLIDER_FALLBACKS.length].img; }} />
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle || slide.sub}</p>
              {(slide.button_text || slide.btn) && (
                <Link
                  to={
                    slide.button_link && slide.button_link !== '#'
                      ? slide.button_link
                      : slide.business_id
                        ? `/businesses/${slide.business_id}`
                        : '/categories'
                  }
                  className="slide-btn">
                  {slide.button_text || slide.btn}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {slides.map((_, i) => (
          <div key={i} className={`dot${i === cur ? ' active' : ''}`} onClick={() => setCur(i)} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: () => api.get('/home').then((r) => r.data),
  });

  if (isLoading) return <div className="loading">Loading…</div>;

  const sliders = data?.sliders?.length ? data.sliders : SLIDER_FALLBACKS;
  const mainCats = data?.mainCategories || [];
  const popCats = data?.popularCategories || [];
  const sections = data?.sections || [];
  const stats = data?.stats || { businesses: 50, jobs: 30, classifieds: 100 };

  return (
    <>
      <Slider slides={sliders} />

      <div className="section-header">
        <h2>Categories</h2>
        <Link to="/categories">See all</Link>
      </div>
      <div className="category-icons">
        {mainCats.map((cat: any) => (
          <Link key={cat.id} to={`/categories?cat=${cat.id}`} className="cat-icon-item">
            <div className="icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </Link>
        ))}
        <Link to="/categories" className="cat-icon-item">
          <div className="icon">📋</div>
          <span>All</span>
        </Link>
      </div>

      <div className="section-header"><h2>Our Services</h2></div>
      <div className="feature-grid">
        <Link to="/categories" className="feature-card purple">
          <div className="feature-icon"><i className="fas fa-store"></i></div>
          <h4>Business Directory</h4>
          <p>Find local shops and services</p>
        </Link>
        <Link to="/classifieds" className="feature-card teal">
          <div className="feature-icon"><i className="fas fa-tags"></i></div>
          <h4>Classifieds</h4>
          <p>Buy and sell used items</p>
        </Link>
        <Link to="/jobs" className="feature-card pink">
          <div className="feature-icon"><i className="fas fa-briefcase"></i></div>
          <h4>Job Portal</h4>
          <p>Find your dream career</p>
        </Link>
        <Link to="/profile" className="feature-card amber">
          <div className="feature-icon"><i className="fas fa-file-alt"></i></div>
          <h4>Smart CV</h4>
          <p>Build your professional profile</p>
        </Link>
      </div>

      <div className="section-header"><h2>Popular Categories</h2></div>
      <div className="popular-cats">
        {(popCats.length ? popCats : [
          { id: 0, name: 'City Tours', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=267&fit=crop' },
          { id: 0, name: 'Restaurants', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=267&fit=crop' },
          { id: 0, name: 'Real Estate', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=267&fit=crop' },
          { id: 0, name: 'Car Rental', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=267&fit=crop' },
        ]).map((pc: any, i: number) => (
          <Link key={i} to={pc.id ? `/businesses?cat=${pc.id}` : '/businesses'} className="pop-cat-card">
            <img src={pc.imageUrl} alt={pc.name} loading="lazy" decoding="async" width="400" height="267" />
            <div className="label">{pc.name}</div>
          </Link>
        ))}
      </div>

      <div className="promo-card">
        <div className="promo-text">
          <h3>Post Your Ad Free!</h3>
          <p>Reach thousands of buyers in UAE instantly</p>
        </div>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=160&h=160&fit=crop"
          alt="Post Ad" className="promo-img" loading="lazy" decoding="async" width="160" height="160" />
      </div>

      <div className="hero-banner">
        <h2>Discover the Best in UAE</h2>
        <p>Businesses · Jobs · Classifieds – all in one place</p>
        <Link to="/categories" className="hero-btn">Explore Now</Link>
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=240&h=160&fit=crop"
          alt="Dubai" className="hero-img"
          style={{ borderRadius: 14, objectFit: 'cover', width: 130, height: 100 }}
          loading="lazy" decoding="async" />
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
                <img src={item.imageUrl} alt={item.title} className="card-img"
                  loading="lazy" decoding="async"
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

      <div className="section-header"><h2>Explore UAE</h2></div>
      <div className="gallery-row">
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

      <div className="stats-banner">
        <div className="stat-item"><div className="stat-num">{stats.businesses}+</div><div className="stat-label">Businesses</div></div>
        <div className="stat-item"><div className="stat-num">{stats.jobs}+</div><div className="stat-label">Active Jobs</div></div>
        <div className="stat-item"><div className="stat-num">{stats.classifieds}+</div><div className="stat-label">Listings</div></div>
      </div>
    </>
  );
}
