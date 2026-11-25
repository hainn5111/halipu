import { useEffect, useMemo, useState } from 'react';
import { listDevices, sendSupplyLink, supplyLinkBody } from '../../adapters/fonda';
import type { DeviceItem } from '../../core/types';
import { BodyJsonBox, canSend, finalBody, useBodyJson } from '../common/BodyJson';
import ConfirmWrite from '../common/ConfirmWrite';

// Cấp điện từ RTU cho NHIỀU thiết bị một lần: supplyElectricityDevice/relatedSuppLyElectricity (bắt 2026-11-25). GHI THẬT, chỉ preview.
export default function SupplyLink({ pid, typeValue, typeLabel, onClose }: { pid: string; typeValue: number; typeLabel: string; onClose: (changed: boolean) => void }) {
  const [rtus, setRtus] = useState<DeviceItem[]>([]), [devs, setDevs] = useState<DeviceItem[]>([]), [rtuId, setRtuId] = useState('');
  const [pick, setPick] = useState<Set<string>>(new Set()), [q, setQ] = useState(''), [busy, setBusy] = useState(true), [err, setErr] = useState('');
  const [skip, setSkip] = useState(false), [confirm, setConfirm] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    let live = true;
    (async () => {
      try { const [r, d] = await Promise.all([listDevices(pid, 4), listDevices(pid, typeValue)]); if (!live) return; setRtus(r); setDevs(d); setRtuId(r[0]?.id ?? ''); }
      catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [pid, typeValue]);
  const shown = useMemo(() => devs.filter(d => !q.trim() || `${d.name} ${d.uid} ${d.code}`.toLowerCase().includes(q.trim().toLowerCase())), [devs, q]);
  const ids = [...pick];
  const built = ids.length && rtuId ? supplyLinkBody(ids, typeValue, rtuId) : null;
  const bj = useBodyJson(built), sendOk = canSend(bj, built, !!built, skip);
  const toggle = (id: string) => setPick(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  if (confirm) return <ConfirmWrite title={`Cấp điện từ RTU "${rtus.find(r => r.id === rtuId)?.name ?? rtuId}" cho ${ids.length} ${typeLabel}`} summary="Gắn nhiều thiết bị vào RTU cấp điện bằng một lệnh." method="POST" path="supplyElectricityDevice/relatedSuppLyElectricity" body={confirm}
    onConfirm={async () => { await sendSupplyLink(pid, confirm); }} onClose={changed => { if (changed) onClose(true); else setConfirm(null); }} />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 620, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Cấp điện từ RTU — nhiều {typeLabel}</h2>
        {busy && <p className="sub">Đang tải…</p>}{err && <div className="err">{err}</div>}
        {!busy && !err && (<>
          <label className="sub" style={{ display: 'block' }}>RTU (Concentrator) cấp điện</label>
          {rtus.length ? <select style={{ width: '100%' }} value={rtuId} onChange={e => setRtuId(e.target.value)}>{rtus.map(r => <option key={r.id} value={r.id}>{r.name} — UID {r.uid}</option>)}</select> : <div className="err">Dự án chưa có RTU nào.</div>}
          <label className="sub" style={{ display: 'block', marginTop: 10 }}>Chọn {typeLabel} ({ids.length}/{devs.length})</label>
          <div style={{ display: 'flex', gap: 8 }}><input style={{ flex: 1 }} placeholder="Lọc theo tên/UID/mã" value={q} onChange={e => setQ(e.target.value)} />
            <button className="b" onClick={() => setPick(new Set(shown.map(d => d.id)))}>Chọn tất cả đang lọc</button><button className="b" onClick={() => setPick(new Set())}>Bỏ chọn</button></div>
          <div style={{ maxHeight: 240, overflow: 'auto', border: '1px solid var(--line)', borderRadius: 8, marginTop: 6, padding: 6 }}>
            {shown.map(d => <label key={d.id} style={{ display: 'block', fontSize: 13 }}><input type="checkbox" checked={pick.has(d.id)} onChange={() => toggle(d.id)} /> {d.name || d.id} <span className="sub">· {d.uid}</span></label>)}
            {!shown.length && <p className="sub">Không có {typeLabel} nào.</p>}
          </div>
          <BodyJsonBox bj={bj} skip={skip} setSkip={setSkip} />
        </>)}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button disabled={!sendOk} onClick={() => { const b = skip ? (bj.dirty ? bj.parsed : bj.parsed ?? built) : finalBody(bj, built); if (b) setConfirm(b); }}>Xem trước & xác nhận…</button>
          <button className="b" onClick={() => onClose(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
