import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AchievementCategory } from '@/shared/arcade-schema';
import { getAllZones, getZoneConnections, ZONE_ICONS } from '../../data/zones';
import { isZoneUnlocked } from '../../utils/zoneUtils';
import { JUNGLE_THEME } from '../../styles/theme';
import PathIndicator from './PathIndicator';

interface JungleMapProps {
  userRank: number;
  zoneProgress: Record<AchievementCategory, number>;
  currentZone?: AchievementCategory;
  className?: string;
}

/**
 * Interactive SVG map showing all jungle zones and their connections
 */
const JungleMap: React.FC<JungleMapProps> = ({
  userRank,
  zoneProgress,
  currentZone,
  className = ''
}) => {
  const [, navigate] = useLocation();
  const [activeZone, setActiveZone] = useState<AchievementCategory | null>(currentZone || null);
  const [activePaths, setActivePaths] = useState<{from: string, to: string}[]>([]);
  
  // All zones in the jungle
  const zones = getAllZones();
  
  // All connections between zones
  const connections = getZoneConnections();
  
  // Set active zone and highlight connected paths
  useEffect(() => {
    if (currentZone) {
      setActiveZone(currentZone);
      
      // Find all connections to/from this zone
      const activeConnections = connections.filter(
        conn => conn.from === currentZone || conn.to === currentZone
      );
      setActivePaths(activeConnections);
    } else {
      setActivePaths([]);
    }
  }, [currentZone]);
  
  // Handle zone click
  const handleZoneClick = (zone: AchievementCategory) => {
    // Only navigate if zone is unlocked
    if (isZoneUnlocked(zone, userRank)) {
      navigate(`/jungle/${zone}`);
    }
  };
  
  // Check if a connection is active
  const isConnectionActive = (from: string, to: string) => {
    return activePaths.some(
      path => (path.from === from && path.to === to) || 
             (path.from === to && path.to === from)
    );
  };
  
  // Get node style based on zone state
  const getNodeStyle = (zone: AchievementCategory) => {
    const unlocked = isZoneUnlocked(zone, userRank);
    const progress = zoneProgress[zone] || 0;
    const isActive = zone === activeZone;
    
    if (!unlocked) return JUNGLE_THEME.mapStyles.nodes.locked;
    if (isActive) return JUNGLE_THEME.mapStyles.nodes.current;
    if (progress >= 100) return JUNGLE_THEME.mapStyles.nodes.completed;
    return JUNGLE_THEME.mapStyles.nodes.unlocked;
  };

  return (
    <div className={`relative overflow-hidden rounded-lg border ${className}`}>
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-auto bg-gradient-to-b from-[#E6F2E3] to-[#F4FBF3]"
      >
        {/* Background image/pattern would go here */}
        <defs>
          <pattern 
            id="junglePattern" 
            patternUnits="userSpaceOnUse"
            width="100" 
            height="100"
            x="0" 
            y="0"
          >
            <path 
              d="M0 0 L10 10 L0 20 L10 30 L0 40 L10 50 L0 60 L10 70 L0 80 L10 90 L0 100" 
              stroke="#94C973" 
              strokeWidth="0.5" 
              fill="none"
              opacity="0.3"
            />
            <path 
              d="M20 0 L30 10 L20 20 L30 30 L20 40 L30 50 L20 60 L30 70 L20 80 L30 90 L20 100" 
              stroke="#94C973" 
              strokeWidth="0.5" 
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>
        
        {/* Background pattern */}
        <rect 
          x="0" 
          y="0" 
          width="800" 
          height="600" 
          fill="url(#junglePattern)" 
        />
        
        {/* Connection paths between zones */}
        <g>
          {connections.map(({ from, to }) => {
            const fromZone = zones.find(z => z.id === from);
            const toZone = zones.find(z => z.id === to);
            
            if (!fromZone || !toZone) return null;
            
            const fromUnlocked = isZoneUnlocked(fromZone.category, userRank);
            const toUnlocked = isZoneUnlocked(toZone.category, userRank);
            const bothUnlocked = fromUnlocked && toUnlocked;
            
            return (
              <PathIndicator
                key={`${from}-${to}`}
                from={fromZone.position}
                to={toZone.position}
                isUnlocked={bothUnlocked}
                isActive={isConnectionActive(from, to)}
              />
            );
          })}
        </g>
        
        {/* Zone nodes */}
        <g>
          {zones.map(zone => {
            const zoneUnlocked = isZoneUnlocked(zone.category, userRank);
            const nodeStyle = getNodeStyle(zone.category);
            const ZoneIcon = ZONE_ICONS[zone.category];
            
            // Calculate progress arc for circle if zone is unlocked
            const progress = zoneProgress[zone.category] || 0;
            const radius = 25;
            const circumference = 2 * Math.PI * radius;
            const progressOffset = circumference - (progress / 100) * circumference;
            
            return (
              <g
                key={zone.id}
                transform={`translate(${zone.position.x}, ${zone.position.y})`}
                onClick={() => handleZoneClick(zone.category)}
                className={`cursor-pointer transition-transform duration-300 ${
                  activeZone === zone.category ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                {/* Main circle */}
                <circle
                  r={radius}
                  className={`${nodeStyle} transition-all duration-300`}
                />
                
                {/* Progress arc (only for unlocked zones) */}
                {zoneUnlocked && progress > 0 && (
                  <circle
                    r={radius}
                    className="fill-none stroke-[#94C973] stroke-[4px]"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    transform="rotate(-90)"
                    strokeLinecap="round"
                  />
                )}
                
                {/* Zone icon */}
                <foreignObject
                  x={-15}
                  y={-15}
                  width={30}
                  height={30}
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <ZoneIcon className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                </foreignObject>
                
                {/* Zone name */}
                <text
                  y={radius + 20}
                  textAnchor="middle"
                  className="text-xs font-medium fill-[#1E4A3D] drop-shadow-sm pointer-events-none"
                >
                  {zone.name}
                </text>
                
                {/* Lock indicator for locked zones */}
                {!zoneUnlocked && (
                  <foreignObject
                    x={radius - 10}
                    y={-radius}
                    width={20}
                    height={20}
                    className="pointer-events-none"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                        {zone.requiredRank}
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default JungleMap;