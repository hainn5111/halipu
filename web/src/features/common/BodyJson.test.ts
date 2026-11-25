import { describe, expect, it } from 'vitest';
import { canSend, finalBody, type BodyJson } from './BodyJson';

const bj = (o: Partial<BodyJson>): BodyJson => ({ text: '', edit: () => undefined, dirty: false, reset: () => undefined, parsed: null, ...o });
const built = { a: 1 };
describe('BodyJson', () => {
  it('bình thường: cần form hợp lệ; dùng body dựng từ form', () => {
    expect(finalBody(bj({}), built)).toBe(built); expect(canSend(bj({}), built, true, false)).toBe(true); expect(canSend(bj({}), built, false, false)).toBe(false);
  });
  it('đã sửa tay: dùng JSON đã sửa; JSON hỏng thì không gửi', () => {
    expect(finalBody(bj({ dirty: true, parsed: { a: 2 } }), built)).toEqual({ a: 2 }); expect(canSend(bj({ dirty: true, parsed: null }), built, true, false)).toBe(false);
  });
  it('bỏ qua kiểm tra: form sai vẫn gửi được nếu JSON hợp lệ; JSON hỏng thì không', () => {
    expect(canSend(bj({ parsed: built }), built, false, true)).toBe(true); expect(canSend(bj({ dirty: true, parsed: { x: 1 } }), null, false, true)).toBe(true);
    expect(canSend(bj({ dirty: true, parsed: null }), built, false, true)).toBe(false); expect(canSend(bj({}), null, false, true)).toBe(false);
  });
});
