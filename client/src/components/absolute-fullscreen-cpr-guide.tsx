import { useState } from "react";
import { Heart, AlertCircle, FileText, MonitorPlay, Medal, ChevronLeft, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CPRGuide from "@/components/cpr-guide";
import { VideoPlayerDialog } from "@/components/video-player-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

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
    id: "kosS2HUzPDs",
    title: "Adult CPR - Step by Step",
    description: "A comprehensive guide to performing CPR on adults, covering the full procedure with clear instructions for each step.",
    thumbnailUrl: "/cpr-video-2.jpg",
    duration: "3:46"
  },
  {
    id: "n5hP2KioIco",
    title: "Infant CPR Tutorial",
    description: "Learn the proper technique for performing CPR on infants, including key differences from adult CPR.",
    thumbnailUrl: "/cpr-video-3.jpg",
    duration: "2:28"
  }
];

interface AbsoluteFullscreenCPRGuideProps {
  onClose: () => void;
}

export default function AbsoluteFullscreenCPRGuide({ onClose }: AbsoluteFullscreenCPRGuideProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<"main" | "guide" | "videos">("main");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Toggle video player dialog
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  
  const handleViewVideo = (video: Video) => {
    setSelectedVideo(video);
    setVideoPlayerOpen(true);
  };
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {activeView !== "main" && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 p-1" 
              onClick={() => setActiveView("main")}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <Heart className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">CPR Training Guide</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Main content area with padding and scroll */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This guide is not a substitute for professional CPR training. In case of emergency, call 911 or your local emergency services immediately.
          </AlertDescription>
        </Alert>
        
        {activeView === "main" && (
          <div className="space-y-4">
            <p className="text-base">
              Cardiopulmonary Resuscitation (CPR) is a lifesaving technique that can help save someone's life during a cardiac or breathing emergency. Learn the basics here, but we encourage you to get certified through an accredited training program.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Button 
                className="flex items-center gap-2 h-auto py-4 justify-start bg-red-100 hover:bg-red-200 text-red-800 border border-red-200"
                onClick={() => setActiveView("guide")}
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">CPR Step-by-Step Guide</div>
                  <div className="text-sm font-normal text-red-700">Learn the correct technique with detailed instructions</div>
                </div>
              </Button>
              
              <Button 
                className="flex items-center gap-2 h-auto py-4 justify-start bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200"
                onClick={() => setActiveView("videos")}
              >
                <MonitorPlay className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">Instructional Videos</div>
                  <div className="text-sm font-normal text-blue-700">Watch demonstrations of proper CPR techniques</div>
                </div>
              </Button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Medal className="h-5 w-5 mr-2 text-amber-500" />
                Why Get CPR Certified?
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Every year, more than 350,000 cardiac arrests occur outside of hospitals</li>
                <li>Immediate CPR can double or triple a person's chance of survival</li>
                <li>Only about 40% of people who experience cardiac arrest get the help they need before professionals arrive</li>
                <li>CPR keeps oxygenated blood flowing to the brain and other vital organs</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeView === "guide" && <CPRGuide />}
        
        {activeView === "videos" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Instructional Videos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Watch these instructional videos to learn proper CPR techniques. Remember that video instruction is not a substitute for hands-on training.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cprVideos.map((video) => (
                <div 
                  key={video.id} 
                  className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <div 
                    className="h-40 bg-gray-200 flex items-center justify-center cursor-pointer relative"
                    onClick={() => handleViewVideo(video)}
                  >
                    {video.thumbnailUrl ? (
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MonitorPlay className="h-10 w-10 text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <div className="h-0 w-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[16px] border-l-white ml-1"></div>
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-base mb-1">{video.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Video player dialog */}
      {selectedVideo && (
        <VideoPlayerDialog 
          open={videoPlayerOpen}
          onOpenChange={setVideoPlayerOpen}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
}