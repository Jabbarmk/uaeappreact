import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api';

const FONT = "'Segoe UI',Inter,sans-serif";

function StatusBadge({ status }: { status: string }) {
  const c = status === 'approved' ? { bg: '#E8F5E9', color: '#2E7D32' }
    : status === 'rejected' ? { bg: '#FDF3F2', color: '#C42B1C' }
    : { bg: '#FFF8E1', color: '#F57C00' };
  return <span style={{ fontSize: 11, padding: '2px 8px', background: c.bg, color: c.color, borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{status || 'pending'}</span>;
}

export default function MyClassifiedsPage() {
  const { data: classifieds, isLoading } = useQuery({
    queryKey: ['my-classifieds'],
    queryFn: () => api.get('/user/classifieds').then(r => r.data),
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/my/profile" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>My Classifieds</h2>
          </div>
          <Link to="/my/classifieds/new" style={{ padding: '8px 16px', background: '#0067C0', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            + Post Ad
          </Link>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading…</div>
        ) : !classifieds?.length ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🏷️</div>
            <p style={{ margin: 0, fontSize: 15 }}>No classifieds yet.</p>
            <Link to="/my/classifieds/new" style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', background: '#0067C0', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Post Free Ad
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {classifieds.map((c: any) => (
              <div key={c.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 50, height: 50, borderRadius: 8, background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏷️</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {c.price ? `${c.currency || 'AED'} ${Number(c.price).toLocaleString()}` : 'No price'}
                    {c.category_name ? ` · ${c.category_name}` : ''}
                  </div>
                  <div style={{ marginTop: 5 }}><StatusBadge status={c.status} /></div>
                </div>
                <Link to={`/my/classifieds/${c.id}/edit`}
                  style={{ padding: '6px 14px', border: '1px solid #E0E0E0', borderRadius: 8, textDecoration: 'none', color: '#555', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 14, padding: '10px 14px', background: '#FFF8E1', borderRadius: 8, fontSize: 12, color: '#795548' }}>
          ℹ️ Classified ads require admin approval before going live.
        </div>
      </div>
    </div>
  );
}
