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

// Set up PostgreSQL session store
const PgSession = connectPg(session);
const sessionStore = new PgSession({
  pool,
  tableName: 'sessions',
  createTableIfMissing: true
});

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = sessionStore;
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid userId: ${id}`);
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user ${id}: ${error.message}`);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!username?.trim()) {
      throw new ValidationError("Username cannot be empty");
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.name, username));
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user by username ${username}: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email?.trim()) {
      throw new ValidationError("Email cannot be empty");
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user by email ${email}: ${error.message}`);
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!user.name?.trim()) {
      throw new ValidationError("Username cannot be empty");
    }
    if (!user.email?.trim()) {
      throw new ValidationError("Email cannot be empty");
    }

    try {
      // Check if email already exists
      const existingEmail = await this.getUserByEmail(user.email);
      if (existingEmail) {
        throw new ValidationError(`Email ${user.email} is already in use`);
      }

      // Check if username already exists
      const existingUsername = await this.getUserByUsername(user.name);
      if (existingUsername) {
        throw new ValidationError(`Username ${user.name} is already in use`);
      }

      const [newUser] = await db.insert(users).values({
        ...user,
        email: user.email.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return newUser;
    } catch (error) {
      // Re-throw validation errors directly
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid userId: ${id}`);
    }

    try {
      // Verify user exists
      const userExists = await this.getUser(id);
      if (!userExists) {
        throw new NotFoundError(`User ${id} not found`);
      }

      // If email is being updated, check if it's already in use
      if (updates.email && updates.email !== userExists.email) {
        const existingEmail = await this.getUserByEmail(updates.email);
        if (existingEmail && existingEmail.id !== id) {
          throw new ValidationError(`Email ${updates.email} is already in use`);
        }
        updates.email = updates.email.toLowerCase();
      }

      // If username is being updated, check if it's already in use
      if (updates.name && updates.name !== userExists.name) {
        const existingUsername = await this.getUserByUsername(updates.name);
        if (existingUsername && existingUsername.id !== id) {
          throw new ValidationError(`Username ${updates.name} is already in use`);
        }
      }

      const [updatedUser] = await db
        .update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
        
      return updatedUser;
    } catch (error) {
      // Re-throw validation and not found errors directly
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to update user ${id}: ${error.message}`);
    }
  }

  // Conversations
  async getConversations(userId: number): Promise<Conversation[]> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      const result = await db
        .select()
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
      const userExists = await this.getUser(conversation.userId);
      if (!userExists) {
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
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
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
      const [conversationExists] = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(eq(conversations.id, conversationId))
        .limit(1);

      if (!conversationExists) {
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
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
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
        this.getUser(connection.mentorId),
        this.getUser(connection.studentId)
      ]);

      if (!mentorExists) {
        throw new NotFoundError(`Mentor ${connection.mentorId} not found`);
      }
      if (!studentExists) {
        throw new NotFoundError(`Student ${connection.studentId} not found`);
      }

      // Check for duplicate connection code
      const codeExists = await this.getUserConnectionByCode(connection.connectionCode);
      if (codeExists) {
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
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to create user connection: ${error.message}`);
    }
  }

  async getUserConnectionByCode(code: string): Promise<UserConnection | undefined> {
    if (!code?.trim()) {
      throw new ValidationError("Connection code cannot be empty");
    }

    try {
      const [connection] = await db
        .select()
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
        .select()
        .from(userConnections)
        .where(eq(column, userId))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch connections for user ${userId} as ${role}: ${error.message}`);
    }
  }
  
  // Adapter methods to match the API expected by mentorship-routes.ts
  async getConnectionsByMentorId(mentorId: number): Promise<UserConnection[]> {
    return this.getUserConnections(mentorId, 'mentor');
  }
  
  async getConnectionsByStudentId(studentId: number): Promise<UserConnection[]> {
    return this.getUserConnections(studentId, 'student');
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
      const [connectionExists] = await db
        .select({ id: userConnections.id })
        .from(userConnections)
        .where(eq(userConnections.id, id))
        .limit(1);

      if (!connectionExists) {
        throw new NotFoundError(`Connection ${id} not found`);
      }

      const [updatedConnection] = await db
        .update(userConnections)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userConnections.id, id))
        .returning();

      return updatedConnection;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
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

      return result.length > 0;
    } catch (error) {
      throw new Error(`Failed to delete connection ${id}: ${error.message}`);
    }
  }

  // Parent/Teacher Portal - Custom Pathways
  async createCustomPathway(pathway: InsertCustomPathway): Promise<CustomPathway> {
    if (!pathway.title?.trim()) {
      throw new ValidationError("Pathway title cannot be empty");
    }
    if (!pathway.creatorId || !Number.isInteger(pathway.creatorId) || pathway.creatorId <= 0) {
      throw new ValidationError(`Invalid creatorId: ${pathway.creatorId}`);
    }

    try {
      // Verify creator exists
      const creatorExists = await this.getUser(pathway.creatorId);
      if (!creatorExists) {
        throw new NotFoundError(`Creator ${pathway.creatorId} not found`);
      }

      const [newPathway] = await db
        .insert(customPathways)
        .values({
          ...pathway,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
        
      return newPathway;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to create custom pathway: ${error.message}`);
    }
  }

  async getCustomPathway(id: number): Promise<CustomPathway | undefined> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid pathway ID: ${id}`);
    }

    try {
      const [pathway] = await db
        .select()
        .from(customPathways)
        .where(eq(customPathways.id, id));
        
      return pathway;
    } catch (error) {
      throw new Error(`Failed to fetch custom pathway ${id}: ${error.message}`);
    }
  }

  async getCustomPathwaysByCreator(creatorId: number): Promise<CustomPathway[]> {
    if (!Number.isInteger(creatorId) || creatorId <= 0) {
      throw new ValidationError(`Invalid creatorId: ${creatorId}`);
    }

    try {
      return await db
        .select()
        .from(customPathways)
        .where(eq(customPathways.creatorId, creatorId))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch custom pathways for creator ${creatorId}: ${error.message}`);
    }
  }

  async updateCustomPathway(id: number, updates: Partial<InsertCustomPathway>): Promise<CustomPathway | undefined> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid pathway ID: ${id}`);
    }

    try {
      // Verify pathway exists
      const pathwayExists = await this.getCustomPathway(id);
      if (!pathwayExists) {
        throw new NotFoundError(`Pathway ${id} not found`);
      }

      const [updatedPathway] = await db
        .update(customPathways)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(customPathways.id, id))
        .returning();
        
      return updatedPathway;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to update custom pathway ${id}: ${error.message}`);
    }
  }

  async deleteCustomPathway(id: number): Promise<boolean> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid pathway ID: ${id}`);
    }

    try {
      // Verify pathway exists
      const pathwayExists = await this.getCustomPathway(id);
      if (!pathwayExists) {
        throw new NotFoundError(`Pathway ${id} not found`);
      }

      // Transaction to ensure both operations complete or fail together
      return await db.transaction(async (tx) => {
        // First delete all modules
        await tx
          .delete(customPathwayModules)
          .where(eq(customPathwayModules.pathwayId, id));
        
        // Then delete the pathway
        const result = await tx
          .delete(customPathways)
          .where(eq(customPathways.id, id))
          .returning({ id: customPathways.id });
          
        return result.length > 0;
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to delete custom pathway ${id}: ${error.message}`);
    }
  }

  // Parent/Teacher Portal - Custom Pathway Modules
  async createCustomPathwayModule(module: InsertCustomPathwayModule): Promise<CustomPathwayModule> {
    if (!module.pathwayId || !Number.isInteger(module.pathwayId) || module.pathwayId <= 0) {
      throw new ValidationError(`Invalid pathwayId: ${module.pathwayId}`);
    }
    if (!module.title?.trim()) {
      throw new ValidationError("Module title cannot be empty");
    }

    try {
      // Verify pathway exists
      const pathwayExists = await this.getCustomPathway(module.pathwayId);
      if (!pathwayExists) {
        throw new NotFoundError(`Pathway ${module.pathwayId} not found`);
      }

      const [newModule] = await db
        .insert(customPathwayModules)
        .values({
          ...module,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
        
      return newModule;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to create custom pathway module: ${error.message}`);
    }
  }

  async getCustomPathwayModules(pathwayId: number): Promise<CustomPathwayModule[]> {
    if (!Number.isInteger(pathwayId) || pathwayId <= 0) {
      throw new ValidationError(`Invalid pathwayId: ${pathwayId}`);
    }

    try {
      return await db
        .select()
        .from(customPathwayModules)
        .where(eq(customPathwayModules.pathwayId, pathwayId))
        .orderBy(customPathwayModules.order)
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch modules for pathway ${pathwayId}: ${error.message}`);
    }
  }

  async updateCustomPathwayModule(id: number, updates: Partial<InsertCustomPathwayModule>): Promise<CustomPathwayModule | undefined> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid module ID: ${id}`);
    }

    try {
      // Check if module exists
      const [moduleExists] = await db
        .select({ id: customPathwayModules.id })
        .from(customPathwayModules)
        .where(eq(customPathwayModules.id, id))
        .limit(1);
        
      if (!moduleExists) {
        throw new NotFoundError(`Module ${id} not found`);
      }

      const [updatedModule] = await db
        .update(customPathwayModules)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(customPathwayModules.id, id))
        .returning();
        
      return updatedModule;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to update module ${id}: ${error.message}`);
    }
  }

  async deleteCustomPathwayModule(id: number): Promise<boolean> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid module ID: ${id}`);
    }

    try {
      const result = await db
        .delete(customPathwayModules)
        .where(eq(customPathwayModules.id, id))
        .returning({ id: customPathwayModules.id });
        
      return result.length > 0;
    } catch (error) {
      throw new Error(`Failed to delete module ${id}: ${error.message}`);
    }
  }

  // Parent/Teacher Portal - Assigned Pathways
  async assignPathway(assignment: InsertAssignedPathway): Promise<AssignedPathway> {
    if (!assignment.pathwayId || !Number.isInteger(assignment.pathwayId) || assignment.pathwayId <= 0) {
      throw new ValidationError(`Invalid pathwayId: ${assignment.pathwayId}`);
    }
    if (!assignment.studentId || !Number.isInteger(assignment.studentId) || assignment.studentId <= 0) {
      throw new ValidationError(`Invalid studentId: ${assignment.studentId}`);
    }
    if (!assignment.assignedBy || !Number.isInteger(assignment.assignedBy) || assignment.assignedBy <= 0) {
      throw new ValidationError(`Invalid assignedBy: ${assignment.assignedBy}`);
    }

    try {
      // Verify pathway exists
      const pathwayExists = await this.getCustomPathway(assignment.pathwayId);
      if (!pathwayExists) {
        throw new NotFoundError(`Pathway ${assignment.pathwayId} not found`);
      }
      
      // Verify student exists
      const studentExists = await this.getUser(assignment.studentId);
      if (!studentExists) {
        throw new NotFoundError(`Student ${assignment.studentId} not found`);
      }
      
      // Verify assigner exists
      const assignerExists = await this.getUser(assignment.assignedBy);
      if (!assignerExists) {
        throw new NotFoundError(`Assigner ${assignment.assignedBy} not found`);
      }
      
      // Check if this assignment already exists
      const [existingAssignment] = await db
        .select({ id: assignedPathways.id })
        .from(assignedPathways)
        .where(and(
          eq(assignedPathways.pathwayId, assignment.pathwayId),
          eq(assignedPathways.studentId, assignment.studentId)
        ))
        .limit(1);
        
      if (existingAssignment) {
        throw new ValidationError(`This pathway is already assigned to this student`);
      }

      const [newAssignment] = await db
        .insert(assignedPathways)
        .values({
          ...assignment,
          status: assignment.status || 'assigned',
          progress: assignment.progress || 0,
          assignedAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
        
      return newAssignment;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to assign pathway: ${error.message}`);
    }
  }

  async getAssignedPathways(studentId: number): Promise<AssignedPathway[]> {
    if (!Number.isInteger(studentId) || studentId <= 0) {
      throw new ValidationError(`Invalid studentId: ${studentId}`);
    }

    try {
      return await db
        .select()
        .from(assignedPathways)
        .where(eq(assignedPathways.studentId, studentId))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch assigned pathways for student ${studentId}: ${error.message}`);
    }
  }

  async getAssignedPathwaysByAssigner(assignerId: number): Promise<AssignedPathway[]> {
    if (!Number.isInteger(assignerId) || assignerId <= 0) {
      throw new ValidationError(`Invalid assignerId: ${assignerId}`);
    }

    try {
      return await db
        .select()
        .from(assignedPathways)
        .where(eq(assignedPathways.assignedBy, assignerId))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch assigned pathways by assigner ${assignerId}: ${error.message}`);
    }
  }

  async updateAssignedPathwayStatus(id: number, status: string, progress?: number): Promise<AssignedPathway | undefined> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`Invalid assignment ID: ${id}`);
    }
    if (!status || !['assigned', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      throw new ValidationError(`Invalid status: ${status}. Must be one of: assigned, in_progress, completed, cancelled`);
    }
    if (progress !== undefined && (isNaN(progress) || progress < 0 || progress > 100)) {
      throw new ValidationError(`Invalid progress value: ${progress}. Must be between 0 and 100`);
    }

    try {
      // Verify assignment exists
      const [assignmentExists] = await db
        .select({ id: assignedPathways.id })
        .from(assignedPathways)
        .where(eq(assignedPathways.id, id))
        .limit(1);
        
      if (!assignmentExists) {
        throw new NotFoundError(`Assignment ${id} not found`);
      }

      let updateData: any = { status };
      
      if (progress !== undefined) {
        updateData.progress = progress;
      }
      
      // Update timestamps based on status
      if (status === 'in_progress') {
        updateData.startedAt = new Date();
      } else if (status === 'completed') {
        updateData.completedAt = new Date();
        
        // If completed, set progress to 100% regardless of what was passed
        updateData.progress = 100;
      }
      
      const [updatedAssignment] = await db
        .update(assignedPathways)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(assignedPathways.id, id))
        .returning();
      
      return updatedAssignment;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to update assignment status: ${error.message}`);
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
      const studentExists = await this.getUser(note.studentId);
      if (!studentExists) {
        throw new NotFoundError(`Student ${note.studentId} not found`);
      }

      // Verify pathway exists if provided
      if (note.pathwayId) {
        const pathwayExists = await this.getCustomPathway(note.pathwayId);
        if (!pathwayExists) {
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
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
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
        .select()
        .from(progressNotes)
        .where(and(...conditions))
        .orderBy(desc(progressNotes.createdAt))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch progress notes for student ${studentId}: ${error.message}`);
    }
  }

  // Engagement Engine methods
  async getUserEngagement(userId: number): Promise<UserEngagement | undefined> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      const [engagement] = await db
        .select()
        .from(userEngagement)
        .where(eq(userEngagement.userId, userId));
      return engagement;
    } catch (error) {
      throw new Error(`Failed to fetch user engagement for user ${userId}: ${error.message}`);
    }
  }

  async createUserEngagement(userId: number): Promise<UserEngagement> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      // Verify user exists
      const userExists = await this.getUser(userId);
      if (!userExists) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      const [newEngagement] = await db
        .insert(userEngagement)
        .values({ 
          userId,
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newEngagement;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to create user engagement for user ${userId}: ${error.message}`);
    }
  }

  async updateUserEngagement(userId: number, updates: Partial<InsertUserEngagement>): Promise<UserEngagement> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      const [updatedEngagement] = await db
        .update(userEngagement)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userEngagement.userId, userId))
        .returning();
        
      if (!updatedEngagement) {
        throw new NotFoundError(`User engagement record for user ${userId} not found`);
      }
      
      return updatedEngagement;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to update user engagement for user ${userId}: ${error.message}`);
    }
  }

  async checkInUser(userId: number): Promise<UserEngagement> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      const now = new Date();
      const engagement = await this.getUserEngagement(userId);
      
      if (!engagement) {
        return await this.createUserEngagement(userId);
      }
      
      let updates: Partial<InsertUserEngagement> = {
        lastCheckIn: now,
        streakUpdatedAt: now
      };
      
      // Update streak if it's been 24+ hours since the last check-in
      if (engagement.lastCheckIn) {
        const lastCheckInTime = new Date(engagement.lastCheckIn).getTime();
        const nowTime = now.getTime();
        const hoursSinceLastCheckIn = (nowTime - lastCheckInTime) / (1000 * 60 * 60);
        
        if (hoursSinceLastCheckIn >= 24) {
          updates.currentStreak = engagement.currentStreak + 1;
          updates.longestStreak = Math.max(engagement.longestStreak, engagement.currentStreak + 1);
        }
      } else {
        updates.currentStreak = 1;
        updates.longestStreak = 1;
      }
      
      return await this.updateUserEngagement(userId, updates);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to check in user ${userId}: ${error.message}`);
    }
  }

  async recordUserActivity(userId: number, type: string, data?: any, pointsEarned: number = 0): Promise<UserActivity> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }
    if (!type?.trim()) {
      throw new ValidationError("Activity type cannot be empty");
    }
    if (pointsEarned < 0) {
      throw new ValidationError(`Invalid points value: ${pointsEarned}. Cannot be negative`);
    }

    try {
      // Begin a transaction to ensure both operations succeed or fail together
      return await db.transaction(async (tx) => {
        // Insert the activity record
        const [activity] = await tx
          .insert(userActivities)
          .values({
            userId,
            type,
            data: data ? data : {},
            pointsEarned,
            timestamp: new Date()
          })
          .returning();
        
        if (pointsEarned > 0) {
          // Update the user's total points
          await tx
            .update(userEngagement)
            .set({
              totalPoints: sql`${userEngagement.totalPoints} + ${pointsEarned}`,
              updatedAt: new Date()
            })
            .where(eq(userEngagement.userId, userId));
        }
        
        return activity;
      });
    } catch (error) {
      throw new Error(`Failed to record user activity: ${error.message}`);
    }
  }

  async getUserActivities(userId: number, limit: number = 10): Promise<UserActivity[]> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }
    if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
      throw new ValidationError(`Invalid limit: ${limit}. Must be between 1 and 100`);
    }

    try {
      return await db
        .select()
        .from(userActivities)
        .where(eq(userActivities.userId, userId))
        .orderBy(desc(userActivities.timestamp))
        .limit(limit);
    } catch (error) {
      throw new Error(`Failed to fetch user activities for user ${userId}: ${error.message}`);
    }
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      return await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId))
        .limit(100); // Prevent excessive data fetching
    } catch (error) {
      throw new Error(`Failed to fetch user achievements for user ${userId}: ${error.message}`);
    }
  }

  async addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    if (!achievement.userId || !Number.isInteger(achievement.userId) || achievement.userId <= 0) {
      throw new ValidationError(`Invalid userId: ${achievement.userId}`);
    }
    if (!achievement.type?.trim()) {
      throw new ValidationError("Achievement type cannot be empty");
    }
    if (!achievement.title?.trim()) {
      throw new ValidationError("Achievement title cannot be empty");
    }

    try {
      // Verify user exists
      const userExists = await this.getUser(achievement.userId);
      if (!userExists) {
        throw new NotFoundError(`User ${achievement.userId} not found`);
      }

      // Check if this achievement already exists for this user
      const [existingAchievement] = await db
        .select({ id: userAchievements.id })
        .from(userAchievements)
        .where(and(
          eq(userAchievements.userId, achievement.userId),
          eq(userAchievements.type, achievement.type)
        ))
        .limit(1);
        
      if (existingAchievement) {
        throw new ValidationError(`User already has an achievement of type ${achievement.type}`);
      }

      const [newAchievement] = await db
        .insert(userAchievements)
        .values({
          ...achievement,
          awardedAt: new Date()
        })
        .returning();
        
      return newAchievement;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to add user achievement: ${error.message}`);
    }
  }

  async getStreak(userId: number): Promise<number> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError(`Invalid userId: ${userId}`);
    }

    try {
      const engagement = await this.getUserEngagement(userId);
      return engagement?.currentStreak || 0;
    } catch (error) {
      throw new Error(`Failed to get streak for user ${userId}: ${error.message}`);
    }
  }

  // Analytics methods
  async getMentorAnalytics(mentorId: number): Promise<{
    totalStudents: number;
    totalPathways: number;
    pathwayCompletionRate: number;
    studentEngagementStats: {
      activeStudents: number;
      inactiveStudents: number;
      averageStudentStreak: number;
    };
    recentAssignments: AssignedPathway[];
  }> {
    // Input validation
    if (!Number.isInteger(mentorId) || mentorId <= 0) {
      throw new ValidationError(`Invalid mentorId: ${mentorId}`);
    }

    try {
      // Verify mentor exists
      const mentorExists = await this.getUser(mentorId);
      if (!mentorExists) {
        throw new NotFoundError(`Mentor ${mentorId} not found`);
      }

      // Transaction to ensure consistent data
      const result = await pool.query('BEGIN');

      try {
        // Get mentor's connected students
        const connections = await db
          .select()
          .from(userConnections)
          .where(and(
            eq(userConnections.mentorId, mentorId),
            eq(userConnections.status, 'active')
          ));

        const studentIds = connections.map(conn => conn.studentId).filter(Boolean);
        const totalStudents = studentIds.length;

        // Get total custom pathways
        const pathways = await db
          .select()
          .from(customPathways)
          .where(eq(customPathways.creatorId, mentorId));

        const totalPathways = pathways.length;

        // Get assigned pathways
        const assignments = await db
          .select()
          .from(assignedPathways)
          .where(eq(assignedPathways.assignedBy, mentorId));

        // Calculate completion rate
        const totalAssigned = assignments.length;
        const completedAssignments = assignments.filter(a => a.status === 'completed').length;
        const pathwayCompletionRate = totalAssigned > 0 
          ? (completedAssignments / totalAssigned) * 100 
          : 0;

        // Calculate student engagement
        let totalStreaks = 0;
        let activeStudents = 0;

        // Get engagement for all students
        const currentDate = new Date();
        const activeThreshold = new Date();
        activeThreshold.setDate(currentDate.getDate() - 7); // Active within last 7 days

        // Only proceed if there are student IDs
        let studentEngagements = [];
        if (studentIds.length > 0) {
          studentEngagements = await db
            .select()
            .from(userEngagement)
            .where(
              userEngagement.userId.in(studentIds)
            );
        }

        // Calculate engagement stats
        for (const engagement of studentEngagements) {
          totalStreaks += engagement.currentStreak || 0;
          
          if (engagement.lastCheckIn && new Date(engagement.lastCheckIn) >= activeThreshold) {
            activeStudents++;
          }
        }

        const inactiveStudents = totalStudents - activeStudents;
        const averageStudentStreak = totalStudents > 0 
          ? totalStreaks / totalStudents 
          : 0;

        // Get recent assignments
        const recentAssignments = await db
          .select()
          .from(assignedPathways)
          .where(eq(assignedPathways.assignedBy, mentorId))
          .orderBy(desc(assignedPathways.createdAt))
          .limit(5);

        await pool.query('COMMIT');

        return {
          totalStudents,
          totalPathways,
          pathwayCompletionRate,
          studentEngagementStats: {
            activeStudents,
            inactiveStudents,
            averageStudentStreak,
          },
          recentAssignments,
        };
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to get mentor analytics: ${error.message}`);
    }
  }

  async getStudentAnalytics(studentId: number): Promise<{
    totalAssignments: number;
    completedAssignments: number;
    inProgressAssignments: number;
    totalPoints: number;
    currentStreak: number;
    completionRate: number;
    activityTimeline: UserActivity[];
  }> {
    // Input validation
    if (!Number.isInteger(studentId) || studentId <= 0) {
      throw new ValidationError(`Invalid studentId: ${studentId}`);
    }

    try {
      // Verify student exists
      const studentExists = await this.getUser(studentId);
      if (!studentExists) {
        throw new NotFoundError(`Student ${studentId} not found`);
      }

      // Transaction to ensure consistent data
      const result = await pool.query('BEGIN');

      try {
        // Get assigned pathways
        const assignments = await db
          .select()
          .from(assignedPathways)
          .where(eq(assignedPathways.studentId, studentId));

        const totalAssignments = assignments.length;
        const completedAssignments = assignments.filter(a => a.status === 'completed').length;
        const inProgressAssignments = assignments.filter(a => a.status === 'in_progress').length;
        const completionRate = totalAssignments > 0 
          ? (completedAssignments / totalAssignments) * 100 
          : 0;

        // Get user engagement
        const engagement = await this.getUserEngagement(studentId);
        const totalPoints = engagement?.totalPoints || 0;
        const currentStreak = engagement?.currentStreak || 0;

        // Get activity timeline
        const activityTimeline = await db
          .select()
          .from(userActivities)
          .where(eq(userActivities.userId, studentId))
          .orderBy(desc(userActivities.timestamp))
          .limit(30); // Last 30 activities

        await pool.query('COMMIT');

        return {
          totalAssignments,
          completedAssignments,
          inProgressAssignments,
          totalPoints,
          currentStreak,
          completionRate,
          activityTimeline,
        };
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to get student analytics: ${error.message}`);
    }
  }

  async getPathwayAnalytics(pathwayId: number): Promise<{
    totalAssigned: number;
    totalCompleted: number;
    totalInProgress: number;
    averageCompletionTime: number;
    completionRate: number;
  }> {
    // Input validation
    if (!Number.isInteger(pathwayId) || pathwayId <= 0) {
      throw new ValidationError(`Invalid pathwayId: ${pathwayId}`);
    }

    try {
      // Verify pathway exists
      const pathwayExists = await this.getCustomPathway(pathwayId);
      if (!pathwayExists) {
        throw new NotFoundError(`Pathway ${pathwayId} not found`);
      }

      // Transaction to ensure consistent data
      const result = await pool.query('BEGIN');

      try {
        // Get all assignments for this pathway
        const assignments = await db
          .select()
          .from(assignedPathways)
          .where(eq(assignedPathways.pathwayId, pathwayId));

        const totalAssigned = assignments.length;
        const completedAssignments = assignments.filter(a => a.status === 'completed' && a.completedAt);
        const totalCompleted = completedAssignments.length;
        const totalInProgress = assignments.filter(a => a.status === 'in_progress').length;
        const completionRate = totalAssigned > 0 
          ? (totalCompleted / totalAssigned) * 100 
          : 0;

        // Calculate average completion time (in days)
        let totalCompletionTime = 0;
        for (const assignment of completedAssignments) {
          if (assignment.startedAt && assignment.completedAt) {
            const startDate = new Date(assignment.startedAt);
            const completionDate = new Date(assignment.completedAt);
            const timeDiff = completionDate.getTime() - startDate.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert to days
            totalCompletionTime += daysDiff;
          }
        }

        const averageCompletionTime = totalCompleted > 0 
          ? totalCompletionTime / totalCompleted 
          : 0;

        await pool.query('COMMIT');

        return {
          totalAssigned,
          totalCompleted,
          totalInProgress,
          averageCompletionTime,
          completionRate,
        };
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to get pathway analytics: ${error.message}`);
    }
  }
}

export const storage = new DatabaseStorage();