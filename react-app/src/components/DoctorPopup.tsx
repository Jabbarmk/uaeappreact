import { docColor } from './DoctorCard';

const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop';

export default function DoctorPopup({ doctor: d, onClose }: { doctor: any; onClose: () => void }) {
  const c = docColor(d.specialty_id);
  const wa = d.hospital_whatsapp ? `https://wa.me/${String(d.hospital_whatsapp).replace(/\D/g, '')}` : null;
  const phone = d.hospital_phone ? `tel:${d.hospital_phone}` : null;
  const rows: [string, unknown][] = [
    ['Specialty', d.specialty_name],
    ['Qualification', d.qualification],
    ['Experience', d.experience_years ? `${d.experience_years} years` : null],
    ['Languages', d.languages],
    ['Gender', d.gender],
    ['Clinic / Hospital', d.hospital_name],
    ['Location', d.hospital_address || d.hospital_emirate],
    ['Availability', d.availability],
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,16,34,.55)', zIndex: 900, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 14px', overflowY: 'auto', backdropFilter: 'blur(2px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,.3)', fontFamily: "'Segoe UI',Inter,sans-serif" }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${c.bg}, ${c.bg}cc)`, padding: '20px 18px 18px', color: '#fff', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.25)', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 78, height: 78, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,.7)', background: '#fff', flexShrink: 0 }}>
              {d.photoUrl
                ? <img src={d.photoUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK; }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>🧑‍⚕️</div>}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{d.name}</div>
              <div style={{ fontSize: 13, opacity: 0.95, marginTop: 2 }}>{d.specialty_icon} {d.specialty_name}</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}><i className="fas fa-star" style={{ color: '#FFD54F' }}></i> {Number(d.rating || 0).toFixed(1)} ({d.review_count}) · {d.experience_years}y exp</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 18px 20px' }}>
          {/* Fee + availability */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, background: '#F7F8FC', borderRadius: 12, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>CONSULTATION</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.bg, marginTop: 2 }}>{d.currency || 'AED'} {Number(d.consultation_fee || 0).toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, background: '#F7F8FC', borderRadius: 12, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>AVAILABILITY</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>{d.availability || '—'}</div>
            </div>
          </div>

          {d.about && <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)', margin: '0 0 14px' }}>{d.about}</p>}

          <div style={{ border: '1px solid #EEF0F6', borderRadius: 12, overflow: 'hidden' }}>
            {rows.filter(([, v]) => v).map(([label, value], i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 13px', fontSize: 13, background: i % 2 ? '#FAFBFD' : '#fff' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ color: 'var(--dark)', fontWeight: 600, textAlign: 'right' }}>{String(value)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <a href={wa || phone || '#'} target={wa ? '_blank' : undefined} rel="noreferrer" style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 13, background: '#FF5A5F', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              <i className="far fa-calendar-check"></i> Book Appointment
            </a>
            {wa && <a href={wa} target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 13, background: 'linear-gradient(135deg,#00B894,#00CEC9)', color: '#fff', borderRadius: 12, fontSize: 16, textDecoration: 'none' }}><i className="fab fa-whatsapp"></i></a>}
            {phone && <a href={phone} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 13, background: '#fff', color: c.bg, border: `2px solid ${c.bg}`, borderRadius: 12, fontSize: 15, textDecoration: 'none' }}><i className="fas fa-phone"></i></a>}
          </div>
        </div>
      </div>
    </div>
  );
}
