import { X, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmergencyGuide from "@/components/emergency-guide";

interface AbsoluteFullscreenEmergencyGuideProps {
  onClose: () => void;
}

export default function AbsoluteFullscreenEmergencyGuide({ onClose }: AbsoluteFullscreenEmergencyGuideProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-red-500" />
          <h1 className="text-xl font-bold">Emergency Guides</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-red-50 hover:text-red-500"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      {/* Main content area with overflow scrolling - use the original EmergencyGuide component */}
      <div className="flex-1 overflow-y-auto">
        <EmergencyGuide />
      </div>
    </div>
  );
}