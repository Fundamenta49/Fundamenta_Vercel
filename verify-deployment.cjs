/**
 * Deployment Verification Script
 * This script checks for potential issues that could affect CloudRun deployment
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

// Files that should exist for successful deployment
const requiredFiles = [
  '_health',
  'public/_health', 
  'health-check-express.js',
  'cloudrun-health-web.js',
  'Procfile',
  '.replit.deployments',
  'data/exercises.json'
];

// Files to check content of
const healthCheckFiles = [
  '_health',
  'public/_health'
];

// Health check response that CloudRun expects
const EXPECTED_HEALTH_RESPONSE = JSON.stringify({ status: 'ok' });

// Results storage
const results = {
  missingFiles: [],
  incorrectContent: [],
  testResults: []
};

// Check for missing files
console.log('Checking for required files...');
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    results.missingFiles.push(file);
    console.log(`❌ Missing: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Check health check file contents
console.log('\nVerifying health check file contents...');
healthCheckFiles.forEach(file => {
  try {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim() !== EXPECTED_HEALTH_RESPONSE.trim()) {
        results.incorrectContent.push(file);
        console.log(`❌ Incorrect content in ${file}. Expected ${EXPECTED_HEALTH_RESPONSE}, got ${content}`);
      } else {
        console.log(`✅ Correct content in ${file}`);
      }
    }
  } catch (error) {
    console.error(`Error checking ${file}:`, error);
  }
});

// Test local health server
console.log('\nTesting health check endpoints...');
function testEndpoint(url, description) {
  return new Promise((resolve) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const result = {
            url,
            description,
            status: res.statusCode,
            content: data,
            success: res.statusCode === 200 && parsed.status === 'ok'
          };
          results.testResults.push(result);
          console.log(`${result.success ? '✅' : '❌'} ${description}: ${res.statusCode} ${data}`);
          resolve(result);
        } catch (e) {
          const result = {
            url,
            description,
            status: res.statusCode,
            content: data,
            success: false,
            error: e.message
          };
          results.testResults.push(result);
          console.log(`❌ ${description}: ${res.statusCode} Invalid JSON: ${e.message}`);
          resolve(result);
        }
      });
    }).on('error', error => {
      const result = {
        url,
        description,
        success: false,
        error: error.message
      };
      results.testResults.push(result);
      console.log(`❌ ${description}: Error: ${error.message}`);
      resolve(result);
    });
  });
}

// Start a simple server on port 12345 for testing
const testServer = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/_health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(EXPECTED_HEALTH_RESPONSE);
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Function to summarize all results
function summarizeResults() {
  console.log('\n----- DEPLOYMENT VERIFICATION SUMMARY -----');
  
  if (results.missingFiles.length === 0) {
    console.log('✅ All required files are present');
  } else {
    console.log(`❌ Missing files: ${results.missingFiles.join(', ')}`);
  }
  
  if (results.incorrectContent.length === 0) {
    console.log('✅ All health check files have correct content');
  } else {
    console.log(`❌ Files with incorrect content: ${results.incorrectContent.join(', ')}`);
  }
  
  const successfulTests = results.testResults.filter(r => r.success).length;
  console.log(`Health check tests: ${successfulTests}/${results.testResults.length} successful`);
  
  if (results.missingFiles.length === 0 && 
      results.incorrectContent.length === 0 && 
      successfulTests === results.testResults.length) {
    console.log('\n✅ DEPLOYMENT VERIFICATION PASSED');
    console.log('Your application should be ready for CloudRun deployment');
  } else {
    console.log('\n❌ DEPLOYMENT VERIFICATION FAILED');
    console.log('Please fix the issues before deploying');
  }
  
  console.log('\nRecommendation: Check the .replit.deployments file to ensure it specifies:');
  console.log('1. healthCheckPath: "/"');
  console.log('2. startCommand: "node cloudrun-health-web.js"');
}

// Run the tests
async function runTests() {
  testServer.listen(12345, () => {
    console.log('Test server running on port 12345');
    
    Promise.all([
      testEndpoint('http://localhost:12345/', 'Root path'),
      testEndpoint('http://localhost:12345/_health', 'Health path')
    ]).then(() => {
      testServer.close(() => {
        summarizeResults();
      });
    });
  });
}

runTests();