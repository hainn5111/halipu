import { describe, expect, it } from 'vitest';
import { requiredErrors, visibleFields } from './templateSchema';

const keys = (type: number, protocol?: number, extra: object = {}) => visibleFields({ type, protocol, ...extra }).map(f => f.key);
describe('templateSchema (điều kiện hiện ô theo loại, từ mã Fonda)', () => {
  it('Lamps (5): đủ nhóm thông số, có powerProtocol; Solar (65) không có powerTypes/powerProtocol', () => {
    expect(keys(5)).toEqual(expect.arrayContaining(['lampTypes', 'powerTypes', 'powerProtocol', 'lampLifetime', 'nominalPower', 'lampPower', 'ratedApparentPower', 'nominalCurrent', 'ratedCurrent', 'ratedVoltage', 'ratedPowerFactor']));
    expect(keys(65)).toEqual(['lampTypes', 'lampLifetime', 'nominalPower', 'nominalCurrent']);
  });
  it('LCU (2) phụ thuộc giao thức', () => {
    expect(keys(2, 53)).toEqual(expect.arrayContaining(['lcuType', 'lampHolderNum', 'dimmingLevel', 'loopType']));
    expect(keys(2, 9)).not.toContain('lcuType'); expect(keys(2, 9)).not.toContain('loopType');
    expect(keys(2, 3)).toContain('bandName'); expect(keys(2, 3, { lcuCtype: 2 })).not.toContain('bandName');
    expect(keys(2, 25)).toContain('productId');
  });
  it('Gateway 3 / Concentrator 4 / Lamp Pole 6 / Meter 1 / Switch 9', () => {
    expect(keys(3)).toEqual(['gatewayTypes']); expect(keys(4)).toEqual(['rtuType']); expect(keys(6)).toEqual(['poleTypeId', 'poleArmType']);
    expect(keys(1)).toEqual(['voltageP', 'currentP', 'meterType']); expect(keys(9)).toEqual(['pathNum', 'di', 'ai', 'kmFactory']);
  });
  it('requiredErrors: chỉ trường đang hiện và bắt buộc', () => {
    expect(requiredErrors({ type: 3 }, { gatewayTypes: '' })).toHaveLength(1); expect(requiredErrors({ type: 3 }, { gatewayTypes: 1 })).toEqual([]);
    expect(requiredErrors({ type: 6 }, { poleTypeId: 'x' })).toEqual([]);   // poleArmType không bắt buộc
    expect(requiredErrors({ type: 9 }, { pathNum: 4, kmFactory: '1' })).toEqual([]); expect(requiredErrors({ type: 9 }, { pathNum: '', kmFactory: '1' })).toHaveLength(1);
    expect(requiredErrors({ type: 99 }, {})).toEqual([]);   // loại không có ô riêng
  });
});
