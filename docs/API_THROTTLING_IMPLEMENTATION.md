# API Throttling Implementation Plan

This document outlines the technical implementation plan for API throttling in Fundamenta based on user subscription tiers.

## System Overview

The API throttling system will control access to external APIs (like OpenAI, Spoonacular, etc.) based on user subscription levels. We will use a server-side middleware approach that:

1. Identifies the user's subscription tier
2. Tracks API usage metrics (requests, tokens, specific operations)
3. Enforces appropriate limits based on tier
4. Handles graceful degradation when limits are reached
5. Provides feedback to users about their usage and limits

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  API Request │────▶│ Auth Middleware  │────▶│ Throttling        │
└─────────────┘     └──────────────────┘     │ Middleware        │
                                             └─────────┬─────────┘
                                                       │
                    ┌──────────────────┐     ┌────────▼──────────┐
                    │ Usage Tracking   │◀────┤ Controller/Service │
                    └──────────────────┘     └────────┬──────────┘
                                                      │
                    ┌──────────────────┐     ┌────────▼──────────┐
                    │ External API     │◀────┤ API Client        │
                    │ (OpenAI, etc.)   │     │                   │
                    └──────────────────┘     └───────────────────┘
```

## Key Components

### 1. Tier Configuration Service

Defines usage limits and feature access for each subscription tier.

```typescript
// server/services/tier-config-service.ts

interface TierFeatures {
  isAvailable: boolean;
  maxRequests?: number;  // null = unlimited
  maxTokens?: number;    // null = unlimited
  cooldownPeriod?: number; // in ms, null = no cooldown
}

interface TierConfig {
  aiAssistant: TierFeatures;
  workoutRecommendations: TierFeatures;
  financialPlanning: TierFeatures;
  careerGuidance: TierFeatures;
  mealPlanning: TierFeatures;
  documentAnalysis: TierFeatures;
  // Add other API-dependent features
}

const tierConfigs: Record<string, TierConfig> = {
  'free': {
    aiAssistant: { 
      isAvailable: true, 
      maxRequests: 50,
      maxTokens: 25000
    },
    workoutRecommendations: { 
      isAvailable: false 
    },
    // other feature configs...
  },
  'tier1': {
    aiAssistant: { 
      isAvailable: true, 
      maxRequests: 200,
      maxTokens: 150000
    },
    workoutRecommendations: { 
      isAvailable: true,
      maxRequests: 10
    },
    // other feature configs...
  },
  // tier2, tier3, etc.
};

export function getTierConfig(tier: string): TierConfig {
  return tierConfigs[tier] || tierConfigs['free']; // default to free tier
}
```

### 2. Usage Tracking Service

Tracks and persists API usage metrics for each user.

```typescript
// server/services/api-usage-service.ts

interface UsageRecord {
  userId: number;
  feature: string;
  requestCount: number;
  tokenCount?: number;
  usageDate: Date;
}

interface DailyUsage {
  requestCount: number;
  tokenCount: number;
  lastRequestTime: Date;
}

class ApiUsageService {
  private cache: NodeCache; // In-memory cache for performance
  private db: DatabaseClient; // Database client
  
  constructor(db: DatabaseClient) {
    this.db = db;
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL
  }
  
  // Track usage of a feature
  async trackUsage(userId: number, feature: string, requestCount: number = 1, tokenCount: number = 0): Promise<void> {
    // Update in-memory cache
    const cacheKey = `${userId}:${feature}:${new Date().toISOString().split('T')[0]}`;
    let usage = this.cache.get<DailyUsage>(cacheKey);
    
    if (!usage) {
      usage = {
        requestCount: 0,
        tokenCount: 0,
        lastRequestTime: new Date()
      };
    }
    
    usage.requestCount += requestCount;
    usage.tokenCount += tokenCount;
    usage.lastRequestTime = new Date();
    
    this.cache.set(cacheKey, usage);
    
    // Persist to database
    await this.db.usageRecords.upsert({
      where: { 
        userId_feature_date: {
          userId,
          feature,
          date: new Date().toISOString().split('T')[0]
        }
      },
      update: {
        requestCount: { increment: requestCount },
        tokenCount: { increment: tokenCount }
      },
      create: {
        userId,
        feature,
        date: new Date().toISOString().split('T')[0],
        requestCount,
        tokenCount
      }
    });
  }
  
  // Get usage for a specific feature
  async getUsage(userId: number, feature: string): Promise<DailyUsage> {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `${userId}:${feature}:${today}`;
    
    // Try cache first
    let usage = this.cache.get<DailyUsage>(cacheKey);
    if (usage) return usage;
    
    // Fallback to database
    const record = await this.db.usageRecords.findUnique({
      where: {
        userId_feature_date: {
          userId,
          feature,
          date: today
        }
      }
    });
    
    if (!record) {
      usage = {
        requestCount: 0,
        tokenCount: 0,
        lastRequestTime: new Date(0) // Beginning of epoch
      };
    } else {
      usage = {
        requestCount: record.requestCount,
        tokenCount: record.tokenCount || 0,
        lastRequestTime: record.updatedAt
      };
    }
    
    this.cache.set(cacheKey, usage);
    return usage;
  }
  
  // Reset usage for reporting and monthly limits
  async resetMonthlyUsage(): Promise<void> {
    // This would run via a scheduled job at the beginning of each month
    // Clear cache
    this.cache.flushAll();
    
    // Archive old records and create summary
    await this.db.$transaction([
      this.db.usageSummary.createMany({
        data: await this.generateMonthlySummary()
      }),
      this.db.usageRecords.deleteMany({
        where: {
          date: {
            lt: new Date(new Date().setDate(1)) // First day of current month
          }
        }
      })
    ]);
  }
  
  private async generateMonthlySummary() {
    // Implementation to aggregate usage by user and feature
    // for the previous month
  }
}
```

### 3. Throttling Middleware

Enforces limits based on tier configuration and usage tracking.

```typescript
// server/middleware/api-throttling-middleware.ts

import { Request, Response, NextFunction } from "express";
import { ApiUsageService } from "../services/api-usage-service";
import { getTierConfig } from "../services/tier-config-service";
import { AuthenticatedRequest } from "../auth/auth-middleware";

interface ThrottleOptions {
  feature: string;
  errorMessage?: string;
}

export function apiThrottleMiddleware(options: ThrottleOptions) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { feature } = options;
    
    // Skip for system or admin users
    if (!req.user || req.user.role === 'admin' || req.user.role === 'system') {
      return next();
    }
    
    try {
      // Get user's subscription tier
      const userTier = req.user.subscriptionTier || 'free';
      
      // Get tier configuration
      const tierConfig = getTierConfig(userTier);
      const featureConfig = tierConfig[feature as keyof typeof tierConfig];
      
      // If feature not available for this tier
      if (!featureConfig || !featureConfig.isAvailable) {
        return res.status(403).json({
          error: 'feature_not_available',
          message: options.errorMessage || `This feature is not available on your current plan.`,
          upgradeInfo: {
            currentTier: userTier,
            requiredTier: getMinimumTierForFeature(feature)
          }
        });
      }
      
      // If no request limits, allow the request
      if (featureConfig.maxRequests === null) {
        return next();
      }
      
      // Check current usage
      const usageService = req.app.locals.apiUsageService as ApiUsageService;
      const usage = await usageService.getUsage(req.user.id, feature);
      
      // Check if user has exceeded request limits
      if (usage.requestCount >= featureConfig.maxRequests!) {
        return res.status(429).json({
          error: 'rate_limit_exceeded',
          message: options.errorMessage || `You've reached your daily limit for this feature.`,
          usage: {
            current: usage.requestCount,
            limit: featureConfig.maxRequests,
            resetsAt: getNextResetTime()
          },
          upgradeInfo: {
            currentTier: userTier,
            nextTier: getNextTierUp(userTier)
          }
        });
      }
      
      // Check if user is in cooldown period
      if (featureConfig.cooldownPeriod && isInCooldown(usage.lastRequestTime, featureConfig.cooldownPeriod)) {
        const cooldownRemaining = getCooldownRemaining(usage.lastRequestTime, featureConfig.cooldownPeriod);
        
        return res.status(429).json({
          error: 'cooldown_period',
          message: `Please wait before making another request.`,
          cooldown: {
            remainingSeconds: Math.ceil(cooldownRemaining / 1000),
            totalSeconds: Math.ceil(featureConfig.cooldownPeriod / 1000)
          }
        });
      }
      
      // Attach tracking function to response locals for controllers to use
      res.locals.trackApiUsage = (requestCount = 1, tokenCount = 0) => {
        return usageService.trackUsage(req.user!.id, feature, requestCount, tokenCount);
      };
      
      next();
    } catch (error) {
      console.error('API throttling error:', error);
      // In case of error, allow the request to proceed
      next();
    }
  };
}

function isInCooldown(lastRequestTime: Date, cooldownPeriod: number): boolean {
  const now = new Date();
  const cooldownEnds = new Date(lastRequestTime.getTime() + cooldownPeriod);
  return now < cooldownEnds;
}

function getCooldownRemaining(lastRequestTime: Date, cooldownPeriod: number): number {
  const now = new Date();
  const cooldownEnds = new Date(lastRequestTime.getTime() + cooldownPeriod);
  return Math.max(0, cooldownEnds.getTime() - now.getTime());
}

function getNextResetTime(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

function getMinimumTierForFeature(feature: string): string {
  // Logic to determine minimum tier that has this feature
  // Implementation depends on tier structure
  return 'tier1'; // Default example
}

function getNextTierUp(currentTier: string): string | null {
  const tiers = ['free', 'tier1', 'tier2', 'tier3'];
  const currentIndex = tiers.indexOf(currentTier);
  if (currentIndex < 0 || currentIndex >= tiers.length - 1) {
    return null; // Already at highest tier or unknown tier
  }
  return tiers[currentIndex + 1];
}
```

### 4. Token Counting Utility

For APIs like OpenAI that charge based on token count, measure token usage for accurate tracking.

```typescript
// server/utils/token-counter.ts

import { encode } from "gpt-3-encoder";

export function countTokens(text: string): number {
  return encode(text).length;
}

export function estimateTokensForRequest(messages: any[]): number {
  let tokenCount = 0;
  
  for (const message of messages) {
    // Count tokens in message content
    if (typeof message.content === 'string') {
      tokenCount += countTokens(message.content);
    } else if (Array.isArray(message.content)) {
      // Handle multi-modal messages (text + images)
      for (const part of message.content) {
        if (typeof part === 'string' || part.type === 'text') {
          tokenCount += countTokens(part.text || part);
        } else if (part.type === 'image_url') {
          // Estimate tokens for images (very rough estimate)
          tokenCount += 1000; // Placeholder value - actual sizing depends on image
        }
      }
    }
    
    // Add token count for role and other fields
    tokenCount += 4; // Approximation for message structure
  }
  
  return tokenCount;
}
```

### 5. API Client with Throttling Integration

Wrap external API clients with our throttling mechanisms.

```typescript
// server/services/openai-service.ts

import OpenAI from "openai";
import { estimateTokensForRequest } from "../utils/token-counter";
import { Response } from "express";

export class OpenAIService {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  
  async createChatCompletion(
    messages: any[],
    options: any = {},
    res?: Response // Optional response object for tracking
  ) {
    // Estimate token usage
    const estimatedTokens = estimateTokensForRequest(messages);
    
    try {
      const completion = await this.client.chat.completions.create({
        model: options.model || "gpt-4o", // the newest OpenAI model as of May 2024
        messages,
        ...options
      });
      
      // Track actual usage if response object provided
      if (res && res.locals.trackApiUsage) {
        const promptTokens = completion.usage?.prompt_tokens || estimatedTokens;
        const completionTokens = completion.usage?.completion_tokens || 0;
        const totalTokens = promptTokens + completionTokens;
        
        await res.locals.trackApiUsage(1, totalTokens);
      }
      
      return completion;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}
```

### 6. Route Integration

Apply the middleware to API routes based on feature.

```typescript
// server/routes/ai.ts

import express from "express";
import { apiThrottleMiddleware } from "../middleware/api-throttling-middleware";
import { authMiddleware } from "../auth/auth-middleware";
import * as aiController from "../controllers/ai-controller";

const router = express.Router();

// AI chat endpoint with throttling
router.post(
  "/chat",
  authMiddleware,
  apiThrottleMiddleware({ 
    feature: 'aiAssistant',
    errorMessage: 'You have reached your daily limit for AI chat messages.'
  }),
  aiController.handleChatMessage
);

// Specialized endpoints with their own throttling
router.post(
  "/workout-recommendations",
  authMiddleware,
  apiThrottleMiddleware({ 
    feature: 'workoutRecommendations',
    errorMessage: 'You have reached your daily limit for workout recommendations.'
  }),
  aiController.generateWorkoutPlan
);

// Additional routes with appropriate throttling...

export default router;
```

### 7. Controller Implementation

Use the tracking mechanism in controllers.

```typescript
// server/controllers/ai-controller.ts

import { Request, Response } from "express";
import { OpenAIService } from "../services/openai-service";
import { AuthenticatedRequest } from "../auth/auth-middleware";

const openaiService = new OpenAIService(process.env.OPENAI_API_KEY || '');

export async function handleChatMessage(req: AuthenticatedRequest, res: Response) {
  try {
    const { messages, options } = req.body;
    
    const completion = await openaiService.createChatCompletion(
      messages,
      options,
      res // Pass response for usage tracking
    );
    
    res.json({
      message: completion.choices[0].message,
      usage: completion.usage
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}

// Other controller methods...
```

### 8. Usage Dashboard for Users

Provide users with visibility into their API usage.

```typescript
// server/routes/account.ts

router.get(
  "/api-usage",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const usageService = req.app.locals.apiUsageService;
      const userTier = req.user?.subscriptionTier || 'free';
      const tierConfig = getTierConfig(userTier);
      
      // Get usage for key features
      const features = ['aiAssistant', 'workoutRecommendations', 'financialPlanning', 'documentAnalysis'];
      const usageData = await Promise.all(
        features.map(async (feature) => {
          const usage = await usageService.getUsage(req.user!.id, feature);
          const featureConfig = tierConfig[feature as keyof typeof tierConfig];
          
          return {
            feature,
            current: usage.requestCount,
            limit: featureConfig?.maxRequests || 0,
            isAvailable: featureConfig?.isAvailable || false,
            percentage: featureConfig?.maxRequests 
              ? Math.round((usage.requestCount / featureConfig.maxRequests) * 100) 
              : 0
          };
        })
      );
      
      res.json({
        tier: userTier,
        usageData,
        resetTime: getNextResetTime()
      });
    } catch (error) {
      console.error('Error fetching API usage:', error);
      res.status(500).json({ error: 'Failed to fetch usage data' });
    }
  }
);
```

## Database Schema Extensions

Add these tables to your database schema:

```typescript
// shared/schema.ts (add to existing schema)

export const apiUsageRecords = pgTable(
  'api_usage_records',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    feature: text('feature').notNull(),
    date: text('date').notNull(), // YYYY-MM-DD format
    requestCount: integer('request_count').notNull().default(0),
    tokenCount: integer('token_count'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => {
    return {
      userFeatureDate: uniqueIndex('user_feature_date_idx').on(
        table.userId,
        table.feature,
        table.date
      )
    };
  }
);

export const apiUsageSummary = pgTable(
  'api_usage_summary',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    feature: text('feature').notNull(),
    month: text('month').notNull(), // YYYY-MM format
    totalRequests: integer('total_requests').notNull(),
    totalTokens: integer('total_tokens'),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => {
    return {
      userFeatureMonth: uniqueIndex('user_feature_month_idx').on(
        table.userId,
        table.feature,
        table.month
      )
    };
  }
);
```

## System Initialization

Set up the system during application startup:

```typescript
// server/index.ts (add to existing startup code)

import { ApiUsageService } from "./services/api-usage-service";

async function startServer() {
  // ... existing code
  
  // Initialize API usage service
  const apiUsageService = new ApiUsageService(db);
  app.locals.apiUsageService = apiUsageService;
  
  // ... rest of server initialization
}
```

## Monitoring and Administration

Add admin routes for monitoring system usage:

```typescript
// server/routes/admin.ts

router.get(
  "/api-usage-summary",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { timeframe = 'day', feature } = req.query;
      const usageService = req.app.locals.apiUsageService;
      
      const summary = await usageService.getUsageSummary(
        timeframe as string,
        feature as string
      );
      
      res.json(summary);
    } catch (error) {
      console.error('Error fetching usage summary:', error);
      res.status(500).json({ error: 'Failed to fetch usage summary' });
    }
  }
);
```

## Implementation Schedule

1. **Phase 1: Core Infrastructure**
   - Implement database schema extensions
   - Create TierConfigService
   - Develop ApiUsageService
   - Add token counting utilities

2. **Phase 2: Middleware & Integration**
   - Implement throttling middleware
   - Integrate with API clients
   - Add usage tracking to controllers

3. **Phase 3: User Experience**
   - Create usage dashboard for users
   - Implement graceful degradation UX
   - Add upgrade prompts when limits are reached

4. **Phase 4: Administration & Monitoring**
   - Develop admin dashboard
   - Implement usage reports
   - Set up alerts for unusual usage patterns

## Cost Management Considerations

1. **Automatic Tier Enforcement**
   - The system will automatically enforce different limits based on user tier
   - No risk of users accidentally exceeding their tier limits

2. **Gradual Feature Unlocking**
   - New users start with basic features
   - Resource-intensive features are unlocked only in higher tiers

3. **Cooldown Periods**
   - Prevent rapid, automated API calls with cooldown periods
   - Higher tiers get shorter or no cooldowns

4. **Usage Monitoring**
   - Regular reports on API usage costs
   - Identify potential optimizations

## Testing Strategy

1. **Unit Tests**
   - Test tier configuration service
   - Test token counting utilities
   - Test usage tracking service

2. **Integration Tests**
   - Test middleware with various tier configurations
   - Verify proper tracking of usage

3. **Load Tests**
   - Verify the system handles concurrent requests
   - Test performance with high usage volumes

4. **User Acceptance Testing**
   - Verify user experience when limits are reached
   - Test upgrade flow from lower to higher tiers