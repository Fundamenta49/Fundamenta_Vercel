# API Troubleshooting Guide

## Core Rule: Never Resort to Mock Data Without Proper Investigation

We establish this guide to ensure the integrity of data in our application by prioritizing authentic API data retrieval over mock implementations.

## API Connection Troubleshooting Protocol

When an API appears to be failing, follow these steps in order:

### 1. Diagnostic Steps (All Required)

- Check network connectivity through direct curl requests
- Verify API endpoint URLs against documentation
- Test API credentials with isolated requests
- Examine response headers, status codes, and body content
- Check API documentation for rate limits, restrictions, or known issues
- Review server logs and browser console for detailed error messages
- Check if there might be CORS issues in browser-based requests

### 2. Solutions (In Priority Order)

a. **Fix connection issues**
   - Address network connectivity problems
   - Correct malformed requests
   - Update headers or parameters

b. **Request updated credentials**
   - If API keys appear invalid, request new ones
   - Check if API keys need periodic rotation

c. **Implement resilient retry logic**
   - Add exponential backoff for temporary failures
   - Handle rate-limiting gracefully

d. **Last resort: Temporary degraded operation**
   - Only with explicit user permission
   - Clearly indicate to users when authentic data is unavailable
   - Document the exact failure modes and steps taken
   - Create a plan to return to authentic data

## Implementation Rules

1. **No silent fallbacks** - Always log detailed errors when API calls fail
2. **Preserve original functionality** - Do not modify application behavior without discussion
3. **Maintain transparency** - Clearly communicate the nature of any data being displayed
4. **Get user input** - Request user decision before implementing workarounds
5. **Document all issues** - Create detailed documentation of API issues and their resolution

## Error Handling Best Practices

- Log detailed error information including request parameters and response data
- Implement proper error boundaries to prevent application crashes
- Create user-friendly error messages that explain the issue without technical jargon
- Provide actionable steps when possible (e.g., "Try again later" for temporary issues)

By following this protocol, we ensure that our application always prioritizes authentic data from authorized sources and maintains the highest standards of data integrity.
