import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import TagPicker from '../../components/TagPicker';
import { VISA_STATUSES, NOTICE_PERIODS } from '../../constants/uae';

const FONT = "'Segoe UI',Inter,sans-serif";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_OPTS = MONTHS.map((m, i) => ({ value: String(i + 1), label: m }));

const CV_FIELDS = [
  { key: 'full_name', label: 'Full Name', placeholder: 'Your full name' },
  { key: 'title', label: 'Job Title', placeholder: 'e.g. Senior Software Engineer' },
  { key: 'email', label: 'Email', placeholder: 'your@email.com' },
  { key: 'phone', label: 'Phone', placeholder: '+971...' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '971...' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
  { key: 'location', label: 'Location', placeholder: 'Dubai, UAE' },
  { key: 'current_company', label: 'Current Company', placeholder: 'Company name' },
  { key: 'experience_years', label: 'Experience (Years)', placeholder: '5', type: 'number' },
];

const CV_TEXTAREA_FIELDS = [
  { key: 'education_details', label: 'Education', placeholder: 'Degree @ University | Years\n(one entry per line)' },
  { key: 'certifications', label: 'Certifications', placeholder: 'One certification per line' },
  { key: 'projects', label: 'Projects', placeholder: 'One project per line' },
];

// Fields edited via custom controls (tag pickers / selects) rather than plain inputs.
const EXTRA_KEYS = ['technical_skills', 'languages', 'visa_status', 'notice_period'];

const emptyCV: Record<string, string> = [
  ...CV_FIELDS,
  ...CV_TEXTAREA_FIELDS,
].reduce((acc, f) => ({ ...acc, [f.key]: '' }), EXTRA_KEYS.reduce((a, k) => ({ ...a, [k]: '' }), {}));

interface WorkExp {
  id: number;
  job_title: string;
  company: string;
  location?: string;
  start_month?: number;
  start_year?: number;
  end_month?: number;
  end_year?: number;
  is_current: number;
  description?: string;
}

const EMPTY_EXP = { job_title: '', company: '', location: '', start_month: '', start_year: '', end_month: '', end_year: '', is_current: false, description: '' };

function formatDate(month?: number | string, year?: number | string, isCurrent?: boolean | number) {
  if (isCurrent) return 'Present';
  const m = month ? MONTHS[Number(month) - 1] : '';
  const y = year ? String(year) : '';
  return [m, y].filter(Boolean).join(' ');
}

function WorkExpForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof EMPTY_EXP & { id?: number }>;
  onSave: (data: typeof EMPTY_EXP) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_EXP, ...initial });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #D8D8D8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const sel: React.CSSProperties = { ...inp, background: '#fff' };

  const submit = async () => {
    if (!form.job_title.trim() || !form.company.trim()) { setErr('Job title and company are required.'); return; }
    setSaving(true); setErr('');
    try { await onSave(form); }
    catch (e: any) { setErr(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ background: '#F0F7FF', border: '1px solid #B3D1F0', borderRadius: 10, padding: 16, marginBottom: 10 }}>
      {err && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 10 }}>{err}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>Job Title *</label>
            <input value={form.job_title} onChange={e => set('job_title', e.target.value)} placeholder="e.g. Software Engineer" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>Company *</label>
            <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Google" style={inp} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>Location</label>
          <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Dubai, UAE" style={inp} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          <div>
            <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>Start Month</label>
            <select value={form.start_month} onChange={e => set('start_month', e.target.value)} style={sel}>
              <option value="">–</option>
              {MONTH_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>Start Year</label>
            <input type="number" value={form.start_year} onChange={e => set('start_year', e.target.value)} placeholder="2020" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>End Month</label>
            <select value={form.end_month} onChange={e => set('end_month', e.target.value)} disabled={!!form.is_current} style={{ ...sel, opacity: form.is_current ? 0.5 : 1 }}>
              <option value="">–</option>
              {MONTH_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>End Year</label>
            <input type="number" value={form.end_year} onChange={e => set('end_year', e.target.value)} placeholder="2024" style={{ ...inp, opacity: form.is_current ? 0.5 : 1 }} disabled={!!form.is_current} />
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={!!form.is_current} onChange={e => set('is_current', e.target.checked)} />
          Currently working here
        </label>
        <div>
          <label style={{ fontSize: 11, color: '#555', fontWeight: 600, display: 'block', marginBottom: 4 }}>Description (optional)</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe your role and achievements…" rows={3} style={{ ...inp, resize: 'vertical' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={submit} disabled={saving}
          style={{ padding: '8px 20px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontFamily: FONT }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel}
          style={{ padding: '8px 16px', background: '#fff', color: '#555', border: '1px solid #D8D8D8', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function WorkExpEntry({ exp, onEdit, onDelete, expanded, onToggleDesc }: {
  exp: WorkExp;
  onEdit: () => void;
  onDelete: () => void;
  expanded: boolean;
  onToggleDesc: () => void;
}) {
  const start = formatDate(exp.start_month, exp.start_year);
  const end = formatDate(exp.end_month, exp.end_year, exp.is_current);
  const dateStr = [start, end].filter(Boolean).join(' – ');

  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid #F0F0F0', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{exp.job_title}</div>
          <div style={{ fontSize: 13, color: '#0067C0', fontWeight: 600, marginTop: 1 }}>{exp.company}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
            {dateStr && <span style={{ fontSize: 11, color: '#888' }}>{dateStr}</span>}
            {exp.location && <span style={{ fontSize: 11, color: '#aaa' }}>· {exp.location}</span>}
            {exp.description && (
              <button onClick={onToggleDesc}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#0067C0', padding: '0 2px', lineHeight: 1, fontWeight: 700 }}>
                {expanded ? '−' : '+'}
              </button>
            )}
          </div>
          {expanded && exp.description && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#444', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {exp.description}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={onEdit} title="Edit"
            style={{ background: 'none', border: '1px solid #D8D8D8', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer', color: '#555' }}>✎</button>
          <button onClick={onDelete} title="Delete"
            style={{ background: 'none', border: '1px solid #F1BBBB', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer', color: '#C42B1C' }}>✕</button>
        </div>
      </div>
    </div>
  );
}

export default function MyCVPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>(emptyCV);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [addingExp, setAddingExp] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExp | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const { data: cv } = useQuery({
    queryKey: ['my-cv'],
    queryFn: () => api.get('/user/cv').then(r => r.data),
  });

  const { data: workExp = [] } = useQuery<WorkExp[]>({
    queryKey: ['my-work-experience'],
    queryFn: () => api.get('/user/work-experience').then(r => r.data),
  });

  useEffect(() => {
    if (cv) {
      const filled: Record<string, string> = {};
      [...CV_FIELDS, ...CV_TEXTAREA_FIELDS].forEach(f => { filled[f.key] = cv[f.key] ?? ''; });
      EXTRA_KEYS.forEach(k => { filled[k] = cv[k] ?? ''; });
      setForm(filled);
    }
  }, [cv]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setMsg(''); setErr(''); setLoading(true);
    try {
      await api.put('/user/cv', form);
      setMsg('CV saved successfully!');
      qc.invalidateQueries({ queryKey: ['my-cv'] });
    } catch (e: any) { setErr(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const saveExp = async (data: typeof EMPTY_EXP) => {
    if (editingExp) {
      await api.put(`/user/work-experience/${editingExp.id}`, data);
    } else {
      await api.post('/user/work-experience', data);
    }
    qc.invalidateQueries({ queryKey: ['my-work-experience'] });
    setAddingExp(false);
    setEditingExp(null);
  };

  const deleteExp = async (id: number) => {
    if (!window.confirm('Delete this experience?')) return;
    await api.delete(`/user/work-experience/${id}`);
    qc.invalidateQueries({ queryKey: ['my-work-experience'] });
  };

  const toggleDesc = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/my/profile" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>My CV</h2>
          </div>
          {cv?.full_name && (
            <Link to={`/profile/${cv.id || ''}`} style={{ fontSize: 13, color: '#0067C0', textDecoration: 'none' }}>
              View Public CV →
            </Link>
          )}
        </div>

        {msg && <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#2E7D32', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{msg}</div>}
        {err && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{err}</div>}

        {/* Basic info */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#1a1a1a' }}>Basic Information</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CV_FIELDS.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={inp}
                />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Visa Status</label>
                <select value={form.visa_status ?? ''} onChange={e => set('visa_status', e.target.value)}
                  style={{ ...inp, background: '#fff', color: form.visa_status ? '#1a1a1a' : '#aaa' }}>
                  <option value="">Select visa status</option>
                  {VISA_STATUSES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Notice Period (Availability)</label>
                <select value={form.notice_period ?? ''} onChange={e => set('notice_period', e.target.value)}
                  style={{ ...inp, background: '#fff', color: form.notice_period ? '#1a1a1a' : '#aaa' }}>
                  <option value="">Select availability</option>
                  {NOTICE_PERIODS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <TagPicker
              label="Skills"
              endpoint="skills"
              value={form.technical_skills ?? ''}
              onChange={v => set('technical_skills', v)}
              placeholder="Type a skill, e.g. React…"
            />
            <TagPicker
              label="Languages"
              endpoint="languages"
              value={form.languages ?? ''}
              onChange={v => set('languages', v)}
              placeholder="Type a language, e.g. English…"
            />
          </div>
        </div>

        {/* Work Experience */}
        <div style={{ background: '#fff', borderRadius: 12, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Work Experience</div>
            {!addingExp && !editingExp && (
              <button onClick={() => setAddingExp(true)}
                style={{ padding: '5px 14px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                + Add
              </button>
            )}
          </div>

          <div style={{ padding: addingExp || editingExp ? '14px 16px 4px' : 0 }}>
            {addingExp && !editingExp && (
              <WorkExpForm
                onSave={saveExp}
                onCancel={() => setAddingExp(false)}
              />
            )}
          </div>

          {workExp.length === 0 && !addingExp && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
              No experience added yet.
            </div>
          )}

          {workExp.map(exp => (
            <div key={exp.id}>
              {editingExp?.id === exp.id ? (
                <div style={{ padding: '14px 16px 4px' }}>
                  <WorkExpForm
                    initial={{
                      job_title: exp.job_title,
                      company: exp.company,
                      location: exp.location || '',
                      start_month: exp.start_month ? String(exp.start_month) : '',
                      start_year: exp.start_year ? String(exp.start_year) : '',
                      end_month: exp.end_month ? String(exp.end_month) : '',
                      end_year: exp.end_year ? String(exp.end_year) : '',
                      is_current: !!exp.is_current,
                      description: exp.description || '',
                    }}
                    onSave={saveExp}
                    onCancel={() => setEditingExp(null)}
                  />
                </div>
              ) : (
                <WorkExpEntry
                  exp={exp}
                  onEdit={() => { setEditingExp(exp); setAddingExp(false); }}
                  onDelete={() => deleteExp(exp.id)}
                  expanded={expandedIds.has(exp.id)}
                  onToggleDesc={() => toggleDesc(exp.id)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Other sections */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#1a1a1a' }}>Additional Sections</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CV_TEXTAREA_FIELDS.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{f.label}</label>
                <textarea
                  value={form[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={4}
                  style={{ ...inp, resize: 'vertical' }}
                />
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={loading}
          style={{ width: '100%', padding: '14px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Saving…' : 'Save CV'}
        </button>
      </div>
    </div>
  );
}
