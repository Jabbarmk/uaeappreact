import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '6px 10px',
  border: '1px solid #C8C8C8', borderRadius: 3,
  fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', color: '#1a1a1a',
};

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<Record<string, string>>({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/admin/settings').then((r) => r.data),
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (data) setForm(data); }, [data]);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setSaved(false); setError('');
    try {
      await api.put('/admin/settings', form);
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError('Save failed.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 720 }}>

      {/* Command bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, background: '#fff', border: '1px solid #E5E5E5', borderRadius: 4, padding: '8px 12px' }}>
        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 16px', background: saving ? '#7CA3CC' : ACCENT, color: '#fff', border: 'none', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {saving ? '↻ Saving…' : '✓ Save Settings'}
        </button>
        {saved && <span style={{ fontSize: 12, color: '#107C10', display: 'flex', alignItems: 'center', gap: 4 }}>✓ Saved successfully</span>}
        {error && <span style={{ fontSize: 12, color: '#C42B1C' }}>{error}</span>}
      </div>

      {isLoading && (
        <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 13 }}>
          <div style={{ width: 24, height: 24, border: `2px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'win-spin 0.8s linear infinite', margin: '0 auto 8px' }} />
          Loading settings…
        </div>
      )}
      {isError && (
        <div style={{ padding: 14, color: '#C42B1C', background: '#FDF3F2', border: '1px solid #F1BBBB', borderRadius: 4, fontSize: 13 }}>
          Failed to load settings.
        </div>
      )}

      {!isLoading && !isError && (
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 4, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', background: '#F3F3F3', borderBottom: '1px solid #DCDCDC', padding: '7px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>Setting</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>Value</div>
          </div>

          {Object.keys(form).length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 13 }}>No settings configured.</div>
          )}

          {Object.entries(form).map(([key, value], i) => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'start', padding: '10px 16px', borderBottom: i < Object.keys(form).length - 1 ? '1px solid #EBEBEB' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#333', paddingTop: 7, paddingRight: 12, wordBreak: 'break-word' }}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                <div style={{ fontSize: 10, color: '#999', fontWeight: 400, marginTop: 2, fontFamily: 'monospace' }}>{key}</div>
              </div>
              <div>
                {value.length > 80 ? (
                  <textarea rows={3} value={value} onChange={(e) => set(key, e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                ) : (
                  <input type="text" value={value} onChange={(e) => set(key, e.target.value)} style={inputStyle} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes win-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
