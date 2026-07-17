import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setError(''); setLoading(true);
    try {
      await api.post('/auth/send-otp', { identifier: email, channel: 'email', type: 'login' });
      setOtpSent(true);
    } catch (e: any) { setError(e.response?.data?.error || 'Failed to send code'); }
    finally { setLoading(false); }
  };

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login-otp', { identifier: email, otp_code: otp });
      login(res.data.user);
      navigate('/');
    } catch (e: any) { setError(e.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F3F3', padding: 16, fontFamily: "'Segoe UI',Inter,sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: '#0067C0', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>S</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>Sign in to SMARTUAE</h2>
          <p style={{ margin: '6px 0 0', color: '#888', fontSize: 13 }}>We'll email you a one-time code</p>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address" type="email" disabled={otpSent}
            onKeyDown={(e) => e.key === 'Enter' && !otpSent && email && sendOtp()}
            style={{ ...inp, background: otpSent ? '#F7F7F7' : '#fff' }} />

          {!otpSent ? (
            <button onClick={sendOtp} disabled={!email || loading}
              style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: !email || loading ? 0.6 : 1 }}>
              {loading ? 'Sending…' : 'Send code'}
            </button>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 13, color: '#555', textAlign: 'center' }}>Code sent to <strong>{email}</strong></p>
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="Enter 6-digit code" maxLength={6}
                onKeyDown={(e) => e.key === 'Enter' && otp.length === 6 && submit()}
                style={{ ...inp, fontSize: 18, letterSpacing: 6, textAlign: 'center' }} />
              <button onClick={submit} disabled={otp.length !== 6 || loading}
                style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: otp.length !== 6 || loading ? 0.6 : 1 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <button onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#0067C0', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Use a different email
              </button>
              <button onClick={sendOtp} disabled={loading}
                style={{ background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                Didn't get it? Resend code
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#888', borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
          Don't have an account? <Link to="/auth/signup" style={{ color: '#0067C0', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
