import { Network, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import JobSearchFullscreen from "@/components/career/job-search-fullscreen";

export default function JobSearchPopOut() {
  return (
    <div className="w-full">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Network className="h-6 w-6 text-blue-500" />
          Fundamenta Connects
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Find opportunities and research salary insights - all in one place
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
            Research salary trends and find job opportunities in your field.
            Switch between tabs to access different features.
          </AlertDescription>
        </Alert>
        
        <JobSearchFullscreen />
      </FullScreenDialogBody>
    </div>
  );
}