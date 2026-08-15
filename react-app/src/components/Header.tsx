import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Circular profile control: avatar + dropdown when signed in, login icon button otherwise. */
export function ProfileButton() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) {
    return (
      <Link to="/auth/login" aria-label="Sign in"
        style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '1px solid #E5E8F0', boxShadow: '0 2px 8px rgba(13,27,42,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D1B2A', textDecoration: 'none' }}>
        <i className="far fa-user" style={{ fontSize: 15 }} />
      </Link>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() ?? '?';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen((o) => !o)} role="button" aria-label="Account menu"
        style={{ width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', border: '2px solid var(--primary)', boxShadow: '0 2px 8px rgba(108,92,231,0.25)', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
        {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
      </div>

      {open && (
        <div style={{ position: 'absolute', top: 48, right: 0, background: '#fff', borderRadius: 14, boxShadow: '0 12px 36px rgba(13,27,42,0.16)', minWidth: 230, padding: '8px 0', border: '1px solid #EEEDF5', zIndex: 600 }}>
          <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #F3F2F9' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dark)' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{user.email || user.mobile}</div>
            <div style={{ fontSize: 11, marginTop: 5, display: 'inline-block', padding: '2px 9px', background: user.user_type === 'admin' ? '#FFF3E0' : user.user_type === 'staff' ? '#EFEDFC' : '#E8F5E9', color: user.user_type === 'admin' ? '#E65100' : user.user_type === 'staff' ? 'var(--primary)' : '#2E7D32', borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>
              {user.user_type}
            </div>
          </div>

          {[
            { to: '/my/profile',      icon: '👤', label: 'My Profile' },
            { to: '/my/businesses',   icon: '🏢', label: 'My Businesses' },
            { to: '/my/jobs',         icon: '💼', label: 'My Jobs' },
            { to: '/my/classifieds',  icon: '🏷️', label: 'My Classifieds' },
            { to: '/my/cv',           icon: '📄', label: 'My CV' },
          ].map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', textDecoration: 'none', color: '#333', fontSize: 13, fontWeight: 500 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F7F6FC'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}

          {(user.user_type === 'admin' || user.user_type === 'staff') && (
            <Link to="/admin" onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', textDecoration: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 600, borderTop: '1px solid #F3F2F9', marginTop: 4 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F1EFFC'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              ⚙️ Admin Panel
            </Link>
          )}

          <button onClick={() => { logout(); setOpen(false); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#C42B1C', fontSize: 13, fontWeight: 600, width: '100%', borderTop: '1px solid #F3F2F9', marginTop: 4, fontFamily: 'inherit' }}>
            ⇥ Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/** Global floating profile control. Hidden on the home page, which hosts its own top bar. */
export default function Header() {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 500, padding: '10px 14px' }}>
      <ProfileButton />
    </div>
  );
}
