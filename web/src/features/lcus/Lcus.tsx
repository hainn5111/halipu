import { lazy, Suspense, useEffect, useState } from 'react';
import { lcuRelatedCount, sendLcuDelete } from '../../adapters/fonda';
import { lcuIdsBody } from '../../adapters/fonda/writeBodies';
import { WRITE_ENABLED } from '../../core/flags';
import ConfirmWrite from '../common/ConfirmWrite';
import { useLcus } from '../../core/store';
import LcuPanel from '../lcu-panel/LcuPanel';

// Form thêm LCU chỉ nạp khi bật ghi (bản main không chứa mã).
const LcuCreate = WRITE_ENABLED ? lazy(() => import('./LcuCreate')) : null;

export default function Lcus() {
  const { lcus, status, progress, error, selectedUid, load, select } = useLcus();
  useEffect(() => { void load(true); }, [load]);   // mở tab = tải lại danh sách
  const sel = lcus.find(l => l.uid === selectedUid);
  const [adding, setAdding] = useState(false), [msg, setMsg] = useState('');
  const [del, setDel] = useState<null | { body: unknown; lcuId: string; projectId: string; name: string }>(null);
  const pid = sel?.projectId ?? lcus[0]?.projectId ?? '';
  async function askDelete() {
    if (!sel) return;
    setMsg('');
    try {
      const n = await lcuRelatedCount(sel.projectId, sel.lcuId);
      if (n !== 0) { setMsg(`Fonda báo LCU còn ${n} thiết bị liên quan — không xoá. Gỡ khỏi cột/đèn trước.`); return; }
      setDel({ body: lcuIdsBody([sel.lcuId]), lcuId: sel.lcuId, projectId: sel.projectId, name: sel.name });
    } catch (e) { setMsg((e as Error).message); }
  }
  return (
    <div className="lcus">
      <div className="listwrap">
        <p id="s" className="sub">{status === 'loading' ? progress || 'Đang tải…' : status === 'error' ? '' : `${lcus.length} LCU`}
          {WRITE_ENABLED && <> <button style={{ marginLeft: 12 }} onClick={() => setAdding(true)}>+ Thêm LCU…</button> <button className="b" disabled={!sel} onClick={() => void askDelete()}>Xoá LCU đã chọn…</button></>}</p>
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
      {WRITE_ENABLED && del && <ConfirmWrite title={`Xoá LCU "${del.name}"`} summary="LCU không có thiết bị liên quan (đã kiểm tra bằng device/checkDeviceRelated). Xoá LCU xoá luôn bản ghi cấu hình, không hoàn tác. Body xoá theo quy ước của cột — chưa bắt từ web gốc, có thể bị từ chối." method="POST" path="lcuActor/delete" body={del.body} danger
        onConfirm={async () => { await sendLcuDelete(del.projectId, del.lcuId); }} onClose={changed => { setDel(null); if (changed) { select(null); void load(true); } }} />}
    </div>
  );
}
