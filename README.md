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
- **Web CI** (`web-ci.yml`): build + test, chỉ chạy khi mở PR hoặc chạy tay, không deploy.
