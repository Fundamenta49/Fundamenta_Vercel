# API Throttling Implementation Blueprint

This document outlines the technical implementation plan for API throttling in Fundamenta based on user subscription tiers. This blueprint is tailored to work with the existing codebase architecture and patterns.

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

## Implementation Steps

### 1. Database Schema Extensions

Add the following tables to `shared/schema.ts`:

```typescript
// User subscription table
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  tier: text("tier").notNull().default("free"), // "free", "tier1", "tier2", "tier3", "family_basic", etc.
  status: text("status").notNull().default("active"), // "active", "cancelled", "past_due"
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"), // null = ongoing subscription
  trialEndsAt: timestamp("trial_ends_at"), // when free trial ends
  stripeCustomerId: text("stripe_customer_id"), // for integration with payment provider
  stripeSubscriptionId: text("stripe_subscription_id"), // for integration with payment provider
  metadata: jsonb("metadata").default({}), // for additional subscription info
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// API usage tracking table (daily records)
export const apiUsageRecords = pgTable(
  "api_usage_records",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    feature: text("feature").notNull(), // e.g. "aiAssistant", "nutrition", "fitness"
    date: text("date").notNull(), // YYYY-MM-DD format
    requestCount: integer("request_count").notNull().default(0),
    tokenCount: integer("token_count"), // for text-based APIs like OpenAI
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      userFeatureDate: uniqueIndex("user_feature_date_idx").on(
        table.userId,
        table.feature,
        table.date
      ),
    };
  }
);

// Monthly usage summary table
export const apiUsageSummary = pgTable(
  "api_usage_summary",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    feature: text("feature").notNull(),
    month: text("month").notNull(), // YYYY-MM format
    totalRequests: integer("total_requests").notNull().default(0),
    totalTokens: integer("total_tokens"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      userFeatureMonth: uniqueIndex("user_feature_month_idx").on(
        table.userId,
        table.feature,
        table.month
      ),
    };
  }
);

// Custom feature overrides table
export const userFeatureAccess = pgTable("user_feature_access", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  feature: text("feature").notNull(),
  maxRequests: integer("max_requests"), // override default limit, null = no limit
  maxTokens: integer("max_tokens"), // override default token limit
  expiresAt: timestamp("expires_at"), // when override expires
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

Then add the corresponding Zod schemas and TypeScript types:

```typescript
// Subscription schemas
export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

// API usage record schemas
export const insertApiUsageRecordSchema = createInsertSchema(apiUsageRecords)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertApiUsageRecord = z.infer<typeof insertApiUsageRecordSchema>;
export type ApiUsageRecord = typeof apiUsageRecords.$inferSelect;

// API usage summary schemas
export const insertApiUsageSummarySchema = createInsertSchema(apiUsageSummary)
  .omit({ id: true, createdAt: true });

export type InsertApiUsageSummary = z.infer<typeof insertApiUsageSummarySchema>;
export type ApiUsageSummary = typeof apiUsageSummary.$inferSelect;

// User feature access schemas
export const insertUserFeatureAccessSchema = createInsertSchema(userFeatureAccess)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertUserFeatureAccess = z.infer<typeof insertUserFeatureAccessSchema>;
export type UserFeatureAccess = typeof userFeatureAccess.$inferSelect;
```

### 2. Storage Interface Extensions

Add methods to the `IStorage` interface in `server/storage.ts`:

```typescript
interface IStorage {
  // Existing methods...

  // Subscription methods
  getUserSubscription(userId: number): Promise<UserSubscription | null>;
  createUserSubscription(data: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(userId: number, data: Partial<InsertUserSubscription>): Promise<UserSubscription | null>;
  updateStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<UserSubscription | null>;
  cancelSubscription(userId: number): Promise<UserSubscription | null>;

  // API usage tracking methods
  trackApiUsage(userId: number, feature: string, requestCount?: number, tokenCount?: number): Promise<ApiUsageRecord>;
  getApiUsage(userId: number, feature: string, date?: string): Promise<ApiUsageRecord | null>;
  getDailyApiUsageSummary(userId: number, date?: string): Promise<Record<string, ApiUsageRecord>>;
  getMonthlyApiUsageSummary(userId: number, month?: string): Promise<Record<string, ApiUsageSummary>>;
  
  // Feature access methods
  getUserFeatureAccess(userId: number, feature: string): Promise<UserFeatureAccess | null>;
  setUserFeatureAccess(userId: number, feature: string, limits: Partial<InsertUserFeatureAccess>): Promise<UserFeatureAccess>;
}
```

Implement these methods in `MemStorage` class for development and `PostgresStorage` class for production.

### 3. Tier Configuration Service

Create a service to define and provide tier configuration:

```typescript
// server/services/tier-config-service.ts

import NodeCache from 'node-cache';

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

// Define configurations for each tier
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
    financialPlanning: {
      isAvailable: true,
      maxRequests: 10
    },
    careerGuidance: {
      isAvailable: false
    },
    mealPlanning: {
      isAvailable: false
    },
    documentAnalysis: {
      isAvailable: false
    }
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
    financialPlanning: {
      isAvailable: true,
      maxRequests: 20
    },
    careerGuidance: {
      isAvailable: true,
      maxRequests: 5
    },
    mealPlanning: {
      isAvailable: false
    },
    documentAnalysis: {
      isAvailable: true,
      maxRequests: 3
    }
    // other feature configs...
  },
  'tier2': {
    aiAssistant: { 
      isAvailable: true, 
      maxRequests: 500,
      maxTokens: 500000
    },
    workoutRecommendations: { 
      isAvailable: true,
      maxRequests: 30
    },
    financialPlanning: {
      isAvailable: true,
      maxRequests: 50
    },
    careerGuidance: {
      isAvailable: true,
      maxRequests: 20
    },
    mealPlanning: {
      isAvailable: true,
      maxRequests: 20
    },
    documentAnalysis: {
      isAvailable: true,
      maxRequests: 10
    }
    // other feature configs...
  },
  'tier3': {
    aiAssistant: { 
      isAvailable: true, 
      maxRequests: null, // unlimited
      maxTokens: null    // unlimited
    },
    workoutRecommendations: { 
      isAvailable: true,
      maxRequests: null  // unlimited
    },
    financialPlanning: {
      isAvailable: true,
      maxRequests: null  // unlimited
    },
    careerGuidance: {
      isAvailable: true,
      maxRequests: null  // unlimited
    },
    mealPlanning: {
      isAvailable: true,
      maxRequests: null  // unlimited
    },
    documentAnalysis: {
      isAvailable: true,
      maxRequests: null  // unlimited
    }
    // other feature configs...
  },
  // family plans would be defined here...
};

class TierConfigService {
  private cache: NodeCache;
  
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache tier config for 1 hour
  }
  
  /**
   * Get the configuration for a specific tier
   */
  getTierConfig(tier: string): TierConfig {
    const cacheKey = `tier_config:${tier}`;
    let config = this.cache.get<TierConfig>(cacheKey);
    
    if (!config) {
      config = tierConfigs[tier] || tierConfigs['free']; // Default to free tier
      this.cache.set(cacheKey, config);
    }
    
    return config;
  }
  
  /**
   * Get feature configuration for a specific tier
   */
  getFeatureConfig(tier: string, feature: keyof TierConfig): TierFeatures | null {
    const config = this.getTierConfig(tier);
    return config[feature] || null;
  }
  
  /**
   * Check if a feature is available for a specific tier
   */
  isFeatureAvailable(tier: string, feature: keyof TierConfig): boolean {
    const featureConfig = this.getFeatureConfig(tier, feature);
    return !!featureConfig?.isAvailable;
  }
  
  /**
   * Get the request limit for a feature on a specific tier
   */
  getRequestLimit(tier: string, feature: keyof TierConfig): number | null {
    const featureConfig = this.getFeatureConfig(tier, feature);
    return featureConfig?.maxRequests ?? null;
  }
  
  /**
   * Get the token limit for a feature on a specific tier
   */
  getTokenLimit(tier: string, feature: keyof TierConfig): number | null {
    const featureConfig = this.getFeatureConfig(tier, feature);
    return featureConfig?.maxTokens ?? null;
  }
  
  /**
   * Get all available features for a tier
   */
  getAvailableFeatures(tier: string): string[] {
    const config = this.getTierConfig(tier);
    return Object.entries(config)
      .filter(([_, featureConfig]) => featureConfig.isAvailable)
      .map(([feature, _]) => feature);
  }
  
  /**
   * Get minimum tier where a feature is available
   */
  getMinimumTierForFeature(feature: keyof TierConfig): string {
    const tiers = ['free', 'tier1', 'tier2', 'tier3'];
    
    for (const tier of tiers) {
      if (this.isFeatureAvailable(tier, feature)) {
        return tier;
      }
    }
    
    return 'tier3'; // Default to highest tier if not found
  }
  
  /**
   * Get the next higher tier from current tier
   */
  getNextTierUp(currentTier: string): string | null {
    const tiers = ['free', 'tier1', 'tier2', 'tier3'];
    const currentIndex = tiers.indexOf(currentTier);
    
    if (currentIndex < 0 || currentIndex >= tiers.length - 1) {
      return null; // Already at highest tier or unknown tier
    }
    
    return tiers[currentIndex + 1];
  }
}

export const tierConfigService = new TierConfigService();
export default tierConfigService;
```

### 4. API Usage Tracking Service

Create a service to track and manage API usage:

```typescript
// server/services/api-usage-service.ts

import { db } from '../db';
import NodeCache from 'node-cache';
import { 
  apiUsageRecords, 
  apiUsageSummary, 
  InsertApiUsageRecord 
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';

interface DailyUsage {
  requestCount: number;
  tokenCount: number;
  lastRequestTime: Date;
}

class ApiUsageService {
  private cache: NodeCache;
  
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL
  }
  
  /**
   * Track usage of a feature
   */
  async trackUsage(
    userId: number, 
    feature: string, 
    requestCount: number = 1, 
    tokenCount: number = 0
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const cacheKey = `${userId}:${feature}:${today}`;
    
    // Update in-memory cache
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
    try {
      // Check if record exists
      const existingRecord = await db.select()
        .from(apiUsageRecords)
        .where(
          and(
            eq(apiUsageRecords.userId, userId),
            eq(apiUsageRecords.feature, feature),
            eq(apiUsageRecords.date, today)
          )
        )
        .limit(1);
      
      if (existingRecord.length === 0) {
        // Create new record
        await db.insert(apiUsageRecords).values({
          userId,
          feature,
          date: today,
          requestCount,
          tokenCount: tokenCount || null,
        });
      } else {
        // Update existing record
        await db.update(apiUsageRecords)
          .set({
            requestCount: existingRecord[0].requestCount + requestCount,
            tokenCount: (existingRecord[0].tokenCount || 0) + tokenCount,
            updatedAt: new Date()
          })
          .where(
            and(
              eq(apiUsageRecords.userId, userId),
              eq(apiUsageRecords.feature, feature),
              eq(apiUsageRecords.date, today)
            )
          );
      }
    } catch (error) {
      console.error('Error tracking API usage:', error);
      // Continue even if database update fails - we have the cache as backup
    }
  }
  
  /**
   * Get usage for a specific feature on a specific date
   */
  async getUsage(
    userId: number, 
    feature: string, 
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<DailyUsage> {
    const cacheKey = `${userId}:${feature}:${date}`;
    
    // Try cache first
    let usage = this.cache.get<DailyUsage>(cacheKey);
    if (usage) return usage;
    
    // Fallback to database
    try {
      const records = await db.select()
        .from(apiUsageRecords)
        .where(
          and(
            eq(apiUsageRecords.userId, userId),
            eq(apiUsageRecords.feature, feature),
            eq(apiUsageRecords.date, date)
          )
        )
        .limit(1);
      
      if (records.length === 0) {
        usage = {
          requestCount: 0,
          tokenCount: 0,
          lastRequestTime: new Date(0) // Beginning of epoch
        };
      } else {
        usage = {
          requestCount: records[0].requestCount,
          tokenCount: records[0].tokenCount || 0,
          lastRequestTime: records[0].updatedAt
        };
      }
      
      this.cache.set(cacheKey, usage);
      return usage;
    } catch (error) {
      console.error('Error fetching API usage:', error);
      // Return empty usage if database query fails
      return {
        requestCount: 0,
        tokenCount: 0,
        lastRequestTime: new Date(0)
      };
    }
  }
  
  /**
   * Check if a user has reached their limit for a feature
   */
  async hasReachedLimit(
    userId: number,
    feature: string,
    limit: number | null
  ): Promise<boolean> {
    // If no limit, user hasn't reached it
    if (limit === null) return false;
    
    const usage = await this.getUsage(userId, feature);
    return usage.requestCount >= limit;
  }
  
  /**
   * Get daily summary of all API usage for a user
   */
  async getDailySummary(
    userId: number,
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<Record<string, DailyUsage>> {
    try {
      const records = await db.select()
        .from(apiUsageRecords)
        .where(
          and(
            eq(apiUsageRecords.userId, userId),
            eq(apiUsageRecords.date, date)
          )
        );
      
      const summary: Record<string, DailyUsage> = {};
      
      for (const record of records) {
        summary[record.feature] = {
          requestCount: record.requestCount,
          tokenCount: record.tokenCount || 0,
          lastRequestTime: record.updatedAt
        };
      }
      
      return summary;
    } catch (error) {
      console.error('Error fetching API usage summary:', error);
      return {};
    }
  }
  
  /**
   * Generate and store monthly summary - intended to be called by a scheduled job
   */
  async generateMonthlySummary(month: string = this.getCurrentMonth()): Promise<void> {
    try {
      // Get all records for the month
      const records = await db.select()
        .from(apiUsageRecords)
        .where(apiUsageRecords.date.like(`${month}%`));
      
      // Group by user and feature
      const summaries: Record<string, { userId: number, feature: string, requests: number, tokens: number }> = {};
      
      for (const record of records) {
        const key = `${record.userId}:${record.feature}`;
        
        if (!summaries[key]) {
          summaries[key] = {
            userId: record.userId,
            feature: record.feature,
            requests: 0,
            tokens: 0
          };
        }
        
        summaries[key].requests += record.requestCount;
        summaries[key].tokens += record.tokenCount || 0;
      }
      
      // Store summaries
      for (const key in summaries) {
        const summary = summaries[key];
        
        // Check if summary exists
        const existingSummary = await db.select()
          .from(apiUsageSummary)
          .where(
            and(
              eq(apiUsageSummary.userId, summary.userId),
              eq(apiUsageSummary.feature, summary.feature),
              eq(apiUsageSummary.month, month)
            )
          )
          .limit(1);
        
        if (existingSummary.length === 0) {
          // Insert new summary
          await db.insert(apiUsageSummary).values({
            userId: summary.userId,
            feature: summary.feature,
            month,
            totalRequests: summary.requests,
            totalTokens: summary.tokens
          });
        } else {
          // Update existing summary
          await db.update(apiUsageSummary)
            .set({
              totalRequests: summary.requests,
              totalTokens: summary.tokens
            })
            .where(
              and(
                eq(apiUsageSummary.userId, summary.userId),
                eq(apiUsageSummary.feature, summary.feature),
                eq(apiUsageSummary.month, month)
              )
            );
        }
      }
    } catch (error) {
      console.error('Error generating monthly summary:', error);
    }
  }
  
  /**
   * Get the current month in YYYY-MM format
   */
  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
}

export const apiUsageService = new ApiUsageService();
export default apiUsageService;
```

### 5. Token Counting Utility

Add a utility to count tokens for text-based APIs:

```typescript
// server/utils/token-counter.ts

// Use tiktoken or gpt-3-encoder for more accurate token counting
// For now, we'll use a simple approximation
export function estimateTokensFromText(text: string): number {
  // OpenAI GPT models use ~4 chars per token on average
  return Math.ceil(text.length / 4);
}

export function estimateTokensForChatRequest(messages: any[]): number {
  let tokenCount = 0;
  
  for (const message of messages) {
    // Count tokens in message content
    if (typeof message.content === 'string') {
      tokenCount += estimateTokensFromText(message.content);
    } else if (Array.isArray(message.content)) {
      // Handle multi-modal messages (text + images)
      for (const part of message.content) {
        if (typeof part === 'string' || part.type === 'text') {
          tokenCount += estimateTokensFromText(part.text || part);
        } else if (part.type === 'image_url') {
          // Estimate tokens for images (rough estimate)
          tokenCount += 1000; // Placeholder value - actual sizing depends on image
        }
      }
    }
    
    // Add token count for message structure
    tokenCount += 4; // Approximation for message metadata
  }
  
  return tokenCount;
}
```

### 6. Subscription Service

Create a service to manage user subscriptions:

```typescript
// server/services/subscription-service.ts

import { db } from '../db';
import { userSubscriptions, users } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

class SubscriptionService {
  /**
   * Get the current subscription for a user
   */
  async getUserSubscription(userId: number) {
    const subscription = await db.select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(userSubscriptions.createdAt, 'desc')
      .limit(1);
    
    return subscription.length > 0 ? subscription[0] : null;
  }
  
  /**
   * Get the current subscription tier for a user
   */
  async getUserTier(userId: number): Promise<string> {
    const subscription = await this.getUserSubscription(userId);
    
    // If no subscription or subscription ended, return free tier
    if (!subscription || (subscription.endDate && new Date(subscription.endDate) < new Date())) {
      return 'free';
    }
    
    // If in trial period, return tier
    if (subscription.trialEndsAt && new Date(subscription.trialEndsAt) > new Date()) {
      return subscription.tier;
    }
    
    // If subscription is not active, return free tier
    if (subscription.status !== 'active') {
      return 'free';
    }
    
    // Return the subscription tier
    return subscription.tier;
  }
  
  /**
   * Create a new subscription for a user
   */
  async createSubscription(
    userId: number, 
    tier: string, 
    trialDays: number = 0,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
  ) {
    const startDate = new Date();
    let trialEndsAt = null;
    
    if (trialDays > 0) {
      trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);
    }
    
    return await db.insert(userSubscriptions)
      .values({
        userId,
        tier,
        status: 'active',
        startDate,
        trialEndsAt,
        stripeCustomerId,
        stripeSubscriptionId
      })
      .returning();
  }
  
  /**
   * Update a user's subscription
   */
  async updateSubscription(userId: number, data: Partial<typeof userSubscriptions.$inferInsert>) {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription) {
      return null;
    }
    
    await db.update(userSubscriptions)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(userSubscriptions.id, subscription.id));
      
    return await this.getUserSubscription(userId);
  }
  
  /**
   * Cancel a user's subscription
   */
  async cancelSubscription(userId: number) {
    return await this.updateSubscription(userId, {
      status: 'cancelled',
      endDate: new Date()
    });
  }
  
  /**
   * Check if a user is in a trial period
   */
  async isInTrial(userId: number): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription || !subscription.trialEndsAt) {
      return false;
    }
    
    return new Date(subscription.trialEndsAt) > new Date();
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
```

### 7. Throttling Middleware

Create middleware to enforce tier limits:

```typescript
// server/middleware/api-throttling-middleware.ts

import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../auth/auth-middleware";
import { subscriptionService } from "../services/subscription-service";
import { tierConfigService } from "../services/tier-config-service";
import { apiUsageService } from "../services/api-usage-service";

interface ThrottleOptions {
  feature: string;
  errorMessage?: string;
}

/**
 * Middleware to throttle API requests based on user subscription tier
 */
export function apiThrottleMiddleware(options: ThrottleOptions) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { feature } = options;
    
    // Skip throttling for system or admin users
    if (!req.user || req.user.role === 'admin' || req.user.role === 'system') {
      return next();
    }
    
    try {
      // Get user's subscription tier
      const userTier = await subscriptionService.getUserTier(req.user.id);
      
      // Get feature config for the user's tier
      const featureConfig = tierConfigService.getFeatureConfig(userTier, feature as any);
      
      // If feature not available for this tier
      if (!featureConfig || !featureConfig.isAvailable) {
        const minimumTier = tierConfigService.getMinimumTierForFeature(feature as any);
        
        return res.status(403).json({
          success: false,
          error: 'feature_not_available',
          message: options.errorMessage || `This feature is not available on your current plan.`,
          details: {
            currentTier: userTier,
            requiredTier: minimumTier
          }
        });
      }
      
      // If no request limits, allow the request
      if (featureConfig.maxRequests === null) {
        // Attach tracking function to response locals for controllers to use
        res.locals.trackApiUsage = (requestCount = 1, tokenCount = 0) => {
          return apiUsageService.trackUsage(req.user!.id, feature, requestCount, tokenCount);
        };
        
        return next();
      }
      
      // Check current usage
      const usage = await apiUsageService.getUsage(req.user.id, feature);
      
      // Check if user has exceeded request limits
      if (usage.requestCount >= featureConfig.maxRequests) {
        const nextTier = tierConfigService.getNextTierUp(userTier);
        
        return res.status(429).json({
          success: false,
          error: 'rate_limit_exceeded',
          message: options.errorMessage || `You've reached your daily limit for this feature.`,
          details: {
            currentUsage: usage.requestCount,
            limit: featureConfig.maxRequests,
            resetsAt: getNextResetTime(),
            currentTier: userTier,
            nextTier
          }
        });
      }
      
      // Check if user is in cooldown period
      if (featureConfig.cooldownPeriod && isInCooldown(usage.lastRequestTime, featureConfig.cooldownPeriod)) {
        const cooldownRemaining = getCooldownRemaining(usage.lastRequestTime, featureConfig.cooldownPeriod);
        
        return res.status(429).json({
          success: false,
          error: 'cooldown_period',
          message: `Please wait before making another request.`,
          details: {
            remainingSeconds: Math.ceil(cooldownRemaining / 1000),
            totalCooldownSeconds: Math.ceil(featureConfig.cooldownPeriod / 1000)
          }
        });
      }
      
      // Attach tracking function to response locals for controllers to use
      res.locals.trackApiUsage = (requestCount = 1, tokenCount = 0) => {
        return apiUsageService.trackUsage(req.user!.id, feature, requestCount, tokenCount);
      };
      
      // Continue to the next middleware
      next();
    } catch (error) {
      console.error('API throttling error:', error);
      // In case of error, allow the request to proceed
      next();
    }
  };
}

/**
 * Check if a request is in the cooldown period
 */
function isInCooldown(lastRequestTime: Date, cooldownPeriod: number): boolean {
  const now = new Date();
  const cooldownEnds = new Date(lastRequestTime.getTime() + cooldownPeriod);
  return now < cooldownEnds;
}

/**
 * Get the remaining cooldown time in milliseconds
 */
function getCooldownRemaining(lastRequestTime: Date, cooldownPeriod: number): number {
  const now = new Date();
  const cooldownEnds = new Date(lastRequestTime.getTime() + cooldownPeriod);
  return Math.max(0, cooldownEnds.getTime() - now.getTime());
}

/**
 * Get the time when daily limits reset (midnight in user's timezone, simplified to UTC)
 */
function getNextResetTime(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}
```

### 8. Integrate with OpenAI Client

Modify the existing OpenAI client to use the throttling system:

```typescript
// server/openai.ts

import OpenAI from "openai";
import { Response } from "express";
import { estimateTokensForChatRequest } from "./utils/token-counter";

// Initialize OpenAI client with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const openaiClient = openai;

/**
 * Generates an AI response using OpenAI's chat completions API with usage tracking
 */
export async function generateResponse(
  prompt: string,
  systemPrompt: string,
  previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [],
  temperature: number = 0.7,
  jsonResponse: boolean = false,
  res?: Response // For tracking usage
): Promise<string> {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...previousMessages,
      { role: "user", content: prompt }
    ] as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;

    // Estimate tokens for request
    const estimatedPromptTokens = estimateTokensForChatRequest(messages);

    const options: any = {
      model: "gpt-4o",
      messages,
      temperature,
      max_tokens: 1000,
    };

    if (jsonResponse) {
      options.response_format = { type: "json_object" };
    }

    const response = await openai.chat.completions.create(options);
    
    // Track usage if res is provided
    if (res && res.locals.trackApiUsage) {
      const promptTokens = response.usage?.prompt_tokens || estimatedPromptTokens;
      const completionTokens = response.usage?.completion_tokens || 0;
      const totalTokens = promptTokens + completionTokens;
      
      await res.locals.trackApiUsage(1, totalTokens);
    }

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI generateResponse error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
    throw new Error("Failed to generate response: unknown error");
  }
}

// Update all other OpenAI methods to include the res parameter and usage tracking
// For example:

/**
 * Analyzes the sentiment of the provided text with usage tracking
 */
export async function analyzeSentiment(
  text: string,
  res?: Response // For tracking usage
): Promise<{
  rating: number,
  confidence: number
}> {
  try {
    // Estimate tokens for request
    const estimatedPromptTokens = estimateTokensForChatRequest([
      {
        role: "system",
        content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }"
      },
      {
        role: "user",
        content: text
      }
    ]);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Track usage if res is provided
    if (res && res.locals.trackApiUsage) {
      const promptTokens = response.usage?.prompt_tokens || estimatedPromptTokens;
      const completionTokens = response.usage?.completion_tokens || 0;
      const totalTokens = promptTokens + completionTokens;
      
      await res.locals.trackApiUsage(1, totalTokens);
    }

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating))),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    console.error("OpenAI analyzeSentiment error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze sentiment: ${error.message}`);
    }
    throw new Error("Failed to analyze sentiment: unknown error");
  }
}

// Continue updating all other methods...
```

### 9. Route Integration

Apply the throttling middleware to API routes:

```typescript
// server/routes/api-routes.ts

import { Router } from "express";
import { apiThrottleMiddleware } from "../middleware/api-throttling-middleware";
import { authenticateJWT } from "../auth/auth-middleware";
import * as openaiController from "../controllers/openai-controller";
import * as fitnessController from "../controllers/fitness-controller";
import * as nutritionController from "../controllers/nutrition-controller";
// Other imports...

const router = Router();

// OpenAI chat endpoint with throttling
router.post(
  "/chat",
  authenticateJWT,
  apiThrottleMiddleware({
    feature: "aiAssistant",
    errorMessage: "You've reached your daily limit for AI chat interactions."
  }),
  openaiController.handleChatMessage
);

// Workout recommendations with throttling
router.post(
  "/fitness/workout-recommendations",
  authenticateJWT,
  apiThrottleMiddleware({
    feature: "workoutRecommendations",
    errorMessage: "You've reached your daily limit for workout recommendations."
  }),
  fitnessController.generateWorkoutPlan
);

// Nutrition analysis with throttling
router.post(
  "/nutrition/analyze",
  authenticateJWT,
  apiThrottleMiddleware({
    feature: "mealPlanning",
    errorMessage: "You've reached your daily limit for meal analysis."
  }),
  nutritionController.analyzeMeal
);

// Continue adding routes with appropriate throttling...

export default router;
```

### 10. Tracking API Usage in Controllers

Update controllers to track API usage:

```typescript
// server/controllers/openai-controller.ts

import { Request, Response } from "express";
import { generateResponse } from "../openai";
import { AuthenticatedRequest } from "../auth/auth-middleware";
import { z } from "zod";

// Chat message handler
export async function handleChatMessage(req: AuthenticatedRequest, res: Response) {
  try {
    const schema = z.object({
      message: z.string().min(1),
      systemPrompt: z.string().optional(),
      previousMessages: z.array(
        z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string()
        })
      ).optional(),
      temperature: z.number().min(0).max(1).optional(),
      jsonResponse: z.boolean().optional()
    });

    const data = schema.parse(req.body);
    
    const response = await generateResponse(
      data.message,
      data.systemPrompt || "You are a helpful assistant.",
      data.previousMessages || [],
      data.temperature || 0.7,
      data.jsonResponse || false,
      res // Pass the response object for usage tracking
    );

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Chat message error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to process message",
    });
  }
}

// Add other controller methods...
```

### 11. Usage Dashboard API

Create endpoints for users to view their API usage:

```typescript
// server/routes/account-routes.ts

import { Router } from "express";
import { authenticateJWT } from "../auth/auth-middleware";
import { AuthenticatedRequest } from "../auth/auth-middleware";
import { apiUsageService } from "../services/api-usage-service";
import { tierConfigService } from "../services/tier-config-service";
import { subscriptionService } from "../services/subscription-service";

const router = Router();

// Get user's API usage
router.get(
  "/api-usage",
  authenticateJWT,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const userTier = await subscriptionService.getUserTier(userId);
      const tierConfig = tierConfigService.getTierConfig(userTier);
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Get usage for key features
      const features = Object.keys(tierConfig);
      const usageData = await Promise.all(
        features.map(async (feature) => {
          const featureConfig = tierConfig[feature as keyof typeof tierConfig];
          
          if (!featureConfig.isAvailable) {
            return {
              feature,
              isAvailable: false,
              current: 0,
              limit: 0,
              percentage: 0
            };
          }
          
          const usage = await apiUsageService.getUsage(userId, feature, today);
          
          return {
            feature,
            isAvailable: true,
            current: usage.requestCount,
            limit: featureConfig.maxRequests || null,
            percentage: featureConfig.maxRequests
              ? Math.round((usage.requestCount / featureConfig.maxRequests) * 100)
              : 0
          };
        })
      );
      
      // Filter to only include available features
      const availableUsage = usageData.filter(item => item.isAvailable);
      
      res.json({
        success: true,
        tier: userTier,
        usageData: availableUsage,
        resetTime: getNextDayISOString()
      });
    } catch (error) {
      console.error('Error fetching API usage:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch usage data'
      });
    }
  }
);

// Helper function to get the next day in ISO format
function getNextDayISOString(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

export default router;
```

### 12. System Initialization

Set up the system during application startup:

```typescript
// server/index.ts (add to existing startup code)

import { apiUsageService } from "./services/api-usage-service";
import { tierConfigService } from "./services/tier-config-service";
import { subscriptionService } from "./services/subscription-service";

async function startServer() {
  // ... existing code
  
  // Ensure API usage service is initialized
  console.log("Initializing API throttling services...");
  
  // Initialize services - they're singleton instances, so this just ensures they're loaded
  const apiUsage = apiUsageService;
  const tierConfig = tierConfigService;
  const subscription = subscriptionService;
  
  // ... rest of server initialization
}
```

### 13. Monthly Cleanup Job

Create a scheduled task to compile monthly summaries and clean up old records:

```typescript
// server/tasks/monthly-cleanup.ts

import { CronJob } from 'cron';
import { apiUsageService } from '../services/api-usage-service';

// Run at midnight on the first day of each month
const job = new CronJob('0 0 1 * *', async () => {
  try {
    console.log('Running monthly API usage cleanup...');
    
    // Get last month in YYYY-MM format
    const now = new Date();
    now.setDate(1); // First day of current month
    now.setHours(0, 0, 0, 0);
    
    // Go back one day to get last day of previous month
    now.setDate(0);
    
    const lastMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Generate summary for last month
    await apiUsageService.generateMonthlySummary(lastMonth);
    
    console.log(`Monthly API usage summary generated for ${lastMonth}`);
  } catch (error) {
    console.error('Error in monthly cleanup job:', error);
  }
});

export function startMonthlyCleanupJob() {
  job.start();
  console.log('Monthly API usage cleanup job scheduled');
}
```

Add task initialization to server startup:

```typescript
// server/index.ts

import { startMonthlyCleanupJob } from './tasks/monthly-cleanup';

async function startServer() {
  // ... existing code
  
  // Start scheduled tasks
  startMonthlyCleanupJob();
  
  // ... rest of server initialization
}
```

## Frontend Integration

### 1. Usage Dashboard Component

Create a component for users to view their API usage:

```tsx
// client/src/components/account/api-usage-dashboard.tsx

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface UsageItem {
  feature: string;
  current: number;
  limit: number | null;
  percentage: number;
  isAvailable: boolean;
}

interface ApiUsageData {
  tier: string;
  usageData: UsageItem[];
  resetTime: string;
}

const featureNames: Record<string, string> = {
  aiAssistant: 'AI Assistant',
  workoutRecommendations: 'Workout Recommendations',
  financialPlanning: 'Financial Planning',
  careerGuidance: 'Career Guidance',
  mealPlanning: 'Meal Planning',
  documentAnalysis: 'Document Analysis',
};

export default function ApiUsageDashboard() {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<ApiUsageData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/account/api-usage');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUsageData(data);
          } else {
            throw new Error(data.error || 'Failed to fetch usage data');
          }
        } else {
          throw new Error('Failed to fetch usage data');
        }
      } catch (error) {
        console.error('Error fetching API usage:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load usage data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [toast]);

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const formatTierName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'tier1': return 'Personal Growth';
      case 'tier2': return 'Life Navigator';
      case 'tier3': return 'Fundamenta Complete';
      default: return tier;
    }
  };

  const getFeatureName = (feature: string) => {
    return featureNames[feature] || feature;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Usage Dashboard</CardTitle>
        <CardDescription>
          {usageData ? (
            <>
              Your current plan: <span className="font-medium">{formatTierName(usageData.tier)}</span>
              <br />
              Limits reset at {formatTime(usageData.resetTime)}
            </>
          ) : (
            <Skeleton className="h-6 w-48" />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {usageData?.usageData.map((item) => (
              <div key={item.feature} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{getFeatureName(item.feature)}</span>
                  <span>
                    {item.current} / {item.limit === null ? '∞' : item.limit}
                  </span>
                </div>
                <Progress 
                  value={item.limit === null ? 0 : item.percentage} 
                  className="h-2" 
                />
              </div>
            ))}
            
            {(!usageData?.usageData.length) && (
              <div className="text-center py-6 text-muted-foreground">
                No API usage data available. Start using features to see your usage here.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 2. Error Handling for Rate Limits

Add common error handling for rate limit errors:

```typescript
// client/src/lib/api-error-handler.ts

import { useToast } from '@/hooks/use-toast';

interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: {
    currentTier?: string;
    requiredTier?: string;
    nextTier?: string;
    currentUsage?: number;
    limit?: number;
    resetsAt?: string;
    remainingSeconds?: number;
  };
}

export function useApiErrorHandler() {
  const { toast } = useToast();
  
  const handleApiError = async (response: Response) => {
    try {
      const data: ApiErrorResponse = await response.json();
      
      // Handle rate limit error
      if (response.status === 429) {
        if (data.error === 'rate_limit_exceeded') {
          toast({
            title: 'Usage Limit Reached',
            description: `${data.message} Your limit will reset at ${new Date(data.details?.resetsAt || '').toLocaleString()}.`,
            variant: 'destructive',
          });
        } else if (data.error === 'cooldown_period') {
          toast({
            title: 'Please Wait',
            description: `${data.message} Try again in ${data.details?.remainingSeconds} seconds.`,
            variant: 'destructive',
          });
        }
        return data;
      }
      
      // Handle feature not available error
      if (response.status === 403 && data.error === 'feature_not_available') {
        toast({
          title: 'Feature Not Available',
          description: `${data.message} This feature requires the ${formatTierName(data.details?.requiredTier || '')} plan.`,
          variant: 'destructive',
        });
        return data;
      }
      
      // Handle generic error
      toast({
        title: 'Error',
        description: data.message || 'An error occurred',
        variant: 'destructive',
      });
      
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process the request',
        variant: 'destructive',
      });
      
      return { success: false, error: 'unknown_error', message: 'Unknown error' };
    }
  };
  
  return { handleApiError };
}

function formatTierName(tier: string): string {
  switch (tier) {
    case 'free': return 'Free';
    case 'tier1': return 'Personal Growth';
    case 'tier2': return 'Life Navigator';
    case 'tier3': return 'Fundamenta Complete';
    default: return tier;
  }
}
```

## Implementation Schedule

1. **Phase 1: Schema & Core Services (Week 1)**
   - Implement database schema extensions
   - Create Tier Configuration Service
   - Develop Subscription Service
   - Add API Usage Tracking Service

2. **Phase 2: Middleware & Throttling (Week 2)**
   - Implement throttling middleware
   - Add token counting utilities
   - Integrate with OpenAI client
   - Add route throttling

3. **Phase 3: Usage Dashboard & Error Handling (Week 3)**
   - Create API usage dashboard API
   - Implement usage dashboard component
   - Add error handling for rate limits
   - Implement monthly cleanup job

4. **Phase 4: Testing & Deployment (Week 4)**
   - Conduct thorough integration testing
   - Review performance impact
   - Deploy to production with monitoring
   - Document system for administrators

## Migration Considerations

1. **Existing Users**
   - All existing users should be assigned to 'free' tier initially
   - Consider offering a grace period before enforcement

2. **Database Migration**
   - Run the schema extensions as a separate migration
   - Verify data integrity before full deployment

3. **API Client Updates**
   - Update all API clients to handle rate limit responses
   - Ensure proper error handling throughout the application

4. **Monitoring**
   - Add monitoring for rate limit events
   - Track user frustration metrics (repeated hitting of limits)
   - Monitor system performance impact

## Testing Strategy

1. **Unit Tests**
   - Test tier configuration service
   - Test API usage tracking service
   - Test token counting utilities

2. **Integration Tests**
   - Test middleware with various subscription tiers
   - Verify proper usage tracking
   - Test error responses

3. **Load Tests**
   - Test performance under high load
   - Verify system stability when many users hit limits

4. **User Acceptance Testing**
   - Test upgrade flow when limits are reached
   - Verify user experience across different tiers