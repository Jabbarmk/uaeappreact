import { Link } from 'react-router-dom';

// Subtle per-specialty accent (used for the specialty dot / hub circles).
const DOC_COLORS = [
  { bg: '#0E9F6E', soft: '#E7F8F1' },
  { bg: '#E14C8B', soft: '#FDEEF3' },
  { bg: '#1D6FE0', soft: '#EAF2FE' },
  { bg: '#E8890C', soft: '#FEF4E6' },
  { bg: 'var(--primary)', soft: '#F1EEFE' },
  { bg: '#00A5B8', soft: '#E4F6F9' },
];
export function docColor(specialtyId?: number) {
  return DOC_COLORS[(Number(specialtyId) || 0) % DOC_COLORS.length];
}

const BLUE = '#007AFF';
const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop';

// Apple-clean doctor card. Tap the card → details (onOpen). Hospital name + Book → hospital page.
export default function DoctorCard({ d, onOpen, showHospital = true }: { d: any; onOpen: (d: any) => void; showHospital?: boolean }) {
  const c = docColor(d.specialty_id);
  const avail = String(d.availability || '');
  const availToday = /today/i.test(avail);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div onClick={() => onOpen(d)}
      style={{ background: '#fff', borderRadius: 20, boxShadow: '0 1px 4px rgba(0,0,0,.05)', cursor: 'pointer', overflow: 'hidden', WebkitTapHighlightColor: 'transparent' }}>
      <div style={{ display: 'flex', gap: 13, padding: '14px 14px 12px', position: 'relative' }}>
        <div style={{ width: 66, height: 66, borderRadius: 16, overflow: 'hidden', flexShrink: 0, background: c.soft }}>
          {d.photoUrl
            ? <img src={d.photoUrl} alt={d.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK; }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🧑‍⚕️</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E', letterSpacing: '-0.2px', lineHeight: 1.2 }}>{d.name}</div>
          <div style={{ fontSize: 13.5, color: '#8E8E93', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.bg, flexShrink: 0 }} />{d.specialty_name}
          </div>
          {showHospital && d.hospital_name && (
            <Link to={`/businesses/${d.business_id}`} onClick={stop} style={{ fontSize: 13.5, color: BLUE, fontWeight: 500, textDecoration: 'none', marginTop: 3, display: 'inline-block' }}>
              {d.hospital_name}
            </Link>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 7, fontSize: 12.5, color: '#8E8E93', flexWrap: 'wrap' }}>
            <span style={{ color: '#1C1C1E', fontWeight: 600 }}><i className="fas fa-star" style={{ color: '#FFB100' }}></i> {Number(d.rating || 0).toFixed(1)} <span style={{ color: '#8E8E93', fontWeight: 400 }}>({d.review_count})</span></span>
            {d.distance && <span><i className="fas fa-location-dot" style={{ opacity: .6 }}></i> {d.distance}</span>}
          </div>
          {avail && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 12, fontWeight: 600, color: availToday ? '#0E9F6E' : c.bg, background: availToday ? '#E7F8F1' : c.soft, padding: '3px 9px', borderRadius: 8 }}>
              <i className={availToday ? 'far fa-calendar-check' : 'far fa-clock'}></i> {avail}
            </div>
          )}
        </div>
        <button aria-label="favourite" onClick={stop} style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%', background: '#F2F2F7', border: 'none', color: '#C7C7CC', fontSize: 14, cursor: 'pointer' }}>
          <i className="far fa-heart"></i>
        </button>
      </div>
      <div style={{ borderTop: '1px solid #F0F0F3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
        <div style={{ fontSize: 15, color: '#1C1C1E' }}><span style={{ color: '#8E8E93', fontSize: 12.5 }}>Consultation</span> <strong style={{ fontWeight: 700 }}>{d.currency || 'AED'} {Number(d.consultation_fee || 0).toLocaleString()}</strong></div>
        <Link to={`/businesses/${d.business_id}`} onClick={stop} style={{ background: BLUE, color: '#fff', borderRadius: 12, padding: '9px 18px', fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.2px' }}>Book</Link>
      </div>
    </div>
  );
}
