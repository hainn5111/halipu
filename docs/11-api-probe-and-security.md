# SLCP — Dò toàn bộ API, kênh realtime & phát hiện bảo mật

Buổi dò **2026-11-14** (người dùng tự đăng nhập, Claude điều khiển Chrome, chỉ đọc). Mục tiêu: làm rõ kiến trúc và gọi thử từng đầu API để biết tương tác thực tế. Gọi **659/866 endpoint đọc** thành công, hook kênh WebSocket realtime, và lần ra luồng login. Kết quả chi tiết field nằm ở `03-entities.md`; catalog + phân lớp ở `04-api-catalog.md`.

---

## 1. Cách dò (tái lập được)

Frontend là Vue + Webpack. Thay vì bắt từng request, lấy thẳng **registry module** của webpack để gọi hàm API có sẵn (đã kèm token qua interceptor):

1. Đẩy một module “probe” vào `window.webpackJsonp` để lấy hàm `require` nội bộ (`__webpack_require__`).
2. Duyệt mọi module, tìm hàm có `url:"/v1.0/..."` → map **2.320 endpoint** kèm HTTP method và tên tham số hàm.
3. Phân loại bằng tên method, chỉ chạy nhóm **đọc** (`query*`, `get*`, `page*`, `list*`, `statistic*`…), bỏ mọi method ghi/điều khiển và mọi endpoint dính `Account/Password/Token`.
4. Gọi lần lượt với `{projectId, current, size}`; khi lỗi “Parameter X cannot be empty” thì điền X từ pool ID thu được (ID lấy từ chính response trước, không nhập tay), gọi lại tối đa 4 lần.
5. Chỉ giữ **tên trường + kiểu** của response (che `id32`/datetime), không lưu giá trị thật.

> Đây là đường dò nhanh nhất cho các chat sau: không cần bấm UI, không cần bắt mạng. Lưu ý **chỉ gọi nhóm đọc** — danh sách method ghi/điều khiển (lớp W/C ở `04`) tuyệt đối không chạy tự động.

**Mã trạng thái nội bộ** (ngoài HTTP): response bọc `{type, code, message, data}`. `code` **200** hoặc **20000** = thành công; khác là lỗi/cảnh báo. Frontend phân loại ~300 mã (`showStatusCodeMessage`); đáng chú ý: `2001` khoá thao tác, `2004` cần xác thực bước 2 (gửi mã qua mail), `10002` token hết hạn → về login, `50008/50012/50014` đăng xuất. Tầng HTTP 500 = lỗi server (thường do thiếu tham số bắt buộc), 404 = endpoint không còn.

---

## 2. Kênh realtime WebSocket (lấp phần “Chưa biết” của doc 08)

- **URL**: `ws://159.138.45.45:81/clesws` (cùng host frontend cổng 81, **không mã hoá TLS**). Có thêm một WebSocket thứ hai cho loa/phát thanh ở `ws://183.129.241.36:23535/ws` (module SPON, không thuộc luồng đèn).
- **Bắt tay**: khi `onopen`, gửi `{cmd:"session", ctrl:"login", Authorization:<token>}` (chữ hoa). Sau đó không cần đăng ký listener riêng cho đèn — server tự đẩy.
- **Giữ phiên**: client gửi `{cmd:"session", ctrl:"heartbeat"}` định kỳ; server trả `session/heartbeat`.
- **Đổi dự án**: gửi `{cmd:"project", ctrl:"disabled", data:{projectId:<cũ>}}` khi rời dự án.
- **Lệnh HTTP → kết quả WS**: lệnh điều khiển đi bằng HTTP POST trả “accepted” ngay; trạng thái/tiến độ thực thi về qua WS (`08` mục 4 đã đoán, nay xác nhận bằng frame thật `lampControl/unicastStatus`).

**Các loại frame server đẩy về** (quan sát ~1.500 frame/4 phút; chỉ ghi hình dạng, không ghi giá trị):

| cmd/ctrl | Nội dung (field chính) |
|---|---|
| `lcu/status` | `deviceId, deviceStatus, netWorkStatus, rssi, signals` — LCU online/offline + tín hiệu |
| `rtu/status` | `deviceId, netWorkStatus, signals, communicationModel, stime` |
| `smartBox/status` | như rtu/status |
| `lampControl/status` | `deviceId, cuid, poleId, lotime, lampStatus:[{num, dimming, ls}]` — mức dim & bật/tắt từng kênh đèn |
| `lampControl/data` | `deviceId, lcuData:[{num, voltage, current, power, energy, powerFactor, lux, life, angle, fault, leakageVoltage, lastAction, lastSource, dtime}]` — đo lường điện/đèn |
| `pole/lampStatus` | `[{poleId, lampCount, lightCount}]` — số đèn sáng/tổng trên cột |
| `lampControl/unicastStatus` | phản hồi một lệnh unicast (bật/tắt/dim) |
| `solarLamp/status`, `solarLamp/data`, `solarLampControl/*` | tương đương cho đèn năng lượng mặt trời (thêm `battery*`, `plate*`, `chargestatus`) |
| `rtu/setTime`, `smartBox/setTime` | xác nhận đồng bộ giờ `{deviceId, status}` |
| `push/alarm` | cảnh báo realtime: `deviceId, deviceName, uid, alarmType, level, source, channel, smsSend, emailSend, appPush, voiceBroadcast, autoWorkOrder, reset, firstTime` |

Các field này là **nguồn dữ liệu realtime** quan trọng khi tự xây CMS: `lampControl/data` chính là bản ghi đo điện của đèn; `push/alarm` là luồng cảnh báo.

**Ý nghĩa & đơn vị field** (bổ sung từ `SmartLightingPlatform_TLTK/04`, quan sát 2026-11-19; mục nào ghi *Suy luận* cần đối chiếu lại với màn hình GIS/đồng hồ đo):

| Field | Ý nghĩa | Tin cậy |
|---|---|---|
| `lampStatus[].num` | Kênh đèn (1 = tay đèn 1) | Chắc chắn (khớp `num` của lệnh `unicast/dimming`, doc 08) |
| `lampStatus[].dimming` | Mức sáng 0–100 % | Chắc chắn |
| `lampStatus[].ls` | Trạng thái đèn: `1` = sáng, `2` = tắt | Suy luận — mới thấy giá trị `1`; cần bắt frame lúc tắt đèn để xác nhận `2` |
| `lcuData[].voltage` / `current` / `power` / `powerFactor` | V / A / W / 0..1 | Chắc chắn về ý nghĩa (giá trị mẫu ~230 V); đơn vị A, W là Suy luận theo độ lớn |
| `lcuData[].energy` | Điện năng cộng dồn, đơn vị **Wh** | Suy luận — cần so với số kWh trên màn Reports/Energy |
| `lcuData[].life` | Tổng thời gian chạy, đơn vị **giây** | Suy luận — mẫu 15.777.765 ≈ 183 ngày, hợp lý |
| `lcuData[].angle` | Góc nghiêng cột (độ), cảm biến tilt | Chắc chắn về ý nghĩa (khớp TC-GIS-04 doc 10); đơn vị Suy luận |
| `lcuData[].devicent` | **Field mới, trước chưa ghi.** Có thể là nhiệt độ bên trong LCU (°C) | Suy luận — chỉ dựa tên field + giá trị mẫu 32,58 |
| `lcuData[].leakageCurrent` | Dòng rò, có thể đơn vị mA | Suy luận |
| `rtu/status.signals` | Cường độ tín hiệu (mẫu: 90) | Suy luận (thang đo chưa rõ) |
| `push/alarm.alarmRealValue` | **Chuỗi JSON** (phải parse lần 2) chứa số đo lúc báo: `p, u, i, pf, lv, lc, te, angle, time` | Chắc chắn về dạng chuỗi JSON; ý nghĩa `p`=công suất, `u`=áp, `i`=dòng, `pf`=hệ số công suất là Suy luận, `te`/`lv`/`lc` Chưa biết |
| `push/alarm` có thêm `deviceTypeValue, color, errorBelong` (vd `LAMP1`) | `errorBelong` = lỗi thuộc kênh đèn nào | Chắc chắn (tên field); ý nghĩa Suy luận |
| Envelope frame | `{code, type, message, data:{cmd, ctrl, projectId, data}}`, `message` tiếng Trung `操作成功!` | Chắc chắn |

---

## 3. Luồng đăng nhập (lấp mục 3 của doc 08)

- Màn hình login lấy RSA public key (nhúng sẵn trong bundle), mã hoá mật khẩu bằng **JSEncrypt**, rồi POST:
  ```
  POST http://159.138.45.45:18080/api/login
  { "username": "<user>", "password": "<RSA(password)>", "repassword": <bool nhớ mật khẩu> }
  ```
- **Token nằm ở HTTP response header `authorization`** (không phải trong body) — interceptor đọc header này và lưu lại. → Đây là lý do mở tab mới bị đẩy về login dù localStorage còn `pid`: token giữ trong cookie/bộ nhớ theo phiên, không ở localStorage.
- Sau login gọi `GET /api/getUser` lấy hồ sơ, `POST /api/v1.0/project/queryList` lấy cây dự án, rồi `WEBSOCKET_INIT`.
- Nếu trả `code 2004` → tài khoản bật xác thực 2 bước: gửi mã qua mail (`sendAdministratorVerfiyCode` / `administratorVerfiyCodeCheck`).
- Đổi mật khẩu: `verifyUserPassword` / `updatePwd` (cũng mã hoá RSA).
- `freeLogin`, `guanNan/login`, `login.php` (SPON) là các đường đăng nhập phụ cho tích hợp ngoài.

**Header mỗi request** (interceptor tự thêm khi đã có token): `authorization`, `clientType=app`, `userAccount`, `projectId` (= localStorage `pid`), `timeZone`, `offset`, `summerTimeStartLong`, `summerTimeEndLong`. Với lệnh điều khiển đơn (doc 08) chỉ `authorization` là bắt buộc.

---

## 4. Phát hiện bảo mật (quan trọng cho hệ thống mới)

Các điểm dưới đây là **hành vi của hệ thống Fonda**, ghi lại để khi tự xây tránh lặp lại. Không khai thác, không lưu dữ liệu của bên khác.

### 4.1 🔴 Rò dữ liệu realtime giữa các dự án (nghiêm trọng)
Kênh WebSocket đẩy về cho tài khoản HTest **frame trạng thái/đo lường của hàng loạt dự án khác**, không chỉ dự án đang chọn.
- Quan sát: trong ~30 giây, nhận **143 frame từ 22 `projectId` khác nhau**, trong đó **106 frame từ 21 dự án KHÔNG nằm trong cây dự án tài khoản được gán** (chỉ 1 dự án), gồm `deviceId`, toạ độ, mức dim, đo điện của đèn thuộc khách hàng khác.
- Nghĩa là server broadcast theo kênh chung, lọc theo dự án nằm ở **client**, không ở server. Một người dùng bất kỳ nghe WS sẽ thấy dữ liệu đèn của mọi khách hàng trên cùng máy chủ.
- **Khi tự xây:** lọc sự kiện realtime **phía server** theo quyền của phiên; mỗi kết nối WS chỉ nhận sự kiện của dự án/thiết bị mà user có quyền.

### 4.2 🟠 Điều khiển chỉ cần token (doc 08 đã nêu, nhắc lại)
Lệnh `lampControl/*`, `kmControl/*`… chạy chỉ với header `authorization`, không kiểm `controlSet`/`verifyType` ở phía API (các cờ này chỉ chặn ở UI). → Server phải tự thực thi xác thực điều khiển, không giao cho frontend.

### 4.3 🟠 Mật khẩu & secret trả ra API đọc (doc 07 đã nêu)
`project` trả `domesticPassword`, `foreignPassword`, `smsUid`… cho frontend. → Không trả secret ra API đọc.

### 4.4 🟡 Mã hoá đường truyền
Toàn bộ HTTP (`:18080`) và WebSocket (`:81/clesws`) chạy **không TLS**. Token truyền dạng rõ trong header. → Hệ thống mới bắt buộc HTTPS/WSS.

### 4.5 🟡 Thiếu kiểm quyền endpoint theo vai trò (cần kiểm thêm)
Dò bằng tài khoản HTest gọi được 659 endpoint đọc ở hầu hết lĩnh vực (kể cả agency/user/role/menu). Menu RBAC chặn **giao diện** (trang Project Management trả 401) nhưng **API tương ứng có chặn theo vai trò hay không thì chưa kiểm từng cái** — các lần dò chỉ gọi nhóm đọc và phần lớn trả 200. → Cần kiểm quyền ở **từng endpoint**, không chỉ ẩn menu.

### 4.6 Ghi chú tác dụng phụ của chính buổi dò
Buổi dò chỉ chạy nhóm đọc, nhưng 2 điểm cần biết:
- `carbonExport/getPowerBoxData` trả về **URL một file báo cáo** → server có sinh file tạm khi gọi (vô hại).
- Một số endpoint “get*/query*” thực chất **hỏi thiết bị thật** (ví dụ `*Ctrl/queryStatus`, `meterControl/query*`): mình đã loại nhóm `*Ctrl`/`*Control` khỏi lần chạy tự động, nhưng khi dò thủ công cần nhớ các method `query*` nằm trong controller lớp **C** là gửi gói tin xuống thiết bị (R1), không phải chỉ đọc DB.

---

## 5. Còn thiếu & cách lấp

| Thiếu | Cách lấp |
|---|---|
| Nội dung frame WS khi **gửi lệnh** (unicastStatus, batch progress) | Hook `ws.onmessage` đồng thời khi người dùng tự bấm 1 lệnh (W1, cần đồng ý) |
| Payload các lệnh ghi (save task, distribute, turnOn/Off) | Bắt khi người dùng tự thao tác (doc 08 mục 5) |
| Quyền từng endpoint theo vai trò | Dò lại bằng tài khoản quyền thấp, so sánh mã trả về |
| 207 endpoint đọc chưa gọi được (thiếu ID hợp lệ: `deviceId`, `parentDeviceId` của loại thiết bị dự án chưa có) | Gọi khi dự án có thiết bị loại đó, hoặc truyền ID thật từ màn hình tương ứng |
| Hạn token, cơ chế refresh | Để tab mở lâu, ghi thời điểm trả `10002` |

*Tạo: 2026-11-14.*
