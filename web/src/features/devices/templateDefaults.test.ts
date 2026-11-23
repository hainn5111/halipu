import { describe, expect, it } from 'vitest';
import { FONDA_DEFAULTS, initialConfig } from './templateDefaults';

describe('initialConfig', () => {
  it('LCU hệ thống (0,0…): ô đèn lấy mặc định Fonda, ô LCU giữ giá trị mẫu, khoá thêm giữ nguyên', () => {
    const base = { lampLifetime: 0, lampPower: 0, ratedCurrent: 0, nominalPower: 0, dimmingLevel: '100', lampHolderNum: 3, lcuType: 1, functionList: [1, 2, 3, 4], extensions: [{ label: 'lcuTask', value: true }] };
    const c = initialConfig(2, base);
    expect(c.lampLifetime).toBe(6000); expect(c.lampPower).toBe(88); expect(c.ratedCurrent).toBe(0.4); expect(c.nominalPower).toBe(110);
    expect(c.dimmingLevel).toBe('100'); expect(c.lampHolderNum).toBe(3); expect(c.lcuType).toBe(1);   // ô thuộc LCU giữ giá trị mẫu (lcuType hiện ở một số giao thức)
    expect(c.functionList).toEqual([1, 2, 3, 4]); expect(c.extensions).toHaveLength(1);
    expect(Object.keys(c).slice(0, Object.keys(FONDA_DEFAULTS).length)).toEqual(Object.keys(FONDA_DEFAULTS));   // đủ cả bộ như Fonda
  });
  it('Lamps giữ giá trị riêng của mẫu; ô rỗng dùng mặc định', () => {
    const c = initialConfig(5, { lampLifetime: 50000, lampPower: 40, nominalPower: '', lampTypes: 4 });
    expect(c.lampLifetime).toBe(50000); expect(c.lampPower).toBe(40); expect(c.nominalPower).toBe(110); expect(c.lampTypes).toBe(4);
  });
  it('rtuType rác ở LCU → mặc định rỗng; Concentrator giữ rtuType', () => {
    expect(initialConfig(2, { rtuType: 0 }).rtuType).toBe(''); expect(initialConfig(4, { rtuType: 1 }).rtuType).toBe(1);
  });
});
