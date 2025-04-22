import { Router, Request, Response } from "express";
import { 
  parseResume, 
  enhanceResumeSection,
  optimizeResumeForJob,
  extractTextFromPDF,
  upload
} from "../utils/openai";
import path from "path";
import OpenAI from "openai";

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Parse resume with AI
router.post("/parse", async (req: Request, res: Response) => {
  try {
    // Get resume text from request
    const { resumeText } = req.body;
    
    if (!resumeText || typeof resumeText !== "string") {
      return res.status(400).json({ 
        error: "Resume text is required" 
      });
    }

    // Process with OpenAI
    const parsedResume = await parseResume(resumeText);
    
    // Return the processed resume data
    return res.status(200).json(parsedResume);
  } catch (error) {
    console.error("Resume parsing error:", error);
    return res.status(500).json({ 
      error: "Failed to parse resume",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Upload and parse resume file
router.post("/upload", upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded" 
      });
    }
    
    // For PDF files, use OpenAI's vision API to extract text
    if (req.file.mimetype === 'application/pdf') {
      const text = await extractTextFromPDF(req.file.path);
      return res.status(200).json({ 
        success: true, 
        text 
      });
    } 
    // For other file types
    else {
      // The file is already saved to disk, so we can read it directly
      return res.status(200).json({ 
        success: true, 
        message: "File received successfully. Use the text extraction API to process.",
        filePath: req.file.path
      });
    }
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({ 
      error: "Failed to process uploaded file",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Enhance resume section
router.post("/enhance", async (req: Request, res: Response) => {
  try {
    const { section, content } = req.body;
    
    if (!section || !content) {
      return res.status(400).json({ 
        error: "Section and content are required" 
      });
    }

    // Process with OpenAI
    const suggestions = await enhanceResumeSection(section, content);
    
    // Return the enhanced content - use the first suggestion as the enhanced content
    // but also include all suggestions for future implementation
    return res.status(200).json({ 
      enhanced: suggestions[0] || content, 
      suggestions: suggestions 
    });
  } catch (error) {
    console.error("Resume enhancement error:", error);
    return res.status(500).json({ 
      error: "Failed to enhance resume section",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Optimize resume for specific job
router.post("/optimize", async (req: Request, res: Response) => {
  try {
    const { resumeData, targetJob, jobDescription } = req.body;
    
    if (!resumeData || !targetJob) {
      return res.status(400).json({ 
        error: "Resume data and target job are required" 
      });
    }

    // Process with OpenAI
    const optimizedResume = await optimizeResumeForJob(
      resumeData,
      targetJob,
      jobDescription
    );
    
    // Return the optimized resume
    return res.status(200).json(optimizedResume);
  } catch (error) {
    console.error("Resume optimization error:", error);
    return res.status(500).json({ 
      error: "Failed to optimize resume",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Analyze resume
router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText || typeof resumeText !== "string") {
      return res.status(400).json({ 
        error: "Resume text is required" 
      });
    }

    // Process with OpenAI to extract skills and analyze experience level
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: `Analyze the resume text and extract key information in JSON format:
          - List of skills mentioned (technical and soft skills)
          - Experience level estimation (Entry-level, Mid-level, Senior-level)
          - Areas for improvement
          - Resume strengths
          - Resume weaknesses
          
          Format your response as JSON with the following structure:
          {
            "skills": ["skill1", "skill2", ...],
            "experienceLevel": "Entry-level OR Mid-level OR Senior-level",
            "improvementAreas": ["area1", "area2", ...],
            "strengths": ["strength1", "strength2", ...],
            "weaknesses": ["weakness1", "weakness2", ...]
          }
          
          Ensure your response is valid JSON.`
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 1500
    });

    if (!response.choices[0].message?.content) {
      throw new Error("No response received from OpenAI");
    }

    const result = JSON.parse(response.choices[0].message.content);
    
    return res.status(200).json({
      skills: result.skills || [],
      experienceLevel: result.experienceLevel || "Entry-level",
      improvementAreas: result.improvementAreas || [],
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || []
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json({ 
      error: "Failed to analyze resume",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

export default router;