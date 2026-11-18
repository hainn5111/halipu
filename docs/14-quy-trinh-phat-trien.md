# 14 — Quy trình phát triển, kiến trúc web và bài học vận hành

Tài liệu cho **bất kỳ ai (hoặc session Claude nào) tiếp tục làm việc trên repo này**. Đọc xong là biết: cấu trúc, cách làm một thay đổi từ đầu đến khi lên trang chính, những điều đã biết (và đã mất công mới biết).

> Các tài liệu `00`–`13` mô tả **API Fonda**. Tài liệu này mô tả **cách làm việc trên mã nguồn của chúng ta**.

## 1. Bức tranh tổng thể

- `web/` là ứng dụng chính: **React 18 + TypeScript + Vite**, build ra **tệp tĩnh thuần** (không có máy chủ riêng, không phụ thuộc host).
- Ứng dụng gọi **thẳng API Fonda từ trình duyệt** (REST + WebSocket). Không có backend của mình.
- Trang chính chạy trên **GitHub Pages**: `https://hainn5111.github.io/halipu/`.
- Bản vanilla cũ (`site/`) đã chuyển hết sang React và đã xoá; mã cũ xem lại trong lịch sử git nếu cần tra cứu.

## 2. Vòng đời của một thay đổi

```
tách nhánh từ main ──► push ──► Web CI tự chạy (build + test + e2e chỉ đọc, KHÔNG deploy)
                          │
                          ├─► mở PR  ──► Preview tự deploy + đăng link vào PR
                          │   (hoặc chạy tay Preview cho nhánh chưa có PR)
                          │
                 test trên link preview ──► merge vào main ──► pages.yml deploy ra GỐC trang
                                                                 │
                                       xoá nhánh ──► Preview tự dọn thư mục preview của nhánh đó
```

**Quy tắc:**
1. **Không bao giờ làm việc trực tiếp trên `main`** cho tính năng. Tách nhánh từ `main` mới nhất (`git fetch` rồi tách từ `origin/main`).
2. Chỉ `main` được đổi trang chính. Nhánh khác chỉ có link preview riêng.
3. Merge vào `main` **chỉ khi người dùng bảo merge**. Ưu tiên fast-forward (`git push origin HEAD:main` sau khi kiểm tra `main` là tổ tiên của nhánh). Nếu `main` đã đi xa hơn, merge `main` vào nhánh trước, giải quyết xung đột, test lại, rồi mới đẩy.
4. Không force-push, không viết lại lịch sử `main`.
5. Không tự mở pull request nếu người dùng chưa yêu cầu.
6. Sau khi merge, nhánh được xoá (preview của nó tự dọn). **Phiên chạy trên cloud không xoá được nhánh remote** (HTTP 403) → đề nghị người dùng xoá bằng giao diện GitHub (trang `…/branches`).

### Lệnh nhanh
```bash
cd web
npm ci
npm run dev          # phát triển cục bộ
npm test             # 27 bài kiểm thử đơn vị (vitest)
npm run typecheck
npm run build        # typecheck + build → dist/
```
Trước khi push luôn chạy `npm run typecheck && npm test && npm run build` trong `web/`.

## 3. Ba workflow (`.github/workflows/`)

| File | Khi nào chạy | Làm gì | Deploy? |
|---|---|---|---|
| `web-ci.yml` | Push lên **mọi nhánh** có đổi `web/`, hoặc chạy tay | typecheck → test → build → e2e chỉ đọc (cần secret) → lưu artifact (`web-dist`, ảnh chụp) | Không |
| `pages.yml` | Push lên `main` có đổi `web/`, hoặc chạy tay | typecheck/test/build rồi đẩy vào nhánh `gh-pages` ở **gốc**, giữ nguyên `preview/` | Có, ra gốc trang |
| `preview.yml` | Mở/cập nhật/đóng PR (cùng repo), chạy tay, xoá nhánh | Build rồi đẩy vào `gh-pages` ở `preview/<tên-nhánh>/`, đăng/cập nhật link trong PR; đóng PR hoặc xoá nhánh thì xoá thư mục preview | Có, ra thư mục preview |

- Link preview: `https://hainn5111.github.io/halipu/preview/<tên-nhánh>/` (tên nhánh viết thường, ký tự lạ thành `-`; `feature/abc` → `feature-abc`).
- **Chạy tay preview cho nhánh chưa có PR:** Actions → *Preview* → *Run workflow* → chọn nhánh. (Với Claude: công cụ `run_workflow` với `ref` là tên nhánh; nhánh tách từ `main` đã có sẵn file workflow nên chạy được.)
- `pages.yml` và `preview.yml` cùng ghi vào `gh-pages` nên dùng chung nhóm `concurrency` (xếp hàng, không song song).
- PR từ **fork** bị bỏ qua có chủ đích (không cấp quyền ghi/secret cho mã lạ).
- Người có quyền ghi vào repo thì workflow của họ **đọc được secret** → chỉ cấp quyền ghi cho người tin cậy. Khi có cộng tác viên nên đưa secret vào *Environment có duyệt*.

### Nhánh `gh-pages`
- **Không ai sửa tay.** Chỉ chứa kết quả build do workflow ghi: gốc = bản chính, `preview/*` = bản xem thử.
- Cài đặt Pages (đã đặt): Settings → Pages → Source = *Deploy from a branch* → `gh-pages` / root.
- `.nojekyll` (trong `web/public/`) giữ nguyên để GitHub không xử lý Jekyll.

## 4. Cấu trúc thư mục

```
.github/workflows/   web-ci.yml  pages.yml  preview.yml
docs/                tài liệu API Fonda (00–13) + tài liệu này (14)
e2e/web-smoke.js     smoke test chỉ đọc (Playwright) chạy trong CI
web/
  index.html  package.json  vite.config.ts  tsconfig.json
  deploy/nginx.conf.example   reverse proxy HTTPS mẫu (cho tương lai)
  public/
    config.json        CẤU HÌNH LÚC CHẠY (apiBase, wsUrl, projectId, rsaPublicKey) — đổi host không cần build lại
    scan.html + legacy/   TRANG ẨN (xem mục 7)
    .nojekyll
  src/
    main.tsx           khởi động: nạp config.json rồi dựng giao diện
    app/               App.tsx (khung + router), tabs.ts (manifest nhóm → tab)
    core/              api · auth · config · store · realtime · liveState · types
    adapters/fonda/    index.ts (gọi API) · mappers.ts · realtime.ts  ← mọi đặc thù của Fonda nằm đây
    features/          login · gis · lcus · lcu-panel
    styles.css
```

### Nguyên tắc kiến trúc (giữ khi mở rộng)
1. **Không phụ thuộc host:** `base: './'` + `HashRouter` (`#/gis`). Cấu hình đọc từ `config.json` lúc chạy. Không hardcode địa chỉ trong mã.
2. **Adapter chống ăn mòn:** giao diện chỉ gọi `adapters/fonda/index.ts` và dùng kiểu trong `core/types.ts`. Tên trường, epoch mili-giây, hai API danh sách LCU… chỉ xuất hiện ở `adapters/fonda/`. Hàm chuyển đổi nằm ở `mappers.ts` là **hàm thuần có test**.
3. **Kho dùng chung:** danh sách LCU nằm ở `core/store.ts`, một kết nối WebSocket ở `core/realtime.ts`. Màn hình không tự gọi lại cùng dữ liệu.
4. **Mỗi màn hình một thư mục** trong `features/`, tải lười.
5. **Không dùng iframe** để nhúng trang khác (xem bài học ở mục 6).

### Thêm một tab mới
1. Tạo `web/src/features/<tên>/<Tên>.tsx` (component mặc định export).
2. Thêm mục vào `web/src/app/tabs.ts`: `{ id, label, view: lazy(() => import('../features/<tên>/<Tên>')) }` trong đúng nhóm.
3. Cần dữ liệu mới từ Fonda → thêm hàm vào `adapters/fonda/index.ts`, hàm chuyển đổi vào `mappers.ts`, **kèm bài kiểm thử**.
4. Chạy `npm run typecheck && npm test && npm run build`.

## 5. Kiểm thử

- **Đơn vị (vitest):** `*.test.ts` cạnh mã. Ưu tiên test hàm thuần (mappers, parse khung WebSocket, liveState, config). Tránh import thứ gì kéo theo `jsencrypt` (cần `window`) vào file test — tách hàm thuần ra file riêng.
- **E2E chỉ đọc (`e2e/web-smoke.js`):** đăng nhập thật bằng secret `FONDA_USER`/`FONDA_PASS`, đọc GIS → drawer → lịch sử → tab LCU, in kết quả ra log. Chạy trong `web-ci.yml`. Nếu không có secret thì tự `SKIP`.
- **Tuyệt đối không** để e2e bấm Bật/Tắt/Dim hoặc **"Đọc trạng thái"**: nút cuối gửi lệnh `queryStatus` xuống đèn thật. Mọi lệnh điều khiển trong giao diện đều có hộp xác nhận "Gửi lệnh THẬT xuống đèn".
- Tài khoản trong secret nên là **tài khoản chỉ đọc/thử**.

### Chẩn đoán khi không truy cập được server
Môi trường cloud của Claude **không kết nối được** tới Fonda (`159.138.45.45`) và cũng không mở được `github.io`. Cách làm đã chứng minh hiệu quả:
- Dùng **CI (GitHub Actions)** làm nơi chạy với Fonda thật; đọc log để biết kết quả.
- Cục bộ: dựng bản build, phục vụ bằng `python3 -m http.server`, dùng Playwright với `page.route(...)` giả lập API và `page.routeWebSocket(...)` giả lập WebSocket. Kiểm tra giao diện, luồng chuyển hướng, trạng thái.
- Đọc log CI qua công cụ `get_job_logs` với `return_content` + `tail_lines`; log dài bị cắt giữa → đọc từ bản đã lưu và lọc dòng `[web-e2e]`.
- Trạng thái run qua API đôi khi **chậm cập nhật**: đừng vội kết luận "treo". Nhìn thời gian bắt đầu thực tế trước khi huỷ.

## 6. Bài học kỹ thuật (đã trả giá để biết)

### Trang https gọi API http (mixed content)
- Trang trên GitHub Pages là **https**, API Fonda là **http** → trình duyệt chặn (`Failed to fetch`, `mixed-content`).
- Người dùng phải bật **Site settings → Insecure content → Allow** cho `hainn5111.github.io`. Cài đặt này áp dụng theo origin nên dùng chung cho cả bản chính và các preview.
- **Cài đặt này KHÔNG áp dụng cho iframe** → vì thế không nhúng trang bằng iframe. (Đã từng thử, lỗi.)
- `new WebSocket("ws://…")` từ trang https có thể **ném lỗi ngay** → luôn bọc `try/catch`, không để làm hỏng phần còn lại của trang (`core/realtime.ts` đã làm vậy).
- CI/Playwright không giả lập được cài đặt này, nên không test được đăng nhập trên trang https từ CI. Test với bản chạy `http://localhost`.
- **Giải pháp triệt để (tương lai):** reverse proxy HTTPS trước API (`web/deploy/nginx.conf.example`), đặt `"apiBase": "/fonda"` trong `config.json`.

### Đặc thù API Fonda đã xác nhận
- **Danh sách LCU** đến từ **hai API**: `lcuActor/page` và `lcuActor/getLcuListByProjectId`. LCU vừa tạo lại có thể chỉ xuất hiện ở API thứ hai. Gộp theo `uid`.
- **Toạ độ** (`lat`, `lng`) và `deviceConfig.lampPower` (công suất định mức) lấy từ `lcuActor/queryLcuAndRelatedByUid/{uid}`.
- **Lịch sử đo** từ `energy/getLcuDataTrend`. Payload đúng (bắt từ web gốc): `startDate`/`endDate` là **epoch mili-giây**; kèm `queryType: 2`, `type: 1`, `ctype: 53`, `maxchannel: 1`, `channel: ""`, `lcuId`, `lcuName`, `luid`, `uid`, `projectId`. Trả các mảng song song `date, p, u, i, e, pf, wp, dim`.
- **Trạng thái đèn** từ `lcuLight/queryLcuLightByLcuIdAndNum`.
- **Lệnh điều khiển:** `lampControl/unicast/{turnOn|turnOff|dimming|queryStatus}`; `projectId` đặt trong body, không đặt header. Đây là **lệnh thật**.
- **WebSocket realtime** `ws://<host>:81/clesws`: đăng nhập bằng khung `{cmd:'session', ctrl:'login', Authorization: <token>}` (thử nhiều dạng nếu 401 — xem `adapters/fonda/realtime.ts`). Khung dùng: `lampControl/status` (dim/bật-tắt từng kênh), `lampControl/data` (đo điện), `lampControl/unicastStatus` (phản hồi lệnh). Khoá theo `deviceId` = `lcuId`.
- Xoá LCU trên Fonda **xoá luôn bản ghi cấu hình**; tạo lại sẽ có `lcuId` mới và **không tự nối** với lịch sử cũ.
- `projectId` cố định: `?pid=` trên URL > `pid_fixed` trong localStorage (chọn từ `scan.html`) > `config.json`. Khi đang khoá theo `pid_fixed`, thanh trên cùng hiện nhãn "Dự án cố định" kèm nút **Bỏ**.

## 7. Trang ẩn `scan.html`

- Đường dẫn `/scan.html`, **không có link từ giao diện**, có `noindex,nofollow`. Dùng để quét/chọn dự án và là chỗ thử tính năng test.
- Là trang **thuần (vanilla)**, độc lập với React, file phụ thuộc ở `web/public/legacy/` (`api.js`, `config.js`, `style.css`).
- `legacy/config.js` là **bản sao riêng** của cấu hình, **không đọc `config.json`** của app → khi đổi host API phải sửa cả hai nơi.
- Khi bấm "Chọn" một dự án, trang ghi `pid_fixed` rồi chuyển vào `./#/lcus`.
- Mọi tính năng thử nghiệm có gửi lệnh xuống đèn thật phải có bước xác nhận.

## 8. Việc còn lại / ý tưởng

- **Nhóm "Công cụ dò (chỉ preview)"** (tab Dò API…): chỉ có khi build với `VITE_ENABLE_PROBE=1` (`preview.yml` đặt; `pages.yml`/main thì không → không có tab lẫn mã trong bundle) hoặc `npm run dev`. Công cụ dò/đọc dữ liệu mới thêm vào nhóm này trong `src/app/tabs.ts`, mã ở `features/probe/`, hàm gọi API ở `adapters/fonda/probe.ts`. Chỉ gọi API đọc.
- Điều hướng bên trái: nhóm xổ/thu được (nhớ trong localStorage `nav_open`), nhóm chứa tab đang mở luôn xổ.
- Loại thiết bị, tab thiết bị và template model: xem `15-loai-thiet-bi-va-template.md`.
- Các tab hiện chỉ có nhãn "sắp có": Tổng quan, Cảnh báo, Nhóm đèn, Lịch điều khiển, Báo cáo.
- Đổi sang **proxy HTTPS** khi có máy chủ (bỏ nhu cầu bật Insecure content).
- Dịch vụ thu thập lịch sử chạy 24/7 nếu cần dữ liệu khi không mở web (hiện lịch sử lấy từ server Fonda).
- Bật branch protection cho `main` nếu có thêm người cùng làm.
