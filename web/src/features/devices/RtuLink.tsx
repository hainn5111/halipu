import { useEffect, useState } from 'react';
import { listDevices, listDeviceTypes, RTU_LINK, rtuLinkBody, sendRtuLink } from '../../adapters/fonda';
import type { DeviceItem } from '../../core/types';
import { BodyJsonBox, canSend, finalBody, useBodyJson } from '../common/BodyJson';
import ConfirmWrite from '../common/ConfirmWrite';

// Gắn / gỡ thiết bị (LCU, Công tơ, Switch) vào RTU (Concentrator) — `*/updateRtuId` (bắt 2026-11-25). GHI THẬT, chỉ preview.
export default function RtuLink({ pid, typeValue, deviceId, deviceName, currentRtuId, onClose }: { pid: string; typeValue: number; deviceId: string; deviceName: string; currentRtuId?: string; onClose: (changed: boolean) => void }) {
  const kind = RTU_LINK[typeValue]?.kind;
  const [rtus, setRtus] = useState<DeviceItem[]>([]), [rtuId, setRtuId] = useState(''), [busy, setBusy] = useState(true), [err, setErr] = useState('');
  const [mode, setMode] = useState<'link' | 'unlink'>('link'), [skip, setSkip] = useState(false), [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const t = (await listDeviceTypes(pid)).find(x => x.value === 4); if (!t) throw new Error('Dự án không có loại Concentrator/RTU');
        const l = await listDevices(pid, 4); if (!live) return;
        setRtus(l); setRtuId(currentRtuId && l.some(r => r.id === currentRtuId) ? currentRtuId : l[0]?.id ?? '');
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [pid, currentRtuId]);

  const rtu = rtus.find(r => r.id === rtuId);
  const built = kind ? rtuLinkBody(kind, [deviceId], mode === 'link' && rtu ? { id: rtu.id, uid: rtu.uid } : undefined) : null;
  const bj = useBodyJson(built), formOk = mode === 'unlink' || !!rtu, sendOk = canSend(bj, built, formOk, skip);
  if (confirm) return <ConfirmWrite title={`${mode === 'link' ? 'Gắn' : 'Gỡ'} "${deviceName}" ${mode === 'link' ? 'vào' : 'khỏi'} RTU${mode === 'link' && rtu ? ` "${rtu.name}"` : ''}`} summary={`Thiết bị ${deviceId}.`} method="POST" path={RTU_LINK[typeValue].path} body={confirm}
    onConfirm={async () => { await sendRtuLink(pid, typeValue, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 560, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Liên kết RTU — {deviceName}</h2>
        <p className="sub" style={{ margin: 0 }}>Hiện gắn với RTU: <b>{currentRtuId ? (rtus.find(r => r.id === currentRtuId)?.name ?? currentRtuId) : 'chưa gắn'}</b></p>
        {busy && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
        {!busy && !err && (<>
          <div style={{ display: 'flex', gap: 14, margin: '10px 0' }}>
            <label><input type="radio" checked={mode === 'link'} onChange={() => setMode('link')} /> Gắn vào RTU</label>
            <label><input type="radio" checked={mode === 'unlink'} onChange={() => setMode('unlink')} /> Gỡ khỏi RTU</label>
          </div>
          {mode === 'link' && (rtus.length
            ? <select style={{ width: '100%' }} value={rtuId} onChange={e => setRtuId(e.target.value)}>{rtus.map(r => <option key={r.id} value={r.id}>{r.name} — UID {r.uid}</option>)}</select>
            : <div className="err">Dự án chưa có RTU (Concentrator) nào.</div>)}
          <BodyJsonBox bj={bj} skip={skip} setSkip={setSkip} />
        </>)}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!sendOk} onClick={() => { const b = skip ? (bj.dirty ? bj.parsed : bj.parsed ?? built) : finalBody(bj, built); if (b) setConfirm(b); }}>Xem trước & xác nhận…</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
