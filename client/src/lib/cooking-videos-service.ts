import { apiRequest } from '@/lib/queryClient';
import { Video } from '@/services/spoonacular-service';

/**
 * Interface for cooking videos from Spoonacular
 */
export interface CookingVideo {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  channelTitle?: string;
  publishedAt?: string;
  youTubeId: string;
  views: number;
  length: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Interface for cooking video search response
 */
export interface CookingVideoSearchResponse {
  videos: CookingVideo[];
  totalResults: number;
}

// Interface for YouTube video shapes
interface YouTubeVideoItem {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: {
        url?: string;
      };
    };
  };
}

// Interface for Spoonacular video shapes
interface SpoonacularVideo {
  youTubeId?: string;
  id?: string;
  title?: string;
  shortTitle?: string;
  description?: string;
  thumbnail?: string;
  views?: number;
  length?: number;
}

/**
 * Search for cooking tutorials using Spoonacular API
 * @param query Search query for finding cooking videos
 * @returns Promise with Spoonacular video search results
 */
export const searchCookingVideos = async (query: string): Promise<CookingVideo[]> => {
  try {
    const response = await apiRequest(
      'GET',
      `/api/cooking/videos/search?query=${encodeURIComponent(query)}`
    );
    
    const data = await response.json();
    
    // Check if the response has the expected structure
    if (!data || !data.videos || !Array.isArray(data.videos)) {
      console.error('Unexpected response format from cooking videos search:', data);
      return [];
    }
    
    // Transform data to match expected format
    return data.videos.map((video: SpoonacularVideo) => ({
      id: video.youTubeId || video.id || '',
      title: video.title || 'Cooking Tutorial',
      description: video.shortTitle || video.title || video.description || '',
      thumbnailUrl: video.thumbnail || `https://img.youtube.com/vi/${video.youTubeId || video.id}/hqdefault.jpg`,
      youTubeId: video.youTubeId || video.id || '',
      views: video.views || 0,
      length: video.length || 0
    })).filter((video: CookingVideo) => Boolean(video.youTubeId));
  } catch (error) {
    console.error('Error searching cooking videos:', error);
    return []; // Return empty array instead of throwing error
  }
};

/**
 * Get cooking videos by category
 * @param category Category name (breakfast, lunch, dinner, desserts, quick, techniques)
 * @returns Promise with cooking videos for the specified category
 */
export const getCookingVideosByCategory = async (category: string): Promise<CookingVideo[]> => {
  try {
    const response = await apiRequest(
      'GET',
      `/api/cooking/videos/category/${encodeURIComponent(category)}`
    );
    
    const data = await response.json();
    
    // Check if the response has the expected structure
    if (!data || !data.videos || !Array.isArray(data.videos)) {
      console.error('Unexpected response format from cooking videos by category:', data);
      return [];
    }
    
    // Transform data to match expected format
    return data.videos.map((video: SpoonacularVideo) => ({
      id: video.youTubeId || video.id || '',
      title: video.title || 'Cooking Tutorial',
      description: video.shortTitle || video.title || video.description || '',
      thumbnailUrl: video.thumbnail || `https://img.youtube.com/vi/${video.youTubeId || video.id}/hqdefault.jpg`,
      youTubeId: video.youTubeId || video.id || '',
      views: video.views || 0,
      length: video.length || 0
    })).filter((video: CookingVideo) => Boolean(video.youTubeId));
  } catch (error) {
    console.error('Error getting cooking videos by category:', error);
    return []; // Return empty array instead of throwing error
  }
};

/**
 * Get random cooking videos
 * @param tags Optional tags to filter results
 * @returns Promise with random cooking videos
 */
export const getRandomCookingVideos = async (tags?: string): Promise<CookingVideo[]> => {
  try {
    let url = `/api/cooking/videos/random`;
    if (tags) url += `?tags=${encodeURIComponent(tags)}`;
    
    const response = await apiRequest('GET', url);
    const data = await response.json();
    
    // Check if the response has the expected structure
    if (!data || !data.videos || !Array.isArray(data.videos)) {
      console.error('Unexpected response format from random cooking videos:', data);
      return [];
    }
    
    // Transform data to match expected format
    return data.videos.map((video: SpoonacularVideo) => ({
      id: video.youTubeId || video.id || '',
      title: video.title || 'Cooking Tutorial',
      description: video.shortTitle || video.title || video.description || '',
      thumbnailUrl: video.thumbnail || `https://img.youtube.com/vi/${video.youTubeId || video.id}/hqdefault.jpg`,
      youTubeId: video.youTubeId || video.id || '',
      views: video.views || 0,
      length: video.length || 0
    })).filter((video: CookingVideo) => Boolean(video.youTubeId));
  } catch (error) {
    console.error('Error getting random cooking videos:', error);
    return []; // Return empty array instead of throwing error
  }
};

/**
 * Search for videos directly using YouTube API
 * @param query Search query for finding videos
 * @param category Optional category filter
 * @returns Promise with YouTube search results
 */
export const searchYouTubeVideos = async (query: string, category?: string): Promise<CookingVideo[]> => {
  try {
    let url = `/api/youtube/search?q=${encodeURIComponent(query)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    
    const response = await apiRequest('GET', url);
    const data = await response.json();
    
    // Check if the response has the expected structure for YouTube API
    if (!data || !data.videos) {
      if (data && data.items && Array.isArray(data.items)) {
        // Handle the YouTubeAPI format
        return data.items.map((item: YouTubeVideoItem) => ({
          id: item.id?.videoId || '',
          title: item.snippet?.title || 'Cooking Tutorial',
          description: item.snippet?.description || '',
          thumbnailUrl: item.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${item.id?.videoId}/hqdefault.jpg`,
          channelTitle: item.snippet?.channelTitle || '',
          publishedAt: item.snippet?.publishedAt || '',
          youTubeId: item.id?.videoId || '',
          views: 0,
          length: 0
        })).filter((video: CookingVideo) => Boolean(video.youTubeId));
      }
      
      console.error('Unexpected response format from YouTube search:', data);
      return [];
    }
    
    // Standard format for our API
    return data.videos.map((video: any) => ({
      id: video.id || '',
      title: video.title || 'Cooking Tutorial',
      description: video.description || '',
      thumbnailUrl: video.thumbnailUrl || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
      channelTitle: video.channelTitle || '',
      publishedAt: video.publishedAt || '',
      youTubeId: video.id || '',
      views: 0,
      length: 0
    })).filter((video: CookingVideo) => Boolean(video.youTubeId));
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return []; // Return empty array instead of throwing error
  }
};

/**
 * Format video length in seconds to MM:SS format
 * @param seconds Video length in seconds
 * @returns Formatted time string (MM:SS)
 */
export const formatVideoLength = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};