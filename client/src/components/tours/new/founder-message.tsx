import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">A Message from Our Founder</DialogTitle>
          <DialogDescription className="text-lg">
            Why we built Fundamenta
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 text-base">
          <p>
            Dear Friend,
          </p>
          
          <p>
            Thank you for joining us on this journey with Fundamenta. We created this platform because we believe that life skills shouldn't be hard to learn, and everyone deserves access to the knowledge they need to thrive.
          </p>
          
          <p>
            Too often, we find ourselves facing challenges that no one prepared us for – from managing finances to maintaining our wellbeing, from building careers to handling everyday emergencies. Fundamenta exists to fill these gaps, providing practical guidance and tools that make life more manageable.
          </p>
          
          <p>
            Our mission is simple: to empower you with the skills, knowledge, and confidence to navigate life's challenges. With Fundi as your AI companion, we hope to make this learning journey not just valuable, but also engaging and even fun.
          </p>
          
          <p>
            We're constantly growing and improving based on your feedback, so please don't hesitate to let us know how we can better serve your needs.
          </p>
          
          <p>
            Here's to building a more capable, confident you!
          </p>
          
          <p className="font-semibold">
            Warmly,<br />
            The Fundamenta Team
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose} size="lg">
            Start My Journey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}