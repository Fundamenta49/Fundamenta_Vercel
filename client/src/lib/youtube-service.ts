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
const fallbackFitnessVideos: YouTubeVideo[] = [
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
];

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
  // Filter fallbacks to try to match the exercise type if possible
  const lowerName = exerciseName.toLowerCase();
  const isCardio = lowerName.includes('cardio') || lowerName.includes('hiit');
  const isStrength = lowerName.includes('strength') || lowerName.includes('weight');
  const isYoga = lowerName.includes('yoga') || lowerName.includes('pose');
  const isPlyo = lowerName.includes('jump') || lowerName.includes('plyo');
  const isStretch = lowerName.includes('stretch') || lowerName.includes('mobility');
  
  // Try to match one video that's relevant to the exercise type
  let matchedVideo = fallbackFitnessVideos[0]; // Default to first
  
  if (isCardio) {
    matchedVideo = fallbackFitnessVideos[0]; // HIIT video
  } else if (isPlyo) {
    matchedVideo = fallbackFitnessVideos[1]; // Plyometrics video
  } else if (isStretch) {
    matchedVideo = fallbackFitnessVideos[2]; // Stretching video
  } else if (isYoga) {
    matchedVideo = fallbackFitnessVideos[2]; // Stretching video (close to yoga)
  } else {
    matchedVideo = fallbackFitnessVideos[3]; // Calisthenics/strength
  }
  
  // Return a mix of matched video and others to provide variety
  return [matchedVideo, ...fallbackFitnessVideos.filter(v => v.id !== matchedVideo.id).slice(0, 3)];
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