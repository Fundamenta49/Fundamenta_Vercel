import { Briefcase, AlertCircle, Network } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import JobSearch from "@/components/job-search";

export default function JobSearchPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
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
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Search for job openings, explore salary information, and compare compensation data
            all from one integrated platform. Enter a job title to get comprehensive insights.
          </AlertDescription>
        </Alert>
        
        <JobSearch />
      </FullScreenDialogBody>
    </div>
  );
}