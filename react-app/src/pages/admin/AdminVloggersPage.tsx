import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const FONT = "'Segoe UI','Inter',system-ui,sans-serif";
const ACCENT = '#0067C0';
const TIERS = ['Gold', 'Platinum', 'Silver', 'Bronze'];

const fmt = (n: unknown) => {
  const v = Number(n) || 0;
  if (v >= 1e6) return (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(v >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(v);
};

export default function AdminVloggersPage() {
  const qc = useQueryClient();
  const [editId, setEditId] = useState<number | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['admin-vloggers'], queryFn: () => api.get('/admin/vloggers').then((r) => r.data) });
  const rows: any[] = data?.rows || [];
  const editing = rows.find((r) => r.id === editId);

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Vloggers</h2>
          <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>Creator stats for businesses in the <strong>Vloggers</strong> category — followers, views, award tier &amp; awards.</div>
        </div>
        <span style={{ fontSize: 13, color: '#888' }}>{rows.length} in category</span>
      </div>

      {isLoading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', color: '#555' }}>
          No businesses in the Vloggers category. Add one under <Link to="/admin/businesses" style={{ color: ACCENT }}>Businesses</Link> (category = Vloggers).
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={r.logoUrl} alt="" style={{ width: 44, height: 44, borderRadius: 9, objectFit: 'cover', background: '#EEF1F5', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{r.name} {Number(r.is_verified) === 1 && <i className="fas fa-check-circle" style={{ color: '#1565C0', fontSize: 12 }}></i>}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {r.has_profile
                    ? <>{r.tier ? <span style={{ color: '#C98A00', fontWeight: 700 }}>{r.tier}</span> : ''}{r.content_niche ? ` · ${r.content_niche}` : ''} · ▶ {fmt(r.youtube_subscribers)} · 📷 {fmt(r.instagram_followers)} · 👁 {fmt(r.total_views)} views</>
                    : <span style={{ color: '#F57C00' }}>No creator stats yet</span>}
                </div>
              </div>
              <button onClick={() => setEditId(r.id)} style={{ padding: '6px 14px', border: `1px solid ${ACCENT}`, color: ACCENT, background: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>{r.has_profile ? 'Edit Stats' : 'Add Stats'}</button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditModal row={editing} onClose={() => setEditId(null)} onSaved={() => { qc.invalidateQueries({ queryKey: ['admin-vloggers'] }); setEditId(null); }} />
      )}
    </div>
  );
}

function EditModal({ row, onClose, onSaved }: { row: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ youtube_subscribers: '', instagram_followers: '', tiktok_followers: '', total_views: '', content_niche: '', tier: '', awards: '', is_verified: '0' });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setForm({
      youtube_subscribers: String(row.youtube_subscribers || ''), instagram_followers: String(row.instagram_followers || ''),
      tiktok_followers: String(row.tiktok_followers || ''), total_views: String(row.total_views || ''),
      content_niche: row.content_niche || '', tier: row.tier || '', awards: row.awards || '', is_verified: String(row.is_verified || 0),
    });
  }, [row]);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setLoading(true);
    try { await api.put(`/admin/vloggers/${row.id}`, { ...form, is_verified: Number(form.is_verified) }); onSaved(); }
    finally { setLoading(false); }
  };
  const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', border: '1px solid #E0E0E0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (t: string) => <label style={{ fontSize: 11, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t}</label>;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480, padding: 22, fontFamily: FONT }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Creator Stats</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{row.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('YouTube Subscribers')}<input value={form.youtube_subscribers} onChange={(e) => set('youtube_subscribers', e.target.value)} type="number" style={inp} /></div>
            <div>{lbl('Instagram Followers')}<input value={form.instagram_followers} onChange={(e) => set('instagram_followers', e.target.value)} type="number" style={inp} /></div>
            <div>{lbl('TikTok Followers')}<input value={form.tiktok_followers} onChange={(e) => set('tiktok_followers', e.target.value)} type="number" style={inp} /></div>
            <div>{lbl('Total Views')}<input value={form.total_views} onChange={(e) => set('total_views', e.target.value)} type="number" style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Content Niche')}<input value={form.content_niche} onChange={(e) => set('content_niche', e.target.value)} placeholder="Travel, Food…" style={inp} /></div>
            <div>{lbl('Award Tier')}<select value={form.tier} onChange={(e) => set('tier', e.target.value)} style={inp}><option value="">— None —</option>{TIERS.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div>{lbl('Awards (comma separated)')}<input value={form.awards} onChange={(e) => set('awards', e.target.value)} placeholder="YouTube Gold Play Button, Best Creator 2024" style={inp} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_verified === '1'} onChange={(e) => set('is_verified', e.target.checked ? '1' : '0')} /> Verified creator
          </label>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} style={{ padding: '9px 16px', border: '1px solid #E0E0E0', background: '#fff', color: '#555', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Cancel</button>
            <button onClick={save} disabled={loading} style={{ padding: '9px 20px', border: 'none', background: ACCENT, color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>{loading ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
