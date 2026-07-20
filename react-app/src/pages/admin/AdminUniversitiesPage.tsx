import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const FONT = "'Segoe UI','Inter',system-ui,sans-serif";
const ACCENT = '#0067C0';

export default function AdminUniversitiesPage() {
  const qc = useQueryClient();
  const [editId, setEditId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-universities'],
    queryFn: () => api.get('/admin/universities').then((r) => r.data),
  });
  const { data: meta } = useQuery({
    queryKey: ['admin-universities-meta'],
    queryFn: () => api.get('/admin/universities/meta').then((r) => r.data),
  });

  const rows: any[] = data?.rows || [];
  const editing = rows.find((r) => r.id === editId);

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Universities</h2>
          <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
            Businesses in the <strong>Universities</strong> category. Set the institution type to mark one as a university (then add its courses under <Link to="/admin/courses" style={{ color: ACCENT }}>Courses</Link>).
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
                  {r.is_university ? (
                    <><span style={{ color: '#2E7D32', fontWeight: 600 }}>● University</span>{r.institution_type ? ` · ${r.institution_type}` : ''} · {r.course_count} course{r.course_count !== 1 ? 's' : ''}</>
                  ) : (
                    <span style={{ color: '#F57C00' }}>Not set up as a university yet</span>
                  )}
                  {r.emirate ? ` · ${r.emirate}` : ''}
                </div>
              </div>
              <button onClick={() => setEditId(r.id)} style={{ padding: '6px 14px', border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>
                {r.is_university ? 'Edit' : 'Set up'}
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && meta && (
        <EditModal
          business={editing}
          institutionTypes={meta.institutionTypes || []}
          onClose={() => setEditId(null)}
          onSaved={() => { qc.invalidateQueries({ queryKey: ['admin-universities'] }); qc.invalidateQueries({ queryKey: ['admin-universities-meta'] }); setEditId(null); }}
        />
      )}
    </div>
  );
}

function EditModal({ business, institutionTypes, onClose, onSaved }: { business: any; institutionTypes: any[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ institution_type_id: '', ranking: '', campus_size: '', established_year: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      institution_type_id: String(business.institution_type_id || ''),
      ranking: business.ranking || '',
      campus_size: business.campus_size || '',
      established_year: business.established_year != null ? String(business.established_year) : '',
    });
  }, [business]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/universities/${business.id}`, {
        institution_type_id: form.institution_type_id || null,
        ranking: form.ranking || null,
        campus_size: form.campus_size || null,
        established_year: form.established_year || null,
      });
      onSaved();
    } finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', border: '1px solid #E0E0E0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (t: string) => <label style={{ fontSize: 11, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t}</label>;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
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
