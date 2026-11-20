# SLCP — Web điều khiển chiếu sáng thông minh

## Dùng ngay
**Link:** https://hainn5111.github.io/halipu/

Trang chạy https còn API Fonda chạy http, nên trình duyệt máy tính cần **cho phép Insecure content** một lần cho trang này:
1. Mở link trên, bấm biểu tượng bên trái thanh địa chỉ → **Site settings**.
2. Tìm **Insecure content** → chọn **Allow**.
3. Tải lại trang (Ctrl+Shift+R) rồi đăng nhập bằng tài khoản Fonda của bạn.

Lưu ý:
- **iPhone/Safari không có cách bật** mục này, Android tuỳ phiên bản Chrome. Hiện nên dùng máy tính. Hướng lâu dài: Fonda bật HTTPS, hoặc có reverse proxy HTTPS (`web/deploy/nginx.conf.example`).
- Muốn không phải bấm trên từng trình duyệt (máy tính do bạn quản trị): đặt chính sách Chrome `InsecureContentAllowedForUrls` = `https://hainn5111.github.io`.
- Nếu trang không đổi sau khi cập nhật, tải lại cứng (Ctrl+Shift+R) vì trình duyệt giữ cache.

> Làm việc trên repo này (người hoặc session Claude): đọc [`docs/14-quy-trinh-phat-trien.md`](docs/14-quy-trinh-phat-trien.md) và [`CLAUDE.md`](CLAUDE.md) trước.

## Cấu trúc
- `web/` — **bản chính đang phát triển**: React + TypeScript + Vite, build tĩnh, không phụ thuộc host (xem `web/README.md`).
- `docs/` — tài liệu API Fonda, thực thể, kiến trúc.
- `e2e/` — smoke test chỉ đọc (Playwright), chạy trong GitHub Actions bằng secret `FONDA_USER` / `FONDA_PASS`.
- `web/public/scan.html` — **trang ẩn** (không có link từ giao diện; chỉ vào khi gõ `/scan.html`) để quét/chọn dự án và thử tính năng test; file phụ thuộc ở `web/public/legacy/`.

## Triển khai và xem thử (GitHub Pages)
Pages phục vụ nhánh `gh-pages` (Settings → Pages → Source: *Deploy from a branch* → `gh-pages` / root).
- **`main` → gốc trang** `https://<user>.github.io/<repo>/` (`pages.yml`): typecheck, test (fail thì dừng, không deploy), build rồi đẩy vào `gh-pages`. Chỉ main được ghi ra gốc.
- **Thử nghiệm** chạy ở localhost (`preview-commit-local.bat`, xem `docs/15-chay-local-sourcetree.md`); không còn bản preview trên GitHub.
- **Web CI** (`web-ci.yml`): build + test, chỉ chạy khi PR ở trạng thái Ready (Draft bị bỏ qua) hoặc chạy tay, không deploy.
