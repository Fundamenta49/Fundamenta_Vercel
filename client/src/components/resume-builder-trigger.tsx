import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import ResumeBuilderFullscreen from "./resume-builder-fullscreen";

interface ResumeBuilderTriggerProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean; 
  label?: string;
  className?: string;
}

/**
 * Trigger button component for the Resume Builder
 * Opens the Resume Builder in a full-screen dialog when clicked
 */
export function ResumeBuilderTrigger({ 
  variant = "default", 
  size = "default", 
  fullWidth = false,
  label = "Resume Builder", 
  className = ""
}: ResumeBuilderTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
        onClick={() => setOpen(true)}
      >
        <FileText className="mr-2 h-4 w-4" />
        {label}
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-screen-2xl w-[95vw] h-[90vh] p-0">
          <ResumeBuilderFullscreen onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ResumeBuilderTrigger;