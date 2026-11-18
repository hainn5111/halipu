## Cấu trúc
- `web/` — **bản chính đang phát triển**: React + TypeScript + Vite, build tĩnh, không phụ thuộc host (xem `web/README.md`).
- `docs/` — tài liệu API Fonda, thực thể, kiến trúc.
- `e2e/` — smoke test chỉ đọc (Playwright), chạy trong GitHub Actions bằng secret `FONDA_USER` / `FONDA_PASS`.
- `web/public/scan.html` — **trang ẩn** (không có link từ giao diện; chỉ vào khi gõ `/scan.html`) để quét/chọn dự án và thử tính năng test; file phụ thuộc ở `web/public/legacy/`.

## Triển khai (GitHub Pages)
`pages.yml` (chạy khi push lên `main` có đổi `web/`) typecheck, test, build rồi phục vụ **bản React ở gốc** `https://<user>.github.io/<repo>/`.
