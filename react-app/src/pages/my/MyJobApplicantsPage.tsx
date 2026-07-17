import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../../api';

const FONT = "'Segoe UI',Inter,sans-serif";
const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face';

interface Applicant {
  application_id: number;
  status: string;
  applied_at: string;
  cover_letter?: string;
  user_id: number;
  user_name?: string;
  profile_id?: number;
  full_name?: string;
  title?: string;
  photoUrl?: string | null;
  experience_years?: number;
  notice_period?: string;
  location?: string;
  visa_status?: string;
}

function StatusBadge({ status }: { status: string }) {
  const c = status === 'shortlisted' ? { bg: '#E3F2FD', color: '#0067C0' }
    : status === 'rejected' ? { bg: '#FDF3F2', color: '#C42B1C' }
    : { bg: '#FFF8E1', color: '#F57C00' };
  return <span style={{ fontSize: 11, padding: '2px 8px', background: c.bg, color: c.color, borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{status || 'pending'}</span>;
}

export default function MyJobApplicantsPage() {
  const { id } = useParams();
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ job: any; applicants: Applicant[] }>({
    queryKey: ['job-applicants', id],
    queryFn: () => api.get(`/user/jobs/${id}/applicants`).then(r => r.data),
  });

  const job = data?.job;
  const applicants = data?.applicants || [];

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Link to="/my/jobs" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Applicants</h2>
            {job && <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{job.title}</div>}
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading…</div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
            <p style={{ margin: 0, fontSize: 15 }}>No applicants yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {applicants.map((a) => {
              const name = a.full_name || a.user_name || 'Applicant';
              const open = openId === a.application_id;
              return (
                <div key={a.application_id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <div onClick={() => setOpenId(open ? null : a.application_id)}
                    style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                    <img src={a.photoUrl || AVATAR_FALLBACK} alt={name}
                      onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK; }}
                      style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #EAF2FB' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>{name}</div>
                      {a.title && <div style={{ fontSize: 12, color: '#0067C0', fontWeight: 600, marginTop: 1 }}>{a.title}</div>}
                      {/* Experience — emphasised */}
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', marginTop: 4, lineHeight: 1 }}>
                        {a.experience_years ? `${a.experience_years} yr${a.experience_years === 1 ? '' : 's'}` : '—'}
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#aaa', marginLeft: 6 }}>experience</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                        <span style={{ fontSize: 12, color: '#555' }}>⏱ {a.notice_period || 'N/A'}</span>
                        <span style={{ fontSize: 12, color: '#555' }}>📍 {a.location || 'N/A'}</span>
                      </div>
                    </div>
                    <span style={{ color: '#ccc', fontSize: 18, flexShrink: 0 }}>{open ? '▾' : '›'}</span>
                  </div>

                  {open && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid #F0F0F0' }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
                        <StatusBadge status={a.status} />
                        {a.visa_status && <span style={{ fontSize: 12, color: '#555', background: '#F3F3F3', padding: '2px 8px', borderRadius: 10 }}>🪪 {a.visa_status}</span>}
                        <span style={{ fontSize: 11, color: '#aaa', alignSelf: 'center' }}>Applied {new Date(a.applied_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      {a.cover_letter && (
                        <div style={{ fontSize: 13, color: '#444', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: '#FAFBFC', border: '1px solid #EEE', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                          {a.cover_letter}
                        </div>
                      )}
                      {a.profile_id ? (
                        <Link to={`/profile/${a.profile_id}`}
                          style={{ display: 'inline-block', padding: '8px 18px', background: '#0067C0', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                          View full CV →
                        </Link>
                      ) : (
                        <div style={{ fontSize: 12, color: '#aaa' }}>This applicant hasn't published a CV.</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
