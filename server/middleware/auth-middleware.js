/**
 * Authentication Middleware
 * 
 * This middleware handles authentication and role-based access control
 * for different parts of the application.
 */

/**
 * Checks if a user is authenticated
 */
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  next();
};

/**
 * Checks if a user has admin role
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  
  next();
};

/**
 * Checks if a user has access to specified data
 * Used for user-specific resources where users should only see their own data
 */
const hasAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  
  // If user is admin, they have access to all data
  if (req.user.isAdmin) {
    return next();
  }
  
  // Check if the requested resource belongs to the user
  const requestedUserId = req.params.userId || req.query.userId;
  
  if (requestedUserId && requestedUserId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: You cannot access data for other users' });
  }
  
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  hasAccess
};