import { describe, expect, it } from 'vitest';
import { buildDictBody, cloneDictBody, findInDicts, dictBodyError, nextDictValue } from './dictLabUtil';

const rec = { dictId: 'D1', dictValue: 2, dsName: 'Willow leaf', dictName: 'Ordinary pole lamp arm type', dictType: '55', createTime: 1, dictionarySecond: [{ x: 1 }] };
describe('dictLab', () => {
  it('nextDictValue = max + 1', () => { expect(nextDictValue([{ dictValue: 1 }, { dictValue: '3' }])).toBe(4); expect(nextDictValue([])).toBe(1); expect(nextDictValue([{ dictValue: { toString: 1, valueOf: 2 } }, { dictValue: 5 }])).toBe(6); });
  it('cloneDictBody bỏ id/audit, đổi tên và giá trị', () => {
    const b = cloneDictBody(rec, { name: 'Test', value: 9 });
    expect(b).toEqual({ dictValue: 9, dsName: 'Test', dictName: 'Ordinary pole lamp arm type', dictType: '55', dictionarySecond: [] });
    expect(rec.dictId).toBe('D1');
  });
  it('thêm dictKey khi được cho', () => { expect(cloneDictBody(rec, { name: 'T', value: 3, dictKey: '55' }).dictKey).toBe('55'); expect('dictKey' in cloneDictBody(rec, { name: 'T', value: 3 })).toBe(false); });
  it('giữ/bỏ dictId, dictStairId', () => {
    const r2 = { ...rec, dictStairId: 'S1' };
    expect(cloneDictBody(r2, { name: 'T', value: 3 })).not.toHaveProperty('dictId'); expect(cloneDictBody(r2, { name: 'T', value: 3 })).not.toHaveProperty('dictStairId');
    const k = cloneDictBody(r2, { name: 'T', value: 3, keepDictId: true }); expect(k.dictId).toBe('D1'); expect(k).not.toHaveProperty('dictStairId');
    expect(cloneDictBody(r2, { name: 'T', value: 3, keepStairId: true }).dictStairId).toBe('S1');
  });
  it('findInDicts', () => { expect(findInDicts({ '55': [{ dsName: 'Test arm' }], '9': [{ dsName: 'x' }] }, 'test')).toEqual(['55']); expect(findInDicts({}, '')).toEqual([]); expect(findInDicts({ '7': [{ dsName: 'a', dictionarySecond: [{ dsName: 'Test arm' }] }] }, 'test arm')).toEqual(['7']); });
  it('buildDictBody 3 dạng', () => {
    const o = { name: 'T', value: 3, dictKey: '55', keepDictId: true };
    expect(buildDictBody('item', rec, o).dsName).toBe('T');
    expect(buildDictBody('child', { ...rec, dictId: 'G1' }, o).dictStairId).toBe('G1');
    const g = buildDictBody('group', { ...rec, dictId: 'G1' }, o);
    expect(g).toMatchObject({ dictKey: '55', dictId: 'G1', dictName: 'Ordinary pole lamp arm type' }); expect((g.dictionarySecond as unknown[])[0]).toMatchObject({ dsName: 'T', dictValue: 3 });
    expect(dictBodyError(JSON.stringify(g)).ok).toBe(true);
  });
  it('dictBodyError', () => {
    expect(dictBodyError('x').ok).toBe(false); expect(dictBodyError('[]').ok).toBe(false);
    expect(dictBodyError('{"dictValue":1}').ok).toBe(false); expect(dictBodyError('{"dsName":"a","dictValue":1}').ok).toBe(true);
  });
});
