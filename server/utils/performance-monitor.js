/**
 * Performance Monitoring Utilities
 * Part of Bundle 5B: Performance & Quality Optimization
 * 
 * This module provides tools for monitoring and measuring application performance
 * to help identify bottlenecks and track improvements from optimizations.
 */

const NodeCache = require('node-cache');
const os = require('os');

// Cache to store performance metrics
const metricsCache = new NodeCache({ 
  stdTTL: 24 * 60 * 60, // 24 hour default TTL
  checkperiod: 10 * 60 // Check for expired keys every 10 minutes
});

// Application bootstrap timing
let bootstrapStartTime = Date.now();
let bootstrapEndTime = null;
let fullyLoadedTime = null;

// Track last memory stats
let lastMemoryUsage = {
  rss: 0,
  heapTotal: 0,
  heapUsed: 0,
  external: 0,
  timestamp: Date.now()
};

// Store route timing information
const routeTimings = {};

// Performance samples (for memory, CPU, etc.)
const performanceSamples = [];

/**
 * Configure performance monitoring schedule
 */
function configurePerformanceMonitor() {
  console.log('Performance monitoring initialized (memory sampling every 60s)');
  
  bootstrapStartTime = Date.now();
  
  // Take regular memory snapshots
  setInterval(sampleMemoryUsage, 60 * 1000); // Every 60 seconds
  
  return true;
}

/**
 * Record that bootstrap has completed
 */
function recordBootstrapComplete() {
  bootstrapEndTime = Date.now();
  const bootstrapTime = bootstrapEndTime - bootstrapStartTime;
  
  metricsCache.set('bootstrap_time', bootstrapTime);
  console.log(`Application bootstrap completed in ${bootstrapTime}ms`);
  
  return true;
}

/**
 * Record that application is fully loaded
 */
function recordFullyLoaded() {
  fullyLoadedTime = Date.now();
  
  if (bootstrapEndTime) {
    const bootToLoadTime = fullyLoadedTime - bootstrapEndTime;
    metricsCache.set('boot_to_load_time', bootToLoadTime);
  }
  
  const totalStartupTime = fullyLoadedTime - bootstrapStartTime;
  metricsCache.set('total_startup_time', totalStartupTime);
  
  return true;
}

/**
 * Take a sample of current memory usage
 */
function sampleMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const timestamp = Date.now();
  
  // Calculate memory change rates
  const timeDelta = timestamp - lastMemoryUsage.timestamp;
  const memoryChange = {
    rss: memoryUsage.rss - lastMemoryUsage.rss,
    heapTotal: memoryUsage.heapTotal - lastMemoryUsage.heapTotal,
    heapUsed: memoryUsage.heapUsed - lastMemoryUsage.heapUsed,
    changeRate: (memoryUsage.heapUsed - lastMemoryUsage.heapUsed) / timeDelta * 1000 // bytes per second
  };
  
  lastMemoryUsage = {
    ...memoryUsage,
    timestamp
  };
  
  // Store memory sample
  const sample = {
    timestamp,
    memory: memoryUsage,
    cpu: cpuUsage,
    memoryChange,
    loadAvg: os.loadavg()
  };
  
  performanceSamples.push(sample);
  
  // Keep only the most recent samples (last 24 hours = 1440 minutes = 1440 samples)
  if (performanceSamples.length > 1440) {
    performanceSamples.shift();
  }
  
  // Check for memory leaks - if increase rate is consistently high for 5 minutes
  const recentSamples = performanceSamples.slice(-5);
  if (recentSamples.length === 5) {
    const avgChangeRate = recentSamples.reduce((sum, s) => sum + s.memoryChange.changeRate, 0) / 5;
    
    // If memory is growing at more than 1MB per minute consistently for 5 minutes, log warning
    if (avgChangeRate > 1024 * 1024) {
      console.warn(`[Performance] WARNING: Potential memory leak detected. Memory growing at ${(avgChangeRate / (1024 * 1024)).toFixed(2)}MB/minute`);
    }
  }
  
  return sample;
}

/**
 * Performance monitoring middleware
 */
function performanceMonitorMiddleware(req, res, next) {
  // Skip for static assets
  if (req.path.startsWith('/assets/') || req.path.startsWith('/public/')) {
    return next();
  }
  
  const startTime = Date.now();
  const url = req.originalUrl || req.url;
  const method = req.method;
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end method to calculate and log response time
  res.end = function(...args) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Add timing header
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Save route timing data
    const routeKey = `${method} ${url.split('?')[0]}`; // Remove query params for grouping
    
    if (!routeTimings[routeKey]) {
      routeTimings[routeKey] = {
        count: 0,
        totalTime: 0,
        min: Infinity,
        max: 0
      };
    }
    
    const stats = routeTimings[routeKey];
    stats.count++;
    stats.totalTime += duration;
    stats.min = Math.min(stats.min, duration);
    stats.max = Math.max(stats.max, duration);
    
    // Log slow requests (over 500ms)
    if (duration > 500) {
      console.warn(`[Performance] Slow request: ${routeKey} - ${duration}ms`);
    }
    
    // Call original end method
    return originalEnd.apply(this, args);
  };
  
  next();
}

/**
 * Get performance metrics
 */
function getPerformanceMetrics() {
  const metrics = {
    bootstrap: {
      bootstrapTime: metricsCache.get('bootstrap_time') || 0,
      bootToLoadTime: metricsCache.get('boot_to_load_time') || 0,
      totalStartupTime: metricsCache.get('total_startup_time') || 0
    },
    memory: lastMemoryUsage,
    routes: Object.keys(routeTimings).map(key => {
      const stats = routeTimings[key];
      return {
        route: key,
        count: stats.count,
        avgTime: stats.totalTime / stats.count,
        minTime: stats.min,
        maxTime: stats.max
      };
    }).sort((a, b) => b.avgTime - a.avgTime), // Sort by average time (slowest first)
    system: {
      uptime: process.uptime(),
      loadAvg: os.loadavg(),
      memoryTotal: os.totalmem(),
      memoryFree: os.freemem(),
      cpus: os.cpus().length
    }
  };
  
  return metrics;
}

module.exports = {
  configurePerformanceMonitor,
  performanceMonitorMiddleware,
  recordBootstrapComplete,
  recordFullyLoaded,
  sampleMemoryUsage,
  getPerformanceMetrics
};