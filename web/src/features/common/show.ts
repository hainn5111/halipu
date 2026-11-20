/** Chuỗi hiển thị an toàn cho giá trị bất kỳ (dữ liệu Fonda có thể là object lạ — `String(obj)` có thể ném lỗi và làm trắng cả trang). */
export function show(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
  try { return JSON.stringify(v) ?? ''; } catch { return '[?]'; }
}
