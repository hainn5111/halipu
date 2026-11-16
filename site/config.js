// Cấu hình kết nối Fonda. Public key RSA là khoá CÔNG KHAI (đã nằm sẵn trong bundle login của Fonda), commit được.
window.SLCP_CONFIG = {
  API_BASE: 'http://159.138.45.45:18080',
  RSA_PUBLIC_KEY: '', // dán key lấy từ bundle login Fonda (chuỗi base64 MIGf...)
};
