import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from "date-fns";
import { X } from "lucide-react";
import { calendarService, CalendarEvent } from "@/services/calendar-service";
import { EventCategory } from "@/components/event-form";

// Map event categories to colors
const categoryColors: Record<EventCategory, string> = {
  work: "bg-blue-500",
  personal: "bg-purple-500",
  family: "bg-pink-500",
  school: "bg-yellow-500",
  health: "bg-green-500",
  finance: "bg-emerald-500",
  other: "bg-gray-500"
};

export default function StandaloneCalendar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>("personal");

  // Load events when component mounts
  useEffect(() => {
    if (isOpen) {
      loadEvents();
    }
  }, [isOpen]);

  // Load events from calendar service
  const loadEvents = () => {
    const events = calendarService.getEvents();
    setCalendarEvents(events);
  };

  if (!isOpen) return null;

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    
    // Create event using calendar service
    const newEvent = {
      title: newEventTitle,
      date: selectedDate,
      category: newEventCategory,
    };
    
    calendarService.addEvent(newEvent);
    loadEvents(); // Reload events
    
    // Reset form
    setNewEventTitle("");
    setNewEventCategory("personal");
    setShowModal(false);
  };

  // Get events for a specific day
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    const dateString = format(date, "yyyy-MM-dd");
    return calendarEvents.filter(event => {
      const eventDateStr = format(event.date, "yyyy-MM-dd");
      return eventDateStr === dateString;
    });
  };

  const header = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={prevMonth} className="text-indigo-600 font-bold">←</button>
      <h2 className="text-xl font-semibold text-gray-800">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button onClick={nextMonth} className="text-indigo-600 font-bold">→</button>
    </div>
  );

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
        const dayKey = format(day, "yyyy-MM-dd");
        const cloneDay = new Date(day);
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const dayEvents = getEventsForDay(day);
        const hasEvents = dayEvents.length > 0;
        
        let eventColor = "";
        if (hasEvents && dayEvents[0].category) {
          eventColor = categoryColors[dayEvents[0].category as EventCategory] || "bg-gray-500";
        }

        days.push(
          <div
            key={dayKey}
            onClick={() => handleDayClick(cloneDay)}
            className={`relative p-2 h-16 flex items-center justify-center rounded-lg cursor-pointer 
              transition-all duration-150
              ${isSelected ? "bg-indigo-500 text-white" : ""}
              ${!isCurrentMonth ? "text-gray-400" : "text-gray-800"} 
              hover:bg-indigo-200`}
          >
            <span>{formattedDate}</span>
            {hasEvents && (
              <span className={`absolute bottom-1 w-2 h-2 rounded-full ${eventColor}`}></span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={`row-${format(day, "yyyy-MM-dd")}`}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" id="standalone-calendar-modal">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative" style={{
        position: "relative",
        top: "auto",
        left: "auto",
        transform: "none",
        margin: "auto",
        maxHeight: "90vh",
        maxWidth: "450px",
        width: "90%",
        overflowY: "auto"
      }}>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        {header()}
        {daysOfWeek()}
        {cells()}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]" id="calendar-event-modal">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full" style={{
              position: "relative",
              margin: "auto",
              maxWidth: "400px",
              width: "90%"
            }}>
              <h3 className="text-lg font-semibold mb-4">Add Event - {format(selectedDate, "PPP")}</h3>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
              <select
                value={newEventCategory}
                onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="family">Family</option>
                <option value="school">School</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}