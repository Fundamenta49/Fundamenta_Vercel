import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/analytics.js';

/**
 * Custom hook to track page views automatically when the route changes
 */
export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location);
      prevLocationRef.current = location;
    }
  }, [location]);
};

export default useAnalytics;