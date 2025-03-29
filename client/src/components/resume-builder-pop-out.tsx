import { FileText, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ResumeBuilder from "@/components/resume-builder";

export default function ResumeBuilderPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-500" />
          Resume Builder
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Create and manage your professional resume
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            You can upload an existing resume for analysis or build a new one from scratch.
            The AI will help format and optimize your resume for better job application results.
          </AlertDescription>
        </Alert>
        
        <ResumeBuilder />
      </FullScreenDialogBody>
    </div>
  );
}