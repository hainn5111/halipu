// BFF tối giản: frontend chỉ nói chuyện với server này; token Fonda giữ phía server (xem docs/08, docs/claude/11).
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const FONDA_BASE = (process.env.FONDA_BASE_URL || 'http://159.138.45.45:18080').replace(/\/$/, '');
const RSA_KEY = process.env.FONDA_RSA_PUBLIC_KEY || ''; // public key lấy từ bundle login của Fonda
const MOCK = process.env.MOCK_LOGIN === '1';           // chạy thử không cần Fonda
const SESSION_TTL_MS = 8 * 3600 * 1000;
const sessions = new Map(); // sid -> { token, username, user, expires }

function pem(key) {
  if (key.includes('BEGIN')) return key.replace(/\\n/g, '\n');
  const body = key.replace(/\s+/g, '').match(/.{1,64}/g).join('\n');
  return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
}

// Tương đương JSEncrypt.encrypt(): RSA PKCS#1 v1.5, base64
function rsaEncrypt(text) {
  return crypto.publicEncrypt({ key: pem(RSA_KEY), padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(text)).toString('base64');
}

async function fondaLogin(username, password) {
  if (MOCK) {
    if (password !== 'demo') return { ok: false, message: 'Sai tài khoản hoặc mật khẩu (mock: mật khẩu là "demo")' };
    return { ok: true, token: 'mock-token', user: { userName: username, mock: true } };
  }
  if (!RSA_KEY) return { ok: false, message: 'Server chưa cấu hình FONDA_RSA_PUBLIC_KEY' };
  const res = await fetch(`${FONDA_BASE}/api/login?lang=en-US`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: rsaEncrypt(password), repassword: false }),
  });
  const body = await res.json().catch(() => ({}));
  const token = res.headers.get('authorization');
  if (body.code === 2004) return { ok: false, message: 'Tài khoản bật xác thực 2 bước — chưa hỗ trợ' };
  if (!res.ok || !token || ![200, 20000].includes(body.code)) {
    return { ok: false, message: body.message || `Đăng nhập thất bại (HTTP ${res.status})` };
  }
  let user = null;
  try {
    const u = await fetch(`${FONDA_BASE}/api/getUser?lang=en-US`, { headers: { authorization: token } });
    user = (await u.json()).data ?? null;
  } catch { /* hồ sơ không bắt buộc */ }
  return { ok: true, token, user };
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(p => p[0]));
}
function getSession(req) {
  const s = sessions.get(cookies(req).sid);
  if (s && s.expires > Date.now()) return s;
  return null;
}
function json(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
function sendFile(res, file) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
  fs.readFile(path.join(__dirname, 'public', file), (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
  try {
    if (req.method === 'POST' && url.pathname === '/api/login') {
      const { username, password } = await readBody(req);
      if (!username || !password) return json(res, 400, { ok: false, message: 'Nhập tài khoản và mật khẩu' });
      const r = await fondaLogin(String(username), String(password));
      if (!r.ok) return json(res, 401, r);
      const sid = crypto.randomBytes(24).toString('hex');
      sessions.set(sid, { token: r.token, username, user: r.user, expires: Date.now() + SESSION_TTL_MS });
      return json(res, 200, { ok: true }, { 'Set-Cookie': `sid=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${secure}` });
    }
    if (req.method === 'GET' && url.pathname === '/api/me') {
      const s = getSession(req);
      if (!s) return json(res, 401, { ok: false });
      return json(res, 200, { ok: true, username: s.username, user: s.user });
    }
    if (req.method === 'POST' && url.pathname === '/api/logout') {
      sessions.delete(cookies(req).sid);
      return json(res, 200, { ok: true }, { 'Set-Cookie': `sid=; HttpOnly; Path=/; Max-Age=0${secure}` });
    }
    if (req.method === 'GET' && url.pathname === '/healthz') return json(res, 200, { ok: true });
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/login')) return sendFile(res, 'login.html');
    if (req.method === 'GET' && url.pathname === '/home') {
      if (!getSession(req)) { res.writeHead(302, { Location: '/login' }); return res.end(); }
      return sendFile(res, 'home.html');
    }
    if (req.method === 'GET' && url.pathname === '/style.css') return sendFile(res, 'style.css');
    res.writeHead(404); res.end('Not found');
  } catch (e) {
    console.error(e);
    json(res, 502, { ok: false, message: 'Không kết nối được hệ thống SLCP' });
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`halipu-web on :${PORT}${MOCK ? ' (MOCK_LOGIN)' : ''}`));
}
module.exports = { server, rsaEncrypt };
