# Datasheets — Chỉ mục tài liệu hãng (mảng Truyền thông)

Nguồn: thư mục Google Drive **"Truyền thông"** — https://drive.google.com/drive/folders/1pgRFihAXfHsy_dDNQI51Lh2TDZ87Ci0K

File gốc nằm trên Drive, project chỉ giữ chỉ mục và tóm tắt này. Khi cần chi tiết, mở link Drive tương ứng.
Mã `DS-xx` dùng để trích dẫn ngắn trong các doc khác, ví dụ "(nguồn: DS-02, mục RTU500LD)". Tài liệu Fonda tìm được trên web (ngoài Drive) đánh mã `EXT-xx`.

*Đọc ngày 2026-10-27. Nội dung tóm tắt lấy trực tiếp từ datasheet hãng, nên mức tin cậy là **Chắc chắn (theo tài liệu hãng)**, trừ chỗ ghi "Suy luận".*

## 1. Danh sách file trên Drive

| Mã | Tên file | Link | Loại | Trạng thái đọc | Nội dung chính |
|---|---|---|---|---|---|
| DS-01 | FONDA TECH - LTE SOLUTION.pdf | [Mở](https://drive.google.com/file/d/1fSLUBgGYDmh-xHtucQmN21KnxVflW6ns/view) | Brochure giải pháp Fonda, 2,7 MB | Đã đọc đủ | Đèn nối thẳng lên server qua LTE/4G (TCP), không cần gateway. Model **LCU16 LTE** (NEMA 7-pin), **LCU71 LTE** (Zhaga 4-pin) |
| DS-02 | FONDA TECH - LD SOLUTIONS.pdf | [Mở](https://drive.google.com/file/d/1Fhs9Uzf0Ow0KrC7UsuTq1s8Dj1degLQq/view) | Brochure giải pháp Fonda, 3,7 MB | Đã đọc đủ | Mạng không dây Sub-1G (IEEE 802.15.4g, song tần). LCU → gateway/RTU → 4G → server. Model **LCU16LD-A/E**, **LCU71LD**, **RTU500LD** (gateway), **RTU200LD** (tủ điều khiển có Sub-1G) |
| DS-03 | FONDA TECH - Solar SOLUTION.pdf | [Mở](https://drive.google.com/file/d/1kZp89sXtXIe9A2SUieAngsOt8PU3R8Vv/view) | Brochure giải pháp Fonda, 3,6 MB | Đã đọc đủ | Đèn năng lượng mặt trời. Bộ truyền thông nói chuyện với solar controller qua RS485. Model **LCU71LS**, **LCU51LS** (LTE), **LCU51LDS-Z** (2.4G), **RTU500LDS-Z** (gateway 2.4G) |
| DS-04 | FONDA TECH - Circuit Control SOLUTION.pdf | [Mở](https://drive.google.com/file/d/1IoyMqfWx92yOfN6lkpwUkXhRkJkjlDSY/view) | Brochure giải pháp Fonda, 3,3 MB | Đã đọc đủ | Điều khiển theo mạch (tủ), bật/tắt contactor, đo điện 3 pha. Model **RTU200**, **RTU700** (có Wi-Fi debug, mở rộng PLC) |
| DS-05 | SPEC.RF.LORA.Vr2.0_….pdf | [Mở](https://drive.google.com/file/d/1mmMyu5CgbZZC_q0JxahQzPJVBAE1J4SY/view) | Catalogue sản phẩm hoàn thiện, 62 MB | **Chưa đọc được** (công cụ trả về rỗng, có thể là bản scan/ảnh) | Theo người dùng: catalogue sản phẩm hoàn thiện xây trên công nghệ Fonda, mảng RF/LoRa |
| DS-06 | SPEC.SMART POLE.Vr1.0.pdf | [Mở](https://drive.google.com/file/d/1BWawJ5r8WMVrEZiZYLFLfUbSEGoE-Cq3/view) | Catalogue sản phẩm hoàn thiện, 94 MB | **Chưa đọc được** (lý do giống DS-05) | Theo người dùng: catalogue cột đèn thông minh hoàn thiện, triển khai đầy đủ các cơ chế điều khiển/truyền thông trên nền Fonda |

**Về DS-05, DS-06 (người dùng xác nhận 2026-10-27):** đây không phải spec giao thức của hãng mà là catalogue sản phẩm hoàn thiện. Vì vậy **không nên kỳ vọng** tìm thấy định dạng payload hay khung bản tin trong hai file này. Giá trị của chúng là: danh mục thiết bị thực tế được lắp, cấu hình cột, cách tích hợp các thành phần. Người dùng đang tự xem lại nội dung.

**Cách đọc nếu cần:** tách PDF thành các phần nhỏ dưới ~20 MB rồi đính kèm vào chat, hoặc gửi riêng các trang quan trọng.

## 1b. Tài liệu Fonda tìm trên web (bổ sung về LoRaWAN)

| Mã | Nguồn | Link | Nội dung chính |
|---|---|---|---|
| EXT-01 | Datasheet LCU71LW (nhà phân phối Lena Lighting, Ba Lan) | [PDF](https://lenalighting.com/images/IoT%20karty%20katalogowe/IOT0055%20Kontroler%20FONDA%20LCU71LW%20ZHAGA%20IoT%20Karta%20katalogowa%20EN.pdf) | LCU Zhaga dùng **LoRaWAN**. Bản LCU71LW-A (AS923), LCU71LW-E (EU868). LoRaWAN 1.0.2 và 1.1, **Class C**, ADR SF9–SF12, Tx 19,5 dBm, Rx −135 dBm @SF12. DC 12–24 V, DALI 2.0/D4i |
| EXT-02 | Datasheet RTU500LW / RTU500LORA (Lena Lighting) | [PDF](https://lenalighting.com/images/IoT%20komonenty/Karty%20katalogowe/IOT0100%20Gateway%20FONDA%20RTU500LW%20IoT%20Karta%20katalogowa%20EN.pdf) | Gateway LoRaWAN: Semtech **SX1301** + SX1255/1257, 10 kênh (8 multi-SF + 1 LoRa chuẩn + 1 FSK), TI AM3352, Linux, topo **star**. Lên server qua Ethernet/Wi-Fi/4G, hỗ trợ nhiều kết nối NS. Hãng ghi tối đa ~3000 node/gateway, bán kính tới 5 km nơi trống. Tần số 434/470/868/915 MHz |
| EXT-03 | Gian hàng Fonda tại HKTDC Lighting Fair | [Trang](https://www.hktdc.com/event/hklightingfairse/en/product/1X1YS0KG) | LCU12LoRa (dạng hộp): LoRaWAN, 470 MHz, Class C, relay 16 A, PWM/0–10 V/DALI. Cùng gian hàng có các dòng **NB-IoT** (LCU16NB) và **Zigbee** (LCU51Z) |

Mức tin cậy: **Chắc chắn** về việc các datasheet này tồn tại và ghi như trên. Tài liệu do nhà phân phối đăng lại, có thể là phiên bản cũ hơn tài liệu trên Drive.

## 2. Các phương án truyền thông

| Phương án | Đường đi tín hiệu | Thiết bị | Nguồn |
|---|---|---|---|
| **LTE (trực tiếp)** | Server ⇄ trạm LTE ⇄ LCU trên từng đèn. Giao thức TCP | LCU16 LTE, LCU71 LTE | DS-01 |
| **LD (Sub-1G 802.15.4g)** | Server ⇄ 4G ⇄ RTU500LD/RTU200LD ⇄ Sub-1G ⇄ LCU | LCU16LD, LCU71LD, RTU500LD, RTU200LD | DS-02 |
| **LoRaWAN (LW)** | Server/NS ⇄ Ethernet/Wi-Fi/4G ⇄ gateway RTU500LW ⇄ LoRaWAN (star) ⇄ LCU Class C | LCU71LW, LCU12LoRa, RTU500LW (RTU500LORA) | EXT-01..03 |
| **Solar** | Server ⇄ LTE ⇄ LCU51LS/71LS ⇄ RS485 ⇄ solar controller. Hoặc: Server ⇄ 4G ⇄ RTU500LDS-Z ⇄ 2.4G ⇄ LCU51LDS-Z ⇄ RS485 ⇄ solar controller | LCU71LS, LCU51LS, LCU51LDS-Z, RTU500LDS-Z | DS-03 |
| **Circuit control** | Server ⇄ LTE/Ethernet ⇄ RTU ⇄ relay → contactor. Không điều khiển từng đèn | RTU200, RTU700 | DS-04 |
| NB-IoT, Zigbee | Chỉ thấy tên sản phẩm trên web, chưa có datasheet trong Drive | LCU16NB, LCU51Z | EXT-03 |

Ghi chú:
- **LD và LoRaWAN là hai dòng khác nhau.** Fonda đặt hậu tố theo công nghệ: `LW`/`LoRa` = LoRaWAN, `LD` = Sub-1G 802.15.4g, `LTE`, `NB`, `Z` = Zigbee, `S` = Solar. Thông số radio cũng khác hẳn: dòng LW ghi LoRaWAN 1.0.2/1.1, SF, Class C; dòng LD ghi IEEE 802.15.4g, Rx −137 dBm, Tx/Rx tách tần số. Mức tin cậy: **Suy luận** về quy tắc đặt tên (hãng không ghi thành văn), **Chắc chắn** về thông số từng datasheet.
- Chữ "LoRa Gateway" trên sơ đồ topo của DS-02 nhiều khả năng là hình dùng lại từ brochure LoRaWAN (**Suy luận**). Cần xác nhận hệ Hapulico đang chạy dòng nào: xem tên model thiết bị trong SLCP, hoặc nhãn trên LCU/gateway ngoài hiện trường.
- **Suy luận:** DS-02 không nói rõ topo LD là mesh hay star. Chỉ ghi "Autonomous Networking" (tự kết mạng).
- **Chưa biết:** giao thức tầng ứng dụng. Với LTE/LD, brochure chỉ ghi "TCP". Với LoRaWAN, chuẩn chỉ quy định lớp MAC; **định dạng payload** (FPort, cấu trúc lệnh bật/tắt/dimming, báo cáo đo điện) là riêng của Fonda. Không có trong datasheet nào, và DS-05/DS-06 là catalogue nên cũng khó có. Cách lấp khả thi: (a) xin tài liệu giao thức (protocol spec / codec) từ Fonda; (b) bắt lưu lượng: payload đã giải mã trên Network Server, hoặc gói TCP giữa gateway/LCU LTE và server; (c) xem trong SLCP có màn hình hay API nào lộ raw frame/log bản tin (đối chiếu `04-api-catalog.md`).
- **Chưa biết:** Network Server (NS) dùng loại nào (Fonda tự viết, ChirpStack, TTN…) và SLCP nói chuyện với NS qua cách nào (MQTT, HTTP integration…).

## 3. Thông số truyền thông theo model

| Model | Vai trò | Gắn đèn | Uplink | Downlink / nội bộ | Ghi chú | Nguồn |
|---|---|---|---|---|---|---|
| LCU16 LTE | Bộ điều khiển đèn | NEMA 7-pin (ANSI C136.41) | LTE FDD/TDD, 3GPP Rel.11, TCP, 23 dBm, Rx −100 dBm | — | AC 96–264 V, tải ≤ 400 W, DALI/DALI-2 hoặc 0–10 V, đo V/A/W/kWh/PF (±3%). Tùy chọn GNSS, cảm biến nghiêng (ngưỡng 30°) | DS-01 |
| LCU71 LTE | Bộ điều khiển đèn | Zhaga 4-pin | Như LCU16 LTE | — | DC 12–24 V, DALI 2.0/D4i (single-master), tương thích driver Philips SR | DS-01 |
| LCU16LD-A / -E | Bộ điều khiển đèn | NEMA 7-pin | — | Sub-1G IEEE 802.15.4g, song tần. Bản A: chuẩn 923 MHz, Tx 910,7–1010,7 MHz, Rx 910,2–1010,2 MHz. Bản E: chuẩn 868 MHz, Tx 820,7–895,7, Rx 820,2–895,2 MHz. Bước kênh 500 kHz. 20 dBm, Rx −137 dBm | Relay 250 V/16 A. Còn lại như LCU16 LTE | DS-02 |
| LCU71LD | Bộ điều khiển đèn | Zhaga 4-pin | — | Như LCU16LD | DC 12–24 V, DALI 2.0/D4i | DS-02 |
| RTU500LD | Gateway | — | LTE TDD/FDD, WCDMA, GSM; TCP; heartbeat | Sub-1G 820–1011 MHz, 20 dBm, Rx −137 dBm, Tx/Rx khác tần số | Đồng bộ thời gian cho LCU, có GPS. AC 96–264 V, IP65 | DS-02 |
| RTU200LD | Tủ điều khiển + gateway | — | LTE/WCDMA, Ethernet | Sub-1G (như RTU500LD), RS485 ×2 | Tương tự RTU200, có thêm Sub-1G | DS-02 |
| LCU71LW-A / -E | Bộ điều khiển đèn | Zhaga 4-pin | — | LoRaWAN 1.0.2 / 1.1, Class C, AS923 (A) / EU868 (E), ADR SF9–SF12, 19,5 dBm, Rx −135 dBm @SF12 | DC 12–24 V, DALI 2.0/D4i, cảm biến ánh sáng, tùy chọn GPS/nghiêng, IP65 | EXT-01 |
| LCU12LoRa | Bộ điều khiển đèn | Hộp 125×60×45 mm | — | LoRaWAN, 470 MHz, Class C | Relay 16 A, PWM/0–10 V/DALI, IP67 | EXT-03 |
| RTU500LW (RTU500LORA) | Gateway LoRaWAN | — | Ethernet, Wi-Fi, 4G | SX1301, 10 kênh, 434/470/868/915 MHz, star | 12 VDC, Linux, ~3000 node (theo hãng), IP65 | EXT-02 |
| RTU200 | Tủ điều khiển mạch | — | LTE 4G, Ethernet 10/100M | RS485 ×2, USB ×2 | ARM9, Embedded Linux, LCD 160×160. DO ×4 (250 VAC/5 A), AC DI ×2, DI ×4, đo 3 pha (±0,5%), rò điện, pin dự phòng 12 V. AC 96–500 V. Lưu ý: phần wiring ghi DO1–DO6, bảng ghi 4 kênh — hãng ghi không thống nhất | DS-04 |
| RTU700 | Tủ điều khiển mạch | — | LTE, Ethernet | RS485 ×2, RS232, Wi-Fi (debug qua web), mở rộng PLC | ARM Cortex-A7, Linux, DIN rail, DC 9–15 V. DO ×4, AC DI ×4, DI ×2, đo 3 pha, GPS. Điều khiển được LCU qua module mở rộng | DS-04 |
| LCU71LS | Bộ truyền thông đèn solar | Zhaga 4-pin | LTE, TCP | RS485 ×1 (2400/9600/115200 bps, 8N1 hoặc parity chẵn, cách ly quang) | DC 9–60 V hoặc 3,9–4,2 V. Đọc/điều khiển solar controller | DS-03 |
| LCU51LS | Bộ truyền thông đèn solar | Hộp 125×60×48 mm | LTE (Micro SIM/eSIM), TCP | RS485 | DC 4,2 V. Protocol RS485 "tùy biến theo solar controller" | DS-03 |
| LCU51LDS-Z | Bộ truyền thông đèn solar | Hộp | — | 2.4–2.5 GHz, song tần, 12,5 dBm, Rx −105 dBm; RS485 | DC 4,0–5,5 V. Có OTA | DS-03 |
| RTU500LDS-Z | Gateway solar | — | LTE/WCDMA/GSM, TCP | 2.4 GHz, 12,5 dBm, Rx −105 dBm | DC 9–36 V, GPS, heartbeat | DS-03 |

## 4. Chức năng chung của LCU (theo các brochure)

- Bật/tắt, dimming. Tác vụ theo lịch, theo thiên văn (astronomical), theo cảm biến quang (photocell).
- Đo điện: V, A, W, kWh, PF. Thống kê thời gian sáng.
- Cảnh báo: quá dòng, quá áp, thấp áp, lỗi đèn, PF thấp. Với solar: lỗi đèn, tấm pin, ắc quy.
- RTC trong thiết bị (chạy lịch khi mất kết nối — **Suy luận** từ việc có RTC và tác vụ lưu trên RTU).

Liên hệ với doc web: các chức năng này khớp với Task / Alarm / thiết bị LCU-RTU đã mô tả trong `03-entities.md` và `05-dictionaries.md`. Việc đối chiếu model ở đây với bảng loại thiết bị/model trong dictionary sẽ làm ở nhóm doc phân tích truyền thông.

## 5. Việc tiếp theo

1. Xác nhận hệ Hapulico đang dùng dòng nào (LW/LoRaWAN, LD, LTE…) qua tên model trong SLCP hoặc nhãn thiết bị thật.
2. Tìm nguồn cho định dạng payload / giao thức tầng ứng dụng (xem ghi chú mục 2: xin Fonda, bắt lưu lượng, hoặc API log trong SLCP). Đây là khoảng trống lớn nhất của mảng truyền thông.
3. Đọc DS-05, DS-06 (catalogue) khi người dùng gửi trang cần thiết — dùng cho danh mục thiết bị và cấu hình cột thông minh, không phải giao thức.
4. Đối chiếu tên model ở bảng 3 với DeviceType/DeviceModel trong SLCP (`05-dictionaries.md`).
5. Mở nhóm doc phân tích mảng truyền thông và trích dẫn theo mã DS-xx / EXT-xx.
