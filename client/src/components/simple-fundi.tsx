import React from 'react';

interface SimpleFundiProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SimpleFundi({ speaking = false, size = "md" }: SimpleFundiProps) {
  // Simple size mapping
  const dimensions = {
    sm: { size: "w-12 h-12", fontSize: "text-xs" },
    md: { size: "w-16 h-16", fontSize: "text-sm" },
    lg: { size: "w-24 h-24", fontSize: "text-base" }
  };

  return (
    <div className={`${dimensions[size].size} flex items-center justify-center relative`}>
      <div className={`rounded-full bg-primary w-full h-full flex items-center justify-center ${speaking ? "animate-pulse" : ""}`}>
        <span className={`text-white font-bold ${dimensions[size].fontSize}`}>F</span>
      </div>
    </div>
  );
}