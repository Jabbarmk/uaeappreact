import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const EMIRATES = ['Dubai','Abu Dhabi','Sharjah','Ajman','Fujairah','Ras Al Khaimah','Umm Al Quwain'];
const FONT = "'Segoe UI',Inter,sans-serif";

const emptyForm = { name: '', category_id: '', tagline: '', description: '', emirate: '', address: '', phone: '', whatsapp: '', email: '', website: '' };

export default function MyBusinessFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: myBusinesses } = useQuery({
    queryKey: ['my-businesses'],
    queryFn: () => api.get('/user/businesses').then(r => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && myBusinesses) {
      const b = myBusinesses.find((x: any) => String(x.id) === id);
      if (b) setForm({ name: b.name || '', category_id: String(b.category_id || ''), tagline: b.tagline || '', description: b.description || '', emirate: b.emirate || '', address: b.address || '', phone: b.phone || '', whatsapp: b.whatsapp || '', email: b.email || '', website: b.website || '' });
    }
  }, [isEdit, myBusinesses, id]);

  const { data: categories = [] } = useQuery<{ id: number; name: string }[]>({
    queryKey: ['categories-flat'],
    queryFn: () => api.get('/categories').then(r => {
      const cats: { id: number; name: string }[] = [];
      Object.values(r.data.groups as Record<string, any[]>).forEach(g => cats.push(...g));
      return cats.sort((a, b) => a.name.localeCompare(b.name));
    }),
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return setError('Business name is required');
    setError(''); setLoading(true);
    try {
      if (isEdit) await api.put(`/user/businesses/${id}`, form);
      else await api.post('/user/businesses', form);
      navigate('/my/businesses');
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Link to="/my/businesses" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Edit Business' : 'Add New Business'}</h2>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Business Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Al Noor Trading LLC" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)} style={{ ...inp, color: form.category_id ? '#1a1a1a' : '#aaa' }}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Tagline</label>
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Short description" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Tell customers about your business" rows={4} style={{ ...inp, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Emirate</label>
              <select value={form.emirate} onChange={e => set('emirate', e.target.value)} style={{ ...inp, color: form.emirate ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select Emirate</option>
                {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+971..." style={inp} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Address</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address" style={inp} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>WhatsApp</label>
              <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="971..." style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
              <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="business@email.com" style={inp} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Website</label>
            <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." style={inp} />
          </div>

          <div style={{ fontSize: 12, color: '#795548', padding: '10px 12px', background: '#FFF8E1', borderRadius: 8 }}>
            ℹ️ Your listing will be reviewed by our team before it goes live.
          </div>

          <button onClick={submit} disabled={loading}
            style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
