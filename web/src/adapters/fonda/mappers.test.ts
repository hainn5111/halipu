import { describe, expect, it } from 'vitest';
import { mapLight, mapListRow, mapPageRow, mapTrend, mergeLcus, pickGeo, ratedPowerOf, toCsv, validGeo } from './mappers';

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
