import { PhoneCall, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmergencyGuide from "@/components/emergency-guide";

export default function EmergencyGuidePopOut() {
  // Main component render - simplified to directly show the emergency guide
  return (
    <div className="w-full">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <PhoneCall className="h-6 w-6 text-red-500" />
          Emergency Guides
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Step-by-step guides for various emergency situations
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).
            These guides provide general information and should not delay seeking professional help.
          </AlertDescription>
        </Alert>
        
        {/* Show the emergency guide directly */}
        <EmergencyGuide />
      </FullScreenDialogBody>
    </div>
  );
}