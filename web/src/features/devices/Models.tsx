import { useEffect, useMemo, useState } from 'react';
import { lazy, Suspense } from 'react';
import { DICT_KEYS, enumFieldsOf, enumLabel, fieldItems, isRelevantKey, poleShapeItems } from './enums';

import { listDeviceTypes, listDictionary, listModels, listPoleTypes, listTypeProtocols, modelProtocols, projectIds, type ModelProto } from '../../adapters/fonda';
import { WRITE_ENABLED } from '../../core/flags';
import { configEntries, lcuSpec, type DictItem, type PoleType } from '../../adapters/fonda/mappers';
import type { DeviceModel, DeviceType } from '../../core/types';
import { show } from '../common/show';

// Mẫu thiết bị (template deviceConfig) — chỉ ĐỌC. Model nhóm theo loại thiết bị; bấm model để xem cấu hình / thiết bị đính kèm.
// Thêm/sửa/xoá chỉ nạp khi bật ghi: bản main không chứa mã này (WRITE_ENABLED được gập lúc build).
const Writes = WRITE_ENABLED ? lazy(() => import('./ModelWrite').then(m => ({ default: m.ModelEditor }))) : null;
const Toolbar = WRITE_ENABLED ? lazy(() => import('./ModelWrite').then(m => ({ default: m.ModelToolbar }))) : null;
const PtWrites = WRITE_ENABLED ? lazy(() => import('./ModelWrite').then(m => ({ default: m.PoleTypeActions }))) : null;
const POLE_TYPES = '__poleTypes', ARM_TYPES = '__armTypes';
export default function Models() {
  const [types, setTypes] = useState<DeviceType[]>([]);
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [pid, setPid] = useState('');
  const [protos, setProtos] = useState<Map<string, ModelProto>>(new Map());
  const [err, setErr] = useState('');
  const [typeProtos, setTypeProtos] = useState<Map<string, ModelProto[]>>(new Map());
  const [armErr, setArmErr] = useState(''), [ptSel, setPtSel] = useState<string | null>(null);
  const [dicts, setDicts] = useState<Record<number, DictItem[]>>({});
  const [poleTypes, setPoleTypes] = useState<PoleType[]>([]), [ptErr, setPtErr] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const ts: DeviceType[] = [], ms: DeviceModel[] = [];
        const ps = await projectIds();
        const pts: PoleType[] = [];
        for (const pid of ps) {
          const tt = await listDeviceTypes(pid), mm = await listModels(pid);
          ts.push(...tt); ms.push(...mm);
          try { pts.push(...await listPoleTypes(pid)); } catch (e) { setPtErr((e as Error).message); }
          if (pid === ps[0]) {   // bảng enum của các trường deviceConfig (docs/15 §4)
            const dd: Record<number, DictItem[]> = {};
            for (const key of DICT_KEYS) { try { dd[key] = await listDictionary(pid, key); } catch (e) { if (key === 55) setArmErr((e as Error).message); } }
            setDicts(dd);
          }
        }
        if (!live) return;
        setPoleTypes(pts);
        setTypes(ts); setModels(ms); setTypeId(t => t ?? ms[0]?.typeId ?? null); setPid(ps[0] ?? '');
      } catch (e) { if (live) setErr((e as Error).message); } finally { if (live) setBusy(false); }
    })();
    return () => { live = false; };
  }, [reload]);

  const withModels = useMemo(() => {
    const count = new Map<string, number>(); for (const m of models) count.set(m.typeId, (count.get(m.typeId) ?? 0) + 1);
    return types.filter(t => count.has(t.id)).map(t => ({ t, n: count.get(t.id)! }));
  }, [types, models]);
  const list = models.filter(m => m.typeId === typeId);   // typeId = POLE_TYPES → rỗng
  const curType = types.find(t => t.id === typeId);
  const isLcu = curType?.value === 2;   // LCU: số đầu đèn/thông số phần cứng cố định theo model → hiện bảng so sánh
  useEffect(() => {
    if (!typeId || typeId === POLE_TYPES || typeId === ARM_TYPES || !pid) return;
    let live = true; modelProtocols(pid, typeId).then(m => { if (live) setProtos(m); }).catch(() => { if (live) setProtos(new Map()); });
    return () => { live = false; };
  }, [typeId, pid, reload]);
  const arms = dicts[55] ?? [], shapes = useMemo(() => poleShapeItems(poleTypes), [poleTypes]);
  // Giao thức chọn được = giao thức hệ thống của loại (queryProtocolByDeviceId, nạp khi chọn loại) + giao thức các model sẵn có (phòng khi API lỗi)
  useEffect(() => {
    if (!typeId || typeId === POLE_TYPES || typeId === ARM_TYPES || !pid || typeProtos.has(typeId)) return;
    let live = true; listTypeProtocols(pid, typeId).then(r => { if (live) setTypeProtos(m => new Map(m).set(typeId, r)); });
    return () => { live = false; };
  }, [typeId, pid, typeProtos]);
  const protoOpts = useMemo(() => {
    const m = new Map<string, ModelProto>();
    for (const p of typeProtos.get(typeId ?? '') ?? []) m.set(p.id, p);
    for (const p of protos.values()) if (p.id && p.value >= 0 && !m.has(p.id)) m.set(p.id, p);
    return [...m.values()];
  }, [typeProtos, protos, typeId]);
  const enumName = (typeValue: number | undefined, key: string, text: string) => {
    if (typeValue == null) return '';
    const f = enumFieldsOf(typeValue).find(x => x.key === key); if (!f) return '';
    const n = enumLabel(f, text, fieldItems(f, dicts)); return n ? ` — ${n}` : '';
  };
  const sel = models.find(m => m.id === selId);
  const selType0 = types.find(t => t.id === sel?.typeId);
  const entries = useMemo(() => (sel ? configEntries(sel.config).filter(e => selType0 ? isRelevantKey(selType0.value, e.key) : true) : []), [sel, selType0]);

  const selType = types.find(t => t.id === sel?.typeId);
  const selProto = sel ? protos.get(sel.id) : undefined;
  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : `${models.length} model · ${withModels.length} loại thiết bị`}</p>
        {err && <div className="err">{err}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {withModels.map(({ t, n }) => <button key={t.id} className={t.id === typeId ? '' : 'b'} onClick={() => { setTypeId(t.id); setSelId(null); }}>{t.name} ({n})</button>)}
          <button className={typeId === POLE_TYPES ? '' : 'b'} onClick={() => { setTypeId(POLE_TYPES); setSelId(null); setPtSel(null); }}>Loại cột — PoleType ({poleTypes.length})</button>
          <button className={typeId === ARM_TYPES ? '' : 'b'} onClick={() => { setTypeId(ARM_TYPES); setSelId(null); }}>Kiểu tay đèn — poleArmType ({arms.length})</button>
        </div>
        {Toolbar && typeId && typeId !== POLE_TYPES && typeId !== ARM_TYPES && <div style={{ marginBottom: 10 }}><Suspense fallback={null}><Toolbar pid={pid} type={curType} models={list} sel={sel} protos={protos} ctx={{ pid, dicts, poleTypes, protoOpts }} onChanged={() => { setSelId(null); setReload(n => n + 1); }} /></Suspense></div>}
        {typeId === POLE_TYPES && (<>
          {ptErr && <div className="err">{ptErr}</div>}
          {PtWrites && <Suspense fallback={null}><PtWrites mode="add" shapes={shapes} pid={pid} onChanged={() => setReload(n => n + 1)} /></Suspense>}
          <p className="sub">Model Lamp Pole tham chiếu loại cột qua <code>poleTypeId</code> trong <code>deviceConfig</code>.</p>
          <table><thead><tr><th>#</th><th>Tên loại cột</th><th>Giá trị</th><th>Kiểu/hình (loại hệ thống 1–8)</th><th>Hệ thống</th><th>Ghi chú</th><th>Mã</th><th>Số model cột dùng</th></tr></thead>
            <tbody>{poleTypes.map((p, i) => <tr key={p.id} className={'lrow' + (p.id === ptSel ? ' sel' : '')} onClick={() => setPtSel(p.id)}><td>{i + 1}</td><td><b>{p.name}</b></td><td>{p.value ?? '–'}</td><td>{shapes.find(x => x.value === show(p.value))?.name ?? '–'}</td><td>{p.systemConfig ? 'Hệ thống' : 'Dự án'}</td><td>{p.remark}</td><td>{p.id.slice(0, 8)}</td><td>{models.filter(m => show(m.config.poleTypeId ?? '') === p.id).length}</td></tr>)}</tbody></table>
          {!poleTypes.length && !ptErr && <p className="sub">Chưa đọc được loại cột nào.</p>}
        </>)}
        {typeId === ARM_TYPES && (<>
          {armErr && <div className="err">{armErr}</div>}
          <p className="sub">Giá trị <code>poleArmType</code> trong <code>deviceConfig</code> của model Lamp Pole tra theo dictionary key 55. Hiện chỉ đọc — thêm/bớt kiểu tay đèn cần bắt request từ web Fonda gốc.</p>
          <table><thead><tr><th>#</th><th>Giá trị</th><th>Tên</th><th>Ghi chú</th><th>Số model cột dùng</th></tr></thead>
            <tbody>{arms.map((a, i) => <tr key={a.value}><td>{i + 1}</td><td>{a.value}</td><td><b>{a.name}</b></td><td>{a.remark}</td><td>{models.filter(m => show(m.config.poleArmType ?? '') === a.value).length}</td></tr>)}</tbody></table>
          {!arms.length && !armErr && <p className="sub">Chưa đọc được kiểu tay đèn nào.</p>}
        </>)}
        {typeId && typeId !== POLE_TYPES && typeId !== ARM_TYPES && (<>
          <table><thead><tr><th>#</th><th>Tên model</th><th>Mã model</th>{isLcu ? <><th>Giao thức</th><th>Số đầu đèn</th><th>lcuType</th><th>loopType</th><th>Mức dim</th><th>Cờ chức năng bật</th><th>functionList</th></> : <th>Số trường cấu hình</th>}</tr></thead>
            <tbody>{list.map((m, i) => { const sp = isLcu ? lcuSpec(m.config) : null, pr = protos.get(m.id); return (
              <tr key={m.id} className={'lrow' + (m.id === selId ? ' sel' : '')} onClick={() => setSelId(m.id)}>
                <td>{i + 1}</td><td><b>{m.name}</b></td><td>{m.id.slice(0, 8)}</td>
                {sp ? <><td>{pr ? `${pr.name} ${pr.version}${pr.systemConfig ? ` · sys${pr.systemConfig}` : ''}` : '…'}</td><td><b>{sp.slots}</b></td><td>{sp.lcuType ?? '–'}</td><td>{sp.loopType ?? '–'}</td><td>{sp.dimming ?? '–'}</td><td>{sp.flagsOn.join(', ') || '–'} <span className="sub">/ {sp.flagsOn.length + sp.flagsOff.length} cờ</span></td><td>{sp.functions.join(',') || '–'}</td></> : <td>{configEntries(m.config).length}</td>}</tr>); })}</tbody></table>
          {isLcu && <p className="sub">Số đầu đèn (<code>lampHolderNum</code>) cố định theo model: LCU chỉ quản lý đúng ngần ấy đèn, dù khi khai bộ đèn–LCU có nhập nhiều hơn.</p>}
        </>)}
      </div>
      {typeId === POLE_TYPES && ptSel && (() => {
        const pt = poleTypes.find(p => p.id === ptSel); if (!pt) return null;
        const used = models.filter(m => show(m.config.poleTypeId ?? '') === pt.id);
        return (
          <aside className="drawer">
            <button className="x" onClick={() => setPtSel(null)}>✕</button>
            <h2>{pt.name}</h2>
            <table className="kv"><tbody>
              <tr><td>poleTypeId</td><td>{pt.id}</td></tr><tr><td>poleTypeValue</td><td>{pt.value ?? '–'}</td></tr>
              <tr><td>systemConfig</td><td>{pt.systemConfig} {pt.systemConfig ? '(dựng sẵn của hệ thống)' : '(người dùng khai)'}</td></tr><tr><td>remark</td><td>{pt.remark || '–'}</td></tr>
            </tbody></table>
            <p className="sub"><code>poleTypeValue</code> là mã kiểu/hình cột có sẵn (8 giá trị của loại cột hệ thống): <b>{shapes.find(x => x.value === show(pt.value))?.name ?? 'không có trong bảng'}</b>. Hình ảnh tương ứng do giao diện Fonda gắn theo mã này (chỉ có 8 mã 1–8); API không trả địa chỉ hình.</p>
            {PtWrites && <Suspense fallback={null}><PtWrites mode="edit" shapes={shapes} pid={pid} sel={pt} usedBy={used.length} onChanged={() => { setPtSel(null); setReload(n => n + 1); }} /></Suspense>}
            <h3>Model Lamp Pole dùng loại này ({used.length})</h3>
            {used.length ? <ul style={{ margin: 0, paddingLeft: 18 }}>{used.map(m => <li key={m.id}>{m.name}{m.config.poleArmType != null ? ` — tay đèn: ${arms.find(a => a.value === show(m.config.poleArmType))?.name ?? show(m.config.poleArmType)}` : ''}</li>)}</ul> : <p className="sub">Chưa có model nào.</p>}
          </aside>);
      })()}
      {typeId !== POLE_TYPES && sel && (
        <aside className="drawer">
          <button className="x" onClick={() => setSelId(null)}>✕</button>
          <h2>{sel.name}</h2>
          {selType?.value === 6 && sel.config.poleArmType != null && <p className="sub" style={{ margin: '4px 0 0' }}>Kiểu tay đèn: <b>{arms.find(a => a.value === show(sel.config.poleArmType))?.name ?? show(sel.config.poleArmType)}</b></p>}
          {selType?.value === 6 && sel.config.poleTypeId != null && <p className="sub" style={{ margin: '4px 0 0' }}>Loại cột: <b>{poleTypes.find(p => p.id === show(sel.config.poleTypeId))?.name ?? show(sel.config.poleTypeId)}</b></p>}
          {selProto && selProto.value >= 0 && <p className="sub" style={{ margin: '4px 0 0' }}>Function (giao thức): <b>{selProto.name} {selProto.version}</b></p>}
          <h3>Cấu hình (deviceConfig)</h3>
          {!entries.length && <p className="sub">Không có trường cấu hình.</p>}
          <table className="kv"><tbody>
            {entries.filter(e => e.kind === 'value').map(e => e.kind === 'value' && <tr key={e.key}><td>{e.key}</td><td>{e.text}{enumName(selType?.value, e.key, e.text)}</td></tr>)}
          </tbody></table>
          {entries.some(e => e.kind === 'attached') && <h3>Thiết bị đính kèm theo template</h3>}
          {entries.map(e => e.kind === 'attached' && (
            <div key={e.key} style={{ marginBottom: 8 }}>
              <b>{e.key}</b>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{e.items.map((it, i) => (
                <li key={i} style={{ opacity: it.checked ? 1 : .55 }}>{it.checked ? '✔' : '○'} {it.name}{it.extra ? ` (${it.extra})` : ''}</li>))}</ul>
            </div>))}
          {Writes && sel && <Suspense fallback={null}><Writes pid={pid} model={sel} type={selType} proto={selProto} ctx={{ pid, dicts, poleTypes, protoOpts }} onChanged={() => { setSelId(null); setReload(n => n + 1); }} /></Suspense>}
        </aside>
      )}
    </div>
  );
}
