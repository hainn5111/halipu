import { describe, expect, it } from 'vitest';
import { show } from './show';

describe('show', () => {
  it('nhận mọi kiểu mà không ném lỗi', () => {
    expect(show(null)).toBe(''); expect(show(3)).toBe('3'); expect(show('a')).toBe('a'); expect(show({ a: 1 })).toBe('{"a":1}');
    expect(show({ toString: 1, valueOf: 2 })).toBe('{"toString":1,"valueOf":2}');
    expect(show(Object.create(null))).toBe('{}');
    const c: Record<string, unknown> = {}; c.self = c; expect(show(c)).toBe('[?]');
  });
});
