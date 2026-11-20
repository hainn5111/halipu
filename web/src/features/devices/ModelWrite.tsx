import { useEffect, useState } from 'react';
import { modelCloneBody, modelUpdateBody, sendModelCreate, sendModelDelete, sendModelUpdate, sendPoleTypeDelete, sendPoleTypeSave, sendPoleTypeUpdate, poleTypeSaveBody, poleTypeUpdateBody, poleTypeIdsBody, type ModelProto } from '../../adapters/fonda';
import { modelIdsBody, modelNameError, poleTypeError, type PoleTypeIn } from '../../adapters/fonda/writeBodies';
import type { PoleType } from '../../adapters/fonda/mappers';
import type { DeviceModel, DeviceType } from '../../core/types';
import ConfirmWrite from '../common/ConfirmWrite';

// Thêm / sửa / xoá template (model) mọi loại và loại cột (PoleType) — GHI THẬT, chỉ bản preview. Payload: docs/15 §7 (bắt 2026-11-20). Luôn qua hộp xác nhận.
type Op = { title: string; summary: string; method: string; path: string; body: unknown; danger?: boolean; run: () => Promise<unknown> };
const toProto = (p?: ModelProto) => (p ? { id: p.id, value: p.value, name: p.name, version: p.version } : undefined);

export function ModelActions({ pid, model, type, proto, onChanged }: { pid: string; model: DeviceModel; type?: DeviceType; proto?: ModelProto; onChanged: () => void }) {
  const [name, setName] = useState(''), [remark, setRemark] = useState(''), [cfg, setCfg] = useState(''), [msg, setMsg] = useState('');
  const [op, setOp] = useState<Op | null>(null);
  const builtIn = (proto?.systemConfig ?? 0) > 0;   // model dựng sẵn của hệ thống: không sửa/xoá
  useEffect(() => { setName(model.name); setRemark(proto?.remark ?? ''); setCfg(JSON.stringify(model.config, null, 2)); setMsg(''); }, [model.id, model.name, model.config, proto?.remark]);
  const typeValue = type?.value ?? NaN;
  const ready = !!type && Number.isFinite(typeValue);

  function parsedCfg(): Record<string, unknown> | null {
    try { const v = JSON.parse(cfg); return v && typeof v === 'object' && !Array.isArray(v) ? v : null; } catch { return null; }
  }
  function askClone() {
    setMsg(''); const c = parsedCfg(); const e = modelNameError(name, c); if (e || !c || !type) { setMsg(e ?? 'deviceConfig không hợp lệ'); return; }
    if (name.trim() === model.name) { setMsg('Đặt tên khác tên template gốc để nhân bản'); return; }
    const body = modelCloneBody({ typeId: type.id, typeValue, config: c, protocol: toProto(proto) }, name.trim(), pid, remark.trim());
    setOp({ title: `Thêm template "${name.trim()}"`, summary: `Nhân bản "${model.name}" (loại ${type.name}). Server tự giữ lại các khoá deviceConfig thuộc loại này.`, method: 'POST', path: 'deviceModel/saveNew', body, run: () => sendModelCreate(pid, body) });
  }
  function askUpdate() {
    setMsg(''); const c = parsedCfg(); const e = modelNameError(name, c); if (e || !c || !type) { setMsg(e ?? 'deviceConfig không hợp lệ'); return; }
    if (builtIn) { setMsg('Model dựng sẵn của hệ thống — không sửa.'); return; }
    const body = modelUpdateBody({ id: model.id, typeId: type.id, typeValue, typeName: type.name, name: name.trim(), remark: remark.trim(), config: c, protocol: toProto(proto) }, pid);
    setOp({ title: `Sửa template "${model.name}"`, summary: 'Gửi lại toàn bộ model với phần đã sửa (tên, ghi chú, deviceConfig).', method: 'POST', path: 'deviceModel/updateNew', body, run: () => sendModelUpdate(pid, body) });
  }
  function askDelete() {
    setMsg('');
    if (builtIn) { setMsg('Model dựng sẵn của hệ thống — không xoá.'); return; }
    setOp({ title: `Xoá template "${model.name}"`, summary: 'Nếu template còn được thiết bị dùng, server từ chối (code 1018 "is in use"). Không hoàn tác được.', method: 'POST', path: 'deviceModel/delete', body: modelIdsBody([model.id]), danger: true, run: () => sendModelDelete(pid, [model.id]) });
  }
  return (<>
    <h3>Thêm / sửa / xoá template (ghi thật · chỉ bản preview)</h3>
    {!ready && <p className="sub">Chưa xác định loại thiết bị của template này.</p>}
    {builtIn && <p className="sub">Model dựng sẵn của hệ thống (systemConfig {proto?.systemConfig}): chỉ nhân bản được, không sửa/xoá.</p>}
    <label className="sub" style={{ display: 'block' }}>Tên template</label><input style={{ width: '100%' }} value={name} onChange={e => setName(e.target.value)} />
    <label className="sub" style={{ display: 'block', marginTop: 8 }}>Ghi chú</label><input style={{ width: '100%' }} value={remark} onChange={e => setRemark(e.target.value)} />
    <details style={{ marginTop: 8 }}><summary className="sub" style={{ cursor: 'pointer' }}>deviceConfig (JSON — sửa tay nếu cần)</summary>
      <textarea value={cfg} onChange={e => setCfg(e.target.value)} style={{ width: '100%', height: 220, fontFamily: 'monospace', fontSize: 12 }} /></details>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
      <button disabled={!ready} onClick={askClone}>+ Thêm bản sao…</button>
      <button className="b" disabled={!ready || builtIn} onClick={askUpdate}>Lưu thay đổi…</button>
      <button className="b" disabled={!ready || builtIn} onClick={askDelete}>Xoá template…</button>
    </div>
    <p className="sub" style={{ margin: '6px 0 0' }}>“Thêm bản sao” dùng tên/ghi chú/deviceConfig đang nhập (phải đổi tên khác gốc) và tạo template mới cùng loại.</p>
    {msg && <div className="err" style={{ marginTop: 8 }}>{msg}</div>}
    {op && <ConfirmWrite {...op} onConfirm={async () => { await op.run(); }} onClose={changed => { setOp(null); if (changed) onChanged(); }} />}
  </>);
}

/** Nút "+ Thêm loại cột…" (thanh trên) và, khi có `sel`, nút Sửa/Xoá trong drawer. */
export function PoleTypeActions({ pid, sel, usedBy, onChanged, mode }: { pid: string; sel?: PoleType; usedBy?: number; onChanged: () => void; mode: 'add' | 'edit' }) {
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
        <label className="sub" style={{ display: 'block', marginTop: 8 }}>Giá trị (poleTypeValue, số nguyên)</label><input style={{ width: '100%' }} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
        <label className="sub" style={{ display: 'block', marginTop: 8 }}>Ghi chú</label><input style={{ width: '100%' }} value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} />
        {msg && <div className="err" style={{ marginTop: 8 }}>{msg}</div>}
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
