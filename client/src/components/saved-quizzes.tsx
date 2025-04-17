import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedQuizzes } from "@/hooks/use-quiz-progress";
import { BookOpen, Calendar, PauseCircle, Clock, Dumbbell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

interface SavedQuizzesProps {
  userId: number;
}

export default function SavedQuizzes({ userId }: SavedQuizzesProps) {
  const [, navigate] = useLocation();
  const { data: savedQuizzes, isLoading, error } = useSavedQuizzes(userId);
  
  const resumeQuiz = (subject: string, pathwayId?: string, moduleId?: string) => {
    let url = `/learning/quiz/${subject}`;
    
    // Add optional query parameters
    const params = new URLSearchParams();
    if (pathwayId) params.append('pathwayId', pathwayId);
    if (moduleId) params.append('moduleId', moduleId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    navigate(url);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Quizzes</CardTitle>
          <CardDescription>Loading your saved quizzes...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-16 bg-gray-200 rounded-md w-full"></div>
            <div className="h-16 bg-gray-200 rounded-md w-full"></div>
            <div className="h-16 bg-gray-200 rounded-md w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Quizzes</CardTitle>
          <CardDescription>Could not load your saved quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">There was an error loading your saved quizzes. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!savedQuizzes || savedQuizzes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Quizzes</CardTitle>
          <CardDescription>You don't have any saved quizzes yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <PauseCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">
            When you save a quiz in progress, it will appear here so you can come back and finish it later.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => navigate("/learning/pathways")}>
            Browse Learning Pathways
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Recently";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Quizzes</CardTitle>
        <CardDescription>Resume your in-progress quizzes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedQuizzes.map((quiz, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-lg">{quiz.subject}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>Saved {formatDate(quiz.lastAccessedAt || quiz.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={quiz.completed ? "outline" : "secondary"} className={quiz.completed ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-500" : ""}>
                  {quiz.completed ? "Completed" : "In Progress"}
                </Badge>
                <Badge variant="outline" className="capitalize">{quiz.difficulty}</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Question {quiz.currentQuestionIndex + 1} of {quiz.questions?.length || 0}
              </div>
              <Button 
                onClick={() => resumeQuiz(quiz.subject, quiz.pathwayId, quiz.moduleId)}
                size="sm"
                disabled={quiz.completed}
              >
                {quiz.completed ? "View Results" : "Resume Quiz"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}