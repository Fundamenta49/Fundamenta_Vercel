import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InterviewPracticePopOutProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function InterviewPracticePopOut({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-4xl",
}: InterviewPracticePopOutProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={`p-0 overflow-hidden ${maxWidth} w-full h-[90vh] max-h-[90vh] md:rounded-xl rounded-lg shadow-xl border-blue-100`}
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="px-4 md:px-6 py-4 md:py-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-b border-blue-600">
            <div className="flex justify-between items-center">
              <div className={isMobile ? "w-[85%]" : ""}>
                <DialogTitle className="text-lg md:text-xl font-semibold tracking-tight">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-blue-50 mt-1 md:mt-1.5 opacity-90 text-sm md:text-base">
                    {description}
                  </DialogDescription>
                )}
              </div>
              <Button
                variant="ghost"
                className="h-8 w-8 md:h-9 md:w-9 p-0 text-white hover:bg-blue-600/50 hover:text-white rounded-full transition-colors flex-shrink-0"
                onClick={onClose}
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 bg-white">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}