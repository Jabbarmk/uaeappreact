import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const SMTP_KEYS = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass'];

const SMTP_FIELDS = [
  { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtp.gmail.com', type: 'text' },
  { key: 'smtp_port', label: 'SMTP Port', placeholder: '587', type: 'number' },
  { key: 'smtp_user', label: 'From Email (Username)', placeholder: 'noreply@yourdomain.com', type: 'text' },
  { key: 'smtp_pass', label: 'SMTP Password', placeholder: '••••••••', type: 'password' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px',
  border: '1px solid #C8C8C8', borderRadius: 4,
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
  const [saveError, setSaveError] = useState('');

  const [testTo, setTestTo] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        smtp_host: '',
        smtp_port: '587',
        smtp_user: '',
        smtp_pass: '',
        ...data,
      });
    }
  }, [data]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setSaved(false); setSaveError('');
    try {
      await api.put('/admin/settings', form);
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setSaveError('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleTestEmail = async () => {
    if (!testTo) return;
    setTesting(true); setTestResult(null);
    try {
      await api.post('/admin/settings/test-email', { to: testTo });
      setTestResult({ ok: true });
    } catch (e: any) {
      setTestResult({ error: e.response?.data?.error || 'Failed to send' });
    } finally { setTesting(false); }
  };

  const otherEntries = Object.entries(form).filter(([k]) => !SMTP_KEYS.includes(k));

  return (
    <div style={{ fontFamily: FONT, maxWidth: 760 }}>

      {/* Save bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, background: '#fff', border: '1px solid #E5E5E5', borderRadius: 6, padding: '10px 14px' }}>
        <button onClick={handleSave} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 18px', background: saving ? '#7CA3CC' : ACCENT, color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {saving ? '↻ Saving…' : '✓ Save All Settings'}
        </button>
        {saved && <span style={{ fontSize: 12, color: '#107C10' }}>✓ Saved successfully</span>}
        {saveError && <span style={{ fontSize: 12, color: '#C42B1C' }}>{saveError}</span>}
      </div>

      {isLoading && <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading…</div>}
      {isError && <div style={{ padding: 14, color: '#C42B1C', background: '#FDF3F2', border: '1px solid #F1BBBB', borderRadius: 4, fontSize: 13 }}>Failed to load settings.</div>}

      {!isLoading && !isError && (
        <>
          {/* ── SMTP Section ─────────────────────────────────────────────── */}
          <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, marginBottom: 20, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E5E5', background: '#F9F9F9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📧</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Email / SMTP Settings</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Configure outgoing email for OTP verification and notifications</div>
              </div>
            </div>

            <div style={{ padding: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {SMTP_FIELDS.map((f) => (
                <div key={f.key} style={f.key === 'smtp_host' || f.key === 'smtp_user' ? { gridColumn: '1 / -1' } : {}}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={f.key === 'smtp_pass' && !showPass ? 'password' : f.type === 'number' ? 'number' : 'text'}
                      value={form[f.key] ?? ''}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={inputStyle}
                      autoComplete={f.key === 'smtp_pass' ? 'new-password' : undefined}
                    />
                    {f.key === 'smtp_pass' && (
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: '2px 4px' }}>
                        {showPass ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Hint */}
            <div style={{ margin: '0 18px 14px', padding: '10px 12px', background: '#F0F7FF', border: '1px solid #B3D1F0', borderRadius: 6, fontSize: 12, color: '#004A90' }}>
              <strong>Gmail tip:</strong> Use <code style={{ background: '#fff', padding: '1px 4px', borderRadius: 3 }}>smtp.gmail.com</code>, port <code style={{ background: '#fff', padding: '1px 4px', borderRadius: 3 }}>587</code>, your Gmail address, and an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noreferrer" style={{ color: '#004A90' }}>App Password</a> (not your regular password).
            </div>

            {/* Test email */}
            <div style={{ padding: '14px 18px', borderTop: '1px solid #F0F0F0', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>Send Test Email:</span>
              <input
                type="email"
                value={testTo}
                onChange={(e) => { setTestTo(e.target.value); setTestResult(null); }}
                placeholder="recipient@email.com"
                style={{ ...inputStyle, width: 220, flex: '1 1 220px' }}
              />
              <button onClick={handleTestEmail} disabled={testing || !testTo}
                style={{ padding: '7px 16px', background: testing ? '#7CA3CC' : ACCENT, color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: testing || !testTo ? 'not-allowed' : 'pointer', opacity: !testTo ? 0.6 : 1, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {testing ? 'Sending…' : '↗ Send Test'}
              </button>
              {testResult?.ok && <span style={{ fontSize: 12, color: '#107C10', fontWeight: 600 }}>✓ Test email sent!</span>}
              {testResult?.error && <span style={{ fontSize: 12, color: '#C42B1C' }}>✕ {testResult.error}</span>}
            </div>
          </div>

          {/* ── Other settings ────────────────────────────────────────────── */}
          {otherEntries.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #E5E5E5', background: '#F9F9F9' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Other Settings</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', background: '#F3F3F3', borderBottom: '1px solid #DCDCDC', padding: '7px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>Key</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>Value</div>
              </div>
              {otherEntries.map(([key, value], i) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'start', padding: '10px 16px', borderBottom: i < otherEntries.length - 1 ? '1px solid #EBEBEB' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
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
        </>
      )}

      <style>{`@keyframes win-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
