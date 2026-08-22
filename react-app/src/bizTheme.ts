// Per-business theme override: when a business has an admin-set `color`,
// it becomes the local --primary for that business's card / detail page.
// CSS variables inherit, so applying this style to a wrapper re-themes
// every var(--primary)-based element inside it. Blank/invalid = undefined
// (falls through to the global theme).
export function bizThemeStyle(color?: string | null): React.CSSProperties | undefined {
  const m = /^#?([0-9a-f]{6})$/i.exec((color || '').trim());
  if (!m) return undefined;
  const hex = '#' + m[1];
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const dark = '#' + [r, g, b].map((v) => Math.round(v * 0.84).toString(16).padStart(2, '0')).join('');
  const light = '#' + [r, g, b].map((v) => Math.round(v + (255 - v) * 0.45).toString(16).padStart(2, '0')).join('');
  return {
    '--primary': hex,
    '--primary-dark': dark,
    '--primary-light': light,
    '--primary-rgb': `${r}, ${g}, ${b}`,
  } as React.CSSProperties;
}
