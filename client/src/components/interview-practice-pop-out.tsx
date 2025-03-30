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
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={`p-0 overflow-hidden ${maxWidth} w-full h-[90vh] max-h-[90vh]`}
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-blue-500 text-white">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-blue-50 mt-1">
                    {description}
                  </DialogDescription>
                )}
              </div>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-blue-600 rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}