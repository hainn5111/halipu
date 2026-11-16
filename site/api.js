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
  // Thử lần lượt vài API; tìm projectId (hoặc id) trong kết quả, kể cả lồng trong mảng/records/children.
  async getProjectId() {
    const saved = localStorage.getItem('pid');
    if (saved) return saved;
    const find = v => {
      if (!v || typeof v !== 'object') return null;
      if (typeof v.projectId === 'string' && v.projectId) return v.projectId;
      for (const k of Array.isArray(v) ? v.keys() : ['records', 'children', 'data']) { const r = find(v[k]); if (r) return r; }
      return null;
    };
    const tries = [['GET', 'project/queryLastProject'], ['POST', 'project/queryTree', {}],
      ['POST', 'project/queryList', { current: 1, size: 10 }], ['POST', 'project/queryProjectByUserId', {}]];
    const log = [];
    for (const [m, p, body] of tries) {
      try {
        const d = await this.call(m, p, { body });
        const id = find(d) || (d && d.records && d.records[0] && d.records[0].id);
        if (id) { localStorage.setItem('pid', id); return id; }
        log.push(`${p}: không có projectId (${JSON.stringify(d).slice(0, 150)})`);
      } catch (e) { log.push(e.message); }
    }
    throw new Error('Không lấy được projectId:\n' + log.join('\n'));
  },
  // Tất cả projectId (dự án cha + con) trong cây dự án
  async allProjectIds(fallbackId) {
    const ids = new Set(fallbackId ? [fallbackId] : []);
    const walk = v => {
      if (!v || typeof v !== 'object') return;
      if (Array.isArray(v)) return v.forEach(walk);
      if (typeof v.projectId === 'string' && v.projectId) ids.add(v.projectId);
      Object.values(v).forEach(x => { if (x && typeof x === 'object') walk(x); });
    };
    try { walk(await this.call('POST', 'project/queryTree', { body: {} })); } catch { /* dùng fallback */ }
    return [...ids];
  },
  async pageAll(path, projectId, size = 100) {
    const out = []; let current = 1, pages = 1;
    do {
      const d = await this.call('POST', path, { projectId, body: { current, size, projectId, integratedQuery: '' } });
      out.push(...(d.records || [])); pages = d.pages || 1; current++;
    } while (current <= pages && current < 100);
    return out;
  },
  // Gộp LCU từ mọi dự án, theo uid. Trả { rows, report }.
  async listAllLcus(onProgress) {
    const pid0 = await this.getProjectId();
    const pids = await this.allProjectIds(pid0);
    const map = new Map(), report = [];
    for (const pid of pids) {
      onProgress && onProgress(`Đang tải dự án ${pids.indexOf(pid) + 1}/${pids.length}…`);
      let n = 0;
      try {
        for (const r of await this.pageAll('lcuActor/page', pid)) {
          const k = r.uid || r.lcuId; if (!k) continue;
          if (!map.has(k)) { map.set(k, { ...r, _pid: pid }); n++; }
        }
        report.push(`${pid}: lcuActor/page +${n}`);
      } catch (e) { report.push(e.message); }
      try {
        const list = await this.call('POST', 'lcuActor/getLcuListByProjectId', { projectId: pid, body: { projectId: pid } });
        let m = 0;
        for (const r of list || []) {
          const k = r.luid; if (!k || map.has(k)) continue;
          map.set(k, { uid: r.luid, deviceName: r.lcuName, lcuId: r.lcuId, _pid: pid }); m++;
        }
        report.push(`${pid}: getLcuListByProjectId +${m}`);
      } catch (e) { report.push(e.message); }
    }
    return { rows: [...map.values()], report };
  },
  // Lệnh điều khiển đơn (docs/08 §2). dimming đã xác nhận payload; turnOn/turnOff giả định cùng mẫu (chưa xác nhận).
  async unicast(cmd, { luid, num, projectId, dimming }) {
    const body = { luid, num: Number(num), projectId };
    if (cmd === 'dimming') body.dimming = Number(dimming);
    return this.call('POST', `lampControl/unicast/${cmd}`, { projectId, body });
  },
  // WebSocket realtime (docs/claude/11 §2). onFrame nhận {cmd, ctrl, data, raw}.
  openWs(onFrame, onState) {
    const base = window.SLCP_CONFIG.API_BASE.replace(/^http/, 'ws').replace(/:\d+$/, '');
    const url = `${base}:81/clesws`; let hb;
    const ws = new WebSocket(url);
    ws.onopen = () => { onState('Đã kết nối'); ws.send(JSON.stringify({ cmd: 'session', ctrl: 'login', Authorization: this.token }));
      hb = setInterval(() => ws.readyState === 1 && ws.send(JSON.stringify({ cmd: 'session', ctrl: 'heartbeat' })), 25000); };
    ws.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch { m = { raw: ev.data }; } onFrame(m, ev.data); };
    ws.onerror = () => onState('Lỗi WebSocket (kiểm tra Insecure content / cổng 81)');
    ws.onclose = () => { clearInterval(hb); onState('Đã ngắt'); };
    return ws;
  },
  logout() { try { localStorage.removeItem('pid'); } catch {} sessionStorage.removeItem('slcp_token'); sessionStorage.removeItem('slcp_user'); },
};
