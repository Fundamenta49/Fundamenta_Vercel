import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse, getEmergencyGuidance, optimizeResume } from "./ai";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { searchJobs } from "./jobs";
import { createLinkToken, exchangePublicToken, getTransactions } from "./plaid";
import axios from 'axios';
import OpenAI from 'openai';
import multer from "multer";
import mammoth from "mammoth";
import pdf from 'pdf-parse';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint for PDF parsing
  app.post("/api/test/pdf-parse", upload.single('pdf'), async (req, res) => {
    try {
      console.log("Starting PDF test parse endpoint");

      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: "No file uploaded or invalid file type. Please upload a PDF file."
        });
      }

      console.log("Test PDF upload details:", {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer.length
      });

      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({
          error: true,
          message: "Invalid file type. Please upload a PDF file."
        });
      }

      try {
        // Create a fresh buffer from the file
        const dataBuffer = Buffer.from(req.file.buffer);
        console.log("Test endpoint: Buffer created successfully, length:", dataBuffer.length);

        // Parse PDF with no options
        const data = await pdf(dataBuffer);
        console.log("Test endpoint: PDF parsed successfully, text length:", data.text.length);
        console.log("Test endpoint: First 100 characters:", data.text.substring(0, 100));

        res.json({
          success: true,
          textLength: data.text.length,
          preview: data.text.substring(0, 100),
          pageCount: data.numpages,
          info: data.info
        });

      } catch (pdfError) {
        console.error("Test endpoint PDF parsing error details:", {
          name: pdfError.name,
          message: pdfError.message,
          stack: pdfError.stack
        });

        throw new Error("Could not parse PDF content. Please ensure the file is not corrupted or password protected.");
      }
    } catch (error) {
      console.error("Test endpoint error:", error);
      res.status(500).json({
        error: true,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        details: error instanceof Error ? error.stack : undefined
      });
    }
  });

  // Main resume parsing endpoint
  app.post("/api/resume/parse", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: "No file uploaded or invalid file type. Please upload a PDF or Word document."
        });
      }

      console.log("Processing uploaded file:", {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer.length
      });

      let extractedText = '';

      try {
        if (req.file.mimetype === 'application/pdf') {
          console.log("Processing PDF file...");
          const dataBuffer = Buffer.from(req.file.buffer);
          console.log("Buffer created successfully, length:", dataBuffer.length);

          try {
            // Parse PDF with no options
            const data = await pdf(dataBuffer);
            extractedText = data.text;
            console.log("PDF text extracted successfully, length:", extractedText.length);
          } catch (pdfError) {
            console.error("PDF parsing error details:", {
              name: pdfError.name,
              message: pdfError.message,
              stack: pdfError.stack
            });
            throw new Error("Could not parse PDF content. Please ensure the file is not corrupted or password protected.");
          }
        } else if (req.file.mimetype.includes('word')) {
          console.log("Processing Word document...");
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          extractedText = result.value;
          console.log("Word document text extracted successfully, length:", extractedText.length);
        }

        if (!extractedText || extractedText.trim().length === 0) {
          console.error("No text extracted from document");
          throw new Error("No text could be extracted from the document. Please ensure the file contains readable text.");
        }

        console.log("Starting resume analysis with OpenAI...");
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Extract structured information from the resume text into JSON format matching this schema:
              {
                "personalInfo": {
                  "name": string,
                  "email": string,
                  "phone": string,
                  "summary": string
                },
                "education": [
                  {
                    "school": string,
                    "degree": string,
                    "year": string
                  }
                ],
                "experience": [
                  {
                    "company": string,
                    "position": string,
                    "duration": string,
                    "description": string
                  }
                ]
              }

              Guidelines:
              - If a field can't be found, use an empty string
              - Format dates consistently
              - Keep descriptions concise
              - Ensure valid JSON output`
            },
            {
              role: "user",
              content: extractedText
            }
          ],
          response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(response.choices[0].message.content || "{}");
        console.log("Resume successfully parsed and analyzed");

        res.json({
          success: true,
          data: parsedData
        });

      } catch (error) {
        console.error("Resume processing error:", error);
        res.status(400).json({
          error: true,
          message: error instanceof Error ? error.message : "Failed to process the resume",
          details: error instanceof Error ? error.stack : undefined
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({
        error: true,
        message: "An unexpected error occurred while processing your request."
      });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = messageSchema.parse(req.body);

      let systemMessage = `You are a friendly and supportive AI assistant.

Format your responses following these strict rules:

- Use only plain text - no special formatting characters
- Never use asterisks (*) or hashtags (#) in your responses
- Never use markdown syntax
- Use simple bullet points with a dash (-) for lists
- Add double line breaks between topics
- Start new sections with friendly emojis
- Keep everything in a conversational, friendly tone

Example formatting:
🌟 Main Topic
Here's the first point about this topic.

- First item in a list
- Second item in a list

✨ Next Topic
Continue with the next section here.

Remember to suggest relevant features in the app that could help the user.`;
      switch (validatedData.skillArea) {
        case "cooking":
          systemMessage += `As a friendly cooking mentor 👩‍🍳, help users develop their kitchen skills with enthusiasm! 

          Share practical cooking tips in a casual, encouraging way. Break down techniques into simple steps and celebrate their cooking journey. 

          Use emojis like 🔪 for prep steps, ⏲️ for timing, 🌡️ for temperatures, and ✨ for success tips.

          Remember to:
          - Guide users to relevant cooking tutorials in the app
          - Mention our interactive cooking guides when relevant
          - Suggest the cleaning schedule generator for kitchen organization
          - Point users to our kitchen safety resources

          Always prioritize kitchen safety while keeping the tone warm and supportive!`;
          break;
        case "career":
          systemMessage += `As a supportive career mentor 💼, offer encouraging but practical advice.

          Share insights in a friendly, conversational way. Help users explore opportunities with confidence.

          Remember to:
          - Suggest our career assessment tools when relevant
          - Point users to the interview practice section
          - Recommend our resume building resources
          - Guide users to salary insights tools

          Use emojis like 🎯 for goals, 💡 for ideas, and ⭐ for achievements.`;
          break;
        case "emergency":
          systemMessage += `Stay calm and clear while providing crucial guidance. 

          Use a steady, reassuring tone 💪 while giving precise instructions.

          Break down steps clearly with plenty of spacing.

          Add encouraging emojis like ✅ for completed steps and 🟢 for positive progress.`;
          break;
        case "finance":
          systemMessage += `As a friendly financial guide 💰, explain concepts in simple, relatable terms.

          Use real-life examples and avoid technical jargon. Break down complex topics into digestible pieces.

          Include supportive emojis like 📊 for planning, 💡 for tips, and 🎯 for goals.

          Be encouraging and non-judgmental about money matters - we're here to learn together!`;
          break;
        case "wellness":
          systemMessage += `As a caring wellness guide 🌱, provide compassionate support for health and wellbeing.

          Use a gentle, understanding tone while offering practical advice. Break down wellness concepts into simple, actionable steps.

          Include nurturing emojis like 🧘‍♀️ for mindfulness, 💪 for strength, and 🌟 for achievements.

          Remember to be supportive and encouraging - wellness is a personal journey!`;
          break;
        case "tour":
          systemMessage += `Be an enthusiastic guide 🎯 showing users around our features!

          Keep the tone fun and welcoming. Point out helpful features with excitement and clarity.

          Use engaging emojis like ✨ for highlights, 🎉 for features, and 👉 for next steps.

          Make users feel welcomed and excited to explore!`;
          break;
        case "learning":
          systemMessage += `As an encouraging learning coach 📚, help users discover and grow! 
          
          Break down complex topics into manageable chunks and celebrate small wins. Use examples and analogies that make learning fun and relatable.

          Include emojis like 💡 for insights, ✍️ for practice tips, and 🎯 for goals.

          Remember to be patient and supportive - learning is a journey we're on together!`;
          break;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: validatedData.userQuery
          }
        ]
      });

      if (!response.choices[0].message?.content) {
        throw new Error('No response content received from AI');
      }

      res.json({
        response: response.choices[0].message.content,
        success: true
      });

    } catch (error) {
      console.error("Chat error:", error);
      res.status(400).json({
        error: "Failed to get response. Please try again.",
        success: false
      });
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

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

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
  app.post("/api/career-guidance", async (req, res) => {
    try {
      const { message, riasecResults, conversationHistory } = z.object({
        message: z.string(),
        riasecResults: z.array(z.string()),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string()
        }))
      }).parse(req.body);

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a career guidance counselor with expertise in the RIASEC model. 
            The user has completed a RIASEC assessment with the following top matches:
            ${riasecResults.join('\n')}

            Provide personalized guidance based on these results and the user's questions.
            Focus on practical next steps, education paths, and specific career opportunities.
            Be encouraging but realistic, and always provide actionable advice.`
          },
          ...conversationHistory,
          { role: "user", content: message }
        ]
      });

      res.json({
        response: response.choices[0].message.content || "I apologize, but I'm having trouble providing guidance right now. Please try again."
      });
    } catch (error) {
      console.error("Career guidance error:", error);
      res.status(500).json({
        error: "Failed to get career guidance. Please try again later."
      });
    }
  });

  app.post("/api/skill-guidance", async (req, res) => {
    try {
      const { skillArea, userQuery } = z.object({
        skillArea: z.enum(["technical", "soft", "search", "life", "cooking"]),
        userQuery: z.string()
      }).parse(req.body);

      const videoResults = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: `how to ${userQuery} tutorial guide`,
          type: 'video',
          maxResults: 3,
          key: process.env.YOUTUBE_API_KEY,
        }
      });

      const videoIds = videoResults.data.items.map((item: any) => item.id.videoId);
      const videoDetails = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,contentDetails,status',
          id: videoIds.join(','),
          key: process.env.YOUTUBE_API_KEY
        }
      });

      const availableVideos = videoDetails.data.items
        .filter((item: any) => item.status.privacyStatus === 'public')
        .map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          thumbnail: {
            url: item.snippet.thumbnails.medium.url,
            width: item.snippet.thumbnails.medium.width,
            height: item.snippet.thumbnails.medium.height
          },
          duration: item.contentDetails.duration,
          description: item.snippet.description
        }));

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: userQuery.includes("cooking guide") ?
              `You are a professional chef and cooking instructor creating a guide about "${userQuery.replace('cooking guide:', '')}". 
              Speak naturally and conversationally, while maintaining focus on safety and proper technique.

              Structure your response like this:

              🎯 Essential Safety First!
              Start with the most important safety considerations for this cooking topic.

              👩‍🍳 Step-by-Step Guide
              Break down the process into clear, manageable steps. Include specific techniques and tools needed.

              ⚠️ Common Mistakes to Avoid
              List potential pitfalls and how to prevent them.

              💡 Pro Chef Tips
              Share professional insights that will help improve results.

              🧰 Required Tools & Equipment
              List essential items needed, including safety equipment if applicable.

              ⏰ Timing Guidelines
              Include any relevant timing information, temperatures, or storage guidelines.

              🎬 Video Tutorials
              Here are some helpful video tutorials I found:
              ${availableVideos.map(video => `[${video.id}] - ${video.title}`).join('\n')}

              Keep the tone friendly and encouraging while emphasizing safety and proper technique!` :
              userQuery.includes("cleaning schedule") ?
              `You are a professional home organization expert creating a customized cleaning schedule. 
              Create a practical, easy-to-follow cleaning schedule that's encouraging and detailed.

              Structure your response like this:

              🎯 Your Custom Cleaning Schedule
              First, give a brief, friendly intro about the benefits of having a regular cleaning routine.

              ⏰ Daily Tasks (15-20 minutes)
              List quick, essential daily tasks

              📅 Weekly Tasks (Break down by areas)
              - Kitchen
              - Bathroom(s)
              - Living Areas
              - Bedrooms
              Include specific tasks and estimated time for each area

              🧰 Monthly Deep Clean Tasks
              List tasks that need attention monthly

              ✨ Recommended Cleaning Supplies
              List essential supplies needed

              💡 Pro Tips
              Share 2-3 practical tips for maintaining the schedule

              Keep the tone friendly and encouraging throughout!` :
              `You are a friendly, encouraging life coach creating a guide about "${userQuery}". Speak naturally and conversationally, as if you're chatting with a friend. Keep your tone warm and supportive.

              Structure your advice in these friendly sections:

              🎯 Let's Break It Down!
              Write a friendly intro about why this skill matters, then walk through the process conversationally. Include any tools needed and important safety tips with a ⚠️.

              💡 Pro Tips!
              Share some helpful tricks and shortcuts you've learned along the way. Think of these as friendly advice rather than formal instructions.

              ⏰ Staying on Track 
              Give easy-to-remember guidelines about how often to practice this skill and how to make it a natural part of their routine.

              🎬 Video Tutorials
              Here are some helpful video tutorials I found:
              ${availableVideos.map(video => `[${video.id}] - ${video.title}`).join('\n')}

              🔗 Resources & Tools
              Share some trusted websites, tools, or communities that can help them learn more.

              End with a warm, encouraging note!`
          },
          {
            role: "user",
            content: `Please provide a ${userQuery.includes("cleaning schedule") ? "customized cleaning schedule" : userQuery.includes("cooking guide") ? "guide" : "friendly guide"} about ${userQuery}`
          }
        ]
      });

      res.json({
        guidance: response.choices[0].message.content,
        videos: availableVideos
      });
    } catch (error) {
      console.error("Skill guidance error:", error);
      res.status(500).json({
        error: "Failed to get skill guidance. Please try again later."
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
      res.json({ success: true });
    } catch (error) {
      console.error("Error exchanging token:", error);
      res.status(500).json({ error: "Failed to exchange token" });
    }
  });

  app.get("/api/plaid/transactions", async (req, res) => {
    try {
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
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'snippet,status',
            id: videoId,
            key: process.env.YOUTUBE_API_KEY,
          }
        });

        const isValid = response.data.items &&
          response.data.items.length > 0 &&
          response.data.items[0].status.privacyStatus === 'public';

        res.json({
          items: isValid ? response.data.items : [],
          isValid
        });
      } else if (query) {
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
        model: "gpt-4",
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
        model: "gpt-4",
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
        model: "gpt-4",
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

  app.get("/api/youtube/validate", async (req, res) => {
    try {
      const videoId = req.query.videoId as string;

      if (!videoId) {
        return res.status(400).json({ error: true, message: "Video ID is required" });
      }

      if (!process.env.YOUTUBE_API_KEY) {
        console.error("YouTube API key not configured");
        throw new Error("YouTube API key not configured");
      }

      console.log(`Validating YouTube video ID: ${videoId}`);

      const apiUrl = `https://www.googleapis.com/youtube/v3/videos`;
      console.log(`Making API request to: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        params: {
          part: 'snippet,status',
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        }
      });

      console.log('YouTube API Response:', {
        status: response.status,
        hasItems: !!response.data.items,
        itemCount: response.data.items?.length
      });

      if (!response.data.items || response.data.items.length === 0) {
        console.log(`No video found for ID: ${videoId}`);
        return res.json({
          error: true,
          message: "Video not found"
        });
      }

      const video = response.data.items[0];

      if (video.status.privacyStatus !== 'public') {
        console.log(`Video ${videoId} is not public. Status: ${video.status.privacyStatus}`);
        return res.json({
          error: true,
          message: "Video is not publicly available"
        });
      }

      console.log(`Successfully validated video ${videoId}`);

      res.json({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
        error: false
      });

    } catch (error) {
      console.error("YouTube API error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      res.status(500).json({
        error: true,
        message: "Failed to validate video",
        details: error.response?.data?.error?.message || error.message
      });
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
        model: "gpt-4",
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
        model: "gpt-4",
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
        model: "gpt-4",
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

  app.get("/api/youtube/validate", async (req, res) => {
    try {
      const videoId = req.query.videoId as string;

      if (!videoId) {
        return res.status(400).json({ error: true, message: "Video ID is required" });
      }

      if (!process.env.YOUTUBE_API_KEY) {
        console.error("YouTube API key not configured");
        throw new Error("YouTube API key not configured");
      }

      console.log(`Validating YouTube video ID: ${videoId}`);

      const apiUrl = `https://www.googleapis.com/youtube/v3/videos`;
      console.log(`Making API request to: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        params: {
          part: 'snippet,status',
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        }
      });

      console.log('YouTube API Response:', {
        status: response.status,
        hasItems: !!response.data.items,
        itemCount: response.data.items?.length
      });

      if (!response.data.items || response.data.items.length === 0) {
        console.log(`No video found for ID: ${videoId}`);
        return res.json({
          error: true,
          message: "Video not found"
        });
      }

      const video = response.data.items[0];

      if (video.status.privacyStatus !== 'public') {
        console.log(`Video ${videoId} is not public. Status: ${video.status.privacyStatus}`);
        return res.json({
          error: true,
          message: "Video is not publicly available"
        });
      }

      console.log(`Successfully validated video ${videoId}`);

      res.json({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
        error: false
      });

    } catch (error) {
      console.error("YouTube API error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      res.status(500).json({
        error: true,
        message: "Failed to validate video",
        details: error.response?.data?.error?.message || error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

const messageSchema = z.object({
  skillArea: z.enum(["technical", "soft", "search", "life", "cooking", "career", "emergency", "finance", "wellness", "tour", "learning"]),
  userQuery: z.string()
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

const resumeParserSchema = z.object({
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
  }))
});