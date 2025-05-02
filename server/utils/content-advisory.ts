/**
 * Content Advisory System
 * 
 * This utility helps identify and flag potentially sensitive content
 * and provides appropriate advisory warnings based on content type.
 */

// Sensitive content categories
export enum ContentCategory {
  MENTAL_HEALTH = 'mental_health',
  SUBSTANCE_USE = 'substance_use',
  VIOLENCE = 'violence',
  FINANCIAL_RISK = 'financial_risk',
  MEDICAL = 'medical',
  GENERAL = 'general'
}

// Advisory levels for different user groups
export enum AdvisoryLevel {
  NONE = 'none',           // No advisory needed
  INFORMATIVE = 'info',    // General information only
  CAUTIONARY = 'caution',  // Proceed with caution
  RESTRICTED = 'restrict'  // May be restricted for certain users (e.g., minors)
}

// Advisory message content
export interface AdvisoryMessage {
  title: string;
  description: string;
  category: ContentCategory;
  level: AdvisoryLevel;
}

// Configuration for determining advisory level based on user age and content type
interface ContentAdvisoryConfig {
  minorRestrictions: Partial<Record<ContentCategory, AdvisoryLevel>>;
  adultRestrictions: Partial<Record<ContentCategory, AdvisoryLevel>>;
}

// Default configuration
const defaultConfig: ContentAdvisoryConfig = {
  minorRestrictions: {
    [ContentCategory.MENTAL_HEALTH]: AdvisoryLevel.CAUTIONARY,
    [ContentCategory.SUBSTANCE_USE]: AdvisoryLevel.RESTRICTED,
    [ContentCategory.VIOLENCE]: AdvisoryLevel.RESTRICTED,
    [ContentCategory.FINANCIAL_RISK]: AdvisoryLevel.CAUTIONARY,
    [ContentCategory.MEDICAL]: AdvisoryLevel.CAUTIONARY,
    [ContentCategory.GENERAL]: AdvisoryLevel.NONE
  },
  adultRestrictions: {
    [ContentCategory.MENTAL_HEALTH]: AdvisoryLevel.INFORMATIVE,
    [ContentCategory.SUBSTANCE_USE]: AdvisoryLevel.CAUTIONARY,
    [ContentCategory.VIOLENCE]: AdvisoryLevel.CAUTIONARY,
    [ContentCategory.FINANCIAL_RISK]: AdvisoryLevel.INFORMATIVE,
    [ContentCategory.MEDICAL]: AdvisoryLevel.INFORMATIVE,
    [ContentCategory.GENERAL]: AdvisoryLevel.NONE
  }
};

// Keywords that might indicate content belonging to sensitive categories
const categoryKeywords: Record<ContentCategory, string[]> = {
  [ContentCategory.MENTAL_HEALTH]: [
    'depression', 'anxiety', 'suicide', 'self-harm', 'trauma', 'ptsd', 'mental illness',
    'bipolar', 'schizophrenia', 'eating disorder', 'anorexia', 'bulimia', 'therapy'
  ],
  [ContentCategory.SUBSTANCE_USE]: [
    'alcohol', 'drug', 'addiction', 'substance abuse', 'overdose', 'withdrawal',
    'smoking', 'marijuana', 'cocaine', 'heroin', 'opioid', 'tobacco'
  ],
  [ContentCategory.VIOLENCE]: [
    'assault', 'abuse', 'domestic violence', 'gun', 'weapon', 'fight', 
    'attack', 'kill', 'murder', 'suicide', 'threat', 'danger', 'violent'
  ],
  [ContentCategory.FINANCIAL_RISK]: [
    'investment', 'stock market', 'crypto', 'gambling', 'bet', 'casino', 
    'debt', 'bankruptcy', 'loan', 'mortgage', 'foreclosure', 'credit risk'
  ],
  [ContentCategory.MEDICAL]: [
    'disease', 'cancer', 'diagnosis', 'treatment', 'surgery', 'medication',
    'chronic illness', 'terminal', 'symptom', 'prescription', 'cure'
  ],
  [ContentCategory.GENERAL]: [] // No specific keywords for general content
};

// Standard advisory messages for each category and level
const standardAdvisories: Record<ContentCategory, Partial<Record<AdvisoryLevel, AdvisoryMessage>>> = {
  [ContentCategory.MENTAL_HEALTH]: {
    [AdvisoryLevel.INFORMATIVE]: {
      title: 'Mental Health Information',
      description: 'This content discusses mental health topics. Fundamenta provides educational information but is not a substitute for professional support.',
      category: ContentCategory.MENTAL_HEALTH,
      level: AdvisoryLevel.INFORMATIVE
    },
    [AdvisoryLevel.CAUTIONARY]: {
      title: 'Mental Health Advisory',
      description: 'This content contains sensitive mental health topics. If you're experiencing a mental health crisis, please contact a qualified professional or crisis helpline.',
      category: ContentCategory.MENTAL_HEALTH,
      level: AdvisoryLevel.CAUTIONARY
    },
    [AdvisoryLevel.RESTRICTED]: {
      title: 'Sensitive Mental Health Content',
      description: 'This content discusses serious mental health conditions and is intended for educational purposes only. Parental guidance is advised for younger users.',
      category: ContentCategory.MENTAL_HEALTH,
      level: AdvisoryLevel.RESTRICTED
    }
  },
  [ContentCategory.SUBSTANCE_USE]: {
    [AdvisoryLevel.INFORMATIVE]: {
      title: 'Substance Information',
      description: 'This content discusses substances or substance use for educational purposes only.',
      category: ContentCategory.SUBSTANCE_USE,
      level: AdvisoryLevel.INFORMATIVE
    },
    [AdvisoryLevel.CAUTIONARY]: {
      title: 'Substance Use Advisory',
      description: 'This content contains information about substance use and addiction. Proceed with caution.',
      category: ContentCategory.SUBSTANCE_USE,
      level: AdvisoryLevel.CAUTIONARY
    },
    [AdvisoryLevel.RESTRICTED]: {
      title: 'Restricted Substance Content',
      description: 'This content contains information about substances that may be age-restricted. This is intended for educational purposes only.',
      category: ContentCategory.SUBSTANCE_USE,
      level: AdvisoryLevel.RESTRICTED
    }
  },
  [ContentCategory.VIOLENCE]: {
    [AdvisoryLevel.INFORMATIVE]: {
      title: 'Safety Information',
      description: 'This content mentions potentially challenging topics related to safety or personal security.',
      category: ContentCategory.VIOLENCE,
      level: AdvisoryLevel.INFORMATIVE
    },
    [AdvisoryLevel.CAUTIONARY]: {
      title: 'Safety Advisory',
      description: 'This content discusses potentially difficult topics related to personal safety. Proceed with caution.',
      category: ContentCategory.VIOLENCE,
      level: AdvisoryLevel.CAUTIONARY
    },
    [AdvisoryLevel.RESTRICTED]: {
      title: 'Restricted Safety Content',
      description: 'This content contains sensitive information related to safety situations that may be disturbing to some users. Parental guidance is advised for younger users.',
      category: ContentCategory.VIOLENCE,
      level: AdvisoryLevel.RESTRICTED
    }
  },
  [ContentCategory.FINANCIAL_RISK]: {
    [AdvisoryLevel.INFORMATIVE]: {
      title: 'Financial Information',
      description: 'This content provides general financial information and education. Fundamenta is not a financial advisor.',
      category: ContentCategory.FINANCIAL_RISK,
      level: AdvisoryLevel.INFORMATIVE
    },
    [AdvisoryLevel.CAUTIONARY]: {
      title: 'Financial Risk Advisory',
      description: 'This content discusses financial topics that may involve risk. Always consult a qualified financial advisor before making financial decisions.',
      category: ContentCategory.FINANCIAL_RISK,
      level: AdvisoryLevel.CAUTIONARY
    },
    [AdvisoryLevel.RESTRICTED]: {
      title: 'High Financial Risk Content',
      description: 'This content discusses high-risk financial topics. Never make financial decisions based solely on educational content.',
      category: ContentCategory.FINANCIAL_RISK,
      level: AdvisoryLevel.RESTRICTED
    }
  },
  [ContentCategory.MEDICAL]: {
    [AdvisoryLevel.INFORMATIVE]: {
      title: 'Health Information',
      description: 'This content provides general health information for educational purposes only. Fundamenta is not a healthcare provider.',
      category: ContentCategory.MEDICAL,
      level: AdvisoryLevel.INFORMATIVE
    },
    [AdvisoryLevel.CAUTIONARY]: {
      title: 'Health Advisory',
      description: 'This content discusses health topics that may require medical attention. Always consult a healthcare professional for medical advice.',
      category: ContentCategory.MEDICAL,
      level: AdvisoryLevel.CAUTIONARY
    },
    [AdvisoryLevel.RESTRICTED]: {
      title: 'Sensitive Medical Content',
      description: 'This content discusses sensitive medical topics. Never make medical decisions based solely on educational content.',
      category: ContentCategory.MEDICAL,
      level: AdvisoryLevel.RESTRICTED
    }
  },
  [ContentCategory.GENERAL]: {
    [AdvisoryLevel.NONE]: {
      title: '',
      description: '',
      category: ContentCategory.GENERAL,
      level: AdvisoryLevel.NONE
    }
  }
};

/**
 * Detects potential sensitive content categories in text
 * @param text The content to analyze
 * @returns List of detected content categories and their confidence scores
 */
export function detectContentCategories(text: string): Array<{category: ContentCategory, confidence: number}> {
  const lowercaseText = text.toLowerCase();
  const results: Array<{category: ContentCategory, confidence: number}> = [];
  
  // Check for each category
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.length === 0) return; // Skip general category
    
    const matchedKeywords = keywords.filter(keyword => lowercaseText.includes(keyword));
    
    if (matchedKeywords.length > 0) {
      // Simple confidence score based on number of matched keywords
      const confidence = Math.min(1.0, matchedKeywords.length / (keywords.length * 0.3));
      
      results.push({
        category: category as ContentCategory,
        confidence
      });
    }
  });
  
  // If no specific category detected, mark as general
  if (results.length === 0) {
    results.push({
      category: ContentCategory.GENERAL,
      confidence: 1.0
    });
  }
  
  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Determines the appropriate advisory level for a user and content type
 * @param isMinor Whether the user is a minor
 * @param category Content category
 * @param config Optional custom configuration
 * @returns Advisory level
 */
export function getAdvisoryLevel(
  isMinor: boolean,
  category: ContentCategory,
  config: ContentAdvisoryConfig = defaultConfig
): AdvisoryLevel {
  const restrictions = isMinor ? config.minorRestrictions : config.adultRestrictions;
  return restrictions[category] || AdvisoryLevel.NONE;
}

/**
 * Gets the appropriate advisory message for a category and level
 * @param category Content category
 * @param level Advisory level
 * @returns Advisory message object
 */
export function getAdvisoryMessage(category: ContentCategory, level: AdvisoryLevel): AdvisoryMessage | null {
  if (level === AdvisoryLevel.NONE) {
    return null;
  }
  
  const categoryMessages = standardAdvisories[category];
  return categoryMessages[level] || null;
}

/**
 * Analyzes content and returns appropriate advisory messages if needed
 * @param text Content to analyze
 * @param isMinor Whether the user is a minor
 * @returns Advisory message if needed, or null
 */
export function getContentAdvisory(text: string, isMinor: boolean): AdvisoryMessage | null {
  // Detect categories
  const detectedCategories = detectContentCategories(text);
  
  if (detectedCategories.length === 0 || 
      (detectedCategories.length === 1 && detectedCategories[0].category === ContentCategory.GENERAL)) {
    return null; // No advisory needed for general content
  }
  
  // Get the most confident non-general category
  const primaryCategory = detectedCategories.find(c => c.category !== ContentCategory.GENERAL) || detectedCategories[0];
  
  // Get advisory level based on user age and content category
  const advisoryLevel = getAdvisoryLevel(isMinor, primaryCategory.category);
  
  // Get appropriate advisory message
  return getAdvisoryMessage(primaryCategory.category, advisoryLevel);
}