import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Copy, 
  Share2, 
  Check, 
  Link as LinkIcon 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SocialSharingProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  onShare?: () => void;
}

export function SocialShare({ title, description, imageUrl, url, onShare }: SocialSharingProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Use the current URL if none provided
  const shareUrl = url || window.location.href;
  
  // Create share text for social media
  const shareText = `${title} - ${description}`.substring(0, 280);
  
  // Handle sharing to different platforms
  const handleShare = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via a link. We'll inform the user
        toast({
          title: "Instagram Sharing",
          description: "To share on Instagram, please capture a screenshot and share it from your Instagram app.",
          duration: 5000,
        });
        setIsDialogOpen(false);
        
        // Call onShare callback if provided
        if (onShare) {
          onShare();
        }
        return;
    }
    
    // Open a new window for sharing
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
      
      // Call onShare callback if provided
      if (onShare) {
        onShare();
      }
    }
    
    // Close the dialog
    setIsDialogOpen(false);
  };
  
  // Handle copying the link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to your clipboard.",
        duration: 3000,
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    });
  };
  
  // Helper function to check if we're on a mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  // Handle the native share API for mobile devices
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: shareUrl,
      })
      .then(() => {
        toast({
          title: "Shared Successfully!",
          description: "Your achievement has been shared.",
          duration: 3000,
        });
        
        // Call onShare callback if provided
        if (onShare) {
          onShare();
        }
      })
      .catch(error => {
        console.error('Error sharing:', error);
        setIsDialogOpen(true); // Open the dialog as fallback
      });
    } else {
      setIsDialogOpen(true); // Open the dialog if Web Share API is not available
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={isMobile() ? handleNativeShare : () => setIsDialogOpen(true)}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share This Achievement</DialogTitle>
            <DialogDescription>
              Share your success with your network or copy the link.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-4 py-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full p-6" 
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                    <span className="sr-only">Share on Twitter</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on Twitter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full p-6" 
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-6 w-6 text-[#4267B2]" />
                    <span className="sr-only">Share on Facebook</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on Facebook</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full p-6" 
                    onClick={() => handleShare('instagram')}
                  >
                    <Instagram className="h-6 w-6 text-[#E1306C]" />
                    <span className="sr-only">Share on Instagram</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on Instagram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full p-6" 
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="h-6 w-6 text-[#0077B5]" />
                    <span className="sr-only">Share on LinkedIn</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on LinkedIn</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: '200px' }}>{shareUrl}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyLink}
                  className="px-3"
                >
                  {linkCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Achievement Card with Social Sharing
interface SharableAchievementProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  unlocked: boolean;
  date?: Date;
  category: string;
  points: number;
  onShare?: () => void;
}

export function SharableAchievement({
  id,
  title,
  description,
  imageUrl,
  unlocked,
  date,
  category,
  points,
  onShare
}: SharableAchievementProps) {
  const achievementUrl = `${window.location.origin}/arcade/achievements/${id}`;
  
  // Handle sharing of achievement
  const handleShareAchievement = () => {
    if (onShare) {
      onShare();
    }
  };
  
  return (
    <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Achievement Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            +{points} pts
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {unlocked 
              ? `Unlocked: ${date ? new Date(date).toLocaleDateString() : 'Recently'}` 
              : 'Locked'}
          </span>
          
          {unlocked && (
            <SocialShare
              title={`I just earned the "${title}" achievement!`}
              description={description}
              url={achievementUrl}
              imageUrl={imageUrl}
              onShare={handleShareAchievement}
            />
          )}
        </div>
      </div>
    </div>
  );
}