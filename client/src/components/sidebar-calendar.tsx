import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
        
        <DialogContent className="w-full max-w-5xl h-[85vh] p-0 flex flex-col overflow-hidden">
          <div className="p-2 sm:p-4 pb-0">
            <WeatherWidget compact={true} className="shadow-sm" />
          </div>
          <div className="p-2 sm:p-4 flex-1 overflow-hidden flex flex-col">
            <CalendarRedesigned />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}