/* eslint-disable @typescript-eslint/no-explicit-any */
// Đoạn script QUÉT FRONT-END của web Fonda gốc, dán vào Console của trang Fonda (cùng origin nên đọc được file JS của chính nó).
// Mục đích: xác nhận danh sách enum (producer KXHL, power protocol, concentrator type theo giao thức…) nằm CỨNG trong code giao diện
// hay lấy từ server — nếu từ khoá xuất hiện trong file JS thì giao diện tự giữ danh sách. Chỉ ĐỌC file tĩnh, không gọi API, không đụng token.
// Hàm TỰ CHỨA (không dùng biến ngoài) vì được sao chép qua toString().
export function scanFrontend(win: any): Promise<any> {
  const KEYS = ['KXHL', 'kmFactory', 'powerProtocol', 'rtuType', 'gatewayTypes', 'lampTypes', 'powerTypes', 'poleArmType', 'poleTypeValue', 'meterType', 'currentP',
    'dimmingLevel', 'functionList', 'protocolValue', 'Constant Current Drive Power', 'Led Lamp', 'Willow', 'RTU 200', 'RTU500', 'RF/F2', 'CAT1/F2', 'FEMS', 'Single arm lamp', 'Magnolia', 'rtuTypeArr', 'gatewayTypeArr', 'gatewayTypesArr', 'rtuTypeOptions', 'concentratorType', 'queryDictionaryByKey)(99', 'queryDictionaryByKey)(119', 'queryDictionaryByKey)(55', 'queryDictionaryByKey)(20', 'queryDictionaryByKey)(15', 'queryDictionaryByKey)(21', 'RTU200', 'RTU700', 'RTU150', 'RTU190', 'poleTypeArr', 'poleArmTypeArr', 'hasFactoryDeviceType', 'table.D4I', 'protocolModelChange'];
  const doc = win.document;
  const urls = new Set<string>();
  for (const s of Array.from(doc.scripts) as any[]) if (s.src) urls.add(s.src);
  for (const e of win.performance.getEntriesByType('resource') as any[]) if (/\.(js|json)(\?|$)/i.test(e.name) && e.name.startsWith(win.location.origin)) urls.add(e.name);
  const out: any = { origin: win.location.origin, scannedAt: new Date().toISOString(), files: [], keys: {} };
  for (const k of KEYS) out.keys[k] = { total: 0, files: [], samples: [] };
  const run = async () => {
    for (const url of urls) {
      let text = '';
      try { const r = await win.fetch(url, { credentials: 'same-origin' }); text = await r.text(); } catch { out.files.push({ url, error: true }); continue; }
      out.files.push({ url, size: text.length });
      for (const k of KEYS) {
        let i = text.indexOf(k), n = 0;
        while (i >= 0) {
          n++;
          const rec = out.keys[k];
          if (rec.samples.length < 12) { const s = text.slice(Math.max(0, i - 260), i + 340).replace(/\s+/g, ' '); /* bỏ ngữ cảnh là bảng dịch i18n (nhiều cặp "khoá":"chuỗi" liên tiếp) */ if (!/("[A-Za-z0-9_]+":"[^"]{2,}",){3}/.test(s) && !rec.samples.includes(s)) rec.samples.push(s); }
          i = text.indexOf(k, i + k.length);
        }
        if (n) { out.keys[k].total += n; out.keys[k].files.push({ url, count: n }); }
      }
    }
    const summary = KEYS.map(k => `${k}: ${out.keys[k].total}`).join(' | ');
    out.summary = summary; win.console.log('Quét front-end xong:', summary);
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `fonda-frontend-scan-${new Date().toISOString().replace(/[:.]/g, '-')}.json`; a.click(); URL.revokeObjectURL(a.href);
    return out;
  };
  return run();
}

/** Mã để dán vào Console của trang Fonda gốc. */
export const frontScanScript = (): string => `(${scanFrontend.toString()})(window);`;
