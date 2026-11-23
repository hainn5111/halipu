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

/**
 * Quét FORM TẠO TEMPLATE của Fonda (popup khai model thiết bị): luật bắt buộc (`rules`), giá trị mặc định (`dataForm`), và từng ô nhập
 * (điều kiện hiện theo loại `deviceTypeValue`, nhãn i18n, tên trường, `prop`). Dán vào Console web Fonda gốc; tải `fonda-form-scan-….json`.
 * Chỉ đọc file JS tĩnh. Hàm TỰ CHỨA (copy qua toString()).
 */
export function scanForms(win: any): Promise<any> {
  const doc = win.document, urls = new Set<string>();
  for (const s of Array.from(doc.scripts) as any[]) if (s.src) urls.add(s.src);
  for (const e of win.performance.getEntriesByType('resource') as any[]) if (/\.js(\?|$)/i.test(e.name) && e.name.startsWith(win.location.origin)) urls.add(e.name);
  /** Lấy khối {...} cân bằng ngoặc bắt đầu tại `open` (vị trí dấu `{`), bỏ qua dấu ngoặc trong chuỗi. */
  const balanced = (t: string, open: number, max = 60000): string => {
    let d = 0, q = '';
    for (let i = open; i < Math.min(t.length, open + max); i++) {
      const c = t[i];
      if (q) { if (c === '\\') i++; else if (c === q) q = ''; continue; }
      if (c === '"' || c === "'" || c === '`') { q = c; continue; }
      if (c === '{') d++; else if (c === '}') { d--; if (d === 0) return t.slice(open, i + 1); }
    }
    return t.slice(open, open + max);
  };
  const out: any = { origin: win.location.origin, scannedAt: new Date().toISOString(), forms: [] };
  const run = async () => {
    for (const url of urls) {
      let t = '';
      try { t = await (await win.fetch(url, { credentials: 'same-origin' })).text(); } catch { continue; }
      let i = t.indexOf('dataForm:{protocolId:"",protocolValue:-1,useTag:null');
      while (i >= 0) {
        const form: any = { url, dataForm: balanced(t, t.indexOf('{', i + 'dataForm:'.length - 1)).slice(0, 4000) };
        // `rules:{` gần nhất phía trước (cùng component)
        const r = t.lastIndexOf('rules:{', i); if (r >= 0 && i - r < 20000) form.rules = balanced(t, r + 6);
        const around = t.slice(Math.max(0, i - 25000), i + 120000);
        // CÁC Ô NHẬP CỦA FORM TEMPLATE nằm ở module render riêng (có thể xa `dataForm`): quét TOÀN FILE MỌI lần xuất hiện của
        // `expression:"dataForm.…"` (cùng một trường có thể hiện ở nhiều loại → nhiều điều kiện khác nhau). Mỗi lần: `head` = 260 ký tự ngay TRƯỚC
        // `a("el-form-item"` chứa ô (đuôi của nó là điều kiện hiện theo loại/giao thức), cùng nhãn i18n và `prop`.
        const fields: Record<string, any[]> = {}; const re = /expression:"(dataForm\.(?:deviceConfig\.|protocol|deviceType|deviceModelName|remark|deviceSystem)[A-Za-z0-9_.]*)"/g; let m: RegExpExecArray | null; let total = 0;
        while ((m = re.exec(t)) && total < 800) {
          const f = m[1], bef = t.slice(Math.max(0, m.index - 1600), m.index), fi = bef.lastIndexOf('a("el-form-item"');
          if (fi < 0) continue;
          const head = bef.slice(Math.max(0, fi - 260), fi).replace(/\s+/g, ' '), seg = bef.slice(fi);
          const label = (/label:e\.\$t\("([^"]+)"\)/.exec(seg) || [])[1] || '', prop = (/prop:"([^"]+)"/.exec(seg) || [])[1] || '';
          const list = fields[f] || (fields[f] = []);
          if (!list.some((x: any) => x.head === head)) { list.push({ head, label, prop, seg: (seg + t.slice(m.index, m.index + 700)).replace(/\s+/g, ' ').slice(0, 2600) }); total++; }
        }
        form.fields = fields;
        // điều kiện theo loại thiết bị xuất hiện trong form
        form.typeConditions = Array.from(new Set(t.match(/(\[[\d,]+\]\.includes\(e\.dataForm\.deviceTypeValue\)|\d+===e\.dataForm\.deviceTypeValue|e\.dataForm\.deviceTypeValue===\d+)/g) || [])).slice(0, 200);
        // hàm lưu/kiểm tra trước khi gửi (có thể chặn theo loại)
        // TOÀN BỘ script của component (data, computed, watch, methods): nơi quyết định ô nào hiện/khoá/xoá khi đổi loại, giao thức, và nạp tuỳ chọn từng ô
        { const ds = t.lastIndexOf('data:function(){', i), te = t.indexOf('t.default=', i + 20000);
          form.component = t.slice(Math.max(0, ds >= 0 ? ds : i - 6000), te > 0 ? Math.min(te + 20, (ds >= 0 ? ds : i) + 140000) : i + 110000); }
        const sv = around.indexOf('save:function(e){'); if (sv >= 0) form.save = around.slice(sv, sv + 3500);
        const cf = around.indexOf('confirm:function(e){'); if (cf >= 0) form.confirm = around.slice(cf, cf + 2500);
        out.forms.push(form);
        i = t.indexOf('dataForm:{protocolId:"",protocolValue:-1,useTag:null', i + 10);
      }
    }
    win.console.log('Quét form template xong:', out.forms.length, 'form');
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `fonda-form-scan-${new Date().toISOString().replace(/[:.]/g, '-')}.json`; a.click(); URL.revokeObjectURL(a.href);
    return out;
  };
  return run();
}
export const formScanScript = (): string => `(${scanForms.toString()})(window);`;
