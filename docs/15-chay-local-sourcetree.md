# 15 — Chạy ở localhost (thay cho Preview)

Thử nghiệm hằng ngày chạy trên máy, không tốn minute GitHub Actions. Merge vào `main` chỉ chạy CI; GitHub Pages chỉ deploy khi đánh tag `v*` hoặc chạy tay `pages.yml`.

## Cần có
Node.js 18+ (có `npm` trong PATH) và git.

## Hai cách chạy
| Mục đích | File | Ghi chú |
|---|---|---|
| Đang viết code, lưu file là trang tự cập nhật | `dev-local.bat` | `npm run dev` (HMR), dùng thẳng `web\`, gồm cả thay đổi chưa commit, cổng 5173 |
| Xem một commit cụ thể, giống bản deploy | `preview-commit-local.bat` | build từ commit (xem dưới), không thấy thay đổi chưa commit |

Cả hai bấm đúp là chạy; đóng cửa sổ console để dừng.

## Preview commit bằng SourceTree (Windows) — chọn đúng commit
Tools → Options → Custom Actions → Add:
- Menu caption: `Preview commit local`
- Script to run: đường dẫn tới `preview-commit-local.bat` trong repo
- Parameters: `$SHA` (chỉ SHA, không dùng `$REPO` vì đường dẫn có dấu cách bị tách)
- Bỏ chọn "Run silently"

Dùng: **chuột phải vào commit trong danh sách log → Custom Actions → Preview commit local**. Script không đổi nhánh/thư mục làm việc của bạn: nó tạo `git worktree` riêng ở `.local-build\<sha7>`, `npm ci` (lần đầu cho commit đó), build với `VITE_BUILD_INFO=<nhánh>@<sha7>` (hiện ở chân trang), rồi mở trình duyệt. Đóng cửa sổ console để dừng; cổng được in trong console (mặc định 8080, bận thì tự nhảy cổng kế).
Bấm đúp `preview-commit-local.bat` (không tham số) = chạy commit HEAD hiện tại. Dọn bản cũ: xoá thư mục `.local-build` rồi `git worktree prune`.

## Thử project khác (GIS + scan.html)
- **GIS**: ô "ProjectID" ở góc trên bên trái bản đồ. **Chỉ có ở bản preview/dev** (`PREVIEW_TOOLS`, giống tab Dò API); bản deploy chính thức từ `main` không hiện. Nhập một hoặc nhiều ID (cách nhau dấu phẩy) → **Tải**: ghim ID vào `localStorage` (`pid_fixed`), tải lại trang và chỉ nạp LCU của các dự án đó. Header hiện "Dự án cố định xxxxxxxx" và nút **Bỏ** để quay lại tự dò. Chạy y hệt ở `dev-local.bat` (http://localhost:5173/#/gis).
- **Trang ẩn `scan.html`**: mở `http://localhost:5173/scan.html` (dev) hoặc `<gốc trang>/scan.html` (bản deploy). Dùng chung phiên đăng nhập với app, nên đăng nhập app trước. Danh sách dự án lấy từ hồ sơ, có ô nhập ID tay, "Quét", "Chọn" (ghim rồi nhảy sang `#/lcus`).

## Lưu ý
- `localhost` được coi là nguồn an toàn nên không bị chặn mixed content khi gọi API http của Fonda.
- Lệnh điều khiển đèn thật vẫn phải có hộp xác nhận.
- Kiểm tra trước khi push: `cd web && npm run typecheck && npm test && npm run build`.
- `Web CI` chạy khi PR Ready, push vào `main` hoặc chạy tay; Preview đã bỏ.

## Dev bằng SourceTree (tuỳ chọn)
Thêm Custom Action thứ hai: caption `Dev local`, Script = `dev-local.bat`, Parameters để trống.
