import { Request, Response, Router } from 'express';
import axios from 'axios';

const router = Router();

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

router.get('/validate', async (req: Request, res: Response) => {
    const videoId = req.query.videoId as string;
    const apiUrl = "https://www.googleapis.com/youtube/v3/videos";

    // Validate input
    if (!videoId) {
      return res.status(400).json({
        error: true,
        message: "Missing videoId parameter"
      });
    }

    console.log(`Validating YouTube video ID: ${videoId}`);

    try {
      // Check if YouTube API key is set
      if (!process.env.YOUTUBE_API_KEY) {
        console.error("YOUTUBE_API_KEY is not set in environment variables");
        // Return a fallback response when API key is missing
        return res.json({
          id: videoId,
          title: "Video title unavailable",
          error: false
        });
      }

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
        return res.json({
          error: true,
          message: "Video not found"
        });
      }

      const video = response.data.items[0];

      if (video.status.privacyStatus !== 'public') {
        console.log(`Video ${videoId} is not public. Status: ${video.status.privacyStatus}`);
        return res.json({
          error: true,
          message: "Video is not publicly available"
        });
      }

      console.log(`Successfully validated video ${videoId}`);

      res.json({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
        error: false
      });
    } catch (error) {
        console.error('YouTube API error:', error);
        // Add detailed error logging
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }

        // Provide more information in the response
        res.status(500).json({ 
          error: true, 
          message: 'Failed to validate YouTube video',
          details: error instanceof Error ? error.message : 'Unknown error'
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