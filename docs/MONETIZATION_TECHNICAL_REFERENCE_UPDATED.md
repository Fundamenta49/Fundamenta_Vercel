# Monetization Technical Reference (Updated)

This document serves as the connection point between Fundamenta's business monetization strategy and its technical implementation, including payment processing via Stripe and financial tracking via Plaid.

## Overview

Fundamenta uses a tiered monetization approach with four subscription levels (Free, Tier 1, Tier 2, Tier 3) plus Family Plans. Each tier offers different feature sets and usage limits, which are enforced through technical implementations. Payments are processed through Stripe, and financial tracking functionality is provided via Plaid integration.

## Related Documents

### Business & Product Documentation

- **[Tier Overview](../planning/monetization/tiered_access/SUBSCRIPTION_PLAN.md)**: Defines the features and benefits of each subscription tier
- **[Features Matrix](../planning/monetization/tiered_access/FEATURES_MATRIX.json)**: Detailed feature breakdown by tier
- **[Usage Limits](../planning/monetization/tiered_access/LIMITS_CONFIG.json)**: Specific numeric limits for each tier
- **[API Cost Controls](../planning/monetization/tiered_access/API_COST_CONTROLS.md)**: High-level strategies for controlling API costs

### Technical Implementation Documentation

- **[API Throttling Implementation](./API_THROTTLING_IMPLEMENTATION_WITH_PAYMENT_INTEGRATION.md)**: Detailed technical plan for API usage controls with payment integration
- **[API Integration Guide](./API_INTEGRATION_GUIDE.md)**: Guide for integrating with external APIs
- **[API Implementation Checklist](./API_IMPLEMENTATION_CHECKLIST.md)**: Step-by-step checklist for implementing API features

## Tier-to-Technical Mapping

This section maps business tier definitions to technical implementation parameters:

### Free Tier

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Basic chat capabilities | 50 requests/day, 25K tokens/day |
| Basic Financial Tools | Simple calculations, no AI guidance, no Plaid integration | N/A |
| 2 Learning Pathways | Path limit in database | Max 2 active pathways |
| 5 Journal Entries | Entry count limit in database | Max 5 entries/month |
| Basic Progress Stats | Limited metrics, no dashboards | N/A |

### Tier 1 ($5.99/month)

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Enhanced chat with more context | 200 requests/day, 150K tokens/day |
| Workout Recommendations | Specialized AI endpoint | 10 requests/day |
| 5 Learning Pathways | Path limit in database | Max 5 active pathways |
| Basic Financial Tracking | Plaid integration | Max 2 financial accounts, 5 data refreshes/day |
| 30 Journal Entries | Entry count limit in database | Max 30 entries/month |
| Goal tracking | Weekly progress updates | Max 10 goals |
| Basic Analytics Dashboard | Limited dashboard features | Daily refresh only |

### Tier 2 ($12.99/month)

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Advanced contextual awareness | 500 requests/day, 500K tokens/day |
| Unlimited Learning Pathways | No path limits | Unlimited |
| Advanced Financial Planning | Plaid integration with advanced insights | Max 5 financial accounts, 20 refreshes/day |
| Custom Fitness Plans | Specialized AI endpoint with image generation | 30 requests/day |
| Advanced Analytics Dashboard | Full metrics suite | Hourly refresh |

### Tier 3 ($24.99/month)

| Business Feature | Technical Implementation | Limits |
|-----------------|--------------------------|--------|
| Fundi AI Assistant | Premium performance, priority routing | Unlimited |
| Career Development | Specialized AI coaching | Unlimited |
| Investment Guidance | Plaid integration with full financial analysis | Unlimited accounts, unlimited refreshes |
| Meal Planning | Recipe generation with nutritional analysis | Unlimited |
| Premium Analytics Dashboard | All metrics with predictive insights | Real-time updates |

## Payment Processing Architecture

Fundamenta uses Stripe for payment processing with the following components:

### 1. Stripe Price Configuration

Each subscription tier is mapped to a Stripe Price ID:

| Tier | Stripe Price ID |
|------|----------------|
| Tier 1 | `${process.env.STRIPE_TIER1_PRICE_ID}` |
| Tier 2 | `${process.env.STRIPE_TIER2_PRICE_ID}` |
| Tier 3 | `${process.env.STRIPE_TIER3_PRICE_ID}` |
| Family Basic | `${process.env.STRIPE_FAMILY_BASIC_PRICE_ID}` |
| Family Plus | `${process.env.STRIPE_FAMILY_PLUS_PRICE_ID}` |
| Family Premium | `${process.env.STRIPE_FAMILY_PREMIUM_PRICE_ID}` |

### 2. Customer & Subscription Lifecycle

1. **Customer Creation**:
   - When a user signs up, a Stripe Customer is created
   - Customer metadata contains userId for reference

2. **Payment Method Collection**:
   - Uses Stripe Elements for secure card collection
   - Payment methods stored in Stripe, with references in our database

3. **Subscription Creation**:
   - Subscription created on successful payment method verification
   - Trial periods configured in Stripe

4. **Subscription Management**:
   - Upgrade/downgrade handled via Stripe API
   - Cancellations can take effect immediately or at period end

5. **Webhook Processing**:
   - Stripe events processed via webhooks
   - Local subscription data synchronized with Stripe

### 3. Database Integration

User subscription data is stored in the `userSubscriptions` table with fields:
- `userId`
- `tier`
- `status`
- `stripeCustomerId`
- `stripeSubscriptionId`
- `currentPeriodStart`
- `currentPeriodEnd`
- `cancelAtPeriodEnd`

Payment method data is stored in the `paymentMethods` table with fields:
- `userId`
- `stripePaymentMethodId`
- `type`
- `last4`
- `expiryMonth`
- `expiryYear`
- `isDefault`

Invoice history is stored in the `invoices` table with fields:
- `userId`
- `stripeInvoiceId`
- `amount`
- `status`
- `invoiceDate`
- `paidAt`

## Financial Tracking Architecture

Fundamenta uses Plaid for financial account tracking with the following components:

### 1. Plaid Integration Flow

1. **Account Connection**:
   - User initiates connection via Plaid Link
   - Link token created based on user's subscription tier
   - Account limits enforced by tier

2. **Data Synchronization**:
   - Transactions pulled via Plaid API
   - Sync frequency controlled by subscription tier
   - API calls tracked and limited based on tier

3. **Financial Insights**:
   - Basic categorization for Tier 1
   - Spending analysis for Tier 2
   - Full financial planning for Tier 3

### 2. Database Integration

Financial data is stored across several tables:

**plaidItems**:
- `userId`
- `plaidItemId`
- `plaidAccessToken` (encrypted)
- `institutionId`
- `institutionName`
- `status`

**plaidAccounts**:
- `userId`
- `plaidItemId`
- `plaidAccountId`
- `name`
- `type`
- `currentBalance`
- `availableBalance`

**plaidTransactions**:
- `userId`
- `accountId`
- `plaidTransactionId`
- `amount`
- `date`
- `name`
- `category`

### 3. Tier Limitations

| Tier | Max Accounts | Daily Refresh Limit | Features |
|------|--------------|---------------------|----------|
| Free | 0 | 0 | No financial tracking |
| Tier 1 | 2 | 5 | Basic categorization |
| Tier 2 | 5 | 20 | Spending analysis, basic insights |
| Tier 3 | Unlimited | Unlimited | Full financial planning, investment analysis |

## Implementation Architecture Overview

The monetization system is implemented through several interconnected components:

1. **User Subscription Tracking**: Database tables storing user subscription level and status, with Stripe integration
2. **Tier Configuration Service**: Defines the limits and features for each tier
3. **API Usage Tracking**: Records and monitors API usage by user and feature
4. **Throttling Middleware**: Enforces limits based on subscription tier
5. **Payment Processing Service**: Handles Stripe integration and subscription management
6. **Financial Tracking Service**: Manages Plaid integration with tier-appropriate limits
7. **Graceful Degradation**: Provides appropriate user experience when limits are reached
8. **Upgrade Prompting**: Encourages users to upgrade when they hit limits

## Database Schema Extensions

The following database tables support the monetization system:

- `userSubscriptions`: Tracks user subscription level and status, with Stripe integration
- `paymentMethods`: Stores payment method information from Stripe
- `invoices`: Records invoice history from Stripe
- `api_usage_records`: Daily API usage tracking
- `api_usage_summary`: Monthly usage summaries
- `user_feature_access`: Custom feature access overrides
- `plaidItems`: Tracks financial institution connections via Plaid
- `plaidAccounts`: Stores financial account information
- `plaidTransactions`: Records transaction history from financial accounts

## Monetization Health Monitoring

To ensure the monetization system is working properly:

1. **Usage Dashboards**: Admin dashboards showing API usage by tier
2. **Cost Tracking**: Monitoring actual costs against projections
3. **Conversion Analytics**: Tracking upgrades from free to paid tiers
4. **Limit Impact Analysis**: Measuring how often users hit limits
5. **Payment Monitoring**: Tracking payment success/failure rates
6. **Financial Data Integrity**: Ensuring data synchronization is working properly

## Implementation Priority

When implementing the monetization system, focus on these components in order:

1. **Core Feature Gating**: Ensure features are only available to appropriate tiers
2. **Stripe Integration**: Implement payment processing and subscription management
3. **Usage Tracking**: Implement accurate usage tracking
4. **Throttling Middleware**: Add rate limiting based on tier
5. **Plaid Integration**: Add financial tracking with tier-appropriate limits
6. **User Feedback**: Provide clear feedback when limits are reached
7. **Analytics & Monitoring**: Track usage patterns, costs, and subscription metrics

## Technical FAQs

**Q: How do we handle users who change tiers mid-month?**  
A: When a user upgrades, they immediately get the higher tier limits. When downgrading, new limits take effect at the end of the current billing period.

**Q: What happens when a user hits their limit?**  
A: The system returns a 429 status code with a message explaining the limit and offering upgrade options.

**Q: How do we handle payment failures?**  
A: We use Stripe's webhook system to track payment status. When a payment fails, we notify the user and give them a grace period before downgrading their access.

**Q: How do we secure financial data from Plaid?**  
A: Plaid access tokens are encrypted at rest. We implement strict access controls and never store sensitive financial data like account numbers or credentials.

**Q: How do we handle family plans with multiple users?**  
A: Each family member has individual usage tracking, but shares from a family pool for certain features. The primary account holder can manage access and set limits for family members.

**Q: What happens if a financial institution disconnects from Plaid?**  
A: We monitor connection status via webhooks and notify users to reconnect their accounts if needed. Historical data remains available even when connections are broken.