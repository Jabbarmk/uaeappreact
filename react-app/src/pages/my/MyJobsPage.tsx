import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const FONT = "'Segoe UI',Inter,sans-serif";

function StatusBadge({ status }: { status: string }) {
  const c = status === 'approved' ? { bg: '#E8F5E9', color: '#2E7D32' }
    : status === 'rejected' ? { bg: '#FDF3F2', color: '#C42B1C' }
    : status === 'shortlisted' ? { bg: '#E3F2FD', color: '#0067C0' }
    : { bg: '#FFF8E1', color: '#F57C00' };
  return <span style={{ fontSize: 11, padding: '2px 8px', background: c.bg, color: c.color, borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{status || 'pending'}</span>;
}

function MetaLine({ j }: { j: any }) {
  const parts = [j.company || 'No company', j.emirate || j.location, j.work_model, j.job_type].filter(Boolean);
  return <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{parts.join(' · ')}</div>;
}

export default function MyJobsPage() {
  const [tab, setTab] = useState<'posted' | 'applied'>('posted');
  const navigate = useNavigate();

  const { data: posted, isLoading: loadingPosted } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => api.get('/user/jobs').then(r => r.data),
  });

  const { data: applied, isLoading: loadingApplied } = useQuery({
    queryKey: ['applied-jobs'],
    queryFn: () => api.get('/user/applied-jobs').then(r => r.data),
    enabled: tab === 'applied',
  });

  const tabBtn = (key: 'posted' | 'applied'): React.CSSProperties => ({
    flex: 1, padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 700, cursor: 'pointer',
    color: tab === key ? '#0067C0' : '#888', borderBottom: tab === key ? '2px solid #0067C0' : '2px solid transparent',
    background: 'none', fontFamily: FONT,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/my/profile" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>My Jobs</h2>
          </div>
          <Link to="/my/jobs/new" style={{ padding: '8px 16px', background: '#0067C0', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            + Post Job
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#fff', borderRadius: 12, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <button onClick={() => setTab('posted')} style={tabBtn('posted')}>Posted Jobs</button>
          <button onClick={() => setTab('applied')} style={tabBtn('applied')}>Applied Jobs</button>
        </div>

        {/* POSTED */}
        {tab === 'posted' && (
          loadingPosted ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading…</div>
          ) : !posted?.length ? (
            <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>💼</div>
              <p style={{ margin: 0, fontSize: 15 }}>No job postings yet.</p>
              <Link to="/my/jobs/new" style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', background: '#0067C0', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                Post a Job
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {posted.map((j: any) => (
                <div key={j.id} onClick={() => navigate(`/my/jobs/${j.id}/applicants`)}
                  style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 8, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>💼</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</div>
                    <MetaLine j={j} />
                    <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusBadge status={j.status} />
                      <span style={{ fontSize: 12, color: '#0067C0', fontWeight: 600 }}>👥 {j.applicant_count || 0} applicant{Number(j.applicant_count) === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                  <Link to={`/my/jobs/${j.id}/edit`} onClick={e => e.stopPropagation()}
                    style={{ padding: '6px 14px', border: '1px solid #E0E0E0', borderRadius: 8, textDecoration: 'none', color: '#555', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )
        )}

        {/* APPLIED */}
        {tab === 'applied' && (
          loadingApplied ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading…</div>
          ) : !applied?.length ? (
            <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📨</div>
              <p style={{ margin: 0, fontSize: 15 }}>You haven't applied to any jobs yet.</p>
              <Link to="/jobs" style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', background: '#0067C0', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {applied.map((j: any) => (
                <div key={j.application_id} onClick={() => navigate(`/jobs/${j.id}`)}
                  style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 8, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📨</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</div>
                    <MetaLine j={j} />
                    <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusBadge status={j.application_status} />
                      <span style={{ fontSize: 11, color: '#aaa' }}>Applied {new Date(j.applied_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </div>
                  <span style={{ color: '#ccc', fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'posted' && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#FFF8E1', borderRadius: 8, fontSize: 12, color: '#795548' }}>
            ℹ️ Tap a posted job to see applicants. Postings require admin approval before going live.
          </div>
        )}
      </div>
    </div>
  );
}
