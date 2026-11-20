// Hàm thuần cho công cụ thử dictionary (ghi thử). Bản ghi thô: {dictValue, dsName, dictName, dictStairId, dictStairRemark, dictId, dictType, dictionarySecond[], …}.
type Rec = Record<string, unknown>;
const DROP = ['dictId', 'createTime', 'createUserId', 'updateTime', 'updateUserId'];

/** Các key dictionary (1..max) có chứa `needle` trong dsName/dictName — để tìm xem mục vừa thêm nằm ở đâu. */
export function findInDicts(all: Record<string, Rec[]>, needle: string): string[] {
  const n = needle.trim().toLowerCase(); if (!n) return [];
  const has = (r: Rec): boolean => `${String(r.dsName ?? '')} ${String(r.dictName ?? '')}`.toLowerCase().includes(n) || (Array.isArray(r.dictionarySecond) && (r.dictionarySecond as Rec[]).some(c => !!c && typeof c === 'object' && has(c)));   // cả mục con (dictionarySecond)
  return Object.entries(all).filter(([, items]) => items.some(has)).map(([k]) => k);
}

/** Giá trị số kế tiếp (lớn nhất + 1) trong các bản ghi thô; không có số thì 1. */
export function nextDictValue(items: Rec[]): number {
  const nums = items.map(r => (typeof r.dictValue === 'number' || typeof r.dictValue === 'string' ? Number(r.dictValue) : NaN)).filter(Number.isFinite);   // dictValue lạ (object) bị bỏ qua, không ném lỗi
  return nums.length ? Math.max(...nums) + 1 : 1;
}

/** Sao chép một bản ghi để thêm mục mới: bỏ id/dấu vết tạo-sửa, đổi tên giá trị (`dsName`) và `dictValue`; giữ nguyên các trường còn lại (nhóm, dictType…). */
export function cloneDictBody(src: Rec, o: { name: string; value: number | string; remark?: string; dictKey?: string; keepDictId?: boolean; keepStairId?: boolean }): Rec {
  const b: Rec = { ...src };
  for (const k of DROP) if (!(k === 'dictId' && o.keepDictId)) delete b[k];
  if (!o.keepStairId) delete b.dictStairId;   // id RIÊNG của mục được sao chép — mục mới không được dùng lại
  b.dsName = o.name; b.dictValue = o.value;
  if (o.dictKey) b.dictKey = o.dictKey;   // server đòi `dictKey` (lỗi "Parameter dictKey cannot be empty") — bản ghi đọc về không có trường này; thử = key nhóm
  if (o.remark !== undefined && 'dictStairRemark' in b) b.dictStairRemark = o.remark;
  if (Array.isArray(b.dictionarySecond)) b.dictionarySecond = [];
  return b;
}

/** Kiểm tra body trước khi gửi: JSON object, có dsName và dictValue. */
export function dictBodyError(text: string): { ok: true; body: Rec } | { ok: false; reason: string } {
  let v: unknown; try { v = JSON.parse(text); } catch { return { ok: false, reason: 'JSON không hợp lệ' }; }
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { ok: false, reason: 'Body phải là một object' };
  const b = v as Rec;
  if (!String(b.dsName ?? '').trim()) return { ok: false, reason: 'Thiếu dsName (tên giá trị)' };
  if (b.dictValue == null || b.dictValue === '') return { ok: false, reason: 'Thiếu dictValue' };
  return { ok: true, body: b };
}
