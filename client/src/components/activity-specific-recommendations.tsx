import React, { useState } from 'react';
import { ExerciseType } from '@/modules/active-you/context/module-context';
import { useActivityProfile } from '@/contexts/activity-profile-context';
import ProfilePromptCard from './profile-prompt-card';
import WorkoutRecommendations from './workout-recommendations';
import { Workout } from '@/lib/workout-generation-service';

interface ActivitySpecificRecommendationsProps {
  activityType: ExerciseType;
  onStartWorkout?: (workout: Workout) => void;
}

/**
 * Component that manages showing either a profile prompt or workout recommendations
 * based on whether the user has completed their profile for a specific activity
 */
const ActivitySpecificRecommendations: React.FC<ActivitySpecificRecommendationsProps> = ({
  activityType,
  onStartWorkout
}) => {
  const { isProfileComplete } = useActivityProfile();
  const [promptDismissed, setPromptDismissed] = useState(false);
  
  // Function to handle closing the profile prompt
  const handleClosePrompt = () => {
    setPromptDismissed(true);
  };
  
  // If profile is complete, show recommendations
  if (isProfileComplete(activityType)) {
    return <WorkoutRecommendations activityType={activityType} onStartWorkout={onStartWorkout} />;
  }
  
  // If prompt was dismissed, don't show anything
  if (promptDismissed) {
    return null;
  }
  
  // Otherwise show the profile prompt
  return <ProfilePromptCard activityType={activityType} onClose={handleClosePrompt} />;
};

export default ActivitySpecificRecommendations;