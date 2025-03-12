// server/routes/youtube.ts
import { Request, Response, Router } from 'express';
import axios from 'axios';

const router = Router();

// YouTube search endpoint
router.get('/youtube-search', async (req: Request, res: Response) => {
  const { query, videoId } = req.query;

  try {
    // Function to directly validate a YouTube video ID
    if (videoId) {
      console.log(`Validating YouTube video ID: ${videoId}`);
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            params: {
              part: 'snippet,status',
              id: videoId,
              key: process.env.YOUTUBE_API_KEY,
            }
          }
        );

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

        return res.json({
          error: false,
          id: videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url
        });
      } catch (error) {
        console.error('YouTube validation error:', error);
        return res.json({
          error: true,
          message: 'Video not found or is unavailable'
        });
      }
    }

    // Search for videos
    if (query) {
      console.log(`Searching YouTube for query: ${query}`);
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: 'snippet',
              q: query,
              type: 'video',
              maxResults: 5,
              key: process.env.YOUTUBE_API_KEY
            }
          }
        );

        const searchResults = response.data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt
        }));

        return res.json({
          error: false,
          results: searchResults
        });
      } catch (error) {
        console.error("YouTube search API error:", error);
        return res.status(500).json({
          error: true,
          message: "Failed to search YouTube",
          details: (error as any).response?.data?.error?.message || (error as Error).message
        });
      }
    }

    res.status(400).json({ error: true, message: "Either videoId or query parameter is required" });
  } catch (error) {
    console.error("Unexpected error in YouTube search handler:", error);
    res.status(500).json({ error: true, message: "An unexpected error occurred" });
  }
});

export default router;

// server/index.ts (Updated)
import express from 'express';
import youtubeRoutes from './routes/youtube';
import chatRoutes from './routes/chat';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/youtube', youtubeRoutes);
app.use('/api/chat', chatRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});