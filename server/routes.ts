import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse, getEmergencyGuidance } from "./ai";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string(),
  category: z.enum(["emergency", "finance", "career", "wellness"]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { content, category } = messageSchema.parse(req.body);
      const response = await getChatResponse(content, category);
      res.json({ response });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/emergency/guidance", async (req, res) => {
    try {
      const { situation } = z.object({ situation: z.string() }).parse(req.body);
      const guidance = await getEmergencyGuidance(situation);
      res.json({ guidance });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
