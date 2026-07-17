import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { EMIRATES } from '../../constants/uae';

type Step = 'form' | 'otp';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', emirate: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const sendOtp = async () => {
    setError('');
    if (!form.email) return setError('Email is required');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { identifier: form.email, channel: 'email', type: 'signup' });
      setStep('otp');
    } catch (e: any) { setError(e.response?.data?.error || 'Failed to send code'); }
    finally { setLoading(false); }
  };

  const register = async () => {
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', { ...form, otp_code: otp });
      login(res.data.user);
      navigate('/');
    } catch (e: any) { setError(e.response?.data?.error || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inp = (style?: object) => ({ width: '100%', padding: '11px 14px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit', ...style });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F3F3', padding: 16, fontFamily: "'Segoe UI',Inter,sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: '#0067C0', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>S</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Create account</h2>
          <p style={{ margin: '6px 0 0', color: '#888', fontSize: 13 }}>We'll email you a code to verify</p>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full Name *" style={inp()} />
            <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email address *" type="email" style={inp()} />
            <input value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="Mobile number (optional, e.g. +971501234567)" style={inp()} />
            <select value={form.emirate} onChange={(e) => set('emirate', e.target.value)} style={inp({ color: form.emirate ? '#1a1a1a' : '#aaa' })}>
              <option value="">Select Emirate</option>
              {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>

            <button onClick={sendOtp} disabled={!form.name || !form.email || loading}
              style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: !form.name || !form.email || loading ? 0.6 : 1 }}>
              {loading ? 'Sending code…' : 'Continue'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#555' }}>Code sent to <strong>{form.email}</strong></p>
            <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && otp.length === 6 && register()}
              style={{ ...inp({ fontSize: 24, letterSpacing: 8, textAlign: 'center' }) }} />
            <button onClick={register} disabled={otp.length !== 6 || loading}
              style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: otp.length !== 6 || loading ? 0.6 : 1 }}>
              {loading ? 'Creating account…' : 'Verify & Create Account'}
            </button>
            <button onClick={sendOtp} disabled={loading} style={{ background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Didn't get it? Resend code
            </button>
            <button onClick={() => { setStep('form'); setOtp(''); }} style={{ background: 'none', border: 'none', color: '#0067C0', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#888', borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
          Already have an account? <Link to="/auth/login" style={{ color: '#0067C0', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
