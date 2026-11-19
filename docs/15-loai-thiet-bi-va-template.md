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

**Giá trị nhỏ:** `linkMode` của LCU trong `attributeDevice`: `1` khi tạo mới cùng cột, `2` ở dạng đọc/sửa (suy luận: 1 = tạo mới, 2 = đã tồn tại). `queryDeviceTypesWithUidOfProject` chính là danh sách loại mà form "Add Equipment" cho chọn (chỉ 3 loại có UID: Concentrator, Gateway, LCU). `deviceImportOrExport/getImportStatus` → `{isImportRun}`; `area/queryAreaByCityId/{cityId}/{projectId}` → danh sách khu vực.

**Chưa bắt (cần bắt thêm):** sửa/xoá/copy model (`updateNew`, `delete`, `copyDeviceModel`); tạo model LCU/Lamps/tổ hợp (template có `lcuAndLamp`); gắn LCU **có sẵn** vào cột (`lcuActor/bindPole`?); thêm/bớt đèn của cột đã tồn tại; cột chỉ có đèn không LCU; xoá cột có gắn LCU (xem LCU/đèn còn không); `device/save` (tạo LCU/gateway riêng).

## 8. Việc còn mở

- Tìm tham số đúng của `deviceModel/queryDeviceModelByDeviceTypeAndProject` (bắt request từ web gốc).
- Chưa dò dữ liệu của loại có thiết bị nhưng không thấy ở dự án mẫu (RTU, SmartBox, cảm biến… đều rỗng ở dự án này).
- Tab **Mẫu thiết bị** (`features/devices/Models.tsx`) đã có: `queryAllDeviceModelByProjectId` + `JSON.parse(deviceConfig)`; chưa dịch enum bằng dictionary (đối chiếu key↔trường chưa chắc).
- Lưu ý: các tab thiết bị phải lấy loại từ `queryAllDeviceTypeByProjectId` (60 loại); `queryDeviceTypesWithUidOfProject` chỉ trả 3 loại.
