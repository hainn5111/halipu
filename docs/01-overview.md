# SLCP — Tổng quan hệ thống

## Hệ thống này là gì

Nền tảng **điều khiển chiếu sáng thông minh** (smart street lighting) kiêm quản lý hạ tầng đô thị. Quản lý đèn đường, tủ điều khiển, công tơ điện, camera giám sát, phát thanh công cộng, phiếu công việc bảo trì… theo mô hình **đa dự án (multi-project)**.

Tài khoản khảo sát: `HTest`. Dự án mẫu đang chạy ở Hạnh Phúc KCN, Phú Nghĩa, Hà Nội (2 tủ LCU thực tế).

## Nhóm chức năng (module)

| Module | Chức năng chính |
|---|---|
| **GIS** | Bản đồ đèn đường (Baidu Maps), giám sát an ninh, tổng quan thiết bị trên bản đồ |
| **Devices** | Danh sách thiết bị, loại/model thiết bị, liên kết topo thiết bị, cấu hình |
| **Alarms** | Cảnh báo realtime, lịch sử cảnh báo, quản lý sự kiện bất thường |
| **Tasks** | Mẫu tác vụ, cấu hình tác vụ, nhóm chiến lược, phân phối/hạ tác vụ xuống thiết bị |
| **Reports** | Năng lượng, hoá đơn điện, thống kê cảnh báo, lưu lượng người, kiểm tra cáp, phân tích vận hành LCU, bản ghi báo cáo |
| **Maintenance** | Tài sản (bản đồ + danh sách), vật tư, kế hoạch tuần tra, nhật ký & đánh giá bảo trì, công ty/đội bảo trì, quy hoạch hạ tầng |
| **Workorder** | Tổng quan, quản lý phiếu công việc, đơn xin gia hạn |
| **Media Center** | Phát thanh (loa), thư viện nhạc/video/văn bản, nhập ảnh |
| **System** | Khu vực hành chính, nhật ký lịch sử/truyền dữ liệu, cấu hình dịch vụ NS, Actility, giám sát nền tảng (SPON, ISC) |
| **Third-Party** | Tích hợp nền tảng bên thứ ba |

## Loại thiết bị (DeviceType)

7 loại gốc, mỗi loại có bộ thuộc tính cấu hình riêng (xem `03-entities.md`):

`Lamps` (đèn) · `LCU` (tủ điều khiển đèn) · `Concentrator` (bộ tập trung) · `Electric Meter` (công tơ) · `Gateway` (cổng) · `Lamp Pole` (cột đèn) · `Switch and detection` (đóng cắt & đo lường)

Ngoài ra trong dữ liệu còn thấy nhiều biến thể/thiết bị con: RTU, DTU, SmartBox, Solar/SolarLcu (năng lượng mặt trời), WCU, Lux (cảm biến sáng), Radar, Camera/AIBox (AI phân tích hình ảnh), PowerBox, Cabinet, Charging (sạc), Loudspeaker, các loại cảm biến (nhiệt, nghiêng, ngập nước, nắp cống…).

## Giới hạn của bản dựng lại

1. **Không phải schema DB.** Mỗi "thực thể" ở đây là hình chiếu của bảng DB qua API; thiếu các cột backend không trả ra (mật khẩu, khoá bí mật, cột audit nội bộ, khoá ngoại thô…).
2. **Field phụ thuộc dữ liệu mẫu.** Chỉ suy được trường của thực thể đang có bản ghi. ~34 API trả rỗng (RTU, Station, Work Order, Report…) nên chưa có bảng trường — xem danh sách cuối `03-entities.md`.
3. **Chỉ các màn hình đã duyệt.** Field được bắt từ 43 màn hình trong menu tài khoản HTest; vai trò khác có thể có thêm màn hình/field.
4. **Quan hệ là suy đoán.** FK dựa trên quy ước đặt tên (`projectId`, `deviceModelId`…), không phải ràng buộc khoá ngoại khai báo trong DB.
5. **Endpoint ≠ còn sống.** 2.320 endpoint lấy từ code; một số có thể đã bỏ, và server có thể có endpoint không xuất hiện trong frontend.
