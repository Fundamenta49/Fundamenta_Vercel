/**
 * Environment Configuration
 * 
 * This module centralizes environment variable access and provides
 * defaults suitable for both development and production environments.
 * It's designed to work with both Replit and Vercel deployments.
 */

// Detect deployment platform
const isVercel = process.env.VERCEL === '1';
const isReplit = process.env.REPL_ID !== undefined;

// Database Configuration
export const DATABASE_CONFIG = {
  // Prioritize explicit database URL, then platform-specific connections
  connectionString: process.env.DATABASE_URL,
  // Default configuration for database pools
  poolConfig: {
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '5000', 10)
  }
};

// Server Configuration
export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  trustProxy: isVercel || isReplit, // Enable for Vercel and Replit deployments
};

// Session Configuration
export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'fundi-ai-secret-key',
  cookieMaxAge: parseInt(process.env.SESSION_MAX_AGE || (30 * 24 * 60 * 60 * 1000).toString(), 10), // 30 days default
  secureCookies: process.env.NODE_ENV === 'production', // Only use secure cookies in production
  useSubdomains: isVercel, // Enable for Vercel domains
  domain: isVercel ? process.env.COOKIE_DOMAIN : undefined,
};

// API Keys (Secured)
export const API_KEYS = {
  openai: process.env.OPENAI_API_KEY,
  stripe: process.env.STRIPE_API_KEY,
  youtube: process.env.YOUTUBE_API_KEY,
  spoonacular: process.env.SPOONACULAR_API_KEY,
  plaid: {
    clientId: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: process.env.PLAID_ENV || 'sandbox'
  },
  // Handle missing API keys gracefully
  getMissingKeys: (): string[] => {
    const missingKeys: string[] = [];
    if (!API_KEYS.openai) missingKeys.push('OPENAI_API_KEY');
    if (!API_KEYS.stripe) missingKeys.push('STRIPE_API_KEY');
    if (!API_KEYS.youtube) missingKeys.push('YOUTUBE_API_KEY');
    if (!API_KEYS.spoonacular) missingKeys.push('SPOONACULAR_API_KEY');
    if (!API_KEYS.plaid.clientId) missingKeys.push('PLAID_CLIENT_ID');
    if (!API_KEYS.plaid.secret) missingKeys.push('PLAID_SECRET');
    return missingKeys;
  }
};

// Frontend Configuration (variables exposed to the client)
export const FRONTEND_CONFIG = {
  appUrl: isVercel 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.APP_URL || `http://localhost:${SERVER_CONFIG.port}`,
  analyticsId: process.env.ANALYTICS_ID,
  publicApiKeys: {
    // Only include keys that are safe to expose to the client
    plaidEnv: API_KEYS.plaid.env,
    stripePublishable: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  featureFlags: {
    enableYoga: process.env.ENABLE_YOGA === 'true',
    enableFinance: process.env.ENABLE_FINANCE === 'true',
    enableJunglePath: process.env.ENABLE_JUNGLE_PATH === 'true',
  }
};

// Vercel-specific configuration
export const VERCEL_CONFIG = {
  isVercel,
  url: process.env.VERCEL_URL,
  region: process.env.VERCEL_REGION
};

// Export a consolidated config object for convenience
export default {
  database: DATABASE_CONFIG,
  server: SERVER_CONFIG,
  session: SESSION_CONFIG,
  api: API_KEYS,
  frontend: FRONTEND_CONFIG,
  vercel: VERCEL_CONFIG,
  platform: {
    isVercel,
    isReplit,
  }
};