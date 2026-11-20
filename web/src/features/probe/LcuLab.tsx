import { useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listModels, modelProtocols, previewLcuModelClone, projectIds, sendModelCreate, type ModelProto } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import type { DeviceModel } from '../../core/types';
import ConfirmWrite from '../common/ConfirmWrite';
import { compareStored, parseBody, withFields } from './lcuLabUtil';
import { show } from '../common/show';

// THỬ NGHIỆM (GHI THẬT, chỉ preview): gửi deviceModel/saveNew cho model LCU với body JSON sửa tự do — để xem SERVER có chặn số đầu đèn /
// lcuType như form Fonda hay không. Chỉ gọi đúng một API (deviceModel/saveNew) và chỉ cho model LCU.
export default function LcuLab() {
  const [pid, setPid] = useState(''), [typeId, setTypeId] = useState('');
  const [models, setModels] = useState<DeviceModel[]>([]), [protos, setProtos] = useState<Map<string, ModelProto>>(new Map());
  const [baseId, setBaseId] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(true), [err, setErr] = useState('');
  const [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const [result, setResult] = useState<{ sent: Record<string, unknown>; stored: unknown } | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const id = (await projectIds())[0]; const types = await listDeviceTypes(id); const t = types.find(x => x.value === 2); if (!t) throw new Error('Dự án không có loại LCU');
        const [ms, ps] = await Promise.all([listModels(id), modelProtocols(id, t.id)]);
        if (!live) return;
        const lcu = ms.filter(m => m.typeId === t.id && ps.has(m.id));
        setPid(id); setTypeId(t.id); setModels(lcu); setProtos(ps); setBaseId(lcu[0]?.id ?? '');
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, []);

  const base = models.find(m => m.id === baseId), baseProto = protos.get(baseId);
  function load() {
    if (!base || !baseProto) return;
    setText(JSON.stringify(previewLcuModelClone(pid, { typeId, config: base.config, protocol: baseProto }, `LCU-lab-${Date.now().toString(36).slice(-4)}`, 'thử nghiệm không giới hạn'), null, 2));
    setResult(null);
  }
  const parsed = useMemo(() => (text ? parseBody(text) : null), [text]);
  const cur = useMemo(() => { try { const b = JSON.parse(text); return { name: show(b.deviceModelName ?? ''), holders: b.deviceConfig?.lampHolderNum as number | undefined, lcuType: b.deviceConfig?.lcuType as number | null | undefined }; } catch { return null; } }, [text]);
  const set = (f: Parameters<typeof withFields>[1]) => { const t = withFields(text, f); if (t) setText(t); };

  if (!WRITE_ENABLED) return <div className="lcus"><div className="listwrap"><p className="sub">Công cụ này chỉ có ở bản preview.</p></div></div>;
  return (
    <div className="lcus"><div className="listwrap" style={{ maxWidth: 920 }}>
      <p className="sub">Gửi <b>deviceModel/saveNew</b> cho model LCU với body sửa tự do để xem server có chấp nhận không (số đầu đèn, lcuType… không bị giới hạn ở đây). <b>Ghi thật lên Fonda — chỉ dùng dữ liệu thử.</b></p>
      {busy && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
      {!busy && !err && (<>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="sub" style={{ margin: 0 }}>Nạp body từ model:</span>
          <select value={baseId} onChange={e => setBaseId(e.target.value)}>{models.map(m => <option key={m.id} value={m.id}>{m.name} ({protos.get(m.id)?.name}, sys{protos.get(m.id)?.systemConfig ?? 0}, {show(m.config.lampHolderNum ?? '?')} đầu đèn)</option>)}</select>
          <button className="b" disabled={!base || !baseProto} onClick={load}>Nạp body</button>
        </div>
        {text && cur && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap', margin: '12px 0' }}>
            <label><span className="sub">Tên model</span><input value={cur.name} onChange={e => set({ name: e.target.value })} /></label>
            <label><span className="sub">Số đầu đèn (lampHolderNum)</span><input type="number" style={{ width: 120 }} value={cur.holders ?? ''} onChange={e => set({ lampHolderNum: Number(e.target.value) })} /></label>
            <label><span className="sub">lcuType</span><input type="number" style={{ width: 90 }} value={cur.lcuType ?? ''} onChange={e => set({ lcuType: e.target.value === '' ? null : Number(e.target.value) })} /></label>
          </div>)}
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Chọn model rồi bấm “Nạp body”, hoặc dán JSON body." style={{ width: '100%', height: 320, fontFamily: 'monospace', fontSize: 12 }} />
        {parsed && !parsed.ok && <div className="err">{parsed.reason}</div>}
        <div style={{ marginTop: 10 }}><button disabled={!parsed?.ok} onClick={() => parsed?.ok && setConfirm(parsed.body)}>Gửi thử lên server…</button></div>
        {result && (
          <div style={{ marginTop: 16 }}>
            <h3>Kết quả: server ĐÃ NHẬN — so sánh giá trị gửi và giá trị server lưu</h3>
            <table className="kv"><thead><tr><th>Trường</th><th>Đã gửi</th><th>Server lưu</th><th></th></tr></thead>
              <tbody>{compareStored(result.sent, result.stored).map(r => <tr key={r.field}><td>{r.field}</td><td>{show(r.sent)}</td><td>{show(r.stored)}</td><td>{r.same ? '✔ giống' : '✘ khác'}</td></tr>)}</tbody></table>
            <p className="sub">Mở Mẫu thiết bị → LCU để xem model mới. Nếu số đầu đèn lưu đúng như đã gửi thì Fonda chỉ khoá ở giao diện.</p>
          </div>)}
      </>)}
      {confirm && <ConfirmWrite title="Thử tạo model LCU (không giới hạn)" summary={`Gửi nguyên body bên dưới. Nếu server từ chối, thông báo lỗi hiện ở đây — đó chính là kết quả cần xem.`} method="POST" path="deviceModel/saveNew" body={confirm}
        onConfirm={async () => { const stored = await sendModelCreate(pid, confirm); setResult({ sent: confirm, stored }); }} onClose={() => setConfirm(null)} />}
    </div></div>
  );
}
