import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import { EMIRATES, WORK_MODELS } from '../constants/uae';

const JOB_TYPES = ['Fulltime', 'Part Time', 'Contract', 'Freelance'];

const filterSelectStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 12, background: '#fff', color: '#333' };

const LOGO_COLORS = [
  ['var(--primary)','var(--secondary)'], ['#00B894','#00CEC9'], ['#FD79A8','#FF6B6B'],
  ['#FDCB6E','#F39C12'], ['#0984E3','#74B9FF'], ['#E17055','#D63031'],
];

const BADGE_CLASS: Record<string, string> = {
  'Full Time': 'badge-fulltime', 'Part Time': 'badge-parttime',
  'Contract': 'badge-contract', 'Freelance': 'badge-freelance',
};

export default function JobsPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [activeSearch, setActiveSearch] = useState(params.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [emirate, setEmirate] = useState('');
  const [jobType, setJobType] = useState('');
  const [workModel, setWorkModel] = useState('');
  const [sort, setSort] = useState('relevance');

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', activeSearch, emirate, jobType, workModel, sort],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (activeSearch) qs.set('search', activeSearch);
      if (emirate) qs.set('emirate', emirate);
      if (jobType) qs.set('job_type', jobType);
      if (workModel) qs.set('work_model', workModel);
      if (sort) qs.set('sort', sort);
      return api.get(`/jobs?${qs.toString()}`).then((r) => r.data);
    },
  });

  const jobs: any[] = data?.jobs || [];
  const profile: any = data?.profile;

  return (
    <>
      <div className="page-topbar">
        <h1>SMARTUAE <span className="gradient-text" style={{ fontStyle: 'italic' }}>JOBS</span></h1>
      </div>

      <div style={{ position: 'relative', margin: 16, borderRadius: 20, overflow: 'hidden', height: 180 }}>
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=360&fit=crop"
          alt="Jobs UAE" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(var(--secondary-rgb),0.80),rgba(var(--primary-rgb),0.65))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
          <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>UAE Job Market</div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>Find Your Dream Job</div>
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 8 }}>Top companies hiring right now</div>
          <Link to="/profile" style={{ display: 'inline-block', marginTop: 14, background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.35)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600 }}>Upload Your CV</Link>
        </div>
      </div>

      {profile ? (
        <div className="jobs-profile">
          <img src={profile.photoUrl} alt={profile.full_name} className="avatar"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'; }}
            loading="lazy" decoding="async" />
          <div className="profile-info">
            <h2>{profile.full_name}</h2>
            <p>{profile.title}</p>
            <div className="profile-btns">
              <Link to={`/profile/${profile.id}`} className="btn-outline">My CV</Link>
              <a href="#" className="btn-filled">My Jobs</a>
            </div>
          </div>
        </div>
      ) : (
        <div className="jobs-profile">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Profile" className="avatar" loading="lazy" decoding="async" />
          <div className="profile-info">
            <h2>Your Profile</h2>
            <p>Create your Smart CV today</p>
            <div className="profile-btns">
              <Link to="/profile" className="btn-outline">Create CV</Link>
              <a href="#" className="btn-filled">My Jobs</a>
            </div>
          </div>
        </div>
      )}

      <div className="page-search" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search jobs, companies..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') setActiveSearch(search); }} />
        <button type="button" onClick={() => setShowFilters((s) => !s)}
          style={{ flexShrink: 0, border: '1px solid var(--primary)', color: 'var(--primary)', background: showFilters ? 'var(--primary)' : '#fff', WebkitTextFillColor: showFilters ? '#fff' : undefined, borderRadius: 20, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          ⚙ Filters
        </button>
      </div>

      {showFilters && (
        <div style={{ margin: '0 16px 12px', padding: 12, background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,.06)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8 }}>
          <select value={emirate} onChange={(e) => setEmirate(e.target.value)} style={filterSelectStyle}>
            <option value="">All Emirates</option>
            {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} style={filterSelectStyle}>
            <option value="">All Job Types</option>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={workModel} onChange={(e) => setWorkModel(e.target.value)} style={filterSelectStyle}>
            <option value="">Remote/Onsite/Hybrid</option>
            {WORK_MODELS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={filterSelectStyle}>
            <option value="relevance">Sort: Relevance</option>
            <option value="newest">Sort: Newest</option>
            <option value="salary">Sort: Salary</option>
          </select>
        </div>
      )}

      <div className="section-header"><h2>{activeSearch || emirate || jobType || workModel ? 'Results' : 'Featured Jobs'}</h2></div>

      {isLoading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div> : jobs.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No jobs match your filters.</div>
      ) : (
        <>
          {jobs.map((job: any, idx: number) => {
            const c = LOGO_COLORS[idx % LOGO_COLORS.length];
            return (
              <Link to={`/jobs/${job.id}`} className="job-card" key={job.id}>
                <div className="job-logo-placeholder" style={{ background: `linear-gradient(135deg,${c[0]},${c[1]})` }}>
                  <i className="fas fa-building"></i>
                </div>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <div className="company">{job.company}</div>
                  <div className="salary"><i className="fas fa-coins"></i> {job.currency} {Number(job.salary_min).toLocaleString()} – {Number(job.salary_max).toLocaleString()}</div>
                  <div className="job-location"><i className="fas fa-map-marker-alt"></i> {job.location}</div>
                  <div className="job-time"><i className="far fa-clock"></i> {new Date(job.posted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <span className={`job-type-badge ${BADGE_CLASS[job.job_type] || 'badge-fulltime'}`}>{job.job_type}</span>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
}
