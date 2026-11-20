---
tags:
  - smart-lighting
  - architecture
  - documentation
  - moc
created: 2026-11-19
platform_url: http://159.138.45.45:81
api_base: http://159.138.45.45:18080/api/v1.0
ws_endpoint: ws://159.138.45.45:81/clesws
version: 3.2.0.8
---

# Smart Lighting Control Platform (CLES) — Tài liệu Hệ thống

Tài liệu này được tổng hợp trực tiếp từ quá trình kiểm thử, tương tác và phân tích gói tin (REST API, WebSocket, DOM/Vuex) trên hệ thống **Smart Lighting Control Platform** (`http://159.138.45.45:81/`, phiên bản frontend `3.2.0.8`, Project khảo sát: **Demo H**).

## 🗺️ Bản đồ Tài liệu (MOC)

1. [[01 - Sơ đồ Chức năng (Functional Map)]] — Phân rã toàn bộ 10 phân hệ chính (40+ màn hình, 403 routes nội bộ) và sơ đồ mindmap/flowchart.
2. [[02 - Kiến trúc Hệ thống (System Design)]] — Sơ đồ kiến trúc tổng thể (Frontend Vue 2 + Element UI, Backend API `:18080`, WebSocket `/clesws`, PHP Media Gateway, tích hợp Bản đồ & Third-party IoT).
3. [[03 - Danh mục REST API]] — Tổng hợp các nhóm API thu thập được, chuẩn Authentication Header (JWT + Context Headers), Request/Response schema mẫu và kết quả test CRUD.
4. [[04 - Giao thức & WebSocket Protocol]] — Đặc tả WebSocket thời gian thực (`ws://.../clesws`), cấu trúc bản tin Telemetry/Status/Alarm, và các giao thức phần cứng IoT (`RF/F2`, `LoRaWAN Actility`, `Lierda NS`, `SPON`, `ISC`).

## 🧪 Tóm tắt Kết quả Kiểm thử Thực tế

| Hạng mục | Trạng thái | Ghi chú |
| :--- | :---: | :--- |
| Duyệt 10 phân hệ & 39 màn hình chính | ✅ Thành công | Đã quét toàn bộ menu, tab, action buttons và API đi kèm |
| Test CRUD `Task Template` (`POST /task/save` → `POST /task/delete`) | ✅ Thành công | Tạo mới `AGY_TEST_TEMP_TASK` (Dim 55%, 12:00) → xác nhận lưu DB → xóa sạch dữ liệu test |
| WebSocket Real-time Telemetry | ✅ Hoạt động | Nhận liên tục bản tin `lampControl`, `pole`, `rtu`, `push/alarm` |
| Endpoint `abnormalRecord/queryAbnormalRecordPage` | ⚠️ Lỗi `500` | Trả về `Internal Server Error` trên trang **Alarms → Event Management** |

> [!tip] Ghi chú nhanh
> Tất cả dữ liệu tạo thử nghiệm (`AGY_TEST_TEMP_TASK`) đã được xóa sạch sau khi kiểm thử. Trình duyệt đã được đưa về trang mặc định `GIS → Street Lighting`.
