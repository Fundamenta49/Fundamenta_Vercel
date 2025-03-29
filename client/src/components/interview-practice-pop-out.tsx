import { MessageSquare, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InterviewPractice from "@/components/interview-practice";

export default function InterviewPracticePopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-500" />
          Interview Practice
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Prepare for job interviews with AI feedback
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Practice answering common interview questions and receive AI feedback to improve your responses.
            You can also generate custom questions for specific job roles.
          </AlertDescription>
        </Alert>
        
        <InterviewPractice />
      </FullScreenDialogBody>
    </div>
  );
}