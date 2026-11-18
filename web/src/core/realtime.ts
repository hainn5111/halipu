import { create } from 'zustand';
import { loginVariants, parseFrame, sessionReply } from '../adapters/fonda/realtime';
import { applyEvent, type LcuLive } from './liveState';
import { getToken, getUser } from './api';
import { config, wsUrlOf } from './config';

// Một kết nối WebSocket DUY NHẤT dùng chung cho cả ứng dụng (GIS, tab LCU, drawer…): tự đăng nhập, tự nối lại, gom dữ liệu theo lcuId.
export type RtStatus = 'off' | 'connecting' | 'open' | 'authed' | 'closed' | 'error';
interface RtState {
  status: RtStatus;
  message: string;
  frames: number;
  byLcu: Record<string, LcuLive>;
  start: () => void;
  stop: () => void;
}

let ws: WebSocket | null = null, wanted = false, retry: number | undefined, attempt = 0;

export const useRealtime = create<RtState>((set, get) => {
  function schedule() {
    if (!wanted) return;
    clearTimeout(retry);
    const wait = Math.min(30000, 3000 * 2 ** Math.min(attempt++, 4));
    retry = window.setTimeout(open, wait);
  }

  function open() {
    if (!wanted || ws) return;
    const url = wsUrlOf(config()), token = getToken() || '', variants = loginVariants(token, getUser() || '');
    set({ status: 'connecting', message: `Đang kết nối ${url}` });
    try { ws = new WebSocket(url); }   // từ trang https, ws:// có thể bị chặn và ném lỗi ngay
    catch (x) { ws = null; set({ status: 'error', message: `Không mở được WebSocket: ${(x as Error).message} (Insecure content chưa bật?)` }); schedule(); return; }
    const sock = ws; let vi = 0, authed = false;
    sock.onopen = () => { set({ status: 'open', message: 'Đã kết nối · đang đăng nhập' }); sock.send(JSON.stringify(variants[0])); };
    sock.onmessage = ev => {
      let m: unknown; try { m = JSON.parse(String(ev.data)); } catch { return; }
      const reply = sessionReply(m);
      if (reply === 'logged-in') { authed = true; attempt = 0; set({ status: 'authed', message: `Đã đăng nhập WebSocket (dạng #${vi + 1})` }); }
      else if (reply === 'unauthorized' && !authed) {
        if (vi + 1 < variants.length) { vi++; sock.send(JSON.stringify(variants[vi])); set({ message: `401 → thử đăng nhập dạng #${vi + 1}` }); }
        else set({ status: 'error', message: 'Đã kết nối nhưng mọi dạng đăng nhập đều bị 401' });
      }
      const events = parseFrame(m);
      set(s => ({ frames: s.frames + 1, byLcu: events.reduce((acc, e) => applyEvent(acc, e), s.byLcu) }));
    };
    sock.onerror = () => set({ status: 'error', message: `Lỗi WebSocket tới ${url} (Insecure content chưa bật? cổng bị chặn?)` });
    sock.onclose = ev => {
      ws = null;
      if (!wanted) return;
      if (get().status !== 'error') set({ status: 'closed', message: `Đã ngắt (code ${ev.code}), sẽ nối lại` });
      schedule();
    };
  }

  return {
    status: 'off', message: '', frames: 0, byLcu: {},
    start() { if (wanted) return; wanted = true; attempt = 0; open(); },
    stop() { wanted = false; clearTimeout(retry); const s = ws; ws = null; if (s) { s.onclose = null; s.close(); } set({ status: 'off', message: '', frames: 0, byLcu: {} }); },
  };
});
