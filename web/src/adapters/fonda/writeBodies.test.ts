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
