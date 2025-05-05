
const http = require('http');
const assert = require('assert');

const ports = [5000, 8080, 3000];
const healthResponse = JSON.stringify({ status: 'ok' });

async function testPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://0.0.0.0:${port}/`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          port,
          status: res.statusCode,
          data: data.trim(),
          success: res.statusCode === 200 && data.trim() === healthResponse
        });
      });
    });
    
    req.on('error', () => {
      resolve({ port, success: false, error: 'Connection failed' });
    });
  });
}

async function runTests() {
  console.log('Running deployment verification tests...\n');

  const results = await Promise.all(ports.map(testPort));
  
  let passing = 0;
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ Port ${result.port}: Health check passing`);
      passing++;
    } else {
      console.log(`❌ Port ${result.port}: Health check failed`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      } else {
        console.log(`   Got status ${result.status}, response: ${result.data}`);
      }
    }
  });

  console.log(`\n${passing}/${ports.length} ports passing health checks`);
  
  if (passing === 0) {
    console.log('\n❌ CRITICAL: No health checks passing');
    process.exit(1);
  }
}

runTests();
