/**
 * Analytics Service
 * 
 * This service provides functions for retrieving both user-specific analytics
 * and platform-wide analytics data (for admin users only).
 */

const db = require('../db');

/**
 * User-specific analytics
 */
const getUserAnalytics = async (userId) => {
  try {
    // Validate the userId
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get user overall progress
    const overallProgress = await getUserOverallProgress(userId);
    
    // Get recent achievements
    const recentAchievements = await getUserRecentAchievements(userId);
    
    // Get path progress
    const pathProgress = await getUserPathProgress(userId);
    
    // Get completion trend
    const completionTrend = await getUserCompletionTrend(userId);
    
    // Get recent activities
    const recentActivities = await getUserRecentActivities(userId);
    
    // Get activity by day
    const activityByDay = await getUserActivityByDay(userId);
    
    // Get activity by category
    const activityByCategory = await getUserActivityByCategory(userId);
    
    // Get time spent statistics
    const timeSpentStats = await getUserTimeSpentStats(userId);
    
    return {
      overallProgress,
      recentAchievements,
      pathProgress,
      completionTrend,
      recentActivities,
      activityByDay,
      activityByCategory,
      ...timeSpentStats
    };
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }
};

/**
 * Platform-wide analytics (admin only)
 */
const getPlatformAnalytics = async () => {
  try {
    // Get total users count
    const userStats = await getUserStats();
    
    // Get active users
    const activeUsers = await getActiveUsers();
    
    // Get popular paths
    const popularPaths = await getPopularPaths();
    
    // Get completion rates
    const completionRates = await getCompletionRates();
    
    // Get engagement metrics
    const engagementMetrics = await getEngagementMetrics();
    
    return {
      userStats,
      activeUsers,
      popularPaths,
      completionRates,
      engagementMetrics
    };
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    throw error;
  }
};

// Helper functions for user analytics

const getUserOverallProgress = async (userId) => {
  // Placeholder data - in production, this would query the database
  return {
    completed: 24,
    inProgress: 8,
    notStarted: 12,
    completionRate: 0.55,
    totalModules: 44
  };
};

const getUserRecentAchievements = async (userId) => {
  // Placeholder data - in production, this would query the database
  return [
    { id: 1, title: 'Completed First Path', date: '2025-05-10', type: 'completion', points: 100 },
    { id: 2, title: '5-Day Streak', date: '2025-05-08', type: 'streak', points: 50 },
    { id: 3, title: 'Financial Explorer', date: '2025-05-05', type: 'skill', points: 75 }
  ];
};

const getUserPathProgress = async (userId) => {
  // Placeholder data - in production, this would query the database
  return [
    { id: 1, name: 'Financial Basics', progress: 85, modules: { completed: 17, total: 20 } },
    { id: 2, name: 'Cooking Fundamentals', progress: 60, modules: { completed: 6, total: 10 } },
    { id: 3, name: 'Home Maintenance', progress: 25, modules: { completed: 3, total: 12 } }
  ];
};

const getUserCompletionTrend = async (userId) => {
  // Placeholder data - in production, this would query the database
  const today = new Date();
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      modules: Math.floor(Math.random() * 3) // 0-2 modules completed per day
    });
  }
  
  return data;
};

const getUserRecentActivities = async (userId) => {
  // Placeholder data - in production, this would query the database
  return [
    { id: 1, type: 'module_completion', title: 'Completed "Budgeting Basics"', date: '2025-05-15T14:30:00Z', category: 'finance' },
    { id: 2, type: 'quiz_completion', title: 'Scored 95% on "Cooking Terms"', date: '2025-05-14T10:15:00Z', category: 'cooking' },
    { id: 3, type: 'path_started', title: 'Started "Home Maintenance" path', date: '2025-05-13T16:45:00Z', category: 'home' },
    { id: 4, type: 'achievement', title: 'Earned "Financial Planner" badge', date: '2025-05-12T09:20:00Z', category: 'finance' },
    { id: 5, type: 'module_completion', title: 'Completed "Simple Repairs"', date: '2025-05-11T11:50:00Z', category: 'home' }
  ];
};

const getUserActivityByDay = async (userId) => {
  // Placeholder data - in production, this would query the database
  return [
    { day: 'Monday', count: 7 },
    { day: 'Tuesday', count: 5 },
    { day: 'Wednesday', count: 8 },
    { day: 'Thursday', count: 6 },
    { day: 'Friday', count: 9 },
    { day: 'Saturday', count: 4 },
    { day: 'Sunday', count: 3 }
  ];
};

const getUserActivityByCategory = async (userId) => {
  // Placeholder data - in production, this would query the database
  return [
    { category: 'Finance', count: 12 },
    { category: 'Cooking', count: 8 },
    { category: 'Home', count: 5 },
    { category: 'Personal Growth', count: 7 },
    { category: 'Health', count: 6 }
  ];
};

const getUserTimeSpentStats = async (userId) => {
  // Placeholder data - in production, this would query the database
  
  // Total hours spent learning
  const totalHoursSpent = 28.5;
  
  // Average time per session (in minutes)
  const averageTimePerSession = 32;
  
  // Time spent by category (in hours)
  const timeSpentByCategory = [
    { category: 'Finance', hours: 10.5 },
    { category: 'Cooking', hours: 6.2 },
    { category: 'Home', hours: 4.8 },
    { category: 'Personal Growth', hours: 3.5 },
    { category: 'Health', hours: 3.5 }
  ];
  
  // Time spent by day (last 7 days, in minutes)
  const today = new Date();
  const timeSpentByDay = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    timeSpentByDay.push({
      date: dateStr,
      minutes: Math.floor(Math.random() * 60) + 15 // 15-75 minutes per day
    });
  }
  
  return {
    totalHoursSpent,
    averageTimePerSession,
    timeSpentByCategory,
    timeSpentByDay
  };
};

// Helper functions for platform analytics

const getUserStats = async () => {
  // Placeholder data - in production, this would query the database
  return {
    totalUsers: 2485,
    newUsersLast30Days: 342,
    activeUsersLast7Days: 1203,
    completionRate: 0.68,
    averageCoursesPerUser: 2.7
  };
};

const getActiveUsers = async () => {
  // Placeholder data - in production, this would query the database
  const today = new Date();
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      activeUsers: Math.floor(Math.random() * 200) + 800 // 800-1000 active users per day
    });
  }
  
  return data;
};

const getPopularPaths = async () => {
  // Placeholder data - in production, this would query the database
  return [
    { id: 1, name: 'Financial Basics', enrollments: 1245, completions: 876, rating: 4.7 },
    { id: 2, name: 'Cooking Fundamentals', enrollments: 982, completions: 654, rating: 4.9 },
    { id: 3, name: 'Home Maintenance', enrollments: 876, completions: 523, rating: 4.5 },
    { id: 4, name: 'Personal Growth', enrollments: 765, completions: 432, rating: 4.8 },
    { id: 5, name: 'Health Essentials', enrollments: 687, completions: 398, rating: 4.6 }
  ];
};

const getCompletionRates = async () => {
  // Placeholder data - in production, this would query the database
  return [
    { category: 'Finance', completionRate: 0.72 },
    { category: 'Cooking', completionRate: 0.68 },
    { category: 'Home', completionRate: 0.59 },
    { category: 'Personal Growth', completionRate: 0.65 },
    { category: 'Health', completionRate: 0.61 }
  ];
};

const getEngagementMetrics = async () => {
  // Placeholder data - in production, this would query the database
  return {
    averageSessionDuration: 28.5, // in minutes
    averageActivitiesPerWeek: 8.3,
    returnRate: 0.76,
    averageCompletionTime: 14.2, // in days
    mostActiveTimeOfDay: '18:00-20:00'
  };
};

module.exports = {
  getUserAnalytics,
  getPlatformAnalytics
};