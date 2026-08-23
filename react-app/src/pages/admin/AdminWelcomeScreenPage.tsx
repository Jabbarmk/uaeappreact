import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const input: React.CSSProperties = {
  width: '100%', padding: '7px 10px', border: '1px solid #C8C8C8', borderRadius: 4,
  fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', color: '#1a1a1a', background: '#fff',
};
const smallBtn: React.CSSProperties = { padding: '5px 10px', border: '1px solid #C8C8C8', borderRadius: 4, background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#333' };
const primaryBtn: React.CSSProperties = { ...smallBtn, background: ACCENT, borderColor: ACCENT, color: '#fff', fontWeight: 600 };
const dangerBtn: React.CSSProperties = { ...smallBtn, color: '#C42B1C', borderColor: '#E8B4B0' };
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, marginBottom: 18, overflow: 'hidden' };
const cardHead: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #E5E5E5', background: '#F9F9F9', display: 'flex', alignItems: 'center', gap: 10 };
const label: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4 };

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{ width: 38, height: 20, borderRadius: 20, background: on ? ACCENT : '#CCC', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .15s' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
    </div>
  );
}

export default function AdminWelcomeScreenPage() {
  return (
    <div style={{ fontFamily: FONT, maxWidth: 900 }}>
      <SettingsPanel />
      <SlideManager />
    </div>
  );
}

// ── Slider settings (timer, radius, padding, transition style) ───────────────

function SettingsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-welcome-settings'],
    queryFn: () => api.get('/admin/welcome-settings').then((r) => r.data),
  });

  const [s, setS] = useState({ timer: 4, radius: 24, padding: 16, style: 'fade' });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => { if (data?.settings) { setS(data.settings); setDirty(false); } }, [data]);

  const patch = (p: any) => { setS((prev) => ({ ...prev, ...p })); setDirty(true); };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/welcome-settings', { settings: s });
      setDirty(false); setSavedMsg('✓ Settings saved'); setTimeout(() => setSavedMsg(''), 2500);
      qc.invalidateQueries({ queryKey: ['admin-welcome-settings'] });
    } finally { setSaving(false); }
  };

  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={{ fontSize: 18 }}>👋</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Welcome Screen Settings</div>
          <div style={{ fontSize: 12, color: '#888' }}>Controls the slider shown before the home page — first screen every visitor sees.</div>
        </div>
        <button onClick={save} disabled={saving || !dirty} style={{ ...primaryBtn, padding: '7px 18px', opacity: saving || !dirty ? 0.6 : 1 }}>
          {saving ? '↻ Saving…' : '✓ Save'}
        </button>
        {savedMsg && <span style={{ fontSize: 12, color: '#107C10' }}>{savedMsg}</span>}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 160 }}>
          <label style={label}>Transition style</label>
          <select style={input} value={s.style} onChange={(e) => patch({ style: e.target.value })}>
            <option value="fade">Fade / crossfade</option>
            <option value="slide">Slide (horizontal)</option>
          </select>
        </div>
        <div style={{ width: 130 }}>
          <label style={label}>Timer (seconds per slide)</label>
          <input style={input} type="number" min={1} max={30} value={s.timer}
            onChange={(e) => patch({ timer: Math.min(30, Math.max(1, Number(e.target.value) || 4)) })} />
        </div>
        <div style={{ width: 130 }}>
          <label style={label}>Image corner radius (px)</label>
          <input style={input} type="number" min={0} max={80} value={s.radius}
            onChange={(e) => patch({ radius: Math.min(80, Math.max(0, Number(e.target.value) || 0)) })} />
        </div>
        <div style={{ width: 130 }}>
          <label style={label}>Outer padding (px)</label>
          <input style={input} type="number" min={0} max={60} value={s.padding}
            onChange={(e) => patch({ padding: Math.min(60, Math.max(0, Number(e.target.value) || 0)) })} />
        </div>
        {dirty && <span style={{ fontSize: 12, color: '#B85C00', alignSelf: 'center' }}>● Unsaved changes</span>}
      </div>
    </div>
  );
}

// ── Slide images manager ──────────────────────────────────────────────────────

function uploadFile(url: string, file: File) {
  const fd = new FormData();
  fd.append('file', file);
  return api.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.filename as string);
}

function ImagePicker({ image, onChange }: { image: string | null; onChange: (f: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = image ? (String(image).startsWith('http') ? image : `/assets/uploads/welcome/${image}`) : '';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 92, height: 56, borderRadius: 6, background: '#111', border: '1px solid #DDD', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {image ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#777', fontSize: 16 }}>🖼</span>}
      </div>
      <input type="file" accept="image/*" ref={ref} style={{ display: 'none' }}
        onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { onChange(await uploadFile('/admin/upload/welcome', f)); } finally { setBusy(false); } }} />
      <button style={smallBtn} onClick={() => ref.current?.click()} disabled={busy}>{busy ? '↻…' : 'Upload'}</button>
    </div>
  );
}

function SlideManager() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-welcome-slides'],
    queryFn: () => api.get('/admin/welcome-slides?pageSize=100').then((r) => r.data),
  });
  const rows: any[] = (data?.rows || []).slice().sort((a: any, b: any) => a.sort_order - b.sort_order || a.id - b.id);
  const refetch = () => qc.invalidateQueries({ queryKey: ['admin-welcome-slides'] });
  const [newImage, setNewImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const move = async (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    await Promise.all([
      api.put(`/admin/welcome-slides/${rows[i].id}`, { sort_order: j + 1 }),
      api.put(`/admin/welcome-slides/${rows[j].id}`, { sort_order: i + 1 }),
    ]);
    refetch();
  };

  const addSlide = async (image: string) => {
    setAdding(true);
    try {
      await api.post('/admin/welcome-slides', { image, sort_order: (rows[rows.length - 1]?.sort_order || 0) + 1, is_active: 1 });
      setNewImage(null);
      refetch();
    } finally { setAdding(false); }
  };

  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={{ fontSize: 18 }}>🖼</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Welcome Slides</div>
          <div style={{ fontSize: 12, color: '#888' }}>Full-bleed images shown top-half on the welcome screen. Add as many as you like; they auto-advance on the timer above.</div>
        </div>
      </div>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', gap: 10, background: '#F6FAFE' }}>
        <ImagePicker image={newImage} onChange={(f) => { setNewImage(f); addSlide(f); }} />
        {adding && <span style={{ fontSize: 12, color: '#888' }}>Adding…</span>}
      </div>
      {rows.length === 0 && <div style={{ padding: 22, textAlign: 'center', color: '#999', fontSize: 13 }}>No slides yet — the welcome screen shows a default fallback image until you add one.</div>}
      {rows.map((r, i) => (
        <SlideRow key={r.id} r={r} idx={i} total={rows.length} onMove={move} refetch={refetch} />
      ))}
    </div>
  );
}

function SlideRow({ r, idx, total, onMove, refetch }: { r: any; idx: number; total: number; onMove: (i: number, d: -1 | 1) => void; refetch: () => void }) {
  const [f, setF] = useState<any>({ ...r, _dirty: false });
  useEffect(() => setF({ ...r, _dirty: false }), [r]);
  const set = (p: any) => setF((prev: any) => ({ ...prev, ...p, _dirty: true }));
  const save = async () => { await api.put(`/admin/welcome-slides/${r.id}`, { image: f.image, is_active: f.is_active ? 1 : 0, sort_order: f.sort_order }); refetch(); };
  const remove = async () => { if (window.confirm('Delete this slide?')) { await api.delete(`/admin/welcome-slides/${r.id}`); refetch(); } };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #F0F0F0', flexWrap: 'wrap', opacity: f.is_active ? 1 : 0.55 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => onMove(idx, -1)} disabled={idx === 0}>▲</button>
        <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => onMove(idx, 1)} disabled={idx === total - 1}>▼</button>
      </div>
      <ImagePicker image={f.image} onChange={(v) => set({ image: v })} />
      <div style={{ flex: 1 }} />
      <Toggle on={!!f.is_active} onChange={(v) => set({ is_active: v ? 1 : 0 })} />
      <button style={{ ...primaryBtn, opacity: f._dirty ? 1 : 0.45 }} disabled={!f._dirty} onClick={save}>Save</button>
      <button style={dangerBtn} onClick={remove}>Delete</button>
    </div>
  );
}
