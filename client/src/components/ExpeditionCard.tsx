import React from 'react';
import { Award, Calendar, Medal, Star, Trophy, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getZoneColor } from '../jungle-path/utils/zoneUtils.js';

/**
 * Unified ExpeditionCard Component that supports both jungle and standard theme variants
 * This is a display-only card for showing completed quests/expeditions
 */
interface ExpeditionCardProps {
  /** Title of the expedition */
  title: string;
  
  /** Description of the expedition */
  description: string;
  
  /** When the expedition was completed */
  completedAt: Date | string;
  
  /** XP earned from this expedition */
  xpEarned: number;
  
  /** Optional category or zone of the expedition */
  category?: string;
  
  /** Optional icon to display */
  icon?: string;
  
  /** Theme variant for the card */
  variant: 'jungle' | 'standard';
  
  /** List of achievements/completed quest titles */
  achievements?: string[];
  
  /** CSS class name for additional styling */
  className?: string;
  
  /** Optional click handler */
  onClick?: () => void;
}

export default function ExpeditionCard({
  title,
  description,
  completedAt,
  xpEarned,
  category = 'general',
  icon,
  variant = 'standard',
  achievements = [],
  className = '',
  onClick
}: ExpeditionCardProps) {
  // Handle color based on category/zone
  const zoneColor = category ? getZoneColor(category) : '#4f46e5';
  
  // Determine styles based on variant
  const isJungle = variant === 'jungle';
  
  // Card styling based on theme variant
  const cardClassName = cn(
    'relative overflow-hidden transition-all duration-300 h-full',
    {
      'border-2 hover:shadow-lg hover:-translate-y-1': isJungle,
      'bg-white dark:bg-gray-800': !isJungle,
      'bg-gradient-to-br from-stone-100 to-amber-50 dark:from-gray-800 dark:to-gray-900': isJungle
    },
    className
  );
  
  // Border styling based on variant
  const borderStyle = isJungle ? { borderColor: zoneColor } : {};
  
  // Render different icon based on variant and category
  const renderIcon = () => {
    if (icon) {
      return <span className="text-2xl">{icon}</span>;
    }
    
    if (isJungle) {
      // Jungle-themed icons based on category
      switch(category) {
        case 'finance':
          return <Trophy className="h-6 w-6 text-yellow-500" />;
        case 'wellness':
          return <Medal className="h-6 w-6 text-teal-500" />;
        case 'fitness':
          return <Zap className="h-6 w-6 text-orange-500" />;
        case 'career':
          return <Star className="h-6 w-6 text-blue-500" />;
        case 'emergency':
          return <Award className="h-6 w-6 text-red-500" />;
        default:
          return <Award className="h-6 w-6 text-purple-500" />;
      }
    } else {
      // Standard icons
      return <Award className="h-6 w-6" />;
    }
  };

  return (
    <Card 
      className={cardClassName} 
      style={borderStyle}
      onClick={onClick}
    >
      {/* Decorative elements for jungle variant */}
      {isJungle && (
        <div 
          className="absolute top-0 right-0 w-16 h-16 bg-cover bg-no-repeat opacity-20"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(zoneColor)}' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 18v-6a9 9 0 0 1 18 0v6'/%3E%3Cpath d='M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'/%3E%3C/svg%3E")` 
          }}
        />
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div 
              className={cn(
                "rounded-full p-2", 
                isJungle ? "bg-opacity-20" : "bg-muted"
              )}
              style={{ backgroundColor: isJungle ? zoneColor : undefined }}
            >
              {renderIcon()}
            </div>
            <CardTitle 
              className={cn(
                "text-xl", 
                isJungle ? "font-bold" : "font-semibold"
              )}
            >
              {title}
            </CardTitle>
          </div>
          
          <Badge 
            variant={isJungle ? "outline" : "secondary"}
            className={cn(
              "ml-2",
              isJungle && "border-2 font-bold"
            )}
            style={isJungle ? { borderColor: zoneColor, color: zoneColor } : {}}
          >
            +{xpEarned} XP
          </Badge>
        </div>
        
        <CardDescription className="mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Achievements section */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <h4 className={cn(
                "text-sm font-medium",
                isJungle ? "text-amber-800 dark:text-amber-400" : "text-muted-foreground"
              )}>
                {isJungle ? "Expedition Achievements" : "Completed Lessons"}
              </h4>
              <ul className="space-y-1">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div 
                      className="w-4 h-4 mr-2 flex items-center justify-center"
                      style={{ color: isJungle ? zoneColor : undefined }}
                    >
                      {isJungle ? "✓" : "•"}
                    </div>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Completion date */}
          <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Completed: {typeof completedAt === 'string' ? completedAt : completedAt.toLocaleDateString()}</span>
            </div>
            
            {/* Optional action button - only for jungle variant */}
            {isJungle && onClick && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}