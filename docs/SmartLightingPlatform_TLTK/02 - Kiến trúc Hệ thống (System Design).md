---
tags:
  - smart-lighting
  - system-design
  - architecture
  - mermaid
created: 2026-11-19
---

# 02 - Kiến trúc Hệ thống (System Design)

Quay lại: [[00 - Smart Lighting Control Platform (MOC)]]

## 1. Sơ đồ Kiến trúc Tổng thể (High-Level Architecture)

```mermaid
flowchart TB
    subgraph Client["Client Layer (Browser SPA - Port 81)"]
        SPA["Vue 2 + Element UI + Vuex<br/>(CLES Frontend v3.2.0.8)"]
        Maps["GIS Engine<br/>Google Maps / Baidu Maps (Online & Offline)"]
        MediaUI["H5Player + Luckysheet + jsWebControl"]
        SPA --- Maps
        SPA --- MediaUI
    end

    subgraph Edge["Web & Proxy Layer (159.138.45.45:81)"]
        Nginx["Static Web Server & Reverse Proxy (:81)"]
        PHP["PHP Media/SPON Adapter<br/>(/php/getsetzonedata.php, getmediadata.php)"]
        WSGate["WebSocket Endpoint<br/>(ws://159.138.45.45:81/clesws)"]
    end

    subgraph Core["Backend Application Layer (159.138.45.45:18080)"]
        APIGW["Spring Boot REST API (:18080/api/v1.0)<br/>Auth: JWT (HS256) + Shiro/Session"]
        subgraph Services["Domain Controllers / Actors"]
            S_Dev["Device & Topology Service<br/>(device, lcuActor, rtuActor, dtuActor, wcuActor)"]
            S_Task["Policy & Task Engine<br/>(task, deviceGroup, sunriseAndSunset)"]
            S_Alarm["Alarm & WorkOrder Service<br/>(config/alarm, abnormalWorkOrder, delayOrder)"]
            S_Energy["Energy & Billing Service<br/>(energy, electricityBill, meterActor)"]
            S_Asset["Asset & O&M Service<br/>(assetLedger, Material*, inspectionPlan, devOps)"]
            S_3rd["Third-Party Adapters<br/>(actilityProjectActor, lierdaProjectActor, aibox)"]
        end
        APIGW --> Services
    end

    subgraph External["Third-Party Platforms & IoT Field Layer"]
        Actility["Actility ThingPark (LoRaWAN NS)"]
        Lierda["Lierda NS Service"]
        SPON["SPON IP Audio Broadcasting"]
        ISC["Hikvision ISC / AIBOX Video"]
        GW["Gateway / Concentrator (RTU)"]
        LCU["Smart Street Lamp Controller (LCU - RF/F2)"]
    end

    SPA -- "HTTP Static Assets" --> Nginx
    SPA -- "REST JSON + JWT" --> APIGW
    SPA -- "Full-duplex Telemetry & Alarms" <--> WSGate
    SPA -- "Legacy PHP POST" --> PHP

    WSGate <--> Services
    PHP <--> SPON
    S_3rd <--> Actility
    S_3rd <--> Lierda
    S_3rd <--> ISC
    S_Dev <--> GW
    S_Task --> GW
    Actility <--> GW
    Lierda <--> GW
    GW <-- "RF/F2 / LoRa / PLC" --> LCU
```

## 2. Phân tích Thành phần Kỹ thuật (Tech Stack)

### A. Frontend Architecture (`http://159.138.45.45:81/`)
- **Framework**: Vue 2 SPA (Hash Router `#/...`), giao diện **Element UI**, quản lý trạng thái tập trung bằng **Vuex** với 14 modules:
  `alarm`, `app`, `device`, `energy`, `errorLog`, `map`, `media`, `permission`, `router`, `settings`, `statusBar`, `tagsView`, `user`, `websocket`.
- **Phân quyền động (Dynamic RBAC)**:
  - Menu và quyền nút bấm từng trang được tải động qua `GET /api/getSinglePageMenu/{menuId}/1`.
  - Hỗ trợ `tagsView` (mở nhiều tab nội bộ song song trong SPA).
- **GIS & Visualization**:
  - Hỗ trợ đa nền tảng bản đồ (**Google Maps API v3** và **Baidu Maps v3.0 + Heatmap + MarkerClusterer + Offline BMap**).
  - Tích hợp **Luckysheet** (xem/sửa bảng tính báo cáo trực tiếp trên web), **h5player.min.js** & **jsWebControl** (phát luồng camera an ninh ISC/Hikvision), **JSEncrypt** (mã hóa RSA phía client khi đăng nhập).
- **Lưu trữ phía Client**:
  - `sessionStorage`: Lưu `token` (JWT), `language`, `logoData`, `mapModel`.
  - `localStorage`: Lưu cấu hình cột hiển thị của bảng theo từng user + project + phiên bản (`{userId}-{projectId}-{module}-{version}`), trạng thái bản đồ (`lat`, `lng`, `mapMode`), cache danh sách `projectTree` / `projectInfos`.

### B. Backend Architecture (`http://159.138.45.45:18080/`)
- **Nền tảng**: Java Spring Boot (nhận diện qua cấu trúc lỗi chuẩn Spring Boot `{"timestamp", "status", "error", "path"}` và cookie `JSESSIONID` + `rememberMe=deleteMe` đặc trưng của **Apache Shiro** kết hợp **JWT HS256**).
- **Kiến trúc Actor/Controller theo loại thiết bị**:
  - Mỗi loại thiết bị IoT có một Actor/Controller riêng biệt: `lcuActor`, `rtuActor`, `luxActor`, `cameraActor`, `smartBoxActor`, `solarActor`, `solarLcuActor`, `dtuActor`, `wcuActor`, `meterActor`.
- **Dịch vụ phụ trợ (Legacy PHP)**:
  - Các tính năng âm thanh công cộng SPON gọi trực tiếp qua proxy PHP trên cổng `81` (`/php/getsetzonedata.php`, `/php/getmediadata.php`).

### C. Bảo mật & Ngữ cảnh Request (Security & Multi-Tenancy)
Mỗi request API đều mang theo đầy đủ ngữ cảnh **Multi-Project / Multi-Timezone**:
- **JWT Payload (HS256)** giải mã được:
  ```json
  {
    "exp": 1795056767,
    "clientType": "web",
    "currentTimeMillis": "1795053167231",
    "jwt_claim_agencyId": "0a9ea73e0ac54958933efca54425862d",
    "userGroup": "3",
    "account": "Nha"
  }
  ```
- **Context Headers bắt buộc**: `authorization`, `projectid`, `useraccount`, `clienttype`, `timezone` (`UTC+7:00`), `offset`, `summertimestartlong`, `summertimeendlong`.
- **CORS**: Cho phép `http://159.138.45.45:81` gọi sang `:18080` với các method `GET, POST, OPTIONS, PUT, DELETE`.

## 3. Điểm cần lưu ý về Vận hành & Bảo mật
1. **Truyền tải HTTP/WS chưa mã hóa TLS**: Cả cổng `81` (Web + WebSocket) và `18080` (API mang JWT) đang chạy trên `http://` và `ws://` thuần.
2. **Lỗi 500 trên phân hệ Event Management**: Endpoint `POST /api/v1.0/abnormalRecord/queryAbnormalRecordPage` hiện đang trả về `500 Internal Server Error` cần kiểm tra log phía server Spring Boot.
3. **Bản tin WebSocket Broadcast rộng**: WebSocket `/clesws` đẩy về trình duyệt bản tin telemetry của **nhiều `projectId` khác nhau** (không chỉ project đang chọn `Demo H`), cần lưu ý lọc dữ liệu ở tầng server để tối ưu băng thông và bảo mật multi-tenant.
