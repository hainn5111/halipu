import { describe, expect, it } from 'vitest';
import { compareStored, parseBody, withFields } from './lcuLab';

const base = { deviceTypeId: 'T2', deviceTypeValue: 2, deviceModelName: 'LCU-lab', projectId: 'P', protocolValue: 53, deviceConfig: { lampHolderNum: 1, lcuType: 1, functionList: [1, 2] } };

describe('lcuLab', () => {
  it('parseBody chấp nhận body LCU hợp lệ, từ chối thiếu trường / sai loại / JSON hỏng', () => {
    expect(parseBody(JSON.stringify(base)).ok).toBe(true);
    for (const bad of ['{', '[]', JSON.stringify({ ...base, deviceModelName: ' ' }), JSON.stringify({ ...base, projectId: '' }), JSON.stringify({ ...base, deviceTypeValue: 6 })]) expect(parseBody(bad).ok).toBe(false);
  });
  it('withFields sửa tên/lampHolderNum/lcuType, giữ trường khác; JSON hỏng → null', () => {
    const out = JSON.parse(withFields(JSON.stringify(base), { name: 'X', lampHolderNum: 4, lcuType: 9 })!);
    expect(out).toMatchObject({ deviceModelName: 'X', protocolValue: 53, deviceConfig: { lampHolderNum: 4, lcuType: 9, functionList: [1, 2] } });
    expect(withFields('{', { name: 'x' })).toBeNull();
  });
  it('compareStored chỉ ra trường server đổi khác', () => {
    const r = compareStored({ ...base, deviceConfig: { lampHolderNum: 4, lcuType: 9, functionList: [1, 2] } }, { systemConfig: 0, protocolValue: 53, deviceConfig: { lampHolderNum: 1, lcuType: 9, functionList: [1, 2] } });
    expect(r.find(x => x.field === 'lampHolderNum')).toMatchObject({ sent: 4, stored: 1, same: false });
    expect(r.find(x => x.field === 'lcuType')?.same).toBe(true);
  });
});
