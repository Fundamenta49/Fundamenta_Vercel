import React, { useState } from 'react';
import RobotFundi from '@/components/robot-fundi';

export default function FundiTest() {
  const [category, setCategory] = useState('general');
  const [isJungleTheme, setIsJungleTheme] = useState(false);
  
  const categories = {
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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Fundi Category Color Test</h1>
      
      <div className="flex flex-col items-center mb-12 p-8 bg-gray-50 rounded-xl">
        <div className="mb-8">
          <RobotFundi 
            size="xl" 
            category={category}
            interactive={true}
            emotion={category === 'emergency' ? 'concerned' : 
                    category === 'finance' ? 'happy' :
                    category === 'career' ? 'enthusiastic' :
                    category === 'wellness' ? 'supportive' : 'curious'}
            speaking={false}
            onOpen={() => console.log('Fundi clicked')}
          />
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {Object.entries(categories).map(([cat, color]) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-white transition-transform hover:scale-105 ${
                category === cat ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center mt-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isJungleTheme}
                onChange={() => setIsJungleTheme(!isJungleTheme)}
              />
              <div className={`block w-14 h-8 rounded-full ${
                isJungleTheme ? 'bg-green-600' : 'bg-gray-300'
              }`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                isJungleTheme ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
            <div className="ml-3 text-lg font-medium">
              Jungle Theme
            </div>
          </label>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">About This Test Page</h2>
        <p className="text-gray-700 mb-3">
          This page demonstrates Fundi's appearance with different category colors. 
          Each button changes Fundi to use that category's color scheme.
        </p>
        <p className="text-gray-700 mb-3">
          The category colors are applied to various parts of Fundi's design:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Eyes and facial features</li>
          <li>Antenna light (in non-jungle mode)</li>
          <li>Mouth/speaker elements</li>
        </ul>
        <p className="text-gray-700 mt-3">
          Toggle the "Jungle Theme" switch to see how Fundi appears in jungle mode,
          which overrides the category colors with jungle-themed colors.
        </p>
      </div>
    </div>
  );
}