/**
 * Client Asset Verification Tool
 * 
 * This script verifies that client assets are properly built and accessible.
 * It checks the build output for key files and assets required for the application.
 * 
 * Run with: node deployment/verify-client-assets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Constants
const BUILT_CLIENT_PATHS = [
  path.join(rootDir, 'dist', 'public'),
  path.join(rootDir, 'dist', 'client'),
  path.join(rootDir, 'client', 'dist')
];

// Utility for colorful console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
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

// Print a header for sections
function printHeader(title) {
  console.log('\n' + colors.cyan + '='.repeat(80) + colors.reset);
  console.log(colors.cyan + ' ' + title + colors.reset);
  console.log(colors.cyan + '='.repeat(80) + colors.reset);
}

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// Function to find built client directory
function findClientBuildDirectory() {
  for (const clientPath of BUILT_CLIENT_PATHS) {
    if (directoryExists(clientPath)) {
      return clientPath;
    }
  }
  return null;
}

// Function to check essential files in build directory
function checkEssentialFiles(buildDir) {
  const essentialFiles = [
    'index.html',
    'assets'
  ];
  
  const missingFiles = [];
  
  for (const file of essentialFiles) {
    const filePath = path.join(buildDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }
  
  return {
    allFound: missingFiles.length === 0,
    missingFiles
  };
}

// Function to analyze asset files
function analyzeAssetFiles(buildDir) {
  const assetsDir = path.join(buildDir, 'assets');
  
  if (!directoryExists(assetsDir)) {
    return {
      jsFiles: 0,
      cssFiles: 0,
      imageFiles: 0,
      fontFiles: 0,
      otherFiles: 0,
      totalSize: 0
    };
  }
  
  let jsFiles = 0;
  let cssFiles = 0;
  let imageFiles = 0;
  let fontFiles = 0;
  let otherFiles = 0;
  let totalSize = 0;
  
  function scanDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else {
        totalSize += stat.size;
        
        if (file.endsWith('.js')) {
          jsFiles++;
        } else if (file.endsWith('.css')) {
          cssFiles++;
        } else if (file.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          imageFiles++;
        } else if (file.match(/\.(woff|woff2|ttf|eot)$/i)) {
          fontFiles++;
        } else {
          otherFiles++;
        }
      }
    }
  }
  
  scanDirectory(assetsDir);
  
  return {
    jsFiles,
    cssFiles,
    imageFiles,
    fontFiles,
    otherFiles,
    totalSize
  };
}

// Function to check for source maps in production build
function checkSourceMaps(buildDir) {
  const assetsDir = path.join(buildDir, 'assets');
  
  if (!directoryExists(assetsDir)) {
    return {
      hasSourceMaps: false,
      count: 0
    };
  }
  
  let sourceMapCount = 0;
  
  function scanForSourceMaps(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanForSourceMaps(filePath);
      } else if (file.endsWith('.map')) {
        sourceMapCount++;
      }
    }
  }
  
  scanForSourceMaps(assetsDir);
  
  return {
    hasSourceMaps: sourceMapCount > 0,
    count: sourceMapCount
  };
}

// Function to check index.html
function analyzeIndexHtml(buildDir) {
  const indexPath = path.join(buildDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    return {
      valid: false,
      hasScriptTags: false,
      hasCssTags: false
    };
  }
  
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Check for script tags
  const scriptTagsMatch = content.match(/<script[^>]*src="[^"]*"[^>]*>/g);
  const hasScriptTags = scriptTagsMatch !== null && scriptTagsMatch.length > 0;
  
  // Check for CSS links
  const cssLinksMatch = content.match(/<link[^>]*rel="stylesheet"[^>]*>/g);
  const hasCssTags = cssLinksMatch !== null && cssLinksMatch.length > 0;
  
  return {
    valid: true,
    hasScriptTags,
    hasCssTags
  };
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}

// Main function
async function main() {
  printHeader('CLIENT ASSET VERIFICATION');
  log('Verifying client assets for deployment...');
  
  // Check for built client directory
  const clientBuildDir = findClientBuildDirectory();
  
  if (!clientBuildDir) {
    log('No client build directory found!', 'error');
    log('Run npm run build to generate client assets before deployment', 'info');
    return;
  }
  
  log(`Found client build directory: ${clientBuildDir}`, 'success');
  
  // Check essential files
  const essentialFilesCheck = checkEssentialFiles(clientBuildDir);
  
  if (essentialFilesCheck.allFound) {
    log('All essential files found in build directory', 'success');
  } else {
    log('Missing essential files in build directory:', 'error');
    essentialFilesCheck.missingFiles.forEach(file => {
      log(` - ${file}`, 'error');
    });
  }
  
  // Analyze index.html
  const indexHtmlAnalysis = analyzeIndexHtml(clientBuildDir);
  
  if (indexHtmlAnalysis.valid) {
    log('index.html is valid', 'success');
    
    if (indexHtmlAnalysis.hasScriptTags) {
      log('index.html contains script tags', 'success');
    } else {
      log('index.html does not contain script tags!', 'error');
    }
    
    if (indexHtmlAnalysis.hasCssTags) {
      log('index.html contains CSS links', 'success');
    } else {
      log('index.html does not contain CSS links!', 'warning');
    }
  } else {
    log('index.html is missing or invalid!', 'error');
  }
  
  // Analyze asset files
  const assetAnalysis = analyzeAssetFiles(clientBuildDir);
  
  printHeader('ASSET SUMMARY');
  log(`JavaScript files: ${assetAnalysis.jsFiles}`);
  log(`CSS files: ${assetAnalysis.cssFiles}`);
  log(`Image files: ${assetAnalysis.imageFiles}`);
  log(`Font files: ${assetAnalysis.fontFiles}`);
  log(`Other files: ${assetAnalysis.otherFiles}`);
  log(`Total asset size: ${formatFileSize(assetAnalysis.totalSize)}`);
  
  // Check for source maps
  const sourceMapCheck = checkSourceMaps(clientBuildDir);
  
  if (sourceMapCheck.hasSourceMaps) {
    log(`Found ${sourceMapCheck.count} source map files in production build`, 'warning');
    log('Consider removing source maps for production to reduce bundle size', 'warning');
  } else {
    log('No source maps found in production build', 'success');
  }
  
  // Final assessment
  printHeader('DEPLOYMENT READINESS ASSESSMENT');
  
  if (essentialFilesCheck.allFound && indexHtmlAnalysis.valid && 
      indexHtmlAnalysis.hasScriptTags && assetAnalysis.jsFiles > 0) {
    log('Client assets appear to be properly built and ready for deployment', 'success');
  } else {
    log('Client assets have issues that should be resolved before deployment', 'error');
    log('Please address the issues noted above', 'info');
  }
}

// Run the main function
main().catch(error => {
  log(`Unhandled error: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});