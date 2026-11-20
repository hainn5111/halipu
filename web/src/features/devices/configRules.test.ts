import { describe, expect, it } from 'vitest';
import { configErrors } from './configRules';

describe('configErrors (luật form template Fonda)', () => {
  it('mặc định của Fonda hợp lệ', () => {
    const d = { lampLifetime: 6000, nominalPower: 110, lampPower: 88, ratedApparentPower: 112, nominalCurrent: 0.4, ratedCurrent: 0.4, ratedVoltage: 220, ratedPowerFactor: 0.99, taskNum: 10, voltageP: '', di: '', ai: '', power: '' };
    expect(configErrors(5, 'TEST', d)).toEqual([]);
  });
  it('khoảng giá trị', () => {
    expect(configErrors(9, 'x', { pathNum: 300 })[0]).toContain('pathNum');
    expect(configErrors(9, 'x', { pathNum: 0 })).toHaveLength(1); expect(configErrors(9, 'x', { pathNum: 123 })).toEqual([]);
    expect(configErrors(1, 'x', { voltageP: 256 })).toHaveLength(1);
    expect(configErrors(5, 'x', { ratedPowerFactor: 0 })).toHaveLength(1); expect(configErrors(5, 'x', { ratedPowerFactor: 1.1 })).toHaveLength(1);
    expect(configErrors(5, 'x', { nominalCurrent: 10, ratedCurrent: 10 })).toEqual([]);
    expect(configErrors(2, 'x', { taskNum: 1.5 })).toHaveLength(1); expect(configErrors(2, 'x', { taskNum: '7' })).toEqual([]);
    expect(configErrors(2, 'x', { lampLifetime: 'abc' })).toHaveLength(1);
  });
  it('tên tối đa 48; Lamps: lampPower ≤ nominalPower, ratedCurrent ≤ nominalCurrent', () => {
    expect(configErrors(2, 'a'.repeat(49), {})).toHaveLength(1);
    expect(configErrors(5, 'x', { lampPower: 120, nominalPower: 110 })).toHaveLength(1);
    expect(configErrors(5, 'x', { ratedCurrent: 0.5, nominalCurrent: 0.4 })).toHaveLength(1);
    expect(configErrors(2, 'x', { lampPower: 120, nominalPower: 110 })).toEqual([]);   // chỉ áp dụng cho Lamps
  });
});
