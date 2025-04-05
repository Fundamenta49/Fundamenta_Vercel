import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Calendar from "@/components/simple-calendar";

/**
 * Sidebar Calendar component
 * Uses Calendar for a clean, reliable calendar experience
 */
export default function SidebarCalendar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left text-gray-700 hover:bg-gray-50"
        onClick={() => setIsOpen(true)}
      >
        <CalendarDays className="h-5 w-5 text-gray-600" />
        <span className="font-medium">Calendar</span>
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <Calendar />
          </div>
        </div>
      )}
    </>
  );
}