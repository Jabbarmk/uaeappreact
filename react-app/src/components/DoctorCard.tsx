// Doctor card matching the reference doctors design (photo, specialty, clinic, rating, fee, book).
const DOC_COLORS = [
  { bg: '#0E9F6E', soft: '#E7F8F1' },
  { bg: '#E14C8B', soft: '#FDEEF3' },
  { bg: '#1D6FE0', soft: '#EAF2FE' },
  { bg: '#E8890C', soft: '#FEF4E6' },
  { bg: '#6C5CE7', soft: '#F1EEFE' },
  { bg: '#00A5B8', soft: '#E4F6F9' },
];

export function docColor(specialtyId?: number) {
  return DOC_COLORS[(Number(specialtyId) || 0) % DOC_COLORS.length];
}

const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop';

export default function DoctorCard({ d, onOpen, showHospital = true }: { d: any; onOpen: (d: any) => void; showHospital?: boolean }) {
  const c = docColor(d.specialty_id);
  const avail = String(d.availability || '');
  const availIsToday = /today/i.test(avail);
  return (
    <div style={{ display: 'flex', background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 16px rgba(20,30,60,.07)', border: '1px solid #EEF0F6', position: 'relative' }}>
      {/* Colored photo panel */}
      <div style={{ width: 112, flexShrink: 0, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', background: '#fff', border: '3px solid rgba(255,255,255,.6)' }}>
          {d.photoUrl
            ? <img src={d.photoUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK; }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: c.soft }}>🧑‍⚕️</div>}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, padding: '12px 14px 12px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--dark)', lineHeight: 1.2, paddingRight: 22 }}>{d.name}</div>
        </div>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: c.bg, background: c.soft, padding: '3px 9px', borderRadius: 50, marginTop: 5 }}>{d.specialty_name}</span>
        {showHospital && d.hospital_name && <div style={{ fontSize: 13, fontWeight: 600, color: c.bg, marginTop: 5 }}>{d.hospital_name}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 12, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: 'var(--dark)' }}><i className="fas fa-star" style={{ color: '#F6A609' }}></i> {Number(d.rating || 0).toFixed(1)} <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>({d.review_count})</span></span>
          {d.distance && <><span style={{ color: '#DDD' }}>|</span><span><i className="fas fa-map-marker-alt" style={{ color: c.bg }}></i> {d.distance}</span></>}
        </div>
        {avail && (
          <div style={{ fontSize: 12, fontWeight: 700, color: availIsToday ? '#0E9F6E' : c.bg, marginTop: 6 }}>
            <i className={availIsToday ? 'far fa-calendar-check' : 'far fa-clock'}></i> {avail}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>{d.currency || 'AED'} {Number(d.consultation_fee || 0).toLocaleString()}</div>
          <button onClick={() => onOpen(d)} style={{ background: '#FF5A5F', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Book Appointment</button>
        </div>
      </div>

      <button aria-label="favourite" style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: c.soft, border: 'none', color: c.bg, fontSize: 13, cursor: 'pointer' }}>
        <i className="far fa-heart"></i>
      </button>
    </div>
  );
}
