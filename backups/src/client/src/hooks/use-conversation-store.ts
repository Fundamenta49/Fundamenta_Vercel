import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, Message } from './use-user-memory';

interface ConversationStore {
  // Current active conversation ID
  activeConversationId: number | null;
  
  // In-memory cache of conversations
  conversations: Record<number, Conversation>;
  
  // In-memory cache of messages by conversation ID
  messagesByConversation: Record<number, Message[]>;
  
  // Actions
  setActiveConversation: (conversationId: number | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: number, message: Message) => void;
  addMessages: (conversationId: number, messages: Message[]) => void;
  clearCache: () => void;
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      activeConversationId: null,
      conversations: {},
      messagesByConversation: {},
      
      setActiveConversation: (conversationId) => 
        set(() => ({ activeConversationId: conversationId })),
      
      addConversation: (conversation) => 
        set((state) => ({ 
          conversations: { 
            ...state.conversations, 
            [conversation.id]: conversation 
          } 
        })),
      
      updateConversation: (conversation) => 
        set((state) => ({ 
          conversations: { 
            ...state.conversations, 
            [conversation.id]: {
              ...state.conversations[conversation.id],
              ...conversation
            } 
          } 
        })),
      
      addMessage: (conversationId, message) => 
        set((state) => ({ 
          messagesByConversation: { 
            ...state.messagesByConversation, 
            [conversationId]: [
              ...(state.messagesByConversation[conversationId] || []), 
              message
            ] 
          } 
        })),
      
      addMessages: (conversationId, messages) => 
        set((state) => ({ 
          messagesByConversation: { 
            ...state.messagesByConversation, 
            [conversationId]: messages 
          } 
        })),
      
      clearCache: () => 
        set(() => ({ 
          conversations: {}, 
          messagesByConversation: {} 
        })),
    }),
    {
      name: 'fundi-conversation-store',
    }
  )
);

export default useConversationStore;