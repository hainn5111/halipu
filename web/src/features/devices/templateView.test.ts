import { describe, expect, it } from 'vitest';
import { detailRows } from './templateView';

const dicts = { 3: [{ value: '4', name: 'Led Lamp' }], 17: [{ value: '3', name: 'Constant Current Drive Power' }], 119: [{ value: '1', name: 'RTU500' }] };
describe('detailRows', () => {
  it('Lamps: chỉ ô của form, kèm tên enum, không có khoá của loại khác', () => {
    const r = detailRows({ type: 5, config: { lampTypes: 4, powerTypes: 3, powerProtocol: 1, lampLifetime: 50000, rtuType: 0, gatewayTypes: '', taskNum: 10 }, dicts, poleTypes: [] });
    const m = Object.fromEntries(r.map(x => [x.key, x.value]));
    expect(m.lampTypes).toBe('4 — Led Lamp'); expect(m.powerTypes).toBe('3 — Constant Current Drive Power'); expect(m.powerProtocol).toBe('1 — D4I'); expect(m.lampLifetime).toBe('50000');
    expect(m.nominalPower).toBe('–');   // ô hiện nhưng chưa có giá trị
    expect(Object.keys(m)).not.toContain('rtuType'); expect(Object.keys(m)).not.toContain('taskNum');
  });
  it('Gateway có giao thức: hàng giao thức + functionList + gatewayTypes', () => {
    const r = detailRows({ type: 3, protocol: { name: 'Gateway/FEMS', version: 'FEMS v1.0', value: 1 }, config: { gatewayTypes: 1, functionList: [1, 2, 3] }, dicts, poleTypes: [] });
    expect(r.map(x => x.key)).toEqual(['protocol', 'functionList', 'gatewayTypes']);
    expect(r[0].value).toBe('Gateway/FEMS FEMS v1.0'); expect(r[1].value).toBe('[1,2,3]'); expect(r[2].value).toBe('1 — RTU500');
  });
  it('Lamp Pole: loại cột hiện tên', () => {
    const r = detailRows({ type: 6, config: { poleTypeId: 'P1', poleArmType: 1 }, dicts: { 55: [{ value: '1', name: 'Willow leaf' }] }, poleTypes: [{ id: 'P1', name: 'COT8M' }] });
    expect(r.find(x => x.key === 'poleTypeId')?.value).toBe('COT8M'); expect(r.find(x => x.key === 'poleArmType')?.value).toBe('1 — Willow leaf');
  });
  it('loại không có ô riêng → rỗng', () => { expect(detailRows({ type: 99, config: { a: 1 }, dicts, poleTypes: [] })).toEqual([]); });
});
