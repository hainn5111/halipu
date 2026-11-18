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
  /** Bản ghi gốc từ API (để xem toàn bộ thông tin đang có). */
  raw: Record<string, unknown>;
}

/** Model thiết bị (template). `config` là deviceConfig đã parse từ chuỗi JSON. */
export interface DeviceModel { id: string; name: string; typeId: string; config: Record<string, unknown> }

/** Một dòng của bảng cấu hình: giá trị đơn, hoặc danh sách thiết bị đính kèm theo template. */
export type ConfigEntry =
  | { key: string; kind: 'value'; text: string }
  | { key: string; kind: 'attached'; items: Array<{ name: string; checked: boolean; extra: string }> };

/** Liên kết của một cột đèn: những gì đang gắn trên cột (LCU kèm đèn theo kênh, đèn rời không LCU, thiết bị khác). */
export interface PoleLamp { id: string; name: string; channel: number; model: string }
export interface PoleGroup {
  /** Có = nhóm "LCU + đèn"; không có = đèn gắn thẳng vào cột (chưa có LCU). */
  lcu?: { id: string; uid: string; slots?: number; model: string };
  lamps: PoleLamp[];
}
export interface PoleLinks {
  pole: { id: string; name: string; code: string; model: string; address: string; lat?: number; lng?: number };
  groups: PoleGroup[];
  /** Thiết bị khác gắn trên cột, theo loại (camera, sensor, wifi…). */
  others: Array<{ kind: string; items: Array<{ name: string }> }>;
}
