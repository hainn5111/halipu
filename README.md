# hapulico
Lập trình web cho project smart lighting

## Cấu trúc
- `web/` — **bản chính đang phát triển**: React + TypeScript + Vite, build tĩnh, không phụ thuộc host (xem `web/README.md`).
- `site/` — bản vanilla cũ, giữ tới khi chuyển hết sang `web/`.
- `docs/` — tài liệu API Fonda, thực thể, kiến trúc.
- `e2e/` — smoke test chỉ đọc (Playwright), chạy trong GitHub Actions bằng secret `FONDA_USER` / `FONDA_PASS`.

## Triển khai (GitHub Pages)
`pages.yml` build `web/` và phục vụ: bản cũ ở gốc, bản React ở `/next/`. Khi `web/` đủ tính năng sẽ đổi sang phục vụ bản React ở gốc.
