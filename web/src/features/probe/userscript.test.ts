import { describe, expect, it } from 'vitest';
import { userScript } from './userscript';

describe('userScript (Tampermonkey)', () => {
  const src = userScript('2026.11.25', 'http://h:81/*');
  it('có header đúng: chạy ở document-start, trang Fonda, không sandbox', () => {
    expect(src.startsWith('// ==UserScript==')).toBe(true);
    expect(src).toContain('// @run-at       document-start'); expect(src).toContain('// @grant        none'); expect(src).toContain('// @match        http://h:81/*'); expect(src).toContain('// @version      2026.11.25');
  });
  it('cú pháp hợp lệ và có đủ 3 công cụ', () => {
    expect(() => new Function(src)).not.toThrow();
    expect(src).toContain('window.__scanFrontend'); expect(src).toContain('window.__scanForms'); expect(src).toContain('installCapture(window)');
  });
});
