import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

const FONT = "'Segoe UI',Inter,sans-serif";
const ACCENT = '#0067C0';

type Tab = 'all' | 'businesses' | 'jobs' | 'classifieds' | 'properties' | 'companies' | 'projects' | 'events';

interface ApprovalItem {
  id: number;
  name: string;
  emirate: string;
  created_at: string;
  user_name: string;
  user_email: string;
  type: 'business' | 'job' | 'classified' | 'property' | 'company' | 'project' | 'event';
  category_id?: number | null;
  category_name?: string | null;
  requested_category_name?: string | null;
}

interface Category { id: number; name: string; group_name?: string }

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = { business: '🏢', job: '💼', classified: '🏷️', property: '🏠', company: '🏢', project: '🏗️', event: '🎉' };
  return <span style={{ fontSize: 20 }}>{icons[type] || '📄'}</span>;
}

export default function AdminApprovalsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('all');
  const [processing, setProcessing] = useState<string | null>(null);
  // Per-business category resolution choice: '__new__' (create requested) or an existing category id (string).
  const [resolveChoice, setResolveChoice] = useState<Record<number, string>>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-approvals'],
    queryFn: () => api.get('/admin/users/approvals/pending').then(r => r.data),
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['admin-approval-categories'],
    queryFn: () => api.get('/admin/users/approvals/meta/categories').then(r => r.data),
  });

  const approve = async (item: ApprovalItem, action: 'approve' | 'reject') => {
    const key = `${item.type}-${item.id}-${action}`;
    setProcessing(key);
    try {
      const body: Record<string, unknown> = { action };
      if (item.type === 'business' && action === 'approve' && item.requested_category_name) {
        const choice = resolveChoice[item.id] ?? '__new__';
        if (choice === '__new__') body.new_category_name = item.requested_category_name;
        else body.category_id = Number(choice);
      }
      await api.post(`/admin/users/approvals/${item.type}/${item.id}`, body);
      qc.invalidateQueries({ queryKey: ['admin-approvals'] });
      refetch();
    } finally { setProcessing(null); }
  };

  const businesses: ApprovalItem[] = data?.businesses || [];
  const jobs: ApprovalItem[] = data?.jobs || [];
  const classifieds: ApprovalItem[] = data?.classifieds || [];
  const properties: ApprovalItem[] = data?.properties || [];
  const companies: ApprovalItem[] = data?.companies || [];
  const projects: ApprovalItem[] = data?.projects || [];
  const events: ApprovalItem[] = data?.events || [];
  const all = [...businesses, ...jobs, ...classifieds, ...properties, ...companies, ...projects, ...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: all.length },
    { key: 'businesses', label: 'Businesses', count: businesses.length },
    { key: 'jobs', label: 'Jobs', count: jobs.length },
    { key: 'classifieds', label: 'Classifieds', count: classifieds.length },
    { key: 'properties', label: 'Properties', count: properties.length },
    { key: 'companies', label: 'RE Companies', count: companies.length },
    { key: 'projects', label: 'Projects', count: projects.length },
    { key: 'events', label: 'Events', count: events.length },
  ];

  const byTab: Record<Tab, ApprovalItem[]> = { all, businesses, jobs, classifieds, properties, companies, projects, events };
  const items = byTab[tab];

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Pending Approvals</h2>
        <span style={{ fontSize: 13, color: '#888' }}>{all.length} item{all.length !== 1 ? 's' : ''} waiting</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #E5E5E5', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === t.key ? 700 : 400, color: tab === t.key ? ACCENT : '#555', borderBottom: `2px solid ${tab === t.key ? ACCENT : 'transparent'}`, fontFamily: FONT, transition: 'all 0.15s' }}>
            {t.label} {t.count > 0 && <span style={{ marginLeft: 4, background: tab === t.key ? ACCENT : '#E0E0E0', color: tab === t.key ? '#fff' : '#555', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
          <div style={{ color: '#555', fontSize: 15, fontWeight: 500 }}>All caught up! No pending approvals.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => {
            const approveKey = `${item.type}-${item.id}-approve`;
            const rejectKey = `${item.type}-${item.id}-reject`;
            const choice = resolveChoice[item.id] ?? '__new__';
            return (
              <div key={`${item.type}-${item.id}`} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E5E5', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <TypeIcon type={item.type} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>{item.name}</span>
                      <span style={{ fontSize: 11, padding: '2px 7px', background: '#FFF8E1', color: '#F57C00', borderRadius: 8, fontWeight: 600, textTransform: 'capitalize' }}>{item.type}</span>
                      {item.type === 'business' && item.category_name && !item.requested_category_name && (
                        <span style={{ fontSize: 11, padding: '2px 7px', background: '#EAF2FB', color: ACCENT, borderRadius: 8, fontWeight: 600 }}>{item.category_name}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      By <strong style={{ color: '#555' }}>{item.user_name || 'Unknown'}</strong>
                      {item.user_email ? ` (${item.user_email})` : ''}
                      {item.emirate ? ` · ${item.emirate}` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{new Date(item.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => approve(item, 'approve')}
                      disabled={!!processing}
                      style={{ padding: '6px 14px', background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: processing ? 'default' : 'pointer', fontFamily: FONT, opacity: processing === approveKey ? 0.6 : 1 }}>
                      {processing === approveKey ? '…' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => approve(item, 'reject')}
                      disabled={!!processing}
                      style={{ padding: '6px 14px', background: '#FDF3F2', color: '#C42B1C', border: '1px solid #F1BBBB', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: processing ? 'default' : 'pointer', fontFamily: FONT, opacity: processing === rejectKey ? 0.6 : 1 }}>
                      {processing === rejectKey ? '…' : '✕ Reject'}
                    </button>
                  </div>
                </div>

                {/* Category request resolution (businesses only) */}
                {item.type === 'business' && item.requested_category_name && (
                  <div style={{ marginTop: 12, padding: '12px 14px', background: '#FFFBF0', border: '1px solid #FCE8B8', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: '#B26A00', fontWeight: 700, marginBottom: 8 }}>
                      🆕 Category requested: “{item.requested_category_name}” <span style={{ fontWeight: 400, color: '#aaa' }}>(currently parked under “Other”)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#555' }}>On approve:</span>
                      <select
                        value={choice}
                        onChange={e => setResolveChoice(p => ({ ...p, [item.id]: e.target.value }))}
                        style={{ padding: '7px 10px', border: '1px solid #E0C98A', borderRadius: 6, fontSize: 13, fontFamily: FONT, background: '#fff', maxWidth: 320 }}>
                        <option value="__new__">➕ Create new category “{item.requested_category_name}”</option>
                        <optgroup label="— or assign existing —">
                          {categories.filter(c => c.name !== 'Other').map(c => (
                            <option key={c.id} value={String(c.id)}>{c.name}{c.group_name ? ` (${c.group_name})` : ''}</option>
                          ))}
                        </optgroup>
                      </select>
                      <span style={{ fontSize: 11, color: '#999' }}>
                        {choice === '__new__' ? 'A new category will be created and assigned.' : 'The selected category will be assigned.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
