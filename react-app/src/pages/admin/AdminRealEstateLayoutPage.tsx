import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const RE_SECTIONS: { key: string; label: string; styled?: boolean; titled?: boolean }[] = [
  { key: 'banner',     label: 'Hero Banner (slides below)' },
  { key: 'categories', label: 'Category Tiles', styled: true, titled: true },
  { key: 'developers', label: 'Major Developers', styled: true, titled: true },
  { key: 'projects',   label: 'Off-Plan Projects', styled: true, titled: true },
  { key: 'listings',   label: 'Property Listings (one row per category)', styled: true },
];

const DEFAULT_TITLES: Record<string, string> = {
  categories: '', developers: 'Major Developers', projects: 'Off-Plan Projects',
};

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

export default function AdminRealEstateLayoutPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-re-layout'],
    queryFn: () => api.get('/admin/re-layout').then((r) => r.data),
  });

  const [sections, setSections] = useState<any[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const saved: any[] = data?.layout || [];
    const known = new Set(saved.map((s: any) => s.key));
    const merged = [...saved, ...RE_SECTIONS.filter((d) => !known.has(d.key)).map((d, i) => ({
      key: d.key, on: 1, order: saved.length + i + 1, title: DEFAULT_TITLES[d.key] ?? '', style: 'scroll', auto: 0, speed: 3,
    }))];
    if (data) { setSections(merged.sort((a, b) => a.order - b.order)); setDirty(false); }
  }, [data]);

  const patch = (key: string, p: any) => { setSections((prev) => prev.map((s) => (s.key === key ? { ...s, ...p } : s))); setDirty(true); };
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next.map((s, idx) => ({ ...s, order: idx + 1 })));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/re-layout', { layout: sections });
      setDirty(false); setSavedMsg('✓ Layout saved'); setTimeout(() => setSavedMsg(''), 2500);
      qc.invalidateQueries({ queryKey: ['admin-re-layout'] });
    } finally { setSaving(false); }
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, background: '#fff', border: '1px solid #E5E5E5', borderRadius: 6, padding: '10px 14px', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={save} disabled={saving || !dirty}
          style={{ ...primaryBtn, padding: '7px 18px', opacity: saving || !dirty ? 0.6 : 1 }}>
          {saving ? '↻ Saving…' : '✓ Save Layout'}
        </button>
        {dirty && <span style={{ fontSize: 12, color: '#B85C00' }}>● Unsaved changes</span>}
        {savedMsg && <span style={{ fontSize: 12, color: '#107C10' }}>{savedMsg}</span>}
      </div>

      {/* ── Sections ── */}
      <div style={card}>
        <div style={cardHead}>
          <span style={{ fontSize: 18 }}>🏠</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Real Estate Page Sections</div>
            <div style={{ fontSize: 12, color: '#888' }}>Toggle, reorder and configure each section of the Real Estate page</div>
          </div>
        </div>
        {sections.map((s, i) => {
          const meta = RE_SECTIONS.find((m) => m.key === s.key);
          return (
            <div key={s.key} style={{ borderBottom: '1px solid #F0F0F0', padding: '12px 16px', opacity: s.on ? 1 : 0.55 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '16px' }} onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
                  <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '16px' }} onClick={() => move(i, 1)} disabled={i === sections.length - 1}>▼</button>
                </div>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 13.5 }}>{meta?.label || s.key}</span>
                <Toggle on={!!s.on} onChange={(v) => patch(s.key, { on: v ? 1 : 0 })} />
              </div>
              <div style={{ marginTop: 8, marginLeft: 40, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {meta?.titled && (
                  <div style={{ width: 200 }}>
                    <label style={label}>Section title{s.key === 'categories' ? ' (blank = no heading)' : ''}</label>
                    <input style={input} value={s.title || ''} onChange={(e) => patch(s.key, { title: e.target.value })} />
                  </div>
                )}
                {meta?.styled && (
                  <>
                    <div style={{ width: 150 }}>
                      <label style={label}>Listing style</label>
                      <select style={input} value={s.style || 'scroll'} onChange={(e) => patch(s.key, { style: e.target.value })}>
                        <option value="scroll">Horizontal scroll</option>
                        <option value="grid">Grid (2 columns)</option>
                      </select>
                    </div>
                    {(s.style || 'scroll') === 'scroll' && (
                      <>
                        <div>
                          <label style={label}>Auto slide (slow drift)</label>
                          <Toggle on={!!s.auto} onChange={(v) => patch(s.key, { auto: v ? 1 : 0 })} />
                        </div>
                        {!!s.auto && (
                          <div style={{ width: 100 }}>
                            <label style={label}>Speed (1-10)</label>
                            <input style={input} type="number" min={1} max={10} value={s.speed ?? 3}
                              onChange={(e) => patch(s.key, { speed: Math.min(10, Math.max(1, Number(e.target.value) || 3)) })} />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BannerManager />
    </div>
  );
}

// ── Hero banner slides manager ────────────────────────────────────────────────

function BannerManager() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-re-banners'],
    queryFn: () => api.get('/admin/re-banners?pageSize=100').then((r) => r.data),
  });
  const rows: any[] = (data?.rows || []).slice().sort((a: any, b: any) => a.sort_order - b.sort_order || a.id - b.id);
  const refetch = () => qc.invalidateQueries({ queryKey: ['admin-re-banners'] });
  const [adding, setAdding] = useState(false);

  const move = async (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    await Promise.all([
      api.put(`/admin/re-banners/${rows[i].id}`, { sort_order: j + 1 }),
      api.put(`/admin/re-banners/${rows[j].id}`, { sort_order: i + 1 }),
    ]);
    refetch();
  };

  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={{ fontSize: 18 }}>🖼</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Hero Banner Slides</div>
          <div style={{ fontSize: 12, color: '#888' }}>Image or video per slide; multiple slides auto-slide. Height adapts to the media. Optional overlay text + tap link.</div>
        </div>
        <button style={primaryBtn} onClick={() => setAdding(true)}>+ Add slide</button>
      </div>
      {adding && <BannerForm onDone={() => { setAdding(false); refetch(); }} onCancel={() => setAdding(false)} nextOrder={(rows[rows.length - 1]?.sort_order || 0) + 1} />}
      {rows.length === 0 && !adding && <div style={{ padding: 22, textAlign: 'center', color: '#999', fontSize: 13 }}>No slides yet — the page shows the default hero until you add one.</div>}
      {rows.map((b, i) => (
        <BannerRow key={b.id} b={b} idx={i} total={rows.length} onMove={move} refetch={refetch} />
      ))}
    </div>
  );
}

function uploadFile(url: string, file: File) {
  const fd = new FormData();
  fd.append('file', file);
  return api.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.filename as string);
}

function MediaPicker({ image, video, onImage, onVideo }: { image: string | null; video: string | null; onImage: (f: string | null) => void; onVideo: (f: string | null) => void }) {
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = (f: string | null) => (f ? (String(f).startsWith('http') ? f : `/assets/uploads/banners/${f}`) : null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 92, height: 56, borderRadius: 6, background: '#111', border: '1px solid #DDD', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {video ? <video src={src(video)!} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : image ? <img src={src(image)!} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ color: '#777', fontSize: 16 }}>🖼</span>}
      </div>
      <input type="file" accept="image/*" ref={imgRef} style={{ display: 'none' }}
        onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { onImage(await uploadFile('/admin/upload/banners', f)); onVideo(null); } finally { setBusy(false); } }} />
      <input type="file" accept="video/*" ref={vidRef} style={{ display: 'none' }}
        onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { onVideo(await uploadFile('/admin/upload-video/banners', f)); onImage(null); } finally { setBusy(false); } }} />
      <button style={smallBtn} onClick={() => imgRef.current?.click()} disabled={busy}>{busy ? '↻…' : 'Image'}</button>
      <button style={smallBtn} onClick={() => vidRef.current?.click()} disabled={busy}>Video</button>
    </div>
  );
}

function BannerRow({ b, idx, total, onMove, refetch }: { b: any; idx: number; total: number; onMove: (i: number, d: -1 | 1) => void; refetch: () => void }) {
  const [f, setF] = useState<any>({ ...b, _dirty: false });
  useEffect(() => setF({ ...b, _dirty: false }), [b]);
  const set = (p: any) => setF((prev: any) => ({ ...prev, ...p, _dirty: true }));
  const save = async () => { await api.put(`/admin/re-banners/${b.id}`, { image: f.image, video: f.video, title: f.title, subtitle: f.subtitle, link: f.link, is_active: f.is_active ? 1 : 0, sort_order: f.sort_order }); refetch(); };
  const remove = async () => { if (window.confirm('Delete this slide?')) { await api.delete(`/admin/re-banners/${b.id}`); refetch(); } };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #F0F0F0', flexWrap: 'wrap', opacity: f.is_active ? 1 : 0.55 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => onMove(idx, -1)} disabled={idx === 0}>▲</button>
        <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => onMove(idx, 1)} disabled={idx === total - 1}>▼</button>
      </div>
      <MediaPicker image={f.image} video={f.video} onImage={(v) => set({ image: v })} onVideo={(v) => set({ video: v })} />
      <input style={{ ...input, width: 150 }} placeholder="Title (overlay)" value={f.title || ''} onChange={(e) => set({ title: e.target.value })} />
      <input style={{ ...input, width: 170 }} placeholder="Subtitle" value={f.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
      <input style={{ ...input, width: 150 }} placeholder="Link (optional)" value={f.link || ''} onChange={(e) => set({ link: e.target.value })} />
      <Toggle on={!!f.is_active} onChange={(v) => set({ is_active: v ? 1 : 0 })} />
      <button style={{ ...primaryBtn, opacity: f._dirty ? 1 : 0.45 }} disabled={!f._dirty} onClick={save}>Save</button>
      <button style={dangerBtn} onClick={remove}>Delete</button>
    </div>
  );
}

function BannerForm({ onDone, onCancel, nextOrder }: { onDone: () => void; onCancel: () => void; nextOrder: number }) {
  const [f, setF] = useState<any>({ image: null, video: null, title: '', subtitle: '', link: '', is_active: 1, sort_order: nextOrder });
  return (
    <div style={{ padding: '12px 16px', background: '#F6FAFE', borderBottom: '1px solid #E5E5E5', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <MediaPicker image={f.image} video={f.video}
        onImage={(v) => setF((p: any) => ({ ...p, image: v }))}
        onVideo={(v) => setF((p: any) => ({ ...p, video: v }))} />
      <input style={{ ...input, width: 150 }} placeholder="Title (overlay)" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <input style={{ ...input, width: 170 }} placeholder="Subtitle" value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} />
      <input style={{ ...input, width: 150 }} placeholder="Link (optional)" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} />
      <button style={primaryBtn} disabled={!f.image && !f.video}
        onClick={async () => { await api.post('/admin/re-banners', f); onDone(); }}>Add</button>
      <button style={smallBtn} onClick={onCancel}>Cancel</button>
    </div>
  );
}
