// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    gaId?: string; // Add property for our measurement ID
  }
}

// Initialize Google Analytics
export const initGA = () => {
  // Get the measurement ID from the window object (set in App.tsx)
  const measurementId = window.gaId || 'G-N74BTEJGH6';

  if (!measurementId) {
    console.warn('Missing Google Analytics Measurement ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      send_page_view: true,
      cookie_flags: 'samesite=none;secure'
    });
  `;
  document.head.appendChild(script2);
  
  console.log('Google Analytics initialized with tracking ID:', measurementId);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = window.gaId || 'G-N74BTEJGH6';
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
  
  console.log('Page view tracked:', url);
};

/**
 * Educational Platform Event Tracking
 */

// Track learning path events
export const trackLearningPathEvent = (
  action: string,
  pathId: string,
  label?: string,
  value?: number
) => {
  trackEvent(action, 'learning_path', `${pathId}${label ? `: ${label}` : ''}`, value);
};

// Track module completion events
export const trackModuleCompletion = (
  moduleId: string,
  timeTaken: number,
  score?: number
) => {
  trackEvent('complete_module', 'learning', moduleId, score);
  
  // Track time spent separately for better analytics
  trackEvent('time_spent', 'learning', moduleId, timeTaken);
};

// Track assessment events
export const trackAssessmentEvent = (
  action: string,
  assessmentId: string,
  score?: number
) => {
  trackEvent(action, 'assessment', assessmentId, score);
};

// Track resource usage (videos, articles, etc.)
export const trackResourceUsage = (
  resourceType: string,
  resourceId: string,
  timeSpent?: number
) => {
  trackEvent('view_resource', resourceType, resourceId, timeSpent);
};

// Track feature usage 
export const trackFeatureUsage = (
  featureName: string,
  action: string = 'use',
  details?: string
) => {
  trackEvent(action, 'feature', `${featureName}${details ? `: ${details}` : ''}`);
};

// Track events related to user progress
export const trackProgressEvent = (
  action: string,
  category: string = 'progress',
  label?: string,
  value?: number
) => {
  trackEvent(action, category, label, value);
};

// Track events related to user engagement
export const trackEngagementEvent = (
  action: string,
  category: string = 'engagement',
  label?: string,
  value?: number
) => {
  trackEvent(action, category, label, value);
};

// Track general events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};