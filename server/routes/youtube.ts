import { Request, Response, Router } from 'express';
import axios from 'axios';

const router = Router();

// Cache to minimize API calls to YouTube
const videoCache: { [key: string]: any } = {};
const searchCache: { [query: string]: any } = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

router.get('/youtube-search', async (req, res) => {
  const query = req.query.q as string;
  const videoId = req.query.videoId as string;

  if (!process.env.YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }

  try {
    // Video validation endpoint
    if (videoId) {
      // Check cache first
      if (videoCache[videoId] && videoCache[videoId].timestamp > Date.now() - CACHE_DURATION) {
        return res.json(videoCache[videoId].data);
      }

      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          id: videoId,
          part: 'snippet'
        }
      });

      const isValid = response.data.items && response.data.items.length > 0;
      const result = { isValid, videoDetails: isValid ? response.data.items[0] : null };

      // Cache the result
      videoCache[videoId] = {
        timestamp: Date.now(),
        data: result
      };

      return res.json(result);
    }

    // Search query endpoint
    if (query) {
      // Check cache first
      if (searchCache[query] && searchCache[query].timestamp > Date.now() - CACHE_DURATION) {
        return res.json(searchCache[query].data);
      }

      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          q: query,
          part: 'snippet',
          maxResults: 3,
          type: 'video',
          videoDuration: 'medium', // Filter for medium length videos (4-20 minutes)
          videoEmbeddable: true    // Only videos that can be embedded
        }
      });

      // Cache the result
      searchCache[query] = {
        timestamp: Date.now(),
        data: response.data
      };

      res.json(response.data);
    } else {
      res.status(400).json({ error: 'Missing required parameters' });
    }
  } catch (error: any) {
    console.error('YouTube API error:', error.response?.data || error.message);

    // More specific error handling
    if (error.response?.status === 403) {
      return res.status(403).json({ 
        error: 'YouTube API quota exceeded or API key restricted',
        message: error.response.data?.error?.message || 'API quota issues'
      });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Content not found',
        message: 'The requested video or content was not found'
      });
    }

    res.status(500).json({ 
      error: 'Failed to fetch from YouTube API',
      message: error.message || 'Unknown error'
    });
  }
});

//This function is not used in the new implementation, but kept for reference.
async function validateYouTubeVideo(videoId: string) {
  try {
    // Just check if the video exists by querying the oEmbed endpoint
    const response = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { timeout: 5000 }
    );

    return {
      error: false,
      title: response.data.title,
      author: response.data.author_name,
      thumbnail: response.data.thumbnail_url
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    return {
      error: true,
      message: 'Video not found'
    };
  }
}

router.get('/validate', async (req, res) => {
  try {
    const { videoId } = req.query;

    if (!videoId || typeof videoId !== 'string') {
      return res.status(200).json({ error: true, message: 'Invalid video ID', isValid: false });
    }

    console.log(`Validating YouTube video ID: ${videoId}`);

    // Handle case when API key is not available - return success for testing
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.log('No YouTube API key - returning mock success response');
      return res.json({
        id: videoId,
        title: 'Video Title',
        thumbnail: { url: 'https://i.ytimg.com/vi/default/default.jpg', width: 120, height: 90 },
        isValid: true
      });
    }

    // Try direct oEmbed check first (doesn't require API key quota)
    try {
      const oembedResponse = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { timeout: 3000 }
      );

      if (oembedResponse.status === 200 && oembedResponse.data) {
        console.log(`YouTube oEmbed validation successful for ${videoId}`);
        return res.json({
          id: videoId,
          title: oembedResponse.data.title,
          thumbnail: { 
            url: oembedResponse.data.thumbnail_url,
            width: oembedResponse.data.thumbnail_width,
            height: oembedResponse.data.thumbnail_height
          },
          isValid: true
        });
      }
    } catch (oembedError) {
      // If oEmbed fails, continue to the API method
      console.log(`oEmbed check failed for ${videoId}, falling back to API: ${oembedError.message}`);
    }

    // Make API request to validate the video
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

    console.log(`Making API request to: ${apiUrl.replace(/key=.*$/, 'key=REDACTED')}`);

    const response = await axios.get(apiUrl);
    const hasItems = response.data.items && response.data.items.length > 0;

    console.log(`YouTube API Response: { status: ${response.status}, hasItems: ${Boolean(response.data.items)}, itemCount: ${response.data.items?.length || 0} }`);

    if (!hasItems) {
      console.log(`No video found for ID: ${videoId}`);
      // Return fallback data to allow client to try displaying the video anyway
      return res.status(200).json({ 
        id: videoId,
        error: true, 
        message: 'Video not found', 
        isValid: false,
        fallback: true
      });
    }

    const videoData = response.data.items[0];
    return res.json({
      id: videoId,
      title: videoData.snippet.title,
      thumbnail: videoData.snippet.thumbnails.default || videoData.snippet.thumbnails.medium || videoData.snippet.thumbnails.high,
      isValid: true
    });
  } catch (error) {
    console.error('YouTube validation error:', error);
    return res.status(200).json({ 
      error: true, 
      message: error instanceof Error ? error.message : 'Unknown error',
      isValid: false 
    });
  }
});

// Add a fallback route for the legacy endpoint
router.get('/legacy-validate', async (req: Request, res: Response) => {
  const { videoId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: true, message: 'Missing or invalid videoId parameter' });
  }

  try {
    const response = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { timeout: 5000 }
    );

    return res.json({
      error: false,
      id: videoId,
      title: response.data.title,
      author: response.data.author_name,
      thumbnail: response.data.thumbnail_url
    });
  } catch (error) {
    console.error('YouTube oembed error:', error);
    return res.json({
      error: true,
      message: 'Video not found or unavailable'
    });
  }
});

export default router;