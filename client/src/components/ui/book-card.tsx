import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}

export function BookCard({
  id,
  title,
  description,
  icon: Icon,
  isExpanded,
  onToggle,
  children
}: BookCardProps) {
  return (
    <Card 
      className={cn(
        "h-full border-2 border-rose-100 shadow-md bg-white flex flex-col"
      )}
      onClick={() => !isExpanded && onToggle(id)}
    >
      {!isExpanded ? (
        // Book cover design - only shows when collapsed
        <div className="h-full flex flex-col cursor-pointer py-4">
          {/* Top section with icon */}
          <div className="flex-1 flex items-center justify-center flex-col text-center px-6 py-8">
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-3">{title}</CardTitle>
            <CardDescription className="text-xl">{description}</CardDescription>
          </div>
          
          {/* Bottom hint to open */}
          <div className="text-center pb-6 text-muted-foreground">
            <p className="text-sm">Tap to open</p>
            <ChevronDown className="h-5 w-5 mx-auto mt-1" />
          </div>
        </div>
      ) : (
        // Content view - shows when expanded
        <>
          <CardHeader 
            className="bg-rose-50 border-b border-rose-100 py-3 cursor-pointer flex flex-row items-center"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(id);
            }}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <ChevronUp className="h-5 w-5 text-muted-foreground ml-auto" />
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4">
            {children}
          </CardContent>
        </>
      )}
    </Card>
  );
}

export interface BookCarouselProps {
  children: ReactNode;
}

export function BookCarousel({ children }: BookCarouselProps) {
  return (
    <div 
      className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
      style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        height: 'calc(100vh - 4rem)' /* Maximize screen height */
      }}
    >
      {children}
    </div>
  );
}

export interface BookPageProps {
  id: string;
  children: ReactNode;
}

export function BookPage({ id, children }: BookPageProps) {
  return (
    <div 
      key={id}
      className="snap-center flex-shrink-0 w-full px-2"
    >
      {children}
    </div>
  );
}