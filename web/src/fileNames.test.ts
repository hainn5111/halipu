import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Windows/macOS không phân biệt hoa-thường: `LcuLab.tsx` và `lcuLab.ts` cùng thư mục làm `import('./LcuLab')` nạp nhầm file (không có default → trắng trang).
function clashes(dir: string): string[] {
  const out: string[] = [], seen = new Map<string, string>();
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { out.push(...clashes(p)); continue; }
    const key = f.replace(/\.(test\.)?(tsx?|jsx?|css)$/i, m => m.toLowerCase().includes('test') ? '.test' : '').toLowerCase();
    const prev = seen.get(key); if (prev && prev !== f) out.push(`${dir}: ${prev} ~ ${f}`);
    seen.set(key, f);
  }
  return out;
}
describe('tên file', () => {
  it('không có hai file chỉ khác hoa/thường (bỏ đuôi) trong cùng thư mục', () => { expect(clashes('src')).toEqual([]); });
});
