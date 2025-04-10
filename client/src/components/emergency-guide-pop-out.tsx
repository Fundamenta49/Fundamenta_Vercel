import { useState } from "react";
import { PhoneCall, AlertCircle, FileText, MonitorPlay, ChevronLeft } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EmergencyGuide from "@/components/emergency-guide";
import { VideoPlayerDialog } from "@/components/video-player-dialog";

// Define emergency instructional videos
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
}

const emergencyVideos: Video[] = [
  {
    id: "XpEvQuOWME0",
    title: "What to Do in a Medical Emergency",
    description: "Learn how to respond effectively in medical emergencies, including when to call 911 and initial assessment steps.",
    thumbnailUrl: "/emergency-video-1.jpg",
    duration: "3:25"
  },
  {
    id: "EqM9BSrGjpA",
    title: "Natural Disaster Preparedness",
    description: "Essential tips for preparing for and surviving natural disasters including hurricanes, floods, and earthquakes.",
    thumbnailUrl: "/emergency-video-2.jpg",
    duration: "7:18"
  },
  {
    id: "FdzTdqMJWsc",
    title: "First Aid Essentials",
    description: "Basic first aid techniques that everyone should know, from treating cuts and burns to recognizing signs of shock.",
    thumbnailUrl: "/emergency-video-3.jpg",
    duration: "5:41"
  }
];

type SectionType = "menu" | "guide" | "videos";

export default function EmergencyGuidePopOut() {
  // Access toast system
  const { toast } = useToast();
  
  // State for section navigation
  const [currentSection, setCurrentSection] = useState<SectionType>("menu");
  
  // State for video player dialog
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Handle video play action
  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
    
    toast({
      title: `Playing: ${video.title}`,
      description: "Opening video player...",
      className: "bg-red-50 border-red-200 text-red-900",
      duration: 1500,
    });
  };

  // Back to menu button
  const BackToMenuButton = () => (
    <Button 
      variant="ghost" 
      size="sm" 
      className="mb-4 text-red-600" 
      onClick={() => setCurrentSection("menu")}
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
      Back to menu
    </Button>
  );
  
  // Render menu section
  const renderMenu = () => (
    <div className="w-full space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
        Emergency Resources
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Guide Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("guide")}
        >
          <PhoneCall className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Emergency Guide</h3>
          <p className="text-xs text-gray-500 mt-1">Step-by-step response guides for various emergencies</p>
        </div>
        
        {/* Videos Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("videos")}
        >
          <MonitorPlay className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Training Videos</h3>
          <p className="text-xs text-gray-500 mt-1">Visual guides for emergency response and preparation</p>
        </div>
      </div>
    </div>
  );

  // Render videos section
  const renderVideos = () => (
    <div className="space-y-6">
      <BackToMenuButton />
      
      <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2 flex items-center gap-2">
        <MonitorPlay className="h-5 w-5" />
        Emergency Response Videos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyVideos.map(video => (
          <div 
            key={video.id} 
            className="rounded-lg border border-red-200 overflow-hidden bg-white shadow hover:shadow-md transition-all flex flex-col h-full"
          >
            <div 
              className="relative aspect-video bg-red-50 cursor-pointer" 
              onClick={() => handlePlayVideo(video)}
            >
              {/* Video thumbnail with play button overlay */}
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-2 shadow-md hover:bg-red-200 transition-colors">
                    <MonitorPlay className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-xs font-medium text-red-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                    {video.duration}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-medium text-base text-gray-800">{video.title}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-grow">{video.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50 font-medium"
                onClick={() => handlePlayVideo(video)}
              >
                Watch Video
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Main component render
  return (
    <div className="w-full max-w-screen-xl mx-auto">
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
        
        {currentSection === "menu" && renderMenu()}
        {currentSection === "guide" && (
          <>
            <BackToMenuButton />
            <EmergencyGuide />
          </>
        )}
        {currentSection === "videos" && renderVideos()}
        
        {/* Video Player Dialog */}
        {selectedVideo && (
          <VideoPlayerDialog
            open={videoDialogOpen}
            onOpenChange={setVideoDialogOpen}
            videoId={selectedVideo.id}
            title={selectedVideo.title}
            description={selectedVideo.description}
          />
        )}
      </FullScreenDialogBody>
    </div>
  );
}