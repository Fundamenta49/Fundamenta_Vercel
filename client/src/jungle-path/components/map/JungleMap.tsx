import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getAllZones, isZoneUnlocked } from '../../utils/zoneUtils';
import { useJungleTheme } from '../../contexts/JungleThemeContext';
import { Map, Compass } from 'lucide-react';

interface JungleMapProps {
  userRank: number;
  zoneProgress: Record<string, number>; // category to progress (0-100)
  onZoneSelect?: (zoneId: string) => void;
  className?: string;
}

/**
 * JungleMap displays an SVG map of the jungle zones
 * with unlocked/locked status and progress tracking
 */
const JungleMap: React.FC<JungleMapProps> = ({
  userRank,
  zoneProgress,
  onZoneSelect,
  className = ''
}) => {
  const { isJungleTheme } = useJungleTheme();
  const zones = getAllZones();
  
  // For MVP, we show a simpler version with zone cards for mobile
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (isMobileView) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-muted rounded-md flex items-center">
          <Map className="w-5 h-5 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            The full jungle map is available on larger screens. 
            Please view on desktop for the interactive experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {zones.map(zone => {
            const unlocked = isZoneUnlocked(zone.category, userRank);
            const progress = zoneProgress[zone.category] || 0;
            
            return (
              <Card 
                key={zone.id}
                className={`border-l-4 cursor-pointer transition-all hover:shadow ${
                  unlocked ? '' : 'opacity-60'
                }`}
                style={{ borderLeftColor: zone.color }}
                onClick={() => unlocked && onZoneSelect && onZoneSelect(zone.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{zone.name}</h3>
                    {progress > 0 && (
                      <span className="text-xs font-medium">{progress}%</span>
                    )}
                  </div>
                  {!unlocked && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Requires Rank {zone.requiredRank}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
  
  // For desktop, we render an SVG map
  // This is a placeholder - in a real implementation, you would create a proper SVG map
  return (
    <div className={`relative rounded-md overflow-hidden border ${className}`}>
      <div className="absolute top-3 right-3 z-10 bg-background/80 p-2 rounded-md backdrop-blur-sm">
        <Compass className="w-5 h-5" />
      </div>
      
      <div 
        className="aspect-video bg-[#1E4A3D]/10 w-full flex items-center justify-center"
        style={{
          backgroundImage: isJungleTheme ? 
            'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'10\' height=\'10\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 10 0 L 0 0 0 10\' fill=\'none\' stroke=\'%231E4A3D\' stroke-opacity=\'0.1\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3Cpattern id=\'grid\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23smallGrid)\'/%3E%3Cpath d=\'M 100 0 L 0 0 0 100\' fill=\'none\' stroke=\'%231E4A3D\' stroke-opacity=\'0.2\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\' /%3E%3C/svg%3E")' :
            undefined
        }}
      >
        <div className="text-center max-w-md p-6 bg-background/80 backdrop-blur-sm rounded-md">
          <h3 className="text-lg font-bold mb-2">Interactive Jungle Map</h3>
          <p className="text-muted-foreground text-sm mb-3">
            This is a placeholder for the SVG map, which would show all jungle zones with paths connecting them.
            Unlocked zones would be highlighted, with locked zones grayed out.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {zones.slice(0, 6).map(zone => {
              const unlocked = isZoneUnlocked(zone.category, userRank);
              return (
                <div 
                  key={zone.id}
                  className={`p-2 border rounded-md ${unlocked ? '' : 'opacity-50'}`}
                  style={{ borderColor: zone.color }}
                >
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: zone.color }}
                  ></div>
                  {zone.name.split(' ')[0]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JungleMap;