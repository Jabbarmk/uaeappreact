import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const FONT = "'Segoe UI',Inter,sans-serif";
const ACCENT = '#0067C0';
const EMIRATES = ['Dubai','Abu Dhabi','Sharjah','Ajman','Fujairah','Ras Al Khaimah','Umm Al Quwain'];
const STAFF_SECTIONS = ['sliders','main-categories','home-categories','popular-categories','business-categories','businesses','offers','classified-categories','classified-sections','classifieds','jobs','profiles','pages','settings','users','approvals'];

type UserType = 'admin' | 'staff' | 'user';
interface UserRow { id: number; name: string; email: string; mobile: string; emirate: string; user_type: UserType; is_verified: number; is_active: number; created_at: string; }

const emptyForm = { name: '', email: '', mobile: '', password: '', emirate: '', user_type: 'user' as UserType, is_active: 1, is_verified: 1, permissions: [] as string[] };

function TypeBadge({ type }: { type: string }) {
  const c = type === 'admin' ? { bg: '#FFF3E0', color: '#E65100' } : type === 'staff' ? { bg: '#EBF3FB', color: '#0067C0' } : { bg: '#E8F5E9', color: '#2E7D32' };
  return <span style={{ fontSize: 11, padding: '2px 8px', background: c.bg, color: c.color, borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{type}</span>;
}

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{ mode: 'create' | 'edit'; data?: UserRow } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => api.get('/admin/users', { params: { page, pageSize: 20, search: search || undefined } }).then(r => r.data),
  });

  const openCreate = () => { setForm(emptyForm); setErr(''); setDialog({ mode: 'create' }); };

  const openEdit = async (user: UserRow) => {
    setErr('');
    const res = await api.get(`/admin/users/${user.id}`);
    setForm({ ...emptyForm, name: res.data.name || '', email: res.data.email || '', mobile: res.data.mobile || '', emirate: res.data.emirate || '', user_type: res.data.user_type, is_active: res.data.is_active, is_verified: res.data.is_verified, password: '', permissions: res.data.permissions || [] });
    setDialog({ mode: 'edit', data: user });
  };

  const save = async () => {
    if (!form.name.trim()) return setErr('Name is required');
    if (dialog?.mode === 'create' && !form.password.trim()) return setErr('Password is required for new users');
    setSaving(true); setErr('');
    try {
      const body = { ...form, permissions: form.user_type === 'staff' ? form.permissions : undefined };
      if (!body.password) delete (body as any).password;
      if (dialog?.mode === 'create') await api.post('/admin/users', body);
      else await api.put(`/admin/users/${dialog?.data?.id}`, body);
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setDialog(null);
    } catch (e: any) { setErr(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    qc.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const togglePerm = (section: string) => {
    setForm(p => ({ ...p, permissions: p.permissions.includes(section) ? p.permissions.filter(s => s !== section) : [...p.permissions, section] }));
  };

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const inp: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };

  const rows: UserRow[] = data?.rows || [];
  const total = data?.total || 0;
  const pageSize = 20;

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Users</h2>
        <button onClick={openCreate} style={{ padding: '8px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
          + Add User
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, mobile…"
          style={{ ...inp, padding: '10px 14px', fontSize: 14, maxWidth: 360 }} />
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading…</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F9F9F9', borderBottom: '1px solid #E5E5E5' }}>
                {['Name','Email','Mobile','Emirate','Type','Active','Created','Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F0F0F0' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FAFAFA'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '10px 12px', color: '#555' }}>{u.email || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#555' }}>{u.mobile || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#555' }}>{u.emirate || '—'}</td>
                  <td style={{ padding: '10px 12px' }}><TypeBadge type={u.user_type} /></td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 11, padding: '2px 7px', background: u.is_active ? '#E8F5E9' : '#F5F5F5', color: u.is_active ? '#2E7D32' : '#888', borderRadius: 10, fontWeight: 600 }}>
                      {u.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#888', whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <button onClick={() => openEdit(u)} style={{ padding: '4px 10px', border: '1px solid #E0E0E0', borderRadius: 4, background: '#fff', color: '#333', fontSize: 12, cursor: 'pointer', marginRight: 6, fontFamily: FONT }}>Edit</button>
                    <button onClick={() => deleteUser(u.id)} style={{ padding: '4px 10px', border: '1px solid #F1BBBB', borderRadius: 4, background: '#FDF3F2', color: '#C42B1C', fontSize: 12, cursor: 'pointer', fontFamily: FONT }}>Del</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#888' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', border: '1px solid #E0E0E0', borderRadius: 4, background: '#fff', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontFamily: FONT, fontSize: 13 }}>← Prev</button>
          <span style={{ padding: '6px 12px', fontSize: 13, color: '#555' }}>Page {page} of {Math.ceil(total / pageSize)}</span>
          <button disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', border: '1px solid #E0E0E0', borderRadius: 4, background: '#fff', cursor: page >= Math.ceil(total / pageSize) ? 'default' : 'pointer', opacity: page >= Math.ceil(total / pageSize) ? 0.5 : 1, fontFamily: FONT, fontSize: 13 }}>Next →</button>
        </div>
      )}

      {/* Dialog */}
      {dialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setDialog(null)}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 24, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', fontFamily: FONT }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700 }}>{dialog.mode === 'create' ? 'Add User' : 'Edit User'}</h3>
            {err && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 12 }}>{err}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full Name *" style={inp} />
              <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email" type="email" style={inp} />
              <input value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="Mobile (+971...)" style={inp} />
              <input value={form.password} onChange={e => set('password', e.target.value)} placeholder={dialog.mode === 'create' ? 'Password *' : 'New Password (leave blank to keep)'} type="password" style={inp} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <select value={form.emirate} onChange={e => set('emirate', e.target.value)} style={{ ...inp, color: form.emirate ? '#1a1a1a' : '#aaa' }}>
                  <option value="">Emirate</option>
                  {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <select value={form.user_type} onChange={e => set('user_type', e.target.value as UserType)} style={inp}>
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked ? 1 : 0)} /> Active
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.is_verified} onChange={e => set('is_verified', e.target.checked ? 1 : 0)} /> Verified
                </label>
              </div>

              {form.user_type === 'staff' && (
                <div style={{ border: '1px solid #E0E0E0', borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10 }}>Staff Permissions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {STAFF_SECTIONS.map(section => (
                      <label key={section} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>
                        <input type="checkbox" checked={form.permissions.includes(section)} onChange={() => togglePerm(section)} />
                        {section.replace(/-/g, ' ')}
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button onClick={() => setForm(p => ({ ...p, permissions: [...STAFF_SECTIONS] }))} style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #E0E0E0', borderRadius: 4, cursor: 'pointer', fontFamily: FONT }}>Select All</button>
                    <button onClick={() => setForm(p => ({ ...p, permissions: [] }))} style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #E0E0E0', borderRadius: 4, cursor: 'pointer', fontFamily: FONT }}>Clear</button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
              <button onClick={() => setDialog(null)} style={{ padding: '8px 18px', border: '1px solid #E0E0E0', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding: '8px 18px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : dialog.mode === 'create' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
