import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

const TEAL = '#0E7C86';
const TEAL_DARK = '#0A5C64';
const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop';
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const to12 = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${ap}`;
};

// Slide-up bottom sheet with a photo-hero header + the doctor's full details.
export default function DoctorPopup({ doctor: d, onClose }: { doctor: any; onClose: () => void }) {
  const wa = d.hospital_whatsapp ? `https://wa.me/${String(d.hospital_whatsapp).replace(/\D/g, '')}` : null;
  const phone = d.hospital_phone ? `tel:${d.hospital_phone}` : null;
  const rating = Number(d.rating || 0).toFixed(1);

  // ── Booking schedule ──────────────────────────────────────────────
  const workDays = useMemo(() => new Set(String(d.work_days || '1,2,3,4,5').split(',').map((s: string) => Number(s.trim()))), [d.work_days]);
  const slotList = useMemo(() => String(d.slots || '').split(',').map((s: string) => s.trim()).filter(Boolean), [d.slots]);
  const days = useMemo(() => {
    const base = new Date(); base.setHours(0, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => { const dt = new Date(base); dt.setDate(base.getDate() + i); return dt; });
  }, []);
  const firstAvail = days.findIndex((dt) => workDays.has(dt.getDay()));
  const [dateIdx, setDateIdx] = useState(firstAvail >= 0 ? firstAvail : 0);
  const [time, setTime] = useState(slotList[0] || '');

  const selDate = days[dateIdx];
  const dayAvailable = workDays.has(selDate.getDay());
  const monthLabel = selDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const bookHref = (() => {
    if (!wa || !dayAvailable || !time) return null;
    const digits = String(d.hospital_whatsapp).replace(/\D/g, '');
    const dateStr = `${WD[selDate.getDay()]}, ${selDate.getDate()} ${MO[selDate.getMonth()]} ${selDate.getFullYear()}`;
    const fee = d.consultation_fee ? `${d.currency || 'AED'} ${Number(d.consultation_fee).toLocaleString()}` : '';
    const msg = `Hi, I'd like to book an appointment:\n`
      + `👨‍⚕️ Dr. ${d.name}${d.specialty_name ? ` (${d.specialty_name})` : ''}\n`
      + `🏥 ${d.hospital_name}\n`
      + `📅 ${dateStr} · ${to12(time)}`
      + (fee ? `\n💰 ${fee}` : '');
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  })();

  const stats = [
    { icon: 'far fa-clock', value: d.experience_years ? `${d.experience_years} yrs` : '—', label: 'Experience' },
    { icon: 'far fa-comment-dots', value: d.review_count != null ? String(d.review_count) : '0', label: 'Reviews' },
    { icon: 'fas fa-star', value: rating, label: 'Rating' },
  ];
  const rows: [string, unknown][] = [
    ['Qualification', d.qualification],
    ['Languages', d.languages],
    ['Gender', d.gender],
    ['Availability', d.availability],
    ['Location', d.hospital_address || d.hospital_emirate],
  ];

  const circleBtn = (filled: boolean): React.CSSProperties => ({
    width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, textDecoration: 'none', flexShrink: 0,
    background: filled ? TEAL : 'rgba(255,255,255,.92)', color: filled ? '#fff' : TEAL,
    boxShadow: '0 6px 16px rgba(0,0,0,.18)',
  });
  const glassBtn: React.CSSProperties = {
    width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(255,255,255,.22)', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer',
    backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', textDecoration: 'none',
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 900, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'docFade .2s ease' }}>
      <style>{`@keyframes docFade{from{opacity:0}to{opacity:1}}@keyframes docSheet{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: '#F3FAFB', width: '100%', maxWidth: 480, maxHeight: '94vh', overflowY: 'auto', borderRadius: '26px 26px 0 0', animation: 'docSheet .32s cubic-bezier(.2,.8,.2,1)', fontFamily: "-apple-system,'SF Pro Text','Segoe UI',sans-serif", paddingBottom: 18 }}>

        {/* ── Photo hero ─────────────────────────────────────────── */}
        <div style={{ position: 'relative', height: 330, margin: '0 0 12px', borderRadius: 26, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {d.photoUrl
            ? <img src={d.photoUrl} alt={d.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK; }} />
            : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg,${TEAL},${TEAL_DARK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96 }}>🧑‍⚕️</div>}
          {/* teal grade + bottom fade for legibility */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(14,124,134,.30) 0%, rgba(14,124,134,.04) 32%, rgba(10,72,80,.35) 62%, rgba(8,60,66,.92) 100%)` }} />

          {/* top row */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
            <button onClick={onClose} aria-label="Close" style={glassBtn}><i className="fas fa-chevron-left"></i></button>
            <button aria-label="Favourite" style={glassBtn}><i className="far fa-heart"></i></button>
          </div>

          <div style={{ flex: 1 }} />

          {/* bottom content: name + specialty + rating, action circles */}
          <div style={{ position: 'relative', padding: '0 18px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 25, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', textShadow: '0 1px 8px rgba(0,0,0,.35)' }}>{d.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.9)', fontWeight: 500 }}>{d.specialty_name}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,.28)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  <i className="fas fa-star" style={{ color: '#FFC53D', fontSize: 12 }}></i> {rating}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {wa && <a href={wa} target="_blank" rel="noreferrer" aria-label="Chat" style={circleBtn(false)}><i className="fas fa-comment-dots"></i></a>}
              {phone && <a href={phone} aria-label="Call" style={circleBtn(false)}><i className="fas fa-phone"></i></a>}
              {wa && <a href={wa} target="_blank" rel="noreferrer" aria-label="Video call" style={circleBtn(true)}><i className="fas fa-video"></i></a>}
            </div>
          </div>
        </div>

        {/* ── Icon stats row ─────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 16px 6px' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E6F4F5', color: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                <i className={s.icon}></i>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#14343A', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11.5, color: '#8A9AA0', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '4px 18px 0' }}>
          <Link to={`/businesses/${d.business_id}`} style={{ fontSize: 13.5, color: TEAL, fontWeight: 600, textDecoration: 'none' }}>
            <i className="fas fa-hospital" style={{ marginRight: 6, opacity: .8 }}></i>{d.hospital_name} ›
          </Link>
        </div>

        {d.about && (
          <div style={{ padding: '12px 18px 0' }}>
            <div style={{ background: '#F6FAFB', borderRadius: 14, padding: 14, fontSize: 14, lineHeight: 1.55, color: '#3A4A4E' }}>{d.about}</div>
          </div>
        )}

        {/* Details list */}
        <div style={{ padding: '12px 18px 4px' }}>
          <div style={{ background: '#F6FAFB', borderRadius: 14, overflow: 'hidden' }}>
            {rows.filter(([, v]) => v).map(([label, value], i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 15px', fontSize: 14.5, borderBottom: i < arr.length - 1 ? '1px solid #E9F1F2' : 'none' }}>
                <span style={{ color: '#8A9AA0' }}>{label}</span>
                <span style={{ color: '#14343A', fontWeight: 500, textAlign: 'right' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Select date ─────────────────────────────────────────── */}
        <div style={{ padding: '18px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#14343A' }}>Select Date</div>
            <div style={{ fontSize: 12.5, color: TEAL, fontWeight: 600 }}>{monthLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '12px 18px 4px', scrollbarWidth: 'none' }}>
            {days.map((dt, i) => {
              const avail = workDays.has(dt.getDay());
              const active = i === dateIdx;
              return (
                <button key={i} disabled={!avail} onClick={() => setDateIdx(i)}
                  style={{ flexShrink: 0, width: 54, padding: '10px 0', borderRadius: 16, border: `1.5px solid ${active ? TEAL : 'transparent'}`, cursor: avail ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                    background: active ? TEAL : avail ? '#EEF5F6' : '#F5F5F5', color: active ? '#fff' : avail ? '#14343A' : '#C4CDD0', opacity: avail ? 1 : .6, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{dt.getDate()}</div>
                  <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: 600 }}>{WD[dt.getDay()]}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Select time ─────────────────────────────────────────── */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#14343A', marginBottom: 10 }}>Select Time</div>
          {!dayAvailable ? (
            <div style={{ fontSize: 13.5, color: '#8A9AA0' }}>Not available on this day — pick another date.</div>
          ) : slotList.length === 0 ? (
            <div style={{ fontSize: 13.5, color: '#8A9AA0' }}>No time slots configured.</div>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {slotList.map((s) => {
                const active = s === time;
                return (
                  <button key={s} onClick={() => setTime(s)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 22, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
                      border: `1.5px solid ${active ? TEAL : '#E1E9EA'}`, background: active ? '#E6F4F5' : '#fff', color: active ? TEAL : '#3A4A4E' }}>
                    <i className="far fa-clock" style={{ fontSize: 13, opacity: .8 }}></i> {to12(s)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Book appointment → WhatsApp */}
        <div style={{ padding: '18px 18px 0' }}>
          {bookHref ? (
            <a href={bookHref} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 16, background: TEAL, color: '#fff', borderRadius: 16, fontSize: 16, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 10px 24px rgba(14,124,134,.32)' }}>
              <i className="fab fa-whatsapp"></i> Book Appointment{d.consultation_fee ? ` · ${d.currency || 'AED'} ${Number(d.consultation_fee).toLocaleString()}` : ''}
            </a>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 16, background: '#DfE7E8', color: '#8A9AA0', borderRadius: 16, fontSize: 16, fontWeight: 700 }}>
              <i className="far fa-calendar-check"></i> {wa ? 'Select a date & time' : 'Booking unavailable'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
