// Map yoga poses to YouTube video thumbnails
// This creates consistent, high-quality images for each pose

import { 
  YOGA_BEGINNER_VIDEOS,
  YOGA_INTERMEDIATE_VIDEOS,
  YOGA_ADVANCED_VIDEOS
} from './section-fallbacks';

// Interface for thumbnail mapping
interface PoseThumbnail {
  videoId: string;
  title: string;
  channelTitle?: string;
}

// Map pose IDs to specific YouTube video IDs and titles
export const POSE_THUMBNAILS: Record<string, PoseThumbnail> = {
  // Level 1 - Beginner poses
  'mountain': { 
    videoId: 'v7AYKMP6rOE', 
    title: 'Mountain Pose Tutorial',
    channelTitle: 'Yoga With Adriene'
  },
  'child': { 
    videoId: 'o8QGzKcLqYA', 
    title: 'Child\'s Pose Tutorial',
    channelTitle: 'Yoga With Bird' 
  },
  'corpse': { 
    videoId: '5v1wt-EIgww', 
    title: 'Corpse Pose Tutorial',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 2 - Beginner poses
  'downward_dog': { 
    videoId: 'pWobp-pXBlU', 
    title: 'Downward Dog Tutorial',
    channelTitle: 'Yoga With Tim' 
  },
  'cat_cow': { 
    videoId: 'v7AYKMP6rOE', 
    title: 'Cat-Cow Flow', 
    channelTitle: 'Yoga With Adriene'
  },
  'forward_fold': { 
    videoId: '5v1wt-EIgww', 
    title: 'Forward Fold Practice',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 3 - Intermediate poses
  'tree': { 
    videoId: 'b1H3xO3x_Js', 
    title: 'Tree Pose Tutorial',
    channelTitle: 'Yoga With Kassandra' 
  },
  'warrior_1': { 
    videoId: 'oBu-pQG6sTY', 
    title: 'Warrior I Tutorial',
    channelTitle: 'Yoga By Candace' 
  },
  'warrior_2': { 
    videoId: 'klmBssEYkdU', 
    title: 'Warrior II Practice',
    channelTitle: 'Yoga With Adriene' 
  },
  
  // Level 4 - Intermediate poses
  'triangle': { 
    videoId: '9kOCY0KNByw', 
    title: 'Triangle Pose Tutorial',
    channelTitle: 'Five Parks Yoga' 
  },
  'chair': { 
    videoId: 'b1H3xO3x_Js', 
    title: 'Chair Pose Practice',
    channelTitle: 'Yoga With Kassandra' 
  },
  'bridge': { 
    videoId: 'oBu-pQG6sTY', 
    title: 'Bridge Pose Tutorial',
    channelTitle: 'Yoga By Candace' 
  },
  
  // Level 5 - Advanced poses
  'half_moon': { 
    videoId: '35xLJCs4Mew', 
    title: 'Half Moon Pose Tutorial',
    channelTitle: 'Yoga With Tim' 
  },
  'eagle': { 
    videoId: '5N_eLsBxYJU', 
    title: 'Eagle Pose Practice',
    channelTitle: 'Patrick Beach' 
  },
  'pigeon': { 
    videoId: 'BtIYV1fwHbU', 
    title: 'Pigeon Pose Tutorial',
    channelTitle: 'Kino Yoga' 
  },
  
  // Level 6 - Advanced poses
  'side_plank': { 
    videoId: '4oLy03OLFRs', 
    title: 'Side Plank Practice',
    channelTitle: 'Yoga With Kassandra' 
  },
  'crow': { 
    videoId: '35xLJCs4Mew', 
    title: 'Crow Pose Tutorial',
    channelTitle: 'Yoga With Tim' 
  },
  'boat': { 
    videoId: '5N_eLsBxYJU', 
    title: 'Boat Pose Tutorial',
    channelTitle: 'Patrick Beach' 
  }
};

// Get the YouTube thumbnail URL for a pose
export const getYogaPoseThumbnail = (poseId: string): string => {
  // If the pose has a specific thumbnail defined, use it
  if (poseId in POSE_THUMBNAILS) {
    const { videoId } = POSE_THUMBNAILS[poseId];
    // YouTube thumbnail format
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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

// Get video information for a pose (for optional additional details)
export const getYogaPoseVideoInfo = (poseId: string): { 
  thumbnailUrl: string;
  videoId: string;
  title: string;
  channelTitle?: string;
} | null => {
  // If the pose has a specific video defined, return its info
  if (poseId in POSE_THUMBNAILS) {
    const { videoId, title, channelTitle } = POSE_THUMBNAILS[poseId];
    return {
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoId,
      title,
      channelTitle
    };
  }
  
  // Return null if no info found
  return null;
};