---
tags:
  - smart-lighting
  - api
  - rest
created: 2026-11-19
---

# 03 - Danh mục REST API

Quay lại: [[00 - Smart Lighting Control Platform (MOC)]]

- **Base URL**: `http://159.138.45.45:18080`
- **Query Param mặc định**: `?lang=en-US`
- **Response Wrapper chuẩn**:
  ```json
  {
    "type": true,
    "code": 200,
    "message": "Operation succeeded.",
    "data": { ... }
  }
  ```

## 1. Headers Bắt buộc cho mọi Request

| Header | Ví dụ / Giá trị | Ý nghĩa |
| :--- | :--- | :--- |
| `authorization` | `<JWT HS256 token>` | Token xác thực người dùng (không có tiền tố `Bearer `) |
| `projectid` | `9a59bd490ce14e139948fbda5addb2df` | ID của Project đang chọn (`Demo H`) |
| `useraccount` | `Nha` | Tên tài khoản đăng nhập |
| `clienttype` | `app` | Định danh client |
| `timezone` | `UTC+7:00` | Múi giờ của trình duyệt |
| `offset` | `0` | Độ lệch múi giờ bổ sung |
| `summertimestartlong` / `summertimeendlong` | Epoch ms | Khung giờ mùa hè (DST) |

---

## 2. Danh mục API theo Phân hệ (Thu thập thực tế)

### A. GIS & Thống kê Thiết bị Tổng quan
| Method | Endpoint                                                                | Chức năng                                          |
| :----- | :---------------------------------------------------------------------- | :------------------------------------------------- |
| `POST` | `/api/v1.0/device/getLampModelByLatLng_v1`                              | Lấy danh sách cột đèn/LCU theo tọa độ khung bản đồ |
| `GET`  | `/api/v1.0/lcuActor/statisticsOfLcuByProjectId/{projectId}`             | Thống kê LCU (Total/Enable/Online/Offline)         |
| `GET`  | `/api/v1.0/lcuActor/statisticsOfLcuIntervalTimeByProjectId/{projectId}` | Thống kê hỏng hóc/thay thế LCU theo tuần/tháng/năm |
| `GET`  | `/api/v1.0/lcuActor/statisticsOfNonDirectLcuByProjectId/{projectId}`    | Thống kê LCU không kết nối trực tiếp               |
| `GET`  | `/api/v1.0/rtuActor/statisticsOfRtuByProjectId/{projectId}`             | Thống kê Concentrator (RTU)                        |
| `GET`  | `/api/v1.0/luxActor/statisticsOfLuxByProjectId/{projectId}`             | Thống kê cảm biến ánh sáng (Luxmeter)              |
| `POST` | `/api/v1.0/luxGroupActor/page`                                          | Danh sách nhóm cảm biến ánh sáng                   |
| `GET`  | `/api/v1.0/cameraActor/statisticsOfCameraByProjectId/{projectId}`       | Thống kê Camera                                    |
| `GET`  | `/api/v1.0/smartBoxActor/statisticsOfSmartBoxByProjectId/{projectId}`   | Thống kê Smart Box                                 |
| `GET`  | `/api/v1.0/solarActor/statisticsOfSolarByProjectId/{projectId}`         | Thống kê đèn năng lượng mặt trời                   |
| `GET`  | `/api/v1.0/solarLcuActor/statisticsOfSolarLcuByProjectId/{projectId}`   | Thống kê Solar LCU                                 |
| `GET`  | `/api/v1.0/dtuActor/statisticsOfDtuByProjectId/{projectId}`             | Thống kê DTU / Gateway                             |
| `GET`  | `/api/v1.0/wcuActor/statisticsOfWcuByProjectId/{projectId}`             | Thống kê WCU                                       |
| `POST` | `/api/v1.0/aibox/getAIboxList`                                          | Danh sách thiết bị AIBOX (Security Monitoring)     |
| `POST` | `/api/v1.0/aibox/getAIboxEventList`                                     | Danh sách sự kiện AIBOX                            |

### B. Quản lý Thiết bị & Cấu hình (Devices & Commissioning)
| Method | Endpoint                                                                           | Chức năng                                            |
| :----- | :--------------------------------------------------------------------------------- | :--------------------------------------------------- |
| `POST` | `/api/v1.0/device/queryDevicePage`                                                 | Danh sách thiết bị phân trang (LCU, RTU, Gateway...) |
| `POST` | `/api/v1.0/device/queryDeviceOverviewPage`                                         | Danh sách thiết bị ở màn hình Commissioning          |
| `POST` | `/api/v1.0/device/countDeviceTotal`                                                | Đếm tổng số thiết bị theo loại                       |
| `POST` | `/api/v1.0/deviceTypeController/queryAllDeviceType`                                | Tất cả loại thiết bị hỗ trợ                          |
| `POST` | `/api/v1.0/deviceTypeController/queryDeviceTypesByProjectId`                       | Các loại thiết bị có trong Project                   |
| `GET`  | `/api/v1.0/deviceTypeController/queryDeviceTypesWithUidOfProject/{projectId}`      | Loại thiết bị có UID trong Project                   |
| `POST` | `/api/v1.0/deviceTypeController/getOverViewDeviceTypes`                            | Danh sách loại thiết bị cho Overview                 |
| `POST` | `/api/v1.0/deviceModel/getDeviceModelByDeviceTypeId`                               | Lấy danh sách model theo loại thiết bị               |
| `POST` | `/api/v1.0/deviceModel/queryDeviceModelByDeviceTypeAndProject`                     | Model thiết bị theo loại & Project                   |
| `GET`  | `/api/v1.0/ProjectStationActor/queryStationOfRootDirectoryByProjectId/{projectId}` | Cây topo trạm/tủ điện                                |
| `POST` | `/api/v1.0/rtuActor/pageList`                                                      | Danh sách RTU / Concentrator                         |
| `GET`  | `/api/v1.0/deviceImportOrExport/getImportStatus`                                   | Trạng thái import thiết bị từ Excel                  |

### C. Lịch trình & Phân phối Task (Policy & Tasks)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/v1.0/task/page` | Danh sách Task Template |
| `POST` | `/api/v1.0/task/save` | **Tạo mới Task Template** *(Đã test thành công)* |
| `POST` | `/api/v1.0/task/delete` | **Xóa Task Template** *(Đã test thành công)* |
| `POST` | `/api/v1.0/task/queryTaskGroupList` | Danh sách Strategy Group |
| `POST` | `/api/v1.0/task/queryTaskByTaskGroupId` | Danh sách Task trong Strategy Group |
| `POST` | `/api/v1.0/task/getTaskByGroup` | Danh sách Task gán cho Device Group |
| `POST` | `/api/v1.0/deviceGroup/deviceGroupPage` | Phân trang nhóm thiết bị (`TestGroupH`, `NhomB`) |
| `POST` | `/api/v1.0/deviceGroup/queryDeviceGroupList` | Danh sách nhóm thiết bị |
| `POST` | `/api/v1.0/deviceGroup/queryDeviceTaskPage` | Danh sách trạng thái phân phối Task từng thiết bị |
| `POST` | `/api/v1.0/deviceGroup/queryStationLamp` | Danh sách đèn trong một Device Group |
| `GET` | `/api/v1.0/sunriseAndSunset/querySunriseSunsetOffsetTime/{projectId}` | Lấy thông số giờ mọc/lặn mặt trời |
| `GET` | `/api/v1.0/progress/queryList/{projectId}` | Theo dõi tiến độ gửi lệnh bất đồng bộ |
| `GET` | `/api/v1.0/lcuTaskImport/getImportStatus` | Trạng thái import LCU self-running task |

### D. Cảnh báo & Phiếu công việc (Alarms & Work Orders)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/v1.0/config/getAlarmPage` | Danh sách cảnh báo Real-Time |
| `POST` | `/api/v1.0/config/getAlarmHisPage` | Danh sách cảnh báo Lịch sử |
| `POST` | `/api/v1.0/alarmType/queryAlarmTypesOfDevice` | Danh mục mã lỗi/cảnh báo theo loại thiết bị |
| `POST` | `/api/v1.0/abnormalRecord/queryAbnormalRecordPage` | Danh sách sự kiện bất thường *(⚠️ Đang trả về `500`)* |
| `POST` | `/api/v1.0/abnormalWorkOrderOverview/tmOverview` | Tổng quan Work Order |
| `POST` | `/api/v1.0/abnormalWorkOrderOverview/circulation` | Luồng luân chuyển Work Order |
| `POST` | `/api/v1.0/abnormalWorkOrder/querySpainPage` | Danh sách phiếu công việc |
| `POST` | `/api/v1.0/delayOrder/queryPage` | Danh sách yêu cầu gia hạn Work Order |

### E. Báo cáo & Phân tích (Reports & Energy)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/v1.0/energy/getOverview` | Tổng quan điện năng tiêu thụ & Carbon |
| `POST` | `/api/v1.0/electricityBill/getOverview` | Tổng quan hóa đơn điện |
| `POST` | `/api/v1.0/meterActor/getConfigMeterList` | Danh sách công tơ điện cấu hình |
| `POST` | `/api/v1.0/alarmStatistics/alarmStatistics` | Thống kê số lượng cảnh báo |
| `POST` | `/api/v1.0/alarmStatistics/alarmTypeStatistics` | Thống kê phân bổ theo loại cảnh báo |
| `POST` | `/api/v1.0/reportManage/queryReportsPage` | Danh sách báo cáo đã sinh |
| `POST` | `/api/v1.0/passengerFlowGroup/queryPassengerFlowGroupListPage` | Thống kê lưu lượng người qua lại |
| `POST` | `/api/v1.0/cableInspectionDataHisActor/pageCableInspection` | Lịch sử kiểm tra cáp điện |
| `POST` | `/api/v1.0/lcuLight/queryLcuDataReportRateDetailsPage` | Phân tích tỷ lệ báo cáo dữ liệu LCU |
| `POST` | `/api/v1.0/workOrderStatistics/getStatisticsMap` | Thống kê Work Order (cùng `getWorkOrderSourceMap`, `getWorkOrderStateMap`, `getTodayWorkOrderData`, `getYesterdayMonthYearOrders`) |

### F. Bảo trì, Kho vật tư & Tài sản (Maintenance & Assets)
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/v1.0/assetLedger/queryLedgerDevicePage` | Sổ cái tài sản thiết bị |
| `POST` | `/api/v1.0/MaterialInventory/queryMaterialInventoryPage` | Danh sách tồn kho vật tư |
| `GET` | `/api/v1.0/MaterialCategoryName/queryMaterialCategoryList` | Danh mục vật tư (cùng `MaterialName`, `MaterialModel`, `MaterialWarehouse`) |
| `POST` | `/api/v1.0/inspectionPlan/queryPage` | Kế hoạch tuần tra (Patrol Plan) |
| `POST` | `/api/v1.0/curyCompany/queryCuryCompanyPage` | Danh sách công ty bảo trì |
| `POST` | `/api/v1.0/equipment/queryEquipmentPage` | Kế hoạch cơ sở vật chất (Facility Plan) |
| `POST` | `/api/v1.0/devOps/getDevOpsList` | Nhật ký bảo trì (`devOpsBasicData/getDevOpsBasicDataList`) |
| `POST` | `/api/v1.0/overseas/getStreetLightOnRate` | Đánh giá tỷ lệ sáng đèn & `getStreetWoOverhaulRate` |

### G. Media, Hệ thống & Nền tảng Thứ 3
| Method | Endpoint | Chức năng |
| :--- | :--- | :--- |
| `POST` | `http://159.138.45.45:81/php/getsetzonedata.php` | Lấy vùng phát thanh SPON (PHP) |
| `POST` | `http://159.138.45.45:81/php/getmediadata.php` | Lấy danh sách media SPON (PHP) |
| `POST` | `/api/v1.0/sysFile/queryFileById` | Danh sách tệp Music/Video |
| `POST` | `/api/v1.0/informatrion/queryInformationMap` | Kho nội dung văn bản (Text Library) |
| `POST` | `/api/graphicRules/getPage` | Quy tắc hiển thị đồ họa / Photo Entry |
| `POST` | `/api/v1.0/area/queryAreaPage` | Quản lý phân vùng hành chính (`country`, `province`, `city`, `area`) |
| `POST` | `/api/v1.0/syslog/queryPage` | Nhật ký lịch sử hệ thống |
| `POST` | `/api/v1.0/lierdaProjectActor/getNsProjectList` | Cấu hình Lierda NS |
| `POST` | `/api/v1.0/actilityProjectActor/getActilityProject` | Cấu hình Actility LoRaWAN & `getGatewayList` |
| `GET` | `/api/v1.0/dictionary/queryDictionaryByKey/{key}` | Từ điển hệ thống (keys: `5, 6, 10, 11, 26, 34, 43, 44, 45, 46, 70, 111, 113, 135, 148, 149`) |
| `GET` | `/api/getSinglePageMenu/{menuId}/1` | Tải quyền nút bấm & menu con theo từng màn hình |

---

## 3. Mẫu Payload CRUD Thực tế (Đã kiểm thử)

### Tạo Task Template (`POST /api/v1.0/task/save`)
```json
{
  "projectId": "9a59bd490ce14e139948fbda5addb2df",
  "taskType": 2,
  "taskName": "AGY_TEST_TEMP_TASK",
  "executeModel": 1,
  "executeType": 1,
  "operation": 5,
  "dimValue": 55,
  "executeHour": 12,
  "executeMinute": 0,
  "loopType": 1,
  "loopTime": "127",
  "lux": 1,
  "sunExecuteWay": 0,
  "sunExecuteOffset": 0,
  "sunDimValue": 0
}
```
> **Response**: `{"type":true,"code":200,"message":"Operation succeeded.","data":"7b215dbff4a744178ce75820348e1939"}`
> *(Giải mã bitmask `loopTime: "127"` = `1+2+4+8+16+32+64` tương ứng lặp lại cả 7 ngày trong tuần; `taskType: 2` = LCU Self-Running Task; `operation: 5` = Dimming)*.

### Xóa Task Template (`POST /api/v1.0/task/delete`)
```json
{
  "projectId": "9a59bd490ce14e139948fbda5addb2df",
  "taskId": "7b215dbff4a744178ce75820348e1939",
  "taskType": 2
}
```
> **Response**: `{"type":true,"code":200,"message":"Operation succeeded.","data":null}`
