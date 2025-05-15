/**
 * Performance Monitoring System
 * 
 * This module provides utilities for measuring and tracking application performance:
 * - API response times
 * - Database query performance
 * - Memory usage statistics
 * - Route timing analytics
 */

// Performance metrics storage
let metrics = {
  apiRequests: {
    count: 0,
    totalResponseTime: 0,
    averageResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: Number.MAX_SAFE_INTEGER,
    errors: 0,
    byEndpoint: {}
  },
  dbQueries: {
    count: 0,
    totalQueryTime: 0,
    averageQueryTime: 0,
    maxQueryTime: 0,
    minQueryTime: Number.MAX_SAFE_INTEGER,
    errors: 0,
    slowQueries: []
  },
  memory: {
    samples: [],
    maxRss: 0,
    maxHeapTotal: 0,
    maxHeapUsed: 0,
    current: null
  },
  system: {
    bootTime: Date.now(),
    fullLoadTime: null,
    lastReset: Date.now(),
    uptime: 0
  }
};

// Configuration for performance monitoring
let config = {
  sampleMemoryIntervalMs: 60000, // 1 minute
  keepSlowQueriesCount: 20,
  slowQueryThresholdMs: 200,
  memoryWarningThresholdMb: 512, // 512 MB
  routeDetailLevel: 'full', // 'minimal', 'standard', 'full'
  enableVerboseLogging: false
};

let memoryInterval = null;

/**
 * Configure the performance monitor
 * @param {Object} options - Configuration options
 */
export function configurePerformanceMonitor(options = {}) {
  // Merge provided options with defaults
  config = { ...config, ...options };
  
  // Setup memory usage sampling
  if (memoryInterval) {
    clearInterval(memoryInterval);
  }
  
  memoryInterval = setInterval(sampleMemoryUsage, config.sampleMemoryIntervalMs);
  sampleMemoryUsage(); // Take initial sample
  
  console.log(`Performance monitoring initialized (memory sampling every ${config.sampleMemoryIntervalMs / 1000}s)`);
  
  return true;
}

/**
 * Record application bootstrap completion
 */
export function recordBootstrapComplete() {
  const bootTime = Date.now() - metrics.system.bootTime;
  metrics.system.bootstrapTime = bootTime;
  console.log(`Application bootstrap completed in ${bootTime}ms`);
}

/**
 * Record application fully loaded state
 */
export function recordFullyLoaded() {
  const loadTime = Date.now() - metrics.system.bootTime;
  metrics.system.fullLoadTime = loadTime;
}

/**
 * Sample current memory usage
 */
function sampleMemoryUsage() {
  try {
    const memory = process.memoryUsage();
    
    // Convert to MB for easier readability
    const sample = {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      external: Math.round(memory.external / 1024 / 1024),
      timestamp: Date.now()
    };
    
    // Update max values
    metrics.memory.maxRss = Math.max(metrics.memory.maxRss, sample.rss);
    metrics.memory.maxHeapTotal = Math.max(metrics.memory.maxHeapTotal, sample.heapTotal);
    metrics.memory.maxHeapUsed = Math.max(metrics.memory.maxHeapUsed, sample.heapUsed);
    
    // Add to samples array, keeping only the last 60 samples (1 hour at 1 minute intervals)
    metrics.memory.samples.push(sample);
    if (metrics.memory.samples.length > 60) {
      metrics.memory.samples.shift();
    }
    
    // Set current memory stats
    metrics.memory.current = sample;
    
    // Check if memory usage is approaching a concerning level
    if (sample.heapUsed > config.memoryWarningThresholdMb) {
      console.warn(`Memory usage warning: ${sample.heapUsed}MB heap used exceeds warning threshold of ${config.memoryWarningThresholdMb}MB`);
    }
  } catch (error) {
    console.error('Error sampling memory usage:', error);
  }
}

/**
 * Record API request performance
 * @param {string} route - API route
 * @param {number} responseTime - Response time in milliseconds
 * @param {boolean} isError - Whether the request resulted in an error
 */
export function recordApiPerformance(route, responseTime, isError = false) {
  try {
    // Update overall metrics
    metrics.apiRequests.count++;
    metrics.apiRequests.totalResponseTime += responseTime;
    metrics.apiRequests.averageResponseTime = metrics.apiRequests.totalResponseTime / metrics.apiRequests.count;
    metrics.apiRequests.maxResponseTime = Math.max(metrics.apiRequests.maxResponseTime, responseTime);
    metrics.apiRequests.minResponseTime = Math.min(metrics.apiRequests.minResponseTime, responseTime);
    
    if (isError) {
      metrics.apiRequests.errors++;
    }
    
    // Update endpoint-specific metrics
    if (!metrics.apiRequests.byEndpoint[route]) {
      metrics.apiRequests.byEndpoint[route] = {
        count: 0,
        totalResponseTime: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: Number.MAX_SAFE_INTEGER,
        errors: 0
      };
    }
    
    const endpointMetrics = metrics.apiRequests.byEndpoint[route];
    endpointMetrics.count++;
    endpointMetrics.totalResponseTime += responseTime;
    endpointMetrics.averageResponseTime = endpointMetrics.totalResponseTime / endpointMetrics.count;
    endpointMetrics.maxResponseTime = Math.max(endpointMetrics.maxResponseTime, responseTime);
    endpointMetrics.minResponseTime = Math.min(endpointMetrics.minResponseTime, responseTime);
    
    if (isError) {
      endpointMetrics.errors++;
    }
    
    // Log slow API requests
    if (responseTime > 1000) {
      console.warn(`Slow API request: ${route} (${responseTime}ms)`);
    }
    
  } catch (error) {
    console.error('Error recording API performance:', error);
  }
}

/**
 * Record database query performance
 * @param {string} query - SQL query or description
 * @param {number} queryTime - Query execution time in milliseconds
 * @param {boolean} isError - Whether the query resulted in an error
 */
export function recordDbPerformance(query, queryTime, isError = false) {
  try {
    // Update overall metrics
    metrics.dbQueries.count++;
    metrics.dbQueries.totalQueryTime += queryTime;
    metrics.dbQueries.averageQueryTime = metrics.dbQueries.totalQueryTime / metrics.dbQueries.count;
    metrics.dbQueries.maxQueryTime = Math.max(metrics.dbQueries.maxQueryTime, queryTime);
    metrics.dbQueries.minQueryTime = Math.min(metrics.dbQueries.minQueryTime, queryTime);
    
    if (isError) {
      metrics.dbQueries.errors++;
    }
    
    // Track slow queries
    if (queryTime > config.slowQueryThresholdMs) {
      // Prepare a shorter version of the query for logging
      const truncatedQuery = query.length > 100 ? query.substring(0, 100) + '...' : query;
      
      // Add to slow queries list
      metrics.dbQueries.slowQueries.push({
        query: truncatedQuery,
        time: queryTime,
        timestamp: Date.now(),
        isError
      });
      
      // Keep only the most recent slow queries
      if (metrics.dbQueries.slowQueries.length > config.keepSlowQueriesCount) {
        metrics.dbQueries.slowQueries.shift();
      }
      
      console.warn(`Slow DB query: ${truncatedQuery} (${queryTime}ms)`);
    }
    
  } catch (error) {
    console.error('Error recording database performance:', error);
  }
}

/**
 * Get performance report
 * @returns {Object} - Performance metrics
 */
export function getPerformanceReport() {
  // Update uptime
  metrics.system.uptime = Math.floor((Date.now() - metrics.system.bootTime) / 1000);
  
  return {
    api: {
      requests: metrics.apiRequests.count,
      averageResponseTime: metrics.apiRequests.averageResponseTime.toFixed(2) + 'ms',
      maxResponseTime: metrics.apiRequests.maxResponseTime + 'ms',
      errorRate: metrics.apiRequests.count ? 
        ((metrics.apiRequests.errors / metrics.apiRequests.count) * 100).toFixed(2) + '%' : '0%',
      topEndpoints: getTopEndpoints(5)
    },
    database: {
      queries: metrics.dbQueries.count,
      averageQueryTime: metrics.dbQueries.averageQueryTime.toFixed(2) + 'ms',
      maxQueryTime: metrics.dbQueries.maxQueryTime + 'ms',
      errorRate: metrics.dbQueries.count ? 
        ((metrics.dbQueries.errors / metrics.dbQueries.count) * 100).toFixed(2) + '%' : '0%',
      slowQueries: metrics.dbQueries.slowQueries.slice(-5) // Return last 5 slow queries
    },
    memory: {
      current: metrics.memory.current,
      peak: {
        rss: metrics.memory.maxRss + 'MB',
        heapTotal: metrics.memory.maxHeapTotal + 'MB', 
        heapUsed: metrics.memory.maxHeapUsed + 'MB'
      },
      trend: getSampledMemoryTrend()
    },
    system: {
      uptime: formatUptime(metrics.system.uptime),
      bootTime: metrics.system.bootstrapTime + 'ms',
      fullLoadTime: metrics.system.fullLoadTime ? metrics.system.fullLoadTime + 'ms' : 'Not fully loaded yet',
      lastResetTime: new Date(metrics.system.lastReset).toISOString()
    }
  };
}

/**
 * Format uptime in a human-readable format
 * @param {number} seconds - Uptime in seconds
 * @returns {string} - Formatted uptime
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let formattedUptime = '';
  if (days > 0) formattedUptime += `${days}d `;
  if (hours > 0 || days > 0) formattedUptime += `${hours}h `;
  if (minutes > 0 || hours > 0 || days > 0) formattedUptime += `${minutes}m `;
  formattedUptime += `${secs}s`;
  
  return formattedUptime;
}

/**
 * Get the top API endpoints by request count
 * @param {number} limit - Number of endpoints to return
 * @returns {Array} - Top endpoints
 */
function getTopEndpoints(limit = 5) {
  const endpoints = Object.entries(metrics.apiRequests.byEndpoint)
    .map(([route, data]) => ({
      route,
      requests: data.count,
      avgTime: data.averageResponseTime.toFixed(2) + 'ms',
      errors: data.errors
    }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, limit);
    
  return endpoints;
}

/**
 * Get a simplified memory trend from the samples
 * @returns {Array} - Memory trend data
 */
function getSampledMemoryTrend() {
  // Return a decimated set of samples to reduce data size
  // For an hour of data at 1 minute intervals, return ~10 samples
  const samples = metrics.memory.samples;
  const result = [];
  
  if (samples.length === 0) {
    return result;
  }
  
  // Determine the sampling interval based on the number of samples
  const interval = Math.max(1, Math.floor(samples.length / 10));
  
  for (let i = 0; i < samples.length; i += interval) {
    if (samples[i]) {
      result.push({
        timestamp: new Date(samples[i].timestamp).toISOString(),
        heapUsed: samples[i].heapUsed + 'MB'
      });
    }
  }
  
  // Always include the most recent sample
  const lastSample = samples[samples.length - 1];
  if (lastSample && result[result.length - 1]?.timestamp !== new Date(lastSample.timestamp).toISOString()) {
    result.push({
      timestamp: new Date(lastSample.timestamp).toISOString(),
      heapUsed: lastSample.heapUsed + 'MB'
    });
  }
  
  return result;
}

/**
 * Performance monitoring middleware
 * Tracks API response times and adds them to metrics
 */
export function performanceMonitorMiddleware(req, res, next) {
  // Skip for non-API routes or static assets
  if (!req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }
  
  // Record start time
  const startTime = Date.now();
  
  // Capture response finishing
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const route = req.method + ' ' + req.baseUrl + req.path;
    const isError = res.statusCode >= 400;
    
    // Record performance metrics
    recordApiPerformance(route, responseTime, isError);
    
    // Log slow responses (longer than 1 second)
    if (responseTime > 1000 || (isError && config.enableVerboseLogging)) {
      const message = `${isError ? 'Error' : 'Slow'} response: ${route} (${responseTime}ms, status ${res.statusCode})`;
      console.warn(message);
    }
  });
  
  next();
}

/**
 * Reset all performance metrics
 * Useful after fixing performance issues to start fresh measurements
 */
export function resetPerformanceMetrics() {
  metrics = {
    apiRequests: {
      count: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Number.MAX_SAFE_INTEGER,
      errors: 0,
      byEndpoint: {}
    },
    dbQueries: {
      count: 0,
      totalQueryTime: 0,
      averageQueryTime: 0,
      maxQueryTime: 0,
      minQueryTime: Number.MAX_SAFE_INTEGER,
      errors: 0,
      slowQueries: []
    },
    memory: {
      samples: [],
      maxRss: 0,
      maxHeapTotal: 0,
      maxHeapUsed: 0,
      current: metrics.memory.current // Keep the current memory snapshot
    },
    system: {
      bootTime: metrics.system.bootTime, // Preserve original boot time
      fullLoadTime: metrics.system.fullLoadTime, // Preserve full load time
      lastReset: Date.now(),
      uptime: Math.floor((Date.now() - metrics.system.bootTime) / 1000)
    }
  };
  
  // Take a fresh memory sample
  sampleMemoryUsage();
  
  console.log('Performance metrics have been reset');
  return true;
}

/**
 * Database query performance wrapper
 * Use this to wrap database queries and track their performance
 * @param {Function} queryFn - Database query function
 * @param {string} description - Query description
 * @returns {Promise<any>} - Query result
 */
export async function trackDbQuery(queryFn, description) {
  const startTime = Date.now();
  let isError = false;
  
  try {
    // Execute the query
    const result = await queryFn();
    return result;
  } catch (error) {
    isError = true;
    throw error;
  } finally {
    // Record performance data regardless of success/failure
    const queryTime = Date.now() - startTime;
    recordDbPerformance(description, queryTime, isError);
  }
}

// Export all functions
export default {
  configurePerformanceMonitor,
  recordBootstrapComplete,
  recordFullyLoaded,
  recordApiPerformance,
  recordDbPerformance,
  getPerformanceReport,
  performanceMonitorMiddleware,
  resetPerformanceMetrics,
  trackDbQuery
};