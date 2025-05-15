import { 
  User, InsertUser, 
  Conversation, InsertConversation, 
  UserConnection, InsertUserConnection,
  CustomPathway, InsertCustomPathway,
  CustomPathwayModule, InsertCustomPathwayModule,
  AssignedPathway, InsertAssignedPathway,
  ProgressNote, InsertProgressNote,
  UserEngagement, InsertUserEngagement,
  UserAchievement, InsertUserAchievement,
  UserActivity, InsertUserActivity,
  users, userEngagement, userAchievements, userActivities,
  assignedPathways, customPathways, customPathwayModules,
  conversations, userConnections, messages, progressNotes
} from "@shared/schema.js";
import { eq, desc, and, sql } from "drizzle-orm";
import { db, pool } from "./db.js";
import { ChatMessage } from "@shared/types.js";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { IStorage } from "./storage.js";

// Custom error classes for better error handling
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseStorage implements IStorage {
  // Conversations
  async getConversations(userId: number): Promise<Conversation[]> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      const result = await db
        .select({
          id: conversations.id,
          userId: conversations.userId,
          title: conversations.title,
          lastMessageAt: conversations.lastMessageAt,
        })
        .from(conversations)
        .where(eq(conversations.userId, userId))
        .orderBy(desc(conversations.lastMessageAt))
        .limit(100); // Prevent excessive data fetching

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch conversations for user ${userId}: ${error.message}`);
    }
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    if (!conversation.userId || !Number.isInteger(conversation.userId) || conversation.userId <= 0) {
      throw new ValidationError(`Invalid userId: ${conversation.userId}`);
    }
    if (!conversation.title?.trim()) {
      throw new ValidationError("Conversation title cannot be empty");
    }

    try {
      // Verify user exists
      const userExists = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, conversation.userId))
        .limit(1);

      if (!userExists.length) {
        throw new NotFoundError(`User ${conversation.userId} not found`);
      }

      const [newConversation] = await db
        .insert(conversations)
        .values({
          ...conversation,
          createdAt: new Date(),
          lastMessageAt: new Date(),
        })
        .returning();

      return newConversation;
    } catch (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }
  }

  async addMessage(conversationId: number, message: ChatMessage): Promise<void> {
    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      throw new ValidationError(`Invalid conversationId: ${conversationId}`);
    }
    if (!message.content?.trim() || !message.senderId) {
      throw new ValidationError("Message content and senderId are required");
    }

    try {
      // Verify conversation exists
      const conversationExists = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(eq(conversations.id, conversationId))
        .limit(1);

      if (!conversationExists.length) {
        throw new NotFoundError(`Conversation ${conversationId} not found`);
      }

      await db.transaction(async (tx) => {
        // Insert message into messages table
        await tx.insert(messages).values({
          conversationId,
          senderId: message.senderId,
          content: message.content,
          createdAt: new Date(),
        });

        // Update conversation's lastMessageAt
        await tx
          .update(conversations)
          .set({ lastMessageAt: new Date() })
          .where(eq(conversations.id, conversationId));
      });
    } catch (error) {
      throw new Error(`Failed to add message to conversation ${conversationId}: ${error.message}`);
    }
  }

  // Parent/Teacher Portal - Connections
  async createUserConnection(connection: InsertUserConnection): Promise<UserConnection> {
    if (!connection.mentorId || !connection.studentId || !connection.connectionCode) {
      throw new ValidationError("Mentor ID, student ID, and connection code are required");
    }
    if (connection.mentorId === connection.studentId) {
      throw new ValidationError("Mentor and student IDs cannot be the same");
    }

    try {
      // Verify mentor and student exist
      const [mentorExists, studentExists] = await Promise.all([
        db.select({ id: users.id }).from(users).where(eq(users.id, connection.mentorId)).limit(1),
        db.select({ id: users.id }).from(users).where(eq(users.id, connection.studentId)).limit(1),
      ]);

      if (!mentorExists.length) {
        throw new NotFoundError(`Mentor ${connection.mentorId} not found`);
      }
      if (!studentExists.length) {
        throw new NotFoundError(`Student ${connection.studentId} not found`);
      }

      // Check for duplicate connection code
      const codeExists = await db
        .select({ id: userConnections.id })
        .from(userConnections)
        .where(eq(userConnections.connectionCode, connection.connectionCode))
        .limit(1);

      if (codeExists.length) {
        throw new ValidationError(`Connection code ${connection.connectionCode} already exists`);
      }

      const [newConnection] = await db
        .insert(userConnections)
        .values({
          ...connection,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newConnection;
    } catch (error) {
      throw new Error(`Failed to create user connection: ${error.message}`);
    }
  }

  async getUserConnectionByCode(code: string): Promise<UserConnection | undefined> {
    if (!code?.trim()) {
      throw new ValidationError("Connection code cannot be empty");
    }

    try {
      const [connection] = await db
        .select({
          id: userConnections.id,
          mentorId: userConnections.mentorId,
          studentId: userConnections.studentId,
          connectionCode: userConnections.connectionCode,
          createdAt: userConnections.createdAt,
          updatedAt: userConnections.updatedAt,
        })
        .from(userConnections)
        .where(eq(userConnections.connectionCode, code))
        .limit(1);

      return connection;
    } catch (error) {
      throw new Error(`Failed to fetch connection by code ${code}: ${error.message}`);
    }
  }

  async getUserConnections(userId: number, role: 'mentor' | 'student'): Promise<UserConnection[]> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }
    if (role !== 'mentor' && role !== 'student') {
      throw new ValidationError(`Invalid role: ${role}`);
    }

    try {
      const column = role === 'mentor' ? userConnections.mentorId : userConnections.studentId;
      return await db
        .select({
          id: userConnections.id,
          mentorId: userConnections.mentorId,
          studentId: userConnections.studentId,
          connectionCode: userConnections.connectionCode,
          createdAt: userConnections.createdAt,
          updatedAt: userConnections.updatedAt,
        })
        .from(userConnections)
        .where(eq(column, userId))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch connections for user ${userId} as ${role}: ${error.message}`);
    }
  }

  async updateUserConnection(id: number, updates: Partial<InsertUserConnection>): Promise<UserConnection | undefined> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid connection ID: ${id}`);
    }
    if (updates.mentorId === updates.studentId && updates.mentorId !== undefined) {
      throw new ValidationError("Mentor and student IDs cannot be the same");
    }

    try {
      // Verify connection exists
      const connectionExists = await db
        .select({ id: userConnections.id })
        .from(userConnections)
        .where(eq(userConnections.id, id))
        .limit(1);

      if (!connectionExists.length) {
        throw new NotFoundError(`Connection ${id} not found`);
      }

      const [updatedConnection] = await db
        .update(userConnections)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userConnections.id, id))
        .returning();

      return updatedConnection;
    } catch (error) {
      throw new Error(`Failed to update connection ${id}: ${error.message}`);
    }
  }

  async deleteUserConnection(id: number): Promise<boolean> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid connection ID: ${id}`);
    }

    try {
      const result = await db
        .delete(userConnections)
        .where(eq(userConnections.id, id))
        .returning({ id: userConnections.id });

      return !!result.length;
    } catch (error) {
      throw new Error(`Failed to delete connection ${id}: ${error.message}`);
    }
  }

  // Parent/Teacher Portal - Progress Notes
  async addProgressNote(note: InsertProgressNote): Promise<ProgressNote> {
    if (!note.studentId || !Number.isInteger(note.studentId) || note.studentId <= 0) {
      throw new ValidationError(`Invalid studentId: ${note.studentId}`);
    }
    if (!note.content?.trim()) {
      throw new ValidationError("Progress note content cannot be empty");
    }
    if (note.pathwayId && (!Number.isInteger(note.pathwayId) || note.pathwayId <= 0)) {
      throw new ValidationError(`Invalid pathwayId: ${note.pathwayId}`);
    }

    try {
      // Verify student exists
      const studentExists = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, note.studentId))
        .limit(1);

      if (!studentExists.length) {
        throw new NotFoundError(`Student ${note.studentId} not found`);
      }

      // Verify pathway exists if provided
      if (note.pathwayId) {
        const pathwayExists = await db
          .select({ id: customPathways.id })
          .from(customPathways)
          .where(eq(customPathways.id, note.pathwayId))
          .limit(1);

        if (!pathwayExists.length) {
          throw new NotFoundError(`Pathway ${note.pathwayId} not found`);
        }
      }

      const [newNote] = await db
        .insert(progressNotes)
        .values({
          ...note,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newNote;
    } catch (error) {
      throw new Error(`Failed to add progress note: ${error.message}`);
    }
  }

  async getProgressNotes(studentId: number, pathwayId?: number): Promise<ProgressNote[]> {
    if (!Number.isInteger(studentId) || studentId <= 0) {
      throw new ValidationError(`Invalid studentId: ${studentId}`);
    }
    if (pathwayId && (!Number.isInteger(pathwayId) || pathwayId <= 0)) {
      throw new ValidationError(`Invalid pathwayId: ${pathwayId}`);
    }

    try {
      const conditions = [eq(progressNotes.studentId, studentId)];
      if (pathwayId) {
        conditions.push(eq(progressNotes.pathwayId, pathwayId));
      }

      return await db
        .select({
          id: progressNotes.id,
          studentId: progressNotes.studentId,
          pathwayId: progressNotes.pathwayId,
          content: progressNotes.content,
          createdAt: progressNotes.createdAt,
          updatedAt: progressNotes.updatedAt,
        })
        .from(progressNotes)
        .where(and(...conditions))
        .orderBy(desc(progressNotes.createdAt))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch progress notes for student ${studentId}: ${error.message}`);
    }
  }
}