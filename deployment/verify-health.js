/**
 * Health Check Verification Script
 * 
 * This script tests various health check endpoints to ensure 
 * they are properly configured for production deployment.
 * 
 * Run with: node deployment/verify-health.js [URL]
 * 
 * Example: node deployment/verify-health.js http://localhost:5000
 */

const http = require('http');
const https = require('https');

// Get the base URL from command-line arguments or use localhost
const baseUrl = process.argv[2] || 'http://localhost:5000';
console.log(`Testing health checks on: ${baseUrl}`);

// Endpoints to test
const endpoints = [
  '/',                 // Root path (should work with Accept: application/json header)
  '/health',           // Standard health check
  '/_health',          // Alternative health check
  '/.well-known/health', // Well-known URI pattern
  '/api/health',       // API health check
];

// User-agents to test
const userAgents = [
  undefined,                  // Default
  'GoogleHC/1.0',             // Google health checker
  'kube-probe/1.21',          // Kubernetes probe
  'LivenessProbe/1.0',        // Generic liveness probe
];

// Track test results
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

// Function to check if a URL returns a valid health response
function checkHealthEndpoint(url, userAgent) {
  return new Promise((resolve) => {
    totalTests++;
    
    // Determine the HTTP library to use based on the URL
    const client = url.startsWith('https') ? https : http;
    
    // Set up request options with possible user agent
    const options = {
      headers: {
        'Accept': 'application/json',
      }
    };
    
    if (userAgent) {
      options.headers['User-Agent'] = userAgent;
    }
    
    const req = client.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Check for successful response
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.status === 'ok') {
              console.log(`✅ ${url} ${userAgent ? '('+userAgent+')' : ''} - Status: ${res.statusCode}, Body: ${data}`);
              passedTests++;
              resolve(true);
            } else {
              console.log(`❌ ${url} ${userAgent ? '('+userAgent+')' : ''} - Status: ${res.statusCode}, Invalid health format: ${data}`);
              failedTests.push({ url, userAgent, error: 'Invalid health format' });
              resolve(false);
            }
          } catch (e) {
            console.log(`❌ ${url} ${userAgent ? '('+userAgent+')' : ''} - Status: ${res.statusCode}, Invalid JSON: ${data}`);
            failedTests.push({ url, userAgent, error: 'Invalid JSON' });
            resolve(false);
          }
        } else {
          console.log(`❌ ${url} ${userAgent ? '('+userAgent+')' : ''} - Status: ${res.statusCode}`);
          failedTests.push({ url, userAgent, error: `Status code ${res.statusCode}` });
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${url} ${userAgent ? '('+userAgent+')' : ''} - Error: ${error.message}`);
      failedTests.push({ url, userAgent, error: error.message });
      resolve(false);
    });
    
    // Set a timeout for the request
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`❌ ${url} ${userAgent ? '('+userAgent+')' : ''} - Timeout`);
      failedTests.push({ url, userAgent, error: 'Timeout' });
      resolve(false);
    });
  });
}

// Run all the health check tests
async function runTests() {
  console.log('Starting health check verification...\n');
  
  // Test all combinations of endpoints and user agents
  for (const endpoint of endpoints) {
    for (const userAgent of userAgents) {
      const url = `${baseUrl}${endpoint}`;
      await checkHealthEndpoint(url, userAgent);
    }
  }
  
  // Special test for query parameter health check
  await checkHealthEndpoint(`${baseUrl}/?health=true`);
  await checkHealthEndpoint(`${baseUrl}/?health-check=true`);
  
  // Print summary
  console.log('\n--- Health Check Summary ---');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests.length}`);
  
  if (failedTests.length > 0) {
    console.log('\nFailed tests:');
    failedTests.forEach((test, i) => {
      console.log(`${i+1}. ${test.url} ${test.userAgent ? '('+test.userAgent+')' : ''} - ${test.error}`);
    });
    
    // Return failure code
    process.exit(1);
  } else {
    console.log('\nAll health checks passed successfully!');
  }
}

// Run the tests
runTests();