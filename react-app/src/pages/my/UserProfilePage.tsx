import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const EMIRATES = ['Dubai','Abu Dhabi','Sharjah','Ajman','Fujairah','Ras Al Khaimah','Umm Al Quwain'];
const FONT = "'Segoe UI',Inter,sans-serif";

export default function UserProfilePage() {
  const { user, refresh } = useAuth();
  const qc = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', emirate: '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api.get('/user/profile').then(r => r.data),
  });

  useEffect(() => {
    if (profile) setForm({ name: profile.name || '', mobile: profile.mobile || '', emirate: profile.emirate || '' });
  }, [profile]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const setPw = (k: string, v: string) => setPwForm(p => ({ ...p, [k]: v }));

  const updateProfile = async () => {
    setErr(''); setMsg('');
    try {
      await api.put('/user/profile', form);
      setMsg('Profile updated successfully!');
      setEditMode(false);
      refresh();
      qc.invalidateQueries({ queryKey: ['user-profile'] });
    } catch (e: any) { setErr(e.response?.data?.error || 'Update failed'); }
  };

  const changePassword = async () => {
    if (pwForm.new_password !== pwForm.confirm) return setErr('Passwords do not match');
    if (pwForm.new_password.length < 6) return setErr('Password must be at least 6 characters');
    setErr(''); setMsg('');
    try {
      await api.put('/user/profile', { current_password: pwForm.current_password, new_password: pwForm.new_password });
      setMsg('Password changed successfully!');
      setPwForm({ current_password: '', new_password: '', confirm: '' });
    } catch (e: any) { setErr(e.response?.data?.error || 'Password change failed'); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const initial = user?.name?.[0]?.toUpperCase() ?? '?';
  const typeColor = user?.user_type === 'admin' ? { bg: '#FFF3E0', color: '#E65100' }
    : user?.user_type === 'staff' ? { bg: '#EBF3FB', color: '#0067C0' }
    : { bg: '#E8F5E9', color: '#2E7D32' };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>

        {/* Avatar card */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '24px 20px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0067C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
            {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a' }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{user?.email || user?.mobile}</div>
            <span style={{ fontSize: 11, marginTop: 6, display: 'inline-block', padding: '2px 10px', background: typeColor.bg, color: typeColor.color, borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>
              {user?.user_type}
            </span>
          </div>
        </div>

        {msg && <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#2E7D32', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{msg}</div>}
        {err && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{err}</div>}

        {/* Personal info */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Personal Information</div>
            <button onClick={() => { setEditMode(e => !e); setErr(''); setMsg(''); }}
              style={{ padding: '6px 14px', border: '1px solid #0067C0', borderRadius: 8, background: editMode ? '#0067C0' : '#fff', color: editMode ? '#fff' : '#0067C0', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full Name" style={inp} />
              <input value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="Mobile (+971...)" style={inp} />
              <select value={form.emirate} onChange={e => set('emirate', e.target.value)} style={{ ...inp, color: form.emirate ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select Emirate</option>
                {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <button onClick={updateProfile} style={{ padding: '10px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              {[{ label: 'Name', value: profile?.name }, { label: 'Email', value: profile?.email || '—' }, { label: 'Mobile', value: profile?.mobile || '—' }, { label: 'Emirate', value: profile?.emirate || '—' }].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F5F5F5', fontSize: 14 }}>
                  <span style={{ color: '#888' }}>{row.label}</span>
                  <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change password */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Change Password</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="password" value={pwForm.current_password} onChange={e => setPw('current_password', e.target.value)} placeholder="Current Password" style={inp} />
            <input type="password" value={pwForm.new_password} onChange={e => setPw('new_password', e.target.value)} placeholder="New Password" style={inp} />
            <input type="password" value={pwForm.confirm} onChange={e => setPw('confirm', e.target.value)} placeholder="Confirm New Password" style={inp} />
            <button onClick={changePassword} disabled={!pwForm.current_password || !pwForm.new_password}
              style={{ padding: '10px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: !pwForm.current_password || !pwForm.new_password ? 0.6 : 1 }}>
              Update Password
            </button>
          </div>
        </div>

        {/* Quick nav */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {[
            { to: '/my/businesses', icon: '🏢', label: 'My Businesses' },
            { to: '/my/jobs', icon: '💼', label: 'My Jobs' },
            { to: '/my/classifieds', icon: '🏷️', label: 'My Classifieds' },
            { to: '/my/cv', icon: '📄', label: 'My CV' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', textDecoration: 'none', color: '#333', fontSize: 14, fontWeight: 500, borderRadius: 8 }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F5F5F5'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              <span style={{ marginLeft: 'auto', color: '#ccc', fontSize: 16 }}>›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
