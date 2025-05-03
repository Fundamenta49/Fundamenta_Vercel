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
  users
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, sql } from "drizzle-orm";
import { ChatMessage } from "@shared/types";
import session from "express-session";
import connectPg from "connect-pg-simple";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Conversations
  getConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  addMessage(conversationId: number, message: ChatMessage): Promise<void>;
  
  // Parent/Teacher Portal - Connections
  createUserConnection(connection: InsertUserConnection): Promise<UserConnection>;
  getUserConnectionByCode(code: string): Promise<UserConnection | undefined>;
  getUserConnections(userId: number, role: 'mentor' | 'student'): Promise<UserConnection[]>;
  updateUserConnection(id: number, updates: Partial<InsertUserConnection>): Promise<UserConnection | undefined>;
  deleteUserConnection(id: number): Promise<boolean>;
  
  // Parent/Teacher Portal - Custom Pathways
  createCustomPathway(pathway: InsertCustomPathway): Promise<CustomPathway>;
  getCustomPathway(id: number): Promise<CustomPathway | undefined>;
  getCustomPathwaysByCreator(creatorId: number): Promise<CustomPathway[]>;
  updateCustomPathway(id: number, updates: Partial<InsertCustomPathway>): Promise<CustomPathway | undefined>;
  deleteCustomPathway(id: number): Promise<boolean>;
  
  // Parent/Teacher Portal - Custom Pathway Modules
  createCustomPathwayModule(module: InsertCustomPathwayModule): Promise<CustomPathwayModule>;
  getCustomPathwayModules(pathwayId: number): Promise<CustomPathwayModule[]>;
  updateCustomPathwayModule(id: number, updates: Partial<InsertCustomPathwayModule>): Promise<CustomPathwayModule | undefined>;
  deleteCustomPathwayModule(id: number): Promise<boolean>;
  
  // Parent/Teacher Portal - Assigned Pathways
  assignPathway(assignment: InsertAssignedPathway): Promise<AssignedPathway>;
  getAssignedPathways(studentId: number): Promise<AssignedPathway[]>;
  getAssignedPathwaysByAssigner(assignerId: number): Promise<AssignedPathway[]>;
  updateAssignedPathwayStatus(id: number, status: string, progress?: number): Promise<AssignedPathway | undefined>;
  
  // Parent/Teacher Portal - Progress Notes
  addProgressNote(note: InsertProgressNote): Promise<ProgressNote>;
  getProgressNotes(studentId: number, pathwayId?: number): Promise<ProgressNote[]>;
  
  // Session
  sessionStore: session.Store;
  
  // Engagement Engine methods
  getUserEngagement(userId: number): Promise<UserEngagement | undefined>;
  createUserEngagement(userId: number): Promise<UserEngagement>;
  updateUserEngagement(userId: number, updates: Partial<InsertUserEngagement>): Promise<UserEngagement>;
  checkInUser(userId: number): Promise<UserEngagement>;
  recordUserActivity(userId: number, type: string, data?: any, pointsEarned?: number): Promise<UserActivity>;
  getUserActivities(userId: number, limit?: number): Promise<UserActivity[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
  getStreak(userId: number): Promise<number>;
}

import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private userConnections: Map<number, UserConnection>;
  private customPathways: Map<number, CustomPathway>;
  private customPathwayModules: Map<number, CustomPathwayModule>;
  private assignedPathways: Map<number, AssignedPathway>;
  private progressNotes: Map<number, ProgressNote>;
  
  private currentUserId: number;
  private currentConversationId: number;
  private currentConnectionId: number;
  private currentPathwayId: number;
  private currentModuleId: number;
  private currentAssignmentId: number;
  private currentNoteId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.userConnections = new Map();
    this.customPathways = new Map();
    this.customPathwayModules = new Map();
    this.assignedPathways = new Map();
    this.progressNotes = new Map();
    
    this.currentUserId = 1;
    this.currentConversationId = 1;
    this.currentConnectionId = 1;
    this.currentPathwayId = 1;
    this.currentModuleId = 1;
    this.currentAssignmentId = 1;
    this.currentNoteId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.name.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    
    // Extract user data for consistent handling
    const { birthYear: rawBirthYear, ...userData } = insertUser;
    
    // Process age-related fields with proper typing - explicitly specify the type
    const birthYear: number | null = rawBirthYear !== undefined ? rawBirthYear : null;
    let isMinor = false;
    let ageVerified = insertUser.ageVerified || false;
    
    if (birthYear !== null) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      isMinor = age < 18;
      
      // Set ageVerified if they've gone through verification
      if (!ageVerified && age >= 13) {
        ageVerified = true;
      }
    }
    
    // Create a properly typed user object - ensure all fields match schema types
    const user: User = {
      id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
      emailVerified: userData.emailVerified !== undefined ? userData.emailVerified : false,
      privacyConsent: userData.privacyConsent !== undefined ? userData.privacyConsent : false,
      birthYear, // Explicitly typed as number | null above
      ageVerified,
      isMinor,
      hasParentalConsent: insertUser.hasParentalConsent !== undefined ? insertUser.hasParentalConsent : false,
      createdAt: now,
      updatedAt: now,
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Extract birthYear for special handling
    const { birthYear: rawBirthYear, ...otherUpdates } = updates;
    
    // Handle birthYear specially to ensure it's properly typed
    let birthYearUpdate: number | null | undefined = undefined;
    if (rawBirthYear !== undefined) {
      birthYearUpdate = rawBirthYear !== null ? rawBirthYear : null;
    }
    
    // Create properly typed update data
    const updatedUser: User = {
      ...user,
      ...otherUpdates,
      // Only update birthYear if it was included in updates
      ...(birthYearUpdate !== undefined ? { birthYear: birthYearUpdate } : {}),
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };
    
    // Update isMinor and ageVerified if birthYear was changed
    if (birthYearUpdate !== undefined) {
      if (birthYearUpdate !== null) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYearUpdate;
        updatedUser.isMinor = age < 18;
        
        // Update ageVerified for minors (13+) and adults
        if (age >= 18) {
          updatedUser.ageVerified = true;
        } else if (age >= 13) {
          updatedUser.ageVerified = true;
        }
      }
    }
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conv) => conv.userId === userId
    );
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date();
    const newConversation: Conversation = {
      ...conversation,
      id,
      createdAt: now,
      lastMessageAt: now,
      title: conversation.title || "New Conversation",
      userId: conversation.userId || null,
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }

  async addMessage(conversationId: number, message: ChatMessage): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error("Conversation not found");
    
    // Store messages separately since they're not part of the Conversation type
    // This is a workaround for the memory storage
    const messagesKey = `conv_${conversationId}_messages`;
    const existingMessages = (this as any)[messagesKey] || [];
    (this as any)[messagesKey] = [...existingMessages, message];
    
    // Update the last message timestamp
    conversation.lastMessageAt = new Date();
    this.conversations.set(conversationId, conversation);
  }
  
  // Parent/Teacher Portal - Connections
  
  async createUserConnection(connection: InsertUserConnection): Promise<UserConnection> {
    const id = this.currentConnectionId++;
    const now = new Date();
    const newConnection: UserConnection = {
      ...connection,
      id,
      createdAt: now,
      updatedAt: now,
      studentId: connection.studentId || null, // Ensure studentId is never undefined
      status: connection.status || "pending",
      accessLevel: connection.accessLevel || "standard",
      connectionCode: connection.connectionCode || null,
    };
    this.userConnections.set(id, newConnection);
    return newConnection;
  }
  
  // Alias for mentorship routes
  async createConnection(connection: InsertUserConnection): Promise<UserConnection> {
    return this.createUserConnection(connection);
  }
  
  async getUserConnectionByCode(code: string): Promise<UserConnection | undefined> {
    return Array.from(this.userConnections.values()).find(
      (conn) => conn.connectionCode === code
    );
  }
  
  // Alias for mentorship routes
  async getConnectionByCode(code: string): Promise<UserConnection | undefined> {
    return this.getUserConnectionByCode(code);
  }
  
  async getUserConnections(userId: number, role: 'mentor' | 'student'): Promise<UserConnection[]> {
    return Array.from(this.userConnections.values()).filter(
      (conn) => role === 'mentor' ? conn.mentorId === userId : conn.studentId === userId
    );
  }

  // Added for mentorship routes
  async getConnectionsByMentorId(mentorId: number): Promise<UserConnection[]> {
    return Array.from(this.userConnections.values()).filter(
      (conn) => conn.mentorId === mentorId
    );
  }

  async getConnectionsByStudentId(studentId: number): Promise<UserConnection[]> {
    return Array.from(this.userConnections.values()).filter(
      (conn) => conn.studentId === studentId
    );
  }

  async getPendingConnectionsByStudentId(studentId: number): Promise<UserConnection[]> {
    return Array.from(this.userConnections.values()).filter(
      (conn) => conn.studentId === studentId && conn.status === "pending"
    );
  }

  async getConnection(id: number): Promise<UserConnection | undefined> {
    return this.userConnections.get(id);
  }
  
  async updateUserConnection(id: number, updates: Partial<InsertUserConnection>): Promise<UserConnection | undefined> {
    const connection = this.userConnections.get(id);
    if (!connection) return undefined;
    
    // Ensure studentId is never undefined
    const safeUpdates = {
      ...updates,
      studentId: updates.studentId !== undefined ? (updates.studentId || null) : connection.studentId
    };
    
    const updatedConnection: UserConnection = {
      ...connection,
      ...safeUpdates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };
    
    this.userConnections.set(id, updatedConnection);
    return updatedConnection;
  }
  
  // Alias for mentorship routes
  async updateConnection(id: number, updates: Partial<InsertUserConnection>): Promise<UserConnection | undefined> {
    return this.updateUserConnection(id, updates);
  }
  
  async deleteUserConnection(id: number): Promise<boolean> {
    return this.userConnections.delete(id);
  }
  
  // Alias for mentorship routes
  async deleteConnection(id: number): Promise<boolean> {
    return this.deleteUserConnection(id);
  }
  
  // Parent/Teacher Portal - Custom Pathways
  
  async createCustomPathway(pathway: InsertCustomPathway): Promise<CustomPathway> {
    const id = this.currentPathwayId++;
    const now = new Date();
    const newPathway: CustomPathway = {
      ...pathway,
      id,
      createdAt: now,
      updatedAt: now,
      description: pathway.description || null,
      category: pathway.category || null,
      isTemplate: pathway.isTemplate || null,
      isPublic: pathway.isPublic || null,
    };
    this.customPathways.set(id, newPathway);
    return newPathway;
  }
  
  async getCustomPathway(id: number): Promise<CustomPathway | undefined> {
    return this.customPathways.get(id);
  }
  
  async getCustomPathwaysByCreator(creatorId: number): Promise<CustomPathway[]> {
    return Array.from(this.customPathways.values()).filter(
      (pathway) => pathway.creatorId === creatorId
    );
  }
  
  async updateCustomPathway(id: number, updates: Partial<InsertCustomPathway>): Promise<CustomPathway | undefined> {
    const pathway = this.customPathways.get(id);
    if (!pathway) return undefined;
    
    const updatedPathway: CustomPathway = {
      ...pathway,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };
    
    this.customPathways.set(id, updatedPathway);
    return updatedPathway;
  }
  
  async deleteCustomPathway(id: number): Promise<boolean> {
    // First, delete all modules associated with this pathway
    const modules = await this.getCustomPathwayModules(id);
    modules.forEach(module => this.customPathwayModules.delete(module.id));
    
    // Then delete the pathway itself
    return this.customPathways.delete(id);
  }
  
  // Parent/Teacher Portal - Custom Pathway Modules
  
  async createCustomPathwayModule(module: InsertCustomPathwayModule): Promise<CustomPathwayModule> {
    const id = this.currentModuleId++;
    const now = new Date();
    const newModule: CustomPathwayModule = {
      ...module,
      id,
      createdAt: now,
      updatedAt: now,
      description: module.description || null,
      content: module.content || null,
      estimatedDuration: module.estimatedDuration || null,
      skillLevel: module.skillLevel || null,
    };
    this.customPathwayModules.set(id, newModule);
    return newModule;
  }
  
  async getCustomPathwayModules(pathwayId: number): Promise<CustomPathwayModule[]> {
    return Array.from(this.customPathwayModules.values())
      .filter(module => module.pathwayId === pathwayId)
      .sort((a, b) => a.order - b.order); // Sort by order field
  }
  
  async updateCustomPathwayModule(id: number, updates: Partial<InsertCustomPathwayModule>): Promise<CustomPathwayModule | undefined> {
    const module = this.customPathwayModules.get(id);
    if (!module) return undefined;
    
    const updatedModule: CustomPathwayModule = {
      ...module,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };
    
    this.customPathwayModules.set(id, updatedModule);
    return updatedModule;
  }
  
  async deleteCustomPathwayModule(id: number): Promise<boolean> {
    return this.customPathwayModules.delete(id);
  }
  
  // Parent/Teacher Portal - Assigned Pathways
  
  async assignPathway(assignment: InsertAssignedPathway): Promise<AssignedPathway> {
    const id = this.currentAssignmentId++;
    const now = new Date();
    const newAssignment: AssignedPathway = {
      ...assignment,
      id,
      status: assignment.status || 'assigned',
      progress: assignment.progress || 0,
      createdAt: now,
      updatedAt: now,
      startedAt: null,
      completedAt: null,
      dueDate: assignment.dueDate || null,
    };
    this.assignedPathways.set(id, newAssignment);
    return newAssignment;
  }
  
  async getAssignedPathways(studentId: number): Promise<AssignedPathway[]> {
    return Array.from(this.assignedPathways.values()).filter(
      (assignment) => assignment.studentId === studentId
    );
  }
  
  async getAssignedPathwaysByAssigner(assignerId: number): Promise<AssignedPathway[]> {
    return Array.from(this.assignedPathways.values()).filter(
      (assignment) => assignment.assignedBy === assignerId
    );
  }
  
  async updateAssignedPathwayStatus(id: number, status: string, progress?: number): Promise<AssignedPathway | undefined> {
    const assignment = this.assignedPathways.get(id);
    if (!assignment) return undefined;
    
    const now = new Date();
    const updates: Partial<AssignedPathway> = {
      status,
      updatedAt: now
    };
    
    // Set progress if provided
    if (typeof progress === 'number') {
      updates.progress = progress;
    }
    
    // Set started time if transitioning to in_progress for the first time
    if (status === 'in_progress' && !assignment.startedAt) {
      updates.startedAt = now;
    }
    
    // Set completed time if transitioning to completed
    if (status === 'completed' && !assignment.completedAt) {
      updates.completedAt = now;
      updates.progress = 100; // Set progress to 100% when completed
    }
    
    const updatedAssignment: AssignedPathway = {
      ...assignment,
      ...updates,
    };
    
    this.assignedPathways.set(id, updatedAssignment);
    return updatedAssignment;
  }
  
  // Parent/Teacher Portal - Progress Notes
  
  async addProgressNote(note: InsertProgressNote): Promise<ProgressNote> {
    const id = this.currentNoteId++;
    const now = new Date();
    const newNote: ProgressNote = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
      pathwayId: note.pathwayId || null,
      moduleId: note.moduleId || null,
      visibility: note.visibility || null,
    };
    this.progressNotes.set(id, newNote);
    return newNote;
  }
  
  async getProgressNotes(studentId: number, pathwayId?: number): Promise<ProgressNote[]> {
    let notes = Array.from(this.progressNotes.values())
      .filter(note => note.studentId === studentId);
    
    // Filter by pathway if provided
    if (pathwayId) {
      notes = notes.filter(note => note.pathwayId === pathwayId);
    }
    
    // Sort by most recent first
    return notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Database storage implementation
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  // Engagement Engine methods
  
  async getUserEngagement(userId: number): Promise<UserEngagement | undefined> {
    try {
      const [engagement] = await db.select().from(schema.userEngagement)
        .where(eq(schema.userEngagement.userId, userId));
      return engagement;
    } catch (error) {
      console.error('Error getting user engagement:', error);
      return undefined;
    }
  }
  
  async createUserEngagement(userId: number): Promise<UserEngagement> {
    try {
      const now = new Date();
      const [engagement] = await db.insert(schema.userEngagement)
        .values({
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastCheckIn: null,
          streakUpdatedAt: now,
          totalPoints: 0,
          level: 1,
          updatedAt: now
        })
        .returning();
      return engagement;
    } catch (error) {
      console.error('Error creating user engagement:', error);
      throw error;
    }
  }
  
  async updateUserEngagement(userId: number, updates: Partial<InsertUserEngagement>): Promise<UserEngagement> {
    try {
      // First, check if engagement exists
      const engagement = await this.getUserEngagement(userId);
      
      if (!engagement) {
        // Create if it doesn't exist
        return this.createUserEngagement(userId);
      }
      
      // Update with new values
      const [updatedEngagement] = await db.update(schema.userEngagement)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(schema.userEngagement.userId, userId))
        .returning();
      
      return updatedEngagement;
    } catch (error) {
      console.error('Error updating user engagement:', error);
      throw error;
    }
  }
  
  async checkInUser(userId: number): Promise<UserEngagement> {
    try {
      const now = new Date();
      const engagement = await this.getUserEngagement(userId);
      
      if (!engagement) {
        // Create a new engagement record with a streak of 1
        return this.createUserEngagement(userId).then(newEngagement => {
          return this.updateUserEngagement(userId, {
            currentStreak: 1,
            longestStreak: 1,
            lastCheckIn: now,
            streakUpdatedAt: now,
            totalPoints: 10 // Initial points for first check-in
          });
        });
      }
      
      // Check if this is a streak continuation
      let isNewStreak = true;
      let streakBroken = false;
      const currentStreak = engagement.currentStreak || 0;
      let newStreak = currentStreak;
      let bonusPoints = 0;
      
      if (engagement.lastCheckIn) {
        const lastCheckIn = new Date(engagement.lastCheckIn);
        
        // Check if the last check-in was yesterday (for streak continuation)
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const lastCheckInDay = lastCheckIn.setHours(0, 0, 0, 0);
        const yesterdayDay = yesterday.setHours(0, 0, 0, 0);
        const todayDay = new Date(now).setHours(0, 0, 0, 0);
        
        if (lastCheckInDay === todayDay) {
          // Already checked in today
          isNewStreak = false;
        } else if (lastCheckInDay === yesterdayDay) {
          // Checked in yesterday, maintain streak
          newStreak = currentStreak + 1;
          
          // Calculate bonus points based on streak
          if (newStreak >= 30) {
            bonusPoints = 50; // 30+ day streak
          } else if (newStreak >= 7) {
            bonusPoints = 25; // 7+ day streak
          } else if (newStreak >= 3) {
            bonusPoints = 15; // 3+ day streak
          } else {
            bonusPoints = 5; // normal streak continuation
          }
        } else {
          // Streak broken
          newStreak = 1;
          streakBroken = true;
        }
      } else {
        // First check-in
        newStreak = 1;
      }
      
      // Only update if it's a new check-in
      if (isNewStreak) {
        const basePoints = 10; // Base points for daily check-in
        const totalPointsEarned = basePoints + bonusPoints;
        
        // Update engagement record
        const updates: Partial<InsertUserEngagement> = {
          currentStreak: newStreak,
          lastCheckIn: now,
          streakUpdatedAt: now,
          totalPoints: (engagement.totalPoints || 0) + totalPointsEarned
        };
        
        // Update longest streak if current streak is longer
        if (newStreak > (engagement.longestStreak || 0)) {
          updates.longestStreak = newStreak;
        }
        
        // Log the check-in activity
        await this.recordUserActivity(userId, 'check_in', {
          streakContinued: !streakBroken,
          newStreak,
          previousStreak: currentStreak,
          bonusPoints
        }, totalPointsEarned);
        
        // Check for streak achievements
        if (newStreak === 7) {
          await this.addUserAchievement({
            userId,
            achievementId: 'streak_7days',
            type: 'streak',
            name: '7-Day Streak',
            description: 'Maintained a 7-day activity streak!',
            iconUrl: '/images/achievements/streak-7.svg',
            points: 50,
            unlockedAt: now
          });
        } else if (newStreak === 30) {
          await this.addUserAchievement({
            userId,
            achievementId: 'streak_30days',
            type: 'streak',
            name: '30-Day Streak',
            description: 'Maintained a 30-day activity streak!',
            iconUrl: '/images/achievements/streak-30.svg',
            points: 200,
            unlockedAt: now
          });
        }
        
        // Update level if needed
        const newTotalPoints = (engagement.totalPoints || 0) + totalPointsEarned;
        const newLevel = Math.floor(Math.sqrt(newTotalPoints / 100)) + 1;
        
        if (newLevel > (engagement.level || 1)) {
          updates.level = newLevel;
          
          // Add level-up achievement
          await this.addUserAchievement({
            userId,
            achievementId: `level_${newLevel}`,
            type: 'special',
            name: `Level ${newLevel}`,
            description: `Reached Level ${newLevel}!`,
            iconUrl: `/images/achievements/level-${newLevel}.svg`,
            points: newLevel * 20,
            unlockedAt: now
          });
        }
        
        return this.updateUserEngagement(userId, updates);
      }
      
      return engagement;
    } catch (error) {
      console.error('Error checking in user:', error);
      throw error;
    }
  }
  
  async recordUserActivity(userId: number, type: string, data: any = {}, pointsEarned: number = 0): Promise<UserActivity> {
    try {
      const [activity] = await db.insert(schema.userActivities)
        .values({
          userId,
          type,
          data,
          pointsEarned,
          timestamp: new Date()
        })
        .returning();
      
      return activity;
    } catch (error) {
      console.error('Error recording user activity:', error);
      throw error;
    }
  }
  
  async getUserActivities(userId: number, limit: number = 20): Promise<UserActivity[]> {
    try {
      return await db.select()
        .from(schema.userActivities)
        .where(eq(schema.userActivities.userId, userId))
        .orderBy(desc(schema.userActivities.timestamp))
        .limit(limit);
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }
  
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    try {
      return await db.select()
        .from(schema.userAchievements)
        .where(eq(schema.userAchievements.userId, userId))
        .orderBy(desc(schema.userAchievements.unlockedAt));
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }
  
  async addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    try {
      // Check if achievement already exists for user
      const existingAchievements = await db.select()
        .from(schema.userAchievements)
        .where(
          and(
            eq(schema.userAchievements.userId, achievement.userId),
            eq(schema.userAchievements.achievementId, achievement.achievementId)
          )
        );
      
      if (existingAchievements.length > 0) {
        // Achievement already exists, return it
        return existingAchievements[0];
      }
      
      // Add achievement points to user's total
      const engagement = await this.getUserEngagement(achievement.userId);
      if (engagement) {
        await this.updateUserEngagement(achievement.userId, {
          totalPoints: (engagement.totalPoints || 0) + achievement.points
        });
      }
      
      // Create activity record for achievement
      await this.recordUserActivity(achievement.userId, 'achievement_earned', {
        achievementId: achievement.achievementId,
        name: achievement.name,
        type: achievement.type
      }, achievement.points);
      
      // Insert the achievement
      const [newAchievement] = await db.insert(schema.userAchievements)
        .values(achievement)
        .returning();
      
      return newAchievement;
    } catch (error) {
      console.error('Error adding user achievement:', error);
      throw error;
    }
  }
  
  async getStreak(userId: number): Promise<number> {
    try {
      const engagement = await this.getUserEngagement(userId);
      return engagement?.currentStreak || 0;
    } catch (error) {
      console.error('Error getting streak:', error);
      return 0;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.name, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Extract user data
    const { birthYear: rawBirthYear, ...userData } = insertUser;
    
    // Process age-related fields with explicitly correct typing
    const birthYear: number | null = rawBirthYear !== undefined ? rawBirthYear : null;
    let isMinor = false;
    let ageVerified = insertUser.ageVerified || false;
    
    if (birthYear !== null) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      isMinor = age < 18;
      
      // Set ageVerified if they've gone through verification
      if (!ageVerified && age >= 13) {
        ageVerified = true;
      }
    }
    
    // Create a properly typed user object for database insertion
    const userInsertData = {
      ...userData,
      birthYear, // Explicitly typed as number | null above
      ageVerified,
      isMinor,
      hasParentalConsent: insertUser.hasParentalConsent || false,
      role: userData.role || 'user',
      privacyConsent: userData.privacyConsent || false,
      emailVerified: userData.emailVerified || false
    };
    
    try {
      const [user] = await db
        .insert(users)
        .values(userInsertData)
        .returning();
        
      return user;
    } catch (error) {
      console.error('Error creating user in database:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    // Extract birthYear for special handling
    const { birthYear: rawBirthYear, ...otherUpdates } = updates;
    
    // Create properly typed update object
    const updateData: Record<string, any> = { ...otherUpdates };
    
    // Process birthYear and calculate age-related fields if present
    if (rawBirthYear !== undefined) {
      const birthYear: number | null = rawBirthYear !== null ? rawBirthYear : null;
      updateData.birthYear = birthYear;
      
      if (birthYear !== null) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        updateData.isMinor = age < 18;
        
        // Update ageVerified if becoming an adult
        if (age >= 18) {
          updateData.ageVerified = true;
          updateData.isMinor = false;
        } else if (age >= 13) {
          updateData.ageVerified = true;
        }
      }
    }
    
    try {
      const [user] = await db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(users.id, id))
        .returning();
        
      return user || undefined;
    } catch (error) {
      console.error('Error updating user in database:', error);
      return undefined;
    }
  }

  // Other methods from MemStorage - add database implementations as needed

  async getConversations(userId: number): Promise<Conversation[]> {
    // Implementation needed
    return [];
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  async addMessage(conversationId: number, message: ChatMessage): Promise<void> {
    // Implementation needed
  }

  // Parent/Teacher Portal - Connections
  async createUserConnection(connection: InsertUserConnection): Promise<UserConnection> {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  async getUserConnectionByCode(code: string): Promise<UserConnection | undefined> {
    // Implementation needed
    return undefined;
  }

  async getUserConnections(userId: number, role: 'mentor' | 'student'): Promise<UserConnection[]> {
    // Implementation needed
    return [];
  }

  async updateUserConnection(id: number, updates: Partial<InsertUserConnection>): Promise<UserConnection | undefined> {
    // Implementation needed
    return undefined;
  }

  async deleteUserConnection(id: number): Promise<boolean> {
    // Implementation needed
    return false;
  }

  // Alias methods for compatibility
  async createConnection(connection: InsertUserConnection): Promise<UserConnection> {
    return this.createUserConnection(connection);
  }

  async getConnectionByCode(code: string): Promise<UserConnection | undefined> {
    return this.getUserConnectionByCode(code);
  }

  async getConnectionsByMentorId(mentorId: number): Promise<UserConnection[]> {
    return this.getUserConnections(mentorId, 'mentor');
  }

  async getConnectionsByStudentId(studentId: number): Promise<UserConnection[]> {
    return this.getUserConnections(studentId, 'student');
  }

  async getPendingConnectionsByStudentId(studentId: number): Promise<UserConnection[]> {
    // Implementation needed
    return [];
  }

  async getConnection(id: number): Promise<UserConnection | undefined> {
    // Implementation needed
    return undefined;
  }

  async updateConnection(id: number, updates: Partial<InsertUserConnection>): Promise<UserConnection | undefined> {
    return this.updateUserConnection(id, updates);
  }

  async deleteConnection(id: number): Promise<boolean> {
    return this.deleteUserConnection(id);
  }

  // Parent/Teacher Portal - Custom Pathways
  async createCustomPathway(pathway: InsertCustomPathway): Promise<CustomPathway> {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  async getCustomPathway(id: number): Promise<CustomPathway | undefined> {
    // Implementation needed
    return undefined;
  }

  async getCustomPathwaysByCreator(creatorId: number): Promise<CustomPathway[]> {
    // Implementation needed
    return [];
  }

  async updateCustomPathway(id: number, updates: Partial<InsertCustomPathway>): Promise<CustomPathway | undefined> {
    // Implementation needed
    return undefined;
  }

  async deleteCustomPathway(id: number): Promise<boolean> {
    // Implementation needed
    return false;
  }

  // Parent/Teacher Portal - Custom Pathway Modules
  async createCustomPathwayModule(module: InsertCustomPathwayModule): Promise<CustomPathwayModule> {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  async getCustomPathwayModules(pathwayId: number): Promise<CustomPathwayModule[]> {
    // Implementation needed
    return [];
  }

  async updateCustomPathwayModule(id: number, updates: Partial<InsertCustomPathwayModule>): Promise<CustomPathwayModule | undefined> {
    // Implementation needed
    return undefined;
  }

  async deleteCustomPathwayModule(id: number): Promise<boolean> {
    // Implementation needed
    return false;
  }

  // Parent/Teacher Portal - Assigned Pathways
  async assignPathway(assignment: InsertAssignedPathway): Promise<AssignedPathway> {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  async getAssignedPathways(studentId: number): Promise<AssignedPathway[]> {
    // Implementation needed
    return [];
  }

  async getAssignedPathwaysByAssigner(assignerId: number): Promise<AssignedPathway[]> {
    // Implementation needed
    return [];
  }

  async updateAssignedPathwayStatus(id: number, status: string, progress?: number): Promise<AssignedPathway | undefined> {
    // Implementation needed
    return undefined;
  }

  // Parent/Teacher Portal - Progress Notes
  async addProgressNote(note: InsertProgressNote): Promise<ProgressNote> {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  async getProgressNotes(studentId: number, pathwayId?: number): Promise<ProgressNote[]> {
    // Implementation needed
    return [];
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
