# API Throttling Implementation Blueprint with Payment Integration

This document outlines the technical implementation plan for API throttling in Fundamenta based on user subscription tiers, including Stripe payment processing and Plaid financial data integration. This blueprint is tailored to work with the existing codebase architecture and patterns.

## System Overview

The API throttling system will control access to external APIs (OpenAI, Spoonacular, Plaid, etc.) based on user subscription levels. We will use a server-side middleware approach that:

1. Identifies the user's subscription tier
2. Tracks API usage metrics (requests, tokens, specific operations)
3. Enforces appropriate limits based on tier
4. Handles graceful degradation when limits are reached
5. Provides feedback to users about their usage and limits
6. Manages subscription state based on Stripe payment events
7. Controls access to financial data retrieved via Plaid

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
         ┌────────────────────────┐        ┌─────────▼────────────┐
         │ Subscription Service   │◀───────┤ API Client           │
         │ (Stripe Integration)   │        │ (OpenAI, Plaid, etc.) │
         └────────────────────────┘        └──────────────────────┘
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
  currentPeriodStart: timestamp("current_period_start"), // billing period start date
  currentPeriodEnd: timestamp("current_period_end"), // billing period end date
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false), // subscription will be canceled at period end
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
    feature: text("feature").notNull(), // e.g. "aiAssistant", "nutrition", "fitness", "financialTracking"
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

// Payment methods table for Stripe
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  stripePaymentMethodId: text("stripe_payment_method_id").notNull(),
  type: text("type").notNull(), // "card", "bank_account", etc.
  last4: text("last4"), // Last 4 digits of card/account
  expiryMonth: integer("expiry_month"), // For cards
  expiryYear: integer("expiry_year"), // For cards
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Invoice records for subscription history
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  stripeInvoiceId: text("stripe_invoice_id").notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull(), // "paid", "open", "void", etc.
  invoiceDate: timestamp("invoice_date").notNull(),
  paidAt: timestamp("paid_at"),
  hostedInvoiceUrl: text("hosted_invoice_url"),
  invoicePdf: text("invoice_pdf"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Plaid integration tables
export const plaidItems = pgTable("plaid_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  plaidItemId: text("plaid_item_id").notNull(),
  plaidAccessToken: text("plaid_access_token").notNull(),
  institutionId: text("institution_id").notNull(),
  institutionName: text("institution_name").notNull(),
  status: text("status").notNull().default("active"), // "active", "error", etc.
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  error: jsonb("error"), // Store Plaid errors if any
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const plaidAccounts = pgTable("plaid_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  plaidItemId: integer("plaid_item_id").notNull().references(() => plaidItems.id),
  plaidAccountId: text("plaid_account_id").notNull(),
  name: text("name").notNull(),
  mask: text("mask"), // Last 4 digits of account
  type: text("type").notNull(), // "depository", "credit", etc.
  subtype: text("subtype"), // "checking", "savings", "credit card", etc.
  currentBalance: real("current_balance"),
  availableBalance: real("available_balance"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const plaidTransactions = pgTable("plaid_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountId: integer("account_id").notNull().references(() => plaidAccounts.id),
  plaidTransactionId: text("plaid_transaction_id").notNull().unique(),
  amount: real("amount").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  name: text("name").notNull(),
  merchantName: text("merchant_name"),
  category: text("category"),
  subCategories: text("sub_categories").array(),
  pending: boolean("pending").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

Then add the corresponding Zod schemas and TypeScript types for all tables.

### 2. Tier Configuration Service

Extend the tier configuration service to include financial tracking features:

```typescript
// server/services/tier-config-service.ts

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
    financialTracking: {
      isAvailable: false // No Plaid integration for free tier
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
    financialPlanning: {
      isAvailable: true,
      maxRequests: 20
    },
    financialTracking: {
      isAvailable: true,
      maxRequests: 5, // 5 daily transactions refresh calls
      maxAccounts: 2 // Limited to 2 financial accounts
    },
    // other feature configs...
  },
  'tier2': {
    // ...existing features
    financialTracking: {
      isAvailable: true,
      maxRequests: 20, // 20 daily transactions refresh calls
      maxAccounts: 5 // Up to 5 financial accounts
    },
  },
  'tier3': {
    // ...existing features
    financialTracking: {
      isAvailable: true,
      maxRequests: null, // Unlimited daily transactions refresh calls
      maxAccounts: null // Unlimited financial accounts
    },
  },
};
```

### 3. Subscription Service with Stripe Integration

Extend the subscription service to handle Stripe payments:

```typescript
// server/services/subscription-service.ts

import { db } from '../db';
import { userSubscriptions, users, invoices } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Tier to Stripe price mapping
const TIER_PRICE_MAP: Record<string, string> = {
  'tier1': process.env.STRIPE_TIER1_PRICE_ID || '',
  'tier2': process.env.STRIPE_TIER2_PRICE_ID || '',
  'tier3': process.env.STRIPE_TIER3_PRICE_ID || '',
  'family_basic': process.env.STRIPE_FAMILY_BASIC_PRICE_ID || '',
  'family_plus': process.env.STRIPE_FAMILY_PLUS_PRICE_ID || '',
  'family_premium': process.env.STRIPE_FAMILY_PREMIUM_PRICE_ID || '',
};

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
   * Create a Stripe customer for a user
   */
  async createStripeCustomer(userId: number, email: string, name: string): Promise<string> {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: userId.toString()
      }
    });
    
    // Update user with Stripe customer ID
    await this.updateSubscription(userId, {
      stripeCustomerId: customer.id
    });
    
    return customer.id;
  }
  
  /**
   * Create a Stripe subscription for a user
   */
  async createStripeSubscription(
    userId: number, 
    tier: string, 
    paymentMethodId: string,
    trialDays: number = 0
  ) {
    // Get user information
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!user.length) {
      throw new Error('User not found');
    }
    
    // Get or create Stripe customer
    let subscription = await this.getUserSubscription(userId);
    let customerId = subscription?.stripeCustomerId;
    
    if (!customerId) {
      customerId = await this.createStripeCustomer(userId, user[0].email, user[0].name);
    }
    
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });
    
    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    
    // Get price ID for tier
    const priceId = TIER_PRICE_MAP[tier];
    if (!priceId) {
      throw new Error(`Invalid tier: ${tier}`);
    }
    
    // Create subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: trialDays > 0 ? trialDays : undefined
    });
    
    // Update local subscription record
    const currentPeriodStart = stripeSubscription.current_period_start 
      ? new Date(stripeSubscription.current_period_start * 1000) 
      : new Date();
      
    const currentPeriodEnd = stripeSubscription.current_period_end
      ? new Date(stripeSubscription.current_period_end * 1000)
      : null;
    
    if (subscription) {
      // Update existing subscription
      await this.updateSubscription(userId, {
        tier,
        status: stripeSubscription.status,
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodStart,
        currentPeriodEnd,
        trialEndsAt: stripeSubscription.trial_end 
          ? new Date(stripeSubscription.trial_end * 1000) 
          : null
      });
    } else {
      // Create new subscription record
      await this.createSubscription(
        userId,
        tier,
        trialDays,
        customerId,
        stripeSubscription.id
      );
      
      // Update with period dates
      await this.updateSubscription(userId, {
        currentPeriodStart,
        currentPeriodEnd
      });
    }
    
    return stripeSubscription;
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
   * Cancel a user's subscription in Stripe and locally
   */
  async cancelSubscription(userId: number, cancelImmediately: boolean = false) {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return null;
    }
    
    // Cancel in Stripe
    if (cancelImmediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      
      // Update local record
      return await this.updateSubscription(userId, {
        status: 'cancelled',
        endDate: new Date()
      });
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      
      // Update local record
      return await this.updateSubscription(userId, {
        cancelAtPeriodEnd: true,
        endDate: subscription.currentPeriodEnd
      });
    }
  }
  
  /**
   * Change a user's subscription tier
   */
  async changeTier(userId: number, newTier: string) {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }
    
    // Get price ID for new tier
    const priceId = TIER_PRICE_MAP[newTier];
    if (!priceId) {
      throw new Error(`Invalid tier: ${newTier}`);
    }
    
    // Update subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: priceId
      }],
      proration_behavior: 'create_prorations'
    });
    
    // Update local record
    return await this.updateSubscription(userId, {
      tier: newTier
    });
  }
  
  /**
   * Handle Stripe webhook event for subscription updates
   */
  async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    // Find user by Stripe customer ID
    const subscriptions = await db.select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.stripeCustomerId, stripeSubscription.customer as string))
      .orderBy(userSubscriptions.createdAt, 'desc')
      .limit(1);
    
    if (!subscriptions.length) {
      console.error(`No subscription found for Stripe customer: ${stripeSubscription.customer}`);
      return;
    }
    
    const userId = subscriptions[0].userId;
    
    // Map Stripe status to our status
    let status = 'active';
    if (stripeSubscription.status === 'canceled' || stripeSubscription.status === 'unpaid') {
      status = 'cancelled';
    } else if (stripeSubscription.status === 'past_due') {
      status = 'past_due';
    }
    
    // Update local subscription
    await this.updateSubscription(userId, {
      status,
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      trialEndsAt: stripeSubscription.trial_end 
        ? new Date(stripeSubscription.trial_end * 1000) 
        : null,
      endDate: status === 'cancelled' ? new Date() : null
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

### 4. Plaid Integration Service

Create a service to manage Plaid integration:

```typescript
// server/services/plaid-service.ts

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { db } from '../db';
import { plaidItems, plaidAccounts, plaidTransactions, apiUsageRecords } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { subscriptionService } from './subscription-service';
import { tierConfigService } from './tier-config-service';
import { apiUsageService } from './api-usage-service';

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Change to development or production as needed
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

class PlaidService {
  /**
   * Create a Plaid link token for a user
   */
  async createLinkToken(userId: number, isUpdate: boolean = false, itemId?: string) {
    // First check if user can connect more accounts based on subscription tier
    if (!isUpdate) {
      const userTier = await subscriptionService.getUserTier(userId);
      const tierConfig = tierConfigService.getTierConfig(userTier);
      const financialTracking = tierConfig.financialTracking as any;
      
      if (!financialTracking || !financialTracking.isAvailable) {
        throw new Error('Financial tracking not available on your current plan');
      }
      
      // Check if user has reached account limit
      if (financialTracking.maxAccounts !== null) {
        const itemCount = await db.select({ count: count() })
          .from(plaidItems)
          .where(eq(plaidItems.userId, userId));
          
        if (itemCount[0].count >= financialTracking.maxAccounts) {
          throw new Error(`You have reached the maximum number of financial institutions (${financialTracking.maxAccounts}) for your plan`);
        }
      }
    }
    
    // Get user
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
      
    if (!user.length) {
      throw new Error('User not found');
    }
    
    // Create link token
    const request = {
      user: {
        client_user_id: userId.toString(),
      },
      client_name: 'Fundamenta',
      products: ['transactions'] as ('transactions' | 'auth')[],
      language: 'en',
      webhook: process.env.PLAID_WEBHOOK_URL,
      country_codes: ['US'] as ('US' | 'CA' | 'GB')[],
    };
    
    // If updating an existing item, add the access token
    if (isUpdate && itemId) {
      const item = await db.select()
        .from(plaidItems)
        .where(and(
          eq(plaidItems.userId, userId),
          eq(plaidItems.id, Number(itemId))
        ))
        .limit(1);
        
      if (!item.length) {
        throw new Error('Item not found');
      }
      
      request.access_token = item[0].plaidAccessToken;
    }
    
    const response = await plaidClient.linkTokenCreate(request);
    return response.data;
  }
  
  /**
   * Exchange a public token for an access token and store the item
   */
  async exchangePublicToken(userId: number, publicToken: string, institutionId: string, institutionName: string) {
    // Exchange public token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    
    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;
    
    // Store the item
    const [item] = await db.insert(plaidItems)
      .values({
        userId,
        plaidItemId: itemId,
        plaidAccessToken: accessToken,
        institutionId,
        institutionName,
        status: 'active',
        lastUpdated: new Date()
      })
      .returning();
      
    // Get accounts for the item
    await this.syncAccounts(userId, item.id);
    
    // Get initial transactions
    await this.syncTransactions(userId, item.id);
    
    return item;
  }
  
  /**
   * Sync accounts for a Plaid item
   */
  async syncAccounts(userId: number, itemId: number) {
    // Get the item
    const item = await db.select()
      .from(plaidItems)
      .where(and(
        eq(plaidItems.userId, userId),
        eq(plaidItems.id, itemId)
      ))
      .limit(1);
      
    if (!item.length) {
      throw new Error('Item not found');
    }
    
    // Get accounts from Plaid
    const response = await plaidClient.accountsGet({
      access_token: item[0].plaidAccessToken,
    });
    
    const accounts = response.data.accounts;
    
    // Track API usage
    await apiUsageService.trackUsage(userId, 'financialTracking', 1);
    
    // Update or insert accounts
    for (const account of accounts) {
      // Check if account exists
      const existingAccount = await db.select()
        .from(plaidAccounts)
        .where(and(
          eq(plaidAccounts.userId, userId),
          eq(plaidAccounts.plaidItemId, itemId),
          eq(plaidAccounts.plaidAccountId, account.account_id)
        ))
        .limit(1);
        
      if (existingAccount.length) {
        // Update existing account
        await db.update(plaidAccounts)
          .set({
            name: account.name,
            mask: account.mask,
            type: account.type,
            subtype: account.subtype,
            currentBalance: account.balances.current,
            availableBalance: account.balances.available,
            lastUpdated: new Date(),
            updatedAt: new Date()
          })
          .where(eq(plaidAccounts.id, existingAccount[0].id));
      } else {
        // Insert new account
        await db.insert(plaidAccounts)
          .values({
            userId,
            plaidItemId: itemId,
            plaidAccountId: account.account_id,
            name: account.name,
            mask: account.mask,
            type: account.type,
            subtype: account.subtype,
            currentBalance: account.balances.current,
            availableBalance: account.balances.available,
            lastUpdated: new Date()
          });
      }
    }
    
    // Update item last updated
    await db.update(plaidItems)
      .set({
        lastUpdated: new Date(),
        updatedAt: new Date()
      })
      .where(eq(plaidItems.id, itemId));
      
    // Return accounts
    return await db.select()
      .from(plaidAccounts)
      .where(and(
        eq(plaidAccounts.userId, userId),
        eq(plaidAccounts.plaidItemId, itemId)
      ));
  }
  
  /**
   * Sync transactions for a Plaid item
   */
  async syncTransactions(userId: number, itemId: number) {
    // Check tier limits
    const userTier = await subscriptionService.getUserTier(userId);
    const tierConfig = tierConfigService.getTierConfig(userTier);
    const financialTracking = tierConfig.financialTracking as any;
    
    if (!financialTracking || !financialTracking.isAvailable) {
      throw new Error('Financial tracking not available on your current plan');
    }
    
    // Check if user has reached daily request limit
    if (financialTracking.maxRequests !== null) {
      const usage = await apiUsageService.getUsage(userId, 'financialTracking');
      
      if (usage.requestCount >= financialTracking.maxRequests) {
        throw new Error(`You have reached the maximum number of financial data refreshes (${financialTracking.maxRequests}) for today`);
      }
    }
    
    // Get the item
    const item = await db.select()
      .from(plaidItems)
      .where(and(
        eq(plaidItems.userId, userId),
        eq(plaidItems.id, itemId)
      ))
      .limit(1);
      
    if (!item.length) {
      throw new Error('Item not found');
    }
    
    // Get accounts for this item
    const accounts = await db.select()
      .from(plaidAccounts)
      .where(and(
        eq(plaidAccounts.userId, userId),
        eq(plaidAccounts.plaidItemId, itemId)
      ));
      
    // Get cursor for this item (for transaction updates)
    let cursor = null;
    
    // Get transactions from Plaid
    const response = await plaidClient.transactionsSync({
      access_token: item[0].plaidAccessToken,
      cursor
    });
    
    // Track API usage
    await apiUsageService.trackUsage(userId, 'financialTracking', 1);
    
    const addedTransactions = response.data.added;
    const modifiedTransactions = response.data.modified;
    const removedTransactions = response.data.removed;
    cursor = response.data.next_cursor;
    
    // Process added and modified transactions
    for (const transaction of [...addedTransactions, ...modifiedTransactions]) {
      // Find account
      const account = accounts.find(a => a.plaidAccountId === transaction.account_id);
      if (!account) continue;
      
      // Check if transaction exists
      const existingTransaction = await db.select()
        .from(plaidTransactions)
        .where(eq(plaidTransactions.plaidTransactionId, transaction.transaction_id))
        .limit(1);
        
      if (existingTransaction.length) {
        // Update existing transaction
        await db.update(plaidTransactions)
          .set({
            amount: transaction.amount,
            date: transaction.date,
            name: transaction.name,
            merchantName: transaction.merchant_name,
            category: transaction.category ? transaction.category[0] : null,
            subCategories: transaction.category ? transaction.category.slice(1) : [],
            pending: transaction.pending,
            updatedAt: new Date()
          })
          .where(eq(plaidTransactions.id, existingTransaction[0].id));
      } else {
        // Insert new transaction
        await db.insert(plaidTransactions)
          .values({
            userId,
            accountId: account.id,
            plaidTransactionId: transaction.transaction_id,
            amount: transaction.amount,
            date: transaction.date,
            name: transaction.name,
            merchantName: transaction.merchant_name,
            category: transaction.category ? transaction.category[0] : null,
            subCategories: transaction.category ? transaction.category.slice(1) : [],
            pending: transaction.pending
          });
      }
    }
    
    // Process removed transactions
    for (const removed of removedTransactions) {
      await db.delete(plaidTransactions)
        .where(eq(plaidTransactions.plaidTransactionId, removed.transaction_id));
    }
    
    // Update item with new cursor and last updated
    await db.update(plaidItems)
      .set({
        lastUpdated: new Date(),
        updatedAt: new Date(),
        metadata: {
          ...item[0].metadata,
          transactionCursor: cursor
        }
      })
      .where(eq(plaidItems.id, itemId));
    
    // Return latest transactions
    return await db.select()
      .from(plaidTransactions)
      .where(eq(plaidTransactions.userId, userId))
      .orderBy(desc(plaidTransactions.date))
      .limit(100);
  }
  
  /**
   * Get user's accounts
   */
  async getUserAccounts(userId: number) {
    return await db.select()
      .from(plaidAccounts)
      .where(eq(plaidAccounts.userId, userId));
  }
  
  /**
   * Get user's transactions
   */
  async getUserTransactions(
    userId: number, 
    startDate?: string, 
    endDate?: string,
    accountIds?: number[],
    categories?: string[]
  ) {
    let query = db.select()
      .from(plaidTransactions)
      .where(eq(plaidTransactions.userId, userId));
      
    if (startDate) {
      query = query.where(plaidTransactions.date >= startDate);
    }
    
    if (endDate) {
      query = query.where(plaidTransactions.date <= endDate);
    }
    
    if (accountIds && accountIds.length) {
      query = query.where(inArray(plaidTransactions.accountId, accountIds));
    }
    
    if (categories && categories.length) {
      query = query.where(inArray(plaidTransactions.category, categories));
    }
    
    return await query.orderBy(desc(plaidTransactions.date));
  }
  
  /**
   * Disconnect a Plaid account
   */
  async disconnectItem(userId: number, itemId: number) {
    // Get the item
    const item = await db.select()
      .from(plaidItems)
      .where(and(
        eq(plaidItems.userId, userId),
        eq(plaidItems.id, itemId)
      ))
      .limit(1);
      
    if (!item.length) {
      throw new Error('Item not found');
    }
    
    // Remove access token from Plaid
    try {
      await plaidClient.itemRemove({
        access_token: item[0].plaidAccessToken
      });
    } catch (error) {
      console.error('Error removing item from Plaid:', error);
    }
    
    // Delete accounts
    await db.delete(plaidAccounts)
      .where(and(
        eq(plaidAccounts.userId, userId),
        eq(plaidAccounts.plaidItemId, itemId)
      ));
      
    // Delete transactions for these accounts
    const accounts = await db.select()
      .from(plaidAccounts)
      .where(and(
        eq(plaidAccounts.userId, userId),
        eq(plaidAccounts.plaidItemId, itemId)
      ));
      
    for (const account of accounts) {
      await db.delete(plaidTransactions)
        .where(eq(plaidTransactions.accountId, account.id));
    }
    
    // Delete item
    await db.delete(plaidItems)
      .where(eq(plaidItems.id, itemId));
  }
}

export const plaidService = new PlaidService();
export default plaidService;
```

### 5. API Throttling Middleware

The API throttling middleware will remain largely the same as in the original blueprint, but we'll need to add handling for financial tracking:

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
      
      // For financial tracking, check account limits if needed
      if (feature === 'financialTracking' && featureConfig.maxAccounts) {
        // This would be handled in the Plaid service directly
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

### 6. Stripe Webhook Handler

Create a webhook handler for Stripe events:

```typescript
// server/routes/stripe-webhooks.ts

import { Router } from "express";
import Stripe from "stripe";
import { subscriptionService } from "../services/subscription-service";

const router = Router();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Webhook handler for Stripe events
router.post('/webhook', async (req, res) => {
  let event: Stripe.Event;

  try {
    const signature = req.headers['stripe-signature'] as string;
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await subscriptionService.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await subscriptionService.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        // Process successful payment
        const invoice = event.data.object as Stripe.Invoice;
        // Store invoice record, etc.
        break;
        
      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object as Stripe.Invoice;
        // Notify user, update subscription status, etc.
        break;
        
      // Other events...
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
```

### 7. Route Integration

Apply the throttling middleware to API routes, including Plaid and Stripe endpoints:

```typescript
// server/routes.ts

import { Router } from "express";
import { apiThrottleMiddleware } from "./middleware/api-throttling-middleware";
import { authenticateJWT } from "./auth/auth-middleware";
import * as plaidController from "./controllers/plaid-controller";
import stripeWebhooks from "./routes/stripe-webhooks";

// ... existing imports ...

const router = Router();

// Stripe webhook endpoint (no auth required)
app.use('/api/stripe', stripeWebhooks);

// Plaid endpoints with throttling
app.post(
  "/api/plaid/create-link-token",
  authenticateJWT,
  apiThrottleMiddleware({
    feature: "financialTracking",
    errorMessage: "Financial tracking is not available on your current plan."
  }),
  plaidController.createLinkToken
);

app.post(
  "/api/plaid/exchange-public-token",
  authenticateJWT,
  apiThrottleMiddleware({
    feature: "financialTracking",
    errorMessage: "Financial tracking is not available on your current plan."
  }),
  plaidController.exchangePublicToken
);

app.get(
  "/api/plaid/accounts",
  authenticateJWT,
  apiThrottleMiddleware({
    feature: "financialTracking",
    errorMessage: "Financial tracking is not available on your current plan."
  }),
  plaidController.getAccounts
);

app.post(
  "/api/plaid/sync-transactions/:itemId",
  authenticateJWT,
  apiThrottleMiddleware({
    feature: "financialTracking",
    errorMessage: "You've reached your daily limit for financial data updates."
  }),
  plaidController.syncTransactions
);

// ... other routes ...

// Subscription management endpoints
app.post(
  "/api/subscription/create-checkout-session",
  authenticateJWT,
  subscriptionController.createCheckoutSession
);

app.post(
  "/api/subscription/change-plan",
  authenticateJWT,
  subscriptionController.changePlan
);

app.post(
  "/api/subscription/cancel",
  authenticateJWT,
  subscriptionController.cancelSubscription
);

// Continue with other routes...
```

## Implementation Schedule

1. **Phase 1: Core Database Schema & Services (Week 1)**
   - Add database schema extensions for subscriptions and Plaid
   - Create Subscription Service with Stripe integration
   - Create Plaid Service
   - Update Tier Configuration Service

2. **Phase 2: Payment Integration (Week 2)**
   - Implement Stripe webhook handlers
   - Create subscription management API endpoints
   - Add Stripe Checkout integration to frontend
   - Implement subscription status display

3. **Phase 3: Financial Tracking Integration (Week 3)**
   - Implement Plaid Link integration
   - Add financial account management
   - Create transaction sync and display
   - Add financial insight features based on tier

4. **Phase 4: API Throttling Implementation (Week 4)**
   - Update throttling middleware for new features
   - Apply throttling to all routes
   - Implement usage tracking for financial features
   - Test throttling across different tiers

5. **Phase 5: Testing & Deployment (Week 5)**
   - Test payment flows end-to-end
   - Test financial data synchronization
   - Verify throttling behavior
   - Deploy to production with monitoring

## Security Considerations

1. **Payment Information**
   - Never store raw credit card data on our servers
   - Use Stripe Elements to securely collect payment info
   - Implement proper authentication for all payment-related endpoints

2. **Financial Data Protection**
   - Encrypt Plaid access tokens at rest
   - Implement proper access controls for financial data
   - Use HTTPS for all communication
   - Add audit logging for sensitive operations

3. **API Keys Protection**
   - Store all API keys in environment variables
   - Use server-side proxy for all API calls to Stripe and Plaid
   - Never expose API keys to frontend code

## Monitoring and Alerts

1. **Payment Issues**
   - Monitor failed payments and send alerts to admins
   - Notify users of payment failures
   - Set up dashboard for payment status monitoring

2. **API Usage**
   - Monitor API usage patterns
   - Set up alerts for unusual API consumption
   - Track throttling events to identify potential issues

3. **Financial Data Sync**
   - Monitor Plaid item status
   - Track sync errors and alert on persistent issues
   - Set up health checks for financial data integrity