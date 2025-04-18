import { useState } from "react";
import { Heart, AlertCircle, FileText, MonitorPlay, Medal, ChevronLeft } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CPRGuide from "@/components/cpr-guide";
import { VideoPlayerDialog } from "@/components/video-player-dialog";

// Define CPR instructional videos
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
}

const cprVideos: Video[] = [
  {
    id: "M4ACYp75mjU",
    title: "Hands-Only CPR Demonstration",
    description: "Learn how to perform hands-only CPR, a simpler form of CPR without mouth-to-mouth breathing that can save lives in an emergency.",
    thumbnailUrl: "/cpr-video-1.jpg",
    duration: "2:13"
  },
  {
    id: "cosVBV96E2g",
    title: "CPR for Adults",
    description: "Complete guide to performing CPR on adults, including proper hand placement, compression depth, and rescue breathing techniques.",
    thumbnailUrl: "/cpr-video-2.jpg",
    duration: "4:25"
  },
  {
    id: "0aV4K1nM4cg",
    title: "Infant and Child CPR Techniques",
    description: "Learn the important differences in CPR techniques for infants and children compared to adult CPR procedures.",
    thumbnailUrl: "/cpr-video-3.jpg",
    duration: "5:42"
  }
];

type SectionType = "menu" | "guide" | "videos" | "quiz";

export default function CPRGuidePopOut() {
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
        CPR Learning Resources
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Guide Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("guide")}
        >
          <Heart className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Interactive CPR Guide</h3>
          <p className="text-xs text-gray-500 mt-1">Step-by-step training with achievement tracking</p>
        </div>
        
        {/* Videos Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("videos")}
        >
          <MonitorPlay className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Training Videos</h3>
          <p className="text-xs text-gray-500 mt-1">Visual demonstrations of proper CPR techniques</p>
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
        CPR Training Videos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cprVideos.map(video => (
          <div key={video.id} className="rounded-lg border border-red-200 overflow-hidden bg-white shadow hover:shadow-md transition-all">
            <div className="relative pb-[56.25%] bg-gray-100">
              {/* Fallback image display with custom styling */}
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-red-50 cursor-pointer" 
                onClick={() => handlePlayVideo(video)}
              >
                <div className="text-center">
                  <MonitorPlay className="h-12 w-12 text-red-400 mx-auto mb-2" />
                  <div className="text-xs text-red-700 font-medium">CPR Training Video</div>
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
  
  // Main component render
  return (
    <div className="w-full max-w-7xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          CPR Training
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn essential CPR and first aid techniques
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            This guide is not a substitute for professional CPR training. Please seek certified training 
            from organizations like the American Heart Association or Red Cross for proper CPR techniques. 
            Always call emergency services (911) immediately in a cardiac emergency.
          </AlertDescription>
        </Alert>
        
        {currentSection === "menu" && renderMenu()}
        {currentSection === "guide" && (
          <>
            <BackToMenuButton />
            <CPRGuide />
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