import { Outlet, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

function useAdminAuth() {
  return useQuery({
    queryKey: ['admin-me'],
    queryFn: () => api.get('/admin/me').then((r) => r.data),
    retry: false,
  });
}

export default function AdminLayout() {
  const { data, isLoading, isError } = useAdminAuth();
  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Checking auth…</div>;
  if (isError || !data) return <Navigate to="/admin/login" replace />;
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <strong>SMARTUAE Admin</strong>
        <span>{data.name}</span>
      </div>
      <Outlet />
    </div>
  );
}
