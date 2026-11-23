import { useMemo, useState } from 'react';
import { captureScript } from './captureSnippet';
import { formScanScript, frontScanScript } from './frontScan';

// Hướng dẫn + đoạn script bắt request của web Fonda gốc (xem captureSnippet.ts).
export default function Capture() {
  const script = useMemo(captureScript, []);
  const [copied, setCopied] = useState(false), [copied2, setCopied2] = useState(false);
  const scan = useMemo(frontScanScript, []), formScan = useMemo(formScanScript, []), [copied3, setCopied3] = useState(false);
  return (
    <div className="lcus"><div className="listwrap" style={{ maxWidth: 900 }}>
      <p className="sub">Bắt body của các thao tác <b>thêm / sửa / xoá / gắn thiết bị</b> trên web Fonda gốc để biết đúng cấu trúc API ghi. Công cụ chỉ ghi lại, không tự gọi gì.</p>
      <ol style={{ lineHeight: 1.7, paddingLeft: 20 }}>
        <li>Mở web Fonda gốc (<code>http://159.138.45.45:81</code>), đăng nhập, bấm <b>F12 → Console</b>.</li>
        <li>Bấm <b>Sao chép script</b> bên dưới, dán vào Console rồi Enter. Góc phải dưới hiện nút cam <b>⬇ Capture</b>.</li>
        <li>Tự thao tác trên web gốc, <b>chỉ dùng dữ liệu thử</b> (ví dụ tạo cột thử, gắn Đèn 3 vào LCU thử, tạo/sửa/xoá một model thử). Thao tác này chạy thật trên Fonda.</li>
        <li>Nút cam tải <code>fonda-capture-….json</code> chỉ gồm request <b>ghi</b>; nút xanh <b>“Tải tất cả”</b> (hoặc gõ <code>__capture.download(true)</code>) tải cả request <b>truy vấn/đọc</b> — dùng khi cần xem dữ liệu mà màn hình không hiện trực tiếp (mỗi dòng có <code>path</code>, <code>body</code> gửi đi và <code>data</code> trả về; mảng dài cắt còn 20 phần tử). Mở đúng màn hình/popup cần xem trước khi tải để file không lẫn quá nhiều. <b>Khung WebSocket</b> (kết quả lệnh thiết bị thường về qua đây, không có trong phản hồi HTTP) cũng được ghi: dòng <code>method: "WS"</code> với <code>dir</code> = connect / send / recv / close (đã bỏ phần <code>?token=</code> khỏi địa chỉ). Socket đã mở từ trước khi dán script chỉ bắt được từ lần <i>gửi</i> đầu tiên — muốn bắt từ đầu, dán script rồi <b>chuyển tab/đăng nhập lại để Fonda mở kết nối mới</b>. Lọc khi tải: <code>__capture.download(true, 'smartBox|queryParam|clesws')</code>.</li>
      </ol>
      <p className="sub">Script không đọc header (không có token). Khoá tên giống <code>pass/token/secret/authorization/cookie</code> bị che thành <code>&lt;redacted&gt;</code>; request <code>login</code> bị bỏ qua. Body còn lại giữ nguyên (có id thiết bị của bạn).</p>
      <button onClick={() => { void navigator.clipboard.writeText(script).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}>{copied ? 'Đã sao chép ✓' : 'Sao chép script'}</button>
      <textarea readOnly value={script} onFocus={e => e.currentTarget.select()} style={{ display: 'block', width: '100%', height: 160, marginTop: 12, fontSize: 11, fontFamily: 'monospace' }} />
      <h3 style={{ marginTop: 24 }}>Quét front-end Fonda: enum nằm ở server hay trong code giao diện?</h3>
      <p className="sub">Dán đoạn script này vào Console của web Fonda gốc (sau khi đăng nhập). Nó tải các file JS tĩnh của chính trang, tìm các từ khoá (<code>KXHL</code>, <code>kmFactory</code>, <code>powerProtocol</code>, <code>rtuType</code>, <code>gatewayTypes</code>, tên giao thức…) và tải về <code>fonda-frontend-scan-….json</code> (số lần xuất hiện + đoạn mã quanh từ khoá). Từ khoá có trong file JS ⇒ danh sách do giao diện giữ cứng; không có ⇒ lấy từ server. Chỉ đọc file tĩnh, không gọi API, không đọc token.</p>
      <button onClick={() => { void navigator.clipboard.writeText(scan).then(() => { setCopied2(true); setTimeout(() => setCopied2(false), 2000); }); }}>{copied2 ? 'Đã sao chép ✓' : 'Sao chép script quét front-end'}</button>
      <h3 style={{ marginTop: 24 }}>Quét form tạo template của Fonda (trường bắt buộc, điều kiện hiện theo loại)</h3>
      <p className="sub">Dán vào Console web Fonda gốc. Script đọc file JS tĩnh, tìm form khai template (popup "Thêm model") và tải về <code>fonda-form-scan-….json</code>: luật bắt buộc (<code>rules</code>), giá trị mặc định (<code>dataForm</code>), từng ô nhập kèm điều kiện hiện theo loại thiết bị và nhãn, cùng hàm kiểm tra trước khi lưu. Dùng để tái tạo đủ ô nhập và kiểm tra bắt buộc cho từng loại. Chỉ đọc, không gọi API.</p>
      <button onClick={() => { void navigator.clipboard.writeText(formScan).then(() => { setCopied3(true); setTimeout(() => setCopied3(false), 2000); }); }}>{copied3 ? 'Đã sao chép ✓' : 'Sao chép script quét form template'}</button>
    </div></div>
  );
}
