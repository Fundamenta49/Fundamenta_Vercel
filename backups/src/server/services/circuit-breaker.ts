/**
 * CircuitBreaker pattern implementation to handle service failures
 * 
 * This pattern prevents cascading failures by failing fast when a service is unhealthy.
 * It maintains three states: CLOSED, OPEN, and HALF_OPEN.
 * 
 * - CLOSED: Normal operation, calls pass through to the service
 * - OPEN: Service is unhealthy, calls fail fast without attempting the service
 * - HALF_OPEN: Testing if service has recovered, allows a single test call
 */

export enum CircuitState {
  CLOSED = 'CLOSED',   // Normal operation
  OPEN = 'OPEN',       // Circuit is open, calls will fail fast
  HALF_OPEN = 'HALF_OPEN' // Testing if service has recovered
}

export interface CircuitBreakerOptions {
  failureThreshold: number;     // Number of failures before opening circuit
  resetTimeout: number;         // Time in ms to wait before trying service again
  monitorInterval?: number;     // Optional interval to check health periodically
  onStateChange?: (from: CircuitState, to: CircuitState) => void; // Optional callback
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private monitorInterval: NodeJS.Timeout | null = null;
  private readonly options: CircuitBreakerOptions;
  
  constructor(options: CircuitBreakerOptions) {
    // Create options with defaults
    this.options = {
      failureThreshold: options.failureThreshold || 3,
      resetTimeout: options.resetTimeout || 30000, // 30 seconds
      monitorInterval: options.monitorInterval,
      onStateChange: options.onStateChange
    };
    
    // Set up health monitoring if interval provided
    if (this.options.monitorInterval) {
      this.monitorInterval = setInterval(() => this.checkHealth(), this.options.monitorInterval);
    }
  }
  
  /**
   * Execute a function with circuit breaker protection
   * @param primaryFn The function to execute
   * @param fallbackFn Function to execute when circuit is open
   */
  async execute<T>(primaryFn: () => Promise<T>, fallbackFn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      console.log(`CircuitBreaker: Circuit is ${this.state}, using fallback`);
      return fallbackFn();
    }
    
    try {
      const result = await primaryFn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      console.warn(`CircuitBreaker: Primary function failed, using fallback. Current state: ${this.state}`);
      return fallbackFn();
    }
  }
  
  /**
   * Check if the circuit is open (service is considered unhealthy)
   */
  private isOpen(): boolean {
    if (this.state === CircuitState.CLOSED) {
      return false;
    }
    
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      // Check if enough time has passed to try again
      if (now - this.lastFailureTime >= this.options.resetTimeout) {
        this.changeState(CircuitState.HALF_OPEN);
        return false; // Allow the call to go through as a test
      }
      return true; // Still open, fail fast
    }
    
    // In HALF_OPEN state, we allow exactly one call through as a test
    return false;
  }
  
  /**
   * Record a successful call, potentially closing the circuit
   */
  private recordSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      // Service has recovered, close the circuit
      this.reset();
    }
  }
  
  /**
   * Record a failure, potentially opening the circuit
   */
  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.state === CircuitState.HALF_OPEN) {
      // Service is still failing, reopen the circuit
      this.changeState(CircuitState.OPEN);
    } else if (this.state === CircuitState.CLOSED && this.failures >= this.options.failureThreshold) {
      // Too many failures, open the circuit
      this.changeState(CircuitState.OPEN);
    }
  }
  
  /**
   * Change the circuit state with notification
   */
  private changeState(newState: CircuitState): void {
    if (this.state === newState) return;
    
    const oldState = this.state;
    this.state = newState;
    
    console.log(`CircuitBreaker: State changed from ${oldState} to ${newState}`);
    
    // Notify if callback provided
    if (this.options.onStateChange) {
      this.options.onStateChange(oldState, newState);
    }
  }
  
  /**
   * Reset the circuit breaker to closed state
   */
  public reset(): void {
    this.failures = 0;
    this.changeState(CircuitState.CLOSED);
  }
  
  /**
   * Get the current circuit state
   */
  public getState(): CircuitState {
    return this.state;
  }
  
  /**
   * Get detailed status information
   */
  public getStatus(): {
    state: CircuitState;
    failures: number;
    lastFailureTime: number;
    timeSinceLastFailure: number;
    healthPercentage: number;
  } {
    const now = Date.now();
    const timeSinceLastFailure = this.lastFailureTime ? now - this.lastFailureTime : 0;
    
    // Calculate health percentage based on failures and threshold
    let healthPercentage = 100;
    if (this.options.failureThreshold > 0) {
      healthPercentage = Math.max(0, 100 - (this.failures / this.options.failureThreshold * 100));
    }
    
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
      timeSinceLastFailure,
      healthPercentage
    };
  }
  
  /**
   * Manually check health and update circuit state
   */
  public checkHealth(): void {
    const now = Date.now();
    
    if (this.state === CircuitState.OPEN) {
      // If enough time has passed since the last failure, try half-open
      if (now - this.lastFailureTime >= this.options.resetTimeout) {
        this.changeState(CircuitState.HALF_OPEN);
      }
    }
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }
}