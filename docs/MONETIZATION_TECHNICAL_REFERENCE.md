# Monetization Technical Reference

This document serves as the connection point between Fundamenta's business monetization strategy and its technical implementation.

## Overview

Fundamenta uses a tiered monetization approach with four subscription levels (Free, Tier 1, Tier 2, Tier 3) plus Family Plans. Each tier offers different feature sets and usage limits, which are enforced through technical implementations.

## Related Documents

### Business & Product Documentation

- **[Tier Overview](../planning/monetization/tiered_access/SUBSCRIPTION_PLAN.md)**: Defines the features and benefits of each subscription tier
- **[Features Matrix](../planning/monetization/tiered_access/FEATURES_MATRIX.json)**: Detailed feature breakdown by tier
- **[Usage Limits](../planning/monetization/tiered_access/LIMITS_CONFIG.json)**: Specific numeric limits for each tier
- **[API Cost Controls](../planning/monetization/tiered_access/API_COST_CONTROLS.md)**: High-level strategies for controlling API costs

### Technical Implementation Documentation

- **[API Throttling Implementation](./API_THROTTLING_IMPLEMENTATION.md)**: Detailed technical plan for implementing API usage controls
- **[API Integration Guide](./API_INTEGRATION_GUIDE.md)**: Guide for integrating with external APIs
- **[API Implementation Checklist](./API_IMPLEMENTATION_CHECKLIST.md)**: Step-by-step checklist for implementing API features

## Tier-to-Technical Mapping

This section maps business tier definitions to technical implementation parameters:

### Free Tier

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Basic chat capabilities | 50 requests/day, 25K tokens/day |
| Basic Financial Tools | Simple calculations, no AI guidance | N/A |
| 2 Learning Pathways | Path limit in database | Max 2 active pathways |
| 5 Journal Entries | Entry count limit in database | Max 5 entries/month |
| Basic Progress Stats | Limited metrics, no dashboards | N/A |

### Tier 1 ($5.99/month)

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Enhanced chat with more context | 200 requests/day, 150K tokens/day |
| Workout Recommendations | Specialized AI endpoint | 10 requests/day |
| 5 Learning Pathways | Path limit in database | Max 5 active pathways |
| 30 Journal Entries | Entry count limit in database | Max 30 entries/month |
| Basic Analytics Dashboard | Limited dashboard features | Daily refresh only |

### Tier 2 ($12.99/month)

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Advanced contextual awareness | 500 requests/day, 500K tokens/day |
| Unlimited Learning Pathways | No path limits | Unlimited |
| Advanced Financial Planning | Complex calculations with AI guidance | 20 requests/day |
| Custom Fitness Plans | Specialized AI endpoint with image generation | 30 requests/day |
| Advanced Analytics Dashboard | Full metrics suite | Hourly refresh |

### Tier 3 ($24.99/month)

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Premium performance, priority routing | Unlimited |
| Career Development | Specialized AI coaching | Unlimited |
| Investment Guidance | Financial modeling with ML | Unlimited |
| Meal Planning | Recipe generation with nutritional analysis | Unlimited |
| Premium Analytics Dashboard | All metrics with predictive insights | Real-time updates |

## API Service Tier Configuration

Each external API service has specific configuration based on tier:

### OpenAI

| Tier | Max Requests/Day | Max Tokens/Day | Model Access | Features |
|------|------------------|----------------|--------------|----------|
| Free | 50 | 25,000 | gpt-4o | Basic chat |
| Tier 1 | 200 | 150,000 | gpt-4o | Enhanced chat, personalization |
| Tier 2 | 500 | 500,000 | gpt-4o | All features, priority processing |
| Tier 3 | Unlimited | Unlimited | gpt-4o | All features, coaching capabilities |

### Spoonacular

| Tier | Max Requests/Day | Features |
|------|------------------|----------|
| Free | 0 | None |
| Tier 1 | 10 | Basic recipe search |
| Tier 2 | 50 | Recipe search, nutritional analysis |
| Tier 3 | 150 | Full meal planning, shopping lists |

### Fitness API

| Tier | Max Requests/Day | Features |
|------|------------------|----------|
| Free | 5 | Basic exercise lookup |
| Tier 1 | 20 | Exercise recommendations |
| Tier 2 | 50 | Custom workout plans |
| Tier 3 | 100 | AI coaching, personalized plans |

## Implementation Architecture Overview

The monetization system is implemented through several interconnected components:

1. **User Subscription Tracking**: Database tables storing user subscription level and status
2. **Tier Configuration Service**: Defines the limits and features for each tier
3. **API Usage Tracking**: Records and monitors API usage by user and feature
4. **Throttling Middleware**: Enforces limits based on subscription tier
5. **Graceful Degradation**: Provides appropriate user experience when limits are reached
6. **Upgrade Prompting**: Encourages users to upgrade when they hit limits

## Database Schema Extensions

The following database tables support the monetization system:

- `subscriptions`: Tracks user subscription level and status
- `api_usage_records`: Daily API usage tracking
- `api_usage_summary`: Monthly usage summaries
- `user_feature_access`: Custom feature access overrides

## Monetization Health Monitoring

To ensure the monetization system is working properly:

1. **Usage Dashboards**: Admin dashboards showing API usage by tier
2. **Cost Tracking**: Monitoring actual costs against projections
3. **Conversion Analytics**: Tracking upgrades from free to paid tiers
4. **Limit Impact Analysis**: Measuring how often users hit limits

## Implementation Priority

When implementing the monetization system, focus on these components in order:

1. **Core Feature Gating**: Ensure features are only available to appropriate tiers
2. **Usage Tracking**: Implement accurate usage tracking
3. **Throttling Middleware**: Add rate limiting based on tier
4. **User Feedback**: Provide clear feedback when limits are reached
5. **Analytics & Monitoring**: Track usage patterns and costs

## Technical FAQs

**Q: How do we handle users who change tiers mid-month?**  
A: When a user upgrades, they immediately get the higher tier limits. When downgrading, new limits take effect at the start of the next billing cycle.

**Q: What happens when a user hits their limit?**  
A: The system returns a 429 status code with a message explaining the limit and offering upgrade options.

**Q: How do we ensure accurate token counting for OpenAI?**  
A: We use `gpt-3-encoder` to count input tokens and track completions tokens from API responses.

**Q: How do we handle family plans with multiple users?**  
A: Each family member has individual usage tracking, but shares from a family pool for certain features.