import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import multer from "multer";
import * as pdfjsLib from 'pdfjs-dist';

// Startup logging function
function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

const startTime = Date.now();
log("Starting minimal server...");

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
    log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });

  next();
});

log(`Middleware setup complete (${Date.now() - startTime}ms)`);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: Date.now() - startTime });
});

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

// PDF parsing endpoint
app.post("/api/test/pdf-parse", upload.single('pdf'), async (req, res) => {
  try {
    log("Received PDF parsing request");

    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No file uploaded or invalid file type. Please upload a PDF file."
      });
    }

    log("PDF upload details:", {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer.length
    });

    try {
      const dataBuffer = Buffer.from(req.file.buffer);
      log(`Buffer created: ${dataBuffer.length} bytes`);

      const data = await parsePDF(dataBuffer);
      log(`PDF parsed successfully: ${data.text.length} characters extracted`);

      res.json({
        success: true,
        textLength: data.text.length,
        preview: data.text.substring(0, 100),
        pageCount: data.numpages,
        info: data.info
      });

    } catch (pdfError) {
      log(`PDF parsing error: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
      throw new Error("Could not parse PDF content. Please ensure the file is not corrupted or password protected.");
    }
  } catch (error) {
    log(`Request error: ${error instanceof Error ? error.message : String(error)}`);
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