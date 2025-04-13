import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the difficulty levels
export type PoseDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Define the status of each pose
export type PoseStatus = 'locked' | 'unlocked' | 'completed';

// Structure for individual pose progression tracking
export interface PoseProgress {
  id: string;
  name: string;
  difficulty: PoseDifficulty;
  status: PoseStatus;
  completionAccuracy?: number;
  completionDate?: string;
}

// Context state interface
interface YogaProgressionState {
  poses: PoseProgress[];
  currentLevel: PoseDifficulty;
  totalCompleted: number;
  updatePoseStatus: (poseId: string, status: PoseStatus, accuracy?: number) => void;
  getPoseById: (poseId: string) => PoseProgress | undefined;
  unlockNextLevelPoses: () => void;
}

// Initial pose data
const initialPoses: PoseProgress[] = [
  // Beginner poses (unlocked by default)
  { id: 'downwardDog', name: 'Downward Dog', difficulty: 'beginner', status: 'unlocked' },
  { id: 'warriorII', name: 'Warrior II', difficulty: 'beginner', status: 'unlocked' },
  { id: 'treePose', name: 'Tree Pose', difficulty: 'beginner', status: 'unlocked' },
  { id: 'childsPose', name: 'Child\'s Pose', difficulty: 'beginner', status: 'unlocked' },
  
  // Intermediate poses (locked initially)
  { id: 'cobrasPose', name: 'Cobra Pose', difficulty: 'intermediate', status: 'locked' },
  { id: 'warriorI', name: 'Warrior I', difficulty: 'intermediate', status: 'locked' },
  { id: 'trianglePose', name: 'Triangle Pose', difficulty: 'intermediate', status: 'locked' },
  { id: 'halveMoonPose', name: 'Half Moon Pose', difficulty: 'intermediate', status: 'locked' },
  
  // Advanced poses (locked initially)
  { id: 'bridgePose', name: 'Bridge Pose', difficulty: 'advanced', status: 'locked' },
  { id: 'crowPose', name: 'Crow Pose', difficulty: 'advanced', status: 'locked' },
  { id: 'headstand', name: 'Headstand', difficulty: 'advanced', status: 'locked' },
  { id: 'kingPigeonPose', name: 'King Pigeon Pose', difficulty: 'advanced', status: 'locked' },
];

// Create the context with default values
const YogaProgressionContext = createContext<YogaProgressionState>({
  poses: initialPoses,
  currentLevel: 'beginner',
  totalCompleted: 0,
  updatePoseStatus: () => {},
  getPoseById: () => undefined,
  unlockNextLevelPoses: () => {},
});

// Storage key for persisting progress
const STORAGE_KEY = 'yoga_progression_data';

export const YogaProgressionProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // State for tracking pose progression
  const [poses, setPoses] = useState<PoseProgress[]>(() => {
    // Try to load from localStorage if available
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.error('Failed to parse yoga progression data');
        }
      }
    }
    return initialPoses;
  });
  
  const [currentLevel, setCurrentLevel] = useState<PoseDifficulty>('beginner');
  const [totalCompleted, setTotalCompleted] = useState(0);
  
  // Calculate total completed and current level when poses change
  useEffect(() => {
    const completed = poses.filter(pose => pose.status === 'completed').length;
    setTotalCompleted(completed);
    
    // Determine current level based on completed poses
    const beginnerPoses = poses.filter(p => p.difficulty === 'beginner');
    const intermediatePoses = poses.filter(p => p.difficulty === 'intermediate');
    
    const beginnerCompleted = beginnerPoses.filter(p => p.status === 'completed').length;
    const intermediateCompleted = intermediatePoses.filter(p => p.status === 'completed').length;
    
    if (intermediateCompleted >= intermediatePoses.length / 2) {
      setCurrentLevel('advanced');
    } else if (beginnerCompleted >= beginnerPoses.length / 2) {
      setCurrentLevel('intermediate');
    } else {
      setCurrentLevel('beginner');
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(poses));
    }
  }, [poses]);
  
  // Function to update pose status
  const updatePoseStatus = (poseId: string, status: PoseStatus, accuracy?: number) => {
    setPoses(prev => 
      prev.map(pose => 
        pose.id === poseId 
          ? { 
              ...pose, 
              status, 
              completionAccuracy: accuracy ?? pose.completionAccuracy,
              completionDate: status === 'completed' ? new Date().toISOString() : pose.completionDate
            } 
          : pose
      )
    );
    
    // If a pose is completed, check if we should unlock next level
    if (status === 'completed') {
      const updatedPoses = poses.map(p => p.id === poseId ? {...p, status} : p);
      const beginnerPoses = updatedPoses.filter(p => p.difficulty === 'beginner');
      const intermediatePoses = updatedPoses.filter(p => p.difficulty === 'intermediate');
      
      const beginnerCompleted = beginnerPoses.filter(p => p.status === 'completed').length;
      const intermediateCompleted = intermediatePoses.filter(p => p.status === 'completed').length;
      
      // Auto-unlock next level poses if enough poses are completed
      if (beginnerCompleted >= Math.ceil(beginnerPoses.length / 2) && currentLevel === 'beginner') {
        unlockPosesOfLevel('intermediate');
      } else if (intermediateCompleted >= Math.ceil(intermediatePoses.length / 2) && currentLevel === 'intermediate') {
        unlockPosesOfLevel('advanced');
      }
    }
  };
  
  // Function to get pose by ID
  const getPoseById = (poseId: string): PoseProgress | undefined => {
    return poses.find(pose => pose.id === poseId);
  };
  
  // Function to unlock all poses of a certain level
  const unlockPosesOfLevel = (level: PoseDifficulty) => {
    setPoses(prev => 
      prev.map(pose => 
        pose.difficulty === level && pose.status === 'locked'
          ? { ...pose, status: 'unlocked' }
          : pose
      )
    );
  };
  
  // Function to manually unlock next level poses
  const unlockNextLevelPoses = () => {
    if (currentLevel === 'beginner') {
      unlockPosesOfLevel('intermediate');
    } else if (currentLevel === 'intermediate') {
      unlockPosesOfLevel('advanced');
    }
  };
  
  // Context value
  const value = {
    poses,
    currentLevel,
    totalCompleted,
    updatePoseStatus,
    getPoseById,
    unlockNextLevelPoses
  };
  
  return (
    <YogaProgressionContext.Provider value={value}>
      {children}
    </YogaProgressionContext.Provider>
  );
};

// Hook for accessing yoga progression context
export const useYogaProgression = () => useContext(YogaProgressionContext);