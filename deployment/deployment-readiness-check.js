/**
 * Deployment Readiness Check
 * 
 * This script performs comprehensive checks to ensure the application
 * is ready for deployment to production environments.
 * 
 * Run with: node deployment/deployment-readiness-check.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Constants
const ENV_FILE_PATH = path.join(rootDir, '.env');
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'OPENAI_API_KEY'
];
const OPTIONAL_ENV_VARS = [
  'PORT',
  'NODE_ENV',
  'STRIPE_SECRET_KEY',
  'ADZUNA_APP_ID',
  'ADZUNA_API_KEY',
  'SPOONACULAR_API_KEY'
];

// Utility for colorful console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Logger
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  
  switch (type) {
    case 'success':
      console.log(`${colors.green}[${timestamp}] ✓ ${message}${colors.reset}`);
      break;
    case 'error':
      console.log(`${colors.red}[${timestamp}] ✗ ${message}${colors.reset}`);
      break;
    case 'warning':
      console.log(`${colors.yellow}[${timestamp}] ⚠ ${message}${colors.reset}`);
      break;
    case 'info':
    default:
      console.log(`${colors.blue}[${timestamp}] ℹ ${message}${colors.reset}`);
      break;
  }
}

// Header for sections
function printHeader(title) {
  console.log('\n' + colors.cyan + '='.repeat(80) + colors.reset);
  console.log(colors.cyan + ' ' + title + colors.reset);
  console.log(colors.cyan + '='.repeat(80) + colors.reset);
}

// Run shell command and return output
function runCommand(command, ignoreErrors = false) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ignoreErrors ? 'pipe' : 'inherit' });
  } catch (error) {
    if (!ignoreErrors) {
      log(`Error running command: ${command}`, 'error');
      log(error.message, 'error');
    }
    return null;
  }
}

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Check environment variables
function checkEnvironmentVariables() {
  printHeader('Environment Variables Check');
  
  const missingRequired = [];
  const missingOptional = [];
  
  // Check for .env file
  if (!fileExists(ENV_FILE_PATH)) {
    log('.env file not found!', 'error');
  } else {
    log('.env file found', 'success');
    
    // Read .env file
    const envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    const envLines = envContent.split('\n');
    const envVars = {};
    
    // Parse .env file
    envLines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          envVars[key.trim()] = value.replace(/^["'](.*)["']$/, '$1'); // Remove quotes if present
        }
      }
    });
    
    // Check required variables
    REQUIRED_ENV_VARS.forEach(envVar => {
      if (!envVars[envVar] && !process.env[envVar]) {
        missingRequired.push(envVar);
      }
    });
    
    // Check optional variables
    OPTIONAL_ENV_VARS.forEach(envVar => {
      if (!envVars[envVar] && !process.env[envVar]) {
        missingOptional.push(envVar);
      }
    });
    
    // Report results
    if (missingRequired.length === 0) {
      log('All required environment variables are set', 'success');
    } else {
      log(`Missing required environment variables: ${missingRequired.join(', ')}`, 'error');
    }
    
    if (missingOptional.length === 0) {
      log('All optional environment variables are set', 'success');
    } else {
      log(`Missing optional environment variables: ${missingOptional.join(', ')}`, 'warning');
    }
  }
  
  return missingRequired.length === 0;
}

// Check TypeScript build configuration
function checkTypescriptConfig() {
  printHeader('TypeScript Configuration Check');
  
  const tsconfigPath = path.join(rootDir, 'tsconfig.json');
  
  if (!fileExists(tsconfigPath)) {
    log('tsconfig.json not found!', 'error');
    return false;
  }
  
  log('tsconfig.json found', 'success');
  
  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Check for essential compiler options
    const requiredOptions = ['outDir', 'rootDir', 'module', 'target', 'jsx'];
    const missingOptions = requiredOptions.filter(option => 
      !tsconfig.compilerOptions || tsconfig.compilerOptions[option] === undefined
    );
    
    if (missingOptions.length > 0) {
      log(`Missing required TypeScript compiler options: ${missingOptions.join(', ')}`, 'error');
      return false;
    }
    
    log('TypeScript configuration looks valid', 'success');
    return true;
  } catch (error) {
    log(`Error parsing tsconfig.json: ${error.message}`, 'error');
    return false;
  }
}

// Check package.json build scripts
function checkBuildScripts() {
  printHeader('Build Scripts Check');
  
  const packageJsonPath = path.join(rootDir, 'package.json');
  
  if (!fileExists(packageJsonPath)) {
    log('package.json not found!', 'error');
    return false;
  }
  
  log('package.json found', 'success');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for essential scripts
    if (!packageJson.scripts) {
      log('No scripts defined in package.json', 'error');
      return false;
    }
    
    const requiredScripts = ['build', 'start'];
    const missingScripts = requiredScripts.filter(script => 
      !packageJson.scripts[script]
    );
    
    if (missingScripts.length > 0) {
      log(`Missing required scripts in package.json: ${missingScripts.join(', ')}`, 'error');
      return false;
    }
    
    log('Build scripts look valid', 'success');
    
    // Check build script content
    const buildScript = packageJson.scripts.build;
    if (!buildScript.includes('vite build')) {
      log('Build script may not properly build the frontend', 'warning');
    }
    
    if (!buildScript.includes('server') && !buildScript.includes('esbuild')) {
      log('Build script may not properly build the backend', 'warning');
    }
    
    return true;
  } catch (error) {
    log(`Error parsing package.json: ${error.message}`, 'error');
    return false;
  }
}

// Check for deployment files
function checkDeploymentFiles() {
  printHeader('Deployment Files Check');
  
  const requiredFiles = [
    // Core deployment files
    'deployment/production-server.js',
    'deployment/cloudrun.Dockerfile',
    'deployment/replit-deployment.js',
    'deployment/README.md',
    
    // Server files
    'server/index.ts',
    'server/vite.ts',
    'server/direct-health.ts',
    'server/static-server.js',
    
    // Essential client files
    'client/index.html'
  ];
  
  const missingFiles = requiredFiles.filter(file => 
    !fileExists(path.join(rootDir, file))
  );
  
  if (missingFiles.length > 0) {
    log(`Missing required deployment files:`, 'error');
    missingFiles.forEach(file => {
      log(` - ${file}`, 'error');
    });
    return false;
  }
  
  log('All deployment files are present', 'success');
  return true;
}

// Check database connection
async function checkDatabaseConnection() {
  printHeader('Database Connection Check');
  
  // Try to run database validation
  log('Attempting to run database validation...');
  const result = runCommand('node deploy-validation.js', true);
  
  if (result === null) {
    log('Database connection check failed. Make sure DATABASE_URL is correctly set.', 'error');
    return false;
  }
  
  log('Database connection check passed', 'success');
  return true;
}

// Test TypeScript compilation
function testTypeScriptCompilation() {
  printHeader('TypeScript Compilation Check');
  
  log('Running TypeScript type check...');
  const result = runCommand('npm run check', true);
  
  if (result === null) {
    log('TypeScript compilation check failed', 'error');
    log('This may indicate type errors that could cause build failures', 'error');
    return false;
  }
  
  log('TypeScript compilation check passed', 'success');
  return true;
}

// Main function
async function main() {
  printHeader('DEPLOYMENT READINESS CHECK');
  log('Starting deployment readiness check for Fundamenta Life Skills platform...');
  
  // Run all checks
  const envCheck = checkEnvironmentVariables();
  const tsConfigCheck = checkTypescriptConfig();
  const buildScriptsCheck = checkBuildScripts();
  const deploymentFilesCheck = checkDeploymentFiles();
  const dbCheck = await checkDatabaseConnection();
  const tsCompilationCheck = testTypeScriptCompilation();
  
  // Summarize results
  printHeader('SUMMARY');
  
  const checks = [
    { name: 'Environment Variables', passed: envCheck },
    { name: 'TypeScript Configuration', passed: tsConfigCheck },
    { name: 'Build Scripts', passed: buildScriptsCheck },
    { name: 'Deployment Files', passed: deploymentFilesCheck },
    { name: 'Database Connection', passed: dbCheck },
    { name: 'TypeScript Compilation', passed: tsCompilationCheck }
  ];
  
  checks.forEach(check => {
    if (check.passed) {
      log(`${check.name}: PASSED`, 'success');
    } else {
      log(`${check.name}: FAILED`, 'error');
    }
  });
  
  const allPassed = checks.every(check => check.passed);
  
  if (allPassed) {
    log('\nAll checks passed! The application is ready for deployment.', 'success');
    log('\nNext steps:', 'info');
    log('1. Run `npm run build` to build the application', 'info');
    log('2. Choose a deployment option from Instructions.md', 'info');
    log('3. Deploy using the selected method', 'info');
    log('4. Verify the deployment using the post-deployment checklist', 'info');
  } else {
    log('\nSome checks failed. Please fix the issues before deploying.', 'error');
    log('Refer to Instructions.md for detailed guidance on fixing deployment issues.', 'info');
  }
}

// Run the main function
main().catch(error => {
  log(`Unhandled error: ${error.message}`, 'error');
  process.exit(1);
});