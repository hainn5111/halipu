import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listDevices, listModels, poleLinks, poleRelatedCount, previewPoleUpdate, projectIds, sendPoleDelete, sendPoleUpdate } from '../../adapters/fonda';
import { channelRows, lcuSlotCount } from '../../adapters/fonda/mappers';
import { poleIdsBody } from '../../adapters/fonda/writeBodies';
import { WRITE_ENABLED } from '../../core/flags';
import ConfirmWrite from '../common/ConfirmWrite';
// Form thêm điểm sáng chỉ nạp khi bật ghi: bản main không chứa mã này (hằng số WRITE_ENABLED được gập lúc build).
const PoleCreate = WRITE_ENABLED ? lazy(() => import('./PoleCreate')) : null;
// Thêm bộ vào điểm sáng có sẵn = PUT poleActor/update với bộ mới nối vào attributeDevice (đã bắt: bộ dùng LCU có sẵn). Lần thử đầu bị từ chối
// ("Parameter deviceId cannot be empty") vì thiếu `checkNum` ở đèn mới — đã sửa theo capture (docs/15 §7).
const ADD_GROUP_TO_EXISTING = true;
const PoleAddGroups = WRITE_ENABLED && ADD_GROUP_TO_EXISTING ? lazy(() => import('./PoleAddGroups')) : null;
import type { DeviceItem, PoleLamp, PoleLinks } from '../../core/types';

// Điểm sáng và liên kết (điểm sáng – LCU – đèn) — chỉ ĐỌC. Danh sách điểm sáng; bấm một điểm sáng để xem cái gì đang gắn trên nó:
// LCU kèm đèn theo kênh, đèn gắn thẳng vào điểm sáng (chưa có LCU), và thiết bị khác (camera, cảm biến…).
type Pole = DeviceItem & { pid: string };
const POLE_TYPE = /lamp\s*pole/i;

// Các kênh của một LCU: 1..slots, mỗi kênh một đèn hoặc "(trống)". Nguồn chuẩn là đèn của LCU (lcuLamps); thiếu thì dùng attributeDevice.
function ChannelStrip({ lcuSlots, lcuLamps, attrLamps }: { lcuSlots?: number; lcuLamps?: PoleLamp[]; attrLamps: PoleLamp[] }) {
  const lamps = lcuLamps?.length ? lcuLamps : attrLamps.filter(l => l.checked);
  const slots = lcuSlotCount(lcuSlots, undefined, lamps.map(l => l.channel));
  const rows = channelRows(slots, lamps);
  const attrIds = new Set(attrLamps.filter(l => l.checked).map(l => l.id)), lcuIds = new Set((lcuLamps ?? []).map(l => l.id));
  const diff = lcuLamps?.length && (lcuLamps.some(l => !attrIds.has(l.id)) || attrLamps.some(l => l.checked && !lcuIds.has(l.id)));
  return (
    <div style={{ marginTop: 4 }}>
      <div className="sub" style={{ margin: '0 0 4px' }}>{lamps.length}/{slots} kênh có đèn</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 8px', fontSize: 13 }}>
        {rows.map(r => (<span key={r.channel} style={{ display: 'contents' }}>
          <span style={{ color: 'var(--muted)' }}>kênh {r.channel}</span>
          <span>{r.lamps.map(l => `${l.name}${l.model ? ` — ${l.model}` : ''}`).join(' · ') || <i style={{ color: 'var(--muted)' }}>(trống)</i>}</span>
        </span>))}
      </div>
      {diff && <div className="sub" style={{ margin: '4px 0 0', color: 'var(--bad)' }}>Đèn của LCU khác danh sách trên điểm sáng — đang hiện theo dữ liệu của LCU.</div>}
    </div>
  );
}

export default function Poles() {
  const [poles, setPoles] = useState<Pole[]>([]);
  const [models, setModels] = useState<Map<string, { name: string; slots?: number }>>(new Map());
  const [sel, setSel] = useState<Pole | null>(null);
  const [links, setLinks] = useState<PoleLinks | null>(null);
  const [busy, setBusy] = useState(true), [linkBusy, setLinkBusy] = useState(false);
  const [err, setErr] = useState(''), [linkErr, setLinkErr] = useState('');

  const [reload, setReload] = useState(0);
  const [edit, setEdit] = useState({ name: '', code: '' });
  const [confirm, setConfirm] = useState<null | { title: string; summary: string; method: string; path: string; body: unknown; danger?: boolean; run: () => Promise<void> }>(null);
  const [writeMsg, setWriteMsg] = useState(''), [listMsg, setListMsg] = useState('');
  const [adding, setAdding] = useState(false), [addingGroups, setAddingGroups] = useState(false);
  const [pids, setPids] = useState<string[]>([]);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const ps: Pole[] = [], ms = new Map<string, { name: string; slots?: number }>();
        const all = await projectIds(); if (live) setPids(all);
        for (const pid of all) {
          for (const m of await listModels(pid)) ms.set(m.id, { name: m.name, slots: Number(m.config.lampHolderNum) || undefined });
          for (const t of await listDeviceTypes(pid)) if (POLE_TYPE.test(t.name)) ps.push(...(await listDevices(pid, t.value)).map(d => ({ ...d, pid })));
        }
        if (live) { setPoles(ps); setModels(ms); }
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [reload]);

  const modelName = useMemo(() => (id: string) => models.get(id)?.name ?? '', [models]);
  const modelSlots = useMemo(() => (id: string) => models.get(id)?.slots, [models]);
  useEffect(() => {
    if (!sel) { setLinks(null); return; }
    setEdit({ name: sel.name, code: sel.code }); setWriteMsg(''); setListMsg('');
    let live = true;
    setLinkBusy(true); setLinkErr(''); setLinks(null);
    poleLinks(sel.pid, sel.id, modelName, modelSlots).then(r => { if (live) setLinks(r); }).catch(e => { if (live) setLinkErr((e as Error).message); }).finally(() => { if (live) setLinkBusy(false); });
    return () => { live = false; };
  }, [sel, modelName, modelSlots]);

  async function askUpdate() {
    if (!sel) return;
    setWriteMsg('');
    try {
      const r = await previewPoleUpdate(sel.pid, sel.id, { deviceName: edit.name.trim(), deviceCode: edit.code.trim() });
      if (!r.ok) { setWriteMsg(r.reason); return; }
      setConfirm({ title: `Sửa điểm sáng "${sel.name}"`, summary: `Tên: "${edit.name.trim()}" · Mã: "${edit.code.trim()}". Các LCU/đèn đang gắn được gửi lại nguyên vẹn.`, method: 'PUT', path: 'poleActor/update', body: r.body, run: async () => { await sendPoleUpdate(sel.pid, r.body); } });
    } catch (e) { setWriteMsg((e as Error).message); }
  }
  async function askRemoveGroup(i: number) {
    if (!sel) return;
    setWriteMsg('');
    try {
      const r = await previewPoleUpdate(sel.pid, sel.id, {}, [], [i]);
      if (!r.ok) { setWriteMsg(r.reason); return; }
      setConfirm({ title: `Gỡ bộ #${i + 1} khỏi điểm sáng "${sel.name}"`, summary: 'Đánh dấu bộ này là remove:true (đúng cách web Fonda gốc gỡ; bộ có LCU hay không đều như nhau). Chưa rõ Fonda xoá luôn đèn/LCU hay chỉ gỡ khỏi điểm sáng — kiểm tra lại sau khi thực hiện.', method: 'PUT', path: 'poleActor/update', body: r.body, danger: true, run: async () => { await sendPoleUpdate(sel.pid, r.body); } });
    } catch (e) { setWriteMsg((e as Error).message); }
  }
  async function askDelete() {
    if (!sel || !links) return;
    setListMsg('');
    if (links.groups.length > 0 || links.others.length > 0) { setListMsg('Điểm sáng còn thiết bị gắn trên đó — không xoá (chưa kiểm chứng việc xoá điểm sáng có LCU/đèn). Gỡ thiết bị trước.'); return; }
    try {
      const n = await poleRelatedCount(sel.pid, sel.id);
      if (n !== 0) { setListMsg(`Fonda báo điểm sáng còn ${n} thiết bị liên quan — không xoá.`); return; }
      setConfirm({ title: `Xoá điểm sáng "${sel.name}"`, summary: 'Điểm sáng không có thiết bị liên quan (đã kiểm tra bằng device/checkDeviceRelated). Không hoàn tác được.', method: 'POST', path: 'poleActor/delete', body: poleIdsBody([sel.id]), danger: true, run: async () => { await sendPoleDelete(sel.pid, sel.id); } });
    } catch (e) { setListMsg((e as Error).message); }
  }

  const lampCount = links?.groups.reduce((n, g) => n + (g.lcuLamps?.length ? g.lcuLamps.length : g.lamps.filter(l => l.checked).length), 0) ?? 0;
  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : `${poles.length} điểm sáng`}{WRITE_ENABLED && <button style={{ marginLeft: 12 }} onClick={() => setAdding(true)}>+ Thêm điểm sáng…</button>}{WRITE_ENABLED && <button className="b" style={{ marginLeft: 8 }} disabled={!sel || !links} title={sel ? '' : 'Chọn một điểm sáng trong danh sách'} onClick={() => void askDelete()}>Xoá điểm sáng đã chọn…</button>}</p>
        {listMsg && <div className="err">{listMsg}</div>}
        {err && <div className="err">{err}</div>}
        {!busy && !err && !poles.length && <p className="sub">Dự án chưa có điểm sáng.</p>}
        {poles.length > 0 && (
          <table><thead><tr><th>#</th><th>Tên</th><th>Mã</th><th>Model điểm sáng</th><th>Toạ độ</th><th>Địa chỉ</th></tr></thead>
            <tbody>{poles.map((p, i) => (
              <tr key={p.id} className={'lrow' + (p.id === sel?.id ? ' sel' : '')} onClick={() => setSel(p)}>
                <td>{i + 1}</td><td><b>{p.name}</b></td><td>{p.code}</td><td>{p.model}</td>
                <td>{p.lat !== undefined ? `${p.lat.toFixed(5)}, ${p.lng!.toFixed(5)}` : '–'}</td><td>{p.address}</td></tr>))}</tbody></table>
        )}
      </div>
      {sel && (
        <aside className="drawer">
          <button className="x" onClick={() => setSel(null)}>✕</button>
          <h2>{sel.name}</h2>
          <p className="sub" style={{ margin: '4px 0 0' }}>{sel.model}{sel.address ? ` · ${sel.address}` : ''}</p>
          {linkBusy && <p className="sub">Đang đọc liên kết…</p>}
          {linkErr && <div className="err">{linkErr}</div>}
          {links && <>
            <div style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '4px 12px 10px', marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h3 style={{ margin: '8px 0' }}>Gắn trên điểm sáng ({links.groups.filter(g => g.lcu).length} LCU · {lampCount} đèn)</h3>
              {WRITE_ENABLED && PoleAddGroups && <button className="b" onClick={() => setAddingGroups(true)}>+ Thêm bộ đèn–LCU…</button>}
            </div>
            {!links.groups.length && <p className="sub">Chưa có thiết bị nào gắn trên điểm sáng này.</p>}
            {links.groups.map((g, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `3px solid ${g.lcu ? 'var(--accent)' : 'var(--line)'}` }}>
                <b>{g.lcu ? `LCU ${g.lcu.uid}` : 'LCU N/A'}</b>{WRITE_ENABLED && <button className="b" style={{ marginLeft: 8, padding: '1px 8px', fontSize: 11 }} onClick={() => void askRemoveGroup(i)}>Gỡ bộ…</button>}
                <div className="sub" style={{ margin: 0 }}>{g.lcu ? `${g.lcu.model}${g.lcu.slots ? ` · ${g.lcu.slots} đầu đèn` : ''}` : 'Đèn gắn thẳng điểm sáng (chưa gắn LCU)'}</div>
                {g.lcu
                  ? <ChannelStrip lcuSlots={g.lcu.slots} lcuLamps={g.lcuLamps} attrLamps={g.lamps} />
                  : <div style={{ marginTop: 4 }}>
                      <div className="sub" style={{ margin: '0 0 4px' }}>{g.lamps.filter(l => l.checked).length}/1 đèn</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 8px', fontSize: 13 }}>
                        {g.lamps.map(l => (<span key={l.id} style={{ display: 'contents', opacity: l.checked ? 1 : .5 }}>
                          <span style={{ color: 'var(--muted)' }}>kênh N/A</span>
                          <span>{l.name}{l.model ? ` — ${l.model}` : ''}{l.checked ? '' : ' (ô chưa chọn)'}</span>
                        </span>))}
                      </div>
                    </div>}
              </div>))}
            {links.others.length > 0 && <h3>Thiết bị khác gắn trên điểm sáng</h3>}
            {links.others.map(o => <div key={o.kind}><b>{o.kind}</b> ({o.items.length}): {o.items.map(x => x.name).join(', ')}</div>)}
            </div>
          </>}
          {WRITE_ENABLED && sel && (<>
            <h3>Sửa điểm sáng (ghi thật · chỉ bản preview)</h3>
            <label className="sub" style={{ display: 'block' }}>Tên</label><input style={{ width: '100%' }} value={edit.name} onChange={e => setEdit(v => ({ ...v, name: e.target.value }))} />
            <label className="sub" style={{ display: 'block', marginTop: 8 }}>Mã</label><input style={{ width: '100%' }} value={edit.code} onChange={e => setEdit(v => ({ ...v, code: e.target.value }))} />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button disabled={!links || !edit.name.trim() || (edit.name === sel.name && edit.code === sel.code)} onClick={() => void askUpdate()}>Lưu thay đổi…</button>
            </div>
            {writeMsg && <div className="err" style={{ marginTop: 8 }}>{writeMsg}</div>}
          </>)}
        </aside>
      )}
      {adding && PoleCreate && <Suspense fallback={null}><PoleCreate pid={pids[0] ?? ''} onClose={changed => { setAdding(false); if (changed) setReload(n => n + 1); }} /></Suspense>}
      {addingGroups && sel && PoleAddGroups && <Suspense fallback={null}><PoleAddGroups pid={sel.pid} poleId={sel.id} poleName={sel.name} onClose={changed => { setAddingGroups(false); if (changed) { setSel(null); setReload(n => n + 1); } }} /></Suspense>}
      {confirm && <ConfirmWrite {...confirm} onConfirm={confirm.run} onClose={changed => { setConfirm(null); if (changed) { setSel(null); setReload(n => n + 1); } }} />}
    </div>
  );
}
