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
        <RobotFundi 
          size="xl" 
          category={category}
          interactive={true}
        />
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