// Kiểu dữ liệu CỦA MÌNH (không phụ thuộc hình dạng DTO của Fonda). Adapter chịu trách nhiệm chuyển đổi.
export interface Lcu {
  uid: string;
  lcuId: string;
  name: string;
  code: string;
  projectId: string;
  lat?: number;
  lng?: number;
  /** Công suất định mức của đèn (W), nếu biết. */
  ratedPower?: number;
}

export interface Measurement {
  ts: number;
  time: string;
  power?: number;
  voltage?: number;
  current?: number;
  pf?: number;
  energy?: number;
  dim?: number;
  wp?: number;
}

export interface LightStatus {
  time: string;
  power?: number;
  voltage?: number;
  current?: number;
  pf?: number;
  lux?: number;
  fault?: number;
  lastAction?: number;
  lastSource?: number;
}

export type LampCommand = 'turnOn' | 'turnOff' | 'dimming';

/** Loại thiết bị của dự án (LCU, RTU, Gateway, Cảm biến…). */
export interface DeviceType { id: string; value: number; name: string }

/** Thiết bị bất kỳ (không phải LCU) từ API thiết bị chung. */
export interface DeviceItem {
  id: string;
  uid: string;
  name: string;
  code: string;
  typeValue: number;
  model: string;
  /** Mã trạng thái thô của Fonda (chưa rõ nghĩa từng giá trị). */
  status?: number;
  lat?: number;
  lng?: number;
  address: string;
}
