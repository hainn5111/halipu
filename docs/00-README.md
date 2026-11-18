# SLCP — Tài liệu cấu trúc dữ liệu (dựng lại từ frontend)

**SLCP = Smart Lighting Control Platform** · `http://159.138.45.45:81`

Bộ tài liệu này mô tả cách tổ chức dữ liệu của hệ thống, **dựng lại từ phía frontend** (các lời gọi API, JSON trả về, kênh WebSocket), vì không có quyền truy cập trực tiếp vào database/server. Đây là bản đồ tham chiếu để hiểu hệ thống và làm việc với API, **không phải schema gốc của DB**.

## Nguồn dữ liệu & độ tin cậy

| Mức | Nội dung | Độ chắc |
|---|---|---|
| Chắc chắn | 2.320 endpoint (từ code, có HTTP method); field của **659 endpoint đọc gọi thật thành công**; 14 loại frame WebSocket realtime; luồng login; 23 bảng dictionary; form thêm thiết bị/model; lệnh dimming test thành công | Quan sát trực tiếp |
| Suy luận | Tên thực thể, quan hệ khoá ngoại (theo tên trường `xxxId`), kiểu dữ liệu, chức năng controller | Suy từ dữ liệu |
| Không có | Schema vật lý (kiểu cột, index, ràng buộc), cột backend không trả ra, logic server | Nằm sau API |

## Các file

| File | Nội dung |
|---|---|
| `00-README.md` | File này |
| `01-overview.md` | Tổng quan hệ thống, phạm vi chức năng, giới hạn của cách dựng lại |
| `02-architecture.md` | Kiến trúc, quy ước API, xác thực, định danh, kênh WebSocket, lớp điều khiển, ERD |
| `03-entities.md` (+ `03b`…`03e`) | Bảng trường từng thực thể, dựng từ JSON thật của 659 endpoint đọc, chia theo lĩnh vực |
| `04-api-catalog.md` | Catalog 267 controller theo lĩnh vực, kèm **lớp R/W/C** và mô tả chức năng từng controller |
| `04b-api-methods.md`, `04c-api-methods-2.md` | Danh sách đầy đủ 2.320 method theo controller (a–l, m–z) |
| `05-dictionaries.md` | Các bảng tra cứu (enum) trung tâm |
| `06-screen-api-map.md` | Mỗi màn hình gọi những API nào |
| `07-project-config.md` | Giải nghĩa từng field cấu hình của bảng `project` (chế độ điều khiển đèn, xác thực, SMS, lưu trữ log…) |
| `08-auth-and-reuse.md` | Gọi API ngoài giao diện web: header xác thực, payload `lampControl/unicast/dimming` (đã test), kênh WebSocket, đề xuất BFF. Luồng login & frame WS chi tiết hoá ở file 11 |
| `09-vendor-api-survey.md` | Khảo sát hãng có node/driver LTE/LoRa/Bluetooth & API công khai (Signify, LiCON, Tvilight, Schréder…); CMS/ODN & chuẩn TALQ; tiêu chí chọn thiết bị; driver full package (MOSO I6); Fonda có chứng nhận TALQ nhưng không bật trên SLCP Hapulico |
| `10-task-behavior-qa.md` | **Bộ kịch bản QA** tái hiện hành vi điều khiển đèn & Task trên hệ thống thật (đồng bộ dim/UI, distribute, catch-up, mất kết nối, sunrise/sunset, alarm). Mỗi test case có bước, kỳ vọng, mức tin cậy |
| `11-api-probe-and-security.md` | **Dò toàn bộ API** (cách tái lập), catalog **frame WebSocket realtime**, luồng login & mã trạng thái, và **phát hiện bảo mật** (rò dữ liệu realtime giữa các dự án, điều khiển chỉ cần token, không TLS…) |
| `12-vendor-weaknesses-lessons.md` | **Lỗ hổng & điểm yếu của Fonda → bài học cho hệ thống mới**: bảo mật (A1–A9), thiết kế API (B1–B5), kiến trúc (C1–C4); mỗi mục có "Fonda làm thế nào / rủi ro / mình đề xuất / cách kiểm tra"; kèm checklist trước khi chạy thật |
| `13-target-architecture-framework.md` | **Khung kiến trúc tối thiểu cho hệ thống tự xây** (đề xuất): 7 lớp từ đèn/driver → node → truyền thông → nền tảng → web/app → quy trình thi công & vận hành; giao diện chuẩn ở mỗi ranh giới (Zhaga-D4i, NEMA, LoRaWAN, MQTT, TALQ); bảng mua/tự làm; 10 thí nghiệm T1–T10; lộ trình; danh sách chỗ còn thiếu |
| `14-quy-trinh-phat-trien.md` | **Quy trình phát triển & kiến trúc web của repo**: vòng đời một thay đổi (nhánh → Web CI → preview → merge), 3 workflow, cấu trúc `web/`, cách thêm tab, kiểm thử, bài học vận hành (mixed content, API đã xác nhận), trang ẩn `scan.html` |

## Tài liệu hãng (datasheets)

| File | Nội dung |
|---|---|
| `datasheets/00-INDEX.md` | Chỉ mục datasheet Fonda trên Google Drive (DS-01…DS-06): link, tóm tắt, 4 phương án truyền thông, bảng thông số theo model LCU/RTU |

## Cách tạo ra

Dùng Claude điều khiển trình duyệt (phiên đăng nhập của người dùng), duyệt các màn hình, trích 2.320 endpoint từ webpack module của frontend, và **gọi trực tiếp nhóm API đọc** để lấy cấu trúc field (chỉ giữ tên trường + kiểu, không giữ giá trị thật của người/thiết bị). File 00–07, 11 và 12 không thực hiện thao tác ghi/sửa/xoá/điều khiển nào. File 08 có gửi lệnh dimming thật xuống một đèn, do người dùng tự thực hiện và đồng ý. File 09 dùng nguồn công khai. File 10 tổng hợp từ test thủ công của người dùng trên thiết bị thật. File 13 là doc đề xuất thiết kế, dựa trên doc 01–12, datasheet và nguồn công khai về chuẩn ngành; không thao tác trên hệ thống Fonda.

*Cập nhật: 2026-11-14 (thêm 13 — khung kiến trúc hệ thống tự xây; trước đó thêm 11, 12, 04b–04c; làm giàu 03, 04, 02 từ buổi dò toàn bộ API).*
