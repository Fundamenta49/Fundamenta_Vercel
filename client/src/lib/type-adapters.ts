import { LearningPathway as ProgressLearningPathway, LearningModule } from './learning-progress';
import { LearningPathway as DataLearningPathway, PathwayModule } from '../pages/learning/pathways-data';

/**
 * Adapts PathwayModule to LearningModule type for compatibility with learning-progress functions
 */
export function adaptModule(module: PathwayModule): LearningModule {
  return {
    id: module.id,
    title: module.title,
    path: module.href || '',
    complete: module.completed || false,
    selCompetencies: module.selCompetencies,
    lifeDomains: module.lifeDomains
  };
}

/**
 * Adapts LearningPathway from pathways-data to compatible type for learning-progress functions
 */
export function adaptPathway(pathway: DataLearningPathway): ProgressLearningPathway {
  return {
    id: pathway.id,
    title: pathway.title,
    description: pathway.description,
    category: pathway.category,
    progress: 0, // This will be calculated by the enrichPathwaysWithProgress function
    icon: pathway.icon,
    modules: pathway.modules.map(adaptModule),
    // Add any custom properties needed for compatibility
    prerequisites: [], // Will be populated if needed
    isLocked: false // Will be determined by the learning progress system
  };
}

/**
 * Adapts an array of pathways for use with learning-progress functions
 */
export function adaptPathways(pathways: DataLearningPathway[]): ProgressLearningPathway[] {
  return pathways.map(adaptPathway);
}