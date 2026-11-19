import { useState } from 'react';

// Hộp xác nhận cho thao tác GHI lên Fonda: mô tả, body sẽ gửi (xem trước), tick xác nhận, kết quả/lỗi.
interface Props { title: string; summary: string; method: string; path: string; body: unknown; danger?: boolean; onConfirm: () => Promise<void>; onClose: (changed: boolean) => void }

export default function ConfirmWrite({ title, summary, method, path, body, danger, onConfirm, onClose }: Props) {
  const [ok, setOk] = useState(false), [busy, setBusy] = useState(false), [done, setDone] = useState(false), [err, setErr] = useState('');
  async function go() { setBusy(true); setErr(''); try { await onConfirm(); setDone(true); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); } }
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 3000, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 640, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{title}</h2>
        <p style={{ margin: '0 0 8px' }}>{summary}</p>
        <p className="sub" style={{ margin: '0 0 8px', color: danger ? 'var(--bad)' : undefined }}>⚠ Thao tác GHI THẬT lên Fonda. Chỉ làm trên dữ liệu thử.</p>
        <details><summary style={{ cursor: 'pointer' }}>Xem body sẽ gửi — <code>{method} {path}</code></summary>
          <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 260, overflow: 'auto' }}>{JSON.stringify(body, null, 2)}</pre></details>
        {!done && <label style={{ display: 'block', margin: '12px 0' }}><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} /> Tôi đã xem body và muốn thực hiện</label>}
        {err && <div className="err">{err}</div>}
        {done && <p className="good" style={{ color: 'var(--good, #4ade80)' }}>Đã thực hiện xong.</p>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          {!done && <button disabled={!ok || busy} onClick={() => void go()} style={danger ? { background: 'var(--bad)' } : undefined}>{busy ? 'Đang gửi…' : 'Thực hiện'}</button>}
          <button className="b" disabled={busy} onClick={() => onClose(done)}>{done ? 'Đóng' : 'Huỷ'}</button>
        </div>
      </div>
    </div>
  );
}
