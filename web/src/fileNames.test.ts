import { describe, expect, it } from 'vitest';

// Windows/macOS không phân biệt hoa-thường: `LcuLab.tsx` và `lcuLab.ts` cùng thư mục làm `import('./LcuLab')` nạp nhầm file (không có default → trắng trang).
const files = Object.keys(import.meta.glob('./**/*.{ts,tsx,css}'));
describe('tên file', () => {
  it('không có hai file chỉ khác hoa/thường (bỏ đuôi) trong cùng thư mục', () => {
    const seen = new Map<string, string>(), clash: string[] = [];
    for (const f of files) {
      const key = f.toLowerCase().replace(/\.(test\.)?(tsx?|css)$/, (_m: string, t?: string) => (t ? '.test' : ''));
      const prev = seen.get(key); if (prev && prev !== f) clash.push(`${prev} ~ ${f}`);
      seen.set(key, f);
    }
    expect(files.length).toBeGreaterThan(10);
    expect(clash).toEqual([]);
  });
});
