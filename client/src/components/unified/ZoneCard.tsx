/**
 * Unified ZoneCard component that works with both standard and jungle themes
 * This component displays a learning zone with appropriate styling based on theme
 */

import { LearningZone, ThemeType } from "@/data/zones-config";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Heart, Flame, Briefcase, ShieldAlert, LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/LearningThemeContext";

interface ZoneCardProps {
  /** Zone data to display */
  zone: LearningZone;
  
  /** Theme variant for the card */
  theme: ThemeType;
  
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
  theme,
  userRank,
  progress = 0,
  questCount = 0,
  completedQuests = 0,
  className,
  compact = false,
  onClick
}: ZoneCardProps) {
  const isJungleTheme = theme === 'jungle';
  const isUnlocked = typeof userRank === 'number' ? userRank >= zone.unlockRank : false;
  
  // Title and description based on theme
  const title = zone.title[theme];
  const description = zone.description[theme];
  
  // Get the appropriate icon based on the zone's iconType
  const renderIcon = () => {
    const iconSize = compact ? 16 : 20;
    
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
    "transition-all duration-300 relative overflow-hidden",
    {
      // Jungle theme styling
      "bg-[#1E4A3D] border-[#EBCE67] text-[#EBCE67]": isJungleTheme,
      "border-2": isJungleTheme,
      
      // Standard theme styling - use the zone's theme color with reduced opacity
      [`border-[${zone.themeColor}] hover:border-[${zone.themeColor}]`]: !isJungleTheme,
      "bg-white dark:bg-gray-800": !isJungleTheme,
      
      // Locked styles
      "opacity-70": !isUnlocked,
      
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
    "text-[#EBCE67] font-bold": isJungleTheme,
    [`text-[${zone.themeColor}]`]: !isJungleTheme,
  });
  
  // Description styling based on theme
  const descClasses = cn({
    "text-gray-200": isJungleTheme,
    "text-gray-600 dark:text-gray-300": !isJungleTheme,
  });
  
  // Badge styling based on theme
  const badgeClasses = cn("mt-2", {
    "bg-[#EBCE67] text-[#1E4A3D]": isJungleTheme,
    [`bg-[${zone.themeColor}] text-white`]: !isJungleTheme,
  });
  
  return (
    <Card 
      className={cardClasses}
      onClick={() => onClick(zone.id)}
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
            className={isJungleTheme ? "border-[#EBCE67] text-[#EBCE67] hover:bg-[#2c5a4a]" : ""}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onClick(zone.id);
            }}
            aria-label={isUnlocked 
              ? `Explore ${isJungleTheme ? zone.jungleTitle : zone.title} Zone` 
              : `Unlock ${isJungleTheme ? zone.jungleTitle : zone.title} Zone at Rank ${zone.unlockRank}`
            }
          >
            {isUnlocked ? "Explore" : "Unlock at Rank " + zone.unlockRank}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}