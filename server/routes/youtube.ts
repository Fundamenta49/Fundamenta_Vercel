
import { Router } from 'express';
import axios from 'axios';
import { logger } from '../index';

const router = Router();

// Function to validate YouTube video by ID
async function validateYouTubeVideo(videoId: string) {
  try {
    // A simple HEAD request to check if the video exists and is available
    const response = await axios.head(`https://www.youtube.com/embed/${videoId}`, {
      timeout: 5000,
      validateStatus: (status) => status < 400 // Accept only success statuses
    });
    return { isValid: true };
  } catch (error) {
    logger.error(`YouTube validation failed for videoId ${videoId}:`, error);
    return { isValid: false, error: 'Video unavailable or restricted' };
  }
}

// Endpoint to validate YouTube video
router.get('/validate', async (req, res) => {
  const { videoId } = req.query;
  
  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing videoId parameter' });
  }

  try {
    const result = await validateYouTubeVideo(videoId);
    res.json(result);
  } catch (error) {
    logger.error('YouTube validation error:', error);
    res.status(500).json({ error: 'Failed to validate YouTube video' });
  }
});

// Legacy endpoint to maintain compatibility
router.get('/youtube-search', async (req, res) => {
  const { videoId } = req.query;
  
  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing videoId parameter' });
  }

  try {
    const result = await validateYouTubeVideo(videoId);
    res.json({ isValid: result.isValid });
  } catch (error) {
    logger.error('YouTube search error:', error);
    res.status(500).json({ error: 'Failed to validate YouTube video' });
  }
});

export default router;
