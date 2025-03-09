import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add startup timestamp
const startTime = Date.now();

// Basic health check route before any middleware
app.get("/ping", (_req, res) => {
  res.send("OK");
});

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Log environment and startup info
    log(`Environment: ${app.get("env")}`);
    log("Node Version:", process.version);
    log("Initializing server...");

    // Register routes first
    const server = await registerRoutes(app);
    log("Routes registered successfully");

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      log(`Error occurred: ${err.message}`, "error");
      console.error("Full error details:", err);

      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
    });

    // Setup middleware based on environment
    if (app.get("env") === "development") {
      log("Setting up Vite middleware for development");
      try {
        await setupVite(app, server);
        log("Vite middleware setup complete");
      } catch (error) {
        log(`Failed to setup Vite middleware: ${(error as Error).message}`, "error");
        throw error;
      }
    } else {
      log("Setting up static file serving for production");
      try {
        serveStatic(app);
        log("Static file serving setup complete");
      } catch (error) {
        log(`Failed to setup static file serving: ${(error as Error).message}`, "error");
        throw error;
      }
    }

    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      const startupDuration = Date.now() - startTime;
      log(`Server startup completed in ${startupDuration}ms`);
      log(`Server listening on port ${port}`);
    }).on('error', (error: Error) => {
      log(`Failed to start server: ${error.message}`, "error");
      throw error;
    });

  } catch (error) {
    log(`Fatal error during server startup: ${(error as Error).message}`, "error");
    console.error("Full startup error:", error);
    process.exit(1);
  }
})();