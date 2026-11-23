// Enum của deviceConfig theo từng loại thiết bị → dictionary (đối chiếu dữ liệu thật 2026-11-20, docs/15 §4). Hàm thuần, có test.
export interface DictOpt { value: string; name: string; /** dictStairId (nếu có) */ stairId?: string }
export interface EnumField { key: string; label: string; dict?: number; /** danh sách cố định (không có dictionary) */ items?: DictOpt[]; /** true: giá trị lưu là TÊN (dsName) dạng số — vd dimmingLevel 20/100 chứ không phải dictValue 1/2 */ byName?: boolean; /** true: giá trị lưu là dictStairId (ô Producer của Fonda) */ byStair?: boolean }

/** Trường enum đơn của từng loại (deviceTypeValue). */
export const TYPE_ENUMS: Record<number, EnumField[]> = {
  1: [{ key: 'currentP', label: 'Current Rate', dict: 15 }, { key: 'meterType', label: 'Type', dict: 21 }],
  2: [{ key: 'dimmingLevel', label: 'Dimming level', dict: 20, byName: true }],
  3: [{ key: 'gatewayTypes', label: 'Gateway type', dict: 119 }],
  4: [{ key: 'rtuType', label: 'Concentrator type', dict: 99 }],
  5: [{ key: 'lampTypes', label: 'Lamp type', dict: 3 }, { key: 'powerTypes', label: 'Power type', dict: 17 }, { key: 'powerProtocol', label: 'Power protocol', items: [{ value: '0', name: 'Không (nothing)' }, { value: '1', name: 'D4I' }] }   /* cứng trong giao diện Fonda: powerProtocolArr */ ],
  6: [{ key: 'poleArmType', label: 'Arm type', dict: 55 }],
  14: [{ key: 'coverTypes', label: 'Cover type', dict: 103 }],
  32: [{ key: 'powerBoxType', label: 'Power box type', dict: 101 }],
  // Producer của Switch: danh sách CỨNG trong giao diện Fonda (kmFactoryArr = [{1,"XY"},{2,"KXHL"}] — quét front-end 2026-11-20), không có trên server.
  9: [{ key: 'kmFactory', label: 'Producer', items: [{ value: '1', name: 'XY' }, { value: '2', name: 'KXHL' }] }],
};
/**
 * Producer (`factoryId`) theo loại — nguồn tuỳ chọn lấy từ hàm đổi loại của Fonda (typeChange): dictionary theo loại, giá trị lưu là `dictStairId`.
 * Loại 60: danh sách cứng HNJD(1)/SRNE(3). Loại 9: Switch dùng `kmFactory` (ở trên). `hasFactoryDeviceType` của Fonda: 46, 51, 52, 53, 55.
 */
export const PRODUCER_DICTS: Record<number, number> = { 16: 88, 18: 90, 46: 108, 51: 105, 52: 107, 53: 106, 55: 117, 64: 147, 17: 155 };
for (const [t, d] of Object.entries(PRODUCER_DICTS)) (TYPE_ENUMS[Number(t)] ||= []).push({ key: 'factoryId', label: 'Producer', dict: d, byStair: true });
TYPE_ENUMS[60] = [...(TYPE_ENUMS[60] ?? []), { key: 'factoryId', label: 'Producer', byStair: true, items: [{ value: '1', name: 'HNJD' }, { value: '3', name: 'SRNE' }] }];
/** Các dictionary cần nạp khi chọn một loại. */
export const dictKeysOfType = (type: number): number[] => [...new Set((TYPE_ENUMS[type] ?? []).map(f => f.dict).filter((d): d is number => d != null))];

/** Giao thức chọn được theo Fonda (`protocolTypeArr`): bỏ các giao thức này; LCU còn bỏ giao thức "passthrough" (và theo chế độ điều khiển dự án — chưa biết, nên không lọc). */
export const HIDDEN_PROTOCOLS = ['YM/AEP', 'NLK/NB', 'zigbee/FEMS', '50/NB', 'SUN/AGA', 'Changer/YM', 'Display/HD Screen', 'Lighting/EXC'];
export function filterProtocols<T extends { name: string }>(type: number, list: T[]): T[] {
  return list.filter(p => !HIDDEN_PROTOCOLS.includes(p.name) && !(type === 2 && p.name.includes('passthrough')));
}

/** Loại có ô "Function" = chọn GIAO THỨC (RF/F2, CAT1/F2, …) — LCU, Gateway, Concentrator. `functionList` (mảng số) KHÔNG sửa trong form, chỉ hiện nguyên giá trị. */
export const FUNCTION_TYPES = [2, 3, 4];
/** Loại có giao thức (protocol) chọn trong form. */
export const DICT_KEYS = [...new Set(Object.values(TYPE_ENUMS).flat().map(f => f.dict).filter((d): d is number => d != null))];   // (dùng khi cần nạp hết; màn hình nạp theo loại bằng dictKeysOfType)

/** Khoá "thuộc về" một số loại: hiện ở loại khác là rác (server giữ lại giá trị mặc định như rtuType 0 ở LCU) → ẩn. */
const OWNED: Record<string, number[]> = {
  rtuType: [4], gatewayTypes: [3], coverTypes: [14], powerBoxType: [32], lampTypes: [5], powerTypes: [5], meterType: [1], currentP: [1],
  powerProtocol: [5], poleArmType: [6], poleTypeId: [6], poleType: [6], kmFactory: [9], pathNum: [9], functionList: FUNCTION_TYPES, extensions: [2, 3],
};
export const isRelevantKey = (typeValue: number, key: string): boolean => !(key in OWNED) || OWNED[key].includes(typeValue);

export const enumFieldsOf = (typeValue: number): EnumField[] => TYPE_ENUMS[typeValue] ?? [];

/** Danh sách giá trị của trường: cố định nếu có, ngược lại từ dictionary đã tải. */
export const fieldItems = (f: EnumField, dicts: Record<number, DictOpt[]>): DictOpt[] => f.items ?? (f.dict != null ? dicts[f.dict] ?? [] : []);

/** Lựa chọn của một trường: giá trị lưu (chuỗi) + nhãn. */
export function enumOptions(f: EnumField, items: DictOpt[]): DictOpt[] {
  return items.map(i => ({ value: f.byName ? i.name : f.byStair ? (i.stairId ?? i.value) : i.value, name: i.name }));
}
/** Tên hiển thị của giá trị cấu hình (rỗng nếu không có trong dictionary). */
export function enumLabel(f: EnumField, value: unknown, items: DictOpt[]): string {
  const v = value == null ? '' : String(value); if (!v) return '';
  return items.find(i => (f.byName ? i.name : f.byStair ? (i.stairId ?? i.value) : i.value) === v)?.name ?? '';
}
/** Giá trị ghi vào config: số nếu chuỗi là số (config Fonda lưu số). */
export const storeValue = (s: string): number | string => (s !== '' && Number.isFinite(Number(s)) ? Number(s) : s);

/** functionList (mảng số) → nhãn từ dictionary; số lạ giữ nguyên. */
export function functionLabels(list: unknown, items: Array<{ value: string; name: string }>): string[] {
  if (!Array.isArray(list)) return [];
  return list.map(n => items.find(i => i.value === String(n))?.name ?? `#${String(n)}`);
}

/** poleTypeValue chỉ có đúng các giá trị của loại cột HỆ THỐNG (systemConfig 1 — 8 loại, giá trị 1–8), KHÔNG phải dictionary 39 (có 10 mục, đã đối chiếu sai). */
export function poleShapeItems(poleTypes: Array<{ value?: number; name: string; systemConfig: number }>): DictOpt[] {
  const seen = new Set<number>(), out: DictOpt[] = [];
  for (const t of poleTypes) if (t.systemConfig && t.value != null && !seen.has(t.value)) { seen.add(t.value); out.push({ value: String(t.value), name: t.name }); }
  return out.sort((a, b) => Number(a.value) - Number(b.value));
}

/**
 * Giao thức quyết định danh sách enum của loại — LẤY TỪ MÃ GIAO DIỆN FONDA (quét front-end 2026-11-20), không có trên server:
 *  - Concentrator: protocolValue 56 (RTU/SDMP-X) → rtuType {3 RTU 190, 4 RTU 150}; giao thức khác (1 FEMS, 58 SDMP) → {1 RTU 200, 2 RTU 700, 5 RTU 200-6DO}.
 *  - Gateway: protocolValue 12 (Gateway/SDMP) → gatewayTypes {1 RTU500, 2 RTU500LD}; giao thức khác (1 FEMS) → chỉ {1 RTU500}.
 * Khoá: deviceTypeValue → protocolValue (hoặc '*' = mặc định) → giá trị dictValue cho phép.
 */
export const ENUM_BY_PROTOCOL: Record<number, Record<string, string[]>> = {
  4: { '56': ['3', '4'], '*': ['1', '2', '5'] },
  3: { '12': ['1', '2'], '*': ['1'] },
};
export function allowedOptions(typeValue: number, protocolValue: number | undefined, opts: DictOpt[]): DictOpt[] {
  const m = ENUM_BY_PROTOCOL[typeValue]; if (!m) return opts;
  const allowed = (protocolValue != null ? m[String(protocolValue)] : undefined) ?? m['*'];
  return allowed ? opts.filter(o => allowed.includes(o.value)) : opts;
}

/** functionList: chức năng 1–4 luôn bật và không bỏ được (bảng chức năng của Fonda: `[1,2,3,4].includes(id)` → bật + khoá); 5–7 tuỳ giao thức hỗ trợ. */
export const FIXED_FUNCTIONS = [1, 2, 3, 4];
/** Gợi ý từ mã giao diện: 6 = cảnh báo nghiêng cột (isSupportTiltAlarm), 7 = điều khiển ánh sáng (isLightControlFunction). Tên chính thức chưa lấy được. */
export const FUNCTION_HINTS: Record<number, string> = { 6: 'cảnh báo nghiêng cột', 7: 'điều khiển ánh sáng' };
