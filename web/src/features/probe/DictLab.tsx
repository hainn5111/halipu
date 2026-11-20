import { useEffect, useMemo, useState } from 'react';
import { projectIds, rawDictionary, rawDictionaryPage, sendDictionary } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import ConfirmWrite from '../common/ConfirmWrite';
import { cloneDictBody, dictBodyError, nextDictValue } from './dictLab';
import { show } from '../common/show';

type Rec = Record<string, unknown>;
// THỬ NGHIỆM (GHI THẬT, chỉ preview): thêm một giá trị vào dictionary (mặc định key 55 = kiểu tay đèn). Body của dictionary/save CHƯA bắt từ web Fonda gốc:
// công cụ sao chép một bản ghi có sẵn, bỏ id, đổi tên/giá trị — rồi gửi để xem server nhận hay báo lỗi. Có thể sửa tay JSON và đổi save/update.
export default function DictLab() {
  const [pid, setPid] = useState(''), [key, setKey] = useState('55');
  const [items, setItems] = useState<Rec[]>([]), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const [srcIdx, setSrcIdx] = useState(0), [name, setName] = useState('Test arm'), [text, setText] = useState('');
  const [op, setOp] = useState<'save' | 'update'>('save');
  const [confirm, setConfirm] = useState<Rec | null>(null), [after, setAfter] = useState<Rec[] | null>(null);
  const [page, setPage] = useState<string>('');

  async function load(k = key) {
    setBusy(true); setErr(''); setAfter(null);
    try { const id = pid || (await projectIds())[0]; setPid(id); const r = await rawDictionary(id, k); setItems(Array.isArray(r) ? r : []); setSrcIdx(0); setText(''); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const next = useMemo(() => nextDictValue(items), [items]);
  const parsed = useMemo(() => (text ? dictBodyError(text) : null), [text]);
  const fill = () => { if (items[srcIdx]) setText(JSON.stringify(cloneDictBody(items[srcIdx], { name, value: next }), null, 2)); };

  if (!WRITE_ENABLED) return <div className="lcus"><div className="listwrap"><p className="sub">Công cụ này chỉ có ở bản preview.</p></div></div>;
  return (
    <div className="lcus"><div className="listwrap" style={{ maxWidth: 920 }}>
      <p className="sub">Thử <b>dictionary/save</b> (hoặc <b>update</b>) bằng cách <b>sao chép một bản ghi có sẵn</b> rồi đổi tên/giá trị. Body chưa bắt từ web Fonda gốc nên có thể bị từ chối — thông báo lỗi chính là kết quả. <b>Ghi thật vào dictionary dùng chung — chỉ dùng trên dự án thử.</b></p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label className="sub" style={{ margin: 0 }}>Dictionary key <input style={{ width: 70 }} value={key} onChange={e => setKey(e.target.value)} /></label>
        <button className="b" disabled={busy} onClick={() => void load()}>Đọc</button>
        <button className="b" disabled={busy || !pid} onClick={async () => { setPage('đang đọc…'); try { setPage(JSON.stringify(await rawDictionaryPage(pid, { current: 1, size: 5 }), null, 2)); } catch (e) { setPage('Lỗi: ' + (e as Error).message); } }}>Đọc thử queryDictionaryPage</button>
      </div>
      {err && <div className="err">{err}</div>}
      {page && <pre style={{ maxHeight: 200, overflow: 'auto', fontSize: 12 }}>{page}</pre>}
      {items.length > 0 && (<>
        <table style={{ marginTop: 10 }}><thead><tr><th></th><th>dictValue</th><th>dsName (tên giá trị)</th><th>dictName (nhóm)</th><th>dictType</th></tr></thead>
          <tbody>{items.map((r, i) => <tr key={i} className={'lrow' + (i === srcIdx ? ' sel' : '')} onClick={() => setSrcIdx(i)}><td>{i === srcIdx ? '◉' : '○'}</td><td>{show(r.dictValue)}</td><td><b>{show(r.dsName ?? '')}</b></td><td>{show(r.dictName ?? '')}</td><td>{show(r.dictType ?? '')}</td></tr>)}</tbody></table>
        <div style={{ display: 'flex', gap: 8, alignItems: 'end', flexWrap: 'wrap', margin: '12px 0' }}>
          <label><span className="sub">Tên giá trị mới (dsName)</span><input value={name} onChange={e => setName(e.target.value)} /></label>
          <span className="sub" style={{ margin: 0 }}>dictValue mới: <b>{next}</b></span>
          <button className="b" onClick={fill}>Nạp body từ dòng đã chọn</button>
          <label className="sub" style={{ margin: 0 }}>API <select value={op} onChange={e => setOp(e.target.value as 'save' | 'update')}><option value="save">dictionary/save</option><option value="update">dictionary/update</option></select></label>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Chọn một dòng làm mẫu rồi bấm “Nạp body”, hoặc dán JSON body." style={{ width: '100%', height: 240, fontFamily: 'monospace', fontSize: 12 }} />
        {parsed && !parsed.ok && <div className="err">{parsed.reason}</div>}
        <div style={{ marginTop: 10 }}><button disabled={!parsed?.ok} onClick={() => parsed?.ok && setConfirm(parsed.body)}>Gửi thử lên server…</button></div>
      </>)}
      {after && <div style={{ marginTop: 14 }}><h3>Đọc lại sau khi gửi ({after.length} mục)</h3><p className="sub">{after.map(r => `${show(r.dictValue)}=${show(r.dsName ?? '')}`).join(' · ')}</p></div>}
      {confirm && <ConfirmWrite title={`Thử ${op === 'save' ? 'thêm' : 'sửa'} giá trị dictionary ${key}`} summary="Gửi nguyên body bên dưới. Server từ chối thì lỗi hiện ở đây; nhận thì bên dưới sẽ đọc lại dictionary để xem mục mới." method="POST" path={`dictionary/${op}`} body={confirm}
        onConfirm={async () => { await sendDictionary(pid, op, confirm); const r = await rawDictionary(pid, key); setAfter(Array.isArray(r) ? r : []); setItems(Array.isArray(r) ? r : []); }} onClose={() => setConfirm(null)} />}
    </div></div>
  );
}
