import { useState } from 'react';
import { projectIds } from '../../adapters/fonda';
import { runProbe, type ProbeOut } from '../../adapters/fonda/probe';
import { probeFileName } from '../../adapters/fonda/probeUtil';

// Dò API CHỈ ĐỌC ngay trong trình duyệt (không cần CI): bấm chạy → xem cấu trúc → tải JSON mẫu để gửi lại.
export default function Probe() {
  const [pid, setPid] = useState('');
  const [lcu, setLcu] = useState(true);
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [out, setOut] = useState<ProbeOut | null>(null);
  const [err, setErr] = useState('');

  async function run() {
    setBusy(true); setErr(''); setLines([]); setOut(null);
    try {
      const id = pid.trim() || (await projectIds())[0];
      if (!id) throw new Error('Không xác định được projectId');
      setLines([`Dự án: ${id}`]);
      setOut(await runProbe(id, l => setLines(a => [...a, l]), lcu));
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  const text = lines.join('\n');
  const download = () => {
    const blob = new Blob([JSON.stringify(out?.results ?? [], null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = probeFileName(); a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <div className="lcus"><div className="listwrap">
      <p className="sub">Chỉ đọc: chỉ gọi API truy vấn (query/page/get), không gửi lệnh đèn, không ghi dữ liệu.</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <input style={{ width: 300 }} placeholder="projectId (để trống = tự dò)" value={pid} onChange={e => setPid(e.target.value)} />
        <label><input type="checkbox" checked={lcu} onChange={e => setLcu(e.target.checked)} /> Dò quan hệ LCU ↔ model ↔ đèn ↔ cột (3 LCU đầu)</label>
        <button disabled={busy} onClick={() => void run()}>{busy ? 'Đang dò…' : 'Chạy dò'}</button>
        <button className="b" disabled={!out} onClick={download}>Tải JSON mẫu</button>
        <button className="b" disabled={!lines.length} onClick={() => void navigator.clipboard.writeText(text)}>Sao chép log</button>
      </div>
      {err && <div className="err">{err}</div>}
      <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', margin: 0 }}>{text}</pre>
    </div></div>
  );
}
