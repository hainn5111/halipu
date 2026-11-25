import { useEffect, useMemo, useState } from 'react';
import { loadPoleCatalog, previewPoleUpdate, sendPoleUpdate, type PoleCatalog } from '../../adapters/fonda';
import ConfirmWrite from '../common/ConfirmWrite';
import GroupsEditor from './GroupsEditor';
import { emptyGroup, toInput, type GroupForm } from './groups';

// Thêm bộ đèn–LCU vào điểm sáng ĐÃ CÓ (GHI THẬT): đọc đối tượng điểm sáng, nối thêm bộ mới vào attributeDevice rồi PUT poleActor/update.
export default function PoleAddGroups({ pid, poleId, poleName, onClose }: { pid: string; poleId: string; poleName: string; onClose: (changed: boolean) => void }) {
  const [cat, setCat] = useState<PoleCatalog | null>(null), [err, setErr] = useState('');
  const [groups, setGroups] = useState<GroupForm[]>([]);
  const [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const [reason, setReason] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    loadPoleCatalog(pid).then(c => { if (live) { setCat(c); setGroups([emptyGroup(c)]); } }).catch(e => { if (live) setErr((e as Error).message); });
    return () => { live = false; };
  }, [pid]);
  const inputs = useMemo(() => (cat ? groups.map(g => toInput(g, cat)) : []), [cat, groups]);

  async function preview() {
    setBusy(true); setReason('');
    try { const r = await previewPoleUpdate(pid, poleId, {}, inputs); if (r.ok) setConfirm(r.body); else setReason(r.reason); }
    catch (e) { setReason((e as Error).message); } finally { setBusy(false); }
  }
  if (confirm) return <ConfirmWrite title={`Thêm bộ vào điểm sáng "${poleName}"`} summary={`${groups.length} bộ mới được nối vào danh sách bộ hiện có của điểm sáng (các bộ cũ gửi lại nguyên vẹn).`}
    method="PUT" path="poleActor/update" body={confirm} onConfirm={async () => { await sendPoleUpdate(pid, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 680, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Thêm bộ đèn–LCU vào "{poleName}"</h2>
        <p className="sub" style={{ margin: '4px 0 0' }}>Đã được Fonda chấp nhận: bộ dùng <b>LCU có sẵn</b>. Bộ <b>không LCU</b> và <b>LCU mới</b> khi thêm vào điểm sáng có sẵn: chưa xác nhận — nếu lỗi, gửi thông báo lỗi.</p>
        {!cat && !err && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
        {cat && <GroupsEditor groups={groups} onChange={setGroups} catalog={cat} />}
        {reason && <div className="err" style={{ marginTop: 10 }}>{reason}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!cat || !groups.length || busy} onClick={() => void preview()}>{busy ? 'Đang đọc điểm sáng…' : 'Xem trước & xác nhận…'}</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
