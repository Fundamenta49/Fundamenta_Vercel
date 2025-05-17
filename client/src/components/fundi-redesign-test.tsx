import React, { useState } from 'react';
import { useJungleTheme } from "../jungle-path/contexts/JungleThemeContext";

export default function FundiRedesignTest() {
  const [category, setCategory] = useState('general');
  const [emotion, setEmotion] = useState('neutral');
  const [speaking, setSpeaking] = useState(false);
  const [size, setSize] = useState('xl');
  const { isJungleTheme, toggleJungleTheme } = useJungleTheme();
  
  // Define category colors
  const categoryColors: Record<string, string> = {
    finance: '#22c55e',
    career: '#3b82f6',
    wellness: '#a855f7',
    learning: '#f97316',
    emergency: '#ef4444',
    cooking: '#f59e0b',
    fitness: '#06b6d4',
    general: '#6366f1',
    tour: '#6366f1',
  };
  
  // Size variants
  const sizeVariants: Record<string, string> = {
    xs: 'w-16 h-16',  // 64px
    sm: 'w-20 h-20',  // 80px
    md: 'w-24 h-24',  // 96px
    lg: 'w-28 h-28',  // 112px
    xl: 'w-32 h-32'   // 128px
  };

  // When in jungle mode, use jungle theme colors regardless of category
  const mainColor = isJungleTheme 
    ? '#2A6D4D' // Jungle green for eyes/features when in jungle mode 
    : (categoryColors[category] || categoryColors.general);
    
  // Define accent colors for different parts of the robot based on the main color
  const robotColors = {
    // Main accent color (from category)
    main: mainColor,
    // Light background for head and body in non-jungle mode
    lightBg: isJungleTheme ? "#ECEFD2" : "#C0C0C0",
    // Very light background for body in non-jungle mode
    veryLightBg: isJungleTheme ? "#EFF3D6" : "#f5f5f5",
    // Antenna light color - uses category color in non-jungle mode
    antennaLight: isJungleTheme ? "#AECBA9" : mainColor,
    // Screen background is always dark
    screenBg: "#000"
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Fundi Redesign Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Category</h2>
            <div className="flex flex-wrap gap-2">
              {Object.keys(categoryColors).map(cat => (
                <button
                  key={cat}
                  className={`px-3 py-1 rounded ${category === cat ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Emotion</h2>
            <div className="flex flex-wrap gap-2">
              {['neutral', 'happy', 'sad', 'enthusiastic'].map(emo => (
                <button
                  key={emo}
                  className={`px-3 py-1 rounded ${emotion === emo ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                  onClick={() => setEmotion(emo)}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Size</h2>
            <div className="flex flex-wrap gap-2">
              {Object.keys(sizeVariants).map(sz => (
                <button
                  key={sz}
                  className={`px-3 py-1 rounded ${size === sz ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                  onClick={() => setSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Speaking</h2>
              <button
                className={`px-3 py-1 rounded ${speaking ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                onClick={() => setSpeaking(!speaking)}
              >
                {speaking ? 'Speaking: ON' : 'Speaking: OFF'}
              </button>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Theme</h2>
              <button
                className={`px-3 py-1 rounded ${isJungleTheme ? 'bg-green-800 text-white' : 'bg-gray-200'}`}
                onClick={toggleJungleTheme}
              >
                {isJungleTheme ? 'Jungle: ON' : 'Jungle: OFF'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className={`relative ${sizeVariants[size]}`}>
            {/* Radiating glow effect */}
            <div 
              className="absolute top-1/2 left-1/2 rounded-full blur-md opacity-30 pointer-events-none transition-colors duration-300"
              style={{ 
                backgroundColor: robotColors.main,
                width: '90%',
                height: '90%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1
              }}
            />
            
            {/* Robot SVG */}
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                <pattern id="leafPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                  <circle cx="5" cy="5" r="4" fill="#2A6D4D"/>
                  <path d="M5 2 Q7 5 5 8" stroke="#1A4D2D" strokeWidth="1" fill="none"/>
                </pattern>
              </defs>
              
              {/* Head */}
              <rect x="25" y="10" width="50" height="40" rx="15" fill={robotColors.lightBg}/>
              
              {/* Faceplate */}
              <rect x="30" y="15" width="40" height="30" fill={robotColors.screenBg}/>
              
              {/* Eyes */}
              <ellipse 
                cx="40" 
                cy="25" 
                rx={speaking ? "6" : "5"} 
                ry={speaking ? "8" : "7"} 
                fill={robotColors.main}
              >
                {speaking && (
                  <>
                    <animate attributeName="rx" values="5;6;5" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="ry" values="7;8;7" dur="2s" repeatCount="indefinite"/>
                  </>
                )}
              </ellipse>
              <ellipse 
                cx="60" 
                cy="25" 
                rx={speaking ? "6" : "5"} 
                ry={speaking ? "8" : "7"} 
                fill={robotColors.main}
              >
                {speaking && (
                  <>
                    <animate attributeName="rx" values="5;6;5" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="ry" values="7;8;7" dur="2s" repeatCount="indefinite"/>
                  </>
                )}
              </ellipse>
              
              {/* Antenna Ears */}
              <circle cx="25" cy="15" r="5" fill={robotColors.lightBg}/>
              <circle cx="75" cy="15" r="5" fill={robotColors.lightBg}/>
              
              {/* Body */}
              <rect x="30" y="50" width="40" height="30" rx="10" fill={robotColors.lightBg}/>
              
              {/* Chest Orb */}
              <circle cx="50" cy="55" r="5" fill={robotColors.main} />
              
              {/* Arms */}
              <rect x="20" y="50" width="10" height="15" rx="5" fill={robotColors.lightBg}>
                {speaking && (
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    values="-5 25 50;5 25 50;-5 25 50" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                )}
              </rect>
              <rect x="70" y="50" width="10" height="15" rx="5" fill={robotColors.lightBg}>
                {speaking && (
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    values="5 75 50;-5 75 50;5 75 50" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                )}
              </rect>
              
              {/* Base Glow */}
              <ellipse cx="50" cy="90" rx="20" ry="10" fill={robotColors.main}>
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.5s" repeatCount="indefinite"/>
              </ellipse>
              
              {/* Data Streams */}
              <circle cx="50" cy="70" r="2" fill={robotColors.main} opacity="0.5">
                <animate attributeName="cy" values="70;50" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="45" cy="65" r="2" fill={robotColors.main} opacity="0.5">
                <animate attributeName="cy" values="65;45" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="55" cy="75" r="2" fill={robotColors.main} opacity="0.5">
                <animate attributeName="cy" values="75;55" dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0" dur="3.5s" repeatCount="indefinite"/>
              </circle>
              
              {/* Jungle mode elements */}
              {isJungleTheme && (
                <>
                  {/* Jungle Body */}
                  <rect x="30" y="50" width="40" height="30" rx="10" fill="#2A6D4D"/>
                  
                  {/* Vine Overlay */}
                  <rect x="35" y="20" width="30" height="10" fill="url(#leafPattern)"/>
                  
                  {/* Jungle Helmet */}
                  <ellipse cx="50" cy="15" rx="25" ry="7" fill="#E6B933" />
                  <path d="M30 15 Q50 5 70 15" fill="#C49A2B" stroke="#BF8C25" strokeWidth="1.5" />
                  
                  {/* Jungle Base Glow */}
                  <ellipse cx="50" cy="90" rx="20" ry="10" fill="#2A6D4D">
                    <animate attributeName="rx" values="20;22;20" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="ry" values="10;12;10" dur="2s" repeatCount="indefinite"/>
                  </ellipse>
                </>
              )}
              
              {/* Emotion expressions */}
              {emotion === 'happy' && (
                <path 
                  d="M40,40 Q50,45 60,40" 
                  stroke={robotColors.main} 
                  strokeWidth="3" 
                  fill="none"
                />
              )}
              
              {emotion === 'sad' && (
                <path 
                  d="M40,45 Q50,40 60,45" 
                  stroke={robotColors.main} 
                  strokeWidth="3" 
                  fill="none"
                />
              )}
              
              {/* Speaking mouth animation */}
              {speaking && (
                <rect 
                  x="45" 
                  y="35" 
                  width="10" 
                  height="5" 
                  fill={robotColors.main}
                >
                  <animate 
                    attributeName="height" 
                    values="2;5;2" 
                    dur="0.5s" 
                    repeatCount="indefinite"
                  />
                </rect>
              )}
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Current Settings</h2>
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify({
            category,
            emotion,
            speaking,
            size,
            isJungleTheme,
            robotColors
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}