# 13 — Khung kiến trúc tối thiểu cho hệ thống chiếu sáng thông minh đến từng đèn

Mục đích: dựng khung tối thiểu (phần cứng, truyền thông, phần mềm, app, vận hành, thi công) cho hệ thống tự xây, kèm danh sách thí nghiệm và công nghệ để thử. Nguyên tắc chọn: **ưu tiên chuẩn mở có nhiều nhà cung cấp; chỉ tự phát triển ở chỗ không có chuẩn hoặc chỗ tạo ra giá trị riêng.**

- Đây là doc **đề xuất**. Phần "Fonda đang làm" trích từ doc 01–12 và `datasheets/00-INDEX.md`; phần "Mình đề xuất" là thiết kế mới, chưa được kiểm chứng bằng thí nghiệm trừ khi ghi rõ.
- Mức tin cậy: **Chắc chắn** = có trong doc đã reverse hoặc tài liệu chuẩn công khai · **Suy luận** = nhận định kỹ thuật của người viết · **Chưa biết** = cần thí nghiệm/khảo sát.
- Tên hãng/sản phẩm nêu ở mục 9 là **ví dụ để bắt đầu tìm**, chưa khảo giá, chưa xác minh khả năng cấp hàng tại Việt Nam.
- Cập nhật: 2026-11-14.

---

## 1. Bảy lớp của hệ thống

```
L6  Quy trình      Thi công · Nghiệm thu · Vận hành · Bảo trì
L5  Ứng dụng       Web CMS · App hiện trường · API cho bên thứ ba
L4  Nền tảng       Registry · Command · Scheduler · Telemetry · Alarm · Work order
L3  Kết nối        Network Server (LoRaWAN) · MQTT broker · Adapter/codec theo hãng
L2  Truyền thông   LoRaWAN | LTE Cat-1/NB-IoT | (Wi-SUN) ; backhaul 4G/Ethernet
L1  Điều khiển     Node trên đèn (LCU) · Gateway · Bộ điều khiển tủ (RTU) + công tơ
L0  Chiếu sáng     Đèn LED · Driver (D4i/DALI-2/0–10V) · Socket Zhaga/NEMA · Cột · Tủ điện
```

Mỗi ranh giới giữa hai lớp là một **giao diện chuẩn** — đó là chỗ đổi được nhà cung cấp:

| Ranh giới | Giao diện chuẩn đề xuất | Tự phát triển khi nào |
|---|---|---|
| L0 ↔ L1 (đèn ↔ node) | **Zhaga Book 18 + D4i** (đèn mới) hoặc **NEMA ANSI C136.41 7-pin** (đèn cũ/đèn AC); tín hiệu dim DALI-2 / 0–10V | Không nên tự làm |
| L1 ↔ L3 (node ↔ server) | **LoRaWAN 1.0.x** (lớp MAC chuẩn) hoặc **MQTT/TCP qua LTE** | **Payload ứng dụng** — chỗ này không có chuẩn chung, phải tự định nghĩa hoặc viết codec theo hãng |
| L3 ↔ L4 | MQTT nội bộ, bản tin đã chuẩn hoá (JSON/Protobuf) | Tự định nghĩa (nội bộ) |
| L4 ↔ L5 / bên ngoài | REST + OpenAPI, WebSocket; **TALQ Smart City Protocol** nếu cần liên thông với CMS/gateway hãng khác | TALQ là tuỳ chọn, làm sau |

---

## 2. Phần cứng (L0–L1)

### 2.1 Đèn và driver

| Thành phần | Fonda đang làm | Mình đề xuất | Lý do |
|---|---|---|---|
| Giao diện cơ khí | NEMA 7-pin (LCU16) và Zhaga 4-pin (LCU71) — Chắc chắn, DS-01/02 | Đèn mua mới: yêu cầu **Zhaga Book 18, chứng nhận Zhaga-D4i**. Đèn cải tạo: NEMA 7-pin | Hai chuẩn này có nhiều hãng đèn và hãng node cùng làm; cắm-rút không cần mở đèn |
| Driver | DALI/DALI-2, 0–10V, D4i — Chắc chắn | **D4i** nếu ngân sách cho phép; tối thiểu DALI-2; 0–10V cho đèn giá rẻ | Driver D4i tự cấp nguồn 24V cho node, tự đo điện và lưu dữ liệu chẩn đoán → node đơn giản, rẻ hơn |
| Đo điện | Trong LCU (±3%) — Chắc chắn | Lấy từ driver D4i (DALI part 252/253) nếu có; nếu không thì IC đo trong node | Tránh đo hai lần |
| Hành vi khi mất liên lạc | RTC + lịch lưu tại thiết bị — Suy luận | **Bắt buộc**: node giữ lịch cục bộ, có RTC, mặc định "bật 100%" khi lỗi | An toàn chiếu sáng không phụ thuộc mạng |

### 2.2 Node điều khiển đèn (LCU)

Khối chức năng tối thiểu: MCU + radio · nguồn (AC-DC với NEMA, 24V với Zhaga) · giao tiếp dim (DALI master / 0–10V / PWM) · relay (chỉ bản NEMA) · đo điện (nếu driver không có) · RTC · bộ nhớ lịch · OTA firmware · tuỳ chọn: cảm biến sáng, GNSS, nghiêng.

Hai đường đi:
- **Mua**: node Zhaga/NEMA thương mại chạy LoRaWAN hoặc LTE. Điều kiện bắt buộc khi mua: hãng **cung cấp tài liệu payload/codec** và cho phép trỏ về Network Server/broker của mình (xem bài học A9 ở doc 12).
- **Tự phát triển**: khi cần payload riêng, cần giá thấp ở số lượng lớn, hoặc không hãng nào chịu mở giao thức. Tự làm bản NEMA khó hơn (điện lưới, relay, chống sét, chứng nhận an toàn) so với bản Zhaga (chỉ 24V DC, DALI).

### 2.3 Gateway và tủ điều khiển

| Thiết bị | Vai trò | Đề xuất |
|---|---|---|
| Gateway LoRaWAN | Chuyển tiếp gói LoRa ↔ IP | **Mua**. Gateway 8 kênh ngoài trời chạy packet forwarder chuẩn (Semtech UDP / Basics Station). Đây là hàng phổ thông, nhiều hãng, không khoá với node |
| Bộ điều khiển tủ (RTU) | Đóng cắt contactor theo mạch, đo 3 pha, phát hiện rò/mất pha, cửa tủ | Giữ lại trong kiến trúc dù đã điều khiển từng đèn: làm lớp dự phòng và đo tổng. Dùng PLC/RTU công nghiệp có **Modbus** + công tơ Modbus/DLMS, lên server qua MQTT |
| Công tơ | Đo tổng theo tủ | Công tơ 3 pha Modbus RTU thông dụng |

Fonda: RTU200/RTU700 tích hợp sẵn DO/DI + đo 3 pha + 4G (Chắc chắn, DS-04). Mình đề xuất tách bằng thiết bị công nghiệp chuẩn Modbus để không phụ thuộc một hãng.

---

## 3. Truyền thông (L2)

| Công nghệ | Chuẩn | Hạ tầng | Hợp với | Điểm yếu | Nguồn cung |
|---|---|---|---|---|---|
| **LoRaWAN Class C** | LoRa Alliance; MAC chuẩn, payload tự do | Tự dựng gateway + Network Server | Khu tập trung nhiều đèn (KCN, khu đô thị); không cước thuê bao | Băng thông thấp, OTA firmware chậm; phải quy hoạch gateway | Rất nhiều (module, gateway, NS mã nguồn mở) |
| **LTE Cat-1 / Cat-1 bis** | 3GPP | Nhà mạng | Đèn rải rác, tuyến dài, điểm lẻ; OTA nhanh | Cước SIM từng đèn; phụ thuộc phủ sóng | Rất nhiều module |
| NB-IoT | 3GPP | Nhà mạng | Như trên, cước thấp hơn | Độ trễ cao, phụ thuộc nhà mạng có bật NB-IoT tại khu vực — **Chưa biết** tại Hapulico | Nhiều |
| Wi-SUN FAN | IEEE 802.15.4g + IPv6 mesh | Border router | Mesh tự phục hồi, băng thông khá | Ít nhà cung cấp hơn, stack phức tạp | Trung bình |
| Sub-1G riêng (Fonda LD) | 802.15.4g nhưng giao thức riêng | Gateway của hãng | — | **Khoá hãng** | Một hãng |

**Đề xuất tối thiểu:** LoRaWAN Class C làm đường chính cho đèn; LTE Cat-1 cho điểm lẻ và cho backhaul gateway/tủ. Kiến trúc phần mềm phải coi "đường truyền" là adapter thay được (mục 4.1), để thêm NB-IoT/Wi-SUN sau mà không sửa lõi.

**Tần số LoRaWAN tại Việt Nam — cần xác minh trước khi mua thiết bị.** Các nguồn công khai không thống nhất về kế hoạch kênh áp dụng cho Việt Nam (có nguồn ghi nhóm AS923-2 dải 920–923 MHz, có nguồn ghi 923–925 MHz). Datasheet Fonda LCU71LW-A chỉ ghi "AS923" (EXT-01). Cách lấp: (a) đọc thông tư hiện hành của Bộ TT&TT về thiết bị vô tuyến miễn cấp phép; (b) xem cấu hình kênh thực tế trên gateway Fonda đang chạy. Mức tin cậy: **Chưa biết**.

---

## 4. Phần mềm (L3–L5)

### 4.1 Các khối tối thiểu

```
 Node/Gateway ──► [Network Server LoRaWAN] ──┐
 Node LTE / RTU ─► [MQTT broker, TLS]  ──────┼─► [Adapter + Codec theo hãng/model]
                                             │        │ bản tin chuẩn hoá
                                             ▼        ▼
      ┌────────────┬──────────────┬─────────────┬───────────┬────────────┐
      │ Registry   │ Command svc  │ Scheduler   │ Telemetry │ Alarm      │
      │ (thiết bị, │ (hàng đợi,   │ (lịch, mặt  │ (đo điện, │ (luật,     │
      │  topo,     │  vòng đời,   │  trời mọc/  │  trạng    │  mức độ) → │
      │  nhóm)     │  retry,audit)│  lặn, nhóm) │  thái)    │ Work order │
      └────────────┴──────────────┴─────────────┴───────────┴────────────┘
                        │ REST (OpenAPI) + WebSocket theo project
                        ▼
              Web CMS · App hiện trường · Tích hợp ngoài (TALQ tuỳ chọn)
```

| Khối | Việc phải làm | Fonda đang làm | Mình làm khác |
|---|---|---|---|
| **Adapter + codec** | Dịch payload từng hãng/model ↔ bản tin chuẩn nội bộ (`on/off/dim`, `telemetry`, `alarm`, `schedule`) | Giao thức gắn theo DeviceModel (RF/F2, CAT1/F2, SDMP…) — Chắc chắn, doc 02 | Codec là plugin độc lập, có test; lõi không biết gì về hãng (bài học C2) |
| **Registry** | Project → DeviceType → DeviceModel → Device; topo tủ–đèn; nhóm; vị trí cột | Giữ mô hình này — đã reverse, doc 02/03 | Thêm "digital twin" tối giản: trạng thái mong muốn vs trạng thái báo về |
| **Command service** | Mỗi lệnh có `commandId`, vòng đời `queued → sent → acked → done/failed/timeout`, idempotency | HTTP trả "accepted", kết quả về WS, không có mô hình trạng thái rõ — doc 12 C4 | Lưu DB, retry có giới hạn, audit bất biến, xác nhận lần hai cho lệnh phạm vi rộng (A5) |
| **Scheduler** | Lịch giờ cố định / thiên văn; nạp lịch xuống node; phát hiện node lệch lịch và nạp lại | Task + DeviceGroup + distribute — doc 02 §7, doc 10 | So sánh hash lịch trên node với server để tự phát hiện lệch |
| **Telemetry** | Lưu chuỗi thời gian: V, A, W, kWh, PF, mức dim, RSSI/SNR | Có, qua WS frame — doc 11 | CSDL chuỗi thời gian, có chính sách nén/lưu giữ |
| **Alarm → Work order** | Luật cảnh báo (đèn lỗi, mất liên lạc, quá áp, sáng ban ngày), gộp trùng, sinh phiếu việc | Alarm → AbnormalWorkOrder → DelayOrder — doc 02 §8 | Giữ luồng; thêm khử nhiễu (debounce) và cảnh báo mức tủ/gateway để không sinh hàng trăm cảnh báo khi mất một gateway |
| **Bảo mật & đa dự án** | TLS, RBAC kiểm tra ở server, cách ly project ở REST và WS | Xem doc 12 mục A | Áp checklist doc 12 mục D ngay từ đầu |

### 4.2 Ngăn xếp công nghệ gợi ý (đều có lựa chọn mã nguồn mở)

| Vai trò | Gợi ý | Ghi chú |
|---|---|---|
| Network Server LoRaWAN | ChirpStack | Mã nguồn mở, tự host, xuất dữ liệu qua MQTT |
| MQTT broker | EMQX hoặc Mosquitto | TLS + xác thực theo thiết bị |
| CSDL | PostgreSQL (+ PostGIS cho bản đồ) + TimescaleDB cho telemetry | Một hệ CSDL cho giai đoạn đầu |
| Hàng đợi | NATS hoặc RabbitMQ | Kafka là thừa ở quy mô đầu |
| Backend | Ngôn ngữ đội quen (Go / Java / Node / Python) | Ba service tối thiểu: API, Command, Ingest (doc 12 C1) |
| Web | Vue hoặc React + bản đồ mở (MapLibre/Leaflet + OpenStreetMap) | Fonda dùng Baidu Maps — không hợp ở Việt Nam |
| Dựng nhanh để thí nghiệm | ThingsBoard, Node-RED, Grafana | Dùng để thử, không nhất thiết là nền sản phẩm |

### 4.3 Chuẩn liên thông ở lớp trên

- **TALQ Smart City Protocol**: chuẩn giao diện giữa CMS và mạng thiết bị ngoài trời (gateway). Bản 2.7.0 phát hành 02/2026, bổ sung profile DALI D4i/Zhaga; đặc tả công khai trên GitHub. Doc 09 đã ghi Fonda có chứng nhận TALQ nhưng không bật trên SLCP Hapulico.
- Đề xuất: **không bắt buộc ở bản tối thiểu**, nhưng đặt tên trường và mô hình dữ liệu đèn (lamp actuator, lamp monitoring, calendar/control program) **bám theo mô hình TALQ** để sau này bật giao diện TALQ mà không phải đổi lõi. Mức tin cậy về độ phù hợp: Suy luận — cần đọc đặc tả TALQ rồi đối chiếu với doc 03.

---

## 5. App hiện trường (L5)

Tối thiểu ba vai, một app (hoặc PWA), **chạy được khi mất mạng** và đồng bộ sau:

| Vai | Chức năng tối thiểu |
|---|---|
| **Thi công / commissioning** | Quét QR trên node (UID/DevEUI) → gắn vào cột (GPS + ảnh) → chọn model đèn/driver → gửi lệnh thử bật/tắt/dim → ghi kết quả nghiệm thu |
| **Bảo trì** | Nhận phiếu việc, dẫn đường đến cột, xem lịch sử lỗi của đèn, thay thiết bị (quét mã cũ/mới, tự chuyển cấu hình + lịch), chụp ảnh đóng phiếu |
| **Vận hành** | Bản đồ trạng thái, cảnh báo đẩy về máy, điều khiển tay có xác nhận |

Fonda có app quét mã lắp đặt (`scanCode/*`, doc 12 A9) — Chắc chắn về endpoint, luồng chi tiết Chưa biết. Điểm cần làm tốt hơn: khoá bí mật của node (AppKey) **không đi qua app dạng rõ**; QR chỉ chứa định danh, khoá nạp từ file lô hàng của nhà sản xuất vào server.

---

## 6. Quy trình thi công

1. **Khảo sát**: danh mục cột/đèn/tủ hiện có (toạ độ, công suất, loại driver, có socket hay không), đo phủ sóng (LoRa thử bằng 1 gateway tạm + node cầm tay; di động đo theo nhà mạng).
2. **Thiết kế**: vị trí gateway (có dự phòng chồng lấn — mỗi đèn nên thấy ≥ 2 gateway), sơ đồ tủ–mạch–đèn, quy ước đặt mã cột.
3. **Chuẩn bị dữ liệu trước khi ra hiện trường**: nhập sẵn danh sách thiết bị + khoá vào server; in nhãn QR.
4. **Lắp đặt**: tủ/gateway trước, đèn sau. Với đèn cũ không có socket: lắp đế NEMA/Zhaga hoặc dùng node dạng hộp đấu trong thân đèn/chân cột.
5. **Commissioning tại cột** (bằng app): quét → gắn vị trí → thử lệnh → xác nhận node đã nhận lịch.
6. **Nghiệm thu theo tuyến**: tỉ lệ online, thời gian đáp ứng lệnh, sai số đo điện so với công tơ tủ, thử mất mạng (đèn vẫn chạy lịch), thử mất điện rồi có lại.
7. **Bàn giao**: hồ sơ hoàn công số (bản đồ, danh mục, kết quả thử) nằm ngay trong hệ thống.

Bộ kịch bản thử hành vi ở doc 10 dùng lại được làm tiêu chí nghiệm thu cho bước 6.

## 7. Quy trình vận hành

| Nhịp | Việc |
|---|---|
| Hằng ngày | Xem bảng tổng: tỉ lệ online, đèn lỗi, đèn sáng ban ngày/tối ban đêm; xử lý cảnh báo → phiếu việc |
| Hằng tuần | Rà phiếu quá hạn; kiểm tra node lệch lịch; kiểm tra gateway/tủ |
| Hằng tháng | Báo cáo điện năng (tổng node so với công tơ tủ → phát hiện thất thoát), tỉ lệ sự cố theo model, thời gian khắc phục trung bình |
| Khi thay đổi | Đổi lịch/điều khiển phạm vi rộng: thử trên nhóm nhỏ → xác nhận → áp toàn bộ; cập nhật firmware theo đợt (1% → 10% → 100%), có đường lùi |
| Sự cố | Mất gateway / mất server: đèn chạy lịch cục bộ; có quy trình điều khiển tay tại tủ |
| Nền | Sao lưu CSDL, giám sát server/broker, quản lý SIM và hạn cước, xoay vòng khoá/chứng chỉ, phân quyền theo vai |

---

## 8. Thí nghiệm đề xuất cho nghiên cứu

Xếp theo thứ tự nên làm; mỗi thí nghiệm trả lời một câu hỏi còn "Chưa biết".

| # | Thí nghiệm | Câu hỏi cần trả lời | Thiết bị/công nghệ gợi ý |
|---|---|---|---|
| T1 | Bàn thử dim | Điều khiển driver bằng DALI-2/D4i và 0–10V thế nào; đọc được gì từ driver D4i (điện năng, chẩn đoán) | 1 driver D4i + 1 driver 0–10V, tải LED; kit MCU (ESP32 hoặc STM32) + mạch giao tiếp DALI; bộ DALI-USB để đối chiếu |
| T2 | LoRaWAN đầu-cuối | Độ trễ lệnh Class C, tỉ lệ mất gói, số đèn/gateway thực tế | 1 gateway 8 kênh, 3–5 module LoRaWAN (loại SoC STM32WL hoặc module tương đương), ChirpStack tự host |
| T3 | Phủ sóng thực địa | Cần bao nhiêu gateway cho Hapulico, đặt ở đâu | Gateway tạm trên cao + node cầm tay ghi RSSI/SNR theo GPS |
| T4 | LTE Cat-1 trực tiếp | Độ trễ, mức tiêu thụ dữ liệu/tháng, hành vi khi rớt mạng | Module Cat-1 bis + MCU, MQTT qua TLS |
| T5 | Giải mã thiết bị Fonda đang có | Payload LoRaWAN/TCP của LCU Fonda là gì → có tái dùng được phần cứng hiện có không | Cần đồng ý riêng: đọc payload đã giải mã trên NS hoặc bắt gói giữa gateway và server (xem `datasheets/00-INDEX.md` mục 2). Chỉ đọc |
| T6 | Lịch cục bộ và mất liên lạc | Node giữ lịch, tính mặt trời mọc/lặn, trôi RTC bao nhiêu, tự phục hồi thế nào | Firmware thử trên kit T2; cắt gateway có chủ đích |
| T7 | Đo điện | Sai số đo của node/driver so với công tơ chuẩn | IC đo điện 1 pha trên kit, hoặc số liệu từ driver D4i; công tơ tham chiếu |
| T8 | Command service | Vòng đời lệnh, retry, lệnh nhóm 100–1.000 đèn có nghẽn downlink LoRaWAN không | Trình giả lập node + ChirpStack; đo với multicast Class C |
| T9 | OTA firmware | Cập nhật qua LoRaWAN (FUOTA) có khả thi không, mất bao lâu; so với LTE | Kit T2 và T4 |
| T10 | Node Zhaga mẫu | Một node tự làm cắm được vào đèn Zhaga-D4i thương mại | Đế + vỏ Zhaga Book 18 mua sẵn, mạch tự thiết kế; 1 đèn Zhaga-D4i |

Kết quả mỗi thí nghiệm nên ghi thành doc riêng trong nhóm này (14, 15…), nêu cấu hình, số liệu, kết luận.

---

## 9. Mua hay tự làm

| Thành phần | Khuyến nghị | Tìm nhà cung cấp theo tiêu chí | Ví dụ để bắt đầu tìm (chưa xác minh) |
|---|---|---|---|
| Đèn + driver | **Mua** | Chứng nhận Zhaga-D4i (tra cơ sở dữ liệu sản phẩm của Zhaga), hoặc có socket NEMA 7-pin | Hãng đèn trong danh sách Zhaga; hãng driver có dòng D4i (xem doc 09 mục driver) |
| Socket/đế/vỏ node | **Mua** | Đúng Zhaga Book 18 / ANSI C136.41 | Hãng đầu nối lớn và nhiều hãng Trung Quốc chuyên socket chiếu sáng |
| Gateway LoRaWAN | **Mua** | 8 kênh, ngoài trời, packet forwarder chuẩn, backhaul 4G + Ethernet | Các hãng gateway LoRaWAN phổ thông |
| Network Server, broker, CSDL | **Dùng mã nguồn mở** | Tự host được | ChirpStack, EMQX/Mosquitto, PostgreSQL |
| Node đèn | **Mua trước, tự làm sau** | LoRaWAN chuẩn (OTAA, Class C), **mở tài liệu payload**, trỏ được về NS của mình | Các hãng ở doc 09; node Fonda nếu T5 thành công |
| RTU tủ + công tơ | **Mua** | Modbus RTU/TCP, MQTT | PLC/RTU công nghiệp phổ thông, công tơ Modbus |
| Codec/adapter | **Tự làm** | — | Không có chuẩn payload chung |
| Lõi nền tảng (registry, command, scheduler, alarm, work order) | **Tự làm** | — | Đây là phần giá trị riêng và đã có bản reverse chi tiết |
| Web + app | **Tự làm** | — | — |
| Giao diện TALQ | **Để sau** | — | Đặc tả trên GitHub của TALQ |

---

## 10. Lộ trình tối thiểu

1. **Phòng thí nghiệm** (T1, T2, T4, T6, T7): một bàn thử chạy đầu-cuối: đèn ↔ node ↔ ChirpStack/MQTT ↔ một service nhỏ ↔ trang web bật/tắt/dim.
2. **Thử nghiệm hiện trường nhỏ** (T3, T5, T8): 10–20 đèn tại Hapulico, một gateway, đủ luồng lịch + cảnh báo + app commissioning.
3. **Bản vận hành đầu tiên**: thêm work order, báo cáo điện năng, phân quyền đa dự án, checklist bảo mật doc 12.
4. **Mở rộng**: adapter cho hãng thứ hai, giao diện TALQ, node tự thiết kế (T10), OTA (T9).

## 11. Còn thiếu và cách lấp

| Chỗ thiếu | Mức | Cách lấp |
|---|---|---|
| Kế hoạch tần số LoRaWAN hợp lệ tại Việt Nam | Chưa biết | Thông tư Bộ TT&TT hiện hành; cấu hình gateway Fonda đang chạy |
| Hapulico đang chạy dòng Fonda nào (LW / LD / LTE) | Chưa biết | Việc 1 trong `datasheets/00-INDEX.md` §5 |
| Payload ứng dụng của Fonda | Chưa biết | T5 |
| Đèn hiện có ở Hapulico có socket/driver loại gì | Chưa biết | Khảo sát hiện trường (mục 6 bước 1) |
| Phủ sóng NB-IoT / Cat-1 tại khu vực | Chưa biết | T4 + hỏi nhà mạng |
| Giá và khả năng cấp hàng của từng loại thiết bị | Chưa biết | Gửi yêu cầu báo giá theo tiêu chí mục 9 |
| Độ khớp giữa mô hình dữ liệu đã reverse và mô hình TALQ | Suy luận | Đọc đặc tả TALQ 2.7.0, đối chiếu doc 03 |
| Yêu cầu chứng nhận hợp quy cho node tự làm | Chưa biết | Hỏi đơn vị đo kiểm hợp quy thiết bị vô tuyến và an toàn điện |

## Nguồn

- Doc trong project: `01-overview.md`, `02-architecture.md`, `09-vendor-api-survey.md`, `10-task-behavior-qa.md`, `12-vendor-weaknesses-lessons.md`, `datasheets/00-INDEX.md`.
- [Zhaga — cơ sở dữ liệu sản phẩm được chứng nhận](https://zhagastandard.org/products)
- [TALQ — phát hành Smart City Protocol 2.7.0 (27/02/2026)](https://www.talq-consortium.org/news/81/talq-consortium-releases-version-270-of-its-interface-standard)
- [TALQ — danh sách sản phẩm được chứng nhận](https://www.talq-consortium.org/certified-products.html)
- [The Things Network — kế hoạch tần số theo quốc gia](https://www.thethingsnetwork.org/docs/lorawan/frequencies-by-country/) và [mô tả nhóm AS923-2](https://www.thethingsnetwork.org/device-repository/tags/as923-2/) (hai nguồn không thống nhất về Việt Nam)
