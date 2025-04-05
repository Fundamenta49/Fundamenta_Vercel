import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, X } from "lucide-react";
import CalendarRedesigned from "@/components/calendar-redesigned";
import { Button } from "@/components/ui/button";

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
          className="calendar-dialog-container p-0 bg-background shadow-xl flex flex-col"
          aria-describedby="calendar-dialog-description"
        >
          <div id="calendar-dialog-description" className="sr-only">
            Interactive calendar for managing events and appointments
          </div>
          <div className="flex items-center justify-between p-3 border-b">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-3">
            <CalendarRedesigned />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}