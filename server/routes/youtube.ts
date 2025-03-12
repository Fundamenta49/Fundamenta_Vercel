
import express from 'express';
import axios from 'axios';

const router = express.Router();

// YouTube search endpoint
router.get('/youtube/search', async (req, res) => {
  try {
    const query = req.query.query as string;
    
    if (!query) {
      return res.status(400).json({ 
        error: true, 
        message: "Query parameter is required" 
      });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      console.error("YouTube API key not configured");
      return res.status(500).json({
        error: true,
        message: "YouTube API key not configured"
      });
    }

    console.log(`Searching YouTube for: ${query}`);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 5,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const searchResults = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    res.json({
      error: false,
      results: searchResults
    });
  } catch (error) {
    console.error("YouTube search API error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to search YouTube",
      details: (error as any).response?.data?.error?.message || (error as Error).message
    });
  }
});

// YouTube video validation endpoint
router.get('/youtube/validate', async (req, res) => {
  try {
    const videoId = req.query.videoId as string;

    if (!videoId) {
      return res.status(400).json({ 
        error: true, 
        message: "Video ID is required" 
      });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      console.error("YouTube API key not configured");
      // For development, return mock data
      return res.json({
        id: videoId,
        title: "Video title",
        thumbnail: "https://via.placeholder.com/320x180",
        error: false
      });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,status',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.json({
        error: true,
        message: "Video not found"
      });
    }

    const video = response.data.items[0];

    if (video.status.privacyStatus !== 'public') {
      return res.json({
        error: true,
        message: "Video is not publicly available"
      });
    }

    res.json({
      id: video.id,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
      error: false
    });
  } catch (error) {
    console.error("YouTube API error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to validate video",
      details: (error as any).response?.data?.error?.message || (error as Error).message
    });
  }
});

export default router;
