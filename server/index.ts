import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import multer from "multer";
import * as pdfjsLib from 'pdfjs-dist';

const startTime = Date.now();
log("Starting server...");

// Initialize Express
const app = express();
log(`Express initialized (${Date.now() - startTime}ms)`);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});
log(`Multer configured (${Date.now() - startTime}ms)`);

// Dynamic PDF parsing function
const parsePDF = async (fileBuffer: Buffer) => {
  try {
    log("Starting PDF parsing...");
    const data = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= data.numPages; i++) {
      const page = await data.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n';
    }

    return {
      text: fullText,
      numpages: data.numPages,
      info: await data.getMetadata()
    };
  } catch (error) {
    log(`PDF parsing error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });

  next();
});

log(`Middleware setup complete (${Date.now() - startTime}ms)`);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: Date.now() - startTime });
});

// PDF Test endpoint
app.post("/api/test/pdf-parse", upload.single('pdf'), async (req, res) => {
  try {
    log("Starting PDF test parse endpoint");

    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No file uploaded or invalid file type. Please upload a PDF file."
      });
    }

    log("Test PDF upload details:", {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer.length
    });

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: true,
        message: "Invalid file type. Please upload a PDF file."
      });
    }

    try {
      const dataBuffer = Buffer.from(req.file.buffer);
      log("Test endpoint: Buffer created successfully, length:", dataBuffer.length);

      const data = await parsePDF(dataBuffer);
      log("Test endpoint: PDF parsed successfully, text length:", data.text.length);
      log("Test endpoint: First 100 characters:", data.text.substring(0, 100));

      res.json({
        success: true,
        textLength: data.text.length,
        preview: data.text.substring(0, 100),
        pageCount: data.numpages,
        info: data.info
      });

    } catch (pdfError) {
      log("Test endpoint PDF parsing error:", {
        name: pdfError instanceof Error ? pdfError.name : 'Unknown',
        message: pdfError instanceof Error ? pdfError.message : String(pdfError),
        stack: pdfError instanceof Error ? pdfError.stack : undefined
      });

      throw new Error("Could not parse PDF content. Please ensure the file is not corrupted or password protected.");
    }
  } catch (error) {
    log("Test endpoint error:", error);
    res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof Error && 'status' in err ? (err as any).status : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  log(`Error handler: ${status} - ${message}`);
  res.status(status).json({ message });
});

// Staged server initialization
(async () => {
  try {
    log("Starting core server setup...");
    const server = await registerRoutes(app);
    log(`Routes registered (${Date.now() - startTime}ms)`);

    // Start the server first using a higher port range that's less likely to be in use
    let port = 8000;
    let attempts = 0;
    const maxAttempts = 5;
    
    // Try to start the server, falling back to other ports if needed
    while (attempts < maxAttempts) {
      try {
        await new Promise<void>((resolve, reject) => {
          log(`Attempting to start server on port ${port}...`);
          
          const serverInstance = server.listen(port, "0.0.0.0", () => {
            log(`✅ API server started on port ${port} (${Date.now() - startTime}ms)`);
            resolve();
          });
          
          serverInstance.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              log(`⚠️ Port ${port} is in use, trying port ${port + 1}`);
              
              // Close and fully release the port before retrying
              serverInstance.close(() => {
                port++;
                attempts++;
                if (attempts < maxAttempts) {
                  resolve(); // Continue to next iteration
                } else {
                  reject(new Error(`❌ All retry attempts failed. Server could not start.`));
                }
              });
            } else {
              log(`🚨 Server error: ${err.message}`);
              reject(err);
            }
          });
        });
        
        // If we get here, we successfully started the server
        break;
      } catch (err) {
        if (attempts >= maxAttempts) {
          console.error("💥 Server startup failed:", err);
          throw err;
        }
        // Otherwise continue the loop to try the next port
      }
    }

    // Setup frontend after server is running
    if (app.get("env") === "development") {
      log("Setting up Vite development server...");
      await setupVite(app, server);
      log(`Vite setup complete (${Date.now() - startTime}ms)`);
    } else {
      log("Setting up static file serving...");
      serveStatic(app);
      log(`Static serving setup complete (${Date.now() - startTime}ms)`);
    }

    log(`Server fully initialized (total startup time: ${Date.now() - startTime}ms)`);
  } catch (error) {
    log(`Server startup error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("Server startup error details:", error);
    process.exit(1);
  }
})();