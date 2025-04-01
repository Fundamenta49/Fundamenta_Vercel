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
}

/**
 * Interface for cooking video search response
 */
export interface CookingVideoSearchResponse {
  videos: CookingVideo[];
  totalResults: number;
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
    
    // Transform data to match expected format
    return data.videos.map((video: Video) => ({
      id: video.youTubeId,
      title: video.title,
      description: video.shortTitle || video.title,
      thumbnailUrl: video.thumbnail,
      youTubeId: video.youTubeId,
      views: video.views,
      length: video.length
    })) || [];
  } catch (error) {
    console.error('Error searching cooking videos:', error);
    throw error;
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
    
    // Transform data to match expected format
    return data.videos.map((video: Video) => ({
      id: video.youTubeId,
      title: video.title,
      description: video.shortTitle || video.title,
      thumbnailUrl: video.thumbnail,
      youTubeId: video.youTubeId,
      views: video.views,
      length: video.length
    })) || [];
  } catch (error) {
    console.error('Error getting cooking videos by category:', error);
    throw error;
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
    
    // Transform data to match expected format
    return data.videos.map((video: Video) => ({
      id: video.youTubeId,
      title: video.title,
      description: video.shortTitle || video.title,
      thumbnailUrl: video.thumbnail,
      youTubeId: video.youTubeId,
      views: video.views,
      length: video.length
    })) || [];
  } catch (error) {
    console.error('Error getting random cooking videos:', error);
    throw error;
  }
};

/**
 * Format video length in seconds to MM:SS format
 * @param seconds Video length in seconds
 * @returns Formatted time string (MM:SS)
 */
export const formatVideoLength = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};