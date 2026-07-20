export const STUDY_MODES = ['Full-time', 'Part-time'];
export const DELIVERY_MODES = ['On campus', 'Online', 'Hybrid'];

export function fmtFee(v: unknown, currency = 'AED'): string {
  const n = Number(v);
  if (!n) return 'Fee on request';
  return `${currency} ${n.toLocaleString()}`;
}

export function fmtDate(v?: string | null): string {
  if (!v) return '';
  const s = String(v);
  const d = new Date(s.includes('T') ? s : s.replace(' ', 'T'));
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
