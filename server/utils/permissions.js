/**
 * Permissions Utility
 * Part of Bundle 5A security hardening
 * 
 * This utility provides permission checking functions to enforce
 * role-based access control throughout the application.
 */

import { AuthorizationError } from './errors.js';

/**
 * Define user roles and their hierarchical relationships
 * Roles are ordered by increasing privilege level
 */
export const USER_ROLES = {
  USER: 'user',         // Regular user
  MENTOR: 'mentor',     // Mentor can view student progress
  ADMIN: 'admin',       // Admin can perform most operations
  SUPER_ADMIN: 'super_admin', // Super admin has unrestricted access
};

/**
 * Role hierarchy - each role includes all permissions of roles below it
 */
const ROLE_HIERARCHY = {
  [USER_ROLES.USER]: [USER_ROLES.USER],
  [USER_ROLES.MENTOR]: [USER_ROLES.USER, USER_ROLES.MENTOR],
  [USER_ROLES.ADMIN]: [USER_ROLES.USER, USER_ROLES.MENTOR, USER_ROLES.ADMIN],
  [USER_ROLES.SUPER_ADMIN]: [USER_ROLES.USER, USER_ROLES.MENTOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
};

/**
 * Resource-specific permission definitions
 */
export const PERMISSIONS = {
  USERS: {
    VIEW_ANY: 'users:view_any',     // View any user's data
    EDIT_ANY: 'users:edit_any',     // Edit any user's data
    DELETE_ANY: 'users:delete_any', // Delete any user
    VIEW_OWN: 'users:view_own',     // View own data
    EDIT_OWN: 'users:edit_own',     // Edit own data
    DELETE_OWN: 'users:delete_own', // Delete own account
  },
  PATHWAYS: {
    CREATE: 'pathways:create',      // Create new learning pathways
    VIEW_ANY: 'pathways:view_any',  // View any pathway
    EDIT_ANY: 'pathways:edit_any',  // Edit any pathway
    DELETE_ANY: 'pathways:delete_any', // Delete any pathway
    PUBLISH: 'pathways:publish',    // Publish pathway for public use
  },
  MENTORSHIP: {
    ASSIGN: 'mentorship:assign',    // Assign mentors to students
    VIEW_STUDENTS: 'mentorship:view_students', // View student data
    TRACK_PROGRESS: 'mentorship:track_progress', // Track student progress
  },
  ANALYTICS: {
    VIEW_OWN: 'analytics:view_own', // View own analytics
    VIEW_ANY: 'analytics:view_any', // View any user's analytics
    EXPORT: 'analytics:export',     // Export analytics data
  },
  ADMIN: {
    ACCESS_PANEL: 'admin:access_panel', // Access admin panel
    SYSTEM_CONFIG: 'admin:system_config', // Configure system settings
    USER_MANAGEMENT: 'admin:user_management', // Manage all users
  },
};

/**
 * Role-based permission assignments
 */
const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: [
    PERMISSIONS.USERS.VIEW_OWN,
    PERMISSIONS.USERS.EDIT_OWN,
    PERMISSIONS.USERS.DELETE_OWN,
    PERMISSIONS.PATHWAYS.VIEW_ANY,
    PERMISSIONS.ANALYTICS.VIEW_OWN,
  ],
  [USER_ROLES.MENTOR]: [
    PERMISSIONS.MENTORSHIP.VIEW_STUDENTS,
    PERMISSIONS.MENTORSHIP.TRACK_PROGRESS,
    PERMISSIONS.PATHWAYS.CREATE,
  ],
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.USERS.VIEW_ANY,
    PERMISSIONS.USERS.EDIT_ANY,
    PERMISSIONS.PATHWAYS.EDIT_ANY,
    PERMISSIONS.PATHWAYS.DELETE_ANY,
    PERMISSIONS.PATHWAYS.PUBLISH,
    PERMISSIONS.MENTORSHIP.ASSIGN,
    PERMISSIONS.ANALYTICS.VIEW_ANY,
    PERMISSIONS.ANALYTICS.EXPORT,
    PERMISSIONS.ADMIN.ACCESS_PANEL,
    PERMISSIONS.ADMIN.USER_MANAGEMENT,
  ],
  [USER_ROLES.SUPER_ADMIN]: [
    PERMISSIONS.USERS.DELETE_ANY,
    PERMISSIONS.ADMIN.SYSTEM_CONFIG,
  ],
};

/**
 * Check if a user has a specific role
 * @param {string} userRole - The user's role
 * @param {string} requiredRole - The role to check
 * @returns {boolean} - True if the user has the required role
 */
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  // Get all roles in the user's hierarchy
  const userRoles = ROLE_HIERARCHY[userRole] || [];
  return userRoles.includes(requiredRole);
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - True if the user has the permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  // Get all roles in the user's hierarchy
  const userRoles = ROLE_HIERARCHY[userRole] || [];
  
  // Check if any of the user's roles have the required permission
  return userRoles.some(role => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
  });
};

/**
 * Check if the authenticated user can access a resource
 * @param {string} userRole - The user's role
 * @param {string} requestedPermission - The permission needed
 * @param {boolean} throwError - Whether to throw an error on failure
 * @returns {boolean} - True if the user has access
 */
export const checkPermission = (userRole, requestedPermission, throwError = true) => {
  const hasAccess = hasPermission(userRole, requestedPermission);
  
  if (!hasAccess && throwError) {
    throw new AuthorizationError(`Access denied: Missing permission ${requestedPermission}`);
  }
  
  return hasAccess;
};

/**
 * Check if a user owns a resource
 * (To be used in conjunction with permission checks)
 * @param {number} userId - The authenticated user's ID
 * @param {number} resourceOwnerId - The resource owner's ID
 * @returns {boolean} - True if the user owns the resource
 */
export const isResourceOwner = (userId, resourceOwnerId) => {
  return userId === resourceOwnerId;
};