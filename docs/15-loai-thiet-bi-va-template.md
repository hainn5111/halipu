# Loại thiết bị, thiết bị khác và template model (`deviceConfig`)

Kết quả dò thật bằng workflow **Device probe** (`.github/workflows/device-probe.yml`, script `e2e/device-probe.js`, **chỉ đọc**) trên dự án `9a59bd49…`. Cấu trúc chắc chắn (quan sát từ JSON thật); nghĩa từng trường là suy luận. Chạy lại probe: Actions → "Device probe (chỉ đọc)" → Run workflow; mẫu dữ liệu (≤ 3 bản ghi/API) nằm trong artifact `device-probe`.

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

## 5. Việc còn mở

- Tìm tham số đúng của `deviceModel/queryDeviceModelByDeviceTypeAndProject` (bắt request từ web gốc).
- Chưa dò dữ liệu của loại có thiết bị nhưng không thấy ở dự án mẫu (RTU, SmartBox, cảm biến… đều rỗng ở dự án này).
- Có thể làm tab "Mẫu thiết bị" (chỉ đọc) dùng `queryAllDeviceModelByProjectId` + `JSON.parse(deviceConfig)` + dictionary.
