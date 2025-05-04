// Absolute bare minimum health check server for CloudRun
require('http').createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end('{"status":"ok"}');
}).listen(process.env.PORT || 8080, '0.0.0.0');