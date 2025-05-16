/**
 * Basic Test for API Client with Timeout Handling
 * 
 * This simple file can be used to test the timeout features of our API client
 * without relying on the complex application structure.
 */

// Default configuration
const DEFAULT_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

/**
 * Creates an AbortController with timeout
 */
function createTimeoutController(timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error('Request timeout')), timeout);
  return { controller, timeoutId };
}

/**
 * Check if error is a timeout error
 */
function isTimeoutError(error) {
  return error.name === 'AbortError' || 
         error.name === 'TimeoutError' || 
         error.message === 'Request timeout' ||
         error.message.includes('timeout');
}

/**
 * Check if error is due to network being offline
 */
function isOfflineError(error) {
  return !navigator?.onLine || 
         error.message.includes('network') ||
         error.message.includes('offline') ||
         error.message.includes('connection');
}

/**
 * Make a request with timeout and retry capabilities
 */
async function fetchWithTimeout(
  url, 
  options = {}
) {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    retryDelay = RETRY_DELAY,
    ...fetchOptions
  } = options;

  let lastError = null;
  let attempt = 0;
  
  // Setup default response
  const defaultResponse = {
    data: null,
    error: null,
    status: 0,
    statusText: '',
    headers: new Headers(),
    isTimeout: false,
    isOffline: false
  };

  while (attempt <= retries) {
    attempt++;
    
    try {
      // Create a timeout controller for this attempt
      const { controller, timeoutId } = createTimeoutController(timeout);
      
      // If the user provided a signal, we need to handle both abort sources
      const userSignal = options.signal;
      if (userSignal) {
        // If user signal is already aborted, propagate it
        if (userSignal.aborted) {
          controller.abort(userSignal.reason);
        }
        
        // Add listener to user signal
        userSignal.addEventListener('abort', () => {
          controller.abort(userSignal.reason);
        });
      }
      
      // Make the request with timeout control
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Parse the response
      let data = null;
      
      if (response.status !== 204) { // No Content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // For non-JSON responses, get the text
          const text = await response.text();
          // Try to parse it as JSON anyway
          try {
            data = JSON.parse(text);
          } catch {
            // Not valid JSON, just store as text
            data = text;
          }
        }
      }
      
      return {
        data,
        error: null,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        isTimeout: false,
        isOffline: false,
      };
    } catch (error) {
      lastError = error;
      
      // Check if it's a timeout or offline error
      const isTimeout = isTimeoutError(error);
      const isOffline = isOfflineError(error);
      
      // For timeout or offline errors, consider retrying
      if ((isTimeout || isOffline) && attempt <= retries) {
        console.warn(`API request to ${url} ${isTimeout ? 'timed out' : 'failed due to offline'}, retrying (${attempt}/${retries+1})...`);
        
        // Wait before retry with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's the last retry or not a retry-able error, return the error
      const errorMessage = isTimeout 
        ? 'Request timed out. Please try again later.'
        : isOffline 
          ? 'You appear to be offline. Please check your connection.'
          : 'An error occurred while fetching data.';
            
      console.error(errorMessage);
      
      return {
        ...defaultResponse,
        error: lastError,
        isTimeout,
        isOffline,
      };
    }
  }
  
  // This should never happen, but return something anyway
  return {
    ...defaultResponse,
    error: lastError,
    isTimeout: isTimeoutError(lastError),
    isOffline: isOfflineError(lastError),
  };
}

// Demo Test with fake endpoints
async function testTimeoutHandling() {
  // Usually fast response
  console.log("Testing normal API call (should succeed)");
  const normalResponse = await fetchWithTimeout('https://jsonplaceholder.typicode.com/todos/1', {
    timeout: 5000
  });
  console.log("Normal API response:", normalResponse);
  
  // Simulate timeout
  console.log("\nTesting timeout (should fail with timeout error)");
  const timeoutResponse = await fetchWithTimeout('https://httpbin.org/delay/3', {
    timeout: 1000, // 1 second timeout but endpoint takes 3 seconds
    retries: 1
  });
  console.log("Timeout response:", timeoutResponse);
  
  // Test with retries
  console.log("\nTesting retry capability (should succeed after retry)");
  const retryResponse = await fetchWithTimeout('https://httpbin.org/delay/1', {
    timeout: 2000, // 2 second timeout for endpoint that takes 1 second
    retries: 2
  });
  console.log("Retry response:", retryResponse);
  
  console.log("\nAll tests completed");
}

// Execute the test
testTimeoutHandling();