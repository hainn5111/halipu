import { describe, expect, it } from 'vitest';
import { linkPaths, shape, trim } from './probeUtil';

describe('probe helpers', () => {
  it('trim giữ 3 phần tử đầu của mảng', () => expect(trim({ a: [1, 2, 3, 4], b: { c: [{ x: 1 }, 2, 3, 4] } })).toEqual({ a: [1, 2, 3], b: { c: [{ x: 1 }, 2, 3] } }));
  it('shape chỉ in đường dẫn + kiểu, không in giá trị', () => {
    const s = shape({ a: 'secret', b: [{ c: 1 }], d: null });
    expect(s).toEqual(expect.arrayContaining(['a: string', 'b[]: array(1)', 'b[].c: number', 'd: null']));
    expect(s.join()).not.toContain('secret');
  });
  it('linkPaths tìm trường trỏ tới model', () => {
    const m = new Map([['M1', { name: 'Đèn A', type: 'Lamps' }]]);
    expect(linkPaths({ deviceModelId: 'M1', lamp: [{ deviceModelId: 'M1' }, { x: 'khác' }] }, m)).toEqual(['deviceModelId → model "Đèn A" (loại Lamps)', 'lamp[].deviceModelId → model "Đèn A" (loại Lamps)']);
  });
});
