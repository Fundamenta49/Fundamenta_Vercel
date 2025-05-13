import React from 'react';
import { useLocation } from 'wouter';
import { 
  Calendar, GraduationCap, Award, BookOpen, Sparkles, 
  CheckCircle, Trophy, MapPin, Clock
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getZoneByCategory } from '../jungle-path/utils/zoneUtils';

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

const ExpeditionCard: React.FC<ExpeditionCardProps> = ({
  title,
  description,
  completedAt,
  xpEarned,
  category,
  icon,
  variant,
  achievements = [],
  className = '',
  onClick
}) => {
  const [, navigate] = useLocation();
  
  // Format the completedAt date if it's a Date object
  const formattedDate = typeof completedAt === 'string' 
    ? completedAt 
    : completedAt.toLocaleDateString();
  
  // Function to handle clicking the card details button
  const handleDetailsClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation to expeditions page
      navigate('/learning/expeditions');
    }
  };
  
  // Get zone data if category is provided
  const zone = category ? getZoneByCategory(category) : null;
  
  // JUNGLE THEME VARIANT
  if (variant === 'jungle') {
    return (
      <Card className={cn(
        "border-2 border-[#94C973] bg-gradient-to-br from-[#1E4A3D] to-[#162E26]",
        "hover:shadow-md hover:shadow-[#94C973]/20",
        className
      )}>
        <CardHeader className="pb-2 border-b border-[#94C973]/30">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#94C973] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-[#1E4A3D]" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-[#94C973]">
                  {title}
                </h3>
                
                <div className="flex items-center mt-1 text-sm text-[#94C973]/70">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>Completed: {formattedDate}</span>
                </div>
              </div>
            </div>
            
            <Badge 
              className="bg-[#162E26] text-[#94C973] border border-[#94C973]"
            >
              <Award className="h-3.5 w-3.5 mr-1.5" />
              {xpEarned} XP Earned
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Expedition description */}
          <p className="text-sm text-white/80 mb-4">
            {description}
          </p>
          
          {/* Zone category if available */}
          {category && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#94C973] mb-2">Explored Zone</h4>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className="bg-[#162E26] text-white border-none"
                  style={{ color: zone?.color || '#94C973' }}
                >
                  {zone?.name || category}
                </Badge>
              </div>
            </div>
          )}
          
          {/* Achievements list */}
          {achievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[#94C973] mb-2">Achievements</h4>
              <ul className="space-y-2">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <Sparkles className="h-4 w-4 text-[#E6B933] mr-2 mt-0.5" />
                    <span className="text-sm text-white">
                      {achievement}
                    </span>
                  </li>
                ))}
                
                {achievements.length > 3 && (
                  <li className="text-sm text-[#94C973]/70 ml-6">
                    + {achievements.length - 3} more achievements
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* View details button */}
          <Button
            className="w-full mt-4 bg-[#94C973] hover:bg-[#94C973]/90 text-[#1E4A3D]"
            onClick={handleDetailsClick}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Expedition Journal
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // STANDARD THEME VARIANT
  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="h-1.5 bg-primary" />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          
          <Badge variant="secondary" className="flex items-center">
            <Trophy className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
            {xpEarned} XP
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 pt-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>Completed {formattedDate}</span>
          </div>
          
          {category && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{zone?.name || category}</span>
            </div>
          )}
        </div>
        
        {/* Achievements list */}
        {achievements.length > 0 && (
          <div className="space-y-1 mb-4">
            <h4 className="text-sm font-medium mb-2">Milestones</h4>
            {achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center text-sm">
                <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500" />
                <span>{achievement}</span>
              </div>
            ))}
            
            {achievements.length > 3 && (
              <div className="text-xs text-muted-foreground ml-6 mt-1">
                + {achievements.length - 3} more milestones
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleDetailsClick}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpeditionCard;