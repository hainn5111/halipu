import { useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listModels, modelProtocols, previewModelClone, projectIds, sendModelCreate, type ModelProto } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import ConfirmWrite from '../common/ConfirmWrite';
import { configEntries, lcuSpec } from '../../adapters/fonda/mappers';
import type { DeviceModel, DeviceType } from '../../core/types';

// Mẫu thiết bị (template deviceConfig) — chỉ ĐỌC. Model nhóm theo loại thiết bị; bấm model để xem cấu hình / thiết bị đính kèm.
export default function Models() {
  const [types, setTypes] = useState<DeviceType[]>([]);
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [pid, setPid] = useState('');
  const [protos, setProtos] = useState<Map<string, ModelProto>>(new Map());
  const [err, setErr] = useState('');
  const [reload, setReload] = useState(0);
  const [cloneName, setCloneName] = useState('');
  const [confirm, setConfirm] = useState<null | { pid: string; body: Record<string, unknown> }>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const ts: DeviceType[] = [], ms: DeviceModel[] = [];
        const ps = await projectIds();
        for (const pid of ps) { ts.push(...await listDeviceTypes(pid)); ms.push(...await listModels(pid)); }
        if (!live) return;
        setTypes(ts); setModels(ms); setTypeId(t => t ?? ms[0]?.typeId ?? null); setPid(ps[0] ?? '');
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [reload]);

  const withModels = useMemo(() => {
    const count = new Map<string, number>(); for (const m of models) count.set(m.typeId, (count.get(m.typeId) ?? 0) + 1);
    return types.filter(t => count.has(t.id)).map(t => ({ t, n: count.get(t.id)! }));
  }, [types, models]);
  const list = models.filter(m => m.typeId === typeId);
  const curType = types.find(t => t.id === typeId);
  const isLcu = curType?.value === 2;   // LCU: số đầu đèn/thông số phần cứng cố định theo model → hiện bảng so sánh
  useEffect(() => {
    if (!isLcu || !typeId || !pid) return;
    let live = true; modelProtocols(pid, typeId).then(m => { if (live) setProtos(m); }).catch(() => { if (live) setProtos(new Map()); });
    return () => { live = false; };
  }, [isLcu, typeId, pid]);
  const sel = models.find(m => m.id === selId);
  const entries = useMemo(() => (sel ? configEntries(sel.config) : []), [sel]);

  const selType = types.find(t => t.id === sel?.typeId);
  const canClone = WRITE_ENABLED && !!sel && selType?.value === 6;   // chỉ loại Lamp Pole đã bắt payload (docs/15 §7)
  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : `${models.length} model · ${withModels.length} loại thiết bị`}</p>
        {err && <div className="err">{err}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {withModels.map(({ t, n }) => <button key={t.id} className={t.id === typeId ? '' : 'b'} onClick={() => { setTypeId(t.id); setSelId(null); }}>{t.name} ({n})</button>)}
        </div>
        {typeId && (<>
          <table><thead><tr><th>#</th><th>Tên model</th><th>Mã model</th>{isLcu ? <><th>Giao thức</th><th>Số đầu đèn</th><th>lcuType</th><th>loopType</th><th>Mức dim</th><th>Cờ chức năng bật</th><th>functionList</th></> : <th>Số trường cấu hình</th>}</tr></thead>
            <tbody>{list.map((m, i) => { const sp = isLcu ? lcuSpec(m.config) : null, pr = protos.get(m.id); return (
              <tr key={m.id} className={'lrow' + (m.id === selId ? ' sel' : '')} onClick={() => setSelId(m.id)}>
                <td>{i + 1}</td><td><b>{m.name}</b></td><td>{m.id.slice(0, 8)}</td>
                {sp ? <><td>{pr ? `${pr.name} ${pr.version}${pr.systemConfig ? ` · sys${pr.systemConfig}` : ''}` : '…'}</td><td><b>{sp.slots}</b></td><td>{sp.lcuType ?? '–'}</td><td>{sp.loopType ?? '–'}</td><td>{sp.dimming ?? '–'}</td><td>{sp.flagsOn.join(', ') || '–'} <span className="sub">/ {sp.flagsOn.length + sp.flagsOff.length} cờ</span></td><td>{sp.functions.join(',') || '–'}</td></> : <td>{configEntries(m.config).length}</td>}</tr>); })}</tbody></table>
          {isLcu && <p className="sub">Số đầu đèn (<code>lampHolderNum</code>) cố định theo model: LCU chỉ quản lý đúng ngần ấy đèn, dù khi khai bộ đèn–LCU có nhập nhiều hơn.</p>}
        </>)}
      </div>
      {sel && (
        <aside className="drawer">
          <button className="x" onClick={() => setSelId(null)}>✕</button>
          <h2>{sel.name}</h2>
          <h3>Cấu hình (deviceConfig)</h3>
          {!entries.length && <p className="sub">Không có trường cấu hình.</p>}
          <table className="kv"><tbody>
            {entries.filter(e => e.kind === 'value').map(e => e.kind === 'value' && <tr key={e.key}><td>{e.key}</td><td>{e.text}</td></tr>)}
          </tbody></table>
          {entries.some(e => e.kind === 'attached') && <h3>Thiết bị đính kèm theo template</h3>}
          {entries.map(e => e.kind === 'attached' && (
            <div key={e.key} style={{ marginBottom: 8 }}>
              <b>{e.key}</b>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{e.items.map((it, i) => (
                <li key={i} style={{ opacity: it.checked ? 1 : .55 }}>{it.checked ? '✔' : '○'} {it.name}{it.extra ? ` (${it.extra})` : ''}</li>))}</ul>
            </div>))}
          {WRITE_ENABLED && sel && (<>
            <h3>Nhân bản template (ghi thật · chỉ bản preview)</h3>
            {canClone ? (<>
              <input style={{ width: '100%' }} placeholder="Tên template mới" value={cloneName} onChange={e => setCloneName(e.target.value)} />
              <button style={{ marginTop: 8 }} disabled={!cloneName.trim()} onClick={() => setConfirm({ pid, body: previewModelClone(pid, { typeId: sel.typeId, typeValue: 6, config: sel.config }, cloneName.trim()) })}>Tạo bản sao…</button>
            </>) : <p className="sub">Chỉ hỗ trợ template cột đèn (Lamp Pole) — các loại khác chưa bắt được payload.</p>}
          </>)}
        </aside>
      )}
      {confirm && <ConfirmWrite title="Tạo template mới" summary={`Nhân bản "${sel?.name}" thành "${cloneName.trim()}" (cùng loại, cùng cấu hình).`} method="POST" path="deviceModel/saveNew" body={confirm.body}
        onConfirm={async () => { await sendModelCreate(confirm.pid, confirm.body); }} onClose={changed => { setConfirm(null); if (changed) { setCloneName(''); setSelId(null); setReload(n => n + 1); } }} />}
    </div>
  );
}
