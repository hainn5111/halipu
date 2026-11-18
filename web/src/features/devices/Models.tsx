import { useEffect, useMemo, useState } from 'react';
import { listDeviceTypes, listModels, projectIds } from '../../adapters/fonda';
import { configEntries } from '../../adapters/fonda/mappers';
import type { DeviceModel, DeviceType } from '../../core/types';

// Mẫu thiết bị (template deviceConfig) — chỉ ĐỌC. Model nhóm theo loại thiết bị; bấm model để xem cấu hình / thiết bị đính kèm.
export default function Models() {
  const [types, setTypes] = useState<DeviceType[]>([]);
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const ts: DeviceType[] = [], ms: DeviceModel[] = [];
        for (const pid of await projectIds()) { ts.push(...await listDeviceTypes(pid)); ms.push(...await listModels(pid)); }
        if (!live) return;
        setTypes(ts); setModels(ms); setTypeId(ms[0]?.typeId ?? null);
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, []);

  const withModels = useMemo(() => {
    const count = new Map<string, number>(); for (const m of models) count.set(m.typeId, (count.get(m.typeId) ?? 0) + 1);
    return types.filter(t => count.has(t.id)).map(t => ({ t, n: count.get(t.id)! }));
  }, [types, models]);
  const list = models.filter(m => m.typeId === typeId);
  const sel = models.find(m => m.id === selId);
  const entries = useMemo(() => (sel ? configEntries(sel.config) : []), [sel]);

  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : `${models.length} model · ${withModels.length} loại thiết bị`}</p>
        {err && <div className="err">{err}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {withModels.map(({ t, n }) => <button key={t.id} className={t.id === typeId ? '' : 'b'} onClick={() => { setTypeId(t.id); setSelId(null); }}>{t.name} ({n})</button>)}
        </div>
        {typeId && (
          <table><thead><tr><th>#</th><th>Tên model</th><th>Mã model</th><th>Số trường cấu hình</th></tr></thead>
            <tbody>{list.map((m, i) => (
              <tr key={m.id} className={'lrow' + (m.id === selId ? ' sel' : '')} onClick={() => setSelId(m.id)}>
                <td>{i + 1}</td><td><b>{m.name}</b></td><td>{m.id.slice(0, 8)}</td><td>{configEntries(m.config).length}</td></tr>))}</tbody></table>
        )}
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
        </aside>
      )}
    </div>
  );
}
