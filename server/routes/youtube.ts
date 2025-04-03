import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();

// Create a cache for YouTube API responses to minimize API calls
const youtubeCache = new NodeCache({ 
  stdTTL: 7200,     // Cache results for 2 hours to reduce API calls
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false  // Don't clone data for better performance
}); 

// Track rate limiting to avoid quota issues
let apiCallCount = 0;
let lastResetTime = Date.now();
const MAX_CALLS_PER_HOUR = 50;  // More conservative limit to avoid hitting quota
const HOUR_MS = 60 * 60 * 1000;  // 1 hour in milliseconds

// Create a secondary backup cache for when API is rate limited
const emergencyCache: Record<string, any> = {};

/**
 * Function to format search query based on category and content
 * @param q Original search query
 * @param category Content category
 * @returns Formatted query string
 */
function formatSearchQuery(q: string, category?: string): string {
  if (category === 'vehicle') {
    return `${q} vehicle maintenance tutorial step by step`;
  } else if (category === 'cooking') {
    return `${q} cooking recipe tutorial step by step homemade`;
  } else if (category === 'home-repair') {
    return `${q} home repair DIY guide tutorial step by step`;
  } else if (category === 'finance') {
    return `${q} personal finance education tutorial`;
  } else if (category === 'wellness') {
    return `${q} wellness health guide tutorial`;
  } else if (category === 'fitness') {
    // Check if the query already contains specific keywords to avoid duplication
    const lowerQuery = q.toLowerCase();
    
    // Dynamically add appropriate modifiers based on what's NOT already in the query
    const modifiers = [];
    
    if (!lowerQuery.includes('form') && !lowerQuery.includes('technique')) {
      modifiers.push('proper form');
    }
    
    if (!lowerQuery.includes('tutorial') && !lowerQuery.includes('how to')) {
      modifiers.push('tutorial');
    }
    
    if (!lowerQuery.includes('demonstration') && !lowerQuery.includes('demo')) {
      modifiers.push('demonstration');
    }
    
    // Add exercise-specific modifiers
    if (lowerQuery.includes('beginner')) {
      modifiers.push('for beginners');
    } else if (lowerQuery.includes('advanced')) {
      modifiers.push('advanced technique');
    }
    
    // If we have instructional terms, prioritize reputable fitness sources
    if (lowerQuery.includes('tutorial') || lowerQuery.includes('how to') || lowerQuery.includes('guide')) {
      modifiers.push('from trainers');
    }
    
    // Join modifiers with spaces
    return modifiers.length > 0 ? `${q} ${modifiers.join(' ')}` : `${q} proper form technique demonstration`;
  } else {
    // Default enhancement for search query
    return `${q} tutorial guide how-to step by step`;
  }
}

// Get YouTube videos with enhanced formatting for relevance
router.get('/search', async (req, res) => {
  try {
    const { q, category, limit } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }
    
    // Reset rate limit counter if an hour has passed
    if (Date.now() - lastResetTime > HOUR_MS) {
      apiCallCount = 0;
      lastResetTime = Date.now();
    }
    
    // Check if we're approaching API quota limits
    if (apiCallCount >= MAX_CALLS_PER_HOUR) {
      return res.status(429).json({
        error: 'YouTube API rate limit reached. Please try again later.',
        rateLimit: true
      });
    }
    
    // Format the query based on category for improved relevance
    const formattedQuery = formatSearchQuery(q, category as string | undefined);
    
    // Create cache key
    const cacheKey = `youtube-${formattedQuery}-${limit || 8}`;
    
    // Check if response is cached
    const cachedResponse = youtubeCache.get(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    // Increment API call counter
    apiCallCount++;
    
    // Make API request
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: limit || 8, 
        q: formattedQuery,
        type: 'video',
        key: apiKey,
        relevanceLanguage: 'en',
        videoEmbeddable: true,
        videoDuration: 'medium', // Filter for medium length videos (4-20 minutes)
        videoDefinition: 'high', // Prefer high definition videos
      },
      timeout: 5000 // 5 second timeout to prevent hanging requests
    });
    
    // Extract the most relevant information
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: `https://img.youtube.com/vi/${item.id.videoId}/maxresdefault.jpg`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
    
    const responseData = { videos };
    
    // Cache the response
    youtubeCache.set(cacheKey, responseData);
    
    res.json(responseData);
  } catch (error) {
    console.error('YouTube API error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        
        // Handle quota exceeded
        if (status === 403) {
          // Mark as rate limited for the rest of the hour
          apiCallCount = MAX_CALLS_PER_HOUR;
          
          return res.status(403).json({
            error: 'YouTube API quota exceeded. Please try again later.',
            rateLimit: true
          });
        }
        
        // Return specific error from YouTube API
        return res.status(status).json({ 
          error: `YouTube API error: ${error.response.data.error?.message || 'Unknown error'}` 
        });
      } else if (error.code === 'ECONNABORTED') {
        // Timeout errors
        return res.status(504).json({ error: 'YouTube API request timed out' });
      }
    }
    
    // Generic error
    res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
  }
});

// General YouTube search endpoint (without /api/youtube prefix)
export const youtubeSearchHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { q, category, limit, videoId } = req.query;
    
    // Special case - if videoId is provided, this is a check request, not a search
    if (videoId && typeof videoId === 'string') {
      // Return a static response for video validation to save API calls
      return res.json({ isValid: true });
    }
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }
    
    // Reset rate limit counter if an hour has passed
    if (Date.now() - lastResetTime > HOUR_MS) {
      apiCallCount = 0;
      lastResetTime = Date.now();
    }
    
    // Check if we're approaching API quota limits
    if (apiCallCount >= MAX_CALLS_PER_HOUR) {
      return res.status(429).json({
        error: 'YouTube API rate limit reached. Please try again later.',
        rateLimit: true
      });
    }
    
    // Format the query based on category for improved relevance
    const formattedQuery = formatSearchQuery(q, category as string | undefined);
    
    // Create cache key for generalized endpoint
    const cacheKey = `youtube-general-${formattedQuery}-${limit || 8}`;
    
    // Check if response is cached
    const cachedResponse = youtubeCache.get(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    // Increment API call counter
    apiCallCount++;
    
    // Make API request
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: limit || 8,
        q: formattedQuery,
        type: 'video',
        key: apiKey,
        relevanceLanguage: 'en',
        videoEmbeddable: true,
        videoDuration: 'medium',
        videoDefinition: 'high',
      },
      timeout: 5000 // 5 second timeout to prevent hanging requests
    });
    
    // Return the raw items to maintain compatibility with existing components
    const responseData = { items: response.data.items };
    
    // Cache the response
    youtubeCache.set(cacheKey, responseData);
    
    res.json(responseData);
  } catch (error) {
    console.error('YouTube API error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        
        // Handle quota exceeded
        if (status === 403) {
          // Mark as rate limited for the rest of the hour
          apiCallCount = MAX_CALLS_PER_HOUR;
          
          return res.status(403).json({
            error: 'YouTube API quota exceeded. Please try again later.',
            rateLimit: true
          });
        }
        
        // Return specific error from YouTube API
        return res.status(status).json({ 
          error: `YouTube API error: ${error.response.data.error?.message || 'Unknown error'}` 
        });
      } else if (error.code === 'ECONNABORTED') {
        // Timeout errors
        return res.status(504).json({ error: 'YouTube API request timed out' });
      }
    }
    
    // Generic error
    res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
  }
};

export default router;