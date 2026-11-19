import { useEffect, useMemo, useState } from 'react';
import { loadPoleCatalog, sendPoleCreate, type PoleCatalog } from '../../adapters/fonda';
import { poleCreateBody } from '../../adapters/fonda/writeBodies';
import ConfirmWrite from '../common/ConfirmWrite';
import GroupsEditor from './GroupsEditor';
import { emptyGroup, toInput, type GroupForm } from './groups';

// Thêm cột (GHI THẬT): template cột + vị trí + danh sách các bộ đèn–LCU (giống form Fonda). Payload theo docs/15 §7; luôn qua hộp xác nhận.
export default function PoleCreate({ pid, onClose }: { pid: string; onClose: (changed: boolean) => void }) {
  const [cat, setCat] = useState<PoleCatalog | null>(null), [err, setErr] = useState('');
  const [f, setF] = useState({ model: '', name: '', code: '', lat: '', lng: '', address: '' });
  const [groups, setGroups] = useState<GroupForm[]>([]);
  const [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  const set = (k: keyof typeof f, v: string) => setF(x => ({ ...x, [k]: v }));

  useEffect(() => {
    let live = true;
    loadPoleCatalog(pid).then(c => { if (!live) return; setCat(c); setF(x => ({ ...x, model: c.poleModels[0]?.id ?? '' })); setGroups([emptyGroup(c)]); }).catch(e => { if (live) setErr((e as Error).message); });
    return () => { live = false; };
  }, [pid]);

  const built = useMemo(() => cat ? poleCreateBody({ projectId: pid, poleModelId: f.model, name: f.name, code: f.code, lat: f.lat, lng: f.lng, address: f.address, groups: groups.map(g => toInput(g, cat)) }) : null, [cat, f, groups, pid]);
  if (confirm) return <ConfirmWrite title={`Thêm cột "${f.name.trim()}"`} summary={`Template cột: ${cat?.poleModels.find(m => m.id === f.model)?.name}. ${groups.length} bộ đèn–LCU.`}
    method="POST" path="poleActor/save" body={confirm} onConfirm={async () => { await sendPoleCreate(pid, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  const field = (label: string, el: JSX.Element) => <label style={{ display: 'block', marginTop: 8 }}><span className="sub">{label}</span>{el}</label>;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 680, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Thêm cột đèn</h2>
        <p className="sub" style={{ margin: 0 }}>Mỗi “bộ” là đèn kèm LCU (có sẵn / tạo mới) hoặc đèn gắn thẳng cột không LCU.</p>
        {!cat && !err && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
        {cat && (<>
          {field('Template cột', <select style={{ width: '100%' }} value={f.model} onChange={e => set('model', e.target.value)}>{cat.poleModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>)}
          {field('Tên cột', <input style={{ width: '100%' }} value={f.name} onChange={e => set('name', e.target.value)} />)}
          {field('Mã cột (để trống = dùng tên)', <input style={{ width: '100%' }} value={f.code} onChange={e => set('code', e.target.value)} />)}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>{field('Vĩ độ (lat)', <input style={{ width: '100%' }} placeholder="20.93…" value={f.lat} onChange={e => set('lat', e.target.value)} />)}</div>
            <div style={{ flex: 1 }}>{field('Kinh độ (lng)', <input style={{ width: '100%' }} placeholder="105.66…" value={f.lng} onChange={e => set('lng', e.target.value)} />)}</div>
          </div>
          {field('Địa chỉ', <input style={{ width: '100%' }} value={f.address} onChange={e => set('address', e.target.value)} />)}
          <h3>Các bộ đèn–LCU</h3>
          <GroupsEditor groups={groups} onChange={setGroups} catalog={cat} />
          {built && !built.ok && (f.name || f.lat) && <div className="err" style={{ marginTop: 10 }}>{built.reason}</div>}
        </>)}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!built?.ok} onClick={() => built?.ok && setConfirm(built.body)}>Xem trước & xác nhận…</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
