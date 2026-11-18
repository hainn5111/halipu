# Hướng dẫn cho session làm việc trên repo này

Dự án: web điều khiển chiếu sáng thông minh (SLCP), gọi thẳng API Fonda từ trình duyệt. Mã chính ở `web/` (React + TypeScript + Vite), deploy bằng GitHub Pages.

**Đọc trước khi làm:** [`docs/14-quy-trinh-phat-trien.md`](docs/14-quy-trinh-phat-trien.md) (quy trình, kiến trúc, bài học). Tài liệu API Fonda ở `docs/00`–`13`.

## Quy tắc bắt buộc

1. **Tách nhánh từ `origin/main` mới nhất** cho mọi thay đổi. Không làm tính năng trực tiếp trên `main`.
2. **Chỉ merge vào `main` khi người dùng bảo merge.** Ưu tiên fast-forward (`git push origin HEAD:main` sau khi kiểm tra `main` là tổ tiên). Nếu `main` đã đi xa hơn: merge `main` vào nhánh, test lại rồi mới đẩy. Không force-push, không viết lại lịch sử `main`.
3. **Không tự mở pull request** nếu người dùng chưa yêu cầu.
4. **Không sửa tay nhánh `gh-pages`** (chỉ workflow ghi vào đó).
5. Trước khi push: `cd web && npm run typecheck && npm test && npm run build`.
6. Cloud session **không xoá được nhánh remote** (HTTP 403) → nhờ người dùng xoá qua giao diện GitHub, đừng cố vượt quyền.
7. **Đừng bấm/gọi lệnh điều khiển đèn thật** (`lampControl/unicast/*`, nút Bật/Tắt/Dim/"Đọc trạng thái") trong test hay script. E2E chỉ **đọc**. Tính năng nào gửi lệnh phải có hộp xác nhận.
8. **Không đưa tài khoản/mật khẩu/token vào mã, log hay tin nhắn.** Chỉ dùng secret `FONDA_USER`/`FONDA_PASS` trong CI.
9. **Không dùng iframe** để nhúng trang (cài đặt "Insecure content" không áp dụng cho iframe).
10. Mọi cấu hình có thể đổi theo host nằm ở `web/public/config.json`, không hardcode địa chỉ trong mã.

## Quy trình ngắn

```
tách nhánh → push → Web CI (build+test+e2e chỉ đọc, không deploy)
   → mở PR hoặc chạy tay workflow "Preview" → link /preview/<nhánh>/
   → người dùng test → (khi được bảo) merge vào main → pages.yml deploy ra gốc trang
   → xoá nhánh → preview tự dọn
```

## Kiến trúc trong 5 dòng

- `src/core/`: api, auth, config (nạp `config.json` lúc chạy), store (kho LCU dùng chung), realtime (1 WebSocket dùng chung), liveState, types (kiểu của mình).
- `src/adapters/fonda/`: **mọi đặc thù của Fonda** (tên trường, epoch ms…). Hàm thuần ở `mappers.ts`, `realtime.ts` **phải có test**.
- `src/features/`: mỗi màn hình một thư mục. Thêm tab = thư mục mới + 1 mục trong `src/app/tabs.ts`.
- Router dạng **hash** (`#/gis`), `base: './'` → chạy được ở mọi đường dẫn/host.
- `web/public/scan.html` + `legacy/`: **trang ẩn** để thử nghiệm (không link từ giao diện); `legacy/config.js` là bản sao cấu hình riêng.

## Điều cần nhớ về môi trường

- Môi trường cloud **không truy cập được** Fonda (`159.138.45.45`) lẫn `github.io`. Dữ liệu thật chỉ kiểm được qua **CI** (Actions) → đọc log. Cục bộ thì giả lập API/WebSocket bằng Playwright (`page.route`, `page.routeWebSocket`).
- Trang là https, API là http → người dùng phải bật *Insecure content → Allow* cho `hainn5111.github.io`. Hướng lâu dài: reverse proxy HTTPS (`web/deploy/nginx.conf.example`).
- Trạng thái workflow qua API có thể chậm cập nhật; đừng vội kết luận "treo" hay huỷ run.

## Giao tiếp

Người dùng viết tiếng Việt; giao diện và tài liệu viết tiếng Việt.
