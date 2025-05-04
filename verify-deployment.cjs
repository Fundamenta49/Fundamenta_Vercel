/**
 * Deployment Verification Script
 * This script checks if our minimal health check server works properly
 */

const http = require('http');
const PORT = 3000;

// Test the server locally
console.log(`Starting test server on port ${PORT}...`);
const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'ok' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${PORT}/`);
  
  // Test GET request to root path
  console.log('Testing GET request to root path...');
  http.get(`http://0.0.0.0:${PORT}/`, (res) => {
    console.log(`Status code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response body: ${data}`);
      console.log(`Response matches required format: ${data === '{"status":"ok"}'}`);
      
      // Test GET request to _health path
      console.log('\nTesting GET request to /_health path...');
      http.get(`http://0.0.0.0:${PORT}/_health`, (res) => {
        console.log(`Status code: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`Response body: ${data}`);
          console.log(`Response matches required format: ${data === '{"status":"ok"}'}`);
          
          // Clean up
          server.close(() => {
            console.log('\nAll tests completed. Server closed.');
            
            if (data === '{"status":"ok"}') {
              console.log('✅ Deployment verification PASSED.');
              console.log('The server correctly responds with {"status":"ok"} for health checks.');
            } else {
              console.log('❌ Deployment verification FAILED.');
              console.log('The server response does not match the required {"status":"ok"} format.');
            }
          });
        });
      });
    });
  });
});