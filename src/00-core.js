/* Small helpers shared by everything. No document, no window. */
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const sum = (a) => { let s = 0; for (const x of a) s += x; return s; };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = (o) => JSON.parse(JSON.stringify(o));
const pctOf = (part, whole) => (whole > 0 ? Math.round(100 * part / whole) : 0);
const mins = (m) => { const r = Math.round(m); return r >= 90 ? (r / 60).toFixed(1).replace('.0', '') + ' hr' : r + ' min'; };
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many || one + 's');
const addInto = (a, b, k) => { for (const key in b) a[key] = (a[key] || 0) + b[key] * (k == null ? 1 : k); return a; };
/* Stateless hash, 0..1. Anything that should look random but stay the same each time uses this. */
function hash(a, b, c) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul((c | 0) + 101, 2147483629);
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const DAY_MS = 86400000;
const isoOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const dateOf = (iso) => { const p = iso.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const niceDate = (iso) => { const d = dateOf(iso); return MONTH_NAMES[d.getMonth()].slice(0, 3) + ' ' + d.getDate(); };
