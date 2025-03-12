import { Request, Response, Router } from 'express';
import axios from 'axios';

const router = Router();

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

router.get('/validate', async (req: Request, res: Response) => {
  const { videoId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: true, message: 'Missing or invalid videoId parameter' });
  }

  try {
    const result = await validateYouTubeVideo(videoId);
    console.log("YouTube validation response:", result);
    res.json(result);
  } catch (error) {
    console.error('YouTube validation error:', error);
    res.status(500).json({ error: true, message: 'Failed to validate YouTube video' });
  }
});

export default router;