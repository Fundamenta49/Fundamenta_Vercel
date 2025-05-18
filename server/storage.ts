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
  UserActivity, InsertUserActivity
} from "@shared/schema";
import { ChatMessage } from "@shared/types";
import session from "express-session";

// Define type for Replit Auth user upsert
export interface UpsertUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Conversations
  getConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  addMessage(conversationId: number, message: ChatMessage): Promise<void>;
  
  // Parent/Teacher Portal - Connections
  createUserConnection(connection: InsertUserConnection): Promise<UserConnection>;
  getUserConnectionByCode(code: string): Promise<UserConnection | undefined>;
  getUserConnections(userId: number, role: 'mentor' | 'student'): Promise<UserConnection[]>;
  getConnectionsByMentorId(mentorId: number): Promise<UserConnection[]>;
  getConnectionsByStudentId(studentId: number): Promise<UserConnection[]>;
  getPendingConnectionsByStudentId(studentId: number): Promise<UserConnection[]>;
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
  
  // Analytics methods
  getMentorAnalytics(mentorId: number): Promise<{
    totalStudents: number;
    totalPathways: number;
    pathwayCompletionRate: number;
    studentEngagementStats: {
      activeStudents: number;
      inactiveStudents: number; 
      averageStudentStreak: number;
    };
    recentAssignments: AssignedPathway[];
  }>;
  
  getStudentAnalytics(studentId: number): Promise<{
    totalAssignments: number;
    completedAssignments: number;
    inProgressAssignments: number;
    totalPoints: number;
    currentStreak: number;
    completionRate: number;
    activityTimeline: UserActivity[];
  }>;
  
  getPathwayAnalytics(pathwayId: number): Promise<{
    totalAssigned: number;
    totalCompleted: number;
    totalInProgress: number;
    averageCompletionTime: number; // in days
    completionRate: number;
  }>;
}

// Import from the DatabaseStorage implementation
import { DatabaseStorage } from './storage.db';
export const storage = new DatabaseStorage();