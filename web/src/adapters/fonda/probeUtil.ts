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


type R = Record<string, unknown>;
const ID_LIKE = /(^|_)(id|uid|luid|cuid|code)$|Id$|Uid$/;
const NOT_ENUM = /name|code|time|date|lat$|lng$|address|higher|^poleCode$/i;

/**
 * Quét quan hệ giữa thiết bị từ dữ liệu thật: trường nào của loại A có giá trị trùng deviceId/uid của thiết bị loại B,
 * và các trường "enum" (ít giá trị phân biệt) kèm số lượng. Không in id/uid, chỉ in tên trường, loại và số lượng.
 */
export function relationScan(byType: Record<string, R[]>): string[] {
  const idOwner = new Map<string, string>(), uidOwner = new Map<string, string>();
  for (const [t, rows] of Object.entries(byType)) for (const r of rows) {
    if (typeof r.deviceId === 'string' && r.deviceId) idOwner.set(r.deviceId, t);
    if (typeof r.uid === 'string' && r.uid) uidOwner.set(r.uid, t);
  }
  const lines: string[] = [];
  for (const [t, rows] of Object.entries(byType)) {
    if (!rows.length) continue;
    lines.push(`## ${t} (${rows.length} thiết bị)`);
    const keys = [...new Set(rows.flatMap(r => Object.keys(r)))];
    for (const k of keys) {
      const vals = rows.map(r => r[k]).filter(v => v !== null && v !== undefined && v !== '');
      if (!vals.length) continue;
      // trỏ tới thiết bị khác?
      if (k !== 'deviceId' && k !== 'uid') {
        const hits = new Map<string, number>();
        for (const r of rows) { const v = r[k]; if (typeof v !== 'string' || v === r.uid || v === r.deviceId) continue; const o = idOwner.get(v) ?? uidOwner.get(v); if (o) hits.set(o, (hits.get(o) ?? 0) + 1); }
        for (const [o, n] of hits) lines.push(`  ${k} → ${o} (${n}/${rows.length} bản ghi)`);
        if (hits.size) continue;
      }
      // enum: ít giá trị phân biệt, không phải trường id/mã
      const distinct = new Map<string, number>(); for (const v of vals) distinct.set(String(v), (distinct.get(String(v)) ?? 0) + 1);
      if (distinct.size <= 6 && !ID_LIKE.test(k) && !NOT_ENUM.test(k) && rows.length > 1 && vals.every(v => typeof v !== 'object')) lines.push(`  ${k}: ${[...distinct].map(([v, n]) => `${v.length > 30 ? v.slice(0, 30) + '…' : v}×${n}`).join(', ')}${vals.length < rows.length ? ` (rỗng ×${rows.length - vals.length})` : ''}`);
    }
  }
  return lines;
}
