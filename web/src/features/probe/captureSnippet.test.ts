import { describe, expect, it } from 'vitest';
import { captureScript, installCapture } from './captureSnippet';

// Giả lập tối thiểu XMLHttpRequest để kiểm tra việc ghi/che khoá, không cần trình duyệt.
function fakeWin() {
  const listeners: Array<() => void> = [];
  class XHR {
    status = 200; responseText = ''; private l: Array<() => void> = [];
    open(_m: string, _u: string) { /* no-op */ }
    send(_b: unknown) { /* no-op */ }
    addEventListener(_e: string, fn: () => void) { this.l.push(fn); }
    fire() { this.l.forEach(f => f()); }
  }
  void listeners;
  return { XMLHttpRequest: XHR, document: null } as never as { XMLHttpRequest: typeof XHR; document: null; __capture?: ReturnType<typeof installCapture> };
}

describe('installCapture', () => {
  it('ghi request ghi, che khoá bí mật, bỏ qua login, phân loại write', () => {
    const w = fakeWin(); const cap = installCapture(w);
    const call = (method: string, url: string, body: unknown, resp: unknown) => { const x = new w.XMLHttpRequest(); x.open(method, url); x.responseText = JSON.stringify(resp); x.send(JSON.stringify(body)); x.fire(); };
    call('POST', 'http://h/api/v1.0/lcuActor/bindPole?lang=en', { lcuId: 'L', poleId: 'P', password: 'x', token: 't' }, { code: 200, message: 'ok', data: { a: 1 } });
    call('POST', 'http://h/api/v1.0/device/queryDevicePage', { current: 1 }, { code: 200, data: { records: [] } });
    call('POST', 'http://h/api/login', { username: 'u', password: 'p' }, { code: 200 });
    expect(cap.log).toHaveLength(2);
    expect(cap.log[0]).toMatchObject({ method: 'POST', path: 'lcuActor/bindPole', write: true, code: 200, body: { lcuId: 'L', poleId: 'P', password: '<redacted>', token: '<redacted>' } });
    expect(cap.log[1]).toMatchObject({ path: 'device/queryDevicePage', write: false });
  });
  it('cài lần hai trả về cùng đối tượng', () => { const w = fakeWin(); expect(installCapture(w)).toBe(installCapture(w)); });
  it('captureScript là biểu thức tự gọi, không còn kiểu TypeScript', () => { const s = captureScript(); expect(s.startsWith('(')).toBe(true); expect(s.endsWith(')(window);')).toBe(true); expect(() => new Function(s)).not.toThrow(); });
});
