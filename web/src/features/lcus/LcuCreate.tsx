import { useEffect, useState } from 'react';
import { listDeviceTypes, listModels, modelProtocols, previewLcuSave, sendLcuSave, type ModelProto } from '../../adapters/fonda';
import type { DeviceModel } from '../../core/types';
import ConfirmWrite from '../common/ConfirmWrite';

// Thêm LCU từ một model (GHI THẬT, chỉ preview): lcuActor/save theo payload đã bắt (docs/15 §7).
export default function LcuCreate({ pid, onClose }: { pid: string; onClose: (changed: boolean) => void }) {
  const [models, setModels] = useState<DeviceModel[]>([]), [protos, setProtos] = useState<Map<string, ModelProto>>(new Map());
  const [f, setF] = useState({ modelId: '', name: '', uid: '' });
  const [busy, setBusy] = useState(true), [err, setErr] = useState('');
  const [body, setBody] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const t = (await listDeviceTypes(pid)).find(x => x.value === 2); if (!t) throw new Error('Dự án không có loại LCU');
        const [ms, ps] = await Promise.all([listModels(pid), modelProtocols(pid, t.id)]);
        if (!live) return;
        const lcu = ms.filter(m => m.typeId === t.id && ps.has(m.id));
        setModels(lcu); setProtos(ps); setF(x => ({ ...x, modelId: lcu[0]?.id ?? '' }));
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [pid]);

  const proto = protos.get(f.modelId), uid = f.uid.trim().toUpperCase();
  const uidOk = /^[0-9A-F]{1,12}$/.test(uid), ok = !!proto && !!f.name.trim() && uidOk;
  if (body) return <ConfirmWrite title={`Thêm LCU "${f.name.trim()}"`} summary={`Model ${models.find(m => m.id === f.modelId)?.name}, UID ${uid}.`} method="POST" path="lcuActor/save" body={body}
    onConfirm={async () => { await sendLcuSave(pid, body); }} onClose={changed => { if (changed) onClose(true); else setBody(null); }} />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 520, maxWidth: '100%' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Thêm LCU</h2>
        {busy && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
        {!busy && !err && (<>
          <label style={{ display: 'block' }}><span className="sub">Model LCU</span>
            <select style={{ width: '100%' }} value={f.modelId} onChange={e => setF(x => ({ ...x, modelId: e.target.value }))}>{models.map(m => <option key={m.id} value={m.id}>{m.name} ({protos.get(m.id)?.name}, {String(m.config.lampHolderNum ?? '?')} đầu đèn)</option>)}</select></label>
          <p className="sub" style={{ margin: '4px 0 0' }}>Model do người dùng tạo bằng công cụ thử có thể bị server từ chối (code 1001); model khai báo từ Fonda thì được.</p>
          <label style={{ display: 'block', marginTop: 8 }}><span className="sub">Tên LCU</span><input style={{ width: '100%' }} value={f.name} onChange={e => setF(x => ({ ...x, name: e.target.value }))} /></label>
          <label style={{ display: 'block', marginTop: 8 }}><span className="sub">UID (hex 1–12 ký tự, chưa dùng)</span><input style={{ width: '100%' }} value={f.uid} onChange={e => setF(x => ({ ...x, uid: e.target.value }))} /></label>
          {f.uid && !uidOk && <div className="err">UID chỉ gồm 0–9, A–F, tối đa 12 ký tự</div>}
        </>)}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!ok} onClick={() => proto && setBody(previewLcuSave(pid, { modelId: f.modelId, name: f.name.trim(), uid, protocolValue: proto.value, protocolName: proto.name }))}>Xem trước & xác nhận…</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
