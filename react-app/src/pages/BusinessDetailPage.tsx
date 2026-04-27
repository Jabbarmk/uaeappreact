import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api';

function renderStars(r: number) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= r) return <i key={i} className="fas fa-star"></i>;
    if (i + 0.5 <= r) return <i key={i} className="fas fa-star-half-alt"></i>;
    return <i key={i} className="far fa-star"></i>;
  });
}


const GALLERY_FALLBACKS = [
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop', caption: 'Ambiance' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', caption: 'Dining' },
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop', caption: 'Interior' },
  { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', caption: 'Facilities' },
  { src: 'https://images.unsplash.com/photo-1562243061-204550d8a2c9?w=400&h=400&fit=crop', caption: 'Services' },
  { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop', caption: 'Location' },
];

const SVC_FALLBACKS = [
  { icon: '🏗️', title: 'Consultation', description: 'Expert consultation tailored to your specific needs.' },
  { icon: '🔧', title: 'Installation', description: 'Professional setup by certified technicians.' },
  { icon: '🛡️', title: 'Maintenance', description: 'Regular support to keep everything running smoothly.' },
  { icon: '📋', title: 'Project Planning', description: 'End-to-end planning and project management.' },
];

const CLIENT_GRADS = [
  'linear-gradient(135deg,#6C5CE7,#a29bfe)',
  'linear-gradient(135deg,#00CEC9,#00b5b0)',
  'linear-gradient(135deg,#E17055,#d35400)',
  'linear-gradient(135deg,#0984e3,#74b9ff)',
];

const REV_FALLBACKS = [
  { client_name: 'Ahmed Al Rashid', client_company: 'Tech Solutions LLC', rating: 5, review: 'Exceptional service and professionalism.', avatar: 'A' },
  { client_name: 'Sara Mohammed', client_company: 'Dubai Ventures', rating: 5, review: 'Outstanding experience from start to finish.', avatar: 'S' },
];

function Lightbox({ imgs, cur, onClose, onNav }: { imgs: any[]; cur: number; onClose: () => void; onNav: (d: number) => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNav]);
  const img = imgs[cur];
  return (
    <div id="bd-lb" className="open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lb-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
      <div className="lb-cnt">{cur + 1} / {imgs.length}</div>
      <div className="lb-img-box"><img id="lbImg" src={img?.src || img} alt="" /></div>
      <button className="lb-nav-btn lb-prev" onClick={() => onNav(-1)}><i className="fas fa-chevron-left"></i></button>
      <button className="lb-nav-btn lb-next" onClick={() => onNav(1)}><i className="fas fa-chevron-right"></i></button>
      <div className="lb-cap">{img?.caption || ''}</div>
    </div>
  );
}

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lbOpen, setLbOpen] = useState(false);
  const [lbCur, setLbCur] = useState(0);
  const [lbImgs, setLbImgs] = useState<any[]>([]);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [svcExpanded, setSvcExpanded] = useState(false);
  const [galExpanded, setGalExpanded] = useState(false);
  const [revExpanded, setRevExpanded] = useState(false);
  const [sliderCur, setSliderCur] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => api.get(`/businesses/${id}`).then((r) => r.data),
  });

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${sliderCur * 100}%)`;
    }
  }, [sliderCur]);

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.business) return <div style={{ padding: 40 }}>Business not found. <Link to="/businesses">Back</Link></div>;

  const { business: biz, gallery, services, testimonials, clients } = data;
  const avgRating = biz.rating > 0 ? Number(biz.rating) : 4.5;

  const sliderImgs = gallery.length > 0
    ? gallery
    : [{ src: biz.imageUrl, caption: biz.name }, ...GALLERY_FALLBACKS.slice(0, 3)];
  const galleryItems = gallery.length > 0 ? gallery : GALLERY_FALLBACKS;
  const svcList = services.length > 0 ? services : SVC_FALLBACKS;
  const revList = testimonials.length > 0 ? testimonials : REV_FALLBACKS;
  const clientList = clients.length > 0 ? clients : [
    { name: 'Emaar Properties' }, { name: 'Dubai Holdings' }, { name: 'Majid Al Futtaim' },
    { name: 'Al Futtaim Group' }, { name: 'ADNOC Group' }, { name: 'Emirates Group' },
  ];
  const totalSlides = sliderImgs.length;

  const aboutText = biz.about || biz.description || `Welcome to ${biz.name}. We are committed to providing exceptional quality and service to our valued customers across the UAE.`;

  function openLB(i: number, imgs: any[]) { setLbImgs(imgs); setLbCur(i); setLbOpen(true); document.body.style.overflow = 'hidden'; }
  function closeLB() { setLbOpen(false); document.body.style.overflow = ''; }
  function lbNav(d: number) { setLbCur((c) => (c + d + lbImgs.length) % lbImgs.length); }

  const waLink = biz.whatsapp ? `https://wa.me/${biz.whatsapp.replace(/\D/g, '')}` : null;

  return (
    <>
      {lbOpen && <Lightbox imgs={lbImgs} cur={lbCur} onClose={closeLB} onNav={lbNav} />}

      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 style={{ fontSize: 14, maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{biz.name}</h1>
        <button onClick={() => { if (navigator.share) navigator.share({ title: biz.name, url: window.location.href }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--dark)', padding: 8 }}>
          <i className="fas fa-share-alt"></i>
        </button>
      </div>

      <div className="bd-slider-wrap" onClick={() => openLB(sliderCur, sliderImgs)}>
        <div className="bd-slider-track" ref={sliderRef}>
          {sliderImgs.map((img: any, i: number) => (
            <div className="bd-slide" key={i}>
              <img src={img.src} alt={img.caption || ''} loading={i === 0 ? undefined : 'lazy'} decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = GALLERY_FALLBACKS[i % GALLERY_FALLBACKS.length].src; }} />
              <div className="bd-slide-overlay"></div>
              {img.caption && <div className="bd-slide-caption">{img.caption}</div>}
            </div>
          ))}
        </div>
        <div className="bd-slide-counter">{sliderCur + 1} / {totalSlides}</div>
        <div className="bd-zoom-hint"><i className="fas fa-search-plus"></i> Tap to zoom</div>
        <div className="bd-slider-dots">
          {sliderImgs.map((_: any, i: number) => (
            <div key={i} className={`dot${i === sliderCur ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setSliderCur(i); }} data-i={i} />
          ))}
        </div>
      </div>

      <div className="bd-header">
        <div className="bd-logo-row">
          <div className="bd-logo">
            {biz.logoUrl && biz.logo ? <img src={biz.logoUrl} alt="Logo" /> : biz.name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="bd-name">{biz.name}</div>
            {biz.category_name && <div className="bd-cat-label"><i className="fas fa-tag"></i> {biz.category_name}</div>}
            {biz.tagline && <div className="bd-tagline">"{biz.tagline}"</div>}
          </div>
        </div>
        <div className="bd-meta-row">
          {biz.rating > 0 && <div className="bd-rating-badge">{renderStars(avgRating)} <strong>{avgRating.toFixed(1)}</strong></div>}
          {biz.distance && <div className="bd-distance"><i className="fas fa-location-arrow"></i> {biz.distance}</div>}
          <span className="bd-badge verified"><i className="fas fa-check-circle"></i> Verified</span>
          <span className="bd-badge open"><i className="fas fa-circle" style={{ fontSize: 7 }}></i> Open</span>
        </div>
        {biz.address && <div className="bd-address-row"><i className="fas fa-map-marker-alt"></i> {biz.address}</div>}
      </div>

      <div className="bd-actions">
        {biz.phone && <a href={`tel:${biz.phone}`} className="bd-action call"><div className="bd-action-icon"><i className="fas fa-phone"></i></div><span>Call</span></a>}
        {waLink && <a href={waLink} target="_blank" rel="noreferrer" className="bd-action wa"><div className="bd-action-icon"><i className="fab fa-whatsapp"></i></div><span>WhatsApp</span></a>}
        {biz.website && <a href={biz.website} target="_blank" rel="noreferrer" className="bd-action web"><div className="bd-action-icon"><i className="fas fa-globe"></i></div><span>Website</span></a>}
        {biz.email && <a href={`mailto:${biz.email}`} className="bd-action email"><div className="bd-action-icon"><i className="fas fa-envelope"></i></div><span>Email</span></a>}
        <a href={`https://maps.google.com/?q=${encodeURIComponent(biz.address || biz.name + ' UAE')}`} target="_blank" rel="noreferrer" className="bd-action map"><div className="bd-action-icon"><i className="fas fa-directions"></i></div><span>Directions</span></a>
      </div>

      <div className="bs-divider"></div>
      <div className="bs-page-wrap">

        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">About Us</span></div>
          <div className={`bs-about-text${aboutExpanded ? ' show' : ''}`}>{aboutText.split('\n').map((l: string, i: number) => <span key={i}>{l}<br /></span>)}</div>
          <button className="bs-rm-btn" onClick={() => setAboutExpanded(!aboutExpanded)}>
            {aboutExpanded ? 'Read Less ' : 'Read More '}<i className={`fas fa-chevron-${aboutExpanded ? 'up' : 'down'}`}></i>
          </button>
        </div>

        <div className="bs-stats-row">
          <div className="bs-stat"><div className="bs-stat-num">{avgRating.toFixed(1)}</div><div className="bs-stat-lbl">Rating</div></div>
          <div className="bs-stat"><div className="bs-stat-num">{biz.established_year || new Date().getFullYear() - 5}</div><div className="bs-stat-lbl">Est. Year</div></div>
          <div className="bs-stat"><div className="bs-stat-num">{biz.employees || '50+'}</div><div className="bs-stat-lbl">Team Size</div></div>
          <div className="bs-stat"><div className="bs-stat-num">{revList.length}+</div><div className="bs-stat-lbl">Reviews</div></div>
        </div>

        <div className="bs-tags">
          <span className="bs-tag">{biz.category_name || 'Business'}</span>
          <span className="bs-tag">UAE</span>
          <span className="bs-tag"><i className="fas fa-check-circle"></i> Verified</span>
          <span className="bs-tag">Top Rated</span>
        </div>

        <div className="bs-divider"></div>

        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">Services &amp; Solutions</span><span style={{ fontSize: 11, color: 'var(--text-light)' }}>{svcList.length} offerings</span></div>
          <div className="bs-svc-grid">
            {svcList.map((svc: any, i: number) => (
              <div className={`bs-svc-card${i >= 4 && !svcExpanded ? ' bs-hidden' : ''}`} key={i}>
                {svc.image ? <img src={svc.imageUrl || svc.image} alt="" className="bs-svc-img" /> : <div className="bs-svc-icon">{svc.icon || '⚙️'}</div>}
                <div className="bs-svc-title">{svc.title}</div>
                {(svc.description || svc.desc) && <div className="bs-svc-desc">{svc.description || svc.desc}</div>}
              </div>
            ))}
          </div>
          {svcList.length > 4 && !svcExpanded && (
            <button className="bs-expand-btn" onClick={() => setSvcExpanded(true)}>View All {svcList.length} Services <i className="fas fa-chevron-down"></i></button>
          )}
        </div>

        <div className="bs-divider"></div>

        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">Gallery</span></div>
          <div className="bs-gal-grid">
            {galleryItems.map((img: any, i: number) => (
              <div className={`bs-gal-item${i >= 6 && !galExpanded ? ' bs-hidden' : ''}`} key={i} onClick={() => openLB(i, galleryItems)}>
                <img src={img.src} alt={img.caption || ''} loading="lazy" decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).src = GALLERY_FALLBACKS[i % GALLERY_FALLBACKS.length].src; }} />
                <div className="bs-gal-zoom"><i className="fas fa-search-plus"></i></div>
              </div>
            ))}
          </div>
          {galleryItems.length > 6 && !galExpanded && (
            <button className="bs-expand-btn" onClick={() => setGalExpanded(true)}>View All {galleryItems.length} Photos <i className="fas fa-chevron-down"></i></button>
          )}
        </div>

        <div className="bs-divider"></div>

        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">Clients &amp; Partners</span></div>
          <div className="bs-clients-scroll">
            {clientList.map((c: any, ci: number) => (
              <div className="bs-client-item" key={ci}>
                {c.logo ? (
                  <img src={c.logoUrl || c.logo} alt={c.name} className="bs-client-logo" />
                ) : (
                  <div className="bs-client-avatar" style={{ background: CLIENT_GRADS[ci % CLIENT_GRADS.length] }}>{c.name[0].toUpperCase()}</div>
                )}
                <div className="bs-client-name">{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bs-divider"></div>

        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">What Clients Say</span></div>
          <div className="bs-review-summary">
            <div className="bs-rev-avg">
              <div className="big-num">{avgRating.toFixed(1)}</div>
              <div className="stars">{renderStars(avgRating)}</div>
              <div className="cnt">{revList.length} reviews</div>
            </div>
            <div style={{ flex: 1 }}>
              {([[5, 72], [4, 18], [3, 6], [2, 3], [1, 1]] as [number, number][]).map(([s, pct]) => (
                <div className="bs-bar-row" key={s}>
                  <span className="n">{s}</span>
                  <div className="bs-bar-track"><div className="bs-bar-fill" style={{ width: `${pct}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
          {revList.map((rev: any, ri: number) => {
            const name = rev.client_name || rev.name || 'Customer';
            const co = rev.client_company || rev.company || '';
            const rating = Number(rev.rating || 5);
            const text = rev.review || '';
            const avatar = rev.avatar || name[0].toUpperCase();
            return (
              <div className={`bs-review-card${ri >= 2 && !revExpanded ? ' bs-hidden' : ''}`} key={ri}>
                <div className="bs-rev-head">
                  <div className="bs-rev-avatar">{rev.client_photo ? <img src={rev.client_photo} alt="" /> : avatar}</div>
                  <div>
                    <div className="bs-rev-name">{name}</div>
                    {co && <div className="bs-rev-co">{co}</div>}
                  </div>
                </div>
                <div className="bs-rev-stars">{renderStars(rating)}</div>
                <div className="bs-rev-text">{text}</div>
              </div>
            );
          })}
          {revList.length > 2 && !revExpanded && (
            <button className="bs-expand-btn" onClick={() => setRevExpanded(true)}>Read All {revList.length} Reviews <i className="fas fa-chevron-down"></i></button>
          )}
        </div>

        <div className="bs-divider"></div>

        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">Contact &amp; Location</span></div>
          {biz.phone && (
            <a href={`tel:${biz.phone}`} className="bs-contact-item">
              <div className="bs-contact-icon call"><i className="fas fa-phone"></i></div>
              <div><div className="bs-contact-lbl">Phone</div><div className="bs-contact-val">{biz.phone}</div></div>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 12 }}></i>
            </a>
          )}
          {biz.whatsapp && (
            <a href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bs-contact-item">
              <div className="bs-contact-icon wa"><i className="fab fa-whatsapp"></i></div>
              <div><div className="bs-contact-lbl">WhatsApp</div><div className="bs-contact-val">{biz.whatsapp}</div></div>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 12 }}></i>
            </a>
          )}
          {biz.email && (
            <a href={`mailto:${biz.email}`} className="bs-contact-item">
              <div className="bs-contact-icon mail"><i className="fas fa-envelope"></i></div>
              <div><div className="bs-contact-lbl">Email</div><div className="bs-contact-val">{biz.email}</div></div>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 12 }}></i>
            </a>
          )}
          {biz.website && (
            <a href={biz.website} target="_blank" rel="noreferrer" className="bs-contact-item">
              <div className="bs-contact-icon web"><i className="fas fa-globe"></i></div>
              <div><div className="bs-contact-lbl">Website</div><div className="bs-contact-val">{biz.website}</div></div>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 12 }}></i>
            </a>
          )}
          {biz.map_embed ? (
            <iframe src={biz.map_embed} className="bs-map-embed" loading="lazy" title="Map"></iframe>
          ) : (
            <a href={`https://maps.google.com/?q=${encodeURIComponent(biz.address || biz.name + ' UAE')}`} target="_blank" rel="noreferrer" className="bs-map-btn">
              <div className="map-ic-box"><i className="fas fa-map-marker-alt"></i></div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Location</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginTop: 2 }}>{biz.address || 'Open in Google Maps'}</div>
              </div>
              <i className="fas fa-external-link-alt" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 12 }}></i>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
