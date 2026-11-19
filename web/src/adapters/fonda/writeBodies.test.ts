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
  it('từ chối cột có đèn chưa gắn LCU và đối tượng thiếu id', () => {
    expect(poleUpdateBody({ deviceId: 'P', attributeDevice: [{ lcu: {}, lamp: [{ lampNum: 1 }] }] }, {}).ok).toBe(false);
    expect(poleUpdateBody({}, {}).ok).toBe(false);
  });
  it('cột chưa gắn gì vẫn sửa được', () => expect(poleUpdateBody({ deviceId: 'P', attributeDevice: [] }, { deviceName: 'a' }).ok).toBe(true));
});

describe('poleIdsBody', () => { it('đúng dạng đã bắt', () => expect(poleIdsBody(['a'])).toEqual({ deviceIdList: ['a'], deviceTypeValue: 6 })); });

import { poleCreateBody, type PoleCreateInput } from './writeBodies';
describe('poleCreateBody', () => {
  const base: PoleCreateInput = { projectId: 'PID', poleModelId: 'MP', name: 'Cột 3', code: 'Cột 3', lat: '20.935650049802803', lng: '105.66665674490189', address: 'WMP8+7M', lcu: { deviceId: 'LCU1', uid: '000000789DDD', slots: 1 }, lamps: [{ modelId: 'ML', name: 'Đèn test 123', channel: 1 }] };
  it('khớp payload đã bắt (LCU có sẵn, linkMode 2)', () => {
    const r = poleCreateBody(base); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.body).toEqual({
      areaId: '', roadId: '', roadDirection: '', deviceStatus: 1, deviceSource: 1,
      attributeDevice: [{ checked: true, lamp: [{ checked: true, deviceModelId: 'ML', deviceName: 'Đèn test 123', lampPosition: 1, lampNum: 1, flag: true }], lcu: { deviceId: 'LCU1', uid: '000000789DDD', lampHolderNum: 1, linkMode: 2 }, solarLcu: {}, solar: {}, uid: '000000789DDD', lampPosition: 1 }],
      solarDevice: [], deviceId: '', deviceModelId: 'MP', deviceName: 'Cột 3', deviceCode: 'Cột 3', lat: '20.935650049802803', lng: '105.66665674490189', geographicAddress: 'WMP8+7M', projectId: 'PID' });
  });
  it('mã trống → dùng tên', () => { const r = poleCreateBody({ ...base, code: ' ' }); expect(r.ok && r.body.deviceCode).toBe('Cột 3'); });
  it('từ chối dữ liệu sai', () => {
    for (const bad of [{ name: ' ' }, { poleModelId: '' }, { lat: 'abc' }, { lat: '0', lng: '0' }, { lng: '200' }, { lcu: { deviceId: '', uid: '', slots: 1 } }, { lamps: [] }, { lamps: [{ modelId: '', name: 'x', channel: 1 }] }, { lamps: [{ modelId: 'ML', name: 'a', channel: 2 }] }, { lamps: [{ modelId: 'ML', name: 'a', channel: 1 }, { modelId: 'ML', name: 'b', channel: 1 }] }])
      expect(poleCreateBody({ ...base, ...bad }).ok).toBe(false);
  });
});
