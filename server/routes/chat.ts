import { Router } from "express";
import OpenAI from "openai";

const router = Router();

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Context-aware system message based on current route
const getSystemMessage = (context: string) => {
  const baseContext = `You are an AI assistant for a career development and emergency assistance platform. 
You provide intelligent, adaptive guidance for young professionals with a focus on comprehensive support.

The platform offers:
- Career development tools and guidance
- Emergency assistance and resources
- Financial education and planning
- Mental health and wellness resources
- Professional skill development
`;

  // Add route-specific context
  const routeContext = {
    "/emergency": "You are currently in the Emergency Assistance section. Prioritize immediate help and safety information. Be clear, concise, and calm in your responses.",
    "/career": "You are in the Career Development section. Focus on professional growth, job search strategies, and skill development.",
    "/finance": "You are in the Financial Education section. Provide guidance on budgeting, saving, credit management, and financial planning.",
    "/wellness": "You are in the Wellness section. Offer support for mental health, stress management, and work-life balance.",
    "/active": "You are in the Active Living section. Provide guidance on physical health, exercise, and healthy lifestyle choices."
  }[context] || "";

  return baseContext + "\n\n" + routeContext;
};

router.post("/chat", async (req, res) => {
  try {
    const { message, context = "/" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: getSystemMessage(context)
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time.";
    
    res.json({ message: response });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ 
      error: "Failed to process chat message",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
