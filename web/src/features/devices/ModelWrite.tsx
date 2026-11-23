import { useEffect, useState } from 'react';
import { modelInUse, protocolFunctions } from '../../adapters/fonda';
import { modelCloneBody, modelUpdateBody, sendModelCreate, sendModelDelete, sendModelUpdate, sendPoleTypeDelete, sendPoleTypeSave, sendPoleTypeUpdate, poleTypeSaveBody, poleTypeUpdateBody, poleTypeIdsBody, type ModelProto } from '../../adapters/fonda';
import { modelIdsBody, modelNameError, poleTypeError, type PoleTypeIn } from '../../adapters/fonda/writeBodies';
import type { DictItem, PoleType } from '../../adapters/fonda/mappers';
import type { DeviceModel, DeviceType } from '../../core/types';
import ConfirmWrite from '../common/ConfirmWrite';
import { configErrors } from './configRules';
import { requiredErrors, visibleFields } from './templateSchema';
import { allowedOptions, enumFieldsOf, enumOptions, fieldItems, FIXED_FUNCTIONS, FUNCTION_HINTS, FUNCTION_TYPES, storeValue } from './enums';

// Thêm / sửa / xoá template (model) mọi loại và loại cột (PoleType) — GHI THẬT, chỉ bản preview. Payload: docs/15 §7 (bắt 2026-11-20). Luôn qua hộp xác nhận.
type Op = { title: string; summary: string; method: string; path: string; body: unknown; danger?: boolean; run: () => Promise<unknown> };
const toProto = (p?: ModelProto) => (p ? { id: p.id, value: p.value, name: p.name, version: p.version } : undefined);

export interface Ctx { pid: string; dicts: Record<number, DictItem[]>; poleTypes: PoleType[]; protoOpts: ModelProto[] }

/** Ô nhập theo loại: enum (dictionary), danh sách chức năng, loại cột (Lamp Pole), giao thức. Mọi thay đổi ghi lại vào JSON `cfg`; giao thức trả qua `setProto`. */
function TemplateFields({ typeValue, cfg, setCfg, ctx, proto, setProto, locked = [] }: { typeValue: number; cfg: string; setCfg: (t: string) => void; ctx: Ctx; proto?: ModelProto; setProto: (p: ModelProto) => void; /** ô bị khoá như Fonda (sửa model đã tạo / đang được dùng) */ locked?: string[] }) {
  // Hook đặt TRƯỚC mọi return sớm (đúng thứ tự hook)
  const [fnOpts, setFnOpts] = useState<number[]>([]);
  useEffect(() => { let live = true; if (proto?.id && FUNCTION_TYPES.includes(typeValue)) void protocolFunctions(ctx.pid, proto).then(f => { if (live) setFnOpts(f); }); else setFnOpts([]); return () => { live = false; }; }, [proto?.id, proto?.value, typeValue, ctx.pid]);
  let c: Record<string, unknown> | null = null; try { const v = JSON.parse(cfg); c = v && typeof v === 'object' && !Array.isArray(v) ? v : null; } catch { c = null; }
  if (!c) return <p className="sub">deviceConfig không phải JSON hợp lệ — sửa ở khung JSON bên dưới.</p>;
  const set = (patch: Record<string, unknown>) => setCfg(JSON.stringify({ ...c, ...patch }, null, 2));
  const row = (label: string, el: JSX.Element) => <span key={label} style={{ display: 'contents' }}><span className="sub" style={{ margin: 0 }}>{label}</span>{el}</span>;
  const rows: JSX.Element[] = [];
  const vis = visibleFields({ type: typeValue, protocol: proto?.value, lcuCtype: c.lcuCtype });
  const star = (key: string) => (vis.find(f => f.key === key)?.required ? ' *' : '');
  if (ctx.protoOpts.length && FUNCTION_TYPES.includes(typeValue)) {
    rows.push(row('Function (protocol)', <select value={proto?.id ?? ''} onChange={e => { const p = ctx.protoOpts.find(x => x.id === e.target.value); if (!p) return; setProto(p);
      // Hành vi như mã Fonda khi đổi giao thức: Concentrator → rtuType = lựa chọn ĐẦU của danh sách đã lọc; Gateway → gatewayTypes = null (chọn lại)
      const fix: Record<string, unknown> = {};
      if (typeValue === 4) { const f = enumFieldsOf(4)[0]; const ok = allowedOptions(4, p.value, enumOptions(f, fieldItems(f, ctx.dicts))); if (ok.length) fix[f.key] = storeValue(ok[0].value); }
      if (typeValue === 3) fix.gatewayTypes = null;
      // Chức năng (functionList) đi theo giao thức: lấy từ server rồi điền vào cấu hình
      void protocolFunctions(ctx.pid, p).then(fn => set({ ...fix, ...(fn.length ? { functionList: fn } : {}) })); if (!FUNCTION_TYPES.includes(typeValue) && Object.keys(fix).length) set(fix); }}>
      {!proto && <option value="">(chọn giao thức)</option>}
      {ctx.protoOpts.map(p => <option key={p.id} value={p.id}>{p.name} {p.version}</option>)}</select>));
  }
  for (const f of enumFieldsOf(typeValue)) {
    const items = fieldItems(f, ctx.dicts); const opts = allowedOptions(typeValue, proto?.value, enumOptions(f, items)); const cur = c[f.key] == null ? '' : String(c[f.key]);
    rows.push(row(f.label + star(f.key) + (locked.includes(f.key) ? ' 🔒' : ''), <select value={cur} disabled={locked.includes(f.key)} title={locked.includes(f.key) ? 'Fonda khoá ô này khi sửa model đã tạo' : ''} onChange={e => set({ [f.key]: storeValue(e.target.value) })}>
      {!opts.some(o => o.value === cur) && <option value={cur}>{cur || '(chưa chọn)'}</option>}
      {opts.map(o => <option key={o.value} value={o.value}>{f.byName ? o.name : `${o.value} — ${o.name}`}</option>)}</select>));
  }
  if (typeValue === 6) {
    const id = String(c.poleTypeId ?? '');
    rows.push(row('Pole type (loại cột)' + star('poleTypeId'), <select value={id} onChange={e => { const t = ctx.poleTypes.find(x => x.id === e.target.value); set({ poleTypeId: e.target.value, ...(t?.value != null ? { poleType: t.value } : {}) }); }}>
      {!ctx.poleTypes.some(t => t.id === id) && <option value={id}>{id ? `(không rõ ${id.slice(0, 8)}…)` : '(chưa chọn)'}</option>}
      {ctx.poleTypes.map(t => <option key={t.id} value={t.id}>{t.name}{t.systemConfig ? ' · hệ thống' : ''}</option>)}</select>));
  }
  if (FUNCTION_TYPES.includes(typeValue) && (fnOpts.length || Array.isArray(c.functionList))) {
    const cur = Array.isArray(c.functionList) ? (c.functionList as unknown[]).map(Number) : [], nums = [...new Set([...FIXED_FUNCTIONS, ...fnOpts, ...cur])].sort((a, b) => a - b);
    rows.push(row('Function (chức năng)', <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
      {nums.map(n => { const fixed = FIXED_FUNCTIONS.includes(n), supported = !fnOpts.length || fnOpts.includes(n) || fixed;
        return <label key={n} title={fixed ? 'Luôn bật (Fonda khoá chức năng 1–4)' : supported ? '' : 'Giao thức này không hỗ trợ'} style={{ fontSize: 13, opacity: supported ? 1 : .5 }}>
          <input type="checkbox" checked={fixed || cur.includes(n)} disabled={fixed || !supported} onChange={e => set({ functionList: (e.target.checked ? [...cur, n] : cur.filter(x => x !== n)).sort((a, b) => a - b) })} /> #{n}{FUNCTION_HINTS[n] ? ` (${FUNCTION_HINTS[n]})` : ''}</label>; })}</span>));
  }
  // Thông số khác của loại (ô nhập tự do): chỉ ô ĐANG HIỆN theo loại/giao thức trong popup Fonda; dấu * = bắt buộc
  const handled = new Set([...enumFieldsOf(typeValue).map(f => f.key), 'poleTypeId']);
  for (const f of vis) {
    if (handled.has(f.key)) continue;
    const textual = STRING_KEYS.includes(f.key), cur = c[f.key] == null ? '' : String(c[f.key]);
    rows.push(row(f.label + (f.required ? ' *' : ''), <input style={{ width: '100%' }} value={cur} placeholder={f.hint ?? ''} onChange={e => set({ [f.key]: textual ? e.target.value : storeValue(e.target.value) })} />));
  }
  if (!rows.length) return null;
  return <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 10px', alignItems: 'center', marginTop: 8 }}>{rows}</div>;
}

/** Kiểm tra như form Fonda: khoảng giá trị + trường bắt buộc đang hiện + đã chọn giao thức (loại có giao thức). Có thể BỎ QUA bằng ô tick (gửi nguyên JSON). */
function checks(typeValue: number, name: string, c: Record<string, unknown>, proto: ModelProto | undefined, ctx: Ctx): string[] {
  const shown = visibleFields({ type: typeValue, protocol: proto?.value, lcuCtype: c.lcuCtype }).map(f => f.key);
  const errs = [...configErrors(typeValue, name, c, shown), ...requiredErrors({ type: typeValue, protocol: proto?.value, lcuCtype: c.lcuCtype }, c)];
  if (ctx.protoOpts.length && FUNCTION_TYPES.includes(typeValue) && !(proto && proto.value >= 0)) errs.push('Giao thức (Function): bắt buộc');
  return errs;
}
const SKIP_LABEL = 'Bỏ qua kiểm tra của form — gửi nguyên JSON (để thử vượt các ràng buộc, kể cả khoá của giao diện)';
const STRING_KEYS = ['productId', 'bandName', 'hnVersion'];
const parseCfg = (t: string): Record<string, unknown> | null => { try { const v = JSON.parse(t); return v && typeof v === 'object' && !Array.isArray(v) ? v : null; } catch { return null; } };
const isBuiltIn = (p?: ModelProto) => (p?.systemConfig ?? 0) > 0;   // model dựng sẵn của hệ thống: không sửa/xoá

/** Thanh trên: "+ Thêm template…" (lấy model đang chọn, hoặc model đầu của loại, làm mẫu) và "Xoá template đã chọn…". */
export function ModelToolbar({ pid, type, models, sel, protos, ctx, onChanged }: { pid: string; type?: DeviceType; models: DeviceModel[]; sel?: DeviceModel; protos: Map<string, ModelProto>; ctx: Ctx; onChanged: () => void }) {
  const base = sel ?? models[0], baseProto0 = base ? protos.get(base.id) : undefined, [protoSel, setProtoSel] = useState<ModelProto | undefined>(undefined), baseProto = protoSel ?? baseProto0;
  const [open, setOpen] = useState(false), [name, setName] = useState(''), [remark, setRemark] = useState(''), [cfg, setCfg] = useState(''), [msg, setMsg] = useState('');
  const [op, setOp] = useState<Op | null>(null), [skip, setSkip] = useState(false);
  const typeValue = type?.value ?? NaN, ready = !!type && Number.isFinite(typeValue);
  function start() { if (!base) return; setMsg(''); setName(`${base.name} (bản sao)`); setRemark(baseProto0?.remark ?? ''); setProtoSel(undefined); setCfg(JSON.stringify(base.config, null, 2)); setOpen(true); }
  function ask() {
    const c = parseCfg(cfg), e = modelNameError(name, c); if (e || !c || !type || !base) { setMsg(e ?? 'deviceConfig không hợp lệ'); return; }
    const ce = skip ? [] : checks(typeValue, name, c, baseProto, ctx); if (ce.length) { setMsg(ce.join('\n')); return; }
    const body = modelCloneBody({ typeId: type.id, typeValue, config: c, protocol: toProto(baseProto) }, name.trim(), pid, remark.trim());
    setOp({ title: `Thêm template "${name.trim()}"`, summary: `Mẫu gốc "${base.name}" (loại ${type.name}). Server tự giữ lại các khoá deviceConfig thuộc loại này.`, method: 'POST', path: 'deviceModel/saveNew', body, run: () => sendModelCreate(pid, body) });
  }
  function askDelete() {
    if (!sel) return; setMsg('');
    if (isBuiltIn(protos.get(sel.id))) { setMsg('Model dựng sẵn của hệ thống — không xoá.'); return; }
    setOp({ title: `Xoá template "${sel.name}"`, summary: 'Nếu template còn được thiết bị dùng, server từ chối (code 1018 "is in use"). Không hoàn tác được.', method: 'POST', path: 'deviceModel/delete', body: modelIdsBody([sel.id]), danger: true, run: () => sendModelDelete(pid, [sel.id]) });
  }
  const dlg = open && (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 640, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Thêm template — {type?.name}</h2>
        <p className="sub" style={{ margin: 0 }}>Lấy “{base?.name}” làm mẫu: sửa tên, ghi chú và thông số rồi thêm.</p>
        <label className="sub" style={{ display: 'block', marginTop: 8 }}>Tên template</label><input style={{ width: '100%' }} value={name} onChange={e => setName(e.target.value)} />
        <label className="sub" style={{ display: 'block', marginTop: 8 }}>Ghi chú</label><input style={{ width: '100%' }} value={remark} onChange={e => setRemark(e.target.value)} />
        {type && <TemplateFields typeValue={typeValue} cfg={cfg} setCfg={setCfg} ctx={ctx} proto={baseProto} setProto={setProtoSel} />}
        <details style={{ marginTop: 8 }}><summary className="sub" style={{ cursor: 'pointer' }}>deviceConfig (JSON — sửa tay nếu cần)</summary>
          <textarea value={cfg} onChange={e => setCfg(e.target.value)} style={{ width: '100%', height: 220, fontFamily: 'monospace', fontSize: 12 }} /></details>
        <label className="sub" style={{ display: 'block', marginTop: 10 }}><input type="checkbox" checked={skip} onChange={e => setSkip(e.target.checked)} /> {SKIP_LABEL}</label>
        {msg && <div className="err" style={{ marginTop: 8, whiteSpace: 'pre-line' }}>{msg}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}><button onClick={ask}>Xem trước & xác nhận…</button><button className="b" onClick={() => setOpen(false)}>Đóng</button></div>
      </div>
    </div>);
  return (<>
    <button style={{ marginRight: 8 }} disabled={!ready || !base} title={base ? '' : 'Loại này chưa có template nào để làm mẫu'} onClick={start}>+ Thêm template…</button>
    <button className="b" disabled={!sel || isBuiltIn(sel ? protos.get(sel.id) : undefined)} title={sel ? '' : 'Chọn một template trong danh sách'} onClick={askDelete}>Xoá template đã chọn…</button>
    {msg && !open && <div className="err" style={{ marginTop: 8 }}>{msg}</div>}
    {dlg}
    {op && <ConfirmWrite {...op} onConfirm={async () => { await op.run(); }} onClose={changed => { setOp(null); if (changed) { setOpen(false); onChanged(); } }} />}
  </>);
}

/** Trong drawer: chỉ SỬA template đang chọn (tên, ghi chú, thông số). */
export function ModelEditor({ pid, model, type, proto: proto0, ctx, onChanged }: { pid: string; model: DeviceModel; type?: DeviceType; proto?: ModelProto; ctx: Ctx; onChanged: () => void }) {
  const [protoSel, setProtoSel] = useState<ModelProto | undefined>(undefined), [skip, setSkip] = useState(false);
  const proto = protoSel ?? proto0;
  const [inUse, setInUse] = useState<boolean | undefined>(undefined);
  useEffect(() => { let live = true; setInUse(undefined); void modelInUse(pid, model.id).then(r => { if (live) setInUse(r); }); return () => { live = false; }; }, [pid, model.id]);
  const [name, setName] = useState(''), [remark, setRemark] = useState(''), [cfg, setCfg] = useState(''), [msg, setMsg] = useState('');
  const [op, setOp] = useState<Op | null>(null);
  const builtIn = isBuiltIn(proto), typeValue = type?.value ?? NaN, ready = !!type && Number.isFinite(typeValue);
  useEffect(() => { setName(model.name); setRemark(proto0?.remark ?? ''); setCfg(JSON.stringify(model.config, null, 2)); setMsg(''); setProtoSel(undefined); }, [model.id, model.name, model.config, proto0?.remark]);
  function ask() {
    setMsg(''); const c = parseCfg(cfg), e = modelNameError(name, c); if (e || !c || !type) { setMsg(e ?? 'deviceConfig không hợp lệ'); return; }
    const ce = skip ? [] : checks(typeValue, name, c, proto, ctx); if (ce.length) { setMsg(ce.join('\n')); return; }
    const body = modelUpdateBody({ id: model.id, typeId: type.id, typeValue, typeName: type.name, name: name.trim(), remark: remark.trim(), config: c, protocol: toProto(proto) }, pid);
    setOp({ title: `Sửa template "${model.name}"`, summary: 'Gửi lại toàn bộ model với phần đã sửa (tên, ghi chú, deviceConfig).', method: 'POST', path: 'deviceModel/updateNew', body, run: () => sendModelUpdate(pid, body) });
  }
  return (<>
    <h3>Sửa template (ghi thật · chỉ bản preview)</h3>
    {builtIn && <p className="sub">Model dựng sẵn của hệ thống (systemConfig {proto?.systemConfig}): không sửa được — dùng “+ Thêm template…” ở trên để tạo bản sao.</p>}
    <label className="sub" style={{ display: 'block' }}>Tên template</label><input style={{ width: '100%' }} value={name} disabled={builtIn} onChange={e => setName(e.target.value)} />
    <label className="sub" style={{ display: 'block', marginTop: 8 }}>Ghi chú</label><input style={{ width: '100%' }} value={remark} disabled={builtIn} onChange={e => setRemark(e.target.value)} />
    {!builtIn && type && <TemplateFields typeValue={typeValue} cfg={cfg} setCfg={setCfg} ctx={ctx} proto={proto} setProto={setProtoSel} locked={skip ? [] : ['gatewayTypes', 'factoryId', 'kmFactory']} />}
    {!builtIn && !skip && <p className="sub" style={{ margin: '4px 0 0' }}>🔒 Như Fonda: khi sửa model đã tạo, ô loại gateway và Producer bị khoá{inUse ? ' (template đang được thiết bị dùng)' : inUse === false ? ' (template chưa được dùng)' : ''}. Tick “bỏ qua kiểm tra” bên dưới để mở khoá và thử.</p>}
    <details style={{ marginTop: 8 }}><summary className="sub" style={{ cursor: 'pointer' }}>deviceConfig (JSON — sửa tay nếu cần)</summary>
      <textarea value={cfg} disabled={builtIn} onChange={e => setCfg(e.target.value)} style={{ width: '100%', height: 220, fontFamily: 'monospace', fontSize: 12 }} /></details>
    <label className="sub" style={{ display: 'block', marginTop: 10 }}><input type="checkbox" checked={skip} onChange={e => setSkip(e.target.checked)} /> {SKIP_LABEL}</label>
    <div style={{ marginTop: 10 }}><button disabled={!ready || builtIn} onClick={ask}>Lưu thay đổi…</button></div>
    {msg && <div className="err" style={{ marginTop: 8, whiteSpace: 'pre-line' }}>{msg}</div>}
    {op && <ConfirmWrite {...op} onConfirm={async () => { await op.run(); }} onClose={changed => { setOp(null); if (changed) onChanged(); }} />}
  </>);
}

/** Nút "+ Thêm loại cột…" (thanh trên) và, khi có `sel`, nút Sửa/Xoá trong drawer. */
export function PoleTypeActions({ pid, sel, usedBy, onChanged, mode, shapes = [] }: { pid: string; sel?: PoleType; usedBy?: number; onChanged: () => void; mode: 'add' | 'edit'; shapes?: Array<{ value: string; name: string }> }) {
  const [form, setForm] = useState<PoleTypeIn>({ name: '', value: '', remark: '' }), [open, setOpen] = useState(false), [msg, setMsg] = useState('');
  const [op, setOp] = useState<Op | null>(null);
  const builtIn = !!sel?.systemConfig;
  function start() { setMsg(''); setForm(mode === 'edit' && sel ? { name: sel.name, value: String(sel.value ?? ''), remark: sel.remark } : { name: '', value: '', remark: '' }); setOpen(true); }
  function ask() {
    const e = poleTypeError(form); if (e) { setMsg(e); return; }
    if (mode === 'add') { const body = poleTypeSaveBody(form, pid); setOp({ title: `Thêm loại cột "${form.name.trim()}"`, summary: 'poleTypeValue là số thứ tự (không bắt buộc duy nhất — loại hệ thống dùng 1–8).', method: 'POST', path: 'poleType/save', body, run: () => sendPoleTypeSave(pid, body) }); }
    else if (sel) { const body = poleTypeUpdateBody(sel.id, form, pid); setOp({ title: `Sửa loại cột "${sel.name}"`, summary: 'Gửi lại bản ghi với phần đã sửa.', method: 'POST', path: 'poleType/update', body, run: () => sendPoleTypeUpdate(pid, body) }); }
  }
  function askDelete() {
    if (!sel) return; setMsg('');
    if (builtIn) { setMsg('Loại cột dựng sẵn của hệ thống — không xoá.'); return; }
    if (usedBy) { setMsg(`Còn ${usedBy} model cột dùng loại này — gỡ/đổi model trước.`); return; }
    setOp({ title: `Xoá loại cột "${sel.name}"`, summary: 'Không hoàn tác được.', method: 'POST', path: 'poleType/delete', body: poleTypeIdsBody([sel.id]), danger: true, run: () => sendPoleTypeDelete(pid, [sel.id]) });
  }
  const dlg = open && (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 2500, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, width: 440, maxWidth: '100%' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{mode === 'add' ? 'Thêm loại cột' : 'Sửa loại cột'}</h2>
        <label className="sub" style={{ display: 'block' }}>Tên</label><input style={{ width: '100%' }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <label className="sub" style={{ display: 'block', marginTop: 8 }}>Kiểu/hình cột (poleTypeValue — 8 giá trị 1–8)</label>
        {shapes.length
          ? <select style={{ width: '100%' }} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}>{!shapes.some(x => x.value === form.value) && <option value={form.value}>{form.value || '(chưa chọn)'}</option>}{shapes.map(x => <option key={x.value} value={x.value}>{x.value} — {x.name}</option>)}</select>
          : <input style={{ width: '100%' }} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />}
        <label className="sub" style={{ display: 'block', marginTop: 8 }}>Ghi chú</label><input style={{ width: '100%' }} value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} />
        {msg && <div className="err" style={{ marginTop: 8, whiteSpace: 'pre-line' }}>{msg}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}><button onClick={ask}>Xem trước & xác nhận…</button><button className="b" onClick={() => setOpen(false)}>Đóng</button></div>
      </div>
    </div>);
  return (<>
    {mode === 'add'
      ? <button style={{ marginBottom: 10 }} onClick={start}>+ Thêm loại cột…</button>
      : <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button className="b" disabled={builtIn} title={builtIn ? 'Loại dựng sẵn của hệ thống' : ''} onClick={start}>Sửa…</button>
          <button className="b" disabled={builtIn} onClick={askDelete}>Xoá…</button>
          {msg && !open && <div className="err" style={{ width: '100%' }}>{msg}</div>}
        </div>}
    {dlg}
    {op && <ConfirmWrite {...op} onConfirm={async () => { await op.run(); }} onClose={changed => { setOp(null); if (changed) { setOpen(false); onChanged(); } }} />}
  </>);
}
