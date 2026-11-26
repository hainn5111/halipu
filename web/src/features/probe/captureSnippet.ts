/* eslint-disable @typescript-eslint/no-explicit-any */
// Đoạn script BẮT REQUEST để dán vào Console của trang Fonda GỐC (khác origin với web này nên không thể hook từ đây).
// Chỉ ghi: method, đường dẫn API, body gửi đi, mã/thông điệp/dữ liệu trả về. KHÔNG đọc header (token) và che mọi khoá giống
// pass/token/secret/authorization/cookie. Bỏ qua /login. Hàm này TỰ CHỨA (không dùng biến ngoài) vì được sao chép qua toString().
export function installCapture(win: any): any {
  if (win.__capture) return win.__capture;
  // Phân loại theo TÊN PHƯƠNG THỨC (đoạn cuối không phải id 32 hex): bắt đầu bằng động từ ghi. getImportStatus / query* không tính.
  const WRITE = /^(save|add|update|delete|remove|bind|associate|dissociate|connect|disconnect|set|place|copy|insert|relate|import|register|submit|move|clear|reset|check)/i;
  const SECRET = /pass|token|secret|authorization|cookie/i;
  const log: any[] = [];
  const scrub = (v: any, d = 0): any => {
    if (d > 7) return '…';
    if (Array.isArray(v)) return v.slice(0, 20).map(x => scrub(x, d + 1));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SECRET.test(k) ? '<redacted>' : scrub(x, d + 1)]));
    return typeof v === 'string' && v.length > 300 ? v.slice(0, 300) + '…' : v;
  };
  const parse = (s: any): any => {
    if (s == null || s === '') return null;
    if (typeof s !== 'string') return '<body không phải text>';
    try { return scrub(JSON.parse(s)); } catch { return s.length > 300 ? s.slice(0, 300) + '…' : s; }
  };
  const pathOf = (u: string) => { const m = /\/api\/(?:v[\d.]+\/)?([^?#]*)/.exec(String(u)); return m ? m[1] : ''; };
  const record = (method: string, url: string, body: any, status: number, resp: any) => {
    const path = pathOf(url);
    if (!path || /(^|\/)login/i.test(path)) return;
    const r = parse(resp);
    log.push({ t: new Date().toISOString(), method: String(method).toUpperCase(), path, write: WRITE.test(path.split('/').filter((x: string) => !/^[0-9a-f]{32}$/i.test(x)).pop() || ''), body: parse(body), status, code: r?.code, message: r?.message, data: r?.data });
    badge();
  };
  const XHR = win.XMLHttpRequest.prototype, open = XHR.open, send = XHR.send;
  XHR.open = function (this: any, method: string, url: string, ...rest: any[]) { this.__c = { method, url }; return open.call(this, method, url, ...rest); };
  XHR.send = function (this: any, body: any) {
    const c = this.__c;
    if (c) this.addEventListener('loadend', () => { try { record(c.method, c.url, body, this.status, this.responseText); } catch { /* bỏ qua */ } });
    return send.call(this, body);
  };
  if (typeof win.fetch === 'function') {
    const f = win.fetch.bind(win);
    win.fetch = (input: any, init: any) => {
      const url = typeof input === 'string' ? input : input?.url, method = init?.method || input?.method || 'GET';
      return f(input, init).then((res: any) => { try { res.clone().text().then((t: string) => record(method, url, init?.body, res.status, t)); } catch { /* bỏ qua */ } return res; });
    };
  }
  // ---- WebSocket: ghi cả khung GỬI và NHẬN (kết quả lệnh thiết bị thường về qua đây, không nằm trong phản hồi HTTP) ----
  let wsCount = 0;
  const wsRec = (dir: string, url: string, data: any) => {
    if (wsCount > 4000) return; wsCount++;
    let body: any = null;
    if (typeof data === 'string') body = parse(data);
    else if (data && typeof data.byteLength === 'number') body = `<nhị phân ${data.byteLength} byte>`;
    else if (data && typeof data.size === 'number') body = `<blob ${data.size} byte>`;
    log.push({ t: new Date().toISOString(), method: 'WS', dir, path: url, write: false, body }); badge();
  };
  const hookWs = (ws: any) => {
    if (!ws || ws.__capHooked) return; ws.__capHooked = true;
    const u = String(ws.url || '').replace(/[?#].*$/, '');   // bỏ query (có thể chứa token)
    ws.__capUrl = u;
    try {
      ws.addEventListener('message', (e: any) => wsRec('recv', u, e.data));
      ws.addEventListener('close', (e: any) => wsRec('close', u, JSON.stringify({ code: e.code, reason: e.reason })));
    } catch { /* bỏ qua */ }
  };
  const WSC = win.WebSocket;
  if (typeof WSC === 'function') {
    // socket MỚI: móc ngay khi tạo; socket ĐÃ MỞ từ trước: móc ở lần gửi đầu tiên (không liệt kê được socket cũ)
    try { win.WebSocket = new Proxy(WSC, { construct(t: any, args: any[]) { const ws = new t(...args); hookWs(ws); wsRec('connect', String(args[0] || '').replace(/[?#].*$/, ''), null); return ws; } }); } catch { /* bỏ qua */ }
    const origSend = WSC.prototype.send;
    WSC.prototype.send = function (this: any, d: any) { try { hookWs(this); wsRec('send', this.__capUrl || '', d); } catch { /* bỏ qua */ } return origSend.call(this, d); };
  }
  let el: any = null, el2: any = null, el3: any = null;
  function badge() {
    try {
      if (!win.document?.body) return;
      if (!el) {
        el = win.document.createElement('button');
        el.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:8px 12px;border:0;border-radius:8px;background:#f59e0b;color:#111;font:600 13px sans-serif;cursor:pointer';
        el.onclick = () => api.download();
        win.document.body.appendChild(el);
        // Nút thứ hai: tải TẤT CẢ request (kể cả truy vấn/đọc) — để xem dữ liệu mà màn hình không hiện trực tiếp
        el2 = win.document.createElement('button');
        el2.style.cssText = 'position:fixed;left:12px;bottom:52px;z-index:2147483647;padding:6px 10px;border:0;border-radius:8px;background:#38bdf8;color:#111;font:600 12px sans-serif;cursor:pointer';
        el2.onclick = () => api.download(true);
        win.document.body.appendChild(el2);
        // Nút thứ ba: xoá toàn bộ bản ghi để bắt lại từ đầu
        el3 = win.document.createElement('button');
        el3.style.cssText = 'position:fixed;left:12px;bottom:86px;z-index:2147483647;padding:6px 10px;border:0;border-radius:8px;background:#f87171;color:#111;font:600 12px sans-serif;cursor:pointer';
        el3.textContent = '🗑 Xoá bản ghi';
        el3.onclick = () => api.clear();
        win.document.body.appendChild(el3);
      }
      el.textContent = `⬇ Capture: ${log.filter(x => x.write).length} ghi / ${log.length} tổng`;
      if (el2) el2.textContent = `⬇ Tải tất cả (${log.length}: ${log.filter(x => x.method === 'WS').length} WS, gồm truy vấn)`;
    } catch { /* bỏ qua */ }
  }
  const api = {
    log,
    /** Tải JSON. Mặc định chỉ các request "ghi"; `download(true)` tải tất cả (gồm truy vấn và khung WebSocket); `download(true, 'smartBox|queryParam')` chỉ các dòng có path khớp. */
    download(all = false, only?: string | RegExp) {
      let rows = all ? log : log.filter(x => x.write);
      if (only) { const re = typeof only === 'string' ? new RegExp(only, 'i') : only; rows = rows.filter(x => re.test(x.path || '')); }
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
      const a = win.document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `fonda-capture-${new Date().toISOString().replace(/[:.]/g, '-')}.json`; a.click(); URL.revokeObjectURL(a.href);
    },
    clear() { log.length = 0; wsCount = 0; badge(); },
  };
  win.__capture = api; badge();
  return api;
}

/** Mã để dán vào Console của trang Fonda gốc. */
export const captureScript = (): string => `(${installCapture.toString()})(window);`;
