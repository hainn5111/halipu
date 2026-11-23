// Luật kiểm tra giá trị `deviceConfig` lấy từ form tạo template của Fonda (quét front-end 2026-11-20: `rules` + `validLampData`). Hàm thuần, có test.
// CHÚ Ý: chỉ kiểm khoảng giá trị của khoá có mặt và không rỗng. "Bắt buộc" (required) phụ thuộc loại nào hiện ô nào — chưa có dữ liệu render nên chưa kiểm.
export interface Range { min: number; max: number; /** khoảng mở ở đầu: giá trị phải > min (vd 0 không hợp lệ) */ excl?: boolean; int?: boolean }

/** validator → khoảng (tên validator của Fonda: isNum1to255, valid1to999, isNum1to1000, valid1to099999, isDouble0to10Without0, isDouble0to1Without0, isInt1to10, isGreZero). */
export const RANGES: Record<string, Range> = {
  voltageP: { min: 1, max: 255 }, pathNum: { min: 1, max: 255 }, di: { min: 1, max: 255 }, ai: { min: 1, max: 255 },
  power: { min: 1, max: 999 }, waterTankCapacity: { min: 1, max: 999 },
  lampLifetime: { min: 1, max: 99999 },
  nominalPower: { min: 1, max: 1000 }, lampPower: { min: 1, max: 1000 }, ratedApparentPower: { min: 1, max: 1000 }, ratedVoltage: { min: 1, max: 1000 },
  nominalCurrent: { min: 0, max: 10, excl: true }, ratedCurrent: { min: 0, max: 10, excl: true },
  ratedPowerFactor: { min: 0, max: 1, excl: true },
  taskNum: { min: 1, max: 10, int: true },
  high: { min: 0, max: Number.MAX_SAFE_INTEGER, excl: true, int: true }, wide: { min: 0, max: Number.MAX_SAFE_INTEGER, excl: true, int: true },
};
export const MODEL_NAME_MAX = 48;

const isEmpty = (v: unknown) => v === '' || v == null;

/** Danh sách lỗi (tiếng Việt) của `config` cho loại `typeValue`. `only` = các khoá đang hiện trong form (không đưa vào thì kiểm mọi khoá). Rỗng = hợp lệ. */
export function configErrors(typeValue: number, name: string, config: Record<string, unknown>, only?: string[]): string[] {
  const errs: string[] = [];
  if (name.trim().length > MODEL_NAME_MAX) errs.push(`Tên template tối đa ${MODEL_NAME_MAX} ký tự`);
  for (const [k, r] of Object.entries(RANGES)) {
    if (only && !only.includes(k)) continue;   // như Fonda: chỉ kiểm ô ĐANG HIỆN trong form của loại này (vd LCU không có lampLifetime/ratedCurrent)
    const v = config[k]; if (isEmpty(v)) continue;
    const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
    const bad = !Number.isFinite(n) || (r.excl ? n <= r.min : n < r.min) || n > r.max || (r.int && !Number.isInteger(n));
    if (bad) errs.push(`${k}: phải ${r.int ? 'là số nguyên ' : 'là số '}${r.excl ? `> ${r.min}` : `≥ ${r.min}`} và ≤ ${r.max === Number.MAX_SAFE_INTEGER ? '∞' : r.max}`);
  }
  // validLampData của Fonda (chỉ Lamps, loại 5): công suất đèn ≤ công suất danh định; dòng định mức ≤ dòng danh định
  if (typeValue === 5) {
    const lp = Number(config.lampPower), np = Number(config.nominalPower), rc = Number(config.ratedCurrent), nc = Number(config.nominalCurrent);
    if (!isEmpty(config.nominalPower) && Number.isFinite(lp) && Number.isFinite(np) && lp > np) errs.push('Lamps: lampPower không được lớn hơn nominalPower');
    if (!isEmpty(config.nominalCurrent) && Number.isFinite(rc) && Number.isFinite(nc) && rc > nc) errs.push('Lamps: ratedCurrent không được lớn hơn nominalCurrent');
  }
  return errs;
}
