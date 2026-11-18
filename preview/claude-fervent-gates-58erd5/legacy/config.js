// Cấu hình kết nối Fonda. Public key RSA là khoá CÔNG KHAI (đã nằm sẵn trong bundle login của Fonda), commit được.
window.SLCP_CONFIG = {
  // Nhánh này: khoá cứng vào 1 projectId riêng (khác Demo H). Điền ID dự án vào đây; có thể ghi đè tạm bằng ?pid=<id> trên URL.
  PROJECT_ID: '',
  API_BASE: 'http://159.138.45.45:18080',
  RSA_PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoRl/9+QidTl1LLXvNFy3AqIIYB98e23q49Hj5Vjz/0JOXf/P7RIVE8Nt6p7CNY061S9Vt2x57WZssbSk0XbSLRgiB5DFYOLn8nu4HKhTuqo+fnH0K+nidOQgeFFVKFj/N8UTti1FAlsUd3epM6BsO5mVuE/snwEh1MZlUT16mKQIDAQAB',
};
