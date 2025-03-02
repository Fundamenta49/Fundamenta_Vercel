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
