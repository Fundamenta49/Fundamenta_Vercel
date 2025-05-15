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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.name, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Conversations
  async getConversations(userId: number): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.lastMessageAt));
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async addMessage(conversationId: number, message: ChatMessage): Promise<void> {
    // Implementation would depend on how messages are stored
    // Since the interface returns void, we'll keep it minimal
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }

  // Parent/Teacher Portal - Connections
  async createUserConnection(connection: InsertUserConnection): Promise<UserConnection> {
    const [newConnection] = await db
      .insert(userConnections)
      .values(connection)
      .returning();
    return newConnection;
  }

  async getUserConnectionByCode(code: string): Promise<UserConnection | undefined> {
    const [connection] = await db
      .select()
      .from(userConnections)
      .where(eq(userConnections.connectionCode, code));
    return connection;
  }

  async getUserConnections(userId: number, role: 'mentor' | 'student'): Promise<UserConnection[]> {
    if (role === 'mentor') {
      return await db
        .select()
        .from(userConnections)
        .where(eq(userConnections.mentorId, userId));
    } else {
      return await db
        .select()
        .from(userConnections)
        .where(eq(userConnections.studentId, userId));
    }
  }

  async updateUserConnection(id: number, updates: Partial<InsertUserConnection>): Promise<UserConnection | undefined> {
    const [updatedConnection] = await db
      .update(userConnections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userConnections.id, id))
      .returning();
    return updatedConnection;
  }

  async deleteUserConnection(id: number): Promise<boolean> {
    const result = await db
      .delete(userConnections)
      .where(eq(userConnections.id, id));
    return !!result;
  }

  // Parent/Teacher Portal - Custom Pathways
  async createCustomPathway(pathway: InsertCustomPathway): Promise<CustomPathway> {
    const [newPathway] = await db
      .insert(customPathways)
      .values(pathway)
      .returning();
    return newPathway;
  }

  async getCustomPathway(id: number): Promise<CustomPathway | undefined> {
    const [pathway] = await db
      .select()
      .from(customPathways)
      .where(eq(customPathways.id, id));
    return pathway;
  }

  async getCustomPathwaysByCreator(creatorId: number): Promise<CustomPathway[]> {
    return await db
      .select()
      .from(customPathways)
      .where(eq(customPathways.creatorId, creatorId));
  }

  async updateCustomPathway(id: number, updates: Partial<InsertCustomPathway>): Promise<CustomPathway | undefined> {
    const [updatedPathway] = await db
      .update(customPathways)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customPathways.id, id))
      .returning();
    return updatedPathway;
  }

  async deleteCustomPathway(id: number): Promise<boolean> {
    // First delete all modules
    await db
      .delete(customPathwayModules)
      .where(eq(customPathwayModules.pathwayId, id));
    
    // Then delete the pathway
    const result = await db
      .delete(customPathways)
      .where(eq(customPathways.id, id));
    return result.count > 0;
  }

  // Parent/Teacher Portal - Custom Pathway Modules
  async createCustomPathwayModule(module: InsertCustomPathwayModule): Promise<CustomPathwayModule> {
    const [newModule] = await db
      .insert(customPathwayModules)
      .values(module)
      .returning();
    return newModule;
  }

  async getCustomPathwayModules(pathwayId: number): Promise<CustomPathwayModule[]> {
    return await db
      .select()
      .from(customPathwayModules)
      .where(eq(customPathwayModules.pathwayId, pathwayId))
      .orderBy(customPathwayModules.order);
  }

  async updateCustomPathwayModule(id: number, updates: Partial<InsertCustomPathwayModule>): Promise<CustomPathwayModule | undefined> {
    const [updatedModule] = await db
      .update(customPathwayModules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customPathwayModules.id, id))
      .returning();
    return updatedModule;
  }

  async deleteCustomPathwayModule(id: number): Promise<boolean> {
    const result = await db
      .delete(customPathwayModules)
      .where(eq(customPathwayModules.id, id));
    return result.count > 0;
  }

  // Parent/Teacher Portal - Assigned Pathways
  async assignPathway(assignment: InsertAssignedPathway): Promise<AssignedPathway> {
    const [newAssignment] = await db
      .insert(assignedPathways)
      .values(assignment)
      .returning();
    return newAssignment;
  }

  async getAssignedPathways(studentId: number): Promise<AssignedPathway[]> {
    return await db
      .select()
      .from(assignedPathways)
      .where(eq(assignedPathways.studentId, studentId));
  }

  async getAssignedPathwaysByAssigner(assignerId: number): Promise<AssignedPathway[]> {
    return await db
      .select()
      .from(assignedPathways)
      .where(eq(assignedPathways.assignedBy, assignerId));
  }

  async updateAssignedPathwayStatus(id: number, status: string, progress?: number): Promise<AssignedPathway | undefined> {
    let updateData: any = { status };
    
    if (progress !== undefined) {
      updateData.progress = progress;
    }
    
    // Update timestamps based on status
    if (status === 'in_progress' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    } else if (status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }
    
    const [updatedAssignment] = await db
      .update(assignedPathways)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(assignedPathways.id, id))
      .returning();
    
    return updatedAssignment;
  }

  // Parent/Teacher Portal - Progress Notes
  async addProgressNote(note: InsertProgressNote): Promise<ProgressNote> {
    const [newNote] = await db
      .insert(progressNotes)
      .values(note)
      .returning();
    return newNote;
  }

  async getProgressNotes(studentId: number, pathwayId?: number): Promise<ProgressNote[]> {
    if (pathwayId) {
      return await db
        .select()
        .from(progressNotes)
        .where(and(
          eq(progressNotes.studentId, studentId),
          eq(progressNotes.pathwayId, pathwayId)
        ))
        .orderBy(desc(progressNotes.createdAt));
    } else {
      return await db
        .select()
        .from(progressNotes)
        .where(eq(progressNotes.studentId, studentId))
        .orderBy(desc(progressNotes.createdAt));
    }
  }

  // Engagement Engine methods
  async getUserEngagement(userId: number): Promise<UserEngagement | undefined> {
    const [engagement] = await db
      .select()
      .from(userEngagement)
      .where(eq(userEngagement.userId, userId));
    return engagement;
  }

  async createUserEngagement(userId: number): Promise<UserEngagement> {
    const [newEngagement] = await db
      .insert(userEngagement)
      .values({ userId })
      .returning();
    return newEngagement;
  }

  async updateUserEngagement(userId: number, updates: Partial<InsertUserEngagement>): Promise<UserEngagement> {
    const [updatedEngagement] = await db
      .update(userEngagement)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userEngagement.userId, userId))
      .returning();
    return updatedEngagement;
  }

  async checkInUser(userId: number): Promise<UserEngagement> {
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
  }

  async recordUserActivity(userId: number, type: string, data?: any, pointsEarned: number = 0): Promise<UserActivity> {
    const [activity] = await db
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
      await db
        .update(userEngagement)
        .set({
          totalPoints: sql`${userEngagement.totalPoints} + ${pointsEarned}`,
          updatedAt: new Date()
        })
        .where(eq(userEngagement.userId, userId));
    }
    
    return activity;
  }

  async getUserActivities(userId: number, limit: number = 10): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(desc(userActivities.timestamp))
      .limit(limit);
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newAchievement] = await db
      .insert(userAchievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async getStreak(userId: number): Promise<number> {
    const engagement = await this.getUserEngagement(userId);
    return engagement?.currentStreak || 0;
  }
}

export const storage = new DatabaseStorage();