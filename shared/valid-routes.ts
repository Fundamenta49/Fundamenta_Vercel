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
  
  // First check if the parent route exists
  const segments = normalizedRoute.split('/').filter(Boolean);
  if (segments.length > 1) {
    const parentRoute = '/' + segments[0];
    if (validRoutes.includes(parentRoute)) {
      return parentRoute;
    }
  }
  
  // If no parent route, find routes with similar prefixes
  const possibleMatches = validRoutes.filter(route => 
    route.startsWith('/' + segments[0])
  );
  
  if (possibleMatches.length > 0) {
    // Return the shortest match as it's likely the main category page
    return possibleMatches.sort((a, b) => a.length - b.length)[0];
  }
  
  // If no matches found, return home page
  return '/';
}