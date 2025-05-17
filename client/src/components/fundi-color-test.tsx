import React, { useState } from 'react';
import RobotFundi from './robot-fundi';

export function FundiColorTest() {
  const [category, setCategory] = useState('general');
  
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
    <div className="p-4 mt-4 bg-gray-50 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Fundi Category Color Test</h2>
      
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          {/* Radiating glow effect - positioned directly behind Fundi */}
          <div 
            className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full blur-md opacity-30 transition-colors duration-300"
            style={{ 
              backgroundColor: categories[category], 
              transform: 'translate(-50%, -50%)',
              zIndex: 0
            }}
          />
          
          {/* Robot Fundi positioned on top of the glow */}
          <div className="relative" style={{ zIndex: 1 }}>
            <RobotFundi 
              size="xl" 
              category={category}
              interactive={true}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {Object.entries(categories).map(([cat, color]) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-white text-sm ${
              category === cat ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{ backgroundColor: color }}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-gray-600 text-center">
        Click any category button to see Fundi with that category's colors
      </p>
    </div>
  );
}