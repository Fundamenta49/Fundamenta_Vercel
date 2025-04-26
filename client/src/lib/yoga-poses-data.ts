import { YogaPoseProgression } from "../../../shared/yoga-progression";
import updatedPoses from '../data/updated_poses.json';

// Map for quick access to pose data by ID
const poseMap = new Map(updatedPoses.map(pose => [pose.id, pose]));

// Utility function to ensure poses have all required fields
export const getYogaPoseWithDefaults = (poseData: any): YogaPoseProgression => {
  // Try to get additional pose info from the updated poses data
  const updatedPoseInfo = poseMap.get(poseData.id);
  
  // Extract Sanskrit name if present in the format "Name (SanskritName)"
  let extractedSanskritName = "";
  if (updatedPoseInfo && updatedPoseInfo.name) {
    const match = updatedPoseInfo.name.match(/\((.*?)\)/);
    if (match && match[1]) {
      extractedSanskritName = match[1];
    }
  }
  
  // Ensure pose has required fields with defaults if missing
  return {
    id: poseData.id || "",
    name: (updatedPoseInfo ? updatedPoseInfo.name.split('(')[0].trim() : poseData.name) || "Unknown Pose",
    sanskritName: poseData.sanskritName || extractedSanskritName || "",
    description: poseData.description || "No description available.",
    benefits: poseData.benefits || ["Improves flexibility", "Builds strength"],
    difficulty: poseData.difficulty || "beginner",
    category: poseData.category || "standing",
    xpValue: poseData.xpValue || 10,
    prerequisites: poseData.prerequisites || [],
    imageUrl: poseData.imageUrl || `/images/yoga-poses/${poseData.id}.png`,
    videoUrl: poseData.videoUrl,
    levelRequired: poseData.levelRequired || 1,
    challengeId: poseData.challengeId
  };
};

// Format a pose name from id
export const formatPoseName = (poseId: string): string => {
  if (!poseId) return "Unknown Pose";
  
  // Convert snake_case to Title Case
  return poseId
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Format a sanskrit name with translation
export const formatSanskritName = (name: string, sanskritName: string): string => {
  if (!sanskritName) return "";
  
  // If we have both, format as "Sanskrit (Translation)"
  if (name && sanskritName) {
    return `${sanskritName} (${name})`;
  }
  
  return sanskritName;
};

// Get a descriptive string for difficulty level
export const getDifficultyLabel = (level: number): string => {
  switch (level) {
    case 1: return "Beginner";
    case 2: return "Beginner+";
    case 3: return "Intermediate";
    case 4: return "Intermediate+";
    case 5: return "Advanced";
    case 6: return "Expert";
    default: return "Beginner";
  }
};