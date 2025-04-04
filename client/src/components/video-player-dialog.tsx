import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, X, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { EmbeddedYouTubePlayer } from './embedded-youtube-player';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface VideoPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  title: string;
  description?: string;
}

export function VideoPlayerDialog({
  open,
  onOpenChange,
  videoId,
  title,
  description
}: VideoPlayerDialogProps) {
  // Log the video ID for debugging
  console.log('VideoPlayerDialog received videoId:', videoId);
  
  const [playerError, setPlayerError] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Handle player error
  const handlePlayerError = () => {
    setPlayerError(true);
    toast({
      title: "Video Error",
      description: "There was a problem loading this video. Please try again or watch on YouTube.",
      variant: "destructive"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none p-0 m-0 rounded-none border-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description || `Video: ${title}`}</DialogDescription>
        
        <div className="absolute top-4 right-4 z-50">
          <Button 
            variant="outline"
            aria-label="Close video"
            onClick={() => onOpenChange(false)} 
            className="h-10 w-10 p-0 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 border-none"
          >
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>
        
        <div className="w-full h-full flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 h-full bg-black flex-shrink-0 flex items-center justify-center">
            {playerError ? (
              <div className="flex flex-col items-center justify-center text-white p-6 text-center h-full">
                <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
                <h3 className="text-xl font-medium mb-2">Video Playback Error</h3>
                <p className="mb-4">We couldn't load this video. It might be unavailable or there could be a connection issue.</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
                  className="text-white border-white hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Try watching on YouTube
                </Button>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <EmbeddedYouTubePlayer
                  videoId={videoId}
                  title={title}
                  autoplay={true}
                  onError={handlePlayerError}
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
          
          {description && (
            <div className="bg-white p-4 md:p-6 w-full md:w-1/4 border-t md:border-t-0 md:border-l shadow-sm flex flex-col h-auto md:h-full overflow-auto">
              <h2 className="text-xl font-semibold pb-2 border-l-4 border-learning-color pl-3">{title}</h2>
              <ScrollArea className="flex-grow mb-4 max-h-[120px] md:max-h-none">
                <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
              </ScrollArea>
              <div className="pt-2 flex justify-between items-center mt-auto">
                <p className="text-xs text-gray-500 hidden md:block">
                  This content is provided for educational purposes
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-learning-color border-learning-color/30 hover:bg-learning-color hover:text-white ml-auto"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch on YouTube
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}