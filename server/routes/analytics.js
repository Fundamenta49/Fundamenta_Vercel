/**
 * Analytics API Routes
 * Routes for fetching analytics data for mentors and students
 */

import { ValidationError, NotFoundError, asyncHandler } from '../utils/errors.js';
import { authenticated, hasRole, isSelfOrAdmin } from '../middleware/auth.js';
import { storage } from '../storage.js';
import { Router } from 'express';

/**
 * Get analytics data for a user by ID
 * Provides summary stats, pathway progress, activity timeline, and assignment stats
 */
export const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    throw new ValidationError('Invalid user ID format');
  }
  
  // Check if user exists
  const user = await storage.getUser(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // For security, ensure user can only access their own data unless they're an admin
  if (req.user.id !== userId && req.user.role !== 'admin') {
    throw new ValidationError('You can only access your own analytics data');
  }
  
  // Get analytics data
  const analyticsData = await storage.getUserAnalytics(userId);
  
  return res.json(analyticsData);
});

/**
 * Get mentor analytics dashboard data
 * Provides analytics data for mentors including student stats and pathway effectiveness
 */
export const getMentorAnalytics = asyncHandler(async (req, res) => {
  const mentorId = parseInt(req.params.id);
  
  if (isNaN(mentorId)) {
    throw new ValidationError('Invalid mentor ID format');
  }
  
  // Check if user exists and is a mentor or admin
  const user = await storage.getUser(mentorId);
  if (!user) {
    throw new NotFoundError('Mentor not found');
  }
  
  // Verify user is requesting their own data or is admin
  if (req.user.id !== mentorId && req.user.role !== 'admin') {
    throw new ValidationError('You can only access your own mentor analytics data');
  }
  
  // Verify user is a mentor or admin
  if (user.role !== 'mentor' && user.role !== 'admin') {
    throw new ValidationError('Only mentors can access mentor analytics data');
  }
  
  // Get mentor analytics data
  const mentorAnalytics = await storage.getMentorAnalytics(mentorId);
  
  return res.json(mentorAnalytics);
});

/**
 * Get student analytics dashboard data
 * Provides detailed analytics for student learning progress and engagement
 */
export const getStudentAnalytics = asyncHandler(async (req, res) => {
  const studentId = parseInt(req.params.id);
  
  if (isNaN(studentId)) {
    throw new ValidationError('Invalid student ID format');
  }
  
  // Check if user exists
  const user = await storage.getUser(studentId);
  if (!user) {
    throw new NotFoundError('Student not found');
  }
  
  // For security, ensure user can only access their own data unless they're a mentor or admin
  if (req.user.id !== studentId && req.user.role !== 'mentor' && req.user.role !== 'admin') {
    throw new ValidationError('You can only access your own analytics data');
  }
  
  // Get student analytics data
  const studentAnalytics = await storage.getStudentAnalytics(studentId);
  
  return res.json(studentAnalytics);
});

/**
 * Create analytics router
 */
const router = Router();

// Register routes on the router
router.get('/user/:id', authenticated, getUserAnalytics);
router.get('/mentor/:id', authenticated, hasRole(['mentor', 'admin']), getMentorAnalytics);
router.get('/student/:id', authenticated, getStudentAnalytics);

// Export analytics router
export default router;