ã qua giờ hôm nay ❓
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