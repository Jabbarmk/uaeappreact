// Course image with a common-icon fallback when the course has no image.
export default function CourseThumb({
  url, icon, w = 56, h = 56, radius = 12, style,
}: { url?: string | null; icon?: string; w?: number | string; h?: number | string; radius?: number; style?: React.CSSProperties }) {
  const base: React.CSSProperties = { width: w, height: h, borderRadius: radius, flexShrink: 0, ...style };
  if (url) return <img src={url} alt="" loading="lazy" style={{ ...base, objectFit: 'cover', display: 'block' }} />;
  const fontSize = typeof h === 'number' ? Math.round(h * 0.46) : 30;
  return (
    <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, background: 'linear-gradient(135deg,rgba(108,92,231,.16),rgba(0,206,201,.16))', color: 'var(--primary)' }}>
      {icon || '🎓'}
    </div>
  );
}
