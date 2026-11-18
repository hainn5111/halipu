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

## 6. Việc còn mở

- Tìm tham số đúng của `deviceModel/queryDeviceModelByDeviceTypeAndProject` (bắt request từ web gốc).
- Chưa dò dữ liệu của loại có thiết bị nhưng không thấy ở dự án mẫu (RTU, SmartBox, cảm biến… đều rỗng ở dự án này).
- Tab **Mẫu thiết bị** (`features/devices/Models.tsx`) đã có: `queryAllDeviceModelByProjectId` + `JSON.parse(deviceConfig)`; chưa dịch enum bằng dictionary (đối chiếu key↔trường chưa chắc).
- Lưu ý: các tab thiết bị phải lấy loại từ `queryAllDeviceTypeByProjectId` (60 loại); `queryDeviceTypesWithUidOfProject` chỉ trả 3 loại.
