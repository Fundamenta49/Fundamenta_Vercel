import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse, getEmergencyGuidance, optimizeResume, analyzeInterviewAnswer, generateJobQuestions, generateCoverLetter, assessCareer, getSalaryInsights } from "./ai";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { searchJobs } from "./jobs";
import { createLinkToken, exchangePublicToken, getTransactions } from "./plaid";
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

const coverLetterSchema = z.object({
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
  company: z.string().optional(),
  keyExperience: z.array(z.string()),
  additionalNotes: z.string().optional(),
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

  app.post("/api/resume/cover-letter", async (req, res) => {
    try {
      const data = coverLetterSchema.parse(req.body);
      const coverLetter = await generateCoverLetter(data);
      res.json({ coverLetter });
    } catch (error: any) {
      console.error("Cover letter generation error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Cover letter generation service is currently unavailable. Please try again later."
        });
      }

      if (error.message.includes('rate limit exceeded')) {
        return res.status(429).json({
          error: "Too many requests. Please wait a moment and try again."
        });
      }

      res.status(500).json({
        error: "Failed to generate cover letter. Please try again later."
      });
    }
  });

  app.post("/api/career/assess", async (req, res) => {
    try {
      const { answers } = z.object({
        answers: z.record(z.string(), z.string())
      }).parse(req.body);

      const results = await assessCareer(answers);
      res.json(results);
    } catch (error: any) {
      console.error("Career assessment error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Career assessment service is currently unavailable. Please try again later."
        });
      }

      if (error.message.includes('rate limit exceeded')) {
        return res.status(429).json({
          error: "Too many requests. Please wait a moment and try again."
        });
      }

      res.status(500).json({
        error: "Failed to analyze career assessment. Please try again later."
      });
    }
  });

  app.post("/api/jobs/search", async (req, res) => {
    try {
      const { query, location, sources } = z.object({
        query: z.string(),
        location: z.string(),
        sources: z.array(z.string()),
      }).parse(req.body);

      const jobs = await searchJobs({ query, location, sources });
      res.json({ jobs });
    } catch (error: any) {
      console.error("Job search error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      res.status(500).json({
        error: "Failed to search jobs. Please try again later."
      });
    }
  });

  app.post("/api/career/salary-insights", async (req, res) => {
    try {
      const { jobTitle, location } = z.object({
        jobTitle: z.string(),
        location: z.string(),
      }).parse(req.body);

      const insights = await getSalaryInsights(jobTitle, location);
      res.json(insights);
    } catch (error: any) {
      console.error("Salary insights error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Salary insights service is currently unavailable. Please try again later."
        });
      }

      res.status(500).json({
        error: "Failed to get salary insights. Please try again later."
      });
    }
  });

  app.post("/api/plaid/create_link_token", async (req, res) => {
    try {
      const linkToken = await createLinkToken();
      res.json({ link_token: linkToken });
    } catch (error) {
      console.error("Error creating link token:", error);
      res.status(500).json({ error: "Failed to create link token" });
    }
  });

  app.post("/api/plaid/exchange_token", async (req, res) => {
    try {
      const { public_token } = req.body;
      const accessToken = await exchangePublicToken(public_token);
      // In a real app, you would store this access_token securely
      // and associate it with the user's account
      res.json({ success: true });
    } catch (error) {
      console.error("Error exchanging token:", error);
      res.status(500).json({ error: "Failed to exchange token" });
    }
  });

  app.get("/api/plaid/transactions", async (req, res) => {
    try {
      // In a real app, you would retrieve the access_token from your database
      // based on the authenticated user's session
      const accessToken = "your_access_token";
      const transactions = await getTransactions(accessToken);
      res.json({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/youtube-search", async (req, res) => {
    try {
      const videoId = req.query.videoId as string;
      const query = req.query.q as string;

      if (!process.env.YOUTUBE_API_KEY) {
        throw new Error("YouTube API key not configured");
      }

      if (videoId) {
        // Validate specific video
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'snippet,status',
            id: videoId,
            key: process.env.YOUTUBE_API_KEY,
          }
        });

        // Check if video exists and is available
        const isValid = response.data.items && 
                       response.data.items.length > 0 && 
                       response.data.items[0].status.privacyStatus === 'public';

        res.json({
          items: isValid ? response.data.items : [],
          isValid
        });
      } else if (query) {
        // Search for videos
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 3,
            key: process.env.YOUTUBE_API_KEY,
          }
        });
        res.json(response.data);
      } else {
        res.status(400).json({ error: "Either videoId or search query is required" });
      }
    } catch (error) {
      console.error("YouTube API error:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.post("/api/generate-workout", async (req, res) => {
    try {
      const { profile } = req.body;

      const prompt = `Create a personalized workout plan for a ${profile.fitnessLevel} level person with the following fitness goals: ${profile.goals.join(', ')}. 
      Include specific exercises with sets and reps, recommended YouTube tutorial video IDs, and helpful tips.
      Format the response as a JSON object with the following structure:
      {
        "exercises": [
          {
            "name": string,
            "sets": number,
            "reps": number,
            "description": string,
            "videoId": string (YouTube video ID)
          }
        ],
        "schedule": string,
        "tips": string[]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a professional fitness trainer experienced in creating personalized workout plans." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const workoutPlan = JSON.parse(response.choices[0].message.content || "{}");
      res.json(workoutPlan);

    } catch (error) {
      console.error('Error generating workout plan:', error);
      res.status(500).json({ error: 'Failed to generate workout plan' });
    }
  });

  app.post("/api/journal/analyze", async (req, res) => {
    try {
      const { content } = z.object({ content: z.string() }).parse(req.body);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI therapist analyzing journal entries. Provide analysis in JSON format including emotional score (0-100), sentiment, key themes, and suggestions for mental well-being."
          },
          {
            role: "user",
            content
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");

      // Calculate word frequency
      const words = content.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);

      const wordFrequency: Record<string, number> = {};
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });

      res.json({
        emotionalScore: analysis.emotionalScore,
        sentiment: analysis.sentiment,
        wordFrequency,
        suggestions: analysis.suggestions,
        moodTrend: analysis.moodTrend
      });
    } catch (error) {
      console.error('Error analyzing journal entry:', error);
      res.status(500).json({ error: 'Failed to analyze journal entry' });
    }
  });

  app.post("/api/journal/analyze-trends", async (req, res) => {
    try {
      const { entries } = z.object({
        entries: z.array(z.object({
          content: z.string(),
          timestamp: z.string()
        }))
      }).parse(req.body);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Analyze the mood trends across multiple journal entries and provide insights and recommendations in JSON format."
          },
          {
            role: "user",
            content: JSON.stringify(entries)
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");

      res.json({
        trends: analysis.trends,
        recommendations: analysis.recommendations
      });
    } catch (error) {
      console.error('Error analyzing mood trends:', error);
      res.status(500).json({ error: 'Failed to analyze mood trends' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}