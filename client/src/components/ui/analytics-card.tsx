import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

/**
 * A card component for displaying analytics metrics
 * 
 * @param title The title of the metric
 * @param value The value to display (number or string)
 * @param icon Optional icon to display alongside the title
 * @param description Optional description text
 * @param className Optional additional CSS classes
 */
export function AnalyticsCard({ 
  title, 
  value, 
  icon, 
  description, 
  className = "" 
}: AnalyticsCardProps) {
  // Input validation with safe defaults
  if (!title?.trim()) {
    console.warn("AnalyticsCard received empty title");
    title = "Untitled Metric";
  }
  
  // Safe value display with type checking
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString()
    : String(value || '0');

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}