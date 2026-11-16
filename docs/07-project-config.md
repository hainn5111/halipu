# SLCP — Cấu hình Dự án (bảng `project`)

Bảng `project` là **trung tâm cấu hình vận hành** của mỗi dự án. Mọi thiết bị, tác vụ, cảnh báo, báo cáo đều gắn `projectId`, và nhiều hành vi (cách điều khiển đèn, cách hiển thị tác vụ, xác thực khi điều khiển, gửi SMS, lưu trữ log…) đổi theo các cờ trong bảng này.

## Nguồn & độ tin cậy

- **Danh sách field + kiểu**: JSON thật từ `GET /api/v1.0/area/queryProjectByProjectId/{projectId}` (tài khoản HTest). → **Chắc chắn**.
- **Nhãn & giá trị option**: đọc từ code frontend (template form + module hằng số + bộ dịch i18n tiếng Anh của app). → **Chắc chắn** về nhãn/option, **Suy luận** về ý nghĩa nghiệp vụ.
- Tài khoản HTest **không có quyền** mở trang Quản lý dự án (`#/projectManagement/index` → 401), nên chưa thấy giá trị thực của dự án qua giao diện cấu hình. Không thử vượt quyền.

Ký hiệu độ tin cậy: ✅ Chắc chắn · 🔶 Suy luận · ❓ Chưa biết

## Giao diện quản lý dự án (theo code)

Trang `#/projectManagement/index` liệt kê dự án dạng **cây** (có dự án cha/con — `parentId`, API `project/queryTree`). Mỗi dòng có các nút, mỗi nút mở một hộp thoại cấu hình riêng và gọi API lưu riêng:

| Nút (nhãn gốc) | Hàm frontend | Nhóm field | API lưu |
|---|---|---|---|
| Edit | `handleUpdate` | Thông tin chung, vị trí, múi giờ, chế độ điều khiển đèn | `PUT /v1.0/project/update` (tạo mới: `POST project/save`) |
| View Account | `chooseUserTable` | Gán user vào dự án | `project/saveProjectUserMap`, `updateUserOfProject` |
| Select Device Type | `chooseDeviceTable` | Loại thiết bị dự án được dùng | `project/saveProjectDeviceType` |
| Alarm Name Configuration | `handleAlarmNameConfig` | Đặt tên loại cảnh báo theo dự án | (controller alarm) |
| Lighting rate configuration | `handleLightingRateConfig` | Ngưỡng online rate | `project/updateLightOnRate` |
| The source of sunrise and sunset tables | `handleSourceSunsetAndSunrise` | Nguồn bảng giờ mặt trời mọc/lặn, lệch giờ | `project/saveOrUpdateSunSource` |
| Control settings | `handleControllSetting` | Xác thực khi điều khiển, người nhận thông báo | `project/controlSetUpdate` |
| Statistical repair | `handleRecount` | Tính lại thống kê | — |
| Export / Import project data | `handleProjectDataExport/Import` | Sao lưu/di chuyển dữ liệu dự án | `projectImportExport/*` |

Các hộp thoại cấu hình khác (mở từ trang cài đặt hệ thống): **Configure** (`project/updateConfigure`), **Lưu trữ log** (`project/updateHisDataConfigOfProject`), **Chu kỳ báo cáo** (`project/reportMinuteUpdate`), **SMS**, **Hệ số quy đổi**, **Cài đặt phiếu công việc**, **Tự động điều khiển LCU** (`project/saveProjectLcuAutoCtrl`), **Lưu trữ dữ liệu** (`project/saveDataArchive`).

---

## 1. Định danh & phân cấp

| Field | Kiểu | Nhãn UI | Ý nghĩa / giá trị | Tin cậy |
|---|---|---|---|---|
| `projectId` | id32 | — | Khoá chính dự án | ✅ |
| `parentId` | string | Superior Resources | Dự án cha (chọn bằng cascader) → dự án tổ chức **dạng cây**. `"0"` = gốc | ✅ |
| `name` | string | Project Name | Tên dự án | ✅ |
| `remark` | string | Remark | Ghi chú | ✅ |
| `enabled` | string | Confirm To Enable | `"Y"` = Enable, `"N"` = Not In Use | ✅ |
| `ptype` | string | — | Loại dự án; form mặc định `pType: "0"`. Chưa thấy ô nhập | ❓ |
| `title`, `foreignTitle` | string | Title | Tiêu đề hiển thị (trong nước / nước ngoài), dùng ở cấu hình SMS | 🔶 |
| `platform` | null/number | Platform | Xem mục SMS (1 = CL, 2 = FY) | ✅ option, 🔶 nghĩa |

## 2. Vị trí & thời gian

| Field | Kiểu | Nhãn UI | Ý nghĩa / giá trị | Tin cậy |
|---|---|---|---|---|
| `countryId` / `provinceId` / `cityId` | id32 | Country / Province / City | FK tới bảng địa lý, chọn tuần tự (bắt buộc) | ✅ |
| `detailAddress` | string | Location | Địa chỉ chi tiết, chọn trên bản đồ | ✅ |
| `lat`, `lng` | string | Latitude / Longitude | Toạ độ dự án — dùng tính giờ mặt trời mọc/lặn và căn bản đồ | ✅ |
| `offSetLat`, `offSetLng` | null | — | Độ lệch toạ độ (form có `offsetLat/offsetLng`), có thể để hiệu chỉnh hệ toạ độ bản đồ (Baidu BD-09 vs WGS-84) | 🔶 |
| `c_lat`, `c_lng` | null | — | Toạ độ tâm bản đồ (center) | 🔶 |
| `timeZone` | string | Time Zone | Múi giờ dự án (danh sách cố định) | ✅ |
| `summerTimeStart`, `summerTimeEnd`, `summerTimeOffset` | string/number | Daylight Savings Deviation | Giờ mùa hè (DST): khoảng ngày và số phút lệch. Form mặc định `"0"` | ✅ nhãn |
| `winterTimeStart`, `winterTimeEnd`, `winterTimeOffset` | null | — | Tương tự cho giờ mùa đông; chưa thấy ô nhập trong UI hiện tại | 🔶 |
| `timingHour` | null | — | Không tìm thấy trong code frontend | ❓ |

## 3. Điều khiển chiếu sáng (quan trọng nhất)

| Field | Kiểu | Nhãn UI | Ý nghĩa / giá trị | Tin cậy |
|---|---|---|---|---|
| `lightCtrlMode` | number | Lamp Control Mode | **Chế độ điều khiển đèn của cả dự án**: `1` Integrated Mode · `2` Wireless Transparent Mode · `3` Platform Management Mode. Xuất hiện >400 lần trong code → quyết định cách tạo/hiển thị/hạ tác vụ | ✅ option, 🔶 nghĩa chi tiết |
| `onDeLay` | number | Sunset Offset (min) | Số phút lệch so với **hoàng hôn** khi bật đèn | ✅ |
| `offDeLay` | number | Sunrise Offset (min) | Số phút lệch so với **bình minh** khi tắt đèn | ✅ |
| `taskMode` | number | Task Mode | `0` Unlimited mode · `1` Turn off the lights without dimming mode | ✅ |
| `lcuDimMin`, `lcuDimMax` | number | LCU Dim Range | Khoảng độ sáng cho phép của LCU, chọn trong `0,10,…,100` (%) | ✅ |
| `maxDims` | number | — | Có trong form (mặc định 0), không có ô nhập; có thể là mức dim tối đa cũ | 🔶 |
| `maxLampIndex` | number | — | Có trong form (mặc định 0); có thể là số thứ tự đèn tối đa trên một LCU | 🔶 |
| `weekTaskEnabled` | number | — | Mặc định `1`. Khi `lightCtrlMode = 3` và cờ này bật, tác vụ hiển thị theo **vòng lặp tuần** (`loopTime`) | ✅ (từ logic hiển thị) |
| `powerOffMode` | number | Time Type | Kiểu thời gian ngắt điện: `1` Fixed Time Period · `2` Sunrise And Sunset · `3` No Power Outage Time (mặc định) | ✅ option, 🔶 phạm vi áp dụng |
| `aiboxLinkageConfig` | number | Linkage Configuration | Đèn "chạy theo xe" khi có AIBox: `1` liên động theo lưu lượng · `2` liên động theo số xe | ✅ |

## 4. Kiểm duyệt & xác thực điều khiển

| Field | Kiểu | Nhãn UI | Ý nghĩa / giá trị | Tin cậy |
|---|---|---|---|---|
| `verifyEnabled` | number | UID Replacement Audit | Duyệt khi thay UID thiết bị: `0` Not Enabled · `1` Enable | ✅ |
| `importEnabled` | number | Import Review | Duyệt khi import thiết bị: `0` Not Enabled · `1` Enable | ✅ |
| `controlSet` | number | Control settings → Enable | Bật/tắt xác thực khi điều khiển thiết bị (`0`/`1`) | ✅ |
| `verifyType` | null / mảng | "When controlling the device, use the following methods to verify" | Phương thức xác thực: `"1"` Short message (SMS) · `"2"` mail. Chọn nhiều | ✅ |
| `personConfig` | null / JSON | "After taking control of the device, relevant personnel will be notified via" | Danh sách người nhận thông báo: `{userName, mobileAreaCode, telephone, mail}` | ✅ cấu trúc |

## 5. Giám sát & thống kê

| Field | Kiểu | Nhãn UI | Ý nghĩa / giá trị | Tin cậy |
|---|---|---|---|---|
| `onlineRateLower` | number | Online rate lower limit | Ngưỡng dưới tỉ lệ online (1–100). Ghi chú UI: đặt 0 và 100 thì tỉ lệ sáng thống kê = tỉ lệ sáng của thiết bị online | ✅ |
| `onlineRateTop` | number | online rate cap | Ngưỡng trên tỉ lệ online | ✅ |
| `reportMinute` | null/number | Reporting Interval (min) | Chu kỳ thiết bị đầu cuối báo cáo dữ liệu (phút) | ✅ |
| `upTime` | number | — | Không có ô nhập riêng cho project; tên gợi ý chu kỳ cập nhật | ❓ |
| `transRate` | number | Conversion Factor | Hệ số quy đổi (khả năng cao là điện năng → CO₂/tiết kiệm, liên quan module `carbon`) | ✅ nhãn, 🔶 nghĩa |
| `hisDataConfig` | null / JSON | Project Log, Alarm Log, Energy Log, Online And Light Rate Log, Exception Record, AIBOX Traffic/Vehicle Model/Pedestrian/Facial/Alarm | Cấu hình **lưu trữ dữ liệu lịch sử** theo từng loại log (các ô `*logval`). Lưu qua `updateHisDataConfigOfProject` | ✅ nhóm, 🔶 đơn vị |
| `automaticEnd` | number | Work Order Settings | Phiếu công việc sinh từ cảnh báo **tự đóng khi cảnh báo kết thúc** (checkbox) | ✅ |

## 6. Gửi SMS / tích hợp ngoài

| Field | Kiểu | Nhãn UI | Ý nghĩa / giá trị | Tin cậy |
|---|---|---|---|---|
| `sendMethod` | null/number | Sending Method | `1` SMS Platform · `2` SMS Cat (modem GSM) | ✅ |
| `platform` | null/number | Platform | Khi gửi qua SMS Platform: `1` CL · `2` FY (hai nhà cung cấp SMS) | ✅ option, 🔶 nghĩa |
| `domesticAccount`, `domesticLink` | null | Account / Node Domain Name | Tài khoản & endpoint nhà cung cấp SMS trong nước | 🔶 |
| `foreignAccount`, `foreignLink` | null | Account / Node Domain Name | Tài khoản & endpoint gửi SMS quốc tế | 🔶 |
| `smsUrl`, `smsPort`, `smsUid` | null | Server Location / Cat Server Port Number | Địa chỉ, cổng, UID của máy chủ SMS Cat | ✅ |
| `domesticPassword`, `foreignPassword` | null | — | Mật khẩu tài khoản SMS | ✅ (tên field) |

> ⚠️ **Lưu ý bảo mật (thiết kế của Fonda)**: API đọc dự án trả về cả field mật khẩu (`domesticPassword`, `foreignPassword`) cho frontend. Ở dự án khảo sát giá trị là `null`, nhưng khi đã cấu hình thì mật khẩu có thể bị lộ cho mọi người xem được dự án. **Khi tự xây lại: không trả secret ra API đọc**, chỉ cho phép ghi (write-only) và lưu mã hoá.

## 7. Audit (chung mọi bảng)

`status` (number), `createUserId` (id32 → User), `createTime` (datetime), `updateUserId`, `updateTime`. ✅

---

## Gợi ý khi tự xây lại

- Tách bảng `project` thành **lõi** (định danh, vị trí, múi giờ, `lightCtrlMode`) + các bảng/JSON cấu hình theo nhóm (lighting, verification, notification, retention, sms). Fonda đã làm một nửa việc này ở API (mỗi nhóm một endpoint lưu) nhưng DB vẫn là một bảng rộng.
- Lưu enum dạng số như Fonda nhưng có **bảng mô tả enum** thay vì hằng số rải trong frontend (Fonda vừa dùng dictionary trên server, vừa hardcode trong module hằng số của frontend).
- `lightCtrlMode` ảnh hưởng toàn hệ thống → cần tài liệu nghiệp vụ riêng cho 3 chế độ (việc của chat về điều khiển/thiết bị).

## Còn thiếu

- Giá trị thực của các cờ trên dự án mẫu qua UI (cần tài khoản có quyền Project Management).
- Ý nghĩa chính xác: `upTime`, `timingHour`, `maxDims`, `maxLampIndex`, `ptype`, đơn vị trong `hisDataConfig`, nghĩa nhà cung cấp "CL"/"FY", và cách `transRate` được dùng.
