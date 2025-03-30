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