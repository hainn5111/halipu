// Dựng body cho các API GHI, theo đúng payload đã bắt từ web Fonda gốc (docs/15 §7). Hàm THUẦN, có test.
type Rec = Record<string, unknown>;
const arr = (v: unknown): Rec[] => (Array.isArray(v) ? (v as Rec[]) : []);
const obj = (v: unknown): Rec => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Rec) : {});

/** deviceModel/saveNew — nhân bản một model (cùng loại, cùng deviceConfig) thành model mới tên `name`. Đã bắt cho loại Lamp Pole. */
export function modelCreateBody(base: { typeId: string; typeValue: number; config: Rec }, name: string, projectId: string): Rec {
  return { protocolId: '', protocolValue: -1, useTag: null, deviceTypeValue: base.typeValue, deviceConfig: base.config, deviceModelId: '', projectId, deviceTypeId: base.typeId, deviceModelName: name };
}

/**
 * deviceModel/saveNew cho model LCU (đã bắt 2026-11-19): ngoài deviceConfig còn khai giao thức (`protocolId/Value/Name/Version`)
 * và `remark`; không có khoá `deviceModelId` (khác body model cột). Nhân bản = giữ nguyên deviceConfig và giao thức của model gốc.
 */
export function lcuModelCreateBody(base: { typeId: string; config: Rec; protocol: { id: string; value: number; name: string; version: string } }, name: string, projectId: string, remark = ''): Rec {
  return { deviceTypeId: base.typeId, protocolId: base.protocol.id, protocolValue: base.protocol.value, useTag: null, deviceTypeValue: 2, deviceConfig: base.config,
    protocolName: base.protocol.name, protocolVersion: base.protocol.version, deviceModelName: name, remark, projectId };
}

export type PoleUpdate = { ok: true; body: Rec } | { ok: false; reason: string };

/**
 * poleActor/update — web gửi lại TOÀN BỘ đối tượng cột (như queryPoleAndRelatedById) kèm phần sửa, và chuẩn hoá attributeDevice:
 * mỗi bộ gắn thêm `uid`, `lampPosition`; lcu thêm `linkMode: 2`; lamp thêm `checkNum`, `lampPosition`; `solarDevice` rỗng → 1 phần tử mẫu.
 * Chỉ dựng cho cột mà MỌI bộ gắn đều có LCU (cột có đèn rời không LCU chưa bắt được payload → từ chối thay vì đoán).
 */
export function poleUpdateBody(raw: Rec, patch: { deviceName?: string; deviceCode?: string }, add: GroupInput[] = [], projectId = '', removeIdx: number[] = []): PoleUpdate {
  if (!raw.deviceId) return { ok: false, reason: 'Thiếu deviceId của cột' };
  const groups = arr(raw.attributeDevice);
  const bad = add.map((g, i) => groupError(g, `Bộ mới #${i + 1}`)).find(Boolean) ?? groupsError(add, groups.map(g => String(obj(g.lcu).uid ?? '')));
  if (bad) return { ok: false, reason: bad };
  // Bộ có sẵn: đèn không LCU có `lcu: {}` (không có uid) — payload cho trường hợp này CHƯA bắt, dựng theo cùng quy ước (cần thử).
  for (const i of removeIdx) {
    if (!groups[i]) return { ok: false, reason: `Không có bộ #${i + 1} để gỡ` };
  }
  const existing = groups.map((g, i) => {
    const lcu = obj(g.lcu), hasLcu = !!lcu.deviceId;
    // Gỡ bộ (đã bắt với bộ không LCU; người dùng xác nhận bộ có LCU gỡ được như nhau): giữ bộ trong danh sách, checked:false + remove:true; vị trí KHÔNG đánh số lại.
    const drop = removeIdx.includes(i) ? { checked: false, remove: true } : {};
    return { ...g, ...(hasLcu ? { uid: lcu.uid } : {}), lampPosition: i + 1, lcu: hasLcu ? { ...lcu, linkMode: 2 } : lcu, lamp: arr(g.lamp).map(l => ({ ...l, checkNum: l.lampNum ?? 1, lampPosition: i + 1 })), ...drop };
  });
  // Bộ mới trong update: đèn mới có thêm `checkNum` (= lampNum) so với khi tạo cột bằng save (đã bắt).
  const attributeDevice = [...existing, ...add.map((g, i) => groupBody(g, existing.length + i + 1, projectId, true))];
  const solarDevice = arr(raw.solarDevice).length ? raw.solarDevice : [{ checked: true, lamp: { checked: true, deviceModelId: '', deviceName: '', lampNum: 1, flag: true }, solar: {}, wcu: {}, dtu: {}, serialId: '', serialNum: '', addr: '', communicationEquipmentName: '', lampPosition: 1 }];
  const body: Rec = { ...raw, attributeDevice, solarDevice };
  if (patch.deviceName !== undefined) body.deviceName = patch.deviceName;
  if (patch.deviceCode !== undefined) body.deviceCode = patch.deviceCode;
  return { ok: true, body };
}

/** device/checkDeviceRelated và poleActor/delete dùng cùng dạng body (deviceTypeValue 6 = Lamp Pole). */
export const poleIdsBody = (ids: string[]): Rec => ({ deviceIdList: ids, deviceTypeValue: 6 });


// ---- Bộ "đèn – LCU" (attributeDevice[]) dùng chung cho tạo cột và thêm bộ vào cột có sẵn ----

/** Kiểu LCU của một bộ: không có (đèn gắn thẳng cột), LCU có sẵn (linkMode 2), hoặc LCU tạo mới cùng lúc (linkMode 1). */
export type GroupLcu =
  | { kind: 'none' }
  | { kind: 'existing'; deviceId: string; uid: string; slots: number }
  | { kind: 'new'; modelId: string; name: string; uid: string; slots: number; protocolValue: number; protocolName: string };
export interface GroupInput { lcu: GroupLcu; lamps: Array<{ modelId: string; name: string; channel: number }> }

const normUid = (u: string) => u.trim().toUpperCase().padStart(12, '0');

export function groupError(g: GroupInput, label: string): string | null {
  if (!g.lamps.length) return `${label}: cần ít nhất một đèn`;
  if (g.lamps.some(l => !l.modelId || !l.name.trim())) return `${label}: mỗi đèn cần model và tên`;
  const l = g.lcu;
  if (l.kind === 'none') return g.lamps.length === 1 && g.lamps[0].channel === 1 ? null : `${label}: bộ không LCU chỉ có đúng 1 đèn (kênh 1)`;
  if (l.kind === 'existing' && (!l.deviceId || !l.uid)) return `${label}: chưa chọn LCU`;
  if (l.kind === 'new') {
    if (!l.modelId) return `${label}: chưa chọn model LCU`;
    if (!l.name.trim()) return `${label}: thiếu tên LCU`;
    if (!/^[0-9A-Fa-f]{1,12}$/.test(l.uid.trim())) return `${label}: UID LCU phải là 1–12 ký tự hex`;
  }
  const slots = l.slots, ch = g.lamps.map(x => x.channel);
  if (new Set(ch).size !== ch.length || ch.some(c => !Number.isInteger(c) || c < 1 || c > slots)) return `${label}: kênh đèn phải khác nhau và trong 1..${slots} (số đầu đèn của LCU)`;
  return null;
}

/** Kiểm tra giữa các bộ: không dùng một LCU hai lần, UID LCU mới không trùng LCU nào (`taken` = UID đã có trên cột). */
export function groupsError(groups: GroupInput[], taken: string[] = []): string | null {
  const seen = new Set(taken.filter(Boolean).map(normUid));
  for (const [i, g] of groups.entries()) {
    if (g.lcu.kind === 'none') continue;
    const u = normUid(g.lcu.uid);
    if (seen.has(u)) return `Bộ #${i + 1}: LCU ${u} đã dùng ở bộ khác`;
    seen.add(u);
  }
  return null;
}

/** Một phần tử attributeDevice theo payload đã bắt (docs/15 §7); `position` = vị trí bộ trong cột (từ 1). */
export function groupBody(g: GroupInput, position: number, projectId: string, forUpdate = false): Rec {
  const lamp = g.lamps.map(l => ({ checked: true, deviceModelId: l.modelId, deviceName: l.name.trim(), lampPosition: position, lampNum: l.channel, flag: true, ...(forUpdate ? { checkNum: l.channel } : {}) }));
  const l = g.lcu;
  if (l.kind === 'none') return { checked: true, lamp, lcu: {}, solarLcu: {}, solar: {}, lampPosition: position };
  if (l.kind === 'existing') return { checked: true, lamp, lcu: { deviceId: l.deviceId, uid: l.uid, lampHolderNum: l.slots, linkMode: 2 }, solarLcu: {}, solar: {}, uid: l.uid, lampPosition: position };
  const uid = l.uid.trim().toUpperCase();
  return { checked: true, lamp, solarLcu: {}, solar: {}, uid, lampPosition: position,
    lcu: { lcuTask: true, deviceType: 2, deviceModelId: l.modelId, deviceName: l.name.trim(), deviceCode: '', uid, imsi: '', imei: '', sim: '', ccid: '', protocolValue: l.protocolValue, protocolMode: '', deviceSource: 1, projectId, cls: '', fcntbits: '', lwan: '', protocolName: l.protocolName, factory: null, linkMode: 1, lampHolderNum: l.slots } };
}

export interface PoleCreateInput { projectId: string; poleModelId: string; name: string; code: string; lat: string; lng: string; address: string; groups: GroupInput[] }

/** poleActor/save — tạo cột + danh sách bộ (đèn–LCU). Trả lý do nếu dữ liệu không hợp lệ. */
export function poleCreateBody(i: PoleCreateInput): { ok: true; body: Rec } | { ok: false; reason: string } {
  const lat = Number(i.lat), lng = Number(i.lng);
  if (!i.name.trim()) return { ok: false, reason: 'Thiếu tên cột' };
  if (!i.poleModelId) return { ok: false, reason: 'Chưa chọn template cột' };
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180 || (lat === 0 && lng === 0)) return { ok: false, reason: 'Toạ độ không hợp lệ' };
  if (!i.groups.length) return { ok: false, reason: 'Cần ít nhất một bộ đèn' };
  const bad = i.groups.map((g, k) => groupError(g, `Bộ #${k + 1}`)).find(Boolean) ?? groupsError(i.groups);
  if (bad) return { ok: false, reason: bad };
  return { ok: true, body: {
    areaId: '', roadId: '', roadDirection: '', deviceStatus: 1, deviceSource: 1,
    attributeDevice: i.groups.map((g, k) => groupBody(g, k + 1, i.projectId)),
    solarDevice: [], deviceId: '', deviceModelId: i.poleModelId, deviceName: i.name.trim(), deviceCode: i.code.trim() || i.name.trim(),
    lat: String(i.lat).trim(), lng: String(i.lng).trim(), geographicAddress: i.address.trim(), projectId: i.projectId } };
}
