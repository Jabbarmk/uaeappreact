import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

type Step = 'identifier' | 'otp' | 'newpass' | 'done';

export default function ForgotPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [channel, setChannel] = useState<'email'|'sms'>('email');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setError(''); setLoading(true);
    try {
      await api.post('/auth/send-otp', { identifier, channel, type: 'forgot' });
      setStep('otp');
    } catch (e: any) { setError(e.response?.data?.error || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setError(''); setLoading(true);
    try {
      await api.post('/auth/verify-otp', { identifier, otp_code: otp, type: 'forgot' });
      setStep('newpass');
    } catch (e: any) { setError(e.response?.data?.error || 'Invalid OTP'); }
    finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (newPass !== confirm) return setError('Passwords do not match');
    setError(''); setLoading(true);
    try {
      await api.post('/auth/reset-password', { identifier, otp_code: otp, new_password: newPass });
      setStep('done');
    } catch (e: any) { setError(e.response?.data?.error || 'Reset failed'); }
    finally { setLoading(false); }
  };

  const inp = (extra?: object) => ({ width: '100%', padding: '11px 14px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, outline: 'none', ...extra });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F3F3', padding: 16, fontFamily: "'Segoe UI',Inter,sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Reset Password</h2>
          <p style={{ margin: '6px 0 0', color: '#888', fontSize: 13 }}>We'll send you a verification code</p>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {step === 'identifier' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email or Mobile number" style={inp()} />
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
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#555' }}>Code sent to <strong>{identifier}</strong></p>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" maxLength={6} style={inp({ fontSize: 24, letterSpacing: 8, textAlign: 'center' })} />
            <button onClick={verifyOtp} disabled={otp.length !== 6 || loading}
              style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: otp.length !== 6 || loading ? 0.6 : 1 }}>
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </div>
        )}

        {step === 'newpass' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password" style={inp()} />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" style={inp()} />
            <button onClick={resetPassword} disabled={!newPass || loading}
              style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: !newPass || loading ? 0.6 : 1 }}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 15, color: '#333', marginBottom: 20 }}>Password reset successfully!</p>
            <button onClick={() => navigate('/auth/login')} style={{ padding: '12px 32px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
          </div>
        )}

        {step !== 'done' && (
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13 }}>
            <Link to="/auth/login" style={{ color: '#0067C0', textDecoration: 'none' }}>← Back to sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
}
