/** Tải mọi trang: trang 1 để biết tổng số trang, rồi các trang còn lại SONG SONG (conc luồng). Trần 5000 trang (trước đây cắt ở 99 trang ≈ 9.900 dòng). */
export async function fetchPages<T>(getPage: (current: number) => Promise<{ records?: T[]; pages?: number }>, onProgress?: (done: number, total: number) => void, conc = 8): Promise<T[]> {
  const first = await getPage(1), pages = Math.min(Math.max(first.pages || 1, 1), 5000);
  const out: T[][] = [first.records ?? []]; let next = 2, done = 1; onProgress?.(1, pages);
  await Promise.all(Array.from({ length: Math.min(conc, pages - 1) }, async () => {
    while (next <= pages) { const n = next++; out[n - 1] = (await getPage(n)).records ?? []; done++; onProgress?.(done, pages); }
  }));
  return out.flat();
}

