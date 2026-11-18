// Smoke test chỉ ĐỌC trên build web thật: đăng nhập → tab GIS (dropdown, toạ độ) → tab Danh sách LCU.
// KHÔNG gửi lệnh nào xuống đèn (không bấm Bật/Tắt/Dim/Đọc trạng thái). Không in token/mật khẩu.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8080';
const { FONDA_USER, FONDA_PASS } = process.env;
const out = (k, v) => console.log(`[e2e] ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
(async () => {
  if (!FONDA_USER || !FONDA_PASS) { out('SKIP', 'chưa có secret FONDA_USER / FONDA_PASS'); return; }
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 850 } });
  p.on('pageerror', e => out('PAGE_ERROR', e.message));
  p.on('requestfailed', r => out('REQ_FAILED', `${r.method()} ${r.url().replace(/\?.*/, '')} ${r.failure() && r.failure().errorText}`));
  p.on('response', r => { if (r.url().includes(':18080') && r.status() >= 400) out('API_HTTP_' + r.status(), r.url().replace(/\?.*/, '')); });
  let step = 'login';
  try {
    await p.goto(BASE + '/index.html'); await p.fill('#u', FONDA_USER); await p.fill('#p', FONDA_PASS); await p.click('#b');
    await p.waitForURL(/home\.html/, { timeout: 30000 }); out('login', 'OK');

    step = 'gis'; await p.waitForSelector('#ddb', { timeout: 30000 });
    await p.waitForFunction(() => /\(\d+\)/.test(document.querySelector('#ddb').textContent), null, { timeout: 60000 });
    out('GIS dropdown', await p.textContent('#ddb'));
    await p.waitForTimeout(8000);   // chờ lấy toạ độ từng LCU
    await p.click('#ddb');
    out('GIS items', await p.$$eval('#ddm .it', els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim())));
    await p.screenshot({ path: 'e2e-gis.png' });

    step = 'lcu tab'; await p.click('[data-id="lcus"]');
    await p.waitForSelector('iframe[data-id="lcus"]'); const fr = p.frames().find(f => f.url().includes('lcus.html'));
    await fr.waitForFunction(() => document.querySelector('#s') && !/Đang tải/.test(document.querySelector('#s').textContent), null, { timeout: 90000 }).catch(() => out('LCU', 'quá hạn chờ tải'));
    out('LCU status line (iframe #s)', await fr.textContent('#s'));
    out('LCU error line (iframe #e)', (await fr.textContent('#e')) || '(trống)');
    out('LCU table rows', await fr.$$eval('#t tr.lrow', r => r.length));
    out('LCU rows text', await fr.$$eval('#t tr.lrow', rs => rs.map(r => r.innerText.replace(/\s+/g, ' ').slice(0, 90))));
    out('home status line (#fst)', (await p.textContent('#fst')) || '(trống)');
    await p.screenshot({ path: 'e2e-lcu.png' });
  } catch (x) { out('FAILED at ' + step, x.message.split('\n')[0]); await p.screenshot({ path: 'e2e-fail.png' }).catch(() => {}); process.exitCode = 1; }
  await b.close();
})();
