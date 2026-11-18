// Smoke test CHỈ ĐỌC cho bản React (web/dist): đăng nhập → GIS (dropdown, toạ độ, drawer, lịch sử) → tab LCU.
// KHÔNG bấm Bật/Tắt/Dim/Đọc trạng thái (các nút này gửi lệnh xuống đèn). Không in token/mật khẩu.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8080';
const { FONDA_USER, FONDA_PASS } = process.env;
const out = (k, v) => console.log(`[web-e2e] ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
(async () => {
  if (!FONDA_USER || !FONDA_PASS) { out('SKIP', 'chưa có secret FONDA_USER / FONDA_PASS'); return; }
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 850 } });
  p.on('pageerror', e => out('PAGE_ERROR', e.message));
  p.on('requestfailed', r => { if (!/tile\.openstreetmap/.test(r.url())) out('REQ_FAILED', `${r.method()} ${r.url().replace(/\?.*/, '')} ${r.failure() && r.failure().errorText}`); });
  let step = 'login';
  try {
    await p.goto(BASE + '/'); await p.fill('#u', FONDA_USER); await p.fill('#p', FONDA_PASS); await p.click('#b');
    step = 'gis'; await p.waitForSelector('#ddb', { timeout: 30000 });
    await p.waitForFunction(() => /\(\d+\)/.test(document.querySelector('#ddb').textContent) && !/\(0\)/.test(document.querySelector('#ddb').textContent), null, { timeout: 60000 }).catch(() => out('GIS', 'danh sách rỗng hoặc quá hạn'));
    await p.waitForTimeout(6000);
    out('GIS dropdown', await p.textContent('#ddb'));
    out('realtime badge', (await p.textContent('.rt')) + ' | ' + (await p.getAttribute('.rt', 'title')));
    await p.click('#ddb'); out('GIS items', await p.$$eval('.menu .it', els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim())));
    step = 'drawer'; await p.click('.menu .it >> nth=0'); await p.waitForSelector('.drawer h2', { timeout: 10000 });
    await p.waitForTimeout(4000);
    out('drawer', await p.textContent('.drawer h2')); out('drawer status', await p.$$eval('.drawer .res', e => e.map(x => x.textContent).filter(Boolean)));
    await p.click('text=Show lịch sử'); await p.waitForTimeout(6000);
    out('history rows', await p.$$eval('.drawer tbody tr', r => r.length));
    await p.screenshot({ path: 'web-gis.png' });
    step = 'lcu tab'; await p.click('a:has-text("Danh sách LCU")'); await p.waitForSelector('#s');
    await p.waitForFunction(() => /\d+ LCU/.test(document.querySelector('#s').textContent), null, { timeout: 60000 }).catch(() => out('LCU', 'quá hạn chờ tải'));
    out('LCU status', await p.textContent('#s')); out('LCU rows', await p.$$eval('tr.lrow', r => r.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 90))));
    await p.screenshot({ path: 'web-lcu.png' });
  } catch (x) { out('FAILED at ' + step, x.message.split('\n')[0]); await p.screenshot({ path: 'web-fail.png' }).catch(() => {}); process.exitCode = 1; }
  await b.close();
})();
