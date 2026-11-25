import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { DEVICE_CREATE } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import { countDevices, listDeviceTypes, listDevices, projectIds } from '../../adapters/fonda';
import { categoryOf, type DeviceCat } from '../../adapters/fonda/mappers';
import type { DeviceItem } from '../../core/types';

// Chỉ ĐỌC. Mỗi tab = một nhóm loại thiết bị (theo tên loại). Chip hiện số thiết bị; cột nào không có dữ liệu thì ẩn;
// bấm một hàng để xem toàn bộ trường API trả về.
// Thêm thiết bị từ model: chỉ nạp khi bật ghi (bản main không chứa mã này)
const DeviceCreate = WRITE_ENABLED ? lazy(() => import('./DeviceCreate')) : null;
interface Src { key: string; pid: string; label: string; value: number }

export default function DeviceTab({ cat }: { cat: DeviceCat }) {
  const [srcs, setSrcs] = useState<Src[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [items, setItems] = useState<DeviceItem[]>([]);
  const [row, setRow] = useState<DeviceItem | null>(null);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState(''), [adding, setAdding] = useState(false), [reload, setReload] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const out: Src[] = [];   // "Thiết bị khác" bỏ Lamp Pole (loại 6): đã có tab "Điểm sáng và liên kết" (cùng dữ liệu, đầy đủ hơn); vẫn giữ Lamps (5)
        for (const pid of await projectIds()) for (const t of await listDeviceTypes(pid)) if (categoryOf(t.name) === cat && !(cat === 'other' && t.value === 6)) out.push({ key: `${pid}:${t.value}`, pid, label: t.name, value: t.value });
        if (!live) return;
        setSrcs(out); setBusy(false);
        // Đếm dần số thiết bị từng loại (4 luồng); chọn loại có thiết bị đầu tiên
        const got: Record<string, number> = {}; let next = 0, first: string | null = null;
        await Promise.all(Array.from({ length: 4 }, async () => {
          while (live && next < out.length) {
            const s = out[next++];
            try { got[s.key] = await countDevices(s.pid, s.value); } catch { got[s.key] = 0; }
            if (live) setCounts({ ...got });
          }
        }));
        if (live) { first = out.find(s => got[s.key] > 0)?.key ?? out[0]?.key ?? null; setSel(first); }
      } catch (e) { if (live) { setErr((e as Error).message); setBusy(false); } }
    })();
    return () => { live = false; };
  }, [cat]);

  const cur = srcs.find(s => s.key === sel);
  useEffect(() => {
    if (!cur) return;
    let live = true;
    setBusy(true); setErr(''); setItems([]); setRow(null);
    listDevices(cur.pid, cur.value).then(r => { if (live) setItems(r); }).catch(e => { if (live) setErr((e as Error).message); }).finally(() => { if (live) setBusy(false); });
    return () => { live = false; };
  }, [cur?.key, reload]);   // eslint-disable-line react-hooks/exhaustive-deps

  const has = useMemo(() => ({
    uid: items.some(d => d.uid), code: items.some(d => d.code), model: items.some(d => d.model), status: items.some(d => d.status !== undefined),
    geo: items.some(d => d.lat !== undefined), addr: items.some(d => d.address),
  }), [items]);
  const multi = new Set(srcs.map(s => s.pid)).size > 1;
  const shown = srcs.filter(s => srcs.length <= 12 || counts[s.key] !== 0);   // nhiều loại: ẩn loại rỗng cho gọn

  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : cur ? `${items.length} ${cur.label}` : ''}{DeviceCreate && cur && DEVICE_CREATE[cur.value] && <button style={{ marginLeft: 12 }} onClick={() => setAdding(true)}>+ Thêm thiết bị…</button>}</p>
        {err && <div className="err">{err}</div>}
        {!busy && !err && !srcs.length && <p className="sub">Dự án không có loại thiết bị này.</p>}
        {shown.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {shown.map(s => <button key={s.key} className={s.key === sel ? '' : 'b'} onClick={() => setSel(s.key)}>{s.label}{s.key in counts ? ` (${counts[s.key]})` : ''}{multi ? ` · ${s.pid.slice(0, 8)}` : ''}</button>)}
        </div>}
        {cur && !busy && items.length > 0 && (
          <table><thead><tr><th>#</th>{has.uid && <th>UID</th>}<th>Tên</th>{has.code && <th>Mã</th>}{has.model && <th>Model</th>}{has.status && <th>Trạng thái</th>}{has.geo && <th>Toạ độ</th>}{has.addr && <th>Địa chỉ</th>}</tr></thead>
            <tbody>{items.map((d, i) => (
              <tr key={d.id || d.uid} className={'lrow' + (row === d ? ' sel' : '')} onClick={() => setRow(d)}>
                <td>{i + 1}</td>{has.uid && <td><b>{d.uid || '–'}</b></td>}<td>{d.name}</td>{has.code && <td>{d.code}</td>}{has.model && <td>{d.model}</td>}{has.status && <td>{d.status ?? '–'}</td>}
                {has.geo && <td>{d.lat !== undefined ? `${d.lat.toFixed(5)}, ${d.lng!.toFixed(5)}` : '–'}</td>}{has.addr && <td>{d.address}</td>}</tr>))}</tbody></table>
        )}
        {cur && !busy && !err && items.length === 0 && <p className="sub">Loại này chưa có thiết bị.</p>}
      </div>
      {row && (
        <aside className="drawer">
          <button className="x" onClick={() => setRow(null)}>✕</button>
          <h2>{row.name || row.id}</h2>
          <h3>Toàn bộ trường API trả về</h3>
          <table className="kv"><tbody>{Object.entries(row.raw).filter(([, v]) => v !== null && v !== '').map(([k, v]) => <tr key={k}><td>{k}</td><td>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</td></tr>)}</tbody></table>
        </aside>
      )}
      {adding && DeviceCreate && cur && <Suspense fallback={null}><DeviceCreate pid={cur.pid} typeValue={cur.value} typeLabel={cur.label} onClose={changed => { setAdding(false); if (changed) setReload(n => n + 1); }} /></Suspense>}
    </div>
  );
}
