// Bộ giá trị MẶC ĐỊNH mà popup tạo template của Fonda điền sẵn (`dataForm.deviceConfig`, quét front-end 2026-11-20) và cách khởi tạo cấu hình khi thêm template.
import { relevantKeys } from './templateSchema';

export const FONDA_DEFAULTS: Record<string, unknown> = {
  gatewayTypes: '', lampLifetime: 6000, nominalPower: 110, lampPower: 88, ratedApparentPower: 112, nominalCurrent: 0.4, ratedCurrent: 0.4, ratedVoltage: 220, ratedPowerFactor: 0.99,
  factoryId: '', voltageP: '', productId: '', smartBoxType: '', di: '', ai: '', power: '', waterTankCapacity: '', hasTaskNum: 1, taskNum: 10, coverTypes: '', dimmingLevel: 20,
  lampHolderNum: 1, heig: '', wide: '', tempsNum: 6, currentsNum: 6, lcuType: null, cameraType: 1, radarType: null, rtuType: '', powerProtocol: 0, loopType: 1, totalChargingPorts: 1,
};

const blank = (v: unknown) => v === '' || v == null;

/**
 * Cấu hình ban đầu khi THÊM template từ mẫu `base`: gửi cả bộ như Fonda, nhưng ô KHÔNG thuộc loại này lấy giá trị mặc định của Fonda
 * (thay vì 0, 0… của model hệ thống); ô thuộc loại giữ giá trị của mẫu (rỗng thì dùng mặc định); khoá ngoài bộ mặc định (extensions, functionList, poleTypeId…) giữ nguyên.
 */
export function initialConfig(type: number, base: Record<string, unknown>): Record<string, unknown> {
  const rel = relevantKeys(type), out: Record<string, unknown> = {};
  for (const [k, d] of Object.entries(FONDA_DEFAULTS)) out[k] = rel.has(k) && k in base && !blank(base[k]) ? base[k] : d;
  for (const [k, v] of Object.entries(base)) if (!(k in FONDA_DEFAULTS)) out[k] = v;
  return out;
}
