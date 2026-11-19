import { useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listFreeLcus, listModels, sendPoleCreate, type FreeLcu } from '../../adapters/fonda';
import { poleCreateBody } from '../../adapters/fonda/writeBodies';
import type { DeviceModel } from '../../core/types';
import ConfirmWrite from '../common/ConfirmWrite';

// Thêm cột (GHI THẬT): chọn template cột, nhập vị trí, chọn LCU CÓ SẴN chưa gắn cột và đặt tên/model/kênh cho đèn mới.
// Payload theo docs/15 §7 (poleActor/save, linkMode 2). Luôn qua hộp xác nhận.
export default function PoleCreate({ pid, onClose }: { pid: string; onClose: (changed: boolean) => void }) {
  const [poleModels, setPoleModels] = useState<DeviceModel[]>([]), [lampModels, setLampModels] = useState<DeviceModel[]>([]), [lcus, setLcus] = useState<FreeLcu[]>([]);
  const [loading, setLoading] = useState(true), [err, setErr] = useState('');
  const [f, setF] = useState({ model: '', name: '', code: '', lat: '', lng: '', address: '', lcu: '', lampModel: '', lampName: '', channel: 1 });
  const [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const set = (k: keyof typeof f, v: string | number) => setF(x => ({ ...x, [k]: v }));

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [types, models, free] = await Promise.all([listDeviceTypes(pid), listModels(pid), listFreeLcus(pid)]);
        const idsOf = (value: number) => new Set(types.filter(t => t.value === value).map(t => t.id));
        const poles = models.filter(m => idsOf(6).has(m.typeId)), lamps = models.filter(m => idsOf(5).has(m.typeId));
        if (!live) return;
        setPoleModels(poles); setLampModels(lamps); setLcus(free);
        setF(x => ({ ...x, model: poles[0]?.id ?? '', lampModel: lamps[0]?.id ?? '', lcu: free[0]?.id ?? '' }));
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, [pid]);

  const lcu = lcus.find(l => l.id === f.lcu);
  const built = useMemo(() => poleCreateBody({ projectId: pid, poleModelId: f.model, name: f.name, code: f.code, lat: f.lat, lng: f.lng, address: f.address,
    lcu: { deviceId: lcu?.id ?? '', uid: lcu?.uid ?? '', slots: lcu?.slots ?? 1 }, lamps: [{ modelId: f.lampModel, name: f.lampName, channel: Number(f.channel) }] }), [f, lcu, pid]);

  if (confirm) return <ConfirmWrite title={`Thêm cột "${f.name.trim()}"`} summary={`Template cột: ${poleModels.find(m => m.id === f.model)?.name}. Gắn LCU có sẵn ${lcu?.uid} (kênh ${f.channel}) và tạo đèn mới "${f.lampName.trim()}".`}
    method="POST" path="poleActor/save" body={confirm} onConfirm={async () => { await sendPoleCreate(pid, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  const field = (label: string, el: JSX.Element) => <label style={{ display: 'block', marginTop: 8 }}><span className="sub">{label}</span>{el}</label>;
  const sel = (k: keyof typeof f, items: Array<{ id: string; name: string }>) => <select style={{ width: '100%' }} value={String(f[k])} onChange={e => set(k, e.target.value)}>{items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select>;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 560, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Thêm cột đèn</h2>
        <p className="sub" style={{ margin: 0 }}>Gắn một LCU có sẵn (chưa gắn cột) và tạo một đèn mới trên kênh của LCU đó.</p>
        {loading && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
        {!loading && (<>
          {field('Template cột', sel('model', poleModels))}
          {field('Tên cột', <input style={{ width: '100%' }} value={f.name} onChange={e => set('name', e.target.value)} />)}
          {field('Mã cột (để trống = dùng tên)', <input style={{ width: '100%' }} value={f.code} onChange={e => set('code', e.target.value)} />)}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>{field('Vĩ độ (lat)', <input style={{ width: '100%' }} placeholder="20.93…" value={f.lat} onChange={e => set('lat', e.target.value)} />)}</div>
            <div style={{ flex: 1 }}>{field('Kinh độ (lng)', <input style={{ width: '100%' }} placeholder="105.66…" value={f.lng} onChange={e => set('lng', e.target.value)} />)}</div>
          </div>
          {field('Địa chỉ', <input style={{ width: '100%' }} value={f.address} onChange={e => set('address', e.target.value)} />)}
          <h3>LCU có sẵn</h3>
          {lcus.length ? field('Chọn LCU chưa gắn cột', <select style={{ width: '100%' }} value={f.lcu} onChange={e => set('lcu', e.target.value)}>{lcus.map(l => <option key={l.id} value={l.id}>{l.uid} — {l.name} ({l.model}, {l.slots} đầu đèn)</option>)}</select>) : <p className="err">Không có LCU nào chưa gắn cột. (Tạo LCU mới cùng cột chưa hỗ trợ.)</p>}
          <h3>Đèn mới</h3>
          {field('Model đèn', sel('lampModel', lampModels))}
          {field('Tên đèn', <input style={{ width: '100%' }} value={f.lampName} onChange={e => set('lampName', e.target.value)} />)}
          {field(`Kênh trên LCU (1..${lcu?.slots ?? 1})`, <input type="number" min={1} max={lcu?.slots ?? 1} style={{ width: 80 }} value={f.channel} onChange={e => set('channel', Number(e.target.value))} />)}
          {!built.ok && (f.name || f.lat || f.lampName) && <div className="err" style={{ marginTop: 10 }}>{built.reason}</div>}
        </>)}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!built.ok} onClick={() => built.ok && setConfirm(built.body)}>Xem trước & xác nhận…</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
