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
}

const CONCURRENCY = 4;

export const useLcus = create<LcuState>((set, get) => ({
  lcus: [], status: 'idle', progress: '', error: '', report: [], selectedUid: null,
  select: uid => set({ selectedUid: uid }),
  async load(force = false) {
    if (get().status === 'loading' || (get().status === 'ready' && !force)) return;
    set({ status: 'loading', error: '', progress: 'Đang tải…' });
    try {
      const { lcus, report } = await listLcus(m => set({ progress: m }));
      set({ lcus, report, status: 'ready', progress: '' });
      // Toạ độ + công suất định mức: lấy dần, cập nhật từng LCU
      let next = 0;
      await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
        while (next < lcus.length) {
          const l = lcus[next++];
          try { const d = await loadDetail(l); set(s => ({ lcus: s.lcus.map(x => (x.uid === l.uid ? { ...x, ...d } : x)) })); } catch { /* LCU này chưa có chi tiết */ }
        }
      }));
    } catch (e) { set({ status: 'error', error: (e as Error).message, progress: '' }); }
  },
}));
