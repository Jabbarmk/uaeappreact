import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import api from '../../api';

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-me'],
    queryFn: () => api.get('/admin/me').then((r) => r.data),
    retry: false,
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (isError || !data) return <Navigate to="/admin/login" replace />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      <p>Welcome, <strong>{data.name}</strong>!</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginTop: 24 }}>
        {[
          ['Businesses', '/api/admin/businesses'],
          ['Classifieds', '/api/admin/classifieds'],
          ['Jobs', '/api/admin/jobs'],
          ['Offers', '/api/admin/offers'],
          ['Sliders', '/api/admin/sliders'],
          ['Settings', '/api/admin/settings'],
        ].map(([label]) => (
          <div key={label} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
