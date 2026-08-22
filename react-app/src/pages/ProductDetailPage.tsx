import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { bizThemeStyle } from '../bizTheme';
import { addToCart, useCart } from '../cart';
import CartDrawer from '../components/CartDrawer';

const upUrl = (f: string) => (String(f).startsWith('http') ? f : `/assets/uploads/businesses/${f}`);
const ytId = (url: string) => /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/i.exec(url || '')?.[1] || null;
const safeArr = (s: any): any[] => { try { const v = JSON.parse(s || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const safeObj = (s: any): any => { try { return JSON.parse(s || '{}') || {}; } catch { return {}; } };

// Fullscreen image viewer with swipe between images.
function ImageLightbox({ imgs, start, onClose }: { imgs: string[]; start: number; onClose: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = trackRef.current;
    const child = el?.children[start] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft });
  }, [start]);
  return (
    <div className="pd-lb" onClick={onClose}>
      <button className="pd-lb-close" onClick={onClose}><i className="fas fa-times"></i></button>
      <div className="pd-lb-track" ref={trackRef} onClick={(e) => e.stopPropagation()}>
        {imgs.map((img, i) => (
          <div className="pd-lb-slide" key={i}><img src={upUrl(img)} alt="" /></div>
        ))}
      </div>
    </div>
  );
}

// Video popup player — swipe left/right (or arrows) pauses current, plays next/prev.
function VideoPlayer({ videos, start, onClose }: { videos: any[]; start: number; onClose: () => void }) {
  const [cur, setCur] = useState(start);
  const touch = useRef<number | null>(null);
  const v = videos[cur];
  const go = (d: number) => setCur((c) => (c + d + videos.length) % videos.length);
  return (
    <div className="pd-vp" onClick={onClose}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}>
      <button className="pd-lb-close" onClick={onClose}><i className="fas fa-times"></i></button>
      <div className="pd-vp-body" onClick={(e) => e.stopPropagation()}>
        {v.type === 'youtube'
          ? <iframe key={v.src} src={`https://www.youtube.com/embed/${ytId(v.src)}?autoplay=1&playsinline=1`}
              title="Video" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
          : <video key={v.src} src={upUrl(v.src)} controls autoPlay playsInline />}
      </div>
      {videos.length > 1 && (
        <>
          <button className="pd-vp-nav prev" onClick={(e) => { e.stopPropagation(); go(-1); }}><i className="fas fa-chevron-left"></i></button>
          <button className="pd-vp-nav next" onClick={(e) => { e.stopPropagation(); go(1); }}><i className="fas fa-chevron-right"></i></button>
          <div className="pd-vp-count">{cur + 1} / {videos.length}</div>
        </>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id, pid } = useParams();
  const [lb, setLb] = useState<number | null>(null);
  const [player, setPlayer] = useState<number | null>(null);
  const [galCur, setGalCur] = useState(0);
  const [sel, setSel] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(false);
  const galRef = useRef<HTMLDivElement>(null);
  const cartItems = useCart(id || 0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id, pid],
    queryFn: () => api.get(`/businesses/${id}/products/${pid}`).then((r) => r.data),
  });

  if (isLoading) return <div className="loading">Loading…</div>;
  if (isError || !data?.product) return <div style={{ padding: 40, textAlign: 'center' }}>Product not found. <Link to={`/businesses/${id}`}>Back to store</Link></div>;

  const { product: p, business: biz } = data;
  const images: string[] = safeArr(p.images).length ? safeArr(p.images) : (p.image ? [p.image] : []);
  const videos: any[] = safeArr(p.videos);
  const variants = safeObj(p.variants);
  const tags = String(p.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);
  const cur = p.currency || 'AED';
  const hasDiscount = p.original_price != null && Number(p.original_price) > Number(p.price || 0);
  const pct = p.discount_percent != null ? Math.round(Number(p.discount_percent)) :
    hasDiscount ? Math.round((1 - Number(p.price) / Number(p.original_price)) * 100) : null;
  const wa = String(biz.whatsapp || biz.phone || '').replace(/\D/g, '');
  const isStore = Number(biz.is_online_store) === 1;

  const onGalScroll = () => {
    const el = galRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== galCur) setGalCur(i);
  };

  // Selectable single-choice chips per attribute; picking is optional.
  const pickRow = (label: string, values: string[]) => values?.length > 0 && (
    <div className="pd-var-row">
      <span className="pd-var-label">{label}</span>
      <span className="pd-var-chips">
        {values.map((v) => (
          <button key={v} type="button"
            className={`pd-chip pd-chip-pick${sel[label] === v ? ' on' : ''}`}
            onClick={() => setSel((s) => ({ ...s, [label]: s[label] === v ? '' : v }))}>
            {v}
          </button>
        ))}
      </span>
    </div>
  );

  const doAddToCart = () => {
    const variations: Record<string, string> = {};
    Object.entries(sel).forEach(([k, v]) => { if (v) variations[k] = v; });
    if (variants.style) variations['Style'] = variants.style;
    addToCart(id!, {
      pid: p.id, name: p.name, sku: p.sku || null,
      price: isStore && p.price != null ? Number(p.price) : null,
      currency: cur, image: images[0] || null, qty: 1, variations,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div style={bizThemeStyle(biz.color)}>
      <div className="pdx-top">
        <Link to={`/businesses/${id}`} className="pdx-back" aria-label="Back"><i className="fas fa-chevron-left"></i></Link>
        <h1>{p.category || p.name}</h1>
        <button className="pd-cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
          <i className="fas fa-shopping-bag"></i>
          {cartItems.length > 0 && <span className="pd-cart-badge">{cartItems.reduce((s, i) => s + i.qty, 0)}</span>}
        </button>
      </div>

      {/* ── Image gallery: rounded card, swipe, tap to zoom ── */}
      {images.length > 0 && (
        <>
          <div className="pdx-galwrap">
            <div className="pd-gal" ref={galRef} onScroll={onGalScroll}>
              {images.map((img, i) => (
                <div className="pd-gal-slide" key={i} onClick={() => setLb(i)}>
                  <img src={upUrl(img)} alt={`${p.name} ${i + 1}`} loading={i === 0 ? undefined : 'lazy'} />
                </div>
              ))}
            </div>
            {pct != null && pct > 0 && <span className="pdx-sale">SALE</span>}
            <button className={`pdx-fav${fav ? ' on' : ''}`} onClick={() => setFav(!fav)} aria-label="Favourite">
              <i className={`${fav ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          </div>
          {images.length > 1 && (
            <div className="slider-dots" style={{ padding: '8px 0 0' }}>
              {images.map((_, i) => <div key={i} className={`dot${i === galCur ? ' active' : ''}`} />)}
            </div>
          )}
        </>
      )}

      <div className="pd-body">
        {/* ── Title + price ── */}
        <div className="pd-head">
          <div>
            {p.brand && <div className="pd-brand">{p.brand}</div>}
            <h2 className="pd-name">{p.name}</h2>
            {(p.category || p.subcategory) && (
              <div className="pd-crumb">{[p.category, p.subcategory].filter(Boolean).join(' › ')}</div>
            )}
          </div>
        </div>
        {isStore && p.price != null && (
          <div className="pd-price-row">
            <span className="pd-price">{cur} {Number(p.price).toLocaleString()}</span>
            {hasDiscount && <span className="pd-was">{cur} {Number(p.original_price).toLocaleString()}</span>}
            {pct != null && pct > 0 && <span className="pd-off">-{pct}%</span>}
          </div>
        )}
        {p.short_description && <p className="pd-short">{p.short_description}</p>}

        {/* ── Variants ── */}
        {(variants.sizes?.length || variants.colors?.length || variants.materials?.length || variants.dimensions?.length || variants.style || variants.weight) ? (
          <div className="pd-card">
            <div className="pd-card-title">Select Options</div>
            {pickRow('Size', variants.sizes)}
            {pickRow('Color', variants.colors)}
            {pickRow('Material', variants.materials)}
            {pickRow('Dimensions', variants.dimensions)}
            {variants.style && <div className="pd-var-row"><span className="pd-var-label">Style / Model</span><span className="pd-var-text">{variants.style}</span></div>}
            {variants.weight && <div className="pd-var-row"><span className="pd-var-label">Weight</span><span className="pd-var-text">{variants.weight}</span></div>}
          </div>
        ) : null}

        {/* ── Details ── */}
        {(p.description || p.sku) && (
          <div className="pd-card">
            <div className="pd-card-title">Details</div>
            {p.description && <p className="pd-desc">{p.description}</p>}
            {p.sku && <div className="pd-var-row"><span className="pd-var-label">SKU</span><span className="pd-var-text">{p.sku}</span></div>}
            {tags.length > 0 && (
              <div className="pd-var-row"><span className="pd-var-label">Tags</span>
                <span className="pd-var-chips">{tags.map((t: string) => <span key={t} className="pd-chip pd-chip-tag">#{t}</span>)}</span>
              </div>
            )}
          </div>
        )}

        {/* ── Video rail: vertical cards, slide, tap to play ── */}
        {videos.length > 0 && (
          <>
            <div className="pd-card-title" style={{ margin: '18px 2px 10px' }}>Videos</div>
            <div className="pd-vids">
              {videos.map((v: any, i: number) => (
                <div className="pd-vid-card" key={i} onClick={() => setPlayer(i)} role="button" tabIndex={0}>
                  {v.type === 'youtube'
                    ? <img src={`https://img.youtube.com/vi/${ytId(v.src)}/hqdefault.jpg`} alt="Video" loading="lazy" />
                    : <video src={upUrl(v.src)} muted preload="metadata" />}
                  <div className="pd-vid-play"><i className="fas fa-play"></i></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="pd-cta">
        <button className="pd-cta-buy" onClick={doAddToCart} style={added ? { background: '#25D366' } : undefined}>
          <i className={`fas ${added ? 'fa-check' : 'fa-cart-plus'}`}></i> {added ? 'Added to Cart' : 'Add to Cart'}
        </button>
        {wa && (
          <a className="pd-cta-wa" href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I'm interested in "${p.name}"`)}`} target="_blank" rel="noreferrer">
            <i className="fab fa-whatsapp"></i> Enquire
          </a>
        )}
      </div>
      <div style={{ height: 150 }} />

      {lb !== null && <ImageLightbox imgs={images} start={lb} onClose={() => setLb(null)} />}
      {player !== null && <VideoPlayer videos={videos} start={player} onClose={() => setPlayer(null)} />}
      {cartOpen && <CartDrawer biz={biz} onClose={() => setCartOpen(false)} />}

      <style>{`
        .pdx-top{position:sticky;top:0;z-index:300;display:flex;align-items:center;gap:10px;padding:12px 16px;background:#fff;border-bottom:1px solid #F1F1F6}
        .pdx-top h1{flex:1;text-align:center;font-size:17px;font-weight:800;color:var(--dark);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .pdx-back{width:40px;height:40px;border-radius:50%;border:1px solid #ECECF2;background:#fff;color:var(--dark);font-size:14px;display:flex;align-items:center;justify-content:center;text-decoration:none;flex-shrink:0;box-shadow:0 2px 8px rgba(13,27,42,0.05)}
        .pdx-galwrap{position:relative;margin:12px 16px 0;border-radius:24px;overflow:hidden;background:#F1F3F9}
        .pdx-sale{position:absolute;top:14px;left:0;background:var(--primary);color:#fff;font-size:12px;font-weight:800;letter-spacing:.6px;padding:7px 16px;border-radius:0 14px 14px 0;box-shadow:0 4px 12px rgba(0,0,0,0.18)}
        .pdx-fav{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;border:none;background:#fff;color:var(--dark);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(13,27,42,0.14)}
        .pdx-fav.on{color:#E0245E}
        .pd-gal{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .pd-gal::-webkit-scrollbar{display:none}
        .pd-gal-slide{flex:0 0 100%;scroll-snap-align:start;cursor:zoom-in}
        .pd-gal-slide img{width:100%;height:420px;object-fit:cover;display:block}
        .pd-body{padding:14px 16px 0}
        .pd-brand{font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.5px}
        .pd-name{font-size:20px;font-weight:800;color:var(--dark);margin:2px 0 3px;line-height:1.25}
        .pd-crumb{font-size:12px;color:var(--text-secondary);font-weight:600}
        .pd-price-row{display:flex;align-items:baseline;gap:10px;margin:10px 0 4px;flex-wrap:wrap}
        .pd-price{font-size:24px;font-weight:800;color:var(--primary)}
        .pd-was{font-size:14px;color:var(--text-light);text-decoration:line-through}
        .pd-off{font-size:12px;font-weight:800;background:#FDECEA;color:#C62828;border-radius:8px;padding:2px 8px}
        .pd-short{font-size:13.5px;color:var(--text-secondary);line-height:1.5;margin:4px 0 0}
        .pd-card{background:#fff;border:1px solid #EEEDF5;border-radius:16px;padding:14px;margin-top:14px;box-shadow:0 3px 12px rgba(13,27,42,0.05)}
        .pd-card-title{font-size:13px;font-weight:800;color:var(--dark);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px}
        .pd-var-row{display:flex;align-items:flex-start;gap:10px;padding:6px 0;border-top:1px solid #F5F5FA}
        .pd-var-row:first-of-type{border-top:none}
        .pd-var-label{font-size:12px;font-weight:700;color:var(--text-secondary);min-width:90px;padding-top:3px}
        .pd-var-text{font-size:13px;font-weight:600;color:var(--dark)}
        .pd-var-chips{display:flex;flex-wrap:wrap;gap:6px}
        .pd-chip{font-size:12px;font-weight:600;background:rgba(var(--primary-rgb),0.08);color:var(--primary);border-radius:999px;padding:3px 11px}
        .pd-chip-tag{background:#F1F3F9;color:var(--text-secondary)}
        .pd-chip-pick{border:1px solid rgba(var(--primary-rgb),0.25);background:#fff;cursor:pointer;font-family:inherit;padding:5px 13px;transition:background .12s,color .12s}
        .pd-chip-pick.on{background:var(--primary);color:#fff;border-color:var(--primary)}
        .pd-cart-btn{position:relative;width:38px;height:38px;border-radius:50%;border:1px solid #E5E8F0;background:#fff;color:var(--dark);font-size:15px;cursor:pointer;box-shadow:0 2px 8px rgba(13,27,42,0.06);margin-right:48px}
        .pd-cart-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:var(--primary);color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 4px}
        .pd-desc{font-size:13.5px;color:var(--text-secondary);line-height:1.6;margin:0 0 8px;white-space:pre-wrap}
        /* video rail */
        .pd-vids{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:6px;-webkit-overflow-scrolling:touch}
        .pd-vids::-webkit-scrollbar{display:none}
        .pd-vid-card{position:relative;flex-shrink:0;width:122px;height:196px;border-radius:14px;overflow:hidden;background:#0D1B2A;cursor:pointer;box-shadow:0 4px 14px rgba(13,27,42,0.15)}
        .pd-vid-card img,.pd-vid-card video{width:100%;height:100%;object-fit:cover;display:block;opacity:.92}
        .pd-vid-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
        .pd-vid-play i{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.92);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:15px;padding-left:3px;box-shadow:0 4px 14px rgba(0,0,0,0.3)}
        /* bottom CTA */
        .pd-cta{position:fixed;bottom:calc(var(--nav-height) + 8px);left:50%;transform:translateX(-50%);width:100%;max-width:480px;display:flex;gap:10px;padding:0 16px;z-index:150}
        .pd-cta-buy,.pd-cta-wa{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 0;border-radius:14px;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(13,27,42,0.18);border:none;cursor:pointer;font-family:inherit;transition:background .18s}
        .pd-cta-buy{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff}
        .pd-cta-wa{background:#25D366;color:#fff}
        /* lightbox */
        .pd-lb{position:fixed;inset:0;background:rgba(5,8,20,0.94);z-index:1000;display:flex;align-items:center}
        .pd-lb-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;width:100%;scrollbar-width:none}
        .pd-lb-track::-webkit-scrollbar{display:none}
        .pd-lb-slide{flex:0 0 100%;scroll-snap-align:start;display:flex;align-items:center;justify-content:center;height:100vh}
        .pd-lb-slide img{max-width:100%;max-height:92vh;object-fit:contain}
        .pd-lb-close{position:fixed;top:14px;right:14px;width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,0.15);color:#fff;font-size:16px;cursor:pointer;z-index:1002}
        /* video player */
        .pd-vp{position:fixed;inset:0;background:rgba(5,8,20,0.96);z-index:1000;display:flex;align-items:center;justify-content:center}
        .pd-vp-body{width:100%;max-width:480px;aspect-ratio:9/14;max-height:80vh;display:flex;align-items:center;justify-content:center}
        .pd-vp-body iframe,.pd-vp-body video{width:100%;height:100%;border:none;background:#000;border-radius:12px;object-fit:contain}
        .pd-vp-nav{position:fixed;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,0.18);color:#fff;font-size:14px;cursor:pointer;z-index:1002}
        .pd-vp-nav.prev{left:10px}
        .pd-vp-nav.next{right:10px}
        .pd-vp-count{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.85);font-size:13px;font-weight:700}
      `}</style>
    </div>
  );
}
