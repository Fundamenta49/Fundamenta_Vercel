import { pgTable, serial, text, timestamp, boolean, integer, real, jsonb, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { and, eq, desc } from "drizzle-orm";

// Educational frameworks constants

// SEL (Social-Emotional Learning) Framework - CASEL competencies
export const selCompetencies = {
  SELF_AWARENESS: "self_awareness",
  SELF_MANAGEMENT: "self_management",
  SOCIAL_AWARENESS: "social_awareness",
  RELATIONSHIP_SKILLS: "relationship_skills",
  RESPONSIBLE_DECISION_MAKING: "responsible_decision_making",
} as const;

export type SELCompetency = keyof typeof selCompetencies;

// Project LIFE Framework - Chafee Foster Care Independence Program domains
export const lifeDomains = {
  EDUCATION_TRAINING: "education_training",
  EMPLOYMENT: "employment", 
  FINANCIAL_LITERACY: "financial_literacy",
  HOUSING: "housing",
  HEALTH: "health",
  PERSONAL_SOCIAL: "personal_social",
} as const;

export type LIFEDomain = keyof typeof lifeDomains;

// Skill levels for content classification
export const skillLevels = {
  FOUNDATIONAL: "foundational",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type SkillLevel = keyof typeof skillLevels;

// User roles for parent/teacher portal
export const userRoles = {
  USER: "user",
  STUDENT: "student",
  PARENT: "parent",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

export type UserRole = keyof typeof userRoles;

// Connection types for user relationships
export const connectionTypes = {
  PARENT_CHILD: "parent_child",
  TEACHER_STUDENT: "teacher_student",
} as const;

export type ConnectionType = keyof typeof connectionTypes;

// Connection status options
export const connectionStatuses = {
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
} as const;

export type ConnectionStatus = keyof typeof connectionStatuses;

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  emailVerified: boolean("email_verified").default(false),
  privacyConsent: boolean("privacy_consent").default(false),
  // Age verification fields
  birthYear: integer("birth_year"),
  ageVerified: boolean("age_verified").default(false),
  isMinor: boolean("is_minor").default(false), // Will be true for users under 18
  hasParentalConsent: boolean("has_parental_consent").default(false),
  // Terms of Service acceptance
  tosAccepted: boolean("tos_accepted").default(false),
  tosVersion: integer("tos_version"),
  tosAcceptedAt: timestamp("tos_accepted_at"),
  // GDPR Data tracking
  dataExportRequested: boolean("data_export_requested").default(false),
  dataExportRequestedAt: timestamp("data_export_requested_at"),
  accountDeletionRequested: boolean("account_deletion_requested").default(false),
  accountDeletionRequestedAt: timestamp("account_deletion_requested_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Conversations Table for chat history
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").default("New Conversation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastMessageAt: timestamp("last_message_at").notNull().defaultNow()
});

// Messages Table for individual chat messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  category: text("category").default("general"),
  metadata: jsonb("metadata"), // For storing additional message data like sentiment, actions, etc.
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

// User Info Table
export const userInfo = pgTable("user_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").unique(),
  age: integer("age"),
  gender: text("gender"),
  occupation: text("occupation"),
  interests: text("interests"),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Learning Progress Tracking Table
export const learningProgress = pgTable("learning_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pathwayId: text("pathway_id").notNull(),
  moduleId: text("module_id").notNull(), 
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata").default({}), // Store adaptive learning data and quiz performance
  lastAccessedAt: timestamp("last_accessed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});



// User Connections Table for parent/teacher-student relationships
export const userConnections = pgTable("user_connections", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull().references(() => users.id), // Parent or teacher
  studentId: integer("student_id").references(() => users.id), // Child or student (can be null initially for pairing code)
  connectionType: text("connection_type").notNull(), // "parent_child" or "teacher_student"
  status: text("status").notNull().default("pending"), // "pending", "active", "rejected"
  accessLevel: text("access_level").notNull().default("standard"), // "standard", "full", "limited"
  connectionCode: text("connection_code"), // For initial pairing
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Custom Learning Pathways Table
export const customPathways = pgTable("custom_pathways", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull().references(() => users.id), // Parent or teacher
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").default("general"),
  isTemplate: boolean("is_template").default(false), // For reusable pathways
  isPublic: boolean("is_public").default(false), // Whether other educators can see/use this pathway
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Custom Pathway Modules Table
export const customPathwayModules = pgTable("custom_pathway_modules", {
  id: serial("id").primaryKey(),
  pathwayId: integer("pathway_id").notNull().references(() => customPathways.id),
  title: text("title").notNull(),
  description: text("description"),
  content: jsonb("content"), // Structured content or references
  order: integer("order").notNull(),
  estimatedDuration: integer("estimated_duration"), // In minutes
  skillLevel: text("skill_level").default("foundational"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Assigned Pathways Table
export const assignedPathways = pgTable("assigned_pathways", {
  id: serial("id").primaryKey(),
  pathwayId: integer("pathway_id").notNull().references(() => customPathways.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  assignedBy: integer("assigned_by").notNull().references(() => users.id),
  dueDate: timestamp("due_date"),
  status: text("status").default("assigned"), // "assigned", "in_progress", "completed"
  progress: real("progress").default(0), // Percentage of completion (0-100)
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Progress Notes Table
export const progressNotes = pgTable("progress_notes", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  pathwayId: integer("pathway_id").references(() => customPathways.id),
  moduleId: integer("module_id").references(() => customPathwayModules.id),
  note: text("note").notNull(),
  visibility: text("visibility").default("mentor_only"), // "mentor_only", "student_visible"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Sessions Table for express-session with connect-pg-simple
export const sessions = pgTable("sessions", {
  sid: varchar("sid").notNull().primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull()
});

// Terms of Service Versions Table
export const termsOfServiceVersions = pgTable("terms_of_service_versions", {
  id: serial("id").primaryKey(),
  version: integer("version").notNull().unique(),
  content: text("content").notNull(),
  effectiveDate: timestamp("effective_date").notNull().defaultNow(),
  isCurrent: boolean("is_current").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Engagement Engine Tables

// User engagement tracking (streaks, check-ins, etc.)
export const userEngagement = pgTable("user_engagement", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastCheckIn: timestamp("last_check_in"),
  streakUpdatedAt: timestamp("streak_updated_at"),
  totalPoints: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Achievement types constants
export const achievementTypes = {
  STREAK: "streak",
  COMPLETION: "completion",
  ACTIVITY: "activity",
  SPECIAL: "special",
} as const;

export type AchievementType = keyof typeof achievementTypes;

// User achievements table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: text("achievement_id").notNull(), // E.g., "streak_7days", "complete_module_5"
  type: text("type").notNull(), // E.g., "streak", "completion", "activity", "special"
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  points: integer("points").notNull().default(0),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// User activity types constants
export const activityTypes = {
  CHECK_IN: "check_in",
  COMPLETE_MODULE: "complete_module",
  CHAT_INTERACTION: "chat_interaction",
  EXERCISE_COMPLETION: "exercise_completion",
  PLAN_CREATION: "plan_creation",
  ASSESSMENT_COMPLETION: "assessment_completion"
} as const;

export type ActivityType = keyof typeof activityTypes;

// User activity log
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // E.g., "check_in", "complete_module"
  data: jsonb("data").default({}), // Additional context data about the activity
  pointsEarned: integer("points_earned").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

// Data Export Requests Table
export const dataExportRequests = pgTable("data_export_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // "pending", "processing", "completed", "failed"
  format: text("format").notNull().default("json"), // "json", "csv", etc.
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  downloadUrl: text("download_url"),
  expiresAt: timestamp("expires_at"),
  metaData: jsonb("meta_data").default({})
});

// Account Deletion Requests Table
export const accountDeletionRequests = pgTable("account_deletion_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // "pending", "processing", "completed"
  reason: text("reason"),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  scheduledFor: timestamp("scheduled_for"), // When the account will be deleted (grace period)
  completedAt: timestamp("completed_at"),
  metaData: jsonb("meta_data").default({})
});

// Define Zod Schemas for validation
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertConversationSchema = createInsertSchema(conversations)
  .omit({ id: true, createdAt: true, lastMessageAt: true });

export const insertMessageSchema = createInsertSchema(messages)
  .omit({ id: true, timestamp: true });

export const insertUserInfoSchema = createInsertSchema(userInfo)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertLearningProgressSchema = createInsertSchema(learningProgress)
  .omit({ id: true, createdAt: true, updatedAt: true });


  
// Add new schemas for the parent/teacher portal tables
export const insertUserConnectionSchema = createInsertSchema(userConnections)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertCustomPathwaySchema = createInsertSchema(customPathways)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertCustomPathwayModuleSchema = createInsertSchema(customPathwayModules)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertAssignedPathwaySchema = createInsertSchema(assignedPathways)
  .omit({ id: true, createdAt: true, updatedAt: true, startedAt: true, completedAt: true });

export const insertProgressNoteSchema = createInsertSchema(progressNotes)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertSessionSchema = createInsertSchema(sessions);

// Legal compliance schemas
export const insertTermsOfServiceVersionSchema = createInsertSchema(termsOfServiceVersions)
  .omit({ id: true, createdAt: true });

export const insertDataExportRequestSchema = createInsertSchema(dataExportRequests)
  .omit({ id: true, requestedAt: true, completedAt: true, downloadUrl: true, expiresAt: true });

export const insertAccountDeletionRequestSchema = createInsertSchema(accountDeletionRequests)
  .omit({ id: true, requestedAt: true, completedAt: true });

// Define TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserType = InsertUser; // Backward compatibility
export type SelectUserType = User; // Backward compatibility

// Connection types
export type InsertUserConnection = z.infer<typeof insertUserConnectionSchema>;
export type UserConnection = typeof userConnections.$inferSelect;

// Custom pathway types
export type InsertCustomPathway = z.infer<typeof insertCustomPathwaySchema>;
export type CustomPathway = typeof customPathways.$inferSelect;

// Custom pathway module types
export type InsertCustomPathwayModule = z.infer<typeof insertCustomPathwayModuleSchema>;
export type CustomPathwayModule = typeof customPathwayModules.$inferSelect;

// Assigned pathway types
export type InsertAssignedPathway = z.infer<typeof insertAssignedPathwaySchema>;
export type AssignedPathway = typeof assignedPathways.$inferSelect;

// Progress note types
export type InsertProgressNote = z.infer<typeof insertProgressNoteSchema>;
export type ProgressNote = typeof progressNotes.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversationType = InsertConversation; // Backward compatibility
export type SelectConversationType = Conversation; // Backward compatibility

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessageType = InsertMessage; // Backward compatibility
export type SelectMessageType = Message; // Backward compatibility

export type InsertUserInfo = z.infer<typeof insertUserInfoSchema>;
export type UserInfo = typeof userInfo.$inferSelect;
export type InsertUserInfoType = InsertUserInfo; // Backward compatibility
export type SelectUserInfoType = UserInfo; // Backward compatibility

export type InsertLearningProgress = z.infer<typeof insertLearningProgressSchema>;
export type LearningProgress = typeof learningProgress.$inferSelect;
export type InsertLearningProgressType = InsertLearningProgress; // Backward compatibility
export type SelectLearningProgressType = LearningProgress; // Backward compatibility

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSessionType = InsertSession; // Backward compatibility
export type SelectSessionType = Session; // Backward compatibility

// Legal compliance types
export type InsertTermsOfServiceVersion = z.infer<typeof insertTermsOfServiceVersionSchema>;
export type TermsOfServiceVersion = typeof termsOfServiceVersions.$inferSelect;

export type InsertDataExportRequest = z.infer<typeof insertDataExportRequestSchema>;
export type DataExportRequest = typeof dataExportRequests.$inferSelect;

export type InsertAccountDeletionRequest = z.infer<typeof insertAccountDeletionRequestSchema>;
export type AccountDeletionRequest = typeof accountDeletionRequests.$inferSelect;