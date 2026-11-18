import { describe, expect, it } from 'vitest';
import { frameKey, loginVariants, parseFrame, sessionReply } from './realtime';

const wrap = (cmd: string, ctrl: string, data: unknown) => ({ code: 200, data: { cmd, ctrl, data } });

describe('parseFrame', () => {
  it('lampControl/status → trạng thái từng kênh', () => {
    const ev = parseFrame(wrap('lampControl', 'status', [{ deviceId: 'L1', lampStatus: [{ num: 1, dimming: 50, ls: 1 }, { num: 2, dimming: 0, ls: 0 }] }]));
    expect(ev).toEqual([{ kind: 'status', lcuId: 'L1', lamps: [{ num: 1, dim: 50, on: true }, { num: 2, dim: 0, on: false }] }]);
  });
  it('lampControl/data → số đo điện', () => {
    const ev = parseFrame(wrap('lampControl', 'data', [{ deviceId: 'L1', lcuData: [{ num: 1, power: 67, voltage: 230, powerFactor: 0.97, dtime: '2026-11-18 10:00:00' }] }]));
    expect(ev[0]).toMatchObject({ kind: 'data', lcuId: 'L1' });
    expect((ev[0] as { data: Array<{ power?: number; pf?: number; time?: string }> }).data[0]).toMatchObject({ power: 67, pf: 0.97, time: '2026-11-18 10:00:00' });
  });
  it('lampControl/unicastStatus → phản hồi lệnh', () => {
    const ev = parseFrame(wrap('lampControl', 'unicastStatus', { lcuId: 'L9', result: 'ok' }));
    expect(ev).toHaveLength(1); expect(ev[0]).toMatchObject({ kind: 'unicast', lcuId: 'L9' });
  });
  it('một khung nhiều thiết bị → nhiều sự kiện', () => {
    const ev = parseFrame(wrap('lampControl', 'status', [{ deviceId: 'A', lampStatus: [] }, { deviceId: 'B', lampStatus: [] }]));
    expect(ev.map(e => e.lcuId)).toEqual(['A', 'B']);
  });
  it('khung khác loại / sai dạng → rỗng', () => {
    expect(parseFrame(wrap('lcu', 'status', [{ deviceId: 'L1' }]))).toEqual([]);
    expect(parseFrame(null)).toEqual([]); expect(parseFrame('x')).toEqual([]);
    expect(parseFrame(wrap('lampControl', 'status', [{ lampStatus: [] }]))).toEqual([]);   // thiếu deviceId
  });
});

describe('khung & đăng nhập', () => {
  it('frameKey', () => { expect(frameKey(wrap('lampControl', 'data', []))).toBe('lampControl/data'); expect(frameKey({ cmd: 'session', ctrl: 'login' })).toBe('session/login'); expect(frameKey({ x: 1 })).toBe('khác'); });
  it('6 dạng khung đăng nhập, dạng #4 bỏ tiền tố Bearer', () => {
    const v = loginVariants('Bearer abc', 'u'); expect(v).toHaveLength(6); expect(v[3].Authorization).toBe('abc'); expect(v[4].userAccount).toBe('u');
  });
  it('sessionReply', () => {
    expect(sessionReply({ code: 200, data: { cmd: 'session', ctrl: 'login' } })).toBe('logged-in');
    expect(sessionReply({ code: 401 })).toBe('unauthorized'); expect(sessionReply({ code: 200 })).toBe('other');
  });
});
