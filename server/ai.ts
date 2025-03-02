import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "default_key" });

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
  } catch (error) {
    console.error("OpenAI API Error:", error);
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
    const prompt = `
As an expert career coach and resume optimizer, please enhance this resume to target the position of ${resumeData.targetPosition}.

Current Resume Information:
Name: ${resumeData.personalInfo.name}
Professional Summary: ${resumeData.personalInfo.summary}

Experience:
${resumeData.experience.map(exp => `
- Position: ${exp.position}
  Company: ${exp.company}
  Duration: ${exp.duration}
  Description: ${exp.description}
`).join('\n')}

Education:
${resumeData.education.map(edu => `
- ${edu.degree}
  ${edu.school}
  ${edu.year}
`).join('\n')}

Please provide specific suggestions to optimize this resume for the target position, including:
1. Enhanced professional summary
2. Recommended keywords and skills to highlight
3. Suggested improvements to experience descriptions
4. Overall structure recommendations

Format the response as a JSON object with the following structure:
{
  "enhancedSummary": "string",
  "keywords": ["string"],
  "experienceSuggestions": [{
    "original": "string",
    "improved": "string"
  }],
  "structuralChanges": ["string"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume optimizer focusing on creating targeted, ATS-friendly resumes. Provide specific, actionable suggestions in JSON format."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Could not generate optimization suggestions.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to optimize resume");
  }
}

export async function getEmergencyGuidance(situation: string): Promise<string> {
  try {
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
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Emergency services are currently unavailable. Please dial your local emergency number.";
  }
}