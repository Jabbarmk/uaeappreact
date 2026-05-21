import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const initial = user?.name?.[0]?.toUpperCase() ?? '?';

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 500, padding: '10px 14px' }} ref={ref}>
      {user ? (
        <>
          <div onClick={() => setOpen((o) => !o)} style={{ width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', border: '2px solid #0067C0', boxShadow: '0 2px 8px rgba(0,103,192,0.2)', background: '#0067C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
            {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
          </div>

          {open && (
            <div style={{ position: 'absolute', top: 52, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', minWidth: 220, padding: '8px 0', border: '1px solid #E5E5E5', fontFamily: "'Segoe UI',Inter,sans-serif" }}>
              <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #F0F0F0' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{user.name}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{user.email || user.mobile}</div>
                <div style={{ fontSize: 11, marginTop: 4, display: 'inline-block', padding: '2px 8px', background: user.user_type === 'admin' ? '#FFF3E0' : user.user_type === 'staff' ? '#EBF3FB' : '#E8F5E9', color: user.user_type === 'admin' ? '#E65100' : user.user_type === 'staff' ? '#0067C0' : '#2E7D32', borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>
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
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F5F5F5'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <span>{item.icon}</span> {item.label}
                </Link>
              ))}

              {(user.user_type === 'admin' || user.user_type === 'staff') && (
                <Link to="/admin" onClick={() => setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', textDecoration: 'none', color: '#0067C0', fontSize: 13, fontWeight: 600, borderTop: '1px solid #F0F0F0', marginTop: 4 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#EBF3FB'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  ⚙️ Admin Panel
                </Link>
              )}

              <button onClick={() => { logout(); setOpen(false); navigate('/'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#C42B1C', fontSize: 13, fontWeight: 600, width: '100%', borderTop: '1px solid #F0F0F0', marginTop: 4, fontFamily: 'inherit' }}>
                ⇥ Sign out
              </button>
            </div>
          )}
        </>
      ) : (
        <Link to="/auth/login"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#0067C0', color: '#fff', borderRadius: 20, textDecoration: 'none', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,103,192,0.2)' }}>
          <i className="fas fa-user" style={{ fontSize: 11 }} /> Sign in
        </Link>
      )}
    </div>
  );
}
