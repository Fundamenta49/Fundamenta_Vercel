import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface PinkCloseButtonProps {
  onClose: () => void;
  className?: string;
}

export function PinkCloseButton({ onClose, className = "" }: PinkCloseButtonProps) {
  console.log("PinkCloseButton rendered");
  
  const handleClick = (e: React.MouseEvent) => {
    console.log("PinkCloseButton clicked");
    e.stopPropagation();
    onClose();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`absolute right-4 top-4 rounded-full p-2 opacity-100 
        bg-pink-300 hover:bg-pink-400 text-pink-800 border border-pink-400 
        shadow-md z-[9999] ${className}`}
      onClick={handleClick}
      style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </Button>
  );
}