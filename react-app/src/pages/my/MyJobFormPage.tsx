import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { EMIRATES, WORK_MODELS } from '../../constants/uae';

const JOB_TYPES = ['Fulltime', 'Part Time', 'Contract', 'Freelance'];
const FONT = "'Segoe UI',Inter,sans-serif";
const DRAFT_KEY = 'job-form-draft';
const emptyForm = { title: '', company: '', business_id: '', location: '', emirate: '', job_type: '', work_model: '', salary_min: '', salary_max: '', currency: 'AED', description: '', requirements: '', benefits: '' };

interface Business { id: number; name: string; emirate?: string }

export default function MyJobFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bizOpen, setBizOpen] = useState(false);
  const bizRef = useRef<HTMLDivElement>(null);

  const { data: myJobs } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => api.get('/user/jobs').then(r => r.data),
    enabled: isEdit,
  });

  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ['my-businesses'],
    queryFn: () => api.get('/user/businesses').then(r => r.data),
  });

  // Restore a draft saved before navigating off to create a business (new-job only).
  useEffect(() => {
    if (!isEdit) {
      const draft = sessionStorage.getItem(DRAFT_KEY);
      if (draft) { try { setForm({ ...emptyForm, ...JSON.parse(draft) }); } catch { /* ignore */ } sessionStorage.removeItem(DRAFT_KEY); }
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && myJobs) {
      const j = myJobs.find((x: any) => String(x.id) === id);
      if (j) setForm({ title: j.title || '', company: j.company || '', business_id: j.business_id ? String(j.business_id) : '', location: j.location || '', emirate: j.emirate || '', job_type: j.job_type || '', work_model: j.work_model || '', salary_min: j.salary_min || '', salary_max: j.salary_max || '', currency: j.currency || 'AED', description: j.description || '', requirements: j.requirements || '', benefits: j.benefits || '' });
    }
  }, [isEdit, myJobs, id]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (bizRef.current && !bizRef.current.contains(e.target as Node)) setBizOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const pickBusiness = (b: Business) => {
    setForm(p => ({ ...p, company: b.name, business_id: String(b.id), emirate: b.emirate || p.emirate }));
    setBizOpen(false);
  };

  const onCompanyType = (v: string) => {
    // Typing a custom name detaches from any selected business.
    setForm(p => ({ ...p, company: v, business_id: '' }));
    setBizOpen(true);
  };

  const goAddBusiness = () => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    navigate('/my/businesses/new');
  };

  const submit = async () => {
    if (!form.title.trim()) return setError('Job title is required');
    setError(''); setLoading(true);
    try {
      if (isEdit) await api.put(`/user/jobs/${id}`, form);
      else await api.post('/user/jobs', form);
      sessionStorage.removeItem(DRAFT_KEY);
      navigate('/my/jobs');
    } catch (e: any) { setError(e.response?.data?.error || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };
  const lbl = (text: string) => <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{text}</label>;

  const filteredBiz = businesses.filter(b => b.name.toLowerCase().includes(form.company.toLowerCase()));

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

          {/* Company — searchable business selector */}
          <div ref={bizRef} style={{ position: 'relative' }}>
            {lbl('Company')}
            <input
              value={form.company}
              onChange={e => onCompanyType(e.target.value)}
              onFocus={() => setBizOpen(true)}
              placeholder="Search your businesses or type a name"
              style={inp}
            />
            {form.business_id && (
              <span style={{ position: 'absolute', right: 10, top: 32, fontSize: 11, color: '#2E7D32', fontWeight: 600, background: '#E8F5E9', padding: '2px 8px', borderRadius: 10 }}>✓ Linked</span>
            )}
            {bizOpen && (
              <div style={{ position: 'absolute', zIndex: 30, top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.12)', maxHeight: 240, overflowY: 'auto' }}>
                {filteredBiz.length === 0 && (
                  <div style={{ padding: '10px 12px', fontSize: 13, color: '#aaa' }}>
                    {businesses.length === 0 ? 'No registered businesses yet.' : 'No match.'}
                  </div>
                )}
                {filteredBiz.map(b => (
                  <div key={b.id} onMouseDown={e => { e.preventDefault(); pickBusiness(b); }}
                    style={{ padding: '9px 12px', cursor: 'pointer', fontSize: 14, color: '#1a1a1a', borderBottom: '1px solid #F5F5F5', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{b.name}</span>
                    {b.emirate && <span style={{ fontSize: 12, color: '#aaa' }}>{b.emirate}</span>}
                  </div>
                ))}
                <div onMouseDown={e => { e.preventDefault(); goAddBusiness(); }}
                  style={{ padding: '10px 12px', cursor: 'pointer', fontSize: 14, color: '#0067C0', fontWeight: 600 }}>
                  + Add new business
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {lbl('Emirate')}
              <select value={form.emirate} onChange={e => set('emirate', e.target.value)} style={{ ...inp, background: '#fff', color: form.emirate ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select Emirate</option>
                {EMIRATES.map(em => <option key={em} value={em}>{em}</option>)}
              </select>
            </div>
            <div>{lbl('Location / Area')}<input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Business Bay" style={inp} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {lbl('Job Type')}
              <select value={form.job_type} onChange={e => set('job_type', e.target.value)} style={{ ...inp, background: '#fff', color: form.job_type ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select type</option>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              {lbl('Work Model')}
              <select value={form.work_model} onChange={e => set('work_model', e.target.value)} style={{ ...inp, background: '#fff', color: form.work_model ? '#1a1a1a' : '#aaa' }}>
                <option value="">Select model</option>
                {WORK_MODELS.map(w => <option key={w} value={w}>{w}</option>)}
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
