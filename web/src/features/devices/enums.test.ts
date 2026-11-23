import { describe, expect, it } from 'vitest';
import { dictKeysOfType, filterProtocols, PRODUCER_DICTS, allowedOptions, ENUM_BY_PROTOCOL, poleShapeItems, fieldItems, enumLabel, enumOptions, functionLabels, isRelevantKey, storeValue, TYPE_ENUMS } from './enums';

const dim = [{ value: '1', name: '20' }, { value: '2', name: '100' }];
describe('enums', () => {
  it('ẩn khoá của loại khác (rtuType ở LCU, gatewayTypes ngoài Gateway…)', () => {
    expect(isRelevantKey(2, 'rtuType')).toBe(false); expect(isRelevantKey(4, 'rtuType')).toBe(true);
    expect(isRelevantKey(5, 'gatewayTypes')).toBe(false); expect(isRelevantKey(3, 'gatewayTypes')).toBe(true);
    expect(isRelevantKey(2, 'lampHolderNum')).toBe(true);   // khoá không có chủ: luôn hiện
    expect(isRelevantKey(6, 'poleTypeId')).toBe(true); expect(isRelevantKey(5, 'poleTypeId')).toBe(false);
    expect(isRelevantKey(9, 'kmFactory')).toBe(true); expect(isRelevantKey(1, 'kmFactory')).toBe(false);
  });
  it('dimmingLevel lưu theo TÊN (20/100), nhãn tra theo tên', () => {
    const f = TYPE_ENUMS[2][0];
    expect(enumOptions(f, dim)).toEqual([{ value: '20', name: '20' }, { value: '100', name: '100' }]);
    expect(enumLabel(f, 100, dim)).toBe('100'); expect(enumLabel(f, '20', dim)).toBe('20'); expect(enumLabel(f, 7, dim)).toBe('');
  });
  it('enum theo dictValue (meterType)', () => {
    const f = TYPE_ENUMS[1][1], items = [{ value: '3', name: '3-Channel 1-Phase Electric Meter' }];
    expect(enumLabel(f, 3, items)).toBe('3-Channel 1-Phase Electric Meter'); expect(enumOptions(f, items)[0].value).toBe('3');
  });
  it('Producer của Switch là danh sách cố định', () => {
    const f = TYPE_ENUMS[9][0]; expect(fieldItems(f, {}).map(i => i.name)).toEqual(['XY', 'KXHL']); expect(enumLabel(f, '2', fieldItems(f, {}))).toBe('KXHL');
  });
  it('poleTypeValue chỉ lấy từ loại cột hệ thống', () => {
    const types = [{ value: 3, name: '789412', systemConfig: 0 }, { value: 8, name: 'Three-Arm Lamp', systemConfig: 1 }, { value: 1, name: 'Single arm lamp', systemConfig: 1 }, { value: 1, name: 'COT8M', systemConfig: 0 }];
    expect(poleShapeItems(types)).toEqual([{ value: '1', name: 'Single arm lamp' }, { value: '8', name: 'Three-Arm Lamp' }]);
  });
  it('powerProtocol thuộc Lamps, hai lựa chọn', () => { expect(isRelevantKey(5, 'powerProtocol')).toBe(true); expect(isRelevantKey(6, 'powerProtocol')).toBe(false); expect(TYPE_ENUMS[5].find(f => f.key === 'powerProtocol')?.items).toHaveLength(2); });
  it('allowedOptions theo giao thức (mã giao diện Fonda)', () => {
    const rtu = ['1', '2', '3', '4', '5'].map(v => ({ value: v, name: `RTU${v}` }));
    expect(allowedOptions(4, 56, rtu).map(o => o.value)).toEqual(['3', '4']);
    expect(allowedOptions(4, 1, rtu).map(o => o.value)).toEqual(['1', '2', '5']); expect(allowedOptions(4, 58, rtu).map(o => o.value)).toEqual(['1', '2', '5']);
    expect(allowedOptions(4, undefined, rtu).map(o => o.value)).toEqual(['1', '2', '5']);
    const gw = [{ value: '1', name: 'RTU500' }, { value: '2', name: 'RTU500LD' }];
    expect(allowedOptions(3, 12, gw)).toEqual(gw); expect(allowedOptions(3, 1, gw)).toEqual([gw[0]]);
    expect(allowedOptions(2, 53, gw)).toEqual(gw);   // loại khác: không lọc
    expect(Object.keys(ENUM_BY_PROTOCOL)).toEqual(['3', '4']);
  });
  it('Producer theo loại: dictionary riêng, lưu dictStairId; loại 60 cứng HNJD/SRNE', () => {
    expect(PRODUCER_DICTS[18]).toBe(90); expect(dictKeysOfType(18)).toEqual([90]); expect(dictKeysOfType(60)).toEqual([]);
    const f = TYPE_ENUMS[18].find(x => x.key === 'factoryId')!; const items = [{ value: '1', name: 'Hikvision', stairId: 'S1' }];
    expect(enumOptions(f, items)).toEqual([{ value: 'S1', name: 'Hikvision' }]); expect(enumLabel(f, 'S1', items)).toBe('Hikvision');
    const f60 = TYPE_ENUMS[60].find(x => x.key === 'factoryId')!; expect(fieldItems(f60, {}).map(i => i.name)).toEqual(['HNJD', 'SRNE']);
    expect(dictKeysOfType(14)).toEqual([103]); expect(dictKeysOfType(32)).toEqual([101]);
  });
  it('filterProtocols bỏ giao thức Fonda ẩn; LCU bỏ passthrough', () => {
    const l = [{ name: 'RF/F2' }, { name: 'YM/AEP' }, { name: 'LORA passthrough' }, { name: 'Lighting/EXC' }];
    expect(filterProtocols(2, l).map(p => p.name)).toEqual(['RF/F2']); expect(filterProtocols(3, l).map(p => p.name)).toEqual(['RF/F2', 'LORA passthrough']);
  });
  it('storeValue + functionLabels', () => {
    expect(storeValue('20')).toBe(20); expect(storeValue('abc')).toBe('abc'); expect(storeValue('')).toBe('');
    expect(functionLabels([1, 7], [{ value: '1', name: 'Turn On' }])).toEqual(['Turn On', '#7']); expect(functionLabels(null, [])).toEqual([]);
  });
});
