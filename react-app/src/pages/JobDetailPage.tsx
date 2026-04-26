import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

const BADGE_CLASS: Record<string, string> = {
  'Full Time': 'badge-fulltime', 'Part Time': 'badge-parttime',
  'Contract': 'badge-contract', 'Freelance': 'badge-freelance',
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get(`/jobs/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  if (!data?.job) return <div style={{ padding: 40 }}>Not found. <Link to="/jobs">Back</Link></div>;

  const { job, profile } = data;
  const titleLower = (job.title || '').toLowerCase();
  let heroBg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=320&fit=crop';
  if (titleLower.includes('design') || titleLower.includes('ux')) heroBg = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=320&fit=crop';
  else if (titleLower.includes('develop') || titleLower.includes('engineer')) heroBg = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=320&fit=crop';
  else if (titleLower.includes('market') || titleLower.includes('sales')) heroBg = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=320&fit=crop';

  const perks = [
    { icon: 'fas fa-laptop-house', label: 'Remote OK' },
    { icon: 'fas fa-heart', label: 'Health Ins.' },
    { icon: 'fas fa-plane', label: 'Air Ticket' },
    { icon: 'fas fa-graduation-cap', label: 'Training' },
  ];

  return (
    <>
      <div className="page-topbar">
        <Link to={-1 as any} className="back-btn"><i className="fas fa-arrow-left"></i></Link>
        <h1>Job Details</h1>
        <div className="right-actions">
          <i className="fas fa-heart" style={{ color: 'var(--warm)' }}></i>
          <i className="fas fa-share-alt"></i>
        </div>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', height: 160 }}>
        <img src={heroBg} alt="Job" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(108,92,231,.75),rgba(13,27,42,.55))' }}></div>
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,var(--primary),#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, boxShadow: '0 4px 14px rgba(0,0,0,.25)', border: '2px solid rgba(255,255,255,.3)' }}>
            <i className="fas fa-building"></i>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{job.company}</div>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 12 }}>{job.location}</div>
          </div>
        </div>
      </div>

      <div className="job-detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1>{job.title}</h1>
          <span className={`job-type-badge ${BADGE_CLASS[job.job_type] || 'badge-fulltime'}`} style={{ position: 'static', flexShrink: 0, marginLeft: 8 }}>{job.job_type}</span>
        </div>
        <div className="company" style={{ marginTop: 4 }}>{job.company}</div>
        <div className="meta" style={{ marginTop: 12 }}>
          <span><i className="fas fa-coins"></i> {job.currency} {Number(job.salary_min).toLocaleString()} – {Number(job.salary_max).toLocaleString()}/mo</span>
          <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
          <span><i className="far fa-clock"></i> {new Date(job.posted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <button className="apply-btn" onClick={() => alert('Application submitted! We will contact you soon.')}>
        <i className="fas fa-paper-plane" style={{ marginRight: 8 }}></i>Apply Now
      </button>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px', overflowX: 'auto' }}>
        {perks.map((p) => (
          <div key={p.label} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--white)', borderRadius: 50, border: '1.5px solid var(--glass-border)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
            <i className={p.icon} style={{ color: 'var(--primary)', fontSize: 13 }}></i>{p.label}
          </div>
        ))}
      </div>

      {job.description && (
        <div className="job-section">
          <h3><i className="fas fa-align-left" style={{ color: 'var(--primary)', marginRight: 8, fontSize: 14 }}></i>Job Description</h3>
          <p>{job.description.split('\n').map((l: string, i: number) => <span key={i}>{l}<br /></span>)}</p>
        </div>
      )}

      {job.requirements && (
        <div className="job-section">
          <h3><i className="fas fa-list-check" style={{ color: 'var(--primary)', marginRight: 8, fontSize: 14 }}></i>Requirements</h3>
          <ul>{job.requirements.split('\n').filter((r: string) => r.trim()).map((r: string, i: number) => <li key={i}>{r.trim()}</li>)}</ul>
        </div>
      )}

      {job.benefits && (
        <div className="job-section">
          <h3><i className="fas fa-gift" style={{ color: 'var(--primary)', marginRight: 8, fontSize: 14 }}></i>Benefits &amp; Perks</h3>
          <ul>{job.benefits.split('\n').filter((b: string) => b.trim()).map((b: string, i: number) => <li key={i}>{b.trim()}</li>)}</ul>
        </div>
      )}

      {profile && (
        <div className="job-section" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={profile.photoUrl} alt={profile.full_name}
            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'; }}
            loading="lazy" decoding="async" />
          <div>
            <h3 style={{ marginBottom: 2 }}>{profile.full_name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{profile.title}</p>
            <Link to={`/profile/${profile.id}`} className="btn-filled" style={{ marginTop: 8, display: 'inline-block', fontSize: 12, padding: '6px 16px' }}>View My CV</Link>
          </div>
        </div>
      )}
    </>
  );
}
