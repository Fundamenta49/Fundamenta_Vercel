import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface QuizQuestion {
  id?: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'proficient';
}

export interface QuizProgress {
  id?: number;
  userId: number;
  pathwayId?: string;
  moduleId?: string;
  subject: string;
  difficulty: string;
  currentQuestionIndex: number; 
  score: number;
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  adaptiveLearning: boolean;
  completed: boolean;
  lastAccessedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaveProgressOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for managing quiz progress persistence
 */
export function useQuizProgress(userId: number, subject: string, pathwayId?: string, moduleId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isResuming, setIsResuming] = useState(false);

  // Query for saved progress
  const savedQuizQuery = useQuery({
    queryKey: ['/api/learning/quiz-progress', userId, subject, pathwayId, moduleId],
    queryFn: async () => {
      let url = `/api/learning/quiz-progress/${userId}/${subject}`;
      
      // Add optional query parameters if provided
      const params = new URLSearchParams();
      if (pathwayId) params.append('pathwayId', pathwayId);
      if (moduleId) params.append('moduleId', moduleId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return apiRequest(url);
    },
    enabled: false, // Don't run automatically, we'll manually invoke it
    retry: 1
  });

  // Mutation for saving progress
  const saveProgressMutation = useMutation({
    mutationFn: async (progressData: QuizProgress) => {
      return apiRequest('/api/learning/save-quiz-progress', 'POST', progressData);
    },
    onSuccess: () => {
      // Invalidate the saved quiz progress query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ['/api/learning/quiz-progress', userId]
      });
    }
  });

  /**
   * Save the current quiz progress
   */
  const saveProgress = async (
    progressData: Omit<QuizProgress, 'userId'>, 
    options?: SaveProgressOptions
  ) => {
    try {
      await saveProgressMutation.mutateAsync({
        ...progressData,
        userId
      });
      
      // Show success message
      toast({
        title: "Progress saved",
        description: "You can resume this quiz later.",
        duration: 3000
      });
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error('Error saving quiz progress:', error);
      
      // Show error message
      toast({
        title: "Failed to save progress",
        description: "Please try again.",
        variant: "destructive",
        duration: 3000
      });
      
      if (options?.onError && error instanceof Error) {
        options.onError(error);
      }
    }
  };

  /**
   * Check for saved quiz progress and resume if available
   */
  const checkForSavedProgress = async () => {
    setIsResuming(true);
    try {
      const result = await savedQuizQuery.refetch();
      setIsResuming(false);
      return result.data;
    } catch (error) {
      setIsResuming(false);
      console.error('No saved progress found or error occurred:', error);
      return null;
    }
  };

  return {
    saveProgress,
    checkForSavedProgress,
    isResuming,
    isSaving: saveProgressMutation.isPending,
    savedQuiz: savedQuizQuery.data
  };
}

/**
 * Hook to get all saved (incomplete) quizzes for a user
 */
export function useSavedQuizzes(userId: number) {
  return useQuery({
    queryKey: ['/api/learning/quiz-progress', userId],
    queryFn: async () => {
      return apiRequest(`/api/learning/quiz-progress/${userId}`);
    },
    enabled: !!userId, // Only run if userId is provided
    retry: 1
  });
}