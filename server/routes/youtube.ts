import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get YouTube videos related to vehicle maintenance
router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }
    
    // Format the query based on category (if provided)
    let formattedQuery = q;
    if (category === 'vehicle') {
      formattedQuery = `${q} vehicle maintenance tutorial`;
    } else if (category === 'cooking') {
      formattedQuery = `${q} cooking recipe tutorial`;
    } else if (category === 'home-repair') {
      formattedQuery = `${q} home repair DIY guide tutorial`;
    } else {
      // Default enhancement for search query
      formattedQuery = `${q} tutorial guide how-to`;
    }
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 5,
        q: formattedQuery,
        type: 'video',
        key: apiKey,
        relevanceLanguage: 'en',
        videoEmbeddable: true,
      }
    });
    
    // Extract the most relevant information
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
    
    res.json({ videos });
  } catch (error) {
    console.error('YouTube API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `YouTube API error: ${error.response.data.error?.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
  }
});

// General YouTube search endpoint (without /api/youtube prefix)
export const youtubeSearchHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { q, category } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }
    
    // Format the query based on category (if provided)
    let formattedQuery = q;
    if (category === 'vehicle') {
      formattedQuery = `${q} vehicle maintenance tutorial`;
    } else if (category === 'cooking') {
      formattedQuery = `${q} cooking recipe tutorial`;
    } else if (category === 'home-repair') {
      formattedQuery = `${q} home repair DIY guide tutorial`;
    } else {
      // Default enhancement for search query
      formattedQuery = `${q} tutorial guide how-to`;
    }
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 5,
        q: formattedQuery,
        type: 'video',
        key: apiKey,
        relevanceLanguage: 'en',
        videoEmbeddable: true,
      }
    });
    
    // Return the raw items to maintain compatibility with existing components
    res.json({ items: response.data.items });
  } catch (error) {
    console.error('YouTube API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `YouTube API error: ${error.response.data.error?.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
  }
};

export default router;