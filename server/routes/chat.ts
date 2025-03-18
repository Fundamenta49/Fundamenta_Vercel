import { Router } from "express";
import { orchestrateAIResponse } from "../ai";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, context = "/", previousMessages = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await orchestrateAIResponse(message, {
      currentPage: context,
      currentSection: 'general',
      availableActions: []
    }, previousMessages);

    res.json(response);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ 
      error: "Failed to process chat message",
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
});

export default router;