// Learning Path Integration Utility
// This file provides utility functions to integrate ActiveYou with learning paths

import { ExerciseType } from '../modules/active-you/context/module-context';

// Interface for tracking exercise progress in learning paths
export interface ExerciseProgress {
  exerciseId: string;
  pathwayId: string;
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  score?: number;
}

// Map exercise types to learning pathway IDs
const exerciseToPathwayMap: Record<ExerciseType, string> = {
  'yoga': 'fitness-wellness',
  'meditation': 'mental-wellness',
  'running': 'fitness-wellness',
  'hiit': 'fitness-wellness',
  'weightlifting': 'fitness-wellness',
  'stretch': 'fitness-wellness',
  'activeyou': 'fitness-wellness'
};

// Map exercise types to module IDs within pathways
const exerciseToModuleMap: Record<ExerciseType, string> = {
  'yoga': 'yoga-mastery',
  'meditation': 'mindfulness',
  'running': 'cardio-training',
  'hiit': 'interval-training',
  'weightlifting': 'strength-building',
  'stretch': 'flexibility-recovery',
  'activeyou': 'general-fitness'
};

/**
 * Get the learning pathway ID associated with an exercise type
 */
export function getPathwayForExercise(exerciseType: ExerciseType): string {
  return exerciseToPathwayMap[exerciseType] || 'fitness-wellness';
}

/**
 * Get the module ID associated with an exercise type
 */
export function getModuleForExercise(exerciseType: ExerciseType): string {
  return exerciseToModuleMap[exerciseType] || 'general-fitness';
}

/**
 * Track progress for an exercise in the learning pathways system
 */
export async function trackExerciseProgress(
  userId: number, 
  exerciseType: ExerciseType, 
  exerciseId: string,
  completed: boolean,
  score?: number
): Promise<boolean> {
  const pathwayId = getPathwayForExercise(exerciseType);
  const moduleId = getModuleForExercise(exerciseType);
  
  try {
    // This would typically be an API call to the backend
    // For now, we'll just log the tracking info
    console.log(`Tracking progress for user ${userId}: 
      Pathway: ${pathwayId}
      Module: ${moduleId}
      Exercise: ${exerciseId}
      Completed: ${completed}
      Score: ${score || 'N/A'}
    `);
    
    // Notify the arcade system for potential rewards
    recordArcadeActivity(userId, exerciseType, completed ? 'completed' : 'started');
    
    return true;
  } catch (error) {
    console.error('Failed to track exercise progress:', error);
    return false;
  }
}

/**
 * Record activity for arcade rewards system
 */
export function recordArcadeActivity(
  userId: number,
  exerciseType: ExerciseType,
  action: 'started' | 'completed' | 'mastered'
): void {
  // This would typically connect to the arcade/gamification system
  // For now, we'll just log the activity
  console.log(`Recording arcade activity for user ${userId}:
    Exercise: ${exerciseType}
    Action: ${action}
  `);
}

/**
 * Get point value for completing an exercise
 */
export function getExercisePointValue(exerciseType: ExerciseType): number {
  const pointValues: Record<ExerciseType, number> = {
    'yoga': 15,
    'meditation': 10,
    'running': 20,
    'hiit': 25,
    'weightlifting': 20,
    'stretch': 10,
    'activeyou': 5
  };
  
  return pointValues[exerciseType] || 10;
}

/**
 * Check if an exercise is part of a learning challenge
 */
export function isExerciseInActiveChallenge(exerciseType: ExerciseType): boolean {
  // This would typically check with the backend
  // For now, we'll return true for yoga and hiit
  return ['yoga', 'hiit', 'meditation'].includes(exerciseType);
}