import { useState } from "react";
import { CalendarDays } from "lucide-react";
import StandaloneCalendar from "@/components/standalone-calendar";

/**
 * Sidebar Calendar component
 * Uses StandaloneCalendar for a clean, reliable calendar experience
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
      
      <StandaloneCalendar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}