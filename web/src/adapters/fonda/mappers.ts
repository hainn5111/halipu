// Hàm THUẦN chuyển DTO Fonda → kiểu của mình. Mọi đặc thù của Fonda (tên trường, epoch ms, danh sách LCU từ 2 API…) nằm ở đây.
import type { DeviceItem, DeviceType, LightStatus, Measurement } from '../../core/types';

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
  return { id, uid, name: str(r.deviceName), code: str(r.deviceCode), typeValue: num(r.deviceTypeValue) ?? num(r.superDeviceType) ?? -1, model: str(r.deviceModelName), status: num(r.deviceStatus), ...(validGeo(g) ? g : {}), address: str(r.geographicAddress) };
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

/** projectLampActor/queryProjectLamp → đèn (lamp). `uid` = UID LCU chứa đèn. */
export function mapLampRow(r: Rec): DeviceItem | null {
  const id = str(r.lampId); if (!id) return null;
  const g = { lat: num(r.lat) as number, lng: num(r.lng) as number };
  return { id, uid: str(r.luid), name: str(r.name), code: r.channel != null ? `kênh ${str(r.channel)}` : '', typeValue: -2, model: str(r.deviceModel), ...(validGeo(g) ? g : {}), address: '' };
}

/** poleActor/queryPoleOfProject → cột đèn (lamp post). */
export function mapPoleRow(r: Rec): DeviceItem | null {
  const id = str(r.deviceId); if (!id) return null;
  const g = { lat: num(r.lat) as number, lng: num(r.lng) as number };
  return { id, uid: '', name: str(r.deviceName), code: str(r.deviceCode), typeValue: -3, model: '', status: num(r.deviceStatus), ...(validGeo(g) ? g : {}), address: str(r.geographicAddress) };
}

export function toCsv(cols: string[], rows: Array<Array<unknown>>): string {
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [cols.map(q).join(','), ...rows.map(r => r.map(q).join(','))].join('\n');
}
