import { show } from '../common/show';
// Hàm thuần cho công cụ "Thử tạo model LCU (không giới hạn)": sửa vài trường trong body JSON mà vẫn để người dùng sửa tay phần còn lại.
type Rec = Record<string, unknown>;

export function parseBody(text: string): { ok: true; body: Rec } | { ok: false; reason: string } {
  try {
    const v = JSON.parse(text);
    if (!v || typeof v !== 'object' || Array.isArray(v)) return { ok: false, reason: 'Body phải là một đối tượng JSON' };
    const b = v as Rec;
    if (!show(b.deviceModelName ?? '').trim()) return { ok: false, reason: 'Thiếu deviceModelName' };
    if (!b.projectId || !b.deviceTypeId) return { ok: false, reason: 'Thiếu projectId hoặc deviceTypeId' };
    if (b.deviceTypeValue !== 2) return { ok: false, reason: 'Công cụ này chỉ dành cho model LCU (deviceTypeValue phải là 2)' };
    return { ok: true, body: b };
  } catch (e) { return { ok: false, reason: `JSON không hợp lệ: ${(e as Error).message}` }; }
}

/** Ghi lại tên / lampHolderNum / lcuType vào body JSON (giữ nguyên các trường khác); trả chuỗi JSON mới, hoặc null nếu JSON đang hỏng. */
export function withFields(text: string, f: { name?: string; lampHolderNum?: number; lcuType?: number | null }): string | null {
  let b: Rec;
  try { b = JSON.parse(text); } catch { return null; }
  if (!b || typeof b !== 'object') return null;
  const cfg: Rec = b.deviceConfig && typeof b.deviceConfig === 'object' ? { ...(b.deviceConfig as Rec) } : {};
  if (f.name !== undefined) b.deviceModelName = f.name;
  if (f.lampHolderNum !== undefined) cfg.lampHolderNum = f.lampHolderNum;
  if (f.lcuType !== undefined) cfg.lcuType = f.lcuType;
  b.deviceConfig = cfg;
  return JSON.stringify(b, null, 2);
}

/** So sánh giá trị đã gửi với giá trị server trả lại (để thấy server có sửa/ép hay không). */
export function compareStored(sent: Rec, stored: unknown): Array<{ field: string; sent: unknown; stored: unknown; same: boolean }> {
  const s = (stored && typeof stored === 'object' ? stored : {}) as Rec;
  const sc = (sent.deviceConfig ?? {}) as Rec, tc = (s.deviceConfig ?? {}) as Rec;
  const rows: Array<[string, unknown, unknown]> = [['lampHolderNum', sc.lampHolderNum, tc.lampHolderNum], ['lcuType', sc.lcuType, tc.lcuType], ['functionList', JSON.stringify(sc.functionList), JSON.stringify(tc.functionList)], ['protocolValue', sent.protocolValue, s.protocolValue], ['systemConfig', '(không gửi)', s.systemConfig]];
  return rows.map(([field, a, b2]) => ({ field, sent: a, stored: b2, same: JSON.stringify(a) === JSON.stringify(b2) }));
}
