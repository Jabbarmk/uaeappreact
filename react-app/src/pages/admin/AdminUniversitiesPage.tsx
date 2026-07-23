import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const FONT = "'Segoe UI','Inter',system-ui,sans-serif";
const ACCENT = '#0067C0';
const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];

export default function AdminUniversitiesPage() {
  const qc = useQueryClient();
  const [editId, setEditId] = useState<number | null>(null);
  const [coursesId, setCoursesId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-universities'], queryFn: () => api.get('/admin/universities').then((r) => r.data) });
  const { data: meta } = useQuery({ queryKey: ['admin-universities-meta'], queryFn: () => api.get('/admin/universities/meta').then((r) => r.data) });

  const rows: any[] = data?.rows || [];
  const editing = rows.find((r) => r.id === editId);
  const managing = rows.find((r) => r.id === coursesId);

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Universities</h2>
          <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
            Set the institution type to mark a business as a university, then <strong>Manage Courses</strong> to pick catalog courses and set each one's fee &amp; details. Manage the shared course list under <Link to="/admin/courses" style={{ color: ACCENT }}>Courses</Link>.
          </div>
        </div>
        <span style={{ fontSize: 13, color: '#888' }}>{rows.length} in category</span>
      </div>

      {isLoading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', color: '#555' }}>
          No businesses in the Universities category yet. Add one under <Link to="/admin/businesses" style={{ color: ACCENT }}>Businesses</Link> (category = Universities).
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={r.logoUrl} alt="" style={{ width: 44, height: 44, borderRadius: 9, objectFit: 'cover', background: '#EEF1F5', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {r.is_university
                    ? <><span style={{ color: '#2E7D32', fontWeight: 600 }}>● University</span>{r.institution_type ? ` · ${r.institution_type}` : ''} · {r.course_count} course{r.course_count !== 1 ? 's' : ''}</>
                    : <span style={{ color: '#F57C00' }}>Not set up as a university yet</span>}
                  {r.emirate ? ` · ${r.emirate}` : ''}
                </div>
              </div>
              {r.is_university && (
                <button onClick={() => setCoursesId(r.id)} style={{ padding: '6px 12px', border: '1px solid #A5D6A7', color: '#2E7D32', background: '#F1F8F1', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>
                  Manage Courses ({r.course_count})
                </button>
              )}
              <button onClick={() => setEditId(r.id)} style={{ padding: '6px 14px', border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>
                {r.is_university ? 'Edit' : 'Set up'}
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && meta && (
        <SetupModal business={editing} institutionTypes={meta.institutionTypes || []} onClose={() => setEditId(null)}
          onSaved={() => { qc.invalidateQueries({ queryKey: ['admin-universities'] }); qc.invalidateQueries({ queryKey: ['admin-universities-meta'] }); setEditId(null); }} />
      )}
      {managing && (
        <ManageCoursesModal business={managing} onClose={() => setCoursesId(null)}
          onChanged={() => qc.invalidateQueries({ queryKey: ['admin-universities'] })} />
      )}
    </div>
  );
}

const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', border: '1px solid #E0E0E0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
const lbl = (t: string) => <label style={{ fontSize: 11, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t}</label>;
const modalWrap: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto' };

// ── Institution setup modal ───────────────────────────────────────────────────
function SetupModal({ business, institutionTypes, onClose, onSaved }: { business: any; institutionTypes: any[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ institution_type_id: '', ranking: '', campus_size: '', established_year: '' });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setForm({ institution_type_id: String(business.institution_type_id || ''), ranking: business.ranking || '', campus_size: business.campus_size || '', established_year: business.established_year != null ? String(business.established_year) : '' });
  }, [business]);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/universities/${business.id}`, { institution_type_id: form.institution_type_id || null, ranking: form.ranking || null, campus_size: form.campus_size || null, established_year: form.established_year || null });
      onSaved();
    } finally { setLoading(false); }
  };
  return (
    <div onClick={onClose} style={{ ...modalWrap, alignItems: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 460, padding: 22, fontFamily: FONT }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>University Setup</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{business.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>{lbl('Institution Type')}
            <select value={form.institution_type_id} onChange={(e) => set('institution_type_id', e.target.value)} style={inp}>
              <option value="">— Select —</option>
              {institutionTypes.map((it: any) => <option key={it.id} value={String(it.id)}>{it.name}</option>)}
            </select>
          </div>
          <div>{lbl('Ranking')}<input value={form.ranking} onChange={(e) => set('ranking', e.target.value)} placeholder="Top 50 in the GCC" style={inp} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Campus Size')}<input value={form.campus_size} onChange={(e) => set('campus_size', e.target.value)} placeholder="120 acres" style={inp} /></div>
            <div>{lbl('Established Year')}<input value={form.established_year} onChange={(e) => set('established_year', e.target.value)} type="number" placeholder="1998" style={inp} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} style={{ padding: '9px 16px', border: '1px solid #E0E0E0', background: '#fff', color: '#555', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Cancel</button>
            <button onClick={save} disabled={loading} style={{ padding: '9px 20px', border: 'none', background: ACCENT, color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>{loading ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Manage Courses modal (offerings for one university) ───────────────────────
const emptyOffer = { course_id: '', total_fee: '', fee_per_year: '', currency: 'AED', study_mode: '', delivery: '', location: '', emirate: '', intake: '', eligibility: '', application_deadline: '', accreditation: '', scholarships: '', is_featured: '0', is_active: '1' };

function ManageCoursesModal({ business, onClose, onChanged }: { business: any; onClose: () => void; onChanged: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({ ...emptyOffer });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data: offeringsData, refetch } = useQuery({ queryKey: ['uni-offerings', business.id], queryFn: () => api.get(`/admin/universities/${business.id}/courses`).then((r) => r.data) });
  const { data: catalog } = useQuery({ queryKey: ['courses-catalog'], queryFn: () => api.get('/admin/courses?page=1&pageSize=1000').then((r) => r.data.rows as any[]) });
  const offerings: any[] = offeringsData?.rows || [];
  const catalogCourses: any[] = catalog || [];

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const startAdd = () => { setForm({ ...emptyOffer }); setEditingId(null); setShowForm(true); };
  const startEdit = (o: any) => {
    setForm({
      course_id: String(o.course_id), total_fee: o.total_fee != null ? String(o.total_fee) : '', fee_per_year: o.fee_per_year != null ? String(o.fee_per_year) : '',
      currency: o.currency || 'AED', study_mode: o.study_mode || '', delivery: o.delivery || '', location: o.location || '', emirate: o.emirate || '',
      intake: o.intake || '', eligibility: o.eligibility || '', application_deadline: o.application_deadline ? String(o.application_deadline).slice(0, 10) : '',
      accreditation: o.accreditation || '', scholarships: o.scholarships || '', is_featured: String(o.is_featured || 0), is_active: String(o.is_active ?? 1),
    });
    setEditingId(o.id); setShowForm(true);
  };

  const save = async () => {
    if (!form.course_id) return;
    setSaving(true);
    try {
      const payload = { ...form, is_featured: Number(form.is_featured), is_active: Number(form.is_active) };
      if (editingId) await api.put(`/admin/university-courses/${editingId}`, payload);
      else await api.post(`/admin/universities/${business.id}/courses`, payload);
      setShowForm(false); setEditingId(null); setForm({ ...emptyOffer });
      await refetch(); onChanged();
    } finally { setSaving(false); }
  };
  const remove = async (id: number) => {
    if (!confirm('Remove this course from the university?')) return;
    await api.delete(`/admin/university-courses/${id}`);
    await refetch(); onChanged(); qc.invalidateQueries({ queryKey: ['uni-offerings', business.id] });
  };

  // Courses not yet offered (for the add dropdown).
  const offeredIds = new Set(offerings.map((o) => o.course_id));
  const available = editingId ? catalogCourses : catalogCourses.filter((c) => !offeredIds.has(c.id));

  return (
    <div onClick={onClose} style={modalWrap}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 640, padding: 22, fontFamily: FONT }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Manage Courses</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>{business.name}</div>

        {!showForm && (
          <>
            <button onClick={startAdd} style={{ marginBottom: 12, padding: '8px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>+ Add Course</button>
            {offerings.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13, background: '#F9FAFC', borderRadius: 10 }}>No courses offered yet. Click "Add Course".</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '50vh', overflowY: 'auto' }}>
                {offerings.map((o) => (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid #ECEFF3', borderRadius: 10 }}>
                    <span style={{ fontSize: 16 }}>{o.level_icon || '📘'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{o.course_name}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{o.level_name}{o.category_name ? ` · ${o.category_name}` : ''} · {o.fee_per_year ? `${o.currency} ${Number(o.fee_per_year).toLocaleString()}/yr` : 'no fee'}{Number(o.is_active) ? '' : ' · hidden'}</div>
                    </div>
                    <button onClick={() => startEdit(o)} style={{ padding: '4px 10px', border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Edit</button>
                    <button onClick={() => remove(o.id)} style={{ padding: '4px 10px', border: '1px solid #F1BBBB', color: '#C42B1C', background: '#FDF3F2', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showForm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div>{lbl('Course *')}
              <select value={form.course_id} onChange={(e) => set('course_id', e.target.value)} disabled={!!editingId} style={inp}>
                <option value="">— Select a catalog course —</option>
                {available.map((c) => <option key={c.id} value={String(c.id)}>{c.name}{c.duration ? ` (${c.duration})` : ''}</option>)}
              </select>
              {!editingId && <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>Not listed? Add it first under <Link to="/admin/courses" style={{ color: ACCENT }}>Courses</Link>.</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 10 }}>
              <div>{lbl('Total Fee')}<input value={form.total_fee} onChange={(e) => set('total_fee', e.target.value)} type="number" style={inp} /></div>
              <div>{lbl('Fee / Year')}<input value={form.fee_per_year} onChange={(e) => set('fee_per_year', e.target.value)} type="number" style={inp} /></div>
              <div>{lbl('Currency')}<input value={form.currency} onChange={(e) => set('currency', e.target.value)} style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{lbl('Study Mode')}<select value={form.study_mode} onChange={(e) => set('study_mode', e.target.value)} style={inp}><option value="">—</option>{['Full-time', 'Part-time'].map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div>{lbl('Delivery')}<select value={form.delivery} onChange={(e) => set('delivery', e.target.value)} style={inp}><option value="">—</option>{['On campus', 'Online', 'Hybrid'].map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div>{lbl('Location')}<input value={form.location} onChange={(e) => set('location', e.target.value)} style={inp} /></div>
              <div>{lbl('Emirate')}<select value={form.emirate} onChange={(e) => set('emirate', e.target.value)} style={inp}><option value="">—</option>{EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}</select></div>
              <div>{lbl('Intake')}<input value={form.intake} onChange={(e) => set('intake', e.target.value)} placeholder="September 2026" style={inp} /></div>
              <div>{lbl('Application Deadline')}<input type="date" value={form.application_deadline} onChange={(e) => set('application_deadline', e.target.value)} style={inp} /></div>
            </div>
            <div>{lbl('Eligibility')}<input value={form.eligibility} onChange={(e) => set('eligibility', e.target.value)} style={inp} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{lbl('Accreditation')}<input value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} style={inp} /></div>
              <div>{lbl('Scholarships')}<select value={form.scholarships} onChange={(e) => set('scholarships', e.target.value)} style={inp}><option value="">—</option>{['Available', 'Not Available'].map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
            </div>
            <div style={{ display: 'flex', gap: 18 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#444', cursor: 'pointer' }}><input type="checkbox" checked={form.is_featured === '1'} onChange={(e) => set('is_featured', e.target.checked ? '1' : '0')} /> Featured</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#444', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active === '1'} onChange={(e) => set('is_active', e.target.checked ? '1' : '0')} /> Active</label>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ padding: '9px 16px', border: '1px solid #E0E0E0', background: '#fff', color: '#555', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Back</button>
              <button onClick={save} disabled={saving || !form.course_id} style={{ padding: '9px 20px', border: 'none', background: ACCENT, color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: (saving || !form.course_id) ? 'default' : 'pointer', fontFamily: FONT, opacity: (saving || !form.course_id) ? 0.6 : 1 }}>{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Course'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
