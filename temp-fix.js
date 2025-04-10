// Modified search function for section-specific exercise videos
// This handles the case where YouTube API quota is exceeded by providing
// category-specific fallback videos
export const searchSectionSpecificExerciseVideos = async (
  workoutSection, // 'running', 'hiit', 'yoga', 'stretch'
  exerciseName,
  equipment,
  muscleGroups,
  seed,
  category // Added category parameter
) => {
  // Use different fallbacks for different categories within the same workout section
  let specificCategory = workoutSection;
  
  // For yoga, map to specific category fallbacks
  if (workoutSection === 'yoga' && category) {
    if (category === 'beginner') specificCategory = 'yoga_beginner';
    else if (category === 'intermediate') specificCategory = 'yoga_intermediate';
    else if (category === 'advanced') specificCategory = 'yoga_advanced';
  }
  
  // For stretch, map to specific category fallbacks
  if (workoutSection === 'stretch' && category) {
    if (category === 'dynamic') specificCategory = 'stretch_dynamic';
    else if (category === 'static') specificCategory = 'stretch_static';
    else if (category === 'recovery') specificCategory = 'stretch_recovery';
  }
  
  // Return the appropriate fallback videos
  // This is just temporary for this test - will need to be integrated
  // Note: In production, add these specific fallback arrays to the main fallbackFitnessVideos object
  return getFallbackVideosForCategory(specificCategory);
};

// Helper function to get fallback videos for specific category
function getFallbackVideosForCategory(category) {
  const fallbacks = {
    'yoga_beginner': [
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
      }
    ],
    'yoga_intermediate': [
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
      }
    ],
    'yoga_advanced': [
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
      }
    ],
    'stretch_dynamic': [
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
      }
    ],
    'stretch_static': [
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
      }
    ],
    'stretch_recovery': [
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
      }
    ],
    'yoga': [
      {
        id: "v7AYKMP6rOE",
        title: "Yoga For Complete Beginners - 20 Minute Home Yoga Workout",
        description: "Beginner friendly yoga class with foundational poses and breathing techniques",
        thumbnailUrl: "https://img.youtube.com/vi/v7AYKMP6rOE/maxresdefault.jpg",
        channelTitle: "Yoga With Adriene",
        publishedAt: "2019-04-30T00:00:00Z"
      }
    ],
    'stretch': [
      {
        id: "sTxC3J3gQEU",
        title: "Full Body Flexibility Routine - 15 Minutes",
        description: "Follow along stretching routine for whole body mobility",
        thumbnailUrl: "https://img.youtube.com/vi/sTxC3J3gQEU/maxresdefault.jpg",
        channelTitle: "MadFit",
        publishedAt: "2020-04-18T00:00:00Z"
      }
    ],
    'hiit': [
      {
        id: "ml6cT4AZdqI",
        title: "30-Minute HIIT Workout - No Equipment",
        description: "Full body HIIT workout that's apartment-friendly with no equipment required.",
        thumbnailUrl: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
        channelTitle: "SELF",
        publishedAt: "2020-03-15T00:00:00Z"
      }
    ],
    'running': [
      {
        id: "brFHyOtTwH4",
        title: "Proper Running Form - How to Run Correctly",
        description: "Learn proper running technique to improve efficiency and prevent injuries",
        thumbnailUrl: "https://img.youtube.com/vi/brFHyOtTwH4/maxresdefault.jpg",
        channelTitle: "Global Triathlon Network",
        publishedAt: "2019-07-20T00:00:00Z"
      }
    ]
  };
  
  return fallbacks[category] || fallbacks['general'] || [];
}
