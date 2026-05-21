import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const JOB_TYPES = ['Fulltime', 'Part Time', 'Contract', 'Freelance'];
const FONT = "'Segoe UI',Inter,sans-serif";
const emptyForm = { title: '', company: '', location: '', job_type: '', salary_min: '', salary_max: '', currency: 'AED', description: '', requirements: '', benefits: '' };

export default function MyJobFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: myJobs } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => api.get('/user/jobs').then(r => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && myJobs) {
      const j = myJobs.find((x: any) => String(x.id) === id);
      if (j) setForm({ title: j.title || '', company: j.company || '', location: j.location || '', job_type: j.job_type || '', salary_min: j.salary_min || '', salary_max: j.salary_max || '', currency: j.currency || 'AED', description: j.description || '', requirements: j.requirements || '', benefits: j.benefits || '' });
    }
  }, [isEdit, myJobs, id]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.title.trim()) return setError('Job title is required');
    setError(''); setLoading(true);
    try {
      if (isEdit) await api.put(`/user/jobs/${id}`, form);
      else await api.post('/user/jobs', form);
      navigate('/my/jobs');
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (text: string) => <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{text}</label>;

  return (
    <div style={{ minHeight: '100vh', background: '#F3F3F3', paddingBottom: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Link to="/my/jobs" style={{ color: '#0067C0', textDecoration: 'none', fontSize: 18 }}>←</Link>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Edit Job' : 'Post a Job'}</h2>
        </div>

        {error && <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>{lbl('Job Title *')}<input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Software Engineer" style={inp} /></div>
          <div>{lbl('Company')}<input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company name" style={inp} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{lbl('Location')}<input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Dubai, UAE" style={inp} /></div>
            <div>
              {lbl('Job Type')}
              <select value={form.job_type} onChange={e => set('job_type', e.target.value)} style={{ ...inp, color: form.job_type ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select type</option>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 10 }}>
            <div>{lbl('Min Salary')}<input value={form.salary_min} onChange={e => set('salary_min', e.target.value)} placeholder="5000" type="number" style={inp} /></div>
            <div>{lbl('Max Salary')}<input value={form.salary_max} onChange={e => set('salary_max', e.target.value)} placeholder="10000" type="number" style={inp} /></div>
            <div>{lbl('Currency')}<input value={form.currency} onChange={e => set('currency', e.target.value)} placeholder="AED" style={inp} /></div>
          </div>

          <div>{lbl('Job Description')}<textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role and responsibilities" rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
          <div>{lbl('Requirements')}<textarea value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="Skills and qualifications needed" rows={3} style={{ ...inp, resize: 'vertical' }} /></div>
          <div>{lbl('Benefits')}<textarea value={form.benefits} onChange={e => set('benefits', e.target.value)} placeholder="Benefits and perks offered" rows={2} style={{ ...inp, resize: 'vertical' }} /></div>

          <div style={{ fontSize: 12, color: '#795548', padding: '10px 12px', background: '#FFF8E1', borderRadius: 8 }}>
            ℹ️ Job postings will be reviewed before going live.
          </div>

          <button onClick={submit} disabled={loading}
            style={{ padding: '12px', background: '#0067C0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
