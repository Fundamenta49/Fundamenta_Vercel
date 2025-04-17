import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { QuizQuestion } from '../../client/src/components/quiz-component';
import { Resource } from '../../client/src/components/resource-links';
import { generateQuiz, gradeQuiz } from '../services/quiz-service';
import { db } from '../db';
import { and, eq, desc } from 'drizzle-orm';
import { learningProgress } from '../../shared/schema';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate AI-powered quiz questions for a subject using our hybrid approach
 */
router.post('/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { 
      subject, 
      difficulty, 
      numberOfQuestions = 5, 
      topics = [], 
      adaptiveLearning = false,
      previousScore
    } = req.body;
    
    console.log(`Generating ${numberOfQuestions} ${difficulty} questions about ${subject} with${adaptiveLearning ? '' : 'out'} adaptive learning`);
    
    if (adaptiveLearning) {
      console.log(`Previous score: ${previousScore !== undefined ? previousScore : 'none'}. Using for difficulty adjustment.`);
    }
    
    const quizData = await generateQuiz(
      subject, 
      difficulty, 
      numberOfQuestions, 
      topics,
      adaptiveLearning,
      previousScore
    );
    
    res.json(quizData);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
});

/**
 * Get recommended learning resources
 */
router.post('/resources', async (req: Request, res: Response) => {
  try {
    const { subject, userLevel, interests = [], previousProgress = 0 } = req.body;
    
    // Build prompt for OpenAI
    const prompt = `
      Recommend learning resources for ${subject} at a ${userLevel} level.
      ${interests.length > 0 ? `The user is interested in: ${interests.join(', ')}.` : ''}
      The user's current progress level is: ${previousProgress}% complete.
      
      Provide a mix of different resource types (articles, videos, books, courses, tools, practice exercises).
      For each resource:
      1. Provide a descriptive title
      2. Write a brief description of what the resource covers
      3. Include a realistic URL (use real websites like Khan Academy, Coursera, YouTube, etc.)
      4. Specify the resource type
      5. Indicate the appropriate level (beginner, intermediate, advanced)
      6. For videos and courses, include an estimated duration
      7. Indicate if the resource is free or paid
      8. Add relevant tags for categorization
      
      Format the response as a valid JSON object with the following structure:
      {
        "resources": [
          {
            "id": string,
            "title": string,
            "description": string,
            "url": string,
            "type": "article" | "video" | "book" | "course" | "tool" | "practice",
            "level": "beginner" | "intermediate" | "advanced",
            "duration": string (optional),
            "free": boolean (optional),
            "tags": string[]
          }
        ]
      }
      
      Provide at least 6 resources.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert educational resource curator who specializes in finding the most valuable learning materials for various subjects. Provide helpful, accurate, and relevant resources that match the user's level and interests."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    if (!response.choices[0].message.content) {
      throw new Error('No content received from OpenAI');
    }
    
    const content = response.choices[0].message.content;
    const resourceData = JSON.parse(content);
    
    res.json(resourceData);
  } catch (error) {
    console.error('Error generating resources:', error);
    res.status(500).json({ error: 'Failed to generate learning resources' });
  }
});

/**
 * Submit quiz results and get personalized feedback
 * If quiz is passed, automatically mark the associated module as complete
 */
router.post('/submit-quiz-results', async (req: Request, res: Response) => {
  try {
    const { subject, userAnswers, correctAnswers, difficulty, userId, pathwayId, moduleId } = req.body;
    
    // Use our grading service if we have user's specific answers
    if (Array.isArray(userAnswers) && Array.isArray(correctAnswers)) {
      console.log('Grading quiz with detailed answers');
      
      // Use our grading service
      const gradeResults = await gradeQuiz(userAnswers, correctAnswers);
      
      // Determine if user passed the quiz (default passing is 70%)
      const passingThreshold = 0.7; // 70%
      const passed = gradeResults.percentageScore >= (passingThreshold * 100);
      
      // If user passed the quiz and we have pathway/module info, mark the module as complete
      if (passed && userId && pathwayId && moduleId) {
        try {
          // Check if progress record exists
          const existingProgress = await db.query.learningProgress.findFirst({
            where: and(
              eq(learningProgress.userId, userId),
              eq(learningProgress.pathwayId, pathwayId),
              eq(learningProgress.moduleId, moduleId)
            ),
          });
          
          const now = new Date();
          
          if (existingProgress) {
            // Update existing record
            await db
              .update(learningProgress)
              .set({ 
                completed: true, 
                completedAt: now,
                lastAccessedAt: now
              })
              .where(and(
                eq(learningProgress.userId, userId),
                eq(learningProgress.pathwayId, pathwayId),
                eq(learningProgress.moduleId, moduleId)
              ));
          } else {
            // Create new record
            await db.insert(learningProgress).values({
              userId,
              pathwayId,
              moduleId,
              completed: true,
              completedAt: now,
              lastAccessedAt: now
            });
          }
          
          console.log(`Module ${moduleId} automatically marked as completed for user ${userId} after passing quiz`);
          // Add module completion info to the grade results
          gradeResults.moduleCompleted = true;
        } catch (err) {
          console.error('Error updating module completion status:', err);
          // Continue execution - we still want to return quiz results even if tracking fails
        }
      }
      
      // Enhance feedback with OpenAI if needed
      if (subject) {
        // Build prompt for OpenAI to get more personalized advice
        const prompt = `
          A user has completed a quiz on ${subject} at the ${difficulty} level.
          They scored ${gradeResults.score} out of ${correctAnswers.length} (${gradeResults.percentageScore.toFixed(1)}%).
          They got questions ${gradeResults.incorrectQuestions.map(i => i + 1).join(', ')} wrong.
          
          Based on this performance:
          1. Provide 3 specific actions they can take to improve their understanding of ${subject}
          
          Format your response as a JSON object with this structure:
          {
            "suggestedActions": string[]
          }
        `;
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: "You are an encouraging educational coach who provides helpful, constructive feedback to learners. Your tone is supportive but honest, and you focus on growth and improvement."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        });
        
        if (response.choices[0].message.content) {
          const aiSuggestions = JSON.parse(response.choices[0].message.content);
          gradeResults.suggestedActions = aiSuggestions.suggestedActions;
        }
      }
      
      return res.json(gradeResults);
    } 
    // Backward compatibility with old format
    else if (typeof req.body.score === 'number' && typeof req.body.totalQuestions === 'number') {
      const { score, totalQuestions } = req.body;
      const percentage = (score / totalQuestions) * 100;
      
      // Determine if user passed the quiz (default passing is 70%)
      const passingThreshold = 0.7; // 70%
      const passed = percentage >= (passingThreshold * 100);
      let moduleCompleted = false;
      
      // If user passed the quiz and we have pathway/module info, mark the module as complete
      if (passed && userId && pathwayId && moduleId) {
        try {
          // Check if progress record exists
          const existingProgress = await db.query.learningProgress.findFirst({
            where: and(
              eq(learningProgress.userId, userId),
              eq(learningProgress.pathwayId, pathwayId),
              eq(learningProgress.moduleId, moduleId)
            ),
          });
          
          const now = new Date();
          
          if (existingProgress) {
            // Update existing record
            await db
              .update(learningProgress)
              .set({ 
                completed: true, 
                completedAt: now,
                lastAccessedAt: now
              })
              .where(and(
                eq(learningProgress.userId, userId),
                eq(learningProgress.pathwayId, pathwayId),
                eq(learningProgress.moduleId, moduleId)
              ));
          } else {
            // Create new record
            await db.insert(learningProgress).values({
              userId,
              pathwayId,
              moduleId,
              completed: true,
              completedAt: now,
              lastAccessedAt: now
            });
          }
          
          console.log(`Module ${moduleId} automatically marked as completed for user ${userId} after passing quiz`);
          moduleCompleted = true;
        } catch (err) {
          console.error('Error updating module completion status:', err);
          // Continue execution - we still want to return quiz results even if tracking fails
        }
      }
      
      // Build prompt for OpenAI
      const prompt = `
        A user has completed a quiz on ${subject} at the ${difficulty} level.
        They scored ${score} out of ${totalQuestions} (${percentage.toFixed(1)}%).
        
        Based on this performance:
        1. Provide personalized, encouraging feedback on their performance
        2. Suggest 3 specific actions they can take to improve their understanding
        
        Format your response as a JSON object with this structure:
        {
          "feedback": string,
          "suggestedActions": string[]
        }
      `;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an encouraging educational coach who provides helpful, constructive feedback to learners. Your tone is supportive but honest, and you focus on growth and improvement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      if (!response.choices[0].message.content) {
        throw new Error('No content received from OpenAI');
      }
      
      const content = response.choices[0].message.content;
      const feedbackData = JSON.parse(content);
      
      // Add module completion info to the feedback
      feedbackData.moduleCompleted = moduleCompleted;
      feedbackData.passed = passed;
      
      return res.json(feedbackData);
    } else {
      throw new Error('Invalid quiz submission format');
    }
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

/**
 * Track user's learning progress for personalized recommendations
 */
router.post('/track-progress', async (req: Request, res: Response) => {
  try {
    const { userId, pathwayId, moduleId, completed } = req.body;
    
    if (!userId || !pathwayId || !moduleId) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, pathwayId, moduleId' 
      });
    }
    
    // First, check if a record already exists
    const existingProgress = await db.query.learningProgress.findFirst({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, pathwayId),
        eq(learningProgress.moduleId, moduleId)
      )
    });
    
    if (existingProgress) {
      // Update existing record
      await db.update(learningProgress)
        .set({ 
          completed,
          completedAt: completed ? new Date() : null,
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(learningProgress.id, existingProgress.id));
      
      console.log(`Updated progress for user ${userId}, pathway ${pathwayId}, module ${moduleId}`);
    } else {
      // Create new record
      await db.insert(learningProgress).values({
        userId,
        pathwayId,
        moduleId,
        completed,
        completedAt: completed ? new Date() : null,
        lastAccessedAt: new Date()
      });
      
      console.log(`Created new progress for user ${userId}, pathway ${pathwayId}, module ${moduleId}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking progress:', error);
    res.status(500).json({ error: 'Failed to track progress' });
  }
});

/**
 * Fetch user's learning progress for all pathways
 */
router.get('/progress/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const progress = await db.query.learningProgress.findMany({
      where: eq(learningProgress.userId, userId),
      orderBy: [desc(learningProgress.lastAccessedAt)]
    });
    
    // Group by pathway for easier frontend consumption
    const groupedProgress = progress.reduce((acc, item) => {
      if (!acc[item.pathwayId]) {
        acc[item.pathwayId] = [];
      }
      acc[item.pathwayId].push(item);
      return acc;
    }, {} as Record<string, typeof progress[0][]>);
    
    res.json(groupedProgress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch learning progress' });
  }
});

/**
 * Get analytics data for a user's learning progress
 */
router.get('/analytics/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Fetch all progress data
    const progress = await db.query.learningProgress.findMany({
      where: eq(learningProgress.userId, userId)
    });
    
    // Calculate high-level metrics
    const totalModules = progress.length;
    const completedModules = progress.filter(p => p.completed).length;
    const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    
    // Group by pathway to calculate per-pathway completion
    const pathwayProgress = progress.reduce((acc, item) => {
      if (!acc[item.pathwayId]) {
        acc[item.pathwayId] = {
          totalModules: 0,
          completedModules: 0,
          lastAccessedAt: null
        };
      }
      
      acc[item.pathwayId].totalModules += 1;
      if (item.completed) {
        acc[item.pathwayId].completedModules += 1;
      }
      
      // Track the most recent access timestamp
      const itemDate = new Date(item.lastAccessedAt).getTime();
      if (!acc[item.pathwayId].lastAccessedAt || 
          itemDate > new Date(acc[item.pathwayId].lastAccessedAt as Date).getTime()) {
        acc[item.pathwayId].lastAccessedAt = item.lastAccessedAt;
      }
      
      return acc;
    }, {} as Record<string, { 
      totalModules: number; 
      completedModules: number; 
      lastAccessedAt: Date | null;
    }>);
    
    // Calculate per-pathway completion rates
    const pathwayCompletionRates = Object.entries(pathwayProgress).reduce((acc, [id, data]) => {
      acc[id] = {
        ...data,
        completionRate: data.totalModules > 0 ? 
          (data.completedModules / data.totalModules) * 100 : 0
      };
      return acc;
    }, {} as Record<string, { 
      totalModules: number; 
      completedModules: number; 
      lastAccessedAt: Date | null;
      completionRate: number;
    }>);
    
    // Get activity over time (for graphs)
    const activityByDate = progress
      .filter(p => p.completedAt)
      .reduce((acc, item) => {
        const dateKey = new Date(item.completedAt as Date).toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = 0;
        }
        acc[dateKey] += 1;
        return acc;
      }, {} as Record<string, number>);
    
    // Convert to array for easier usage with charting libraries
    const activityTimeline = Object.entries(activityByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate learning streaks
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (activityTimeline.length > 0) {
      // Simple streak calculation based on consecutive days with completed modules
      const dates = activityTimeline.map(item => new Date(item.date).getTime());
      dates.sort((a, b) => a - b);
      
      currentStreak = 1;
      let tempStreak = 1;
      
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i-1]);
        const currDate = new Date(dates[i]);
        
        // Check if dates are consecutive (allowing for date logic)
        prevDate.setDate(prevDate.getDate() + 1);
        
        if (prevDate.toISOString().split('T')[0] === currDate.toISOString().split('T')[0]) {
          tempStreak++;
          
          if (i === dates.length - 1) {
            // If this is the last date and it's consecutive with previous, it's current streak
            currentStreak = tempStreak;
          }
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
          
          // If this is the last date, current streak is 1
          if (i === dates.length - 1) {
            currentStreak = 1;
          }
        }
      }
      
      // Ensure longest streak is updated if the current streak is the longest
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }
    
    // Find most recently accessed categories
    const recentCategories = Object.entries(pathwayProgress)
      .filter(([_, data]) => data.lastAccessedAt)
      .sort((a, b) => {
        const dateA = new Date(a[1].lastAccessedAt as Date).getTime();
        const dateB = new Date(b[1].lastAccessedAt as Date).getTime();
        return dateB - dateA;
      })
      .slice(0, 3)
      .map(([id]) => id);
    
    // Assemble the analytics response
    const analytics = {
      summary: {
        totalModules,
        completedModules,
        completionRate: Math.round(completionRate),
        currentStreak,
        longestStreak
      },
      pathwayProgress: pathwayCompletionRates,
      activityTimeline,
      recentCategories
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ error: 'Failed to generate learning analytics' });
  }
});

export default router;