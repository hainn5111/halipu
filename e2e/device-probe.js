// Probe CHỈ ĐỌC: kéo cấu trúc payload của loại thiết bị / model (template deviceConfig) / dictionary / thiết bị mẫu.
// Chỉ gọi GET hoặc POST truy vấn (query*/page/get*). KHÔNG gọi lampControl, save, update, delete. Không in token/mật khẩu.
// Log: chỉ in CẤU TRÚC (đường dẫn trường + kiểu). Mẫu dữ liệu (tối đa 3 bản ghi) nằm trong thư mục probe-out/ (artifact).
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE || 'http://localhost:8080';
const { FONDA_USER, FONDA_PASS } = process.env;
const out = (k, v) => console.log(`[probe] ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
const DICTS = [3, 15, 17, 19, 20, 21, 55, 99, 116, 119];

// Rút gọn mẫu: mảng chỉ giữ 3 phần tử đầu
const trim = v => Array.isArray(v) ? v.slice(0, 3).map(trim) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, trim(x)])) : v;
// Cấu trúc: "đường.dẫn: kiểu"
function shape(v, path = '', acc = new Set()) {
  if (Array.isArray(v)) { acc.add(`${path}[]: array(${v.length})`); v.slice(0, 3).forEach(x => shape(x, path + '[]', acc)); }
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => shape(x, path ? `${path}.${k}` : k, acc));
  else acc.add(`${path}: ${v === null ? 'null' : typeof v}`);
  return acc;
}

(async () => {
  if (!FONDA_USER || !FONDA_PASS) { out('SKIP', 'chưa có secret FONDA_USER / FONDA_PASS'); return; }
  fs.mkdirSync('probe-out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage();
  try {
    await p.goto(BASE + '/'); await p.fill('#u', FONDA_USER); await p.fill('#p', FONDA_PASS); await p.click('#b');
    await p.waitForSelector('#ddb', { timeout: 30000 });
    const cfg = await (await p.request.get(BASE + '/config.json')).json();
    // pid: cấu hình cố định hoặc app đã dò (localStorage)
    await p.waitForFunction(() => localStorage.getItem('pid') || true, null, { timeout: 5000 }).catch(() => {});
    const pid = cfg.projectId || await p.evaluate(() => localStorage.getItem('pid'));
    if (!pid) throw new Error('không xác định được projectId');
    out('projectId', pid.slice(0, 8) + '…');

    const api = (method, path, body) => p.evaluate(async ([base, method, path, body, pid]) => {
      const r = await fetch(`${base}/api/v1.0/${path}?lang=en-US`, { method, headers: { authorization: sessionStorage.getItem('slcp_token') || '', 'Content-Type': 'application/json', projectId: pid }, body: body ? JSON.stringify(body) : undefined });
      return r.json().catch(() => ({ code: -1, message: 'không phải JSON, HTTP ' + r.status }));
    }, [cfg.apiBase, method, path, body, pid]);

    const save = (name, res) => {
      fs.writeFileSync(`probe-out/${name}.json`, JSON.stringify({ code: res.code, message: res.message, data: trim(res.data) }, null, 2));
      out(name, `code=${res.code}${res.message && res.code !== 200 && res.code !== 20000 ? ' ' + res.message : ''}`);
      if (res.data != null) for (const line of shape(res.data)) console.log(`    ${line}`);
    };

    const types = await api('GET', `deviceTypeController/queryAllDeviceTypeByProjectId/${pid}`);
    save('types-all-by-project', types);
    save('types-with-uid', await api('GET', `deviceTypeController/queryDeviceTypesWithUidOfProject/${pid}`));
    save('types-queryAllDeviceType', await api('POST', 'deviceTypeController/queryAllDeviceType', {}));
    save('models-by-project', await api('GET', `deviceModel/queryAllDeviceModelByProjectId/${pid}`));
    for (const k of DICTS) save(`dict-${k}`, await api('GET', `dictionary/queryDictionaryByKey/${k}`));

    const list = Array.isArray(types.data) ? types.data : [];
    out('loại thiết bị', list.map(t => `${t.deviceTypeValue}=${t.deviceTypeName}`));
    for (const t of list) {
      const tag = `${t.deviceTypeValue}`;
      save(`model-page-${tag}`, await api('POST', 'deviceModel/getDeviceModelPage', { projectId: pid, current: 1, size: 3, deviceTypeId: t.deviceTypeId }));
      save(`model-by-type-${tag}`, await api('POST', 'deviceModel/queryDeviceModelByDeviceTypeAndProject', { projectId: pid, deviceTypeId: t.deviceTypeId }));
      save(`devices-${tag}`, await api('POST', 'device/queryDevicePage', { projectId: pid, current: 1, size: 3, deviceTypeValue: t.deviceTypeValue }));
    }
  } catch (x) { out('FAILED', x.message.split('\n')[0]); process.exitCode = 1; }
  await b.close();
})();
