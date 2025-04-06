import { pgTable, text, timestamp, integer, boolean, json, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User goals
export const userGoalTable = pgTable("user_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "finance", "career", "wellness", etc.
  targetDate: timestamp("target_date"),
  completed: boolean("completed").default(false),
  progress: integer("progress").default(0), // 0-100 percent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications
export const notificationTypeEnum = pgEnum("notification_type", [
  "ACHIEVEMENT_UNLOCKED", 
  "GOAL_PROGRESS", 
  "GOAL_COMPLETED", 
  "REMINDER",
  "SYSTEM",
  "FUNDI_COMMENT"
]);

export const notificationTable = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  read: boolean("read").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: json("metadata").default({}), // For storing achievement/goal data if needed
});

// Achievement tracking for users
export const userAchievementTable = pgTable("user_achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  shared: boolean("shared").default(false), // Whether the achievement has been shared to social media
});

// Schema validators
export const insertUserGoalSchema = createInsertSchema(userGoalTable).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertNotificationSchema = createInsertSchema(notificationTable).omit({
  id: true,
  timestamp: true
});

export const insertUserAchievementSchema = createInsertSchema(userAchievementTable).omit({
  id: true,
  unlockedAt: true
});

// User schema for user accounts
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
});

// User Info schema for session-based user data
export const insertUserInfoSchema = z.object({
  sessionId: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  preferences: z.record(z.any()).optional(),
});

// Type definitions
export type UserGoal = typeof userGoalTable.$inferSelect;
export type InsertUserGoal = z.infer<typeof insertUserGoalSchema>;

export type Notification = typeof notificationTable.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type UserAchievement = typeof userAchievementTable.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;