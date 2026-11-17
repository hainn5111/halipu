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
    this.last = { path, status: res.status, json };
    if (json.code === 10002) { this.logout(); location.replace('index.html'); }
    if (![200, 20000].includes(json.code)) throw new Error(`${path}: ${json.message || 'HTTP ' + res.status} (code ${json.code})`);
    return json.data;
  },
  // projectId cố định: ?pid= trên URL > ô nhập ở home.html (localStorage) > config.js PROJECT_ID. Có giá trị thì không dò cây dự án nữa (tránh lẫn sang Demo H).
  fixedProjectId() {
    const q = new URLSearchParams(location.search).get('pid');
    let saved = ''; try { saved = localStorage.getItem('pid_fixed') || ''; } catch {}
    return (q && q.trim()) || saved.trim() || (window.SLCP_CONFIG.PROJECT_ID || '').trim();
  },
  // Thử lần lượt vài API; tìm projectId (hoặc id) trong kết quả, kể cả lồng trong mảng/records/children.
  async getProjectId() {
    const fixed = this.fixedProjectId();
    if (fixed) return fixed;
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
    if (this.fixedProjectId()) return [this.fixedProjectId()];
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
  // Lịch sử đo từ server (energy/getLcuDataTrend — payload bắt từ web gốc). startDate/endDate là epoch ms. Trả mảng mới nhất trước.
  async _trendOne({ pid, uid, lcuId, name, ctype = 53 }, days) {
    const end = Date.now();
    const d = await this.call('POST', 'energy/getLcuDataTrend', { projectId: pid, body: { lcuId, lcuName: name || '', luid: uid, uid, projectId: pid, channel: '', maxchannel: 1, ctype, queryType: 2, type: 1, startDate: end - days * 864e5, endDate: end } });
    const ts = (d && d.date) || [], at = (k, i) => (d[k] || [])[i];
    return ts.map((t, i) => ({ ts: t, dtime: at('dateFormat', i) || new Date(t).toLocaleString(), p: at('p', i), u: at('u', i), i: at('i', i), pf: at('pf', i), e: at('e', i), dim: at('dim', i), wp: at('wp', i), from: lcuId }));
  },
  async lcuTrend(o, days = 1) { return (await this._trendOne(o, days)).reverse(); },
  async unicast(cmd, { luid, num, projectId, dimming }) {
    // Khớp đúng request đã test OK (doc 08): chỉ authorization + Content-Type, projectId nằm trong body, không có header projectId.
    const body = { luid, num: Number(num) };
    if (cmd === 'dimming') body.dimming = Number(dimming);
    body.projectId = projectId;
    return this.call('POST', `lampControl/unicast/${cmd}`, { body });
  },
  // WebSocket realtime (docs/claude/11 §2). onFrame nhận {cmd, ctrl, data, raw}.
  openWs(onFrame, onState) {
    const base = window.SLCP_CONFIG.API_BASE.replace(/^http/, 'ws').replace(/:\d+$/, '');
    const url = `${base}:81/clesws`; let hb;
    const ws = new WebSocket(url);
    const T = this.token;
    // Thử lần lượt các dạng frame đăng nhập (docs 08 §4 và 11 §2 khác nhau) cho tới khi hết 401.
    const variants = [
      { cmd: 'session', ctrl: 'login', Authorization: T },
      { cmd: 'session', Authorization: T },
      { cmd: 'session', ctrl: 'login', data: { Authorization: T } },
      { cmd: 'session', ctrl: 'login', Authorization: T.replace(/^Bearer\s+/i, '') },
      { cmd: 'session', ctrl: 'login', Authorization: T, clientType: 'app', userAccount: sessionStorage.getItem('slcp_user') || '' },
      { cmd: 'session', ctrl: 'login', authorization: T },
    ];
    let vi = 0, loggedIn = false;
    ws.onopen = () => { onState('Đã kết nối ' + url + ' · thử đăng nhập dạng #1'); ws.send(JSON.stringify(variants[0])); };
    ws.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch { m = { raw: ev.data }; }
      const inn = m.data && m.data.cmd ? m.data : {};
      if (m.code === 200 && inn.cmd === 'session' && inn.ctrl === 'login') { loggedIn = true; onState(`Đã đăng nhập WebSocket (dạng #${vi + 1})`); }
      else if (m.code === 401 && loggedIn) onState('Đã đăng nhập nhưng có tin 401 (có thể từ heartbeat) — xem nội dung bên dưới');
      else if (m.code === 401 && vi + 1 < variants.length) { vi++; onState(`Đã kết nối · 401 → thử đăng nhập dạng #${vi + 1}`); ws.send(JSON.stringify(variants[vi])); }
      else if (m.code === 401) onState('Đã kết nối nhưng mọi dạng đăng nhập đều bị 401');
      onFrame(m, ev.data); };
    ws.onerror = () => onState(`Lỗi WebSocket tới ${url} (Insecure content chưa bật? cổng 81 bị chặn?)`);
    ws.onclose = ev => { clearInterval(hb); onState(`Đã ngắt (code ${ev.code}) ${url}`); };
    return ws;
  },
  logout() { try { localStorage.removeItem('pid'); } catch {} sessionStorage.removeItem('slcp_token'); sessionStorage.removeItem('slcp_user'); },
};
