// Dò API CHỈ ĐỌC từ trình duyệt: kéo cấu trúc payload (loại thiết bị, model/template, dictionary, thiết bị, quan hệ LCU↔model↔đèn↔cột).
// Chỉ gọi GET hoặc POST truy vấn (query*/page/get*). KHÔNG có lampControl/save/update/delete.
import { call } from '../../core/api';
import { linkPaths, relationScan, shape } from './probeUtil';

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
      results.push({ name, ok: true, data }); say(`✔ ${name}`); for (const s of shape(data)) say(`    ${s}`); return data;
    } catch (e) { results.push({ name, ok: false, message: (e as Error).message }); say(`✘ ${name}: ${(e as Error).message}`); return null; }
  };
  // Lấy ĐỦ mọi trang (size 100) — không cắt mẫu
  const getPaged = async (name: string, path: string, body: Rec): Promise<void> => {
    try {
      const all: unknown[] = []; let total = 0;
      for (let cur = 1; cur <= 50; cur++) {
        const d = await call<Rec>('POST', path, { body: { ...body, current: cur, size: 100 }, projectId: pid });
        all.push(...((d.records || []) as unknown[])); total = Number(d.total) || all.length;
        if (cur >= (Number(d.pages) || 1)) break;
      }
      results.push({ name, ok: true, data: { records: all, total } }); say(`✔ ${name} (${all.length}/${total})`); for (const x of shape(all)) say(`    ${x}`);
    } catch (e) { results.push({ name, ok: false, message: (e as Error).message }); say(`✘ ${name}: ${(e as Error).message}`); }
  };
  const types = (await get('types-all-by-project', 'GET', `deviceTypeController/queryAllDeviceTypeByProjectId/${pid}`)) as Rec[] | null;
  const models = (await get('models-by-project', 'GET', `deviceModel/queryAllDeviceModelByProjectId/${pid}`)) as Rec[] | null;
  for (const k of DICTS) await get(`dict-${k}`, 'GET', `dictionary/queryDictionaryByKey/${k}`);
  await get('factory-list', 'GET', 'factoryController/queryFactoryList');   // nhà sản xuất (producer) — tìm tên "XY…" của Switch (kmFactory)
  await get('factory-page', 'POST', 'factoryController/queryAllFactoriesPage', { current: 1, size: 100 });
  await get('pole-types', 'POST', 'poleType/getAllPoleTypeOfProjectList', { projectId: pid });
  await get('pole-types-page', 'POST', 'poleType/getAllPoleTypeOfProjectPage', { projectId: pid, current: 1, size: 100 });
  await get('dictionary-page', 'POST', 'dictionary/queryDictionaryPage', { current: 1, size: 100 });
  // Quét dictionary key 1..130 (im lặng khi lỗi) để tìm enum của poleTypeValue/poleArmType
  say('Quét dictionary key 1..130…');
  const dictAll: Record<string, unknown> = {};
  for (let k = 1; k <= 130; k++) { if (DICTS.includes(k)) continue; try { const d = await call('GET', `dictionary/queryDictionaryByKey/${k}`, { projectId: pid }); if (Array.isArray(d) && d.length) dictAll[String(k)] = d; } catch { /* bỏ qua */ } }
  results.push({ name: 'dict-scan', ok: true, data: dictAll }); say(`✔ dict-scan: ${Object.keys(dictAll).length} key có dữ liệu (${Object.keys(dictAll).join(', ')})`);
  const list = Array.isArray(types) ? types : [];
  say(`Loại thiết bị: ${list.map(t => `${t.deviceTypeValue}=${t.deviceTypeName}`).join(', ')}`);
  for (const t of list) {
    await getPaged(`model-page-${t.deviceTypeValue}`, 'deviceModel/getDeviceModelPage', { projectId: pid, deviceTypeId: t.deviceTypeId });
    await getPaged(`devices-${t.deviceTypeValue}`, 'device/queryDevicePage', { projectId: pid, deviceTypeValue: t.deviceTypeValue });
  }
  // Quan hệ giữa thiết bị thật: kéo toàn bộ thiết bị của các loại có dữ liệu rồi đối chiếu id/uid giữa các loại
  const byType: Record<string, Rec[]> = {};
  for (const r of results) {
    const m = /^devices-(\d+)$/.exec(r.name); const total = Number((r.data as Rec | undefined)?.total);
    if (!m || !(total > 0)) continue;
    const t = list.find(x => String(x.deviceTypeValue) === m[1]); const rows: Rec[] = [];
    try { for (let cur = 1; cur <= 20; cur++) { const d = await call<Rec>('POST', 'device/queryDevicePage', { body: { projectId: pid, current: cur, size: 100, deviceTypeValue: Number(m[1]) }, projectId: pid }); rows.push(...(d.records || [])); if (cur >= (d.pages || 1)) break; } } catch { /* bỏ loại này */ }
    byType[t?.deviceTypeName || m[1]] = rows;
  }
  const rel = relationScan(byType);
  say('=== Quét quan hệ giữa thiết bị ==='); rel.forEach(l => say(l));
  results.push({ name: 'relation-scan', ok: true, data: rel });
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
  results.push({ name: 'model-config-by-type', ok: true, data: parsed });

  // Phân bố systemConfig của model theo loại: 0 = model người dùng tự khai; khác 0 = model dựng sẵn của hệ thống (nội bộ bộ tập trung/power box…)
  await get('device-systems', 'GET', 'deviceSystemController/queryDeviceSystemList');
  say('=== Model theo systemConfig (0 = tự khai; ≠0 = dựng sẵn) ===');
  for (const t of list) {
    const mp = results.find(r => r.name === `model-page-${t.deviceTypeValue}`); if (!(Number((mp?.data as Rec | undefined)?.total) > 0)) continue;
    try {
      const pgm = await call<Rec>('POST', 'deviceModel/getDeviceModelPage', { body: { projectId: pid, current: 1, size: 100, deviceTypeId: t.deviceTypeId }, projectId: pid });
      const cnt: Record<string, number> = {}; for (const r of (pgm.records || []) as Rec[]) { const k = `sys${r.systemConfig}`; cnt[k] = (cnt[k] ?? 0) + 1; }
      say(`  ${t.deviceTypeName}: ${Object.entries(cnt).map(([k, v]) => `${k}×${v}`).join(', ')}`);
    } catch (e) { say(`  ${t.deviceTypeName}: lỗi ${(e as Error).message}`); }
  }

  // Bảng thông số phần cứng cố định của MỌI model LCU (số đầu đèn = lampHolderNum quyết định số đèn LCU quản lý)
  const lcuTypeRow = list.find(t => t.deviceTypeValue === 2);
  if (lcuTypeRow) {
    say('=== Model LCU: giao thức · systemConfig · đầu đèn · lcuType · loopType · dim · cờ bật · functionList ===');
    try {
      const pgm = await call<Rec>('POST', 'deviceModel/getDeviceModelPage', { body: { projectId: pid, current: 1, size: 100, deviceTypeId: lcuTypeRow.deviceTypeId }, projectId: pid });
      const cfg = new Map<string, Rec>(); for (const m of Array.isArray(models) ? models : []) { try { cfg.set(m.deviceModelId, JSON.parse(m.deviceConfig)); } catch { /* bỏ */ } }
      const rows = ((pgm.records || []) as Rec[]).map(r => {
        const c = cfg.get(r.deviceModelId) || {}; const ext = Array.isArray(c.extensions) ? (c.extensions as Rec[]) : [];
        return { model: r.deviceModelName, protocol: `${r.protocolName} ${r.protocolVersion}`, systemConfig: r.systemConfig, lampHolderNum: c.lampHolderNum, lcuType: c.lcuType, loopType: c.loopType, dimmingLevel: c.dimmingLevel, flagsOn: ext.filter(e => e.value === true).map(e => e.label), flagsTotal: ext.length, functionList: c.functionList };
      });
      rows.forEach(r => say(`  ${r.model}: ${r.protocol} · sys${r.systemConfig} · đầu đèn=${r.lampHolderNum} · lcuType=${r.lcuType} · loop=${r.loopType} · dim=${r.dimmingLevel} · cờ bật=[${(r.flagsOn as string[]).join(',')}]/${r.flagsTotal} · fn=[${(r.functionList as number[] | undefined)?.join(',') ?? ''}]`));
      results.push({ name: 'lcu-model-table', ok: true, data: rows });
    } catch (e) { say(`  lỗi: ${(e as Error).message}`); }
  }

  if (withLcu) {
    // lcuActor/page có thể trả rỗng dù LCU tồn tại (đã gặp) → lấy LCU từ device/queryDevicePage loại 2 (LCU): deviceId = lcuId, có uid
    const pg = (await get('lcu-list', 'POST', 'device/queryDevicePage', { projectId: pid, current: 1, size: 100, deviceTypeValue: 2 })) as Rec | null;
    const lcus: Rec[] = (pg?.records || []).map((r: Rec) => ({ uid: r.uid, lcuId: r.deviceId, deviceModelId: r.deviceModelId, poleId: r.poleId }));
    await get('lcu-list-getLcuListByProjectId', 'POST', 'lcuActor/getLcuListByProjectId', { projectId: pid });
    // Tóm tắt kênh của TẤT CẢ LCU (tối đa 20): số đầu đèn của model vs kênh có đèn thật — để đối chiếu cách web vẽ kênh
    say('=== Kênh của từng LCU (model lampHolderNum / kênh có đèn theo queryLampOfLcu) ===');
    const cfgOf = new Map<string, number>(); for (const m of Array.isArray(models) ? models : []) { try { cfgOf.set(m.deviceModelId, Number(JSON.parse(m.deviceConfig).lampHolderNum) || 0); } catch { /* bỏ */ } }
    for (const l of lcus.slice(0, 100)) {
      try {
        const lamps = (await call<Rec[]>('GET', `projectLampActor/queryLampOfLcu/${l.lcuId}`, { projectId: pid })) || [];
        const ch = lamps.map(x => Number(x.channel)).sort((a, b) => a - b);
        say(`  LCU …${String(l.uid).slice(-4)}: model lampHolderNum=${cfgOf.get(l.deviceModelId) ?? '?'} · đèn theo kênh=[${ch.join(',')}] (${ch.length} đèn)`);
      } catch (e) { say(`  LCU …${String(l.uid).slice(-4)}: lỗi ${(e as Error).message}`); }
    }
    for (const [i, l] of lcus.slice(0, 20).entries()) {
      const tag = `lcu${i}`;
      const d = ((await get(`${tag}-detail-byUid`, 'GET', `lcuActor/queryLcuAndRelatedByUid/${l.uid || l.lcuId}`)) || {}) as Rec;
      const lk = linkPaths(d, modelMap); say(`links ${tag}: ${lk.length ? '' : 'không có trường nào trỏ tới model'}`); lk.forEach(x => say(`    ${x}`));
      const lcuId = d.lcuId || l.lcuId, modelId = d.deviceModelId || l.deviceModelId;
      const dl = ((await get(`${tag}-detail-byLcuId`, 'GET', `lcuActor/queryLcuAndRelatedByLcuId/${lcuId}`)) || {}) as Rec;
      if (modelId) { await get(`${tag}-model-byId`, 'GET', `deviceModel/queryDeviceModelByDeviceModelId/${modelId}`); await get(`${tag}-model-full`, 'GET', `deviceModel/queryDeviceModelAndTypeAndSystemAndFactoryById/${modelId}`); }
      await get(`${tag}-lamps-of-lcu`, 'GET', `projectLampActor/queryLampOfLcu/${lcuId}`);
      const lamp0 = Array.isArray(dl.lamp) ? dl.lamp[0] : Array.isArray(d.lamp) ? d.lamp[0] : null; if (lamp0?.lampId) await get(`${tag}-lamp-related`, 'GET', `projectLampActor/queryLampAndRelatedById/${lamp0.lampId}`);
      await get(`${tag}-poles-of-lcu`, 'GET', `poleActor/queryLcusOfPoleByLcuId/${lcuId}`);
      const poleId = d.poleId || (Array.isArray(d.pole) && (d.pole[0]?.deviceId || d.pole[0]?.poleId));
      if (poleId) { await get(`${tag}-pole-related`, 'GET', `poleActor/queryPoleAndRelatedById/${poleId}`); await get(`${tag}-pole-attr-devices`, 'GET', `poleActor/queryAttributeDeviceOfPole/${poleId}`); }
      else say(`${tag}: LCU không gắn cột (không có poleId)`);
    }
  }
  if (withLcu) {
    // Cột bất kỳ (kể cả cột chưa gắn LCU): cấu trúc thiết bị gắn trên cột
    for (const [i, p] of (byType['Lamp Pole'] || []).slice(0, 30).entries()) {
      await get(`pole${i}-related`, 'GET', `poleActor/queryPoleAndRelatedById/${p.deviceId}`);
      await get(`pole${i}-attr-devices`, 'GET', `poleActor/queryAttributeDeviceOfPole/${p.deviceId}`);
    }
  }
  return { results, lines };
}
