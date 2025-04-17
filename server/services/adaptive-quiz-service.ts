import OpenAI from "openai";
import NodeCache from "node-cache";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { learningProgress } from '../../shared/schema';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Cache for quiz questions to improve performance and reduce API calls
const quizCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Types for quiz generation
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'proficient';
  competencyArea?: string;
  conceptTested?: string;
}

interface UserPerformanceData {
  overallPerformance: number; // Overall success rate (0-100)
  topicPerformance: Record<string, number>; // Performance by topic (0-100)
  conceptMastery: Record<string, number>; // Mastery level of specific concepts (0-100)
  detailedHistory: Array<{
    topic: string;
    conceptTested: string;
    difficulty: string;
    success: boolean;
    timestamp: Date;
  }>;
}

/**
 * Retrieves a user's quiz performance history
 */
async function getUserPerformanceData(userId: number): Promise<UserPerformanceData> {
  try {
    // Get user's learning progress records
    const progressRecords = await db.query.learningProgress.findMany({
      where: eq(learningProgress.userId, userId)
    });
    
    // Initialize performance tracking
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    const conceptMastery: Record<string, { correct: number; total: number }> = {};
    let totalCorrect = 0;
    let totalQuestions = 0;
    const detailedHistory: UserPerformanceData['detailedHistory'] = [];
    
    // Process each progress record with quiz metadata
    progressRecords.forEach(record => {
      // Using the new metadata field (which is a jsonb column)
      if (record.metadata && (record.metadata as any).quizData) {
        const quizData = (record.metadata as any).quizData;
        
        // Track overall performance
        if (quizData.correct !== undefined && quizData.total !== undefined) {
          totalCorrect += quizData.correct;
          totalQuestions += quizData.total;
        }
        
        // Track performance by topic
        if (quizData.topic) {
          if (!topicPerformance[quizData.topic]) {
            topicPerformance[quizData.topic] = { correct: 0, total: 0 };
          }
          
          topicPerformance[quizData.topic].correct += quizData.correct || 0;
          topicPerformance[quizData.topic].total += quizData.total || 0;
        }
        
        // Track mastery by concept
        if (quizData.conceptsTested) {
          quizData.conceptsTested.forEach((concept: string) => {
            if (!conceptMastery[concept]) {
              conceptMastery[concept] = { correct: 0, total: 0 };
            }
            
            // Assume 1 question per concept for simplicity
            // In a real implementation, we would track this more precisely
            conceptMastery[concept].total += 1;
            if (quizData.success) {
              conceptMastery[concept].correct += 1;
            }
          });
        }
        
        // Add to detailed history
        if (quizData.topic && quizData.difficulty) {
          detailedHistory.push({
            topic: quizData.topic,
            conceptTested: quizData.conceptsTested?.[0] || 'general',
            difficulty: quizData.difficulty,
            success: !!quizData.success,
            timestamp: new Date(record.lastAccessedAt)
          });
        }
      }
    });
    
    // Calculate percentage scores
    const calcPercentage = (correct: number, total: number) => 
      total > 0 ? Math.round((correct / total) * 100) : 0;
    
    const overallPerformance = calcPercentage(totalCorrect, totalQuestions);
    
    const topicPerformancePercentages = Object.entries(topicPerformance).reduce(
      (acc, [topic, data]) => {
        acc[topic] = calcPercentage(data.correct, data.total);
        return acc;
      },
      {} as Record<string, number>
    );
    
    const conceptMasteryPercentages = Object.entries(conceptMastery).reduce(
      (acc, [concept, data]) => {
        acc[concept] = calcPercentage(data.correct, data.total);
        return acc;
      },
      {} as Record<string, number>
    );
    
    return {
      overallPerformance,
      topicPerformance: topicPerformancePercentages,
      conceptMastery: conceptMasteryPercentages,
      detailedHistory
    };
  } catch (error) {
    console.error('Error retrieving user performance data:', error);
    // Return default empty performance data
    return {
      overallPerformance: 0,
      topicPerformance: {},
      conceptMastery: {},
      detailedHistory: []
    };
  }
}

/**
 * Identifies knowledge gaps and areas for improvement
 */
function identifyKnowledgeGaps(performanceData: UserPerformanceData): {
  weakTopics: string[];
  weakConcepts: string[];
  recommendedDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'proficient';
} {
  // Identify weak topics (performance below 70%)
  const weakTopics = Object.entries(performanceData.topicPerformance)
    .filter(([, score]) => score < 70)
    .map(([topic]) => topic);
  
  // Identify weak concepts (mastery below 60%)
  const weakConcepts = Object.entries(performanceData.conceptMastery)
    .filter(([, score]) => score < 60)
    .map(([concept]) => concept);
  
  // Determine appropriate difficulty level based on overall performance
  let recommendedDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'proficient';
  
  if (performanceData.overallPerformance < 40) {
    recommendedDifficulty = 'beginner';
  } else if (performanceData.overallPerformance < 70) {
    recommendedDifficulty = 'intermediate';
  } else if (performanceData.overallPerformance < 85) {
    recommendedDifficulty = 'advanced';
  } else {
    recommendedDifficulty = 'proficient';
  }
  
  return {
    weakTopics,
    weakConcepts,
    recommendedDifficulty
  };
}

/**
 * Generates a personalized adaptive quiz for a user
 */
export async function generateAdaptiveQuiz(
  userId: number,
  subject: string,
  requestedDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'proficient',
  numberOfQuestions: number = 5,
  topics: string[] = []
): Promise<QuizQuestion[]> {
  try {
    // Get user's performance data
    const performanceData = await getUserPerformanceData(userId);
    
    // Analyze performance to identify knowledge gaps
    const { weakTopics, weakConcepts, recommendedDifficulty } = 
      identifyKnowledgeGaps(performanceData);
    
    // Determine final difficulty level, considering both requested and recommended
    let finalDifficulty = requestedDifficulty;
    
    // Only override if the recommended difficulty is lower than requested
    // This prevents frustrating users by making it too hard, but allows scaffolding up
    if (
      (requestedDifficulty === 'advanced' && recommendedDifficulty === 'beginner') ||
      (requestedDifficulty === 'proficient' && ['beginner', 'intermediate'].includes(recommendedDifficulty))
    ) {
      console.log(`Adapting difficulty from ${requestedDifficulty} to ${recommendedDifficulty} based on performance analysis`);
      finalDifficulty = recommendedDifficulty;
    }
    
    // Prioritize topics based on performance gaps
    let prioritizedTopics = [...topics];
    
    // If no specific topics requested, focus on weak areas
    if (prioritizedTopics.length === 0 && weakTopics.length > 0) {
      // Limit to 2 weak topics to maintain focus
      prioritizedTopics = weakTopics.slice(0, 2);
      console.log(`No topics specified, focusing on weak areas: ${prioritizedTopics.join(', ')}`);
    }
    
    // Create a unique cache key
    const cacheKey = `adaptive_quiz_${subject}_${finalDifficulty}_${numberOfQuestions}_${prioritizedTopics.join('_')}_${weakConcepts.slice(0, 3).join('_')}`;
    
    // Check cache first
    const cachedQuiz = quizCache.get<QuizQuestion[]>(cacheKey);
    if (cachedQuiz) {
      console.log("Serving adaptive quiz from cache");
      return cachedQuiz;
    }
    
    // Construct a prompt for OpenAI that considers user's performance data
    const prompt = `
      Generate an adaptive quiz on "${subject}" with the following parameters:
      - Difficulty level: ${finalDifficulty}
      - Number of questions: ${numberOfQuestions}
      ${prioritizedTopics.length > 0 ? `- Focus on these topics: ${prioritizedTopics.join(', ')}` : ''}
      ${weakConcepts.length > 0 ? `- Include questions on these concepts the user struggles with: ${weakConcepts.slice(0, 3).join(', ')}` : ''}
      
      The user's current performance metrics:
      - Overall performance: ${performanceData.overallPerformance}%
      ${Object.keys(performanceData.topicPerformance).length > 0 
        ? `- Topic performance: ${JSON.stringify(performanceData.topicPerformance)}` 
        : ''}
      
      For each question:
      1. Ensure it's appropriate for the ${finalDifficulty} difficulty level
      2. Include 4 options with only one correct answer
      3. Provide a detailed explanation for the correct answer
      4. Tag each question with the specific concept it tests
      
      Format your response as a JSON array of question objects with this structure:
      [
        {
          "id": 1,
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0, // Index of correct option (0-3)
          "explanation": "Detailed explanation of answer",
          "difficulty": "${finalDifficulty}",
          "competencyArea": "Topic area",
          "conceptTested": "Specific concept being tested"
        },
        ...
      ]
    `;
    
    // Generate quiz using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in creating personalized, adaptive quiz questions. Your answers should be accurate, educational, and tailored to the student's current knowledge and skill level."
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
    const questions: QuizQuestion[] = JSON.parse(content).questions || [];
    
    // Cache the result for future requests
    quizCache.set(cacheKey, questions);
    
    return questions;
  } catch (error) {
    console.error('Error generating adaptive quiz:', error);
    
    // Fallback to standard quiz generation
    console.log('Falling back to standard quiz generation');
    return generateStandardQuiz(subject, requestedDifficulty, numberOfQuestions, topics);
  }
}

/**
 * Generates a standard (non-adaptive) quiz as a fallback
 */
async function generateStandardQuiz(
  subject: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'proficient',
  numberOfQuestions: number = 5,
  topics: string[] = []
): Promise<QuizQuestion[]> {
  try {
    // Create a unique cache key
    const cacheKey = `standard_quiz_${subject}_${difficulty}_${numberOfQuestions}_${topics.join('_')}`;
    
    // Check cache first
    const cachedQuiz = quizCache.get<QuizQuestion[]>(cacheKey);
    if (cachedQuiz) {
      console.log("Serving standard quiz from cache");
      return cachedQuiz;
    }
    
    // Construct a prompt for OpenAI
    const prompt = `
      Generate a quiz on "${subject}" with the following parameters:
      - Difficulty level: ${difficulty}
      - Number of questions: ${numberOfQuestions}
      ${topics.length > 0 ? `- Focus on these topics: ${topics.join(', ')}` : ''}
      
      For each question:
      1. Ensure it's appropriate for the ${difficulty} difficulty level
      2. Include 4 options with only one correct answer
      3. Provide a detailed explanation for the correct answer
      
      Format your response as a JSON array of question objects with this structure:
      [
        {
          "id": 1,
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0, // Index of correct option (0-3)
          "explanation": "Detailed explanation of answer",
          "difficulty": "${difficulty}",
          "competencyArea": "Topic area",
          "conceptTested": "Specific concept being tested"
        },
        ...
      ]
    `;
    
    // Generate quiz using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in creating engaging quiz questions. Your answers should be accurate, educational, and appropriate for the specified difficulty level."
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
    const questions: QuizQuestion[] = JSON.parse(content).questions || [];
    
    // Cache the result for future requests
    quizCache.set(cacheKey, questions);
    
    return questions;
  } catch (error) {
    console.error('Error generating standard quiz:', error);
    
    // Return a minimal quiz if all else fails
    return [
      {
        id: 1,
        question: `What is the main focus of ${subject}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "This is a basic question about the subject.",
        difficulty: difficulty
      }
    ];
  }
}

/**
 * Record a user's quiz results for future adaptation
 */
export async function recordQuizResults(
  userId: number,
  pathwayId: string,
  moduleId: string,
  quizData: {
    topic: string;
    difficulty: string;
    conceptsTested: string[];
    correct: number;
    total: number;
    success: boolean;
  }
): Promise<boolean> {
  try {
    // Get existing progress record if it exists
    const existingProgress = await db.query.learningProgress.findFirst({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, pathwayId),
        eq(learningProgress.moduleId, moduleId)
      )
    });
    
    const now = new Date();
    
    if (existingProgress) {
      // Update existing record
      await db.update(learningProgress)
        .set({
          completed: quizData.success || existingProgress.completed,
          completedAt: quizData.success && !existingProgress.completed ? now : existingProgress.completedAt,
          lastAccessedAt: now,
          metadata: {
            ...existingProgress.metadata,
            quizData: {
              ...quizData,
              timestamp: now.toISOString()
            }
          }
        })
        .where(eq(learningProgress.id, existingProgress.id));
    } else {
      // Create new record
      await db.insert(learningProgress).values({
        userId,
        pathwayId,
        moduleId,
        completed: quizData.success,
        completedAt: quizData.success ? now : undefined,
        lastAccessedAt: now,
        metadata: {
          quizData: {
            ...quizData,
            timestamp: now.toISOString()
          }
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error recording quiz results:', error);
    return false;
  }
}