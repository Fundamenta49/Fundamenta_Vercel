/**
 * Permissions Utility
 * Centralized system for validating user permissions across the application
 */

import { db } from '../db.js';
import { AuthorizationError } from './errors.js';
import { eq, and } from 'drizzle-orm';
import { 
  customPathways, 
  assignedPathways,
  users,
  userConnections
} from '../../shared/schema.js';

/**
 * Verifies ownership of a custom pathway
 * @param {number} userId - User ID to check 
 * @param {number} pathwayId - Pathway ID to check
 * @returns {Promise<boolean>} - True if the user owns the pathway
 * @throws {AuthorizationError} - If the user doesn't own the pathway
 */
export async function verifyPathwayOwnership(userId, pathwayId) {
  const pathway = await db.query.customPathways.findFirst({
    where: eq(customPathways.id, pathwayId)
  });
  
  if (!pathway) {
    throw new AuthorizationError('Pathway not found');
  }
  
  if (pathway.creatorId !== userId && !pathway.isPublic) {
    throw new AuthorizationError('You do not have permission to access this pathway');
  }
  
  return pathway;
}

/**
 * Verifies access to a public pathway
 * @param {number} userId - User ID to check
 * @param {number} pathwayId - Pathway ID to check
 * @returns {Promise<boolean>} - True if the user can access the pathway
 * @throws {AuthorizationError} - If the user doesn't have access to the pathway
 */
export async function verifyPathwayAccess(userId, pathwayId) {
  const pathway = await db.query.customPathways.findFirst({
    where: eq(customPathways.id, pathwayId)
  });
  
  if (!pathway) {
    throw new AuthorizationError('Pathway not found');
  }
  
  // Allow access if the user is the creator or the pathway is public
  if (pathway.creatorId === userId || pathway.isPublic) {
    return pathway;
  }
  
  // Check if the pathway has been assigned to the user
  const assignment = await db.query.assignedPathways.findFirst({
    where: and(
      eq(assignedPathways.pathwayId, pathwayId),
      eq(assignedPathways.studentId, userId)
    )
  });
  
  if (assignment) {
    return pathway;
  }
  
  throw new AuthorizationError('You do not have permission to access this pathway');
}

/**
 * Verifies if a user can edit a pathway
 * @param {number} userId - User ID to check
 * @param {number} pathwayId - Pathway ID to check
 * @returns {Promise<boolean>} - True if the user can edit the pathway
 * @throws {AuthorizationError} - If the user doesn't have permission to edit
 */
export async function verifyPathwayEditPermission(userId, pathwayId) {
  const pathway = await db.query.customPathways.findFirst({
    where: eq(customPathways.id, pathwayId)
  });
  
  if (!pathway) {
    throw new AuthorizationError('Pathway not found');
  }
  
  if (pathway.creatorId !== userId) {
    throw new AuthorizationError('You do not have permission to edit this pathway');
  }
  
  return pathway;
}

/**
 * Verifies ownership of an assignment
 * @param {number} userId - User ID to check
 * @param {number} assignmentId - Assignment ID to check
 * @returns {Promise<boolean>} - True if the user owns the assignment
 * @throws {AuthorizationError} - If the user doesn't own the assignment
 */
export async function verifyAssignmentOwnership(userId, assignmentId) {
  const assignment = await db.query.assignedPathways.findFirst({
    where: eq(assignedPathways.id, assignmentId)
  });
  
  if (!assignment) {
    throw new AuthorizationError('Assignment not found');
  }
  
  // Mentors can access assignments they created
  if (assignment.assignedBy === userId) {
    return assignment;
  }
  
  // Students can access assignments assigned to them
  if (assignment.studentId === userId) {
    return assignment;
  }
  
  throw new AuthorizationError('You do not have permission to access this assignment');
}

/**
 * Verifies mentor-student relationship
 * @param {number} mentorId - Mentor user ID
 * @param {number} studentId - Student user ID
 * @returns {Promise<boolean>} - True if the mentor has access to the student
 * @throws {AuthorizationError} - If the mentor doesn't have access to the student
 */
export async function verifyMentorStudentRelationship(mentorId, studentId) {
  const connection = await db.query.userConnections.findFirst({
    where: and(
      eq(userConnections.mentorId, mentorId),
      eq(userConnections.studentId, studentId),
      eq(userConnections.status, 'active')
    )
  });
  
  if (!connection) {
    throw new AuthorizationError('You do not have an active mentorship with this student');
  }
  
  return connection;
}

/**
 * Verifies user has admin role
 * @param {Object} user - User object 
 * @returns {boolean} - True if user is an admin
 * @throws {AuthorizationError} - If the user is not an admin
 */
export function verifyAdminRole(user) {
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Admin access required');
  }
  
  return true;
}

/**
 * Check if user has required role
 * @param {Object} user - User object
 * @param {string[]} roles - Array of allowed roles
 * @returns {boolean} - True if user has an allowed role
 * @throws {AuthorizationError} - If the user doesn't have an allowed role
 */
export function verifyUserRole(user, roles) {
  if (!user || !user.role || !roles.includes(user.role)) {
    throw new AuthorizationError(`Access requires one of these roles: ${roles.join(', ')}`);
  }
  
  return true;
}