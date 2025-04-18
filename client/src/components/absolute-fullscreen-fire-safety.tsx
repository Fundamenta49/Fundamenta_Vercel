import { useState } from "react";
import { Flame, X, AlertCircle, FileText, MonitorPlay, Medal, ChevronLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import FireSafety from "@/components/fire-safety";
import { VideoPlayerDialog } from "@/components/video-player-dialog";

// Define fire safety videos
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
}

const fireSafetyVideos: Video[] = [
  {
    id: "PQV71INDaqY",
    title: "How to Use a Fire Extinguisher (PASS Method)",
    description: "Learn the proper technique for using a fire extinguisher with the PASS method: Pull, Aim, Squeeze, Sweep.",
    thumbnailUrl: "/fire-video-1.jpg",
    duration: "2:45"
  },
  {
    id: "4LQ6uhXAzvk",
    title: "Smoke Detector Maintenance and Testing",
    description: "Essential maintenance tips for keeping your smoke detectors working properly to protect your home.",
    thumbnailUrl: "/fire-video-2.jpg",
    duration: "3:15"
  },
  {
    id: "9GMv4NsLr9o",
    title: "Family Fire Escape Plan",
    description: "How to create and practice a family fire escape plan to ensure everyone knows what to do in case of a fire emergency.",
    thumbnailUrl: "/fire-video-3.jpg",
    duration: "4:10"
  }
];

type SectionType = "menu" | "guide" | "videos" | "quiz";

interface AbsoluteFullscreenFireSafetyProps {
  onClose: () => void;
}

export default function AbsoluteFullscreenFireSafety({ onClose }: AbsoluteFullscreenFireSafetyProps) {
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
        Fire Safety Resources
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Guide Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("guide")}
        >
          <Flame className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Fire Safety Guide</h3>
          <p className="text-xs text-gray-500 mt-1">Essential fire prevention and response techniques</p>
        </div>
        
        {/* Videos Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("videos")}
        >
          <MonitorPlay className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Training Videos</h3>
          <p className="text-xs text-gray-500 mt-1">Visual demonstrations of fire safety techniques</p>
        </div>
      </div>
    </div>
  );

  // Render videos section
  const renderVideos = () => (
    <div className="space-y-4">
      <BackToMenuButton />
      
      <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2 flex items-center gap-2">
        <MonitorPlay className="h-5 w-5" />
        Fire Safety Videos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fireSafetyVideos.map(video => (
          <div key={video.id} className="rounded-lg border border-red-200 overflow-hidden bg-white shadow hover:shadow-md transition-all">
            <div className="relative pb-[56.25%] bg-gray-100">
              {/* Fallback image display with custom styling */}
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-red-50 cursor-pointer" 
                onClick={() => handlePlayVideo(video)}
              >
                <div className="text-center">
                  <MonitorPlay className="h-12 w-12 text-red-400 mx-auto mb-2" />
                  <div className="text-xs text-red-700 font-medium">Fire Safety Video</div>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm">{video.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3 text-red-600 border-red-200 hover:bg-red-50"
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
  
  // Main component render with absolute positioning
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-red-500" />
          <h1 className="text-xl font-bold">Fire Safety</h1>
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
      
      {/* Main content area with overflow scrolling */}
      <div className="flex-1 overflow-y-auto p-4">
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            In case of fire, evacuate immediately and call emergency services (911 in the US).
            These guides are for educational purposes and preparedness only.
          </AlertDescription>
        </Alert>
        
        {currentSection === "menu" && renderMenu()}
        {currentSection === "guide" && (
          <>
            <BackToMenuButton />
            <FireSafety />
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
      </div>
    </div>
  );
}