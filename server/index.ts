import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import multer from "multer";
import pdf from 'pdf-parse';

// Startup logging function
function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

const startTime = Date.now();
log("Starting minimal PDF parsing server...");

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

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

log(`Middleware setup complete (${Date.now() - startTime}ms)`);

// PDF Test endpoint
app.post("/api/test/pdf-parse", upload.single('pdf'), async (req, res) => {
  try {
    log("Received PDF parsing request");

    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No file uploaded or invalid file type. Please upload a PDF file."
      });
    }

    log(`Processing file: ${req.file.originalname} (${req.file.size} bytes)`);

    try {
      // Create a fresh buffer from the file
      const dataBuffer = Buffer.from(req.file.buffer);
      log(`Buffer created: ${dataBuffer.length} bytes`);

      // Parse PDF with no options
      const data = await pdf(dataBuffer);
      log(`PDF parsed successfully: ${data.text.length} characters extracted`);

      res.json({
        success: true,
        textLength: data.text.length,
        preview: data.text.substring(0, 100),
        pageCount: data.numpages,
        info: data.info
      });

    } catch (pdfError) {
      log(`PDF parsing error: ${pdfError.message}`);
      console.error("PDF parsing error details:", {
        name: pdfError.name,
        message: pdfError.message,
        stack: pdfError.stack
      });

      throw new Error("Could not parse PDF content. Please ensure the file is not corrupted or password protected.");
    }
  } catch (error) {
    log(`Request error: ${error.message}`);
    res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  log(`Error handler: ${status} - ${message}`);
  res.status(status).json({ message });
});

log(`Routes registered (${Date.now() - startTime}ms)`);

// Start server
const port = 5000;
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  const totalTime = Date.now() - startTime;
  log(`Server started on port ${port} (total startup time: ${totalTime}ms)`);
});