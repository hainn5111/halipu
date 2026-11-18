import { useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listDevices, listModels, poleLinks, projectIds } from '../../adapters/fonda';
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

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const ps: Pole[] = [], ms = new Map<string, string>();
        for (const pid of await projectIds()) {
          for (const m of await listModels(pid)) ms.set(m.id, m.name);
          for (const t of await listDeviceTypes(pid)) if (POLE_TYPE.test(t.name)) ps.push(...(await listDevices(pid, t.value)).map(d => ({ ...d, pid })));
        }
        if (live) { setPoles(ps); setModels(ms); }
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, []);

  const modelName = useMemo(() => (id: string) => models.get(id) ?? '', [models]);
  useEffect(() => {
    if (!sel) { setLinks(null); return; }
    let live = true;
    setLinkBusy(true); setLinkErr(''); setLinks(null);
    poleLinks(sel.pid, sel.id, modelName).then(r => { if (live) setLinks(r); }).catch(e => { if (live) setLinkErr((e as Error).message); }).finally(() => { if (live) setLinkBusy(false); });
    return () => { live = false; };
  }, [sel, modelName]);

  const lampCount = links?.groups.reduce((n, g) => n + g.lamps.length, 0) ?? 0;
  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : `${poles.length} cột đèn`}</p>
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
        </aside>
      )}
    </div>
  );
}
