import { ActivityType } from "@/contexts/activity-profile-context";
import { ACHIEVEMENTS } from "@/shared/arcade-schema";
import { toast } from "@/hooks/use-toast";

// Interface for tracking fitness activity progress
export interface FitnessActivity {
  id: string;
  type: ActivityType;
  timestamp: Date;
  duration: number; // in minutes
  details: {
    [key: string]: any; // Flexible structure for activity-specific details
  };
}

// Map of activity types to their corresponding learning path IDs
const ACTIVITY_TO_LEARNING_PATH: Record<ActivityType, string[]> = {
  yoga: ["wellness-mindfulness", "stress-management"],
  running: ["fitness-cardio", "goal-setting"],
  weightlifting: ["fitness-strength", "consistency-building"],
  hiit: ["fitness-endurance", "time-management"],
  stretch: ["wellness-recovery", "injury-prevention"],
  meditation: ["wellness-mindfulness", "mental-health"]
};

// Map of activity types to their corresponding achievement IDs
const ACTIVITY_TO_ACHIEVEMENTS: Record<ActivityType, string[]> = {
  yoga: ["fit-yoga-beginner", "fit-consistency"],
  running: ["fit-first-workout", "fit-consistency"],
  weightlifting: ["fit-first-workout", "fit-consistency", "fit-strength-milestone"],
  hiit: ["fit-first-workout", "fit-consistency", "fit-intensity-master"],
  stretch: ["fit-first-workout", "fit-flexibility-focus"],
  meditation: ["well-mindfulness-starter", "well-mental-master"]
};

// Map of milestone counts to achievements
const MILESTONE_ACHIEVEMENTS: Record<string, number> = {
  "fit-consistency": 3, // 3 workouts in a week
  "fit-dedication": 10, // 10 total workouts
  "fit-master": 25, // 25 total workouts
  "fit-legend": 50 // 50 total workouts
};

/**
 * Track a completed fitness activity and update related systems
 * @param activity The completed fitness activity to track
 */
export const trackFitnessActivity = async (activity: FitnessActivity): Promise<void> => {
  try {
    // 1. Save the activity to local storage for persistence
    saveActivityToLocalStorage(activity);
    
    // 2. Update any achievement progress
    updateAchievementProgress(activity);
    
    // 3. Update learning path progress if applicable
    updateLearningPathProgress(activity);
    
    // 4. Add to calendar if duration is significant
    if (activity.duration >= 15) {
      addToSmartCalendar(activity);
    }
    
    console.log(`Activity tracked: ${activity.type} for ${activity.duration} minutes`);
  } catch (error) {
    console.error("Error tracking fitness activity:", error);
    toast({
      title: "Tracking Error",
      description: "There was a problem tracking your activity. Please try again.",
      variant: "destructive"
    });
  }
};

/**
 * Save activity to local storage for persistence
 */
const saveActivityToLocalStorage = (activity: FitnessActivity): void => {
  try {
    // Get existing activities
    const storedActivities = localStorage.getItem('fitness_activities');
    const activities: FitnessActivity[] = storedActivities 
      ? JSON.parse(storedActivities) 
      : [];
    
    // Add new activity
    activities.push(activity);
    
    // Store back in localStorage
    localStorage.setItem('fitness_activities', JSON.stringify(activities));
  } catch (error) {
    console.error("Error saving activity to localStorage:", error);
  }
};

/**
 * Update any achievement progress based on the activity
 */
const updateAchievementProgress = (activity: FitnessActivity): void => {
  // Get relevant achievement IDs for this activity type
  const achievementIds = ACTIVITY_TO_ACHIEVEMENTS[activity.type] || [];
  
  if (achievementIds.length === 0) return;
  
  try {
    // Get the user's current achievement progress
    const storedProgress = localStorage.getItem('arcade_progress');
    if (!storedProgress) return;
    
    const arcadeProgress = JSON.parse(storedProgress);
    if (!arcadeProgress.achievements) return;
    
    // First workout achievement
    if (achievementIds.includes('fit-first-workout') && 
        arcadeProgress.achievements['fit-first-workout']?.progress === 0) {
      arcadeProgress.achievements['fit-first-workout'] = {
        progress: 100,
        unlockedAt: new Date().toISOString()
      };
      
      toast({
        title: "Achievement Unlocked!",
        description: "First Workout: Complete your first tracked workout",
        variant: "default"
      });
    }
    
    // Yoga beginner achievement
    if (activity.type === 'yoga' && 
        arcadeProgress.achievements['fit-yoga-beginner']?.progress === 0) {
      arcadeProgress.achievements['fit-yoga-beginner'] = {
        progress: 100,
        unlockedAt: new Date().toISOString()
      };
      
      toast({
        title: "Achievement Unlocked!",
        description: "Yoga Beginner: Complete your first yoga session",
        variant: "default"
      });
    }
    
    // Check for consistency achievement (3 workouts in a week)
    const lastWeekActivities = getActivitiesInLastWeek();
    if (lastWeekActivities.length >= 3 && 
        arcadeProgress.achievements['fit-consistency']?.progress < 100) {
      arcadeProgress.achievements['fit-consistency'] = {
        progress: 100,
        unlockedAt: new Date().toISOString()
      };
      
      toast({
        title: "Achievement Unlocked!",
        description: "Consistency is Key: Work out 3 times in one week",
        variant: "default"
      });
    }
    
    // Store updated achievements
    localStorage.setItem('arcade_progress', JSON.stringify(arcadeProgress));
    
    // Update total points
    updateTotalPoints(arcadeProgress);
    
  } catch (error) {
    console.error("Error updating achievement progress:", error);
  }
};

/**
 * Get all activities recorded in the last 7 days
 */
const getActivitiesInLastWeek = (): FitnessActivity[] => {
  try {
    const storedActivities = localStorage.getItem('fitness_activities');
    if (!storedActivities) return [];
    
    const activities: FitnessActivity[] = JSON.parse(storedActivities);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= oneWeekAgo;
    });
  } catch (error) {
    console.error("Error getting activities in last week:", error);
    return [];
  }
};

/**
 * Update the user's total points based on achievements
 */
const updateTotalPoints = (arcadeProgress: any): void => {
  try {
    let totalPoints = 0;
    
    // Calculate points from completed achievements
    Object.keys(arcadeProgress.achievements).forEach(achievementId => {
      const achievement = arcadeProgress.achievements[achievementId];
      if (achievement.progress === 100) {
        // Find the achievement definition to get its point value
        const achievementDef = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievementDef) {
          totalPoints += achievementDef.points;
        }
      }
    });
    
    // Update total points
    arcadeProgress.rank.currentPoints = totalPoints;
    
    // Check if user has leveled up
    // (would normally be more complex with level thresholds)
    
    // Save updated progress
    localStorage.setItem('arcade_progress', JSON.stringify(arcadeProgress));
  } catch (error) {
    console.error("Error updating total points:", error);
  }
};

/**
 * Update learning path progress based on the activity
 */
const updateLearningPathProgress = (activity: FitnessActivity): void => {
  // Get relevant learning path IDs for this activity type
  const pathIds = ACTIVITY_TO_LEARNING_PATH[activity.type] || [];
  
  if (pathIds.length === 0) return;
  
  try {
    // Get stored learning progress
    const storedProgress = localStorage.getItem('learning_progress');
    const learningProgress = storedProgress 
      ? JSON.parse(storedProgress) 
      : {};
    
    // Update progress for each relevant path
    pathIds.forEach(pathId => {
      if (!learningProgress[pathId]) {
        learningProgress[pathId] = { progress: 0, modulesDone: {} };
      }
      
      // Incremental progress (would be more complex in real implementation)
      // We're just adding a small percentage for each activity completion
      const newProgress = Math.min(learningProgress[pathId].progress + 5, 100);
      learningProgress[pathId].progress = newProgress;
    });
    
    // Store updated progress
    localStorage.setItem('learning_progress', JSON.stringify(learningProgress));
  } catch (error) {
    console.error("Error updating learning path progress:", error);
  }
};

/**
 * Add the activity to the smart calendar for tracking
 */
const addToSmartCalendar = (activity: FitnessActivity): void => {
  try {
    // Format activity title based on type
    const activityTitle = `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} workout`;
    
    // Create calendar event
    const calendarEvent = {
      id: activity.id,
      title: activityTitle,
      category: 'fitness',
      date: new Date(activity.timestamp),
      description: `${activity.duration} minute ${activity.type} session`
    };
    
    // Get existing calendar events
    const storedEvents = localStorage.getItem('calendar_events');
    const events = storedEvents 
      ? JSON.parse(storedEvents) 
      : [];
    
    // Add new event
    events.push(calendarEvent);
    
    // Store back in localStorage
    localStorage.setItem('calendar_events', JSON.stringify(events));
  } catch (error) {
    console.error("Error adding to smart calendar:", error);
  }
};

/**
 * Get summary statistics for fitness activities
 */
export const getFitnessActivityStats = (): {
  totalWorkouts: number;
  thisWeekWorkouts: number;
  totalMinutes: number;
  favoriteActivity: ActivityType | null;
  lastActivity: Date | null;
} => {
  try {
    const storedActivities = localStorage.getItem('fitness_activities');
    if (!storedActivities) {
      return {
        totalWorkouts: 0,
        thisWeekWorkouts: 0,
        totalMinutes: 0,
        favoriteActivity: null,
        lastActivity: null
      };
    }
    
    const activities: FitnessActivity[] = JSON.parse(storedActivities);
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    // Calculate total workouts
    const totalWorkouts = activities.length;
    
    // Calculate this week's workouts
    const thisWeekWorkouts = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= oneWeekAgo;
    }).length;
    
    // Calculate total minutes
    const totalMinutes = activities.reduce((total, activity) => {
      return total + activity.duration;
    }, 0);
    
    // Determine favorite activity
    const activityCounts: Record<ActivityType, number> = {
      yoga: 0,
      running: 0,
      weightlifting: 0,
      hiit: 0,
      stretch: 0,
      meditation: 0
    };
    
    activities.forEach(activity => {
      activityCounts[activity.type]++;
    });
    
    let favoriteActivity: ActivityType | null = null;
    let maxCount = 0;
    
    (Object.keys(activityCounts) as ActivityType[]).forEach(type => {
      if (activityCounts[type] > maxCount) {
        maxCount = activityCounts[type];
        favoriteActivity = type;
      }
    });
    
    // Get last activity date
    const sortedActivities = [...activities].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    const lastActivity = sortedActivities.length > 0 
      ? new Date(sortedActivities[0].timestamp) 
      : null;
    
    return {
      totalWorkouts,
      thisWeekWorkouts,
      totalMinutes,
      favoriteActivity,
      lastActivity
    };
  } catch (error) {
    console.error("Error getting fitness stats:", error);
    return {
      totalWorkouts: 0,
      thisWeekWorkouts: 0,
      totalMinutes: 0,
      favoriteActivity: null,
      lastActivity: null
    };
  }
};

/**
 * Get suggested next activities based on user history and goals
 */
export const getSuggestedNextActivities = (activityType?: ActivityType): { 
  title: string;
  description: string;
  type: ActivityType;
  duration: number;
  benefitDescription: string;
}[] => {
  // Get user stats to inform recommendations
  const stats = getFitnessActivityStats();
  const suggestions = [];

  // Default suggestions if no specific activity type is provided
  if (!activityType) {
    // If user hasn't done any activities yet
    if (stats.totalWorkouts === 0) {
      return [
        {
          title: "Start with Yoga",
          description: "Beginner-friendly yoga flow",
          type: "yoga",
          duration: 15,
          benefitDescription: "Improve flexibility and reduce stress"
        },
        {
          title: "Quick HIIT Workout",
          description: "No-equipment required HIIT session",
          type: "hiit",
          duration: 10,
          benefitDescription: "Boost metabolism and save time"
        },
        {
          title: "Guided Meditation",
          description: "Beginner mindfulness session",
          type: "meditation",
          duration: 5,
          benefitDescription: "Reduce anxiety and improve focus"
        }
      ];
    }
    
    // If user has done some activities
    const recommendationsPool = [
      {
        title: "Morning Yoga Flow",
        description: "Energizing yoga sequence",
        type: "yoga" as ActivityType,
        duration: 20,
        benefitDescription: "Increase energy and improve posture"
      },
      {
        title: "Interval Run/Walk",
        description: "Alternating run and walk intervals",
        type: "running" as ActivityType,
        duration: 25,
        benefitDescription: "Build cardio endurance"
      },
      {
        title: "Full Body Strength",
        description: "Compound exercises for whole body",
        type: "weightlifting" as ActivityType,
        duration: 30,
        benefitDescription: "Build functional strength"
      },
      {
        title: "HIIT Cardio Blast",
        description: "High-intensity interval training",
        type: "hiit" as ActivityType,
        duration: 15,
        benefitDescription: "Maximize calorie burn in minimal time"
      }
    ];
    
    // Select 3 random recommendations
    while (suggestions.length < 3 && recommendationsPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendationsPool.length);
      suggestions.push(recommendationsPool[randomIndex]);
      recommendationsPool.splice(randomIndex, 1);
    }
    
    return suggestions;
  }
  
  // Activity-specific suggestions
  switch (activityType) {
    case "yoga":
      return [
        {
          title: "Morning Energizer",
          description: "Wake up your body with this energizing flow",
          type: "yoga",
          duration: 20,
          benefitDescription: "Increase energy and mental clarity"
        },
        {
          title: "Flexibility Focus",
          description: "Deep stretches for improved flexibility",
          type: "yoga",
          duration: 25,
          benefitDescription: "Increase range of motion and reduce injury risk"
        },
        {
          title: "Stress Relief",
          description: "Calming flow for stress reduction",
          type: "yoga",
          duration: 15,
          benefitDescription: "Lower cortisol and promote relaxation"
        }
      ];
      
    case "running":
      return [
        {
          title: "Interval Training",
          description: "Alternating sprint and jog intervals",
          type: "running",
          duration: 25,
          benefitDescription: "Improve speed and endurance"
        },
        {
          title: "Steady State Run",
          description: "Consistent pace, moderate intensity",
          type: "running",
          duration: 30,
          benefitDescription: "Build aerobic endurance"
        },
        {
          title: "Recovery Run",
          description: "Low intensity, focus on form",
          type: "running",
          duration: 20,
          benefitDescription: "Active recovery and injury prevention"
        }
      ];
      
    case "weightlifting":
      return [
        {
          title: "Upper Body Focus",
          description: "Chest, back, and arms workout",
          type: "weightlifting",
          duration: 35,
          benefitDescription: "Build upper body strength and definition"
        },
        {
          title: "Lower Body Power",
          description: "Legs and glutes emphasis",
          type: "weightlifting",
          duration: 30,
          benefitDescription: "Develop lower body power and stability"
        },
        {
          title: "Full Body Circuit",
          description: "Complete circuit of compound exercises",
          type: "weightlifting",
          duration: 40,
          benefitDescription: "Total body conditioning and strength"
        }
      ];
      
    case "hiit":
      return [
        {
          title: "Tabata Intervals",
          description: "20 seconds work, 10 seconds rest",
          type: "hiit",
          duration: 15,
          benefitDescription: "Maximum intensity in minimal time"
        },
        {
          title: "Bodyweight HIIT",
          description: "No equipment needed circuit",
          type: "hiit",
          duration: 20,
          benefitDescription: "Full body workout anywhere"
        },
        {
          title: "EMOM Challenge",
          description: "Every Minute On the Minute workout",
          type: "hiit",
          duration: 25,
          benefitDescription: "Build work capacity and recovery"
        }
      ];
      
    case "stretch":
      return [
        {
          title: "Full Body Mobility",
          description: "Dynamic stretches for all major muscle groups",
          type: "stretch",
          duration: 15,
          benefitDescription: "Increase overall mobility and flexibility"
        },
        {
          title: "Recovery Stretches",
          description: "Post-workout stretching routine",
          type: "stretch",
          duration: 10,
          benefitDescription: "Enhance recovery and reduce soreness"
        },
        {
          title: "Posture Improvement",
          description: "Stretches targeting common tight areas",
          type: "stretch",
          duration: 12,
          benefitDescription: "Improve posture and reduce pain"
        }
      ];
      
    case "meditation":
      return [
        {
          title: "Mindful Breathing",
          description: "Focus on breath awareness",
          type: "meditation",
          duration: 10,
          benefitDescription: "Reduce stress and improve focus"
        },
        {
          title: "Body Scan",
          description: "Progressive relaxation technique",
          type: "meditation",
          duration: 15,
          benefitDescription: "Release tension and improve body awareness"
        },
        {
          title: "Guided Visualization",
          description: "Positive imagery meditation",
          type: "meditation",
          duration: 12,
          benefitDescription: "Boost mood and motivation"
        }
      ];
      
    default:
      return suggestions;
  }
};