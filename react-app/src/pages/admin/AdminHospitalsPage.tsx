import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const FONT = "'Segoe UI','Inter',system-ui,sans-serif";
const ACCENT = '#0067C0';

const emptyDoc = { specialty_id: '', name: '', photo: '', qualification: '', experience_years: '', languages: '', gender: '', rating: '', review_count: '', consultation_fee: '', currency: 'AED', availability: '', distance: '', about: '', is_featured: '0', is_active: '1' };

export default function AdminHospitalsPage() {
  const qc = useQueryClient();
  const [manageId, setManageId] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['admin-hospitals'], queryFn: () => api.get('/admin/hospitals').then((r) => r.data) });
  const rows: any[] = data?.rows || [];
  const managing = rows.find((r) => r.id === manageId);

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Hospitals &amp; Clinics</h2>
          <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>Businesses in the Hospitals / Clinics categories. Open one to <strong>Manage Doctors</strong> (each doctor has a specialty, fee &amp; availability).</div>
        </div>
        <span style={{ fontSize: 13, color: '#888' }}>{rows.length} listed</span>
      </div>

      {isLoading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', color: '#555' }}>
          No Hospitals/Clinics businesses. Add one under <Link to="/admin/businesses" style={{ color: ACCENT }}>Businesses</Link> (category = Hospitals or Clinics).
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={r.logoUrl} alt="" style={{ width: 44, height: 44, borderRadius: 9, objectFit: 'cover', background: '#EEF1F5', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{r.category_name}{r.emirate ? ` · ${r.emirate}` : ''} · {r.doctor_count} doctor{r.doctor_count !== 1 ? 's' : ''}</div>
              </div>
              <button onClick={() => setManageId(r.id)} style={{ padding: '6px 14px', border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>Manage Doctors ({r.doctor_count})</button>
            </div>
          ))}
        </div>
      )}

      {managing && <ManageDoctorsModal hospital={managing} onClose={() => setManageId(null)} onChanged={() => qc.invalidateQueries({ queryKey: ['admin-hospitals'] })} />}
    </div>
  );
}

const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', border: '1px solid #E0E0E0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
const lbl = (t: string) => <label style={{ fontSize: 11, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t}</label>;

function ManageDoctorsModal({ hospital, onClose, onChanged }: { hospital: any; onClose: () => void; onChanged: () => void }) {
  const [form, setForm] = useState<Record<string, string>>({ ...emptyDoc });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, refetch } = useQuery({ queryKey: ['hospital-doctors', hospital.id], queryFn: () => api.get(`/admin/hospitals/${hospital.id}/doctors`).then((r) => r.data) });
  const { data: meta } = useQuery({ queryKey: ['doctors-meta'], queryFn: () => api.get('/admin/doctors/meta').then((r) => r.data) });
  const doctors: any[] = data?.rows || [];
  const specialties: any[] = meta?.specialties || [];

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const startAdd = () => { setForm({ ...emptyDoc }); setEditingId(null); setShowForm(true); };
  const startEdit = (d: any) => {
    const f: Record<string, string> = { ...emptyDoc };
    Object.keys(emptyDoc).forEach((k) => { f[k] = d[k] != null ? String(d[k]) : (k === 'currency' ? 'AED' : k === 'is_active' ? '1' : k === 'is_featured' ? '0' : ''); });
    setForm(f); setEditingId(d.id); setShowForm(true);
  };

  const uploadPhoto = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try { const fd = new FormData(); fd.append('file', file); const r = await api.post('/admin/upload/doctors', fd); set('photo', r.data.filename); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, is_featured: Number(form.is_featured), is_active: Number(form.is_active) };
      if (editingId) await api.put(`/admin/doctors/${editingId}`, payload);
      else await api.post(`/admin/hospitals/${hospital.id}/doctors`, payload);
      setShowForm(false); setEditingId(null); setForm({ ...emptyDoc });
      await refetch(); onChanged();
    } finally { setSaving(false); }
  };
  const remove = async (id: number) => { if (!confirm('Remove this doctor?')) return; await api.delete(`/admin/doctors/${id}`); await refetch(); onChanged(); };

  const photoUrl = form.photo ? (form.photo.startsWith('http') ? form.photo : `/assets/uploads/doctors/${form.photo}`) : '';

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '28px 16px', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 640, padding: 22, fontFamily: FONT }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Manage Doctors</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>{hospital.name}</div>

        {!showForm && (
          <>
            <button onClick={startAdd} style={{ marginBottom: 12, padding: '8px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>+ Add Doctor</button>
            {doctors.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13, background: '#F9FAFC', borderRadius: 10 }}>No doctors yet. Click "Add Doctor".</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '52vh', overflowY: 'auto' }}>
                {doctors.map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: '1px solid #ECEFF3', borderRadius: 10 }}>
                    <img src={d.photoUrl || '/assets/images/placeholder.jpg'} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#EEF1F5', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{d.specialty_icon} {d.specialty_name || '—'} · {d.currency} {d.consultation_fee} · ★ {d.rating}{Number(d.is_active) ? '' : ' · hidden'}</div>
                    </div>
                    <button onClick={() => startEdit(d)} style={{ padding: '4px 10px', border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Edit</button>
                    <button onClick={() => remove(d.id)} style={{ padding: '4px 10px', border: '1px solid #F1BBBB', color: '#C42B1C', background: '#FDF3F2', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showForm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div onClick={() => fileRef.current?.click()} style={{ width: 64, height: 64, borderRadius: '50%', border: '1px dashed #BBB', background: photoUrl ? `center/cover no-repeat url(${photoUrl})` : '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: ACCENT, fontSize: 20, flexShrink: 0 }}>{!photoUrl && '+'}</div>
              <div style={{ flex: 1 }}>{lbl('Doctor Name *')}<input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. …" style={inp} /></div>
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files?.[0])} style={{ display: 'none' }} />
            </div>
            {uploading && <div style={{ fontSize: 11, color: ACCENT }}>Uploading photo…</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{lbl('Specialty')}<select value={form.specialty_id} onChange={(e) => set('specialty_id', e.target.value)} style={inp}><option value="">— Select —</option>{specialties.map((s) => <option key={s.id} value={String(s.id)}>{s.icon} {s.name}</option>)}</select></div>
              <div>{lbl('Qualification')}<input value={form.qualification} onChange={(e) => set('qualification', e.target.value)} placeholder="MBBS, MD" style={inp} /></div>
              <div>{lbl('Experience (years)')}<input value={form.experience_years} onChange={(e) => set('experience_years', e.target.value)} type="number" style={inp} /></div>
              <div>{lbl('Gender')}<select value={form.gender} onChange={(e) => set('gender', e.target.value)} style={inp}><option value="">—</option><option>Male</option><option>Female</option></select></div>
              <div>{lbl('Languages')}<input value={form.languages} onChange={(e) => set('languages', e.target.value)} placeholder="English, Arabic" style={inp} /></div>
              <div>{lbl('Availability')}<input value={form.availability} onChange={(e) => set('availability', e.target.value)} placeholder="Available Today / Next 4:30 PM" style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: 10 }}>
              <div>{lbl('Consultation Fee')}<input value={form.consultation_fee} onChange={(e) => set('consultation_fee', e.target.value)} type="number" style={inp} /></div>
              <div>{lbl('Distance')}<input value={form.distance} onChange={(e) => set('distance', e.target.value)} placeholder="1.2 km" style={inp} /></div>
              <div>{lbl('Currency')}<input value={form.currency} onChange={(e) => set('currency', e.target.value)} style={inp} /></div>
              <div>{lbl('Rating (0–5)')}<input value={form.rating} onChange={(e) => set('rating', e.target.value)} type="number" step="0.1" style={inp} /></div>
              <div>{lbl('Reviews')}<input value={form.review_count} onChange={(e) => set('review_count', e.target.value)} type="number" style={inp} /></div>
            </div>
            <div>{lbl('About')}<textarea value={form.about} onChange={(e) => set('about', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} /></div>
            <div style={{ display: 'flex', gap: 18 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#444', cursor: 'pointer' }}><input type="checkbox" checked={form.is_featured === '1'} onChange={(e) => set('is_featured', e.target.checked ? '1' : '0')} /> Featured</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#444', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active === '1'} onChange={(e) => set('is_active', e.target.checked ? '1' : '0')} /> Active</label>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ padding: '9px 16px', border: '1px solid #E0E0E0', background: '#fff', color: '#555', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Back</button>
              <button onClick={save} disabled={saving || !form.name.trim()} style={{ padding: '9px 20px', border: 'none', background: ACCENT, color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: (saving || !form.name.trim()) ? 'default' : 'pointer', fontFamily: FONT, opacity: (saving || !form.name.trim()) ? 0.6 : 1 }}>{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Doctor'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
