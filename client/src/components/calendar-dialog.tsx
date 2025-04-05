import { useState } from "react";
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
  subMonths
} from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CalendarEvent {
  name: string;
  type: string;
}

type EventsMap = Record<string, CalendarEvent[]>;

const eventTypeColors = {
  default: "bg-red-500",
  meeting: "bg-blue-500",
  task: "bg-green-500",
  reminder: "bg-yellow-500"
};

export default function CalendarDialog({ isOpen, onClose }: CalendarDialogProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<EventsMap>({});
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [eventType, setEventType] = useState("default");

  if (!isOpen) return null;

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    const key = format(selectedDate, "yyyy-MM-dd");
    const updatedEvents = { ...events };
    if (!updatedEvents[key]) updatedEvents[key] = [];
    updatedEvents[key].push({ name: newEvent, type: eventType });
    setEvents(updatedEvents);
    setNewEvent("");
    setEventType("default");
    setShowModal(false);
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
        const hasEvents = events[dayKey] && events[dayKey].length > 0;
        const eventColor = hasEvents ? 
          eventTypeColors[events[dayKey][0].type as keyof typeof eventTypeColors] || "bg-gray-500" : "";

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        
        {header()}
        {daysOfWeek()}
        {cells()}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Add Event - {format(selectedDate, "PPP")}</h3>
              <input
                type="text"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Event name"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              >
                <option value="default">Default</option>
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
                <option value="reminder">Reminder</option>
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