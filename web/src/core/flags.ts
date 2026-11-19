// Cờ build. Bản deploy từ main KHÔNG đặt VITE_ENABLE_PROBE → công cụ dò và thao tác GHI chưa kiểm chứng bị tắt.
export const PREVIEW_TOOLS = import.meta.env.VITE_ENABLE_PROBE === '1' || import.meta.env.DEV;
/** Thao tác ghi lên Fonda (sửa/xoá/tạo template). Hiện chỉ bật ở bản preview cho tới khi được kiểm chứng. */
export const WRITE_ENABLED = PREVIEW_TOOLS;
