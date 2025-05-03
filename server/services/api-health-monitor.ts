import axios from 'axios';
import type { Application } from 'express';

/**
 * API health monitor service to track external API status and handle reconnection
 */
export class ApiHealthMonitor {
  private static instance: ApiHealthMonitor;
  private checkIntervals: Map<string, NodeJS.Timeout> = new Map();
  private apiStatus: Map<string, boolean> = new Map();
  private lastChecked: Map<string, Date> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries: number = 3;
  private listeners: Map<string, Set<(status: boolean) => void>> = new Map();
  
  /**
   * Get singleton instance
   */
  public static getInstance(): ApiHealthMonitor {
    if (!ApiHealthMonitor.instance) {
      ApiHealthMonitor.instance = new ApiHealthMonitor();
    }
    return ApiHealthMonitor.instance;
  }
  
  /**
   * Start monitoring an external API
   * @param apiName Name identifier for the API
   * @param healthCheckUrl URL to check API health
   * @param intervalMs Interval in milliseconds between checks (default: 5 minutes)
   * @param checkFn Optional custom check function
   */
  public startMonitoring(
    apiName: string, 
    healthCheckUrl: string,
    intervalMs: number = 5 * 60 * 1000,
    checkFn?: () => Promise<boolean>
  ): void {
    // Set initial state
    this.apiStatus.set(apiName, false);
    this.lastChecked.set(apiName, new Date());
    this.retryAttempts.set(apiName, 0);
    
    // Create listeners set if not exists
    if (!this.listeners.has(apiName)) {
      this.listeners.set(apiName, new Set());
    }
    
    // Clear existing interval if any
    if (this.checkIntervals.has(apiName)) {
      clearInterval(this.checkIntervals.get(apiName)!);
    }
    
    // Perform initial check
    this.checkApiHealth(apiName, healthCheckUrl, checkFn);
    
    // Set up regular checking
    const interval = setInterval(() => {
      this.checkApiHealth(apiName, healthCheckUrl, checkFn);
    }, intervalMs);
    
    this.checkIntervals.set(apiName, interval);
    
    console.log(`[ApiHealthMonitor] Started monitoring ${apiName}`);
  }
  
  /**
   * Stop monitoring an API
   * @param apiName Name of the API to stop monitoring
   */
  public stopMonitoring(apiName: string): void {
    if (this.checkIntervals.has(apiName)) {
      clearInterval(this.checkIntervals.get(apiName)!);
      this.checkIntervals.delete(apiName);
      console.log(`[ApiHealthMonitor] Stopped monitoring ${apiName}`);
    }
  }
  
  /**
   * Check if an API is healthy
   * @param apiName Name of the API to check
   * @returns Boolean indicating if API is healthy
   */
  public isHealthy(apiName: string): boolean {
    return this.apiStatus.get(apiName) || false;
  }
  
  /**
   * Get the last check time for an API
   * @param apiName Name of the API
   * @returns Date of last check or null if not monitored
   */
  public getLastChecked(apiName: string): Date | null {
    return this.lastChecked.get(apiName) || null;
  }
  
  /**
   * Register a status change listener for an API
   * @param apiName Name of the API to monitor
   * @param listener Function to call when status changes
   */
  public onStatusChange(apiName: string, listener: (status: boolean) => void): void {
    if (!this.listeners.has(apiName)) {
      this.listeners.set(apiName, new Set());
    }
    
    this.listeners.get(apiName)!.add(listener);
    
    // Call the listener immediately with current status
    const currentStatus = this.isHealthy(apiName);
    listener(currentStatus);
  }
  
  /**
   * Remove a status change listener
   * @param apiName Name of the API
   * @param listener Function to remove
   */
  public removeListener(apiName: string, listener: (status: boolean) => void): void {
    if (this.listeners.has(apiName)) {
      this.listeners.get(apiName)!.delete(listener);
    }
  }
  
  /**
   * Force an immediate health check
   * @param apiName Name of the API to check
   * @returns Promise resolving to health status
   */
  public async forceCheck(apiName: string): Promise<boolean> {
    if (!this.checkIntervals.has(apiName)) {
      console.error(`[ApiHealthMonitor] Cannot force check for ${apiName} as it is not being monitored`);
      return false;
    }
    
    const healthCheckUrl = this.getHealthCheckUrl(apiName);
    if (!healthCheckUrl) {
      console.error(`[ApiHealthMonitor] No health check URL for ${apiName}`);
      return false;
    }
    
    return this.checkApiHealth(apiName, healthCheckUrl);
  }
  
  /**
   * Register API health routes with Express
   * @param app Express application
   */
  public registerHealthRoutes(app: Application): void {
    app.get('/api/health', (req, res) => {
      const healthStatus: Record<string, any> = {};
      
      this.apiStatus.forEach((status, apiName) => {
        healthStatus[apiName] = {
          status: status ? 'healthy' : 'unhealthy',
          lastChecked: this.lastChecked.get(apiName)?.toISOString(),
          retryAttempts: this.retryAttempts.get(apiName) || 0
        };
      });
      
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        apis: healthStatus
      });
    });
    
    app.get('/api/health/:apiName', (req, res) => {
      const { apiName } = req.params;
      
      if (!this.apiStatus.has(apiName)) {
        return res.status(404).json({
          status: 'error',
          message: `API ${apiName} is not being monitored`
        });
      }
      
      res.json({
        apiName,
        status: this.isHealthy(apiName) ? 'healthy' : 'unhealthy',
        lastChecked: this.lastChecked.get(apiName)?.toISOString(),
        retryAttempts: this.retryAttempts.get(apiName) || 0
      });
    });
    
    app.post('/api/health/:apiName/check', async (req, res) => {
      const { apiName } = req.params;
      
      if (!this.checkIntervals.has(apiName)) {
        return res.status(404).json({
          status: 'error',
          message: `API ${apiName} is not being monitored`
        });
      }
      
      const result = await this.forceCheck(apiName);
      
      res.json({
        apiName,
        status: result ? 'healthy' : 'unhealthy',
        lastChecked: this.lastChecked.get(apiName)?.toISOString(),
        retryAttempts: this.retryAttempts.get(apiName) || 0
      });
    });
  }
  
  // Private helper methods
  
  private getHealthCheckUrl(apiName: string): string | null {
    // This would normally come from configuration
    // For now, just implementation-specific logic
    return null;
  }
  
  private async checkApiHealth(
    apiName: string, 
    healthCheckUrl: string,
    checkFn?: () => Promise<boolean>
  ): Promise<boolean> {
    try {
      let isHealthy = false;
      
      // Update last checked timestamp
      this.lastChecked.set(apiName, new Date());
      
      // Use custom check function if provided
      if (checkFn) {
        isHealthy = await checkFn();
      } else {
        // Default check using axios
        const response = await axios.get(healthCheckUrl, { timeout: 5000 });
        isHealthy = response.status >= 200 && response.status < 300;
      }
      
      // Update status
      const previousStatus = this.apiStatus.get(apiName);
      this.apiStatus.set(apiName, isHealthy);
      
      if (isHealthy) {
        // Reset retry counter on success
        this.retryAttempts.set(apiName, 0);
        
        // Log recovery if previous status was unhealthy
        if (previousStatus === false) {
          console.log(`[ApiHealthMonitor] API ${apiName} has recovered`);
        }
      } else {
        // Increment retry counter
        const attempts = (this.retryAttempts.get(apiName) || 0) + 1;
        this.retryAttempts.set(apiName, attempts);
        
        console.warn(`[ApiHealthMonitor] API ${apiName} check failed (attempt ${attempts} of ${this.maxRetries})`);
        
        // Trigger automatic recovery if max retries not exceeded
        if (attempts <= this.maxRetries) {
          // Implement automatic recovery logic here
          // This could involve refreshing credentials, etc.
          console.log(`[ApiHealthMonitor] Attempting recovery for ${apiName}`);
        }
      }
      
      // Notify listeners of status change
      if (previousStatus !== isHealthy && this.listeners.has(apiName)) {
        this.listeners.get(apiName)!.forEach(listener => {
          try {
            listener(isHealthy);
          } catch (error) {
            console.error(`[ApiHealthMonitor] Error in listener for ${apiName}:`, error);
          }
        });
      }
      
      return isHealthy;
    } catch (error) {
      // Log error
      console.error(`[ApiHealthMonitor] Error checking health for ${apiName}:`, error);
      
      // Update status to unhealthy
      const previousStatus = this.apiStatus.get(apiName);
      this.apiStatus.set(apiName, false);
      
      // Increment retry counter
      const attempts = (this.retryAttempts.get(apiName) || 0) + 1;
      this.retryAttempts.set(apiName, attempts);
      
      // Notify listeners of status change
      if (previousStatus !== false && this.listeners.has(apiName)) {
        this.listeners.get(apiName)!.forEach(listener => {
          try {
            listener(false);
          } catch (listenerError) {
            console.error(`[ApiHealthMonitor] Error in listener for ${apiName}:`, listenerError);
          }
        });
      }
      
      return false;
    }
  }
}

// Export singleton instance
export default ApiHealthMonitor.getInstance();