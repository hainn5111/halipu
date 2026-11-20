import { describe, expect, it } from 'vitest';
import { lcuSpec, channelRows, lcuSlotCount, mapLcuLamps, mapPoleLinks, categoryOf, configEntries, mapModels, mapPoleTypes, mapDeviceRow, mapDeviceTypes, mapLight, mapListRow, mapPageRow, mapTrend, mergeLcus, pickGeo, ratedPowerOf, toCsv, validGeo } from './mappers';

describe('pickGeo / validGeo', () => {
  it('đọc lat/lng dạng chuỗi', () => expect(pickGeo({ lat: '20.93271', lng: '105.67026' })).toEqual({ lat: 20.93271, lng: 105.67026 }));
  it('tìm trong object lồng', () => expect(pickGeo({ a: { b: { lat: 10, lng: 106 } } })).toEqual({ lat: 10, lng: 106 }));
  it('không có toạ độ → null', () => expect(pickGeo({ x: 1 })).toBeNull());
  it('loại (0,0) và ngoài khoảng', () => { expect(validGeo({ lat: 0, lng: 0 })).toBe(false); expect(validGeo({ lat: 91, lng: 10 })).toBe(false); expect(validGeo({ lat: 21, lng: 105 })).toBe(true); });
});

describe('mapTrend', () => {
  const d = { date: [1000, 3000, 2000], dateFormat: ['a', 'c', 'b'], p: [1, 3, 2], u: [210, 230, 220], i: [0.1, 0.3, 0.2], pf: [0.9, 0.9, 0.9], e: [10, 30, 20], dim: [100, 100, 100], wp: [1, 1, 1] };
  it('sắp xếp mới nhất trước và ghép các mảng song song', () => {
    const r = mapTrend(d);
    expect(r.map(x => x.ts)).toEqual([3000, 2000, 1000]);
    expect(r[0]).toMatchObject({ time: 'c', power: 3, voltage: 230, current: 0.3, energy: 30 });
  });
  it('dữ liệu rỗng/sai dạng → mảng rỗng', () => { expect(mapTrend(null)).toEqual([]); expect(mapTrend({ date: [] })).toEqual([]); });
});

describe('LCU rows', () => {
  it('lcuActor/page', () => expect(mapPageRow({ uid: 'U1', lcuId: 'L1', deviceName: 'Đèn 1', deviceCode: 'C1' })).toEqual({ uid: 'U1', lcuId: 'L1', name: 'Đèn 1', code: 'C1' }));
  it('getLcuListByProjectId', () => expect(mapListRow({ luid: 'U2', lcuId: 'L2', lcuName: 'Tủ' })).toEqual({ uid: 'U2', lcuId: 'L2', name: 'Tủ', code: '' }));
  it('bỏ hàng không có uid', () => { expect(mapPageRow({})).toBeNull(); expect(mapListRow({})).toBeNull(); });
  it('gộp theo uid, nguồn đầu thắng', () => {
    const r = mergeLcus([{ uid: 'U', lcuId: '1', name: 'a', code: '', projectId: 'P' }, { uid: 'U', lcuId: '2', name: 'b', code: '', projectId: 'P' }]);
    expect(r).toHaveLength(1); expect(r[0].name).toBe('a');
  });
});

describe('khác', () => {
  it('ratedPowerOf', () => { expect(ratedPowerOf({ deviceConfig: { lampPower: '100' } })).toBe(100); expect(ratedPowerOf({})).toBeUndefined(); });
  it('mapLight', () => { expect(mapLight({ dtime: 't', power: 50, powerFactor: 0.9 })).toMatchObject({ time: 't', power: 50, pf: 0.9 }); expect(mapLight(null)).toBeNull(); });
  it('toCsv escape dấu nháy và có BOM', () => { const c = toCsv(['a'], [['x"y']]); expect(c.startsWith('﻿')).toBe(true); expect(c).toContain('"x""y"'); });
});

describe('thiết bị khác', () => {
  it('mapDeviceTypes sắp theo mã, bỏ hàng thiếu mã, đặt tên mặc định', () => {
    const r = mapDeviceTypes([{ deviceTypeId: 'b', deviceTypeValue: 5, deviceTypeName: 'RTU' }, { deviceTypeId: 'a', deviceTypeValue: 2 }, { deviceTypeName: 'x' }]);
    expect(r).toEqual([{ id: 'a', value: 2, name: 'Loại 2' }, { id: 'b', value: 5, name: 'RTU' }]);
    expect(mapDeviceTypes(null)).toEqual([]);
  });
  it('mapDeviceRow đọc trường và bỏ toạ độ (0,0)', () => {
    const r = mapDeviceRow({ deviceId: 'D', uid: 'U', deviceName: 'n', deviceCode: 'c', deviceTypeValue: 3, deviceModelName: 'M', deviceStatus: 1, lat: 21, lng: 105, geographicAddress: 'addr' });
    expect(r).toMatchObject({ id: 'D', uid: 'U', typeValue: 3, model: 'M', status: 1, lat: 21, lng: 105 });
    expect(mapDeviceRow({ deviceId: 'D', lat: 0, lng: 0 })?.lat).toBeUndefined();
    expect(mapDeviceRow({})).toBeNull();
  });
});

describe('phân loại & lamp/pole', () => {
  it('categoryOf theo tên loại', () => {
    expect(categoryOf('LCU')).toBe('lcu'); expect(categoryOf('Solar LCU')).toBe('lcu'); expect(categoryOf('SmartBox')).toBe('smartbox');
    expect(categoryOf('Gateway')).toBe('gateway'); expect(categoryOf('RTU')).toBe('rtu'); expect(categoryOf('Tilt Sensor')).toBe('sensor');
    expect(categoryOf('Meter')).toBe('meter'); expect(categoryOf('Camera')).toBe('camera'); expect(categoryOf('Power Box')).toBe('other');
  });
  it('Lamps / Lamp Pole rơi vào other', () => { expect(categoryOf('Lamps')).toBe('other'); expect(categoryOf('Lamp Pole')).toBe('other'); });
});

describe('model / deviceConfig', () => {
  it('mapModels parse chuỗi JSON, hỏng thì giữ _raw, bỏ hàng thiếu id', () => {
    const r = mapModels([{ deviceModelId: 'M1', deviceModelName: 'a', deviceTypeId: 'T', deviceConfig: '{"lampPower":100}' }, { deviceModelId: 'M2', deviceConfig: 'xx' }, { deviceModelName: 'z' }]);
    expect(r).toHaveLength(2); expect(r[0].config).toEqual({ lampPower: 100 }); expect(r[1].config).toEqual({ _raw: 'xx' });
    expect(mapModels(null)).toEqual([]);
  });
  it('configEntries: bỏ rỗng, nhận diện danh sách đính kèm', () => {
    const e = configEntries({ a: null, b: '', c: [], d: 5, lamp: [{ checked: true, modelId: 'x', modelName: 'Đèn A', lampIndex: 1 }], pole: { checked: false, modelId: 'p', modelName: 'Cột' }, ext: [{ name: 'n', value: true }] });
    expect(e.map(x => x.key)).toEqual(['d', 'lamp', 'pole', 'ext']);
    expect(e[1]).toEqual({ key: 'lamp', kind: 'attached', items: [{ name: 'Đèn A', checked: true, extra: 'đèn #1' }] });
    expect(e[2]).toMatchObject({ kind: 'attached', items: [{ name: 'Cột', checked: false }] });
    expect(e[3]).toMatchObject({ kind: 'value' });
  });
});


describe('mapPoleLinks', () => {
  const names: Record<string, string> = { MLCU: 'LCU-RF', MLAMP: 'Đèn LED' };
  const nm = (id: string) => names[id] ?? '';
  it('cột có LCU: nhóm LCU + đèn theo kênh', () => {
    const rel = { deviceId: 'P1', deviceName: 'Cột 1', deviceModelName: 'Cột thép', lat: '20.9', lng: '105.6', attributeDevice: [{ checked: true, lcu: { deviceId: 'L1', uid: 'U1', lampHolderNum: 1, deviceModelId: 'MLCU' }, lamp: [{ lampNum: 1, deviceId: 'D1', deviceName: 'Đèn 1', deviceModelId: 'MLAMP' }] }] };
    const r = mapPoleLinks(rel, { lamp: [{ lampId: 'D1', deviceModelName: 'Đèn đường phố' }], camera: [] }, nm);
    expect(r.pole).toMatchObject({ id: 'P1', name: 'Cột 1', lat: 20.9 });
    expect(r.groups).toEqual([{ lcu: { id: 'L1', uid: 'U1', slots: 1, model: 'LCU-RF' }, lamps: [{ id: 'D1', name: 'Đèn 1', channel: 1, model: 'Đèn đường phố', checked: true }] }]);
    expect(r.others).toEqual([]);
  });
  it('cột không LCU: mỗi đèn một nhóm, không có lcu; thiết bị khác gom theo loại', () => {
    const rel = { attributeDevice: [{ lcu: {}, lamp: [{ lampNum: 1, deviceId: 'D2', deviceName: 'Đèn 2', deviceModelId: 'MLAMP' }] }, { lcu: {}, lamp: [{ lampNum: 1, deviceId: 'D3', deviceName: 'Đèn 3', deviceModelId: 'MLAMP' }] }] };
    const r = mapPoleLinks(rel, { camera: [{ deviceName: 'Cam 1' }], wifi: [], lcu: [{ x: 1 }] }, nm);
    expect(r.groups).toHaveLength(2); expect(r.groups[0].lcu).toBeUndefined(); expect(r.groups[0].lamps[0].model).toBe('Đèn LED');
    expect(r.others).toEqual([{ kind: 'camera', items: [{ name: 'Cam 1' }] }]);
  });
  it('dữ liệu rỗng không lỗi', () => expect(mapPoleLinks(null, null, nm).groups).toEqual([]));
});

describe('LCU nhiều đèn', () => {
  it('mapLcuLamps sắp theo kênh, bỏ phần tử không có lampId', () => {
    const r = mapLcuLamps([{ lampId: 'B', channel: 2, deviceName: 'Đèn 2', deviceModelId: 'MLAMP' }, { lampId: 'A', channel: 1, deviceName: 'Đèn 1' }, { channel: 3 }], id => (id === 'MLAMP' ? 'Đèn LED' : ''));
    expect(r.map(l => [l.id, l.channel, l.model])).toEqual([['A', 1, ''], ['B', 2, 'Đèn LED']]); expect(mapLcuLamps(null, () => '')).toEqual([]);
  });
  it('số đầu đèn lấy max(tham chiếu LCU, model LCU); lamp có cờ checked', () => {
    const rel = { attributeDevice: [{ lcu: { deviceId: 'L', uid: 'U', lampHolderNum: 1, deviceModelId: 'MLCU' }, lamp: [{ lampNum: 1, deviceId: 'D1', checked: true }, { lampNum: 2, deviceId: 'D2', checked: false }] }] };
    const r = mapPoleLinks(rel, null, () => '', id => (id === 'MLCU' ? 4 : undefined));
    expect(r.groups[0].lcu?.slots).toBe(4); expect(r.groups[0].lamps.map(l => l.checked)).toEqual([true, false]);
  });
});

describe('số kênh và hàng kênh của LCU', () => {
  it('lcuSlotCount: lấy lớn nhất của tham chiếu, model, kênh cao nhất; tối thiểu 1', () => {
    expect(lcuSlotCount(1, 4, [1, 3])).toBe(4);      // tham chiếu ghi 1 nhưng model có 4 đầu đèn (đúng ca LCU nhiều đèn)
    expect(lcuSlotCount(1, 1, [1, 6])).toBe(6);      // có đèn ở kênh 6 dù model/tham chiếu nhỏ hơn
    expect(lcuSlotCount(2, undefined, [])).toBe(2);
    expect(lcuSlotCount(undefined, undefined, [])).toBe(1);
    expect(lcuSlotCount(0, 0, [NaN])).toBe(1);
  });
  it('channelRows: đủ 1..N, kênh trống là [], nhiều đèn cùng kênh giữ hết, đèn kênh ngoài phạm vi không mất khi slots đã tính đủ', () => {
    const lamps = [{ channel: 1, n: 'a' }, { channel: 3, n: 'c' }, { channel: 3, n: 'c2' }];
    const rows = channelRows(lcuSlotCount(1, 4, lamps.map(l => l.channel)), lamps);
    expect(rows.map(r => r.channel)).toEqual([1, 2, 3, 4]);
    expect(rows.map(r => r.lamps.length)).toEqual([1, 0, 2, 0]);
    expect(rows.flatMap(r => r.lamps)).toHaveLength(lamps.length);
  });
});

describe('lcuSpec', () => {
  it('đọc số đầu đèn và cờ chức năng (dữ liệu model LCU-RF-HAPU / LCU-D-light thật)', () => {
    const rf = lcuSpec({ lampHolderNum: 1, lcuType: 1, loopType: 1, dimmingLevel: 20, currentsNum: 6, tempsNum: 6, functionList: [1, 2, 3], extensions: [{ label: 'lcuTask', value: true }, { label: 'lightOperated', value: false }, { label: 'poleSlant', value: false }] });
    expect(rf).toEqual({ slots: 1, lcuType: 1, loopType: 1, dimming: '20', currents: 6, temps: 6, flagsOn: ['lcuTask'], flagsOff: ['lightOperated', 'poleSlant'], functions: [1, 2, 3] });
    const d = lcuSpec({ lampHolderNum: 1, lcuType: null, dimmingLevel: '100', functionList: [1, 2, 3, 4], extensions: [] });
    expect(d).toMatchObject({ slots: 1, lcuType: undefined, dimming: '100', functions: [1, 2, 3, 4], flagsOn: [] });
  });
  it('thiếu lampHolderNum → 1 đầu đèn', () => expect(lcuSpec({}).slots).toBe(1));
});

describe('mapPoleTypes', () => {
  it('nhận cả mảng lẫn records, bỏ hàng thiếu id', () => {
    const row = { poleTypeId: 'P1', poleTypeName: 'Single arm lamp', poleTypeValue: 1, systemConfig: 1, remark: 'r' };
    expect(mapPoleTypes([row, { poleTypeName: 'x' }])).toEqual([{ id: 'P1', name: 'Single arm lamp', value: 1, systemConfig: 1, remark: 'r' }]);
    expect(mapPoleTypes({ records: [row] })).toHaveLength(1);
    expect(mapPoleTypes(null)).toEqual([]);
  });
});
