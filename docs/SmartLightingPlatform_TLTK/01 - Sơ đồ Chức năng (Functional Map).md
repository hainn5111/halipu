---
tags:
  - smart-lighting
  - functional-map
  - mermaid
created: 2026-11-19
---

# 01 - Sơ đồ Chức năng (Functional Map)

Quay lại: [[00 - Smart Lighting Control Platform (MOC)]]

Hệ thống **Smart Lighting Control Platform** gồm **10 phân hệ chính** trên thanh điều hướng (tổng cộng 403 route cấu hình trong Vue Router phân quyền động qua `store.state.permission.routes`).

## 1. Sơ đồ Phân rã Chức năng (Functional Architecture)

```mermaid
flowchart LR
    ROOT["Smart Lighting Control Platform<br/>(CLES v3.2.0.8)"]

    ROOT --> M1["1. GIS"]
    ROOT --> M2["2. Devices"]
    ROOT --> M3["3. Alarms"]
    ROOT --> M4["4. Tasks"]
    ROOT --> M5["5. Reports"]
    ROOT --> M6["6. Maintenance"]
    ROOT --> M7["7. Workorder System"]
    ROOT --> M8["8. Media Center"]
    ROOT --> M9["9. System"]
    ROOT --> M10["10. Third-Party Platform"]

    M1 --> M1_1["Street Lighting (Bản đồ GIS)"]
    M1 --> M1_2["Device Overview (Tổng quan Online/Offline)"]
    M1 --> M1_3["Security Monitoring (AIBOX / Camera)"]

    M2 --> M2_1["Devices (IOT / Non-IOT CRUD, Register)"]
    M2 --> M2_2["Device Topology (Comm / Power / Linkage)"]
    M2 --> M2_3["Configuration (Commissioning, OTA Upgrade)"]

    M3 --> M3_1["Real-Time Alarm (Xử lý & Tạo Work Order)"]
    M3 --> M3_2["Historical Alarm"]
    M3 --> M3_3["Event Management (Abnormal Records)"]

    M4 --> M4_1["Task Template (LCU / Terminal Tasks)"]
    M4 --> M4_2["Strategy Grouping"]
    M4 --> M4_3["Task Configuration (Group & Scene)"]
    M4 --> M4_4["Task Distribution (Gửi lệnh & Đồng bộ)"]

    M5 --> M5_1["Energy & Carbon Emission"]
    M5 --> M5_2["Energy Bills & Meter Reading"]
    M5 --> M5_3["Alarms & Work Order Statistics"]
    M5 --> M5_4["LCU Running Analysis & Cable Inspections"]
    M5 --> M5_5["Passenger Flow & Report Record"]

    M6 --> M6_1["Asset Map & Asset List"]
    M6 --> M6_2["Material Inventory (Kho vật tư)"]
    M6 --> M6_3["Patrol Plan & Maintenance Logs"]
    M6 --> M6_4["Maintenance Company & Evaluation"]

    M7 --> M7_1["Overview of Work Orders"]
    M7 --> M7_2["Work Order Management"]
    M7 --> M7_3["Extension Application (Delay)"]

    M8 --> M8_1["Broadcasting (SPON Speaker)"]
    M8 --> M8_2["Music / Video / Text Library"]

    M9 --> M9_1["Photo Entry & Regions"]
    M9 --> M9_2["History Log (Project / Alarm / Energy / Login)"]

    M10 --> M10_1["NS Service Configuration (Lierda)"]
    M10 --> M10_2["Actility Config (LoRaWAN)"]
    M10 --> M10_3["SPON & ISC Platform Monitoring"]
```

## 2. Chi tiết Chức năng từng Phân hệ (Qua kiểm thử thực tế)

| Phân hệ | Màn hình (Route) | Tính năng & Hành động chính (Buttons / Tabs) |
| :--- | :--- | :--- |
| **1. GIS** | `Street Lighting` (`#/gis/index`) | Bản đồ Google/Baidu Maps, điều khiển theo Project/Group/Frame Selection/Scenes, lọc thiết bị (Concentrator, LCU, Gateway, CABLE), xem tủ điện (View Cabinet), thống kê cảnh báo realtime |
| | `Device Overview` (`#/commissioning/index`) | Dashboard tổng quan số lượng Enable/Online/Offline theo Concentrator, LCU, Gateway, Pole; thống kê thay thế & hỏng đèn/driver theo Tuần/Tháng/Năm |
| | `Security Monitoring` (`#/gis/securityMonitoring`) | Giám sát thiết bị AIBOX & danh sách sự kiện an ninh |
| **2. Devices** | `Devices` (`#/equipment/terminal`) | Quản lý thiết bị IOT & Non-IOT: Add, Delete, Register, Unregister, Initial Deployment, Import/Export Excel, UID Change Records, Device Model |
| | `Device Topology` (`#/equipmentCorrelation`) | 5 góc nhìn topo: Communication Topology, Power Supply Topology, Assembly Association, Device Linkage, Quick Binding |
| | `Configuration` (`#/commissioning/rtu`) | Cấu hình tham số (Edit Parameter), OTA Upgrade, LCU Upgrade Query, Routing Configuration, Active collection settings, Issue lệnh |
| **3. Alarms** | `Real-Time Alarm` (`#/alarmRealTime`) | Theo dõi cảnh báo chưa xử lý, Alarm Handling, Dispatch Work Order (tạo phiếu sửa chữa từ cảnh báo), Export |
| | `Historical Alarm` (`#/alarmHistorys`) | Tra cứu lịch sử cảnh báo, Clear Alarm Record, Export |
| | `Event Management` (`#/abnormalManagement`) | Quản lý sự kiện bất thường *(Lưu ý: API `queryAbnormalRecordPage` đang báo lỗi `500`)* |
| **4. Tasks** | `Task Template` (`#/policyManage/taskManage`) | Tạo/Sửa/Xóa mẫu lịch trình (`LCU Self-Running Task`, `Terminal Tasks`), hỗ trợ Execute by Time / Sunrise-Sunset, Dimming, Turn On/Off, Import/Export |
| | `Strategy Grouping` (`#/strategicGrouping`) | Gom nhiều Task Template thành nhóm chiến lược |
| | `Task Configuration` (`#/policyManage/index`) | Gán Thiết bị (Device List) + Nhiệm vụ (Task List) vào Group, cấu hình Road/Facade Scene, Distribute Task |
| | `Task Distribution` (`#/policyManage/taskIssue`) | Theo dõi trạng thái gửi lệnh (To Be Distributed, Task Result, Fail count), gửi tham số ánh sáng, kinh/vĩ độ, Group Number, Clear Self-Running Task |
| **5. Reports** | `Energy` (`#/statisticAnalysis/index`) | Thống kê điện năng tiêu thụ & lượng phát thải Carbon (Carbon Emission), cấu hình điện năng cơ bản |
| | `Energy Bills` (`#/billStatistics/index`) | Thống kê hóa đơn tiền điện & lịch sử đọc công tơ (Meter Records) |
| | `Alarms`, `Work Orders`, `LCU Analysis`, `Cable`, `Passenger Flow`, `Report Record` | Hệ thống báo cáo đa chiều & tự động sinh báo cáo định kỳ (Auto Settings, Generate Report) |
| **6. Maintenance** | `Asset Map` & `Asset List` | Bản đồ tài sản & Sổ cái tài sản (Asset Ledger), Import/Export |
| | `Material` (`#/productionCenter/materialManagement`) | Quản lý kho vật tư: Nhập kho (Stock-In), Xuất kho (Picking), Mua sắm (Purchase), Danh mục |
| | `Patrol Plan`, `Facility Planning`, `Maintenance Company`, `Logs`, `Evaluation` | Kế hoạch tuần tra, nhà thầu bảo trì, nhật ký và đánh giá KPI (tỷ lệ đèn sáng, tỷ lệ sửa chữa) |
| **7. Workorder** | `Overview`, `Work Order`, `Extension Application` | Tổng quan vòng đời phiếu công việc, quản lý phiếu bảo trì, duyệt gia hạn (Delay) |
| **8. Media Center** | `Broadcasting`, `Music`, `Video`, `Text Library` | Phát thanh công cộng qua loa SPON, quản lý kho tệp âm thanh/video/văn bản (đẩy lên màn hình LED/loa) |
| **9. System** | `Photo Entry`, `Regions`, `History Log` | Quản lý ảnh/quy tắc hiển thị đồ họa, phân vùng hành chính (Country/Province/City/Area), nhật ký hệ thống (Project Log, Login Log, AIBOX Log) |
| **10. Third-Party** | `NS Service`, `Actility`, `SPON`, `ISC` | Cấu hình tích hợp Lierda Network Server, Actility LoRaWAN (Domain, Group Number, Freq, FW Query), SPON PA & Hikvision ISC |

## 3. Luồng Nghiệp vụ Cốt lõi: Giao Task xuống Đèn (Task Lifecycle)

```mermaid
sequenceDiagram
    actor Admin as Người vận hành
    participant UI as Frontend (Vue SPA)
    participant API as Backend API (:18080)
    participant IoT as IoT Broker / Gateway
    participant LCU as Đèn đường (LCU)
    participant WS as WebSocket (/clesws)

    Admin->>UI: 1. Tạo Task Template (Dimming / On / Off)
    UI->>API: POST /api/v1.0/task/save
    API-->>UI: 200 OK (taskId)

    Admin->>UI: 2. Gán Task & Đèn (LCU) vào Device Group
    UI->>API: POST /api/v1.0/deviceGroup/...

    Admin->>UI: 3. Bấm "Distribute Task"
    UI->>API: Gửi lệnh phân phối xuống thiết bị
    API->>IoT: Đóng gói bản tin giao thức (RF/F2, LoRaWAN...)
    IoT->>LCU: Truyền xuống LCU (tự chạy theo lịch)
    LCU-->>IoT: Xác nhận ACK / Báo cáo trạng thái
    IoT-->>API: Cập nhật trạng thái Task Result
    API-->>WS: Push sự kiện realtime
    WS-->>UI: Cập nhật tiến độ & trạng thái đèn (cmd: lampControl)
```
