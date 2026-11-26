import { describe, expect, it } from 'vitest';
import { mergeConfig, wsUrlOf } from './config';

describe('config', () => {
  it('bỏ dấu / cuối apiBase và dùng mặc định khi thiếu', () => {
    expect(mergeConfig({ apiBase: 'http://h:18080//' }).apiBase).toBe('http://h:18080');
    expect(mergeConfig(null)).toEqual({ apiBase: '', wsUrl: '', projectId: '', rsaPublicKey: '', mapTileUrl: '', mapAttribution: '', mapSubdomains: '' });
  });
  it('wsUrl suy ra từ apiBase (cổng 81, /clesws)', () => expect(wsUrlOf(mergeConfig({ apiBase: 'http://159.138.45.45:18080' }))).toBe('ws://159.138.45.45:81/clesws'));
  it('wsUrl cấu hình rõ thì dùng nguyên', () => expect(wsUrlOf(mergeConfig({ apiBase: '/fonda', wsUrl: 'wss://x/ws' }))).toBe('wss://x/ws'));
  it('nguồn ô bản đồ: mặc định CARTO, config.json ghi đè được', async () => {
    const { tileOptions, DEFAULT_TILES } = await import('./tileOptions');
    expect(tileOptions(mergeConfig(null)).url).toBe(DEFAULT_TILES.url);
    const o = tileOptions(mergeConfig({ mapTileUrl: 'https://t/{z}/{x}/{y}.png', mapAttribution: 'X', mapSubdomains: 'abc' }));
    expect(o).toEqual({ url: 'https://t/{z}/{x}/{y}.png', attribution: 'X', subdomains: 'abc' });
  });
});
