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

// Subscription tier enum
export const subscriptionTiers = {
  FREE: "free",
  PREMIUM: "premium",
  PRO: "pro",
} as const;

export type SubscriptionTier = keyof typeof subscriptionTiers;

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  emailVerified: boolean("email_verified").default(false),
  privacyConsent: boolean("privacy_consent").default(false),
  // Subscription fields
  subscriptionTier: text("subscription_tier").default(subscriptionTiers.FREE),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  aiTokensUsed: integer("ai_tokens_used").default(0),
  aiMonthlyAllowance: integer("ai_monthly_allowance").default(10000), // Default free tier allowance
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

export const insertLearningProgressSchema = createInsertSchema(learningProgress)
  .omit({ id: true, createdAt: true, updatedAt: true });


  
export const insertSessionSchema = createInsertSchema(sessions);

// Define TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserType = InsertUser; // Backward compatibility
export type SelectUserType = User; // Backward compatibility

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