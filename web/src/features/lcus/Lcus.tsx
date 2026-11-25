import { lazy, Suspense, useEffect, useState } from 'react';
import { lcuRelatedCount } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import { useLcus } from '../../core/store';
import LcuPanel from '../lcu-panel/LcuPanel';

// Form thêm LCU chỉ nạp khi bật ghi (bản main không chứa mã).
const LcuCreate = WRITE_ENABLED ? lazy(() => import('./LcuCreate')) : null;
const LcuDelete = WRITE_ENABLED ? lazy(() => import('./LcuDelete')) : null;
const SupplyLink = WRITE_ENABLED ? lazy(() => import('../devices/SupplyLink')) : null;
const RtuLink = WRITE_ENABLED ? lazy(() => import('../devices/RtuLink')) : null;

export default function Lcus() {
  const { lcus, status, progress, error, selectedUid, load, select } = useLcus();
  useEffect(() => { void load(true); }, [load]);   // mở tab = tải lại danh sách
  const sel = lcus.find(l => l.uid === selectedUid);
  const [adding, setAdding] = useState(false), [msg, setMsg] = useState(''), [linking, setLinking] = useState(false);
  const [del, setDel] = useState<null | { lcuId: string; projectId: string; name: string; related: number }>(null);
  const [supply, setSupply] = useState(false);
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
          {WRITE_ENABLED && <> <button style={{ marginLeft: 12 }} onClick={() => setAdding(true)}>+ Thêm LCU…</button> <button className="b" disabled={!sel} onClick={() => void askDelete()}>Xoá LCU đã chọn…</button> <button className="b" disabled={!sel} onClick={() => setLinking(true)}>Liên kết RTU…</button> <button className="b" onClick={() => setSupply(true)}>Cấp điện từ RTU (nhiều LCU)…</button></>}</p>
        {msg && <div className="err">{msg}</div>}
        {status === 'error' && <div className="err">{error}</div>}
        <table><thead><tr><th>#</th><th>UID (luid)</th><th>Tên</th><th>Mã</th><th>lcuId</th><th>Dự án</th><th>Toạ độ</th></tr></thead>
          <tbody>{lcus.map((l, i) => (
            <tr key={l.uid} className={'lrow' + (l.uid === selectedUid ? ' sel' : '')} onClick={() => select(l.uid)}>
              <td>{i + 1}</td><td><b>{l.uid}</b></td><td>{l.name}</td><td>{l.code}</td><td>{l.lcuId}</td><td>{l.projectId.slice(0, 8)}</td>
              <td>{l.lat !== undefined ? `${l.lat.toFixed(5)}, ${l.lng!.toFixed(5)}` : '–'}</td></tr>))}</tbody></table>
      </div>
      {sel && <LcuPanel lcu={sel} onClose={() => select(null)} />}
      {adding && LcuCreate && pid && <Suspense fallback={null}><LcuCreate pid={pid} onClose={changed => { setAdding(false); if (changed) void load(true); }} /></Suspense>}
      {supply && SupplyLink && pid && <Suspense fallback={null}><SupplyLink pid={pid} typeValue={2} typeLabel="LCU" onClose={() => setSupply(false)} /></Suspense>}
      {linking && RtuLink && sel && <Suspense fallback={null}><RtuLink pid={sel.projectId} typeValue={2} deviceId={sel.lcuId} deviceName={sel.name || sel.uid} onClose={() => setLinking(false)} /></Suspense>}
      {del && LcuDelete && <Suspense fallback={null}><LcuDelete projectId={del.projectId} lcuId={del.lcuId} name={del.name} related={del.related} onClose={changed => { setDel(null); if (changed) { select(null); void load(true); } }} /></Suspense>}
    </div>
  );
}
