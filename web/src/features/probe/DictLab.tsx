import { useEffect, useMemo, useState } from 'react';
import { deleteDictionary, projectDictRecords, projectIds, rawDictionary, rawDictionaryByName, rawDictionaryPage, sendDictionary } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import ConfirmWrite from '../common/ConfirmWrite';
import { buildDictBody, type DictShape, dictBodyError, findInDicts, nextDictValue } from './dictLabUtil';
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
  const [page, setPage] = useState<string>(''), [keepId, setKeepId] = useState(true), [keepStair, setKeepStair] = useState(false), [found, setFound] = useState(''), [shape, setShape] = useState<DictShape>('item'), [mine, setMine] = useState<Rec[]>([]), [delRec, setDelRec] = useState<Rec | null>(null);

  async function load(k = key) {
    setBusy(true); setErr(''); setAfter(null);
    try { const id = pid || (await projectIds())[0]; setPid(id); const r = await rawDictionary(id, k); setItems(Array.isArray(r) ? r : []); setSrcIdx(0); setText(''); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const next = useMemo(() => nextDictValue(items), [items]);
  const parsed = useMemo(() => (text ? dictBodyError(text) : null), [text]);
  const fill = () => { if (items[srcIdx]) setText(JSON.stringify(buildDictBody(shape, items[srcIdx], { name, value: next, dictKey: key.trim(), keepDictId: keepId, keepStairId: keepStair }), null, 2)); };

  const loadMine = async () => { try { setMine(await projectDictRecords(pid, key.trim())); } catch (e) { setErr((e as Error).message); } };
  if (!WRITE_ENABLED) return <div className="lcus"><div className="listwrap"><p className="sub">Công cụ này chỉ có ở bản preview.</p></div></div>;
  return (
    <div className="lcus"><div className="listwrap" style={{ maxWidth: 920 }}>
      <p className="sub">Thử <b>dictionary/save</b> (hoặc <b>update</b>) bằng cách <b>sao chép một bản ghi có sẵn</b> rồi đổi tên/giá trị. Body chưa bắt từ web Fonda gốc nên có thể bị từ chối — thông báo lỗi chính là kết quả. <b>Ghi thật vào dictionary dùng chung — chỉ dùng trên dự án thử.</b></p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label className="sub" style={{ margin: 0 }}>Dictionary key <input style={{ width: 70 }} value={key} onChange={e => setKey(e.target.value)} /></label>
        <button className="b" disabled={busy} onClick={() => void load()}>Đọc</button>
        <button className="b" disabled={busy || !pid} onClick={async () => { setPage('đang đọc…'); try { setPage(JSON.stringify(await rawDictionaryPage(pid, { current: 1, size: 50, dictKey: key.trim() }), null, 2)); } catch (e) { setPage('Lỗi: ' + (e as Error).message); } }}>Đọc thử queryDictionaryPage (dictKey)</button>
        <button className="b" disabled={busy || !pid || !name.trim()} onClick={async () => { setPage('đang đọc…'); try { setPage(JSON.stringify(await rawDictionaryByName(pid, name.trim()), null, 2)); } catch (e) { setPage('Lỗi: ' + (e as Error).message); } }}>Đọc thử queryDictionaryByName (tên mới)</button>
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
          <label className="sub" style={{ margin: 0 }}>Dạng body <select value={shape} onChange={e => setShape(e.target.value as DictShape)}><option value="item">1. mục (như đọc về)</option><option value="group">2. nhóm + dictionarySecond</option><option value="child">3. mục con (dictStairId = dictId nhóm)</option></select></label>
          <label className="sub" style={{ margin: 0 }}><input type="checkbox" checked={keepId} onChange={e => setKeepId(e.target.checked)} /> giữ dictId (nhóm)</label>
          <label className="sub" style={{ margin: 0 }}><input type="checkbox" checked={keepStair} onChange={e => setKeepStair(e.target.checked)} /> giữ dictStairId (id mục gốc)</label>
          <label className="sub" style={{ margin: 0 }}>API <select value={op} onChange={e => setOp(e.target.value as 'save' | 'update')}><option value="save">dictionary/save</option><option value="update">dictionary/update</option></select></label>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Chọn một dòng làm mẫu rồi bấm “Nạp body”, hoặc dán JSON body." style={{ width: '100%', height: 240, fontFamily: 'monospace', fontSize: 12 }} />
        {parsed && !parsed.ok && <div className="err">{parsed.reason}</div>}
        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><button className="b" disabled={busy || !pid || !name.trim()} onClick={async () => {
            setBusy(true); const all: Record<string, Rec[]> = {};
            for (let k0 = 1; k0 <= 200; k0 += 10) {   // 10 key một lượt cho nhanh
              setFound(`Đang quét… ${Math.min(k0 - 1, 200)}/200`);
              await Promise.all(Array.from({ length: 10 }, (_, i) => k0 + i).map(async k => { try { const r = await rawDictionary(pid, k); if (Array.isArray(r) && r.length) all[String(k)] = r; } catch { /* bỏ qua */ } }));
            }
            const hit = findInDicts(all, name); setBusy(false);
            setFound(`XONG 200/200 — ` + (hit.length ? `"${name}" có ở key: ${hit.join(', ')}` : `không thấy "${name}" ở key nào (${Object.keys(all).length} key có dữ liệu)`));
          }}>Tìm "{name}" trong mọi dictionary</button>{found && <span className="sub" style={{ margin: 0 }}>{found}</span>}</div>
        <div style={{ marginTop: 10 }}><button disabled={!parsed?.ok} onClick={() => parsed?.ok && setConfirm(parsed.body)}>Gửi thử lên server…</button></div>
      </>)}
      <h3 style={{ marginTop: 16 }}>Bản ghi do dự án tạo (queryDictionaryPage, key {key})</h3>
      <p className="sub">Mục gửi bằng <code>dictionary/save</code> nằm ở đây (có <code>dictValue</code> nhưng chưa có tên <code>dsName</code>, nên <code>queryDictionaryByKey</code> không liệt kê). Bấm “Nạp để cập nhật tên” để sinh body <b>dictionary/update</b> gắn tên; “Xoá…” dùng <code>dictionary/deleteById</code> (chỉ cho bản ghi ở đây, không đụng bản dựng sẵn).</p>
      <button className="b" disabled={!pid} onClick={() => void loadMine()}>Đọc danh sách</button>
      {mine.length > 0 && <table style={{ marginTop: 8 }}><thead><tr><th>dictValue</th><th>dictName</th><th>dictId</th><th>Tạo lúc</th><th></th></tr></thead>
        <tbody>{mine.map((r, i) => <tr key={i}><td>{show(r.dictValue)}</td><td>{show(r.dictName)}</td><td>{show(r.dictId).slice(0, 10)}…</td><td>{show(r.createTime)}</td>
          <td><button className="b" onClick={() => { setOp('update'); setText(JSON.stringify({ ...r, dsName: name, dictStairRemark: '' }, null, 2)); }}>Nạp để cập nhật tên</button> <button className="b" onClick={() => setDelRec(r)}>Xoá…</button></td></tr>)}</tbody></table>}
      {delRec && <ConfirmWrite title="Xoá bản ghi dictionary do dự án tạo" summary={`dictKey ${show(delRec.dictKey)} · dictValue ${show(delRec.dictValue)} · dictId ${show(delRec.dictId)}. Không hoàn tác được.`} method="GET" path={`dictionary/deleteById/${show(delRec.dictId)}`} body={{}} danger
        onConfirm={async () => { await deleteDictionary(pid, show(delRec.dictId)); await loadMine(); const r = await rawDictionary(pid, key); setItems(Array.isArray(r) ? r : []); }} onClose={() => setDelRec(null)} />}
      {after && <div style={{ marginTop: 14 }}><h3>Đọc lại sau khi gửi ({after.length} mục)</h3><p className="sub">{after.map(r => `${show(r.dictValue)}=${show(r.dsName ?? '')}`).join(' · ')}</p></div>}
      {confirm && <ConfirmWrite title={`Thử ${op === 'save' ? 'thêm' : 'sửa'} giá trị dictionary ${key}`} summary="Gửi nguyên body bên dưới. Server từ chối thì lỗi hiện ở đây; nhận thì bên dưới sẽ đọc lại dictionary để xem mục mới." method="POST" path={`dictionary/${op}`} body={confirm}
        onConfirm={async () => { await sendDictionary(pid, op, confirm); await loadMine(); const r = await rawDictionary(pid, key); setAfter(Array.isArray(r) ? r : []); setItems(Array.isArray(r) ? r : []); }} onClose={() => setConfirm(null)} />}
    </div></div>
  );
}
