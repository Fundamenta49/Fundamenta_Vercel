import { User, InsertUser, Conversation, InsertConversation } from "@shared/schema";
import { ChatMessage } from "@shared/types";
import session from "express-session";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  addMessage(conversationId: number, message: ChatMessage): Promise<void>;
  sessionStore: session.Store;
}

import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private currentUserId: number;
  private currentConversationId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
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
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || 'user',
      emailVerified: insertUser.emailVerified || false,
      privacyConsent: insertUser.privacyConsent || false,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
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
}

export const storage = new MemStorage();
