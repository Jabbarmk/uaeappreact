import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { bizThemeStyle } from '../bizTheme';
import { useCart } from '../cart';
import CartDrawer from '../components/CartDrawer';
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
  'linear-gradient(135deg,var(--primary),var(--primary-light))',
  'linear-gradient(135deg,#00CEC9,#00b5b0)',
  'linear-gradient(135deg,#E17055,#d35400)',
  'linear-gradient(135deg,#0984e3,#74b9ff)',
];

// Star picker + text form for submitting/updating the signed-in user's review.
function ReviewForm({ bizId, existing, onClose, onSaved }: { bizId: string; existing: any | null; onClose: () => void; onSaved: () => void }) {
  const [rating, setRating] = useState(Number(existing?.rating) || 5);
  const [text, setText] = useState(existing?.review || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!text.trim()) { setErr('Please write your review'); return; }
    setBusy(true); setErr('');
    try {
      await api.post(`/businesses/${bizId}/reviews`, { rating, review: text.trim() });
      onSaved();
    } catch { setErr('Could not submit — try again'); setBusy(false); }
  };
  const remove = async () => {
    if (!window.confirm('Delete your review?')) return;
    setBusy(true);
    try { await api.delete(`/businesses/${bizId}/reviews`); onSaved(); } catch { setBusy(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,30,0.55)', zIndex: 950, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '22px 22px 0 0', width: '100%', maxWidth: 480, padding: '10px 20px 26px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 42, height: 5, borderRadius: 3, background: '#D9DEE9', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--dark)', marginBottom: 12 }}>{existing ? 'Edit Your Review' : 'Write a Review'}</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 30, color: s <= rating ? '#F5A623' : '#D9DEE9', padding: 0 }}>★</button>
          ))}
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Share your experience…"
          style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E3E7F0', borderRadius: 14, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }} />
        {err && <div style={{ fontSize: 12.5, color: '#C42B1C', marginTop: 6 }}>{err}</div>}
        <div style={{ fontSize: 11.5, color: 'var(--text-light)', marginTop: 8 }}>Your review appears publicly after approval. You can see it immediately.</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={submit} disabled={busy}
            style={{ flex: 1, padding: 13, border: 'none', borderRadius: 14, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', opacity: busy ? .6 : 1 }}>
            {busy ? 'Saving…' : existing ? 'Update Review' : 'Submit Review'}
          </button>
          {existing && (
            <button onClick={remove} disabled={busy}
              style={{ padding: '13px 16px', border: '1px solid #F1BBBB', borderRadius: 14, background: '#fff', color: '#C42B1C', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <div className="lb-img-box">
        {img?.type === 'video'
          ? <video src={img.src} controls autoPlay playsInline style={{ maxWidth: '100%', maxHeight: '100%' }} />
          : <img id="lbImg" src={img?.src || img} alt="" />}
      </div>
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
    { icon: 'fas fa-eye', color: 'var(--primary)', label: 'Total Views', value: formatCount(v.total_views) },
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
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'rgba(var(--primary-rgb),.1)', padding: '3px 10px', borderRadius: 50 }}>{c.level_icon} {c.level_name}</span>
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

// Reusable WhatsApp / Email / Call call-to-action row for popups.
function ContactCTA({ biz }: { biz: any }) {
  const wa = biz.whatsapp ? `https://wa.me/${String(biz.whatsapp).replace(/\D/g, '')}` : null;
  const email = biz.email ? `mailto:${biz.email}` : null;
  const phone = biz.phone ? `tel:${biz.phone}` : null;
  if (!wa && !email && !phone) return null;
  const btn = (bg: string, color: string): React.CSSProperties => ({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', background: bg, color, borderRadius: 12, fontSize: 13.5, fontWeight: 700, textDecoration: 'none' });
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
      {phone && <a href={phone} style={btn('#EAF2FE', '#0A84FF')}><i className="fas fa-phone"></i> Call</a>}
      {wa && <a href={wa} target="_blank" rel="noreferrer" style={btn('#E7F8EF', '#0E9F6E')}><i className="fab fa-whatsapp"></i> WhatsApp</a>}
      {email && <a href={email} style={btn('#FDEBEA', '#D93F34')}><i className="fas fa-envelope"></i> Email</a>}
    </div>
  );
}

function ServicePopup({ svc, biz, onClose }: { svc: any; biz: any; onClose: () => void }) {
  const text = svc.details || svc.description || svc.desc || '';
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,16,34,.55)', zIndex: 900, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 14px', overflowY: 'auto', backdropFilter: 'blur(2px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,.3)' }}>
        <div style={{ position: 'relative' }}>
          {svc.image
            ? <img src={svc.imageUrl || svc.image} alt={svc.title} style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, background: 'linear-gradient(135deg,#EEF0FB,#F7F8FC)' }}>{svc.icon || '⚙️'}</div>}
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,.45)', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', backdropFilter: 'blur(4px)' }}>×</button>
        </div>
        <div style={{ padding: '16px 18px 22px' }}>
          {svc.sectionTitle && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>{svc.sectionTitle}</div>}
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', lineHeight: 1.25 }}>{svc.title}</div>
          {text && <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: 10, whiteSpace: 'pre-wrap' }}>{text}</div>}
          <ContactCTA biz={biz} />
        </div>
      </div>
    </div>
  );
}

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lbOpen, setLbOpen] = useState(false);
  const [lbCur, setLbCur] = useState(0);
  const [lbImgs, setLbImgs] = useState<any[]>([]);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [expandedSvc, setExpandedSvc] = useState<Set<number>>(new Set());
  const [galExpanded, setGalExpanded] = useState(false);
  const [sliderCur, setSliderCur] = useState(0);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const [coursePopup, setCoursePopup] = useState<any>(null);
  const [doctorPopup, setDoctorPopup] = useState<any>(null);
  const [servicePopup, setServicePopup] = useState<any>(null);
  const [prodCat, setProdCat] = useState('Featured');
  const [prodSub, setProdSub] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const cartItems = useCart(id || 0);
  const { user } = useAuth();
  const qc = useQueryClient();
  const [docSpec, setDocSpec] = useState<number | 'all'>('all');

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
    // Autoplay the active slide's video; pause + reset the others.
    Object.entries(videoRefs.current).forEach(([i, v]) => {
      if (!v) return;
      if (Number(i) === sliderCur) { v.play().catch(() => {}); }
      else { v.pause(); try { v.currentTime = 0; } catch { /* ignore */ } }
    });
  }, [sliderCur, data]);

  // Slider autoplay — auto-advance through slides. Video slides advance on end (onEnded), not the timer.
  useEffect(() => {
    if (!data?.business) return;
    const media: any[] = data.coverMedia?.length ? data.coverMedia : [];
    const count = media.length || 4;                 // fallback slider has 4 slides
    if (count <= 1) return;
    if (media[sliderCur]?.type === 'video') return;  // let the video finish, then onEnded advances
    const t = setTimeout(() => setSliderCur((c) => (c + 1) % count), 4500);
    return () => clearTimeout(t);
  }, [sliderCur, data]);

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.business) return <div style={{ padding: 40 }}>Business not found. <Link to="/businesses">Back</Link></div>;

  const { business: biz, gallery, testimonials, clients } = data;
  const avgRating = biz.rating > 0 ? Number(biz.rating) : 4.5;

  // Template 2 (storefront) data
  const template = biz.template || 'template2';
  const isStore = Number(biz.is_online_store) === 1;
  const products: any[] = data.products || [];
  // Managed categories (name + image/icon) first, then any legacy names still on products.
  const managedCats: any[] = data.productCategories || [];
  const usedCatNames = new Set(products.map((p) => p.category).filter(Boolean));
  const prodCats: string[] = ['Featured',
    ...managedCats.filter((c) => usedCatNames.has(c.name)).map((c) => c.name),
    ...Array.from(usedCatNames).filter((n) => !managedCats.some((c) => c.name === n)),
  ];
  const subcatsAll: any[] = data.productSubcategories || [];
  const subcatsForCat = prodCat === 'Featured' ? [] : subcatsAll.filter((s) => s.category === prodCat);
  // Featured tab shows featured products; if none are flagged, it falls back to all.
  const featuredList = products.filter((p) => Number(p.featured) === 1);
  const filteredProducts = (prodCat === 'Featured' ? (featuredList.length ? featuredList : products) : products.filter((p) => p.category === prodCat))
    .filter((p) => prodSub === 'All' || p.subcategory === prodSub);
  const catMeta = (c: string) => managedCats.find((m) => m.name === c);
  const chipImg = (c: string) =>
    catMeta(c)?.imageUrl || products.find((p) => p.category === c && p.image)?.imageUrl || '';
  const showStore = template === 'template2' && products.length > 0;

  // Cover slider uses its own dedicated media (images + video), not the gallery.
  const coverMedia: any[] = data.coverMedia || [];
  const sliderImgs = coverMedia.length > 0
    ? coverMedia
    : [{ type: /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|$)/i.test(biz.imageUrl || '') ? 'video' : 'image', src: biz.imageUrl, caption: biz.name }, ...GALLERY_FALLBACKS.slice(0, 3)];
  const galleryItems = gallery.length > 0 ? gallery : GALLERY_FALLBACKS;
  const serviceSections: any[] = (data.serviceSections && data.serviceSections.length > 0)
    ? data.serviceSections
    : [{ id: 0, title: 'Services & Solutions', items: SVC_FALLBACKS }];
  const revList: any[] = testimonials;
  const approvedRevs = revList.filter((r: any) => !r.status || r.status === 'approved');
  const myReview = revList.find((r: any) => Number(r.is_own) === 1) || null;
  // Real star breakdown from approved reviews (falls back to admin rating when none).
  const revAvg = approvedRevs.length
    ? approvedRevs.reduce((s: number, r: any) => s + Number(r.rating || 5), 0) / approvedRevs.length
    : null;
  const barPct = (star: number) => approvedRevs.length
    ? Math.round(approvedRevs.filter((r: any) => Math.round(Number(r.rating || 5)) === star).length / approvedRevs.length * 100)
    : 0;
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

  // ── Detail page sections: per-business show/hide + order (admin-configured).
  // Legacy show_stats / show_clients act as defaults when no config is saved.
  const defaultSections = ['header', 'actions', 'store', 'creator', 'doctors', 'courses', 'about', 'stats', 'services', 'gallery', 'clients', 'reviews', 'contact']
    .map((key, i) => ({
      key,
      on: key === 'stats' ? (Number(biz.show_stats ?? 1) ? 1 : 0) : key === 'clients' ? (Number(biz.show_clients ?? 1) ? 1 : 0) : 1,
      order: i + 1,
    }));
  let secList = defaultSections;
  try {
    const cfg = JSON.parse(biz.sections_config || '');
    if (Array.isArray(cfg) && cfg.length) {
      const known = new Set(cfg.map((s: any) => s.key));
      secList = [...cfg, ...defaultSections.filter((d) => !known.has(d.key)).map((d, i) => ({ ...d, order: cfg.length + i + 1 }))];
    }
  } catch { /* default layout */ }
  secList = secList.filter((s: any) => s.on).sort((a: any, b: any) => a.order - b.order);

  const SEC_RENDER: Record<string, () => React.ReactNode> = {
    header: () => (
      <div className="bd-header">
        <div className="bd-logo-row">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="bd-name">{biz.name}</div>
            {biz.category_name && <div className="bd-cat-label"><i className="fas fa-tag"></i> {biz.category_name}</div>}
            {biz.tagline && <div className="bd-tagline">"{biz.tagline}"</div>}
          </div>
        </div>
        <div className="bd-meta-row">
          {biz.rating > 0 && <div className="bd-rating-badge">{renderStars(avgRating)} <strong>{avgRating.toFixed(1)}</strong></div>}
          {biz.distance && <div className="bd-distance"><i className="fas fa-location-arrow"></i> {biz.distance}</div>}
          {Number(biz.is_verified) === 1 && <span className="bd-badge verified"><i className="fas fa-check-circle"></i> Verified</span>}
          <span className="bd-badge open"><i className="fas fa-circle" style={{ fontSize: 7 }}></i> Open</span>
        </div>
        {biz.address && <div className="bd-address-row"><i className="fas fa-map-marker-alt"></i> {biz.address}</div>}
      </div>
    ),
    actions: () => (
      <div className="bd-actions">
        {biz.phone && <a href={`tel:${biz.phone}`} className="bd-action call"><div className="bd-action-icon"><i className="fas fa-phone"></i></div><span>Call</span></a>}
        {waLink && <a href={waLink} target="_blank" rel="noreferrer" className="bd-action wa"><div className="bd-action-icon"><i className="fab fa-whatsapp"></i></div><span>WhatsApp</span></a>}
        {biz.website && <a href={biz.website} target="_blank" rel="noreferrer" className="bd-action web"><div className="bd-action-icon"><i className="fas fa-globe"></i></div><span>Website</span></a>}
        {biz.email && <a href={`mailto:${biz.email}`} className="bd-action email"><div className="bd-action-icon"><i className="fas fa-envelope"></i></div><span>Email</span></a>}
        <a href={`https://maps.google.com/?q=${encodeURIComponent(biz.address || biz.name + ' UAE')}`} target="_blank" rel="noreferrer" className="bd-action map"><div className="bd-action-icon"><i className="fas fa-directions"></i></div><span>Directions</span></a>
      </div>
    ),
    store: () => !showStore ? null : (
      <div className="bs-page-wrap">
        <div className="store-shop">
          {prodCats.length > 1 && (
            <div className="store-chips">
              {prodCats.map((c) => (
                <button key={c} className={`store-chip${prodCat === c ? ' active' : ''}`} onClick={() => { setProdCat(c); setProdSub('All'); }}>
                  <div className="store-chip-circle">
                    {c === 'Featured'
                      ? <i className="fas fa-star"></i>
                      : chipImg(c)
                        ? <img src={chipImg(c)} alt="" />
                        : catMeta(c)?.icon
                          ? <span style={{ fontSize: 18 }}>{catMeta(c).icon}</span>
                          : <i className="fas fa-shapes"></i>}
                  </div>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          )}
          {subcatsForCat.length > 0 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 2px 10px', scrollbarWidth: 'none' }}>
              {['All', ...subcatsForCat.map((s) => s.name)].map((s) => (
                <button key={s} onClick={() => setProdSub(s)}
                  style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    border: prodSub === s ? '1px solid var(--primary)' : '1px solid #E3E7F0',
                    background: prodSub === s ? 'var(--primary)' : '#fff',
                    color: prodSub === s ? '#fff' : 'var(--text-secondary)' }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="bs-sh"><span className="bs-title">{prodCat === 'Featured' ? (featuredList.length ? 'Featured' : 'Shop') : prodCat}</span><span style={{ fontSize: 11, color: 'var(--text-light)' }}>{filteredProducts.length} items</span></div>
          <div className="store-grid">
            {filteredProducts.map((p) => {
              const pct = p.discount_percent != null ? Math.round(Number(p.discount_percent))
                : (p.original_price != null && Number(p.original_price) > Number(p.price || 0))
                  ? Math.round((1 - Number(p.price) / Number(p.original_price)) * 100) : null;
              return (
                <div key={p.id} className="store-card" onClick={() => navigate(`/businesses/${id}/products/${p.id}`)}>
                  <div className="store-card-img" style={{ position: 'relative' }}>
                    {p.image
                      ? <img src={p.imageUrl || p.image} alt={p.name} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
                      : <div className="store-card-ph">🛍️</div>}
                    {pct != null && pct > 0 && (
                      <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 11, fontWeight: 800, background: '#C62828', color: '#fff', borderRadius: 8, padding: '2px 8px' }}>-{pct}%</span>
                    )}
                  </div>
                  <div className="store-card-body">
                    <div className="store-card-name">{p.name}</div>
                    {p.short_description && (
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.35, margin: '2px 0 4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {p.short_description}
                      </div>
                    )}
                    {isStore && p.price != null && (
                      <div className="store-card-price">
                        <span className="now">{p.currency || 'AED'} {Number(p.price).toLocaleString()}</span>
                        {p.original_price != null && Number(p.original_price) > 0 && <span className="was">{p.currency || 'AED'} {Number(p.original_price).toLocaleString()}</span>}
                      </div>
                    )}
                    <button className="store-card-btn" onClick={(e) => { e.stopPropagation(); navigate(`/businesses/${id}/products/${p.id}`); }}>View More</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
    creator: () => data.vlogger ? <div className="bs-page-wrap"><CreatorStats v={data.vlogger} /></div> : null,
    doctors: () => {
      if (!(data.doctors || []).length) return null;
      const docList: any[] = data.doctors;
      const specs = Array.from(
        new Map(docList.filter((d) => d.specialty_id).map((d) => [d.specialty_id, { id: d.specialty_id, name: d.specialty_name, icon: d.specialty_icon }])).values()
      );
      const filtered = docSpec === 'all' ? docList : docList.filter((d) => d.specialty_id === docSpec);
      const TEAL = '#0E7C86';
      const tab = (active: boolean): React.CSSProperties => ({
        flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 600, border: `1.5px solid ${active ? TEAL : '#E1E9EA'}`,
        background: active ? TEAL : '#fff', color: active ? '#fff' : '#3A4A4E', whiteSpace: 'nowrap',
      });
      return (
        <div className="bs-page-wrap">
          <div className="bs-section">
            <div className="bs-sh"><span className="bs-title">Doctors</span><span style={{ fontSize: 11, color: 'var(--text-light)' }}>{filtered.length} of {docList.length}</span></div>
            {specs.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 0 14px', scrollbarWidth: 'none' }}>
                <button style={tab(docSpec === 'all')} onClick={() => setDocSpec('all')}>All <span style={{ opacity: .7 }}>{docList.length}</span></button>
                {specs.map((s: any) => {
                  const count = docList.filter((d) => d.specialty_id === s.id).length;
                  return (
                    <button key={s.id} style={tab(docSpec === s.id)} onClick={() => setDocSpec(s.id)}>
                      {s.icon ? `${s.icon} ` : ''}{s.name} <span style={{ opacity: .7 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((d: any) => <DoctorCard key={d.id} d={d} onOpen={setDoctorPopup} showHospital={false} />)}
            </div>
          </div>
        </div>
      );
    },
    courses: () => uniCourses.length === 0 ? null : (
      <div className="bs-page-wrap">
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
      </div>
    ),
    about: () => (
      <div className="bs-page-wrap">
        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">About Us</span></div>
          <div className={`bs-about-text${aboutExpanded ? ' show' : ''}`}>{aboutText.split('\n').map((l: string, i: number) => <span key={i}>{l}<br /></span>)}</div>
          <button className="bs-rm-btn" onClick={() => setAboutExpanded(!aboutExpanded)}>
            {aboutExpanded ? 'Read Less ' : 'Read More '}<i className={`fas fa-chevron-${aboutExpanded ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>
    ),
    stats: () => (
      <div className="bs-page-wrap">
        <div className="bs-stats-row">
          <div className="bs-stat"><div className="bs-stat-num">{avgRating.toFixed(1)}</div><div className="bs-stat-lbl">Rating</div></div>
          <div className="bs-stat"><div className="bs-stat-num">{biz.established_year || new Date().getFullYear() - 5}</div><div className="bs-stat-lbl">Est. Year</div></div>
          <div className="bs-stat"><div className="bs-stat-num">{biz.employees || '50+'}</div><div className="bs-stat-lbl">Team Size</div></div>
          <div className="bs-stat"><div className="bs-stat-num">{revList.length}+</div><div className="bs-stat-lbl">Reviews</div></div>
        </div>
      </div>
    ),
    services: () => (
      <div className="bs-page-wrap">
        {serviceSections.map((sec: any) => {
          const items: any[] = sec.items || [];
          if (!items.length) return null;
          const expanded = expandedSvc.has(sec.id);
          return (
            <div className="bs-section" key={sec.id}>
              <div className="bs-sh"><span className="bs-title">{sec.title}</span><span style={{ fontSize: 11, color: 'var(--text-light)' }}>{items.length} offerings</span></div>
              <div className="bs-svc-grid">
                {items.map((svc: any, i: number) => (
                  <div className={`bs-svc-card${i >= 4 && !expanded ? ' bs-hidden' : ''}`} key={svc.id ?? i}
                    style={{ cursor: 'pointer' }} onClick={() => setServicePopup({ ...svc, sectionTitle: sec.title })}>
                    {svc.image ? <img src={svc.imageUrl || svc.image} alt="" className="bs-svc-img" /> : <div className="bs-svc-icon">{svc.icon || '⚙️'}</div>}
                    <div className="bs-svc-title">{svc.title}</div>
                    {(svc.description || svc.desc) && <div className="bs-svc-desc">{svc.description || svc.desc}</div>}
                    <div className="bs-svc-more">View more ›</div>
                  </div>
                ))}
              </div>
              {items.length > 4 && !expanded && (
                <button className="bs-expand-btn" onClick={() => setExpandedSvc((p) => new Set(p).add(sec.id))}>View All {items.length} Services <i className="fas fa-chevron-down"></i></button>
              )}
            </div>
          );
        })}
      </div>
    ),
    gallery: () => (
      <div className="bs-page-wrap">
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
      </div>
    ),
    clients: () => (
      <div className="bs-page-wrap">
        <div className="bs-section">
          <div className="bs-sh"><span className="bs-title">Clients &amp; Partners</span></div>
          <div className="bs-clients-scroll">
            {clientList.map((c: any, ci: number) => {
              // Per-business size preset wins; else the global px setting; else default.
              const logoSize: number = biz.clients_size === 'small' ? 46 : biz.clients_size === 'medium' ? 64 : (data.clientLogoSize || 58);
              const nameSize: number | undefined = biz.clients_size === 'small' ? 9 : biz.clients_size === 'medium' ? 11.5 : undefined;
              const sizeStyle = { width: logoSize, height: logoSize, fontSize: Math.round(logoSize * 0.34) };
              const inner = (
                <>
                  {c.logo ? (
                    <img src={c.logoUrl || c.logo} alt={c.name} className="bs-client-logo" style={sizeStyle} />
                  ) : (
                    <div className="bs-client-avatar" style={{ ...sizeStyle, background: CLIENT_GRADS[ci % CLIENT_GRADS.length] }}>{c.name[0].toUpperCase()}</div>
                  )}
                  <div className="bs-client-name" style={nameSize ? { fontSize: nameSize } : undefined}>{c.name}</div>
                </>
              );
              return c.website ? (
                <a href={c.website} target="_blank" rel="noreferrer" className="bs-client-item" key={ci} style={{ width: logoSize + 18 }}>{inner}</a>
              ) : (
                <div className="bs-client-item" key={ci} style={{ width: logoSize + 18 }}>{inner}</div>
              );
            })}
          </div>
        </div>
      </div>
    ),
    reviews: () => (
      <div className="bs-page-wrap">
        <div className="bs-section">
          <div className="bs-sh">
            <span className="bs-title">What Clients Say</span>
            <button onClick={() => (user ? setReviewOpen(true) : navigate('/auth/login'))}
              style={{ border: 'none', borderRadius: 999, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', color: '#fff', fontSize: 12, fontWeight: 700, padding: '7px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <i className={`fas ${myReview ? 'fa-pen' : 'fa-star'}`} style={{ marginRight: 5, fontSize: 10 }}></i>
              {myReview ? 'Edit Your Review' : 'Write a Review'}
            </button>
          </div>
          <div className="bs-review-summary">
            <div className="bs-rev-avg">
              <div className="big-num">{(revAvg ?? avgRating).toFixed(1)}</div>
              <div className="stars">{renderStars(revAvg ?? avgRating)}</div>
              <div className="cnt">{approvedRevs.length} review{approvedRevs.length === 1 ? '' : 's'}</div>
            </div>
            <div style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map((s) => (
                <div className="bs-bar-row" key={s}>
                  <span className="n">{s}</span>
                  <div className="bs-bar-track"><div className="bs-bar-fill" style={{ width: `${barPct(s)}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
          {revList.length === 0 && (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13.5 }}>
              No reviews yet — be the first to share your experience!
            </div>
          )}
          {revList.slice(0, 5).map((rev: any, ri: number) => {
            const name = rev.client_name || rev.name || 'Customer';
            const co = rev.client_company || rev.company || '';
            const rating = Number(rev.rating || 5);
            const text = rev.review || '';
            const avatar = rev.avatar || name[0].toUpperCase();
            const own = Number(rev.is_own) === 1;
            return (
              <div className="bs-review-card" key={ri} style={own && rev.status !== 'approved' ? { border: '1px dashed #F0C36D', background: '#FFFDF5' } : undefined}>
                <div className="bs-rev-head">
                  <div className="bs-rev-avatar">{rev.client_photo ? <img src={rev.client_photo} alt="" /> : avatar}</div>
                  <div>
                    <div className="bs-rev-name">{name}{own ? ' (You)' : ''}</div>
                    {co && <div className="bs-rev-co">{co}</div>}
                  </div>
                  {own && rev.status === 'pending' && (
                    <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, background: '#FFF8E1', color: '#B26A00', borderRadius: 10, padding: '3px 9px' }}>⏳ Pending approval</span>
                  )}
                  {own && rev.status === 'rejected' && (
                    <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, background: '#FDECEA', color: '#C62828', borderRadius: 10, padding: '3px 9px' }}>Rejected</span>
                  )}
                </div>
                <div className="bs-rev-stars">{renderStars(rating)}</div>
                <div className="bs-rev-text">{text}</div>
              </div>
            );
          })}
          {revList.length > 5 && (
            <button className="bs-expand-btn" onClick={() => navigate(`/businesses/${id}/reviews`)}>View All {revList.length} Reviews <i className="fas fa-chevron-right"></i></button>
          )}
        </div>
      </div>
    ),
    contact: () => (
      <div className="bs-page-wrap">
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
          {(() => {
            // Share links can't render inside an iframe — build an embeddable URL from coordinates instead.
            const isEmbeddable = biz.map_embed && /\/maps\/embed|output=embed/i.test(biz.map_embed);
            const mapSrc = isEmbeddable ? biz.map_embed
              : (biz.latitude != null && biz.longitude != null)
                ? `https://www.google.com/maps?q=${biz.latitude},${biz.longitude}&output=embed`
                : null;
            return mapSrc ? (
              <iframe src={mapSrc} className="bs-map-embed" loading="lazy" title="Map"></iframe>
            ) : (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(biz.address || biz.name + ' UAE')}`} target="_blank" rel="noreferrer" className="bs-map-btn">
                <div className="map-ic-box"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Location</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginTop: 2 }}>{biz.address || 'Open in Google Maps'}</div>
                </div>
                <i className="fas fa-external-link-alt" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 12 }}></i>
              </a>
            );
          })()}
        </div>
      </div>
    ),
  };

  return (
    <div className="biz-detail-v2" style={bizThemeStyle(biz.color)}>
      {lbOpen && <Lightbox imgs={lbImgs} cur={lbCur} onClose={closeLB} onNav={lbNav} />}
      {coursePopup && <CoursePopup course={coursePopup} biz={biz} onClose={() => setCoursePopup(null)} />}
      {doctorPopup && <DoctorPopup doctor={doctorPopup} onClose={() => setDoctorPopup(null)} />}
      {servicePopup && <ServicePopup svc={servicePopup} biz={biz} onClose={() => setServicePopup(null)} />}

      <div className="bd-brandbar">
        <Link to={-1 as any} className="bd-brand-btn"><i className="fas fa-arrow-left"></i></Link>
        <div className="bd-brand-logo">
          {biz.logoUrl && biz.logo
            ? <img src={biz.logoUrl} alt={biz.name} />
            : <span>{biz.name}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {products.length > 0 && secList.some((s: any) => s.key === 'store') && (
            <button className="bd-brand-btn" onClick={() => setCartOpen(true)} aria-label="Cart" style={{ position: 'relative' }}>
              <i className="fas fa-shopping-cart"></i>
              {cartItems.length > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, background: 'var(--primary)', color: '#fff', fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  {cartItems.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>
          )}
          <button className="bd-brand-btn" onClick={() => { if (navigator.share) navigator.share({ title: biz.name, url: window.location.href }); }}>
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
      {cartOpen && <CartDrawer biz={biz} onClose={() => setCartOpen(false)} />}
      {reviewOpen && (
        <ReviewForm bizId={id!} existing={myReview}
          onClose={() => setReviewOpen(false)}
          onSaved={() => { setReviewOpen(false); qc.invalidateQueries({ queryKey: ['business', id] }); }} />
      )}

      <div className="bd-slider-wrap" onClick={() => openLB(sliderCur, sliderImgs)}>
        <div className="bd-slider-track" style={{ transform: `translateX(-${sliderCur * 100}%)` }}>
          {sliderImgs.map((img: any, i: number) => (
            <div className="bd-slide" key={i}>
              {img.type === 'video'
                ? <video ref={(el) => { videoRefs.current[i] = el; }} src={img.src} muted playsInline preload="auto"
                    loop={sliderImgs.length <= 1}
                    onEnded={() => { if (sliderImgs.length > 1) setSliderCur((c) => (c + 1) % sliderImgs.length); }} />
                : <img src={img.src} alt={img.caption || ''} loading={i === 0 ? undefined : 'lazy'} decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).src = GALLERY_FALLBACKS[i % GALLERY_FALLBACKS.length].src; }} />}
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

      {secList.map((s: any) => { const r = SEC_RENDER[s.key]; const el = r ? r() : null; return el ? <div key={s.key}>{el}</div> : null; })}
    </div>
  );
}
