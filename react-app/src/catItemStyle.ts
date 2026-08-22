// Admin-set sizing for the category icon buttons (Categories & Search pages).
// width → responsive auto-fill grid (bigger buttons = fewer per row and vice
// versa); height/radius applied per card; emoji scales with the width.

export interface CatItemStyle { width: number | null; height: number | null; radius: number | null }

export function catGridStyle(st?: CatItemStyle | null): React.CSSProperties | undefined {
  return st?.width ? { gridTemplateColumns: `repeat(auto-fill, minmax(${st.width}px, 1fr))` } : undefined;
}

export function catItemStyle(st?: CatItemStyle | null): React.CSSProperties | undefined {
  if (!st) return undefined;
  const o: React.CSSProperties = {};
  if (st.height) { o.height = st.height; o.justifyContent = 'center'; }
  if (st.radius != null) o.borderRadius = st.radius;
  return Object.keys(o).length ? o : undefined;
}

export function catEmojiStyle(st?: CatItemStyle | null): React.CSSProperties | undefined {
  return st?.width ? { fontSize: Math.round(Math.min(52, Math.max(22, st.width * 0.32))) } : undefined;
}
