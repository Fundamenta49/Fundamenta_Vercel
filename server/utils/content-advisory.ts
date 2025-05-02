/**
 * Content Advisory Utilities
 * 
 * This module provides functions for detecting content that requires
 * advisory notices and generating appropriate disclaimers.
 */

// Types of content that may require advisories
export type ContentCategory = 
  | 'Mental Health' 
  | 'Financial Advice' 
  | 'Medical Information' 
  | 'Nutrition Guidance'
  | 'Exercise Instructions'
  | 'General Information';

// Severity levels for content advisories
export type ContentAdvisorySeverity = 'low' | 'medium' | 'high';

// Content advisory information
export interface ContentAdvisory {
  category: ContentCategory;
  severity: ContentAdvisorySeverity;
  disclaimer: string;
  readMore?: string;
}

// Keyword patterns for content categories
const contentPatterns = {
  mentalHealth: [
    /\b(?:depress(?:ed|ion)|anxiety|suicid(?:e|al)|mental health|panic attack|bipolar|trauma|ptsd|schizo|eating disorder)\b/i,
    /\b(?:therapy|therapist|counseling|psycholog(?:y|ist)|psychiatr(?:y|ist)|mental illness)\b/i,
    /\b(?:stress|burnout|self-harm|addiction|substance abuse|crisis|disorder)\b/i
  ],
  financialAdvice: [
    /\b(?:invest(?:ing|ment)|stock market|mortgage|loan|debt|credit|retirement|tax|insurance)\b/i,
    /\b(?:financial|money|saving|budget|bankruptcy|foreclosure|wealth|income|expense)\b/i,
    /\b(?:portfolio|equity|assets|liabilities|interest rate|APR|ROI|capital|fund)\b/i
  ],
  medicalInformation: [
    /\b(?:diagnos(?:is|e)|symptom|treatment|medication|disease|illness|condition|surgery|pain)\b/i,
    /\b(?:doctor|hospital|clinic|medical|health|patient|prescription|drug|medicine)\b/i,
    /\b(?:cancer|diabetes|heart|cholesterol|blood pressure|stroke|allergies|infection|chronic)\b/i
  ],
  nutritionGuidance: [
    /\b(?:diet|nutrition|calorie|supplement|vitamin|protein|fat|carb|weight loss)\b/i,
    /\b(?:food|eating|meal|nutrient|metabolism|digestion|keto|paleo|vegan|vegetarian)\b/i,
    /\b(?:fasting|cleanse|detox|macros|micronutrient|deficiency|obesity|underweight)\b/i
  ],
  exerciseInstructions: [
    /\b(?:workout|exercise|training|fitness|strength|cardio|stretching|yoga|pilates)\b/i,
    /\b(?:lifting|weights|reps|sets|form|posture|stance|technique|intensity|exertion)\b/i,
    /\b(?:injury|strain|sprain|muscle|joint|pain|recovery|rehabilitation|mobility)\b/i
  ]
};

/**
 * Analyzes text to determine if it contains content requiring advisory
 * 
 * @param text Content to analyze
 * @returns Boolean indicating if content needs advisory
 */
export function needsContentAdvisory(text: string): boolean {
  // Check for mental health content
  if (contentPatterns.mentalHealth.some(pattern => pattern.test(text))) {
    return true;
  }
  
  // Check for financial advice content
  if (contentPatterns.financialAdvice.some(pattern => pattern.test(text))) {
    return true;
  }
  
  // Check for medical information content
  if (contentPatterns.medicalInformation.some(pattern => pattern.test(text))) {
    return true;
  }
  
  // Check for nutrition guidance content
  if (contentPatterns.nutritionGuidance.some(pattern => pattern.test(text))) {
    return true;
  }
  
  // Check for exercise instructions content
  if (contentPatterns.exerciseInstructions.some(pattern => pattern.test(text))) {
    return true;
  }
  
  return false;
}

/**
 * Determines the most likely category for content
 * 
 * @param text Content to categorize
 * @returns Content category
 */
function categorizeContent(text: string): ContentCategory {
  const matchCounts = {
    mentalHealth: contentPatterns.mentalHealth.filter(pattern => pattern.test(text)).length,
    financialAdvice: contentPatterns.financialAdvice.filter(pattern => pattern.test(text)).length,
    medicalInformation: contentPatterns.medicalInformation.filter(pattern => pattern.test(text)).length,
    nutritionGuidance: contentPatterns.nutritionGuidance.filter(pattern => pattern.test(text)).length,
    exerciseInstructions: contentPatterns.exerciseInstructions.filter(pattern => pattern.test(text)).length
  };
  
  // Find category with highest match count
  const maxCategory = Object.entries(matchCounts).reduce(
    (max, [category, count]) => count > max.count ? { category, count } : max,
    { category: 'General Information', count: 0 }
  );
  
  // Map internal category name to public-facing category
  switch (maxCategory.category) {
    case 'mentalHealth': return 'Mental Health';
    case 'financialAdvice': return 'Financial Advice';
    case 'medicalInformation': return 'Medical Information';
    case 'nutritionGuidance': return 'Nutrition Guidance';
    case 'exerciseInstructions': return 'Exercise Instructions';
    default: return 'General Information';
  }
}

/**
 * Determines severity level for content based on its category and patterns
 * 
 * @param text Content to evaluate
 * @param category Content category
 * @returns Severity level
 */
function determineSeverity(text: string, category: ContentCategory): ContentAdvisorySeverity {
  // High severity patterns by category
  const highSeverityPatterns: Record<ContentCategory, RegExp[]> = {
    'Mental Health': [
      /\b(?:suicid(?:e|al)|self-harm|crisis|trauma|abuse|assault)\b/i,
    ],
    'Financial Advice': [
      /\b(?:bankruptcy|foreclosure|debt|crisis|scam|fraud)\b/i,
    ],
    'Medical Information': [
      /\b(?:emergency|severe|chronic|terminal|fatal|life-threatening)\b/i,
    ],
    'Nutrition Guidance': [
      /\b(?:disorder|anorexia|bulimia|starvation|malnutrition|extreme)\b/i,
    ],
    'Exercise Instructions': [
      /\b(?:injury|dangerous|extreme|excessive|pain|risk)\b/i,
    ],
    'General Information': [
      /\b(?:warning|caution|danger|risk|harmful)\b/i,
    ]
  };
  
  // Medium severity patterns by category
  const mediumSeverityPatterns: Record<ContentCategory, RegExp[]> = {
    'Mental Health': [
      /\b(?:depress(?:ed|ion)|anxiety|panic|bipolar|disorder)\b/i,
    ],
    'Financial Advice': [
      /\b(?:invest(?:ing|ment)|loan|credit|mortgage|tax)\b/i,
    ],
    'Medical Information': [
      /\b(?:condition|disease|symptom|treatment|medication)\b/i,
    ],
    'Nutrition Guidance': [
      /\b(?:diet|weight loss|supplement|restriction|fasting|cleanse)\b/i,
    ],
    'Exercise Instructions': [
      /\b(?:high intensity|challenging|advanced|strenuous)\b/i,
    ],
    'General Information': [
      /\b(?:advisory|notice|attention|important)\b/i,
    ]
  };
  
  // Check for high severity patterns in content
  if (highSeverityPatterns[category]?.some((pattern: RegExp) => pattern.test(text))) {
    return 'high';
  }
  
  // Check for medium severity patterns in content
  if (mediumSeverityPatterns[category]?.some((pattern: RegExp) => pattern.test(text))) {
    return 'medium';
  }
  
  // Default to low severity
  return 'low';
}

/**
 * Creates appropriate disclaimer text based on category and severity
 * 
 * @param category Content category
 * @param severity Content severity
 * @returns Disclaimer text
 */
function createDisclaimerText(category: ContentCategory, severity: ContentAdvisorySeverity): string {
  const disclaimers = {
    'Mental Health': {
      high: "This content discusses sensitive mental health topics that may be distressing. If you're experiencing a crisis, please contact a mental health professional or crisis helpline immediately.",
      medium: "This content contains information about mental health. It's intended for educational purposes only and should not replace professional advice or treatment.",
      low: "This content mentions mental health topics. For personalized advice, please consult with a qualified mental health professional."
    },
    'Financial Advice': {
      high: "This content discusses significant financial matters that could impact your economic wellbeing. All financial decisions should be made after consulting with a qualified financial advisor.",
      medium: "This content contains financial information intended for educational purposes only. Individual financial situations vary, and you should consult a professional before making decisions.",
      low: "This content mentions financial topics. Remember that all financial advice should be considered in the context of your personal financial situation."
    },
    'Medical Information': {
      high: "This content discusses medical conditions or treatments that require professional attention. If you're experiencing symptoms, please consult a healthcare provider immediately.",
      medium: "This content contains medical information intended for educational purposes only. It should not be used for self-diagnosis or as a substitute for professional medical advice.",
      low: "This content mentions health-related topics. For personalized medical advice, please consult with a qualified healthcare provider."
    },
    'Nutrition Guidance': {
      high: "This content discusses nutrition approaches that may not be suitable for everyone. Consult with a healthcare provider before making significant changes to your diet, especially if you have health conditions.",
      medium: "This content contains nutritional information intended for educational purposes. Dietary needs vary by individual, and you should consult a professional before making significant changes.",
      low: "This content mentions nutrition topics. Remember that nutritional needs vary by individual and life stage."
    },
    'Exercise Instructions': {
      high: "This content includes exercise instructions that may pose risk of injury if performed incorrectly or by individuals with certain health conditions. Consult a healthcare provider before beginning any exercise program.",
      medium: "This content contains exercise information intended for educational purposes. Not all exercises are suitable for everyone, and you should ensure proper form to avoid injury.",
      low: "This content mentions exercise topics. Remember to start gradually and listen to your body's signals when exercising."
    },
    'General Information': {
      high: "This content contains information that may require professional guidance to interpret or apply correctly.",
      medium: "This content is provided for educational purposes only and may not apply to all situations.",
      low: "This content is provided for general informational purposes."
    }
  };
  
  return disclaimers[category][severity] || "This content is provided for informational purposes only.";
}

/**
 * Get appropriate resource link based on content category
 * 
 * @param category Content category
 * @returns Resource link path
 */
function getResourceLink(category: ContentCategory): string | undefined {
  const resourceLinks: Record<ContentCategory, string | undefined> = {
    'Mental Health': '/resources/mental-health',
    'Financial Advice': '/resources/financial-guidance',
    'Medical Information': '/resources/health-resources',
    'Nutrition Guidance': '/resources/nutrition',
    'Exercise Instructions': '/resources/exercise-safety',
    'General Information': undefined
  };
  
  return resourceLinks[category];
}

/**
 * Creates a content advisory based on text analysis
 * 
 * @param text Content to analyze
 * @returns Content advisory information
 */
export function createContentAdvisory(text: string): ContentAdvisory {
  // Determine content category
  const category = categorizeContent(text);
  
  // Determine severity level
  const severity = determineSeverity(text, category);
  
  // Create appropriate disclaimer
  const disclaimer = createDisclaimerText(category, severity);
  
  // Get resource link if available
  const readMore = getResourceLink(category);
  
  return {
    category,
    severity,
    disclaimer,
    readMore
  };
}