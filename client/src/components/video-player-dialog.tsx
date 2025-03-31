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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl pr-8">{title}</DialogTitle>
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="aspect-video w-full">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        
        {description && (
          <ScrollArea className="p-4 max-h-[120px]">
            <p className="text-sm text-gray-600">{description}</p>
          </ScrollArea>
        )}
        
        <DialogFooter className="p-4 pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Watch on YouTube
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}