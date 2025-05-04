import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import multer from "multer";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { runAllMigrations } from "./db/index";
import { ensureTables } from "./db";
import { initializeFundiCore } from "./fundi-core/fundi-integration";
import { performDatabaseMaintenance, performAggressiveCleanup } from "./maintenance";
import { rootHealthCheckMiddleware, healthCheckRouter } from "./health-checks";
import { cloudRunHealthMiddleware } from "./cloud-run-health";
import { setupDirectHealthCheck } from "./direct-health";
import { installBareHealthCheck } from "./bare-health";

const startTime = Date.now();
log("Starting server...");
log(`Environment: ${process.env.NODE_ENV}`);
log(`Port: ${process.env.PORT || 5000}`);
log(`Process ID: ${process.pid}`);
log(`Platform: ${process.platform}`);

// Initialize Express
const app = express();

// Setup CloudRun health checks
log("CloudRun health check handlers registered");
log(`Express initialized (${Date.now() - startTime}ms)`);

// CRITICAL FIX: First, register the ultra-direct health check for CloudRun compatibility
// This must come before ANYTHING else to ensure CloudRun health checks work
setupDirectHealthCheck(app);
log("Ultra-direct health check registered (highest priority)");

// In production, use the CloudRun-optimized health check
if (process.env.NODE_ENV === 'production') {
  // Setup specialized handlers for CloudRun
  log("CloudRun production health checks registered");
} else {
  // In development, use the standard health check
  app.use(rootHealthCheckMiddleware);
  log("Root health check middleware registered as first priority middleware");

  // Also mount the dedicated health check router
  app.use('/', healthCheckRouter);
  log("Dedicated health check router mounted at root path");
}

// Basic middleware setup with increased JSON payload limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Content advisory middleware - applied to all responses
import { contentAdvisoryMiddleware } from './middleware/content-advisory-middleware';
app.use(contentAdvisoryMiddleware({ 
  contentThreshold: 100, // Only analyze content longer than 100 characters
  skipForAuthorizedUsers: false // Apply content advisories for all users
}));

// Configure session store with PostgreSQL
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'sessions', // Use the table name we defined in our schema
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'fundi-ai-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

// Serve static files from the public directory
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  log(`Incoming ${req.method} request to ${req.path}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} completed in ${duration}ms`);
  });

  next();
});

// Root health check middleware is already registered as the first middleware
// app.use(rootHealthCheckMiddleware); - Removed duplicate registration

// API health check endpoint
app.get("/api/health", (_req, res) => {
  const health = {
    status: "ok",
    uptime: Date.now() - startTime,
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString(),
    pid: process.pid
  };
  log(`API health check requested, responding with: ${JSON.stringify(health)}`);
  res.json(health);
});

// Maintenance endpoint - protected with a simple key to prevent unauthorized access
app.post("/api/maintenance/sessions", async (req, res) => {
  // Simple security check - require a maintenance key
  const { key, aggressive } = req.body;
  if (key !== process.env.MAINTENANCE_KEY && key !== "fundi-maintenance-key") {
    log("Unauthorized maintenance attempt detected");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    log(`Manual session cleanup requested (aggressive: ${!!aggressive})`);
    if (aggressive) {
      const deletedCount = await performAggressiveCleanup();
      return res.json({ success: true, message: `Aggressively cleaned up ${deletedCount} sessions` });
    } else {
      const result = await performDatabaseMaintenance();
      return res.json({ success: true, message: "Session cleanup completed successfully" });
    }
  } catch (error) {
    log(`Manual session cleanup error: ${error instanceof Error ? error.message : String(error)}`);
    return res.status(500).json({ 
      error: "Session cleanup failed", 
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Staged server initialization
(async () => {
  try {
    log("Starting core server setup...");
    
    // Run database migrations
    log("Running database migrations...");
    try {
      await runAllMigrations();
      log(`Database migrations completed (${Date.now() - startTime}ms)`);
      
      // Ensure user tables exist with age verification fields
      log("Checking database tables for age verification...");
      await ensureTables();
      log(`Database tables verified (${Date.now() - startTime}ms)`);
    } catch (error) {
      log(`Database migration error: ${error instanceof Error ? error.message : String(error)}`);
      // Continue with server startup even if migrations fail
      // This is to prevent the server from crashing during development
    }
    
    // Run session cleanup to prevent database bloat
    log("Running session database cleanup...");
    try {
      await performDatabaseMaintenance();
      log(`Session cleanup completed (${Date.now() - startTime}ms)`);
    } catch (error) {
      log(`Session cleanup error: ${error instanceof Error ? error.message : String(error)}`);
      // Continue with server startup even if cleanup fails
    }
    
    const server = await registerRoutes(app);
    log(`Routes registered (${Date.now() - startTime}ms)`);

    // Start the server first
    const port = process.env.PORT || 5000;
    const host = "0.0.0.0";

    log(`Attempting to start server on ${host}:${port}...`);

    await new Promise<void>((resolve, reject) => {
      try {
        server.listen({
          port,
          host,
          reusePort: true,
        }, () => {
          const address = server.address();
          log(`Server listening on: ${typeof address === 'string' ? address : JSON.stringify(address)}`);
          log(`API server started on ${host}:${port} (${Date.now() - startTime}ms)`);
          resolve();
        });

        server.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            log(`Port ${port} is already in use`);
          }
          reject(error);
        });
      } catch (error) {
        log(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
        reject(error);
      }
    });

    // Setup frontend after server is running
    if (app.get("env") === "development") {
      log("Setting up Vite development server...");
      try {
        await setupVite(app, server);
        log(`Vite setup complete (${Date.now() - startTime}ms)`);
      } catch (error) {
        log(`Failed to setup Vite: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    } else {
      log("Setting up static file serving...");
      try {
        serveStatic(app);
        log(`Static serving setup complete (${Date.now() - startTime}ms)`);
      } catch (error) {
        log(`Failed to setup static serving: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }

    // Initialize Fundi Core system
    log("Initializing Fundi Core protection system...");
    try {
      await initializeFundiCore();
      log(`Fundi Core initialized (${Date.now() - startTime}ms)`);
    } catch (error) {
      log(`Fundi Core initialization warning: ${error instanceof Error ? error.message : String(error)}`);
      log("Server will continue with basic AI functionality");
      // Continue even if Fundi Core initialization fails
    }
    
    // Initialize API health monitoring
    log("Starting API health monitoring...");
    try {
      // We only need to import it - the monitoring will be initialized in the modules 
      // when they are imported
      const spoonacularMonitor = await import('./services/api-monitors/spoonacular-monitor')
        .then(module => module.default);
      
      log(`API health monitoring started (${Date.now() - startTime}ms)`);
    } catch (monitorError) {
      log(`API monitoring initialization warning: ${monitorError instanceof Error ? monitorError.message : String(monitorError)}`);
      log("Server will continue without API health monitoring");
    }

    log(`Server fully initialized (total startup time: ${Date.now() - startTime}ms)`);
    
    // Set up periodic session cleanup (runs every 24 hours)
    const HOURS_24 = 24 * 60 * 60 * 1000;
    setInterval(async () => {
      log("Running scheduled session cleanup...");
      try {
        await performDatabaseMaintenance();
        log("Scheduled session cleanup completed successfully");
      } catch (error) {
        log(`Scheduled session cleanup error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, HOURS_24);
    log("Scheduled session cleanup initialized (will run every 24 hours)");
    
  } catch (error) {
    log(`Server startup error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("Server startup error details:", error);
    process.exit(1);
  }
})();

// Error handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  try {
    const status = err instanceof Error && 'status' in err ? (err as any).status : 500;
    const message = err instanceof Error ? err.message : "Internal Server Error";
    log(`Error handler: ${status} - ${message}`);
    
    // Check if the response has already been sent
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  } catch (handlerError) {
    console.error('Error in error handler:', handlerError);
    // If we can't use res.status, try a simple end() as a last resort
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
  }
});