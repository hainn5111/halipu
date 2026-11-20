import { Component, type ReactNode } from 'react';

/** Bắt lỗi render của một tab: hiện thông báo thay vì trắng cả trang. `resetKey` đổi (chuyển tab) thì thử lại. */
export default class ErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { err: Error | null; key: string }> {
  state = { err: null as Error | null, key: this.props.resetKey };
  static getDerivedStateFromError(err: Error) { return { err }; }
  static getDerivedStateFromProps(p: { resetKey: string }, s: { err: Error | null; key: string }) { return p.resetKey !== s.key ? { err: null, key: p.resetKey } : null; }
  render() {
    if (!this.state.err) return this.props.children;
    return <div className="err" style={{ margin: 16 }}><b>Tab này bị lỗi khi hiển thị:</b> {this.state.err.message}<div className="sub">Mở Console (F12) để xem chi tiết; các tab khác vẫn dùng được.</div></div>;
  }
}
