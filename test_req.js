import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/master-license/validate?license_key=test&domain=test.com',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.on('error', e => console.error(e));
req.end();
