import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { fmtPrice, priceSuffix } from '../constants/realestate';

const PROP_FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=220&fit=crop';

export default function RealEstateCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<'listings' | 'projects'>('listings');
  const { data, isLoading } = useQuery({
    queryKey: ['re-company', id],
    queryFn: () => api.get(`/realestate/companies/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.company) return <div style={{ padding: 40 }}>Not found. <Link to="/realestate">Back</Link></div>;

  const c = data.company;
  const properties: any[] = data.properties || [];
  const projects: any[] = data.projects || [];

  const contact = [
    c.phone && { icon: 'fas fa-phone', label: 'Call', href: `tel:${c.phone}`, cls: 'call' },
    c.whatsapp && { icon: 'fab fa-whatsapp', label: 'WhatsApp', href: `https://wa.me/${c.whatsapp}`, cls: 'wa' },
    c.email && { icon: 'fas fa-envelope', label: 'Email', href: `mailto:${c.email}`, cls: 'email' },
    c.website && { icon: 'fas fa-globe', label: 'Website', href: c.website, cls: 'web' },
  ].filter(Boolean) as { icon: string; label: string; href: string; cls: string }[];

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 style={{ flex: 1, fontSize: 15, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{c.name}</h1>
        <div className="right-actions">
          <button onClick={() => { if (navigator.share) navigator.share({ title: c.name, url: window.location.href }); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dark)', fontSize: 16, padding: 4 }}>
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>

      {/* Banner — rounded card, gradient fallback */}
      <div style={{ margin: '12px 16px 0', height: 160, borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', boxShadow: '0 8px 26px rgba(13,27,42,0.12)' }}>
        {c.banner && <img src={c.bannerUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />}
      </div>

      {/* Header card overlapping the banner: logo + name + stats */}
      <div style={{ margin: '-38px 16px 0', position: 'relative', zIndex: 5, background: '#fff', borderRadius: 20, padding: '14px 16px', boxShadow: '0 12px 30px rgba(22,32,64,.10)', border: '1px solid rgba(255,255,255,.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={c.logoUrl} alt={c.name}
            style={{ width: 68, height: 68, borderRadius: 18, objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,.14)', background: '#fff', flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)', lineHeight: 1.2 }}>{c.name}</div>
            {c.emirate && <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}><i className="fas fa-map-marker-alt" style={{ marginRight: 5, color: 'var(--primary)' }}></i>{c.emirate}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F1F2F8' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{properties.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 3 }}>Listings</div>
          </div>
          <div style={{ width: 1, background: '#F1F2F8' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{projects.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 3 }}>Projects</div>
          </div>
        </div>
      </div>

      {/* Contact — same action style as business pages */}
      {contact.length > 0 && (
        <div className="bd-actions" style={{ justifyContent: 'center' }}>
          {contact.map((b) => (
            <a key={b.label} href={b.href} className={`bd-action ${b.cls}`}
              target={b.label === 'Website' ? '_blank' : undefined} rel="noopener noreferrer">
              <div className="bd-action-icon"><i className={b.icon}></i></div>
              <span>{b.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* About */}
      {c.about && (
        <div style={{ margin: '2px 16px 14px', background: '#fff', borderRadius: 16, padding: '14px 16px', border: '1px solid #EEEDF5', boxShadow: '0 3px 12px rgba(13,27,42,0.05)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, margin: '0 0 8px', color: 'var(--dark)', textTransform: 'uppercase', letterSpacing: 0.4 }}>About</h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>{c.about}</p>
          {c.address && (
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F2F8', fontWeight: 600 }}>
              <i className="fas fa-location-dot" style={{ marginRight: 6, color: 'var(--primary)' }}></i>{c.address}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px', borderBottom: '1px solid var(--border)' }}>
        {([['listings', `Listings (${properties.length})`], ['projects', `Projects (${projects.length})`]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === key ? 800 : 500, color: tab === key ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: `2px solid ${tab === key ? 'var(--primary)' : 'transparent'}` }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '14px 16px 28px' }}>
        {tab === 'listings' ? (
          properties.length === 0 ? <Empty text="No listings yet." /> : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {properties.map((p) => (
                <Link key={p.id} to={`/realestate/properties/${p.id}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                  <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: 100, objectFit: 'cover' }} loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = PROP_FALLBACK; }} />
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)' }}>{fmtPrice(p.price, p.currency)} <small style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{priceSuffix(p.purpose, p.rent_period)}</small></div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                    {p.location && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{p.location}</div>}
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          projects.length === 0 ? <Empty text="No projects yet." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {projects.map((p) => (
                <Link key={p.id} to={`/realestate/projects/${p.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: 110, height: 90, objectFit: 'cover', flexShrink: 0 }} loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = PROP_FALLBACK; }} />
                  <div style={{ padding: '10px 12px 10px 0', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary)', background: 'rgba(var(--primary-rgb),.1)', padding: '2px 8px', borderRadius: 50 }}>OFF-PLAN</span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 5 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{p.location} · Handover {p.handover}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>From {fmtPrice(p.starting_price, p.currency)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>{text}</div>;
}
