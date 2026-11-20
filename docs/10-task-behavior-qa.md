# SLCP — Hành vi điều khiển đèn & Task: bộ kịch bản QA
 
Ghi lại các hành vi đã quan sát khi test hệ thống thật (27–30/10/2026) dưới dạng **test case tái hiện được**, để:
- chạy lại nhiều lần, loại trừ kết quả ngẫu nhiên (flaky);
- giữ kịch bản tái hiện cho từng hành vi đã phát hiện;
- sau này dùng làm bộ test chấp nhận (acceptance) cho hệ thống mới.
> Nguồn: ghi chú test thủ công của người dùng trên Google Doc (27–30/10, phần bị gạch bỏ trong Doc đã loại trừ), đối chiếu với `04-api-catalog.md`, `03-entities.md`, `05-dictionaries.md`, `07-project-config.md`, `08-auth-and-reuse.md`.
> Kết quả hiện có chỉ là **quan sát trên frontend + đèn thực tế**, chưa có bắt payload/WebSocket. Mỗi test case ghi rõ mức tin cậy.
 
## 0. Quy ước
 
### Mức tin cậy kết quả
 
| Ký hiệu | Nghĩa |
|---|---|
| ✅ Lặp lại | Đã quan sát ≥2 lần cùng kết quả |
| 🟡 Một lần | Quan sát 1 lần, cần chạy lại |
| 🔶 Giả thuyết | Giải thích/nguyên nhân là suy luận, chưa có test xác nhận |
| ❓ Chưa test | Kịch bản mới đề xuất |
 
### Phân loại thao tác (theo quy tắc dự án)
 
| Mức | Nghĩa | Cần đồng ý? |
|---|---|---|
| R0 | Chỉ đọc DB server (API list/query, mở màn hình) | Không |
| R1 | Hỏi thiết bị (status/data query, query task) — gửi gói tin, không đổi trạng thái đèn | Có, mỗi phiên |
| W1 | Điều khiển đèn trực tiếp (bật/tắt/dim) | Có, mỗi lần |
| W2 | Lưu/sửa/distribute task, đổi cấu hình | Có, mỗi lần |
| HW | Thao tác phần cứng (rút gateway, rút LCU) | Người dùng tự làm |
 
### Môi trường chuẩn (điền mỗi lần chạy, không ghi UID/ID thật)
 
| Mục | Giá trị |
|---|---|
| Dự án | (tên dự án) |
| LCU | `LCU-A` (đèn HTest), `LCU-B` (SLM / DEN 5) — ghi model, `protocolValue`, phiên bản firmware nếu xem được |
| Đường kết nối | LCU → Gateway (không qua Concentrator) |
| `project.lightCtrlMode` / `taskMode` | (đọc nếu có quyền) |
| Giờ máy chủ / giờ gateway | Ghi lệch giờ trước khi test (gateway có nút query/calib time) |
 
### Mẫu ghi kết quả mỗi lần chạy
 
```
TC-ID | Ngày giờ | Người chạy | LCU | Kết quả (Pass/Fail/Khác) | Quan sát | Ảnh/log
```
 
Bảng lịch sử chạy nằm ở **mục 9**.
 
---
 
## 1. Điều khiển trực tiếp & đồng bộ trạng thái (GIS)
 
### TC-GIS-01 — Kéo dim: UI hiển thị ngay, không phản ánh thực tế
- **Mức:** W1 · **Tin cậy:** ✅ Lặp lại
- **Tiền điều kiện:** đèn online, đang bật.
- **Bước:**
  1. Trên GIS, kéo dim từ mức hiện tại sang mức X.
  2. Ghi giá trị dim UI hiển thị ngay sau khi kéo.
  3. Quan sát đèn thực tế.
  4. Không bấm gì, chờ 1, 3, 5 phút, ghi giá trị UI.
  5. Bấm **Status query**, ghi giá trị UI.
- **Kỳ vọng hiện tại (Fonda):** bước 2 UI = X ngay; bước 4 không tự cập nhật; bước 5 mới phản ánh giá trị thiết bị trả về.
- **API liên quan:** `lampControl/unicast/dimming` (trả "accepted"), xác nhận qua WS `unicastStatus` (doc 08).
- **Giả thuyết 🔶:** UI cập nhật lạc quan theo HTTP, không chờ WS.
### TC-GIS-02 — Task tắt đèn không đưa dim UI về 0
- **Mức:** W2 · **Tin cậy:** ✅
- **Bước:** tạo LCU task OFF tại T; distribute; chờ qua T; quan sát đèn và UI (không bấm query); sau đó bấm Status query.
- **Kỳ vọng hiện tại:** đèn tắt đúng T; UI vẫn giữ mức dim cũ đến khi query.
- **Cần kiểm thêm (R0):** `config/getLcuTaskStatusConfig` — có cấu hình báo trạng thái sau khi task chạy không.
### TC-GIS-03 — Status query khác Data query
- **Mức:** R1 · **Tin cậy:** ✅
- **Bước:** bấm Status query → ghi trường trả về; bấm Data query → ghi trường trả về.
- **Kỳ vọng:** Status query = trạng thái bật/tắt + dim; Data query = dữ liệu cảm biến LCU (dòng, áp, tilt…).
- **API:** `lampControl/unicast/queryStatus` vs `unicast/queryData`; WS có hai sự kiện `status` và `data` (✅ có trong bundle).
### TC-GIS-04 — Tilt chỉ có dữ liệu khi Data query
- **Mức:** R1 · **Tin cậy:** ✅ (ngày 28/10 đính chính: tilt có tín hiệu)
- **Bước:** nghiêng/đổi hướng thiết bị (nếu có thể); không query, chờ 10 phút, xem UI; bấm Data query, xem lại.
- **Kỳ vọng hiện tại:** không tự cập nhật; Data query mới có giá trị.
- **Giả thuyết 🔶:** auto-report có thể cấu hình qua `tiltSensorCtrl/tiltRepSet`; `project.reportMinute` = `null` trên dự án mẫu.
### TC-GIS-05 — Lệnh dim không query lại, log "copy last"
- **Mức:** W1 + R0 · **Tin cậy:** ✅ (có ảnh ngày 29/10: data query 14:13 → set dim 14:14 → query 14:15)
- **Bước:**
  1. Data query, ghi giờ T1.
  2. Đổi dim, ghi giờ T2.
  3. Data query, ghi giờ T3.
  4. Mở log qua nút **Energy** (góc trên phải, nút giữa).
- **Kỳ vọng hiện tại:** bản ghi tại T2 mang số liệu giống T1 (copy giá trị cũ) thay vì đo mới.
- **Biến thể TC-GIS-05b:** thay bước 2 bằng bật/tắt → kỳ vọng có data query đi kèm nhưng **không** kèm status query (dim).
- **Cần kiểm (R0, hook XHR):** nút Energy gọi endpoint nào (`lcuActor/queryLcuDataRecords` / `queryLcuDataHisPage` / `energy/getLcuDataDetails`?); sau bật/tắt frontend có gọi tiếp `unicast/queryData` không.
### TC-GIS-06 — Thứ tự hiển thị lịch sử (UX)
- **Mức:** R0 · **Tin cậy:** ✅
- **Bước:** mở chi tiết lịch sử qua nút 3 chấm.
- **Kỳ vọng hiện tại:** bản ghi mới nằm dưới (thứ tự tăng dần) — ngược thói quen đọc.
---
 
## 2. Task template & Task config
 
### TC-TPL-01 — Template là bản copy, không phải tham chiếu
- **Mức:** W2 · **Tin cậy:** 🟡
- **Bước:** tạo template T (dim 50); import T vào task config của group G; sửa T thành dim 80; mở lại config G.
- **Kỳ vọng hiện tại:** config G vẫn dim 50.
- **Kiểm bằng API (R0):** so `taskId` trong `task/getTaskByGroup` (group G) với `taskId` của T trong `task/page`. Khác nhau → copy.
### TC-TPL-02 — Thêm strategy = thay toàn bộ list
- **Mức:** W2 · **Tin cậy:** 🟡
- **Bước:** group G có list L1 (2 task); thêm strategy S (3 task); xem list của G.
- **Kỳ vọng hiện tại:** list của G = 3 task của S, L1 bị xóa.
- **API:** `deviceGroup/saveGroupTask`, `deleteGroupTask`, `deleteLcuGroupTask`. Cần bắt payload `saveGroupTask` để xác nhận gửi cả danh sách.
### TC-TPL-03 — Offset sunrise/sunset trong popup chỉ nhận khi bấm OK
- **Mức:** W2 · **Tin cậy:** 🟡
- **Bước:** mở popup Offset settings; nhập offset; đóng bằng cách khác OK (click ra ngoài/Cancel); mở lại; lặp lại và bấm OK.
- **Kỳ vọng hiện tại:** chỉ lần bấm OK được lưu.
- **Cần làm rõ:** popup ghi tầng nào — project (`onDeLay`, `offDeLay`, `sunriseAndSunset/updateSunriseSunsetOffsetTime`) hay task (`sunriseFrontOffset`, `sunsetBackOffset`…).
### TC-TPL-04 — Import/Export Excel list task
- **Mức:** W2 · **Tin cậy:** ✅ (export) / 🟡 (import)
- **Bước:** export list task của G; sửa 1 dòng trong file; import lại; xem list G; gọi `lcuTaskImport/getImportStatus` ngay sau import và sau 1 phút.
- **Kỳ vọng hiện tại:** export có file; import không thay đổi gì.
- **Giả thuyết 🔶:** import chạy bất đồng bộ (`isImportRun`), có thể lỗi im lặng.
---
 
### Ghi chú API: tạo/xoá Task template (bổ sung từ `SmartLightingPlatform_TLTK/03`, đã chạy thử 2026-11-19)

- **Chắc chắn (đã test tạo rồi xoá):** `POST /v1.0/task/save` trả `data = taskId` mới; `POST /v1.0/task/delete` body `{projectId, taskId, taskType}` trả `data: null`.
- Body `task/save` đã dùng (Dim 55 % lúc 12:00):
  ```json
  { "projectId": "<projectId>", "taskType": 2, "taskName": "<tên>", "executeModel": 1, "executeType": 1,
    "operation": 5, "dimValue": 55, "executeHour": 12, "executeMinute": 0,
    "loopType": 1, "loopTime": "127", "lux": 1,
    "sunExecuteWay": 0, "sunExecuteOffset": 0, "sunDimValue": 0 }
  ```
- **Suy luận (cần kiểm):**
  - `loopTime` là mặt nạ bit 7 ngày (`127` = 1+2+…+64 = cả tuần). Chưa biết bit 1 là Thứ 2 hay Chủ nhật → tạo task chỉ chọn 1 ngày rồi đọc lại `task/page`.
  - `taskType: 2` = LCU Self-Running Task; `operation: 5` = Dimming. Kiểm bằng từ điển `dictionary/queryDictionaryByKey/10` (Task Type) và `/5` (Operation Type) — doc 05.
  - `executeType: 1` = chạy theo giờ cố định (khác sunrise/sunset); `sunExecuteWay/Offset` dùng khi chạy theo mặt trời.

## 3. Distribute & trạng thái group
 
### TC-DIS-01 — Không distribute thì task không chạy
- **Mức:** W2 · **Tin cậy:** ✅ (xác nhận lại 29/10)
- **Bước:** lưu task config cho G (ON dim 50 tại T) nhưng không distribute; chờ qua T.
- **Kỳ vọng hiện tại:** đèn không đổi.
### TC-DIS-02 — Distribute chỉ cần chọn group
- **Mức:** W2 · **Tin cậy:** ✅
- **Bước:** chọn đúng group, bấm Distribute (không chọn đèn/task con). Kiểm Task Distribution.
- **Kỳ vọng:** toàn bộ task của group được ghi xuống toàn bộ thiết bị trong group.
- **Cần bắt payload:** nút gọi `deviceGroup/taskPublish`, `task/taskGroupSyncToDeviceGroup` hay `lcuTaskCtrl/groupBatchOperationTask`.
### TC-DIS-03 — Sửa group mất trạng thái "đã distribute", không khôi phục được
- **Mức:** W2 · **Tin cậy:** ✅
- **Bước:** distribute G (trạng thái dưới tên group = distributed); sửa 1 task, lưu, không distribute; xem trạng thái; thử hoàn tác về bản cũ.
- **Kỳ vọng hiện tại:** trạng thái chuyển undistributed; không có cách xem/khôi phục bản đang chạy trên LCU.
- **API:** `deviceGroup/deviceGroupPage` chỉ có một bộ cờ (`publishTaskStatus`, `publishTaskTime`, `taskStatus`, `groupIdStatus`).
- **Cần kiểm (R0):** `task/queryTaskGroupSyncHisPage` — có lưu lịch sử bản đã đẩy không.
### TC-DIS-04 — Xem task đang nạp trên đèn
- **Mức:** R1 · **Tin cậy:** ✅ (thao tác dùng được)
- **Bước:** Task Distribution → tìm đèn → Action → Local Task → Task Query.
- **Ghi chú:** cần xác định nút này đọc **DB server** (`task/queryLcuTaskByDeviceId_v3`…) hay **hỏi LCU** (`lcuTaskCtrl/queryTask`, `queryTimeTask`). Đây là công cụ kiểm chứng chính cho mọi TC ở mục 4–5.
---
 
## 4. Thời điểm thực thi khi distribute list (LCU task)
 
### TC-EXE-01 — Distribute list → chạy ngay task "cuối cùng theo giờ"
- **Mức:** W2 · **Tin cậy:** ✅ (≥2 lần, 29/10)
- **Tiền điều kiện:** đèn tắt.
- **Bước:** lúc T0 tạo list 2 task, cả hai **sau** T0 trong ngày: A tại T0+5' dim 36; B tại T0+10' dim 72; distribute; quan sát đến T0+15'.
- **Kỳ vọng hiện tại:** ngay khi distribute đèn lên dim 72 (có thông báo "dimming failed"); T0+5' → 36; T0+10' → 72.
- **Giả thuyết 🔶 (catch-up theo chu kỳ ngày):** LCU áp ngay trạng thái hiệu lực hiện tại = lệnh gần nhất đã qua trong chu kỳ 24h, tức B của hôm qua.
### TC-EXE-02 — Kiểm giả thuyết catch-up: cả hai task đã qua giờ hôm nay ❓
- **Mức:** W2 · **Tin cậy:** ❓ Chưa test
- **Bước:** lúc T0 tạo A tại T0−60' dim 30, B tại T0−30' dim 60; distribute.
- **Kết quả phân biệt:**
  - dim 60 ngay → ủng hộ catch-up;
  - dim 30 → LCU chạy task cuối **theo thứ tự list**, không theo giờ (đổi thứ tự list rồi chạy lại);
  - không đổi → catch-up chỉ áp khi có task tương lai.
### TC-EXE-03 — Kiểm "cuối theo giờ" hay "cuối theo thứ tự list" ❓
- **Mức:** W2 · **Tin cậy:** ❓
- **Bước:** như TC-EXE-01 nhưng nhập B (giờ muộn) **trước** A trong list.
- **Kỳ vọng nếu catch-up đúng:** vẫn chạy ngay dim của task giờ muộn nhất.
### TC-EXE-04 — Nguồn gốc thông báo "dimming failed" ❓
- **Mức:** W2 + hook WS (R0) · **Tin cậy:** ❓
- **Bước:** lặp TC-EXE-01, đồng thời ghi sự kiện WS `lcuBatchOperation-progressBar` / `lcuBatchOperationStatus` (chỉ ghi `cmd`/`ctrl`/tên trường).
---
 
## 5. Mất kết nối & khôi phục
 
### TC-NET-01 — Rút gateway giữa chừng task đang chạy
- **Mức:** W2 + HW · **Tin cậy:** 🟡
- **Bước:** distribute LCU task: ON tại T, OFF tại T+5'; sau T rút gateway; chờ qua T+5'.
- **Kỳ vọng hiện tại:** đèn không mất, không query được; T+5' đèn vẫn tắt đúng → lịch chạy cục bộ trên LCU.
### TC-NET-02 — Distribute xong rồi mới rút gateway
- **Mức:** W2 + HW · **Tin cậy:** 🟡
- **Bước:** distribute list (các task trong tương lai); rút gateway; chờ qua giờ các task.
- **Kỳ vọng hiện tại:** các lệnh vẫn chạy đúng giờ.
### TC-NET-03 — Rút gateway TRƯỚC khi distribute
- **Mức:** W2 + HW · **Tin cậy:** 🟡
- **Bước:**
  1. Rút gateway.
  2. Tạo list mới, distribute → ghi thông báo UI và cột kết quả ở Task Distribution.
  3. Chờ qua giờ task → quan sát đèn.
  4. Cắm lại gateway sau giờ task → query gateway, query đèn (chờ vài phút).
  5. Ngắt/cắm lại LCU → quan sát.
- **Kỳ vọng hiện tại:** (2) UI báo xong; (2) không có hiện tượng chạy ngay như TC-EXE-01; (3) không lệnh nào chạy; (4) không lệnh nào chạy bù, query gateway được, đèn query được sau một lúc; (5) LCU chạy lại lệnh cũ (của list trước), không phải list mới.
- **Cần kiểm (R0):** `deviceControl/getBatchOpeFailedDevice` sau bước 2; so Task Query với list mới.
- **Giả thuyết 🔶:** "báo xong" là phản hồi tầng HTTP; không có cơ chế đẩy lại khi thiết bị online (không thấy endpoint retry).
### TC-NET-04 — Rút gateway rồi cắm lại ngay, sau đó distribute
- **Mức:** W2 + HW · **Tin cậy:** 🟡
- **Bước:** rút gateway; tạo list, distribute; cắm lại gateway ngay (query gateway OK); chờ qua giờ task.
- **Kỳ vọng hiện tại:** không lệnh nào chạy; vẫn query/điều khiển ON/OFF trực tiếp được; ngắt/cắm LCU → chạy lệnh cũ.
### TC-PWR-01 — Cắm điện lại LCU: luôn 100% trước
- **Mức:** HW · **Tin cậy:** ✅
- **Bước:** đèn đang dim X theo task; rút nguồn LCU 30 giây; cắm lại; quan sát 0–60 giây.
- **Kỳ vọng hiện tại:** lên 100%, sau đó về mức của **lệnh lịch hiệu lực gần nhất** (không phải mức chỉnh tay).
- **Biến thể TC-PWR-01b:** trước khi rút, chỉnh tay dim Y ≠ X → sau khi cắm lại kỳ vọng về X, không về Y.
- **Cần làm rõ:** 100% do driver hay LCU quyết định (cần tài liệu phần cứng).
### TC-PWR-02 — Mất điện, cắm lại TRƯỚC giờ lệnh tiếp theo
- **Mức:** W2 + HW · **Tin cậy:** 🟡
- **Bước:** list 3 lệnh L1, L2, L3; chờ chạy xong L2; tắt đèn, rút LCU; cắm lại **trước** giờ L3.
- **Kỳ vọng hiện tại:** 100% → về L2; đến giờ L3 vẫn chạy L3.
### TC-PWR-03 — Mất điện, cắm lại SAU giờ lệnh tiếp theo
- **Mức:** W2 + HW · **Tin cậy:** 🟡
- **Bước:** như TC-PWR-02 nhưng cắm lại **sau** giờ L3.
- **Kỳ vọng hiện tại:** 100% → về L3.
- **Nhận xét 🔶:** TC-PWR-01/02/03 nhất quán với giả thuyết catch-up của TC-EXE-01.
---
 
## 6. Sunrise / sunset & loại task
 
### TC-SUN-01 — Task thuần sunrise/sunset trên LCU-B (SLM / DEN 5)
- **Mức:** W2 · **Tin cậy:** 🟡 (29–30/10)
- **Bước:** tạo task chỉ theo sunrise/sunset; distribute lên LCU-B; Task Query; chờ qua giờ mặt trời.
- **Kỳ vọng hiện tại:** không vào đèn, Task Query không thấy gì, không chạy. Task dimming theo giờ cố định vẫn query thấy.
### TC-SUN-02 — Cùng task trên LCU-A (HTest)
- **Mức:** W2 · **Tin cậy:** 🟡
- **Bước:** như TC-SUN-01 trên LCU-A.
- **Kỳ vọng hiện tại:** distribute được. (Chưa ghi đèn có chạy đúng giờ mặt trời không — cần chạy lại và quan sát.)
### TC-SUN-03 — Tìm nguyên nhân khác biệt LCU-A / LCU-B ❓
- **Mức:** R0 rồi R1 · **Tin cậy:** ❓
- **Bước R0:** so model, `protocolValue`, `deviceConfig.hasTaskNum` / `taskNum` / `lcuType` của hai LCU; gọi `lcuActor/getLcuSunCheckResults`, `getLcuSunRiseAndSetPage`; đọc `project.lightCtrlMode`, `getLcuAutoCtrlByProjectId`, `queryProjectSunriseSunsetSource`.
- **Bước R1:** `lcuTaskCtrl/queryLatLngTask`, `luxCtrl/queryLatLngEnable`, `luxCtrl/queryLcuLatLng` trên cả hai LCU.
- **Giả thuyết 🔶:** LCU-B chưa được nạp tọa độ / chưa bật LatLng, hoặc model không hỗ trợ LatLng task; hoặc dự án đang để server điều khiển theo giờ mặt trời (LCU auto control) thay vì LCU tự tính.
### TC-TYP-01 — Terminal task (dimming) giao cho LCU không có tác dụng
- **Mức:** W2 · **Tin cậy:** ✅
- **Bước:** tạo terminal task dim X tại T, gán cho LCU (UI vẫn cho chọn); distribute; chờ qua T. Sau đó Data query, Status query.
- **Kỳ vọng hiện tại:** dimming không chạy; data/status query hoạt động.
- **Giả thuyết 🔶:** terminal task nạp vào Concentrator; LCU đi qua gateway, không nằm dưới Concentrator nên không có ai thực thi → có thể là đúng thiết kế, UI chỉ thiếu chặn.
- **Cần kiểm (R0):** topology LCU (`lcuActor/getLcuRealtionSmartBoxOrRtu`, `queryLcuListByGatewayId`, `queryLcuOfRtuPage`).
### TC-TYP-02 — LCU task chỉ hỗ trợ ON/OFF/Dim, không theo ngày tháng ❓
- **Mức:** W2 · **Tin cậy:** 🟡 (ghi chú 27/10, chưa có test riêng)
- **Bước:** tạo LCU task có ngày bắt đầu/kết thúc hoặc lặp theo tuần; xem UI có cho chọn không; distribute; Task Query.
- **Field liên quan:** `loopType`, `loopCycle`, `loopTime`, `executeStartTime`, `executeEndTime`; `project.weekTaskEnabled`.
---
 
## 7. Alarm & Work Order
 
### TC-ALM-01 — Xử lý alarm: False / Clear
- **Mức:** W2 · **Tin cậy:** 🟡 (đã xem UI, chưa chạy luồng đầy đủ)
- **Bước:** chọn alarm realtime; xử lý False → kiểm alarm chuyển sang lịch sử, trạng thái `deal`/`followUpStatus`; lặp với Clear.
- **API:** `config/alarmHandle`, `clearAlarm`, `updateAlarmFollowUpStatus`; dictionary 149.
### TC-ALM-02 — Tạo Work Order từ alarm ❓
- **Mức:** W2 · **Tin cậy:** ❓
- **Bước:** từ alarm tạo work order, giao người, đặt lịch; kiểm ở Workorder management; khi alarm hết, kiểm phiếu có tự đóng (`project.automaticEnd`).
### TC-ALM-03 — Cài đặt sự kiện sinh alarm ❓
- **Mức:** W2 · **Tin cậy:** ❓
- **Bước:** cấu hình quy tắc offline/node lost cho LCU test; rút LCU; đo thời gian đến khi có alarm; cắm lại, kiểm alarm tự reset.
- **API:** `config/saveOfflineAlarmConfig`, `saveLcuNodeLostConfig`, `abnormalToAlarmPloy/*`.
---
 
## 8. Ma trận tóm tắt hành vi
 
| ID | Hành vi | Tin cậy | Phân loại 🔶 |
|---|---|---|---|
| TC-GIS-01 | Dim UI lạc quan, không đồng bộ thực tế | ✅ | Thiếu sót UI |
| TC-GIS-02 | Task chạy không cập nhật UI | ✅ | Có thể do cấu hình báo trạng thái |
| TC-GIS-04 | Tilt không tự báo | ✅ | Có thể do cấu hình |
| TC-GIS-05 | Lệnh dim → log copy last | ✅ | Lỗi dữ liệu |
| TC-TPL-04 | Import Excel không tác dụng | 🟡 | Lỗi / async lỗi im lặng |
| TC-DIS-03 | Mất bản đã distribute khi sửa | ✅ | Thiếu versioning |
| TC-EXE-01 | Chạy ngay task giờ muộn nhất khi distribute | ✅ | Có thể đúng thiết kế (catch-up) |
| TC-NET-03 | Distribute khi mất kết nối báo xong nhưng không vào | 🟡 | Thiếu ACK/retry |
| TC-PWR-01 | Cắm lại 100% rồi về lệnh hiệu lực | ✅ | Hành vi phần cứng + catch-up |
| TC-SUN-01 | Sunrise/sunset không vào LCU-B | 🟡 | Chưa rõ: cấu hình/model |
| TC-TYP-01 | Terminal task không chạy trên LCU | ✅ | Có thể đúng thiết kế, UI thiếu chặn |
 
### Gợi ý cho hệ thống mới (tóm tắt, chi tiết để doc thiết kế)
- **Fonda:** HTTP trả "accepted", UI coi như xong; không retry; không version task đã đẩy.
- **Đề xuất:** trạng thái lệnh `queued → sent → acked/failed`; hàng đợi đẩy lại khi thiết bị online; lưu snapshot "desired" (server) và "reported" (đọc từ thiết bị) cho mỗi LCU và hiển thị chênh lệch; chặn gán loại task không tương thích với topology; viết lại các TC trên thành test tự động cho hệ thống mới.
---
 
## 9. Lịch sử chạy
 
| TC-ID | Ngày | LCU | Kết quả | Ghi chú |
|---|---|---|---|---|
| TC-GIS-01 | 27/10 | A | Như kỳ vọng hiện tại | |
| TC-TPL-01 | 27/10 | — | Như kỳ vọng | |
| TC-TPL-04 | 27/10 | — | Export OK, import không tác dụng | |
| TC-DIS-03 | 28/10 | — | Như kỳ vọng | |
| TC-GIS-04 | 28/10 | A | Có tilt khi Data query | Đính chính ghi chú 27/10 |
| TC-GIS-05 | 28–29/10 | A | Copy last | Ảnh 14:13 / 14:14 / 14:15 ngày 29/10 |
| TC-TYP-01 | 28–29/10 | A | Không chạy dimming | |
| TC-NET-01 | 29/10 | A | Đèn tắt đúng sau 5' | |
| TC-EXE-01 | 29/10 | A | Chạy ngay task giờ muộn nhất, có "dimming failed" | 2 lần (dim 43/72/36 và 45/63/74) |
| TC-NET-03 | 29/10 | A | Như kỳ vọng | |
| TC-NET-04 | 29/10 | A | Như kỳ vọng | |
| TC-PWR-02 | 29/10 | A | 100% → lệnh 2 | |
| TC-PWR-03 | 29/10 | A | 100% → lệnh 3 | |
| TC-NET-02 | 29/10 | A | Lệnh vẫn chạy | |
| TC-SUN-01 | 29–30/10 | B | Không vào đèn | |
 
*Cột LCU suy theo ghi chú (đèn HTest = A); cần người chạy xác nhận lại.*
 
*Tạo: 2026-10-30.*