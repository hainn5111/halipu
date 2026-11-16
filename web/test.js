process.env.MOCK_LOGIN = '1';
const assert = require('assert');
const { server } = require('./server');
server.listen(0, async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, b, h = {}) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...h }, body: JSON.stringify(b) });
  assert.equal((await fetch(base + '/api/me')).status, 401);
  assert.equal((await fetch(base + '/home', { redirect: 'manual' })).status, 302);
  assert.equal((await post('/api/login', { username: 'a', password: 'x' })).status, 401);
  const r = await post('/api/login', { username: 'a', password: 'demo' });
  assert.equal(r.status, 200);
  const cookie = r.headers.get('set-cookie').split(';')[0];
  assert.equal((await fetch(base + '/home', { headers: { cookie } })).status, 200);
  assert.equal((await (await fetch(base + '/api/me', { headers: { cookie } })).json()).username, 'a');
  await post('/api/logout', {}, { cookie });
  assert.equal((await fetch(base + '/api/me', { headers: { cookie } })).status, 401);
  console.log('all tests passed'); server.close();
});
