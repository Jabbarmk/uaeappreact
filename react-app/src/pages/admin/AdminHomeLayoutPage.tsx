import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const SECTION_META: Record<string, { name: string; desc: string; icon: string }> = {
  slider:      { name: 'Promo Slider',           desc: 'Banner slides (manage slides in Sliders; height in Settings)', icon: '▶' },
  featured:    { name: 'Featured Categories',    desc: 'Horizontal scroll or grid of home categories',                 icon: '⊞' },
  hero:        { name: 'Hero (Search)',          desc: 'Greeting, big title and search box',                           icon: '🔍' },
  explore:     { name: 'Explore SmartUAE',       desc: 'Service shortcuts menu — items editable below',                icon: '◈' },
  popular:     { name: 'Popular Right Now',      desc: 'Popular category cards slider',                                icon: '★' },
  stats:       { name: 'Stats Strip',            desc: 'Businesses / jobs / listings counters',                        icon: '#' },
  collections: { name: 'Best in UAE Collections',desc: 'Curated rows (Top 10 places…) — managed below',                icon: '🏆' },
};

const TONES = ['purple', 'teal', 'amber', 'pink'];

const input: React.CSSProperties = {
  width: '100%', padding: '7px 10px', border: '1px solid #C8C8C8', borderRadius: 4,
  fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', color: '#1a1a1a', background: '#fff',
};
const smallBtn: React.CSSProperties = {
  padding: '5px 10px', border: '1px solid #C8C8C8', borderRadius: 4, background: '#fff',
  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#333',
};
const primaryBtn: React.CSSProperties = {
  ...smallBtn, background: ACCENT, borderColor: ACCENT, color: '#fff', fontWeight: 600,
};
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

function useUpload() {
  return async (folder: string, file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const r = await api.post(`/admin/upload/${folder}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return r.data.filename as string;
  };
}

function ImagePicker({ folder, image, imageUrl, onChange }: { folder: string; image: string | null; imageUrl?: string | null; onChange: (filename: string | null) => void }) {
  const upload = useUpload();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = image ? (image.startsWith('http') ? image : `/assets/uploads/${folder}/${image}`) : imageUrl || null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 46, height: 46, borderRadius: 6, background: '#F0F0F0', border: '1px solid #DDD', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 16, color: '#AAA' }}>🖼</span>}
      </div>
      <input type="file" accept="image/*" ref={ref} style={{ display: 'none' }}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try { onChange(await upload(folder, f)); } finally { setBusy(false); if (ref.current) ref.current.value = ''; }
        }} />
      <button style={smallBtn} onClick={() => ref.current?.click()} disabled={busy}>{busy ? '↻…' : image ? 'Change' : 'Upload'}</button>
      {image && <button style={dangerBtn} onClick={() => onChange(null)}>✕</button>}
    </div>
  );
}

function BusinessPicker({ businessId, businessName, onChange }: { businessId: number | null; businessName?: string | null; onChange: (id: number | null, name: string | null) => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ id: number; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(() => {
      api.get('/admin/businesses/search', { params: { q } }).then((r) => { setResults(r.data); setOpen(true); }).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  if (businessId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, background: '#EBF3FB', color: ACCENT, padding: '4px 10px', borderRadius: 12, fontWeight: 600 }}>🔗 {businessName || `#${businessId}`}</span>
        <button style={dangerBtn} onClick={() => onChange(null, null)}>✕</button>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative' }}>
      <input style={input} placeholder="Link a business (type to search)…" value={q}
        onChange={(e) => setQ(e.target.value)} onFocus={() => results.length && setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 200)} />
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 4, zIndex: 30, boxShadow: '0 6px 18px rgba(0,0,0,.12)', maxHeight: 180, overflowY: 'auto' }}>
          {results.map((b) => (
            <div key={b.id} onMouseDown={() => { onChange(b.id, b.name); setQ(''); setOpen(false); }}
              style={{ padding: '8px 10px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}>
              {b.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminHomeLayoutPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-home-layout'],
    queryFn: () => api.get('/admin/home-layout').then((r) => r.data),
  });

  const [sections, setSections] = useState<any[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => { if (data?.sections) { setSections(data.sections.map((s: any) => ({ ...s }))); setDirty(false); } }, [data]);

  const refetch = () => qc.invalidateQueries({ queryKey: ['admin-home-layout'] });

  const patchSection = (key: string, patch: any) => {
    setSections((prev) => prev.map((s) => (s.section_key === key ? { ...s, ...patch } : s)));
    setDirty(true);
  };
  const patchSettings = (key: string, patch: any) => {
    setSections((prev) => prev.map((s) => (s.section_key === key ? { ...s, settings: { ...s.settings, ...patch } } : s)));
    setDirty(true);
  };
  const move = (idx: number, dir: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
    setDirty(true);
  };

  const saveSections = async () => {
    setSaving(true);
    try {
      await Promise.all(sections.map((s) =>
        api.put(`/admin/home-layout/sections/${s.section_key}`, {
          title: s.title, is_visible: !!s.is_visible, sort_order: s.sort_order, settings: s.settings,
        })
      ));
      setDirty(false); setSavedMsg('✓ Layout saved'); setTimeout(() => setSavedMsg(''), 2500);
      refetch();
    } finally { setSaving(false); }
  };

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#888', fontFamily: FONT }}>Loading…</div>;

  return (
    <div style={{ fontFamily: FONT, maxWidth: 900 }}>

      {/* Save bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, background: '#fff', border: '1px solid #E5E5E5', borderRadius: 6, padding: '10px 14px', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={saveSections} disabled={saving || !dirty}
          style={{ ...primaryBtn, padding: '7px 18px', opacity: saving || !dirty ? 0.6 : 1, cursor: saving || !dirty ? 'default' : 'pointer' }}>
          {saving ? '↻ Saving…' : '✓ Save Layout'}
        </button>
        {dirty && <span style={{ fontSize: 12, color: '#B85C00' }}>● Unsaved changes</span>}
        {savedMsg && <span style={{ fontSize: 12, color: '#107C10' }}>{savedMsg}</span>}
      </div>

      {/* ── Sections ────────────────────────────────────────────────────── */}
      <div style={card}>
        <div style={cardHead}>
          <span style={{ fontSize: 18 }}>🏠</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Home Sections</div>
            <div style={{ fontSize: 12, color: '#888' }}>Toggle visibility, reorder with arrows, and configure each section</div>
          </div>
        </div>
        {sections.map((s, i) => {
          const meta = SECTION_META[s.section_key] || { name: s.section_key, desc: '', icon: '□' };
          const set = s.settings || {};
          return (
            <div key={s.section_key} style={{ borderBottom: '1px solid #F0F0F0', padding: '12px 16px', opacity: s.is_visible ? 1 : 0.55 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '16px' }} onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
                  <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '16px' }} onClick={() => move(i, 1)} disabled={i === sections.length - 1}>▼</button>
                </div>
                <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{meta.name}</div>
                  <div style={{ fontSize: 11.5, color: '#888' }}>{meta.desc}</div>
                </div>
                <Toggle on={!!s.is_visible} onChange={(v) => patchSection(s.section_key, { is_visible: v ? 1 : 0 })} />
              </div>

              {/* Per-section settings */}
              <div style={{ marginTop: 10, marginLeft: 42, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {['featured', 'explore', 'popular', 'hero', 'collections'].includes(s.section_key) && (
                  <div style={{ width: 200 }}>
                    <label style={label}>Section title</label>
                    <input style={input} value={s.title || ''} onChange={(e) => patchSection(s.section_key, { title: e.target.value })} />
                  </div>
                )}

                {['featured', 'popular', 'collections'].includes(s.section_key) && (
                  <>
                    <div style={{ width: 100 }}>
                      <label style={label}>Title size (px)</label>
                      <input style={input} type="number" min={10} max={32} value={set.titleSize ?? 17}
                        onChange={(e) => patchSettings(s.section_key, { titleSize: Math.min(32, Math.max(10, Number(e.target.value) || 17)) })} />
                    </div>
                    <div style={{ width: 100 }}>
                      <label style={label}>Text size (px)</label>
                      <input style={input} type="number" min={8} max={24}
                        value={set.textSize ?? (s.section_key === 'collections' ? 13 : s.section_key === 'popular' ? 12.5 : 11)}
                        onChange={(e) => patchSettings(s.section_key, { textSize: Math.min(24, Math.max(8, Number(e.target.value) || 11)) })} />
                    </div>
                  </>
                )}

                {s.section_key === 'featured' && (
                  <>
                    <div>
                      <label style={label}>Style</label>
                      <select style={input} value={set.style || 'scroll'} onChange={(e) => patchSettings(s.section_key, { style: e.target.value })}>
                        <option value="scroll">Horizontal scroll</option>
                        <option value="grid">Grid</option>
                      </select>
                    </div>
                    <div style={{ width: 130 }}>
                      <label style={label}>Corner radius % (0-50)</label>
                      <input style={input} type="number" min={0} max={50} value={set.radius ?? 33}
                        onChange={(e) => patchSettings(s.section_key, { radius: Math.min(50, Math.max(0, Number(e.target.value) || 0)) })} />
                    </div>
                    <div style={{ width: 130 }}>
                      <label style={label}>Label position</label>
                      <select style={input} value={set.textPos || 'outside'} onChange={(e) => patchSettings(s.section_key, { textPos: e.target.value })}>
                        <option value="outside">Outside (below)</option>
                        <option value="inside">Inside button</option>
                      </select>
                    </div>
                    {(set.style || 'scroll') === 'scroll' ? (
                      <>
                        <div style={{ width: 130 }}>
                          <label style={label}>Visible columns</label>
                          <select style={input} value={set.visCols ?? 4} onChange={(e) => patchSettings(s.section_key, { visCols: Number(e.target.value) })}>
                            {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} + peek</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={label}>Auto scroll (slow drift)</label>
                          <Toggle on={!!set.auto} onChange={(v) => patchSettings(s.section_key, { auto: v ? 1 : 0 })} />
                        </div>
                        {!!set.auto && (
                          <div style={{ width: 110 }}>
                            <label style={label}>Speed (1-10)</label>
                            <input style={input} type="number" min={1} max={10} value={set.speed ?? 3} onChange={(e) => patchSettings(s.section_key, { speed: Math.min(10, Math.max(1, Number(e.target.value) || 3)) })} />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{ width: 110 }}>
                          <label style={label}>Columns</label>
                          <select style={input} value={set.columns ?? 3} onChange={(e) => patchSettings(s.section_key, { columns: Number(e.target.value) })}>
                            {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} per row</option>)}
                          </select>
                        </div>
                        <div style={{ width: 100 }}>
                          <label style={label}>Max rows</label>
                          <select style={input} value={set.maxRows ?? 2} onChange={(e) => patchSettings(s.section_key, { maxRows: Number(e.target.value) })}>
                            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                  </>
                )}

                {s.section_key === 'hero' && (
                  <div style={{ width: 260 }}>
                    <label style={label}>Search placeholder</label>
                    <input style={input} value={set.placeholder || ''} onChange={(e) => patchSettings(s.section_key, { placeholder: e.target.value })} />
                  </div>
                )}

                {s.section_key === 'explore' && (
                  <>
                    <div>
                      <label style={label}>Style</label>
                      <select style={input} value={set.style || 'icons'} onChange={(e) => patchSettings(s.section_key, { style: e.target.value })}>
                        <option value="icons">Icon tiles (grid)</option>
                        <option value="images">Image cards (scroll)</option>
                      </select>
                    </div>
                    {(set.style || 'icons') === 'images' && (
                      <>
                        <div>
                          <label style={label}>Auto scroll</label>
                          <Toggle on={!!set.auto} onChange={(v) => patchSettings(s.section_key, { auto: v ? 1 : 0 })} />
                        </div>
                        {!!set.auto && (
                          <div style={{ width: 90 }}>
                            <label style={label}>Timer (sec)</label>
                            <input style={input} type="number" min={1} value={set.timer ?? 4} onChange={(e) => patchSettings(s.section_key, { timer: Number(e.target.value) || 4 })} />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {s.section_key === 'popular' && (
                  <>
                    <div style={{ width: 110 }}>
                      <label style={label}>Card size</label>
                      <select style={input} value={set.size || 'm'} onChange={(e) => patchSettings(s.section_key, { size: e.target.value })}>
                        <option value="s">Small</option>
                        <option value="m">Medium</option>
                        <option value="l">Large</option>
                      </select>
                    </div>
                    <div style={{ width: 90 }}>
                      <label style={label}>Rows</label>
                      <select style={input} value={set.rows ?? 1} onChange={(e) => patchSettings(s.section_key, { rows: Number(e.target.value) })}>
                        {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={label}>Auto slide</label>
                      <Toggle on={!!set.auto} onChange={(v) => patchSettings(s.section_key, { auto: v ? 1 : 0 })} />
                    </div>
                    {!!set.auto && (
                      <div style={{ width: 90 }}>
                        <label style={label}>Timer (sec)</label>
                        <input style={input} type="number" min={1} value={set.timer ?? 4} onChange={(e) => patchSettings(s.section_key, { timer: Number(e.target.value) || 4 })} />
                      </div>
                    )}
                  </>
                )}

                {s.section_key === 'stats' && (
                  <>
                    {(['label1', 'label2', 'label3'] as const).map((k, idx) => (
                      <div key={k} style={{ width: 140 }}>
                        <label style={label}>Label {idx + 1}</label>
                        <input style={input} value={set[k] || ''} onChange={(e) => patchSettings(s.section_key, { [k]: e.target.value })} />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MenuManager menu={data?.menu || []} refetch={refetch} />
      <CollectionsManager collections={data?.collections || []} refetch={refetch} />
    </div>
  );
}

// ── Explore SmartUAE menu manager ────────────────────────────────────────────

function MenuManager({ menu, refetch }: { menu: any[]; refetch: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  useEffect(() => { setRows(menu.map((m) => ({ ...m, _dirty: false }))); }, [menu]);

  const patch = (id: number, p: any) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...p, _dirty: true } : r)));

  const save = async (r: any) => {
    await api.put(`/admin/home-layout/menu/${r.id}`, r);
    refetch();
  };
  const remove = async (r: any) => {
    if (!window.confirm(`Delete "${r.label}"?`)) return;
    await api.delete(`/admin/home-layout/menu/${r.id}`);
    refetch();
  };
  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= rows.length) return;
    const a = { ...rows[idx], sort_order: rows[j].sort_order };
    const b = { ...rows[j], sort_order: rows[idx].sort_order };
    await Promise.all([api.put(`/admin/home-layout/menu/${a.id}`, a), api.put(`/admin/home-layout/menu/${b.id}`, b)]);
    refetch();
  };

  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={{ fontSize: 18 }}>◈</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Explore SmartUAE — Menu Items</div>
          <div style={{ fontSize: 12, color: '#888' }}>Add, edit, reorder or remove the service shortcuts. Icon = FontAwesome class; image used in "Image cards" style.</div>
        </div>
        <button style={primaryBtn} onClick={() => setAdding(true)}>+ Add item</button>
      </div>

      {adding && <MenuItemForm onDone={() => { setAdding(false); refetch(); }} onCancel={() => setAdding(false)} nextOrder={(rows[rows.length - 1]?.sort_order || 0) + 1} />}

      {rows.map((r, i) => (
        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderBottom: '1px solid #F0F0F0', flexWrap: 'wrap', opacity: r.is_active ? 1 : 0.55 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
            <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => move(i, 1)} disabled={i === rows.length - 1}>▼</button>
          </div>
          <input style={{ ...input, width: 110 }} value={r.label} onChange={(e) => patch(r.id, { label: e.target.value })} />
          <input style={{ ...input, width: 120 }} value={r.link} onChange={(e) => patch(r.id, { link: e.target.value })} />
          <input style={{ ...input, width: 130 }} value={r.icon || ''} placeholder="fa-store" onChange={(e) => patch(r.id, { icon: e.target.value })} />
          <select style={{ ...input, width: 90 }} value={r.tone} onChange={(e) => patch(r.id, { tone: e.target.value })}>
            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ImagePicker folder="home_menu" image={r.image} imageUrl={r.imageUrl} onChange={(f) => patch(r.id, { image: f })} />
          <Toggle on={!!r.is_active} onChange={(v) => patch(r.id, { is_active: v ? 1 : 0 })} />
          <button style={{ ...primaryBtn, opacity: r._dirty ? 1 : 0.45 }} disabled={!r._dirty} onClick={() => save(r)}>Save</button>
          <button style={dangerBtn} onClick={() => remove(r)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function MenuItemForm({ onDone, onCancel, nextOrder }: { onDone: () => void; onCancel: () => void; nextOrder: number }) {
  const [f, setF] = useState<any>({ label: '', link: '/', icon: '', tone: 'purple', image: null, is_active: true, sort_order: nextOrder });
  return (
    <div style={{ padding: '12px 16px', background: '#F6FAFE', borderBottom: '1px solid #E5E5E5', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div><label style={label}>Label</label><input style={{ ...input, width: 120 }} value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} /></div>
      <div><label style={label}>Link</label><input style={{ ...input, width: 130 }} value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} /></div>
      <div><label style={label}>Icon (fa class)</label><input style={{ ...input, width: 130 }} placeholder="fa-store" value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} /></div>
      <div><label style={label}>Tone</label>
        <select style={{ ...input, width: 90 }} value={f.tone} onChange={(e) => setF({ ...f, tone: e.target.value })}>
          {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div><label style={label}>Image (optional)</label><ImagePicker folder="home_menu" image={f.image} onChange={(img) => setF({ ...f, image: img })} /></div>
      <button style={primaryBtn} disabled={!f.label || !f.link}
        onClick={async () => { await api.post('/admin/home-layout/menu', f); onDone(); }}>Add</button>
      <button style={smallBtn} onClick={onCancel}>Cancel</button>
    </div>
  );
}

// ── Collections manager ──────────────────────────────────────────────────────

function CollectionsManager({ collections, refetch }: { collections: any[]; refetch: () => void }) {
  const [newTitle, setNewTitle] = useState('');
  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={{ fontSize: 18 }}>🏆</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Best in UAE — Collections</div>
          <div style={{ fontSize: 12, color: '#888' }}>Each collection shows as a titled row of image cards (e.g. Top 10 Tourist Places). Items can link to a business.</div>
        </div>
        <input style={{ ...input, width: 200 }} placeholder="New collection title…" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button style={primaryBtn} disabled={!newTitle.trim()}
          onClick={async () => {
            await api.post('/admin/home-layout/collections', { title: newTitle.trim(), sort_order: (collections[collections.length - 1]?.sort_order || 0) + 1 });
            setNewTitle(''); refetch();
          }}>+ Add</button>
      </div>

      {collections.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>No collections yet — add "Top 10 Tourist Places", "Must Try Food"…</div>}
      {collections.map((c, i) => <CollectionCard key={c.id} c={c} idx={i} all={collections} refetch={refetch} />)}
    </div>
  );
}

function CollectionCard({ c, idx, all, refetch }: { c: any; idx: number; all: any[]; refetch: () => void }) {
  const [title, setTitle] = useState(c.title);
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  useEffect(() => setTitle(c.title), [c.title]);

  const saveCol = (p: any) => api.put(`/admin/home-layout/collections/${c.id}`, { title, is_active: !!c.is_active, sort_order: c.sort_order, ...p }).then(refetch);
  const move = async (dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= all.length) return;
    const other = all[j];
    await Promise.all([
      api.put(`/admin/home-layout/collections/${c.id}`, { title: c.title, is_active: !!c.is_active, sort_order: other.sort_order }),
      api.put(`/admin/home-layout/collections/${other.id}`, { title: other.title, is_active: !!other.is_active, sort_order: c.sort_order }),
    ]);
    refetch();
  };

  return (
    <div style={{ borderBottom: '1px solid #E9E9E9', opacity: c.is_active ? 1 : 0.55 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#FBFBFB', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => move(-1)} disabled={idx === 0}>▲</button>
          <button style={{ ...smallBtn, padding: '0 6px', lineHeight: '15px' }} onClick={() => move(1)} disabled={idx === all.length - 1}>▼</button>
        </div>
        <button style={{ ...smallBtn, padding: '2px 8px' }} onClick={() => setOpen(!open)}>{open ? '▾' : '▸'}</button>
        <input style={{ ...input, width: 240, fontWeight: 600 }} value={title} onChange={(e) => setTitle(e.target.value)} />
        {title !== c.title && <button style={primaryBtn} onClick={() => saveCol({})}>Save</button>}
        <span style={{ fontSize: 12, color: '#888' }}>{c.items.length} item{c.items.length === 1 ? '' : 's'}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Toggle on={!!c.is_active} onChange={(v) => saveCol({ is_active: v })} />
          <button style={smallBtn} onClick={() => setAdding(true)}>+ Item</button>
          <button style={dangerBtn} onClick={async () => {
            if (!window.confirm(`Delete collection "${c.title}" and all its items?`)) return;
            await api.delete(`/admin/home-layout/collections/${c.id}`); refetch();
          }}>Delete</button>
        </div>
      </div>

      {adding && <ItemEditor collectionId={c.id} nextOrder={(c.items[c.items.length - 1]?.sort_order || 0) + 1} onDone={() => { setAdding(false); refetch(); }} onCancel={() => setAdding(false)} />}
      {open && c.items.map((it: any) => <ItemEditor key={it.id} item={it} collectionId={c.id} onDone={refetch} />)}
    </div>
  );
}

function ItemEditor({ item, collectionId, nextOrder, onDone, onCancel }: { item?: any; collectionId: number; nextOrder?: number; onDone: () => void; onCancel?: () => void }) {
  const isNew = !item;
  const [f, setF] = useState<any>(item
    ? { ...item, _dirty: false }
    : { title: '', description: '', image: null, business_id: null, business_name: null, is_active: true, sort_order: nextOrder || 1 });

  const set = (p: any) => setF((prev: any) => ({ ...prev, ...p, _dirty: true }));

  const save = async () => {
    if (isNew) await api.post(`/admin/home-layout/collections/${collectionId}/items`, f);
    else await api.put(`/admin/home-layout/items/${f.id}`, f);
    onDone();
  };

  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 16px 10px 48px', borderTop: '1px solid #F3F3F3', flexWrap: 'wrap', alignItems: 'flex-start', background: isNew ? '#F6FAFE' : '#fff', opacity: f.is_active ? 1 : 0.55 }}>
      <ImagePicker folder="collections" image={f.image} imageUrl={f.imageUrl} onChange={(img) => set({ image: img })} />
      <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <input style={input} placeholder="Title (e.g. Burj Khalifa)" value={f.title} onChange={(e) => set({ title: e.target.value })} />
        <textarea style={{ ...input, minHeight: 40, resize: 'vertical' }} placeholder="Description (optional)" value={f.description || ''} onChange={(e) => set({ description: e.target.value })} />
        <BusinessPicker businessId={f.business_id} businessName={f.business_name} onChange={(id, name) => set({ business_id: id, business_name: name })} />
        {f.business_id ? (
          <div style={{ fontSize: 11, color: '#888' }}>📍 Emirate &amp; location taken from the linked business</div>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <select style={{ ...input, width: 150 }} value={f.emirate || ''} onChange={(e) => set({ emirate: e.target.value || null })}>
              <option value="">Emirate…</option>
              {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'].map((em) => <option key={em} value={em}>{em}</option>)}
            </select>
            <input style={{ ...input, width: 110 }} placeholder="Latitude" value={f.latitude ?? ''} onChange={(e) => set({ latitude: e.target.value })} />
            <input style={{ ...input, width: 110 }} placeholder="Longitude" value={f.longitude ?? ''} onChange={(e) => set({ longitude: e.target.value })} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
        {!isNew && <Toggle on={!!f.is_active} onChange={(v) => set({ is_active: v ? 1 : 0 })} />}
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ ...primaryBtn, opacity: isNew || f._dirty ? 1 : 0.45 }} disabled={!f.title || (!isNew && !f._dirty)} onClick={save}>{isNew ? 'Add' : 'Save'}</button>
          {isNew
            ? <button style={smallBtn} onClick={onCancel}>Cancel</button>
            : <button style={dangerBtn} onClick={async () => { if (window.confirm(`Delete "${f.title}"?`)) { await api.delete(`/admin/home-layout/items/${f.id}`); onDone(); } }}>Delete</button>}
        </div>
      </div>
    </div>
  );
}
