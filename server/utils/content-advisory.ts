/**
 * Content Advisory Utilities
 * 
 * This module provides utilities for detecting and handling sensitive content
 * with appropriate warnings and disclaimers.
 */

export type ContentCategory = 
  | 'Mental Health' 
  | 'Financial Advice' 
  | 'Medical Information' 
  | 'Nutrition Guidance'
  | 'Exercise Instructions'
  | 'General Information';

export interface ContentAdvisory {
  category: ContentCategory;
  severity: 'low' | 'medium' | 'high';
  disclaimer: string;
  readMore?: string; // Optional URL or resource for further information
}

/**
 * Categorizes content based on keywords and patterns
 * 
 * @param content The content to analyze
 * @returns The detected content category
 */
export function categorizeContent(content: string): ContentCategory {
  const lowerContent = content.toLowerCase();
  
  // Mental Health patterns
  if (
    lowerContent.includes('mental health') || 
    lowerContent.includes('depression') || 
    lowerContent.includes('anxiety') || 
    lowerContent.includes('therapy') ||
    lowerContent.includes('stress') ||
    lowerContent.includes('emotional')
  ) {
    return 'Mental Health';
  }
  
  // Financial Advice patterns
  if (
    lowerContent.includes('investment') || 
    lowerContent.includes('finance') || 
    lowerContent.includes('money') || 
    lowerContent.includes('budget') ||
    lowerContent.includes('save') ||
    lowerContent.includes('loan') ||
    lowerContent.includes('mortgage')
  ) {
    return 'Financial Advice';
  }
  
  // Medical Information patterns
  if (
    lowerContent.includes('medical') || 
    lowerContent.includes('health') || 
    lowerContent.includes('doctor') || 
    lowerContent.includes('symptom') ||
    lowerContent.includes('treatment') ||
    lowerContent.includes('diagnosis') ||
    lowerContent.includes('medication')
  ) {
    return 'Medical Information';
  }
  
  // Nutrition Guidance patterns
  if (
    lowerContent.includes('nutrition') || 
    lowerContent.includes('diet') || 
    lowerContent.includes('food') || 
    lowerContent.includes('calorie') ||
    lowerContent.includes('meal plan') ||
    lowerContent.includes('weight loss') ||
    lowerContent.includes('vitamin')
  ) {
    return 'Nutrition Guidance';
  }
  
  // Exercise Instructions patterns
  if (
    lowerContent.includes('exercise') || 
    lowerContent.includes('workout') || 
    lowerContent.includes('fitness') || 
    lowerContent.includes('training') ||
    lowerContent.includes('routine') ||
    lowerContent.includes('stretch') ||
    lowerContent.includes('cardio')
  ) {
    return 'Exercise Instructions';
  }
  
  // Default category
  return 'General Information';
}

/**
 * Determines the severity level of advisory needed
 * 
 * @param content The content to analyze
 * @param category The content category
 * @returns The severity level
 */
export function determineSeverity(
  content: string, 
  category: ContentCategory
): 'low' | 'medium' | 'high' {
  const lowerContent = content.toLowerCase();
  
  // High severity patterns by category
  const highSeverityPatterns: Record<ContentCategory, string[]> = {
    'Mental Health': ['suicide', 'self-harm', 'trauma', 'abuse', 'crisis', 'emergency'],
    'Financial Advice': ['guaranteed', 'risk-free', 'quick money', 'investment opportunity', 'limited time', 'urgent'],
    'Medical Information': ['cancer', 'heart attack', 'stroke', 'emergency', 'serious', 'life-threatening'],
    'Nutrition Guidance': ['extreme', 'rapid weight loss', 'miracle', 'cure', 'guaranteed', 'detox'],
    'Exercise Instructions': ['extreme', 'intense', 'advanced', 'no pain no gain', 'push through pain'],
    'General Information': []
  };
  
  // Medium severity patterns by category
  const mediumSeverityPatterns: Record<ContentCategory, string[]> = {
    'Mental Health': ['depression', 'anxiety', 'panic', 'disorder', 'therapy'],
    'Financial Advice': ['investment', 'stock', 'retirement', 'tax', 'loan', 'debt'],
    'Medical Information': ['symptom', 'condition', 'diagnosis', 'treatment', 'medication'],
    'Nutrition Guidance': ['diet', 'weight loss', 'calorie', 'restriction', 'supplement'],
    'Exercise Instructions': ['workout', 'routine', 'training', 'program', 'fitness'],
    'General Information': []
  };
  
  // Check for high severity patterns
  if (highSeverityPatterns[category].some(pattern => lowerContent.includes(pattern))) {
    return 'high';
  }
  
  // Check for medium severity patterns
  if (mediumSeverityPatterns[category].some(pattern => lowerContent.includes(pattern))) {
    return 'medium';
  }
  
  // Default severity
  return 'low';
}

/**
 * Generates an appropriate disclaimer for the content
 * 
 * @param category The content category
 * @param severity The severity level
 * @returns The disclaimer text
 */
export function generateDisclaimer(
  category: ContentCategory,
  severity: 'low' | 'medium' | 'high'
): string {
  // Base disclaimers by category
  const baseDisclaimers: Record<ContentCategory, string> = {
    'Mental Health': 'This content includes mental health information which is educational in nature and not a substitute for professional advice, diagnosis, or treatment.',
    'Financial Advice': 'This financial information is for educational purposes only and should not be considered personalized financial advice.',
    'Medical Information': 'This content contains general medical information and is not a substitute for professional medical advice, diagnosis, or treatment.',
    'Nutrition Guidance': 'This nutritional information is general in nature and not tailored to individual health needs or conditions.',
    'Exercise Instructions': 'Exercise at your own risk. Consult with a healthcare provider before beginning any new exercise program.',
    'General Information': 'This information is provided for educational purposes only.'
  };
  
  // Additional disclaimer text by severity
  const severityAdditions: Record<'low' | 'medium' | 'high', string> = {
    'low': '',
    'medium': ' Always consult with appropriate professionals for advice specific to your situation.',
    'high': ' Please consult with appropriate professionals immediately for advice specific to your situation. If you are experiencing an emergency, contact emergency services.'
  };
  
  return baseDisclaimers[category] + severityAdditions[severity];
}

/**
 * Generates a "read more" resource link for additional information
 * 
 * @param category The content category
 * @returns URL or resource for further information
 */
export function generateReadMoreLink(category: ContentCategory): string | undefined {
  const resourceLinks: Record<ContentCategory, string | undefined> = {
    'Mental Health': '/resources/mental-health',
    'Financial Advice': '/resources/financial',
    'Medical Information': '/resources/medical',
    'Nutrition Guidance': '/resources/nutrition',
    'Exercise Instructions': '/resources/fitness',
    'General Information': undefined
  };
  
  return resourceLinks[category];
}

/**
 * Creates a complete content advisory based on the content
 * 
 * @param content The content to analyze
 * @returns The complete content advisory
 */
export function createContentAdvisory(content: string): ContentAdvisory {
  const category = categorizeContent(content);
  const severity = determineSeverity(content, category);
  const disclaimer = generateDisclaimer(category, severity);
  const readMore = generateReadMoreLink(category);
  
  return {
    category,
    severity,
    disclaimer,
    readMore
  };
}

/**
 * Checks if content requires an advisory
 * 
 * @param content The content to analyze
 * @returns True if an advisory is needed, false otherwise
 */
export function needsContentAdvisory(content: string): boolean {
  const category = categorizeContent(content);
  const severity = determineSeverity(content, category);
  
  // General information with low severity doesn't need an advisory
  if (category === 'General Information' && severity === 'low') {
    return false;
  }
  
  return true;
}