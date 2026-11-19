import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy } from 'react';
import { PREVIEW_TOOLS } from '../core/flags';

// Manifest điều hướng: group → tab. Thêm màn hình mới = thêm 1 mục + 1 thư mục trong features/. Mỗi tab tải lười khi được mở.
export interface TabDef {
  id: string;
  label: string;
  /** Không có = tab "sắp có" (chỉ hiện nhãn). */
  view?: LazyExoticComponent<ComponentType>;
}
export interface GroupDef { group: string; tabs: TabDef[] }

// Công cụ dò/thử nghiệm: CHỈ có trong bản build có VITE_ENABLE_PROBE=1 (preview của nhánh/PR, hoặc `npm run dev`).
// Bản deploy từ main (pages.yml) không đặt biến này → nhóm bị loại khỏi bundle, không có tab lẫn mã. Công cụ dò mới thêm vào nhóm này.
const PROBE_TOOLS = PREVIEW_TOOLS;

export const TABS: GroupDef[] = [
  { group: 'Giám sát', tabs: [
    { id: 'gis', label: 'GIS', view: lazy(() => import('../features/gis/Gis')) },
    { id: 'overview', label: 'Tổng quan' },
    { id: 'alarm', label: 'Cảnh báo' },
  ] },
  { group: 'Thiết bị', tabs: [
    { id: 'lcus', label: 'Danh sách LCU', view: lazy(() => import('../features/lcus/Lcus')) },
    { id: 'poles', label: 'Cột đèn & liên kết', view: lazy(() => import('../features/poles/Poles')) },
    { id: 'rtu', label: 'RTU', view: lazy(() => import('../features/devices/tabs').then(m => ({ default: m.Rtu }))) },
    { id: 'gateway', label: 'Gateway', view: lazy(() => import('../features/devices/tabs').then(m => ({ default: m.Gateway }))) },
    { id: 'smartbox', label: 'SmartBox', view: lazy(() => import('../features/devices/tabs').then(m => ({ default: m.SmartBox }))) },
    { id: 'sensor', label: 'Cảm biến', view: lazy(() => import('../features/devices/tabs').then(m => ({ default: m.Sensor }))) },
    { id: 'meter', label: 'Công tơ', view: lazy(() => import('../features/devices/tabs').then(m => ({ default: m.Meter }))) },
    { id: 'camera', label: 'Camera', view: lazy(() => import('../features/devices/tabs').then(m => ({ default: m.Camera }))) },
    { id: 'devices', label: 'Thiết bị khác', view: lazy(() => import('../features/devices/tabs').then(m => ({ default: m.Other }))) },
    { id: 'models', label: 'Mẫu thiết bị', view: lazy(() => import('../features/devices/Models')) },
    { id: 'groups', label: 'Nhóm đèn' },
  ] },
  { group: 'Vận hành', tabs: [
    { id: 'schedule', label: 'Lịch điều khiển' },
    { id: 'report', label: 'Báo cáo' },
  ] },
  ...(PROBE_TOOLS ? [{ group: 'Công cụ dò (chỉ preview)', tabs: [
    { id: 'probe', label: 'Dò API (chỉ đọc)', view: lazy(() => import('../features/probe/Probe')) },
    { id: 'lcu-lab', label: 'Thử tạo model LCU (ghi)', view: lazy(() => import('../features/probe/LcuLab')) },
    { id: 'lcu-device-lab', label: 'Thử thêm LCU theo model (ghi)', view: lazy(() => import('../features/probe/LcuDeviceLab')) },
    { id: 'capture', label: 'Bắt request (API ghi)', view: lazy(() => import('../features/probe/Capture')) },
  ] }] : []),
];

export const ALL_TABS = TABS.flatMap(g => g.tabs.map(t => ({ ...t, group: g.group })));
