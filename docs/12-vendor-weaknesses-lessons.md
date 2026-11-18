# 12 — Lỗ hổng & điểm yếu của Fonda SLCP → bài học cho hệ thống mới

Mục đích: liệt kê những gì Fonda làm sai hoặc làm yếu ở web/server, để hệ thống Hapulico **không lặp lại**. Mỗi mục gồm: Fonda đang làm thế nào → rủi ro → mình đề xuất làm thế nào → cách kiểm tra.

- Phạm vi quan sát: chỉ từ phía client (frontend bundle, REST API, WebSocket). Không có mã nguồn server, DB hay hạ tầng → mọi nhận định về bên trong server là **Suy luận**.
- Nguồn chính: `11-api-probe-and-security.md` (phương pháp probe, frame WebSocket, luồng login), `04-api-catalog.md`, `04b`/`04c` (danh sách method), `02-architecture.md`, `08-auth-and-reuse.md`.
- Không ghi token, mật khẩu, cookie hay dữ liệu thật của người/thiết bị.
- Cập nhật: 2026-11-14.

Mức nghiêm trọng: 🔴 nghiêm trọng · 🟠 cao · 🟡 trung bình · ⚪ thấp/chất lượng.

---

## A. Bảo mật

### A1. 🔴 WebSocket rò dữ liệu realtime chéo dự án
- **Fonda:** sau khi socket `ws://…/clesws` login bằng token, server đẩy frame trạng thái (`lcu/status`, `rtu/status`, `lampControl/status`, `push/alarm`…) của **cả các dự án không thuộc tài khoản**. Đo được ~106 frame từ 21 project ngoài cây tài khoản trong ~30 giây. — **Chắc chắn** (doc 11 §4.1).
- **Rủi ro:** lộ vị trí, trạng thái, cảnh báo thiết bị của khách hàng khác; vi phạm cách ly đa khách hàng (multi-tenant).
- **Đề xuất:** mỗi kết nối WS gắn danh sách `projectId` được phép (lấy từ quyền user lúc handshake, không lấy từ client gửi lên). Server chỉ publish vào kênh theo project (`project:{id}`), lọc ở **phía server** trước khi gửi. Đổi quyền user → đóng/làm mới các subscription.
- **Kiểm tra:** test tự động: user A mở WS, phát sự kiện ở project của user B → A không được nhận frame nào.

### A2. 🔴 Không có TLS
- **Fonda:** web `http://…:81`, API `http://…:18080`, WebSocket `ws://` — toàn bộ không mã hoá. — **Chắc chắn**.
- **Rủi ro:** token, dữ liệu, lệnh điều khiển đi dạng rõ; bị nghe lén/sửa gói trên đường truyền (MITM), có thể gửi lệnh tắt đèn giả.
- **Đề xuất:** HTTPS + `wss://` bắt buộc, HSTS, chặn HTTP (chỉ redirect). TLS cả ở kết nối nội bộ server ↔ gateway/NS nếu đi qua mạng công cộng.
- **Kiểm tra:** quét cổng: không còn cổng HTTP phục vụ dữ liệu; SSL Labs ≥ A.

### A3. 🟠 Mã hoá RSA mật khẩu ở client nhưng vô tác dụng
- **Fonda:** frontend dùng `jsencrypt` mã hoá mật khẩu trước khi gửi login, nhưng token trả về (header `authorization`) và mọi request sau đó đi trên HTTP rõ. — **Chắc chắn** (doc 08, 11).
- **Rủi ro:** tạo cảm giác an toàn giả; lấy được token là đủ, không cần mật khẩu. Nếu khoá RSA cố định trong bundle thì còn có thể replay gói login đã mã hoá. (Replay: **Suy luận**, chưa thử.)
- **Đề xuất:** bỏ RSA phía client, dựa vào TLS. Mật khẩu băm bằng Argon2id/bcrypt ở server. Có rate-limit và khoá tạm khi đăng nhập sai nhiều lần.

### A4. 🟠 API đọc trả về secret
- **Fonda:** một số API đọc cấu hình (tài khoản nền tảng ngoài như NS/LoRa, cấu hình server thiết bị…) trả về trường dạng mật khẩu/khoá trong JSON. — **Chắc chắn** về việc có trường, không ghi giá trị (doc 11 §4.3).
- **Rủi ro:** bất kỳ user có quyền xem đều lấy được thông tin đăng nhập hệ thống bên thứ ba.
- **Đề xuất:** secret lưu mã hoá (KMS/Vault hoặc khoá ứng dụng), **không bao giờ** trả về trong API đọc — chỉ trả cờ `hasSecret: true`; đổi secret bằng endpoint ghi riêng, có audit.
- **Kiểm tra:** test duyệt mọi response schema, cấm field tên `password|secret|key|token` trừ whitelist.

### A5. 🟠 Token điều khiển đủ để gửi lệnh, chưa thấy lớp xác nhận
- **Fonda:** có token là gọi được nhóm endpoint `*Ctrl`/`*Control` (bật/tắt/dim đèn, đóng cắt KM, nâng cấp firmware, reset thiết bị) ở mức cả dự án. — **Chắc chắn** về bề mặt API; mức chặn quyền thực tế: **Chưa biết** (không thử gửi lệnh theo quy tắc chỉ đọc).
- **Rủi ro:** lộ một token → tắt đèn cả thành phố, đóng cắt điện, nạp firmware hỏng.
- **Đề xuất:** quyền điều khiển tách khỏi quyền xem; lệnh phạm vi rộng (cả project / broadcast / firmware) cần xác nhận lần hai (re-auth hoặc 2 người duyệt); giới hạn tần suất; audit log bất biến (ai, lúc nào, lệnh gì, phạm vi nào, kết quả).

### A6. 🟡 Phân quyền theo endpoint chưa kiểm chứng
- **Fonda:** quyền thể hiện qua cây menu (`menu`, `role.bindAuthority`). Chưa xác định server có kiểm tra quyền ở từng API hay chỉ ẩn menu ở frontend. — **Chưa biết** (doc 11 §4.5).
- **Cách lấp:** cần một tài khoản quyền thấp để thử gọi API của menu bị ẩn (chỉ dùng API đọc).
- **Đề xuất:** kiểm tra quyền ở server cho mọi endpoint (policy theo `role` × `action` × `projectId`), mặc định từ chối; frontend ẩn menu chỉ là tiện ích.

### A7. 🟡 `projectId` do client gửi trong header
- **Fonda:** mọi request kèm header `projectId` lấy từ `localStorage`. — **Chắc chắn**. Việc server có kiểm tra user thuộc project đó không: **Chưa biết** (chỉ đọc trong project của mình).
- **Rủi ro:** nếu server tin header này → đọc/ghi dữ liệu dự án khác (IDOR).
- **Đề xuất:** coi `projectId` là tham số cần **ủy quyền**, luôn đối chiếu với quyền của user; ID dùng UUID nhưng không coi ID khó đoán là biện pháp bảo mật.

### A8. 🟡 GET dùng cho thao tác ghi
- **Fonda:** nhiều thao tác thay đổi trạng thái dùng GET: `country/deleteById`, `rtuServerInfo/deleteById`, `user/resetPassword/{id}`, `oilChargeRecord/setOilChargeStatus`, `delayOrder/cancel`, `vehicleUse/revokeVehicleUse`, `material*/cancel*`, và cả lệnh thiết bị như `dtuControl/setRS485`, `gatewayControl/setServer`, `smartBoxControl/setServer`, `lcuRouteControl/delLcuRoute`. — **Chắc chắn** (04b/04c).
- **Rủi ro:** bị kích hoạt qua link/ảnh (CSRF), prefetch của trình duyệt, crawler, cache/proxy; log server lưu tham số.
- **Đề xuất:** GET chỉ để đọc, không có tác dụng phụ. Ghi dùng POST/PUT/PATCH/DELETE, kèm chống CSRF nếu dùng cookie.

### A9. 🟡 Đổi địa chỉ server của thiết bị qua API (kể cả app quét mã lắp đặt)
- **Fonda:** `scanCode/productionIpSet`, cùng nhiều `set…Server`/`setServerConfig` cho RTU/DTU/gateway/SmartBox. — **Chắc chắn** về endpoint; luồng dùng thực tế: **Suy luận**.
- **Rủi ro:** đổi địa chỉ server của thiết bị = chiếm quyền thiết bị (thiết bị kết nối sang server lạ).
- **Đề xuất:** thao tác đổi server/IP thiết bị là quyền đặc biệt, cần xác nhận, ghi audit, và thiết bị nên xác thực server bằng chứng chỉ.

---

## B. Thiết kế API

### B1. 🟡 Không theo REST, POST cho gần hết
- **Fonda:** 1.880/2.320 endpoint là POST, kể cả đọc danh sách/chi tiết; URL dạng động từ `/v1.0/{controller}/{verbMethod}`. — **Chắc chắn**.
- **Hệ quả:** không cache được, khó áp quyền theo method, khó sinh tài liệu/SDK, khó audit "ai đọc gì/ai ghi gì".
- **Đề xuất:** REST theo tài nguyên (`GET /projects/{id}/devices`, `POST /devices`, `PATCH /devices/{id}`); lệnh thiết bị là tài nguyên riêng (`POST /devices/{id}/commands` trả về `commandId`, theo dõi trạng thái). Đặc tả OpenAPI là nguồn sự thật.

### B2. 🟡 Phiên bản chồng chéo, không dọn
- **Fonda:** `setTask` / `setTask_v2`, `queryTaskByDeviceId` / `_v2` / `queryLcuTaskByDeviceId_v3`, `save` / `saveNew`, `delete` / `deleteNew`, `update` / `updateNew`, `upgrade` / `upgrade_v2`. — **Chắc chắn**.
- **Hệ quả:** không rõ bản nào còn dùng, logic trùng, sửa lỗi một bản quên bản kia.
- **Đề xuất:** version ở cấp API (`/v1`, `/v2`) có chính sách deprecate; không thêm hậu tố vào tên method.

### B3. ⚪ Lỗi chính tả nằm trong API công khai
- **Fonda:** `massage` (message), `informatrion`, `svaePlatformToCabinet`, `svaeBxLoudspeaker`, `queryLcuDeatilById`, `deviceExpor`/`rtuExpor`/`lcuExpor`, `palyTask`, `setGruop`, `quertByCamera`, `querCabinetData`, `celarDomain`, `pageSuppleyElecttricityParentDevices`, `getLcuRealtionSmartBoxOrRtu`. — **Chắc chắn**.
- **Ý nghĩa:** không có review API/naming convention; khi đã công khai thì không sửa được nữa.
- **Đề xuất:** lint tên trong OpenAPI, review API trước khi merge.

### B4. ⚪ Mã trạng thái không thống nhất
- **Fonda:** envelope `{type, code, message, data}`, thành công có lúc `code=200`, lúc `code=20000`; HTTP status thường 200 cả khi lỗi nghiệp vụ. — **Chắc chắn** (doc 11).
- **Đề xuất:** dùng HTTP status đúng nghĩa; body lỗi theo chuẩn (RFC 9457 `application/problem+json`) với mã lỗi nghiệp vụ ổn định.

### B5. ⚪ Enum bằng số "ma thuật", key dictionary hardcode ở frontend
- **Fonda:** enum lưu dạng số, nhãn lấy từ `dictionary/queryDictionaryByKey/{n}` với các key số cố định (`3`, `13`, `15`… `52`) viết thẳng trong frontend. — **Chắc chắn** (doc 05).
- **Đề xuất:** enum có tên (`"ON"`, `"OFF"`, `"DIM"`) trong API; dictionary dùng key dạng chữ; nhãn đa ngôn ngữ tách khỏi giá trị.

---

## C. Kiến trúc & vận hành

### C1. 🟡 Monolith phẳng 267 controller, lớp lệnh thiết bị trộn với CRUD
- **Fonda:** lệnh xuống thiết bị (`*Ctrl`) và quản trị dữ liệu nằm chung một API. — **Chắc chắn** về bề mặt; triển khai nội bộ (một hay nhiều service): **Suy luận** — một khối lớn.
- **Rủi ro:** lỗi ở module báo cáo có thể ảnh hưởng đường gửi lệnh; khó scale riêng phần realtime; khó áp chính sách bảo mật riêng cho lệnh.
- **Đề xuất:** tách tối thiểu 3 phần: (1) API quản trị/CRUD, (2) Command service (hàng đợi lệnh, retry, timeout, idempotency, audit), (3) Ingest/telemetry (nhận dữ liệu thiết bị, đẩy realtime). Giao tiếp qua message broker.

### C2. 🟡 Tuỳ biến từng khách nằm trong lõi
- **Fonda:** `westLakeBuilding`, `dayun`, `overseas`, `fems`, nhiều tích hợp hãng (`tangYuanChargingCtrl`, `weeYuChargingCtrl`, `zhpvCtrl`) là controller cố định trong cùng codebase. — **Chắc chắn**.
- **Đề xuất:** lõi chung + adapter/plugin cho hãng thiết bị và tích hợp; tuỳ biến khách hàng bằng cấu hình/feature flag.

### C3. 🟡 Tác vụ nặng chạy đồng bộ
- **Fonda:** `energyExport` đặt `timeout = 0` (chờ vô hạn) ở frontend. — **Chắc chắn**. Có cơ chế bất đồng bộ cho import (`getImportStatus`) và `reportFormsExportTask`, nhưng không áp dụng nhất quán.
- **Đề xuất:** mọi export/import/báo cáo lớn là job nền: tạo job → trả `jobId` → theo dõi tiến độ → tải file qua link có hạn.

### C4. ⚪ Lệnh hàng loạt thiếu mô hình trạng thái rõ ràng
- **Fonda:** batch qua `lcuGroupBatchOperation`, `deviceProjectBatchOperationQuick`…, tiến độ qua WS, danh sách lỗi qua `getBatchOpeFailedDevice`. — **Chắc chắn** về endpoint; độ tin cậy giao nhận: **Chưa biết**.
- **Đề xuất:** mỗi lệnh có vòng đời `queued → sent → acked → done/failed/timeout`, lưu DB, retry có giới hạn, khoá idempotency để không gửi trùng.

---

## D. Checklist cho hệ thống mới

| # | Hạng mục | Bắt buộc trước khi đưa vào chạy thật |
|---|---|---|
| 1 | HTTPS + `wss://`, HSTS, không cổng HTTP mở dữ liệu | ✅ |
| 2 | Cách ly multi-tenant ở REST **và** WebSocket, có test tự động | ✅ |
| 3 | Kiểm tra quyền ở server cho mọi endpoint, mặc định từ chối | ✅ |
| 4 | Không trả secret trong API đọc; secret lưu mã hoá | ✅ |
| 5 | Quyền điều khiển tách quyền xem; lệnh phạm vi rộng cần xác nhận | ✅ |
| 6 | Audit log bất biến cho lệnh thiết bị & đổi cấu hình | ✅ |
| 7 | GET không có tác dụng phụ | ✅ |
| 8 | Rate-limit login, băm mật khẩu Argon2id/bcrypt, khoá tạm | ✅ |
| 9 | Đổi server/IP thiết bị là quyền đặc biệt, thiết bị xác thực server | ✅ |
| 10 | OpenAPI làm chuẩn, lint tên, version API có deprecate | Nên có |
| 11 | Command service tách riêng, vòng đời lệnh rõ ràng | Nên có |
| 12 | Job nền cho export/import/báo cáo | Nên có |
| 13 | Enum có tên, HTTP status đúng, lỗi theo RFC 9457 | Nên có |

## E. Còn thiếu & cách lấp
- **A6/A7 (phân quyền endpoint, `projectId` header):** cần một tài khoản quyền thấp và/hoặc tài khoản ở dự án khác để thử bằng API đọc. Chưa làm.
- **A3 (replay gói login):** cần kiểm tra khoá RSA có cố định và có nonce/timestamp không. Chưa làm.
- **A5 (chặn quyền điều khiển):** không thử theo quy tắc chỉ đọc; chỉ làm khi có đồng ý rõ ràng và trên thiết bị thử.
- **Hiệu năng, DB, hạ tầng, backup:** không quan sát được từ client → **Chưa biết**.
