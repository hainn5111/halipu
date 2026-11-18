// Cấu hình nạp LÚC CHẠY từ config.json đặt cạnh index.html (không đóng cứng lúc build) → đổi host không cần build lại.
export interface AppConfig {
  /** Gốc của API Fonda, ví dụ "http://host:18080" hoặc "/fonda" (đường dẫn cùng origin khi có reverse proxy). */
  apiBase: string;
  /** URL WebSocket; để trống thì suy ra từ apiBase (cổng 81, đường dẫn /clesws). */
  wsUrl: string;
  /** projectId cố định (tuỳ chọn). Trống = tự dò từ cây dự án. */
  projectId: string;
  /** Khoá RSA công khai của Fonda (công khai, được phép nằm trong cấu hình). */
  rsaPublicKey: string;
}

export const DEFAULT_CONFIG: AppConfig = { apiBase: '', wsUrl: '', projectId: '', rsaPublicKey: '' };

export function mergeConfig(raw: unknown): AppConfig {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const s = (k: keyof AppConfig) => (typeof r[k] === 'string' ? (r[k] as string).trim() : DEFAULT_CONFIG[k]);
  return { apiBase: s('apiBase').replace(/\/+$/, ''), wsUrl: s('wsUrl'), projectId: s('projectId'), rsaPublicKey: s('rsaPublicKey') };
}

export function wsUrlOf(c: AppConfig): string {
  if (c.wsUrl) return c.wsUrl;
  return `${c.apiBase.replace(/^http/, 'ws').replace(/:\d+$/, '')}:81/clesws`;
}

let current: AppConfig = DEFAULT_CONFIG;
export const config = (): AppConfig => current;

/** projectId cố định đang áp dụng đến từ đâu: ?pid= trên URL, pid_fixed (trang ẩn scan.html), config.json, hoặc không có. */
export let fixedSource: 'url' | 'scan' | 'config' | '' = '';
export const FIXED_KEY = 'pid_fixed';

export async function loadConfig(url = `${import.meta.env.BASE_URL}config.json`): Promise<AppConfig> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) current = mergeConfig(await res.json());
  } catch { /* dùng mặc định */ }
  // Cho phép ghi đè nhanh bằng ?pid=<id> trên URL (giữ hành vi bản cũ).
  // Thứ tự ưu tiên như bản cũ: ?pid= > pid_fixed (chọn từ scan.html) > config.json.
  const q = new URLSearchParams(location.search).get('pid');
  let saved = ''; try { saved = (localStorage.getItem(FIXED_KEY) || '').trim(); } catch { /* bị chặn */ }
  if (q && q.trim()) { current = { ...current, projectId: q.trim() }; fixedSource = 'url'; }
  else if (saved) { current = { ...current, projectId: saved }; fixedSource = 'scan'; }
  else if (current.projectId) fixedSource = 'config';
  return current;
}
