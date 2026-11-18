import { useCallback, useEffect, useRef, useState } from 'react';
import { lightStatus, trend, unicast } from '../../adapters/fonda';
import { toCsv } from '../../adapters/fonda/mappers';
import { useRealtime } from '../../core/realtime';
import type { LampCommand, Lcu, LightStatus, Measurement } from '../../core/types';

const NAMES: Record<LampCommand, string> = { turnOn: 'BẬT', turnOff: 'TẮT', dimming: 'ĐẶT ĐỘ SÁNG' };
const fmt = (v: number | undefined) => (v === undefined ? '–' : String(v));
const clock = (at: number) => new Date(at).toLocaleTimeString();

function statusLine(s: LightStatus, rated?: number): string {
  const pct = rated && s.power !== undefined ? Math.round((s.power / rated) * 100) : null;
  return `Đo lúc ${s.time}: công suất ${fmt(s.power)} W${pct !== null ? ` (≈${pct}% định mức ${rated} W)` : ''} · ${fmt(s.voltage)} V · ${fmt(s.current)} A · cosφ ${fmt(s.pf)} · lux ${fmt(s.lux)} · lỗi ${fmt(s.fault)} · lastAction ${fmt(s.lastAction)}, lastSource ${fmt(s.lastSource)}`;
}

/** Bảng điều khiển 1 LCU: điều khiển, trạng thái, lịch sử (server). Dùng chung cho GIS và tab LCU. */
export default function LcuPanel({ lcu, onClose }: { lcu: Lcu; onClose: () => void }) {
  const [num, setNum] = useState(1), [dim, setDim] = useState(50);
  const [msg, setMsg] = useState<{ text: string; kind: '' | 'good' | 'bad' }>({ text: '', kind: '' });
  const [status, setStatus] = useState<{ text: string; kind: '' | 'good' | 'bad' }>({ text: 'Waiting....', kind: '' });
  const [histOpen, setHistOpen] = useState(false), [days, setDays] = useState(1);
  const [hist, setHist] = useState<{ state: 'idle' | 'loading' | 'ok' | 'err'; rows: Measurement[]; err: string }>({ state: 'idle', rows: [], err: '' });
  const [busy, setBusy] = useState(false);
  const live = useRealtime(s => s.byLcu[lcu.lcuId]), rtStatus = useRealtime(s => s.status);
  const alive = useRef(true), timers = useRef<number[]>([]), cur = useRef(lcu);
  cur.current = lcu;

  const refresh = useCallback(async (silent = false) => {
    const l = cur.current;
    if (!silent) setStatus({ text: 'Waiting....', kind: '' });
    try {
      const s = await lightStatus(l, num);
      if (!alive.current || cur.current.uid !== l.uid) return;
      setStatus(s ? { text: statusLine(s, l.ratedPower), kind: 'good' } : { text: 'Chưa có dữ liệu đèn', kind: '' });
    } catch (x) { if (alive.current && cur.current.uid === l.uid) setStatus({ text: (x as Error).message, kind: 'bad' }); }
  }, [num]);

  // Mở LCU khác / đổi kênh: đọc ngay, rồi tự làm mới mỗi 20 giây (im lặng, không nháy "Waiting....")
  useEffect(() => {
    alive.current = true;
    setMsg({ text: '', kind: '' }); setHistOpen(false); setHist({ state: 'idle', rows: [], err: '' });
    void refresh();
    const id = window.setInterval(() => void refresh(true), 20000);
    return () => { alive.current = false; clearInterval(id); timers.current.forEach(clearTimeout); timers.current = []; };
  }, [lcu.uid, refresh]);

  const loadHist = useCallback(async () => {
    const l = cur.current; setHist(h => ({ ...h, state: 'loading', err: '' }));
    try { const rows = await trend(l, days); if (alive.current && cur.current.uid === l.uid) setHist({ state: 'ok', rows, err: '' }); }
    catch (x) { if (alive.current) setHist({ state: 'err', rows: [], err: (x as Error).message }); }
  }, [days]);
  useEffect(() => { if (histOpen) void loadHist(); }, [histOpen, loadHist]);

  async function send(cmd: LampCommand) {
    const what = `${NAMES[cmd]}${cmd === 'dimming' ? ' ' + dim + '%' : ''}`;
    if (!confirm(`Gửi lệnh THẬT xuống đèn?\n\n${what}\nLCU: ${lcu.uid}\nĐèn/kênh: ${num}`)) return;
    setBusy(true); setMsg({ text: 'Đang gửi…', kind: '' });
    try {
      await unicast(cmd, lcu, num, dim);
      setMsg({ text: `${what}: server đã nhận lệnh (${new Date().toLocaleTimeString()})`, kind: 'good' });
    } catch (x) { setMsg({ text: (x as Error).message, kind: 'bad' }); }
    setBusy(false);
    [4000, 10000, 20000].forEach(ms => timers.current.push(window.setTimeout(() => void refresh(), ms)));   // như bản cũ: đọc lại sau lệnh
  }

  async function readStatus() {   // như nút "Đọc trạng thái" bản cũ: hỏi đèn (queryStatus) rồi đọc số đo
    setBusy(true); setStatus({ text: 'Waiting....', kind: '' });
    try { await unicast('queryStatus', lcu, num); } catch { /* vẫn đọc số đo gần nhất */ }
    await refresh(true); setBusy(false);
  }

  function downloadCsv() {
    const csv = toCsv(['Giờ đo', 'P (W)', 'U (V)', 'I (A)', 'cosφ', 'E (kWh)', 'Dim %', 'wp'], hist.rows.map(r => [r.time, r.power, r.voltage, r.current, r.pf, r.energy, r.dim, r.wp]));
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `lich-su-${lcu.uid}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <aside className="drawer">
      <button className="x" onClick={onClose}>✕</button>
      <h2>{lcu.name || lcu.uid}</h2><div className="res">UID {lcu.uid} · lcuId {lcu.lcuId}</div>
      <h3>Điều khiển</h3>
      <div className="c"><label>Đèn/kênh <input className="num" type="number" min={1} value={num} onChange={e => setNum(Math.max(1, Number(e.target.value) || 1))} /></label>
        <button disabled={busy} onClick={() => void send('turnOn')}>Bật</button><button disabled={busy} onClick={() => void send('turnOff')}>Tắt</button></div>
      <div className="c" style={{ marginTop: 8 }}><input className="dim" type="range" min={0} max={100} value={dim} onChange={e => setDim(Number(e.target.value))} /><output>{dim}</output>%<button disabled={busy} onClick={() => void send('dimming')}>Dim</button></div>
      <div className={`res ${msg.kind}`}>{msg.text}</div>
      <h3>Trạng thái</h3>
      <div className={`res ${status.kind}`}>{status.text}</div>
      <div className="c" style={{ marginTop: 8 }}><button disabled={busy} onClick={() => void readStatus()}>Đọc trạng thái</button></div>
      <h3>Realtime</h3>
      <div className="live">
        {!live && <div className="t">{rtStatus === 'authed' ? 'Chưa nhận tin realtime cho LCU này (server đẩy theo đợt, chờ vài chục giây hoặc gửi lệnh rồi xem lại).' : 'Realtime chưa sẵn sàng — xem chỉ báo trên thanh trên cùng.'}</div>}
        {live && Object.entries(live.lamps).map(([n, l]) => <div key={`s${n}`}>[{clock(l.at)}] đèn {n}: dim {fmt(l.dim)}%, {l.on === undefined ? '–' : l.on ? 'bật' : 'tắt'}</div>)}
        {live && Object.entries(live.data).map(([n, d]) => <div key={`d${n}`}>[{clock(d.at)}] đo đèn {n}: {fmt(d.power)} W · {fmt(d.voltage)} V · {fmt(d.current)} A · cosφ {fmt(d.pf)} · lux {fmt(d.lux)} · lỗi {fmt(d.fault)}</div>)}
        {live?.unicast && <div>[{clock(live.unicast.at)}] phản hồi lệnh: {live.unicast.text}</div>}
      </div>
      <h3>Lịch sử đo</h3>
      <div className="c"><button className="b" onClick={() => setHistOpen(o => !o)}>{histOpen ? '▾' : '▸'} Show lịch sử</button>
        <select value={days} onChange={e => setDays(Number(e.target.value))}><option value={1}>1 ngày</option><option value={7}>7 ngày</option><option value={30}>30 ngày</option></select>
        <span className="res">{hist.state === 'loading' ? 'Waiting....' : hist.state === 'ok' ? `${hist.rows.length} bản ghi` : ''}</span></div>
      {histOpen && <div>
        <div className="c" style={{ margin: '8px 0' }}><button className="b" disabled={!hist.rows.length} onClick={downloadCsv}>Tải CSV</button></div>
        {hist.state === 'err' && <div className="res bad">{hist.err}</div>}
        <div className="scroll"><table><thead><tr><th>Giờ đo</th><th>P (W)</th><th>U (V)</th><th>I (A)</th><th>cosφ</th><th>E (kWh)</th><th>Dim %</th><th>wp</th></tr></thead>
          <tbody>{hist.rows.slice(0, 500).map(r => <tr key={r.ts}><td>{r.time}</td><td>{fmt(r.power)}</td><td>{fmt(r.voltage)}</td><td>{fmt(r.current)}</td><td>{fmt(r.pf)}</td><td>{fmt(r.energy)}</td><td>{fmt(r.dim)}</td><td>{fmt(r.wp)}</td></tr>)}</tbody></table></div>
      </div>}
    </aside>
  );
}
