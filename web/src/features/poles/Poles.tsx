import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listDevices, listModels, poleLinks, poleRelatedCount, previewPoleUpdate, projectIds, sendPoleDelete, sendPoleUpdate } from '../../adapters/fonda';
import { poleIdsBody } from '../../adapters/fonda/writeBodies';
import { WRITE_ENABLED } from '../../core/flags';
import ConfirmWrite from '../common/ConfirmWrite';
// Form thêm cột chỉ nạp khi bật ghi: bản main không chứa mã này (hằng số WRITE_ENABLED được gập lúc build).
const PoleCreate = WRITE_ENABLED ? lazy(() => import('./PoleCreate')) : null;
// Thêm bộ vào cột CÓ SẴN qua poleActor/update bị Fonda từ chối ("Parameter deviceId cannot be empty", code 1005): update dường như chỉ nhận
// các phần tử đã có deviceId. Tắt nút cho tới khi bắt được cách web Fonda gốc thêm bộ vào cột đã có (docs/15 §7).
const ADD_GROUP_TO_EXISTING = false;
const PoleAddGroups = WRITE_ENABLED && ADD_GROUP_TO_EXISTING ? lazy(() => import('./PoleAddGroups')) : null;
import type { DeviceItem, PoleLinks } from '../../core/types';

// Cột đèn & liên kết — chỉ ĐỌC. Danh sách cột; bấm một cột để xem cái gì đang gắn trên nó:
// LCU kèm đèn theo kênh, đèn gắn thẳng vào cột (chưa có LCU), và thiết bị khác (camera, cảm biến…).
type Pole = DeviceItem & { pid: string };
const POLE_TYPE = /lamp\s*pole/i;

export default function Poles() {
  const [poles, setPoles] = useState<Pole[]>([]);
  const [models, setModels] = useState<Map<string, string>>(new Map());
  const [sel, setSel] = useState<Pole | null>(null);
  const [links, setLinks] = useState<PoleLinks | null>(null);
  const [busy, setBusy] = useState(true), [linkBusy, setLinkBusy] = useState(false);
  const [err, setErr] = useState(''), [linkErr, setLinkErr] = useState('');

  const [reload, setReload] = useState(0);
  const [edit, setEdit] = useState({ name: '', code: '' });
  const [confirm, setConfirm] = useState<null | { title: string; summary: string; method: string; path: string; body: unknown; danger?: boolean; run: () => Promise<void> }>(null);
  const [writeMsg, setWriteMsg] = useState('');
  const [adding, setAdding] = useState(false), [addingGroups, setAddingGroups] = useState(false);
  const [pids, setPids] = useState<string[]>([]);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const ps: Pole[] = [], ms = new Map<string, string>();
        const all = await projectIds(); if (live) setPids(all);
        for (const pid of all) {
          for (const m of await listModels(pid)) ms.set(m.id, m.name);
          for (const t of await listDeviceTypes(pid)) if (POLE_TYPE.test(t.name)) ps.push(...(await listDevices(pid, t.value)).map(d => ({ ...d, pid })));
        }
        if (live) { setPoles(ps); setModels(ms); }
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [reload]);

  const modelName = useMemo(() => (id: string) => models.get(id) ?? '', [models]);
  useEffect(() => {
    if (!sel) { setLinks(null); return; }
    setEdit({ name: sel.name, code: sel.code }); setWriteMsg('');
    let live = true;
    setLinkBusy(true); setLinkErr(''); setLinks(null);
    poleLinks(sel.pid, sel.id, modelName).then(r => { if (live) setLinks(r); }).catch(e => { if (live) setLinkErr((e as Error).message); }).finally(() => { if (live) setLinkBusy(false); });
    return () => { live = false; };
  }, [sel, modelName]);

  async function askUpdate() {
    if (!sel) return;
    setWriteMsg('');
    try {
      const r = await previewPoleUpdate(sel.pid, sel.id, { deviceName: edit.name.trim(), deviceCode: edit.code.trim() });
      if (!r.ok) { setWriteMsg(r.reason); return; }
      setConfirm({ title: `Sửa cột "${sel.name}"`, summary: `Tên: "${edit.name.trim()}" · Mã: "${edit.code.trim()}". Các LCU/đèn đang gắn được gửi lại nguyên vẹn.`, method: 'PUT', path: 'poleActor/update', body: r.body, run: async () => { await sendPoleUpdate(sel.pid, r.body); } });
    } catch (e) { setWriteMsg((e as Error).message); }
  }
  async function askDelete() {
    if (!sel || !links) return;
    setWriteMsg('');
    if (links.groups.length > 0 || links.others.length > 0) { setWriteMsg('Cột còn thiết bị gắn trên đó — không xoá (chưa kiểm chứng việc xoá cột có LCU/đèn). Gỡ thiết bị trước.'); return; }
    try {
      const n = await poleRelatedCount(sel.pid, sel.id);
      if (n !== 0) { setWriteMsg(`Fonda báo cột còn ${n} thiết bị liên quan — không xoá.`); return; }
      setConfirm({ title: `Xoá cột "${sel.name}"`, summary: 'Cột không có thiết bị liên quan (đã kiểm tra bằng device/checkDeviceRelated). Không hoàn tác được.', method: 'POST', path: 'poleActor/delete', body: poleIdsBody([sel.id]), danger: true, run: async () => { await sendPoleDelete(sel.pid, sel.id); } });
    } catch (e) { setWriteMsg((e as Error).message); }
  }

  const lampCount = links?.groups.reduce((n, g) => n + g.lamps.length, 0) ?? 0;
  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : `${poles.length} cột đèn`}{WRITE_ENABLED && <button style={{ marginLeft: 12 }} onClick={() => setAdding(true)}>+ Thêm cột…</button>}</p>
        {err && <div className="err">{err}</div>}
        {!busy && !err && !poles.length && <p className="sub">Dự án chưa có cột đèn.</p>}
        {poles.length > 0 && (
          <table><thead><tr><th>#</th><th>Tên</th><th>Mã</th><th>Model cột</th><th>Toạ độ</th><th>Địa chỉ</th></tr></thead>
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
            <h3>Gắn trên cột ({links.groups.filter(g => g.lcu).length} LCU · {lampCount} đèn)</h3>
            {!links.groups.length && <p className="sub">Chưa có thiết bị nào gắn trên cột này.</p>}
            {links.groups.map((g, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `3px solid ${g.lcu ? 'var(--accent)' : 'var(--line)'}` }}>
                <b>{g.lcu ? `LCU ${g.lcu.uid}` : 'Đèn chưa gắn LCU'}</b>
                {g.lcu && <div className="sub" style={{ margin: 0 }}>{g.lcu.model}{g.lcu.slots ? ` · ${g.lcu.slots} đầu đèn` : ''}</div>}
                <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  {g.lamps.map(l => <li key={l.id}>{g.lcu ? `kênh ${l.channel}: ` : ''}{l.name}{l.model ? ` — ${l.model}` : ''}</li>)}
                </ul>
              </div>))}
            {links.others.length > 0 && <h3>Thiết bị khác gắn trên cột</h3>}
            {links.others.map(o => <div key={o.kind}><b>{o.kind}</b> ({o.items.length}): {o.items.map(x => x.name).join(', ')}</div>)}
          </>}
          {WRITE_ENABLED && sel && (<>
            <h3>Sửa / xoá (ghi thật · chỉ bản preview)</h3>
            <label className="sub" style={{ display: 'block' }}>Tên</label><input style={{ width: '100%' }} value={edit.name} onChange={e => setEdit(v => ({ ...v, name: e.target.value }))} />
            <label className="sub" style={{ display: 'block', marginTop: 8 }}>Mã</label><input style={{ width: '100%' }} value={edit.code} onChange={e => setEdit(v => ({ ...v, code: e.target.value }))} />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button disabled={!links || !edit.name.trim() || (edit.name === sel.name && edit.code === sel.code)} onClick={() => void askUpdate()}>Lưu thay đổi…</button>
              {PoleAddGroups && <button className="b" disabled={!links} onClick={() => setAddingGroups(true)}>+ Thêm bộ đèn–LCU…</button>}
              <button className="b" disabled={!links} onClick={() => void askDelete()}>Xoá cột…</button>
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
