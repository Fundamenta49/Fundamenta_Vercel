import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Event {
  title: string;
  date: string; // format: "yyyy-MM-dd"
}

interface CalendarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SimpleCalendar({ isOpen, onOpenChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<string>("");

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;
    
    const key = format(selectedDate, "yyyy-MM-dd");
    const updatedEvents = { ...events };
    if (!updatedEvents[key]) updatedEvents[key] = [];
    updatedEvents[key].push(newEvent);
    setEvents(updatedEvents);
    setNewEvent("");
    setShowEventModal(false);
  };

  const header = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <Button onClick={prevMonth} variant="ghost" size="sm" className="text-indigo-600 font-bold">←</Button>
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button onClick={nextMonth} variant="ghost" size="sm" className="text-indigo-600 font-bold">→</Button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 text-center text-gray-600 font-medium mb-2">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const cells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const key = format(cloneDay, "yyyy-MM-dd");
        const hasEvents = events[key] && events[key].length > 0;

        days.push(
          <div
            className={`p-2 text-center rounded-lg cursor-pointer hover:bg-indigo-200 transition-all relative ${
              !isSameMonth(day, monthStart) ? "text-gray-400" : "text-gray-800"
            } ${isSameDay(day, selectedDate) ? "bg-indigo-500 text-white" : ""}`}
            key={day.toISOString()}
            onClick={() => handleDayClick(cloneDay)}
          >
            {formattedDate}
            {hasEvents && <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></span>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-1" key={day.toISOString()}>{days}</div>);
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const eventsList = () => {
    const key = format(selectedDate, "yyyy-MM-dd");
    const dayEvents = events[key] || [];

    if (dayEvents.length === 0) return null;

    return (
      <div className="mt-4 border-t pt-4">
        <h3 className="font-medium text-gray-700 mb-2">Events for {format(selectedDate, "MMMM d, yyyy")}</h3>
        <ul className="space-y-1">
          {dayEvents.map((event, index) => (
            <li key={index} className="p-2 bg-gray-50 rounded">{event}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white shadow-xl rounded-lg p-4 sm:p-6 focus:outline-none max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg font-semibold">Calendar</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="calendar-container">
          {header()}
          {daysOfWeek()}
          {cells()}
          {eventsList()}
        </div>

        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Add Event - {format(selectedDate, "PPP")}</h3>
              <Input
                type="text"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Event name"
                className="w-full p-3 mb-4"
              />
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowEventModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEvent}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}