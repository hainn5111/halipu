// Gọi thẳng API Fonda từ trình duyệt (docs/claude/11 §3). Token lưu sessionStorage — mất khi đóng tab, giống Fonda.
const SLCP = {
  get token() { return sessionStorage.getItem('slcp_token'); },
  async login(username, password) {
    const { API_BASE, RSA_PUBLIC_KEY } = window.SLCP_CONFIG;
    if (!RSA_PUBLIC_KEY) throw new Error('Chưa cấu hình RSA_PUBLIC_KEY trong config.js');
    const enc = new JSEncrypt(); enc.setPublicKey(RSA_PUBLIC_KEY);
    const pwd = enc.encrypt(password);
    if (!pwd) throw new Error('Public key không hợp lệ');
    let res;
    try {
      res = await fetch(`${API_BASE}/api/login?lang=en-US`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pwd, repassword: false }),
      });
    } catch {
      throw new Error(location.protocol === 'https:' && API_BASE.startsWith('http:')
        ? 'Trình duyệt chặn gọi API HTTP từ trang HTTPS (mixed content). Xem hướng dẫn bên dưới.'
        : 'Không kết nối được API Fonda (mạng hoặc CORS).');
    }
    const body = await res.json().catch(() => ({}));
    if (body.code === 2004) throw new Error('Tài khoản bật xác thực 2 bước — chưa hỗ trợ');
    if (![200, 20000].includes(body.code)) throw new Error(body.message || `Đăng nhập thất bại (HTTP ${res.status})`);
    const token = res.headers.get('authorization');
    if (!token) throw new Error('Đăng nhập OK nhưng không đọc được header authorization (server chưa expose header cho CORS)');
    sessionStorage.setItem('slcp_token', token);
    sessionStorage.setItem('slcp_user', username);
  },
  async getUser() {
    const res = await fetch(`${window.SLCP_CONFIG.API_BASE}/api/getUser?lang=en-US`, { headers: { authorization: this.token } });
    const body = await res.json();
    if (![200, 20000].includes(body.code)) throw new Error(body.message || 'Phiên hết hạn');
    return body.data;
  },
  logout() { sessionStorage.removeItem('slcp_token'); sessionStorage.removeItem('slcp_user'); },
};
