// This file contains category-specific fallbacks for YouTube videos
// when the API is unavailable due to quota limits

import { YouTubeVideo } from './youtube-service';

// Fallback videos for specific Yoga categories
export const YOGA_FALLBACKS: {[key: string]: YouTubeVideo[]} = {
  'beginner': [
    {
      id: "v7AYKMP6rOE",
      title: "Yoga For Complete Beginners - 20 Minute Home Yoga Workout",
      description: "Beginner friendly yoga class with foundational poses and breathing techniques",
      thumbnailUrl: "https://img.youtube.com/vi/v7AYKMP6rOE/maxresdefault.jpg",
      channelTitle: "Yoga With Adriene",
      publishedAt: "2019-04-30T00:00:00Z"
    },
    {
      id: "o8QGzKcLqYA",
      title: "Gentle Yoga for Beginners - Relaxation and Stress Relief",
      description: "Easy yoga poses perfect for stress management and relaxation",
      thumbnailUrl: "https://img.youtube.com/vi/o8QGzKcLqYA/maxresdefault.jpg",
      channelTitle: "Yoga With Bird",
      publishedAt: "2020-05-10T00:00:00Z"
    },
    {
      id: "5v1wt-EIgww",
      title: "Sun Salutation Practice - Step-by-Step Tutorial",
      description: "Learn the proper form and sequence of Sun Salutation A and B",
      thumbnailUrl: "https://img.youtube.com/vi/5v1wt-EIgww/maxresdefault.jpg",
      channelTitle: "Yoga With Adriene",
      publishedAt: "2018-12-08T00:00:00Z"
    },
    {
      id: "pWobp-pXBlU",
      title: "Beginner Yoga Flow - Basic Poses for Beginners",
      description: "Learn the fundamentals of yoga with this beginner-friendly flow",
      thumbnailUrl: "https://img.youtube.com/vi/pWobp-pXBlU/maxresdefault.jpg",
      channelTitle: "Yoga With Tim",
      publishedAt: "2019-01-15T00:00:00Z"
    }
  ],
  'intermediate': [
    {
      id: "b1H3xO3x_Js",
      title: "Yoga Flow for Strength and Flexibility",
      description: "Intermediate vinyasa yoga sequence to build strength and improve flexibility",
      thumbnailUrl: "https://img.youtube.com/vi/b1H3xO3x_Js/maxresdefault.jpg",
      channelTitle: "Yoga With Kassandra",
      publishedAt: "2020-02-18T00:00:00Z"
    },
    {
      id: "oBu-pQG6sTY",
      title: "30-Minute Power Yoga Flow - Intermediate Practice",
      description: "Energizing yoga flow that builds strength and balance",
      thumbnailUrl: "https://img.youtube.com/vi/oBu-pQG6sTY/maxresdefault.jpg",
      channelTitle: "Yoga By Candace",
      publishedAt: "2019-08-22T00:00:00Z"
    },
    {
      id: "klmBssEYkdU",
      title: "Intermediate Vinyasa Yoga - Full Body Flow",
      description: "Dynamic yoga sequence linking breath with movement",
      thumbnailUrl: "https://img.youtube.com/vi/klmBssEYkdU/maxresdefault.jpg",
      channelTitle: "Yoga With Adriene",
      publishedAt: "2020-03-10T00:00:00Z"
    },
    {
      id: "9kOCY0KNByw",
      title: "Yoga for Core Strength - Intermediate Practice",
      description: "Build core strength and stability with this focused yoga practice",
      thumbnailUrl: "https://img.youtube.com/vi/9kOCY0KNByw/maxresdefault.jpg",
      channelTitle: "Five Parks Yoga",
      publishedAt: "2019-11-05T00:00:00Z"
    }
  ],
  'advanced': [
    {
      id: "35xLJCs4Mew",
      title: "Advanced Yoga Flow - Challenging Sequences",
      description: "Take your practice to the next level with these advanced poses and transitions",
      thumbnailUrl: "https://img.youtube.com/vi/35xLJCs4Mew/maxresdefault.jpg",
      channelTitle: "Yoga With Tim",
      publishedAt: "2019-12-12T00:00:00Z"
    },
    {
      id: "5N_eLsBxYJU",
      title: "Advanced Arm Balance Practice - Yoga Tutorial",
      description: "Master challenging arm balances with detailed instruction",
      thumbnailUrl: "https://img.youtube.com/vi/5N_eLsBxYJU/maxresdefault.jpg",
      channelTitle: "Patrick Beach",
      publishedAt: "2020-01-30T00:00:00Z"
    },
    {
      id: "BtIYV1fwHbU",
      title: "Advanced Yoga - Inversions and Handstands",
      description: "Develop your inversion practice with these advanced techniques",
      thumbnailUrl: "https://img.youtube.com/vi/BtIYV1fwHbU/maxresdefault.jpg",
      channelTitle: "Kino Yoga",
      publishedAt: "2019-09-18T00:00:00Z"
    },
    {
      id: "4oLy03OLFRs",
      title: "Advanced Vinyasa Flow - Power Yoga",
      description: "Intense advanced yoga sequence with challenging transitions",
      thumbnailUrl: "https://img.youtube.com/vi/4oLy03OLFRs/maxresdefault.jpg",
      channelTitle: "Yoga With Kassandra",
      publishedAt: "2020-02-05T00:00:00Z"
    }
  ]
};

// Fallback videos for specific Stretch categories
export const STRETCH_FALLBACKS: {[key: string]: YouTubeVideo[]} = {
  'dynamic': [
    {
      id: "3Tz6_T_MPmU",
      title: "Dynamic Stretching Routine - Pre-Workout Warm-Up",
      description: "Active stretches to prepare your body for exercise",
      thumbnailUrl: "https://img.youtube.com/vi/3Tz6_T_MPmU/maxresdefault.jpg",
      channelTitle: "FitnessBlender",
      publishedAt: "2019-05-18T00:00:00Z"
    },
    {
      id: "nPHMf9HBv5Q",
      title: "Dynamic Stretching for Athletes - Warm-Up Routine",
      description: "Dynamic mobility exercises to improve performance and prevent injury",
      thumbnailUrl: "https://img.youtube.com/vi/nPHMf9HBv5Q/maxresdefault.jpg",
      channelTitle: "The Run Experience",
      publishedAt: "2020-01-25T00:00:00Z"
    },
    {
      id: "cdU2yf8WeBU",
      title: "Full Body Dynamic Stretching - Active Mobility",
      description: "Activate your muscles and joints with this dynamic routine",
      thumbnailUrl: "https://img.youtube.com/vi/cdU2yf8WeBU/maxresdefault.jpg",
      channelTitle: "MadFit",
      publishedAt: "2019-08-10T00:00:00Z"
    },
    {
      id: "vhLbp8ibmEE", 
      title: "10-Minute Dynamic Warm-Up Routine",
      description: "Quick dynamic stretches to prepare for any workout",
      thumbnailUrl: "https://img.youtube.com/vi/vhLbp8ibmEE/maxresdefault.jpg",
      channelTitle: "SELF",
      publishedAt: "2020-02-08T00:00:00Z"
    }
  ],
  'static': [
    {
      id: "sTxC3J3gQEU",
      title: "Full Body Flexibility Routine - 15 Minutes",
      description: "Follow along stretching routine for whole body mobility",
      thumbnailUrl: "https://img.youtube.com/vi/sTxC3J3gQEU/maxresdefault.jpg",
      channelTitle: "MadFit",
      publishedAt: "2020-04-18T00:00:00Z"
    },
    {
      id: "g_tea8ZNk5A",
      title: "Hamstring Stretches for Tight Hamstrings",
      description: "Increase flexibility in your hamstrings with these stretches",
      thumbnailUrl: "https://img.youtube.com/vi/g_tea8ZNk5A/maxresdefault.jpg",
      channelTitle: "Tom Merrick",
      publishedAt: "2019-02-15T00:00:00Z"
    },
    {
      id: "Xv-HzbKAdII",
      title: "Static Stretching for Full Body Flexibility",
      description: "Hold these stretches to improve overall range of motion",
      thumbnailUrl: "https://img.youtube.com/vi/Xv-HzbKAdII/maxresdefault.jpg",
      channelTitle: "FitnessBlender",
      publishedAt: "2019-10-10T00:00:00Z"
    },
    {
      id: "8LI3Y1X9NvU",
      title: "Full Split Stretching Routine - Flexibility Training",
      description: "Deep static stretches to improve your splits and overall flexibility",
      thumbnailUrl: "https://img.youtube.com/vi/8LI3Y1X9NvU/maxresdefault.jpg",
      channelTitle: "Flexibility Exercises",
      publishedAt: "2019-03-22T00:00:00Z"
    }
  ],
  'recovery': [
    {
      id: "L_xrDAtykMI",
      title: "Post-Workout Stretching Routine",
      description: "Cool down properly with this post-workout stretching sequence",
      thumbnailUrl: "https://img.youtube.com/vi/L_xrDAtykMI/maxresdefault.jpg",
      channelTitle: "FitnessBlender",
      publishedAt: "2018-06-20T00:00:00Z"
    },
    {
      id: "qULTwquOuT4",
      title: "Morning Stretching Routine - Wake Up and Stretch",
      description: "Start your day with this energizing stretching sequence",
      thumbnailUrl: "https://img.youtube.com/vi/qULTwquOuT4/maxresdefault.jpg",
      channelTitle: "Yoga With Adriene",
      publishedAt: "2019-08-10T00:00:00Z"
    },
    {
      id: "7h_Pn7NyJ0k",
      title: "Recovery Stretches for Sore Muscles",
      description: "Gentle stretches to relieve muscle soreness and promote recovery",
      thumbnailUrl: "https://img.youtube.com/vi/7h_Pn7NyJ0k/maxresdefault.jpg",
      channelTitle: "MadFit",
      publishedAt: "2020-03-05T00:00:00Z"
    },
    {
      id: "kFBBNnGs7Xw",
      title: "Relaxing Evening Stretch Routine - Before Bed Stretches",
      description: "Calm your body and mind with this relaxing stretching sequence",
      thumbnailUrl: "https://img.youtube.com/vi/kFBBNnGs7Xw/maxresdefault.jpg",
      channelTitle: "Yoga With Bird",
      publishedAt: "2020-01-12T00:00:00Z"
    }
  ]
};

// Modified implementation for getting section-specific exercise videos
// This handles the case where YouTube API quota is exceeded
export const getCategorySpecificExerciseVideos = (
  workoutSection: 'yoga' | 'stretch',
  category?: string
): YouTubeVideo[] => {
  // Map categories to their respective fallbacks
  if (workoutSection === 'yoga' && category) {
    return YOGA_FALLBACKS[category] || [];
  }
  
  if (workoutSection === 'stretch' && category) {
    return STRETCH_FALLBACKS[category] || [];
  }
  
  // If no specific category or no fallbacks available, return empty array
  return [];
};