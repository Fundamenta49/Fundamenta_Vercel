/**
 * Unified ZoneCard component that works with both standard and jungle themes
 * This component displays a learning zone with appropriate styling based on theme
 */

import { LearningZone, ThemeType } from "@/data/zones-config";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, Heart, Flame, Briefcase, ShieldAlert, LockIcon,
  Mountain, Droplet, Mountain as TriangleIcon, BookOpen, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/LearningThemeContext";
import { useLocation } from "wouter";

interface ZoneCardProps {
  /** Zone data to display */
  zone: LearningZone;
  
  /** Theme variant for the card (optional with context) */
  theme?: ThemeType;
  
  /** User's current rank */
  userRank?: number;
  
  /** Progress percentage (0-100) */
  progress?: number;
  
  /** Total quests in this zone */
  questCount?: number;
  
  /** Number of completed quests in this zone */
  completedQuests?: number;
  
  /** CSS class name for additional styling */
  className?: string;
  
  /** Whether to use compact styling */
  compact?: boolean;
  
  /** Click handler for when the zone card is clicked */
  onClick: (zoneId: string) => void;
}

export function ZoneCard({
  zone,
  theme: propTheme, // Rename to clearly indicate it's from props
  userRank,
  progress = 0,
  questCount = 0,
  completedQuests = 0,
  className,
  compact = false,
  onClick
}: ZoneCardProps) {
  // Get theme from context, fallback to prop theme if provided
  const { theme: contextTheme } = useTheme();
  const [, navigate] = useLocation();
  const theme = propTheme || contextTheme;
  const isJungleTheme = theme === 'jungle';
  const isUnlocked = typeof userRank === 'number' ? userRank >= zone.unlockRank : false;
  
  // Handler for zone card click that can navigate to dynamic zone page
  const handleZoneClick = (zoneId: string) => {
    if (isUnlocked) {
      // Navigate to the new zone page with id parameter
      navigate(`/zone?id=${zoneId}`);
      
      // Also call the provided onClick handler if it exists
      if (onClick) {
        onClick(zoneId);
      }
    }
  };
  
  // Title and description based on theme
  const title = zone.title[theme];
  const description = zone.description[theme];
  
  // Get the appropriate icon based on the zone's iconType and theme
  const renderIcon = () => {
    // Larger icons for jungle theme
    const iconSize = isJungleTheme ? (compact ? 20 : 24) : (compact ? 16 : 20);
    
    // For jungle theme, use the enhanced themed icons
    if (isJungleTheme) {
      const iconClass = "text-amber-400";
      
      switch (zone.iconType) {
        case 'coins':
          return <Mountain size={iconSize} className={iconClass} />;
        case 'heart':
          return <Droplet size={iconSize} className={iconClass} />;
        case 'flame':
          return <TriangleIcon size={iconSize} className={iconClass} />;
        case 'briefcase':
          return <BookOpen size={iconSize} className={iconClass} />;
        case 'shield':
          return <Shield size={iconSize} className={iconClass} />;
        default:
          return null;
      }
    }
    
    // Standard theme icons
    switch (zone.iconType) {
      case 'coins':
        return <Coins size={iconSize} />;
      case 'heart':
        return <Heart size={iconSize} />;
      case 'flame':
        return <Flame size={iconSize} />;
      case 'briefcase':
        return <Briefcase size={iconSize} />;
      case 'shield':
        return <ShieldAlert size={iconSize} />;
      default:
        return null;
    }
  };
  
  // Card styling based on theme, locked status, and category
  const cardClasses = cn(
    "transition-all duration-300 relative overflow-hidden shadow-md hover:shadow-lg",
    {
      // Jungle theme styling - match the mockup exactly
      "rounded-lg border border-[#E6B933] bg-[#16382F] text-white": isJungleTheme,
      
      // Standard theme styling - use the zone's theme color with reduced opacity
      [`border-[${zone.themeColor}] hover:border-[${zone.themeColor}]`]: !isJungleTheme,
      "bg-white dark:bg-gray-800": !isJungleTheme,
      
      // Locked styles - instead of full opacity change, we'll handle this with overlay
      "cursor-pointer": isUnlocked,
      "cursor-default": !isUnlocked,
      
      // Compact mode
      "h-[140px]": compact,
      "h-auto": !compact,
    },
    className
  );
  
  // Progress styling based on theme
  const progressClasses = cn(
    "h-2 mt-2",
    {
      "bg-opacity-20 bg-[#EBCE67]": isJungleTheme,
      "bg-gray-200 dark:bg-gray-700": !isJungleTheme,
    }
  );
  
  const progressValueClasses = cn({
    "bg-[#EBCE67]": isJungleTheme,
    [`bg-[${zone.themeColor}]`]: !isJungleTheme,
  });
  
  // Title styling based on theme
  const titleClasses = cn("flex items-center gap-2", {
    "text-xl font-semibold text-white tracking-wide": isJungleTheme,
    [`text-[${zone.themeColor}]`]: !isJungleTheme,
  });
  
  // Description styling based on theme
  const descClasses = cn({
    "text-slate-300": isJungleTheme,
    "text-gray-600 dark:text-gray-300": !isJungleTheme,
  });
  
  // Badge styling based on theme
  const badgeClasses = cn("mt-2", {
    // Customize badges for jungle theme by zone category
    "rounded-full px-3 py-0.5 text-sm font-medium": isJungleTheme,
    "bg-amber-900 text-amber-200": isJungleTheme && zone.category === 'finance',
    "bg-green-900 text-green-200": isJungleTheme && zone.category === 'wellness',
    "bg-red-900 text-red-200": isJungleTheme && zone.category === 'fitness',
    "bg-blue-900 text-blue-200": isJungleTheme && zone.category === 'career',
    "bg-purple-900 text-purple-200": isJungleTheme && zone.category === 'emergency',
    
    // Standard theme
    [`bg-[${zone.themeColor}] text-white`]: !isJungleTheme,
  });
  
  return (
    <Card 
      className={cardClasses}
      onClick={() => handleZoneClick(zone.id)}
    >
      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <LockIcon 
            className={cn("text-white opacity-80", {
              "text-[#EBCE67]": isJungleTheme
            })} 
            size={compact ? 32 : 48} 
          />
        </div>
      )}
      
      <CardHeader className={compact ? "py-3 px-4" : "py-4 px-6"}>
        <CardTitle className={titleClasses}>
          {renderIcon()}
          <span>{title}</span>
        </CardTitle>
        {!compact && (
          <CardDescription className={descClasses}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      {!compact && (
        <CardContent>
          {questCount > 0 && (
            <>
              <div className="flex justify-between text-sm mb-1">
                <span className={isJungleTheme ? "text-gray-200" : "text-gray-600 dark:text-gray-300"}>
                  Progress
                </span>
                <span className={isJungleTheme ? "text-[#EBCE67]" : "text-gray-700 dark:text-gray-200"}>
                  {completedQuests}/{questCount} quests
                </span>
              </div>
              <Progress 
                value={progress} 
                max={100} 
                className={progressClasses}
                indicator={progressValueClasses}
              />
            </>
          )}
          
          <Badge className={badgeClasses}>
            {zone.category.charAt(0).toUpperCase() + zone.category.slice(1)}
          </Badge>
        </CardContent>
      )}
      
      {!compact && (
        <CardFooter className="flex justify-end">
          <Button 
            variant={isJungleTheme ? "outline" : "default"}
            size="sm"
            className={cn({
              // Explore button styling for jungle theme
              "text-[#E6B933] border border-[#E6B933] rounded-md px-4 py-1 font-semibold hover:bg-[#E6B933]/10": 
                isJungleTheme && isUnlocked,
              
              // Unlock button styling for jungle theme
              "opacity-50 pointer-events-none text-gray-300 border border-gray-500 rounded-md px-4 py-1": 
                isJungleTheme && !isUnlocked,
                
              // Standard theme uses default styling from Button component
            })}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (isUnlocked) {
                onClick(zone.id);
              }
            }}
            aria-label={isUnlocked 
              ? `Explore ${title} Zone` 
              : `Unlock ${title} Zone at Rank ${zone.unlockRank}`
            }
          >
            {isUnlocked ? "Explore" : "Unlock at Rank " + zone.unlockRank}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}