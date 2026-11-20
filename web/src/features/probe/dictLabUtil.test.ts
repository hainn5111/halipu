import { describe, expect, it } from 'vitest';
import { cloneDictBody, dictBodyError, nextDictValue } from './dictLabUtil';

const rec = { dictId: 'D1', dictValue: 2, dsName: 'Willow leaf', dictName: 'Ordinary pole lamp arm type', dictType: '55', createTime: 1, dictionarySecond: [{ x: 1 }] };
describe('dictLab', () => {
  it('nextDictValue = max + 1', () => { expect(nextDictValue([{ dictValue: 1 }, { dictValue: '3' }])).toBe(4); expect(nextDictValue([])).toBe(1); expect(nextDictValue([{ dictValue: { toString: 1, valueOf: 2 } }, { dictValue: 5 }])).toBe(6); });
  it('cloneDictBody bỏ id/audit, đổi tên và giá trị', () => {
    const b = cloneDictBody(rec, { name: 'Test', value: 9 });
    expect(b).toEqual({ dictValue: 9, dsName: 'Test', dictName: 'Ordinary pole lamp arm type', dictType: '55', dictionarySecond: [] });
    expect(rec.dictId).toBe('D1');
  });
  it('dictBodyError', () => {
    expect(dictBodyError('x').ok).toBe(false); expect(dictBodyError('[]').ok).toBe(false);
    expect(dictBodyError('{"dictValue":1}').ok).toBe(false); expect(dictBodyError('{"dsName":"a","dictValue":1}').ok).toBe(true);
  });
});
