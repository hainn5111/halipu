# SLCP web (React + TypeScript + Vite)

Bản chính của hệ thống: **bản build thuần tĩnh, không phụ thuộc host**. Bản vanilla cũ ở `../site/` không còn deploy, chỉ giữ để tra cứu tới khi chuyển đổi xong.

## Chạy
```bash
cd web
npm ci
npm run dev        # phát triển
npm test           # kiểm thử đơn vị (adapter, cấu hình)
npm run build      # typecheck + build → dist/
```

## Cấu trúc
```
src/
  core/        api (truyền tải, token), auth, config (nạp config.json lúc chạy), store (kho LCU dùng chung), types (kiểu của mình)
  adapters/    fonda/ — mọi đặc thù của Fonda (tên trường, epoch ms, 2 API danh sách LCU…) nằm ở đây; mappers.ts là hàm thuần có test
  features/    mỗi màn hình một thư mục: login, gis, lcus, lcu-panel (drawer dùng chung)
  app/         tabs.ts (manifest nhóm → tab, tải lười), App.tsx (HashRouter + khung)
public/config.json   cấu hình LÚC CHẠY (đổi host không cần build lại)
deploy/nginx.conf.example   reverse proxy HTTPS mẫu
```
Thêm màn hình mới: tạo `features/<tên>/`, thêm 1 mục vào `app/tabs.ts`.

## Không phụ thuộc host
- `base: './'` + **HashRouter** (`#/gis`): chạy ở thư mục con hay tên miền riêng đều được, không cần rewrite.
- Mọi cấu hình đọc từ `config.json` cạnh `index.html`: `apiBase`, `wsUrl`, `projectId`, `rsaPublicKey`.
- **GitHub Pages (hiện tại, bản React ở gốc trang):** `apiBase` là `http://…` nên trình duyệt chặn (mixed content) → phải bật Site settings → Insecure content → Allow.
- **Khi có máy chủ:** đặt reverse proxy HTTPS (xem `deploy/nginx.conf.example`), đổi `apiBase` thành `/fonda` → hết cần bật Insecure content.

## Đổi backend
Giao diện chỉ gọi `adapters/fonda/index.ts` và nhận kiểu trong `core/types.ts`. Backend riêng = viết adapter mới cùng chữ ký.
