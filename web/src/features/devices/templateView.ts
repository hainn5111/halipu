// Xem chi tiết template: chỉ các ô của form điền (theo loại/giao thức — `templateSchema.ts`), kèm tên enum; phần còn lại xem ở JSON. Hàm thuần, có test.
import { enumFieldsOf, enumLabel, fieldItems, FUNCTION_TYPES, type DictOpt } from './enums';
import { visibleFields } from './templateSchema';

export interface DetailRow { key: string; label: string; value: string; required: boolean }
interface In {
  type: number;
  protocol?: { name: string; version: string; value: number };
  config: Record<string, unknown>;
  dicts: Record<number, DictOpt[]>;
  poleTypes: Array<{ id: string; name: string }>;
}
const text = (v: unknown): string => (v == null || v === '' ? '–' : typeof v === 'object' ? JSON.stringify(v) : String(v));

export function detailRows({ type, protocol, config, dicts, poleTypes }: In): DetailRow[] {
  const rows: DetailRow[] = [];
  const hasProto = !!protocol && protocol.value >= 0;
  if (hasProto) rows.push({ key: 'protocol', label: 'Function (giao thức)', value: `${protocol!.name} ${protocol!.version}`.trim(), required: true });
  if (hasProto && FUNCTION_TYPES.includes(type)) rows.push({ key: 'functionList', label: 'Chức năng (functionList)', value: text(config.functionList), required: false });
  const enums = new Map(enumFieldsOf(type).map(f => [f.key, f]));
  for (const f of visibleFields({ type, protocol: hasProto ? protocol!.value : undefined, lcuCtype: config.lcuCtype })) {
    const raw = config[f.key];
    let value = text(raw);
    const e = enums.get(f.key);
    if (e && value !== '–') { const n = enumLabel(e, raw, fieldItems(e, dicts)); if (n && n !== value) value = `${value} — ${n}`; }
    if (f.key === 'poleTypeId' && value !== '–') value = poleTypes.find(p => p.id === String(raw))?.name ?? value;
    rows.push({ key: f.key, label: f.label, value, required: f.required });
  }
  return rows;
}
