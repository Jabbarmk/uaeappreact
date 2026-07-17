import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { getClassifiedFields, ALL_CLASSIFIED_FIELD_KEYS, type FieldDef } from '../../constants/classifieds';

const FONT = "'Segoe UI',Inter,sans-serif";

const baseForm: Record<string, string> = { title: '', description: '', price: '', currency: 'AED', category_id: '', location: '' };
ALL_CLASSIFIED_FIELD_KEYS.forEach(k => { baseForm[k] = ''; });
const emptyForm = () => ({ ...baseForm });

interface GalleryImage { id: number; url: string }

export default function MyClassifiedFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState<Record<string, string>>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<GalleryImage[]>([]);          // already uploaded (edit mode)
  const [pending, setPending] = useState<{ file: File; url: string }[]>([]); // chosen, not yet uploaded (new mode)
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Categories (for the picker + to know which fields to render).
  const { data: catData } = useQuery({
    queryKey: ['classified-categories'],
    queryFn: () => api.get('/classifieds').then(r => r.data.categories || []),
  });
  const categories: any[] = Array.isArray(catData) ? catData : [];

  // Load the ad being edited (with its image gallery).
  const { data: existing } = useQuery({
    queryKey: ['my-classified', id],
    queryFn: () => api.get(`/user/classifieds/${id}`).then(r => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && existing) {
      const f = emptyForm();
      f.title = existing.title || ''; f.description = existing.description || '';
      f.price = existing.price != null ? String(existing.price) : '';
      f.currency = existing.currency || 'AED'; f.category_id = String(existing.category_id || '');
      f.location = existing.location || '';
      ALL_CLASSIFIED_FIELD_KEYS.forEach(k => { f[k] = existing[k] != null ? String(existing[k]) : ''; });
      setForm(f);
      setImages(existing.images || []);
    }
  }, [isEdit, existing]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const selectedCategoryName = categories.find(c => String(c.id) === form.category_id)?.name;
  const fields: FieldDef[] = getClassifiedFields(selectedCategoryName);

  // ── Image handling ──────────────────────────────────────────────────────────
  const onPickFiles = async (filesList: FileList | null) => {
    if (!filesList || !filesList.length) return;
    const files = Array.from(filesList);
    if (isEdit) {
      // Upload straight away against the existing ad.
      setUploading(true); setError('');
      try {
        const fd = new FormData();
        files.forEach(f => fd.append('files', f));
        const r = await api.post(`/user/classifieds/${id}/images`, fd);
        setImages(prev => [...prev, ...(r.data.images || [])]);
      } catch (e: any) { setError(e.response?.data?.error || 'Image upload failed'); }
      finally { setUploading(false); }
    } else {
      // Stash for upload after the ad is created.
      setPending(prev => [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f) }))]);
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  const removeExisting = async (imgId: number) => {
    try {
      await api.delete(`/user/classifieds/${id}/images/${imgId}`);
      setImages(prev => prev.filter(i => i.id !== imgId));
    } catch (e: any) { setError(e.response?.data?.error || 'Delete failed'); }
  };
  const removePending = (idx: number) => setPending(prev => prev.filter((_, i) => i !== idx));

  const submit = async () => {
    if (!form.title.trim()) return setError('Title is required');
    setError(''); setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/user/classifieds/${id}`, form);
      } else {
        const r = await api.post('/user/classifieds', form);
        const newId = r.data.id;
        if (newId && pending.length) {
          const fd = new FormData();
          pending.forEach(p => fd.append('files', p.file));
          await api.post(`/user/classifieds/${newId}/images`, fd);
        }
      }
      navigate('/my/classifieds');
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (text: string) => <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{text}</label>;

  const renderField = (fd: FieldDef) => (
    <div key={fd.key}>
      {lbl(fd.label)}
      {fd.type === 'select' ? (
        <select value={form[fd.key] || ''} onChange={e => set(fd.key, e.target.value)} style={{ ...inp, color: form[fd.key] ? '#1a1a1a' : '#aaa' }}>
          <option value="">Select {fd.label}</option>
          {(fd.options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input value={form[fd.key] || ''} onChange={e => set(fd.key, e.target.value)} placeholder={fd.placeholder} type={fd.type === 'number' ? 'number' : 'text'} style={inp} />
      )}
    </div>
  );

  const thumb: React.CSSProperties = { width: 72, height: 72, borderRadius: 8, objectFit: 'cover', border: '1px solid #E0E0E0' };
  const delBtn: React.CSSProperties = { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#C42B1C', color: '#fff', border: '2px solid #fff', fontSize: 11, lineHeight: '16px', cursor: 'pointer', padding: 0 };

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

          {/* Photos */}
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 10 }}>Photos {uploading && <span style={{ color: '#0067C0' }}>· uploading…</span>}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {images.map(img => (
                <div key={`e${img.id}`} style={{ position: 'relative' }}>
                  <img src={img.url} alt="" style={thumb} />
                  <button type="button" onClick={() => removeExisting(img.id)} style={delBtn}>×</button>
                </div>
              ))}
              {pending.map((p, i) => (
                <div key={`p${i}`} style={{ position: 'relative' }}>
                  <img src={p.url} alt="" style={thumb} />
                  <button type="button" onClick={() => removePending(i)} style={delBtn}>×</button>
                </div>
              ))}
              <button type="button" onClick={() => fileInput.current?.click()}
                style={{ width: 72, height: 72, borderRadius: 8, border: '1px dashed #BBB', background: '#FAFAFA', color: '#0067C0', fontSize: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              <input ref={fileInput} type="file" accept="image/*" multiple onChange={e => onPickFiles(e.target.files)} style={{ display: 'none' }} />
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>First photo is used as the listing thumbnail.</div>
          </div>

          {/* Category-specific details */}
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 10 }}>
              {selectedCategoryName ? `${selectedCategoryName} Details` : 'Item Details'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {fields.map(renderField)}
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
