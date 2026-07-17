import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { EMIRATES } from '../../constants/realestate';

const FONT = "'Segoe UI',Inter,sans-serif";
const KEYS = ['name', 'developer', 'company_id', 'location', 'emirate', 'description', 'starting_price', 'currency', 'handover', 'payment_plan'];
const empty = () => { const o: Record<string, string> = {}; KEYS.forEach(k => o[k] = ''); o.currency = 'AED'; return o; };

export default function MyProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState<Record<string, string>>(empty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [pending, setPending] = useState<{ file: File; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { data: myCompanies } = useQuery({ queryKey: ['my-companies'], queryFn: () => api.get('/user/realestate/companies').then(r => r.data) });
  const companies: any[] = Array.isArray(myCompanies) ? myCompanies : [];

  const { data: existing } = useQuery({
    queryKey: ['my-project', id],
    queryFn: () => api.get(`/user/realestate/projects/${id}`).then(r => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && existing) {
      const f = empty(); KEYS.forEach(k => { f[k] = existing[k] != null ? String(existing[k]) : ''; });
      f.currency = existing.currency || 'AED';
      setForm(f); setImages(existing.images || []);
    }
  }, [isEdit, existing]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const onPick = async (fl: FileList | null) => {
    if (!fl?.length) return;
    const files = Array.from(fl);
    if (isEdit) {
      setUploading(true); setError('');
      try { const fd = new FormData(); files.forEach(f => fd.append('files', f)); const r = await api.post(`/user/realestate/projects/${id}/images`, fd); setImages(prev => [...prev, ...(r.data.images || [])]); }
      catch (e: any) { setError(e.response?.data?.error || 'Upload failed'); } finally { setUploading(false); }
    } else { setPending(prev => [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f) }))]); }
    if (fileInput.current) fileInput.current.value = '';
  };
  const removeExisting = async (imgId: number) => { await api.delete(`/user/realestate/projects/${id}/images/${imgId}`); setImages(prev => prev.filter(i => i.id !== imgId)); };
  const removePending = (idx: number) => setPending(prev => prev.filter((_, i) => i !== idx));

  const submit = async () => {
    if (!form.name.trim()) return setError('Project name is required');
    setError(''); setLoading(true);
    try {
      if (isEdit) await api.put(`/user/realestate/projects/${id}`, form);
      else { const r = await api.post('/user/realestate/projects', form); if (r.data.id && pending.length) { const fd = new FormData(); pending.forEach(p => fd.append('files', p.file)); await api.post(`/user/realestate/projects/${r.data.id}/images`, fd); } }
      navigate('/my/projects');
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (t: string) => <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t}</label>;
  const thumb: React.CSSProperties = { width: 72, height: 72, borderRadius: 8, objectFit: 'cover', border: '1px solid #E0E0E0' };
  const delBtn: React.CSSProperties = { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#C42B1C', color: '#fff', border: '2px solid #fff', fontSize: 11, lineHeight: '16px', cursor: 'pointer', padding: 0 };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Link to="/my/projects" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Edit Project' : 'Add Project'}</h2>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>{lbl('Project Name *')}<input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Marina Vista" style={inp} /></div>
          <div>{lbl('Description')}<textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Developer')}<input value={form.developer} onChange={e => set('developer', e.target.value)} placeholder="Developer name" style={inp} /></div>
            {companies.length > 0 ? (
              <div>{lbl('Your Company (optional)')}
                <select value={form.company_id} onChange={e => set('company_id', e.target.value)} style={{ ...inp, color: form.company_id ? '#1a1a1a' : '#aaa' }}>
                  <option value="">None</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            ) : <div />}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Location')}<input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Dubai Harbour" style={inp} /></div>
            <div>{lbl('Emirate')}
              <select value={form.emirate} onChange={e => set('emirate', e.target.value)} style={{ ...inp, color: form.emirate ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select Emirate</option>
                {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', gap: 10 }}>
            <div>{lbl('Starting Price')}<input value={form.starting_price} onChange={e => set('starting_price', e.target.value)} type="number" placeholder="0" style={inp} /></div>
            <div>{lbl('Currency')}<input value={form.currency} onChange={e => set('currency', e.target.value)} style={inp} /></div>
            <div>{lbl('Handover')}<input value={form.handover} onChange={e => set('handover', e.target.value)} placeholder="Q4 2026" style={inp} /></div>
          </div>

          <div>{lbl('Payment Plan')}<input value={form.payment_plan} onChange={e => set('payment_plan', e.target.value)} placeholder="80/20 Payment Plan" style={inp} /></div>

          {/* Photos */}
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 10 }}>Photos {uploading && <span style={{ color: '#0067C0' }}>· uploading…</span>}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {images.map(img => <div key={`e${img.id}`} style={{ position: 'relative' }}><img src={img.url} alt="" style={thumb} /><button type="button" onClick={() => removeExisting(img.id)} style={delBtn}>×</button></div>)}
              {pending.map((p, i) => <div key={`p${i}`} style={{ position: 'relative' }}><img src={p.url} alt="" style={thumb} /><button type="button" onClick={() => removePending(i)} style={delBtn}>×</button></div>)}
              <button type="button" onClick={() => fileInput.current?.click()} style={{ width: 72, height: 72, borderRadius: 8, border: '1px dashed #BBB', background: '#FAFAFA', color: '#0067C0', fontSize: 26, cursor: 'pointer' }}>+</button>
              <input ref={fileInput} type="file" accept="image/*" multiple onChange={e => onPick(e.target.files)} style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#795548', padding: '10px 12px', background: '#FFF8E1', borderRadius: 8 }}>ℹ️ Your project will be reviewed before going live.</div>
          <button onClick={submit} disabled={loading} style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
