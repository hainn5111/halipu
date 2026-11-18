import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy } from 'react';

// Manifest điều hướng: group → tab. Thêm màn hình mới = thêm 1 mục + 1 thư mục trong features/. Mỗi tab tải lười khi được mở.
export interface TabDef {
  id: string;
  label: string;
  /** Không có = tab "sắp có" (chỉ hiện nhãn). */
  view?: LazyExoticComponent<ComponentType>;
}
export interface GroupDef { group: string; tabs: TabDef[] }

export const TABS: GroupDef[] = [
  { group: 'Giám sát', tabs: [
    { id: 'gis', label: 'GIS', view: lazy(() => import('../features/gis/Gis')) },
    { id: 'overview', label: 'Tổng quan' },
    { id: 'alarm', label: 'Cảnh báo' },
  ] },
  { group: 'Thiết bị', tabs: [
    { id: 'lcus', label: 'Danh sách LCU', view: lazy(() => import('../features/lcus/Lcus')) },
    { id: 'groups', label: 'Nhóm đèn' },
  ] },
  { group: 'Vận hành', tabs: [
    { id: 'schedule', label: 'Lịch điều khiển' },
    { id: 'report', label: 'Báo cáo' },
  ] },
];

export const ALL_TABS = TABS.flatMap(g => g.tabs.map(t => ({ ...t, group: g.group })));
