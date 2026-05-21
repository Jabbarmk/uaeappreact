import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const FONT = "'Segoe UI',Inter,sans-serif";
const emptyForm = { title: '', description: '', price: '', currency: 'AED', category_id: '', location: '', brand: '', model: '', color: '', condition_status: '' };

export default function MyClassifiedFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: myClassifieds } = useQuery({
    queryKey: ['my-classifieds'],
    queryFn: () => api.get('/user/classifieds').then(r => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && myClassifieds) {
      const c = myClassifieds.find((x: any) => String(x.id) === id);
      if (c) setForm({ title: c.title || '', description: c.description || '', price: c.price || '', currency: c.currency || 'AED', category_id: String(c.category_id || ''), location: c.location || '', brand: c.brand || '', model: c.model || '', color: c.color || '', condition_status: c.condition_status || '' });
    }
  }, [isEdit, myClassifieds, id]);

  const { data: catData } = useQuery({
    queryKey: ['classified-categories'],
    queryFn: () => api.get('/classifieds').then(r => r.data.categories || []),
  });
  const categories: any[] = Array.isArray(catData) ? catData : [];

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.title.trim()) return setError('Title is required');
    setError(''); setLoading(true);
    try {
      if (isEdit) await api.put(`/user/classifieds/${id}`, form);
      else await api.post('/user/classifieds', form);
      navigate('/my/classifieds');
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (text: string) => <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{text}</label>;

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Link to="/my/classifieds" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Edit Ad' : 'Post a Free Ad'}</h2>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>{lbl('Ad Title *')}<input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. iPhone 14 Pro Max 256GB" style={inp} /></div>
          <div>{lbl('Description')}<textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe your item" rows={3} style={{ ...inp, resize: 'vertical' }} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10 }}>
            <div>{lbl('Price')}<input value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" type="number" style={inp} /></div>
            <div>{lbl('Currency')}<input value={form.currency} onChange={e => set('currency', e.target.value)} style={inp} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {lbl('Category')}
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)} style={{ ...inp, color: form.category_id ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select Category</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>{lbl('Location')}<input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Dubai, UAE" style={inp} /></div>
          </div>

          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 10 }}>Optional Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{lbl('Brand')}<input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Apple, Samsung..." style={inp} /></div>
              <div>{lbl('Model')}<input value={form.model} onChange={e => set('model', e.target.value)} placeholder="Model name" style={inp} /></div>
              <div>{lbl('Color')}<input value={form.color} onChange={e => set('color', e.target.value)} placeholder="Black, White..." style={inp} /></div>
              <div>
                {lbl('Condition')}
                <select value={form.condition_status} onChange={e => set('condition_status', e.target.value)} style={{ ...inp, color: form.condition_status ? '#1a1a1a' : '#aaa' }}>
                  <option value="">Select Condition</option>
                  {['New', 'Like New', 'Good', 'Fair', 'Poor'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#795548', padding: '10px 12px', background: '#FFF8E1', borderRadius: 8 }}>
            ℹ️ Your ad will be reviewed before going live.
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
