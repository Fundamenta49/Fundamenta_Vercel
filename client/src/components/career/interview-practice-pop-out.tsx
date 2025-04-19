import { MessageSquare, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InterviewPracticeFullscreen from "@/components/career/interview-practice-fullscreen";

export default function InterviewPracticePopOut() {
  return (
    <div className="w-full">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-500" />
          Interview Practice
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Prepare for job interviews with AI-powered feedback
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
            Select an industry and question type to practice with AI-generated interview questions,
            or practice with common interview questions across different categories.
          </AlertDescription>
        </Alert>
        
        <InterviewPracticeFullscreen />
      </FullScreenDialogBody>
    </div>
  );
}