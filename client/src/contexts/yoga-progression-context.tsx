import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserYogaProgression, PoseAchievement, PROGRESSION_LEVELS } from '../../../shared/yoga-progression';
import { yogaPoses, getPoseById } from '../data/yoga-poses-progression';

interface YogaProgressionContextType {
  userProgress: UserYogaProgression;
  isLoading: boolean;
  earnXp: (amount: number) => void;
  updatePoseMastery: (poseId: string, score: number) => void;
  completeChallenge: (challengeId: string) => void;
  isPoseUnlocked: (poseId: string) => boolean;
  getProgressToNextLevel: () => number;
  getCurrentLevel: () => { level: number; title: string; };
  unlockPose: (poseId: string) => void;
}

// Default user progression
const defaultUserProgression: UserYogaProgression = {
  userId: "user1",
  currentLevel: 1,
  totalXp: 0,
  streakDays: 0,
  poseAchievements: {
    "mountain": { poseId: "mountain", masteryLevel: 0, attemptsCount: 0, bestScore: 0, unlocked: true },
    "child": { poseId: "child", masteryLevel: 0, attemptsCount: 0, bestScore: 0, unlocked: true },
    "corpse": { poseId: "corpse", masteryLevel: 0, attemptsCount: 0, bestScore: 0, unlocked: true },
  },
  completedChallenges: []
};

// Create the context
const YogaProgressionContext = createContext<YogaProgressionContextType | undefined>(undefined);

// Helper to convert mastery score to level (0-5 stars)
const scoreToMasteryLevel = (score: number): number => {
  if (score >= 95) return 5;
  if (score >= 85) return 4;
  if (score >= 75) return 3;
  if (score >= 65) return 2;
  if (score >= 50) return 1;
  return 0;
};

// Provider component
export function YogaProgressionProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserYogaProgression>(defaultUserProgression);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user progress from localStorage on initial mount
  useEffect(() => {
    const loadUserProgress = () => {
      try {
        const savedProgress = localStorage.getItem('yogaUserProgress');
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          
          // Convert date strings back to Date objects
          if (parsed.lastPracticeDate) {
            parsed.lastPracticeDate = new Date(parsed.lastPracticeDate);
          }
          
          // Convert any date strings in achievements
          Object.values(parsed.poseAchievements).forEach((achievement: any) => {
            if (achievement.lastPracticedAt) {
              achievement.lastPracticedAt = new Date(achievement.lastPracticedAt);
            }
          });
          
          setUserProgress(parsed);
        } else {
          // Initialize with starting poses unlocked
          const initialProgress = {...defaultUserProgression};
          const startingPoses = PROGRESSION_LEVELS.find(level => level.level === 1)?.unlocks || [];
          
          startingPoses.forEach(poseId => {
            initialProgress.poseAchievements[poseId] = { 
              poseId, 
              masteryLevel: 0, 
              attemptsCount: 0, 
              bestScore: 0, 
              unlocked: true 
            };
          });
          
          setUserProgress(initialProgress);
          localStorage.setItem('yogaUserProgress', JSON.stringify(initialProgress));
        }
      } catch (error) {
        console.error('Error loading yoga progression:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProgress();
  }, []);
  
  // Save to localStorage whenever userProgress changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('yogaUserProgress', JSON.stringify(userProgress));
    }
  }, [userProgress, isLoading]);
  
  // Function to earn XP and possibly level up
  const earnXp = (amount: number) => {
    setUserProgress(prev => {
      const newTotalXp = prev.totalXp + amount;
      
      // Check if user should level up
      let newLevel = prev.currentLevel;
      while (newLevel < PROGRESSION_LEVELS.length && 
             newTotalXp >= PROGRESSION_LEVELS.find(l => l.level === newLevel + 1)?.xpRequired!) {
        newLevel++;
      }
      
      const updatedProgress = {
        ...prev,
        totalXp: newTotalXp,
        currentLevel: newLevel
      };
      
      // If leveled up, unlock new poses
      if (newLevel > prev.currentLevel) {
        const newPoseIds = PROGRESSION_LEVELS.find(l => l.level === newLevel)?.unlocks || [];
        
        const updatedAchievements = {...prev.poseAchievements};
        newPoseIds.forEach(poseId => {
          if (!updatedAchievements[poseId]) {
            updatedAchievements[poseId] = {
              poseId,
              masteryLevel: 0,
              attemptsCount: 0,
              bestScore: 0,
              unlocked: true
            };
          } else {
            updatedAchievements[poseId].unlocked = true;
          }
        });
        
        updatedProgress.poseAchievements = updatedAchievements;
      }
      
      return updatedProgress;
    });
  };
  
  // Function to update pose mastery after practice
  const updatePoseMastery = (poseId: string, score: number) => {
    setUserProgress(prev => {
      const pose = getPoseById(poseId);
      if (!pose) return prev;
      
      const existingAchievement = prev.poseAchievements[poseId];
      const masteryLevel = scoreToMasteryLevel(score);
      
      const updatedAchievement: PoseAchievement = {
        poseId,
        masteryLevel: Math.max(existingAchievement?.masteryLevel || 0, masteryLevel),
        attemptsCount: (existingAchievement?.attemptsCount || 0) + 1,
        lastPracticedAt: new Date(),
        bestScore: Math.max(existingAchievement?.bestScore || 0, score),
        unlocked: true
      };
      
      // Award XP if mastery level improved
      let xpEarned = 0;
      if (!existingAchievement || masteryLevel > existingAchievement.masteryLevel) {
        xpEarned = pose.xpValue * (masteryLevel - (existingAchievement?.masteryLevel || 0));
      }
      
      const updatedProgress = {
        ...prev,
        totalXp: prev.totalXp + xpEarned,
        lastPracticeDate: new Date(),
        poseAchievements: {
          ...prev.poseAchievements,
          [poseId]: updatedAchievement
        }
      };
      
      // Update streak
      if (!prev.lastPracticeDate) {
        updatedProgress.streakDays = 1;
      } else {
        const lastPracticeDate = new Date(prev.lastPracticeDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastPracticeDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          // Same day, no streak change
          updatedProgress.streakDays = prev.streakDays;
        } else if (diffDays === 1) {
          // Consecutive day, increase streak
          updatedProgress.streakDays = prev.streakDays + 1;
        } else {
          // Gap in practice, reset streak
          updatedProgress.streakDays = 1;
        }
      }
      
      return updatedProgress;
    });
  };
  
  // Function to complete a challenge
  const completeChallenge = (challengeId: string) => {
    setUserProgress(prev => {
      if (prev.completedChallenges.includes(challengeId)) {
        return prev; // Already completed
      }
      
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId]
      };
    });
  };
  
  // Function to check if a pose is unlocked
  const isPoseUnlocked = (poseId: string): boolean => {
    const pose = getPoseById(poseId);
    if (!pose) return false;
    
    // Check level requirement
    if (userProgress.currentLevel < pose.levelRequired) {
      return false;
    }
    
    // Check if explicitly unlocked in user achievements
    const achievement = userProgress.poseAchievements[poseId];
    if (achievement?.unlocked) {
      return true;
    }
    
    // Check prerequisites
    if (pose.prerequisites && pose.prerequisites.length > 0) {
      for (const prereqId of pose.prerequisites) {
        const prereqAchievement = userProgress.poseAchievements[prereqId];
        if (!prereqAchievement || prereqAchievement.masteryLevel < 3) {
          return false;
        }
      }
    }
    
    // If no specific unlock checks, default to level-based unlocking
    return true;
  };
  
  // Function to manually unlock a pose
  const unlockPose = (poseId: string) => {
    setUserProgress(prev => {
      const existingAchievement = prev.poseAchievements[poseId];
      
      return {
        ...prev,
        poseAchievements: {
          ...prev.poseAchievements,
          [poseId]: {
            ...(existingAchievement || { 
              poseId, 
              masteryLevel: 0, 
              attemptsCount: 0, 
              bestScore: 0
            }),
            unlocked: true
          }
        }
      };
    });
  };
  
  // Function to get progress percentage to next level
  const getProgressToNextLevel = (): number => {
    const currentLevelXp = PROGRESSION_LEVELS.find(
      level => level.level === userProgress.currentLevel
    )?.xpRequired || 0;
    
    const nextLevelXp = PROGRESSION_LEVELS.find(
      level => level.level === userProgress.currentLevel + 1
    )?.xpRequired || currentLevelXp;
    
    const xpNeeded = nextLevelXp - currentLevelXp;
    const xpProgress = userProgress.totalXp - currentLevelXp;
    
    return Math.floor((xpProgress / xpNeeded) * 100);
  };
  
  // Function to get current level details
  const getCurrentLevel = () => {
    const levelDetails = PROGRESSION_LEVELS.find(
      level => level.level === userProgress.currentLevel
    );
    
    return {
      level: userProgress.currentLevel,
      title: levelDetails?.title || 'Yoga Practitioner'
    };
  };
  
  const contextValue: YogaProgressionContextType = {
    userProgress,
    isLoading,
    earnXp,
    updatePoseMastery,
    completeChallenge,
    isPoseUnlocked,
    getProgressToNextLevel,
    getCurrentLevel,
    unlockPose
  };
  
  return (
    <YogaProgressionContext.Provider value={contextValue}>
      {children}
    </YogaProgressionContext.Provider>
  );
}

// Custom hook to use the yoga progression context
export function useYogaProgression() {
  const context = useContext(YogaProgressionContext);
  if (context === undefined) {
    throw new Error('useYogaProgression must be used within a YogaProgressionProvider');
  }
  return context;
}