# 15 — Chạy thử ở localhost (thay cho Preview)

Thử nghiệm hằng ngày chạy trên máy, không tốn minute GitHub Actions. Chỉ `main` mới deploy GitHub Pages (`pages.yml`).

## Cần có
Node.js 18+ (có `npm` trong PATH) và git.

## Chạy bằng SourceTree (Windows)
Tools → Options → Custom Actions → Add:
- Menu caption: `Chạy thử local`
- Script to run: đường dẫn tới `chay-local.bat` trong repo
- Parameters: `$REPO`
- Bỏ chọn "Run silently"

Checkout nhánh cần thử, rồi Actions → Custom Actions → `Chạy thử local`. Script chạy `npm ci` (nếu chưa có `node_modules`), `npm run build`, rồi mở `http://localhost:8080`. Đóng cửa sổ console để dừng.
Cũng có thể bấm đúp `chay-local.bat`. Sau khi đổi `package-lock.json`, xoá thư mục `web/node_modules` để cài lại.

## Lưu ý
- `localhost` được coi là nguồn an toàn nên không bị chặn mixed content khi gọi API http của Fonda.
- Lệnh điều khiển đèn thật vẫn phải có hộp xác nhận.
- Kiểm tra trước khi push: `cd web && npm run typecheck && npm test && npm run build`.
- `Web CI` chỉ chạy khi mở PR hoặc chạy tay; `Preview` chỉ chạy tay.
