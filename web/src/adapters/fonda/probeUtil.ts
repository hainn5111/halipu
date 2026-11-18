// Hàm THUẦN cho bộ dò API (có test, không phụ thuộc mạng).
/** Rút gọn mẫu: mảng chỉ giữ 3 phần tử đầu. */
export function trim(v: unknown): unknown {
  if (Array.isArray(v)) return v.slice(0, 3).map(trim);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v as object).map(([k, x]) => [k, trim(x)]));
  return v;
}

/** Cấu trúc "đường.dẫn: kiểu" (không chứa giá trị). */
export function shape(v: unknown, path = '', acc: string[] = []): string[] {
  if (Array.isArray(v)) { acc.push(`${path}[]: array(${v.length})`); v.slice(0, 3).forEach(x => shape(x, path + '[]', acc)); }
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) shape(x, path ? `${path}.${k}` : k, acc);
  else acc.push(`${path}: ${v === null ? 'null' : typeof v}`);
  return [...new Set(acc)];
}

function flat(v: unknown, path = '', acc: Array<[string, unknown]> = []): Array<[string, unknown]> {
  if (Array.isArray(v)) v.slice(0, 3).forEach(x => flat(x, `${path}[]`, acc));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) flat(x, path ? `${path}.${k}` : k, acc);
  else acc.push([path, v]);
  return acc;
}

/** Trường nào của bản ghi chứa id trùng một model đã biết → "đường.dẫn → model (loại)". */
export function linkPaths(d: unknown, models: Map<string, { name: string; type: string }>): string[] {
  const out = new Set<string>();
  for (const [path, v] of flat(d)) { const m = typeof v === 'string' ? models.get(v) : undefined; if (m) out.add(`${path} → model "${m.name}" (loại ${m.type})`); }
  return [...out];
}

