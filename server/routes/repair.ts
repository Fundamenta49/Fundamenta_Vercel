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
          content: `You are an expert home repair and appliance technician with extensive knowledge of household maintenance, DIY repairs, plumbing, electrical systems, appliances, furniture, and structural issues. Analyze the image of a broken item and provide comprehensive diagnostic and repair information.

Your expertise includes:
- Accurate identification of common household items and their components
- Precise diagnosis of mechanical, electrical, and structural problems
- Knowledge of repair safety considerations and when to recommend professional help
- Accurate estimation of part costs and repair difficulty
- Detailed, step-by-step repair instructions written for non-technical homeowners`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze this broken object in the image carefully. Identify:

1. What is the object or structure? Be as specific as possible about make/model if visible.
2. What appears to be broken or damaged? Describe the visible issues in detail.
3. What's the likely cause of the problem? Consider normal wear, misuse, manufacturing defects, etc.
4. What specific parts would be needed to repair it? Include part numbers when possible.
5. What tools are needed for the repair? Be thorough and list every required tool.
6. Rate the difficulty level (Easy, Medium, Hard, Professional Only) and explain safety considerations.
7. Provide detailed step-by-step repair instructions a non-expert could follow.
8. Estimate time required for the repair and any special skills needed.

Format your response as JSON with the following structure:
{
  "itemIdentified": "Detailed item name with brand/model if visible",
  "problemIdentified": "Comprehensive description of the problem",
  "causeLikely": "Detailed analysis of probable causes",
  "partsNeeded": [
    {"name": "Specific part name and number if possible", "estimatedPrice": 00.00}
  ],
  "toolsNeeded": ["Tool 1", "Tool 2"],
  "difficultyLevel": "Easy/Medium/Hard/Professional Only",
  "safetyConsiderations": ["Safety consideration 1", "Safety consideration 2"],
  "estimatedTime": "Estimated time to complete the repair",
  "repairInstructions": ["Detailed step 1", "Detailed step 2"],
  "alternativeSolutions": ["Alternative approach 1", "Alternative approach 2"]
}` },
            { type: "image_url", image_url: { url: dataURI } }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
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
    const prompt = `Generate realistic and accurate pricing data for these home repair parts from 3 different home improvement stores:
      Parts: ${parts.map(p => p.name).join(', ')}
      
      For each store, include:
      1. Store name (use real home improvement or hardware stores like Home Depot, Lowe's, Ace Hardware, Menards, True Value, etc.)
      2. Distance (fictional but realistic distance in miles)
      3. Complete store address
      4. Whether each part is in stock
      5. Accurate price ranges for each part based on current market prices
      6. Occasional deals, discounts or sales promotions that are realistic
      7. Alternative/compatible parts when relevant
      8. Part warranty information when applicable
      
      Format the response as JSON with this exact structure:
      {
        "stores": [
          {
            "storeName": "Store Name",
            "distance": "x.x miles",
            "address": "123 Main St, City, ST",
            "phoneNumber": "555-123-4567",
            "storeHours": "Mon-Sat: 7am-9pm, Sun: 8am-7pm",
            "partsAvailability": [
              {
                "name": "Part name",
                "partNumber": "Part/SKU number if applicable",
                "price": 12.99,
                "inStock": true,
                "quantity": "Number in stock or 'Limited Stock'",
                "aisle": "Store aisle/section location (e.g., 'Aisle 7')",
                "deal": "Optional sale info (null if no deal)",
                "alternativeParts": ["Alternative 1", "Alternative 2"],
                "warranty": "90-day warranty" 
              },
              ...
            ]
          },
          ...
        ]
      }`;

    // Use OpenAI GPT-4o for increased accuracy
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an expert hardware and home improvement specialist with detailed knowledge of parts inventory, pricing, and availability across major and local hardware stores. Provide accurate, detailed, and realistic information about repair parts.

Your expertise includes:
- Current pricing trends for common household repair parts
- Typical stock patterns and availability at major hardware chains
- Knowledge of where specific parts are located within stores
- Awareness of common promotions, sales cycles, and discount patterns
- Alternative and compatible parts for various repair scenarios`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
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