/**
 * Production Server Entry Point
 * 
 * This file provides a specialized server configuration for production deployments.
 * It focuses on performance, security, and reliability for deployments in cloud environments.
 * 
 * Usage: NODE_ENV=production node deployment/production-server.js
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { setupProductionStatic } from '../server/static-server.js';
import { setupDirectHealthCheck } from '../server/direct-health.js';
import { registerRoutes } from '../server/routes.js';
import { log } from '../server/vite.js';
import { runAllMigrations } from '../server/db/index.js';
import { ensureTables } from '../server/db.js';
import { performDatabaseMaintenance } from '../server/maintenance.js';

// Force production mode
process.env.NODE_ENV = 'production';

// Create Express application
const app = express();
const startTime = Date.now();

log('Starting production server...');
log(`Environment: ${process.env.NODE_ENV}`);
log(`Port: ${process.env.PORT || 8080}`);
log(`Process ID: ${process.pid}`);
log(`Platform: ${process.platform}`);

// Register enhanced health check system
setupDirectHealthCheck(app);
log('Enhanced health check system registered');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.adzuna.com"]
    }
  }
}));

// Apply compression for all responses
app.use(compression());

// Basic middleware setup with increased JSON payload limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

// CORS configuration for production
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));

// API health check endpoint
app.get("/api/health", (_req, res) => {
  const health = {
    status: "ok",
    uptime: Date.now() - startTime,
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 8080,
    timestamp: new Date().toISOString(),
    pid: process.pid
  };
  res.json(health);
});

// Initialize server 
(async () => {
  try {
    log('Starting production server initialization...');
    
    // Run database migrations
    log('Running database migrations...');
    try {
      await runAllMigrations();
      log(`Database migrations completed`);
      
      // Ensure tables exist
      log('Checking database tables...');
      await ensureTables();
      log('Database tables verified');
    } catch (error) {
      log(`Database initialization warning: ${error instanceof Error ? error.message : String(error)}`);
      log('Server will continue, but database functionality may be impaired');
    }
    
    // Run session cleanup
    log('Running database maintenance...');
    try {
      await performDatabaseMaintenance();
      log('Database maintenance completed');
    } catch (error) {
      log(`Database maintenance warning: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Register API routes
    const server = await registerRoutes(app);
    log('API routes registered');
    
    // Set up robust static file serving for the client SPA
    setupProductionStatic(app);
    log('Production static file serving configured');
    
    // Start the server
    const port = parseInt(process.env.PORT || '8080', 10);
    const host = "0.0.0.0";
    
    server.listen(port, host, () => {
      log(`Production server started on ${host}:${port}`);
      log(`Server ready for requests`);
    });
    
    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        log('HTTP server closed');
        process.exit(0);
      });
      
      // Force close if graceful shutdown takes too long
      setTimeout(() => {
        log('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    });
    
    process.on('SIGINT', () => {
      log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        log('HTTP server closed');
        process.exit(0);
      });
      
      setTimeout(() => {
        log('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    });
    
  } catch (error) {
    log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
    console.error('Error details:', error);
    process.exit(1);
  }
})();