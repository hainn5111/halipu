import { useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listModels, modelProtocols, previewLcuSave, projectIds, sendLcuSave, type ModelProto } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import type { DeviceModel } from '../../core/types';
import ConfirmWrite from '../common/ConfirmWrite';

// THỬ NGHIỆM (GHI THẬT, chỉ preview): thêm LCU riêng lẻ từ MỘT MODEL BẤT KỲ (kể cả model form Fonda không cho chọn) bằng lcuActor/save,
// để xem server nhận hay từ chối. Chỉ gọi đúng lcuActor/save; body sửa tự do.
export default function LcuDeviceLab() {
  const [pid, setPid] = useState('');
  const [models, setModels] = useState<DeviceModel[]>([]), [protos, setProtos] = useState<Map<string, ModelProto>>(new Map());
  const [f, setF] = useState({ modelId: '', name: '', uid: '' });
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(true), [err, setErr] = useState('');
  const [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const [result, setResult] = useState<unknown>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const id = (await projectIds())[0]; const t = (await listDeviceTypes(id)).find(x => x.value === 2); if (!t) throw new Error('Dự án không có loại LCU');
        const [ms, ps] = await Promise.all([listModels(id), modelProtocols(id, t.id)]);
        if (!live) return;
        const lcu = ms.filter(m => m.typeId === t.id && ps.has(m.id));
        setPid(id); setModels(lcu); setProtos(ps); setF(x => ({ ...x, modelId: lcu[0]?.id ?? '' }));
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, []);

  const proto = protos.get(f.modelId);
  function build() {
    if (!proto) return;
    setText(JSON.stringify(previewLcuSave(pid, { modelId: f.modelId, name: f.name.trim(), uid: f.uid.trim().toUpperCase(), protocolValue: proto.value, protocolName: proto.name }), null, 2));
    setResult(null);
  }
  const parsed = useMemo(() => {
    if (!text) return null;
    try { const b = JSON.parse(text) as Record<string, unknown>; if (!b.deviceModelId || !String(b.deviceName ?? '').trim() || !b.uid || !b.projectId) return { ok: false as const, reason: 'Thiếu deviceModelId / deviceName / uid / projectId' }; return { ok: true as const, body: b }; }
    catch (e) { return { ok: false as const, reason: `JSON không hợp lệ: ${(e as Error).message}` }; }
  }, [text]);

  if (!WRITE_ENABLED) return <div className="lcus"><div className="listwrap"><p className="sub">Công cụ này chỉ có ở bản preview.</p></div></div>;
  return (
    <div className="lcus"><div className="listwrap" style={{ maxWidth: 920 }}>
      <p className="sub">Thêm <b>LCU riêng lẻ</b> (lcuActor/save) từ model bất kỳ — kể cả model mà form Fonda không cho chọn — để xem server nhận hay từ chối. <b>Ghi thật lên Fonda — chỉ dùng dữ liệu thử.</b></p>
      {busy && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
      {!busy && !err && (<>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
          <label><span className="sub">Model LCU</span>
            <select value={f.modelId} onChange={e => setF(x => ({ ...x, modelId: e.target.value }))}>{models.map(m => <option key={m.id} value={m.id}>{m.name} ({protos.get(m.id)?.name}, sys{protos.get(m.id)?.systemConfig ?? 0}, {String(m.config.lampHolderNum ?? '?')} đầu đèn)</option>)}</select></label>
          <label><span className="sub">Tên LCU</span><input value={f.name} onChange={e => setF(x => ({ ...x, name: e.target.value }))} /></label>
          <label><span className="sub">UID (hex, chưa dùng)</span><input value={f.uid} placeholder="vd 1234567898BD" onChange={e => setF(x => ({ ...x, uid: e.target.value }))} /></label>
          <button className="b" disabled={!f.modelId || !f.name.trim() || !f.uid.trim() || !proto} onClick={build}>Dựng body</button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Điền model, tên, UID rồi bấm “Dựng body”; có thể sửa tay JSON." style={{ width: '100%', height: 340, marginTop: 12, fontFamily: 'monospace', fontSize: 12 }} />
        {parsed && !parsed.ok && <div className="err">{parsed.reason}</div>}
        <div style={{ marginTop: 10 }}><button disabled={!parsed?.ok} onClick={() => parsed?.ok && setConfirm(parsed.body)}>Gửi thử lên server…</button></div>
        {result != null && <div style={{ marginTop: 16 }}><h3>Server ĐÃ NHẬN — dữ liệu trả về</h3><pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(result, null, 2)}</pre>
          <p className="sub">Mở “Danh sách LCU” hoặc dò lại để kiểm tra LCU mới và số kênh (maxchannel) của nó.</p></div>}
      </>)}
      {confirm && <ConfirmWrite title="Thử thêm LCU theo model" summary="Gửi nguyên body bên dưới. Nếu server từ chối, thông báo lỗi hiện ở đây — đó chính là kết quả cần xem." method="POST" path="lcuActor/save" body={confirm}
        onConfirm={async () => { setResult(await sendLcuSave(pid, confirm)); }} onClose={() => setConfirm(null)} />}
    </div></div>
  );
}
