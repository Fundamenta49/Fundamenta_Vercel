/**
 * ActiveYou AI Integration
 * 
 * This file provides integration between the ActiveYou module and Fundi AI.
 * It extends the AI event system to handle exercise-related events and allows
 * Fundi to be aware of and respond to user's fitness activities.
 */

import { useAIEventStore, AIAction } from './ai-event-system';
import { ExerciseType } from '../modules/active-you/context/module-context';
import { getExercisePointValue, isExerciseInActiveChallenge } from './learning-path-integration';

// Define exercise-specific action types for Fundi
export type ExerciseActionType = 
  | 'exercise_started' 
  | 'exercise_completed' 
  | 'pose_analyzed' 
  | 'running_tracked' 
  | 'meditation_completed';

export interface ExerciseAction {
  type: ExerciseActionType;
  exerciseType: ExerciseType;
  payload: {
    exerciseId?: string;
    duration?: number;
    difficulty?: string;
    achievements?: string[];
    points?: number;
    inChallenge?: boolean;
    poseAnalysis?: {
      poseName?: string;
      alignmentScore?: number;
      feedback?: string[];
    };
    [key: string]: any;
  }
}

/**
 * Create an exercise event to send to Fundi
 */
export function createExerciseAction(
  type: ExerciseActionType,
  exerciseType: ExerciseType,
  details: Partial<ExerciseAction['payload']> = {}
): ExerciseAction {
  // Automatically add challenge and points information if not provided
  const inChallenge = details.inChallenge ?? isExerciseInActiveChallenge(exerciseType);
  const points = details.points ?? getExercisePointValue(exerciseType);
  
  return {
    type,
    exerciseType,
    payload: {
      ...details,
      inChallenge,
      points
    }
  };
}

/**
 * Send exercise action to Fundi by converting it to an AIAction
 * and adding it to the AI event system
 */
export function sendExerciseActionToFundi(action: ExerciseAction): void {
  const aiStore = useAIEventStore.getState();
  
  // Create action text based on action type
  let actionText = '';
  switch (action.type) {
    case 'exercise_started':
      actionText = `Started ${action.exerciseType} exercise`;
      break;
    case 'exercise_completed':
      actionText = `Completed ${action.exerciseType} exercise`;
      break;
    case 'pose_analyzed':
      actionText = `Analyzed yoga pose using YogaVision AI`;
      break;
    case 'running_tracked':
      actionText = `Tracked running activity with GPS`;
      break;
    case 'meditation_completed':
      actionText = `Completed a meditation session`;
      break;
  }
  
  // Create an AI action for the event system
  const aiAction: AIAction = {
    type: 'trigger_feature',
    payload: {
      feature: 'activeyou',
      exerciseAction: action,
      exerciseType: action.exerciseType,
      actionType: action.type,
      details: action.payload,
      reason: actionText
    }
  };
  
  // Add the action to the pending actions queue
  aiStore.addPendingAction(aiAction);
  
  // Update the category based on exercise type
  const categoryMap: Record<ExerciseType, string> = {
    'meditation': 'mindfulness',
    'yoga': 'fitness',
    'running': 'fitness',
    'hiit': 'fitness',
    'weightlifting': 'fitness',
    'stretch': 'wellness',
    'activeyou': 'fitness'
  };
  
  // Create a mock response to update Fundi's context
  aiStore.setLastResponse({
    response: '',
    category: categoryMap[action.exerciseType] || 'fitness',
    actions: [aiAction]
  });
}

// Exercise-specific event dispatchers

/**
 * Notify Fundi when a user starts an exercise
 */
export function notifyExerciseStarted(
  exerciseType: ExerciseType,
  exerciseId?: string,
  difficulty?: string
): void {
  const action = createExerciseAction('exercise_started', exerciseType, {
    exerciseId,
    difficulty,
    timestamp: new Date().toISOString()
  });
  
  sendExerciseActionToFundi(action);
}

/**
 * Notify Fundi when a user completes an exercise
 */
export function notifyExerciseCompleted(
  exerciseType: ExerciseType,
  exerciseId?: string,
  duration?: number,
  achievements?: string[]
): void {
  const action = createExerciseAction('exercise_completed', exerciseType, {
    exerciseId,
    duration,
    achievements,
    timestamp: new Date().toISOString()
  });
  
  sendExerciseActionToFundi(action);
}

/**
 * Notify Fundi when a yoga pose is analyzed with YogaVision
 */
export function notifyPoseAnalyzed(
  poseName: string,
  alignmentScore: number,
  feedback: string[]
): void {
  const action = createExerciseAction('pose_analyzed', 'yoga', {
    poseAnalysis: {
      poseName,
      alignmentScore,
      feedback
    },
    timestamp: new Date().toISOString()
  });
  
  sendExerciseActionToFundi(action);
}

/**
 * Notify Fundi when a running session is tracked
 */
export function notifyRunTracked(
  distance: number,
  duration: number,
  pace: number
): void {
  const action = createExerciseAction('running_tracked', 'running', {
    distance,
    duration,
    pace,
    timestamp: new Date().toISOString()
  });
  
  sendExerciseActionToFundi(action);
}

/**
 * Notify Fundi when a meditation session is completed
 */
export function notifyMeditationCompleted(
  duration: number,
  focusArea?: string
): void {
  const action = createExerciseAction('meditation_completed', 'meditation', {
    duration,
    focusArea,
    timestamp: new Date().toISOString()
  });
  
  sendExerciseActionToFundi(action);
}