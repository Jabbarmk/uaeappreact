import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { fmtFee } from '../constants/education';
import CourseThumb from '../components/CourseThumb';

export default function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [catFilter, setCatFilter] = useState<number | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['university', id],
    queryFn: () => api.get(`/universities/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.university) return <div style={{ padding: 40 }}>Not found. <Link to="/universities">Back</Link></div>;

  const u = data.university;
  const categories: any[] = data.categories || [];
  let groups: any[] = data.levelGroups || [];
  if (catFilter) groups = groups.map((g) => ({ ...g, items: g.items.filter((c: any) => c.course_category_id === catFilter) })).filter((g) => g.items.length);

  const contacts = [
    u.phone && { icon: 'fas fa-phone', href: `tel:${u.phone}`, label: 'Call', bg: 'var(--primary)' },
    u.whatsapp && { icon: 'fab fa-whatsapp', href: `https://wa.me/${u.whatsapp}`, label: 'WhatsApp', bg: '#00B894' },
    u.website && { icon: 'fas fa-globe', href: u.website, label: 'Website', bg: 'var(--dark)' },
  ].filter(Boolean) as any[];

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 style={{ flex: 1, fontSize: 15, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{u.name}</h1>
        <div className="right-actions"><i className="fas fa-share-alt"></i></div>
      </div>

      {/* Banner + logo */}
      <div style={{ position: 'relative' }}>
        <div style={{ height: 140, background: 'linear-gradient(135deg,var(--primary),var(--accent))', overflow: 'hidden' }}>
          {u.image && <img src={u.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }} loading="lazy" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, padding: '0 16px', marginTop: -40 }}>
          <img src={u.logoUrl} alt={u.name} style={{ width: 84, height: 84, borderRadius: 18, objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 6px 20px rgba(0,0,0,.15)', background: '#fff', flexShrink: 0 }} />
          <div style={{ paddingBottom: 8, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{u.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{u.institution_icon} {u.institution_type || 'University'}{u.emirate ? ` · ${u.emirate}` : ''}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 16px 6px' }}>
        {[[data.courseCount, 'Courses'], [u.rating ? Number(u.rating).toFixed(1) : '—', 'Rating'], [u.established_year || '—', 'Established']].map(([v, l], i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 14, padding: '12px 6px', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{v as any}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{l as any}</div>
          </div>
        ))}
      </div>

      {contacts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, padding: '6px 16px 10px' }}>
          {contacts.map((b) => (
            <a key={b.label} href={b.href} target={b.label === 'Website' ? '_blank' : undefined} rel="noopener noreferrer"
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px', background: b.bg, color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
              <i className={b.icon} style={{ fontSize: 16 }}></i>{b.label}
            </a>
          ))}
        </div>
      )}

      {u.about && (
        <div style={{ padding: '4px 16px 12px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>About</h3>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{u.about}</p>
          {u.ranking && <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, marginTop: 8 }}>🏆 {u.ranking}{u.campus_size ? ` · 🏫 ${u.campus_size}` : ''}</div>}
        </div>
      )}

      {/* Category filter */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 16px 12px', scrollbarWidth: 'none' }}>
          <button onClick={() => setCatFilter(null)} style={chip(catFilter === null)}>All</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCatFilter(c.id)} style={chip(catFilter === c.id)}>{c.icon} {c.name}</button>
          ))}
        </div>
      )}

      {/* Courses grouped by study level */}
      <div style={{ padding: '0 16px 28px' }}>
        {groups.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-secondary)' }}>No courses listed.</div>
        ) : groups.map((g) => (
          <div key={g.levelId} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', margin: '6px 0 10px' }}>{g.icon} {g.level}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map((c: any) => (
                <Link key={c.id} to={`/universities/courses/${c.id}`}
                  style={{ display: 'flex', gap: 12, background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,.06)', textDecoration: 'none' }}>
                  <CourseThumb url={c.imageUrl} icon={c.category_icon} w={52} h={52} radius={11} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{c.category_icon} {c.category_name}{c.specialisation ? ` · ${c.specialisation}` : ''}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>{[c.duration, c.study_mode, c.delivery].filter(Boolean).join(' · ')}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{fmtFee(c.fee_per_year, c.currency)}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-light)' }}>/ year</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function chip(active: boolean): React.CSSProperties {
  return {
    flexShrink: 0, padding: '6px 13px', borderRadius: 50, cursor: 'pointer',
    border: `1.5px solid ${active ? 'var(--primary)' : 'rgba(108,92,231,.2)'}`,
    background: active ? 'var(--primary)' : '#fff', color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'inherit',
  };
}
