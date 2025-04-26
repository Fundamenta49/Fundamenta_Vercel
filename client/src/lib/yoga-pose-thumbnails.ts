// Map yoga poses to specific YouTube video thumbnails and videos
// This creates consistent, high-quality images for each pose with real instructional videos

import { 
  YOGA_BEGINNER_VIDEOS,
  YOGA_INTERMEDIATE_VIDEOS,
  YOGA_ADVANCED_VIDEOS
} from './section-fallbacks';

// Interface for pose video mapping
interface PoseThumbnail {
  videoId: string;
  title: string;
  channelTitle?: string;
}

// Map pose IDs to specific YouTube video IDs and titles
// These are actual videos for each specific pose
export const POSE_THUMBNAILS: Record<string, PoseThumbnail> = {
  // Level 1 - Beginner poses
  'mountain': { 
    videoId: '2HTvZp5rPrg', 
    title: 'Mountain Pose | Tadasana',
    channelTitle: 'Yoga With Adriene'
  },
  'child': { 
    videoId: '2MJGg-dUKh0', 
    title: 'Child\'s Pose (Balasana)',
    channelTitle: 'Yoga With Adriene' 
  },
  'corpse': { 
    videoId: '1VYlOKUdylM', 
    title: 'Savasana (Corpse Pose)',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 2 - Beginner poses
  'downward_dog': { 
    videoId: 'j97SSGsnCAQ', 
    title: 'Downward Facing Dog (Adho Mukha Svanasana)',
    channelTitle: 'Yoga With Adriene' 
  },
  'cat_cow': { 
    videoId: 'kqnua4rHVVA', 
    title: 'Cat-Cow Pose (Marjaryasana-Bitilasana)', 
    channelTitle: 'Yoga With Adriene'
  },
  'forward_fold': { 
    videoId: 'goN4rWbQUn4', 
    title: 'Forward Fold | Uttanasana',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 3 - Intermediate poses
  'tree': { 
    videoId: 'Fr5kiIygm0c', 
    title: 'Tree Pose | Vrksasana',
    channelTitle: 'Yoga With Adriene' 
  },
  'warrior_1': { 
    videoId: 'kkGY3xBnaGc', 
    title: 'Warrior 1 Pose | Virabhadrasana I',
    channelTitle: 'Yoga With Adriene' 
  },
  'warrior_2': { 
    videoId: 'DoC5mh9GxF4', 
    title: 'Warrior 2 Pose | Virabhadrasana II',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 4 - Intermediate poses
  'triangle': { 
    videoId: 'IuwhGXTc2f0', 
    title: 'Triangle Pose | Trikonasana',
    channelTitle: 'Yoga With Adriene' 
  },
  'chair': { 
    videoId: '0FxWRAJht6k', 
    title: 'Chair Pose | Utkatasana',
    channelTitle: 'Yoga With Adriene' 
  },
  'bridge': { 
    videoId: 'NnbvPeAIhmA', 
    title: 'Bridge Pose (Setu Bandha Sarvangasana)',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 5 - Advanced poses
  'half_moon': { 
    videoId: 'M-8FvC3GD8c', 
    title: 'Half Moon Pose (Ardha Chandrasana)',
    channelTitle: 'Yoga With Adriene' 
  },
  'eagle': { 
    videoId: 'la7t8YJNJeY', 
    title: 'Eagle Pose | Garudasana',
    channelTitle: 'Yoga With Adriene' 
  },
  'pigeon': { 
    videoId: 'jkJwvzt12dA', 
    title: 'Pigeon Pose | Eka Pada Rajakapotasana',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 6 - Advanced poses
  'side_plank': { 
    videoId: '4h9qCFo-Uco', 
    title: 'Side Plank Pose | Vasisthasana',
    channelTitle: 'Yoga With Adriene' 
  },
  'crow': { 
    videoId: 'DgvjvwPGLPY', 
    title: 'Crow Pose (Bakasana)',
    channelTitle: 'Yoga With Adriene' 
  },
  'boat': { 
    videoId: 'QVEINjrYUPU', 
    title: 'Boat Pose | Navasana',
    channelTitle: 'Yoga With Adriene' 
  }
};

// Get the YouTube thumbnail URL for a pose
export const getYogaPoseThumbnail = (poseId: string): string => {
  // If the pose has a specific thumbnail defined, use it
  if (poseId in POSE_THUMBNAILS) {
    const { videoId } = POSE_THUMBNAILS[poseId];
    
    // Use more reliable thumbnail formats - standard quality 
    // This is more reliable than maxresdefault which might not be available for all videos
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  
  // Fallback based on difficulty level if no specific thumbnail defined
  const fallbackVideos = {
    'beginner': YOGA_BEGINNER_VIDEOS[0],
    'intermediate': YOGA_INTERMEDIATE_VIDEOS[0],
    'advanced': YOGA_ADVANCED_VIDEOS[0]
  };
  
  // Default to beginner thumbnail if we have no information
  return fallbackVideos.beginner.thumbnailUrl;
};

// Get YouTube video URL for a pose
export const getYogaPoseVideoUrl = (poseId: string): string | null => {
  if (poseId in POSE_THUMBNAILS) {
    const { videoId } = POSE_THUMBNAILS[poseId];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return null;
};

// Get video information for a pose (for optional additional details)
export const getYogaPoseVideoInfo = (poseId: string): { 
  thumbnailUrl: string;
  videoId: string;
  title: string;
  channelTitle?: string;
  videoUrl: string;
} | null => {
  // If the pose has a specific video defined, return its info
  if (poseId in POSE_THUMBNAILS) {
    const { videoId, title, channelTitle } = POSE_THUMBNAILS[poseId];
    return {
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      videoId,
      title,
      channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  }
  
  // Return null if no info found
  return null;
};