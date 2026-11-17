# 09 — Khảo sát hãng: bộ điều khiển đèn có kết nối LTE/LoRa/Bluetooth và API công khai

*Ngày khảo sát: 2026-10-28. Nguồn: tìm kiếm web, trang hãng, datasheet, catalog hãng, Capability List của TALQ Consortium. Mục 2.2 có thêm kết quả xem (chỉ đọc) trên SLCP của Hapulico ngày 2026-10-28. Mục 3A (driver full package) thêm cùng ngày.*

Mức tin cậy: **Chắc chắn** = đọc trực tiếp từ tài liệu hãng/tổ chức chuẩn hoặc quan sát trực tiếp · **Suy luận** = suy ra từ tài liệu · **Chưa biết** = chưa tìm thấy nguồn · **Chưa xác minh** = chỉ có nguồn thứ cấp, chưa đối chiếu được với tài liệu hãng.

---

## 1. Khái niệm nền

### 1.1 CMS và ODN
- **CMS (Central Management System)**: phần mềm quản lý tập trung (web + API + DB). Với Fonda, CMS là SLCP (doc 01–08).
- **ODN (Outdoor Device Network)**: mạng thiết bị hiện trường — node đèn (LCU), tủ (RTU), gateway/bộ tập trung, giao thức vô tuyến giữa chúng.

```
[Người dùng] → [CMS] ⇄ [Gateway] ⇄ [Node đèn / tủ điện]
                       └──────── ODN ────────┘
```

### 1.2 Tiêu chí chọn thiết bị (theo yêu cầu Hapulico, 2026-10-28)

**Phần cứng — thứ tự ưu tiên:**
1. **Ưu tiên cao nhất: driver "full package"** — một driver LED tích hợp sẵn cả bộ điều khiển (bật/tắt, dimming, đo điện, lịch, cảnh báo) và module truyền thông (LTE/Cat.1/NB-IoT, LoRa, Bluetooth…). Không cần node rời.
2. **Nếu không có**: driver + bộ điều khiển/node rời. **Không giới hạn kiểu giao tiếp** giữa driver và bộ điều khiển (DALI-2/D4i, 0/1–10V, PWM… đều chấp nhận được).

**Phần mềm — một trong hai điều kiện:**
- **(a)** Hãng có **CMS kèm API** cho bên thứ ba; hoặc
- **(b)** Lớp truyền thông có **API/giao thức công khai** (ví dụ TALQ ở gateway, payload codec LoRaWAN, MQTT/HTTP của node Cat.1) để **tự build CMS**.

**Ghi chú thị trường (từ các datasheet đã đọc):**
- Các dòng driver ngoài trời đã đọc của Tridonic (LCO D4i), Inventronics (EUM) và Delta (EUCI) chỉ có **NFC** (cấu hình) + DALI-2/D4i; truyền thông xa nằm ở node cắm socket Zhaga Book 18 hoặc NEMA. **Chắc chắn** (datasheet).
- **Driver tích hợp truyền thông WAN là dòng hiếm.** Đã tìm thấy một sản phẩm có tài liệu chính thức: **MOSO I6, 4G Cat.1** (mục 3A.1). Các hãng khác được báo chí/diễn đàn nhắc tới nhưng **chưa xác minh** (mục 3A.2).

### 1.3 Chuẩn TALQ (Chắc chắn)
- **TALQ Smart City Protocol** (TALQ Consortium, từ 2012): chuẩn giao tiếp **CMS ⇄ Gateway của ODN**, để CMS hãng A điều khiển thiết bị hãng B.
- REST hai chiều, JSON (JSON-LD), trên HTTPS/TLS. CMS và Gateway đều vừa là client vừa là server.
- Mô hình: *Device* chứa *Function* (`LampActuator`, `LampMonitor`, các sensor…) + *Service* (Configuration, Control, Data Collection, On-Demand Data Request, Group Management, Data Package Transfer).
- **Không** chuẩn hóa giao thức vô tuyến gateway ⇄ node (mỗi hãng tự làm).
- Sản phẩm đạt chứng nhận có **Capability List** công khai trên talq-consortium.org.

---

## 2. Fonda và TALQ

### 2.1 Capability List công khai (Chắc chắn)

| Sản phẩm | Vai trò | TALQ | Ngày chứng nhận | Số test đạt | Nguồn |
|---|---|---|---|---|---|
| FondaCity-gateway | GATEWAY | 2.5.1 | 2023-10-19 | 36 | [PDF](https://www.talq-consortium.org/data/downloadables/5/0/7/zhejiang-fonda-technology-co-ltd-fondacity-gateway-2023-10-19-05_08_20056-0200-gateway-talqv251-online2-capabilitylist.pdf) |
| FondaCity-CMS | CMS | 2.6.0 | 2024-06-06 | 36 | [PDF](https://talq-consortium.org/data/downloadables/5/6/2/fixed-zhejiang-fonda-technology-co-ltd-fondacity-cms-2024-06-06-cms-talqv260-online4-log-extended-3-capabilitylist.pdf) |

- Fonda City có mặt trong danh sách sản phẩm TALQ của consortium (thông cáo 01/2024, 09/2024, 10/2025).
- Fonda **không** có tài liệu API riêng công khai (không thấy developer portal, API reference, SDK). **Chắc chắn** trong phạm vi tìm kiếm đã làm.
- Lưu ý: Capability List là danh sách *tính năng*, không phải tài liệu endpoint. Endpoint/payload nằm trong đặc tả TALQ.

### 2.2 Thực tế trên SLCP của Hapulico

**Người dùng xác nhận (2026-10-28):**
- **Gateway là phần cứng đặt trong tủ điện**, không phải dịch vụ cloud. **Chắc chắn**.

**Kiểm tra trên web SLCP (chỉ đọc, 2026-10-28, người dùng tự đăng nhập):**
- **Không có giao diện TALQ.** **Chắc chắn**.
  - Dò toàn bộ 17 file JavaScript của frontend: không có chuỗi "TALQ" (chỉ trùng ký tự ngẫu nhiên như `digitalQuantity`).
  - Đọc toàn bộ menu (GIS, Devices, Alarms, Tasks, Reports, Maintenance, Workorder System, Media Center, System, Third-Party Platform): không có mục TALQ hay Open API.
- **Menu Third-Party Platform** có 4 trang, không trang nào là TALQ:

| Trang (route) | Nội dung | Trạng thái trên Hapulico |
|---|---|---|
| NS Service Configuration (`#/NsServiceConfiguration`) | Kết nối LoRa Network Server bên ngoài. Bảng trái: NS Project Name, Frequency, Interface Location. Bảng phải: gateway (Name, Gateway EUI, Gateway Type), nút Firmware version query, GPS Query. `Gateway Type`: `LIERDA_BASIC`, `TFC_PICO`, `LIERDA_PRO`, `BASIC` | Trống |
| Actility Config (`#/actility`) | Tích hợp Actility ThingPark (LoRaWAN NS thương mại). Platform Configuration: Platform Account, Password, Domain Configuration, Configure Group Number. Platform Gateway: Gateway Name, UID, Gateway Model, Transmission Frequency, FW, Longitude, Latitude, Platform tags, Status; nút Set transmission frequency, Status Query, FW Query, Synchronize Platform Tags | Trống |
| SPON (`#/platformMonitoring/spon`) | Trang trống | Không dùng |
| ISC (`#/platformMonitoring/isc`) | Nhúng iframe trang đăng nhập của một hệ thống trong mạng LAN nội bộ (`/portal/ui/login` trên IP 192.168.x.x), không truy cập được từ ngoài | Không dùng |

- SPON nhiều khả năng là hệ thống phát thanh/loa IP; ISC là nền tảng camera an ninh (kiểu iSecure Center). **Suy luận** từ tên gọi.
- Hướng tích hợp của Fonda: **SLCP gọi ra ngoài** (LoRa NS, Actility, camera, loa), không mở cổng chuẩn cho CMS khác gọi vào. **Suy luận**.
- Fonda hỗ trợ sẵn **LoRaWAN qua NS bên ngoài** (Actility, gateway LoRa của Lierda/TFC). **Chắc chắn** (có màn hình cấu hình); chưa được dùng ở Hapulico.

### 2.3 Suy luận và việc cần làm
- Chứng nhận TALQ của Fonda nhiều khả năng chỉ có ở bản FondaCity cho thị trường khác, hoặc cần Fonda bật riêng; **không tự bật được từ web SLCP**. **Suy luận**.
- Gateway đạt TALQ thường có thuộc tính `cmsUri` (địa chỉ CMS mà gateway gọi lên) và `gatewayUri` (địa chỉ CMS gọi xuống gateway). **Suy luận** từ Capability List (function `Gateway`).
- Nếu gateway trong tủ của Hapulico là model đã chứng nhận và firmware có TALQ, có thể trỏ gateway sang một CMS TALQ do mình tự xây, **không cần reverse giao thức RF/F2/CAT1**. **Suy luận**, chưa kiểm chứng. Lưu ý: trỏ gateway sang CMS khác có thể làm SLCP mất kết nối với đèn — chỉ làm khi người dùng đồng ý và có Fonda xác nhận.
- Việc cần làm:
  1. Đối chiếu model gateway trong tủ với tên "FondaCity-gateway" (hỏi Fonda/đơn vị triển khai).
  2. ~~Tìm trong SLCP cấu hình TALQ~~ — đã làm 2026-10-28, không có (mục 2.2).
  3. Hỏi Fonda: firmware gateway trong tủ có TALQ không, bật bằng cách nào.
  4. Lấy đặc tả TALQ (public spec hoặc thành viên consortium).

---

## 3. Hãng có API công khai hoặc chuẩn mở — đã đọc tài liệu

### 3.1 Signify – Interact City (Hà Lan)
- **Kết nối node**: cellular (LTE-M/NB-IoT), RF mesh, hybrid; năm 2026 ra thêm EasyConnect (hybrid + cellular). **Chắc chắn**.
- **Phần cứng**: driver Philips + node cắm Zhaga-D4i/NEMA → thuộc phương án 2 của mục 1.2 (không phải driver full package). **Suy luận**.
- **API công khai** trên [Interact Developer Portal](https://www.developer.interact-lighting.com/systems/interact-city) → đáp ứng điều kiện (a). Danh mục (**Chắc chắn**):

| API | Chức năng |
|---|---|
| Light Control | Lệnh bật/tắt/dimming theo yêu cầu, ghi đè lịch (sự cố, bảo trì) |
| Fault Monitor | Lỗi/cảnh báo của đèn |
| Energy | Năng lượng theo điểm đèn/vùng, theo giờ → năm |
| Calendars | Bên thứ ba tạo/quản lý lịch |
| Asset Management | Đồng bộ tài sản, năng lượng, lỗi |
| Asset Real-time Properties | Trạng thái thời gian thực |
| Asset Switch Logs | Lịch sử chuyển mức dimming và nguyên nhân |

- Mỗi khách hàng có một site Interact City với credential riêng; cổng dành cho đối tác/nhà phát triển đăng ký, có sandbox. **Chắc chắn**.
- Đạt chứng nhận TALQ (Interact City, PLANet Telensa). **Chắc chắn**.
- **Chưa biết**: endpoint, schema, cách xác thực — cần đăng ký tài khoản developer.

### 3.2 LiCON – Nanjing LiCON IoT Technology (Trung Quốc)
- **Node**: SLC12 (Zhaga), SLC11/SLC1 (NEMA). Kết nối trực tiếp 4G Cat.1/NB-IoT, hoặc qua bộ tập trung/gateway bằng ZigBee/LoRa; SLC1 còn có RS-485, HPLC; dimming 0–10V/PWM. **Chắc chắn** (trang hội chợ HKTDC). Thuộc phương án 2 của mục 1.2.
- **Nền tảng**: LiLAMP (chiếu sáng), LiPOLE (cột thông minh), LiPLUS (CMS tổng, microservice, triển khai cloud hoặc tại chỗ, có work order, quản lý tài sản, điện năng). **Chắc chắn** (licon-iot.com).
- Kiến trúc gần giống Fonda (Cat.1 trực tiếp hoặc RF qua bộ tập trung). **Suy luận**.
- **TALQ**: LiLAMP đạt chứng nhận TALQ 2.6.3 vai trò **GATEWAY**, ngày 2025-08-14, 60 test ([Capability List](https://www.talq-consortium.org/data/downloadables/6/9/5/nanjing-licon-iot-technology-coltd-lilamp-2025-08-14-15_51_51357-0800-gateway-talqv263-online1-capabilitylist.pdf)) → đáp ứng điều kiện (b): có thể tự build CMS nói TALQ. **Chắc chắn**. Nội dung chính:
  - Services: Configuration (commissioning, phân trang thiết bị), Control (`ccDate`, `ccDay` đầy đủ), Data Collection (EventRecording/VendorRecording/ImmediateReporting), On-Demand Data Request, Group Management, Data Package Transfer (firmware).
  - Functions: `Basic`, `Communication`, `Gateway`, `Time`, `LampActuator` (`targetLightCommand`, `feedbackLightCommand`, `actualLightState`, `calendarID`), `LampMonitor` (supplyVoltage, supplyCurrent, activePower, reactivePower, powerFactor, activeEnergy; sự kiện `lampFailure`, `controlGearCommFailure`, `supplyLoss`, `contactorError`, `lampUnexpectedOn`, `leakageDetected`), sensor ánh sáng/nhiệt/PM/vị trí/mực nước/khí/tiếng ồn/khí quyển/gió/mưa/bức xạ.
  - Kịch bản: điều khiển tay đơn/nhóm (delay, ramp), lịch cố định/thiên văn/photocell/part-night, ngoại lệ theo khoảng ngày và thứ, dimming theo cảm biến, ngưỡng cảnh báo điện.
- API/SDK riêng: hãng quảng cáo "CMS bên thứ ba qua API/SDK". Tài liệu: **Chưa biết** (không công khai; licon-iot.com chặn đọc tự động). Liên hệ: allen@licon-iot.com (email công khai trên trang Light+Building).

---

## 3A. Driver full package (tích hợp điều khiển + truyền thông trong một thiết bị)

*Khảo sát 2026-10-28 theo yêu cầu ưu tiên ở mục 1.2.*

### 3A.1 MOSO – dòng "IoT LED Driver" I6 (4G Cat.1) — ứng viên chính

**Nguồn: catalog chính thức MOSO "Outdoor LED Driver Product Catalog 2026 V1.0", trang 25. Chắc chắn.**

Thông số (đọc từ catalog):

| Model | Công suất | Dải điện áp ra | Dòng ra chỉnh được | Truyền thông | Hiệu suất | PF |
|---|---|---|---|---|---|---|
| I6-075C056 | 75 W | 28–56 V | 1,35–2,15 A | 4G Cat.1 | 90,0 % | 0,97 |
| I6-075C108 | 75 W | 54–108 V | 0,70–1,05 A | 4G Cat.1 | 89,5 % | 0,97 |
| I6-100C056 | 100 W | 28–56 V | 1,80–2,85 A | 4G Cat.1 | 90,0 % | 0,97 |
| I6-100C143 | 100 W | 72–143 V | 0,70–1,05 A | 4G Cat.1 | 91,0 % | 0,97 |
| I6-150C056 | 150 W | 28–56 V | 2,70–4,30 A | 4G Cat.1 | 92,0 % | 0,97 |
| I6-150C214 | 150 W | 107–214 V | 0,70–1,05 A | 4G Cat.1 | 92,5 % | 0,97 |
| I6-200C056 | 200 W | 28–56 V | 3,57–5,70 A | 4G Cat.1 | 92,0 % | 0,97 |
| I6-200C286 | 200 W | 143–286 V | 0,70–1,05 A | 4G Cat.1 | 93,5 % | 0,97 |
| I6-240C056 | 240 W | 28–56 V | 4,30–6,30 A | 4G Cat.1 | 93,0 % | 0,97 |
| I6-240C343 | 240 W | 171–343 V | 0,70–1,05 A | 4G Cat.1 | 93,5 % | 0,97 |

Tính năng catalog nêu (dấu * = tùy chọn theo ghi chú "Optional functions" của catalog):
- Điện áp vào 90–305 Vac; chống sét DM 6 kV / CM 10 kV; bảo vệ vào UVP/OVP, ra SCP/OVP/OTP.
- **Điều khiển:** remote control, intelligent strategy (chiến lược thông minh), data collection (thu thập dữ liệu), power statistics (thống kê điện năng). Hỗ trợ chạy offline theo chiến lược.
- **Mạng:** automatic networking, wireless dual mode*, quick response, remote OTA.
- **Cảnh báo:** fault alarm, power-off alarm, tilt alarm*, light-out alarm.
- **Giá trị gia tăng:** edge computing, motion sensing*, **protocol customization***, "free traffic".
- Mô tả của hãng: sản phẩm "thiết kế riêng cho đèn đường thông minh", và "theo định nghĩa chức năng của nền tảng phần mềm, cung cấp giải pháp ứng dụng tích hợp phần cứng–phần mềm" → **thiết bị cần một nền tảng phần mềm đi kèm**.

Đối chiếu với tiêu chí (mục 1.2):
- **Phần cứng ưu tiên 1: đạt.** Một thiết bị duy nhất gồm nguồn LED + điều khiển + dimming + đo điện + truyền thông WAN.
- **Phần mềm (a)/(b): chưa xác nhận.**
  - Nền tảng: MOSO giới thiệu "giải pháp nguồn tích hợp điều khiển thông minh" (IOT LED DRIVER SOLUTION) gồm "phần cứng + phần mềm + dịch vụ", nối qua 4G Cat.1 tới nền tảng phần mềm chiếu sáng thông minh và nền tảng thành phố (nguồn: STCN 2024, blog MOSO 10/2025). Câu về mô hình hợp tác "1+N" trong bài STCN bị cắt giữa chừng, chưa đọc được trọn. **Chắc chắn** về việc có giải pháp phần mềm; **Chưa biết** nền tảng đó có API công khai hay không.
  - Giao thức thiết bị ⇄ nền tảng (MQTT/TCP/HTTP, payload): **Chưa biết**.
  - Mục "protocol customization*" gợi ý hãng có thể điều chỉnh giao thức theo khách → có thể mở đường để thiết bị nói chuyện với CMS tự build. **Suy luận**, cần hỏi hãng.
  - "Free traffic": có vẻ là kèm lưu lượng SIM. **Suy luận**.
  - "Wireless dual mode*": chưa rõ nghĩa (Cat.1 + chế độ không dây nội bộ?). **Chưa biết**.
- Giao diện dimming giữa nguồn và LED, băng tần Cat.1 hỗ trợ ở Việt Nam, chuẩn D4i/DALI của dòng I6: **Chưa biết** (catalog không nêu cho dòng I6).
- Hãng có cơ sở sản xuất tại Việt Nam (catalog: Shenzhen R&D, Huizhou, Vietnam). **Chắc chắn.** Khả năng hỗ trợ/giao hàng thuận tiện hơn: **Suy luận**.
- Liên hệ (catalog): info@mosopower.com · +86-755-27657000 · led.mosopower.com.

### 3A.2 Driver được nhắc là "tích hợp" nhưng CHƯA xác minh được

**Nguồn duy nhất: bài "Insight" trên Global Lighting Forum (shine.lighting, đăng 2026-08-03) — nguồn thứ cấp, tác giả là tài khoản của diễn đàn, không trích dẫn tài liệu hãng.** Bài nói Sosen, MOSO và Inventronics ra mắt "integrated smart power supply" gồm nguồn + MCU + module truyền thông + đo điện:

| Hãng | Bài diễn đàn nói | Đối chiếu tài liệu hãng | Kết luận |
|---|---|---|---|
| **MOSO** (X8, X6E-G) | "Integrated smart driver", đo điện, lịch thiên văn | Catalog MOSO 2026: **X8 = DALI-2/D4i** (đo điện, NFC, nguồn phụ 24 V); **X6E-G = driver lập trình được** (0-10V/PWM/Timer). Không có module truyền thông. Chỉ dòng **I6** nằm trong nhóm "IoT LED Driver" | Bài diễn đàn **không chính xác** với X8/X6E-G; đúng với I6 |
| **Inventronics** (EUM) | Tùy chọn NB-IoT và PLC | Datasheet EUM-240SxxxBx: DALI-2 D4i, NFC, nguồn phụ 24 V, đo điện ±1 %, **không nêu module NB-IoT/PLC** | **Chưa xác minh** |
| **Sosen** | LoRa, HPLC, NB-IoT; D4i; 60–320 W | Trang sosen.com chỉ nói driver "IoT ready", có vi xử lý tích hợp để nối vào hệ thống; chưa thấy sản phẩm có module LoRa/NB-IoT | **Chưa xác minh** |

→ Cần hỏi trực tiếp Sosen và Inventronics: có model nào tích hợp sẵn module WAN không, mã model, tài liệu giao thức.

### 3A.3 Driver tích hợp Bluetooth — có thật, nhưng chủ yếu cho trong nhà/thương mại

| Sản phẩm | Nội dung | Ghi chú |
|---|---|---|
| Tridonic basicDIM Wireless (dòng PRE) | Driver tích hợp sẵn module Bluetooth (Casambi-ready), mạng tới 127 thiết bị; SC PRE CC 10–45 W, CV 35–150 W, TW 38 W 2 kênh | Chắc chắn (bài Electrical Connection, không ghi ngày). Công suất thấp–trung |
| Mean Well LCM-40/60BLE | Driver tích hợp Bluetooth mesh, hợp tác với Casambi | Hãng ghi dùng cho đèn trong nhà/thương mại. Chắc chắn |
| Fulham WorkHorse Connected Driver | 40 W, Bluetooth-ready, dimming 0–10V, thêm module SmartLink để bật mesh | Chắc chắn (bài LED Professional 2019) |

- **Suy luận:** công suất thấp và tầm BLE ngắn → không hợp làm đường truyền chính cho đèn đường đô thị; hợp công viên/khuôn viên. Casambi có cloud API và Ethernet gateway cho tích hợp BMS (Chắc chắn, tài liệu Casambi).

### 3A.4 Thiết kế tham chiếu để tự làm driver full package

Dùng khi không mua được sản phẩm thương mại; thuộc điều kiện (b) vì giao thức mở/tự chủ:

| Thiết kế | Nội dung | Ghi chú |
|---|---|---|
| ST SL-LTILT05001V1 | Driver LED 80 W có dimming + ON/OFF, STM32L071 + module sub-1 GHz SPSGRFC-868 (mạng mesh 6LoWPAN); gateway DCU (STM32F401 + BLE BlueNRG-M0); firmware STSW-LLL006FW; app Android qua BLE | Chắc chắn (trang ST). Băng 868 MHz là băng châu Âu; cần kiểm tra băng dùng ở Việt Nam — **Suy luận** |
| Microchip Street Light Smart LED Driver Reference Design | Driver 100 W tuân thủ D4i, PF 0,99, MCU ATSAMD21E18, HV96001 | Chắc chắn (Electronics For You) |
| Microchip `SMART_STREET_LIGHT` (GitHub) | Demo D4i: dữ liệu đẩy qua **LTE-M bằng MQTT** thẳng tới nền tảng Kaa IoT, LoRaWAN qua The Things Network; cấu hình broker/topic bằng lệnh `lte_set_params <URL> <PubTopic> <SubTopic>` qua serial hoặc BLE | Chắc chắn. Là bản demo, không phải sản phẩm thương mại; hữu ích làm mẫu giao thức MQTT mở |
| Renesas LoRaWAN street light controller | Xem mục 4 | |

### 3A.5 Kết luận mục 3A (Suy luận)
- Hiện chỉ có **MOSO I6 (4G Cat.1)** là driver full package có tài liệu chính thức và dùng mạng cellular WAN. Nó đáp ứng tiêu chí phần cứng ưu tiên 1, **nhưng chưa biết đáp ứng điều kiện (a) hay (b)**.
- Việc cần hỏi MOSO:
  1. Tài liệu giao thức thiết bị ⇄ nền tảng (MQTT/TCP/HTTP, định dạng payload, bảo mật).
  2. Nền tảng phần mềm của MOSO/đối tác có API công khai không; hoặc có cho trỏ thiết bị sang server riêng không ("protocol customization").
  3. Băng tần 4G Cat.1 hỗ trợ ở Việt Nam; "wireless dual mode" là gì.
  4. Giao diện dimming và đo điện của I6 (độ chính xác, có D4i không).
  5. Mẫu thử, số lượng đặt tối thiểu, hỗ trợ kỹ thuật tại Việt Nam.

---

## 4. Các hãng khác (chưa đọc tài liệu API chi tiết)

Tất cả các mục dưới đây là **node/bộ điều khiển rời** (phương án 2 của mục 1.2).

| Hãng / sản phẩm | Kết nối node | API / chuẩn mở | Tin cậy |
|---|---|---|---|
| Tvilight – CityManager (OpenSky, SkyLite) | NB-IoT, LTE-M, 2G, RF mesh | Open API, TALQ, uCIFI | Chắc chắn (web hãng); tài liệu cần đăng ký |
| Schréder – OWLET IV + EXEDRA | Wi-SUN mesh + cellular (không cần gateway riêng); BLE cấu hình tại chỗ (app Sirius BLE) | API cho hệ thống bên thứ ba; node cellular hỗ trợ TALQ | Chắc chắn |
| Flashnet – inteliLIGHT | LoRaWAN, NB-IoT, LTE-M, Sigfox, GSM | CMS đạt TALQ; API riêng Chưa biết | Chắc chắn (phần cứng, TALQ) |
| Ubicquia – UbiCell + UbiVu | Cellular, eSIM | OpenAPI công khai về cấu hình/cấp phát (39 operation, `x-api-key`); API điều khiển đèn Chưa biết | Chắc chắn |
| Phoenix Contact | LoRaWAN, node Zhaga D4i | Nền tảng grovez.io; API Chưa biết | Chắc chắn (phần cứng) |
| Nordic Automation Systems (NAS) | LoRaWAN, NB-IoT, LTE-M; Zhaga/NEMA | Payload qua LoRaWAN NS | Chắc chắn (phần cứng) |
| obiWAN | LTE-M/NB-IoT (nRF9160) | Chưa biết | Chắc chắn (phần cứng) |
| CITiLIGHT – VELOCiTI LMS | LoRaWAN, LTE, RF | Chưa biết | Chắc chắn (phần cứng) |
| Weclouds (Thâm Quyến) | LTE, LoRaWAN, 2.4G Mesh, Thread; DALI-2/D4i | Chưa biết | Chắc chắn (phần cứng) |
| "Smart Lighting Node Hybrid Zhaga" (hãng gốc Chưa biết) | Cat-1/Cat-M1 + mesh Sub-GHz 6LoWPAN + BLE 5.2; Zhaga-D4i | Chưa biết | Chắc chắn (datasheet nhà phân phối) |
| Casambi / Olfer CAS-ZHAGA-40-DA-LX | Bluetooth mesh; Zhaga DALI-2/D4i | Casambi cloud API cho BMS | Chắc chắn |
| Silvair / Sunricher | Bluetooth Mesh (SIG) | Chưa biết | Chắc chắn (phần cứng) |
| ORION-NEMA-868, LC-1000, ClodPi LightPi | LoRaWAN (EU868), NEMA, 0/1–10V | Payload qua LoRaWAN NS | Chắc chắn (phần cứng) |
| Renesas (thiết kế tham chiếu) | LoRaWAN, module DTDS-622C | Tham chiếu để tự làm phần cứng | Chắc chắn |

Ghi chú:
- Node LoRaWAN EU868 cần bản **AS923** để dùng ở Việt Nam — chưa xác nhận hãng nào có.
- Danh sách CMS/Gateway khác đạt TALQ (thông cáo 10/2025): Capelon, Datek, Itron (CityEdge), LEC, LED Roadway Lighting, Lumisens, LuxSave, Paradox Engineering, BrightCity, LACROIX City, Leotek, LUG, Novaccess, Seneco.
- TALQ được dùng thực tế: trang inteliLIGHT ghi dự án Brussels (85.000 đèn, bộ điều khiển NEMA, NB-IoT) tích hợp **phần mềm bên thứ ba qua TALQ2**. **Chắc chắn** (web hãng).

---

## 5. Fonda đang làm vs đề xuất

| Khía cạnh | Fonda (theo doc 01–08 và mục 2) | Đề xuất cho hệ thống mới |
|---|---|---|
| API cho bên thứ ba | Không công khai; chỉ có API web nội bộ `/api/v1.0` | API công khai có tài liệu (OpenAPI), như Signify |
| Chuẩn giữa CMS và gateway | Có chứng nhận TALQ nhưng không có trên SLCP của Hapulico | Thiết kế CMS **tuân thủ TALQ** ngay từ đầu |
| Tích hợp bên thứ ba | SLCP gọi ra ngoài: LoRa NS, Actility, camera (ISC), loa (SPON) | Giữ khả năng gọi ra, **thêm** cổng vào chuẩn (TALQ + REST công khai) |
| Phụ thuộc giao thức thiết bị | Giao thức riêng (RF/F2, CAT1) | Gateway/node nào nói TALQ thì dùng được; node LoRaWAN chuẩn thì chỉ cần payload codec |
| Phần cứng đèn | LCU rời + driver (theo datasheet DS-xx) | Ưu tiên driver full package (mục 1.2); hiện có MOSO I6 (4G Cat.1) — cần xác nhận giao thức/API (mục 3A); nếu không đạt, node rời với API mở |

Lý do: TALQ cho phép dùng chung một CMS với thiết bị của nhiều hãng (Fonda, LiCON, Signify…) và tránh bị khóa vào một nhà cung cấp. Nếu gateway Fonda trong tủ bật được TALQ, đây cũng là đường chuyển đổi rẻ nhất cho hạ tầng hiện có. Với driver full package, rủi ro chính là bị khóa vào nền tảng riêng của hãng driver — vì vậy điều kiện (a)/(b) phải được xác nhận bằng văn bản trước khi chọn.

---

## 6. Còn thiếu và cách lấp

| Thiếu | Cách lấp |
|---|---|
| **Giao thức/API của MOSO I6** (thiết bị ⇄ nền tảng; nền tảng có API không; "protocol customization") | Email info@mosopower.com / gọi +86-755-27657000 với 5 câu hỏi ở mục 3A.5 |
| Sosen, Inventronics có driver tích hợp module WAN thật không (mới chỉ có nguồn diễn đàn) | Hỏi trực tiếp hãng, xin mã model và tài liệu giao thức |
| Các hãng driver khác có dòng IoT tích hợp (chưa khảo sát) | Tìm tiếp theo catalog "IoT LED driver" của từng hãng |
| Endpoint, xác thực của Interact City API | Đăng ký developer.interact-lighting.com |
| Tài liệu API/SDK riêng của LiCON | Email hãng xin API document |
| Gateway Fonda trong tủ có TALQ không | Hỏi Fonda (web SLCP không có — đã kiểm tra 2026-10-28) |
| Đặc tả TALQ chi tiết (endpoint, payload) | Tải public spec hoặc tham gia TALQ Consortium |
| Hãng gốc của node Hybrid Zhaga | Tra mã sản phẩm qua nhà phân phối narva.abstore.pl |
| Node LoRaWAN bản AS923; băng tần Cat.1/sub-1GHz dùng ở Việt Nam | Hỏi từng hãng |

---

## 7. Nguồn

- SLCP Hapulico — màn hình Third-Party Platform (NS Service Configuration, Actility Config, SPON, ISC) và bundle JS frontend, xem ngày 2026-10-28
- **Driver full package (mục 3A):**
  - [MOSO Outdoor LED Driver Product Catalog 2026 V1.0 — IoT LED Driver I6, trang 25](https://led.mosopower.com/wp-content/uploads/2026/06/2026%E7%94%B5%E5%AD%90%E7%94%BB%E5%86%8C%E8%8B%B1%E6%96%87%E7%89%88V1-0526%E5%B0%8F%E6%96%87%E4%BB%B6.pdf)
  - [STCN — MOSO 智控一体化电源 (2024)](https://www.stcn.com/article/detail/1230660.html)
  - [MOSO — blog Hong Kong Autumn Fair 2025](https://www.mosopower.com/2025/10/28/2025-%E9%A6%99%E6%B8%AF%E5%B1%95%E9%A6%96%E6%97%A5%E7%83%AD%E5%BA%A6%E6%94%80%E5%8D%87%EF%BC%81%E8%8C%82%E7%A1%95%E7%94%B5%E6%BA%90%E6%96%B0%E5%93%81%E4%B8%8E%E6%96%B9%E6%A1%88%E5%A4%87%E5%8F%97/)
  - [Global Lighting Forum — bài "All-in-One Smart Power Supplies" (nguồn thứ cấp)](https://www.shine.lighting/threads/led-driver-manufacturers-accelerate-shift-to-all-in-one-smart-power-supplies-for-connected-street-lighting.5720/)
  - [Inventronics EUM-240SxxxBx datasheet (TME)](https://www.tme.com/Document/25647994038979a7fa10bbc7a3c9c998/EUM.pdf)
  - [Sosen — trang giới thiệu driver thông minh](https://www.sosen.com/case.html)
  - [Tridonic basicDIM Wireless trong driver](https://electricalconnection.com.au/tridonic-basicdim-wireless-module-integrated-directly-in-the-driver/)
  - [Mean Well LCM-40/60BLE (LEDinside)](https://ledinside.com/products/2026/09/meanwell_lcm4060ble_bluetooth_mesh_led_driver)
  - [Fulham Bluetooth mesh driver (LED Professional)](https://zmi.led-professional.com/Plone/products/led-driver-ics-modules/fulham-demonstrates-sig-qualified-bluetooth-mesh-wireless-lighting-control-system-at-lightfair)
  - [ST SL-LTILT05001V1](https://www.st.com/en/product/sl-ltilt05001v1.html)
  - [Microchip Street Light Smart LED Driver Reference Design](https://www.electronicsforu.com/electronics-projects/street-light-smart-led-driver-reference-design)
  - [Microchip SMART_STREET_LIGHT (GitHub)](https://github.com/MicrochipTech/SMART_STREET_LIGHT)
  - [inteliLIGHT — dự án Brussels qua TALQ2](https://intelilight.eu/)
- [Interact Developer – Interact City](https://www.developer.interact-lighting.com/systems/interact-city)
- [Interact Developer Portal](https://www.developer.interact-lighting.com/)
- [LiLAMP TALQ 2.6.3 Capability List](https://www.talq-consortium.org/data/downloadables/6/9/5/nanjing-licon-iot-technology-coltd-lilamp-2025-08-14-15_51_51357-0800-gateway-talqv263-online1-capabilitylist.pdf)
- [FondaCity-gateway TALQ 2.5.1](https://www.talq-consortium.org/data/downloadables/5/0/7/zhejiang-fonda-technology-co-ltd-fondacity-gateway-2023-10-19-05_08_20056-0200-gateway-talqv251-online2-capabilitylist.pdf)
- [FondaCity-CMS TALQ 2.6.0](https://talq-consortium.org/data/downloadables/5/6/2/fixed-zhejiang-fonda-technology-co-ltd-fondacity-cms-2024-06-06-cms-talqv260-online4-log-extended-3-capabilitylist.pdf)
- [TALQ certified products 10/2025](https://www.talq-consortium.org/data/downloadables/7/0/5/pr-talq-certifications-grow-to-over-70-20251029-zh-hans.pdf)
- [TALQ 2.0 press release](https://www.talq-consortium.org/data/downloadables/9/0/pr-talq-version-2-the-smart-city-protocol-20180316-en.pdf)
- [LiCON products](https://www.licon-iot.com/Products_index.html) · [LiPLUS](https://www.licon-iot.com/Products_de/10.html) · [SLC12 – HKTDC](https://www.hktdc.com/event/hkotlexpo/en/product/1Z03LTQR1)
- [Tvilight controllers](https://tvilight.com/street-light-controller/) · [CityManager](https://tvilight.com/wp-content/uploads/2022/05/CityManager-CMS-Product-Presentation.pdf)
- [Schréder OWLET IV](https://library.schreder.com/view/328240206/8) · [EXEDRA API](https://library.schreder.com/view/596730680/24/)
- [inteliLIGHT FRE-24-Zhaga-M1](https://intelilight.eu/download/3238/lte-m/25142/fre-24-zhaga-m1-luminaire-controller.pdf)
- [Ubicquia API – API Evangelist](https://providers.apievangelist.com/providers/ubicquia/)
- [Phoenix Contact LoRaWAN unit](https://www.phoenixcontact.com/en-nl/lorawan-luminaire-control-unit-for-street-lighting)
- [NAS Zhaga 18](https://www.asmag.com/product_detail.aspx?id=35298) · [obiWAN](https://www.nordicsemi.com/Nordic-news/2024/01/obiWAN-smart-luminaire-controllers-use-Nordic-nRF9160-SiP?lang=en) · [CITiLIGHT](https://www.semtech.com/resources/customer-stories/citilight-smart-sustainable-street-lighting-with-lorawan)
- [Weclouds](https://light-building.messefrankfurt.com/frankfurt/de/ausstellersuche.detail.html/weclouds-technology-co-ltd/mf_1_0052605731_3661882_10000016202401.html) · [Hybrid Zhaga node](https://narva.abstore.pl/product/resource?prid=1479)
- [Casambi overview](https://casambi.com/wp-content/uploads/2023/10/Casambi-System-Overview_EN_v3.1.pdf) · [Olfer CAS-ZHAGA](https://dali-alliance.org/products/9078/cas-zhaga-40-da-lx)
- [ORION-NEMA-868](https://lora-alliance.org/wp-content/uploads/2025/12/ORION_NEMA_868_datasheet.pdf) · [Renesas reference](https://www.renesas.com/en/applications/industrial/building-automation/lorawan-street-light-controller)
- [Tridonic LCO D4i NFC](https://narva.abstore.pl/product/resource?prid=1093) · [Inventronics D4i NFC](https://led-professional.com/products-services/inventronics-introduces-class-i-ii-dali-2-d4i-led-drivers-with-zhaga-compliant-form-factor)
