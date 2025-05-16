import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

interface HeatmapProps {
  title: string;
  data: Array<{
    date: string;
    value: number;
  }>;
  className?: string;
  maxValue?: number;
  isLoading?: boolean;
}

export function Heatmap({
  title,
  data,
  className,
  maxValue: propMaxValue,
  isLoading = false,
}: HeatmapProps) {
  // Determine the maximum value for color scaling
  const maxValue = propMaxValue || Math.max(...data.map(d => d.value), 1);
  
  // Generate color intensity based on value
  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    
    const intensity = Math.min(Math.floor((value / maxValue) * 9) + 1, 9);
    return `bg-blue-${intensity}00`;
  };
  
  // Group data by week for display
  const weeks = React.useMemo(() => {
    if (data.length === 0) return [];
    
    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // First determine the day of week for the first date (0 = Sunday, 6 = Saturday)
    const firstDate = new Date(sortedData[0].date);
    const firstDayOfWeek = firstDate.getDay();
    
    // Create weeks array
    const weeks: Array<Array<{date: string; value: number} | null>> = [];
    let currentWeek: Array<{date: string; value: number} | null> = Array(7).fill(null);
    
    // Fill in days before the first date with nulls
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek[i] = null;
    }
    
    // Process all dates
    let currentDayOfWeek = firstDayOfWeek;
    
    sortedData.forEach(item => {
      // If we're at the end of a week, push the current week and start a new one
      if (currentDayOfWeek === 7) {
        weeks.push([...currentWeek]);
        currentWeek = Array(7).fill(null);
        currentDayOfWeek = 0;
      }
      
      // Add the current date to the current week
      currentWeek[currentDayOfWeek] = item;
      currentDayOfWeek++;
    });
    
    // Fill remaining days in the last week with nulls
    for (let i = currentDayOfWeek; i < 7; i++) {
      currentWeek[i] = null;
    }
    
    // Add the last week if it's not empty
    if (currentDayOfWeek > 0) {
      weeks.push([...currentWeek]);
    }
    
    return weeks;
  }, [data]);
  
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center">
              {dayLabels.map((day, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={cn(
                        "aspect-square rounded",
                        day === null ? "bg-transparent" : getColor(day.value)
                      )}
                      title={day ? `${day.date}: ${day.value}` : ""}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded bg-gray-100" />
                <div className="h-3 w-3 rounded bg-blue-200" />
                <div className="h-3 w-3 rounded bg-blue-400" />
                <div className="h-3 w-3 rounded bg-blue-600" />
                <div className="h-3 w-3 rounded bg-blue-800" />
              </div>
              <span>More</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}