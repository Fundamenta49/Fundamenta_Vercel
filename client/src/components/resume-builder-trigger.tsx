import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import ResumeBuilderFullscreen from "./resume-builder-fullscreen";

interface ResumeBuilderTriggerProps {
  buttonSize?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  buttonText?: string;
}

export default function ResumeBuilderTrigger({
  buttonSize = "default",
  variant = "default",
  className,
  buttonText = "Resume Builder"
}: ResumeBuilderTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openBuilder = () => {
    setIsOpen(true);
    // Disable body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeBuilder = () => {
    setIsOpen(false);
    // Re-enable body scroll when modal is closed
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Button
        size={buttonSize}
        variant={variant}
        className={className}
        onClick={openBuilder}
      >
        <FileText className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>

      {isOpen && <ResumeBuilderFullscreen onClose={closeBuilder} />}
    </>
  );
}