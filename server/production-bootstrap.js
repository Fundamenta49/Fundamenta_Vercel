/**
 * Production Bootstrap File
 * 
 * This file is designed to be the entry point for production deployments.
 * It ensures that the server is able to respond to health checks while
 * also starting the full application.
 */

import { createServer } from 'http';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Global flag to track if the application is already starting
let appStarting = false;

// Health check response
app.get('/', (req, res) => {
  // Handle health checks first
  const isHealthCheck = 
    req.headers['user-agent']?.includes('GoogleHC') ||
    req.query['health-check'] === 'true' ||
    req.headers['x-health-check'] === 'true';
    
  if (isHealthCheck) {
    console.log(`Health check request: ${req.method} ${req.path}`);
    return res.status(200).json({ status: 'ok' });
  }
  
  // If app is already starting, show a loading message
  if (appStarting) {
    res.set('Content-Type', 'text/html');
    return res.send(`
      <html>
        <head>
          <title>Fundamenta - Application Starting</title>
          <meta http-equiv="refresh" content="5">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
              color: #333;
              text-align: center;
              padding: 0 20px;
            }
            h1 { color: #4B5563; }
            .loader {
              border: 5px solid #f3f3f3;
              border-top: 5px solid #3498db;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 2s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <h1>Fundamenta Application</h1>
          <div class="loader"></div>
          <p>The application is starting up, please wait...</p>
          <p>This page will automatically refresh when ready.</p>
        </body>
      </html>
    `);
  }
  
  // Start the application if it's not already starting
  if (!appStarting) {
    appStarting = true;
    console.log('Starting main application...');
    
    // Import the real server entry point
    import('./index.js')
      .then(() => {
        console.log('Main application started successfully');
      })
      .catch(err => {
        console.error('Failed to start main application:', err);
        appStarting = false;
      });
      
    // Show starting page
    res.set('Content-Type', 'text/html');
    return res.send(`
      <html>
        <head>
          <title>Fundamenta - Application Starting</title>
          <meta http-equiv="refresh" content="5">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
              color: #333;
              text-align: center;
              padding: 0 20px;
            }
            h1 { color: #4B5563; }
            .loader {
              border: 5px solid #f3f3f3;
              border-top: 5px solid #3498db;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 2s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <h1>Fundamenta Application</h1>
          <div class="loader"></div>
          <p>The application is starting for the first time, please wait...</p>
          <p>This page will automatically refresh when ready.</p>
        </body>
      </html>
    `);
  }
});

// Start the server
const port = process.env.PORT || 8080;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Production bootstrap server started on port ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Current directory: ${process.cwd()}`);
  
  // List directories to help debug deployment issues
  try {
    const directories = fs.readdirSync('.');
    console.log('Current directory contents:', directories);
    
    if (fs.existsSync('./dist')) {
      const distContents = fs.readdirSync('./dist');
      console.log('Dist directory contents:', distContents);
      
      if (fs.existsSync('./dist/server')) {
        const serverContents = fs.readdirSync('./dist/server');
        console.log('Server directory contents:', serverContents);
      }
    }
  } catch (err) {
    console.error('Error reading directories:', err);
  }
});