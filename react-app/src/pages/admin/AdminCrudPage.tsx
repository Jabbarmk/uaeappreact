import { useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'toggle' | 'date' | 'image' | 'business-search';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  folder?: string;
  required?: boolean;
}

interface ResourceConfig {
  resource: string;
  label: string;
  displayCol: string;
  listCols?: string[];
  fields: FieldConfig[];
}

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];

// ── Resource configs ──────────────────────────────────────────────────────────

const RESOURCE_CONFIGS: Record<string, ResourceConfig> = {
  sliders: { resource: 'sliders', label: 'Sliders', displayCol: 'title', fields: [
    { key: 'title',       label: 'Title',                          type: 'text' },
    { key: 'subtitle',    label: 'Subtitle',                       type: 'text' },
    { key: 'button_text', label: 'Button Text',                    type: 'text' },
    { key: 'button_link', label: 'Button Link (overrides business)', type: 'text' },
    { key: 'business_id', label: 'Link to Business (optional)',    type: 'business-search' },
    { key: 'image',       label: 'Image',                          type: 'image', folder: 'slides' },
    { key: 'sort_order',  label: 'Sort Order',                     type: 'number' },
    { key: 'is_active',   label: 'Active',                         type: 'toggle' },
  ]},
  'main-categories': { resource: 'main-categories', label: 'Main Categories', displayCol: 'name', listCols: ['icon', 'name', 'link', 'sort_order'], fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'icon',       label: 'Icon',       type: 'text' },
    { key: 'link',       label: 'Link',       type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  'popular-categories': { resource: 'popular-categories', label: 'Popular Categories', displayCol: 'name', listCols: ['image', 'name', 'link', 'sort_order'], fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'image',      label: 'Image',      type: 'image', folder: 'categories' },
    { key: 'link',       label: 'Link',       type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  'business-categories': { resource: 'business-categories', label: 'Business Categories', displayCol: 'name', listCols: ['icon', 'name', 'group_name', 'sort_order'], fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'icon',       label: 'Icon',       type: 'text' },
    { key: 'group_name', label: 'Group Name', type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  businesses: { resource: 'businesses', label: 'Businesses', displayCol: 'name', listCols: ['image', 'name', 'emirate', 'phone', 'rating'], fields: [
    { key: 'name',             label: 'Name',             type: 'text', required: true },
    { key: 'category_id',      label: 'Category ID',      type: 'number' },
    { key: 'tagline',          label: 'Tagline',          type: 'text' },
    { key: 'description',      label: 'Description',      type: 'textarea' },
    { key: 'about',            label: 'About',            type: 'textarea' },
    { key: 'image',            label: 'Cover Image',      type: 'image', folder: 'businesses' },
    { key: 'logo',             label: 'Logo',             type: 'image', folder: 'businesses' },
    { key: 'emirate',          label: 'Emirate',          type: 'select', options: EMIRATES },
    { key: 'address',          label: 'Address',          type: 'text' },
    { key: 'phone',            label: 'Phone',            type: 'text' },
    { key: 'whatsapp',         label: 'WhatsApp',         type: 'text' },
    { key: 'email',            label: 'Email',            type: 'text' },
    { key: 'website',          label: 'Website',          type: 'text' },
    { key: 'opening_time',     label: 'Opening Time',     type: 'text' },
    { key: 'closing_time',     label: 'Closing Time',     type: 'text' },
    { key: 'rating',           label: 'Rating (0–5)',     type: 'number' },
    { key: 'established_year', label: 'Est. Year',        type: 'number' },
    { key: 'is_active',        label: 'Active',           type: 'toggle' },
  ]},
  offers: { resource: 'offers', label: 'Offers', displayCol: 'title', listCols: ['image', 'title', 'price', 'emirate', 'valid_to'], fields: [
    { key: 'business_id',      label: 'Business ID',      type: 'number', required: true },
    { key: 'title',            label: 'Title',            type: 'text',   required: true },
    { key: 'description',      label: 'Description',      type: 'textarea' },
    { key: 'details',          label: 'Details',          type: 'textarea' },
    { key: 'image',            label: 'Image',            type: 'image', folder: 'offers' },
    { key: 'price',            label: 'Price',            type: 'number' },
    { key: 'original_price',   label: 'Original Price',   type: 'number' },
    { key: 'currency',         label: 'Currency',         type: 'text' },
    { key: 'discount_percent', label: 'Discount %',       type: 'number' },
    { key: 'emirate',          label: 'Emirate',          type: 'select', options: EMIRATES },
    { key: 'valid_from',       label: 'Valid From',       type: 'date' },
    { key: 'valid_to',         label: 'Valid To',         type: 'date' },
    { key: 'is_active',        label: 'Active',           type: 'toggle' },
  ]},
  'classified-categories': { resource: 'classified-categories', label: 'Classified Categories', displayCol: 'name', fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'icon',       label: 'Icon',       type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  'classified-sections': { resource: 'classified-sections', label: 'Classified Sections', displayCol: 'name', fields: [
    { key: 'name',       label: 'Name',       type: 'text', required: true },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_active',  label: 'Active',     type: 'toggle' },
  ]},
  classifieds: { resource: 'classifieds', label: 'Classifieds', displayCol: 'title', fields: [
    { key: 'title',            label: 'Title',       type: 'text', required: true },
    { key: 'description',      label: 'Description', type: 'textarea' },
    { key: 'price',            label: 'Price',       type: 'number' },
    { key: 'currency',         label: 'Currency',    type: 'text' },
    { key: 'category_id',      label: 'Category ID', type: 'number' },
    { key: 'section_id',       label: 'Section ID',  type: 'number' },
    { key: 'image',            label: 'Image',       type: 'image', folder: 'classifieds' },
    { key: 'location',         label: 'Location',    type: 'text' },
    { key: 'brand',            label: 'Brand',       type: 'text' },
    { key: 'model',            label: 'Model',       type: 'text' },
    { key: 'color',            label: 'Color',       type: 'text' },
    { key: 'condition_status', label: 'Condition',   type: 'text' },
    { key: 'is_active',        label: 'Active',      type: 'toggle' },
  ]},
  jobs: { resource: 'jobs', label: 'Jobs', displayCol: 'title', fields: [
    { key: 'title',        label: 'Title',        type: 'text', required: true },
    { key: 'company',      label: 'Company',      type: 'text' },
    { key: 'location',     label: 'Location',     type: 'text' },
    { key: 'job_type',     label: 'Job Type',     type: 'select', options: ['Fulltime', 'Part Time', 'Contract', 'Freelance'] },
    { key: 'salary_min',   label: 'Salary Min',   type: 'number' },
    { key: 'salary_max',   label: 'Salary Max',   type: 'number' },
    { key: 'currency',     label: 'Currency',     type: 'text' },
    { key: 'description',  label: 'Description',  type: 'textarea' },
    { key: 'requirements', label: 'Requirements', type: 'textarea' },
    { key: 'benefits',     label: 'Benefits',     type: 'textarea' },
    { key: 'is_featured',  label: 'Featured',     type: 'toggle' },
    { key: 'is_active',    label: 'Active',       type: 'toggle' },
  ]},
  profiles: { resource: 'profiles', label: 'Profiles', displayCol: 'full_name', fields: [
    { key: 'full_name',         label: 'Full Name',        type: 'text', required: true },
    { key: 'title',             label: 'Job Title',        type: 'text' },
    { key: 'photo',             label: 'Photo',            type: 'image', folder: 'profiles' },
    { key: 'email',             label: 'Email',            type: 'text' },
    { key: 'phone',             label: 'Phone',            type: 'text' },
    { key: 'whatsapp',          label: 'WhatsApp',         type: 'text' },
    { key: 'linkedin',          label: 'LinkedIn URL',     type: 'text' },
    { key: 'location',          label: 'Location',         type: 'text' },
    { key: 'current_company',   label: 'Current Company',  type: 'text' },
    { key: 'experience_years',  label: 'Experience Years', type: 'number' },
    { key: 'technical_skills',  label: 'Skills (comma-sep)', type: 'text' },
    { key: 'work_experience',   label: 'Work Exp (Title|Company|Dates|Location per line)', type: 'textarea' },
    { key: 'education_details', label: 'Education (Degree@Uni|Years per line)', type: 'textarea' },
    { key: 'certifications',    label: 'Certifications (one per line)', type: 'textarea' },
    { key: 'projects',          label: 'Projects (one per line)', type: 'textarea' },
    { key: 'languages',         label: 'Languages (comma-sep)', type: 'text' },
    { key: 'is_active',         label: 'Active', type: 'toggle' },
  ]},
  pages: { resource: 'pages', label: 'Pages', displayCol: 'title', fields: [
    { key: 'slug',             label: 'Slug (URL)',        type: 'text', required: true },
    { key: 'title',            label: 'Title',             type: 'text', required: true },
    { key: 'content',          label: 'Content (HTML)',    type: 'textarea' },
    { key: 'meta_description', label: 'Meta Description',  type: 'textarea' },
    { key: 'is_active',        label: 'Active',            type: 'toggle' },
  ]},
};

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT = '#0067C0';
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif";

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '6px 10px',
  border: '1px solid #C8C8C8', borderRadius: 3,
  fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box',
  background: '#fff', color: '#1a1a1a', outline: 'none',
};

// ── ImageUploader ─────────────────────────────────────────────────────────────

function ImageUploader({ folder, currentValue, onChange }: { folder: string; currentValue: string; onChange: (f: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post(`/admin/upload/${folder}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.filename as string);
    } catch { setErr('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      {currentValue && (
        <img src={currentValue.startsWith('http') ? currentValue : `/assets/uploads/${folder}/${currentValue}`} alt="preview"
          style={{ width: 80, height: 60, objectFit: 'cover', border: '1px solid #E0E0E0', borderRadius: 3, display: 'block', marginBottom: 6 }} />
      )}
      <input type="file" accept="image/*" onChange={handleFile} style={{ fontSize: 12 }} />
      {uploading && <div style={{ fontSize: 11, color: '#616161', marginTop: 3 }}>Uploading…</div>}
      {err && <div style={{ fontSize: 11, color: '#C42B1C', marginTop: 3 }}>{err}</div>}
      {currentValue && <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{currentValue}</div>}
    </div>
  );
}

// ── BusinessSearchField ───────────────────────────────────────────────────────

function BusinessSearchField({ value, onChange }: { value: string; onChange: (id: string, name: string) => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ id: number; name: string }[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = (v: string) => {
    setQ(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (v.length < 2) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/admin/businesses/search?q=${encodeURIComponent(v)}`);
        setResults(res.data);
        setOpen(true);
      } catch { setResults([]); }
    }, 250);
  };

  const select = (b: { id: number; name: string }) => {
    setSelectedName(b.name);
    setQ('');
    setResults([]);
    setOpen(false);
    onChange(String(b.id), b.name);
  };

  const clear = () => { setSelectedName(''); onChange('', ''); };

  return (
    <div style={{ position: 'relative' }}>
      {value && selectedName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: '1px solid #C8C8C8', borderRadius: 3, background: '#EBF3FB', fontSize: 13 }}>
          <span style={{ flex: 1, color: '#1a1a1a' }}>#{value} — {selectedName}</span>
          <button type="button" onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14, lineHeight: 1 }}>✕</button>
        </div>
      ) : (
        <>
          <input
            type="text" value={q} onChange={(e) => search(e.target.value)}
            placeholder={value ? `Business ID: ${value} (type to change)` : 'Type 2+ chars to search…'}
            style={inputStyle}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && results.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, zIndex: 200, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {results.map((b) => (
                <div key={b.id} onMouseDown={() => select(b)}
                  style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#EBF3FB'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}>
                  <span style={{ color: '#888', fontSize: 11, marginRight: 8 }}>#{b.id}</span>{b.name}
                </div>
              ))}
            </div>
          )}
          {open && results.length === 0 && q.length >= 2 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 3, padding: '8px 12px', fontSize: 12, color: '#888', zIndex: 200 }}>
              No businesses found
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Dialog (Windows-style modal) ──────────────────────────────────────────────

function CrudDialog({ config, row, onClose, onSaved }: {
  config: ResourceConfig;
  row: Record<string, unknown> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = row !== null;

  const initForm = useCallback((): Record<string, string> => {
    const init: Record<string, string> = {};
    for (const f of config.fields) {
      if (isEdit && row) {
        const v = row[f.key];
        init[f.key] = f.type === 'toggle' ? (v ? '1' : '0') : (v === null || v === undefined ? '' : String(v));
      } else {
        init[f.key] = f.type === 'toggle' ? '0' : '';
      }
    }
    return init;
  }, [config, isEdit, row]);

  const [form, setForm] = useState<Record<string, string>>(initForm);
  const [, setBizNames] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload: Record<string, unknown> = {};
      for (const f of config.fields) {
        const v = form[f.key];
        if (f.type === 'toggle') payload[f.key] = v === '1' ? 1 : 0;
        else if (f.type === 'number') payload[f.key] = v === '' ? null : Number(v);
        else payload[f.key] = v;
      }
      if (isEdit && row) await api.put(`/admin/${config.resource}/${String(row.id)}`, payload);
      else await api.post(`/admin/${config.resource}`, payload);
      onSaved();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Save failed.');
    } finally { setSaving(false); }
  };

  // Group toggle fields at end for cleaner layout
  const textFields = config.fields.filter((f) => f.type !== 'toggle');
  const toggleFields = config.fields.filter((f) => f.type === 'toggle');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 6, width: '100%', maxWidth: 580, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', fontFamily: FONT, border: '1px solid #C8C8C8' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 10px', borderBottom: '1px solid #E5E5E5', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, background: ACCENT, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10 }}>
              {isEdit ? '✎' : '+'}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
              {isEdit ? `Edit ${config.label}` : `New ${config.label}`}
            </span>
            {isEdit && row && <span style={{ fontSize: 11, color: '#888', background: '#F3F3F3', padding: '2px 8px', borderRadius: 10 }}>ID: {String(row.id)}</span>}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, background: 'none', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 16, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#C42B1C'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}>
            ✕
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
          {error && (
            <div style={{ background: '#FDF3F2', border: '1px solid #F1BBBB', color: '#C42B1C', padding: '8px 12px', borderRadius: 3, fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}

          {/* Two-column layout for short fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px 16px' }}>
            {textFields.map((f) => (
              <div key={f.key} style={{ gridColumn: f.type === 'textarea' ? '1 / -1' : undefined }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 4 }}>
                  {f.label}{f.required && <span style={{ color: '#C42B1C', marginLeft: 2 }}>*</span>}
                </label>

                {f.type === 'text' && (
                  <input type="text" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} style={inputStyle} />
                )}
                {f.type === 'number' && (
                  <input type="number" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} style={inputStyle} />
                )}
                {f.type === 'date' && (
                  <input type="date" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} style={inputStyle} />
                )}
                {f.type === 'textarea' && (
                  <textarea rows={4} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} style={{ ...inputStyle, resize: 'vertical' }} />
                )}
                {f.type === 'select' && (
                  <select value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} style={inputStyle}>
                    <option value="">— Select —</option>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                {f.type === 'image' && f.folder && (
                  <ImageUploader folder={f.folder} currentValue={form[f.key] ?? ''} onChange={(fn) => set(f.key, fn)} />
                )}
                {f.type === 'business-search' && (
                  <BusinessSearchField
                    value={form[f.key] ?? ''}
                    onChange={(id, name) => { set(f.key, id); setBizNames((p) => ({ ...p, [f.key]: name })); }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Toggle switches in a row */}
          {toggleFields.length > 0 && (
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 14, padding: '10px 12px', background: '#F9F9F9', borderRadius: 4, border: '1px solid #E5E5E5' }}>
              {toggleFields.map((f) => {
                const on = form[f.key] === '1';
                return (
                  <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                    <div onClick={() => set(f.key, on ? '0' : '1')} style={{ width: 36, height: 20, borderRadius: 10, background: on ? ACCENT : '#C8C8C8', position: 'relative', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 0.15s' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{f.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </form>

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: '1px solid #E5E5E5', flexShrink: 0, background: '#F9F9F9', borderRadius: '0 0 6px 6px' }}>
          <button type="button" onClick={onClose} style={{ padding: '6px 20px', border: '1px solid #C8C8C8', borderRadius: 3, background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#333' }}>
            Cancel
          </button>
          <button onClick={handleSubmit as unknown as React.MouseEventHandler} disabled={saving} style={{ padding: '6px 20px', border: 'none', borderRadius: 3, background: saving ? '#7CA3CC' : ACCENT, color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCrudPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const resourceKey = location.pathname.replace(/\/$/, '').split('/').pop() ?? '';
  const config = RESOURCE_CONFIGS[resourceKey];

  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [modalRow, setModalRow] = useState<Record<string, unknown> | null | 'new'>(null);

  const queryKey = ['admin', resourceKey, page];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => api.get(`/admin/${resourceKey}?page=${page}&pageSize=${pageSize}`).then((r) => r.data as { rows: Record<string, unknown>[]; total: number }),
    enabled: !!config,
  });

  const handleDelete = async (id: unknown) => {
    if (!window.confirm(`Delete record #${id}?`)) return;
    try {
      await api.delete(`/admin/${resourceKey}/${String(id)}`);
      queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] });
    } catch { alert('Delete failed.'); }
  };

  const handleSaved = () => {
    setModalRow(null);
    queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] });
  };

  if (!config) return <div style={{ padding: 32, fontFamily: FONT }}>Unknown resource: <strong>{resourceKey}</strong></div>;

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const thStyle: React.CSSProperties = { padding: '7px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#444', borderBottom: '1px solid #DCDCDC', background: '#F3F3F3', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { padding: '7px 12px', fontSize: 13, borderBottom: '1px solid #EBEBEB', verticalAlign: 'middle' };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1100 }}>

      {/* Command bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, background: '#fff', border: '1px solid #E5E5E5', borderRadius: 4, padding: '8px 12px' }}>
        <button onClick={() => setModalRow('new')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>+</span> New {config.label.replace(/s$/, '')}
        </button>
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] })} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#fff', color: '#333', border: '1px solid #C8C8C8', borderRadius: 3, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ↻ Refresh
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>
          {total > 0 && <>{total} record{total !== 1 ? 's' : ''}</>}
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 4, overflow: 'hidden' }}>
        {isLoading && (
          <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 13 }}>
            <div style={{ width: 24, height: 24, border: `2px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'win-spin 0.8s linear infinite', margin: '0 auto 8px' }} />
            Loading…
          </div>
        )}
        {isError && (
          <div style={{ padding: 20, color: '#C42B1C', fontSize: 13, background: '#FDF3F2', borderBottom: '1px solid #F1BBBB' }}>
            Failed to load data. Check that the API server is running.
          </div>
        )}
        {!isLoading && !isError && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 60 }}>ID</th>
                  {(config.listCols ?? [config.displayCol]).map((col) => (
                    <th key={col} style={thStyle}>
                      {config.fields.find((f) => f.key === col)?.label ?? col}
                    </th>
                  ))}
                  <th style={{ ...thStyle, width: 80, textAlign: 'center' }}>Active</th>
                  <th style={{ ...thStyle, width: 120, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={(config.listCols ?? [config.displayCol]).length + 3} style={{ ...tdStyle, textAlign: 'center', padding: 32, color: '#aaa' }}>
                      No records. Click <strong>New {config.label.replace(/s$/, '')}</strong> to add one.
                    </td>
                  </tr>
                ) : rows.map((row, ri) => {
                  const isActive = row.is_active === 1 || row.is_active === true || row.is_active === '1';
                  const cols = config.listCols ?? [config.displayCol];
                  return (
                    <tr key={String(row.id)} style={{ background: ri % 2 === 1 ? '#FAFAFA' : '#fff' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#EBF3FB'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ri % 2 === 1 ? '#FAFAFA' : '#fff'; }}>
                      <td style={{ ...tdStyle, color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{String(row.id)}</td>
                      {cols.map((col) => {
                        const fieldCfg = config.fields.find((f) => f.key === col);
                        const val = row[col];
                        if (fieldCfg?.type === 'image' && fieldCfg.folder && val) {
                          const imgSrc = String(val).startsWith('http')
                            ? String(val)
                            : `/assets/uploads/${fieldCfg.folder}/${String(val)}`;
                          return (
                            <td key={col} style={tdStyle}>
                              <img src={imgSrc} alt=""
                                style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 3, border: '1px solid #E0E0E0' }} />
                            </td>
                          );
                        }
                        const isDisplayCol = col === config.displayCol;
                        return (
                          <td key={col} style={{ ...tdStyle, fontWeight: isDisplayCol ? 500 : 400, color: isDisplayCol ? '#1a1a1a' : '#555', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {val === null || val === undefined || val === '' ? <span style={{ color: '#ccc' }}>—</span> : String(val)}
                          </td>
                        );
                      })}
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: isActive ? '#107C10' : '#C8C8C8', marginRight: 4 }} />
                        <span style={{ fontSize: 11, color: isActive ? '#107C10' : '#888' }}>{isActive ? 'Yes' : 'No'}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button onClick={() => setModalRow(row)} style={{ padding: '3px 10px', marginRight: 4, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 2, fontSize: 12, cursor: 'pointer', color: '#333', fontFamily: 'inherit' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FB'; (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#C8C8C8'; }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(row.id)} style={{ padding: '3px 10px', background: '#fff', border: '1px solid #C8C8C8', borderRadius: 2, fontSize: 12, cursor: 'pointer', color: '#C42B1C', fontFamily: 'inherit' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FDF3F2'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#C42B1C'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#C8C8C8'; }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', borderTop: '1px solid #E5E5E5', background: '#F9F9F9' }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ padding: '4px 12px', border: '1px solid #C8C8C8', borderRadius: 2, background: '#fff', fontSize: 12, cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#aaa' : '#333', fontFamily: 'inherit' }}>
              ‹ Prev
            </button>
            <span style={{ fontSize: 12, color: '#555', padding: '0 8px' }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ padding: '4px 12px', border: '1px solid #C8C8C8', borderRadius: 2, background: '#fff', fontSize: 12, cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#aaa' : '#333', fontFamily: 'inherit' }}>
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* Dialog */}
      {modalRow !== null && (
        <CrudDialog config={config} row={modalRow === 'new' ? null : modalRow} onClose={() => setModalRow(null)} onSaved={handleSaved} />
      )}

      <style>{`@keyframes win-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
