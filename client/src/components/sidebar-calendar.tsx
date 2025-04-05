import { useState } from "react";
import { CalendarDays, X } from "lucide-react";

/**
 * Sidebar Calendar component
 * Shows a "Coming Soon" message instead of the calendar
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center justify-center py-8">
              <CalendarDays className="h-16 w-16 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Calendar Coming Soon</h3>
              <p className="text-gray-600 text-center mb-4">
                Our enhanced calendar feature is currently under development and will be available soon.
              </p>
              <p className="text-gray-500 text-sm text-center">
                Check back later for event tracking, reminders, and schedule management.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}