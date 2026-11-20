import { describe, expect, it } from 'vitest';
import { fieldItems, enumLabel, enumOptions, functionLabels, isRelevantKey, storeValue, TYPE_ENUMS } from './enums';

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
    const f = TYPE_ENUMS[9][0]; expect(fieldItems(f, {}).map(i => i.name)).toEqual(['XY…', 'KXHL']); expect(enumLabel(f, '2', fieldItems(f, {}))).toBe('KXHL');
  });
  it('storeValue + functionLabels', () => {
    expect(storeValue('20')).toBe(20); expect(storeValue('abc')).toBe('abc'); expect(storeValue('')).toBe('');
    expect(functionLabels([1, 7], [{ value: '1', name: 'Turn On' }])).toEqual(['Turn On', '#7']); expect(functionLabels(null, [])).toEqual([]);
  });
});
