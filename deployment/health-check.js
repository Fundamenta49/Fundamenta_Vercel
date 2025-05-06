/**
 * Simple Health Check Script
 * 
 * This standalone script performs a basic health check on the 
 * deployed application to verify it's running correctly.
 * 
 * Usage: node deployment/health-check.js [url]
 * Example: node deployment/health-check.js https://your-app.replit.app
 */

const https = require('https');
const http = require('http');

// Get URL from command line arguments or use default
const baseUrl = process.argv[2] || 'http://localhost:8080';
console.log(`Testing health check on: ${baseUrl}`);

// Function to perform a health check
function checkHealth(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            resolve({
              status: 'success',
              code: res.statusCode,
              response
            });
          } catch (error) {
            resolve({
              status: 'error',
              code: res.statusCode,
              error: 'Invalid JSON response',
              data
            });
          }
        } else {
          resolve({
            status: 'error',
            code: res.statusCode,
            data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject({
        status: 'error',
        error: error.message
      });
    });
    
    // Set a timeout
    req.setTimeout(5000, () => {
      req.destroy();
      reject({
        status: 'error',
        error: 'Request timed out'
      });
    });
  });
}

// Check health endpoints
async function main() {
  const endpoints = [
    '/health',
    '/_health',
    '/.well-known/health',
    '/api/health'
  ];
  
  const results = [];
  
  console.log('Starting health checks...\n');
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    console.log(`Testing ${url}...`);
    
    try {
      const result = await checkHealth(url);
      results.push({ endpoint, ...result });
      
      if (result.status === 'success') {
        console.log(`✅ ${endpoint}: ${result.code} - ${JSON.stringify(result.response)}`);
      } else {
        console.log(`❌ ${endpoint}: ${result.code} - ${result.data || result.error}`);
      }
    } catch (error) {
      results.push({ endpoint, status: 'error', error: error.message || error });
      console.log(`❌ ${endpoint}: ${error.error || error.message || error}`);
    }
    
    console.log();
  }
  
  // Summary
  console.log('\n=== HEALTH CHECK SUMMARY ===');
  
  const successful = results.filter(r => r.status === 'success' && r.response?.status === 'ok');
  
  if (successful.length > 0) {
    console.log('\n✅ Health check PASSED. Application is running properly.');
    console.log(`Found ${successful.length} working health endpoints.`);
  } else {
    console.log('\n❌ Health check FAILED. Application may not be running properly.');
    console.log('None of the health endpoints returned a valid status.');
  }
}

// Run the main function
main().catch(error => {
  console.error('Error running health check:', error);
  process.exit(1);
});