# SLCP — API Endpoint Catalog

Bề mặt API đầy đủ, trích từ **webpack module** của frontend (không chỉ chuỗi text như lần đầu, nên đủ cả method HTTP và tham số). Tổng **2320 endpoint / 267 controller**: POST 1880, GET 401, DELETE 23, PUT 16.
Base: `http://159.138.45.45:18080/api/` + path. Xem thêm `02-architecture.md`, `11-api-probe-and-security.md`.

**Cột Lớp** (suy từ tên controller/method): **R** đọc DB · **W** ghi DB (save/update/delete/import…) · **RW** cả hai · **C** = `*Ctrl`/`*Control`: **gửi gói tin xuống thiết bị** (cấu hình, hỏi trạng thái, hoặc điều khiển). Lớp C và các method ghi là thao tác có tác dụng phụ — xem quy tắc R0–W2 ở `claude/10`.

> Có endpoint trong code chưa chắc còn sống; server có thể có endpoint frontend không gọi.


## Lõi: dự án, địa lý, hệ thống

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `area` | RW | Khu vực (Region) trong dự án; sao chép khu vực hệ thống vào dự án | 8 |
| `areaRoad` | RW | Tuyến đường thuộc khu vực; CRUD, sao chép, xuất danh sách | 12 |
| `city` | RW | Danh mục thành phố | 8 |
| `country` | RW | Danh mục quốc gia | 6 |
| `dictionary` | RW | Bảng tra cứu enum dùng chung (queryDictionaryByKey/{key}). Xem 05-dictionaries.md | 23 |
| `historyQuery` | W | Xoá lịch sử tìm kiếm | 1 |
| `illegalDeviceLoginRecord` | RW | Bản ghi thiết bị lạ cố đăng nhập/kết nối vào server | 2 |
| `illegalDeviceLoginRecordExport` | R | Xuất bản ghi thiết bị lạ | 1 |
| `overseas` | RW | Tính năng bản quốc tế: cấp đường (road level) gán cho LCU, tỉ lệ sáng & tỉ lệ sửa chữa theo tuyến, làm mới cache | 8 |
| `progress` | R | Tiến độ tác vụ chạy nền (import, hạ task…) | 1 |
| `project` | RW | Dự án: CRUD, cây dự án cha/con, gán user & loại thiết bị, các nhóm cấu hình (control set, lighting rate, nguồn giờ mặt trời, lưu trữ log, chu kỳ báo cáo, LCU tự điều khiển). Xem 07-project-config.md | 33 |
| `projectImportExport` | RW | Xuất/nhập toàn bộ dữ liệu một dự án (sao lưu/chuyển dự án) | 3 |
| `province` | RW | Danh mục tỉnh/bang | 7 |
| `syslog` | RW | Nhật ký thao tác hệ thống (History Log), lưu trữ theo tháng | 2 |
| `sysLogExport` | R | Xuất nhật ký thao tác | 1 |
| `userProject` | R | Danh sách dự án mà một user được gán | 1 |

## Tổ chức, người dùng, quyền

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `agency` | RW | Đại lý/tổ chức sở hữu tài khoản (cây agency); cấu hình tin nhắn theo agency; tài khoản bên thứ ba | 13 |
| `bigScreenUser` | R | Chuyển sang màn hình lớn (big screen dashboard) với phiên hiện tại | 1 |
| `langActor` | RW | Gói ngôn ngữ giao diện, gán ngôn ngữ cho agency | 5 |
| `massage` | RW | Cấu hình gửi tin (SMS/mail) theo dự án; tin hệ thống (tên gốc viết sai "massage") | 6 |
| `menu` | RW | Cây menu & quyền: menu theo user/role/agency, khởi tạo/reset menu | 16 |
| `menuExport` | R | Xuất cấu hình menu | 2 |
| `messageActor` | RW | Thông báo hệ thống gửi tới user: CRUD, duyệt, trạng thái đã đọc | 8 |
| `messageType` | RW | Loại thông báo | 6 |
| `role` | RW | Vai trò (RBAC): CRUD, gán quyền menu | 12 |
| `scanCode` | R | Quét mã QR khi lắp đặt: lấy danh sách khách hàng/dự án, đặt IP server sản xuất | 3 |
| `sysLogo` | W | Tải logo hệ thống | 1 |
| `systemInfo` | RW | Thông tin hệ thống (tên, logo, cấu hình hiển thị) theo user | 5 |
| `user` | RW | Người dùng: CRUD, danh sách user theo agency/nhóm, đếm super user | 20 |

## Mô hình & quản lý thiết bị

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `communicationTopology` | R | Topo truyền thông của thiết bị (đi qua gateway/concentrator nào) | 1 |
| `device` | RW | Thiết bị chung: danh sách/đếm/thống kê, overview, thiết bị trên bản đồ theo vùng toạ độ, đặt vị trí, đăng ký/huỷ đăng ký với nền tảng | 63 |
| `deviceActLog` | R | Nhật ký hoạt động của một thiết bị | 1 |
| `deviceExpor` | R | Xuất danh sách thiết bị theo từng loại màn hình | 5 |
| `deviceImportOrExport` | RW | Import thiết bị từ Excel (bất đồng bộ, getImportStatus), tải template, export danh sách | 7 |
| `deviceModel` | RW | Model thiết bị và deviceConfig theo loại (Device Model page) | 23 |
| `deviceOverview` | R | Tổng quan RTU/LCU/SmartBox (màn hình Device Overview) và export | 6 |
| `deviceSystemController` | RW | Hệ thống thiết bị (nhóm phân loại hệ thống) | 6 |
| `deviceTypeController` | RW | Loại thiết bị (LCU, Concentrator, Meter, Camera, Lux…) và loại bật theo dự án; giao thức theo loại | 24 |
| `factoryController` | RW | Nhà sản xuất thiết bị | 6 |
| `nonIotDevice` | RW | Thiết bị không IoT (đèn, contactor AC…) gắn vào AI/DI/công tơ/KM để giám sát gián tiếp | 22 |
| `poleType` | RW | Loại cột đèn | 7 |
| `protocolActor` | RW | Giao thức truyền thông (RF/F2, CAT1/F2, SDMP, Modbus…) và chức năng theo giao thức | 5 |
| `supplyElectricity` | R | Loại thiết bị con được phép theo loại thiết bị cha (cấp điện) | 1 |
| `supplyElectricityDevice` | RW | Topo cấp điện: thiết bị cha/con, KM ↔ pha công tơ, ràng buộc nhanh | 18 |
| `uidRecord` | W | Lịch sử thay UID thiết bị (khi thay phần cứng) | 1 |
| `uidRecordExport` | W | Xuất lịch sử thay UID | 1 |
| `upgradePoolLcuExport` | R | Xuất danh sách LCU trong hàng đợi nâng cấp firmware | 1 |
| `verifyRecord` | R | Bản ghi chờ duyệt (thay UID / import khi bật kiểm duyệt dự án) và thao tác duyệt | 3 |

## Đèn & LCU

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `boxSelExport` | R | Xuất LCU/RTU được chọn bằng khoanh vùng trên bản đồ | 2 |
| `busController` | RW | Bộ điều khiển bus đèn (panel đèn qua bus), nối SmartBox | 7 |
| `lampOnOffConfigActor` | RW | Cấu hình giờ bật/tắt đèn (danh sách thời điểm) | 3 |
| `lcuActor` | RW | LCU (bộ điều khiển đèn): danh sách/chi tiết, theo gateway/RTU/cột, liên kết/huỷ với RTU, lịch sử dữ liệu, giờ mặt trời, kiểm tra sun | 49 |
| `lcuAttributionActor` | R | LCU thuộc nhóm nào (hiện tại và lịch sử) | 2 |
| `lcuDataRecordsExport` | R | Xuất bản ghi dữ liệu LCU | 1 |
| `lcuExpor` | R | Xuất bản đồ LCU | 1 |
| `lcuGpsQueryConfig` | RW | Cấu hình chu kỳ hỏi GPS của LCU | 2 |
| `lcuLight` | RW | Đèn (kênh) trên LCU: dữ liệu theo LCU+num, tỉ lệ báo cáo dữ liệu, nhãn đèn | 5 |
| `lcuRoute` | RW | Định tuyến LCU qua RTU (mesh/relay) và topo định tuyến | 6 |
| `luxActor` | RW | Cảm biến ánh sáng (lux): danh sách, lịch sử, giá trị điều khiển, thống kê | 18 |
| `luxGroupActor` | RW | Nhóm điều khiển theo lux (lux → RTU/LCU) | 10 |
| `poleActor` | RW | Cột đèn: thiết bị gắn trên cột, cột theo toạ độ, liên kết cảm biến/fog pile | 17 |
| `projectLampActor` | RW | Đèn của dự án theo LCU/RTU/PowerBox/SolarLcu; đèn năng lượng mặt trời | 10 |
| `scenesLight` | RW | Chiếu sáng cảnh quan: kịch bản (scene) và show master | 10 |
| `scenesLightDevice` | RW | Thiết bị/KM trong scene | 6 |
| `scenesLightExport` | R | Xuất thiết bị theo nhóm scene | 1 |
| `scenesLightGroup` | RW | Nhóm cảnh quan và task theo nhóm | 10 |
| `scheduleJob` | W | Lưu cấu hình server tự điều khiển LCU theo lịch (LCU auto control) | 1 |
| `showingAct` | RW | Hiệu ứng (act) của show master | 3 |
| `showingMasterActor` | RW | Bộ điều khiển trình diễn ánh sáng (show master) | 6 |
| `solarActor` | RW | Bộ điều khiển đèn NLMT (solar controller): tham số, cấu hình LC/SR, thống kê | 22 |
| `solarLamp` | RW | Đèn năng lượng mặt trời: khởi tạo, cập nhật | 3 |
| `solarLcuActor` | RW | LCU năng lượng mặt trời: tham số điều khiển/mạng, chu kỳ báo cáo, thống kê | 18 |
| `solarLcuExport` | R | Xuất bản đồ Solar LCU | 1 |
| `solarLcuLight` | RW | Đèn trên Solar LCU | 2 |
| `sunriseAndSunset` | RW | Bảng giờ mặt trời mọc/lặn của dự án, độ lệch, nguồn bảng (tái tạo/đồng bộ) | 7 |
| `sunriseAndSunsetExport` | W | Xuất bảng giờ mặt trời gốc | 1 |

## Tủ, gateway, cảm biến tủ

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `aidi` | RW | Đầu vào AI/DI (analog/digital) của RTU và liên kết DI | 6 |
| `antiActor` | RW | Thiết bị chống trộm (anti-theft) gắn RTU, các kênh | 14 |
| `antiExtensionModule` | RW | Module mở rộng chống trộm | 4 |
| `cabinet` | RW | Tủ điện liên kết nền tảng ngoài (đồng bộ tủ từ platform) | 5 |
| `cableInspectionActor` | RW | Giám sát cáp (chống trộm cáp, mạch vòng): theo RTU, cảnh báo vòng | 14 |
| `cableInspectionDataHisActor` | R | Lịch sử dữ liệu giám sát cáp, xu hướng | 7 |
| `cableInspectionExpor` | R | Xuất bản đồ giám sát cáp | 1 |
| `dtuActor` | RW | DTU (RS485 ↔ 4G): thiết bị gắn theo cổng, cấu hình server, sinh công tơ người dùng | 26 |
| `electronicLockActor` | RW | Khoá điện tử tủ: danh sách, lịch sử mở | 7 |
| `gatewayActor` | RW | Gateway: danh sách, cấu hình, thiết bị gắn cổng, đồng bộ | 20 |
| `kmActor` | RW | KM = contactor/mạch đóng cắt trong tủ: danh sách theo RTU, lịch sử, hiển thị nguồn | 9 |
| `kmDetectActor` | RW | Bộ phát hiện trạng thái KM, gắn power box | 7 |
| `LightningProtectionActor` | RW | Thiết bị chống sét gắn RTU | 6 |
| `phaseAuto` | RW | Tiến trình tự động theo RTU (start/pause/continue/stop, xử lý tay) — có thể là tự nhận diện pha nguồn cho RTU; Suy luận | 11 |
| `powerBoxActor` | RW | Hộp điện (power box) có KM & công tơ trong: thiết bị gắn, LCU bên trong, chế độ mạng | 21 |
| `ProjectStationActor` | RW | Trạm/cây thư mục (station) gom thiết bị theo vị trí; trạng thái bình thường/cảnh báo; dữ liệu trên bản đồ | 17 |
| `rtuActor` | RW | RTU (tủ điều khiển/concentrator): danh sách, chi tiết, thiết bị bên trong, thiết bị gắn cổng, thống kê | 35 |
| `rtuExpor` | R | Xuất bản đồ RTU | 1 |
| `rtuServerInfo` | RW | Địa chỉ server mà RTU kết nối | 5 |
| `smartBoxActor` | RW | SmartBox (bộ tập trung RF trong tủ/hộp): thiết bị gắn, cấu hình server/cổng nối tiếp, thống kê | 19 |
| `smartBoxExport` | R | Xuất lịch sử trạng thái SmartBox | 1 |
| `thermometerActor` | RW | Cảm biến nhiệt trong tủ: lịch sử, xu hướng | 9 |
| `thermometerExpor` | R | Xuất xu hướng nhiệt | 1 |
| `tiltSensorActor` | RW | Cảm biến nghiêng (cột/tủ): lịch sử | 7 |
| `waterImmerDetectActor` | RW | Cảm biến ngập nước | 7 |
| `wcuActor` | RW | WCU (bộ điều khiển có thiết bị slave): tham số, chu kỳ báo cáo, thiết bị gắn, nối SmartBox | 15 |

## Năng lượng & công tơ

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `basicEnergyConsumption` | RW | Mức tiêu thụ cơ sở (để tính tiết kiệm) | 2 |
| `carbon` | RW | Giảm phát thải CO2 & hệ số quy đổi (transRate) | 8 |
| `carbonExport` | R | Xuất báo cáo carbon | 6 |
| `electricityBill` | R | Hoá đơn tiền điện theo LCU/công tơ, xu hướng | 6 |
| `energy` | RW | Năng lượng: tổng quan, dữ liệu LCU/công tơ/power box/gateway, xu hướng, tỉ lệ tiết kiệm, lưu trữ | 31 |
| `energyExport` | RW | Xuất báo cáo năng lượng (timeout = 0, chạy lâu) | 25 |
| `meterActor` | RW | Công tơ: tổng/người dùng, dữ liệu theo RTU/trạm, liên kết công tơ người dùng với RTU | 27 |
| `meterReading` | RW | Cấu hình đọc công tơ & tính hoá đơn điện | 5 |
| `projectEnergyConfigDevicetype` | RW | Loại thiết bị nào tính vào năng lượng dự án | 2 |

## Task & nhóm điều khiển

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `autoPollingGroup` | RW | Nhóm thiết bị được server tự động hỏi (polling) định kỳ | 10 |
| `cabinetTask` | RW | Task theo tủ điện | 8 |
| `deviceGroup` | RW | Nhóm thiết bị (Strategy Grouping): CRUD nhóm, thiết bị trong nhóm, gán/xoá task cho nhóm, publish task, trạng thái phân phối | 20 |
| `groupLcuImport` | W | Import danh sách LCU vào nhóm | 1 |
| `lcuTaskExport` | R | Xuất task của LCU | 1 |
| `lcuTaskImport` | W | Import task LCU (bất đồng bộ, getImportStatus) | 1 |
| `linkageStrategyActor` | RW | Chiến lược liên động của RTU (cảnh báo/vòng cáp → đóng cắt KM), lịch sử liên động | 18 |
| `task` | RW | Task (mẫu lệnh lịch: bật/tắt/dim, giờ cố định hoặc mặt trời): CRUD, task theo nhóm/thiết bị, task group, đồng bộ task group xuống device group, lịch sử đẩy | 25 |
| `taskGroupExport` | R | Xuất task / thiết bị theo nhóm | 2 |
| `taskHistory` | R | Lịch sử task đã chạy theo thiết bị | 2 |

## Cảnh báo

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `abnormalRecord` | RW | Bản ghi bất thường (Event Management) và lịch sử | 4 |
| `abnormalRecordExport` | R | Xuất bản ghi bất thường | 1 |
| `abnormalToAlarmPloy` | RW | Quy tắc chuyển bất thường → cảnh báo, áp cho thiết bị | 11 |
| `alarmStatistics` | R | Thống kê cảnh báo theo nguồn/loại | 2 |
| `alarmType` | RW | Danh mục loại cảnh báo theo loại thiết bị/dự án/chiến lược | 12 |
| `config` | RW | Cảnh báo & cấu hình cảnh báo: alarm realtime/lịch sử, xử lý/clear, đếm theo mức; ngưỡng (offline, node lost, sự cố đèn), cấu hình báo trạng thái task LCU | 62 |
| `configExport` | R | Xuất cảnh báo realtime/lịch sử | 2 |
| `fireAlarmActor` | R | Cảnh báo cháy (thiết bị báo cháy), giải trừ | 3 |

## Phiếu công việc

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `abnormalWorkOrder` | RW | Phiếu công việc (Work Order): tạo, xử lý, quy trình duyệt, đếm, export | 24 |
| `abnormalWorkOrderOverview` | RW | Tổng quan phiếu công việc: luân chuyển, tồn, hoàn thành | 5 |
| `artificialAbnormal` | RW | Bất thường do người báo (nhân công) gắn vào phiếu | 8 |
| `autoDispatchConfig` | W | Cấu hình tự động phân phiếu | 3 |
| `delayOrder` | RW | Đơn xin gia hạn phiếu: tạo, duyệt, huỷ | 9 |
| `equipmentAbnormal` | RW | Bất thường thiết bị gắn phiếu, bỏ qua hàng loạt | 9 |
| `operationAbnormal` | RW | Danh mục loại bất thường vận hành (nhóm lớn/nhóm nhỏ) | 23 |
| `workOrderStatistics` | R | Thống kê phiếu công việc theo trạng thái/nguồn/ngày | 5 |

## Bảo trì, vật tư, xe

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `assessRecord` | RW | Bản ghi đánh giá bảo trì và thống kê | 8 |
| `curyCompany` | RW | Công ty bảo trì (Maintenance Company; "cury" = 养护 bảo dưỡng) | 7 |
| `curyGroup` | RW | Đội bảo trì thuộc công ty, user trong đội | 10 |
| `custodyRecord` | RW | Bản ghi giám hộ/trông coi (custody) và thống kê | 8 |
| `devOps` | RW | Nhật ký bảo trì (Maintenance Logs) | 5 |
| `devOpsBasicData` | RW | Danh mục dữ liệu nền cho nhật ký bảo trì (loại bảo trì…) | 4 |
| `inspectionOrder` | RW | Phiếu tuần tra: hoàn thành tuyến, chuyển, duyệt | 12 |
| `inspectionPlan` | RW | Kế hoạch tuần tra (Patrol Plan): tạo, duyệt, trạng thái | 12 |
| `managementRecord` | RW | Bản ghi quản lý và thống kê | 8 |
| `MaterialCategoryName` | RW | Vật tư: nhóm vật tư | 7 |
| `materialEntry` | RW | Phiếu nhập kho, duyệt | 8 |
| `MaterialInventory` | RW | Tồn kho vật tư | 8 |
| `MaterialModel` | W | Vật tư: model | 8 |
| `MaterialName` | RW | Vật tư: tên vật tư | 8 |
| `materialRequest` | RW | Phiếu đề nghị vật tư, duyệt | 8 |
| `materialUse` | RW | Phiếu xuất dùng vật tư theo phiếu công việc, duyệt | 14 |
| `MaterialWarehouse` | RW | Kho vật tư | 8 |
| `oilCard` | RW | Thẻ xăng dầu | 5 |
| `oilChargeRecord` | RW | Nạp tiền thẻ xăng | 3 |
| `oilConsumeRecord` | RW | Tiêu thụ xăng dầu | 4 |
| `vehicle` | RW | Xe công vụ: CRUD, giới hạn tốc độ, trạng thái | 9 |
| `vehicleAnnualInspection` | RW | Đăng kiểm xe | 2 |
| `vehicleExport` | R | Xuất dữ liệu xe, thẻ xăng | 3 |
| `vehicleInsurance` | RW | Bảo hiểm xe | 2 |
| `vehicleLocatorController` | RW | Định vị xe (GPS), hàng rào điện tử | 8 |
| `vehicleRepair` | W | Sửa chữa xe | 2 |
| `vehicleUse` | RW | Đăng ký dùng xe, duyệt, thu hồi | 12 |
| `work` | RW | Kế hoạch công việc theo ngày/lộ trình | 9 |
| `workMatter` | RW | Hạng mục công việc, duyệt | 6 |
| `workMatterType` | RW | Loại hạng mục công việc | 4 |
| `wristbandController` | RW | Vòng đeo tay công nhân: gán/huỷ gán user | 8 |

## Cảm biến & thiết bị đô thị

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `appealActor` | RW | Nút gọi khẩn cấp (One-key help) trên cột | 8 |
| `baseStationActor` | RW | Trạm phát sóng (base station) gắn cột | 4 |
| `chargingActor` | RW | Trụ sạc xe điện và súng sạc | 5 |
| `chargingPackage` | RW | Gói giá sạc | 2 |
| `chargingPayRecord` | R | Giao dịch thanh toán sạc | 2 |
| `dustbinActor` | RW | Thùng rác thông minh | 5 |
| `fogPile` | RW | Cột phun sương (fog pile) | 6 |
| `parkingActor` | R | Bãi đỗ xe: ký request tới nền tảng đỗ xe | 1 |
| `radarActor` | RW | Radar (phát hiện xe/người) và nhóm radar, độ trễ khi không có xe | 13 |
| `radarCorrelationActor` | RW | Thiết bị liên động với radar | 7 |
| `radarLinkageStrategyActor` | RW | Chiến lược đèn theo radar, lịch sử xe đi qua | 10 |
| `sensorActor` | RW | Cảm biến môi trường: danh sách, xu hướng lịch sử | 14 |
| `trafficLightActor` | RW | Đèn giao thông | 4 |
| `wellcoverActor` | RW | Nắp cống thông minh | 7 |
| `wifiActor` | RW | Điểm Wi-Fi gắn cột | 5 |

## Camera & AI

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `aibox` | RW | AI Box (phân tích video tại biên) | 6 |
| `aiboxEvent` | RW | Sự kiện AI Box: lưu lượng, loại xe, khuôn mặt, người đi bộ; lưu trữ | 28 |
| `aiboxLinkageStrategyActor` | RW | Chiến lược đèn liên động AI Box ("đèn chạy theo xe") | 7 |
| `cameraActor` | RW | Camera: danh sách, liên kết thư mục/cột, mã camera trên nền tảng video, thống kê | 15 |
| `cameraEventMonitoringActor` | R | Sự kiện giao thông/đếm người từ camera | 3 |
| `cameraPreset` | RW | Preset PTZ của camera | 6 |
| `deviceCameraPreset` | RW | Gán preset camera cho thiết bị | 3 |

## Media & phát thanh

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `broadcastBoxActor` | RW | Hộp phát thanh, liên kết | 6 |
| `informatrion` | RW | Thư viện văn bản (Text Library) cho màn hình/loa, kiểm duyệt | 5 |
| `loudspeakerActor` | RW | Loa IP: danh sách, âm lượng, trạng thái phát | 13 |
| `loudspeakerbxTask` | RW | Task phát loa | 5 |
| `screenActor` | RW | Màn hình LED quảng cáo trên cột | 7 |
| `signageActor` | RW | Biển báo điện tử | 4 |
| `sysFile` | RW | Kho file/media dùng chung: ảnh, video, âm thanh; kiểm duyệt nội dung media | 15 |

## Tài sản & hạ tầng

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `assetExport` | R | Xuất sổ tài sản | 1 |
| `assetLedger` | RW | Sổ tài sản thiết bị: chi tiết, cấp trên/cấp dưới, thông tin DALI | 8 |
| `equipment` | RW | Hạ tầng quy hoạch (Facility Planning) và các điểm thiết bị | 9 |
| `municipal` | RW | Hạ tầng đô thị khác (nhà vệ sinh, trạm biến áp, cây, cầu, tủ phân phối) trên bản đồ | 7 |

## Thống kê & báo cáo

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `deviceOnline` | R | Thống kê tỉ lệ online thiết bị | 2 |
| `deviceOnlineRateExpor` | R | Xuất tỉ lệ online | 2 |
| `passengerFlowGroup` | RW | Nhóm đếm lưu lượng người (camera) | 2 |
| `projectSwitchTimeStatistics` | R | Thống kê thời điểm bật/tắt của dự án | 1 |
| `reportFormsExportTask` | RW | Tạo tác vụ xuất báo cáo và lấy link file | 2 |
| `reportManage` | RW | Báo cáo định kỳ: lưu, danh sách, tự động gửi | 6 |

## Tích hợp nền tảng ngoài

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `actilityProjectActor` | RW | Cấu hình tài khoản/domain Actility ThingPark (LoRaWAN NS) của dự án | 5 |
| `lierdaProjectActor` | R | Dự án NS Lierda (LoRa) và gateway, LCU theo NS project | 5 |
| `sponRegisterCtrl` | C | Đăng ký thiết bị với hệ thống phát thanh SPON | 2 |
| `telecom` | W | Đăng ký/huỷ thiết bị trên nền tảng NB-IoT nhà mạng (CTCC) | 2 |

## Tuỳ biến dự án

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `dayun` | R | Tích hợp nền tảng bên thứ ba "Dayun" (task) | 2 |
| `fems` | W | Gọi RPC sang hệ thống FEMS (quản lý năng lượng) — Suy luận | 2 |
| `westLakeBuilding` | RW | Tuỳ biến cho một dự án ("West Lake"): toà nhà gắn tủ/camera/báo cháy/RTU | 9 |

## Lớp gửi lệnh xuống thiết bị

| Controller | Lớp | Chức năng | # |
|---|---|---|---|
| `actilityCtrl` | C | Actility ThingPark: thêm gateway/multicast group, model, vùng tần số | 16 |
| `actilityGroupControl` | C | Lệnh nhóm LCU qua Actility (nhanh/theo toạ độ) | 2 |
| `aiboxControl` | C | AI Box: PTZ, preset, push stream, phiên bản | 8 |
| `antiControl` | C | Đọc/thiết lập thiết bị chống trộm, trở kháng, khởi động lại | 5 |
| `audioTaskCtrl` | C | Nạp/xoá task phát âm thanh | 6 |
| `broadcastBoxControl` | C | Hộp phát thanh: phát, cấu hình | 2 |
| `bxlsCtrl` | C | Hệ thống loa (BX): media, chạy/dừng/đồng bộ task | 8 |
| `cableInspectionControl` | C | Hỏi/thiết lập tham số giám sát cáp, xoá cảnh báo | 10 |
| `cameraControl` | C | Camera: PTZ, URL xem trực tiếp/phát lại, push stream, sự kiện giao thông, đồng bộ | 13 |
| `chargingControl` | C | Trụ sạc: hỏi dữ liệu/trạng thái | 2 |
| `device485Control` | C | Triển khai thiết bị RS485 | 3 |
| `deviceControl` | C | Lệnh thiết bị chung: nâng cấp firmware (upgrade pool), reset cấu hình, debug, triển khai, thao tác hàng loạt theo nhóm, danh sách thiết bị lỗi khi thao tác hàng loạt | 56 |
| `dtuControl` | C | Cấu hình DTU: RS485, server, WAN, triển khai, GPS, công tơ người dùng | 15 |
| `dustbinCtrl` | C | Thùng rác: đăng ký, tham số | 3 |
| `electronicLockCtrl` | C | Khoá điện tử: mở/khoá, thẻ từ | 7 |
| `gatewayControl` | C | Cấu hình gateway từ xa: LAN/WAN/DHCP, RS485, server, IPC, cảm biến môi trường, cuộc gọi | 25 |
| `groupCtrl` | C | Nạp/xoá thông tin nhóm xuống RTU/LCU | 6 |
| `kmControl` | C | Đóng/cắt KM (mạch) theo đơn lẻ/nhóm/dự án, hỏi trạng thái | 12 |
| `lampControl` | C | LỆNH ĐÈN: unicast/group/broadcast (bật, tắt, dim, hỏi trạng thái/dữ liệu) cho 1 LCU, nhóm RTU hoặc cả dự án; batch có tiến độ qua WebSocket | 35 |
| `lcuRouteControl` | C | Hỏi/xoá route trên LCU | 2 |
| `lcuTaskCtrl` | C | Nạp/xoá/hỏi task trên LCU (theo nhóm, theo toạ độ, giờ mùa hè); cả biến thể Lierda | 22 |
| `lierdaCtrl` | C | Lierda NS: thêm gateway/project/node/group, tần số | 13 |
| `lierdaGroupControl` | C | Lệnh nhóm LCU qua Lierda NS | 2 |
| `lightningProtectionCtrl` | C | Đọc thiết bị chống sét | 1 |
| `luxCtrl` | C | Toạ độ & lux trên LCU: nạp/hỏi toạ độ, bật/tắt điều khiển theo toạ độ, so toạ độ | 9 |
| `meterControl` | C | Hỏi công tơ thời gian thực: thông số điện, rò điện, địa chỉ công tơ | 11 |
| `networkAudioCtrl` | C | Loa mạng: danh sách phát, phát/dừng, âm lượng | 7 |
| `powerBoxControl` | C | Cấu hình power box từ xa: mạng, RS485, server, chế độ DO, ưu tiên mạng | 22 |
| `powerBoxTaskCtrl` | C | Nạp task & toạ độ cho power box | 8 |
| `radarControl` | C | Radar: tham số, nhóm, gán LCU, task liên động | 8 |
| `rtuSdmpControl` | C | Cấu hình RTU giao thức SDMP: RS485, tự động thiết bị | 4 |
| `rtuTaskCtrl` | C | Nạp/xoá/hỏi task trên RTU (kể cả RTU190) | 8 |
| `scenesLightControl` | C | Kích hoạt/tắt scene cảnh quan ngay hoặc theo lịch | 3 |
| `screenCtrl` | C | Màn hình LED: phát/xoá danh sách, độ sáng, NTP, cấu hình | 37 |
| `screenTaskCtrl` | C | Nạp/xoá task màn hình | 5 |
| `sensorControl` | C | Cảm biến môi trường: đọc, cấu hình, reset lượng mưa | 4 |
| `showingMasterControl` | C | Điều khiển show master: phát/dừng scene, hiệu ứng | 8 |
| `smartBoxControl` | C | Cấu hình SmartBox từ xa: RF module, RS485, server, zone, đồng bộ thiết bị | 10 |
| `smartBoxTaskCtrl` | C | Nạp task & toạ độ cho SmartBox | 9 |
| `solarControl` | C | Bộ điều khiển NLMT: đọc/đặt tham số, chế độ, lịch sử | 16 |
| `solarDeviceControl` | C | Solar LCU: cấu hình, tham số mạng, báo cáo, lịch sử năng lượng | 19 |
| `solarLcuTaskCtrl` | C | Nạp/hỏi task Solar LCU | 3 |
| `solarTaskCtrl` | C | Nạp/hỏi task bộ điều khiển NLMT | 3 |
| `tangYuanChargingCtrl` | C | Trụ sạc hãng TangYuan: bắt đầu/dừng sạc, khởi động lại, nâng cấp | 5 |
| `taskCtrl` | C | Nạp/xoá/hỏi task trên concentrator/RTU (terminal task) | 4 |
| `thermometerCtrl` | C | Cảm biến nhiệt: đọc, ngưỡng, chu kỳ báo | 4 |
| `tiltSensorCtrl` | C | Cảm biến nghiêng: đọc, ngưỡng, chu kỳ báo, đặt điểm 0 | 5 |
| `waterImmerDetectCtrl` | C | Cảm biến ngập: đọc/thiết lập | 4 |
| `wcuControl` | C | Cấu hình WCU: báo cáo, slave, phiên bản, khởi động lại, nâng cấp | 12 |
| `weeYuChargingCtrl` | C | Trụ sạc hãng WeeYu | 2 |
| `wellCoverCtrl` | C | Nắp cống: đọc/thiết lập | 7 |
| `zhpvCtrl` | C | Tủ điện năng lượng (PV) bên thứ ba: dữ liệu/trạng thái tủ, điều khiển mạch, nạp task, đặt giờ | 7 |

> Danh sách đầy đủ 2.320 method theo controller ở file `04b-api-methods.md`.