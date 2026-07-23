import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { fmtFee, fmtDate } from '../constants/education';
import CourseThumb from '../components/CourseThumb';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => api.get(`/universities/courses/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.item) return <div style={{ padding: 40 }}>Not found. <Link to="/universities">Back</Link></div>;

  const c = data.item;
  const rows: [string, unknown][] = [
    ['University', c.university_name],
    ['Course Category', c.category_name],
    ['Study Level', c.level_name],
    ['Specialisation', c.specialisation],
    ['Duration', c.duration],
    ['Study Mode', c.study_mode],
    ['Delivery', c.delivery],
    ['Location', c.location || c.university_emirate],
    ['Intake', c.intake],
    ['Eligibility', c.eligibility],
    ['Application Deadline', c.application_deadline ? fmtDate(c.application_deadline) : null],
    ['Accreditation', c.accreditation],
    ['Scholarships', c.scholarships],
  ];

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1 style={{ flex: 1, fontSize: 15, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{c.name}</h1>
        <div className="right-actions"><i className="fas fa-share-alt"></i></div>
      </div>

      {/* Course image (or common-icon fallback) */}
      <CourseThumb url={c.imageUrl} icon={c.category_icon} w="100%" h={200} radius={0} />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', padding: '20px 18px', color: '#fff' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,.2)', padding: '3px 10px', borderRadius: 50 }}>{c.level_icon} {c.level_name}</span>
          {c.category_name && <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,.2)', padding: '3px 10px', borderRadius: 50 }}>{c.category_icon} {c.category_name}</span>}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>{c.name}</div>
        <Link to={`/universities/${c.university_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#fff', textDecoration: 'none' }}>
          <img src={c.universityLogoUrl} alt="" style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover', background: '#fff' }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{c.university_name} ›</span>
        </Link>
      </div>

      {/* Fee highlight */}
      <div style={{ display: 'flex', gap: 10, padding: '16px' }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '14px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>PER YEAR</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', marginTop: 3 }}>{fmtFee(c.fee_per_year, c.currency)}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '14px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL TUITION</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginTop: 3 }}>{fmtFee(c.total_fee, c.currency)}</div>
        </div>
      </div>

      {/* Details table */}
      <div style={{ padding: '0 16px' }}>
        <div className="detail-table">
          <h3>Course Details</h3>
          {rows.filter(([, v]) => v).map(([label, value]) => (
            <div className="detail-row" key={label}>
              <span className="dt-label">{label}</span>
              <span className="dt-value">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Apply / contact (uses the university's contact) */}
      <div style={{ display: 'flex', gap: 10, padding: '16px' }}>
        <a href={c.website || '#'} target="_blank" rel="noopener noreferrer" style={{ flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'var(--primary)', color: '#fff', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          <i className="fas fa-paper-plane"></i> Apply / Enquire
        </a>
        <a href={c.whatsapp ? `https://wa.me/${c.whatsapp}` : '#'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'linear-gradient(135deg,#00B894,#00CEC9)', color: '#fff', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          <i className="fab fa-whatsapp" style={{ fontSize: 18 }}></i>
        </a>
        <a href={c.phone ? `tel:${c.phone}` : '#'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'var(--white)', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          <i className="fas fa-phone" style={{ fontSize: 16 }}></i>
        </a>
      </div>
      <div style={{ height: 20 }} />
    </>
  );
}
