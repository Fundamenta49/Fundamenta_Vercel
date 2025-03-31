import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none p-0 m-0 rounded-none border-none">
        <div className="absolute top-4 right-4 z-50">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-10 w-10 p-0 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 border-none"
          >
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>
        
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 w-full bg-black flex items-center justify-center">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          
          {description && (
            <div className="bg-white p-4 w-full">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-xl">{title}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[120px]">
                <p className="text-sm text-gray-600">{description}</p>
              </ScrollArea>
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch on YouTube
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}