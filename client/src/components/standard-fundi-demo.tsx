import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function StandardFundiDemo() {
  const [isHovering, setIsHovering] = useState(false);

  // Handle hover events
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <Card className="w-[350px] mb-6 overflow-hidden">
      <CardHeader>
        <CardTitle>Modern Fundi Design</CardTitle>
        <CardDescription>
          Sleek, elegant AI assistant with subtle glow
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div 
          className="w-64 h-64 flex items-center justify-center relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Radiant Glow Background */}
          <div 
            className="absolute w-48 h-48 rounded-full bg-cyan-100 opacity-30 blur-xl transition-all duration-500 z-0"
            style={{
              transform: isHovering ? 'scale(1.1)' : 'scale(1)',
              opacity: isHovering ? 0.4 : 0.25
            }}
          />
          
          <svg
            width="170"
            height="190"
            viewBox="0 0 170 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300 z-10 relative"
            style={{
              transform: isHovering ? 'translateY(-5px)' : 'translateY(0)',
            }}
          >
            {/* Head/Top Section */}
            <ellipse cx="85" cy="50" rx="40" ry="35" fill="#F0F0F0" stroke="#E0E0E0" strokeWidth="1" />
            
            {/* Ear Pieces */}
            <path 
              d="M44 50 C40 47 38 53 42 56 L48 56 C52 53 50 47 46 50 Z" 
              fill="#F0F0F0" 
              stroke="#E0E0E0" 
              strokeWidth="1"
            />
            <path 
              d="M126 50 C130 47 132 53 128 56 L122 56 C118 53 120 47 124 50 Z" 
              fill="#F0F0F0" 
              stroke="#E0E0E0" 
              strokeWidth="1"
            />
            
            {/* Face/Visor */}
            <path 
              d="M60 50 C60 40 110 40 110 50 L110 65 C110 75 60 75 60 65 Z"
              fill="#00005A"
              stroke="#00005A"
              strokeWidth="1"
            />
            
            {/* Eyes */}
            <ellipse 
              cx="73" 
              cy="57" 
              rx="8" 
              ry="6" 
              fill="#37CFE5" 
              style={{
                filter: 'drop-shadow(0 0 2px #37CFE5)'
              }}
            />
            <ellipse 
              cx="97" 
              cy="57" 
              rx="8" 
              ry="6" 
              fill="#37CFE5" 
              style={{
                filter: 'drop-shadow(0 0 2px #37CFE5)'
              }}
            />
            
            {/* Body/Torso */}
            <path
              d="M55 85 C55 70 85 60 115 85 L115 120 C115 145 55 145 55 120 Z"
              fill="#F0F0F0"
              stroke="#E0E0E0"
              strokeWidth="1"
            />
            
            {/* Connector Neck */}
            <path
              d="M70 85 C70 75 100 75 100 85"
              stroke="#E0E0E0"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Center Button/Power Core */}
            <circle 
              cx="85" 
              cy="105" 
              r="10" 
              fill="#37CFE5" 
              style={{
                filter: 'drop-shadow(0 0 3px #37CFE5)',
                opacity: isHovering ? 0.9 : 0.7,
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
            <circle 
              cx="85" 
              cy="105" 
              r="6" 
              fill="#F0F0F0"
            />
            
            {/* Shadow Beneath */}
            <ellipse 
              cx="85" 
              cy="165" 
              rx="35" 
              ry="5" 
              fill="url(#shadow)" 
              opacity="0.3"
            />
            
            {/* Top Light */}
            <circle 
              cx="85" 
              cy="15" 
              r="8" 
              fill="#37CFE5" 
              style={{
                filter: 'drop-shadow(0 0 2px #37CFE5)',
                opacity: isHovering ? 0.9 : 0.6,
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
            
            {/* Gradients & Effects */}
            <defs>
              <linearGradient id="shadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#333" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              
              <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#37CFE5" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#37CFE5" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Modern Design</span>
        <span className="text-xs text-muted-foreground">(Hover for glow effect)</span>
      </CardFooter>
    </Card>
  );
}