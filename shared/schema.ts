import { pgTable, text, timestamp, integer, boolean, json, pgEnum, uuid, foreignKey, primaryKey } from "drizzle-orm/pg-core";
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

// Users
export const users = pgTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email").notNull().unique(),
  preferences: json("preferences").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session-based user info
export const userInfo = pgTable("user_info", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull().unique(),
  name: text("name"),
  interests: json("interests").default({}),
  preferences: json("preferences").default({}),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sessions
export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Conversations
export const conversations = pgTable("conversations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" }),
  title: text("title").notNull(),
  category: text("category"),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  conversationId: integer("conversation_id", { mode: "number" }).notNull(),
  role: text("role").notNull(), // "user", "assistant", "system"
  content: text("content").notNull(),
  category: text("category"), // Optional category/topic
  metadata: json("metadata").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Subscription plan types
export const planTypeEnum = pgEnum("plan_type", [
  "FREE",
  "BASIC",
  "PROFESSIONAL",
  "TEAM"
]);

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: planTypeEnum("type").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Stored in cents
  billingCycle: text("billing_cycle").notNull(), // "monthly" or "yearly"
  features: json("features").default([]),
  maxUsers: integer("max_users"), // Maximum users allowed (for team plans)
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organizations/Teams
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id", { mode: "number" }).notNull().references(() => users.id),
  planId: uuid("plan_id").references(() => subscriptionPlans.id),
  planExpiresAt: timestamp("plan_expires_at"),
  logoUrl: text("logo_url"),
  settings: json("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User roles in organizations
export const userRoleEnum = pgEnum("user_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER"
]);

// Organization memberships
export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: integer("user_id", { mode: "number" }).notNull().references(() => users.id),
  role: userRoleEnum("role").notNull().default("MEMBER"),
  invitedBy: integer("invited_by", { mode: "number" }).references(() => users.id),
  invitedAt: timestamp("invited_at").defaultNow(),
  joinedAt: timestamp("joined_at"),
  status: text("status").notNull().default("PENDING"), // "PENDING", "ACTIVE", "DECLINED"
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

// Insert schema for users
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Insert schema for user info
export const insertUserInfoSchema = createInsertSchema(userInfo).omit({
  id: true,
  lastSeen: true,
  createdAt: true
});

// Insert schema for conversations
export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true,
  createdAt: true
});

// Insert schema for messages
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true
});

// Type definitions
export type UserGoal = typeof userGoalTable.$inferSelect;
export type InsertUserGoal = z.infer<typeof insertUserGoalSchema>;

export type Notification = typeof notificationTable.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type UserAchievement = typeof userAchievementTable.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserInfo = typeof userInfo.$inferSelect;
export type InsertUserInfo = z.infer<typeof insertUserInfoSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;