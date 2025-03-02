import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3, // Add retries for resilience
  timeout: 30000, // 30 second timeout
});

export async function getChatResponse(
  prompt: string,
  category: string
): Promise<string> {
  const systemPrompts = {
    emergency: "You are an emergency response expert providing clear, step-by-step guidance for emergency situations.",
    finance: "You are a financial advisor helping with budgeting, savings, and financial literacy.",
    career: "You are a career coach providing guidance on job searching, resume building, and interview preparation.",
    wellness: "You are a wellness coach providing guidance on mental health, meditation, and stress management.",
  };

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    console.log("Getting chat response with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompts[category as keyof typeof systemPrompts],
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I apologize, I couldn't process that request.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    return "I'm sorry, I'm having trouble processing your request right now.";
  }
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    summary: string;
  };
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  targetPosition: string;
}

export async function optimizeResume(resumeData: ResumeData): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    console.log("Optimizing resume with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume optimizer focusing on creating targeted, ATS-friendly resumes. Provide specific, actionable suggestions in JSON format."
        },
        { 
          role: "user", 
          content: `Please optimize this resume for ${resumeData.targetPosition} position and provide suggestions in JSON format with the following structure:
          {
            "enhancedSummary": "string",
            "keywords": ["string"],
            "experienceSuggestions": [{
              "original": "string",
              "improved": "string"
            }],
            "structuralChanges": ["string"]
          }` 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Could not generate optimization suggestions.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to optimize resume: " + (error.message || 'Unknown error'));
  }
}

export async function getEmergencyGuidance(situation: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    console.log("Getting emergency guidance with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an emergency response expert. Provide clear, step-by-step instructions for handling this emergency situation.",
        },
        { role: "user", content: situation },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Unable to provide guidance at this time.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    return "Emergency services are currently unavailable. Please dial your local emergency number.";
  }
}

export async function analyzeInterviewAnswer(
  answer: string,
  question: string,
  industry: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Analyzing interview answer with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert interview coach providing constructive feedback on interview responses. 
          Consider: clarity, relevance, professionalism, structure, and persuasiveness.
          Focus on both strengths and areas for improvement.
          For ${industry} industry context.`,
        },
        {
          role: "user",
          content: `Question: ${question}\n\nAnswer: ${answer}\n\nPlease provide detailed feedback on this interview response, including:
          1. Overall impression
          2. Specific strengths
          3. Areas for improvement
          4. Suggested enhancements
          Format the response in a clear, encouraging manner.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Unable to analyze response at this time.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    // Log the full error for debugging
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }

    // Handle specific error types
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }

    throw new Error("Failed to analyze interview response: " + (error.message || 'Unknown error'));
  }
}

// Add new function after analyzeInterviewAnswer
export async function generateJobQuestions(jobField: string): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Generating interview questions for job field:", jobField);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer for the specified job field. Generate relevant interview questions that assess both technical skills and soft skills required for the role. Return the questions in JSON format."
        },
        {
          role: "user",
          content: `Generate 5 interview questions specific to the ${jobField} role. Focus on both technical expertise and soft skills. Include behavioral questions and role-specific scenarios. Format as a JSON array of strings.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const questions = JSON.parse(response.choices[0].message.content).questions;
    return questions || [];
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to generate interview questions: " + (error.message || 'Unknown error'));
  }
}