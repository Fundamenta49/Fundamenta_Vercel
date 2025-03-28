import { Router, Request, Response } from "express";
import { parseResume } from "../utils/openai";

const router = Router();

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

export default router;