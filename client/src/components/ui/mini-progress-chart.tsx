import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface MiniProgressChartProps {
  title: string;
  data: {
    value: number;
    label: string;
  }[];
  className?: string;
  isLoading?: boolean;
}

export function MiniProgressChart({
  title,
  data,
  className,
  isLoading = false,
}: MiniProgressChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  // Generate pastel colors based on index
  const getColor = (index: number) => {
    const colors = [
      "bg-blue-200",
      "bg-green-200",
      "bg-yellow-200",
      "bg-red-200",
      "bg-purple-200",
      "bg-indigo-200",
      "bg-pink-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{item.label}</span>
                  <span className="font-medium">
                    {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full", getColor(index))}
                    style={{
                      width: total > 0 ? `${(item.value / total) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}