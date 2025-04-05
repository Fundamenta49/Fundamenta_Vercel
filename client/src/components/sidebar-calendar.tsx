import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import { Calendar as CalendarPrimitive } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

/**
 * Sidebar Calendar component
 * Uses the simple Calendar primitive instead of the complex calendar
 */
export default function SidebarCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left text-gray-700 hover:bg-gray-50">
            <CalendarDays className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Calendar</span>
          </button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md p-6">
          <DialogTitle>Calendar</DialogTitle>
          <DialogDescription>
            View and select dates on the calendar.
          </DialogDescription>
          <div className="flex justify-center py-4">
            <CalendarPrimitive
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}