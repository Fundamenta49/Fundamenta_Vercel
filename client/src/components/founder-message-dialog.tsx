import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quote } from "lucide-react";

interface FounderMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FounderMessageDialog({ open, onOpenChange }: FounderMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-indigo-50 to-purple-50">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            Why Fundamenta
          </DialogTitle>
          <DialogDescription className="text-lg italic">
            "Knowing your Why is the only way to maintain lasting success and fulfillment in whatever you do."
            <span className="block text-right font-medium">—Simon Sinek</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 prose text-muted-foreground max-w-none mt-4">
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
          
          <p className="font-medium text-lg text-indigo-900 text-center mt-6">
            It's fun. It's fundamental. It's Fundamenta.
          </p>
          
          <p className="text-right italic mt-8">
            —Matthew Bishop, Founder & CEO
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}