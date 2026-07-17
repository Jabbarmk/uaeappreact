import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { EMIRATES } from '../../constants/realestate';

const FONT = "'Segoe UI',Inter,sans-serif";
const KEYS = ['name', 'about', 'phone', 'whatsapp', 'email', 'website', 'emirate', 'address'];
const empty = () => { const o: Record<string, string> = {}; KEYS.forEach(k => o[k] = ''); return o; };

export default function MyCompanyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState<Record<string, string>>(empty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const logoInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  const { data: existing } = useQuery({
    queryKey: ['my-re-company', id],
    queryFn: () => api.get(`/user/realestate/companies/${id}`).then(r => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && existing) {
      const f = empty(); KEYS.forEach(k => { f[k] = existing[k] != null ? String(existing[k]) : ''; });
      setForm(f); setLogoUrl(existing.logo ? existing.logoUrl : ''); setBannerUrl(existing.banner ? existing.bannerUrl : '');
    }
  }, [isEdit, existing]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  // Logo/banner upload needs an existing company id; for a new one, create it first.
  const ensureId = async (): Promise<string | null> => {
    if (isEdit) return id!;
    if (!form.name.trim()) { setError('Enter a company name first'); return null; }
    const r = await api.post('/user/realestate/companies', form);
    navigate(`/my/re-companies/${r.data.id}/edit`, { replace: true });
    return String(r.data.id);
  };

  const uploadImg = async (kind: 'logo' | 'banner', file?: File) => {
    if (!file) return;
    const cid = await ensureId(); if (!cid) return;
    setError('');
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await api.post(`/user/realestate/companies/${cid}/${kind}`, fd);
      if (kind === 'logo') setLogoUrl(r.data.url); else setBannerUrl(r.data.url);
    } catch (e: any) { setError(e.response?.data?.error || 'Upload failed'); }
  };

  const submit = async () => {
    if (!form.name.trim()) return setError('Company name is required');
    setError(''); setLoading(true);
    try {
      if (isEdit) await api.put(`/user/realestate/companies/${id}`, form);
      else await api.post('/user/realestate/companies', form);
      navigate('/my/re-companies');
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (t: string) => <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t}</label>;

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Link to="/my/re-companies" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Edit Company' : 'Add Company'}</h2>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Logo + banner */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'center' }}>
              {lbl('Logo')}
              <div onClick={() => logoInput.current?.click()} style={{ width: 80, height: 80, borderRadius: 14, border: '1px dashed #BBB', background: logoUrl ? `center/cover no-repeat url(${logoUrl})` : '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0067C0', fontSize: 22 }}>{!logoUrl && '+'}</div>
              <input ref={logoInput} type="file" accept="image/*" onChange={e => uploadImg('logo', e.target.files?.[0])} style={{ display: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              {lbl('Banner')}
              <div onClick={() => bannerInput.current?.click()} style={{ width: '100%', height: 80, borderRadius: 14, border: '1px dashed #BBB', background: bannerUrl ? `center/cover no-repeat url(${bannerUrl})` : '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0067C0', fontSize: 22 }}>{!bannerUrl && '+'}</div>
              <input ref={bannerInput} type="file" accept="image/*" onChange={e => uploadImg('banner', e.target.files?.[0])} style={{ display: 'none' }} />
            </div>
          </div>
          {!isEdit && <div style={{ fontSize: 11, color: '#999', marginTop: -6 }}>Uploading a logo/banner will save a draft so images can attach.</div>}

          <div>{lbl('Company Name *')}<input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Skyline Real Estate" style={inp} /></div>
          <div>{lbl('About')}<textarea value={form.about} onChange={e => set('about', e.target.value)} rows={3} placeholder="What does your company do?" style={{ ...inp, resize: 'vertical' }} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Phone')}<input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+9715..." style={inp} /></div>
            <div>{lbl('WhatsApp')}<input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="9715..." style={inp} /></div>
            <div>{lbl('Email')}<input value={form.email} onChange={e => set('email', e.target.value)} style={inp} /></div>
            <div>{lbl('Website')}<input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://" style={inp} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Emirate')}
              <select value={form.emirate} onChange={e => set('emirate', e.target.value)} style={{ ...inp, color: form.emirate ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select Emirate</option>
                {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>{lbl('Address')}<input value={form.address} onChange={e => set('address', e.target.value)} style={inp} /></div>
          </div>

          <div style={{ fontSize: 12, color: '#795548', padding: '10px 12px', background: '#FFF8E1', borderRadius: 8 }}>ℹ️ Your company page will be reviewed before going live.</div>
          <button onClick={submit} disabled={loading} style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
