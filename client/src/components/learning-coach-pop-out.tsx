import { Brain, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatInterface, { LEARNING_CATEGORY } from "@/components/chat-interface";

export default function LearningCoachPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-rose-500" />
          AI Learning Coach
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Get personalized guidance for your learning journey
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-rose-500 bg-rose-50">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <AlertDescription className="text-rose-800 text-sm">
            The AI coach provides personalized recommendations to help you learn more effectively.
            Ask about learning strategies, time management, or specific subjects.
          </AlertDescription>
        </Alert>
        
        <ChatInterface category={LEARNING_CATEGORY} />
      </FullScreenDialogBody>
    </div>
  );
}