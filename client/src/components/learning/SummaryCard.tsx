import * as React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/LearningThemeContext";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface SummaryCardProps {
  id: string;
  title: string;
  jungleTitle?: string;
  completedDate: Date;
  duration: number;
  href: string;
}

export function SummaryCard({ id, title, jungleTitle, completedDate, duration, href }: SummaryCardProps) {
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  
  // Use theme-aware title display
  const displayTitle = theme === 'jungle' && jungleTitle ? jungleTitle : title;
  
  // Theme-specific styling
  const cardClasses = theme === 'jungle'
    ? 'border-amber-700 bg-[#28362E] text-white hover:bg-[#2F4038] transition-colors'
    : 'border-slate-200 hover:border-slate-300 transition-colors';
    
  const completedText = formatDistanceToNow(completedDate, { addSuffix: true });
  
  return (
    <Card 
      className={`cursor-pointer ${cardClasses}`} 
      onClick={() => navigate(href)}
    >
      <CardHeader className="pb-1 flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">{displayTitle}</CardTitle>
        <CheckCircle 
          className={`h-5 w-5 ${theme === 'jungle' ? 'text-amber-400' : 'text-green-500'}`} 
        />
      </CardHeader>
      
      <CardContent className="pt-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span className={theme === 'jungle' ? 'text-slate-300' : 'text-slate-500'}>
              {duration} min
            </span>
          </div>
          <Badge variant={theme === 'jungle' ? 'outline' : 'secondary'}>
            {completedText}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}