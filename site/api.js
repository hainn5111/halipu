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
  // Gọi API có token. projectId đặt ở header (frontend Fonda làm vậy) và trong body khi cần.
  async call(method, path, { body, projectId } = {}) {
    const headers = { authorization: this.token, 'Content-Type': 'application/json' };
    if (projectId) headers.projectId = projectId;
    const res = await fetch(`${window.SLCP_CONFIG.API_BASE}/api/v1.0/${path}?lang=en-US`, {
      method, headers, body: body ? JSON.stringify(body) : undefined });
    const json = await res.json().catch(() => ({}));
    if (json.code === 10002) { this.logout(); location.replace('index.html'); }
    if (![200, 20000].includes(json.code)) throw new Error(`${path}: ${json.message || 'HTTP ' + res.status} (code ${json.code})`);
    return json.data;
  },
  async getProjectId() {
    const d = await this.call('GET', 'project/queryLastProject');
    if (!d || !d.projectId) throw new Error('Không lấy được projectId');
    return d.projectId;
  },
  async listLcus(projectId, size = 100) {
    const out = []; let current = 1, pages = 1;
    do {
      const d = await this.call('POST', 'lcuActor/page', { projectId, body: { current, size, projectId, integratedQuery: '' } });
      out.push(...(d.records || [])); pages = d.pages || 1; current++;
    } while (current <= pages && current < 50);
    return out;
  },
  logout() { sessionStorage.removeItem('slcp_token'); sessionStorage.removeItem('slcp_user'); },
};
