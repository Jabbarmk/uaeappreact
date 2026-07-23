import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api';
import CourseThumb from '../components/CourseThumb';
import { fmtFee, fmtDate } from '../constants/education';
import DoctorCard from '../components/DoctorCard';
import DoctorPopup from '../components/DoctorPopup';

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

function formatCount(n: unknown): string {
  const v = Number(n) || 0;
  if (v >= 1e6) return (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(v >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(v);
}

const TIER_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  Gold: { bg: '#FFF4D6', color: '#C98A00', icon: '🥇' },
  Platinum: { bg: '#EDE7F6', color: '#6A3FB5', icon: '🏆' },
  Silver: { bg: '#ECEFF1', color: '#607D8B', icon: '🥈' },
  Bronze: { bg: '#F4E3D3', color: '#A1662F', icon: '🥉' },
};

function CreatorStats({ v }: { v: any }) {
  const tier = TIER_STYLE[v.tier] || null;
  const awards = String(v.awards || '').split(',').map((s) => s.trim()).filter(Boolean);
  const stats = [
    { icon: 'fab fa-youtube', color: '#FF0000', label: 'YouTube', value: formatCount(v.youtube_subscribers) },
    { icon: 'fab fa-instagram', color: '#E1306C', label: 'Instagram', value: formatCount(v.instagram_followers) },
    { icon: 'fab fa-tiktok', color: '#010101', label: 'TikTok', value: formatCount(v.tiktok_followers) },
    { icon: 'fas fa-eye', color: '#6C5CE7', label: 'Total Views', value: formatCount(v.total_views) },
  ];
  return (
    <div className="bs-section">
      <div className="bs-sh"><span className="bs-title">Creator Stats</span>{v.content_niche && <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{v.content_niche}</span>}</div>
      {(tier || v.is_verified) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {tier && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, background: tier.bg, color: tier.color, padding: '6px 13px', borderRadius: 50 }}>{tier.icon} {v.tier} Creator</span>}
          {Number(v.is_verified) === 1 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, background: '#E3F2FD', color: '#1565C0', padding: '6px 13px', borderRadius: 50 }}><i className="fas fa-check-circle"></i> Verified</span>}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #EEF0F6', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${s.color}14`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}><i className={s.icon}></i></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      {awards.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>🏅 Awards &amp; Recognition</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {awards.map((a, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 600, color: '#B7770D', background: 'linear-gradient(135deg,rgba(253,203,110,.22),rgba(243,156,18,.12))', border: '1px solid rgba(243,156,18,.25)', borderRadius: 20, padding: '6px 12px' }}>{a}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CoursePopup({ course: c, biz, onClose }: { course: any; biz: any; onClose: () => void }) {
  const waLink = biz.whatsapp ? `https://wa.me/${String(biz.whatsapp).replace(/\D/g, '')}` : null;
  const rows: [string, unknown][] = [
    ['Study Level', c.level_name],
    ['Category', c.category_name],
    ['Specialisation', c.specialisation],
    ['Duration', c.duration],
    ['Study Mode', c.study_mode],
    ['Delivery', c.delivery],
    ['Location', c.location || c.emirate],
    ['Intake', c.intake],
    ['Eligibility', c.eligibility],
    ['Application Deadline', c.application_deadline ? fmtDate(c.application_deadline) : null],
    ['Accreditation', c.accreditation],
    ['Scholarships', c.scholarships],
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,16,34,.55)', zIndex: 900, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 14px', overflowY: 'auto', backdropFilter: 'blur(2px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,.3)' }}>
        <div style={{ position: 'relative' }}>
          <CourseThumb url={c.imageUrl} icon={c.category_icon} w="100%" h={170} radius={0} />
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,.45)', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', backdropFilter: 'blur(4px)' }}>×</button>
        </div>
        <div style={{ padding: '16px 18px 20px' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'rgba(108,92,231,.1)', padding: '3px 10px', borderRadius: 50 }}>{c.level_icon} {c.level_name}</span>
            {c.category_name && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: '#F2F3F7', padding: '3px 10px', borderRadius: 50 }}>{c.category_icon} {c.category_name}</span>}
          </div>
          <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--dark)', lineHeight: 1.25 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{biz.name}</div>

          <div style={{ display: 'flex', gap: 10, margin: '14px 0' }}>
            <div style={{ flex: 1, background: '#F7F8FC', borderRadius: 12, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>PER YEAR</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>{fmtFee(c.fee_per_year, c.currency)}</div>
            </div>
            <div style={{ flex: 1, background: '#F7F8FC', borderRadius: 12, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>{fmtFee(c.total_fee, c.currency)}</div>
            </div>
          </div>

          <div style={{ border: '1px solid #EEF0F6', borderRadius: 12, overflow: 'hidden' }}>
            {rows.filter(([, v]) => v).map(([label, value], i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 13px', fontSize: 13, background: i % 2 ? '#FAFBFD' : '#fff' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ color: 'var(--dark)', fontWeight: 600, textAlign: 'right' }}>{String(value)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <a href={biz.website || '#'} target="_blank" rel="noreferrer" style={{ flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, background: 'var(--primary)', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              <i className="fas fa-paper-plane"></i> Apply
            </a>
            {waLink && <a href={waLink} target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: 'linear-gradient(135deg,#00B894,#00CEC9)', color: '#fff', borderRadius: 12, fontSize: 16, textDecoration: 'none' }}><i className="fab fa-whatsapp"></i></a>}
            {biz.phone && <a href={`tel:${biz.phone}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: '#fff', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: 12, fontSize: 15, textDecoration: 'none' }}><i className="fas fa-phone"></i></a>}
          </div>
        </div>
      </div>
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

  const [coursePopup, setCoursePopup] = useState<any>(null);
  const [doctorPopup, setDoctorPopup] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => api.get(`/businesses/${id}`).then((r) => r.data),
  });

  // If this business is a university, this resolves; otherwise it 404s (ignored).
  const { data: uniData } = useQuery({
    queryKey: ['business-university', id],
    queryFn: () => api.get(`/universities/${id}`).then((r) => r.data),
    retry: false,
  });
  const uniCourses: any[] = (uniData?.levelGroups || []).flatMap((g: any) => g.items);

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
    <div className="biz-detail-v2">
      {lbOpen && <Lightbox imgs={lbImgs} cur={lbCur} onClose={closeLB} onNav={lbNav} />}
      {coursePopup && <CoursePopup course={coursePopup} biz={biz} onClose={() => setCoursePopup(null)} />}
      {doctorPopup && <DoctorPopup doctor={doctorPopup} onClose={() => setDoctorPopup(null)} />}

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

        {data.vlogger && <CreatorStats v={data.vlogger} />}

        {(data.doctors || []).length > 0 && (
          <div className="bs-section">
            <div className="bs-sh"><span className="bs-title">Doctors</span><span style={{ fontSize: 11, color: 'var(--text-light)' }}>{data.doctors.length} doctors</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.doctors.map((d: any) => <DoctorCard key={d.id} d={d} onOpen={setDoctorPopup} showHospital={false} />)}
            </div>
          </div>
        )}

        {uniCourses.length > 0 && (
          <div className="bs-section">
            <div className="bs-sh"><span className="bs-title">Courses</span><span style={{ fontSize: 11, color: 'var(--text-light)' }}>{uniCourses.length} courses</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {uniCourses.map((c: any) => (
                <button key={c.id} onClick={() => setCoursePopup(c)}
                  style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', textAlign: 'left', background: '#fff', border: '1px solid #EEF0F6', borderRadius: 14, padding: '10px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <CourseThumb url={c.imageUrl} icon={c.category_icon} w={54} h={54} radius={11} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{c.level_icon} {c.level_name}{c.duration ? ` · ${c.duration}` : ''}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginTop: 3 }}>{fmtFee(c.fee_per_year, c.currency)}<small style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>/yr</small></div>
                  </div>
                  <span style={{ color: 'var(--primary)', fontSize: 18, flexShrink: 0 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
    </div>
  );
}
