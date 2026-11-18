import { describe, expect, it } from 'vitest';
import { mergeConfig, wsUrlOf } from './config';

describe('config', () => {
  it('bỏ dấu / cuối apiBase và dùng mặc định khi thiếu', () => {
    expect(mergeConfig({ apiBase: 'http://h:18080//' }).apiBase).toBe('http://h:18080');
    expect(mergeConfig(null)).toEqual({ apiBase: '', wsUrl: '', projectId: '', rsaPublicKey: '' });
  });
  it('wsUrl suy ra từ apiBase (cổng 81, /clesws)', () => expect(wsUrlOf(mergeConfig({ apiBase: 'http://159.138.45.45:18080' }))).toBe('ws://159.138.45.45:81/clesws'));
  it('wsUrl cấu hình rõ thì dùng nguyên', () => expect(wsUrlOf(mergeConfig({ apiBase: '/fonda', wsUrl: 'wss://x/ws' }))).toBe('wss://x/ws'));
});
