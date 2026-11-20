import { describe, expect, it } from 'vitest';
import { frontScanScript, scanFrontend } from './frontScan';

describe('scanFrontend', () => {
  it('đếm từ khoá trong file JS của trang và lấy đoạn quanh nó', async () => {
    const files: Record<string, string> = { 'http://f/a.js': 'var o=[{value:"1",label:"XY"},{value:"2",label:"KXHL"}];kmFactory', 'http://f/b.json': '{"x":1}' };
    const clicks: string[] = [];
    const doc = { scripts: [{ src: 'http://f/a.js' }], createElement: () => ({ click() { clicks.push('dl'); }, set href(_v: string) { /* */ }, set download(v: string) { clicks.push(v); } }) };
    const g: any = globalThis; g.URL.createObjectURL = () => 'blob:x'; g.URL.revokeObjectURL = () => undefined;
    const win = { document: doc, location: { origin: 'http://f' }, console: { log() { /* */ } }, performance: { getEntriesByType: () => [{ name: 'http://f/b.json' }, { name: 'http://other/c.js' }] },
      fetch: async (u: string) => ({ text: async () => files[u] ?? '' }) };
    const out = await scanFrontend(win);
    expect(out.keys.KXHL.total).toBe(1); expect(out.keys.KXHL.samples[0]).toContain('XY'); expect(out.keys.kmFactory.total).toBe(1); expect(out.keys.powerProtocol.total).toBe(0);
    expect(out.files.map((f: { url: string }) => f.url).sort()).toEqual(['http://f/a.js', 'http://f/b.json']);   // file ngoài origin bị bỏ qua
    expect(clicks.some(c => c.startsWith('fonda-frontend-scan-'))).toBe(true);
  });
  it('script tự chứa, không tham chiếu biến ngoài', () => { expect(frontScanScript()).toMatch(/^\(.*scanFrontend|^\(function|^\(.*=>/s); expect(frontScanScript().endsWith('(window);')).toBe(true); });
});
