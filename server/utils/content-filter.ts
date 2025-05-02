/**
 * Content filtering middleware to prevent inappropriate user inputs
 * This provides an additional layer of protection beyond OpenAI's built-in moderation
 */

// Common patterns for detecting inappropriate content
const INAPPROPRIATE_PATTERNS = {
  PROFANITY: /\b(f[*u]ck|sh[*i]t|b[*i]tch|d[*a]mn|a[*s]s[*h]ole|c[*u]nt|d[*i]ck|p[*u]ssy|cock|twat|whore|slut|bastard)\b/i,
  SEXUAL_CONTENT: /\b(sex|porn|nude|naked|masturbat|ejaculat|orgasm|genital|penis|vagina|blowjob|handjob|anal|intercourse)\b/i,
  VIOLENT_CONTENT: /\b(kill|murder|stab|shoot|strangle|torture|attack|violent|beaten|assault|rape)\b/i,
  HATE_SPEECH: /\b(n[*i]gger|f[*a]ggot|sp[*i]c|k[*i]ke|ch[*i]nk|towelhead|wetback|raghead|honkey|retard)\b/i,
  DANGEROUS_REQUESTS: /\b(suicide|kill myself|hack|bomb|terrorist|explosive|weapon|how to make)\b/i
};

// Severity levels for different types of filtered content
export enum ContentFilterSeverity {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

// Result of content filtering
export interface ContentFilterResult {
  isFiltered: boolean;
  severity: ContentFilterSeverity;
  categories: string[];
  filteredText?: string; // If auto-filtering is enabled
}

/**
 * Checks user input for inappropriate content
 * @param text User input to check
 * @returns Content filter result with filter status and details
 */
export function checkInappropriateContent(text: string): ContentFilterResult {
  // Default result
  const result: ContentFilterResult = {
    isFiltered: false,
    severity: ContentFilterSeverity.NONE,
    categories: []
  };
  
  // Check for each pattern
  if (INAPPROPRIATE_PATTERNS.PROFANITY.test(text)) {
    result.isFiltered = true;
    result.severity = Math.max(result.severity, ContentFilterSeverity.MEDIUM);
    result.categories.push('profanity');
  }
  
  if (INAPPROPRIATE_PATTERNS.SEXUAL_CONTENT.test(text)) {
    result.isFiltered = true;
    result.severity = Math.max(result.severity, ContentFilterSeverity.HIGH);
    result.categories.push('sexual_content');
  }
  
  if (INAPPROPRIATE_PATTERNS.VIOLENT_CONTENT.test(text)) {
    result.isFiltered = true;
    result.severity = Math.max(result.severity, ContentFilterSeverity.HIGH);
    result.categories.push('violent_content');
  }
  
  if (INAPPROPRIATE_PATTERNS.HATE_SPEECH.test(text)) {
    result.isFiltered = true;
    result.severity = Math.max(result.severity, ContentFilterSeverity.HIGH);
    result.categories.push('hate_speech');
  }
  
  if (INAPPROPRIATE_PATTERNS.DANGEROUS_REQUESTS.test(text)) {
    result.isFiltered = true;
    result.severity = Math.max(result.severity, ContentFilterSeverity.HIGH);
    result.categories.push('dangerous_requests');
  }
  
  return result;
}

/**
 * Gets an appropriate response for filtered content
 * @param filterResult Result from content filtering
 * @returns Appropriate response message
 */
export function getFilteredContentResponse(filterResult: ContentFilterResult): string {
  // Different responses based on category and severity
  if (filterResult.categories.includes('hate_speech')) {
    return "I can't respond to messages containing offensive language. Let's keep our conversation respectful and positive.";
  }
  
  if (filterResult.categories.includes('sexual_content')) {
    return "I'm designed to be family-friendly and can't discuss adult content. Let's talk about something more appropriate.";
  }
  
  if (filterResult.categories.includes('violent_content')) {
    return "I'm not able to discuss violent topics. Let's focus on positive and constructive conversations.";
  }
  
  if (filterResult.categories.includes('dangerous_requests')) {
    return "I can't provide information on harmful or dangerous activities. If you're feeling unsafe or in danger, please talk to a trusted adult or contact emergency services.";
  }
  
  if (filterResult.categories.includes('profanity')) {
    return "I'd prefer if we could keep our conversation family-friendly without strong language. How can I help you with something else?";
  }
  
  // Generic fallback
  return "I can't respond to that type of content. Let's talk about something else that's more appropriate.";
}

/**
 * Checks if content should be completely blocked based on severity
 * @param filterResult Result from content filtering
 * @returns Whether the content should be blocked
 */
export function shouldBlockContent(filterResult: ContentFilterResult): boolean {
  // Block high severity content
  return filterResult.severity >= ContentFilterSeverity.HIGH;
}

/**
 * Processes user input through content filter and decides how to handle it
 * @param userInput User's message
 * @returns Either filtered response or the original input if it passes
 */
export function processUserInput(userInput: string): { 
  isFiltered: boolean; 
  filteredContent?: string;
  message: string; 
} {
  // Check content
  const filterResult = checkInappropriateContent(userInput);
  
  // If no issues, return original
  if (!filterResult.isFiltered) {
    return { 
      isFiltered: false,
      message: userInput 
    };
  }
  
  // Handle based on filter result
  if (shouldBlockContent(filterResult)) {
    return {
      isFiltered: true,
      filteredContent: getFilteredContentResponse(filterResult),
      message: userInput
    };
  }
  
  // For lower severity, we still warn but allow the original message
  return {
    isFiltered: true,
    filteredContent: undefined,
    message: userInput
  };
}