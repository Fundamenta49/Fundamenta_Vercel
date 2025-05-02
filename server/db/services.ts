import { eq, and, desc, asc, or, like, sql } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../../shared/schema';
import { 
  type InsertUser,
  type InsertConversation,
  type InsertMessage,
  type InsertUserInfo,
  type User,
  type Conversation,
  type Message,
  type UserInfo
} from '../../shared/schema';

// User services
export const userService = {
  async getById(id: number): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return users[0];
  },

  async getByEmail(email: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return users[0];
  },

  async create(user: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  },

  async update(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(schema.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  }
};

// User info services (for session-based users without accounts)
export const userInfoService = {
  async getBySessionId(sessionId: string): Promise<UserInfo | undefined> {
    const userInfos = await db.select().from(schema.userInfo).where(eq(schema.userInfo.sessionId, sessionId));
    return userInfos[0];
  },

  async create(userInfo: InsertUserInfo): Promise<UserInfo> {
    const result = await db.insert(schema.userInfo).values(userInfo).returning();
    return result[0];
  },

  async update(id: number, data: Partial<InsertUserInfo>): Promise<UserInfo | undefined> {
    const result = await db.update(schema.userInfo)
      .set({ ...data, lastSeen: new Date() })
      .where(eq(schema.userInfo.id, id))
      .returning();
    return result[0];
  },

  async updateBySessionId(sessionId: string, data: Partial<InsertUserInfo>): Promise<UserInfo | undefined> {
    const result = await db.update(schema.userInfo)
      .set({ ...data, lastSeen: new Date() })
      .where(eq(schema.userInfo.sessionId, sessionId))
      .returning();
    return result[0];
  }
};

// Conversation services
export const conversationService = {
  async getById(id: number): Promise<Conversation | undefined> {
    const conversations = await db.select().from(schema.conversations).where(eq(schema.conversations.id, id));
    return conversations[0];
  },

  async getByUserId(userId: number): Promise<Conversation[]> {
    return await db.select().from(schema.conversations)
      .where(eq(schema.conversations.userId, userId))
      .orderBy(desc(schema.conversations.lastMessageAt));
  },
  
  async getAll(): Promise<Conversation[]> {
    return await db.select().from(schema.conversations)
      .orderBy(desc(schema.conversations.lastMessageAt));
  },

  async create(conversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(schema.conversations).values(conversation).returning();
    return result[0];
  },

  async update(id: number, data: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const result = await db.update(schema.conversations)
      .set({ ...data, lastMessageAt: new Date() })
      .where(eq(schema.conversations.id, id))
      .returning();
    return result[0];
  }
};

// Message services
export const messageService = {
  async getByConversationId(conversationId: number): Promise<Message[]> {
    return await db.select().from(schema.messages)
      .where(eq(schema.messages.conversationId, conversationId))
      .orderBy(asc(schema.messages.timestamp));
  },

  async create(message: InsertMessage): Promise<Message> {
    // Ensure conversationId is not null or undefined
    if (typeof message.conversationId !== 'number') {
      throw new Error('conversationId is required for message creation');
    }
    
    const result = await db.insert(schema.messages).values(message).returning();
    
    // Update the conversation's lastMessageAt timestamp
    await conversationService.update(message.conversationId, {});
    
    return result[0];
  },

  async getRecentMessages(conversationId: number, limit: number = 20): Promise<Message[]> {
    return await db.select().from(schema.messages)
      .where(eq(schema.messages.conversationId, conversationId))
      .orderBy(desc(schema.messages.timestamp))
      .limit(limit);
  }
};

// Session services
export const sessionService = {
  async cleanup(): Promise<void> {
    // Delete expired sessions
    const now = new Date();
    await db.delete(schema.sessions).where(
      sql`expire < ${now}`
    );
  }
};