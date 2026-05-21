import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const EMIRATES = ['Dubai','Abu Dhabi','Sharjah','Ajman','Fujairah','Ras Al Khaimah','Umm Al Quwain'];

type Mode = 'password' | 'otp';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [channel, setChannel] = useState<'email'|'sms'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setError(''); setLoading(true);
    try {
      await api.post('/auth/send-otp', { identifier, channel, type: 'login' });
      setOtpSent(true);
    } catch (e: any) { setError(e.response?.data?.error || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      const endpoint = mode === 'password' ? '/auth/login' : '/auth/login-otp';
      const body = mode === 'password' ? { identifier, password } : { identifier, otp_code: otp };
      const res = await api.post(endpoint, body);
      login(res.data.user);
      navigate('/');
    } catch (e: any) { setError(e.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F3F3', padding: 16, fontFamily: "'Segoe UI',Inter,sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: '#0067C0', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>S</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>Sign in to SMARTUAE</h2>
          <p style={{ margin: '6px 0 0', color: '#888', fontSize: 13 }}>Welcome back</p>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Mode toggle */}
        <div style={{ display: 'flex', border: '1px solid #E0E0E0', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
          {(['password','otp'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setOtpSent(false); setError(''); }}
              style={{ flex: 1, padding: '9px 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', background: mode === m ? '#0067C0' : '#fff', color: mode === m ? '#fff' : '#555', transition: 'all 0.15s' }}>
              {m === 'password' ? 'Password' : 'OTP Login'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or Mobile number"
            style={{ width: '100%', padding: '11px 14px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />

          {mode === 'password' && (
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" onKeyDown={(e) => e.key === 'Enter' && submit()}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
          )}

          {mode === 'otp' && !otpSent && (
            <>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['email','sms'] as const).map((ch) => (
                  <button key={ch} onClick={() => setChannel(ch)}
                    style={{ flex: 1, padding: '9px 0', border: `1.5px solid ${channel === ch ? '#0067C0' : '#E0E0E0'}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, background: channel === ch ? '#EBF3FB' : '#fff', color: channel === ch ? '#0067C0' : '#555', fontFamily: 'inherit' }}>
                    {ch === 'email' ? '📧 Email' : '📱 SMS'}
                  </button>
                ))}
              </div>
              <button onClick={sendOtp} disabled={!identifier || loading}
                style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: !identifier || loading ? 0.6 : 1 }}>
                {loading ? 'Sending…' : `Send OTP via ${channel}`}
              </button>
            </>
          )}

          {mode === 'otp' && otpSent && (
            <>
              <p style={{ margin: 0, fontSize: 13, color: '#555', textAlign: 'center' }}>OTP sent to <strong>{identifier}</strong></p>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 18, letterSpacing: 6, textAlign: 'center', boxSizing: 'border-box', outline: 'none' }} />
            </>
          )}

          {(mode === 'password' || otpSent) && (
            <button onClick={submit} disabled={loading}
              style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          )}
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/auth/forgot" style={{ fontSize: 13, color: '#0067C0', textDecoration: 'none' }}>Forgot password?</Link>
        </div>
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#888', borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
          Don't have an account? <Link to="/auth/signup" style={{ color: '#0067C0', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
