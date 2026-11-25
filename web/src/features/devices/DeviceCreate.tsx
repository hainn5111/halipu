import { useEffect, useMemo, useState } from 'react';
import { DEVICE_CREATE, kmDetectSaveBody, listDeviceTypes, listModels, meterSaveBody, modelProtocols, rtuSaveBody, sendDeviceCreate, smartBoxSaveBody, type ModelProto } from '../../adapters/fonda';
import { RTU_CHANNELS, uidHexError } from '../../adapters/fonda/writeBodies';
import type { DeviceModel } from '../../core/types';
import ConfirmWrite from '../common/ConfirmWrite';
import MapPicker from '../common/MapPicker';

// THÊM THIẾT BỊ từ model (GHI THẬT, chỉ preview): Concentrator/RTU, Công tơ, Gateway, Switch and detection — payload bắt 2026-11-25 (docs/15 §7).
const names = (prefix: string, n: number) => Array.from({ length: Math.max(0, n) }, (_, i) => `${prefix}${i + 1}`);
const int = (v: unknown, d: number) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.floor(n) : d; };

export default function DeviceCreate({ pid, typeValue, typeLabel, onClose }: { pid: string; typeValue: number; typeLabel: string; onClose: (changed: boolean) => void }) {
  const kind = DEVICE_CREATE[typeValue]?.kind;
  const [models, setModels] = useState<DeviceModel[]>([]), [protos, setProtos] = useState<Map<string, ModelProto>>(new Map());
  const [busy, setBusy] = useState(true), [err, setErr] = useState('');
  const [f, setF] = useState({ modelId: '', name: '', code: '', uid: '', lat: '', lng: '', address: '', mType: '2', madd: '255', kadd: '255', remark: '', km: '4', di: '', ai: '' });
  const [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const set = (k: keyof typeof f, v: string) => setF(x => ({ ...x, [k]: v }));

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const t = (await listDeviceTypes(pid)).find(x => x.value === typeValue); if (!t) throw new Error('Dự án không có loại này');
        const [ms, ps] = await Promise.all([listModels(pid), modelProtocols(pid, t.id)]);
        if (!live) return;
        const list = ms.filter(m => m.typeId === t.id);
        setModels(list); setProtos(ps); setF(x => ({ ...x, modelId: list[0]?.id ?? '' }));
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [pid, typeValue]);

  const model = models.find(m => m.id === f.modelId), proto = protos.get(f.modelId);
  const rtuType = Number(model?.config.rtuType);
  const lay = RTU_CHANNELS[rtuType] ?? { km: 4, di: 6, ai: 2 };
  // RTU: số kênh theo rtuType của model (tên sửa được); Switch: số kênh theo ô nhập (mặc định theo model)
  const [rtu, setRtu] = useState<{ km: Array<{ name: string; enabled: number }>; di: string[]; ai: string[] }>({ km: [], di: [], ai: [] });
  useEffect(() => { setRtu({ km: names('KM', lay.km).map(name => ({ name, enabled: 1 })), di: names('DI', lay.di), ai: names('AI', lay.ai) }); }, [f.modelId, lay.km, lay.di, lay.ai]);   // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (kind === 'switch' && model) setF(x => ({ ...x, km: String(Math.min(int(model.config.pathNum, 4), 20)), di: String(int(model.config.di, 0) || ''), ai: String(int(model.config.ai, 0) || '') })); }, [f.modelId]);   // eslint-disable-line react-hooks/exhaustive-deps

  const problem = useMemo(() => {
    if (!model) return 'Chưa chọn model';
    if (!f.name.trim()) return 'Thiếu tên thiết bị';
    if ((kind === 'rtu' || kind === 'gateway')) { const e = uidHexError(f.uid); if (e) return e; }
    if (kind === 'rtu' && (!f.lat.trim() || !f.lng.trim())) return 'Chọn vị trí trên bản đồ';
    if (kind === 'gateway' && !(proto && proto.value >= 0)) return 'Model chưa có giao thức';
    if (kind === 'meter' && !(Number.isFinite(Number(f.madd)) && Number(f.madd) >= 0)) return 'Địa chỉ công tơ (madd) không hợp lệ';
    return '';
  }, [model, f, kind, proto]);

  function build(): Record<string, unknown> | null {
    if (problem || !model) return null;
    const base = { projectId: pid, modelId: model.id, name: f.name.trim() };
    if (kind === 'rtu') return rtuSaveBody({ ...base, code: f.code.trim(), uid: f.uid, lat: f.lat, lng: f.lng, address: f.address, kms: rtu.km, dis: rtu.di.map(name => ({ name })), ais: rtu.ai.map(name => ({ name })) });
    if (kind === 'meter') return meterSaveBody({ ...base, code: f.code.trim(), mType: Number(f.mType), madd: Number(f.madd), remark: f.remark });
    if (kind === 'gateway') return smartBoxSaveBody({ ...base, uid: f.uid, protocolValue: proto!.value });
    return kmDetectSaveBody({ ...base, code: f.code.trim(), kadd: Number(f.kadd), km: names('KM', int(f.km, 0)), di: names('DI', int(f.di, 0)), ai: names('AI', int(f.ai, 0)) });
  }
  const label = (t: string, el: JSX.Element) => <label style={{ display: 'block', marginTop: 8 }}><span className="sub">{t}</span>{el}</label>;
  const inp = (k: keyof typeof f, ph = '') => <input style={{ width: '100%' }} value={f[k]} placeholder={ph} onChange={e => set(k, e.target.value)} />;

  if (confirm) return <ConfirmWrite title={`Thêm ${typeLabel} "${f.name.trim()}"`} summary={`Model ${model?.name}.`} method="POST" path={DEVICE_CREATE[typeValue].path} body={confirm}
    onConfirm={async () => { await sendDeviceCreate(pid, typeValue, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 640, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Thêm thiết bị — {typeLabel}</h2>
        {busy && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
        {!busy && !err && (<>
          {!models.length && <div className="err">Loại này chưa có model — tạo template ở nhóm "Mẫu thiết bị" trước.</div>}
          {label('Model', <select style={{ width: '100%' }} value={f.modelId} onChange={e => set('modelId', e.target.value)}>{models.map(m => <option key={m.id} value={m.id}>{m.name}{protos.get(m.id)?.name ? ` (${protos.get(m.id)?.name})` : ''}</option>)}</select>)}
          {label('Tên thiết bị', inp('name'))}
          {kind !== 'gateway' && label(kind === 'meter' ? 'Mã thiết bị (deviceCode)' : 'Mã (không bắt buộc)', inp('code'))}
          {(kind === 'rtu' || kind === 'gateway') && label('UID (hex, tối đa 16 ký tự — Fonda đệm 0 phía trước)', inp('uid'))}
          {kind === 'meter' && (<div style={{ display: 'flex', gap: 8 }}><div style={{ flex: 1 }}>{label('mType (loại đo, capture: 2)', inp('mType'))}</div><div style={{ flex: 1 }}>{label('madd (địa chỉ công tơ, capture: 255)', inp('madd'))}</div></div>)}
          {kind === 'meter' && label('Ghi chú', inp('remark'))}
          {kind === 'rtu' && (<>
            <div style={{ display: 'flex', gap: 8 }}><div style={{ flex: 1 }}>{label('Vĩ độ', inp('lat'))}</div><div style={{ flex: 1 }}>{label('Kinh độ', inp('lng'))}</div></div>
            <p className="sub" style={{ margin: '6px 0 0' }}>Bấm lên bản đồ để đặt vị trí.</p>
            <MapPicker lat={f.lat} lng={f.lng} onPick={(la, ln) => setF(x => ({ ...x, lat: la, lng: ln }))} />
            {label('Địa chỉ', inp('address'))}
            <h3 style={{ marginBottom: 4 }}>Kênh ({Number.isFinite(rtuType) && RTU_CHANNELS[rtuType] ? `theo loại RTU ${rtuType}` : 'mặc định 4 DO · 6 DI · 2 AI'})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 6 }}>
              {rtu.km.map((k, i) => <label key={'k' + i} style={{ fontSize: 12 }}><input type="checkbox" checked={!!k.enabled} onChange={e => setRtu(r => ({ ...r, km: r.km.map((x, j) => j === i ? { ...x, enabled: e.target.checked ? 1 : 0 } : x) }))} /> DO {i + 1}<input style={{ width: '100%' }} value={k.name} onChange={e => setRtu(r => ({ ...r, km: r.km.map((x, j) => j === i ? { ...x, name: e.target.value } : x) }))} /></label>)}
              {rtu.di.map((n, i) => <label key={'d' + i} style={{ fontSize: 12 }}>DI {i + 1}<input style={{ width: '100%' }} value={n} onChange={e => setRtu(r => ({ ...r, di: r.di.map((x, j) => j === i ? e.target.value : x) }))} /></label>)}
              {rtu.ai.map((n, i) => <label key={'a' + i} style={{ fontSize: 12 }}>AI {rtu.di.length + i + 1}<input style={{ width: '100%' }} value={n} onChange={e => setRtu(r => ({ ...r, ai: r.ai.map((x, j) => j === i ? e.target.value : x) }))} /></label>)}
            </div>
          </>)}
          {kind === 'switch' && (<>
            {label('kadd (địa chỉ, capture: 255)', inp('kadd'))}
            <div style={{ display: 'flex', gap: 8 }}><div style={{ flex: 1 }}>{label('Số km', inp('km'))}</div><div style={{ flex: 1 }}>{label('Số di', inp('di'))}</div><div style={{ flex: 1 }}>{label('Số ai', inp('ai'))}</div></div>
            <p className="sub" style={{ margin: '4px 0 0' }}>Mặc định theo model (`pathNum`, `di`, `ai`); tên kênh tự đặt KM1…, DI1…, AI1….</p>
          </>)}
          {problem && <div className="err" style={{ marginTop: 10 }}>{problem}</div>}
        </>)}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!!problem} onClick={() => { const b = build(); if (b) setConfirm(b); }}>Xem trước & xác nhận…</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
