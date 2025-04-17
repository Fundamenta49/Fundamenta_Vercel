import { apiRequest } from "./queryClient";

// Import framework types from schema
import { 
  selCompetencies,
  lifeDomains,
  skillLevels
} from './framework-constants';

// Framework type definitions
export type SELCompetency = keyof typeof selCompetencies;
export type LIFEDomain = keyof typeof lifeDomains;
export type SkillLevel = keyof typeof skillLevels;

// Types for learning progress
export interface LearningModule {
  id: string;
  title: string;
  path: string;
  complete: boolean;
  // Framework metadata
  selCompetencies?: SELCompetency[];  // SEL competencies this module addresses
  lifeDomains?: LIFEDomain[];         // Project LIFE domains this module addresses
  skillLevel?: SkillLevel;            // Skill level of this module
}

export interface LearningPathway {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  icon: React.ReactNode;
  modules: LearningModule[];
  prerequisites?: string[]; // IDs of pathways that must be completed first
  isLocked?: boolean; // Whether this pathway is locked due to prerequisites
}

export interface ProgressRecord {
  userId: number;
  pathwayId: string;
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface GroupedProgress {
  [pathwayId: string]: ProgressRecord[];
}

// API functions

/**
 * Fetch learning progress for a specific user
 */
export async function fetchUserProgress(userId: number): Promise<GroupedProgress> {
  try {
    const response = await apiRequest('GET', `/api/learning/progress/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return {} as GroupedProgress;
  }
}

/**
 * Update progress for a specific module
 */
export async function trackModuleProgress(
  userId: number, 
  pathwayId: string, 
  moduleId: string, 
  completed: boolean
): Promise<boolean> {
  try {
    const response = await apiRequest('POST', '/api/learning/track-progress', {
      userId,
      pathwayId,
      moduleId,
      completed
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error tracking module progress:', error);
    return false;
  }
}

// Analytics types
export interface LearningAnalyticsSummary {
  totalModules: number;
  completedModules: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

export interface PathwayProgressStats {
  totalModules: number;
  completedModules: number;
  lastAccessedAt: Date | null;
  completionRate: number;
}

export interface ActivityTimelineItem {
  date: string;
  count: number;
}

// Framework progress tracking
export interface FrameworkProgress {
  sel: Record<SELCompetency, number>;    // Progress percentage by SEL competency 
  projectLife: Record<LIFEDomain, number>; // Progress percentage by Project LIFE domain
}

export interface LearningAnalytics {
  summary: LearningAnalyticsSummary;
  pathwayProgress: Record<string, PathwayProgressStats>;
  activityTimeline: ActivityTimelineItem[];
  recentCategories: string[];
  frameworkProgress?: FrameworkProgress; // Progress across educational frameworks
}

/**
 * Fetch analytics data for a user's learning progress
 */
export async function fetchLearningAnalytics(userId: number): Promise<LearningAnalytics> {
  try {
    const response = await apiRequest('GET', `/api/learning/analytics/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching learning analytics:', error);
    throw new Error('Failed to fetch learning analytics');
  }
}

/**
 * Clear all learning progress for a user
 */
export async function clearLearningProgress(userId: number): Promise<boolean> {
  try {
    const response = await apiRequest('DELETE', `/api/learning/clear-progress/${userId}`);
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error clearing learning progress:', error);
    return false;
  }
}

/**
 * Calculate overall progress percentage for a pathway
 */
export function calculatePathwayProgress(
  pathwayModules: LearningModule[], 
  progressData?: ProgressRecord[]
): number {
  if (!progressData || progressData.length === 0) {
    return 0;
  }
  
  // Create a lookup map for completed modules
  const completedModulesMap = progressData.reduce((map, record) => {
    if (record.completed) {
      map[record.moduleId] = true;
    }
    return map;
  }, {} as Record<string, boolean>);
  
  // Count completed modules
  const completedCount = pathwayModules.reduce((count, module) => {
    return completedModulesMap[module.id] ? count + 1 : count;
  }, 0);
  
  return Math.round((completedCount / pathwayModules.length) * 100);
}

/**
 * Check if a pathway is completed (100% progress)
 */
export function isPathwayCompleted(pathway: LearningPathway): boolean {
  return pathway.progress === 100;
}

/**
 * Check if all prerequisites for a pathway are completed
 */
export function arePrerequisitesMet(pathway: LearningPathway, allPathways: LearningPathway[]): boolean {
  // If no prerequisites, it's always unlocked
  if (!pathway.prerequisites || pathway.prerequisites.length === 0) {
    return true;
  }

  // Check if all prerequisite pathways are completed
  return pathway.prerequisites.every(prereqId => {
    const prerequisitePathway = allPathways.find(p => p.id === prereqId);
    return prerequisitePathway && isPathwayCompleted(prerequisitePathway);
  });
}

/**
 * Update LearningPathway with actual progress from backend and check prerequisites
 */
export function enrichPathwaysWithProgress(
  pathways: LearningPathway[], 
  progressData: GroupedProgress
): LearningPathway[] {
  // First pass: update progress for all pathways
  const pathwaysWithProgress = pathways.map(pathway => {
    const pathwayProgress = progressData[pathway.id] || [];
    
    // Update modules completion status
    const updatedModules = pathway.modules.map(module => {
      const moduleProgress = pathwayProgress.find(p => p.moduleId === module.id);
      return {
        ...module,
        complete: moduleProgress?.completed || false
      };
    });
    
    // Calculate updated progress percentage
    const progressPercentage = calculatePathwayProgress(updatedModules, pathwayProgress);
    
    return {
      ...pathway,
      modules: updatedModules,
      progress: progressPercentage
    };
  });
  
  // Second pass: check prerequisites and update locked status
  return pathwaysWithProgress.map(pathway => {
    // Check if all prerequisites are met
    const isLocked = pathway.prerequisites && pathway.prerequisites.length > 0
      ? !arePrerequisitesMet(pathway, pathwaysWithProgress)
      : false;
    
    return {
      ...pathway,
      isLocked
    };
  });
}

/**
 * Identify framework competency gaps for personalized recommendations
 */
export function identifyFrameworkGaps(
  completedModules: LearningModule[],
  allModules: LearningModule[]
): {
  selGaps: SELCompetency[],
  lifeGaps: LIFEDomain[]
} {
  // Track competency coverage
  const selCoverage: Record<SELCompetency, number> = {} as Record<SELCompetency, number>;
  const lifeCoverage: Record<LIFEDomain, number> = {} as Record<LIFEDomain, number>;
  
  // Initialize all competencies and domains with zero
  Object.keys(selCompetencies).forEach(key => {
    selCoverage[key as SELCompetency] = 0;
  });
  
  Object.keys(lifeDomains).forEach(key => {
    lifeCoverage[key as LIFEDomain] = 0;
  });
  
  // Count completed modules for each competency/domain
  completedModules.forEach(module => {
    module.selCompetencies?.forEach(comp => {
      selCoverage[comp]++;
    });
    
    module.lifeDomains?.forEach(domain => {
      lifeCoverage[domain]++;
    });
  });
  
  // Identify gaps (areas with lowest coverage)
  const selGaps = Object.entries(selCoverage)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => key as SELCompetency);
    
  const lifeGaps = Object.entries(lifeCoverage)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => key as LIFEDomain);
    
  return { selGaps, lifeGaps };
}

/**
 * Calculate framework coverage percentages
 */
export function calculateFrameworkProgress(
  completedModules: LearningModule[],
  allModules: LearningModule[]
): FrameworkProgress {
  // Initialize coverage tracking objects
  const selModules: Record<SELCompetency, { total: number, completed: number }> = 
    {} as Record<SELCompetency, { total: number, completed: number }>;
    
  const lifeModules: Record<LIFEDomain, { total: number, completed: number }> = 
    {} as Record<LIFEDomain, { total: number, completed: number }>;
  
  // Initialize records for all competencies and domains
  Object.keys(selCompetencies).forEach(comp => {
    selModules[comp as SELCompetency] = { total: 0, completed: 0 };
  });
  
  Object.keys(lifeDomains).forEach(domain => {
    lifeModules[domain as LIFEDomain] = { total: 0, completed: 0 };
  });
  
  // Process all modules to count totals for each framework element
  allModules.forEach(module => {
    const isCompleted = completedModules.some(m => m.id === module.id);
    
    // Count SEL competencies
    module.selCompetencies?.forEach(comp => {
      selModules[comp].total++;
      if (isCompleted) {
        selModules[comp].completed++;
      }
    });
    
    // Count Project LIFE domains
    module.lifeDomains?.forEach(domain => {
      lifeModules[domain].total++;
      if (isCompleted) {
        lifeModules[domain].completed++;
      }
    });
  });
  
  // Convert to percentage values
  const selProgress = Object.entries(selModules).reduce((acc, [key, value]) => {
    acc[key as SELCompetency] = value.total > 0 
      ? Math.round((value.completed / value.total) * 100) 
      : 0;
    return acc;
  }, {} as Record<SELCompetency, number>);
  
  const projectLifeProgress = Object.entries(lifeModules).reduce((acc, [key, value]) => {
    acc[key as LIFEDomain] = value.total > 0 
      ? Math.round((value.completed / value.total) * 100) 
      : 0;
    return acc;
  }, {} as Record<LIFEDomain, number>);
  
  return {
    sel: selProgress,
    projectLife: projectLifeProgress
  };
}