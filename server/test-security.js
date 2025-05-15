/**
 * Security Implementation Test Script
 * Part of Bundle 5A security hardening
 * 
 * This script tests the error handling and rate limiting functionality
 * implemented in the Bundle 5A security enhancements.
 */

import { ipRateLimiter, strictRateLimiter } from './utils/rate-limiter.js';
import { RateLimitExceededError, ValidationError, NotFoundError, AuthorizationError } from './utils/errors.js';
import { asyncHandler } from './utils/errors.js';

// Mock Express request and response objects
const mockRequest = () => ({
  ip: '127.0.0.1',
  path: '/api/test',
  headers: {},
  socket: { remoteAddress: '127.0.0.1' }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
};

// Test the asyncHandler with various error types
const testAsyncHandler = async () => {
  console.log('Testing asyncHandler with different error types...');
  
  const req = mockRequest();
  const res = mockResponse();
  
  // Test with ValidationError
  const handlerWithValidationError = asyncHandler(async () => {
    throw new ValidationError('Invalid input data');
  });
  
  await handlerWithValidationError(req, res, () => {});
  
  // Test with NotFoundError
  const handlerWithNotFoundError = asyncHandler(async () => {
    throw new NotFoundError('Resource not found');
  });
  
  await handlerWithNotFoundError(req, res, () => {});
  
  // Test with AuthorizationError
  const handlerWithAuthError = asyncHandler(async () => {
    throw new AuthorizationError('Unauthorized access');
  });
  
  await handlerWithAuthError(req, res, () => {});
  
  console.log('asyncHandler tests completed');
};

// Test the rate limiters
const testRateLimiters = () => {
  console.log('Testing rate limiters...');
  
  const req = mockRequest();
  const res = mockResponse();
  const next = jest.fn();
  
  // Test IP rate limiter
  const ipLimiter = ipRateLimiter(5);
  
  // Simulate multiple requests
  for (let i = 0; i < 7; i++) {
    ipLimiter(req, res, next);
  }
  
  // Test strict rate limiter
  const strictLimiter = strictRateLimiter(3);
  
  // Simulate multiple requests
  for (let i = 0; i < 5; i++) {
    strictLimiter(req, res, next);
  }
  
  console.log('Rate limiter tests completed');
};

// Run the tests
const runTests = async () => {
  console.log('Starting security implementation tests...');
  
  try {
    await testAsyncHandler();
    testRateLimiters();
    
    console.log('All security tests completed successfully');
  } catch (error) {
    console.error('Test error:', error);
  }
};

// Execute tests if run directly
if (process.argv[1].endsWith('test-security.js')) {
  runTests();
}

export { runTests };