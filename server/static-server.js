/**
 * Enhanced static file server for production deployments
 * 
 * This module provides robust static file serving for the production build,
 * with proper caching headers and fallback to index.html for SPA routing.
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure enhanced static file serving for production
 * @param {express.Express} app - Express application instance
 */
export function setupProductionStatic(app) {
  // Find client distribution folder - look in multiple possible locations
  const possibleClientPaths = [
    path.resolve(process.cwd(), 'dist', 'client'),
    path.resolve(process.cwd(), 'client', 'dist'),
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, '..', 'dist', 'client'),
    path.resolve(__dirname, '..', 'client', 'dist')
  ];
  
  // Find the first path that exists and contains index.html
  let clientDistPath = null;
  for (const distPath of possibleClientPaths) {
    if (fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'))) {
      clientDistPath = distPath;
      break;
    }
  }
  
  if (!clientDistPath) {
    log('ERROR: Could not find client build folder with index.html', 'static');
    log('Available paths checked:', 'static');
    possibleClientPaths.forEach(p => log(` - ${p}`, 'static'));
    
    // Fall back to public folder if nothing else works
    if (fs.existsSync(path.resolve(process.cwd(), 'public'))) {
      clientDistPath = path.resolve(process.cwd(), 'public');
      log(`WARNING: Falling back to public folder: ${clientDistPath}`, 'static');
    } else {
      throw new Error('Could not find client build folder. Make sure to run npm build first.');
    }
  }
  
  log(`Serving static files from: ${clientDistPath}`, 'static');
  
  // Set up static middleware with proper cache headers
  const staticOptions = {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Set longer cache duration for assets with content hashes in filenames
      if (filePath.match(/\.(js|css|woff2|jpg|png|svg|webp)$/)) {
        if (path.basename(filePath).includes('.')) {
          // Assets with content hash get aggressive caching
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          // Assets without hash get shorter cache time
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
      } else {
        // Other files get short cache time
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    }
  };
  
  // Serve static assets with optimized configuration
  app.use(express.static(clientDistPath, staticOptions));
  
  // Ensure index.html is always served for client-side routing
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Skip asset requests that weren't found
    if (req.path.match(/\.(js|css|woff2|jpg|png|svg|ico|webp)$/)) {
      return res.status(404).send('Asset not found');
    }
    
    // For all other routes, serve index.html to enable client-side routing
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });

  log('Enhanced static file serving configured for production', 'static');
  return app;
}

/**
 * Utility to get asset paths from the client build
 * @returns {Object} Object containing paths to key client assets
 */
export function getClientAssetPaths() {
  const possibleClientPaths = [
    path.resolve(process.cwd(), 'dist', 'client'),
    path.resolve(process.cwd(), 'client', 'dist'),
    path.resolve(process.cwd(), 'dist')
  ];
  
  // Find client path
  let clientPath = null;
  for (const distPath of possibleClientPaths) {
    if (fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'))) {
      clientPath = distPath;
      break;
    }
  }
  
  if (!clientPath) {
    return { found: false };
  }
  
  return {
    found: true,
    root: clientPath,
    indexHtml: path.join(clientPath, 'index.html')
  };
}