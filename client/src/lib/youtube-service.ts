import { apiRequest } from '@/lib/queryClient';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

export interface YouTubeSearchResponse {
  videos: YouTubeVideo[];
}

/**
 * Search for vehicle maintenance videos on YouTube
 * @param query Search query for finding maintenance videos
 * @returns Promise with YouTube video search results
 */
export const searchVehicleVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    const response = await apiRequest(
      'GET',
      `/api/youtube/search?q=${encodeURIComponent(query)}&category=vehicle`
    );
    
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw error;
  }
};

/**
 * Search for home repair tutorials on YouTube
 * @param query Search query for finding home repair videos
 * @returns Promise with YouTube video search results
 */
export const searchHomeRepairVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    const response = await apiRequest(
      'GET',
      `/api/youtube/search?q=${encodeURIComponent(query)}&category=home-repair`
    );
    
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error searching home repair videos:', error);
    throw error;
  }
};

/**
 * Search for cooking tutorials on YouTube
 * @param query Search query for finding cooking videos
 * @returns Promise with YouTube video search results
 */
export const searchCookingVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    const response = await apiRequest(
      'GET',
      `/api/youtube/search?q=${encodeURIComponent(query)}&category=cooking`
    );
    
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error searching cooking videos:', error);
    throw error;
  }
};

// Kitchen tools video ID map - maps video titles to their YouTube IDs
export const kitchenToolVideoMap: Record<string, string> = {
  "Basic Knife Skills | Epicurious": "GFFWa5ELqUA",
  "Choosing and Caring for Cutting Boards | America's Test Kitchen": "kd4vNcJAS8A",
  "How to Measure Ingredients Correctly | Joy of Baking": "-GHRl8i5-ns",
  "Mixing Bowls: Types and Uses | Kitchen Conservatory": "0MgbauXapkk",
  "How to Use and Season a Cast Iron Skillet | Tasty": "rXRDTKHshfk",
  "Saucepan Basics: Cooking Techniques and Tips | Pro Home Cooks": "7X3Y29oqBrA",
  "Stockpot Cooking: Tips and Techniques | Chef Billy Parisi": "mZ7R4zh_k1I",
  "Sheet Pan Cooking: Tips and Recipes | Food Wishes": "KoQ4HQpj7BU",
  "Spatula Types and Uses | America's Test Kitchen": "3TgBJQ4Ugew",
  "How to Use Kitchen Tongs Effectively | Serious Eats": "2XSdQ4gjsAQ",
  "Whisking Techniques: How to Use a Whisk Properly | Bon Appétit": "fM1YJPaFV84",
  "Colander vs. Strainer: Which One to Use? | Food Network": "vkOBmG1yFLY",
  "How to Use a Vegetable Peeler | Martha Stewart": "R_yNsToYMNw",
  "Grating Techniques: Box Grater vs. Microplane | America's Test Kitchen": "ZCgYaxTyXJ4",
  "How to Use a Meat Thermometer | ChefSteps": "zByxl2BfDd4"
};

/**
 * Generic YouTube search function for any category
 * @param query Search query
 * @param category Optional category to contextualize search
 * @returns Promise with YouTube video search results
 */
export const searchVideos = async (query: string, category?: string): Promise<YouTubeVideo[]> => {
  try {
    const categoryParam = category ? `&category=${encodeURIComponent(category)}` : '';
    const response = await apiRequest(
      'GET',
      `/api/youtube/search?q=${encodeURIComponent(query)}${categoryParam}`
    );
    
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

/**
 * Search for fitness exercise tutorial videos on YouTube with enhanced variety
 * @param exerciseName The name of the exercise to search for
 * @param equipment Optional equipment used for the exercise (for more specific results)
 * @param muscleGroups Optional muscle groups targeted (for more specific results)
 * @param seed Optional random seed for consistent but varied results
 * @returns Promise with YouTube video search results related to the exercise
 */
// Cache YouTube API responses on the client side to reduce API calls
const clientCache: Record<string, { videos: YouTubeVideo[], timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60 * 2; // 2 hours

// Default fallback videos for when the API fails or is rate-limited
const fallbackFitnessVideos: {[key: string]: YouTubeVideo[]} = {
  // General fallbacks
  'general': [
    {
      id: "ml6cT4AZdqI",
      title: "30-Minute HIIT Workout - No Equipment with Modifications",
      description: "Full body HIIT workout that's apartment-friendly with no equipment required.",
      thumbnailUrl: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
      channelTitle: "SELF",
      publishedAt: "2020-03-15T00:00:00Z"
    },
    {
      id: "ltuLMm5NUM8",
      title: "Plyometric Training for Beginners - Power Exercises",
      description: "Learn the fundamentals of plyometric training with these bodyweight exercises.",
      thumbnailUrl: "https://img.youtube.com/vi/ltuLMm5NUM8/maxresdefault.jpg",
      channelTitle: "Fitness Blender",
      publishedAt: "2020-01-20T00:00:00Z"
    },
    {
      id: "qULTwquOuT4",
      title: "Full Body Stretching Routine - 15 Minutes for Flexibility",
      description: "Follow along with this full body stretching routine to improve your flexibility.",
      thumbnailUrl: "https://img.youtube.com/vi/qULTwquOuT4/maxresdefault.jpg",
      channelTitle: "MadFit",
      publishedAt: "2019-11-05T00:00:00Z"
    },
    {
      id: "kIVxdW9aS8k",
      title: "Beginner Calisthenics Workout - Build Strength with Bodyweight",
      description: "Start your calisthenics journey with these fundamental bodyweight exercises.",
      thumbnailUrl: "https://img.youtube.com/vi/kIVxdW9aS8k/maxresdefault.jpg",
      channelTitle: "THENX",
      publishedAt: "2018-09-22T00:00:00Z"
    }
  ],
  // Plyometrics specific fallbacks
  'plyometrics': [
    {
      id: "8wKmWQBWeiQ",
      title: "Bodyweight Plyometric Workout - No Equipment",
      description: "Advanced bodyweight plyometric exercises for explosive power",
      thumbnailUrl: "https://img.youtube.com/vi/8wKmWQBWeiQ/maxresdefault.jpg",
      channelTitle: "FitnessBlender",
      publishedAt: "2020-06-15T00:00:00Z"
    },
    {
      id: "Mvo2snJGhtM",
      title: "Explosive Jumps Workout - Plyometrics Training",
      description: "HIIT bodyweight jumping exercises for athletic performance",
      thumbnailUrl: "https://img.youtube.com/vi/Mvo2snJGhtM/maxresdefault.jpg",
      channelTitle: "THENX",
      publishedAt: "2020-07-22T00:00:00Z"
    },
    {
      id: "IODxDxX7oi4",
      title: "Box Jumps and Plyo Jumps Tutorial",
      description: "Learn proper form for explosive jumping exercises",
      thumbnailUrl: "https://img.youtube.com/vi/IODxDxX7oi4/maxresdefault.jpg",
      channelTitle: "Jump Rope Dudes",
      publishedAt: "2019-11-05T00:00:00Z"
    },
    {
      id: "DHOPWvO3ZcI",
      title: "Bodyweight Plyometric Legs Workout",
      description: "Build power and explosiveness with these jumping exercises",
      thumbnailUrl: "https://img.youtube.com/vi/DHOPWvO3ZcI/maxresdefault.jpg",
      channelTitle: "MadFit",
      publishedAt: "2019-05-12T00:00:00Z"
    }
  ],
  // Stretching specific fallbacks
  'stretching': [
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
  // HIIT specific fallbacks
  'hiit': [
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
  ],
  // Tabata specific fallbacks
  'tabata': [
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
  ],
  // Calisthenics specific fallbacks
  'calisthenics': [
    {
      id: "kIVxdW9aS8k",
      title: "Beginner Calisthenics Workout - Build Strength with Bodyweight",
      description: "Start your calisthenics journey with these fundamental bodyweight exercises.",
      thumbnailUrl: "https://img.youtube.com/vi/kIVxdW9aS8k/maxresdefault.jpg",
      channelTitle: "THENX",
      publishedAt: "2018-09-22T00:00:00Z"
    },
    {
      id: "sWj819Id_O0",
      title: "Push Up Progressions - From Beginner to Advanced",
      description: "Master various push up variations for upper body strength",
      thumbnailUrl: "https://img.youtube.com/vi/sWj819Id_O0/maxresdefault.jpg",
      channelTitle: "FitnessFAQs",
      publishedAt: "2019-03-12T00:00:00Z"
    },
    {
      id: "fO_Hc2Y27O0",
      title: "Full Body Calisthenics Workout - No Equipment Needed",
      description: "Complete bodyweight workout targeting all major muscle groups",
      thumbnailUrl: "https://img.youtube.com/vi/fO_Hc2Y27O0/maxresdefault.jpg",
      channelTitle: "THENX",
      publishedAt: "2018-11-18T00:00:00Z"
    },
    {
      id: "8GL73mrsvJ8",
      title: "Core Strength Workout - Bodyweight Only",
      description: "Build a strong core with these calisthenics exercises",
      thumbnailUrl: "https://img.youtube.com/vi/8GL73mrsvJ8/maxresdefault.jpg",
      channelTitle: "Calisthenicmovement",
      publishedAt: "2019-10-05T00:00:00Z"
    }
  ],
  // Weightlifting specific fallbacks
  'weightlifting': [
    {
      id: "rMsaGRMNvrA",
      title: "Dumbbell Workout for Beginners - Full Body",
      description: "Complete dumbbell workout for building muscle and strength",
      thumbnailUrl: "https://img.youtube.com/vi/rMsaGRMNvrA/maxresdefault.jpg",
      channelTitle: "FitnessBlender",
      publishedAt: "2020-02-13T00:00:00Z"
    },
    {
      id: "U8Li9TlR3Sk",
      title: "Proper Form for Basic Barbell Exercises",
      description: "Learn correct technique for fundamental barbell lifts",
      thumbnailUrl: "https://img.youtube.com/vi/U8Li9TlR3Sk/maxresdefault.jpg",
      channelTitle: "Jeff Nippard",
      publishedAt: "2019-04-22T00:00:00Z"
    },
    {
      id: "6JX40FZk7oE",
      title: "Kettlebell Training for Beginners",
      description: "Essential kettlebell exercises and proper form tutorial",
      thumbnailUrl: "https://img.youtube.com/vi/6JX40FZk7oE/maxresdefault.jpg",
      channelTitle: "Bodybuilding.com",
      publishedAt: "2018-08-30T00:00:00Z"
    },
    {
      id: "nhoikoUEI8U",
      title: "Home Workout with Dumbbells - Upper Body Focus",
      description: "Build strength and muscle with this dumbbell workout",
      thumbnailUrl: "https://img.youtube.com/vi/nhoikoUEI8U/maxresdefault.jpg",
      channelTitle: "ATHLEAN-X",
      publishedAt: "2019-09-10T00:00:00Z"
    }
  ]
};

/**
 * Retrieve videos specifically for a workout section (Running, HIIT, Yoga, Stretch)
 * @param workoutSection The specific workout section (running, hiit, yoga, stretch)
 * @param exerciseName The name of the exercise
 * @param equipment Any equipment needed for the exercise
 * @param muscleGroups Muscle groups targeted
 * @param seed Random seed for consistent results
 * @returns Promise with YouTube videos for that specific workout section
 */
export const searchSectionSpecificExerciseVideos = async (
  workoutSection: 'running' | 'hiit' | 'yoga' | 'stretch',
  exerciseName: string, 
  equipment?: string, 
  muscleGroups?: string[],
  seed?: string
): Promise<YouTubeVideo[]> => {
  // Generate a cache key that includes the workout section and all relevant parameters
  const cacheKey = `${workoutSection}_${exerciseName}_${equipment || ''}_${muscleGroups?.join('_') || ''}_${seed || ''}`;
  
  // Check client-side cache first
  const cacheItem = clientCache[cacheKey];
  if (cacheItem && (Date.now() - cacheItem.timestamp < CACHE_TTL)) {
    console.log(`Using cached ${workoutSection} videos for ${exerciseName}`);
    return cacheItem.videos;
  }
  
  // First try to get section-specific fallback videos
  if (fallbackFitnessVideos[workoutSection]) {
    console.log(`Using ${workoutSection}-specific fallback videos`);
    
    // Store in cache to avoid repeated lookups
    clientCache[cacheKey] = {
      videos: fallbackFitnessVideos[workoutSection],
      timestamp: Date.now()
    };
    
    return fallbackFitnessVideos[workoutSection];
  }
  
  // Construct query with workout section specific terms
  let query = '';
  
  switch(workoutSection) {
    case 'running':
      query = `running ${exerciseName} technique form`;
      break;
    case 'hiit':
      query = `hiit ${exerciseName} workout tutorial`;
      break;
    case 'yoga':
      query = `yoga ${exerciseName} pose tutorial`;
      break;
    case 'stretch':
      query = `stretching ${exerciseName} tutorial mobility`;
      break;
    default:
      query = `${exerciseName} exercise tutorial`;
  }
  
  // Add equipment qualifier if provided
  if (equipment && equipment !== 'none' && equipment !== 'bodyweight') {
    query = `${query} with ${equipment}`;
  }
  
  // Add muscle group focus for non-yoga/stretch workouts
  if (['running', 'hiit'].includes(workoutSection) && muscleGroups && muscleGroups.length > 0) {
    query = `${query} for ${muscleGroups[0]}`;
  }
  
  try {
    // Call the API with our specialized query
    const response = await apiRequest(
      'GET',
      `/api/youtube/search?q=${encodeURIComponent(query)}&category=fitness&seed=${seed || ''}`
    );
    
    const data = await response.json();
    const videos = data.videos || [];
    
    // Store in cache
    clientCache[cacheKey] = {
      videos,
      timestamp: Date.now()
    };
    
    return videos;
  } catch (error) {
    console.error(`Error searching ${workoutSection} videos:`, error);
    
    // Return general fallback as last resort
    return fallbackFitnessVideos['general'] || [];
  }
};

export const searchExerciseVideos = async (
  exerciseName: string, 
  equipment?: string,
  muscleGroups?: string[],
  seed?: string
): Promise<YouTubeVideo[]> => {
  try {
    // Generate a cache key based on the parameters
    const cacheKey = `${exerciseName}-${equipment || 'none'}-${(muscleGroups || []).join('-')}-${seed || 'default'}`;
    
    // Check client-side cache first
    const cachedData = clientCache[cacheKey];
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
      console.log('Using client-side cache for exercise videos');
      return cachedData.videos;
    }
    
    // Create a base targeted search query for better fitness tutorial results
    let searchQuery = `${exerciseName} exercise tutorial`;
    
    // Add equipment to the search query if specified
    if (equipment && equipment !== 'body weight') {
      searchQuery += ` with ${equipment}`;
    } else if (equipment === 'body weight') {
      searchQuery += ' bodyweight';
    }
    
    // Add a muscle group modifier if available (helps with result variety)
    if (muscleGroups && muscleGroups.length > 0) {
      // Randomly select one muscle group to avoid overly specific queries
      const muscleIndex = seed 
        ? parseInt(seed.slice(-2), 16) % muscleGroups.length 
        : Math.floor(Math.random() * muscleGroups.length);
      
      const selectedMuscle = muscleGroups[muscleIndex];
      
      // Only add if it's not already in the exercise name
      if (!exerciseName.toLowerCase().includes(selectedMuscle.toLowerCase())) {
        searchQuery += ` for ${selectedMuscle}`;
      }
    }
    
    // Add modifiers based on seed to create variety in results
    // This helps ensure different cards get different video suggestions
    if (seed) {
      const modifiers = [
        "proper form", "technique", "tutorial", "how to", 
        "best form", "demonstration", "workout", "training",
        "fitness", "beginner", "advanced"
      ];
      
      // Use the seed to deterministically select a modifier
      const modifierIndex = parseInt(seed.slice(0, 2), 16) % modifiers.length;
      searchQuery += ` ${modifiers[modifierIndex]}`;
    } else {
      // Default qualifier for better results
      searchQuery += " proper form";
    }
    
    const response = await apiRequest(
      'GET',
      `/api/youtube/search?q=${encodeURIComponent(searchQuery)}&category=fitness`
    );
    
    if (!response.ok) {
      // If we get a 403 or 429 (rate limit errors), throw a specific error
      if (response.status === 403 || response.status === 429) {
        console.error('API Request error:', response.statusText);
        throw new Error('YouTube API rate limit exceeded');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Only cache responses with actual videos
    if (data.videos && data.videos.length > 0) {
      // Store in client-side cache with timestamp
      clientCache[cacheKey] = {
        videos: data.videos,
        timestamp: Date.now()
      };
      return data.videos;
    } else {
      // If no videos were found, return fallbacks (this helps with rate limiting)
      return getFallbackVideos(exerciseName, equipment);
    }
  } catch (error) {
    console.error('Error searching exercise videos:', error);
    // Return fallback videos on error
    return getFallbackVideos(exerciseName, equipment);
  }
};

// Helper function to get fallback videos based on exercise context
function getFallbackVideos(exerciseName: string, equipment?: string): YouTubeVideo[] {
  // Determine which category of videos to use based on exercise name and equipment
  const lowerName = exerciseName.toLowerCase();
  
  // Match exercise type to our fallback categories
  let categoryKey = 'general';
  
  // Check for Tabata exercises first - these are the specific Tabata protocol exercises
  // in the ActiveYou card
  if (lowerName.includes('tabata') || 
      // Check for specific Tabata exercises
      lowerName.includes('jump squat') || 
      lowerName.includes('burpee') || 
      lowerName.includes('mountain climber') || 
      lowerName.includes('push-up') || lowerName.includes('pushup') ||
      lowerName.includes('high knee') || 
      lowerName.includes('plank to shoulder')) {
    categoryKey = 'tabata';
  } else if (lowerName.includes('jump') || lowerName.includes('plyo') || lowerName.includes('explosive')) {
    categoryKey = 'plyometrics';
  } else if (lowerName.includes('cardio') || lowerName.includes('hiit') || lowerName.includes('interval')) {
    categoryKey = 'hiit';
  } else if (lowerName.includes('stretch') || lowerName.includes('mobility') || lowerName.includes('flexibility')) {
    categoryKey = 'stretching';
  } else if (lowerName.includes('calisthenics') || lowerName.includes('bodyweight') || lowerName.includes('push up')) {
    categoryKey = 'calisthenics';
  } else if (equipment && (equipment.includes('dumbbell') || equipment.includes('barbell') || equipment.includes('weight'))) {
    categoryKey = 'weightlifting';
  }
  
  // If we don't have a specific category for this exercise type, use general
  const videosForCategory = fallbackFitnessVideos[categoryKey] || fallbackFitnessVideos['general'];
  
  // Shuffle the videos to provide variety
  // We use a deterministic shuffle based on the exercise name to ensure consistent results
  const hash = exerciseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffledVideos = [...videosForCategory].sort((a: YouTubeVideo, b: YouTubeVideo) => {
    const numA = a.id.charCodeAt(0) + hash;
    const numB = b.id.charCodeAt(0) + hash;
    return numA - numB;
  });
  
  // Return 4 videos for this category
  return shuffledVideos.slice(0, 4);
};

/**
 * Get the YouTube embed URL for a video
 * @param videoId The YouTube video ID
 * @returns Embeddable URL for the video
 */
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Get the full YouTube watch URL for a video
 * @param videoId The YouTube video ID
 * @returns Full URL to watch the video on YouTube
 */
export const getYouTubeWatchUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Search for credit education videos on YouTube
 * @param keyword Specific credit topic to search for (e.g. "credit scores", "credit cards", etc.)
 * @param maxResults Maximum number of videos to return
 * @returns Promise with YouTube video search results formatted for the credit-building-skills component
 */
export const fetchYouTubeVideos = async (
  keyword: string, 
  maxResults: number = 4
): Promise<{
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}[]> => {
  try {
    // Add "education" and "explained" to make search results more educational
    const searchQuery = `${keyword} credit education explained`;
    
    const response = await apiRequest(
      'GET',
      `/api/youtube/search?q=${encodeURIComponent(searchQuery)}&category=finance&limit=${maxResults}`
    );
    
    const data = await response.json();
    
    // Map to simplified format for credit skills component
    return (data.videos || []).map((video: YouTubeVideo) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnailUrl
    }));
  } catch (error) {
    console.error('Error fetching credit education videos:', error);
    return [];
  }
};