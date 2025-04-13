import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import "@/components/ui/paper-texture.css";

// Custom Dialog Content without default close button
const NoCloseDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay 
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-300" 
    />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 grid w-[90vw] max-w-3xl xl:max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 bg-transparent p-0 shadow-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg border-0 ${className}`}
      {...props}
    />
  </DialogPrimitive.Portal>
));
NoCloseDialogContent.displayName = "NoCloseDialogContent";

interface FounderMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FounderMessageDialog({ open, onOpenChange }: FounderMessageDialogProps) {
  const isMobile = useIsMobile();
  const descriptionId = React.useId();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <NoCloseDialogContent aria-describedby={descriptionId}>
        {/* Add visually hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">Why Fundamenta</DialogTitle>
        
        {/* Add visually hidden Description for accessibility */}
        <DialogDescription id={descriptionId} className="sr-only">
          A letter from the founder of Fundamenta explaining the mission and purpose of the platform
        </DialogDescription>
        
        {/* Decorative paperclip */}
        <div className="absolute -top-4 left-8 z-10 w-8 h-12 bg-gray-400 rounded-sm transform rotate-45 opacity-80"></div>
        
        {/* Letter styling with subtle paper texture and slight rotation */}
        <div className="relative paper-texture letter-shadow border border-[#e9e4d5] transform rotate-[0.5deg] px-4 py-4 sm:px-10 sm:py-7 rounded-sm">
          {/* Custom close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="absolute right-2 top-2 sm:right-3 sm:top-3 text-gray-500 hover:bg-transparent"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          {/* Letter header */}
          <div className="text-center mb-3 md:mb-5 border-b border-gray-300 pb-2 md:pb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-wide text-indigo-900">Why Fundamenta</h2>
            <p className="italic text-sm sm:text-base md:text-lg mt-1 sm:mt-2 md:mt-3">
              "Knowing your Why is the only way to maintain lasting success and fulfillment in whatever you do."
            </p>
            <p className="text-right font-medium text-xs md:text-sm mt-1">—Simon Sinek</p>
          </div>
          
          {/* Letter content with the look of a personal note - mobile optimized */}
          <div 
            className={`
              space-y-2 sm:space-y-3 
              font-serif 
              text-sm sm:text-base md:text-lg 
              leading-snug sm:leading-relaxed 
              text-gray-800
              ${isMobile ? 'max-h-[60vh] overflow-y-auto pr-1 letter-scroll' : ''}
            `}
          >
            <p>
              I created Fundamenta because I believe every young person deserves to enter adulthood with confidence—not confusion. 
              When I left home at 17 with $300 and ambition, I lacked direction, not motivation.
            </p>
            
            <p>
              This platform empowers young adults with the tools and knowledge they need to succeed on their own terms.
              It bridges the gap between where you are and where you're going—turning questions into skills, uncertainty into action, and potential into progress.
            </p>
            
            <p>
              This is why Fundamenta exists: to make sure knowing what to do next doesn't feel like a mystery,
              to help you define success by your own values, and to give purpose the tools it needs to grow.
            </p>
            
            <p className="font-medium text-center mt-3 md:mt-5">
              It's fun. It's fundamental. It's Fundamenta.
            </p>
            
            {/* Signature styling */}
            <div className="mt-3 md:mt-5 border-t border-gray-300 pt-2 md:pt-3">
              <p className="text-right italic">
                —Matthew Bishop<br />
                <span className="text-sm font-normal">Founder & CEO</span>
              </p>
            </div>
          </div>
        </div>
      </NoCloseDialogContent>
    </Dialog>
  );
}