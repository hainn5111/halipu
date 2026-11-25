import { lazy, Suspense, useState } from 'react';
import { RTU_LINK, rtuLinkBody, sendRtuLink } from '../../adapters/fonda';
import type { DeviceItem } from '../../core/types';
import { BodyJsonBox, canSend, finalBody, useBodyJson } from '../common/BodyJson';
import ConfirmWrite from '../common/ConfirmWrite';

// Phần GHI của tab Liên kết RTU (chỉ nạp ở bản preview/dev): gắn nhiều, gỡ, cấp điện nhiều. Payload bắt 2026-11-25 (docs/15 §7).
const SupplyLink = lazy(() => import('../devices/SupplyLink'));
type Dev = DeviceItem & { rtuId?: string };
export type LinkOp =
  | { kind: 'attach'; type: number; label: string; candidates: Dev[] }
  | { kind: 'unlink'; type: number; device: Dev }
  | { kind: 'supply'; type: number; label: string };

export default function RtuLinkOps({ pid, rtu, op, onClose }: { pid: string; rtu: DeviceItem; op: LinkOp; onClose: (changed: boolean) => void }) {
  if (op.kind === 'attach') return <AttachDialog pid={pid} rtu={rtu} type={op.type} label={op.label} candidates={op.candidates} onClose={onClose} />;
  if (op.kind === 'supply') return <Suspense fallback={null}><SupplyLink pid={pid} typeValue={op.type} typeLabel={op.label} defaultRtuId={rtu.id} onClose={onClose} /></Suspense>;
  const body = rtuLinkBody(RTU_LINK[op.type].kind, [op.device.id]);
  return <ConfirmWrite title={`Gỡ "${op.device.name || op.device.id}" khỏi RTU "${rtu.name}"`} summary="Gỡ liên kết (rtuId = null)." method="POST" path={RTU_LINK[op.type].path} body={body} danger
    onConfirm={async () => { await sendRtuLink(pid, op.type, body); }} onClose={onClose} />;
}

/** Gắn nhiều thiết bị cùng loại vào RTU (`<actor>/updateRtuId` nhận mảng id). Có khung JSON sửa tay + bỏ qua kiểm tra. */
function AttachDialog({ pid, rtu, type, label, candidates, onClose }: { pid: string; rtu: DeviceItem; type: number; label: string; candidates: Dev[]; onClose: (changed: boolean) => void }) {
  const [pick, setPick] = useState<Set<string>>(new Set()), [q, setQ] = useState(''), [skip, setSkip] = useState(false), [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const shown = candidates.filter(d => !q.trim() || `${d.name} ${d.uid}`.toLowerCase().includes(q.trim().toLowerCase()));
  const ids = [...pick], built = ids.length ? rtuLinkBody(RTU_LINK[type].kind, ids, { id: rtu.id, uid: rtu.uid }) : null;
  const bj = useBodyJson(built), sendOk = canSend(bj, built, !!built, skip);
  const toggle = (id: string) => setPick(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  if (confirm) return <ConfirmWrite title={`Gắn ${ids.length} ${label} vào RTU "${rtu.name}"`} summary="Liên kết thiết bị với RTU (rtuId)." method="POST" path={RTU_LINK[type].path} body={confirm}
    onConfirm={async () => { await sendRtuLink(pid, type, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 600, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Gắn {label} vào RTU "{rtu.name}"</h2>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><input style={{ flex: 1 }} placeholder="Lọc theo tên/UID" value={q} onChange={e => setQ(e.target.value)} />
          <button className="b" onClick={() => setPick(new Set(shown.map(d => d.id)))}>Chọn tất cả đang lọc</button><button className="b" onClick={() => setPick(new Set())}>Bỏ chọn</button></div>
        <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid var(--line)', borderRadius: 8, marginTop: 6, padding: 6 }}>
          {shown.map(d => <label key={d.id} style={{ display: 'block', fontSize: 13 }}><input type="checkbox" checked={pick.has(d.id)} onChange={() => toggle(d.id)} /> {d.name || d.id} <span className="sub">· {d.uid}{d.rtuId ? ' · đang gắn RTU khác' : ''}</span></label>)}
          {!shown.length && <p className="sub">Không có {label} nào để gắn.</p>}
        </div>
        <BodyJsonBox bj={bj} skip={skip} setSkip={setSkip} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!sendOk} onClick={() => { const b = skip ? (bj.dirty ? bj.parsed : bj.parsed ?? built) : finalBody(bj, built); if (b) setConfirm(b); }}>Xem trước & xác nhận…</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
