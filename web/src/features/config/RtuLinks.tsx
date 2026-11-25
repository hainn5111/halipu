import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listDevices, projectIds } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import type { DeviceItem } from '../../core/types';
import type { LinkOp } from './RtuLinkOps';

// Cấu hình › Liên kết RTU: quan hệ giữa RTU (Concentrator) và LCU / Công tơ / Switch (`rtuId` của thiết bị). Đọc: nhóm thiết bị theo `rtuId`; ghi (chỉ preview): gắn/gỡ (`<actor>/updateRtuId`),
// cấp điện cho nhiều LCU/điểm sáng (`relatedSuppLyElectricity`). Payload bắt 2026-11-25 (docs/15 §7).
const Ops = WRITE_ENABLED ? lazy(() => import('./RtuLinkOps')) : null;   // phần ghi chỉ nạp ở preview/dev
const KINDS = [{ type: 2, label: 'LCU' }, { type: 1, label: 'Công tơ' }, { type: 9, label: 'Switch and detection' }];
type Dev = DeviceItem & { rtuId?: string };

export default function RtuLinks() {
  const [pid, setPid] = useState(''), [rtus, setRtus] = useState<DeviceItem[]>([]), [devs, setDevs] = useState<Record<number, Dev[]>>({});
  const [sel, setSel] = useState<string | null>(null), [busy, setBusy] = useState(true), [err, setErr] = useState(''), [reload, setReload] = useState(0);
  const [op, setOp] = useState<LinkOp | null>(null);

  useEffect(() => {
    let live = true; setBusy(true); setErr('');
    (async () => {
      try {
        const id = (await projectIds())[0]; if (!id) throw new Error('Chưa có dự án');
        const types = await listDeviceTypes(id); const has = (v: number) => types.some(t => t.value === v);
        const [r, ...rest] = await Promise.all([has(4) ? listDevices(id, 4) : Promise.resolve([] as DeviceItem[]), ...KINDS.map(k => (has(k.type) ? listDevices(id, k.type) : Promise.resolve([] as DeviceItem[])))]);
        if (!live) return;
        const m: Record<number, Dev[]> = {}; KINDS.forEach((k, i) => { m[k.type] = rest[i].map(d => ({ ...d, rtuId: typeof d.raw.rtuId === 'string' && d.raw.rtuId ? d.raw.rtuId : undefined })); });
        setPid(id); setRtus(r); setDevs(m); setSel(s => (s && r.some(x => x.id === s) ? s : r[0]?.id ?? null));
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [reload]);

  const rtu = rtus.find(r => r.id === sel);
  const linked = (type: number) => (devs[type] ?? []).filter(d => rtu && d.rtuId === rtu.id);
  const counts = useMemo(() => Object.fromEntries(rtus.map(r => [r.id, KINDS.map(k => (devs[k.type] ?? []).filter(d => d.rtuId === r.id).length)])), [rtus, devs]);

  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : `${rtus.length} RTU (Concentrator)`}{WRITE_ENABLED && rtu && <> <button style={{ marginLeft: 12 }} onClick={() => setOp({ kind: 'supply', type: 2, label: 'LCU' })}>Cấp điện nhiều LCU…</button> <button className="b" onClick={() => setOp({ kind: 'supply', type: 6, label: 'điểm sáng' })}>Cấp điện nhiều điểm sáng…</button></>}</p>
        {err && <div className="err">{err}</div>}
        {!busy && !err && !rtus.length && <p className="sub">Dự án chưa có RTU (Concentrator).</p>}
        {rtus.length > 0 && <table><thead><tr><th>#</th><th>Tên</th><th>UID</th><th>LCU</th><th>Công tơ</th><th>Switch</th></tr></thead>
          <tbody>{rtus.map((r, i) => <tr key={r.id} className={'lrow' + (r.id === sel ? ' sel' : '')} onClick={() => setSel(r.id)}><td>{i + 1}</td><td><b>{r.name}</b></td><td>{r.uid}</td>{counts[r.id].map((n, j) => <td key={j}>{n}</td>)}</tr>)}</tbody></table>}
        <p className="sub">Thiết bị chưa gắn RTU nào: {KINDS.map(k => `${k.label} ${(devs[k.type] ?? []).filter(d => !d.rtuId).length}`).join(' · ') || '–'}.</p>
      </div>
      {rtu && (
        <aside className="drawer">
          <button className="x" onClick={() => setSel(null)}>✕</button>
          <h2>{rtu.name}</h2><p className="sub" style={{ margin: '4px 0 0' }}>UID {rtu.uid} · {rtu.model}</p>
          {KINDS.map(k => (
            <div key={k.type}>
              <h3>{k.label} đang gắn ({linked(k.type).length}){WRITE_ENABLED && <button className="b" style={{ marginLeft: 8, padding: '1px 8px', fontSize: 12 }} onClick={() => setOp({ kind: 'attach', type: k.type, label: k.label, candidates: (devs[k.type] ?? []).filter(x => x.rtuId !== rtu.id) })}>+ Gắn…</button>}</h3>
              {!linked(k.type).length && <p className="sub" style={{ margin: 0 }}>Chưa có.</p>}
              {linked(k.type).map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, padding: '2px 0' }}>
                  <span>{d.name || d.id} <span className="sub">· {d.uid}</span></span>
                  {WRITE_ENABLED && <button className="b" style={{ padding: '1px 8px', fontSize: 11 }} onClick={() => setOp({ kind: 'unlink', type: k.type, device: d })}>Gỡ…</button>}
                </div>))}
            </div>))}
        </aside>
      )}
      {op && Ops && rtu && <Suspense fallback={null}><Ops pid={pid} rtu={rtu} op={op} onClose={changed => { setOp(null); if (changed) setReload(n => n + 1); }} /></Suspense>}
    </div>
  );
}

