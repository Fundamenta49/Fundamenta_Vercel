import { apiRequest } from "./queryClient";

// Types for learning progress
export interface LearningModule {
  id: string;
  title: string;
  path: string;
  complete: boolean;
}

export interface LearningPathway {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  icon: React.ReactNode;
  modules: LearningModule[];
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
    return {};
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
 * Update LearningPathway with actual progress from backend
 */
export function enrichPathwaysWithProgress(
  pathways: LearningPathway[], 
  progressData: GroupedProgress
): LearningPathway[] {
  return pathways.map(pathway => {
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
}