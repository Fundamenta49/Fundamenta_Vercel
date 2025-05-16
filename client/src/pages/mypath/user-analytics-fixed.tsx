import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Simplified version for demonstration
export default function UserAnalyticsFixed() {
  // Demo data
  const demoAnalyticsData = {
    overallProgress: {
      completionRate: 0.68,
      completed: 24,
      inProgress: 8,
      notStarted: 12
    },
    pathProgress: [
      {
        name: "Financial Basics",
        progress: 85,
        modules: { completed: 17, total: 20 }
      },
      {
        name: "Cooking Skills",
        progress: 60,
        modules: { completed: 9, total: 15 }
      },
      {
        name: "Home Maintenance",
        progress: 33,
        modules: { completed: 4, total: 12 }
      }
    ],
    completionTrend: [
      { date: "2025-04-01", modules: 3 },
      { date: "2025-04-08", modules: 5 },
      { date: "2025-04-15", modules: 7 },
      { date: "2025-04-22", modules: 4 },
      { date: "2025-04-29", modules: 9 }
    ]
  };

  // Fetch user analytics data - would usually come from the API
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/me'],
    queryFn: async () => {
      // Placeholder - in production this would fetch from API
      return demoAnalyticsData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold">Loading Analytics...</h1>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold">Error Loading Analytics</h1>
        <p className="text-red-500">Unable to load your analytics data</p>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Your Learning Analytics</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
        <div className="text-3xl font-bold mb-2">
          {Math.round(analytics.overallProgress.completionRate * 100)}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${analytics.overallProgress.completionRate * 100}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm mt-4">
          <div>
            <div className="font-medium">{analytics.overallProgress.completed}</div>
            <div className="text-gray-500 text-xs">Completed</div>
          </div>
          <div>
            <div className="font-medium">{analytics.overallProgress.inProgress}</div>
            <div className="text-gray-500 text-xs">In Progress</div>
          </div>
          <div>
            <div className="font-medium">{analytics.overallProgress.notStarted}</div>
            <div className="text-gray-500 text-xs">Not Started</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Learning Path Progress</h2>
        <div className="space-y-6">
          {analytics.pathProgress.map((path, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{path.name}</span>
                <span className="text-sm font-medium">{path.progress}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {path.modules.completed}/{path.modules.total} modules
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}