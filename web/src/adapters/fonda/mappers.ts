// Hàm THUẦN chuyển DTO Fonda → kiểu của mình. Mọi đặc thù của Fonda (tên trường, epoch ms, danh sách LCU từ 2 API…) nằm ở đây.
import type { PoleLamp, PoleGroup, PoleLinks, ConfigEntry, DeviceItem, DeviceModel, DeviceType, LightStatus, Measurement } from '../../core/types';

type Rec = Record<string, unknown>;
const num = (v: unknown): number | undefined => { const x = typeof v === 'number' ? v : parseFloat(String(v ?? '')); return Number.isFinite(x) ? x : undefined; };
const str = (v: unknown) => (v == null ? '' : String(v));

export interface Geo { lat: number; lng: number }

/** Toạ độ hợp lệ: trong khoảng địa lý và không phải (0,0). */
export function validGeo(g: Geo | undefined | null): g is Geo {
  return !!g && g.lat >= -90 && g.lat <= 90 && g.lng >= -180 && g.lng <= 180 && (g.lat !== 0 || g.lng !== 0);
}

/** Tìm cặp lat/lng trong bản ghi chi tiết (kể cả lồng trong object con). */
export function pickGeo(d: unknown): Geo | null {
  if (!d || typeof d !== 'object') return null;
  const r = d as Rec;
  const lat = num(r.lat ?? r.latitude), lng = num(r.lng ?? r.lon ?? r.longitude);
  if (lat !== undefined && lng !== undefined) return { lat, lng };
  for (const v of Object.values(r)) { const g = v && typeof v === 'object' ? pickGeo(v) : null; if (g) return g; }
  return null;
}

export function ratedPowerOf(detail: unknown): number | undefined {
  const cfg = detail && typeof detail === 'object' ? ((detail as Rec).deviceConfig as Rec | undefined) : undefined;
  return num(cfg && cfg.lampPower) || undefined;
}

export interface LcuRow { uid: string; lcuId: string; name: string; code: string }

/** lcuActor/page → hàng LCU */
export function mapPageRow(r: Rec): LcuRow | null {
  const uid = str(r.uid || r.lcuId);
  return uid ? { uid, lcuId: str(r.lcuId), name: str(r.deviceName), code: str(r.deviceCode) } : null;
}

/** lcuActor/getLcuListByProjectId → hàng LCU (LCU tạo lại có thể chỉ xuất hiện ở API này) */
export function mapListRow(r: Rec): LcuRow | null {
  const uid = str(r.luid);
  return uid ? { uid, lcuId: str(r.lcuId), name: str(r.lcuName), code: '' } : null;
}

/** energy/getLcuDataTrend → các mảng song song; trả danh sách điểm đo, MỚI NHẤT TRƯỚC. */
export function mapTrend(d: unknown): Measurement[] {
  const r = (d && typeof d === 'object' ? d : {}) as Record<string, unknown[]>;
  const ts = Array.isArray(r.date) ? r.date : [];
  const at = (k: string, i: number) => (Array.isArray(r[k]) ? num(r[k][i]) : undefined);
  const out = ts.map((t, i): Measurement => ({
    ts: Number(t),
    time: (Array.isArray(r.dateFormat) && r.dateFormat[i] ? String(r.dateFormat[i]) : new Date(Number(t)).toLocaleString()),
    power: at('p', i), voltage: at('u', i), current: at('i', i), pf: at('pf', i), energy: at('e', i), dim: at('dim', i), wp: at('wp', i),
  }));
  return out.sort((a, b) => b.ts - a.ts);
}

/** lcuLight/queryLcuLightByLcuIdAndNum → trạng thái đèn */
export function mapLight(l: unknown): LightStatus | null {
  if (!l || typeof l !== 'object') return null;
  const r = l as Rec;
  return { time: str(r.dtime), power: num(r.power), voltage: num(r.voltage), current: num(r.current), pf: num(r.powerFactor), lux: num(r.lux), fault: num(r.fault), lastAction: num(r.lastAction), lastSource: num(r.lastSource) };
}

/** Gộp 2 nguồn LCU theo uid; nguồn đầu thắng. */
export function mergeLcus(rows: Array<LcuRow & { projectId: string }>): Array<LcuRow & { projectId: string }> {
  const m = new Map<string, LcuRow & { projectId: string }>();
  for (const r of rows) if (!m.has(r.uid)) m.set(r.uid, r);
  return [...m.values()];
}

/** deviceTypeController/queryDeviceTypesWithUidOfProject → loại thiết bị (bỏ hàng thiếu giá trị, sắp theo mã). */
export function mapDeviceTypes(d: unknown): DeviceType[] {
  if (!Array.isArray(d)) return [];
  const out: DeviceType[] = [];
  for (const r of d as Rec[]) { const value = num(r?.deviceTypeValue); if (value !== undefined) out.push({ id: str(r.deviceTypeId), value, name: str(r.deviceTypeName) || `Loại ${value}` }); }
  return out.sort((a, b) => a.value - b.value);
}

/** device/queryDevicePage → một thiết bị. Toạ độ (0,0) coi như chưa có. */
export function mapDeviceRow(r: Rec): DeviceItem | null {
  const id = str(r.deviceId), uid = str(r.uid);
  if (!id && !uid) return null;
  const g = { lat: num(r.lat) as number, lng: num(r.lng) as number };
  return { id, uid, name: str(r.deviceName), code: str(r.deviceCode), typeValue: num(r.deviceTypeValue) ?? num(r.superDeviceType) ?? -1, model: str(r.deviceModelName), status: num(r.deviceStatus), ...(validGeo(g) ? g : {}), address: str(r.geographicAddress), raw: r };
}

export type DeviceCat = 'lcu' | 'rtu' | 'gateway' | 'smartbox' | 'sensor' | 'meter' | 'camera' | 'other';

/** Phân loại theo TÊN loại thiết bị Fonda (chưa biết chắc deviceTypeValue). Không khớp → 'other'. */
export function categoryOf(typeName: string): DeviceCat {
  const n = typeName.toLowerCase();
  if (/lcu/.test(n)) return 'lcu';
  if (/smart ?box/.test(n)) return 'smartbox';
  if (/gateway|concentrator/.test(n)) return 'gateway';
  if (/rtu/.test(n)) return 'rtu';
  if (/sensor|thermo|tilt|lux|immer|temperature/.test(n)) return 'sensor';
  if (/meter/.test(n)) return 'meter';
  if (/camera/.test(n)) return 'camera';
  return 'other';
}

/** deviceModel/queryAllDeviceModelByProjectId → model; deviceConfig là CHUỖI JSON (parse hỏng → giữ chuỗi gốc ở `_raw`). */
export function mapModels(d: unknown): DeviceModel[] {
  if (!Array.isArray(d)) return [];
  const out: DeviceModel[] = [];
  for (const r of d as Rec[]) {
    const id = str(r?.deviceModelId); if (!id) continue;
    let config: Record<string, unknown> = {};
    if (r.deviceConfig && typeof r.deviceConfig === 'object') config = r.deviceConfig as Rec;
    else if (typeof r.deviceConfig === 'string' && r.deviceConfig.trim()) {
      try { const v = JSON.parse(r.deviceConfig); config = v && typeof v === 'object' && !Array.isArray(v) ? v : { _raw: r.deviceConfig }; } catch { config = { _raw: r.deviceConfig }; }
    }
    out.push({ id, name: str(r.deviceModelName), typeId: str(r.deviceTypeId), config });
  }
  return out;
}

/** poleType/getAllPoleTypeOfProjectList (và Page.records) → loại cột; `poleTypeId` là khoá mà model Lamp Pole tham chiếu. */
export interface PoleType { id: string; name: string; value?: number; systemConfig: number; remark: string }
export function mapPoleTypes(d: unknown): PoleType[] {
  const rows = Array.isArray(d) ? d : Array.isArray((d as Rec | null)?.records) ? (d as { records: unknown[] }).records : [];
  const out: PoleType[] = [];
  for (const r of rows as Rec[]) {
    const id = str(r?.poleTypeId); if (!id) continue;
    out.push({ id, name: str(r.poleTypeName), value: r.poleTypeValue == null ? undefined : Number(r.poleTypeValue), systemConfig: Number(r.systemConfig) || 0, remark: str(r.remark) });
  }
  return out;
}

/** dictionary/queryDictionaryByKey → danh sách giá trị enum {value, name, remark}. */
export interface DictItem { value: string; name: string; remark: string }
export function mapDictionary(d: unknown): DictItem[] {
  if (!Array.isArray(d)) return [];
  return (d as Rec[]).filter(r => r && (r.dictValue != null || r.dictName != null)).map(r => ({ value: str(r.dictValue), name: str(r.dictName) || str(r.dsName), remark: str(r.dictStairRemark) }));
}

const isAttach = (v: unknown): v is Rec => !!v && typeof v === 'object' && !Array.isArray(v) && 'modelName' in (v as Rec);
const attachItem = (a: Rec) => ({ name: str(a.modelName) || str(a.modelId), checked: a.checked === true, extra: [a.lampIndex != null ? `đèn #${str(a.lampIndex)}` : '', a.pathNum != null ? `${str(a.pathNum)} mạch` : ''].filter(Boolean).join(', ') });

/** deviceConfig → các dòng hiển thị: bỏ giá trị rỗng/null; mảng/đối tượng {modelName,…} là "đính kèm" (template tổ hợp). */
export function configEntries(config: Record<string, unknown>): ConfigEntry[] {
  const out: ConfigEntry[] = [];
  for (const [key, v] of Object.entries(config)) {
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    const list = Array.isArray(v) ? v : [v];
    if (list.every(isAttach)) { out.push({ key, kind: 'attached', items: (list as Rec[]).map(attachItem) }); continue; }
    out.push({ key, kind: 'value', text: typeof v === 'object' ? JSON.stringify(v) : String(v) });
  }
  return out;
}

/**
 * poleActor/queryPoleAndRelatedById + queryAttributeDeviceOfPole → liên kết của cột.
 * attributeDevice[] = các "bộ gắn": {lcu:{…}|{}, lamp:[{lampNum,…}]}; lcu rỗng = đèn gắn thẳng vào cột.
 * `modelName` tra tên model từ deviceModelId (tên không có trong payload attributeDevice).
 */
export function mapPoleLinks(related: unknown, attr: unknown, modelName: (id: string) => string, modelSlots: (id: string) => number | undefined = () => undefined): PoleLinks {
  const r = (related && typeof related === 'object' ? related : {}) as Rec, a = (attr && typeof attr === 'object' ? attr : {}) as Rec;
  const lampsAttr = new Map<string, Rec>(); for (const l of (Array.isArray(a.lamp) ? a.lamp : []) as Rec[]) lampsAttr.set(str(l.lampId), l);
  const groups: PoleGroup[] = [];
  for (const g of (Array.isArray(r.attributeDevice) ? r.attributeDevice : []) as Rec[]) {
    const lcu = g.lcu && typeof g.lcu === 'object' ? (g.lcu as Rec) : {};
    const lamps = ((Array.isArray(g.lamp) ? g.lamp : []) as Rec[]).map(l => {
      const info = lampsAttr.get(str(l.deviceId));
      return { id: str(l.deviceId), name: str(l.deviceName) || str(info?.deviceName), channel: num(l.lampNum) ?? num(info?.channel) ?? 1, model: str(info?.deviceModelName) || modelName(str(l.deviceModelId)), checked: l.checked !== false };
    });
    const hasLcu = !!str(lcu.deviceId);
    groups.push({ ...(hasLcu ? { lcu: { id: str(lcu.deviceId), uid: str(lcu.uid), slots: Math.max(num(lcu.lampHolderNum) ?? 0, modelSlots(str(lcu.deviceModelId)) ?? 0) || undefined, model: modelName(str(lcu.deviceModelId)) } } : {}), lamps });
  }
  const SKIP = new Set(['lamp', 'lcu', 'pole']);   // đã hiện ở groups / chính là cột
  const others = Object.entries(a).filter(([k, v]) => !SKIP.has(k) && Array.isArray(v) && v.length > 0)
    .map(([kind, v]) => ({ kind, items: (v as Rec[]).map(x => ({ name: str(x.deviceName) || str(x.deviceCode) || str(x.deviceId) })) }));
  const g = { lat: num(r.lat) as number, lng: num(r.lng) as number };
  return { pole: { id: str(r.deviceId), name: str(r.deviceName), code: str(r.deviceCode), model: str(r.deviceModelName), address: str(r.geographicAddress), ...(validGeo(g) ? g : {}) }, groups, others };
}

/** projectLampActor/queryLampOfLcu → đèn thực của LCU theo kênh (`channel`). */
export function mapLcuLamps(d: unknown, modelName: (id: string) => string): PoleLamp[] {
  if (!Array.isArray(d)) return [];
  return (d as Rec[]).filter(l => str(l.lampId)).map(l => ({ id: str(l.lampId), name: str(l.deviceName), channel: num(l.channel) ?? num(l.lampNum) ?? 1, model: modelName(str(l.deviceModelId)), checked: true })).sort((a, b) => a.channel - b.channel);
}

/** Số kênh của một LCU: lớn nhất giữa tham chiếu trên cột, model LCU và kênh cao nhất đang có đèn (≥ 1). */
export function lcuSlotCount(refSlots: number | undefined, modelSlots: number | undefined, lampChannels: number[]): number {
  return Math.max(refSlots ?? 0, modelSlots ?? 0, ...lampChannels.filter(c => Number.isFinite(c)), 1);
}

/** Các hàng "kênh → đèn" của LCU (1..slots). Nhiều đèn cùng kênh được giữ hết; kênh không có đèn có `lamps: []`. */
export function channelRows<T extends { channel: number }>(slots: number, lamps: T[]): Array<{ channel: number; lamps: T[] }> {
  return Array.from({ length: slots }, (_, i) => ({ channel: i + 1, lamps: lamps.filter(l => l.channel === i + 1) }));
}

export interface LcuSpec { slots: number; lcuType?: number; loopType?: number; dimming?: string; currents?: number; temps?: number; flagsOn: string[]; flagsOff: string[]; functions: number[] }

/**
 * Thông số phần cứng cố định của một model LCU (deviceConfig). `slots` = lampHolderNum = số đầu đèn tối đa — LCU chỉ quản lý
 * đúng ngần ấy đèn dù form cho khai nhiều hơn. `extensions[]` là các cờ chức năng (nhãn `label`, bật/tắt `value`).
 */
export function lcuSpec(config: Record<string, unknown>): LcuSpec {
  const ext = Array.isArray(config.extensions) ? (config.extensions as Rec[]) : [];
  const dim = config.dimmingLevel;
  return {
    slots: num(config.lampHolderNum) ?? 1, lcuType: num(config.lcuType), loopType: num(config.loopType), dimming: dim == null || dim === '' ? undefined : String(dim),
    currents: num(config.currentsNum), temps: num(config.tempsNum),
    flagsOn: ext.filter(e => e.value === true).map(e => str(e.label)), flagsOff: ext.filter(e => e.value !== true).map(e => str(e.label)),
    functions: (Array.isArray(config.functionList) ? config.functionList : []).map(num).filter((x): x is number => x !== undefined),
  };
}

export function toCsv(cols: string[], rows: Array<Array<unknown>>): string {
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [cols.map(q).join(','), ...rows.map(r => r.map(q).join(','))].join('\n');
}
