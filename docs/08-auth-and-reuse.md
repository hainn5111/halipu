# SLCP — Xác thực & gọi API ngoài giao diện web (test điều khiển đèn)

Ghi lại buổi thử ngày **2026-10-26**: gọi trực tiếp API điều khiển của Fonda, không bấm nút trên web, nhằm kiểm tra khả năng **kế thừa API có sẵn** cho một frontend/BFF riêng.

> Theo quy ước dự án: không ghi token, mật khẩu, cookie, `luid`/`projectId` thật. Giá trị thiết bị thay bằng `<...>`.

## 1. Kết luận nhanh

| Câu hỏi | Kết quả | Tin cậy |
|---|---|---|
| Gọi API điều khiển từ ngoài web (terminal) được không? | **Được**. Lệnh dimming gửi từ PowerShell trả về `code 200, Operation succeeded.` | Chắc chắn |
| Cần header gì? | Chỉ cần `authorization: <token>` + `Content-Type: application/json`. Không gửi `clientType`, `userAccount`, `projectId` header vẫn thành công | Chắc chắn |
| `Operation succeeded` có nghĩa là đèn đã đổi độ sáng? | **Không chắc.** Chỉ nghĩa là server nhận lệnh; trạng thái thực của thiết bị trả về qua WebSocket (`unicastStatus`) | Suy luận |
| Token sống bao lâu, có refresh không? | Chưa biết | Chưa biết |

## 2. Lệnh chỉnh độ sáng một đèn (unicast dimming)

**Nguồn:** bắt request thật khi người dùng chỉnh độ sáng trên màn hình `#/gis/index` (bản đồ GIS); endpoint cũng có trong bundle `index.fa810e2d.js` (`lampControl` trong `04-api-catalog.md`).

```
POST http://159.138.45.45:18080/api/v1.0/lampControl/unicast/dimming?lang=en-US
Content-Type: application/json
authorization: <token>

{"luid":"<uid LCU>","num":<số>,"dimming":<0-100>,"projectId":"<id32>"}
```

| Field | Kiểu | Ý nghĩa | Tin cậy |
|---|---|---|---|
| `luid` | string (chuỗi số 12 ký tự) | UID của LCU (thiết bị điều khiển đèn) — dùng UID chứ không phải `id32` | Chắc chắn (field), Suy luận (nghĩa) |
| `num` | number | Số thứ tự đèn/kênh trên LCU. Đèn người dùng gọi là "đèn 5" trên UI gửi `num: 1` → nhãn UI ≠ `num` | Suy luận |
| `dimming` | number | Độ sáng %, test với `10` | Chắc chắn |
| `projectId` | id32 | Dự án chứa thiết bị (nằm trong body, không phải header) | Chắc chắn |

**Response:** `{"type":true,"code":200,"message":"Operation succeeded.","data":null}` — đúng chuẩn bọc trong `02-architecture.md`.

Frontend gọi qua hàm bọc axios: `{url:"/v1.0/lampControl/unicast/dimming", method:"post", data:e}` (cùng mẫu với `unicast/turnOn`, `unicast/turnOff`, `unicast/queryStatus`).

### Lệnh dùng thử (Windows PowerShell)

```powershell
# 1. Nhập token (lấy ở F12 → Network → request tới :18080 → Request Headers → authorization)
$env:SLCP_TOKEN = Read-Host "Token"

# 2. Hàm chỉnh độ sáng (một dòng)
function Dim([int]$level, [int]$num = 1, [string]$luid = "<uid LCU>") { if ($level -lt 0 -or $level -gt 100) { Write-Host "Mức sáng phải từ 0 đến 100"; return }; $body = @{ luid = $luid; num = $num; dimming = $level; projectId = "<projectId>" } | ConvertTo-Json -Compress; Invoke-RestMethod -Method Post -Uri "http://159.138.45.45:18080/api/v1.0/lampControl/unicast/dimming?lang=en-US" -ContentType "application/json" -Headers @{ authorization = $env:SLCP_TOKEN } -Body $body }

# 3. Dùng
Dim 10
```

Lưu ý khi dán vào PowerShell: các lệnh nhiều dòng dễ bị dính thành một dòng → lỗi `Unexpected token`. Giữ mỗi lệnh trên một dòng.

## 3. Xác thực (bổ sung cho mục 3 của `02-architecture.md`)

| Nội dung | Chi tiết | Tin cậy |
|---|---|---|
| Header token | Tên `authorization` (chữ thường trong code frontend) | Chắc chắn |
| Header khác frontend đặt | `clientType`, `userAccount`, `projectId`, `timeZone`, `offset`, `summerTimeStartLong`, `summerTimeEndLong`, `Content-Type` — không bắt buộc cho lệnh dimming | Chắc chắn (tên, từ bundle), Chắc chắn (không bắt buộc với dimming) |
| Phiên theo tab | Tab mới mở cùng trình duyệt bị đẩy về `#/login` dù `localStorage` vẫn có `pid`, `userId` → token có thể lưu trong sessionStorage/bộ nhớ của tab | Suy luận |
| Luồng login | Endpoint login, nguồn RSA public key (jsencrypt), field chứa token trong response | Chưa biết |
| Hạn token / refresh | | Chưa biết |
| CORS | Có preflight `OPTIONS` trả 200 cho `unicast/dimming`. Origin được phép chưa kiểm | Chắc chắn (preflight), Chưa biết (origin) |

**Cách lấp chỗ thiếu:** đọc bundle quanh `jsencrypt`/hàm login và quan sát Network lúc người dùng tự đăng nhập (chỉ ghi tên trường); để tab mở lâu và ghi lại thời điểm API trả lỗi xác thực.

## 4. Kênh WebSocket (phản hồi trạng thái)

**Nguồn:** bundle `index.fa810e2d.js`.

- Frontend mở `new WebSocket(...)`; khi `onopen` gửi `{cmd:"session", Authorization: <token>}` để xác thực phiên. (Chắc chắn)
- Sau đó đăng ký nghe sự kiện bằng `{cmd:"listener", ctrl:"add", data:{events:[{cmd, ctrl}, ...]}}`. (Chắc chắn)
- Các sự kiện `cmd:"lampControl"` thấy trong code: `unicastStatus`, `lcuBatchOperation-progressBar`, `lcuBatchOperationStatus`, `rtuGroup-progressBar`, `rtuGroupStatus`, `rtuBroadcast-progressBar`, `rtuBroadcastStatus`, `projectGroup-progressBar`, `projectGroupStatus`, `projectBroadcast-progressBar`, `status`, `data`; ngoài ra `cmd:"kmControl"` với `kmBatchOperation-progressBar`, `kmBatchOperationStatus`. (Chắc chắn)
- Ý nghĩa: **lệnh đi bằng HTTP POST, kết quả/tiến độ thực thi trên thiết bị về bằng WebSocket** (bất đồng bộ). (Suy luận — chưa bắt được frame WS thật)
- URL WebSocket, định dạng message trả về: Chưa biết.

## 5. Cách đã làm (để lặp lại cho lệnh khác)

1. Người dùng tự đăng nhập trong tab Chrome thuộc group của Claude.
2. Claude gắn một hook chỉ-đọc vào `XMLHttpRequest` của trang, ghi URL + body + response của request có `lampControl`/`lcu` trong URL; **không đọc header** (không chạm token). Hook mất khi tải lại trang.
3. Người dùng tự bấm thao tác trên UI → Claude đọc lại bản ghi.
4. Viết lại thành lệnh terminal; người dùng tự chạy với token của mình.

Mỗi lần bấm/gửi là **lệnh thật xuống đèn**. Trong buổi thử đèn nhận lệnh dimming nhiều lần (cuối cùng ở 10%).

## 6. Còn thiếu & bước tiếp theo

| Việc | Cách làm |
|---|---|
| Payload `unicast/turnOn`, `turnOff`, `queryStatus` | Bắt như mục 5 (cần người dùng đồng ý vì là lệnh thật, trừ `queryStatus`) |
| Quan hệ nhãn đèn trên UI ↔ `num` | So danh sách đèn của LCU (`lcuActor/queryLcuAndRelatedByUid`, `lcuLight/queryLcuLightByLcuIdAndNum`) với UI |
| `dimming: 0` có tương đương tắt không | Thử có kiểm soát hoặc đọc logic frontend |
| Lệnh theo nhóm/cả dự án (`group/*`, `broadcast/*`, `lcuBatchOperation`) | Bắt payload tương tự; đây là các lệnh ảnh hưởng nhiều đèn → cần đồng ý riêng từng lần |
| Luồng login, hạn token | Mục 3 |
| Frame WebSocket thật | Hook `WebSocket.prototype.send`/`onmessage` (chỉ ghi `cmd`/`ctrl` và tên trường) |

## 7. Ý nghĩa cho hệ thống mới

**Fonda đang làm:** frontend gọi thẳng backend; token nằm trong header, `projectId` trong body; lệnh điều khiển trả "đã nhận" ngay, kết quả thật về qua WebSocket.

**Đề xuất:**
- Làm **BFF/adapter** đứng giữa frontend mới và API Fonda: giữ token phía server, frontend không cầm token Fonda; dịch `luid/num/dimming` sang API của mình (vd `POST /lamps/{id}/dim {level}`) để sau này thay backend không phải sửa UI.
- Tách rõ trạng thái lệnh: `accepted` (server nhận) → `executed`/`failed` (thiết bị xác nhận), thay vì chỉ một thông báo "Operation succeeded". Fonda đã có sẵn tín hiệu này qua WebSocket, nên BFF có thể nghe WS và cập nhật trạng thái lệnh.
- Có lớp chặn/nhật ký cho mọi lệnh điều khiển (ai gửi, lúc nào, thiết bị nào, mức nào) và giới hạn lệnh hàng loạt — Fonda có cấu hình xác thực khi điều khiển (`controlSet`, `verifyType` trong `07-project-config.md`) nhưng lệnh gọi thẳng API vẫn chạy được chỉ với token.

*Cập nhật: 2026-10-26.*
