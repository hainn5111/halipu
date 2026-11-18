import JSEncrypt from 'jsencrypt';
import { config } from './config';

// Lớp truyền tải mỏng tới API Fonda: token, lỗi chuẩn hoá. Không chứa logic nghiệp vụ (nằm ở adapters/).
const OK = [200, 20000];
const TOKEN_KEY = 'slcp_token', USER_KEY = 'slcp_user';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const getUser = () => sessionStorage.getItem(USER_KEY);
export function clearSession() { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(USER_KEY); }

type Listener = () => void;
let onExpired: Listener = () => {};
export const setOnSessionExpired = (f: Listener) => { onExpired = f; };

export class ApiError extends Error {
  constructor(message: string, public code?: number) { super(message); }
}

export async function login(username: string, password: string): Promise<void> {
  const { apiBase, rsaPublicKey } = config();
  if (!rsaPublicKey) throw new ApiError('Chưa cấu hình rsaPublicKey trong config.json');
  const enc = new JSEncrypt(); enc.setPublicKey(rsaPublicKey);
  const pwd = enc.encrypt(password);
  if (!pwd) throw new ApiError('Public key không hợp lệ');
  let res: Response;
  try {
    res = await fetch(`${apiBase}/api/login?lang=en-US`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: pwd, repassword: false }),
    });
  } catch {
    throw new ApiError(location.protocol === 'https:' && apiBase.startsWith('http:')
      ? 'Trình duyệt chặn gọi API HTTP từ trang HTTPS (mixed content). Cần reverse proxy HTTPS hoặc bật Insecure content.'
      : 'Không kết nối được API (mạng hoặc CORS).');
  }
  const body = await res.json().catch(() => ({}));
  if (body.code === 2004) throw new ApiError('Tài khoản bật xác thực 2 bước — chưa hỗ trợ', 2004);
  if (!OK.includes(body.code)) throw new ApiError(body.message || `Đăng nhập thất bại (HTTP ${res.status})`, body.code);
  const token = res.headers.get('authorization');
  if (!token) throw new ApiError('Đăng nhập OK nhưng không đọc được header authorization (server chưa expose header cho CORS)');
  sessionStorage.setItem(TOKEN_KEY, token); sessionStorage.setItem(USER_KEY, username);
}

export interface CallOptions { body?: unknown; projectId?: string }

/** Gọi API v1.0 có token. projectId (nếu có) đặt ở header như frontend Fonda. */
export async function call<T = unknown>(method: 'GET' | 'POST', path: string, { body, projectId }: CallOptions = {}): Promise<T> {
  const headers: Record<string, string> = { authorization: getToken() || '', 'Content-Type': 'application/json' };
  if (projectId) headers.projectId = projectId;
  const res = await fetch(`${config().apiBase}/api/v1.0/${path}?lang=en-US`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (json.code === 10002) { clearSession(); onExpired(); }
  if (!OK.includes(json.code)) throw new ApiError(`${path}: ${json.message || 'HTTP ' + res.status} (code ${json.code})`, json.code);
  return json.data as T;
}
