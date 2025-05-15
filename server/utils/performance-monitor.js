/**
 * Performance Monitoring System
 * 
 * This module provides utilities for measuring and tracking application performance:
 * - API response times
 * - Database query performance
 * - Memory usage statistics
 * - Route timing analytics
 */

import { performance } from 'perf_hooks';

// Track performance metrics
const metrics = {
  // API response time tracking
  api: {
    requests: 0,
    totalResponseTime: 0,
    slowestRoute: { route: '', time: 0 },
    fastestRoute: { route: '', time: Infinity },
    routeStats: {},
    errors: 0,
  },
  
  // Database performance
  database: {
    queries: 0,
    totalQueryTime: 0,
    slowestQuery: { query: '', time: 0 },
    fastestQuery: { query: '', time: Infinity },
    queryStats: {},
    errors: 0,
  },
  
  // Memory usage
  memory: {
    samples: 0,
    totalHeapUsed: 0,
    peakHeapUsed: 0,
    lastSample: null,
    history: [],
  },
  
  // Application startup time
  startup: {
    startTime: Date.now(),
    bootstrapTime: null,
    fullyLoadedTime: null,
  },
};

/**
 * Configure the performance monitor
 * @param {Object} options - Configuration options
 */
export function configurePerformanceMonitor(options = {}) {
  // Record application startup time
  metrics.startup.startTime = Date.now();
  
  // Schedule periodic memory usage monitoring
  const memoryMonitoringInterval = options.memoryMonitoringInterval || 60000; // 1 minute default
  setInterval(sampleMemoryUsage, memoryMonitoringInterval);
  
  console.log(`Performance monitoring initialized (memory sampling every ${memoryMonitoringInterval / 1000}s)`);
}

/**
 * Record application bootstrap completion
 */
export function recordBootstrapComplete() {
  metrics.startup.bootstrapTime = Date.now() - metrics.startup.startTime;
  console.log(`Application bootstrap completed in ${metrics.startup.bootstrapTime}ms`);
}

/**
 * Record application fully loaded state
 */
export function recordFullyLoaded() {
  metrics.startup.fullyLoadedTime = Date.now() - metrics.startup.startTime;
  console.log(`Application fully loaded in ${metrics.startup.fullyLoadedTime}ms`);
}

/**
 * Sample current memory usage
 */
function sampleMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // Convert to MB
  
  metrics.memory.samples++;
  metrics.memory.totalHeapUsed += heapUsed;
  metrics.memory.lastSample = {
    timestamp: Date.now(),
    heapUsed,
    rss: memoryUsage.rss / 1024 / 1024,
    external: memoryUsage.external / 1024 / 1024,
  };
  
  // Track peak memory usage
  if (heapUsed > metrics.memory.peakHeapUsed) {
    metrics.memory.peakHeapUsed = heapUsed;
  }
  
  // Keep history of last 60 samples (1 hour at 1 sample per minute)
  metrics.memory.history.push(metrics.memory.lastSample);
  if (metrics.memory.history.length > 60) {
    metrics.memory.history.shift();
  }
}

/**
 * Record API request performance
 * @param {string} route - API route
 * @param {number} responseTime - Response time in milliseconds
 * @param {boolean} isError - Whether the request resulted in an error
 */
export function recordApiPerformance(route, responseTime, isError = false) {
  metrics.api.requests++;
  metrics.api.totalResponseTime += responseTime;
  
  if (isError) {
    metrics.api.errors++;
  }
  
  // Initialize route stats if needed
  if (!metrics.api.routeStats[route]) {
    metrics.api.routeStats[route] = {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0,
      errors: 0,
    };
  }
  
  // Update route stats
  const routeStats = metrics.api.routeStats[route];
  routeStats.count++;
  routeStats.totalTime += responseTime;
  routeStats.avgTime = routeStats.totalTime / routeStats.count;
  routeStats.minTime = Math.min(routeStats.minTime, responseTime);
  routeStats.maxTime = Math.max(routeStats.maxTime, responseTime);
  
  if (isError) {
    routeStats.errors++;
  }
  
  // Update global slowest/fastest routes
  if (responseTime > metrics.api.slowestRoute.time) {
    metrics.api.slowestRoute = { route, time: responseTime };
  }
  
  if (responseTime < metrics.api.fastestRoute.time) {
    metrics.api.fastestRoute = { route, time: responseTime };
  }
}

/**
 * Record database query performance
 * @param {string} query - SQL query or description
 * @param {number} queryTime - Query execution time in milliseconds
 * @param {boolean} isError - Whether the query resulted in an error
 */
export function recordDbPerformance(query, queryTime, isError = false) {
  metrics.database.queries++;
  metrics.database.totalQueryTime += queryTime;
  
  if (isError) {
    metrics.database.errors++;
  }
  
  // Create a sanitized query identifier (first 50 chars)
  const queryId = query.substring(0, 50).trim().replace(/\s+/g, ' ');
  
  // Initialize query stats if needed
  if (!metrics.database.queryStats[queryId]) {
    metrics.database.queryStats[queryId] = {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0,
      errors: 0,
    };
  }
  
  // Update query stats
  const queryStats = metrics.database.queryStats[queryId];
  queryStats.count++;
  queryStats.totalTime += queryTime;
  queryStats.avgTime = queryStats.totalTime / queryStats.count;
  queryStats.minTime = Math.min(queryStats.minTime, queryTime);
  queryStats.maxTime = Math.max(queryStats.maxTime, queryTime);
  
  if (isError) {
    queryStats.errors++;
  }
  
  // Update global slowest/fastest queries
  if (queryTime > metrics.database.slowestQuery.time) {
    metrics.database.slowestQuery = { query: queryId, time: queryTime };
  }
  
  if (queryTime < metrics.database.fastestQuery.time) {
    metrics.database.fastestQuery = { query: queryId, time: queryTime };
  }
}

/**
 * Get performance report
 * @returns {Object} - Performance metrics
 */
export function getPerformanceReport() {
  // Calculate summary statistics
  const apiAvgResponseTime = metrics.api.requests > 0
    ? metrics.api.totalResponseTime / metrics.api.requests
    : 0;
    
  const dbAvgQueryTime = metrics.database.queries > 0
    ? metrics.database.totalQueryTime / metrics.database.queries
    : 0;
    
  const memoryAvgUsage = metrics.memory.samples > 0
    ? metrics.memory.totalHeapUsed / metrics.memory.samples
    : 0;
  
  return {
    timestamp: Date.now(),
    uptime: process.uptime(),
    
    // API statistics
    api: {
      totalRequests: metrics.api.requests,
      errorRate: metrics.api.requests > 0 ? (metrics.api.errors / metrics.api.requests) : 0,
      avgResponseTime: apiAvgResponseTime,
      slowestRoute: metrics.api.slowestRoute,
      fastestRoute: metrics.api.fastestRoute,
      routeStats: Object.entries(metrics.api.routeStats)
        .map(([route, stats]) => ({
          route,
          requestCount: stats.count,
          avgTime: stats.avgTime,
          errorRate: stats.count > 0 ? (stats.errors / stats.count) : 0,
        }))
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, 10),
    },
    
    // Database statistics
    database: {
      totalQueries: metrics.database.queries,
      errorRate: metrics.database.queries > 0 ? (metrics.database.errors / metrics.database.queries) : 0,
      avgQueryTime: dbAvgQueryTime,
      slowestQuery: metrics.database.slowestQuery,
      fastestQuery: metrics.database.fastestQuery,
      queryStats: Object.entries(metrics.database.queryStats)
        .map(([query, stats]) => ({
          query,
          count: stats.count,
          avgTime: stats.avgTime,
          errorRate: stats.count > 0 ? (stats.errors / stats.count) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    },
    
    // Memory statistics
    memory: {
      avgUsageMB: memoryAvgUsage,
      peakUsageMB: metrics.memory.peakHeapUsed,
      currentUsageMB: metrics.memory.lastSample?.heapUsed || 0,
      currentRssMB: metrics.memory.lastSample?.rss || 0,
    },
    
    // Startup statistics
    startup: {
      bootstrapTime: metrics.startup.bootstrapTime,
      fullyLoadedTime: metrics.startup.fullyLoadedTime,
    },
  };
}

/**
 * Performance monitoring middleware
 * Tracks API response times and adds them to metrics
 */
export function performanceMonitorMiddleware(req, res, next) {
  const start = performance.now();
  
  // Track response completion
  res.on('finish', () => {
    const responseTime = performance.now() - start;
    const route = req.originalUrl || req.url;
    const isError = res.statusCode >= 400;
    
    recordApiPerformance(route, responseTime, isError);
  });
  
  next();
}

/**
 * Reset all performance metrics
 * Useful after fixing performance issues to start fresh measurements
 */
export function resetPerformanceMetrics() {
  metrics.api = {
    requests: 0,
    totalResponseTime: 0,
    slowestRoute: { route: '', time: 0 },
    fastestRoute: { route: '', time: Infinity },
    routeStats: {},
    errors: 0,
  };
  
  metrics.database = {
    queries: 0,
    totalQueryTime: 0,
    slowestQuery: { query: '', time: 0 },
    fastestQuery: { query: '', time: Infinity },
    queryStats: {},
    errors: 0,
  };
  
  metrics.memory.history = [];
  
  console.log('Performance metrics have been reset');
}

/**
 * Database query performance wrapper
 * Use this to wrap database queries and track their performance
 * @param {Function} queryFn - Database query function
 * @param {string} description - Query description
 * @returns {Promise<any>} - Query result
 */
export async function trackDbQuery(queryFn, description) {
  const start = performance.now();
  let isError = false;
  
  try {
    return await queryFn();
  } catch (error) {
    isError = true;
    throw error;
  } finally {
    const queryTime = performance.now() - start;
    recordDbPerformance(description, queryTime, isError);
  }
}