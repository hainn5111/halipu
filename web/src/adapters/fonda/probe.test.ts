import { describe, expect, it } from 'vitest';
import { linkPaths, probeFileName, shape, trim } from './probeUtil';

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

import { relationScan } from './probeUtil';
describe('relationScan', () => {
  it('tìm trường trỏ tới loại khác theo deviceId/uid và liệt kê enum', () => {
    const out = relationScan({
      'Lamp Pole': [{ deviceId: 'P1', deviceName: 'Cột 1' }, { deviceId: 'P2', deviceName: 'Cột 2' }],
      LCU: [{ deviceId: 'L1', uid: 'U1', poleId: 'P1' }],
      Lamps: [{ deviceId: 'D1', poleId: 'P1', luid: 'U1', bindLcu: 1 }, { deviceId: 'D2', poleId: 'P2', luid: null, bindLcu: 2 }],
    });
    expect(out).toContain('  poleId → Lamp Pole (1/1 bản ghi)');
    expect(out).toContain('  poleId → Lamp Pole (2/2 bản ghi)');
    expect(out).toContain('  luid → LCU (1/2 bản ghi)');
    expect(out.some(l => l.startsWith('  bindLcu: 1×1, 2×1'))).toBe(true);
    expect(out.join('\n')).not.toContain('P1');
  });
});

describe('probeFileName', () => {
  it('định dạng device-probe-YYYYMMDD-HHMMSS.json, đệm số 0', () => {
    expect(probeFileName(new Date(2026, 10, 19, 9, 40, 5))).toBe('device-probe-20261119-094005.json');
    expect(probeFileName(new Date(2026, 0, 2, 15, 9, 0))).toBe('device-probe-20260102-150900.json');
  });
});
