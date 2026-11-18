// Dựng body cho các API GHI, theo đúng payload đã bắt từ web Fonda gốc (docs/15 §7). Hàm THUẦN, có test.
type Rec = Record<string, unknown>;
const arr = (v: unknown): Rec[] => (Array.isArray(v) ? (v as Rec[]) : []);
const obj = (v: unknown): Rec => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Rec) : {});

/** deviceModel/saveNew — nhân bản một model (cùng loại, cùng deviceConfig) thành model mới tên `name`. Đã bắt cho loại Lamp Pole. */
export function modelCreateBody(base: { typeId: string; typeValue: number; config: Rec }, name: string, projectId: string): Rec {
  return { protocolId: '', protocolValue: -1, useTag: null, deviceTypeValue: base.typeValue, deviceConfig: base.config, deviceModelId: '', projectId, deviceTypeId: base.typeId, deviceModelName: name };
}

export type PoleUpdate = { ok: true; body: Rec } | { ok: false; reason: string };

/**
 * poleActor/update — web gửi lại TOÀN BỘ đối tượng cột (như queryPoleAndRelatedById) kèm phần sửa, và chuẩn hoá attributeDevice:
 * mỗi bộ gắn thêm `uid`, `lampPosition`; lcu thêm `linkMode: 2`; lamp thêm `checkNum`, `lampPosition`; `solarDevice` rỗng → 1 phần tử mẫu.
 * Chỉ dựng cho cột mà MỌI bộ gắn đều có LCU (cột có đèn rời không LCU chưa bắt được payload → từ chối thay vì đoán).
 */
export function poleUpdateBody(raw: Rec, patch: { deviceName?: string; deviceCode?: string }): PoleUpdate {
  if (!raw.deviceId) return { ok: false, reason: 'Thiếu deviceId của cột' };
  const groups = arr(raw.attributeDevice);
  if (groups.some(g => !obj(g.lcu).deviceId && arr(g.lamp).length > 0)) return { ok: false, reason: 'Cột có đèn chưa gắn LCU — chưa bắt được payload sửa cho trường hợp này' };
  const attributeDevice = groups.map((g, i) => {
    const lcu = obj(g.lcu), hasLcu = !!lcu.deviceId;
    return { ...g, ...(hasLcu ? { uid: lcu.uid } : {}), lampPosition: i + 1, lcu: hasLcu ? { ...lcu, linkMode: 2 } : lcu, lamp: arr(g.lamp).map(l => ({ ...l, checkNum: l.lampNum ?? 1, lampPosition: i + 1 })) };
  });
  const solarDevice = arr(raw.solarDevice).length ? raw.solarDevice : [{ checked: true, lamp: { checked: true, deviceModelId: '', deviceName: '', lampNum: 1, flag: true }, solar: {}, wcu: {}, dtu: {}, serialId: '', serialNum: '', addr: '', communicationEquipmentName: '', lampPosition: 1 }];
  const body: Rec = { ...raw, attributeDevice, solarDevice };
  if (patch.deviceName !== undefined) body.deviceName = patch.deviceName;
  if (patch.deviceCode !== undefined) body.deviceCode = patch.deviceCode;
  return { ok: true, body };
}

/** device/checkDeviceRelated và poleActor/delete dùng cùng dạng body (deviceTypeValue 6 = Lamp Pole). */
export const poleIdsBody = (ids: string[]): Rec => ({ deviceIdList: ids, deviceTypeValue: 6 });
