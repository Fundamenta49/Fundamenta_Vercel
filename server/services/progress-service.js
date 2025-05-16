/**
 * Student Progress Tracking Service
 * 
 * Provides optimized database queries and caching for tracking student progress
 * across learning paths, modules, and activities.
 */

const { db } = require('../db');
const { eq, and, gte, lte, sql } = require('drizzle-orm');
const NodeCache = require('node-cache');

// Set up cache with TTL of 5 minutes and check period of 10 minutes
const progressCache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 600, // 10 minutes
  useClones: false
});

// Cache keys
const CACHE_KEYS = {
  userProgress: (userId) => `progress:${userId}`,
  pathProgress: (userId, pathId) => `progress:${userId}:path:${pathId}`,
  moduleProgress: (userId, moduleId) => `progress:${userId}:module:${moduleId}`,
  completionRates: 'stats:completion-rates',
  recentActivities: (userId) => `activities:${userId}:recent`,
  weeklyStats: (userId) => `stats:${userId}:weekly`,
  achievements: (userId) => `achievements:${userId}`
};

/**
 * Get a user's overall progress across all learning paths
 */
async function getUserProgress(userId) {
  // Check cache first
  const cacheKey = CACHE_KEYS.userProgress(userId);
  const cachedProgress = progressCache.get(cacheKey);
  
  if (cachedProgress) {
    return cachedProgress;
  }
  
  try {
    // Optimize query: Use a more efficient join and group by
    const result = await db.execute(sql`
      WITH user_modules AS (
        SELECT 
          p.id AS path_id,
          p.name AS path_name,
          COUNT(m.id) AS total_modules,
          SUM(CASE WHEN mp.status = 'completed' THEN 1 ELSE 0 END) AS completed_modules,
          SUM(CASE WHEN mp.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_modules
        FROM 
          learning_paths p
        LEFT JOIN 
          modules m ON m.path_id = p.id
        LEFT JOIN 
          module_progress mp ON mp.module_id = m.id AND mp.user_id = ${userId}
        WHERE 
          p.is_active = true
        GROUP BY 
          p.id, p.name
      )
      SELECT 
        path_id,
        path_name,
        total_modules,
        completed_modules,
        in_progress_modules,
        CASE 
          WHEN total_modules = 0 THEN 0 
          ELSE CAST(completed_modules AS FLOAT) / total_modules 
        END AS completion_rate
      FROM 
        user_modules
      ORDER BY 
        completion_rate DESC
    `);
    
    // Calculate overall stats
    const paths = result.rows || [];
    
    const totalModules = paths.reduce((sum, path) => sum + parseInt(path.total_modules), 0);
    const completedModules = paths.reduce((sum, path) => sum + parseInt(path.completed_modules), 0);
    const inProgressModules = paths.reduce((sum, path) => sum + parseInt(path.in_progress_modules), 0);
    
    const overallProgress = {
      paths,
      stats: {
        totalPaths: paths.length,
        completedPaths: paths.filter(p => parseInt(p.completed_modules) === parseInt(p.total_modules)).length,
        totalModules,
        completedModules,
        inProgressModules,
        notStartedModules: totalModules - completedModules - inProgressModules,
        completionRate: totalModules > 0 ? completedModules / totalModules : 0
      }
    };
    
    // Cache the result
    progressCache.set(cacheKey, overallProgress);
    
    return overallProgress;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

/**
 * Get a user's progress for a specific learning path
 */
async function getPathProgress(userId, pathId) {
  // Check cache first
  const cacheKey = CACHE_KEYS.pathProgress(userId, pathId);
  const cachedProgress = progressCache.get(cacheKey);
  
  if (cachedProgress) {
    return cachedProgress;
  }
  
  try {
    // Optimize query: Use a more efficient join and include time tracking
    const result = await db.execute(sql`
      WITH module_stats AS (
        SELECT 
          m.id,
          m.title,
          m.description,
          m.order_index,
          m.estimated_minutes,
          mp.status,
          mp.last_accessed_at,
          mp.completed_at,
          mp.time_spent_seconds,
          a.total_activities,
          a.completed_activities
        FROM 
          modules m
        LEFT JOIN 
          module_progress mp ON mp.module_id = m.id AND mp.user_id = ${userId}
        LEFT JOIN (
          SELECT 
            activity.module_id,
            COUNT(*) AS total_activities,
            SUM(CASE WHEN ap.status = 'completed' THEN 1 ELSE 0 END) AS completed_activities
          FROM 
            activities activity
          LEFT JOIN 
            activity_progress ap ON ap.activity_id = activity.id AND ap.user_id = ${userId}
          GROUP BY 
            activity.module_id
        ) a ON a.module_id = m.id
        WHERE 
          m.path_id = ${pathId}
        ORDER BY 
          m.order_index
      )
      SELECT 
        ms.*,
        CASE 
          WHEN ms.total_activities = 0 THEN 0 
          ELSE CAST(ms.completed_activities AS FLOAT) / ms.total_activities 
        END AS completion_rate
      FROM 
        module_stats ms
    `);
    
    // Get learning path info
    const pathInfoResult = await db.execute(sql`
      SELECT 
        p.id, p.name, p.description, p.category, p.difficulty, p.estimated_hours, p.created_at
      FROM 
        learning_paths p
      WHERE 
        p.id = ${pathId}
    `);
    
    const modules = result.rows || [];
    const pathInfo = pathInfoResult.rows?.[0] || {};
    
    // Calculate overall path progress
    const totalActivities = modules.reduce((sum, m) => sum + (parseInt(m.total_activities) || 0), 0);
    const completedActivities = modules.reduce((sum, m) => sum + (parseInt(m.completed_activities) || 0), 0);
    const totalTimeSpent = modules.reduce((sum, m) => sum + (parseInt(m.time_spent_seconds) || 0), 0);
    
    const completedModules = modules.filter(m => m.status === 'completed').length;
    const inProgressModules = modules.filter(m => m.status === 'in_progress').length;
    
    const pathProgress = {
      path: pathInfo,
      modules,
      stats: {
        totalModules: modules.length,
        completedModules,
        inProgressModules,
        notStartedModules: modules.length - completedModules - inProgressModules,
        totalActivities,
        completedActivities,
        completionRate: modules.length > 0 ? completedModules / modules.length : 0,
        activityCompletionRate: totalActivities > 0 ? completedActivities / totalActivities : 0,
        totalTimeSpentSeconds: totalTimeSpent,
        totalTimeSpentMinutes: Math.round(totalTimeSpent / 60),
        startedAt: modules.find(m => m.last_accessed_at)?.last_accessed_at || null,
        lastAccessedAt: modules.map(m => m.last_accessed_at).filter(Boolean).sort().pop() || null
      }
    };
    
    // Cache the result
    progressCache.set(cacheKey, pathProgress);
    
    return pathProgress;
  } catch (error) {
    console.error('Error fetching path progress:', error);
    throw error;
  }
}

/**
 * Get a user's progress for a specific module
 */
async function getModuleProgress(userId, moduleId) {
  // Check cache first
  const cacheKey = CACHE_KEYS.moduleProgress(userId, moduleId);
  const cachedProgress = progressCache.get(cacheKey);
  
  if (cachedProgress) {
    return cachedProgress;
  }
  
  try {
    // Optimize query: Use a more efficient join and include activity details
    const result = await db.execute(sql`
      WITH activity_stats AS (
        SELECT 
          a.id,
          a.title,
          a.type,
          a.order_index,
          a.estimated_minutes,
          ap.status,
          ap.score,
          ap.last_accessed_at,
          ap.completed_at,
          ap.time_spent_seconds,
          ap.attempts
        FROM 
          activities a
        LEFT JOIN 
          activity_progress ap ON ap.activity_id = a.id AND ap.user_id = ${userId}
        WHERE 
          a.module_id = ${moduleId}
        ORDER BY 
          a.order_index
      )
      SELECT * FROM activity_stats
    `);
    
    // Get module info
    const moduleInfoResult = await db.execute(sql`
      SELECT 
        m.id, m.title, m.description, m.path_id, m.order_index, m.estimated_minutes,
        mp.status, mp.last_accessed_at, mp.completed_at, mp.time_spent_seconds,
        p.name AS path_name
      FROM 
        modules m
      LEFT JOIN 
        module_progress mp ON mp.module_id = m.id AND mp.user_id = ${userId}
      LEFT JOIN 
        learning_paths p ON p.id = m.path_id
      WHERE 
        m.id = ${moduleId}
    `);
    
    const activities = result.rows || [];
    const moduleInfo = moduleInfoResult.rows?.[0] || {};
    
    // Calculate overall module progress
    const completedActivities = activities.filter(a => a.status === 'completed').length;
    const inProgressActivities = activities.filter(a => a.status === 'in_progress').length;
    const totalTimeSpent = activities.reduce((sum, a) => sum + (parseInt(a.time_spent_seconds) || 0), 0);
    const averageScore = activities
      .filter(a => a.score !== null && a.score !== undefined)
      .reduce((sum, a, i, arr) => sum + (parseInt(a.score) / arr.length), 0);
    
    const moduleProgress = {
      module: moduleInfo,
      activities,
      stats: {
        totalActivities: activities.length,
        completedActivities,
        inProgressActivities,
        notStartedActivities: activities.length - completedActivities - inProgressActivities,
        completionRate: activities.length > 0 ? completedActivities / activities.length : 0,
        averageScore: isNaN(averageScore) ? null : averageScore,
        totalTimeSpentSeconds: totalTimeSpent + (parseInt(moduleInfo.time_spent_seconds) || 0),
        totalTimeSpentMinutes: Math.round((totalTimeSpent + (parseInt(moduleInfo.time_spent_seconds) || 0)) / 60),
        startedAt: moduleInfo.last_accessed_at || null,
        lastAccessedAt: moduleInfo.last_accessed_at || null,
        completedAt: moduleInfo.completed_at || null
      }
    };
    
    // Cache the result
    progressCache.set(cacheKey, moduleProgress);
    
    return moduleProgress;
  } catch (error) {
    console.error('Error fetching module progress:', error);
    throw error;
  }
}

/**
 * Record user activity progress
 */
async function recordActivityProgress(userId, activityId, progressData) {
  try {
    // Add timestamp for the update
    const now = new Date();
    const updateData = {
      ...progressData,
      last_accessed_at: now
    };
    
    // If status is changing to completed, add completion timestamp
    if (progressData.status === 'completed') {
      updateData.completed_at = now;
    }
    
    // Update or insert the activity progress
    const result = await db.execute(sql`
      INSERT INTO activity_progress (
        user_id, activity_id, status, score, time_spent_seconds, attempts, 
        last_accessed_at, completed_at
      )
      VALUES (
        ${userId}, ${activityId}, ${updateData.status}, ${updateData.score || null},
        ${updateData.time_spent_seconds || 0}, ${updateData.attempts || 1},
        ${updateData.last_accessed_at}, ${updateData.completed_at || null}
      )
      ON CONFLICT (user_id, activity_id) DO UPDATE SET
        status = ${updateData.status},
        score = CASE WHEN ${updateData.score} IS NOT NULL THEN ${updateData.score} ELSE activity_progress.score END,
        time_spent_seconds = activity_progress.time_spent_seconds + ${updateData.time_spent_seconds || 0},
        attempts = activity_progress.attempts + CASE WHEN ${updateData.attempts} > 0 THEN 1 ELSE 0 END,
        last_accessed_at = ${updateData.last_accessed_at},
        completed_at = CASE 
          WHEN activity_progress.completed_at IS NULL AND ${updateData.status} = 'completed' 
          THEN ${updateData.completed_at} 
          ELSE activity_progress.completed_at 
        END
      RETURNING *
    `);
    
    // Update module progress based on activities
    await updateModuleProgress(userId, activityId);
    
    // Clear relevant caches
    clearUserCaches(userId);
    
    return result.rows?.[0];
  } catch (error) {
    console.error('Error recording activity progress:', error);
    throw error;
  }
}

/**
 * Update module progress based on activity completion
 */
async function updateModuleProgress(userId, activityId) {
  try {
    // Find module for this activity
    const moduleResult = await db.execute(sql`
      SELECT module_id FROM activities WHERE id = ${activityId}
    `);
    
    if (!moduleResult.rows?.length) {
      return null;
    }
    
    const moduleId = moduleResult.rows[0].module_id;
    
    // Calculate module completion stats
    const statsResult = await db.execute(sql`
      WITH activity_counts AS (
        SELECT 
          COUNT(*) AS total_activities,
          SUM(CASE WHEN ap.status = 'completed' THEN 1 ELSE 0 END) AS completed_activities,
          SUM(CASE WHEN ap.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_activities,
          SUM(COALESCE(ap.time_spent_seconds, 0)) AS total_time_spent
        FROM 
          activities a
        LEFT JOIN 
          activity_progress ap ON ap.activity_id = a.id AND ap.user_id = ${userId}
        WHERE 
          a.module_id = ${moduleId}
      )
      SELECT * FROM activity_counts
    `);
    
    const stats = statsResult.rows?.[0] || {
      total_activities: 0,
      completed_activities: 0,
      in_progress_activities: 0,
      total_time_spent: 0
    };
    
    // Determine module status
    let moduleStatus = 'not_started';
    
    if (parseInt(stats.completed_activities) > 0) {
      if (parseInt(stats.completed_activities) === parseInt(stats.total_activities)) {
        moduleStatus = 'completed';
      } else {
        moduleStatus = 'in_progress';
      }
    } else if (parseInt(stats.in_progress_activities) > 0) {
      moduleStatus = 'in_progress';
    }
    
    // Update module progress
    const now = new Date();
    const completedAt = moduleStatus === 'completed' ? now : null;
    
    await db.execute(sql`
      INSERT INTO module_progress (
        user_id, module_id, status, time_spent_seconds, last_accessed_at, completed_at
      )
      VALUES (
        ${userId}, ${moduleId}, ${moduleStatus}, ${stats.total_time_spent},
        ${now}, ${completedAt}
      )
      ON CONFLICT (user_id, module_id) DO UPDATE SET
        status = ${moduleStatus},
        time_spent_seconds = ${stats.total_time_spent},
        last_accessed_at = ${now},
        completed_at = CASE 
          WHEN module_progress.completed_at IS NULL AND ${moduleStatus} = 'completed' 
          THEN ${completedAt} 
          ELSE module_progress.completed_at 
        END
    `);
    
    // Update learning path progress if module status changed to completed
    if (moduleStatus === 'completed') {
      await updatePathProgress(userId, moduleId);
    }
    
    return { moduleId, status: moduleStatus };
  } catch (error) {
    console.error('Error updating module progress:', error);
    throw error;
  }
}

/**
 * Update path progress based on module completion
 */
async function updatePathProgress(userId, moduleId) {
  try {
    // Find path for this module
    const pathResult = await db.execute(sql`
      SELECT path_id FROM modules WHERE id = ${moduleId}
    `);
    
    if (!pathResult.rows?.length) {
      return null;
    }
    
    const pathId = pathResult.rows[0].path_id;
    
    // Calculate path completion stats
    const statsResult = await db.execute(sql`
      WITH module_counts AS (
        SELECT 
          COUNT(*) AS total_modules,
          SUM(CASE WHEN mp.status = 'completed' THEN 1 ELSE 0 END) AS completed_modules,
          SUM(CASE WHEN mp.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_modules
        FROM 
          modules m
        LEFT JOIN 
          module_progress mp ON mp.module_id = m.id AND mp.user_id = ${userId}
        WHERE 
          m.path_id = ${pathId}
      )
      SELECT * FROM module_counts
    `);
    
    const stats = statsResult.rows?.[0] || {
      total_modules: 0,
      completed_modules: 0,
      in_progress_modules: 0
    };
    
    // Update user achievements if path completed
    if (parseInt(stats.completed_modules) === parseInt(stats.total_modules)) {
      await recordPathCompletion(userId, pathId);
    }
    
    return { pathId, stats };
  } catch (error) {
    console.error('Error updating path progress:', error);
    throw error;
  }
}

/**
 * Record path completion achievement
 */
async function recordPathCompletion(userId, pathId) {
  try {
    // Get path info
    const pathResult = await db.execute(sql`
      SELECT name, category FROM learning_paths WHERE id = ${pathId}
    `);
    
    if (!pathResult.rows?.length) {
      return null;
    }
    
    const path = pathResult.rows[0];
    
    // Record achievement
    const achievementData = {
      user_id: userId,
      type: 'path_completion',
      title: `Completed ${path.name}`,
      description: `Successfully completed the ${path.name} learning path`,
      points: 100,
      metadata: JSON.stringify({
        path_id: pathId,
        path_name: path.name,
        category: path.category
      })
    };
    
    await db.execute(sql`
      INSERT INTO user_achievements (
        user_id, type, title, description, points, metadata, awarded_at
      )
      VALUES (
        ${achievementData.user_id}, ${achievementData.type}, ${achievementData.title},
        ${achievementData.description}, ${achievementData.points}, 
        ${achievementData.metadata}, NOW()
      )
      ON CONFLICT (user_id, type, title) DO NOTHING
    `);
    
    // Clear user achievements cache
    progressCache.del(CACHE_KEYS.achievements(userId));
    
    return achievementData;
  } catch (error) {
    console.error('Error recording path completion:', error);
    throw error;
  }
}

/**
 * Get user recent activities
 */
async function getUserRecentActivities(userId, limit = 10) {
  // Check cache first
  const cacheKey = CACHE_KEYS.recentActivities(userId);
  const cachedActivities = progressCache.get(cacheKey);
  
  if (cachedActivities) {
    return cachedActivities.slice(0, limit);
  }
  
  try {
    const result = await db.execute(sql`
      WITH recent_activities AS (
        -- Module completions
        SELECT 
          'module_completion' AS type,
          CONCAT('Completed "', m.title, '"') AS title,
          mp.completed_at AS date,
          p.category,
          m.id AS source_id,
          m.path_id AS parent_id,
          p.name AS parent_name
        FROM 
          module_progress mp
        JOIN 
          modules m ON mp.module_id = m.id
        JOIN 
          learning_paths p ON m.path_id = p.id
        WHERE 
          mp.user_id = ${userId}
          AND mp.status = 'completed'
          
        UNION ALL
        
        -- Activity completions
        SELECT 
          CONCAT(a.type, '_completion') AS type,
          CONCAT(
            CASE 
              WHEN a.type = 'quiz' THEN CONCAT('Scored ', ap.score, '% on "')
              ELSE 'Completed "'
            END,
            a.title, '"'
          ) AS title,
          ap.completed_at AS date,
          p.category,
          a.id AS source_id,
          m.id AS parent_id,
          m.title AS parent_name
        FROM 
          activity_progress ap
        JOIN 
          activities a ON ap.activity_id = a.id
        JOIN 
          modules m ON a.module_id = m.id
        JOIN 
          learning_paths p ON m.path_id = p.id
        WHERE 
          ap.user_id = ${userId}
          AND ap.status = 'completed'
          
        UNION ALL
        
        -- Path starts
        SELECT 
          'path_started' AS type,
          CONCAT('Started "', p.name, '" path') AS title,
          MIN(mp.last_accessed_at) AS date,
          p.category,
          p.id AS source_id,
          NULL AS parent_id,
          NULL AS parent_name
        FROM 
          module_progress mp
        JOIN 
          modules m ON mp.module_id = m.id
        JOIN 
          learning_paths p ON m.path_id = p.id
        WHERE 
          mp.user_id = ${userId}
        GROUP BY 
          p.id, p.name, p.category
          
        UNION ALL
        
        -- Achievements
        SELECT 
          'achievement' AS type,
          CONCAT('Earned "', ua.title, '" badge') AS title,
          ua.awarded_at AS date,
          COALESCE(
            CASE 
              WHEN ua.metadata::json->>'category' IS NOT NULL 
              THEN ua.metadata::json->>'category'
              ELSE 'achievement'
            END,
            'achievement'
          ) AS category,
          ua.id AS source_id,
          NULL AS parent_id,
          NULL AS parent_name
        FROM 
          user_achievements ua
        WHERE 
          ua.user_id = ${userId}
      )
      SELECT * FROM recent_activities
      ORDER BY date DESC
      LIMIT 50
    `);
    
    const activities = result.rows || [];
    
    // Cache the result (store more than requested for future limit changes)
    progressCache.set(cacheKey, activities);
    
    return activities.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
}

/**
 * Get user weekly statistics
 */
async function getUserWeeklyStats(userId) {
  // Check cache first
  const cacheKey = CACHE_KEYS.weeklyStats(userId);
  const cachedStats = progressCache.get(cacheKey);
  
  if (cachedStats) {
    return cachedStats;
  }
  
  try {
    // Get activity by day
    const activityByDayResult = await db.execute(sql`
      WITH dates AS (
        SELECT generate_series(
          DATE_TRUNC('day', NOW() - INTERVAL '6 days'),
          DATE_TRUNC('day', NOW()),
          '1 day'::interval
        ) AS day
      ),
      daily_activities AS (
        SELECT 
          DATE_TRUNC('day', ap.last_accessed_at) AS day,
          COUNT(*) AS count
        FROM 
          activity_progress ap
        WHERE 
          ap.user_id = ${userId}
          AND ap.last_accessed_at >= NOW() - INTERVAL '7 days'
        GROUP BY 
          DATE_TRUNC('day', ap.last_accessed_at)
      )
      SELECT 
        to_char(d.day, 'Day') AS day_name,
        EXTRACT(DOW FROM d.day) AS day_number,
        COALESCE(da.count, 0) AS count
      FROM 
        dates d
      LEFT JOIN 
        daily_activities da ON d.day = da.day
      ORDER BY 
        d.day
    `);
    
    // Get activity by category
    const activityByCategoryResult = await db.execute(sql`
      SELECT 
        p.category,
        COUNT(*) AS count
      FROM 
        activity_progress ap
      JOIN 
        activities a ON ap.activity_id = a.id
      JOIN 
        modules m ON a.module_id = m.id
      JOIN 
        learning_paths p ON m.path_id = p.id
      WHERE 
        ap.user_id = ${userId}
        AND ap.last_accessed_at >= NOW() - INTERVAL '30 days'
      GROUP BY 
        p.category
      ORDER BY 
        count DESC
    `);
    
    // Get time spent by category
    const timeSpentByCategoryResult = await db.execute(sql`
      SELECT 
        p.category,
        SUM(ap.time_spent_seconds) / 3600.0 AS hours
      FROM 
        activity_progress ap
      JOIN 
        activities a ON ap.activity_id = a.id
      JOIN 
        modules m ON a.module_id = m.id
      JOIN 
        learning_paths p ON m.path_id = p.id
      WHERE 
        ap.user_id = ${userId}
      GROUP BY 
        p.category
      ORDER BY 
        hours DESC
    `);
    
    // Get time spent by day
    const timeSpentByDayResult = await db.execute(sql`
      WITH dates AS (
        SELECT generate_series(
          DATE_TRUNC('day', NOW() - INTERVAL '6 days'),
          DATE_TRUNC('day', NOW()),
          '1 day'::interval
        ) AS day
      ),
      daily_time AS (
        SELECT 
          DATE_TRUNC('day', ap.last_accessed_at) AS day,
          SUM(ap.time_spent_seconds) / 60.0 AS minutes
        FROM 
          activity_progress ap
        WHERE 
          ap.user_id = ${userId}
          AND ap.last_accessed_at >= NOW() - INTERVAL '7 days'
        GROUP BY 
          DATE_TRUNC('day', ap.last_accessed_at)
      )
      SELECT 
        to_char(d.day, 'YYYY-MM-DD') AS date,
        COALESCE(dt.minutes, 0) AS minutes
      FROM 
        dates d
      LEFT JOIN 
        daily_time dt ON d.day = dt.day
      ORDER BY 
        d.day
    `);
    
    // Get total hours spent
    const totalHoursResult = await db.execute(sql`
      SELECT 
        SUM(time_spent_seconds) / 3600.0 AS total_hours
      FROM 
        activity_progress
      WHERE 
        user_id = ${userId}
    `);
    
    // Get average session duration
    const avgSessionResult = await db.execute(sql`
      WITH sessions AS (
        SELECT 
          user_id,
          DATE_TRUNC('hour', last_accessed_at) AS session_hour,
          SUM(time_spent_seconds) AS session_time
        FROM 
          activity_progress
        WHERE 
          user_id = ${userId}
        GROUP BY 
          user_id, DATE_TRUNC('hour', last_accessed_at)
      )
      SELECT 
        AVG(session_time) / 60.0 AS avg_minutes
      FROM 
        sessions
    `);
    
    const stats = {
      activityByDay: activityByDayResult.rows || [],
      activityByCategory: activityByCategoryResult.rows || [],
      timeSpentByCategory: timeSpentByCategoryResult.rows || [],
      timeSpentByDay: timeSpentByDayResult.rows || [],
      totalHoursSpent: parseFloat(totalHoursResult.rows?.[0]?.total_hours || 0).toFixed(1),
      averageTimePerSession: Math.round(parseFloat(avgSessionResult.rows?.[0]?.avg_minutes || 0))
    };
    
    // Cache the result
    progressCache.set(cacheKey, stats);
    
    return stats;
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    throw error;
  }
}

/**
 * Get user achievements
 */
async function getUserAchievements(userId) {
  // Check cache first
  const cacheKey = CACHE_KEYS.achievements(userId);
  const cachedAchievements = progressCache.get(cacheKey);
  
  if (cachedAchievements) {
    return cachedAchievements;
  }
  
  try {
    const result = await db.execute(sql`
      SELECT 
        id, type, title, description, points, metadata, awarded_at
      FROM 
        user_achievements
      WHERE 
        user_id = ${userId}
      ORDER BY 
        awarded_at DESC
    `);
    
    const achievements = result.rows || [];
    
    // Cache the result
    progressCache.set(cacheKey, achievements);
    
    return achievements;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
}

/**
 * Clear user-related caches
 */
function clearUserCaches(userId) {
  progressCache.del(CACHE_KEYS.userProgress(userId));
  progressCache.del(CACHE_KEYS.recentActivities(userId));
  progressCache.del(CACHE_KEYS.weeklyStats(userId));
  progressCache.del(CACHE_KEYS.achievements(userId));
  
  // Also clear specific path and module caches
  // (This is a simple approach - in production you might want to be more selective)
  const keys = progressCache.keys();
  const userKeys = keys.filter(key => key.includes(`progress:${userId}:`));
  userKeys.forEach(key => progressCache.del(key));
}

/**
 * Clear all caches
 */
function clearAllCaches() {
  progressCache.flushAll();
  console.log('Cleared all progress caches');
}

module.exports = {
  getUserProgress,
  getPathProgress,
  getModuleProgress,
  recordActivityProgress,
  getUserRecentActivities,
  getUserWeeklyStats,
  getUserAchievements,
  clearUserCaches,
  clearAllCaches
};