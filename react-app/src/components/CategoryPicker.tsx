import { useState, useRef, useEffect } from 'react';

const FONT = "'Segoe UI',Inter,sans-serif";

export interface Category { id: number; name: string; group_name?: string }

interface Props {
  categories: Category[];
  /** selected existing category id as string, or '' */
  categoryId: string;
  /** requested (new) category name, or '' */
  requestedName: string;
  onChange: (next: { categoryId: string; requestedName: string }) => void;
  placeholder?: string;
}

/**
 * Single-select category combobox.
 * - Search existing categories.
 * - If none match, offer to request a brand-new category (free text) which an
 *   admin later approves/creates. Until then the business is parked under "Other".
 */
export default function CategoryPicker({ categories, categoryId, requestedName, onChange, placeholder }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selectedCat = categoryId ? categories.find((c) => String(c.id) === String(categoryId)) : undefined;
  const hasSelection = !!selectedCat || !!requestedName;

  const q = query.trim().toLowerCase();
  const filtered = categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 30);
  const exactMatch = categories.some((c) => c.name.toLowerCase() === q);

  const pickExisting = (c: Category) => { onChange({ categoryId: String(c.id), requestedName: '' }); setOpen(false); setQuery(''); };
  const requestNew = (name: string) => { onChange({ categoryId: '', requestedName: name.trim() }); setOpen(false); setQuery(''); };
  const clear = () => { onChange({ categoryId: '', requestedName: '' }); setOpen(true); setQuery(''); };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' };

  return (
    <div ref={boxRef} style={{ position: 'relative', fontFamily: FONT }}>
      {hasSelection ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 12px', border: '1px solid #E0E0E0', borderRadius: 8, background: '#fff' }}>
          {selectedCat ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#0067C0', fontWeight: 600 }}>
              <span style={{ color: '#2E7D32' }}>✓</span> {selectedCat.name}
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#B26A00', fontWeight: 600 }}>
              <span>🆕</span> Requested: “{requestedName}”
              <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>(pending admin review)</span>
            </span>
          )}
          <button type="button" onClick={clear}
            style={{ border: 'none', background: 'none', color: '#888', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Change</button>
        </div>
      ) : (
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || 'Search category or type to request a new one'}
          style={inp}
        />
      )}

      {open && !hasSelection && (
        <div style={{ position: 'absolute', zIndex: 30, top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.12)', maxHeight: 260, overflowY: 'auto' }}>
          {filtered.map((c) => (
            <div key={c.id} onMouseDown={(e) => { e.preventDefault(); pickExisting(c); }}
              style={{ padding: '9px 12px', cursor: 'pointer', fontSize: 14, color: '#1a1a1a', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F5F5' }}>
              <span>{c.name}</span>
              {c.group_name && <span style={{ fontSize: 11, color: '#aaa' }}>{c.group_name}</span>}
            </div>
          ))}
          {query.trim() && !exactMatch && (
            <div onMouseDown={(e) => { e.preventDefault(); requestNew(query); }}
              style={{ padding: '10px 12px', cursor: 'pointer', fontSize: 14, color: '#B26A00', fontWeight: 600, background: '#FFF8E1' }}>
              🆕 Request new category: “{query.trim()}”
            </div>
          )}
          {filtered.length === 0 && !query.trim() && (
            <div style={{ padding: '10px 12px', fontSize: 13, color: '#aaa' }}>Type to search categories…</div>
          )}
        </div>
      )}
    </div>
  );
}
