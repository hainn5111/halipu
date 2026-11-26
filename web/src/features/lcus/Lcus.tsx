import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { lcuRelatedCount } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import { useLcus } from '../../core/store';
import LcuPanel from '../lcu-panel/LcuPanel';

// Form thêm LCU chỉ nạp khi bật ghi (bản main không chứa mã).
const LcuCreate = WRITE_ENABLED ? lazy(() => import('./LcuCreate')) : null;
const LcuDelete = WRITE_ENABLED ? lazy(() => import('./LcuDelete')) : null;

export default function Lcus() {
  const { lcus, status, progress, error, selectedUid, load, select } = useLcus();
  useEffect(() => { void load(true); }, [load]);   // mở tab = tải lại danh sách
  const sel = lcus.find(l => l.uid === selectedUid);
  // Hàng chục nghìn LCU: lọc + phân trang (chỉ vẽ một trang vào DOM)
  const PAGE = 200, [q, setQ] = useState(''), [page, setPage] = useState(0);
  const filtered = useMemo(() => { const t = q.trim().toLowerCase(); return t ? lcus.filter(l => `${l.name} ${l.uid} ${l.code} ${l.lcuId}`.toLowerCase().includes(t)) : lcus; }, [lcus, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE)), cur = Math.min(page, pages - 1), rows = filtered.slice(cur * PAGE, cur * PAGE + PAGE);
  const [adding, setAdding] = useState(false), [msg, setMsg] = useState('');
  const [del, setDel] = useState<null | { lcuId: string; projectId: string; name: string; related: number }>(null);
  const pid = sel?.projectId ?? lcus[0]?.projectId ?? '';
  async function askDelete() {
    if (!sel) return;
    setMsg('');
    try {
      const n = await lcuRelatedCount(sel.projectId, sel.lcuId);
      setDel({ lcuId: sel.lcuId, projectId: sel.projectId, name: sel.name, related: n });   // như Fonda: còn đối tượng liên quan vẫn xoá được (otype 1 = xoá cả đèn trong bộ)
    } catch (e) { setMsg((e as Error).message); }
  }
  return (
    <div className="lcus">
      <div className="listwrap">
        <p id="s" className="sub">{status === 'loading' ? progress || 'Đang tải…' : status === 'error' ? '' : `${lcus.length} LCU`}
          {WRITE_ENABLED && <> <button style={{ marginLeft: 12 }} onClick={() => setAdding(true)}>+ Thêm LCU…</button> <button className="b" disabled={!sel} onClick={() => void askDelete()}>Xoá LCU đã chọn…</button></>}</p>
        {msg && <div className="err">{msg}</div>}
        {status === 'error' && <div className="err">{error}</div>}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '6px 0', flexWrap: 'wrap' }}>
          <input style={{ width: 260 }} placeholder="Lọc theo tên / UID / mã / lcuId…" value={q} onChange={e => { setQ(e.target.value); setPage(0); }} />
          {q && <span className="sub" style={{ margin: 0 }}>{filtered.length} kết quả</span>}
          {pages > 1 && <><button className="b" disabled={cur === 0} onClick={() => setPage(cur - 1)}>‹</button><span className="sub" style={{ margin: 0 }}>Trang {cur + 1}/{pages} ({PAGE} dòng/trang)</span><button className="b" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>›</button></>}
        </div>
        <table><thead><tr><th>#</th><th>UID (luid)</th><th>Tên</th><th>Mã</th><th>lcuId</th><th>Dự án</th><th>Toạ độ</th></tr></thead>
          <tbody>{rows.map((l, i) => (
            <tr key={l.uid} className={'lrow' + (l.uid === selectedUid ? ' sel' : '')} onClick={() => select(l.uid)}>
              <td>{cur * PAGE + i + 1}</td><td><b>{l.uid}</b></td><td>{l.name}</td><td>{l.code}</td><td>{l.lcuId}</td><td>{l.projectId.slice(0, 8)}</td>
              <td>{l.lat !== undefined ? `${l.lat.toFixed(5)}, ${l.lng!.toFixed(5)}` : '–'}</td></tr>))}</tbody></table>
      </div>
      {sel && <LcuPanel lcu={sel} onClose={() => select(null)} />}
      {adding && LcuCreate && pid && <Suspense fallback={null}><LcuCreate pid={pid} onClose={changed => { setAdding(false); if (changed) void load(true); }} /></Suspense>}
      {del && LcuDelete && <Suspense fallback={null}><LcuDelete projectId={del.projectId} lcuId={del.lcuId} name={del.name} related={del.related} onClose={changed => { setDel(null); if (changed) { select(null); void load(true); } }} /></Suspense>}
    </div>
  );
}
