import type { PoleCatalog } from '../../adapters/fonda';
import { emptyGroup, type GroupForm, type LampForm } from './groups';

// Danh sách các "bộ" đèn–LCU của một cột (giống form Fonda): mỗi bộ chọn kiểu LCU (không có / có sẵn / tạo mới) và khai các đèn.
interface Props { groups: GroupForm[]; onChange: (g: GroupForm[]) => void; catalog: PoleCatalog; /** LCU đã dùng ở nơi khác (cột hiện có) */ takenLcuIds?: string[] }

export default function GroupsEditor({ groups, onChange, catalog, takenLcuIds = [] }: Props) {
  const upd = (i: number, patch: Partial<GroupForm>) => onChange(groups.map((g, k) => (k === i ? { ...g, ...patch } : g)));
  const updLamp = (i: number, j: number, patch: Partial<LampForm>) => upd(i, { lamps: groups[i].lamps.map((l, k) => (k === j ? { ...l, ...patch } : l)) });
  const usedElsewhere = (i: number) => [...takenLcuIds, ...groups.filter((g, k) => k !== i && g.kind === 'existing').map(g => g.lcuId)];
  const w = { width: '100%' } as const;
  return (
    <div>
      {groups.map((g, i) => {
        const free = catalog.freeLcus.filter(l => !usedElsewhere(i).includes(l.id));
        const slots = g.kind === 'existing' ? catalog.freeLcus.find(l => l.id === g.lcuId)?.slots ?? 1 : g.kind === 'new' ? catalog.lcuModels.find(m => m.id === g.newModel)?.slots ?? 1 : 1;
        return (
          <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 10, marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <b>Bộ #{i + 1}</b>
              <select value={g.kind} onChange={e => upd(i, { kind: e.target.value as GroupForm['kind'], lcuId: g.lcuId || free[0]?.id || '', lamps: e.target.value === 'none' ? g.lamps.slice(0, 1).map(l => ({ ...l, channel: 1 })) : g.lamps })}>
                <option value="none">Đèn không LCU (gắn thẳng cột)</option>
                <option value="existing">LCU có sẵn</option>
                <option value="new">Tạo LCU mới</option>
              </select>
              <button className="b" style={{ marginLeft: 'auto' }} onClick={() => onChange(groups.filter((_, k) => k !== i))}>Bỏ bộ</button>
            </div>
            {g.kind === 'existing' && (free.length
              ? <select style={{ ...w, marginTop: 8 }} value={g.lcuId} onChange={e => upd(i, { lcuId: e.target.value })}>{free.map(l => <option key={l.id} value={l.id}>{l.uid} — {l.name} ({l.model}, {l.slots} đầu đèn)</option>)}</select>
              : <p className="err" style={{ margin: '8px 0 0' }}>Không còn LCU nào chưa gắn cột.</p>)}
            {g.kind === 'new' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <select style={{ gridColumn: '1 / -1' }} value={g.newModel} onChange={e => upd(i, { newModel: e.target.value })}>{catalog.lcuModels.map(m => <option key={m.id} value={m.id}>{m.name} ({m.slots} đầu đèn{Number.isNaN(m.protocolValue) ? ', thiếu giao thức' : ''})</option>)}</select>
                <input placeholder="Tên LCU" value={g.newName} onChange={e => upd(i, { newName: e.target.value })} />
                <input placeholder="UID (hex, vd 789DDD)" value={g.newUid} onChange={e => upd(i, { newUid: e.target.value })} />
              </div>)}
            {g.kind !== 'none' && <p className="sub" style={{ margin: '8px 0 0' }}>LCU này có <b>{slots}</b> đầu đèn (cố định theo model) — tối đa {slots} đèn, kênh 1..{slots}.</p>}
            {g.lamps.map((l, j) => (
              <div key={j} style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                <span className="sub" style={{ margin: 0, minWidth: 44 }}>Đèn {j + 1}</span>
                <select style={{ flex: 1 }} value={l.modelId} onChange={e => updLamp(i, j, { modelId: e.target.value })}>{catalog.lampModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                <input style={{ flex: 1 }} placeholder="Tên đèn" value={l.name} onChange={e => updLamp(i, j, { name: e.target.value })} />
                {g.kind !== 'none' && slots > 1 && <input type="number" min={1} max={slots} title={`Kênh 1..${slots}`} style={{ width: 60 }} value={l.channel} onChange={e => updLamp(i, j, { channel: Number(e.target.value) })} />}
                {g.kind !== 'none' && g.lamps.length > 1 && <button className="b" onClick={() => upd(i, { lamps: g.lamps.filter((_, k) => k !== j) })}>×</button>}
              </div>))}
            {g.kind !== 'none' && g.lamps.length < slots && <button className="b" style={{ marginTop: 8 }} onClick={() => upd(i, { lamps: [...g.lamps, { modelId: catalog.lampModels[0]?.id ?? '', name: '', channel: Math.min(slots, g.lamps.length + 1) }] })}>+ Thêm đèn (kênh)</button>}
          </div>
        );
      })}
      <button className="b" style={{ marginTop: 10 }} onClick={() => onChange([...groups, emptyGroup(catalog, [...takenLcuIds, ...groups.filter(g => g.kind === 'existing').map(g => g.lcuId)])])}>+ Thêm bộ đèn–LCU</button>
    </div>
  );
}
