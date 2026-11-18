// Dò API CHỈ ĐỌC từ trình duyệt: kéo cấu trúc payload (loại thiết bị, model/template, dictionary, thiết bị, quan hệ LCU↔model↔đèn↔cột).
// Chỉ gọi GET hoặc POST truy vấn (query*/page/get*). KHÔNG có lampControl/save/update/delete.
import { call } from '../../core/api';
import { linkPaths, shape, trim } from './probeUtil';

type Rec = Record<string, any>;   // eslint-disable-line @typescript-eslint/no-explicit-any
export interface ProbeResult { name: string; ok: boolean; message?: string; data?: unknown }
export interface ProbeOut { results: ProbeResult[]; lines: string[] }

const DICTS = [3, 15, 17, 19, 20, 21, 55, 99, 116, 119];

export async function runProbe(pid: string, log: (line: string) => void, withLcu = true): Promise<ProbeOut> {
  const results: ProbeResult[] = [], lines: string[] = [];
  const say = (l: string) => { lines.push(l); log(l); };
  const get = async (name: string, method: 'GET' | 'POST', path: string, body?: unknown): Promise<unknown> => {
    try {
      const data = await call(method, path, { body, projectId: pid });
      results.push({ name, ok: true, data: trim(data) }); say(`✔ ${name}`); for (const s of shape(data)) say(`    ${s}`); return data;
    } catch (e) { results.push({ name, ok: false, message: (e as Error).message }); say(`✘ ${name}: ${(e as Error).message}`); return null; }
  };
  const types = (await get('types-all-by-project', 'GET', `deviceTypeController/queryAllDeviceTypeByProjectId/${pid}`)) as Rec[] | null;
  const models = (await get('models-by-project', 'GET', `deviceModel/queryAllDeviceModelByProjectId/${pid}`)) as Rec[] | null;
  for (const k of DICTS) await get(`dict-${k}`, 'GET', `dictionary/queryDictionaryByKey/${k}`);
  const list = Array.isArray(types) ? types : [];
  say(`Loại thiết bị: ${list.map(t => `${t.deviceTypeValue}=${t.deviceTypeName}`).join(', ')}`);
  for (const t of list) {
    await get(`model-page-${t.deviceTypeValue}`, 'POST', 'deviceModel/getDeviceModelPage', { projectId: pid, current: 1, size: 3, deviceTypeId: t.deviceTypeId });
    await get(`devices-${t.deviceTypeValue}`, 'POST', 'device/queryDevicePage', { projectId: pid, current: 1, size: 3, deviceTypeValue: t.deviceTypeValue });
  }
  // deviceConfig là chuỗi JSON → cấu trúc theo loại
  const typeName = new Map(list.map(t => [t.deviceTypeId, String(t.deviceTypeName)]));
  const modelMap = new Map<string, { name: string; type: string }>();
  const parsed: Record<string, unknown[]> = {};
  for (const m of Array.isArray(models) ? models : []) {
    modelMap.set(m.deviceModelId, { name: m.deviceModelName, type: typeName.get(m.deviceTypeId) || '?' });
    let c: unknown = m.deviceConfig; try { c = JSON.parse(m.deviceConfig); } catch { /* giữ chuỗi */ }
    (parsed[typeName.get(m.deviceTypeId) || m.deviceTypeId] ||= []).push({ name: m.deviceModelName, config: c });
  }
  for (const [tn, ms] of Object.entries(parsed)) { say(`deviceConfig ${tn}: ${ms.length} model`); for (const s of shape((ms[0] as Rec).config)) say(`    ${s}`); }
  results.push({ name: 'model-config-by-type', ok: true, data: trim(parsed) });

  if (withLcu) {
    // lcuActor/page có thể trả rỗng dù LCU tồn tại (đã gặp) → lấy LCU từ device/queryDevicePage loại 2 (LCU): deviceId = lcuId, có uid
    const pg = (await get('lcu-list', 'POST', 'device/queryDevicePage', { projectId: pid, current: 1, size: 5, deviceTypeValue: 2 })) as Rec | null;
    const lcus: Rec[] = (pg?.records || []).map((r: Rec) => ({ uid: r.uid, lcuId: r.deviceId, deviceModelId: r.deviceModelId, poleId: r.poleId }));
    await get('lcu-list-getLcuListByProjectId', 'POST', 'lcuActor/getLcuListByProjectId', { projectId: pid });
    for (const [i, l] of lcus.slice(0, 3).entries()) {
      const tag = `lcu${i}`;
      const d = ((await get(`${tag}-detail-byUid`, 'GET', `lcuActor/queryLcuAndRelatedByUid/${l.uid || l.lcuId}`)) || {}) as Rec;
      const lk = linkPaths(d, modelMap); say(`links ${tag}: ${lk.length ? '' : 'không có trường nào trỏ tới model'}`); lk.forEach(x => say(`    ${x}`));
      const lcuId = d.lcuId || l.lcuId, modelId = d.deviceModelId || l.deviceModelId;
      await get(`${tag}-detail-byLcuId`, 'GET', `lcuActor/queryLcuAndRelatedByLcuId/${lcuId}`);
      if (modelId) { await get(`${tag}-model-byId`, 'GET', `deviceModel/queryDeviceModelByDeviceModelId/${modelId}`); await get(`${tag}-model-full`, 'GET', `deviceModel/queryDeviceModelAndTypeAndSystemAndFactoryById/${modelId}`); }
      await get(`${tag}-lamps-of-lcu`, 'GET', `projectLampActor/queryLampOfLcu/${lcuId}`);
      const lamp0 = Array.isArray(d.lamp) ? d.lamp[0] : null; if (lamp0?.lampId) await get(`${tag}-lamp-related`, 'GET', `projectLampActor/queryLampAndRelatedById/${lamp0.lampId}`);
      await get(`${tag}-poles-of-lcu`, 'GET', `poleActor/queryLcusOfPoleByLcuId/${lcuId}`);
      const poleId = d.poleId || (Array.isArray(d.pole) && (d.pole[0]?.deviceId || d.pole[0]?.poleId));
      if (poleId) { await get(`${tag}-pole-related`, 'GET', `poleActor/queryPoleAndRelatedById/${poleId}`); await get(`${tag}-pole-attr-devices`, 'GET', `poleActor/queryAttributeDeviceOfPole/${poleId}`); }
      else say(`${tag}: LCU không gắn cột (không có poleId)`);
    }
  }
  return { results, lines };
}
