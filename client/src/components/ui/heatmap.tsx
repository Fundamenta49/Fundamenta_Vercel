import React, { useMemo } from 'react';

interface HeatmapProps {
  data: Array<{ date: string; value: number }>;
  colorRange?: string[];
  startDate?: Date;
  endDate?: Date;
  className?: string;
}

/**
 * A heatmap component for displaying daily activity
 * 
 * @param data Array of objects with date (ISO string) and value properties
 * @param colorRange Optional array of color values for the heatmap gradient
 * @param startDate Optional start date for the heatmap
 * @param endDate Optional end date for the heatmap
 * @param className Optional additional CSS classes
 */
export function Heatmap({ 
  data,
  colorRange = ['#f3f4f6', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399'],
  startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  endDate = new Date(),
  className = ""
}: HeatmapProps) {
  // Input validation
  if (!Array.isArray(data)) {
    console.warn("Heatmap received invalid data:", data);
    data = [];
  }

  // Process dates to ensure they're valid
  const safeStartDate = startDate instanceof Date && !isNaN(startDate.getTime()) 
    ? startDate 
    : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
  const safeEndDate = endDate instanceof Date && !isNaN(endDate.getTime()) 
    ? endDate 
    : new Date();
  
  // Calculate days between start and end
  const days = Math.ceil((safeEndDate.getTime() - safeStartDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // Process data with defensive checks
  const processedData = useMemo(() => {
    try {
      // Create a map of date strings to values
      const dateMap = new Map<string, number>();
      
      // Initialize all dates with 0 value
      let currentDate = new Date(safeStartDate);
      while (currentDate <= safeEndDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dateMap.set(dateStr, 0);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Fill in actual values
      data.forEach(item => {
        try {
          if (!item?.date) return;
          
          const dateStr = new Date(item.date).toISOString().split('T')[0];
          if (dateMap.has(dateStr)) {
            const value = typeof item.value === 'number' && !isNaN(item.value) 
              ? item.value 
              : 0;
            dateMap.set(dateStr, value);
          }
        } catch (e) {
          console.warn("Error processing heatmap data item:", e);
        }
      });
      
      // Find max value for scaling
      const values = Array.from(dateMap.values());
      const maxValue = Math.max(...values, 1); // Prevent division by zero
      
      // Convert to array of objects with normalized values
      return Array.from(dateMap.entries()).map(([dateStr, value]) => ({
        date: dateStr,
        value,
        intensity: value / maxValue // Normalized value between 0 and 1
      }));
    } catch (e) {
      console.error("Error processing heatmap data:", e);
      return [];
    }
  }, [data, safeStartDate, safeEndDate]);
  
  // Generate calendar grid
  const weeks = useMemo(() => {
    // Group by week
    const weeks: Array<typeof processedData> = [];
    let currentWeek: typeof processedData = [];
    
    // Get the day of week for the start date (0 = Sunday, 6 = Saturday)
    const startDayOfWeek = safeStartDate.getDay();
    
    // Add empty cells for days before the start date
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: '', value: 0, intensity: 0 });
    }
    
    // Add all days
    processedData.forEach((day, index) => {
      const dayOfWeek = (startDayOfWeek + index) % 7;
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
    });
    
    // Add the last week if not empty
    if (currentWeek.length > 0) {
      // Fill in empty cells at the end
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', value: 0, intensity: 0 });
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [processedData, safeStartDate]);
  
  // Get appropriate color based on intensity
  const getColor = (intensity: number) => {
    if (colorRange.length === 0) return '#f3f4f6';
    if (colorRange.length === 1) return colorRange[0];
    
    // Clamp intensity between 0 and 1
    const safeIntensity = Math.max(0, Math.min(1, intensity));
    const index = Math.min(
      Math.floor(safeIntensity * (colorRange.length - 1)),
      colorRange.length - 2
    );
    
    return colorRange[index];
  };
  
  // Fallback for empty data
  if (processedData.length === 0) {
    return (
      <div className={`p-4 border rounded-md ${className}`}>
        <p className="text-sm text-muted-foreground text-center">No activity data available</p>
      </div>
    );
  }
  
  // Format a date for screen readers and tooltips
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className={`p-4 border rounded-md ${className}`} aria-label="Activity heatmap">
      <div className="grid grid-cols-7 gap-1">
        {/* Day of week labels */}
        <div className="text-xs text-muted-foreground">S</div>
        <div className="text-xs text-muted-foreground">M</div>
        <div className="text-xs text-muted-foreground">T</div>
        <div className="text-xs text-muted-foreground">W</div>
        <div className="text-xs text-muted-foreground">T</div>
        <div className="text-xs text-muted-foreground">F</div>
        <div className="text-xs text-muted-foreground">S</div>
        
        {/* Calendar cells */}
        {weeks.flat().map((day, index) => (
          <div 
            key={day.date || `empty-${index}`}
            className="aspect-square rounded-sm"
            style={{ 
              backgroundColor: day.date ? getColor(day.intensity) : 'transparent',
              opacity: day.date ? 1 : 0
            }}
            title={day.date ? `${formatDate(day.date)}: ${day.value} activities` : ''}
            aria-label={day.date ? `${formatDate(day.date)}: ${day.value} activities` : 'Empty day'}
            role={day.date ? 'gridcell' : 'presentation'}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-end items-center mt-2 gap-1">
        <span className="text-xs text-muted-foreground">Less</span>
        {colorRange.map((color, index) => (
          <div 
            key={`legend-${index}`}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}