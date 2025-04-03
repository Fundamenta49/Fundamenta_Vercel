import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock } from 'lucide-react';
import { CookingVideo } from '@/lib/cooking-videos-service';
import { EmbeddedYouTubePlayer } from './embedded-youtube-player';

interface CookingVideoCardProps {
  video: CookingVideo;
  onPlay: (video: CookingVideo) => void;
  showEmbedded?: boolean;
}

export const CookingVideoCard: React.FC<CookingVideoCardProps> = ({ 
  video, 
  onPlay,
  showEmbedded = false
}) => {
  // Render embedded player or thumbnail with play overlay
  const renderVideoPreview = () => {
    if (showEmbedded) {
      return (
        <div className="aspect-video overflow-hidden">
          <EmbeddedYouTubePlayer
            videoId={video.youTubeId}
            title={video.title}
            className="w-full"
          />
        </div>
      );
    } else {
      return (
        <div 
          className="relative aspect-video cursor-pointer overflow-hidden"
          onClick={() => onPlay(video)}
        >
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayCircle className="h-12 w-12 text-white" />
          </div>
          {video.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs rounded px-1.5 py-0.5 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {Math.floor(video.length / 60)}:{(video.length % 60).toString().padStart(2, '0')}
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge 
              className={
                video.difficulty === 'beginner' 
                  ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                  : video.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
              }
            >
              {video.difficulty ? `${video.difficulty.charAt(0).toUpperCase()}${video.difficulty.slice(1)}` : 'Beginner'}
            </Badge>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow border-t-2 border-t-learning-color">
      {renderVideoPreview()}
      
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base line-clamp-2 h-12">{video.title}</CardTitle>
        {video.description && (
          <CardDescription className="line-clamp-2 text-xs mt-1">{video.description}</CardDescription>
        )}
      </CardHeader>
      
      {!showEmbedded && (
        <CardFooter className="p-3 pt-0 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-learning-color hover:text-learning-color/90 hover:bg-learning-color/10"
            onClick={() => onPlay(video)}
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            Watch Video
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};