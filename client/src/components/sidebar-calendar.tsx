import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import CalendarRedesigned from "@/components/calendar-redesigned";
import WeatherWidget from "@/components/weather-widget";

/**
 * Sidebar Calendar component
 * Wraps the redesigned calendar in a dialog for use in the sidebar
 */
export default function SidebarCalendar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left text-gray-700 hover:bg-gray-50">
            <CalendarDays className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Calendar</span>
          </button>
        </DialogTrigger>
        
        <DialogContent 
          className="w-[95vw] sm:w-[90vw] md:max-w-5xl p-0 flex flex-col overflow-auto" 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: 'auto',
            maxHeight: '90vh'
          }}
        >
          <DialogTitle className="sr-only">Calendar</DialogTitle>
          <div className="p-2 sm:p-3 pb-0 border-b">
            <WeatherWidget compact={true} className="shadow-sm" />
          </div>
          <div className="p-2 sm:p-3 flex-1 overflow-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
            <CalendarRedesigned />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}