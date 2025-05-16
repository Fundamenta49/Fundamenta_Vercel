/**
 * Simple logger utility with support for color and service identification
 */

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Log levels with corresponding colors
const levels = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.cyan,
  debug: colors.white
};

/**
 * Create a logger instance for a specific service
 * @param serviceName - The name of the service using this logger
 * @returns Logger object with methods for different log levels
 */
export function createLogger(serviceName: string) {
  return {
    /**
     * Log an error message
     * @param message - Message to log
     * @param error - Optional error object
     */
    error(message: string, error?: Error | unknown) {
      console.error(
        `${levels.error}[${serviceName}] ERROR: ${message}${colors.reset}`,
        error ? (error instanceof Error ? error.stack || error.message : error) : ''
      );
    },

    /**
     * Log a warning message
     * @param message - Message to log
     */
    warn(message: string) {
      console.warn(`${levels.warn}[${serviceName}] WARN: ${message}${colors.reset}`);
    },

    /**
     * Log an informational message
     * @param message - Message to log
     */
    info(message: string) {
      console.info(`${levels.info}[${serviceName}] INFO: ${message}${colors.reset}`);
    },

    /**
     * Log a debug message
     * @param message - Message to log
     * @param data - Optional data to log
     */
    debug(message: string, data?: any) {
      if (process.env.LOG_LEVEL === 'debug') {
        console.debug(
          `${levels.debug}[${serviceName}] DEBUG: ${message}${colors.reset}`,
          data ? data : ''
        );
      }
    }
  };
}

// Default logger for general application use
export const logger = createLogger('App');

export default createLogger;