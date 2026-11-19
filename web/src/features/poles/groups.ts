import type { PoleCatalog } from '../../adapters/fonda';
import type { GroupInput } from '../../adapters/fonda/writeBodies';

// Trạng thái form của một "bộ" (đèn + LCU) và phép chuyển sang GroupInput để dựng body.
export interface LampForm { modelId: string; name: string; channel: number }
export interface GroupForm { kind: 'none' | 'existing' | 'new'; lcuId: string; newModel: string; newName: string; newUid: string; lamps: LampForm[] }

export const emptyGroup = (c: PoleCatalog, used: string[] = []): GroupForm => ({
  kind: 'none', lcuId: c.freeLcus.find(l => !used.includes(l.id))?.id ?? '', newModel: c.lcuModels[0]?.id ?? '', newName: '', newUid: '',
  lamps: [{ modelId: c.lampModels[0]?.id ?? '', name: '', channel: 1 }],
});

export function toInput(f: GroupForm, c: PoleCatalog): GroupInput {
  const lamps = f.lamps.map(l => ({ ...l, channel: Number(l.channel) }));
  if (f.kind === 'existing') { const l = c.freeLcus.find(x => x.id === f.lcuId); return { lcu: { kind: 'existing', deviceId: l?.id ?? '', uid: l?.uid ?? '', slots: l?.slots ?? 1 }, lamps }; }
  if (f.kind === 'new') {
    const m = c.lcuModels.find(x => x.id === f.newModel);
    return { lcu: { kind: 'new', modelId: m?.id ?? '', name: f.newName, uid: f.newUid, slots: m?.slots ?? 1, protocolValue: m?.protocolValue ?? NaN, protocolName: m?.protocolName ?? '' }, lamps };
  }
  return { lcu: { kind: 'none' }, lamps: lamps.slice(0, 1).map(l => ({ ...l, channel: 1 })) };
}
