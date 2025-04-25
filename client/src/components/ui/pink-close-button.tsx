import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface PinkCloseButtonProps {
  onClose: () => void;
  className?: string;
}

export function PinkCloseButton({ onClose, className = "" }: PinkCloseButtonProps) {
  console.log("PinkCloseButton rendered");
  
  // Add a keydown event listener to handle Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed, triggering onClose');
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);
  
  const handleClick = (e: React.MouseEvent) => {
    console.log("PinkCloseButton clicked");
    e.preventDefault();
    e.stopPropagation();
    
    // Find and click any native close buttons that might be in the DOM
    const closeButtons = document.querySelectorAll('[data-megadialog-close-button], [data-state="open"] button[aria-label="Close"]');
    if (closeButtons.length > 0) {
      console.log(`Found ${closeButtons.length} native close buttons, clicking them`);
      closeButtons.forEach(button => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
    }
    
    // Also call the provided onClose function
    onClose();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`rounded-full p-2 opacity-100 
        bg-pink-300 hover:bg-pink-400 text-pink-800 border border-pink-400 
        shadow-md z-50 ${className}`}
      onClick={handleClick}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </Button>
  );
}