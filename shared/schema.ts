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

// Quiz Progress Tracking Table
export const quizProgress = pgTable("quiz_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pathwayId: text("pathway_id"),
  moduleId: text("module_id"),
  subject: text("subject").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"),
  currentQuestionIndex: integer("current_question_index").notNull().default(0),
  score: integer("score").notNull().default(0),
  questions: json("questions").notNull(), // Store the quiz questions
  userAnswers: json("user_answers").notNull(), // Array of user's answers
  adaptiveLearning: boolean("adaptive_learning").notNull().default(false),
  completed: boolean("completed").notNull().default(false),
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

export const insertQuizProgressSchema = createInsertSchema(quizProgress)
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

export type InsertLearningProgressType = z.infer<typeof insertLearningProgressSchema>;
export type SelectLearningProgressType = typeof learningProgress.$inferSelect;

export type InsertQuizProgressType = z.infer<typeof insertQuizProgressSchema>;
export type SelectQuizProgressType = typeof quizProgress.$inferSelect;

export type InsertSessionType = z.infer<typeof insertSessionSchema>;
export type SelectSessionType = typeof sessions.$inferSelect;
export type Session = typeof sessions.$inferSelect;