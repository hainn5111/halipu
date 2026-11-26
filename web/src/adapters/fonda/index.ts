// Nguồn dữ liệu Fonda. Giao diện (features/) chỉ gọi các hàm này và nhận kiểu của mình; đổi backend = viết adapter khác cùng chữ ký.
import { call } from '../../core/api';
import { config, parseProjectIds } from '../../core/config';
import type { PoleLinks, DeviceItem, DeviceModel, DeviceType, LampCommand, LightStatus, Lcu, Measurement } from '../../core/types';
import { WRITE_ENABLED } from '../../core/flags';
import { lcuDeleteBody, supplyLinkBody, deviceIdsBody, rtuLinkBody, kmDetectSaveBody, meterSaveBody, rtuSaveBody, smartBoxSaveBody, modelCloneBody, modelUpdateBody, modelIdsBody, poleTypeSaveBody, poleTypeUpdateBody, poleTypeIdsBody, type PoleTypeIn, type ProtoIn, lcuIdsBody, lcuModelCreateBody, lcuSaveBody, modelCreateBody, poleIdsBody, poleUpdateBody, type GroupInput } from './writeBodies';
import { lcuSlotCount, mapLcuLamps, mapPoleLinks, mapTypeProtocols, mapFunctions, mapPoleTypes, mapDictionary, type DictItem, type PoleType, mapModels, mapDeviceRow, mapDeviceTypes, mapLight, mapListRow, mapPageRow, mapTrend, mergeLcus, applyGeo, pickGeo, ratedPowerOf, validGeo, type LcuRow } from './mappers';

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
  const fixed = parseProjectIds(config().projectId); if (fixed.length) return fixed;   // có thể ghim nhiều ID (cách nhau dấu phẩy)
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
  let lcus = mergeLcus(rows);
  // Toạ độ HÀNG LOẠT: device/queryDevicePage (loại 2) trả lat/lng cho cả trang 100 LCU — thay cho 1 lần gọi/LCU (N+1). Lỗi thì bỏ qua, store sẽ lấy chi tiết từng LCU như cũ.
  for (const pid of pids) {
    try { const devs = await listDevices(pid, 2); lcus = applyGeo(lcus, devs.map(d => ({ uid: d.uid, lat: d.lat, lng: d.lng }))); report.push(`${pid}: toạ độ hàng loạt ok (${devs.length})`); }
    catch (e) { report.push(`${pid}: toạ độ hàng loạt lỗi — ${(e as Error).message}`); }
  }
  return { lcus, report };
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

/** Mọi loại thiết bị của dự án (chỉ đọc; API 'WithUid' chỉ trả vài loại nên không dùng). */
export async function listDeviceTypes(projectId: string): Promise<DeviceType[]> {
  return mapDeviceTypes(await call('GET', `deviceTypeController/queryAllDeviceTypeByProjectId/${projectId}`, { projectId }));
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


/** Số thiết bị của một loại (đọc 1 bản ghi, lấy total). */
export async function countDevices(projectId: string, typeValue: number): Promise<number> {
  const d = await call<{ total?: number }>('POST', 'device/queryDevicePage', { projectId, body: { projectId, current: 1, size: 1, deviceTypeValue: typeValue } });
  return Number(d?.total) || 0;
}

/** Giá trị enum của một dictionary (chỉ đọc). */
export async function listDictionary(projectId: string, key: number | string): Promise<DictItem[]> {
  return mapDictionary(await call('GET', `dictionary/queryDictionaryByKey/${key}`, { projectId }));
}

/** Loại cột (PoleType): chỉ đọc. Thử API danh sách; nếu server đòi tham số khác thì thử bản phân trang. */
export async function listPoleTypes(projectId: string): Promise<PoleType[]> {
  try { const r = mapPoleTypes(await call('POST', 'poleType/getAllPoleTypeOfProjectList', { projectId, body: { projectId } })); if (r.length) return r; } catch { /* thử bản phân trang */ }
  return mapPoleTypes(await call('POST', 'poleType/getAllPoleTypeOfProjectPage', { projectId, body: { projectId, current: 1, size: 100 } }));
}

/** Model thiết bị + template deviceConfig của dự án (chỉ đọc). */
export async function listModels(projectId: string): Promise<DeviceModel[]> {
  return mapModels(await call('GET', `deviceModel/queryAllDeviceModelByProjectId/${projectId}`, { projectId }));
}

/**
 * Liên kết của một cột: thiết bị đang gắn trên cột (chỉ đọc). `modelName`/`modelSlots` tra tên và số đầu đèn từ id model.
 * Với mỗi bộ có LCU còn đọc đèn thực của LCU (queryLampOfLcu): số đầu đèn trong tham chiếu LCU của cột không đáng tin
 * (đã gặp LCU nhiều đèn nhưng `lampHolderNum` ghi 1), nên các kênh vẽ theo dữ liệu của chính LCU.
 */
export async function poleLinks(projectId: string, poleId: string, modelName: (id: string) => string, modelSlots?: (id: string) => number | undefined): Promise<PoleLinks> {
  const [related, attr] = await Promise.all([
    call('GET', `poleActor/queryPoleAndRelatedById/${poleId}`, { projectId }),
    call('GET', `poleActor/queryAttributeDeviceOfPole/${poleId}`, { projectId }).catch(() => null),   // lỗi phần phụ vẫn hiện được phần chính
  ]);
  const links = mapPoleLinks(related, attr, modelName, modelSlots);
  await Promise.all(links.groups.map(async g => {
    if (!g.lcu) return;
    try { g.lcuLamps = mapLcuLamps(await call('GET', `projectLampActor/queryLampOfLcu/${g.lcu.id}`, { projectId }), modelName); } catch { /* giữ đèn theo attributeDevice */ }
    if (g.lcuLamps?.length) g.lcu.slots = lcuSlotCount(g.lcu.slots, undefined, g.lcuLamps.map(l => l.channel));
  }));
  return links;
}

/** Chốt chặn ở tầng adapter: bản build không bật ghi thì mọi hàm gửi lệnh ghi đều từ chối. */
const assertWrite = () => { if (!WRITE_ENABLED) throw new Error('Thao tác ghi đang tắt ở bản này'); };

// ---- THAO TÁC GHI (payload đã bắt từ web Fonda gốc — docs/15 §7). UI phải xác nhận trước khi gọi. ----

/** Đối tượng cột thô (để sửa). */
export const poleRaw = (projectId: string, poleId: string) => call<Record<string, unknown>>('GET', `poleActor/queryPoleAndRelatedById/${poleId}`, { projectId });

/** Body sẽ gửi khi sửa tên/mã cột (xem trước trước khi xác nhận). */
export async function previewPoleUpdate(projectId: string, poleId: string, patch: { deviceName?: string; deviceCode?: string }, add: GroupInput[] = [], removeIdx: number[] = []) {
  return poleUpdateBody(await poleRaw(projectId, poleId), patch, add, projectId, removeIdx);
}
export const sendPoleUpdate = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('PUT', 'poleActor/update', { projectId, body }); };

/** Số thiết bị liên quan của cột (0 = xoá được). */
export const poleRelatedCount = (projectId: string, poleId: string) => call<number>('POST', 'device/checkDeviceRelated', { projectId, body: poleIdsBody([poleId]) });
export const sendPoleDelete = (projectId: string, poleId: string) => { assertWrite(); return call('POST', 'poleActor/delete', { projectId, body: poleIdsBody([poleId]) }); };

/** Body nhân bản model (xem trước) và gửi. */
export const previewModelClone = (projectId: string, base: { typeId: string; typeValue: number; config: Record<string, unknown> }, name: string) => modelCreateBody(base, name, projectId);
/** Body nhân bản model LCU (xem trước). */
export const previewLcuModelClone = (projectId: string, base: { typeId: string; config: Record<string, unknown>; protocol: ModelProto }, name: string, remark = '') => lcuModelCreateBody({ typeId: base.typeId, config: base.config, protocol: base.protocol }, name, projectId, remark);
export const sendModelCreate = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'deviceModel/saveNew', { projectId, body }); };

// Thêm THIẾT BỊ từ model (payload bắt 2026-11-25): loại → API
export const DEVICE_CREATE: Record<number, { kind: 'meter' | 'gateway' | 'rtu' | 'switch'; path: string }> = {
  1: { kind: 'meter', path: 'meterActor/saveNew' }, 3: { kind: 'gateway', path: 'smartBoxActor/save' }, 4: { kind: 'rtu', path: 'rtuActor/saveNew' }, 9: { kind: 'switch', path: 'kmDetectActor/save' },
};
export { kmDetectSaveBody, meterSaveBody, rtuSaveBody, smartBoxSaveBody };
// Xoá thiết bị: kiểm tra liên quan rồi xoá (bắt 2026-11-25). Lưu ý RTU/Công tơ dùng `checkDeviceRelatedNew` + `deleteNew`; Gateway/Switch/LCU dùng `checkDeviceRelated` (Switch: New) + `delete`.
export const DEVICE_DELETE: Record<number, { check: string; del: string }> = {
  1: { check: 'device/checkDeviceRelatedNew', del: 'meterActor/deleteNew' }, 3: { check: 'device/checkDeviceRelated', del: 'smartBoxActor/delete' },
  4: { check: 'device/checkDeviceRelatedNew', del: 'rtuActor/deleteNew' }, 9: { check: 'device/checkDeviceRelatedNew', del: 'kmDetectActor/delete' },
};
export const deviceRelatedCount = async (projectId: string, typeValue: number, id: string): Promise<number> => {
  const d = DEVICE_DELETE[typeValue]; if (!d) throw new Error('Loại này chưa có payload xoá');
  return Number(await call('POST', d.check, { projectId, body: deviceIdsBody([id], typeValue) })) || 0;
};
export const sendDeviceDelete = (projectId: string, typeValue: number, id: string) => { assertWrite(); const d = DEVICE_DELETE[typeValue]; if (!d) throw new Error('Loại này chưa có payload xoá'); return call('POST', d.del, { projectId, body: deviceIdsBody([id], typeValue) }); };
// Liên kết thiết bị ↔ RTU: loại thiết bị → API
export const RTU_LINK: Record<number, { kind: 'lcu' | 'meter' | 'km'; path: string }> = { 2: { kind: 'lcu', path: 'lcuActor/updateRtuId' }, 1: { kind: 'meter', path: 'meterActor/updateRtuId' }, 9: { kind: 'km', path: 'kmDetectActor/updateRtuId' } };
export { deviceIdsBody, rtuLinkBody };
export const sendRtuLink = (projectId: string, typeValue: number, body: Record<string, unknown>) => { assertWrite(); const d = RTU_LINK[typeValue]; if (!d) throw new Error('Loại này chưa có payload liên kết RTU'); return call('POST', d.path, { projectId, body }); };

export const sendDeviceCreate = (projectId: string, typeValue: number, body: Record<string, unknown>) => {
  assertWrite(); const d = DEVICE_CREATE[typeValue]; if (!d) throw new Error('Loại thiết bị này chưa có payload thêm thiết bị');
  return call('POST', d.path, { projectId, body });
};

// Template mọi loại + loại cột (payload bắt 2026-11-20, docs/15 §7)
export { modelCloneBody, modelUpdateBody, modelIdsBody, poleTypeSaveBody, poleTypeUpdateBody, poleTypeIdsBody };
export type { PoleTypeIn, ProtoIn };
export const sendModelUpdate = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'deviceModel/updateNew', { projectId, body }); };
/** Template có đang được thiết bị dùng không (POST deviceModel/useOrNo → data.result; Fonda dùng để khoá ô Producer). Lỗi → undefined. */
export async function modelInUse(projectId: string, modelId: string): Promise<boolean | undefined> {
  try { const d = await call<{ result?: unknown }>('POST', 'deviceModel/useOrNo', { projectId, body: { deviceModelId: modelId } }); return d?.result === undefined ? undefined : !!d.result; } catch { return undefined; }
}
export const sendModelDelete = (projectId: string, ids: string[]) => { assertWrite(); return call('POST', 'deviceModel/delete', { projectId, body: modelIdsBody(ids) }); };
export const sendPoleTypeSave = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'poleType/save', { projectId, body }); };
export const sendPoleTypeUpdate = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'poleType/update', { projectId, body }); };
export const sendPoleTypeDelete = (projectId: string, ids: string[]) => { assertWrite(); return call('POST', 'poleType/delete', { projectId, body: poleTypeIdsBody(ids) }); };

/** Giao thức chọn được của một loại thiết bị (POST deviceTypeController/queryProtocolByDeviceId — đã dò thật 2026-11-20); lỗi thì []. */
export async function listTypeProtocols(projectId: string, typeId: string): Promise<ModelProto[]> {
  try {
    const d = mapTypeProtocols(await call('POST', 'deviceTypeController/queryProtocolByDeviceId', { projectId, body: { deviceTypeId: typeId, projectId } }));
    return d.filter(p => p.enable).map(p => ({ id: p.id, value: p.value, name: p.name, version: p.version, systemConfig: 0, remark: '' }));
  } catch { return []; }
}
/** Chức năng của một giao thức (POST protocolActor/queryProtocolFunction) = `functionList` của model; lỗi thì []. */
export async function protocolFunctions(projectId: string, p: { id: string; value: number }): Promise<number[]> {
  try { return mapFunctions(await call('POST', 'protocolActor/queryProtocolFunction', { projectId, body: { protocolId: p.id, protocolValue: p.value, projectId } })); } catch { return []; }
}

/** Giao thức/phiên bản/systemConfig của các model một loại (deviceModel/getDeviceModelPage — danh sách model trả kèm các trường này). */
export interface ModelProto { id: string; value: number; name: string; version: string; systemConfig: number; remark: string }
export async function modelProtocols(projectId: string, typeId: string): Promise<Map<string, ModelProto>> {
  const out = new Map<string, ModelProto>();
  const d = await call<{ records?: Array<Record<string, unknown>> }>('POST', 'deviceModel/getDeviceModelPage', { projectId, body: { projectId, current: 1, size: 100, deviceTypeId: typeId } });
  for (const r of d.records || []) out.set(String(r.deviceModelId), { id: String(r.protocolId ?? ''), value: Number(r.protocolValue), name: String(r.protocolName ?? ''), version: String(r.protocolVersion ?? ''), systemConfig: Number(r.systemConfig) || 0, remark: String(r.remark ?? r.deviceModelRemark ?? '') });
  return out;
}

/** Danh mục để dựng form bộ đèn–LCU: model cột/đèn/LCU (LCU kèm giao thức) và LCU chưa gắn cột. */
export interface LcuModel { id: string; name: string; slots: number; protocolValue: number; protocolName: string }
export interface PoleCatalog { poleModels: DeviceModel[]; lampModels: DeviceModel[]; lcuModels: LcuModel[]; freeLcus: FreeLcu[] }
export async function loadPoleCatalog(projectId: string): Promise<PoleCatalog> {
  const [types, models, freeLcus] = await Promise.all([listDeviceTypes(projectId), listModels(projectId), listFreeLcus(projectId)]);
  const idsOf = (v: number) => new Set(types.filter(t => t.value === v).map(t => t.id));
  const lcuType = types.find(t => t.value === 2);
  // giao thức của model LCU (protocolValue/Name) chỉ có ở deviceModel/getDeviceModelPage
  const proto = new Map<string, { v: number; n: string }>();
  if (lcuType) {
    try {
      const d = await call<{ records?: Array<Record<string, unknown>> }>('POST', 'deviceModel/getDeviceModelPage', { projectId, body: { projectId, current: 1, size: 100, deviceTypeId: lcuType.id } });
      for (const r of d.records || []) proto.set(String(r.deviceModelId), { v: Number(r.protocolValue), n: String(r.protocolName ?? '') });
    } catch { /* thiếu giao thức: chỉ ảnh hưởng LCU mới */ }
  }
  const lcuModels = models.filter(m => idsOf(2).has(m.typeId)).map(m => ({ id: m.id, name: m.name, slots: Number(m.config.lampHolderNum) || 1, protocolValue: proto.get(m.id)?.v ?? NaN, protocolName: proto.get(m.id)?.n ?? '' }));
  return { poleModels: models.filter(m => idsOf(6).has(m.typeId)), lampModels: models.filter(m => idsOf(5).has(m.typeId)), lcuModels, freeLcus };
}

export const sendPoleCreate = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'poleActor/save', { projectId, body }); };

/** LCU chưa gắn cột (poleId rỗng) — nguồn chọn khi tạo cột. Kèm số đầu đèn lấy từ deviceConfig của model LCU. */
export interface FreeLcu { id: string; uid: string; name: string; model: string; slots: number }
export async function listFreeLcus(projectId: string): Promise<FreeLcu[]> {
  const types = await listDeviceTypes(projectId), t = types.find(x => x.value === 2); if (!t) return [];
  const models = new Map((await listModels(projectId)).map(m => [m.id, m]));
  return (await listDevices(projectId, t.value)).filter(d => d.uid && !d.raw.poleId)
    .map(d => { const m = models.get(String(d.raw.deviceModelId ?? '')); return { id: d.id, uid: d.uid, name: d.name, model: d.model, slots: Number(m?.config.lampHolderNum) || 1 }; });
}

/** Thêm LCU riêng lẻ (lcuActor/save) — body xem trước + gửi. */
export const previewLcuSave = (projectId: string, i: { modelId: string; name: string; uid: string; protocolValue: number; protocolName: string }) => lcuSaveBody({ projectId, ...i });
export const sendLcuSave = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'lcuActor/save', { projectId, body }); };

/** Số thiết bị liên quan của LCU (0 = xoá được). */
export const lcuRelatedCount = (projectId: string, lcuId: string) => call<number>('POST', 'device/checkDeviceRelated', { projectId, body: lcuIdsBody([lcuId]) });
/** Xoá LCU: lcuActor/delete với body theo quy ước của poleActor/delete — CHƯA bắt từ web gốc, có thể bị từ chối. */
/** Cấp điện từ RTU cho nhiều LCU/điểm sáng một lần (supplyElectricityDevice/relatedSuppLyElectricity). */
export const sendSupplyLink = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'supplyElectricityDevice/relatedSuppLyElectricity', { projectId, body }); };
export { lcuDeleteBody, supplyLinkBody };
/** Xoá LCU với body tuỳ ý (otype do người dùng chọn / sửa JSON). */
export const sendLcuDeleteBody = (projectId: string, body: Record<string, unknown>) => { assertWrite(); return call('POST', 'lcuActor/delete', { projectId, body }); };
export const sendLcuDelete = (projectId: string, lcuId: string) => { assertWrite(); return call('POST', 'lcuActor/delete', { projectId, body: lcuDeleteBody([lcuId]) }); };
