import { 
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Coffee, Sun } from "lucide-react";
import ComprehensiveWellnessAssessment from "@/components/comprehensive-wellness-assessment";

export default function ComprehensiveWellnessPopOut() {
  return (
    <>
      <FullScreenDialogHeader className="mb-6">
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-amber-600" />
          Coffee Talk
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Let's connect—and realign—with what really matters
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody className="pt-6">
        <div className="w-full">
          <ComprehensiveWellnessAssessment />
        </div>
      </FullScreenDialogBody>
      
      <FullScreenDialogFooter>
        <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Sun className="h-4 w-4 text-amber-500" />
          <span>This is a friendly conversation, not a diagnostic tool. Always reach out to healthcare professionals for medical advice.</span>
        </div>
      </FullScreenDialogFooter>
    </>
  );
}