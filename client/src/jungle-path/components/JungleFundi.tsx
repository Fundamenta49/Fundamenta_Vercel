import React from 'react';
import { useJungleFundi } from '../contexts/JungleFundiContext';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import { Compass, Map, TreePine, Trees, Mountain, Leaf } from 'lucide-react';

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
      } bottom-4 flex items-end gap-3 transition-all duration-500 ease-in-out animate-fadeIn`}
    >
      {/* Fundi Character */}
      <div className="relative h-16 w-16 bg-[#E6B933] rounded-full overflow-hidden border-2 border-[#94C973] shadow-lg flex items-center justify-center animate-bounce-light">
        {/* Jungle decorations */}
        <Leaf className="absolute top-0 right-0 h-4 w-4 text-[#94C973] rotate-45" />
        <Leaf className="absolute top-1 left-1 h-3 w-3 text-[#94C973] -rotate-15" />
        
        <div className="relative flex items-center justify-center">
          {/* Base Fundi with jungle hat */}
          <div className="text-[#1E4A3D] text-3xl font-bold">F</div>
          <Trees className="absolute -top-3 -right-2 h-5 w-5 text-[#1E4A3D]" />
          <Mountain className="absolute -bottom-3 -left-10 h-4 w-4 text-[#4D3C14] opacity-70" />
        </div>
      </div>
      
      {/* Speech Bubble */}
      <div className="relative max-w-xs sm:max-w-sm bg-white p-4 rounded-lg border-2 border-[#94C973] shadow-xl">
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 bg-[#94C973] h-5 w-5 rounded-full flex items-center justify-center">
          <Compass className="h-3 w-3 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 bg-[#E6B933] h-5 w-5 rounded-full flex items-center justify-center">
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