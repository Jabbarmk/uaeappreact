import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => api.get(`/pages/${slug}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;

  if (isError || !data?.page) {
    return (
      <>
        <div className="page-topbar">
          <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
          <h1>Page Not Found</h1>
        </div>
        <div className="empty-state"><i className="fas fa-exclamation-triangle"></i><p>Page not found</p></div>
      </>
    );
  }

  const page = data.page;
  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>{page.title}</h1>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ background: 'var(--white)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          {(page.content || '').split('\n').map((line: string, i: number) => <span key={i}>{line}<br /></span>)}
        </div>
      </div>
    </>
  );
}
