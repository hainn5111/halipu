import { create } from 'zustand';
import { listLcus, loadDetail } from '../adapters/fonda';
import type { Lcu } from './types';

// Kho dùng chung: GIS và tab LCU đọc cùng một danh sách, chỉ gọi API một lần.
interface LcuState {
  lcus: Lcu[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  progress: string;
  error: string;
  report: string[];
  selectedUid: string | null;
  load: (force?: boolean) => Promise<void>;
  select: (uid: string | null) => void;
  /** Ghi thêm chi tiết (vd công suất định mức) cho một LCU. */
  patch: (uid: string, p: Partial<Lcu>) => void;
}

const CONCURRENCY = 4;
const triedDetail = new Set<string>();   // LCU đã thử lấy chi tiết trong phiên: LCU thật sự chưa có toạ độ không bị gọi lại mỗi lần mở tab

export const useLcus = create<LcuState>((set, get) => ({
  lcus: [], status: 'idle', progress: '', error: '', report: [], selectedUid: null,
  select: uid => set({ selectedUid: uid }),
  patch: (uid, p) => set(s => ({ lcus: s.lcus.map(x => (x.uid === uid ? { ...x, ...p } : x)) })),
  async load(force = false) {
    if (get().status === 'loading' || (get().status === 'ready' && !force)) return;
    set({ status: 'loading', error: '', progress: 'Đang tải…' });
    try {
      const fresh = await listLcus(m => set({ progress: m }));
      // Tải lại danh sách không được làm mất toạ độ/định mức đã có (tránh nháy "chưa có toạ độ" khi mở lại tab)
      const prev = new Map(get().lcus.map(l => [l.uid, l]));
      const lcus = fresh.lcus.map(l => { const o = prev.get(l.uid); return o ? { ...l, lat: o.lat, lng: o.lng, ratedPower: o.ratedPower } : l; });
      const report = fresh.report;
      set({ lcus, report, status: 'ready', progress: '' });
      // Toạ độ đã lấy hàng loạt trong listLcus; chỉ LCU CHƯA có toạ độ mới gọi chi tiết (dự phòng, mỗi uid một lần). Công suất định mức lấy khi chọn LCU (LcuPanel).
      let next = 0;
      await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
        while (next < lcus.length) {
          const l = lcus[next++];
          if (l.lat !== undefined || triedDetail.has(l.uid)) continue;
          triedDetail.add(l.uid);
          try { const d = await loadDetail(l); set(s => ({ lcus: s.lcus.map(x => (x.uid === l.uid ? { ...x, ...d } : x)) })); } catch { /* LCU này chưa có chi tiết */ }
        }
      }));
    } catch (e) { set({ status: 'error', error: (e as Error).message, progress: '' }); }
  },
}));
