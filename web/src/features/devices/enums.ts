// Enum của deviceConfig theo từng loại thiết bị → dictionary (đối chiếu dữ liệu thật 2026-11-20, docs/15 §4). Hàm thuần, có test.
export interface DictOpt { value: string; name: string }
export interface EnumField { key: string; label: string; dict: number; /** true: giá trị lưu là TÊN (dsName) dạng số — vd dimmingLevel 20/100 chứ không phải dictValue 1/2 */ byName?: boolean }

/** Trường enum đơn của từng loại (deviceTypeValue). */
export const TYPE_ENUMS: Record<number, EnumField[]> = {
  1: [{ key: 'currentP', label: 'Current Rate', dict: 15 }, { key: 'meterType', label: 'Type', dict: 21 }],
  2: [{ key: 'dimmingLevel', label: 'Dimming level', dict: 20, byName: true }],
  3: [{ key: 'gatewayTypes', label: 'Gateway type', dict: 119 }],
  4: [{ key: 'rtuType', label: 'Concentrator type', dict: 99 }],
  5: [{ key: 'lampTypes', label: 'Lamp type', dict: 3 }, { key: 'powerTypes', label: 'Power type', dict: 17 }],
  6: [{ key: 'poleArmType', label: 'Arm type', dict: 55 }],
  9: [{ key: 'kmFactory', label: 'Producer', dict: 88 }],   // ứng viên: "Controller manufacturer" (chưa kiểm chứng)
};
/** Danh sách chức năng (functionList) — LCU, Gateway, Concentrator. Ứng viên: dictionary 5 "Operation Type" (1 Turn On … 4 Data Query, 5 Dimming, 6 Display Brightness). */
export const FUNCTION_TYPES = [2, 3, 4];
export const FUNCTION_DICT = 5;
/** Loại có giao thức (protocol) chọn trong form. */
export const POLE_SHAPE_DICT = 39;   // poleTypeValue = mã kiểu/hình cột có sẵn (Magnolia Lamp, High Pole Lights, …)
export const DICT_KEYS = [...new Set([...Object.values(TYPE_ENUMS).flat().map(f => f.dict), FUNCTION_DICT, POLE_SHAPE_DICT])];

/** Khoá "thuộc về" một số loại: hiện ở loại khác là rác (server giữ lại giá trị mặc định như rtuType 0 ở LCU) → ẩn. */
const OWNED: Record<string, number[]> = {
  rtuType: [4], gatewayTypes: [3], lampTypes: [5], powerTypes: [5], meterType: [1], currentP: [1],
  poleArmType: [6], poleTypeId: [6], poleType: [6], kmFactory: [9], pathNum: [9], functionList: FUNCTION_TYPES, extensions: [2, 3],
};
export const isRelevantKey = (typeValue: number, key: string): boolean => !(key in OWNED) || OWNED[key].includes(typeValue);

export const enumFieldsOf = (typeValue: number): EnumField[] => TYPE_ENUMS[typeValue] ?? [];

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
