import React from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, MapPin, Award, ExternalLink, Map as MapIcon
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import { Badge } from '@/components/ui/badge';
import { getZoneByCategory } from '../utils/zoneUtils';
import { getRankTitle } from '../utils/rankCalculator';

// Props for the JungleHeader component
interface JungleHeaderProps {
  /** Current zone category (if in a specific zone) */
  currentZoneCategory?: string;
  
  /** Current quest title (if in a specific quest) */
  currentQuestTitle?: string;
  
  /** Progress percentage for the current quest (0-100) */
  questProgress?: number;
  
  /** URL to return to when clicking the back button */
  returnUrl?: string;
  
  /** Whether to show the XP and rank information */
  showProgress?: boolean;
}

/**
 * Persistent header that provides navigation and context in jungle theme
 */
const JungleHeader: React.FC<JungleHeaderProps> = ({
  currentZoneCategory,
  currentQuestTitle,
  questProgress = 0,
  returnUrl = '/learning/pathways',
  showProgress = true
}) => {
  const [, navigate] = useLocation();
  const { isJungleTheme, jungleProgress } = useJungleTheme();
  
  // Only render in jungle theme mode
  if (!isJungleTheme) {
    return null;
  }
  
  // Get the current zone if a category is provided
  const currentZone = currentZoneCategory 
    ? getZoneByCategory(currentZoneCategory)
    : null;
  
  // Get the zone color for styling
  const zoneColor = currentZone?.color || '#E6B933';
  
  return (
    <header className="sticky top-0 z-30 border-b-2 bg-[#1E4A3D] border-[#E6B933] py-2 px-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(returnUrl)}
            className="text-[#E6B933] hover:text-[#DCAA14] hover:bg-[#162E26]"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </Button>
          
          {currentZone && (
            <div className="flex items-center">
              <Badge 
                className="bg-[#162E26] text-[#E6B933] border border-[#E6B933]/30 hover:bg-[#162E26]"
                onClick={() => navigate('/learning/jungle-map')}
              >
                <MapPin className="h-3.5 w-3.5 mr-1" style={{ color: zoneColor }} />
                <span>{currentZone.name}</span>
              </Badge>
            </div>
          )}
        </div>
        
        {currentQuestTitle && (
          <div className="hidden md:flex items-center bg-[#162E26] rounded-full px-3 py-1">
            <span className="text-sm text-[#94C973] mr-2">Current Quest:</span>
            <span className="text-sm font-medium text-[#E6B933] truncate max-w-[200px]">
              {currentQuestTitle}
            </span>
          </div>
        )}
        
        {showProgress && (
          <div className="flex items-center space-x-2">
            {/* XP display */}
            <div className="flex items-center bg-[#162E26] rounded-full px-3 py-1">
              <Award className="h-4 w-4 text-[#E6B933] mr-2" />
              <span className="text-sm font-medium text-[#E6B933]">
                {jungleProgress.xp} XP
              </span>
            </div>
            
            {/* Rank display */}
            <Badge 
              className="bg-[#162E26] text-[#E6B933] border border-[#E6B933]/30 hover:bg-[#162E26]"
            >
              {getRankTitle(jungleProgress.rank)}
            </Badge>
            
            {/* Map button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/learning/jungle-map')}
              className="border-[#E6B933] text-[#E6B933] hover:bg-[#E6B933]/10"
            >
              <MapIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Map</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Quest progress bar */}
      {currentQuestTitle && questProgress > 0 && (
        <div className="mt-2">
          <Progress 
            value={questProgress} 
            className="h-1 bg-[#162E26]"
            style={{
              "--progress-foreground": zoneColor
            } as React.CSSProperties}
          />
        </div>
      )}
    </header>
  );
};

export default JungleHeader;