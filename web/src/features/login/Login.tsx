import { useState, type FormEvent } from 'react';
import { useAuth } from '../../core/auth';

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
      </form>
    </div>
  );
}
