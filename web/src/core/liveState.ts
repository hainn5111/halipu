import type { LampData, LampState, RtEvent } from '../adapters/fonda/realtime';

// Trạng thái realtime của từng LCU (gom từ các khung tin). THUẦN, không phụ thuộc mạng/trình duyệt → kiểm thử được.
export interface LcuLive {
  lamps: Record<number, LampState & { at: number }>;
  data: Record<number, LampData & { at: number }>;
  unicast?: { text: string; at: number };
}

/** Trả bản MỚI của bảng trạng thái sau khi áp một sự kiện (không sửa object cũ). */
export function applyEvent(prev: Record<string, LcuLive>, e: RtEvent, at = Date.now()): Record<string, LcuLive> {
  const cur = prev[e.lcuId] ?? { lamps: {}, data: {} };
  const next: LcuLive = { ...cur };
  if (e.kind === 'status') { next.lamps = { ...cur.lamps }; for (const l of e.lamps) next.lamps[l.num] = { ...l, at }; }
  else if (e.kind === 'data') { next.data = { ...cur.data }; for (const d of e.data) next.data[d.num] = { ...d, at }; }
  else next.unicast = { text: e.text, at };
  return { ...prev, [e.lcuId]: next };
}
