# Loại thiết bị, thiết bị khác và template model (`deviceConfig`)

Kết quả dò thật bằng tab **Dò API (chỉ đọc)** (nhóm "Công cụ dò", chỉ có ở bản preview; mã `features/probe/`, `adapters/fonda/probe.ts`) trên dự án `9a59bd49…`. Cấu trúc chắc chắn (quan sát từ JSON thật); nghĩa từng trường là suy luận. Chạy lại: mở tab → "Chạy dò" → "Tải JSON mẫu" (≤ 3 bản ghi/API).

## 1. Loại thiết bị của dự án

`GET deviceTypeController/queryAllDeviceTypeByProjectId/{pid}` → 60 loại, mỗi loại `{deviceTypeId, deviceTypeValue, deviceTypeName, remark, choose, deviceConfig(number)}`.
(`queryDeviceTypesWithUidOfProject` chỉ trả 3 loại có UID. `deviceTypeController/queryAllDeviceType` báo `1005 projectId cannot be empty` — gọi không đúng cách, bỏ qua.)

| Giá trị | Tên | Giá trị | Tên | Giá trị | Tên |
|---|---|---|---|---|---|
| 1 | Electric Meter | 15 | Anti-Theft | 31 | Surge |
| 2 | LCU | 16 | Lighting Master Controller | 32 | Power Box |
| 3 | Gateway | 17 | Weather Station | 33 | Special Change Box |
| 4 | Concentrator | 18 | Camera | 34 | Maintenance Well |
| 5 | **Lamps** | 20 | Switch | 35 | Electronics Cabinet |
| 6 | **Lamp Pole** | 21 | Lux meter | 36 | AC Contactor |
| 7 | Cabinet | 22 | Router | 37 | Breaker |
| 8 | Smart box | 23 | Active Photoelectric Converter | 38 | Transfer Switch |
| 9 | Switch and detection | 24 | Base Station | 39 | Underground Cables |
| 13 | Trash Bin | 25 | Fire Hydrant | 40 | Underground Pipe |
| 14 | Manhole Cover | 26 | Charging Pile | 41 | Transformer |
| 27 | Advertising Screen | 28 | One-Click Help | 42 | Data Box |
| 29 | Broadcasting Speaker | 30 | Wi-Fi | 43 | Car GPS |
| 44 | Positioning Bracelet | 45 | Anti-theft expansion module | 46 | FogPile |
| 47 | DC cabinet | 65 | Solar Light | … | còn các giá trị 48–68 (xem artifact) |

**Lamps (5)** và **Lamp Pole (6)** là *loại thiết bị gốc riêng*, không phải đèn con trong LCU. Đèn con của LCU nằm ở `lcuActor/queryLcuAndRelatedBy…` (`lamp[]`), `projectLampActor/queryProjectLamp`.

## 2. Thiết bị theo loại — `POST device/queryDevicePage`

Body: `{projectId, current, size, deviceTypeValue}` → `{records[], total, size, current, pages}`. Loại **đang có dữ liệu** ở dự án mẫu: Lamps, Lamp Pole, Gateway, LCU; các loại khác trả `records: []`.

| Nhóm trường | Có ở |
|---|---|
| `deviceId, deviceName, deviceCode, deviceModelId, deviceModelName, deviceStatus, deviceGrade, deviceSource, registerStatus, protocolValue, protocolName, geographicAddress, createTime, higherDevice, roadId/roadName, areaId/areaName` | mọi loại |
| `lat, lng` (chuỗi) | Gateway, Lamp Pole, LCU — **Lamps không có toạ độ** |
| `uid` | Gateway, LCU — **Lamp Pole không có `uid`**, Lamps dùng `luid` |
| `luid, lcuId, poleId, poleCode, bindLcu, lampPower, nominalPower, nominalCurrent, ratedCurrent` | Lamps |
| `stationId` | Gateway |

Web: các tab RTU / Gateway / SmartBox / Cảm biến / Công tơ / Camera và "Thiết bị khác" (`web/src/features/devices/`) chia theo *tên* loại bằng `categoryOf()` (`adapters/fonda/mappers.ts`); loại không khớp (Lamps, Lamp Pole, Concentrator, Switch and detection…) vào "Thiết bị khác".

## 3. Template model — `deviceConfig`

- `POST deviceModel/getDeviceModelPage` (`{projectId, current, size, deviceTypeId}`) → danh sách model: `deviceModelId, deviceModelName, deviceTypeId/Value/Name, protocolId/Value/Name, systemConfig, poleTypeId, url, fileId, remark`. **Không** có `deviceConfig`.
- `GET deviceModel/queryAllDeviceModelByProjectId/{pid}` → 27 model: `{deviceModelId, deviceModelName, deviceTypeId, deviceConfig}`. **`deviceConfig` là CHUỖI JSON** → phải `JSON.parse`.
- `POST deviceModel/queryDeviceModelByDeviceTypeAndProject` → `1005 Parameter deviceType cannot be empty` kể cả khi gửi `deviceType`/`deviceTypeId` trong body; tên tham số đúng **chưa biết** (cần bắt từ web gốc).

Cấu trúc `deviceConfig` đổi theo loại (mẫu model đầu tiên của từng loại):

**a) Loại thiết bị "thường" — bộ thuộc tính phẳng** (LCU, Gateway, Concentrator, Lamp Pole): cùng một bộ khoá, loại nào chỉ dùng một phần.
`ai, di, heig, wide, power, voltageP, factoryId, productId, coverTypes, lcuType, rtuType, radarType, cameraType, gatewayTypes, smartBoxType, poleType, loopType, taskNum, hasTaskNum, tempsNum, currentsNum, dimmingLevel, lampHolderNum, lampPower, lampLifetime, nominalPower, nominalCurrent, ratedCurrent, ratedVoltage, ratedPowerFactor, ratedApparentPower, powerProtocol, waterTankCapacity, totalChargingPorts`
- Lamp Pole thêm `poleTypeId`, `poleArmType`. LCU/Gateway thêm `functionList[]` (số) và `extensions[] {name, label, value:boolean}` (LCU có 7 mục, Gateway 2 — cờ bật/tắt chức năng mở rộng).
- Kiểu giá trị khác nhau giữa loại (vd `dimmingLevel` là chuỗi ở LCU, số ở Concentrator; `gatewayTypes` số ở Gateway) → mapper phải chịu cả hai.
- **Solar Light (65)**: chỉ có `lampTypes` (số).

**b) Loại "tổ hợp" — template khai thiết bị đính kèm** (Electric Meter, Switch and detection): mỗi khoá là *một loại thiết bị con* và giá trị là danh sách model được chọn làm mặc định đính kèm:
`BS, ai, di, km, lcu, lux, anti, lamp, pole, surge, appeal, camera, master, router, screen, sensor, wiFiAP, …` → mỗi phần tử `{checked:boolean, modelId, modelName}`; riêng `lamp[]` thêm `lampIndex` (đèn thứ mấy), `ai/di/km[]` thêm `pathNum` (số mạch). Ở Switch and detection `pole` là **object** (không phải mảng).
→ Đây chính là "mẫu" dùng để khai **LCU/tủ đính kèm Lamp, Lamp Pole…** cùng lúc: `checked` = có gắn, `modelId` trỏ tới `deviceModelId` ở mục trên.

**Loại cột (PoleType):** `POST poleType/getAllPoleTypeOfProjectList` (body `{projectId}`; nếu không được thì `getAllPoleTypeOfProjectPage` `{projectId,current,size}`) → `{poleTypeId, poleTypeName, poleTypeValue, systemConfig, remark}`. `deviceConfig.poleTypeId` của model Lamp Pole trỏ tới `poleTypeId`. Tab "Mẫu thiết bị" có chip "Loại cột — PoleType" (dữ liệu khớp Fonda, đã xác nhận); bấm một loại cột → drawer bên phải (mã, `poleTypeValue`, `systemConfig`, model cột đang dùng). **Kết quả dò (2026-11-20):** `poleType/getAllPoleTypeOfProjectList` với body `{projectId}` trả cả loại hệ thống (`projectId` null, `systemConfig` 1, giá trị 1–8: Single arm lamp, Double arm lamp, Garden lights, Lantern, Smart light pole, Solar lamp pole, Tunnel lights, Three-Arm Lamp) lẫn loại tự khai của dự án (`systemConfig` 0, `projectId` có). `poleTypeValue` chỉ là số thứ tự, loại tự khai dùng lại số của loại hệ thống (không duy nhất, không có dictionary tra tên). Ứng viên enum: dictionary **39 "Pole Type"** (1 Magnolia Lamp … 10 New Leaf Single Pick Light) — chưa kiểm chứng là có liên quan. `getAllPoleTypeOfProjectPage` cho cùng dữ liệu. `dictionary/queryDictionaryPage` với `{current,size}` trả rỗng (cần tham số khác).

**Kiểu tay đèn (`poleArmType`):** (dictionary 47 "Light Pole Type" có cùng giá trị Willow Leaves/Ginkgo — có thể là bản ghi cùng loại; 55 là nhóm "Ordinary pole lamp arm type"; bản ghi 55 có `dictType`=55 (số), `dictId` chung cả nhóm, `dictStairId` riêng từng mục, `dictionarySecond` rỗng.) `deviceConfig.poleArmType` của model Lamp Pole = `dictValue` của dictionary key 55 (`GET dictionary/queryDictionaryByKey/55`). Tab Mẫu thiết bị có chip "Kiểu tay đèn" (chỉ đọc) và drawer model cột hiện tên. Dictionary có `queryDictionaryPage`, `save`, `update`, `deleteById` nhưng **body chưa bắt** → chưa thêm/bớt được; cần bắt từ web Fonda gốc (tab Bắt request). `dictionary/save` với body sao chép nguyên bản ghi bị từ chối: `Parameter dictKey cannot be empty` → body cần trường **`dictKey`** (bản ghi đọc về không có). **Phát hiện 2026-11-20:** `dictionary/save` với `dictKey` **thành công** nhưng chỉ tạo một *bản ghi tiêu đề* mới (`dictId` mới, `dictKey` "55", `dictValue` "3", `dictName`, `createUserId/createTime`) hiện ở `POST dictionary/queryDictionaryPage` (body `{current,size,dictKey}`; chỉ liệt kê bản ghi do dự án tạo, không có bản dựng sẵn) — **không có `dsName`** nên `queryDictionaryByKey/55` (join với tên) không trả. Tên giá trị nằm ở cấp "stair" (`dictStairId`, `dsName`, `dictStairRemark`), cần bước gắn tên (thử `dictionary/update`). Xoá: `GET dictionary/deleteById/{dictId}` (chưa bắt). **Kết luận (dừng thử):** `dictionary/update` trả 500 "Internal Server Error" (Spring, không chi tiết) với cả 3 dạng body (tối thiểu / `dictionarySecond` / đầy đủ, có và không `projectId`); web Fonda gốc không có màn hình khai báo kiểu tay đèn → coi dictionary là dữ liệu hệ thống, web chỉ liệt kê và chọn trong giá trị có sẵn. Bản ghi thử còn lại: `dictId` `756fea81d6f24c2ab4047b1a21bea5cb` (key 55, `dictValue` 3) cần xoá. Trong lúc chờ: tab **Thử thêm Dictionary (ghi)** (nhóm Công cụ dò, chỉ preview) sao chép một bản ghi có sẵn, bỏ `dictId`, đổi `dsName`/`dictValue` rồi gửi `dictionary/save` (hoặc `update`) để xem server nhận không. **Tên giá trị là `dsName`** (vd "Willow leaf", "Ginkgo"); `dictName` là tên nhóm ("Ordinary pole lamp arm type").

## 4. Dictionary (enum)

`GET dictionary/queryDictionaryByKey/{key}` → `[{dictValue, dsName, dictName, dictStairId, dictStairRemark, dictId, dictType, dictionarySecond[]}]`. Đã dò: key 3 (Lamp Type, 6 giá trị), 15 (3), 17 (Power Type, 8), 19 (2), 20 (2), 21, 55, 99, 116, 119 — bảng tên nhóm ở `05-dictionaries.md`. Các trường enum trong `deviceConfig` (`lampTypes`, `powerProtocol`, `poleArmType`, `rtuType`, `gatewayTypes`, `dimmingLevel`…) tra bằng các key này (đối chiếu key↔trường **chưa kiểm chứng đủ**).

## 5. Quan hệ thực tế & template (dữ liệu dự án mẫu, đã dò)

**Thiết bị → template:** mọi bản ghi `device/queryDevicePage` có `deviceModelId` (= template) và `deviceModelName`; model có `deviceTypeId/Value` nên suy ra loại. Model còn mang `protocolValue/protocolName` (53 = RF/F2, 4 = CAT1/F2, 12 = Gateway/SDMP, 1 = RTU/FEMS), `protocolVersion`, `systemConfig` (0 thường; **3 = nội bộ bộ tập trung, 4 = nội bộ power box** — theo ghi chú "集中器内置/电源管理盒内置" của model), `poleTypeId` (chỉ Lamp Pole), `url/fileId` (ảnh).

**Quan hệ giữa thiết bị thật** (trường nằm trên *bản ghi thiết bị*, không nằm trong template):
| Từ | Trường | Trỏ tới |
|---|---|---|
| Lamps (5) | `poleId`, `poleCode`, `higherDevice` (= tên cột) | Lamp Pole (`deviceId`) |
| Lamps (5) | `luid` (UID LCU), `lcuId` (= `deviceId` của LCU), `bindLcu` | LCU. `bindLcu=1` có LCU; `bindLcu=2` **chưa gắn LCU** (`luid/lcuId = null`) — đèn vẫn gắn được vào cột mà không cần LCU |
| LCU (2) | `poleId`, `poleCode`, `higherDevice`, `lat/lng` | Lamp Pole; toạ độ LCU = toạ độ cột khi đã gắn |
| Lamp Pole (6) | `lcuId` (null ở mẫu), `deviceModelId` | LCU (ngược chiều, hiếm dùng); model cột có `poleTypeId` |
→ cây thực tế: **Cột → (LCU) → Đèn**, LCU và đèn cùng trỏ về cột bằng `poleId`; đèn trỏ về LCU bằng `lcuId/luid`. Đèn mang `lampPower/nominalPower/ratedCurrent/nominalCurrent` copy từ `deviceConfig` của model lúc tạo.

**Hai kiểu template:**
1. *Thuộc tính* (LCU, Lamps, Lamp Pole, Gateway, Concentrator, Solar Light): chỉ chứa thông số kỹ thuật, không chứa quan hệ. Ví dụ Lamps `Đèn đường phố - LED`: `lampTypes:4, powerTypes:3, powerProtocol:1, lampPower/nominalPower:"40", ratedCurrent:"0.2", ratedPowerFactor:"0.97", ratedVoltage:220, lampLifetime:"50000", dimmingLevel:20, lampHolderNum:1`; (số lưu dạng chuỗi hoặc số tuỳ model). LCU: `lampHolderNum, dimmingLevel, currentsNum, tempsNum, loopType, lcuType, extensions[7 cờ], functionList[1..4]`. Lamp Pole: `poleType, poleTypeId, poleArmType`.
2. *Tổ hợp* (Electric Meter, Switch and detection): khai **thiết bị đi kèm** khi tạo bộ tập trung / power box. Khoá thêm so với §3b: `lcuAndLamp[] {lcu:{checked,modelId,modelName}, lamp:[{checked,modelId,lampIndex,modelName}]}` (một LCU kèm các đèn theo chỉ số), `built-inKm[] {checked, control, modelId, modelName, lamp:[…]}` (KM nội bộ + đèn), `coreGateway{…}`, `outerMeter[]`, `userMeter[]`, `powerModule[]`, `charging[]`, `broadcast[]`, và thông số `pathNum, taskNum, voltageP, cameraType, hasTaskNum, breakerType, frequencyPoint, poleTypeId`; `km[]/ai[]/di[]` có `pathNum`. Ở mẫu tất cả `checked:false`, `modelId:""` (template trống). Model mẫu "Built-in di" có `deviceConfig` không phải JSON object.

**Enum trong `deviceConfig` ↔ dictionary** (đối chiếu giá trị; ✔ = khớp rõ ràng):
| Trường | Dictionary | Ghi chú |
|---|---|---|
| `lampTypes` | key 3 (Lamp Type) | |
| `powerTypes` | key 17 (Power Type) | |
| `poleArmType` | key 55 | |
| `meterType` | key 21 | |
| `rtuType` | key 99 | |
| `gatewayTypes` | key 119 | ✔ `2` ↔ "RTU500LD" khớp tên model RTU500LD-HPL1 |
| `currentP` (Electric Meter) | key 15 (Current Rate) | ✔ `30` = `dictValue` của "150/5" |
| `dimmingLevel` | key 20 | giá trị lưu là **số hiển thị** (20, "100"), không phải `dictValue` (1→"20", 2→"100") |
| `lampHolderNum` | key 19 (số đầu đèn) | suy luận |

**Việc dò còn thiếu:** `lcuActor/page` trả rỗng dù LCU tồn tại (lấy LCU qua `device/queryDevicePage` loại 2, hoặc `lcuActor/getLcuListByProjectId`), nên chi tiết `queryLcuAndRelatedBy…`, `projectLampActor/queryLampOfLcu`, `poleActor/…` **chưa có dữ liệu thật** — tab dò đã sửa để lấy LCU từ nguồn đúng, chạy lại để bổ sung.

## 6. Cây Cột – LCU – Đèn: các API đọc quan hệ (đã dò thật, dự án mẫu)

| API | Trả về |
|---|---|
| `GET lcuActor/queryLcuAndRelatedByUid/{uid}` | LCU: thông số, `deviceConfig` (object, đã parse), `poleId`, `poleName`, toạ độ, địa chỉ. **Không có `lamp[]`** |
| `GET lcuActor/queryLcuAndRelatedByLcuId/{lcuId}` | như trên + `lamp[]` (đèn của LCU) + trạng thái mạng (`networkStatus`, `heartbeatDelay`, `version`, `runTime`, `freq`, `lightDecline`, `dimDirection`…) |
| `GET projectLampActor/queryLampOfLcu/{lcuId}` | `[]` đèn của LCU, có `poleId`, `lcuModelId`, `rtuId`, `rssi/snr/signals/losted` |
| `GET poleActor/queryLcusOfPoleByLcuId/{lcuId}` | `{lamp[], pole[], lcu[]}` — bộ ba (đèn, cột, LCU) của một LCU; `lcu[]` đủ trường (`defaultUid`, `poleTypeName`, `onlineTime`…) |
| `GET poleActor/queryPoleAndRelatedById/{poleId}` | cột + `deviceConfig` + **`attributeDevice[]`** (xem dưới) |
| `GET poleActor/queryAttributeDeviceOfPole/{poleId}` | **mọi loại thiết bị có thể gắn trên cột**, mỗi loại một mảng (xem dưới) |
| `GET deviceModel/queryDeviceModelByDeviceModelId/{id}` và `…AndTypeAndSystemAndFactoryById/{id}` | model + `deviceConfig` đã parse + `url/fileId`, `protocolValue/Id/Version`, `deviceModelRemark` (bản "Full" không có `url/fileId`) |

**Đèn của LCU** (`lamp[]`): `lampId, channel` (đầu đèn/kênh 1..`lampHolderNum`), `maxchannel, lgnum, kgnum, ls, dims, dim, angle, luid, cuid, lcuId, deviceModelId, lampType, powerType, powerProtocol, lampPower` (copy từ model) cùng số đo mạng (`signals, snr, rssi, losted, alarms`).

**`attributeDevice[]` của cột** — mỗi phần tử là một "bộ gắn trên cột": `{checked, lcu:{deviceId, uid, lampHolderNum, deviceModelId}, lamp:[{deviceId, deviceName, deviceModelId, lampNum (= kênh), luid, lcuId, checked, solarId, solarLcuId}], solar:{}, solarLcu:{}}` → một LCU kèm các đèn theo số kênh, hoặc nhánh năng lượng mặt trời. Đây chính là cấu trúc mà template tổ hợp `lcuAndLamp[]` khai báo trước.

**Các loại gắn được trên cột** (`queryAttributeDeviceOfPole`): `lamp, lcu, pole, solar, solarLcu, wifi, electronicLock, dtu, charging, wcu, screen, signage, powerBox, appeal, waterImmerDetect, aibox, loudspeaker, tiltSensor, sensor, thermometer, camera, gateway, trafficLight`.

**Các quan hệ khác thấy được:**
- `LCU.defaultUid` = UID của Gateway (`00000E2025510038` ở dự án mẫu) → LCU đăng ký qua gateway/bộ tập trung nào (suy luận); LCU còn `rtuId`, `zoneId`, `groupNodeId`, `lcuInfoId`, `inWhiteSpace`, `gisDisplay`.
- `poleTypeName` (vd "Single arm lamp") suy ra từ `poleTypeId` của model cột; `poleArmType` (dict 55) là kiểu tay đèn.
- `deviceConfig.extensions[]` của model LCU là danh sách cờ chức năng `{name,label,value}` (`lcuTask, lightOperated, poleSlant, temDetection, DIDetection, GPS, remoteUpgrade`) — tên hiển thị theo ngôn ngữ người dùng, model mẫu chỉ bật 3 cờ; `functionList` là mã chức năng (1–4).
- Vị trí: LCU và đèn **dùng chung toạ độ của cột** khi đã gắn.

**Đã dò thêm — cột CÓ LCU và cột KHÔNG có LCU** (Cột 1 và Cột 2 của dự án mẫu):
| | Cột 1 (có LCU) | Cột 2 (không LCU) |
|---|---|---|
| `attributeDevice[]` | 1 phần tử: `lcu:{uid, lampHolderNum, deviceModelId, deviceId}` + `lamp:[{lampNum:1, luid, lcuId, deviceId…}]` | **2 phần tử, mỗi đèn một phần tử**: `lcu:{}`, `solar:{}`, `solarLcu:{}`, `lamp:[{lampNum:1, luid:null, lcuId:null, deviceId…}]` |
| `queryAttributeDeviceOfPole` → `lamp[]` | có số đo (`ls, dim, signals, snr, ctype, losted`, `cuid`, `protocolName: RF/F2`) | `luid/lcuId/cuid = null`, **không có số đo** (`ls, dim, signals, snr, ctype, losted = null`), `dims` 100 hoặc null |
| `lcu[]` | 1 LCU đầy đủ | `[]` |
→ **Đèn không LCU** là một phần tử `attributeDevice` có `lcu = {}`; đèn **chỉ thuộc cột** (qua `poleId`), mang toạ độ của cột, kênh mặc định `lampNum/channel = 1`. Khi gắn LCU thì đèn nhận `luid`, `lcuId`, `cuid` và bắt đầu có số đo; `bindLcu` đổi 2 → 1.
- `projectLampActor/queryLampAndRelatedById/{lampId}` → thông tin đèn + `deviceConfig` của **model đèn** (`lampTypes, powerTypes, powerProtocol, lampPower, nominalPower, ratedCurrent, ratedPowerFactor, ratedApparentPower, lampLifetime…`; số lưu dạng chuỗi) + `url/fileId`; **không có `poleId`/`lcuId`** — quan hệ phải lấy từ `device/queryDevicePage`, `queryLampOfLcu` hoặc `queryPoleAndRelatedById`.

**API ghi liên quan (CHƯA gọi, chưa biết body):** `deviceModel/saveNew|updateNew|delete|copyDeviceModel|useOrNo`, `device/save`, `device/placeDevice`, `lcuActor/save|update|bindPole|delete`, `projectLampActor/update`, `poleActor/save|sensorAssociatedWithPole|fogPileAssociatedWithPole|delete`, `device/connectAncillaryDevice|disconnectAncillaryDevice`. **Trong docs hiện có** chỉ có tên API và danh sách trường form (không có body JSON): `02-architecture.md` §10 — `device/save` (form Add Equipment: Project, Type, *Device Model, *Name, ID, *UID, Area, Road, Side, Road Classification, *Status, Remark; xoá `device/delete|deleteBatch`; đăng ký/huỷ register/unregister) và `deviceModel/save` (form Add Device Model: Project, *Type, *Function type/protocol, *Device Model, Picture, Remark + bộ trường `deviceConfig` theo loại; sửa `update`, xoá `delete`, copy). `03*-entities` chỉ dựng từ API đọc nên không có body của API ghi; `08-auth-and-reuse.md` §5 và `11-api-probe-and-security.md` §5 nêu cách bắt payload (hook XHR chỉ-đọc trên web gốc khi người dùng tự thao tác). Body bắt bằng tab **Bắt request (API ghi)** (nhóm Công cụ dò, chỉ ở preview) rồi mới thử (trên dữ liệu thử, có xác nhận).

## 7. API ghi đã bắt từ web Fonda gốc (tab "Bắt request")

Bắt ngày 2026-11-18 khi người dùng tự thao tác trên **dữ liệu thử** (tạo model cột → tạo cột kèm LCU + đèn → sửa → xoá). Id thật thay bằng `<…>`. Mọi API trả `{code:200, message, data}`; body gửi dạng JSON, `projectId` nằm **trong body**.

**Tạo template (model) — `POST deviceModel/saveNew`** (model cột, loại Lamp Pole)
```
{ deviceModelName, deviceTypeId, deviceTypeValue: 6, projectId,
  deviceModelId: "",            // rỗng khi tạo mới
  protocolId: "", protocolValue: -1, useTag: null,
  deviceConfig: { ...bộ thuộc tính phẳng như mục 3a (poleType, poleTypeId, poleArmType, lampHolderNum, …) } }
```
→ `data` = model vừa tạo (có `deviceModelId` mới, `deviceTypeName`, `url`, `fileId`, `systemConfig:0`, `protocolName`…). Ở body `deviceConfig` là **object** (không phải chuỗi như khi đọc `queryAllDeviceModelByProjectId`).

**Tạo cột kèm LCU và đèn trong một lần — `POST poleActor/save`**
```
{ deviceId: "", deviceModelId: <model cột>, deviceName, deviceCode, lat: "<chuỗi>", lng: "<chuỗi>",
  geographicAddress, areaId: "", roadId: "", roadDirection: "", deviceStatus: 1, deviceSource: 1, projectId,
  solarDevice: [],
  attributeDevice: [ {                       // một "bộ gắn" = một LCU + các đèn của nó
      checked: true, lampPosition: 1, uid: "<uid LCU>", solar: {}, solarLcu: {},
      lamp: [ { checked: true, flag: true, lampNum: 1, lampPosition: 1, deviceModelId: <model đèn>, deviceName } ],
      lcu: { deviceType: 2, deviceModelId: <model LCU>, deviceName, deviceCode: "", uid: "<uid>", lampHolderNum: 1,
             protocolValue: 53, protocolName: "RF/F2", protocolMode: "", linkMode: 1, lcuTask: true, deviceSource: 1,
             projectId, imsi: "", imei: "", sim: "", ccid: "", cls: "", fcntbits: "", lwan: "", factory: null } } ] }
```
→ `data` = cột (có `deviceId` mới) + `lamp[{lampId, dId, uid, num, ctype, deviceModelId, lat, lng}]` — **`uid` LCU được đệm 0 thành 12 ký tự hex** (`789DDD` → `000000789DDD`), `dId` = `deviceId` của LCU vừa tạo. LCU được **tạo mới cùng lúc** (lúc bắt, `lcuActor/queryLcuNotAssociatedWithPole` trả rỗng nên không có LCU rảnh để chọn; trường hợp chọn LCU có sẵn **chưa bắt**).
- Cột không LCU: chưa bắt, nhưng dữ liệu đọc (mục 6) cho thấy là phần tử `attributeDevice` có `lcu:{}`.

**Tạo cột + gắn LCU ĐÃ CÓ (chọn sẵn) + đèn mới — cùng `POST poleActor/save`** (bắt ngày 2026-11-19). Khác với LCU tạo mới, `lcu` chỉ là tham chiếu tối thiểu:
```
attributeDevice: [ { checked: true, lampPosition: 1, uid: "<uid 12 hex>", solar: {}, solarLcu: {},
    lcu: { deviceId: "<deviceId của LCU có sẵn>", uid: "<uid 12 hex>", lampHolderNum: 1, linkMode: 2 },
    lamp: [ { checked: true, flag: true, lampNum: 1, lampPosition: 1, deviceModelId: <model đèn>, deviceName: "<tên đèn>" } ] } ]
```
(phần còn lại của body như trên). `linkMode`: **1 = LCU tạo mới (khai đủ trường)**, **2 = LCU có sẵn (chỉ `deviceId`, `uid`, `lampHolderNum`)**. `data.lamp[]` trả `{lampId (mới), dId (= deviceId LCU), uid, num, ctype, deviceModelId, lat, lng}`. Đèn là **thiết bị mới tạo** gắn vào cột và LCU; LCU có sẵn giữ nguyên deviceId. Danh sách LCU chọn được: LCU chưa gắn cột (cũng suy được từ `device/queryDevicePage` loại 2 có `poleId = null`).

**Danh sách LCU chưa gắn cột (để chọn khi gắn) — `POST lcuActor/queryLcuNotAssociatedWithPole`**: `{integratedQuery:"", current:1, size:100, projectId, deviceType:2, deviceId:""}` → trang `{records, total, size, current, pages}`.

**Sửa cột — `PUT poleActor/update`**: body là **toàn bộ đối tượng cột** như `queryPoleAndRelatedById` trả về (kèm `deviceConfig`, `attributeDevice[]` ở dạng đọc: lamp có `deviceId, luid, lcuId, checkNum, lampPosition`; lcu có `deviceId, uid(12 hex), linkMode: 2`) + phần sửa (ví dụ `deviceCode`); thêm `solarDevice:[{checked, lamp:{…}, solar:{}, wcu:{}, dtu:{}, serialId, …}]`. `data: null`. → quy ước: **đọc đối tượng, sửa trường, gửi lại nguyên đối tượng**.

**Kiểm tra trước khi xoá — `POST device/checkDeviceRelated`**: `{deviceIdList:[<id>], deviceTypeValue: 6}` → `data: 0` (số thiết bị liên quan; 0 = xoá được — suy luận từ việc web gọi nó trước khi xoá).

**Xoá cột — `POST poleActor/delete`**: `{deviceIdList:[<id cột>], deviceTypeValue: 6}` → `data: null`. **Chưa kiểm chứng** việc LCU/đèn đã gắn trên cột có bị xoá theo hay trở về trạng thái "chưa gắn".

**Mô hình "bộ đèn–LCU" của form Fonda** (`attributeDevice[]`): cột = danh sách các bộ; mỗi bộ = `lcu` + `lamp[]`. Ba kiểu bộ: LCU **tạo mới** (`linkMode:1`, khai đủ trường, UID gõ tay), LCU **có sẵn** (`linkMode:2`, tham chiếu `deviceId/uid/lampHolderNum`), và **không LCU** (`lcu:{}`, không có `uid`, đúng 1 đèn `lampNum:1` — như Cột 2 đọc được ở mục 6). Mỗi bộ có `lampPosition` = vị trí trong danh sách (từ 1), đèn của bộ lấy cùng `lampPosition`. Web đã dựng body theo mô hình này (`writeBodies.ts` → `groupBody`); **payload của bộ không LCU khi tạo/sửa và việc thêm bộ vào cột có sẵn là SUY RA từ dữ liệu đọc + quy ước của các case đã bắt, chưa được Fonda xác nhận** — cần thử và so với request thật của web Fonda (tab Bắt request).

**Sửa cột = thêm / gỡ bộ trong một lần `PUT poleActor/update` (ĐÃ CHẠY THÀNH CÔNG, bắt 2026-11-19).** Một request duy nhất vừa gỡ một bộ, giữ hai bộ cũ và thêm một bộ mới. `attributeDevice[]` gửi **toàn bộ** danh sách bộ, mỗi phần tử có `lampPosition` = vị trí trong danh sách (từ 1, **không đánh số lại** sau khi gỡ):
| Việc | Phần tử gửi lên |
|---|---|
| **Gỡ bộ** (bộ không LCU) | giữ nguyên nội dung đã đọc (đèn có `deviceId`, `checkNum`, `lampPosition`) nhưng đặt **`checked: false` + `remove: true`** |
| **Giữ bộ cũ không LCU** | như đã đọc + đèn có `checkNum = lampNum`, `lampPosition`; `lcu: {}`, không có `uid` |
| **Giữ bộ cũ có LCU** | như đã đọc + `uid` của LCU, `lcu` có `deviceId, uid, lampHolderNum, deviceModelId, linkMode: 2`; đèn có `checkNum`, `lampPosition` |
| **Thêm bộ mới dùng LCU có sẵn** | `{checked:true, uid, lampPosition, solar:{}, solarLcu:{}, lcu:{deviceId, uid, lampHolderNum, linkMode:2}, lamp:[ĐÈN MỚI]}` |
Đèn mới trong `update`: `{checked:true, flag:true, deviceModelId, deviceName, lampPosition, lampNum, checkNum}` — **có thêm `checkNum` (= `lampNum`) so với khi tạo bằng `save`**; **không có `deviceId`**. Các ô kênh chưa dùng gửi dạng `{checked:false, deviceModelId:"", deviceName:"", lampPosition, lampNum, checkNum}` (hoặc `checked:false` kèm model/tên đã điền) và bị Fonda **bỏ qua** — chỉ phần tử `checked:true` mới được tạo/giữ. Các trường còn lại như đã mô tả: gửi cả đối tượng cột, `solarDevice` rỗng → 1 phần tử mẫu, `data: null` khi thành công.
- Lần thử đầu của web này (nối bộ mới vào `update`) bị `Parameter deviceId cannot be empty (1005)`; nguyên nhân khả dĩ nhất là đèn mới thiếu `checkNum` (đã sửa theo capture). Chưa chắc 100% vì body đó còn có kiểu bộ chưa được xác nhận (không LCU / LCU mới trong `update`).
- Ở capture, LCU có sẵn chỉ có `lampHolderNum: 1` nhưng form hiển thị 4 ô đèn và chỉ ô đầu `checked:true` → số đèn tạo thật bị giới hạn bởi `lampHolderNum` của LCU. Case **một LCU nhiều đèn** (`lampHolderNum > 1`) chưa bắt.
- **Số kênh/đèn của LCU phải đọc từ chính LCU:** ở capture, LCU `123456789ABC` là LCU nhiều đèn nhưng tham chiếu `lcu.lampHolderNum` trong `attributeDevice` chỉ ghi `1`, còn form hiển thị 4 ô đèn → **không dùng `lampHolderNum` của tham chiếu để biết số kênh**. Nguồn chuẩn: `projectLampActor/queryLampOfLcu/{lcuId}` (đèn thực theo `channel`) và `deviceConfig.lampHolderNum` của model LCU (web vẽ 1..max của hai nguồn + kênh lớn nhất có đèn). Người dùng xác nhận **mọi bộ đèn–LCU (có/không LCU) đều gỡ được như nhau** bằng `checked:false` + `remove:true`.
- **Đã kiểm chứng bằng dữ liệu đọc sau khi chạy** (2026-11-19): (1) `update` thêm bộ LCU có sẵn + gỡ bộ không LCU đều **thành công**: Cột 4 đọc lại còn đúng 3 bộ (không LCU, LCU `…4ABD`, LCU `…9ABC`), bộ đã gỡ **không còn** trong `attributeDevice`. (2) LCU `123456789ABC` chỉ có **1 đèn** ở kênh 1: `queryLampOfLcu` trả 1 bản ghi (`channel:1, maxchannel:1`), `queryLcuAndRelatedByLcuId.lamp[]` có 1, model LCU `lampHolderNum:1` — cả ba LCU hiện có đều 1 đầu đèn (3/3 model LCU của dự án `lampHolderNum:1`; dictionary 19 "Number Of Lamp Heads" chỉ có giá trị 1 và 2). Form Fonda hiển thị 4 ô đèn nhưng 3 ô `checked:false` bị bỏ qua nên **không tạo thêm đèn**; số đèn tối đa của LCU do model quyết định, không do số ô trên form. Muốn test LCU nhiều đèn cần model LCU `lampHolderNum:2`.
- **Quy tắc (người dùng xác nhận):** form Fonda cho khai nhiều đèn nhưng sau khi ghi và đọc lại, **LCU chỉ quản lý đúng số đầu đèn của model** — `deviceConfig.lampHolderNum` là giá trị **cố định khi khai template LCU** (gắn theo kiểu phần cứng). Vì vậy web chặn ngay từ form: số đèn tối đa và kênh 1..N lấy từ model LCU (bộ LCU có sẵn / LCU mới), không gõ thêm đèn quá N. Bảng so sánh thông số phần cứng các model LCU: tab Mẫu thiết bị → loại LCU (giao thức/phiên bản/`systemConfig`, số đầu đèn, `lcuType`, `loopType`, mức dim, cờ chức năng bật `extensions[]`, `functionList`) và mục "Model LCU" của tab Dò API. Dữ liệu dự án mẫu: `LCU-D-light` (đầu đèn 1, `lcuType` null, dim "100", giao thức TCP/D-light, `systemConfig` 3, fn 1–4), `LCU-RF-HAPU` và `Testttttt1235` (RF/F2, `lcuType` 1, `loopType` 1, dim 20, 3 cờ, fn 1–3, đầu đèn 1), `LCU-F2-3` (CAT1/F2, `systemConfig` 3); **LƯU Ý (sửa lại): `LCU-F2-3` (CAT1/F2, `systemConfig` 3) có `lampHolderNum` = 3** — đã kiểm chứng bằng LCU thật (3 đèn kênh 1..3, `maxchannel` 3 ở `queryLampOfLcu`, form tạo cột + 3 đèn thành công); các model RF/F2 (`LCU-RF-HAPU`, `Testttttt1235`) và `LCU-D-light` là 1. Dictionary 19 (chỉ có 1 và 2) vì vậy **không** phải giới hạn số đầu đèn của model; số đầu đèn lấy từ `deviceConfig.lampHolderNum` của từng model.
- **Chưa biết:** gỡ bộ có LCU (LCU bị gỡ khỏi cột hay xoá?), gỡ bộ xoá hẳn đèn hay chỉ gỡ khỏi cột (cần đọc lại `device/queryDevicePage` loại 5 sau khi gỡ để kiểm tra), thêm bộ không LCU / LCU mới bằng `update`.

**Tạo model LCU — `POST deviceModel/saveNew` (bắt 2026-11-19, `deviceTypeValue: 2`):**
```
{ deviceTypeId: <LCU>, deviceTypeValue: 2, deviceModelName, remark, projectId,
  protocolId, protocolValue: 53, protocolName: "RF/F2", protocolVersion: "F2 v1.0", useTag: null,   // giao thức chọn từ danh sách (protocolActor)
  deviceConfig: { lampHolderNum: 1, lcuType: 1, rtuType: 0, loopType: 1, dimmingLevel: 20, currentsNum: 6, tempsNum: 6, taskNum: 10, hasTaskNum: 1, poleType: null,
                  functionList: [1..7], extensions: [{label, value, name}×7], …các trường phẳng như mục 3a } }
```
→ không có khoá `deviceModelId` (model cột thì có `deviceModelId: ""`). `data` = model mới, `systemConfig: 0`. Tên `extensions[].name` theo ngôn ngữ của request (ở bản bắt: "LCU Task (RTC)", "Photocell", "Pole Tilt", "Temperature Detect", "DI Detection", "GPS", "Remote Upgrade (OTA)"); khoá thật là `label` (`lcuTask, lightOperated, poleSlant, temDetection, DIDetection, GPS, remoteUpgrade`). `functionList` [1..7] = các chức năng của giao thức RF/F2 (model cũ chỉ chọn [1,2,3] hoặc [1..4]). Web: nút "Tạo bản sao…" ở Mẫu thiết bị giờ cũng nhân bản model LCU (giữ `deviceConfig` và giao thức của model gốc).

**Cách Fonda tổ chức model LCU — ĐÃ KIỂM CHỨNG (probe 2026-11-19):** có hai nhóm model, phân biệt bằng `systemConfig`:
| Model | Giao thức | `systemConfig` | Đầu đèn | `lcuType` |
|---|---|---|---|---|
| `LCU-F2-1` | CAT1/F2 | **3** (dựng sẵn) | 1 | 2 |
| `LCU-F2-2` | CAT1/F2 | **3** | 2 | 1 |
| `LCU-F2-3` | CAT1/F2 | **3** | 3 | 5 |
| `LCU-RF` | RF/F2 | **3** | 1 | 1 |
| `LCU-D-light` | TCP/D-light | **3** | 1 | null |
| `LCU-RF-HAPU`, `Testttttt1235`, `LCU-test-funtion` | RF/F2 | **0** (người dùng khai) | 1 | 1 |
→ **`systemConfig` 3 = model LCU dựng sẵn theo phần cứng** (dòng `LCU-F2-N`: N = số đầu đèn, giao thức CAT1/F2; `lcuType` là mã kiểu phần cứng); số đầu đèn **cố định theo phần cứng**. Model người dùng tự khai (`systemConfig 0`) qua form đều 1 đầu đèn (dictionary 19 chỉ có 1 và 2; **người dùng xác nhận: trên form, khi nhập `lcuType` thì ô số đầu đèn bị khoá theo kiểu phần cứng — không chọn được 2** — kể cả model dựng sẵn của dự án). **Chưa biết server có chặn hay chỉ khoá ở giao diện** → tab "Thử tạo model LCU (ghi)" gửi thẳng `saveNew` với `lampHolderNum`/`lcuType` tuỳ ý để kiểm tra. `deviceSystemController/queryDeviceSystemList` trả các "series" hệ thống dựng sẵn (`systemConfig: 1`, `remark: "System Built-in"`, ví dụ "NB Solar Series", "2G Solar Series", "Broadcasting Speaker Series"; mỗi series có `protocolId`) — phân nhóm thiết bị theo họ phần cứng.

**Kết quả thử "model LCU không giới hạn" (2026-11-19):** (1) `deviceModel/saveNew` với `lampHolderNum: 5` (ngoài dictionary 1/2, form khoá) → **server NHẬN và lưu đúng 5** (`LCU-lab-…`, `systemConfig 0`) ⇒ giới hạn số đầu đèn/`lcuType` ở form tạo model là **chỉ ở giao diện**. (2) Tạo cột + LCU **mới** từ model đó qua `poleActor/save` (`linkMode 1`) → **server NHẬN**, LCU có `maxchannel 5`, đèn gắn kênh 1..N. (3) Thêm LCU **riêng lẻ** (form Add Equipment, `device/save`) từ model đó → **giao diện Fonda không cho chọn**; chưa rõ do dropdown lọc model (dữ liệu từ server) hay do server từ chối khi lưu — cần bắt request của form này (kể cả request đọc: `__capture.download(true)`).

**Thêm LCU riêng lẻ — `POST lcuActor/save`** (form Add Equipment, bắt 2026-11-19): `{connectId:"", deviceModelId, deviceName, deviceCode:"", uid, deviceStatus:1, imei/imsi/sim/ccid:"", areaId/roadId/roadDirection:"", roadLevelId:null, deviceSource:1, remark:"", lcuTask:1, cls/fcntbits/lwan:"", verifyEnabled:0, protocolValue, protocolName, lightOperated/poleSlant/temDetection/diDetection/gps/remoteUpgrade/energyAccumulation: null, projectId}` → `data` = LCU với `deviceId` mới (`lang:"en-US"` thêm vào). Giao thức (`protocolValue/Name`) lấy từ model. Kết quả thử: server từ chối model tự tạo 4vo4 (code 1001); tab thử đã gỡ, nút "Thêm LCU" ở tab Danh sách LCU dùng đúng body này.

**Kết quả `lcuActor/save` với model tự tạo (2026-11-19):** model khai báo từ Fonda → server **nhận**; model `LCU-lab-4vo4` (`lampHolderNum 5`, tạo bằng công cụ thử) → **server từ chối `Operation failed (code 1001)`** ⇒ có kiểm tra ở **server** khi thêm LCU riêng lẻ (khác với `saveNew` model và `poleActor/save` đều nhận). Lý do cụ thể chưa rõ (nghi: số đầu đèn/`lcuType` không thuộc tập hợp lệ). Web: tab Danh sách LCU có nút "+ Thêm LCU…" và "Xoá LCU đã chọn…" (chỉ preview; xoá = `device/checkDeviceRelated` rồi `lcuActor/delete` với body `{deviceIdList, deviceTypeValue: 2}` theo quy ước của cột — **chưa bắt**, có thể bị từ chối).

**Giá trị nhỏ:** `linkMode` của LCU trong `attributeDevice`: `1` khi tạo mới cùng cột, `2` ở dạng đọc/sửa (suy luận: 1 = tạo mới, 2 = đã tồn tại). `queryDeviceTypesWithUidOfProject` chính là danh sách loại mà form "Add Equipment" cho chọn (chỉ 3 loại có UID: Concentrator, Gateway, LCU). `deviceImportOrExport/getImportStatus` → `{isImportRun}`; `area/queryAreaByCityId/{cityId}/{projectId}` → danh sách khu vực.

**Chưa bắt (cần bắt thêm):** sửa/xoá/copy model (`updateNew`, `delete`, `copyDeviceModel`); tạo model LCU/Lamps/tổ hợp (template có `lcuAndLamp`); gắn LCU **có sẵn** vào cột (`lcuActor/bindPole`?); thêm/bớt đèn của cột đã tồn tại; cột chỉ có đèn không LCU; xoá cột có gắn LCU (xem LCU/đèn còn không); `device/save` (tạo LCU/gateway riêng).

## 8. Việc còn mở

- Tìm tham số đúng của `deviceModel/queryDeviceModelByDeviceTypeAndProject` (bắt request từ web gốc).
- Chưa dò dữ liệu của loại có thiết bị nhưng không thấy ở dự án mẫu (RTU, SmartBox, cảm biến… đều rỗng ở dự án này).
- Tab **Mẫu thiết bị** (`features/devices/Models.tsx`) đã có: `queryAllDeviceModelByProjectId` + `JSON.parse(deviceConfig)`; chưa dịch enum bằng dictionary (đối chiếu key↔trường chưa chắc).
- Lưu ý: các tab thiết bị phải lấy loại từ `queryAllDeviceTypeByProjectId` (60 loại); `queryDeviceTypesWithUidOfProject` chỉ trả 3 loại.
