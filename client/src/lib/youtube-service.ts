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
      `/api/youtube/search?q=${encodeURIComponent(query)}`
    );
    
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
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