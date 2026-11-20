import { useState, type FormEvent } from 'react';
import { useAuth } from '../../core/auth';
import { config } from '../../core/config';

// Trang https gọi API http bị trình duyệt chặn (mixed content) → hướng dẫn bật Insecure content (docs/14).
export const needsInsecureGuide = (proto: string, apiBase: string) => proto === 'https:' && apiBase.startsWith('http:');

function InsecureGuide() {
  return (
    <details className="guide" open>
      <summary>Không đăng nhập được? Cho phép trang gọi API (làm 1 lần)</summary>
      <p>API của hệ thống chạy <b>http</b> còn trang này chạy <b>https</b> nên trình duyệt chặn. Trên <b>máy tính (Chrome/Edge)</b>:</p>
      <ol>
        <li>Bấm biểu tượng ổ khoá/điều chỉnh bên trái thanh địa chỉ → <b>Cài đặt trang web</b> (Site settings).</li>
        <li>Tìm <b>Nội dung không an toàn</b> (Insecure content) → chọn <b>Cho phép</b> (Allow).</li>
        <li>Tải lại trang rồi đăng nhập.</li>
      </ol>
      <p className="warn"><b>Điện thoại:</b> iPhone (Safari/Chrome) không có tuỳ chọn này nên chưa dùng được; Android phụ thuộc phiên bản Chrome. Hãy dùng máy tính.</p>
    </details>
  );
}

export default function Login() {
  const signIn = useAuth(s => s.signIn);
  const [u, setU] = useState(''), [p, setP] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try { await signIn(u.trim(), p); } catch (x) { setErr((x as Error).message); }
    setBusy(false);
  }
  return (
    <div className="center">
      <form className="card" onSubmit={submit}>
        <h1>Đăng nhập</h1><p className="sub">Hệ thống điều khiển chiếu sáng thông minh</p>
        <label htmlFor="u">Tài khoản</label><input id="u" autoComplete="username" required value={u} onChange={e => setU(e.target.value)} />
        <label htmlFor="p">Mật khẩu</label><input id="p" type="password" autoComplete="current-password" required value={p} onChange={e => setP(e.target.value)} />
        <button id="b" disabled={busy}>Đăng nhập</button><div className="err">{err}</div>
        {needsInsecureGuide(location.protocol, config().apiBase) && <InsecureGuide />}
      </form>
    </div>
  );
}
