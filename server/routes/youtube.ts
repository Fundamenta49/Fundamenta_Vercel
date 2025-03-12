
import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Function to validate YouTube video by ID
async function validateYouTubeVideo(videoId: string) {
  try {
    // If we're in development or API key isn't configured, return a successful mock
    if (process.env.NODE_ENV === 'development' || !process.env.YOUTUBE_API_KEY) {
      console.log(`YouTube API key not configured or in development mode, returning mock success for ID: ${videoId}`);
      // Return a mock response if no API key is available (for development)
      return { 
        isValid: true,
        error: false,
        id: videoId,
        title: `Video ${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      };
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos`;
    console.log(`Validating YouTube video ID: ${videoId} using API`);

    const response = await axios.get(apiUrl, {
      params: {
        part: 'snippet,status',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY,
      }
    });

    console.log('YouTube API Response:', {
      status: response.status,
      hasItems: !!response.data.items,
      itemCount: response.data.items?.length
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.log(`No video found for ID: ${videoId}`);
      return {
        isValid: false,
        error: true,
        message: "Video not found"
      };
    }

    const video = response.data.items[0];

    if (video.status.privacyStatus !== 'public') {
      console.log(`Video ${videoId} is not public. Status: ${video.status.privacyStatus}`);
      return {
        isValid: false,
        error: true,
        message: "Video is not publicly available"
      };
    }

    console.log(`Successfully validated video ${videoId}`);

    return {
      isValid: true,
      error: false,
      id: video.id,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url
    };
  } catch (error) {
    console.error(`YouTube validation failed for videoId ${videoId}:`, error);
    return { 
      isValid: false, 
      error: true,
      message: 'Video unavailable or API error'
    };
  }
}

// Endpoint to validate YouTube video
router.get('/validate', async (req, res) => {
  const { videoId } = req.query;
  
  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ 
      error: true, 
      isValid: false,
      message: 'Invalid or missing videoId parameter' 
    });
  }

  try {
    const result = await validateYouTubeVideo(videoId);
    res.json(result);
  } catch (error) {
    console.error('YouTube validation error:', error);
    res.status(500).json({ 
      error: true, 
      isValid: false,
      message: 'Failed to validate YouTube video' 
    });
  }
});

// Legacy endpoint to maintain compatibility
router.get('/youtube-search', async (req, res) => {
  const { videoId } = req.query;
  
  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ 
      error: true, 
      isValid: false,
      message: 'Invalid or missing videoId parameter' 
    });
  }

  try {
    const result = await validateYouTubeVideo(videoId);
    res.json({ 
      isValid: result.isValid, 
      error: result.error,
      ...result 
    });
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({ 
      error: true, 
      isValid: false,
      message: 'Failed to validate YouTube video' 
    });
  }
});

export default router;
