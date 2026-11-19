# 15 — Chạy thử ở localhost (thay cho Preview)

Thử nghiệm hằng ngày chạy trên máy, không tốn minute GitHub Actions. Chỉ `main` mới deploy GitHub Pages (`pages.yml`).

## Cần có
Node.js 18+ (có `npm` trong PATH) và git.

## Chạy bằng SourceTree (Windows) — chọn đúng commit
Tools → Options → Custom Actions → Add:
- Menu caption: `Chạy thử local`
- Script to run: đường dẫn tới `chay-local.bat` trong repo
- Parameters: `$SHA` (chỉ SHA, không dùng `$REPO` vì đường dẫn có dấu cách bị tách)
- Bỏ chọn "Run silently"

Dùng: **chuột phải vào commit trong danh sách log → Custom Actions → Chạy thử local**. Script không đổi nhánh/thư mục làm việc của bạn: nó tạo `git worktree` riêng ở `.local-build\<sha7>`, `npm ci` (lần đầu cho commit đó), build với `VITE_BUILD_INFO=<nhánh>@<sha7>` (hiện ở chân trang), rồi mở trình duyệt. Đóng cửa sổ console để dừng; cổng được in trong console (mặc định 8080, bận thì tự nhảy cổng kế).
Bấm đúp `chay-local.bat` (không tham số) = chạy commit HEAD hiện tại. Dọn bản cũ: xoá thư mục `.local-build` rồi `git worktree prune`.

## Lưu ý
- `localhost` được coi là nguồn an toàn nên không bị chặn mixed content khi gọi API http của Fonda.
- Lệnh điều khiển đèn thật vẫn phải có hộp xác nhận.
- Kiểm tra trước khi push: `cd web && npm run typecheck && npm test && npm run build`.
- `Web CI` chỉ chạy khi mở PR hoặc chạy tay; `Preview` chỉ chạy tay.
