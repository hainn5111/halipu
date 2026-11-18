import { describe, expect, it } from 'vitest';
import { applyEvent } from './liveState';

describe('applyEvent', () => {
  it('gộp trạng thái đèn theo lcuId/kênh và không sửa object cũ', () => {
    const a = applyEvent({}, { kind: 'status', lcuId: 'L1', lamps: [{ num: 1, dim: 50, on: true }] }, 1);
    const b = applyEvent(a, { kind: 'status', lcuId: 'L1', lamps: [{ num: 2, dim: 0, on: false }, { num: 1, dim: 80, on: true }] }, 2);
    expect(b.L1.lamps[1]).toMatchObject({ dim: 80, at: 2 }); expect(b.L1.lamps[2]).toMatchObject({ on: false });
    expect(a.L1.lamps[1].dim).toBe(50);   // bản cũ giữ nguyên
  });
  it('số đo và phản hồi lệnh ở nhánh riêng', () => {
    let s = applyEvent({}, { kind: 'data', lcuId: 'L1', data: [{ num: 1, power: 67 }] }, 5);
    s = applyEvent(s, { kind: 'unicast', lcuId: 'L1', text: 'ok' }, 6);
    expect(s.L1.data[1].power).toBe(67); expect(s.L1.unicast).toEqual({ text: 'ok', at: 6 });
  });
  it('LCU khác nhau không lẫn', () => {
    const s = applyEvent(applyEvent({}, { kind: 'unicast', lcuId: 'A', text: 'x' }), { kind: 'unicast', lcuId: 'B', text: 'y' });
    expect(Object.keys(s).sort()).toEqual(['A', 'B']);
  });
});
