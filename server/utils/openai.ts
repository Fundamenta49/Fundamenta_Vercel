import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Parses a resume text using OpenAI's GPT-4o model
 * Extracts structured information from the raw resume text
 */
export async function parseResume(resumeText: string): Promise<{
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  }
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a resume parsing assistant that extracts structured information from raw resume text.
          Also provide a professional analysis of the resume with strengths, weaknesses, and suggestions for improvement.
          Format your response as JSON with the following structure:
          {
            "name": "",
            "email": "",
            "phone": "",
            "summary": "",  
            "education": "",
            "experience": "",
            "skills": "",
            "analysis": {
              "strengths": ["", "", ""],
              "weaknesses": ["", "", ""],
              "suggestions": ["", "", ""]
            }
          }
          If you can't extract certain fields, return empty strings for those fields, but make your best effort to extract as much as possible.
          For the analysis, provide 3-5 items for each category based on the resume content.`
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000
    });

    if (!response.choices[0].message?.content) {
      throw new Error("No response received from OpenAI");
    }

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      name: result.name || "",
      email: result.email || "",
      phone: result.phone || "",
      summary: result.summary || "",
      education: result.education || "",
      experience: result.experience || "",
      skills: result.skills || "",
      analysis: {
        strengths: result.analysis?.strengths || [],
        weaknesses: result.analysis?.weaknesses || [],
        suggestions: result.analysis?.suggestions || []
      }
    };
  } catch (error) {
    console.error("Error parsing resume with OpenAI:", error);
    throw new Error("Failed to analyze resume with AI. Please try again later.");
  }
}