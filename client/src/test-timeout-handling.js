// Test script for the request timeout handling functionality

import { apiGet, apiPost } from './lib/api-client';

// Mock toast for testing
const mockToast = (message) => {
  console.log(`Toast: ${message}`);
};

// Test function for request timeout handling
async function testTimeoutHandling() {
  console.log('--- Request Timeout Handling Test ---');
  
  try {
    // Test successful request
    console.log('Testing normal request...');
    const response1 = await apiGet('/api/test-success', { 
      timeout: 1000,
      showErrorToast: false
    });
    console.log('Normal request result:', {
      status: response1.status,
      isTimeout: response1.isTimeout,
      isOffline: response1.isOffline
    });
    
    // Test timeout request
    console.log('\nTesting timeout request...');
    const response2 = await apiGet('/api/test-timeout', { 
      timeout: 1000, 
      retries: 1,
      showErrorToast: false
    });
    console.log('Timeout request result:', {
      status: response2.status,
      isTimeout: response2.isTimeout,
      isOffline: response2.isOffline,
      error: response2.error?.message
    });
    
    // Test offline request
    console.log('\nTesting offline request...');
    const response3 = await apiGet('/api/test-offline', { 
      timeout: 1000,
      retries: 1,
      showErrorToast: false
    });
    console.log('Offline request result:', {
      status: response3.status,
      isTimeout: response3.isTimeout,
      isOffline: response3.isOffline,
      error: response3.error?.message
    });
    
    // Test with retry capability
    console.log('\nTesting retry capability...');
    const response4 = await apiGet('/api/test-retry', {
      timeout: 1000,
      retries: 2,
      retryDelay: 500,
      showErrorToast: false
    });
    console.log('Retry request result:', {
      status: response4.status,
      isTimeout: response4.isTimeout,
      isOffline: response4.isOffline,
      error: response4.error?.message
    });
    
    console.log('\nTimeout handling test completed');
  } catch (error) {
    console.error('Timeout test failed:', error);
  }
}

// Run tests
testTimeoutHandling();

// Export for use in Node
export { testTimeoutHandling };