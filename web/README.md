# halipu-web — Đăng nhập SLCP

BFF Node (không dependency) + 2 trang: `/login` → đăng nhập thành công → `/home`.
Luồng theo `docs/claude/11-api-probe-and-security.md` §3: mã hoá mật khẩu RSA (PKCS#1, như JSEncrypt),
`POST /api/login`, lấy token từ header `authorization`, rồi `GET /api/getUser`. Token Fonda chỉ nằm phía server;
trình duyệt chỉ giữ cookie `sid` HttpOnly.

## Chạy local
```bash
MOCK_LOGIN=1 npm start            # thử không cần Fonda, mật khẩu "demo"
FONDA_RSA_PUBLIC_KEY='<key từ bundle login>' npm start
npm test
```

| Biến | Ý nghĩa |
|---|---|
| `FONDA_BASE_URL` | Mặc định `http://159.138.45.45:18080` |
| `FONDA_RSA_PUBLIC_KEY` | Public key RSA trong bundle login Fonda (base64 hoặc PEM) — **bắt buộc** |
| `MOCK_LOGIN=1` | Bỏ qua Fonda |
| `PORT` | Mặc định 3000 |

## Deploy (`.github/workflows/deploy.yml`)
Push lên `main` → test → build image `ghcr.io/<owner>/<repo>-web` → (tuỳ chọn) SSH vào VPS chạy container.
Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `FONDA_RSA_PUBLIC_KEY`; Variable: `FONDA_BASE_URL`.
Không có `DEPLOY_HOST` thì chỉ dừng ở bước đẩy image.
