import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse, getEmergencyGuidance, optimizeResume, analyzeInterviewAnswer, generateJobQuestions } from "./ai";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string(),
  category: z.enum(["emergency", "finance", "career", "wellness"]),
});

const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    summary: z.string(),
  }),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    year: z.string(),
  })),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
    description: z.string(),
  })),
  targetPosition: z.string(),
});

const interviewAnalysisSchema = z.object({
  answer: z.string(),
  question: z.string(),
  industry: z.string(),
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

  app.post("/api/resume/optimize", async (req, res) => {
    try {
      const resumeData = resumeSchema.parse(req.body);
      const optimizedResume = await optimizeResume(resumeData);
      res.json({ suggestions: JSON.parse(optimizedResume) });
    } catch (error) {
      console.error("Resume optimization error:", error);
      res.status(400).json({ error: "Failed to optimize resume" });
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

  app.post("/api/interview/analyze", async (req, res) => {
    try {
      const { answer, question, industry } = interviewAnalysisSchema.parse(req.body);

      if (!answer.trim() || !question.trim() || !industry.trim()) {
        return res.status(400).json({
          error: "Missing required fields. Please provide answer, question, and industry."
        });
      }

      const feedback = await analyzeInterviewAnswer(answer, question, industry);
      res.json({ feedback });
    } catch (error: any) {
      console.error("Interview analysis error:", error);

      // More specific error messages based on error type
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      // Handle OpenAI specific errors
      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Interview analysis service is currently unavailable. Please try again later."
        });
      }

      if (error?.error?.type === "invalid_request_error") {
        return res.status(400).json({
          error: "Invalid API request. Please check your input."
        });
      }

      if (error.message.includes('rate limit exceeded')) {
        return res.status(429).json({
          error: "Too many requests. Please wait a moment and try again."
        });
      }

      res.status(500).json({
        error: "Failed to analyze interview response. Please try again later."
      });
    }
  });

  app.post("/api/interview/questions", async (req, res) => {
    try {
      const { jobField } = z.object({ jobField: z.string() }).parse(req.body);

      if (!jobField.trim()) {
        return res.status(400).json({
          error: "Please provide a job field."
        });
      }

      const questions = await generateJobQuestions(jobField);
      res.json({ questions });
    } catch (error: any) {
      console.error("Question generation error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Question generation service is currently unavailable. Please try again later."
        });
      }

      if (error.message.includes('rate limit exceeded')) {
        return res.status(429).json({
          error: "Too many requests. Please wait a moment and try again."
        });
      }

      res.status(500).json({
        error: "Failed to generate questions. Please try again later."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}