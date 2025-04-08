/**
 * This file defines all valid routes in the application that can be
 * suggested by the AI assistant. Routes not listed here will not be
 * suggested in navigation actions.
 */

export const validRoutes = [
  // Main pages
  '/',
  '/finance',
  '/finance/education',
  '/career',
  '/wellness',
  '/learning',
  '/emergency',
  '/cooking',
  '/fitness',

  // Finance sub-pages
  '/finance/budget',
  '/finance/credit',
  '/finance/investing',
  '/finance/taxes',
  '/finance/banking',
  '/finance/mortgage',
  '/finance/retirement',

  // Career sub-pages
  '/career/resume',
  '/career/interview',
  '/career/job-search',
  '/career/networking',
  
  // Wellness sub-pages
  '/wellness/meditation',
  '/wellness/nutrition',
  '/wellness/sleep',
  '/wellness/mental-health',
  
  // Learning sub-pages
  '/learning/courses',
  '/learning/life-skills',
  '/learning/digital-skills',
  
  // Emergency sub-pages
  '/emergency/first-aid',
  '/emergency/preparedness',
  '/emergency/contacts',
  
  // Cooking sub-pages
  '/cooking/basics',
  '/cooking/meal-planning',
  '/cooking/nutrition',
  
  // Fitness sub-pages
  '/fitness/exercises',
  '/fitness/plans',
  '/fitness/tracking',
];

/**
 * This function checks if a route exists in the application
 * @param route The route to check
 * @returns boolean indicating if the route is valid
 */
export function isValidRoute(route: string): boolean {
  return validRoutes.includes(route);
}

/**
 * Get closest matching valid route when an invalid route is requested
 * @param invalidRoute The invalid route that was requested
 * @returns The closest matching valid route, or '/' if none found
 */
export function getSuggestedAlternativeRoute(invalidRoute: string): string {
  // If route is empty or undefined, return home
  if (!invalidRoute) return '/';
  
  // Remove trailing slash if present for consistency
  const normalizedRoute = invalidRoute.endsWith('/') && invalidRoute !== '/' 
    ? invalidRoute.slice(0, -1) 
    : invalidRoute;
  
  // Special case handling for known common misroutes
  // For example, if someone requests cooking/techniques, we should direct to cooking/basics
  const specialCases: Record<string, string> = {
    '/cooking/techniques': '/cooking/basics',
    '/cooking/recipe': '/cooking/basics',
    '/cooking/recipes': '/cooking/basics',
    '/career/jobs': '/career/job-search',
    '/career/resumes': '/career/resume',
    '/finance/budget-planner': '/finance/budget',
    '/finance/mortgage-calculator': '/finance/mortgage',
    '/fitness/workout': '/fitness/exercises',
    '/fitness/workouts': '/fitness/exercises'
  };
  
  // Check if we have a special case for this route
  if (specialCases[normalizedRoute]) {
    return specialCases[normalizedRoute];
  }
  
  // Extract segments for further processing
  const segments = normalizedRoute.split('/').filter(Boolean);
  
  // If we have a parent and child route, try to find the best match
  if (segments.length > 1) {
    const category = segments[0];
    const subcategory = segments[1];
    
    // First, check if the parent/category route exists
    const parentRoute = '/' + category;
    if (validRoutes.includes(parentRoute)) {
      // Find all valid subcategories of this parent
      const subcategories = validRoutes.filter(route => 
        route.startsWith(parentRoute + '/') 
      );
      
      if (subcategories.length > 0) {
        // Find the most similar subcategory using simple string similarity
        let bestMatch = subcategories[0];
        let highestSimilarity = 0;
        
        for (const route of subcategories) {
          const routeSubcategory = route.split('/')[2]; // Get the subcategory part
          let similarity = 0;
          
          // Simple character matching algorithm
          for (let i = 0; i < Math.min(subcategory.length, routeSubcategory.length); i++) {
            if (subcategory[i] === routeSubcategory[i]) {
              similarity++;
            }
          }
          
          // Adjust for length differences
          similarity = similarity / Math.max(subcategory.length, routeSubcategory.length);
          
          if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = route;
          }
        }
        
        // Return the most similar subcategory if above threshold
        if (highestSimilarity > 0.3) {
          return bestMatch;
        }
        
        // If no good match, return the first subcategory as default
        return subcategories[0];
      }
      
      // If no subcategories, return the parent route
      return parentRoute;
    }
  }
  
  // If no parent route, find routes with similar prefixes
  const possibleMatches = validRoutes.filter(route => 
    route.startsWith('/' + segments[0])
  );
  
  if (possibleMatches.length > 0) {
    // Sort by length to get the most relevant (shorter) route first
    const sortedMatches = possibleMatches.sort((a, b) => a.length - b.length);
    
    // Prefer routes with two segments (more precise) if available
    const twoSegmentRoutes = sortedMatches.filter(route => route.split('/').length === 3);
    if (twoSegmentRoutes.length > 0) {
      return twoSegmentRoutes[0];
    }
    
    // Otherwise fall back to the shortest match (main category)
    return sortedMatches[0];
  }
  
  // If no matches found, return home page
  return '/';
}