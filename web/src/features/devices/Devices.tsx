import { useEffect, useState } from 'react';
import { listDeviceTypes, listDevices, projectIds } from '../../adapters/fonda';
import { categoryOf, type DeviceCat } from '../../adapters/fonda/mappers';
import type { DeviceItem } from '../../core/types';

// Chỉ ĐỌC. Mỗi tab = một nhóm loại thiết bị (theo tên loại).
interface Src { key: string; pid: string; label: string; load: () => Promise<DeviceItem[]> }

export default function DeviceTab({ cat }: { cat: DeviceCat }) {
  const [srcs, setSrcs] = useState<Src[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [items, setItems] = useState<DeviceItem[]>([]);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const out: Src[] = [];
        for (const pid of await projectIds()) {
          for (const t of await listDeviceTypes(pid)) if (categoryOf(t.name) === cat) out.push({ key: `${pid}:${t.value}`, pid, label: t.name, load: () => listDevices(pid, t.value) });
        }
        if (!live) return;
        setSrcs(out); setSel(out[0]?.key ?? null); if (!out.length) setBusy(false);
      } catch (e) { if (live) { setErr((e as Error).message); setBusy(false); } }
    })();
    return () => { live = false; };
  }, [cat]);

  useEffect(() => {
    const s = srcs.find(x => x.key === sel); if (!s) return;
    let live = true;
    setBusy(true); setErr(''); setItems([]);
    s.load().then(r => { if (live) setItems(r); }).catch(e => { if (live) setErr((e as Error).message); }).finally(() => { if (live) setBusy(false); });
    return () => { live = false; };
  }, [sel, srcs]);

  const cur = srcs.find(s => s.key === sel);
  const multi = new Set(srcs.map(s => s.pid)).size > 1;
  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : cur ? `${items.length} ${cur.label}` : ''}</p>
        {err && <div className="err">{err}</div>}
        {!busy && !err && !srcs.length && <p className="sub">Dự án không có thiết bị loại này.</p>}
        {srcs.length > 1 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {srcs.map(s => <button key={s.key} className={s.key === sel ? 'on' : ''} onClick={() => setSel(s.key)}>{s.label}{multi ? ` · ${s.pid.slice(0, 8)}` : ''}</button>)}
        </div>}
        {cur && !busy && (
          <table><thead><tr><th>#</th><th>UID</th><th>Tên</th><th>Mã</th><th>Model</th><th>Trạng thái</th><th>Toạ độ</th><th>Địa chỉ</th></tr></thead>
            <tbody>{items.map((d, i) => (
              <tr key={d.id || d.uid} className="lrow"><td>{i + 1}</td><td><b>{d.uid || '–'}</b></td><td>{d.name}</td><td>{d.code}</td><td>{d.model}</td><td>{d.status ?? '–'}</td>
                <td>{d.lat !== undefined ? `${d.lat.toFixed(5)}, ${d.lng!.toFixed(5)}` : '–'}</td><td>{d.address}</td></tr>))}</tbody></table>
        )}
      </div>
    </div>
  );
}
