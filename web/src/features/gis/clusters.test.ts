import { describe, expect, it } from 'vitest';
import { buildIndex, clustersIn } from './clusters';

describe('clusters', () => {
  const pts = Array.from({ length: 5000 }, (_, i) => ({ uid: 'U' + i, name: 'L' + i, lat: 20 + (i % 100) * 0.0005, lng: 105 + Math.floor(i / 100) * 0.0005 }));
  it('thu nhỏ: ít phần tử hơn nhiều so với số điểm; phóng to: ra điểm lẻ', () => {
    const idx = buildIndex(pts), world: [number, number, number, number] = [-180, -85, 180, 85];
    const far = clustersIn(idx, world, 5); expect(far.length).toBeLessThan(10); expect(far.reduce((n, f) => n + (f.properties as { point_count?: number }).point_count!, 0)).toBe(5000);
    const near = clustersIn(idx, [104.99, 19.99, 105.01, 20.06], 18); expect(near.length).toBeGreaterThan(0); expect(near.every(f => !(f.properties as { cluster?: boolean }).cluster)).toBe(true);
  });
  it('khung nhìn nhỏ chỉ trả phần tử trong khung', () => {
    const idx = buildIndex(pts); expect(clustersIn(idx, [150, 0, 151, 1], 10)).toEqual([]);
  });
});
