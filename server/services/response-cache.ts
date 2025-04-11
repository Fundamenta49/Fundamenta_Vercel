/**
 * Response Cache service for storing recent AI responses
 * 
 * This provides a fallback mechanism when the AI service is unavailable.
 * It stores responses keyed by a normalized version of the user's message,
 * allowing for fast retrieval of similar recent responses.
 */

import { AIResponse } from "../ai/ai-fallback-strategy";

interface CacheEntry {
  response: AIResponse;
  timestamp: number;
  expires: number;
}

export class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number;
  private defaultTTL: number;
  
  /**
   * Create a new response cache
   * @param maxSize Maximum number of entries to store (default: 100)
   * @param defaultTTL Time-to-live in milliseconds (default: 1 hour)
   */
  constructor(maxSize = 100, defaultTTL = 60 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }
  
  /**
   * Store a response in the cache
   * @param key The message or key to store
   * @param response The AI response to cache
   * @param ttl Optional custom TTL in milliseconds
   */
  set(key: string, response: AIResponse, ttl: number = this.defaultTTL): void {
    // Normalize the key to handle slight variations
    const normalizedKey = this.normalizeKey(key);
    
    // Calculate expiration time
    const now = Date.now();
    const expires = now + ttl;
    
    // Add to cache
    this.cache.set(normalizedKey, {
      response,
      timestamp: now,
      expires
    });
    
    // Ensure cache doesn't grow beyond max size
    this.enforceMaxSize();
    
    // Clean expired entries opportunistically
    this.cleanExpired();
  }
  
  /**
   * Retrieve a response from the cache
   * @param key The message or key to look up
   * @returns The cached response or undefined if not found or expired
   */
  get(key: string): AIResponse | undefined {
    // Normalize the key for lookup
    const normalizedKey = this.normalizeKey(key);
    
    // Get from cache
    const entry = this.cache.get(normalizedKey);
    
    // Return undefined if not found or expired
    if (!entry || Date.now() > entry.expires) {
      if (entry) {
        // Remove expired entry
        this.cache.delete(normalizedKey);
      }
      return undefined;
    }
    
    return entry.response;
  }
  
  /**
   * Find the closest matching response using semantic similarity
   * @param key The message to find a similar response for
   * @returns The most similar cached response or undefined if none found
   */
  findSimilar(key: string): AIResponse | undefined {
    const normalizedKey = this.normalizeKey(key);
    
    // First try exact match
    const exactMatch = this.get(normalizedKey);
    if (exactMatch) return exactMatch;
    
    // Simple word-based similarity - find entries that share the most words
    const keyWords = normalizedKey.split(/\s+/).filter((word: string) => word.length > 3);
    
    let bestMatch: { entry: CacheEntry; score: number } | undefined;
    
    // Convert entries to array for compatibility
    const entries = Array.from(this.cache.entries());
    
    for (const [cacheKey, entry] of entries) {
      // Skip expired entries
      if (Date.now() > entry.expires) continue;
      
      const cacheWords = cacheKey.split(/\s+/).filter((word: string) => word.length > 3);
      let matchScore = 0;
      
      // Count matching words
      for (const word of keyWords) {
        if (cacheWords.includes(word)) {
          matchScore++;
        }
      }
      
      // Need at least 2 matching words
      if (matchScore >= 2) {
        if (!bestMatch || matchScore > bestMatch.score) {
          bestMatch = { entry, score: matchScore };
        }
      }
    }
    
    return bestMatch?.entry.response;
  }
  
  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get the number of entries in the cache
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    let oldestTime: number | null = null;
    let newestTime: number | null = null;
    
    // Convert to array for compatibility
    const values = Array.from(this.cache.values());
    
    for (const entry of values) {
      if (oldestTime === null || entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
      }
      if (newestTime === null || entry.timestamp > newestTime) {
        newestTime = entry.timestamp;
      }
    }
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      oldestEntry: oldestTime,
      newestEntry: newestTime
    };
  }
  
  /**
   * Normalize a key for consistent storage and retrieval
   */
  private normalizeKey(key: string): string {
    return key
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ');    // Normalize whitespace
  }
  
  /**
   * Remove oldest entries when cache exceeds max size
   */
  private enforceMaxSize(): void {
    if (this.cache.size <= this.maxSize) return;
    
    // Find oldest entries to remove
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest entries until we're under max size
    const toRemove = entries.slice(0, this.cache.size - this.maxSize);
    for (const [key] of toRemove) {
      this.cache.delete(key);
    }
  }
  
  /**
   * Clean expired entries from the cache
   */
  private cleanExpired(): void {
    const now = Date.now();
    
    // Convert to array for compatibility
    const entries = Array.from(this.cache.entries());
    
    for (const [key, entry] of entries) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}