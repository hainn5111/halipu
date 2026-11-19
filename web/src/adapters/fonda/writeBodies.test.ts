import { describe, expect, it } from 'vitest';
import { modelCreateBody, poleIdsBody, poleUpdateBody } from './writeBodies';

describe('modelCreateBody', () => {
  it('khớp payload đã bắt (deviceModelId rỗng, deviceConfig là object)', () => {
    expect(modelCreateBody({ typeId: 'T6', typeValue: 6, config: { poleType: 1 } }, 'Cột test', 'PID')).toEqual({
      protocolId: '', protocolValue: -1, useTag: null, deviceTypeValue: 6, deviceConfig: { poleType: 1 }, deviceModelId: '', projectId: 'PID', deviceTypeId: 'T6', deviceModelName: 'Cột test' });
  });
});

describe('poleUpdateBody', () => {
  const raw = { deviceId: 'P', deviceName: 'Cột 3', deviceCode: 'Cột 3', solarDevice: [], attributeDevice: [{ checked: true, solar: {}, solarLcu: {}, lcu: { uid: '000000789DDD', deviceId: 'L', lampHolderNum: 1, deviceModelId: 'M' }, lamp: [{ lampNum: 1, deviceId: 'D', luid: '000000789DDD', lcuId: 'L', checked: true }] }] };
  it('chuẩn hoá attributeDevice như web gốc và áp phần sửa', () => {
    const r = poleUpdateBody(raw, { deviceCode: 'Cột 348' }); expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.body.deviceCode).toBe('Cột 348'); expect(r.body.deviceName).toBe('Cột 3');
    const g = (r.body.attributeDevice as Array<Record<string, any>>)[0];   // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(g).toMatchObject({ uid: '000000789DDD', lampPosition: 1, lcu: { deviceId: 'L', linkMode: 2 } });
    expect(g.lamp[0]).toMatchObject({ checkNum: 1, lampPosition: 1, deviceId: 'D' });
    expect((r.body.solarDevice as unknown[]).length).toBe(1);
  });
  it('không sửa đối tượng gốc', () => { poleUpdateBody(raw, { deviceName: 'x' }); expect(raw.deviceName).toBe('Cột 3'); expect((raw.attributeDevice[0].lcu as Record<string, unknown>).linkMode).toBeUndefined(); });
  it('cột có đèn không LCU: giữ lcu {} và không có uid', () => {
    const r = poleUpdateBody({ deviceId: 'P', attributeDevice: [{ lcu: {}, solar: {}, solarLcu: {}, lamp: [{ lampNum: 1, deviceId: 'D2', luid: null, lcuId: null }] }, { lcu: {}, lamp: [{ lampNum: 1, deviceId: 'D3' }] }] }, { deviceCode: 'x' });
    expect(r.ok).toBe(true); if (!r.ok) return;
    const gs = r.body.attributeDevice as Array<Record<string, any>>;   // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(gs[0].lcu).toEqual({}); expect(gs[0].uid).toBeUndefined(); expect(gs[1].lampPosition).toBe(2); expect(gs[1].lamp[0]).toMatchObject({ checkNum: 1, lampPosition: 2 });
  });
  it('gỡ bộ không LCU: checked:false + remove:true, vị trí các bộ khác giữ nguyên (khớp capture)', () => {
    const rw = { deviceId: 'P', solarDevice: [], attributeDevice: [
      { checked: true, solar: {}, solarLcu: {}, lcu: {}, lamp: [{ lampNum: 1, deviceId: 'DA' }] },
      { checked: true, solar: {}, solarLcu: {}, lcu: {}, lamp: [{ lampNum: 1, deviceId: 'DB' }] }] };
    const r = poleUpdateBody(rw, {}, [], 'PID', [0]); expect(r.ok).toBe(true); if (!r.ok) return;
    const gs = r.body.attributeDevice as Array<Record<string, any>>;   // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(gs[0]).toMatchObject({ checked: false, remove: true, lampPosition: 1 }); expect(gs[0].lamp[0]).toMatchObject({ deviceId: 'DA', checkNum: 1, lampPosition: 1 });
    expect(gs[1].remove).toBeUndefined(); expect(gs[1].checked).toBe(true); expect(gs[1].lampPosition).toBe(2);
  });
  it('gỡ bộ có LCU cũng dùng cùng cách (remove:true), bộ không tồn tại → từ chối', () => {
    const r = poleUpdateBody(raw, {}, [], 'PID', [0]); expect(r.ok).toBe(true); if (!r.ok) return;
    expect((r.body.attributeDevice as Array<Record<string, any>>)[0]).toMatchObject({ checked: false, remove: true, uid: '000000789DDD', lcu: { deviceId: 'L', linkMode: 2 } });   // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(poleUpdateBody(raw, {}, [], 'PID', [5]).ok).toBe(false);
  });
  it('thiếu id → từ chối', () => expect(poleUpdateBody({}, {}).ok).toBe(false));
  it('thêm bộ mới vào cột có sẵn: nối sau các bộ cũ, vị trí tiếp theo', () => {
    const r = poleUpdateBody(raw, {}, [{ lcu: { kind: 'none' }, lamps: [{ modelId: 'ML', name: 'Đèn mới', channel: 1 }] }], 'PID');
    expect(r.ok).toBe(true); if (!r.ok) return;
    const gs = r.body.attributeDevice as Array<Record<string, any>>;   // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(gs).toHaveLength(2); expect(gs[1]).toEqual({ checked: true, lamp: [{ checked: true, deviceModelId: 'ML', deviceName: 'Đèn mới', lampPosition: 2, lampNum: 1, flag: true, checkNum: 1 }], lcu: {}, solarLcu: {}, solar: {}, lampPosition: 2 });
  });
  it('bộ mới dùng lại UID LCU đã có trên cột → từ chối', () => {
    const r = poleUpdateBody(raw, {}, [{ lcu: { kind: 'existing', deviceId: 'L', uid: '000000789DDD', slots: 1 }, lamps: [{ modelId: 'ML', name: 'x', channel: 1 }] }], 'PID');
    expect(r.ok).toBe(false);
  });
  it('cột chưa gắn gì vẫn sửa được', () => expect(poleUpdateBody({ deviceId: 'P', attributeDevice: [] }, { deviceName: 'a' }).ok).toBe(true));
});

describe('poleIdsBody', () => { it('đúng dạng đã bắt', () => expect(poleIdsBody(['a'])).toEqual({ deviceIdList: ['a'], deviceTypeValue: 6 })); });


import { groupBody, groupError, groupsError, poleCreateBody, type GroupInput, type PoleCreateInput } from './writeBodies';

describe('poleCreateBody / groupBody', () => {
  const lamp = { modelId: 'ML', name: 'Đèn test 123', channel: 1 };
  const base: PoleCreateInput = { projectId: 'PID', poleModelId: 'MP', name: 'Cột 3', code: 'Cột 3', lat: '20.935650049802803', lng: '105.66665674490189', address: 'WMP8+7M',
    groups: [{ lcu: { kind: 'existing', deviceId: 'LCU1', uid: '000000789DDD', slots: 1 }, lamps: [lamp] }] };
  it('LCU có sẵn khớp payload đã bắt (linkMode 2)', () => {
    const r = poleCreateBody(base); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.body).toEqual({
      areaId: '', roadId: '', roadDirection: '', deviceStatus: 1, deviceSource: 1,
      attributeDevice: [{ checked: true, lamp: [{ checked: true, deviceModelId: 'ML', deviceName: 'Đèn test 123', lampPosition: 1, lampNum: 1, flag: true }], lcu: { deviceId: 'LCU1', uid: '000000789DDD', lampHolderNum: 1, linkMode: 2 }, solarLcu: {}, solar: {}, uid: '000000789DDD', lampPosition: 1 }],
      solarDevice: [], deviceId: '', deviceModelId: 'MP', deviceName: 'Cột 3', deviceCode: 'Cột 3', lat: '20.935650049802803', lng: '105.66665674490189', geographicAddress: 'WMP8+7M', projectId: 'PID' });
  });
  it('LCU mới khớp payload đã bắt (linkMode 1, đủ trường)', () => {
    const g: GroupInput = { lcu: { kind: 'new', modelId: 'MLCU', name: '123456', uid: '789ddd', slots: 1, protocolValue: 53, protocolName: 'RF/F2' }, lamps: [{ modelId: 'ML', name: 'ĐÈN 3', channel: 1 }] };
    expect(groupBody(g, 1, 'PID')).toEqual({ checked: true, lamp: [{ checked: true, deviceModelId: 'ML', deviceName: 'ĐÈN 3', lampPosition: 1, lampNum: 1, flag: true }], solarLcu: {}, solar: {}, uid: '789DDD', lampPosition: 1,
      lcu: { lcuTask: true, deviceType: 2, deviceModelId: 'MLCU', deviceName: '123456', deviceCode: '', uid: '789DDD', imsi: '', imei: '', sim: '', ccid: '', protocolValue: 53, protocolMode: '', deviceSource: 1, projectId: 'PID', cls: '', fcntbits: '', lwan: '', protocolName: 'RF/F2', factory: null, linkMode: 1, lampHolderNum: 1 } });
  });
  it('nhiều bộ: bộ không LCU như Cột 2 (lcu {}), vị trí tăng dần', () => {
    const r = poleCreateBody({ ...base, groups: [{ lcu: { kind: 'none' }, lamps: [{ modelId: 'ML', name: 'Đèn 2', channel: 1 }] }, { lcu: { kind: 'none' }, lamps: [{ modelId: 'ML', name: 'Đèn 3', channel: 1 }] }] });
    expect(r.ok).toBe(true); if (!r.ok) return;
    const gs = r.body.attributeDevice as Array<Record<string, any>>;   // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(gs.map(g => g.lampPosition)).toEqual([1, 2]); expect(gs[0].lcu).toEqual({}); expect(gs[0].uid).toBeUndefined(); expect(gs[1].lamp[0].lampPosition).toBe(2);
  });
  it('từ chối dữ liệu sai', () => {
    const ex = (uid: string): GroupInput => ({ lcu: { kind: 'existing', deviceId: 'L' + uid, uid, slots: 1 }, lamps: [lamp] });
    for (const bad of [{ name: ' ' }, { poleModelId: '' }, { lat: 'abc' }, { lat: '0', lng: '0' }, { lng: '200' }, { groups: [] },
      { groups: [{ lcu: { kind: 'existing' as const, deviceId: '', uid: '', slots: 1 }, lamps: [lamp] }] },
      { groups: [{ lcu: { kind: 'none' as const }, lamps: [] }] },
      { groups: [{ lcu: { kind: 'none' as const }, lamps: [lamp, lamp] }] },
      { groups: [{ lcu: { kind: 'existing' as const, deviceId: 'L', uid: 'U', slots: 1 }, lamps: [{ ...lamp, channel: 2 }] }] },
      { groups: [{ lcu: { kind: 'new' as const, modelId: 'M', name: 'n', uid: 'ZZZ', slots: 1, protocolValue: 53, protocolName: 'x' }, lamps: [lamp] }] },
      { groups: [ex('000000000AAA'), ex('AAA')] }])
      expect(poleCreateBody({ ...base, ...bad }).ok).toBe(false);
    expect(groupError({ lcu: { kind: 'none' }, lamps: [{ modelId: '', name: 'x', channel: 1 }] }, 'B')).toMatch(/model và tên/);
    expect(groupsError([ex('000000000AAA')], ['AAA'])).toMatch(/đã dùng/);
  });
});
