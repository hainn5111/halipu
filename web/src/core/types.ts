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
