// Ô nhập của popup tạo template Fonda theo từng loại: ô nào HIỆN, ô nào BẮT BUỘC. Nguồn: quét front-end 2026-11-20 (điều kiện `N===e.dataForm.deviceTypeValue`,
// `[..].includes(...)` đứng trước từng `el-form-item` + `rules` `required`). Hàm thuần, có test.
export interface VisCtx { type: number; protocol?: number; /** `lcuCtype` trong cấu hình (LCU) */ lcuCtype?: unknown }
export interface FieldSpec { key: string; label: string; required: boolean; when: (c: VisCtx) => boolean; hint?: string }

const T = (...t: number[]) => (c: VisCtx) => t.includes(c.type);
const P = (...p: number[]) => (c: VisCtx) => c.protocol != null && p.includes(c.protocol);
const and = (...f: Array<(c: VisCtx) => boolean>) => (c: VisCtx) => f.every(x => x(c));
/** 65 = Solar Light (isSolarTypeValue); 68 dùng chung nhóm đèn. */
const LAMPISH = T(5, 65, 68);

export const FIELDS: FieldSpec[] = [
  { key: 'voltageP', label: 'Tỉ số điện áp (voltageP)', required: true, when: T(1), hint: '1–255' },
  { key: 'currentP', label: 'Tỉ số dòng (currentP)', required: true, when: T(1) },
  { key: 'meterType', label: 'Loại công tơ (meterType)', required: true, when: T(1) },
  { key: 'lcuType', label: 'Loại LCU (lcuType)', required: true, when: and(T(2), P(4, 53)) },
  { key: 'productId', label: 'Product ID', required: true, when: and(T(2), P(2, 18, 25, 50)) },
  { key: 'lampHolderNum', label: 'Số đầu đèn (lampHolderNum)', required: true, when: T(2, 56) },
  { key: 'dimmingLevel', label: 'Mức dim (dimmingLevel)', required: true, when: T(2, 56, 67) },
  { key: 'loopType', label: 'Chu kỳ tuần (loopType)', required: false, when: and(P(3, 4, 53), T(2, 67)) },
  { key: 'bandName', label: 'Tần số (bandName)', required: true, when: and(T(2), P(3), c => c.lcuCtype !== 2) },
  { key: 'gatewayTypes', label: 'Loại gateway (gatewayTypes)', required: true, when: T(3) },
  { key: 'rtuType', label: 'Loại concentrator (rtuType)', required: true, when: T(4) },
  { key: 'lampTypes', label: 'Loại đèn (lampTypes)', required: true, when: LAMPISH },
  { key: 'powerTypes', label: 'Loại nguồn (powerTypes)', required: true, when: T(5, 68) },
  { key: 'powerProtocol', label: 'Power protocol', required: true, when: T(5) },
  { key: 'lampLifetime', label: 'Tuổi thọ đèn (h) (lampLifetime)', required: true, when: T(5, 65, 68), hint: '1–99999' },
  { key: 'nominalPower', label: 'Công suất danh định (W) (nominalPower)', required: true, when: LAMPISH, hint: '1–1000' },
  { key: 'lampPower', label: 'Công suất định mức (W) (lampPower)', required: true, when: T(5, 68), hint: '1–1000; ≤ nominalPower' },
  { key: 'ratedApparentPower', label: 'Công suất biểu kiến (ratedApparentPower)', required: true, when: T(5, 68), hint: '1–1000' },
  { key: 'nominalCurrent', label: 'Dòng danh định (A) (nominalCurrent)', required: true, when: LAMPISH, hint: '(0,10]' },
  { key: 'ratedCurrent', label: 'Dòng định mức (A) (ratedCurrent)', required: true, when: T(5, 68), hint: '(0,10]; ≤ nominalCurrent' },
  { key: 'ratedVoltage', label: 'Điện áp định mức (V) (ratedVoltage)', required: true, when: T(5, 68), hint: '1–1000' },
  { key: 'ratedPowerFactor', label: 'Hệ số công suất (ratedPowerFactor)', required: true, when: T(5, 68), hint: '(0,1]' },
  { key: 'poleTypeId', label: 'Loại cột (poleTypeId)', required: true, when: T(6) },
  { key: 'poleArmType', label: 'Kiểu tay đèn (poleArmType)', required: false, when: T(6) },
  { key: 'smartBoxType', label: 'Loại smart box (smartBoxType)', required: true, when: T(8) },
  { key: 'pathNum', label: 'Số mạch (pathNum)', required: true, when: T(9, 10, 11), hint: '1–255' },
  { key: 'di', label: 'Số DI (di)', required: false, when: T(9), hint: '1–255' },
  { key: 'ai', label: 'Số AI (ai)', required: false, when: T(9), hint: '1–255' },
  { key: 'kmFactory', label: 'Producer (kmFactory)', required: true, when: T(9) },
  { key: 'coverTypes', label: 'Loại nắp (coverTypes)', required: true, when: T(14) },
  { key: 'sensitivity', label: 'Độ nhạy (sensitivity)', required: true, when: T(15) },
  { key: 'cameraType', label: 'Loại camera (cameraType)', required: true, when: T(18) },
  { key: 'totalChargingPorts', label: 'Số cổng sạc (totalChargingPorts)', required: true, when: and(T(26), P(64)), hint: '1–20' },
  { key: 'high', label: 'Chiều cao (high)', required: true, when: T(27), hint: 'số nguyên > 0' },
  { key: 'wide', label: 'Chiều rộng (wide)', required: true, when: T(27), hint: 'số nguyên > 0' },
  { key: 'powerBoxType', label: 'Loại power box (powerBoxType)', required: true, when: T(32) },
  { key: 'breakerType', label: 'Loại aptomat (breakerType)', required: false, when: T(37) },
  { key: 'power', label: 'Công suất kW·h (power)', required: false, when: T(46), hint: '1–999' },
  { key: 'waterTankCapacity', label: 'Dung tích bể nước (L)', required: false, when: T(46), hint: '1–999' },
  { key: 'tempsNum', label: 'Số cảm biến nhiệt (tempsNum)', required: true, when: T(48) },
  { key: 'currentsNum', label: 'Số cảm biến dòng (currentsNum)', required: true, when: T(48) },
  { key: 'radarType', label: 'Loại radar (radarType)', required: true, when: and(T(54), P(1, 12, 4)) },
  { key: 'hnVersion', label: 'Phiên bản thiết bị (hnVersion)', required: true, when: and(T(60), P(47)) },
];

/** Producer chung: `factoryId` hiện ở các loại này (riêng Switch lưu vào `kmFactory`). */
export const FACTORY_TYPES = [9, 16, 17, 18, 60, 64, 46, 51, 52, 53, 55];

export const visibleFields = (c: VisCtx): FieldSpec[] => FIELDS.filter(f => f.when(c));

const empty = (v: unknown) => v === '' || v == null;
/** Trường bắt buộc đang hiện nhưng chưa có giá trị. (`poleTypeId` rỗng ↔ Fonda gán `poleType = null` → rule `poleType` required.) */
export function requiredErrors(c: VisCtx, config: Record<string, unknown>): string[] {
  return visibleFields(c).filter(f => f.required && empty(config[f.key])).map(f => `${f.label}: bắt buộc`);
}
