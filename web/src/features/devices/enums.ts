// Enum của deviceConfig theo từng loại thiết bị → dictionary (đối chiếu dữ liệu thật 2026-11-20, docs/15 §4). Hàm thuần, có test.
export interface DictOpt { value: string; name: string }
export interface EnumField { key: string; label: string; dict?: number; /** danh sách cố định (không có dictionary) */ items?: DictOpt[]; /** true: giá trị lưu là TÊN (dsName) dạng số — vd dimmingLevel 20/100 chứ không phải dictValue 1/2 */ byName?: boolean }

/** Trường enum đơn của từng loại (deviceTypeValue). */
export const TYPE_ENUMS: Record<number, EnumField[]> = {
  1: [{ key: 'currentP', label: 'Current Rate', dict: 15 }, { key: 'meterType', label: 'Type', dict: 21 }],
  2: [{ key: 'dimmingLevel', label: 'Dimming level', dict: 20, byName: true }],
  3: [{ key: 'gatewayTypes', label: 'Gateway type', dict: 119 }],
  4: [{ key: 'rtuType', label: 'Concentrator type', dict: 99 }],
  5: [{ key: 'lampTypes', label: 'Lamp type', dict: 3 }, { key: 'powerTypes', label: 'Power type', dict: 17 }],
  6: [{ key: 'poleArmType', label: 'Arm type', dict: 55 }],
  // Producer của Switch: danh sách cố định trên form Fonda (người dùng xác nhận 2 lựa chọn "XY…" và "KXHL"). Capture cho thấy "XY…" = "1"; mã của KXHL (="2"?) chưa kiểm chứng.
  9: [{ key: 'kmFactory', label: 'Producer', items: [{ value: '1', name: 'XY…' }, { value: '2', name: 'KXHL' }] }],
};
/** Loại có ô "Function" = chọn GIAO THỨC (RF/F2, CAT1/F2, …) — LCU, Gateway, Concentrator. `functionList` (mảng số) KHÔNG sửa trong form, chỉ hiện nguyên giá trị. */
export const FUNCTION_TYPES = [2, 3, 4];
/** Loại có giao thức (protocol) chọn trong form. */
export const POLE_SHAPE_DICT = 39;   // poleTypeValue = mã kiểu/hình cột có sẵn (Magnolia Lamp, High Pole Lights, …)
export const DICT_KEYS = [...new Set([...Object.values(TYPE_ENUMS).flat().map(f => f.dict).filter((d): d is number => d != null), POLE_SHAPE_DICT])];

/** Khoá "thuộc về" một số loại: hiện ở loại khác là rác (server giữ lại giá trị mặc định như rtuType 0 ở LCU) → ẩn. */
const OWNED: Record<string, number[]> = {
  rtuType: [4], gatewayTypes: [3], lampTypes: [5], powerTypes: [5], meterType: [1], currentP: [1],
  poleArmType: [6], poleTypeId: [6], poleType: [6], kmFactory: [9], pathNum: [9], functionList: FUNCTION_TYPES, extensions: [2, 3],
};
export const isRelevantKey = (typeValue: number, key: string): boolean => !(key in OWNED) || OWNED[key].includes(typeValue);

export const enumFieldsOf = (typeValue: number): EnumField[] => TYPE_ENUMS[typeValue] ?? [];

/** Danh sách giá trị của trường: cố định nếu có, ngược lại từ dictionary đã tải. */
export const fieldItems = (f: EnumField, dicts: Record<number, DictOpt[]>): DictOpt[] => f.items ?? (f.dict != null ? dicts[f.dict] ?? [] : []);

/** Lựa chọn của một trường: giá trị lưu (chuỗi) + nhãn. */
export function enumOptions(f: EnumField, items: Array<{ value: string; name: string }>): DictOpt[] {
  return items.map(i => ({ value: f.byName ? i.name : i.value, name: i.name }));
}
/** Tên hiển thị của giá trị cấu hình (rỗng nếu không có trong dictionary). */
export function enumLabel(f: EnumField, value: unknown, items: Array<{ value: string; name: string }>): string {
  const v = value == null ? '' : String(value); if (!v) return '';
  return items.find(i => (f.byName ? i.name : i.value) === v)?.name ?? '';
}
/** Giá trị ghi vào config: số nếu chuỗi là số (config Fonda lưu số). */
export const storeValue = (s: string): number | string => (s !== '' && Number.isFinite(Number(s)) ? Number(s) : s);

/** functionList (mảng số) → nhãn từ dictionary; số lạ giữ nguyên. */
export function functionLabels(list: unknown, items: Array<{ value: string; name: string }>): string[] {
  if (!Array.isArray(list)) return [];
  return list.map(n => items.find(i => i.value === String(n))?.name ?? `#${String(n)}`);
}
