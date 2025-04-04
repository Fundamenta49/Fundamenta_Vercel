import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  json, 
  integer, 
  boolean,
  primaryKey,
  varchar 
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  preferences: json('preferences').$type<{
    theme?: string;
    notifications?: boolean;
    categoryPreferences?: string[];
  }>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Conversations table
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  category: text('category').default('general'),
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').$type<'user' | 'assistant' | 'system'>(),
  content: text('content'),
  category: text('category'),
  metadata: json('metadata').$type<{
    sentiment?: string;
    actions?: any[];
    suggestions?: any[];
  }>().default({}),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Session storage for user recognition
export const sessions = pgTable('sessions', {
  sid: varchar('sid').primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire', { withTimezone: true }).notNull(),
});

// User information storage (for users without accounts)
export const userInfo = pgTable('user_info', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  name: text('name'),
  interests: json('interests').$type<string[]>().default([]),
  preferences: json('preferences').$type<Record<string, any>>().default({}),
  lastSeen: timestamp('last_seen').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ 
  id: true,
  createdAt: true,
  lastMessageAt: true
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true,
  timestamp: true 
});

export const insertUserInfoSchema = createInsertSchema(userInfo).omit({
  id: true,
  createdAt: true,
  lastSeen: true
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type UserInfo = typeof userInfo.$inferSelect;
export type InsertUserInfo = z.infer<typeof insertUserInfoSchema>;

export type Session = typeof sessions.$inferSelect;