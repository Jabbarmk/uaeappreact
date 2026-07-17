import { useState, useRef, useEffect } from 'react';
import api from '../api';

const FONT = "'Segoe UI',Inter,sans-serif";

interface Props {
  label: string;
  /** comma-separated string of selected values */
  value: string;
  onChange: (csv: string) => void;
  /** taxonomy endpoint: 'skills' | 'languages' */
  endpoint: 'skills' | 'languages';
  placeholder?: string;
}

/**
 * Tag input backed by a global master table.
 * - Type to search suggestions from GET /{endpoint}.
 * - Click a suggestion or press Enter/comma to add a tag.
 * - A brand-new tag is POSTed to /user/{endpoint} so it becomes a global suggestion.
 * - Selected tags are stored as a comma-separated string (backward compatible).
 */
export default function TagPicker({ label, value, onChange, endpoint, placeholder }: Props) {
  const tags = value.split(',').map((s) => s.trim()).filter(Boolean);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when the input changes (debounced).
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const r = await api.get(`/${endpoint}`, { params: { search: input } });
        if (!cancelled) setSuggestions((r.data as { name: string }[]).map((s) => s.name));
      } catch { /* ignore */ }
    }, 180);
    return () => { cancelled = true; clearTimeout(t); };
  }, [input, endpoint]);

  // Close dropdown on outside click.
  useEffect(() => {
    const h = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const has = (name: string) => tags.some((t) => t.toLowerCase() === name.toLowerCase());

  const addTag = async (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    if (!has(name)) {
      onChange([...tags, name].join(', '));
      // If it's not already a known suggestion, register it globally.
      const known = suggestions.some((s) => s.toLowerCase() === name.toLowerCase());
      if (!known) { try { await api.post(`/user/${endpoint}`, { name }); } catch { /* ignore */ } }
    }
    setInput('');
    setActiveIdx(-1);
  };

  const removeTag = (name: string) => onChange(tags.filter((t) => t !== name).join(', '));

  const filtered = suggestions.filter((s) => !has(s)).slice(0, 12);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) addTag(filtered[activeIdx]);
      else if (input.trim()) addTag(input);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); setOpen(true); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const inpWrap: React.CSSProperties = {
    display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
    padding: '7px 8px', border: '1px solid #E0E0E0', borderRadius: 8,
    background: '#fff', minHeight: 42, boxSizing: 'border-box',
  };

  return (
    <div ref={boxRef} style={{ position: 'relative', fontFamily: FONT }}>
      <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
      <div style={inpWrap} onClick={() => setOpen(true)}>
        {tags.map((t) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#E8F1FB', color: '#0067C0', borderRadius: 14, padding: '3px 6px 3px 10px', fontSize: 13, fontWeight: 600 }}>
            {t}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(t); }}
              style={{ border: 'none', background: 'rgba(0,103,192,0.15)', color: '#0067C0', borderRadius: '50%', width: 16, height: 16, lineHeight: '14px', cursor: 'pointer', fontSize: 11, padding: 0 }}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={tags.length ? '' : (placeholder || 'Type to search…')}
          style={{ flex: 1, minWidth: 100, border: 'none', outline: 'none', fontSize: 14, fontFamily: FONT, padding: '4px 2px', background: 'transparent' }}
        />
      </div>

      {open && (filtered.length > 0 || input.trim()) && (
        <div style={{ position: 'absolute', zIndex: 30, top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.12)', maxHeight: 240, overflowY: 'auto' }}>
          {input.trim() && !suggestions.some((s) => s.toLowerCase() === input.trim().toLowerCase()) && !has(input.trim()) && (
            <div onMouseDown={(e) => { e.preventDefault(); addTag(input); }}
              style={{ padding: '9px 12px', cursor: 'pointer', fontSize: 14, color: '#0067C0', fontWeight: 600, borderBottom: filtered.length ? '1px solid #F0F0F0' : 'none' }}>
              + Add “{input.trim()}”
            </div>
          )}
          {filtered.map((s, i) => (
            <div key={s} onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{ padding: '9px 12px', cursor: 'pointer', fontSize: 14, color: '#1a1a1a', background: i === activeIdx ? '#F2F8FF' : '#fff' }}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
