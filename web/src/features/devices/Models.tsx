import { useEffect, useMemo, useState } from 'react';
import { lazy, Suspense } from 'react';
import { detailRows } from './templateView';
import { DICT_KEYS, poleShapeItems } from './enums';

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
// Cache đọc 60 giây (chuyển qua lại giữa 3 tab không phải tải lại); xoá sau khi ghi.
const memo = new Map<string, { t: number; p: Promise<unknown> }>();
function memoCall<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = memo.get(key); if (hit && Date.now() - hit.t < 60_000) return hit.p as Promise<T>;
  const p = fn(); memo.set(key, { t: Date.now(), p }); p.catch(() => memo.delete(key)); return p;
}
const POLE_TYPES = '__poleTypes', ARM_TYPES = '__armTypes';
/** Ba màn hình của nhóm "Mẫu thiết bị": template theo loại thiết bị / loại cột (PoleType) / kiểu tay đèn (poleArmType). */
type Mode = 'models' | 'poletype' | 'arm';
export default function Models() { return <ModelsView mode="models" />; }
export function PoleTypes() { return <ModelsView mode="poletype" />; }
export function ArmTypes() { return <ModelsView mode="arm" />; }

function ModelsView({ mode }: { mode: Mode }) {
  const [types, setTypes] = useState<DeviceType[]>([]);
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [typeId, setTypeId] = useState<string | null>(mode === 'poletype' ? POLE_TYPES : mode === 'arm' ? ARM_TYPES : null);
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
    if (reload > 0) memo.clear();   // sau khi ghi: bỏ cache để đọc lại
    (async () => {
      try {
        const ps = await memoCall('pids', projectIds), p0 = ps[0] ?? '';
        if (live) setPid(p0);
        // Chỉ nạp cái màn hình cần, các yêu cầu chạy SONG SONG và hiện dần (không chờ tất cả)
        const wantDicts = mode === 'models' ? DICT_KEYS : mode === 'arm' ? [55] : [];
        const jobs: Array<Promise<void>> = [];
        const ts: DeviceType[] = [], ms: DeviceModel[] = [], pts: PoleType[] = [];
        for (const id of ps) {
          jobs.push(memoCall(`types:${id}`, () => listDeviceTypes(id)).then(r => { ts.push(...r); }));
          jobs.push(memoCall(`models:${id}`, () => listModels(id)).then(r => { ms.push(...r); }));
          if (mode !== 'arm') jobs.push(memoCall(`poletypes:${id}`, () => listPoleTypes(id)).then(r => { pts.push(...r); }).catch(e => { if (live) setPtErr((e as Error).message); }));
        }
        if (p0) {
          const dd: Record<number, DictItem[]> = {};
          for (const key of wantDicts) jobs.push(memoCall(`dict:${p0}:${key}`, () => listDictionary(p0, key)).then(r => { dd[key] = r; }).catch(e => { if (key === 55 && live) setArmErr((e as Error).message); }));
          await Promise.all(jobs);
          if (live) setDicts(dd);
        } else await Promise.all(jobs);
        if (!live) return;
        setPoleTypes(pts); setTypes(ts); setModels(ms);
        setTypeId(t => t ?? (mode === 'models' ? ms[0]?.typeId : undefined) ?? null);
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
  const sel = models.find(m => m.id === selId);

  const selType = types.find(t => t.id === sel?.typeId);
  const selProto = sel ? protos.get(sel.id) : undefined;
  const detail = useMemo(() => (sel && selType ? detailRows({ type: selType.value, protocol: selProto, config: sel.config, dicts, poleTypes }) : []), [sel, selType, selProto, dicts, poleTypes]);
  return (
    <div className="lcus">
      <div className="listwrap">
        <p className="sub">{busy ? 'Đang tải…' : mode === 'models' ? `${models.length} template · ${withModels.length} loại thiết bị` : mode === 'poletype' ? `${poleTypes.length} loại cột` : `${arms.length} kiểu tay đèn`}</p>
        {err && <div className="err">{err}</div>}
        <div style={{ display: mode === 'models' ? 'flex' : 'none', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {withModels.map(({ t, n }) => <button key={t.id} className={t.id === typeId ? '' : 'b'} onClick={() => { setTypeId(t.id); setSelId(null); }}>{t.name} ({n})</button>)}
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
          <h3>Thông tin template</h3>
          {sel.id && <p className="sub" style={{ margin: '0 0 6px' }}>{selType?.name ?? ''}{selProto?.remark ? ` · ${selProto.remark}` : ''}</p>}
          {!detail.length && <p className="sub">Loại này chưa có ô riêng trong form — xem JSON bên dưới.</p>}
          <table className="kv"><tbody>
            {detail.map(r => <tr key={r.key}><td>{r.label}{r.required ? ' *' : ''}</td><td>{r.value}</td></tr>)}
          </tbody></table>
          <details style={{ margin: '10px 0' }}><summary className="sub" style={{ cursor: 'pointer' }}>Toàn bộ deviceConfig (JSON)</summary>
            <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 320, overflow: 'auto' }}>{JSON.stringify(sel.config, null, 2)}</pre></details>
          {Writes && sel && <Suspense fallback={null}><Writes pid={pid} model={sel} type={selType} proto={selProto} ctx={{ pid, dicts, poleTypes, protoOpts }} onChanged={() => { setSelId(null); setReload(n => n + 1); }} /></Suspense>}
        </aside>
      )}
    </div>
  );
}
