import { useState } from 'react';
import { sendLcuDeleteBody } from '../../adapters/fonda';
import { lcuDeleteBody } from '../../adapters/fonda/writeBodies';
import { BodyJsonBox, canSend, finalBody, useBodyJson } from '../common/BodyJson';
import ConfirmWrite from '../common/ConfirmWrite';

// Xoá LCU với lựa chọn xoá KÈM đèn trong bộ hay không (`otype`). Capture Fonda: otype 1 = xoá kèm đèn. otype 0 = ĐOÁN là chỉ xoá LCU (chưa kiểm chứng).
export default function LcuDelete({ projectId, lcuId, name, related, onClose }: { projectId: string; lcuId: string; name: string; related: number; onClose: (changed: boolean) => void }) {
  const [otype, setOtype] = useState(1), [skip, setSkip] = useState(false), [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const built = lcuDeleteBody([lcuId], otype), bj = useBodyJson(built), sendOk = canSend(bj, built, true, skip);
  if (confirm) return <ConfirmWrite title={`Xoá LCU "${name}"`} summary={`${related ? `LCU còn ${related} đối tượng liên quan (đèn trong bộ…). ` : ''}Không hoàn tác được.`} method="POST" path="lcuActor/delete" body={confirm} danger
    onConfirm={async () => { await sendLcuDeleteBody(projectId, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 560, maxWidth: '100%' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Xoá LCU — {name}</h2>
        <p className="sub" style={{ margin: 0 }}>{related ? `Fonda báo LCU còn ${related} đối tượng liên quan (đèn trong bộ).` : 'LCU không có đối tượng liên quan.'}</p>
        <div style={{ margin: '12px 0' }}>
          <label style={{ display: 'block' }}><input type="radio" checked={otype === 1} onChange={() => setOtype(1)} /> Xoá <b>kèm</b> các đèn trong bộ — <code>otype: 1</code> (đúng thao tác Fonda đã bắt)</label>
          <label style={{ display: 'block', marginTop: 6 }}><input type="radio" checked={otype === 0} onChange={() => setOtype(0)} /> Chỉ xoá LCU, <b>giữ đèn</b> — <code>otype: 0</code> <span className="sub">(đoán, chưa kiểm chứng — thử xem server nhận thế nào)</span></label>
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
