import { useEffect, useState } from 'react';
import { listDeviceTypes, listDevices, projectIds } from '../../adapters/fonda';
import type { DeviceItem, DeviceType } from '../../core/types';

// Thiết bị khác (RTU, gateway, cảm biến…): chỉ ĐỌC qua device/queryDevicePage, phân theo loại thiết bị của dự án.
// LCU có tab riêng nên bị loại khỏi danh sách loại.
const isLcu = (t: DeviceType) => /lcu/i.test(t.name);

interface Group { pid: string; types: DeviceType[] }

export default function Devices() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [sel, setSel] = useState<{ pid: string; type: DeviceType } | null>(null);
  const [items, setItems] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const out: Group[] = [];
        for (const pid of await projectIds()) out.push({ pid, types: (await listDeviceTypes(pid)).filter(t => !isLcu(t)) });
        if (live) setGroups(out);
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!sel) return;
    let live = true;
    setLoading(true); setErr(''); setItems([]);
    listDevices(sel.pid, sel.type.value).then(r => { if (live) setItems(r); }).catch(e => { if (live) setErr((e as Error).message); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [sel]);

  const none = !loading && !err && groups.every(g => g.types.length === 0);
  return (
    <div className="listwrap">
      <p className="sub">{loading ? 'Đang tải…' : sel ? `${sel.type.name}: ${items.length} thiết bị` : 'Chọn loại thiết bị'}</p>
      {err && <div className="err">{err}</div>}
      {none && <p className="sub">Dự án chưa có loại thiết bị nào khác LCU.</p>}
      {groups.map(g => (
        <div key={g.pid} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {g.types.map(t => {
            const on = sel?.pid === g.pid && sel.type.value === t.value;
            return <button key={t.value} className={on ? 'sel' : ''} onClick={() => setSel({ pid: g.pid, type: t })}>{t.name} <small>({t.value})</small></button>;
          })}
        </div>
      ))}
      {sel && !loading && (
        <table><thead><tr><th>#</th><th>UID</th><th>Tên</th><th>Mã</th><th>Model</th><th>Trạng thái</th><th>Toạ độ</th><th>Địa chỉ</th></tr></thead>
          <tbody>{items.map((d, i) => (
            <tr key={d.id || d.uid}><td>{i + 1}</td><td><b>{d.uid}</b></td><td>{d.name}</td><td>{d.code}</td><td>{d.model}</td><td>{d.status ?? '–'}</td>
              <td>{d.lat !== undefined ? `${d.lat.toFixed(5)}, ${d.lng!.toFixed(5)}` : '–'}</td><td>{d.address}</td></tr>))}</tbody></table>
      )}
    </div>
  );
}
