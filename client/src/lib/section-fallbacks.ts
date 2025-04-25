// Direct implementation of category-specific fallback videos for when YouTube API is unavailable

import { YouTubeVideo } from './youtube-service';

// Default videos for each category to ensure they're different across sections
// These are only used when the YouTube API fails due to quota limits

// YOGA - BEGINNER VIDEOS
export const YOGA_BEGINNER_VIDEOS: YouTubeVideo[] = [
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
];

// YOGA - INTERMEDIATE VIDEOS
export const YOGA_INTERMEDIATE_VIDEOS: YouTubeVideo[] = [
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
];

// YOGA - ADVANCED VIDEOS
export const YOGA_ADVANCED_VIDEOS: YouTubeVideo[] = [
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
];

// STRETCH - DYNAMIC VIDEOS
export const STRETCH_DYNAMIC_VIDEOS: YouTubeVideo[] = [
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
];

// STRETCH - STATIC VIDEOS
export const STRETCH_STATIC_VIDEOS: YouTubeVideo[] = [
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
];

// STRETCH - RECOVERY VIDEOS
export const STRETCH_RECOVERY_VIDEOS: YouTubeVideo[] = [
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
];

// HIIT VIDEOS - GENERAL
export const HIIT_VIDEOS: YouTubeVideo[] = [
  {
    id: "ml6cT4AZdqI",
    title: "30-Minute HIIT Workout - No Equipment",
    description: "Full body HIIT workout that's apartment-friendly with no equipment required.",
    thumbnailUrl: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
    channelTitle: "SELF",
    publishedAt: "2020-03-15T00:00:00Z"
  },
  {
    id: "50kH47ZFHrs",
    title: "20-Minute HIIT Cardio Workout - No Equipment",
    description: "Burn calories with this high intensity interval training session",
    thumbnailUrl: "https://img.youtube.com/vi/50kH47ZFHrs/maxresdefault.jpg",
    channelTitle: "FitnessBlender",
    publishedAt: "2019-11-27T00:00:00Z"
  },
  {
    id: "TkaYafQ-XC4",
    title: "HIIT Workout for Fat Loss - 15 Minutes",
    description: "High intensity bodyweight exercises to boost metabolism",
    thumbnailUrl: "https://img.youtube.com/vi/TkaYafQ-XC4/maxresdefault.jpg",
    channelTitle: "MadFit",
    publishedAt: "2020-01-03T00:00:00Z"
  },
  {
    id: "OWoSE0WK4eE",
    title: "Tabata Workout - 4-Minute Intervals",
    description: "High intensity Tabata intervals for maximum effort training",
    thumbnailUrl: "https://img.youtube.com/vi/OWoSE0WK4eE/maxresdefault.jpg",
    channelTitle: "Heather Robertson",
    publishedAt: "2019-05-25T00:00:00Z"
  }
];

// HIIT VIDEOS - TABATA
export const HIIT_TABATA_VIDEOS: YouTubeVideo[] = [
  {
    id: "XIeCMhNWFQQ",
    title: "Tabata Workout - Jump Squats and Burpees",
    description: "20 seconds on, 10 seconds rest - classic Tabata jump squats and burpees",
    thumbnailUrl: "https://img.youtube.com/vi/XIeCMhNWFQQ/maxresdefault.jpg",
    channelTitle: "FitnessBlender",
    publishedAt: "2019-06-15T00:00:00Z"
  },
  {
    id: "mmq1RgbOe0g",
    title: "20-Minute Tabata Workout - Mountain Climbers & Push-ups",
    description: "High intensity Tabata workout focusing on mountain climbers and push-ups",
    thumbnailUrl: "https://img.youtube.com/vi/mmq1RgbOe0g/maxresdefault.jpg",
    channelTitle: "SELF",
    publishedAt: "2020-04-22T00:00:00Z"
  },
  {
    id: "2KY7ggzB8iE",
    title: "High Knees & Plank to Shoulder Tap Tabata",
    description: "Tabata protocol with high knees and plank to shoulder tap exercises",
    thumbnailUrl: "https://img.youtube.com/vi/2KY7ggzB8iE/maxresdefault.jpg",
    channelTitle: "Heather Robertson",
    publishedAt: "2019-10-05T00:00:00Z"
  },
  {
    id: "aUYRVSNz4lU",
    title: "Complete Tabata Workout - 8 Rounds of 20/10",
    description: "Full Tabata session with all essential exercises for maximum effectiveness",
    thumbnailUrl: "https://img.youtube.com/vi/aUYRVSNz4lU/maxresdefault.jpg",
    channelTitle: "MadFit",
    publishedAt: "2020-01-10T00:00:00Z"
  }
];

// HIIT VIDEOS - AMRAP
export const HIIT_AMRAP_VIDEOS: YouTubeVideo[] = [
  {
    id: "kwkXyHjgoDM",
    title: "AMRAP Workout - As Many Rounds As Possible",
    description: "High intensity AMRAP challenge with bodyweight exercises",
    thumbnailUrl: "https://img.youtube.com/vi/kwkXyHjgoDM/maxresdefault.jpg",
    channelTitle: "FitnessBlender",
    publishedAt: "2019-08-22T00:00:00Z"
  },
  {
    id: "pYcz8RtZXpg",
    title: "15-Minute AMRAP - Full Body Conditioning",
    description: "Complete as many rounds as possible in this 15-minute challenge",
    thumbnailUrl: "https://img.youtube.com/vi/pYcz8RtZXpg/maxresdefault.jpg",
    channelTitle: "MadFit",
    publishedAt: "2020-03-12T00:00:00Z"
  },
  {
    id: "H2YIMe3pKKU",
    title: "CrossFit-Style AMRAP Workout",
    description: "Push your limits with this challenging AMRAP workout",
    thumbnailUrl: "https://img.youtube.com/vi/H2YIMe3pKKU/maxresdefault.jpg",
    channelTitle: "Heather Robertson",
    publishedAt: "2019-11-18T00:00:00Z"
  },
  {
    id: "Mvo2snJGhtM",
    title: "AMRAP Bodyweight Workout - No Equipment",
    description: "Home workout using just your bodyweight in AMRAP format",
    thumbnailUrl: "https://img.youtube.com/vi/Mvo2snJGhtM/maxresdefault.jpg",
    channelTitle: "Bodyweight Warrior",
    publishedAt: "2020-02-05T00:00:00Z"
  }
];

// HIIT VIDEOS - EMOM
export const HIIT_EMOM_VIDEOS: YouTubeVideo[] = [
  {
    id: "_JytV33vFqE",
    title: "EMOM Workout - Every Minute On the Minute",
    description: "Challenge yourself with this EMOM workout format",
    thumbnailUrl: "https://img.youtube.com/vi/_JytV33vFqE/maxresdefault.jpg",
    channelTitle: "FitnessBlender",
    publishedAt: "2019-09-10T00:00:00Z"
  },
  {
    id: "doN3kiQApBY",
    title: "20-Minute EMOM Workout - Bodyweight Only",
    description: "Effective EMOM workout you can do anywhere with no equipment",
    thumbnailUrl: "https://img.youtube.com/vi/doN3kiQApBY/maxresdefault.jpg",
    channelTitle: "MadFit",
    publishedAt: "2020-01-08T00:00:00Z"
  },
  {
    id: "8p8kuo70zQU",
    title: "EMOM Training for Beginners",
    description: "Learn how to structure and perform effective EMOM workouts",
    thumbnailUrl: "https://img.youtube.com/vi/8p8kuo70zQU/maxresdefault.jpg",
    channelTitle: "Heather Robertson",
    publishedAt: "2019-12-05T00:00:00Z"
  },
  {
    id: "WU_d3QcHPxo",
    title: "Full Body EMOM - 30 Minutes of Work",
    description: "Challenge every muscle group with this complete EMOM workout",
    thumbnailUrl: "https://img.youtube.com/vi/WU_d3QcHPxo/maxresdefault.jpg",
    channelTitle: "SELF",
    publishedAt: "2020-03-03T00:00:00Z"
  }
];

// HIIT VIDEOS - CIRCUIT
export const HIIT_CIRCUIT_VIDEOS: YouTubeVideo[] = [
  {
    id: "CBKcMoEKiNM",
    title: "30-Minute Circuit Training Workout",
    description: "Full body circuit training to build strength and endurance",
    thumbnailUrl: "https://img.youtube.com/vi/CBKcMoEKiNM/maxresdefault.jpg",
    channelTitle: "FitnessBlender",
    publishedAt: "2019-10-18T00:00:00Z"
  },
  {
    id: "TkaYafQ-XC4",
    title: "HIIT Circuit Workout - 15 Minutes",
    description: "Quick and effective circuit training for fat burning",
    thumbnailUrl: "https://img.youtube.com/vi/TkaYafQ-XC4/maxresdefault.jpg",
    channelTitle: "MadFit",
    publishedAt: "2020-01-03T00:00:00Z"
  },
  {
    id: "oAPCPjnU1wA",
    title: "Bodyweight Circuit Training - No Equipment",
    description: "Complete circuit training session you can do anywhere",
    thumbnailUrl: "https://img.youtube.com/vi/oAPCPjnU1wA/maxresdefault.jpg",
    channelTitle: "SELF",
    publishedAt: "2020-03-28T00:00:00Z"
  },
  {
    id: "edM1costi4s",
    title: "Full Body Circuit - 20-Minute Workout",
    description: "Efficient circuit training targeting all major muscle groups",
    thumbnailUrl: "https://img.youtube.com/vi/edM1costi4s/maxresdefault.jpg",
    channelTitle: "Heather Robertson",
    publishedAt: "2019-11-22T00:00:00Z"
  }
];

// RUNNING VIDEOS
export const RUNNING_VIDEOS: YouTubeVideo[] = [
  {
    id: "brFHyOtTwH4",
    title: "Proper Running Form - How to Run Correctly",
    description: "Learn proper running technique to improve efficiency and prevent injuries",
    thumbnailUrl: "https://img.youtube.com/vi/brFHyOtTwH4/maxresdefault.jpg",
    channelTitle: "Global Triathlon Network",
    publishedAt: "2019-07-20T00:00:00Z"
  },
  {
    id: "yiG1t2GNlZ4",
    title: "5 Running Form Mistakes - How to Run Properly",
    description: "Avoid these common running mistakes to improve your form and performance",
    thumbnailUrl: "https://img.youtube.com/vi/yiG1t2GNlZ4/maxresdefault.jpg",
    channelTitle: "The Run Experience",
    publishedAt: "2020-03-05T00:00:00Z"
  },
  {
    id: "XfcYEJKfBH0",
    title: "Running Drills for Better Form and Performance",
    description: "Essential running drills to improve your technique and efficiency",
    thumbnailUrl: "https://img.youtube.com/vi/XfcYEJKfBH0/maxresdefault.jpg",
    channelTitle: "Runner's World",
    publishedAt: "2019-10-12T00:00:00Z"
  },
  {
    id: "wRkGOVaOluk",
    title: "Interval Training for Runners - Speed and Endurance Workout",
    description: "Improve your speed and endurance with these interval training techniques",
    thumbnailUrl: "https://img.youtube.com/vi/wRkGOVaOluk/maxresdefault.jpg",
    channelTitle: "The Run Experience",
    publishedAt: "2020-01-18T00:00:00Z"
  }
];

// Function to get fallback videos for a specific category
export function getFallbackVideosForCategory(
  workoutSection: 'yoga' | 'stretch' | 'hiit' | 'running', 
  category?: string
): YouTubeVideo[] {
  // For yoga sections
  if (workoutSection === 'yoga') {
    if (category === 'beginner') return YOGA_BEGINNER_VIDEOS;
    if (category === 'intermediate') return YOGA_INTERMEDIATE_VIDEOS;
    if (category === 'advanced') return YOGA_ADVANCED_VIDEOS;
  }
  
  // For stretch sections
  if (workoutSection === 'stretch') {
    if (category === 'dynamic') return STRETCH_DYNAMIC_VIDEOS;
    if (category === 'static') return STRETCH_STATIC_VIDEOS;
    if (category === 'recovery') return STRETCH_RECOVERY_VIDEOS;
  }
  
  // For HIIT sections
  if (workoutSection === 'hiit') {
    if (category === 'tabata') return HIIT_TABATA_VIDEOS;
    if (category === 'amrap') return HIIT_AMRAP_VIDEOS;
    if (category === 'emom') return HIIT_EMOM_VIDEOS;
    if (category === 'circuit') return HIIT_CIRCUIT_VIDEOS;
    return HIIT_VIDEOS; // default HIIT videos
  }
  
  // For Running
  if (workoutSection === 'running') return RUNNING_VIDEOS;
  
  // Default
  return [];
}