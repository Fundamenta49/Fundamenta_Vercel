/**
 * Deployment Verification Script
 * This script checks for potential issues that could affect CloudRun deployment
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Starting Fundamenta Deployment Verification');
console.log('============================================');

// Check if .replit.deployments exists
console.log('\n1️⃣ Checking .replit.deployments configuration');
try {
  const deploymentConfig = fs.readFileSync('.replit.deployments', 'utf8');
  console.log('✅ .replit.deployments file found');
  
  try {
    const config = JSON.parse(deploymentConfig);
    console.log('✅ .replit.deployments file contains valid JSON');
    
    // Check required fields
    const requiredFields = ['startCommand', 'buildCommand', 'entrypoint', 'deploymentTarget'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ All required deployment fields present');
      console.log('   📋 Deployment configuration:');
      console.log(`   • Start Command: ${config.startCommand}`);
      console.log(`   • Build Command: ${config.buildCommand}`);
      console.log(`   • Entrypoint: ${config.entrypoint}`);
      console.log(`   • Target: ${config.deploymentTarget}`);
    } else {
      console.log(`❌ Missing required fields in .replit.deployments: ${missingFields.join(', ')}`);
    }
    
    // Verify deploymentTarget is cloudrun
    if (config.deploymentTarget !== 'cloudrun') {
      console.log(`⚠️ Deployment target is "${config.deploymentTarget}", but should be "cloudrun"`);
    } else {
      console.log('✅ Deployment target correctly set to "cloudrun"');
    }
  } catch (e) {
    console.log('❌ Error parsing .replit.deployments file:', e.message);
  }
} catch (e) {
  console.log('❌ .replit.deployments file not found or not readable');
}

// Check build script exists and is executable
console.log('\n2️⃣ Checking build script');
try {
  const buildScript = fs.readFileSync('build.sh', 'utf8');
  console.log('✅ build.sh file found');
  
  try {
    fs.accessSync('build.sh', fs.constants.X_OK);
    console.log('✅ build.sh is executable');
  } catch (e) {
    console.log('⚠️ build.sh is not executable. Consider running "chmod +x build.sh"');
  }
  
  // Check for key build steps
  if (buildScript.includes('esbuild')) {
    console.log('✅ build.sh contains esbuild command');
  } else {
    console.log('❌ build.sh may be missing esbuild command');
  }
  
  if (buildScript.includes('vite build')) {
    console.log('✅ build.sh contains vite build command');
  } else {
    console.log('❌ build.sh may be missing vite build command');
  }
  
  if (buildScript.includes('health')) {
    console.log('✅ build.sh contains health check references');
  } else {
    console.log('⚠️ build.sh may be missing health check handling');
  }
} catch (e) {
  console.log('❌ build.sh file not found or not readable');
}

// Check health-checks.ts file
console.log('\n3️⃣ Checking health check implementation');
try {
  const healthChecks = fs.readFileSync('server/health-checks.ts', 'utf8');
  console.log('✅ health-checks.ts file found');
  
  if (healthChecks.includes('rootHealthCheckMiddleware')) {
    console.log('✅ rootHealthCheckMiddleware function found in health-checks.ts');
  } else {
    console.log('❌ rootHealthCheckMiddleware function not found in health-checks.ts');
  }
  
  if (healthChecks.includes('req.path === \'/\'')) {
    console.log('✅ Root path check found in health-checks.ts');
  } else {
    console.log('❌ Root path check not found in health-checks.ts');
  }
} catch (e) {
  console.log('❌ server/health-checks.ts file not found or not readable');
}

// Check for health check registration in server/index.ts
console.log('\n4️⃣ Checking health check registration');
try {
  const serverIndex = fs.readFileSync('server/index.ts', 'utf8');
  console.log('✅ server/index.ts file found');
  
  if (serverIndex.includes('import { rootHealthCheckMiddleware }')) {
    console.log('✅ rootHealthCheckMiddleware import found in server/index.ts');
  } else {
    console.log('❌ rootHealthCheckMiddleware import not found in server/index.ts');
  }
  
  if (serverIndex.includes('app.use(rootHealthCheckMiddleware)')) {
    console.log('✅ rootHealthCheckMiddleware registration found in server/index.ts');
  } else {
    console.log('❌ rootHealthCheckMiddleware registration not found in server/index.ts');
  }
} catch (e) {
  console.log('❌ server/index.ts file not found or not readable');
}

// Live test of health endpoint if server is running
console.log('\n5️⃣ Live testing health endpoint');
const port = process.env.PORT || 5000;
const options = {
  hostname: 'localhost',
  port: port,
  path: '/',
  method: 'GET',
  timeout: 3000,
};

const req = http.request(options, (res) => {
  console.log(`✅ Server responded with status code: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Status code 200 OK received');
  } else {
    console.log(`⚠️ Expected status code 200, but got ${res.statusCode}`);
  }
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('✅ Response is valid JSON');
      
      if (parsed.status === 'ok') {
        console.log('✅ Response contains status: "ok"');
      } else {
        console.log(`⚠️ Expected status: "ok", but got "${parsed.status}"`);
      }
      
      console.log('📊 Full health check response:');
      console.log(data);
      
      summarizeResults();
    } catch (e) {
      console.log('❌ Response is not valid JSON:', data);
      summarizeResults();
    }
  });
});

req.on('error', (e) => {
  console.log(`❌ Health check request failed: ${e.message}`);
  console.log('This often means the server is not running. Start it with "npm run dev"');
  summarizeResults();
});

req.on('timeout', () => {
  console.log('❌ Health check request timed out');
  req.destroy();
  summarizeResults();
});

req.end();

function summarizeResults() {
  console.log('\n============================================');
  console.log('🚀 Deployment Verification Complete');
  console.log('\nIf all checks passed, your app should deploy successfully to CloudRun.');
  console.log('Make sure the server responds with a 200 OK status at the root path (/)');
  console.log('when deployed to ensure CloudRun deployment health checks pass.');
  console.log('\nTo deploy, use the Replit "Deploy" button in the project view.');
}