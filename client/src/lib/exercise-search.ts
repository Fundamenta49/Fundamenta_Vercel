import { searchVideos, YouTubeVideo } from './youtube-service';

/**
 * Custom search function for exercise videos that works with multiple search terms
 * @param searchTerms Array of search terms to try
 * @returns Promise with YouTube videos from the first successful search
 */
export const searchExerciseVideos = async (searchTerms: string[]): Promise<YouTubeVideo[]> => {
  if (!searchTerms || searchTerms.length === 0) {
    return [];
  }

  // Try each search term in order until we get results
  for (const term of searchTerms) {
    try {
      const videos = await searchVideos(term, 'fitness');
      if (videos && videos.length > 0) {
        return videos;
      }
    } catch (err) {
      console.error(`Search failed for term "${term}":`, err);
      // Continue to next term if one fails
    }
  }

  // If all searches fail, return empty array
  return [];
};