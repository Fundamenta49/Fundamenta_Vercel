# Fundamenta AI API: Quickstart Guide

This document provides simple, step-by-step instructions for setting up and configuring the OpenAI API integration for Fundamenta. This guide is designed for both technical and non-technical users.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Basic Setup (5 minutes)](#basic-setup-5-minutes)
3. [Testing Your Configuration (2 minutes)](#testing-your-configuration-2-minutes)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [Next Steps](#next-steps)

## Prerequisites

Before starting, make sure you have:
- An OpenAI account with API access
- Your OpenAI API key
- Access to the Fundamenta codebase
- Basic familiarity with using a terminal/command line

## Basic Setup (5 minutes)

### Step 1: Set up your API key

1. Copy your OpenAI API key from the [OpenAI dashboard](https://platform.openai.com/api-keys)

2. In the root directory of your Fundamenta project, locate the `.env` file. If it doesn't exist, create one.

3. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
   
   Example:
   ```
   OPENAI_API_KEY=sk-ABCd1234efGHIjkLMN5678pqRSTUvwXYZ9012345
   ```

4. Save the `.env` file

### Step 2: Verify key installation

1. Open a terminal in your project directory

2. Run the verification script:
   ```bash
   node server/tests/openai-test.js
   ```

3. You should see a successful response message. If not, check the [Common Issues](#common-issues--solutions) section below.

## Testing Your Configuration (2 minutes)

### Quick Test

1. Start the application:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the application

3. Use the AI assistant with a simple query like "What can you help me with?"

4. You should receive a proper response from the AI. If not, check the console for error messages.

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **"OpenAI API key not configured"** | Double-check that your `.env` file contains the correct API key and is in the root directory |
| **"API key is incorrect"** | Verify your API key is correct and has not expired on the OpenAI dashboard |
| **"Request failed"** | Check that your OpenAI account has available credits and no payment issues |
| **"Module not found"** | Run `npm install` to ensure all dependencies are installed |
| **Slow responses** | This is normal for the first request; subsequent requests should be faster |

## Configuration Options (Optional)

If you want to customize the API behavior, you can add these optional settings to your `.env` file:

```
# Enable fallback system (recommended)
AI_FALLBACK_ENABLED=true

# Number of failures before switching to fallback mode
MAX_FAILURES_BEFORE_FALLBACK=5

# How long to wait before trying the primary API again (in milliseconds)
COOLDOWN_PERIOD_MS=300000

# Model to use (defaults to gpt-4o)
OPENAI_MODEL=gpt-4o
```

## Tier-Based Configuration

The system automatically configures API access based on user subscription tiers. No additional setup is required for this functionality.

If you need to modify tier-specific settings, edit the following files:

- `planning/monetization/tiered_access/LIMITS_CONFIG.json`: Adjust usage limits by tier
- `planning/monetization/tiered_access/API_COST_CONTROLS.md`: Modify cost control strategies
- `server/ai/ai-fallback-strategy.ts`: Adjust fallback behavior settings

## Next Steps

After completing the basic setup:

1. Review the detailed [API Integration Guide](./API_INTEGRATION_GUIDE.md) for a comprehensive understanding of the architecture
2. Use the [API Implementation Checklist](./API_IMPLEMENTATION_CHECKLIST.md) for advanced configuration
3. Review [API Expectations and Usage](./API_EXPECTATIONS_AND_USAGE.md) to understand system behavior

## Quick Reference: Key Files

| Purpose | File Location |
|---------|---------------|
| OpenAI Client | `server/openai.ts` |
| Fallback System | `server/ai/ai-fallback-strategy.ts` |
| Core AI Logic | `server/ai/index.ts` |
| API Routes | `server/routes/ai.ts` |
| Environment Config | `.env` (root directory) |
| Test Script | `server/tests/openai-test.js` |

---

## Admin: Monitoring & Management

As an administrator, you can:

1. **Monitor API Status**: Visit `/admin/ai-status` in the application
2. **View Failure Logs**: Check the console logs for "AI provider" related messages
3. **Reset Fallback System**: Use the admin dashboard or call `/api/ai/reset-fallback`
4. **Toggle Fallback Mode**: Use the admin dashboard or call `/api/ai/toggle-fallback`

---

For additional assistance, refer to the more detailed documentation in the `docs` directory or contact the development team.