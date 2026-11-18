// Nguồn dữ liệu Fonda. Giao diện (features/) chỉ gọi các hàm này và nhận kiểu của mình; đổi backend = viết adapter khác cùng chữ ký.
import { call } from '../../core/api';
import { config } from '../../core/config';
import type { DeviceItem, DeviceType, LampCommand, LightStatus, Lcu, Measurement } from '../../core/types';
import { mapDeviceRow, mapDeviceTypes, mapLight, mapListRow, mapPageRow, mapTrend, mergeLcus, pickGeo, ratedPowerOf, validGeo, type LcuRow } from './mappers';

const PID_KEY = 'pid';

async function discoverProjectId(): Promise<string> {
  const saved = localStorage.getItem(PID_KEY); if (saved) return saved;
  const find = (v: unknown): string | null => {
    if (!v || typeof v !== 'object') return null;
    const o = v as Record<string, unknown>;
    if (typeof o.projectId === 'string' && o.projectId) return o.projectId;
    for (const k of Array.isArray(v) ? (v as unknown[]).keys() : ['records', 'children', 'data']) { const r = find((v as never)[k as never]); if (r) return r; }
    return null;
  };
  const tries: Array<['GET' | 'POST', string, unknown]> = [['GET', 'project/queryLastProject', undefined], ['POST', 'project/queryTree', {}], ['POST', 'project/queryList', { current: 1, size: 10 }], ['POST', 'project/queryProjectByUserId', {}]];
  const log: string[] = [];
  for (const [m, p, body] of tries) {
    try {
      const d = await call<unknown>(m, p, { body });
      const id = find(d) || ((d as { records?: Array<{ id?: string }> })?.records?.[0]?.id ?? null);
      if (id) { localStorage.setItem(PID_KEY, id); return id; }
      log.push(`${p}: không có projectId`);
    } catch (e) { log.push((e as Error).message); }
  }
  throw new Error('Không lấy được projectId:\n' + log.join('\n'));
}

/** Tất cả projectId (dự án cha + con). Có projectId cố định trong cấu hình thì dùng đúng nó. */
export async function projectIds(): Promise<string[]> {
  const fixed = config().projectId; if (fixed) return [fixed];
  const first = await discoverProjectId();
  const ids = new Set<string>([first]);
  const walk = (v: unknown): void => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) return v.forEach(walk);
    const o = v as Record<string, unknown>;
    if (typeof o.projectId === 'string' && o.projectId) ids.add(o.projectId);
    Object.values(o).forEach(walk);
  };
  try { walk(await call('POST', 'project/queryTree', { body: {} })); } catch { /* dùng id đã dò */ }
  return [...ids];
}

async function pageAll(path: string, projectId: string, size = 100): Promise<Array<Record<string, unknown>>> {
  const out: Array<Record<string, unknown>> = []; let current = 1, pages = 1;
  do {
    const d = await call<{ records?: Array<Record<string, unknown>>; pages?: number }>('POST', path, { projectId, body: { current, size, projectId, integratedQuery: '' } });
    out.push(...(d.records || [])); pages = d.pages || 1; current++;
  } while (current <= pages && current < 100);
  return out;
}

export interface LcuListResult { lcus: Lcu[]; report: string[] }

/** Danh sách LCU từ mọi dự án (gộp 2 API theo uid). Chưa có toạ độ — xem loadDetail. */
export async function listLcus(onProgress?: (m: string) => void): Promise<LcuListResult> {
  const pids = await projectIds(), rows: Array<LcuRow & { projectId: string }> = [], report: string[] = [];
  for (const [i, pid] of pids.entries()) {
    onProgress?.(`Đang tải dự án ${i + 1}/${pids.length}…`);
    try { for (const r of await pageAll('lcuActor/page', pid)) { const m = mapPageRow(r); if (m) rows.push({ ...m, projectId: pid }); } report.push(`${pid}: lcuActor/page ok`); }
    catch (e) { report.push((e as Error).message); }
    try {
      const list = await call<Array<Record<string, unknown>>>('POST', 'lcuActor/getLcuListByProjectId', { projectId: pid, body: { projectId: pid } });
      for (const r of list || []) { const m = mapListRow(r); if (m) rows.push({ ...m, projectId: pid }); }
      report.push(`${pid}: getLcuListByProjectId ok`);
    } catch (e) { report.push((e as Error).message); }
  }
  return { lcus: mergeLcus(rows), report };
}

/** Toạ độ + công suất định mức từ lcuActor/queryLcuAndRelatedByUid. */
export async function loadDetail(l: Lcu): Promise<Partial<Lcu>> {
  const d = await call('GET', `lcuActor/queryLcuAndRelatedByUid/${l.uid}`, { projectId: l.projectId });
  const g = pickGeo(d);
  return { ...(validGeo(g) ? { lat: g.lat, lng: g.lng } : {}), ratedPower: ratedPowerOf(d) };
}

export async function lightStatus(l: Lcu, num: number): Promise<LightStatus | null> {
  const d = await call('POST', 'lcuLight/queryLcuLightByLcuIdAndNum', { projectId: l.projectId, body: { lcuId: l.lcuId, num, projectId: l.projectId } });
  return mapLight(d);
}

/** Lịch sử đo từ server (payload bắt từ web gốc: startDate/endDate là epoch ms). Mới nhất trước. */
export async function trend(l: Lcu, days: number, ctype = 53): Promise<Measurement[]> {
  const end = Date.now();
  const d = await call('POST', 'energy/getLcuDataTrend', { projectId: l.projectId, body: { lcuId: l.lcuId, lcuName: l.name, luid: l.uid, uid: l.uid, projectId: l.projectId, channel: '', maxchannel: 1, ctype, queryType: 2, type: 1, startDate: end - days * 864e5, endDate: end } });
  return mapTrend(d);
}

/** Lệnh điều khiển đơn (docs/08 §2). projectId nằm trong body, không đặt header. */
export async function unicast(cmd: LampCommand | 'queryStatus', l: Lcu, num: number, dimming?: number): Promise<unknown> {
  const body: Record<string, unknown> = { luid: l.uid, num, projectId: l.projectId };
  if (cmd === 'dimming') body.dimming = dimming;
  return call('POST', `lampControl/unicast/${cmd}`, { body });
}

/** Loại thiết bị có trong dự án (chỉ đọc). */
export async function listDeviceTypes(projectId: string): Promise<DeviceType[]> {
  return mapDeviceTypes(await call('GET', `deviceTypeController/queryDeviceTypesWithUidOfProject/${projectId}`, { projectId }));
}

/** Thiết bị của một loại trong một dự án (chỉ đọc, phân trang hết). */
export async function listDevices(projectId: string, typeValue: number): Promise<DeviceItem[]> {
  const out: DeviceItem[] = []; let current = 1, pages = 1;
  do {
    const d = await call<{ records?: Array<Record<string, unknown>>; pages?: number }>('POST', 'device/queryDevicePage', { projectId, body: { projectId, current, size: 100, deviceTypeValue: typeValue } });
    for (const r of d.records || []) { const m = mapDeviceRow(r); if (m) out.push({ ...m, typeValue: m.typeValue < 0 ? typeValue : m.typeValue }); }
    pages = d.pages || 1; current++;
  } while (current <= pages && current < 100);
  return out;
}
