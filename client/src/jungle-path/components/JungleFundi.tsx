import React from 'react';
import { useJungleFundi } from '../contexts/JungleFundiContext';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import { Compass, Map, TreePine, Palmtree } from 'lucide-react';

export function JungleFundi() {
  const { 
    fundiMessage, 
    fundiPosition, 
    showFundi 
  } = useJungleFundi();
  
  const { isJungleTheme } = useJungleTheme();

  if (!showFundi || !isJungleTheme) return null;

  return (
    <div 
      className={`fixed z-50 ${
        fundiPosition === 'left' 
          ? 'left-4' 
          : fundiPosition === 'right' 
            ? 'right-4' 
            : 'left-1/2 transform -translate-x-1/2'
      } bottom-4 flex items-end gap-3 transition-all duration-300 ease-in-out animate-fadeIn`}
    >
      {/* Fundi Character */}
      <div className="h-16 w-16 bg-[#E6B933] rounded-full overflow-hidden border-2 border-[#94C973] shadow-lg flex items-center justify-center relative">
        <div className="relative">
          {/* Base Fundi with jungle hat */}
          <div className="text-[#1E4A3D] text-3xl font-bold">F</div>
          <Palmtree className="absolute -top-2 -right-2 h-4 w-4 text-[#1E4A3D]" />
        </div>
      </div>
      
      {/* Speech Bubble */}
      <div className="relative max-w-xs bg-white p-3 rounded-lg border-2 border-[#94C973] shadow-xl">
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 bg-[#94C973] h-4 w-4 rounded-full flex items-center justify-center">
          <Compass className="h-3 w-3 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 bg-[#E6B933] h-4 w-4 rounded-full flex items-center justify-center">
          <Map className="h-3 w-3 text-[#1E4A3D]" />
        </div>
        
        {/* Speech content */}
        <p className="text-sm text-[#1E4A3D] font-medium">{fundiMessage}</p>
        
        {/* Bubble pointer */}
        <div className="absolute -left-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"></div>
      </div>
    </div>
  );
}