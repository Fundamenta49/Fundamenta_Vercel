import { GraduationCap, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RiasecTest from "@/components/riasec-test";

export default function CareerAssessmentPopOut() {
  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 py-4 sm:py-5 mb-2">
        <div className="flex flex-col mb-3">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            <h1 className="text-xl sm:text-2xl font-semibold">Career Assessment</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Discover your career interests and strengths
          </p>
        </div>
        
        <Alert className="mb-4 border-blue-500 bg-blue-50 p-3 sm:p-4">
          <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
          <AlertDescription className="text-blue-800 text-xs sm:text-sm ml-2">
            This assessment uses the RIASEC model to identify career interests. The results 
            provide general guidance and should be considered alongside other factors when 
            making career decisions.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="px-4 sm:px-6 pb-6">
        <RiasecTest />
      </div>
    </div>
  );
}