# Fundamenta API Integration Guide

## Executive Summary

This document provides a comprehensive overview of Fundamenta's AI API integration architecture, including configuration details, optimization strategies, and implementation guidelines. The platform leverages OpenAI's GPT-4o model as the primary AI provider, with a sophisticated fallback system to ensure uninterrupted service and cost optimization across different subscription tiers.

## Table of Contents

1. [API Architecture Overview](#1-api-architecture-overview)
2. [Integration Components](#2-integration-components)
3. [Authentication & Security](#3-authentication--security)
4. [Request Flow & Processing](#4-request-flow--processing)
5. [Fallback Strategy](#5-fallback-strategy)
6. [Cost Optimization](#6-cost-optimization)
7. [Tier-Based API Access](#7-tier-based-api-access)
8. [Performance Monitoring](#8-performance-monitoring)
9. [Setup Guidelines](#9-setup-guidelines)
10. [Best Practices](#10-best-practices)

## 1. API Architecture Overview

Fundamenta employs a multi-layered AI integration architecture designed for reliability, cost-efficiency, and personalization:

```
┌─────────────┐     ┌────────────────┐     ┌─────────────────┐
│ Client-side │ --> │ Express Server │ --> │ AI Orchestrator │
│ Components  │     │ API Endpoints  │     │ Layer           │
└─────────────┘     └────────────────┘     └─────────────────┘
                                                   │
                         ┌───────────────────────┬─┴───────────────────────┐
                         │                       │                         │
                   ┌─────▼─────┐          ┌──────▼───────┐          ┌──────▼───────┐
                   │  Primary  │          │  Category    │          │   Fallback   │
                   │  OpenAI   │          │  Detection   │          │   Services   │
                   │  Provider │          │  & Routing   │          │   (HuggingFace) │
                   └───────────┘          └──────────────┘          └──────────────┘
```

The architecture supports:
- Message categorization for specialized handling
- Emotional context analysis for personalized responses
- Automatic fallback mechanisms for service continuity
- Tier-specific access controls for cost management

## 2. Integration Components

### 2.1 Primary AI Service (`openai.ts`)

The OpenAI integration serves as the primary AI provider, utilizing GPT-4o for:
- Conversational responses
- Content categorization
- Emotional analysis
- Feature-specific prompting

Key implementation details:
```typescript
import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Example function for generating responses
async function generateResponse(message, systemPrompt, previousMessages) {
  // Implementation details
}
```

### 2.2 Fallback AI Service (`ai-fallback-strategy.ts`)

A resilient fallback system that:
- Detects API failures
- Provides alternative response mechanisms
- Manages error recovery
- Ensures continuity of service

### 2.3 Categorization System

Automatically categorizes user messages to route them to specialized handlers:
- Finance
- Wellness
- Learning
- Career
- Fitness
- Nutrition
- General

### 2.4 AI Orchestrator

Coordinates between different AI services and components:
- Routes requests to appropriate handlers
- Manages context and state
- Applies tier-specific limitations
- Tracks usage metrics

## 3. Authentication & Security

### 3.1 API Key Management

- OpenAI API key stored in environment variables
- No hardcoded credentials in source code
- Key rotation procedures for security

### 3.2 Request Authorization

- Access controls based on user subscription tier
- API request validation and sanitization
- Rate limiting to prevent abuse

## 4. Request Flow & Processing

The typical request flow follows this pattern:

1. **Client Request**: User sends message via component
2. **Context Enhancement**: System adds contextual data (current page, user profile)
3. **Category Detection**: Message categorized for specialized handling
4. **Emotion Analysis**: User emotional state detected for response adaptation
5. **API Request**: Structured request sent to OpenAI with appropriate system prompt
6. **Response Processing**: Raw API response formatted for client consumption
7. **Fallback Handling**: Alternative processing if primary API fails
8. **Client Delivery**: Formatted response returned to user

## 5. Fallback Strategy

The platform implements a sophisticated fallback mechanism:

### 5.1 Failure Detection

- Tracks API failures with counter mechanism
- Records timing of failures
- Provides status monitoring endpoint

Implementation excerpt:
```typescript
private recordFailure() {
  this.failureCount++;
  this.lastFailureTime = Date.now();
}

private recordSuccess() {
  // Gradually reduce the failure count on success
  if (this.failureCount > 0) {
    this.failureCount--;
  }
}
```

### 5.2 Alternative Providers

- HuggingFace as secondary AI provider
- Pattern-based responses for common queries
- Cached responses for frequent interactions

### 5.3 Recovery Mechanisms

- Automatic reset of failure counters
- Health check endpoint for status monitoring
- Manual reset capability via admin interface

## 6. Cost Optimization

### 6.1 Request Efficiency

- Optimized prompt engineering to reduce token usage
- Response format constraints to minimize completion length
- Batch processing where appropriate

### 6.2 Caching Strategy

- Response caching for common queries
- Context-aware cache invalidation
- Progressive cache refreshing

### 6.3 Usage Monitoring

- Per-user API usage tracking
- Tier-specific allocation and limits
- Alerting system for usage anomalies

## 7. Tier-Based API Access

API access is tailored to subscription tiers:

### 7.1 Free Tier

- Limited AI Assistant interactions
- Basic categorization and routing
- Restricted access to resource-intensive features
- Usage caps to prevent exploitation

### 7.2 Personal Growth Tier ($5.99/month)

- Expanded AI Assistant capabilities
- More personalized responses
- Access to basic specialized features
- Higher usage limits

### 7.3 Life Navigator Tier ($12.99/month)

- Enhanced personalization
- Full access to specialized AI features
- Prioritized request handling
- Significantly higher usage limits

### 7.4 Fundamenta Complete ($24.99/month)

- Premium AI coaching capabilities
- Advanced personalization
- Unlimited document analysis
- No usage caps on most features

### 7.5 Family Plans

- Shared usage pools
- Multi-user context handling
- Age-appropriate content filtering
- Cost optimizations for multi-user households

## 8. Performance Monitoring

### 8.1 API Health Metrics

- Success/failure rate tracking
- Response time monitoring
- Usage patterns analysis

### 8.2 Administrative Tools

The platform includes admin tools for:
- Toggling fallback mode
- Resetting failure counters
- Viewing system health status
- Monitoring usage patterns

Implementation excerpt:
```typescript
// Toggle fallback mode manually
router.post("/toggle-fallback", async (req, res) => {
  try {
    const { useFallback } = schema.parse(req.body);
    const result = fallbackAIService.toggleFallbackMode(useFallback);
    // Implementation details
  } catch (error) {
    // Error handling
  }
});
```

## 9. Setup Guidelines

### 9.1 Environment Configuration

Required environment variables:
```
OPENAI_API_KEY=your_openai_api_key
```

Optional configuration:
```
AI_FALLBACK_ENABLED=true|false
MAX_FAILURES_BEFORE_FALLBACK=5
COOLDOWN_PERIOD_MS=300000
```

### 9.2 Installation Steps

1. Ensure OpenAI API key is properly configured in environment
2. Verify fallback strategy configuration
3. Run tests to confirm API connectivity and fallback operation
4. Monitor initial production requests for performance

### 9.3 Verification Process

```bash
# Test OpenAI integration
node server/tests/openai-test.js

# Test fallback mechanisms
node server/test-fallback.js
```

## 10. Best Practices

### 10.1 Cost Management

- Implement tight token usage controls
- Use model-appropriate features (don't use GPT-4o for simple tasks)
- Leverage caching for repetitive queries
- Monitor usage patterns for optimization opportunities

### 10.2 Performance Optimization

- Use streaming responses for long completions
- Optimize prompt design for token efficiency
- Implement response size limitations
- Structure complex requests as smaller, focused interactions

### 10.3 Reliability Considerations

- Always include fallback mechanisms
- Design for graceful degradation
- Implement comprehensive error handling
- Provide meaningful user feedback during service interruptions

### 10.4 Development Guidelines

- Test all AI interactions thoroughly before deployment
- Maintain separation between model-specific and generic code
- Document prompt designs and their intended outcomes
- Version control system prompts and fallback configurations

## Conclusion

The Fundamenta AI integration architecture provides a robust, cost-effective, and scalable foundation for delivering personalized AI assistance across various subscription tiers. By implementing proper fallback strategies, tier-specific access controls, and performance monitoring, the platform ensures reliable service delivery while optimizing API costs and maintaining user experience quality.

## Appendix: API Cost Structure

### A.1 OpenAI GPT-4o Pricing (as of May 2024)
- Input tokens: $10.00 per million tokens
- Output tokens: $30.00 per million tokens

### A.2 Estimated Usage per User Type

| Feature | Free Tier | T1 | T2 | T3 | Family Plans |
|---------|-----------|----|----|----| ------------ |
| Daily Active Use | 20% | 40% | 65% | 80% | 90% |
| Avg. Requests/Day | 5 | 10 | 15 | 25 | 35 |
| Avg. Tokens/Request | 750 | 1200 | 1800 | 2500 | 2000 |
| Monthly Token Usage | 22.5K | 144K | 526K | 1.5M | 1.89M |
| Est. Monthly Cost | $0.56 | $3.60 | $13.15 | $37.50 | $47.25 |

### A.3 Cost Control Techniques

- Tier-specific prompt length restrictions
- Context window optimization
- Response length limitations
- Feature-specific token budgets