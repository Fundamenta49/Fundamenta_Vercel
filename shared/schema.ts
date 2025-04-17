import { pgTable, serial, text, timestamp, boolean, integer, real, jsonb, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { and, eq, desc } from "drizzle-orm";

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
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
  age: integer("age"),
  gender: text("gender"),
  occupation: text("occupation"),
  interests: text("interests"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User Goals Table
export const userGoals = pgTable("user_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User Achievements Table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Basic Run Session Table
export const runSessions = pgTable("run_sessions", {
  id: serial("id").primaryKey(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  distance: real("distance").notNull().default(0), // in miles
  duration: integer("duration").notNull().default(0), // in seconds
  pace: real("pace"), // minutes per mile
  userId: text("user_id").notNull(), // can be connected to your auth system
  routeData: text("route_data"), // JSON stringified route points
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Running Goals and Milestone Tracking Table
export const runningGoals = pgTable("running_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  goalType: text("goal_type").notNull(), // "5K", "10K", "HALF_MARATHON", "MARATHON", "CUSTOM"
  targetDistance: real("target_distance"), // in miles
  targetTime: integer("target_time"), // in seconds
  startDate: timestamp("start_date").notNull().defaultNow(),
  targetDate: timestamp("target_date"),
  completed: boolean("completed").notNull().default(false),
  completedDate: timestamp("completed_date"),
  trainingPlanId: integer("training_plan_id"), // reference to training plan if any
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Training Plans Table for structured programs
export const trainingPlans = pgTable("training_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  goalType: text("goal_type").notNull(), // "5K", "10K", etc.
  durationWeeks: integer("duration_weeks").notNull(),
  difficulty: text("difficulty").notNull(), // "BEGINNER", "INTERMEDIATE", "ADVANCED"
  planData: text("plan_data").notNull(), // JSON stringified training schedule
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
  lastAccessedAt: timestamp("last_accessed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Sessions Table for express-session with connect-pg-simple
export const sessions = pgTable("sessions", {
  sid: varchar("sid").notNull().primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull()
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

export const insertUserGoalSchema = createInsertSchema(userGoals)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertUserAchievementSchema = createInsertSchema(userAchievements)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertNotificationSchema = createInsertSchema(notifications)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertRunSessionSchema = createInsertSchema(runSessions)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertRunningGoalSchema = createInsertSchema(runningGoals)
  .omit({ id: true, createdAt: true, updatedAt: true, completed: true, completedDate: true });

export const insertTrainingPlanSchema = createInsertSchema(trainingPlans)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertLearningProgressSchema = createInsertSchema(learningProgress)
  .omit({ id: true, createdAt: true, updatedAt: true });
  
export const insertSessionSchema = createInsertSchema(sessions);

// Define TypeScript types
export type InsertUserType = z.infer<typeof insertUserSchema>;
export type SelectUserType = typeof users.$inferSelect;

export type InsertConversationType = z.infer<typeof insertConversationSchema>;
export type SelectConversationType = typeof conversations.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessageType = z.infer<typeof insertMessageSchema>;
export type SelectMessageType = typeof messages.$inferSelect;
export type Message = typeof messages.$inferSelect;

export type InsertUserInfoType = z.infer<typeof insertUserInfoSchema>;
export type SelectUserInfoType = typeof userInfo.$inferSelect;

export type InsertUserGoalType = z.infer<typeof insertUserGoalSchema>;
export type SelectUserGoalType = typeof userGoals.$inferSelect;

export type InsertUserAchievementType = z.infer<typeof insertUserAchievementSchema>;
export type SelectUserAchievementType = typeof userAchievements.$inferSelect;

export type InsertNotificationType = z.infer<typeof insertNotificationSchema>;
export type SelectNotificationType = typeof notifications.$inferSelect;

export type InsertRunSessionType = z.infer<typeof insertRunSessionSchema>;
export type SelectRunSessionType = typeof runSessions.$inferSelect;

export type InsertRunningGoalType = z.infer<typeof insertRunningGoalSchema>;
export type SelectRunningGoalType = typeof runningGoals.$inferSelect;

export type InsertTrainingPlanType = z.infer<typeof insertTrainingPlanSchema>;
export type SelectTrainingPlanType = typeof trainingPlans.$inferSelect;

export type InsertLearningProgressType = z.infer<typeof insertLearningProgressSchema>;
export type SelectLearningProgressType = typeof learningProgress.$inferSelect;

export type InsertSessionType = z.infer<typeof insertSessionSchema>;
export type SelectSessionType = typeof sessions.$inferSelect;
export type Session = typeof sessions.$inferSelect;