import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

export interface UserInfo {
  id: number;
  sessionId: string;
  name: string | null;
  interests: string[];
  preferences: Record<string, any>;
  lastSeen: Date;
  createdAt: Date;
}

export interface Conversation {
  id: number;
  userId: number | null;
  title: string | null;
  category: string | null;
  lastMessageAt: Date | null;
  createdAt: Date | null;
  messages?: Message[];
}

export interface Message {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  category: string | null;
  metadata: {
    sentiment?: string;
    actions?: any[];
    suggestions?: any[];
  } | null;
  timestamp: Date;
}

// Type for new conversation creation
export interface NewConversation {
  userId?: number | null;
  title: string;
  category: string;
}

// Type for new message creation
export interface NewMessage {
  conversationId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  category?: string | null;
  metadata?: {
    sentiment?: string;
    actions?: any[];
    suggestions?: any[];
  } | null;
}

/**
 * Hook for managing user information and memory
 */
export function useUserMemory() {
  const queryClient = useQueryClient();
  
  // Get current user info (from session)
  const { 
    data: userInfo, 
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
    refetch: refetchUserInfo
  } = useQuery({ 
    queryKey: ['/api/user-info'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/user-info');
        const data = await response.json();
        
        if (data.error === false && data.userInfo) {
          return data.userInfo as UserInfo;
        }
        
        return null;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        return null;
      }
    }
  });
  
  // Update user info
  const updateUserInfoMutation = useMutation({
    mutationFn: async (data: Partial<UserInfo>) => {
      const response = await apiRequest('PATCH', '/api/user-info', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-info'] });
    },
    onError: (error) => {
      console.error('Failed to update user info:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update your information.',
        variant: 'destructive',
      });
    }
  });
  
  // Create user info
  const createUserInfoMutation = useMutation({
    mutationFn: async (data: Partial<UserInfo>) => {
      const response = await apiRequest('POST', '/api/user-info', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-info'] });
      refetchUserInfo();
    },
    onError: (error) => {
      console.error('Failed to create user info:', error);
      toast({
        title: 'Error',
        description: 'Could not save your information.',
        variant: 'destructive',
      });
    }
  });
  
  // Create a conversation
  const createConversationMutation = useMutation({
    mutationFn: async (data: NewConversation) => {
      console.log('Creating conversation with data:', data);
      
      try {
        const response = await apiRequest('POST', '/api/conversations', data);
        const responseData = await response.json();
        console.log('Conversation creation API response:', responseData);
        return responseData;
      } catch (error) {
        console.error('API error in conversation creation:', error);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: (data) => {
      console.log('Conversation created successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      return data as Conversation;
    },
    onError: (error) => {
      console.error('Failed to create conversation:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Don't show toast in the chat interface as it would be disruptive
      // Instead log to console for debugging
    }
  });
  
  // Add a message to a conversation
  const addMessageMutation = useMutation({
    mutationFn: async (data: NewMessage) => {
      const response = await apiRequest('POST', '/api/messages', data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate both the messages list and the conversation detail
      queryClient.invalidateQueries({ queryKey: ['/api/messages', { conversationId: variables.conversationId }] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', variables.conversationId] });
      return data as Message;
    },
    onError: (error) => {
      console.error('Failed to add message:', error);
      // Don't show toast here as it would be disruptive during chat
    }
  });
  
  // Set or update the user's name
  const setUserName = async (name: string) => {
    if (!name.trim()) return;
    
    try {
      if (userInfo) {
        // Update existing user info
        await updateUserInfoMutation.mutateAsync({ name });
      } else {
        // Create new user info
        await createUserInfoMutation.mutateAsync({ name });
      }
    } catch (error) {
      console.error('Error setting user name:', error);
    }
  };
  
  // Start a new conversation
  const startConversation = async (category: string, title?: string): Promise<Conversation | null> => {
    try {
      console.log('Starting new conversation with category:', category);
      
      // Create a more descriptive conversation title
      const conversationTitle = title || `${category.charAt(0).toUpperCase() + category.slice(1)} Conversation`;
      
      // Submit the conversation creation request
      const newConversation = await createConversationMutation.mutateAsync({
        title: conversationTitle,
        category
      });
      
      console.log('Conversation created successfully:', newConversation);
      return newConversation as Conversation;
    } catch (error) {
      console.error('Error starting conversation:', error);
      // Add more specific error logging to help diagnose the issue
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return null;
    }
  };
  
  // Add a message to the conversation
  const addMessage = async (conversationId: number, role: 'user' | 'assistant' | 'system', content: string, category?: string, metadata?: any): Promise<Message | null> => {
    try {
      const message = await addMessageMutation.mutateAsync({
        conversationId,
        role,
        content,
        category: category || null,
        metadata: metadata || null
      });
      return message as Message;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  };
  
  // Additional helper function to save user preferences
  const saveUserPreference = async (key: string, value: any) => {
    if (!userInfo) {
      // Create user info first if it doesn't exist
      await createUserInfoMutation.mutateAsync({ 
        preferences: { [key]: value } 
      });
      return;
    }
    
    // Update existing preferences
    const updatedPreferences = {
      ...userInfo.preferences,
      [key]: value
    };
    
    await updateUserInfoMutation.mutateAsync({
      preferences: updatedPreferences
    });
  };
  
  // Retrieve a user preference by key
  const getUserPreference = (key: string): any => {
    if (!userInfo || !userInfo.preferences) return null;
    return userInfo.preferences[key];
  };
  
  return {
    userInfo,
    isUserInfoLoading,
    isUserInfoError,
    setUserName,
    startConversation,
    addMessage,
    saveUserPreference,
    getUserPreference,
    refetchUserInfo
  };
}