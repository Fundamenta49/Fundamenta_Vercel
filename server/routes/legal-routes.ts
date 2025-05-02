/**
 * Legal Compliance Routes
 * This module provides endpoints for Terms of Service and Data Privacy Controls
 */

import express, { Router, Request, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../auth/auth-middleware';
import { db } from '../db';
import { termsOfServiceVersions, dataExportRequests, accountDeletionRequests, users } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router: Router = express.Router();

// Schema for TOS acceptance validation
const tosAcceptanceSchema = z.object({
  accepted: z.boolean().refine(val => val === true, {
    message: 'Terms of Service must be accepted to continue'
  }),
  version: z.number().int().positive()
});

// Schema for data export request
const dataExportRequestSchema = z.object({
  format: z.enum(['json', 'csv']).default('json')
});

// Schema for account deletion request
const accountDeletionRequestSchema = z.object({
  reason: z.string().optional(),
  password: z.string().min(1, 'Password is required to confirm account deletion')
});

/**
 * Get the current Terms of Service
 * GET /api/legal/terms-of-service
 */
router.get('/terms-of-service', async (req: Request, res: Response) => {
  try {
    // Get the current TOS version
    const [currentTos] = await db
      .select()
      .from(termsOfServiceVersions)
      .where(eq(termsOfServiceVersions.isCurrent, true))
      .limit(1);
    
    if (!currentTos) {
      return res.status(404).json({ 
        error: 'Terms of Service not found',
        message: 'No current Terms of Service document is available'
      });
    }
    
    return res.json({
      version: currentTos.version,
      content: currentTos.content,
      effectiveDate: currentTos.effectiveDate
    });
  } catch (error) {
    console.error('Error fetching Terms of Service:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to retrieve Terms of Service' 
    });
  }
});

/**
 * Accept the Terms of Service
 * POST /api/legal/terms-of-service/accept
 */
router.post('/terms-of-service/accept', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = tosAcceptanceSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: validation.error.errors[0].message
      });
    }
    
    const { accepted, version } = validation.data;
    
    // Verify this is a valid TOS version
    const [tosVersion] = await db
      .select()
      .from(termsOfServiceVersions)
      .where(eq(termsOfServiceVersions.version, version))
      .limit(1);
    
    if (!tosVersion) {
      return res.status(400).json({ 
        error: 'Invalid version',
        message: 'The specified Terms of Service version does not exist'
      });
    }
    
    // Update the user record to indicate acceptance
    await db
      .update(users)
      .set({ 
        tosAccepted: accepted,
        tosVersion: version,
        tosAcceptedAt: new Date()
      })
      .where(eq(users.id, req.user.id));
    
    return res.json({
      success: true,
      message: 'Terms of Service accepted successfully',
      version: version,
      acceptedAt: new Date()
    });
  } catch (error) {
    console.error('Error accepting Terms of Service:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to record Terms of Service acceptance' 
    });
  }
});

/**
 * Get Terms of Service status for the current user
 * GET /api/legal/terms-of-service/status
 */
router.get('/terms-of-service/status', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get the current TOS version
    const [currentTos] = await db
      .select()
      .from(termsOfServiceVersions)
      .where(eq(termsOfServiceVersions.isCurrent, true))
      .limit(1);
    
    if (!currentTos) {
      return res.status(404).json({ 
        error: 'Terms of Service not found',
        message: 'No current Terms of Service document is available'
      });
    }
    
    // Get the user's current TOS status
    const [user] = await db
      .select({
        tosAccepted: users.tosAccepted,
        tosVersion: users.tosVersion,
        tosAcceptedAt: users.tosAcceptedAt
      })
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);
    
    return res.json({
      currentVersion: currentTos.version,
      userAccepted: user.tosAccepted,
      userVersion: user.tosVersion,
      userAcceptedAt: user.tosAcceptedAt,
      needsToAccept: !user.tosAccepted || user.tosVersion < currentTos.version
    });
  } catch (error) {
    console.error('Error fetching Terms of Service status:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to retrieve Terms of Service status' 
    });
  }
});

/**
 * Request a data export
 * POST /api/legal/data-export
 */
router.post('/data-export', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = dataExportRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: validation.error.errors[0].message
      });
    }
    
    const { format } = validation.data;
    
    // Check if there's already a pending request
    const [existingRequest] = await db
      .select()
      .from(dataExportRequests)
      .where(eq(dataExportRequests.userId, req.user.id))
      .where(eq(dataExportRequests.status, 'pending'))
      .limit(1);
    
    if (existingRequest) {
      return res.status(409).json({
        error: 'Request already exists',
        message: 'You already have a pending data export request',
        requestedAt: existingRequest.requestedAt
      });
    }
    
    // Create a new data export request
    const [exportRequest] = await db
      .insert(dataExportRequests)
      .values({
        userId: req.user.id,
        format: format,
        status: 'pending',
        requestedAt: new Date()
      })
      .returning();
    
    // Update the user record to track the request
    await db
      .update(users)
      .set({ 
        dataExportRequested: true,
        dataExportRequestedAt: new Date()
      })
      .where(eq(users.id, req.user.id));
    
    return res.json({
      success: true,
      message: 'Data export request submitted successfully',
      id: exportRequest.id,
      status: exportRequest.status,
      format: exportRequest.format,
      requestedAt: exportRequest.requestedAt
    });
  } catch (error) {
    console.error('Error requesting data export:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to submit data export request' 
    });
  }
});

/**
 * Get data export request status
 * GET /api/legal/data-export/status
 */
router.get('/data-export/status', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get the user's most recent data export request
    const [exportRequest] = await db
      .select()
      .from(dataExportRequests)
      .where(eq(dataExportRequests.userId, req.user.id))
      .orderBy(desc(dataExportRequests.requestedAt))
      .limit(1);
    
    if (!exportRequest) {
      return res.json({
        hasRequest: false,
        message: 'No data export requests found'
      });
    }
    
    return res.json({
      hasRequest: true,
      request: {
        id: exportRequest.id,
        status: exportRequest.status,
        format: exportRequest.format,
        requestedAt: exportRequest.requestedAt,
        completedAt: exportRequest.completedAt,
        downloadUrl: exportRequest.downloadUrl,
        expiresAt: exportRequest.expiresAt
      }
    });
  } catch (error) {
    console.error('Error fetching data export status:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to retrieve data export status' 
    });
  }
});

/**
 * Request account deletion
 * POST /api/legal/account-deletion
 */
router.post('/account-deletion', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = accountDeletionRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: validation.error.errors[0].message
      });
    }
    
    const { reason, password } = validation.data;
    
    // Password verification would be done here
    // For now, we're skipping the actual password check for this implementation
    
    // Check if there's already a pending request
    const [existingRequest] = await db
      .select()
      .from(accountDeletionRequests)
      .where(eq(accountDeletionRequests.userId, req.user.id))
      .where(eq(accountDeletionRequests.status, 'pending'))
      .limit(1);
    
    if (existingRequest) {
      return res.status(409).json({
        error: 'Request already exists',
        message: 'You already have a pending account deletion request',
        requestedAt: existingRequest.requestedAt
      });
    }
    
    // Calculate deletion date (30 days from now for grace period)
    const scheduledFor = new Date();
    scheduledFor.setDate(scheduledFor.getDate() + 30);
    
    // Create a new account deletion request
    const [deletionRequest] = await db
      .insert(accountDeletionRequests)
      .values({
        userId: req.user.id,
        status: 'pending',
        reason: reason,
        requestedAt: new Date(),
        scheduledFor: scheduledFor
      })
      .returning();
    
    // Update the user record to track the request
    await db
      .update(users)
      .set({ 
        accountDeletionRequested: true,
        accountDeletionRequestedAt: new Date()
      })
      .where(eq(users.id, req.user.id));
    
    return res.json({
      success: true,
      message: 'Account deletion request submitted successfully',
      id: deletionRequest.id,
      status: deletionRequest.status,
      scheduledFor: deletionRequest.scheduledFor,
      requestedAt: deletionRequest.requestedAt
    });
  } catch (error) {
    console.error('Error requesting account deletion:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to submit account deletion request' 
    });
  }
});

/**
 * Get account deletion request status
 * GET /api/legal/account-deletion/status
 */
router.get('/account-deletion/status', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get the user's most recent account deletion request
    const [deletionRequest] = await db
      .select()
      .from(accountDeletionRequests)
      .where(eq(accountDeletionRequests.userId, req.user.id))
      .orderBy(desc(accountDeletionRequests.requestedAt))
      .limit(1);
    
    if (!deletionRequest) {
      return res.json({
        hasRequest: false,
        message: 'No account deletion requests found'
      });
    }
    
    return res.json({
      hasRequest: true,
      request: {
        id: deletionRequest.id,
        status: deletionRequest.status,
        requestedAt: deletionRequest.requestedAt,
        scheduledFor: deletionRequest.scheduledFor,
        completedAt: deletionRequest.completedAt
      }
    });
  } catch (error) {
    console.error('Error fetching account deletion status:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to retrieve account deletion status' 
    });
  }
});

/**
 * Cancel account deletion request
 * POST /api/legal/account-deletion/cancel
 */
router.post('/account-deletion/cancel', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get the user's pending account deletion request
    const [deletionRequest] = await db
      .select()
      .from(accountDeletionRequests)
      .where(eq(accountDeletionRequests.userId, req.user.id))
      .where(eq(accountDeletionRequests.status, 'pending'))
      .limit(1);
    
    if (!deletionRequest) {
      return res.status(404).json({
        error: 'Request not found',
        message: 'No pending account deletion request found'
      });
    }
    
    // Update the deletion request status
    await db
      .update(accountDeletionRequests)
      .set({ 
        status: 'cancelled'
      })
      .where(eq(accountDeletionRequests.id, deletionRequest.id));
    
    // Update the user record
    await db
      .update(users)
      .set({ 
        accountDeletionRequested: false,
        accountDeletionRequestedAt: null
      })
      .where(eq(users.id, req.user.id));
    
    return res.json({
      success: true,
      message: 'Account deletion request cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling account deletion:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to cancel account deletion request' 
    });
  }
});

export default router;