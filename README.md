## Cấu trúc
- `web/` — **bản chính đang phát triển**: React + TypeScript + Vite, build tĩnh, không phụ thuộc host (xem `web/README.md`).
- `site/` — bản vanilla cũ, **không còn được deploy**; giữ để tra cứu cho tới khi chuyển đổi xong thì xoá.
- `docs/` — tài liệu API Fonda, thực thể, kiến trúc.
- `e2e/` — smoke test chỉ đọc (Playwright), chạy trong GitHub Actions bằng secret `FONDA_USER` / `FONDA_PASS`.

## Triển khai (GitHub Pages)
`pages.yml` (chạy khi push lên `main` có đổi `web/`) typecheck, test, build rồi phục vụ **bản React ở gốc** `https://<user>.github.io/<repo>/`.
