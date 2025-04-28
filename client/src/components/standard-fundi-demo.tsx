import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function StandardFundiDemo() {
  const [isWaving, setIsWaving] = useState(false);

  // Handle hover events
  const handleMouseEnter = () => setIsWaving(true);
  const handleMouseLeave = () => setIsWaving(false);

  return (
    <Card className="w-[350px] mb-6 overflow-hidden">
      <CardHeader>
        <CardTitle>Standard Fundi Design</CardTitle>
        <CardDescription>
          Clean, friendly robot assistant design
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div 
          className="w-64 h-64 flex items-center justify-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            width="200"
            height="220"
            viewBox="0 0 200 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300"
          >
            {/* Antenna */}
            <circle cx="100" cy="20" r="10" fill="#0099FF" />
            <line x1="100" y1="20" x2="100" y2="40" stroke="#0099FF" strokeWidth="4" />
            
            {/* Head */}
            <rect x="70" y="40" width="60" height="50" rx="25" fill="#0099FF" />
            
            {/* Face */}
            <rect x="75" y="45" width="50" height="40" rx="20" fill="#00005A" />
            
            {/* Eyes */}
            <circle cx="85" cy="65" r="10" fill="#0099FF" />
            <circle cx="85" cy="65" r="5" fill="white" />
            
            <circle cx="115" cy="65" r="10" fill="#0099FF" />
            <circle cx="115" cy="65" r="5" fill="white" />
            
            {/* Smile */}
            <path
              d="M90 75 Q100 85 110 75"
              stroke="#0099FF"
              strokeWidth="3"
              fill="none"
            />
            
            {/* Ear/Speaker Left */}
            <circle cx="65" cy="65" r="8" fill="#0099FF" />
            <circle cx="65" cy="65" r="4" fill="#00005A" />
            
            {/* Ear/Speaker Right */}
            <circle cx="135" cy="65" r="8" fill="#0099FF" />
            <circle cx="135" cy="65" r="4" fill="#00005A" />
            
            {/* Body */}
            <path
              d="M75 90 C70 100 70 130 90 140 L110 140 C130 130 130 100 125 90 Z"
              fill="#0099FF"
            />
            
            {/* Center Button */}
            <circle cx="100" cy="115" r="10" fill="#00005A" />
            <circle cx="100" cy="115" r="5" fill="#0099FF" />
            
            {/* Left Arm */}
            <path
              d="M70 100 L50 85 L45 90 L40 85"
              stroke="#0099FF"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Right Arm - Waving with CSS transform */}
            <path
              d="M130 100 L150 80 L155 70"
              stroke="#0099FF"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              style={{
                transformOrigin: '130px 100px',
                transform: isWaving ? 'rotate(-15deg)' : 'rotate(0deg)',
                transition: 'transform 0.5s ease-in-out'
              }}
            />
            
            {/* Base */}
            <ellipse cx="100" cy="155" rx="30" ry="10" fill="#0099FF" />
            
            {/* Shadow */}
            <ellipse cx="100" cy="165" rx="40" ry="5" fill="url(#shadow)" opacity="0.5" />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="shadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#0099FF" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Standard Design</span>
        <span className="text-xs text-muted-foreground">(Hover for animation)</span>
      </CardFooter>
    </Card>
  );
}