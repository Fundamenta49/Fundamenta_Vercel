import {
  Dialog,
  DialogContent,
  DialogOverlay
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/components/ui/paper-texture.css";

interface FounderMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FounderMessageDialog({ open, onOpenChange }: FounderMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent className="bg-transparent border-0 shadow-none overflow-y-auto p-0 max-w-2xl max-h-[85vh]" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        {/* Decorative paperclip */}
        <div className="absolute -top-4 left-8 z-10 w-8 h-12 bg-gray-400 rounded-sm transform rotate-45 opacity-80"></div>
        
        {/* Letter styling with subtle paper texture and slight rotation */}
        <div className="relative paper-texture letter-shadow border border-[#e9e4d5] transform rotate-[0.5deg] px-6 py-5 md:px-8 md:py-6 rounded-sm">
          {/* Custom close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="absolute right-2 top-2 text-gray-500 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Letter header */}
          <div className="text-center mb-4 border-b border-gray-300 pb-3">
            <h2 id="dialog-title" className="text-2xl font-serif tracking-wide text-indigo-900">Why Fundamenta</h2>
            <p className="italic text-base mt-2">
              "Knowing your Why is the only way to maintain lasting success and fulfillment in whatever you do."
            </p>
            <p className="text-right font-medium text-xs mt-1">—Simon Sinek</p>
          </div>
          
          {/* Letter content with the look of a personal note */}
          <div id="dialog-description" className="space-y-3 font-serif text-base leading-relaxed text-gray-800 overflow-y-auto max-h-[40vh] pr-1">
            <p>
              I created Fundamenta because I believe every young person deserves the chance to move into adulthood with confidence—not confusion. 
              When I left home at 17 with $300 and a head full of ambition, I didn't lack motivation—I lacked direction. 
              And I learned quickly that growing up doesn't automatically mean being prepared for what life throws at you.
            </p>
            
            <p>
              This section isn't just about my Why—it's about helping you discover yours. 
              Fundamenta exists to empower young adults with the tools, knowledge, and support they need to succeed on their own terms. 
              For parents, it's not a sign you've failed—it's a sign you care. For users, it's a sign that you're ready to take control.
            </p>
            
            <p>
              This platform bridges the gap between where you are and where you're going. 
              It turns questions into skills, uncertainty into action, and potential into progress. 
              Whether you're just starting out or trying to get back on track, you don't have to do it alone.
            </p>
            
            <p>
              This is why Fundamenta exists: to make sure knowing what to do next doesn't feel like a mystery,
              to help you define success by your own values, and to give purpose the tools it needs to grow.
            </p>
            
            <p className="font-medium text-center mt-4">
              It's fun. It's fundamental. It's Fundamenta.
            </p>
            
            {/* Signature styling */}
            <div className="mt-4 border-t border-gray-300 pt-2">
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