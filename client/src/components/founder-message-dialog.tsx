import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/components/ui/paper-texture.css";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FounderMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FounderMessageDialog({ open, onOpenChange }: FounderMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/20 backdrop-blur-[1px]" />
      <DialogContent className="bg-transparent border-0 shadow-none p-0 w-[90vw] sm:w-auto md:max-w-4xl xl:max-w-5xl">
        <VisuallyHidden>
          <DialogTitle>Why Fundamenta</DialogTitle>
        </VisuallyHidden>
        
        {/* Decorative paperclip */}
        <div className="absolute -top-4 left-8 z-10 w-8 h-12 bg-gray-400 rounded-sm transform rotate-45 opacity-80"></div>
        
        {/* Letter styling with subtle paper texture and slight rotation */}
        <div className="relative paper-texture letter-shadow border border-[#e9e4d5] transform rotate-[0.5deg] px-6 py-5 sm:px-10 sm:py-7 rounded-sm">
          {/* Custom close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="absolute right-3 top-3 text-gray-500 hover:bg-transparent"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Letter header */}
          <div className="text-center mb-4 md:mb-5 border-b border-gray-300 pb-3 md:pb-4">
            <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-indigo-900">Why Fundamenta</h2>
            <p className="italic text-base md:text-lg mt-2 md:mt-3">
              "Knowing your Why is the only way to maintain lasting success and fulfillment in whatever you do."
            </p>
            <p className="text-right font-medium text-xs md:text-sm mt-1">—Simon Sinek</p>
          </div>
          
          {/* Letter content with the look of a personal note */}
          <div className="space-y-3 font-serif text-base md:text-lg leading-relaxed text-gray-800">
            <p>
              I created Fundamenta because I believe every young person deserves to enter adulthood with confidence—not confusion. 
              When I left home at 17 with $300 and ambition, I lacked direction, not motivation. Growing up doesn't automatically prepare you for what life throws at you.
            </p>
            
            <p>
              This platform empowers young adults with the tools and knowledge they need to succeed on their own terms.
              It bridges the gap between where you are and where you're going—turning questions into skills, uncertainty into action, and potential into progress.
            </p>
            
            <p>
              This is why Fundamenta exists: to make sure knowing what to do next doesn't feel like a mystery,
              to help you define success by your own values, and to give purpose the tools it needs to grow.
            </p>
            
            <p className="font-medium text-center mt-4 md:mt-5">
              It's fun. It's fundamental. It's Fundamenta.
            </p>
            
            {/* Signature styling */}
            <div className="mt-4 md:mt-5 border-t border-gray-300 pt-2 md:pt-3">
              <p className="text-right italic">
                —Matthew Bishop<br />
                <span className="text-sm font-normal">Founder & CEO</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}