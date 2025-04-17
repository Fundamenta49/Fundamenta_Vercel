import OpenAI from "openai";
import { db } from '../db';
import { eq, and, desc } from 'drizzle-orm';
import { learningProgress } from '../../shared/schema';
import { learningPathways } from '../../client/src/pages/learning/pathways-data';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Types for module performance and gaps analysis
interface ModulePerformance {
  moduleId: string;
  pathwayId: string;
  quizScores: number[];
  avgScore: number;
  completed: boolean;
  lastAttempted: Date;
}

interface FrameworkGap {
  selCompetencies: string[];
  lifeCompetencies: string[];
}

interface LearningRecommendation {
  pathwayRecommendations: Array<{
    id: string;
    title: string;
    reason: string;
    priority: number;
  }>;
  moduleRecommendations: Array<{
    id: string;
    pathwayId: string;
    title: string;
    reason: string;
  }>;
  competencyGaps: FrameworkGap;
  suggestedResources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

/**
 * Retrieves and analyzes a user's learning data to identify patterns and gaps
 */
export async function analyzeUserLearningData(userId: number): Promise<{
  completedModules: string[];
  modulePerformance: Record<string, ModulePerformance>;
  weakestModules: ModulePerformance[];
  strongestModules: ModulePerformance[];
  incompletePathways: string[];
  frameworkGaps: FrameworkGap;
}> {
  // Get user's progress data
  const progressData = await db.query.learningProgress.findMany({
    where: eq(learningProgress.userId, userId),
    orderBy: [desc(learningProgress.lastAccessedAt)]
  });
  
  // Process and analyze the data
  const modulePerformance: Record<string, ModulePerformance> = {};
  const completedModules: string[] = [];
  const completedPathways = new Set<string>();
  const incompletePathways: string[] = [];
  
  // First pass - gather module performance data
  progressData.forEach(record => {
    if (!modulePerformance[record.moduleId]) {
      modulePerformance[record.moduleId] = {
        moduleId: record.moduleId,
        pathwayId: record.pathwayId,
        quizScores: [],
        avgScore: 0,
        completed: record.completed,
        lastAttempted: new Date(record.lastAccessedAt)
      };
    }
    
    // Add quiz score if available
    if (record.metadata && (record.metadata as any).quizScore) {
      modulePerformance[record.moduleId].quizScores.push((record.metadata as any).quizScore);
      
      // Update average score
      const scores = modulePerformance[record.moduleId].quizScores;
      modulePerformance[record.moduleId].avgScore = 
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
    
    // Track completed modules
    if (record.completed) {
      completedModules.push(record.moduleId);
    }
  });
  
  // Second pass - identify completed pathways and module performance rankings
  learningPathways.forEach(pathway => {
    const isPathwayComplete = pathway.modules.every(module => 
      completedModules.includes(module.id)
    );
    
    if (isPathwayComplete) {
      completedPathways.add(pathway.id);
    } else {
      incompletePathways.push(pathway.id);
    }
  });
  
  // Create sorted lists of modules by performance
  const modulePerformanceArray = Object.values(modulePerformance);
  const weakestModules = [...modulePerformanceArray]
    .filter(m => m.quizScores.length > 0)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 3);
    
  const strongestModules = [...modulePerformanceArray]
    .filter(m => m.quizScores.length > 0)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);
  
  // Analyze framework competency gaps
  const frameworkGaps = identifyFrameworkGaps(completedModules);
  
  return {
    completedModules,
    modulePerformance,
    weakestModules,
    strongestModules,
    incompletePathways,
    frameworkGaps
  };
}

/**
 * Identify gaps in framework competencies based on completed modules
 */
function identifyFrameworkGaps(completedModuleIds: string[]): FrameworkGap {
  // Track competency coverage across frameworks
  const selCoverage: Record<string, number> = {
    'SELF_AWARENESS': 0,
    'SELF_MANAGEMENT': 0,
    'SOCIAL_AWARENESS': 0,
    'RELATIONSHIP_SKILLS': 0,
    'RESPONSIBLE_DECISION_MAKING': 0
  };
  
  const lifeCoverage: Record<string, number> = {
    'EDUCATION_TRAINING': 0,
    'EMPLOYMENT': 0,
    'FINANCIAL_LITERACY': 0,
    'HOUSING': 0,
    'HEALTH': 0,
    'PERSONAL_SOCIAL': 0
  };
  
  // Count completed modules for each competency
  learningPathways.forEach(pathway => {
    pathway.modules.forEach(module => {
      if (completedModuleIds.includes(module.id)) {
        // Update SEL competencies coverage
        module.selCompetencies?.forEach(comp => {
          selCoverage[comp] += 1;
        });
        
        // Update LIFE domains coverage
        module.lifeDomains?.forEach(domain => {
          lifeCoverage[domain] += 1;
        });
      }
    });
  });
  
  // Find the competencies with lowest coverage
  const selGaps = Object.entries(selCoverage)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => key);
    
  const lifeGaps = Object.entries(lifeCoverage)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => key);
  
  return {
    selCompetencies: selGaps,
    lifeCompetencies: lifeGaps
  };
}

/**
 * Generate personalized learning recommendations using OpenAI
 */
export async function generateRecommendations(
  userId: number,
  userData: {
    completedModules: string[];
    weakestModules: ModulePerformance[];
    strongestModules: ModulePerformance[];
    incompletePathways: string[];
    frameworkGaps: FrameworkGap;
  }
): Promise<LearningRecommendation> {
  try {
    // Create a representation of the user's current state
    const userState = {
      completedModules: userData.completedModules,
      weakestModules: userData.weakestModules.map(m => ({
        id: m.moduleId,
        pathway: m.pathwayId,
        avgScore: m.avgScore
      })),
      strongestModules: userData.strongestModules.map(m => ({
        id: m.moduleId,
        pathway: m.pathwayId,
        avgScore: m.avgScore
      })),
      incompletePathways: userData.incompletePathways,
      frameworkGaps: userData.frameworkGaps
    };
    
    // Create pathway information to send to the AI
    const pathwayInfo = learningPathways.map(pathway => ({
      id: pathway.id,
      title: pathway.title,
      description: pathway.description,
      category: pathway.category,
      modules: pathway.modules.map(m => ({
        id: m.id,
        title: m.title,
        completed: userData.completedModules.includes(m.id)
      })),
      prerequisites: pathway.prerequisites || []
    }));
    
    // Generate recommendations using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert educational advisor who provides personalized learning recommendations.
          Your task is to analyze the user's learning progress and generate specific recommendations for
          pathways, modules, and external resources that will help them fill knowledge gaps and build
          balanced skills across all learning competencies.`
        },
        {
          role: "user",
          content: `Based on my learning progress, please recommend specific pathways and modules I should focus on next.
          
          My current learning state:
          ${JSON.stringify(userState, null, 2)}
          
          Available learning pathways:
          ${JSON.stringify(pathwayInfo, null, 2)}
          
          Please provide:
          1. 2-3 pathway recommendations with reasons (prioritized)
          2. 3-4 specific module recommendations to address my weakest areas
          3. 3-5 external learning resources (articles, videos, tools) related to my framework gaps`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse and structure the recommendations
    if (!response.choices[0].message.content) {
      throw new Error('Empty response from AI recommendation engine');
    }
    
    const aiRecommendations = JSON.parse(response.choices[0].message.content);
    
    return {
      pathwayRecommendations: aiRecommendations.pathwayRecommendations || [],
      moduleRecommendations: aiRecommendations.moduleRecommendations || [],
      competencyGaps: userData.frameworkGaps,
      suggestedResources: aiRecommendations.suggestedResources || []
    };
  } catch (error) {
    console.error('Error generating learning recommendations:', error);
    
    // Return a basic fallback recommendation if AI fails
    return {
      pathwayRecommendations: [
        {
          id: userData.incompletePathways[0] || 'financial-literacy',
          title: 'Continue Your Progress',
          reason: 'Based on your current progress, this pathway is most relevant.',
          priority: 1
        }
      ],
      moduleRecommendations: [],
      competencyGaps: userData.frameworkGaps,
      suggestedResources: []
    };
  }
}

/**
 * Generates a personalized learning plan for a user
 */
export async function generatePersonalizedLearningPlan(userId: number): Promise<LearningRecommendation> {
  // Analyze user's learning data
  const userData = await analyzeUserLearningData(userId);
  
  // Generate personalized recommendations
  return await generateRecommendations(userId, userData);
}