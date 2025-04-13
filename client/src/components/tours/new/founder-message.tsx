import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

/**
 * Founder message dialog that displays automatically at the end of the tour
 */
export default function FounderMessage() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check URL parameter
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const shouldOpen = params.get('openFounderMessage') === 'true';
      
      if (shouldOpen) {
        setIsOpen(true);
        // Clean up URL parameter after opening
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    // Check on mount
    handlePopState();
    
    // Listen for popstate events (for back/forward navigation)
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl p-0 overflow-auto max-h-[90vh] bg-gray-50">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="p-6 md:p-8">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-indigo-800 mb-4">
            Why Fundamenta
          </h2>
          
          <div className="text-center mb-6 italic text-gray-700 px-4 md:px-12 text-base md:text-lg">
            "Knowing your Why is the only way to maintain lasting success and fulfillment in whatever you do."
            <div className="text-right mt-2">—Simon Sinek</div>
          </div>
          
          <div className="border-t border-b py-6 space-y-4 text-base md:text-lg">
            <p>
              I created Fundamenta because I believe every young person deserves to enter adulthood with confidence—not confusion. When I left home at 17 with $300 and ambition, I lacked direction, not motivation.
            </p>
            
            <p>
              This platform empowers young adults with the tools and knowledge they need to succeed on their own terms. It bridges the gap between where you are and where you're going—turning questions into skills, uncertainty into action, and potential into progress.
            </p>
            
            <p>
              This is why Fundamenta exists: to make sure knowing what to do next doesn't feel like a mystery, to help you define success by your own values, and to give purpose the tools it needs to grow.
            </p>
            
            <p className="text-center font-medium mt-6">
              It's fun. It's fundamental. It's Fundamenta.
            </p>
          </div>
          
          <div className="text-right mt-4">
            <p className="font-semibold">—Matthew Bishop</p>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}