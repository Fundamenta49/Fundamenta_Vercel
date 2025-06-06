import { useState } from "react";
import { Flame, AlertCircle, FileText, MonitorPlay, Medal, ChevronLeft } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
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
    title: "Home Fire Prevention Tips",
    description: "Learn practical steps to prevent house fires and keep your family safe with these essential prevention strategies.",
    thumbnailUrl: "/fire-video-3.jpg",
    duration: "4:30"
  }
];

type SectionType = "menu" | "guide" | "videos";

export default function FireSafetyPopOut() {
  // Access toast system
  const { toast } = useToast();
  
  // State for section navigation - set to "guide" to open directly to the Fire Safety Guide
  const [currentSection, setCurrentSection] = useState<SectionType>("guide");
  
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
      className: "bg-orange-50 border-orange-200 text-orange-900",
      duration: 1500,
    });
  };

  // Back to menu button
  const BackToMenuButton = () => (
    <Button 
      variant="ghost" 
      size="sm" 
      className="mb-4 text-orange-600" 
      onClick={() => setCurrentSection("menu")}
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
      Back to menu
    </Button>
  );
  
  // Render menu section
  const renderMenu = () => (
    <div className="w-full space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-orange-600 border-b-2 border-orange-200 pb-2">
        Fire Safety Resources
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Guide Card */}
        <div 
          className="p-4 rounded-lg border border-orange-200 hover:border-orange-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("guide")}
        >
          <FileText className="h-8 w-8 text-orange-500 mb-2" />
          <h3 className="font-semibold text-orange-700">Fire Safety Guide</h3>
          <p className="text-xs text-gray-500 mt-1">Comprehensive guide to fire prevention and safety</p>
        </div>
        
        {/* Videos Card */}
        <div 
          className="p-4 rounded-lg border border-orange-200 hover:border-orange-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("videos")}
        >
          <MonitorPlay className="h-8 w-8 text-orange-500 mb-2" />
          <h3 className="font-semibold text-orange-700">Safety Videos</h3>
          <p className="text-xs text-gray-500 mt-1">Visual guides for fire prevention and response</p>
        </div>
      </div>
    </div>
  );

  // Render videos section
  const renderVideos = () => (
    <div className="space-y-4">
      <BackToMenuButton />
      
      <h2 className="text-lg sm:text-xl font-bold text-orange-600 border-b-2 border-orange-200 pb-2 flex items-center gap-2">
        <MonitorPlay className="h-5 w-5" />
        Fire Safety Videos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fireSafetyVideos.map(video => (
          <div key={video.id} className="rounded-lg border border-orange-200 overflow-hidden bg-white shadow hover:shadow-md transition-all">
            <div className="relative pb-[56.25%] bg-gray-100">
              {/* Fallback image display with custom styling */}
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-orange-50 cursor-pointer" 
                onClick={() => handlePlayVideo(video)}
              >
                <div className="text-center">
                  <MonitorPlay className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                  <div className="text-xs text-orange-700 font-medium">Fire Safety Video</div>
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
                className="w-full mt-3 text-orange-600 border-orange-200 hover:bg-orange-50"
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
    <div className="w-full">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          Fire Safety Guide
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn about fire prevention and emergency procedures
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody className="overflow-y-auto max-h-[80vh] md:max-h-[unset]">
        <Alert className="mb-4 border-orange-500 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-800 text-sm">
            In a fire emergency, evacuate immediately and call 911. Your safety comes first - never delay evacuation 
            to gather belongings or use an elevator. These guidelines complement, not replace, professional fire safety training.
          </AlertDescription>
        </Alert>
        
        {currentSection === "menu" && renderMenu()}
        {currentSection === "guide" && (
          <div className="prose prose-orange max-w-none">
            <FireSafety />
          </div>
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