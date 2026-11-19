import { useMemo, useState } from 'react';
import { captureScript } from './captureSnippet';

// Hướng dẫn + đoạn script bắt request của web Fonda gốc (xem captureSnippet.ts).
export default function Capture() {
  const script = useMemo(captureScript, []);
  const [copied, setCopied] = useState(false);
  return (
    <div className="lcus"><div className="listwrap" style={{ maxWidth: 900 }}>
      <p className="sub">Bắt body của các thao tác <b>thêm / sửa / xoá / gắn thiết bị</b> trên web Fonda gốc để biết đúng cấu trúc API ghi. Công cụ chỉ ghi lại, không tự gọi gì.</p>
      <ol style={{ lineHeight: 1.7, paddingLeft: 20 }}>
        <li>Mở web Fonda gốc (<code>http://159.138.45.45:81</code>), đăng nhập, bấm <b>F12 → Console</b>.</li>
        <li>Bấm <b>Sao chép script</b> bên dưới, dán vào Console rồi Enter. Góc phải dưới hiện nút cam <b>⬇ Capture</b>.</li>
        <li>Tự thao tác trên web gốc, <b>chỉ dùng dữ liệu thử</b> (ví dụ tạo cột thử, gắn Đèn 3 vào LCU thử, tạo/sửa/xoá một model thử). Thao tác này chạy thật trên Fonda.</li>
        <li>Bấm nút cam để tải <code>fonda-capture-….json</code> rồi gửi cho Claude. Muốn tải cả request đọc: gõ <code>__capture.download(true)</code>.</li>
      </ol>
      <p className="sub">Script không đọc header (không có token). Khoá tên giống <code>pass/token/secret/authorization/cookie</code> bị che thành <code>&lt;redacted&gt;</code>; request <code>login</code> bị bỏ qua. Body còn lại giữ nguyên (có id thiết bị của bạn).</p>
      <button onClick={() => { void navigator.clipboard.writeText(script).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}>{copied ? 'Đã sao chép ✓' : 'Sao chép script'}</button>
      <textarea readOnly value={script} onFocus={e => e.currentTarget.select()} style={{ display: 'block', width: '100%', height: 160, marginTop: 12, fontSize: 11, fontFamily: 'monospace' }} />
    </div></div>
  );
}
