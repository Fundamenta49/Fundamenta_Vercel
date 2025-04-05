import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type SelectSingleEventHandler, DayClickEventHandler, type DayContentProps } from "react-day-picker"
import { format, isWeekend, parseISO, getYear, getMonth, getDate } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Utility function to get user's locale
const getUserLocale = () => {
  try {
    return navigator.languages && navigator.languages.length > 0 
      ? navigator.languages[0] 
      : navigator.language || 'en-US';
  } catch (e) {
    return 'en-US';
  }
};

// List of major US holidays for 2025 - could be expanded or retrieved from an API
const HOLIDAYS_2025 = [
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-01-20', name: 'Martin Luther King Jr. Day' },
  { date: '2025-02-17', name: 'Presidents\' Day' },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-06-19', name: 'Juneteenth' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-10-13', name: 'Columbus Day' },
  { date: '2025-11-11', name: 'Veterans Day' },
  { date: '2025-11-27', name: 'Thanksgiving Day' },
  { date: '2025-12-25', name: 'Christmas Day' },
];

// List of major US holidays for 2024
const HOLIDAYS_2024 = [
  { date: '2024-01-01', name: 'New Year\'s Day' },
  { date: '2024-01-15', name: 'Martin Luther King Jr. Day' },
  { date: '2024-02-19', name: 'Presidents\' Day' },
  { date: '2024-05-27', name: 'Memorial Day' },
  { date: '2024-06-19', name: 'Juneteenth' },
  { date: '2024-07-04', name: 'Independence Day' },
  { date: '2024-09-02', name: 'Labor Day' },
  { date: '2024-10-14', name: 'Columbus Day' },
  { date: '2024-11-11', name: 'Veterans Day' },
  { date: '2024-11-28', name: 'Thanksgiving Day' },
  { date: '2024-12-25', name: 'Christmas Day' },
];

// Function to get holiday info for a specific date
const getHolidayForDate = (date: Date): string | null => {
  const year = getYear(date);
  const formattedDate = `${year}-${String(getMonth(date) + 1).padStart(2, '0')}-${String(getDate(date)).padStart(2, '0')}`;
  
  const holidayList = year === 2024 ? HOLIDAYS_2024 : HOLIDAYS_2025;
  const holiday = holidayList.find(h => h.date === formattedDate);
  
  return holiday ? holiday.name : null;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const locale = getUserLocale();
  
  // Function to render day content with holiday information
  const renderDay = (day: Date, modifiers: Record<string, boolean>) => {
    const holiday = getHolidayForDate(day);
    const isHoliday = Boolean(holiday);
    
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className={cn(
              "relative w-full h-full flex items-center justify-center",
              isHoliday && "font-semibold text-red-500"
            )}>
              {day.getDate()}
              {isHoliday && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>}
            </div>
          </TooltipTrigger>
          {isHoliday && (
            <TooltipContent side="bottom">
              <p>{holiday}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      formatters={{
        formatWeekdayName: (weekday) => {
          return format(weekday, 'EEE', { locale: locale === 'en-US' ? undefined : require('date-fns/locale/' + locale.split('-')[0]) });
        }
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-8",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4" aria-label="Previous month" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4" aria-label="Next month" {...props} />
        ),
        Day: (props: DayContentProps) => {
          const { date, displayMonth, children } = props;
          const holiday = getHolidayForDate(date);
          const isHoliday = Boolean(holiday);
          const isWeekendDay = isWeekend(date);
          
          return (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button 
                    {...props} 
                    className={cn(
                      props.className,
                      "relative",
                      (isHoliday || isWeekendDay) && "text-red-500"
                    )}
                  >
                    {children}
                    {isHoliday && (
                      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                </TooltipTrigger>
                {isHoliday && (
                  <TooltipContent side="bottom" className="bg-white text-black border-gray-200 shadow-md">
                    <p className="font-medium">{holiday}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        }
      }}
      aria-label="Calendar"
      aria-description="Calendar for selecting dates"
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }