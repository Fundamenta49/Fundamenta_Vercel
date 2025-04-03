import express from 'express';
import OpenAI from 'openai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();
export const repairRouter = router;

// Initialize OpenAI API client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(os.tmpdir(), 'repair_uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Route to analyze an uploaded image
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageFilePath = req.file.path;
    
    // Convert image to base64
    const imageBuffer = fs.readFileSync(imageFilePath);
    const base64Image = imageBuffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    // Use OpenAI's Vision model to analyze the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert home repair and appliance technician. Analyze the image of a broken item and provide detailed repair information."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this broken object in the image. Identify:\n1. What is the object?\n2. What appears to be broken or damaged?\n3. What's the likely cause of the problem?\n4. What parts would be needed to repair it?\n5. Tools needed for the repair\n6. Difficulty level (Easy, Medium, Hard, Professional Only)\n7. Step-by-step repair instructions\n\nFormat your response as JSON with the following structure:\n{\n  \"itemIdentified\": \"Item name\",\n  \"problemIdentified\": \"Brief description of the problem\",\n  \"causeLikely\": \"Likely cause of the issue\",\n  \"partsNeeded\": [\n    {\"name\": \"Part name\", \"estimatedPrice\": 00.00}\n  ],\n  \"toolsNeeded\": [\"Tool 1\", \"Tool 2\"],\n  \"difficultyLevel\": \"Easy/Medium/Hard/Pro\",\n  \"repairInstructions\": [\"Step 1\", \"Step 2\"]\n}" },
            { type: "image_url", image_url: { url: dataURI } }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    // Clean up the uploaded file
    fs.unlinkSync(imageFilePath);

    // Parse and return the analysis
    const analysisText = response.choices[0].message.content;
    if (!analysisText) {
      throw new Error('Failed to analyze the image');
    }

    // Parse the JSON from the response
    const analysis = JSON.parse(analysisText);
    
    res.json(analysis);
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ 
      error: 'Failed to analyze the image',
      message: error.message || 'Unknown error'
    });
  }
});

// Route to find parts in nearby stores
router.post('/find-parts', async (req, res) => {
  try {
    const { parts, location } = req.body;
    
    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({ error: 'Valid parts array is required' });
    }

    // Use OpenAI to generate realistic store data for parts
    const prompt = `Generate realistic pricing data for these repair parts from 3 different home improvement stores:
      Parts: ${parts.map(p => p.name).join(', ')}
      
      For each store, include:
      1. Store name (use real home improvement or hardware stores)
      2. Distance (fictional but realistic)
      3. Whether the part is in stock
      4. Price for each part with occasional deals/sales
      
      Format the response as JSON with this exact structure:
      {
        "stores": [
          {
            "storeName": "Store Name",
            "distance": "x.x miles",
            "address": "123 Main St, City, ST",
            "partsAvailability": [
              {"name": "Part name", "price": 12.99, "inStock": true, "deal": "Optional sale info (null if no deal)"},
              ...
            ]
          },
          ...
        ]
      }`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides accurate parts pricing information." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const storeData = JSON.parse(response.choices[0].message.content || '{"stores":[]}');
    res.json(storeData);
  } catch (error: any) {
    console.error('Error finding parts:', error);
    res.status(500).json({ 
      error: 'Failed to find parts',
      message: error.message || 'Unknown error'
    });
  }
});

export default router;