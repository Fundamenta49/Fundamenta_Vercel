import React from 'react';
import { useJungleFundi } from '../contexts/JungleFundiContext';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import FundiAvatarEnhanced from '../../components/fundi-avatar-enhanced';

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
      {/* Standard Fundi Avatar - Using existing implementation */}
      <div className="relative">
        <FundiAvatarEnhanced
          size="lg"
          category="learning"
          glowEffect={true}
          withShadow={true}
        />
      </div>
      
      {/* Speech Bubble - Simple jungle-themed styling with good readability */}
      <div className="relative max-w-xs sm:max-w-sm bg-white p-4 rounded-lg border border-[#94C973] shadow-md">
        {/* Speech content - Clear, readable text */}
        <p className="text-sm text-[#1E4A3D] font-medium">{fundiMessage}</p>
        
        {/* Bubble pointer */}
        <div className="absolute -left-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"></div>
      </div>
    </div>
  );
}