import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { getClassifiedFields, ALL_CLASSIFIED_FIELD_KEYS } from '../../constants/classifieds';

const FONT = "'Segoe UI','Inter',system-ui,sans-serif";
const ACCENT = '#0067C0';

function StatusBadge({ status }: { status: string }) {
  const c = status === 'approved' ? { bg: '#E8F5E9', color: '#2E7D32' }
    : status === 'rejected' ? { bg: '#FDF3F2', color: '#C42B1C' }
    : { bg: '#FFF8E1', color: '#F57C00' };
  return <span style={{ fontSize: 11, padding: '2px 8px', background: c.bg, color: c.color, borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{status || 'pending'}</span>;
}

const fmtDate = (v?: string | null) => {
  if (!v) return '';
  const s = String(v);
  return (s.includes('T') ? s.split('T')[0] : s.split(' ')[0]);
};

interface Meta { categories: { id: number; name: string }[]; sections: { id: number; name: string }[] }

export default function AdminClassifiedsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { data: meta } = useQuery<Meta>({
    queryKey: ['manage-classifieds-meta'],
    queryFn: () => api.get('/admin/manage-classifieds/meta').then(r => r.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['manage-classifieds', search, status, category],
    queryFn: () => api.get('/admin/manage-classifieds', { params: { search, status, category, pageSize: 200 } }).then(r => r.data),
  });

  const rows: any[] = data?.rows || [];

  const del = async (id: number) => {
    if (!confirm('Delete this classified permanently?')) return;
    await api.delete(`/admin/manage-classifieds/${id}`);
    qc.invalidateQueries({ queryKey: ['manage-classifieds'] });
  };

  const selStyle: React.CSSProperties = { padding: '7px 10px', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, fontFamily: FONT, background: '#fff' };

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Classifieds</h2>
        <span style={{ fontSize: 13, color: '#888' }}>{rows.length} item{rows.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title…" style={{ ...selStyle, flex: 1, minWidth: 160 }} />
        <select value={status} onChange={e => setStatus(e.target.value)} style={selStyle}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} style={selStyle}>
          <option value="">All categories</option>
          {meta?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', color: '#555' }}>No classifieds found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map(r => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={r.imageUrl} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0, background: '#F3E5F5' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {r.price ? `${r.currency || 'AED'} ${Number(r.price).toLocaleString()}` : 'No price'}
                  {r.category_name ? ` · ${r.category_name}` : ''}
                  {r.user_name ? ` · ${r.user_name}` : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <StatusBadge status={r.status} />
                  {Number(r.is_expired) === 1
                    ? <span style={{ fontSize: 11, color: '#C42B1C', fontWeight: 600 }}>⚠ Expired</span>
                    : r.expires_at && <span style={{ fontSize: 11, color: '#888' }}>Expires {fmtDate(r.expires_at)}</span>}
                </div>
              </div>
              <button onClick={() => setEditId(r.id)} style={{ padding: '6px 14px', border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>Edit</button>
              <button onClick={() => del(r.id)} style={{ padding: '6px 12px', border: '1px solid #F1BBBB', color: '#C42B1C', background: '#FDF3F2', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {editId != null && meta && (
        <EditModal id={editId} meta={meta} onClose={() => setEditId(null)} onSaved={() => { qc.invalidateQueries({ queryKey: ['manage-classifieds'] }); setEditId(null); }} />
      )}
    </div>
  );
}

// ── Edit modal ──────────────────────────────────────────────────────────────
function EditModal({ id, meta, onClose, onSaved }: { id: number; meta: Meta; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get(`/admin/manage-classifieds/${id}`).then(r => {
      const d = r.data;
      const f: Record<string, string> = {
        title: d.title || '', description: d.description || '',
        price: d.price != null ? String(d.price) : '', currency: d.currency || 'AED',
        category_id: String(d.category_id || ''), section_id: String(d.section_id || ''),
        location: d.location || '', status: d.status || 'pending',
        is_active: String(d.is_active ?? 1), expires_at: fmtDate(d.expires_at),
      };
      ALL_CLASSIFIED_FIELD_KEYS.forEach(k => { f[k] = d[k] != null ? String(d[k]) : ''; });
      setForm(f);
      setImages(d.images || []);
    });
  }, [id]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const categoryName = meta.categories.find(c => String(c.id) === form.category_id)?.name;
  const fields = getClassifiedFields(categoryName);

  const uploadImages = async (filesList: FileList | null) => {
    if (!filesList || !filesList.length) return;
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      Array.from(filesList).forEach(f => fd.append('files', f));
      const r = await api.post(`/admin/manage-classifieds/${id}/images`, fd);
      setImages(prev => [...prev, ...(r.data.images || [])]);
    } catch (e: any) { setError(e.response?.data?.error || 'Upload failed'); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ''; }
  };

  const removeImage = async (imgId: number) => {
    await api.delete(`/admin/manage-classifieds/${id}/images/${imgId}`);
    setImages(prev => prev.filter(i => i.id !== imgId));
  };

  const save = async () => {
    setLoading(true); setError('');
    try {
      const payload: Record<string, any> = { ...form };
      payload.is_active = Number(form.is_active);
      await api.put(`/admin/manage-classifieds/${id}`, payload);
      onSaved();
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', border: '1px solid #E0E0E0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (t: string) => <label style={{ fontSize: 11, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t}</label>;
  const thumb: React.CSSProperties = { width: 64, height: 64, borderRadius: 7, objectFit: 'cover', border: '1px solid #E0E0E0' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 640, padding: 24, fontFamily: FONT }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Edit Classified #{id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '8px 12px', borderRadius: 7, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>{lbl('Title')}<input value={form.title || ''} onChange={e => set('title', e.target.value)} style={inp} /></div>
          <div>{lbl('Description')}<textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 10 }}>
            <div>{lbl('Price')}<input value={form.price || ''} onChange={e => set('price', e.target.value)} type="number" style={inp} /></div>
            <div>{lbl('Currency')}<input value={form.currency || ''} onChange={e => set('currency', e.target.value)} style={inp} /></div>
            <div>{lbl('Location')}<input value={form.location || ''} onChange={e => set('location', e.target.value)} style={inp} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Category')}
              <select value={form.category_id || ''} onChange={e => set('category_id', e.target.value)} style={inp}>
                <option value="">—</option>
                {meta.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>{lbl('Section')}
              <select value={form.section_id || ''} onChange={e => set('section_id', e.target.value)} style={inp}>
                <option value="">—</option>
                {meta.sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Approval / visibility / expiry */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '12px', background: '#F9FAFC', borderRadius: 8, border: '1px solid #ECEFF3' }}>
            <div>{lbl('Status')}
              <select value={form.status || 'pending'} onChange={e => set('status', e.target.value)} style={inp}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>{lbl('Visible (active)')}
              <select value={form.is_active || '1'} onChange={e => set('is_active', e.target.value)} style={inp}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div>{lbl('Expires on')}<input type="date" value={form.expires_at || ''} onChange={e => set('expires_at', e.target.value)} style={inp} /></div>
          </div>

          {/* Images */}
          <div>
            {lbl(`Photos${uploading ? ' · uploading…' : ''}`)}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {images.map(img => (
                <div key={img.id} style={{ position: 'relative' }}>
                  <img src={img.url} alt="" style={thumb} />
                  <button type="button" onClick={() => removeImage(img.id)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#C42B1C', color: '#fff', border: '2px solid #fff', fontSize: 11, cursor: 'pointer', padding: 0 }}>×</button>
                </div>
              ))}
              <button type="button" onClick={() => fileInput.current?.click()} style={{ width: 64, height: 64, borderRadius: 7, border: '1px dashed #BBB', background: '#FAFAFA', color: ACCENT, fontSize: 24, cursor: 'pointer' }}>+</button>
              <input ref={fileInput} type="file" accept="image/*" multiple onChange={e => uploadImages(e.target.files)} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Category-specific fields */}
          <div>
            {lbl(`${categoryName || 'Item'} Details`)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 10, color: '#aaa', display: 'block', marginBottom: 3 }}>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} style={inp}>
                      <option value="">—</option>
                      {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} type={f.type === 'number' ? 'number' : 'text'} style={inp} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} style={{ padding: '10px 18px', border: '1px solid #E0E0E0', background: '#fff', color: '#555', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Cancel</button>
            <button onClick={save} disabled={loading} style={{ padding: '10px 22px', border: 'none', background: ACCENT, color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>{loading ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
