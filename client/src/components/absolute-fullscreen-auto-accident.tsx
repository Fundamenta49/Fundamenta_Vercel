import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Car, 
  AlertCircle, 
  Phone, 
  FilePenLine, 
  ShieldCheck, 
  FileText, 
  Camera,
  ArrowRight,
  Check,
  Play,
  Medal,
  ThumbsUp,
  Trophy,
  X,
  MonitorPlay,
  ChevronLeft,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { VideoPlayerDialog } from "@/components/video-player-dialog";

// Define quiz questions
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const autoAccidentQuiz: QuizQuestion[] = [
  {
    question: "What should you do first after an auto accident?",
    options: [
      "Leave the scene immediately", 
      "Call your insurance agent", 
      "Check for injuries and ensure safety", 
      "Take photos of the damage"
    ],
    correctAnswer: 2,
    explanation: "Safety is the top priority. Check yourself and others for injuries, move to a safe location if possible, and call for medical help if needed."
  },
  {
    question: "When should you call the police after an accident?",
    options: [
      "Only if someone dies", 
      "Only for major accidents with severe damage", 
      "For any accident with injuries or significant damage", 
      "Only if the other driver doesn't have insurance"
    ],
    correctAnswer: 2,
    explanation: "You should call the police for any accident involving injuries, death, or significant property damage."
  },
  {
    question: "What information should you exchange with the other driver?",
    options: [
      "Just your phone number", 
      "Only insurance information", 
      "Your social security number and credit card details", 
      "Name, contact info, insurance details, license plate and vehicle information"
    ],
    correctAnswer: 3,
    explanation: "Exchange names, contact information, insurance details, driver's license numbers, license plates, and vehicle make/model."
  },
  {
    question: "What should you avoid saying at the accident scene?",
    options: [
      "Facts about what happened", 
      "Your contact information", 
      "Statements admitting fault like 'I'm sorry'", 
      "The truth about how the accident occurred"
    ],
    correctAnswer: 2,
    explanation: "Avoid admitting fault or making statements like 'I'm sorry' as these can be used against you later in insurance claims."
  },
  {
    question: "Why should you seek medical attention even if you feel fine?",
    options: [
      "To increase your insurance claim", 
      "Because some injuries may not be immediately apparent", 
      "It's required by law", 
      "Only if you were at fault"
    ],
    correctAnswer: 1,
    explanation: "Some injuries, especially those involving soft tissue, may not show symptoms until hours or days after an accident."
  }
];

// Define instructional videos
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
}

const accidentVideos: Video[] = [
  {
    id: "-RKNElMwERo",
    title: "What To Do After a Car Accident",
    description: "A step-by-step guide on the proper actions to take immediately following a car accident to protect yourself legally and medically.",
    thumbnailUrl: "/accident-video-1.jpg",
    duration: "4:15"
  },
  {
    id: "X7Bt6xXVXx8",
    title: "Documenting an Accident Scene",
    description: "Learn how to properly document an accident scene, including what photos to take and what information to gather for insurance claims.",
    thumbnailUrl: "/accident-video-2.jpg",
    duration: "3:28"
  },
  {
    id: "mJ1BTuR2S8c",
    title: "Dealing with Insurance After an Accident",
    description: "Tips for navigating the insurance claims process after an accident, including how to file a claim and work with claims adjusters.",
    thumbnailUrl: "/accident-video-3.jpg",
    duration: "5:32"
  }
];

type SectionType = "menu" | "guide" | "videos" | "quiz";

interface AbsoluteFullscreenAutoAccidentProps {
  onClose: () => void;
}

export default function AbsoluteFullscreenAutoAccident({ onClose }: AbsoluteFullscreenAutoAccidentProps) {
  // Access toast system
  const { toast } = useToast();
  
  // State for section navigation
  const [currentSection, setCurrentSection] = useState<SectionType>("menu");

  // State for quiz functionality
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
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
  
  // Handle quiz answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };
  
  // Handle quiz answer submission
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerSubmitted(true);
    setShowExplanation(true);
    
    if (selectedAnswer === autoAccidentQuiz[currentQuizIndex].correctAnswer) {
      setQuizScore(prevScore => prevScore + 1);
      
      toast({
        title: "Correct!",
        description: "Great job! That's the right answer.",
        className: "bg-green-50 border-green-200 text-green-900",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Review the explanation to learn more.",
        className: "bg-yellow-50 border-yellow-200 text-yellow-900",
      });
    }
  };
  
  // Handle moving to the next quiz question
  const handleNextQuestion = () => {
    if (currentQuizIndex < autoAccidentQuiz.length - 1) {
      setCurrentQuizIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
    } else {
      // Quiz completed - show results
      toast({
        title: "Quiz Completed!",
        description: `Your score: ${quizScore}/${autoAccidentQuiz.length}`,
        className: "bg-blue-50 border-blue-200 text-blue-900",
      });
    }
  };
  
  // Handle restarting the quiz
  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setQuizScore(0);
  };
  
  // Back to menu button component
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
  
  // Main menu render
  const renderMenu = () => (
    <div className="w-full space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
        Auto Accident Resources
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Guide Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("guide")}
        >
          <Car className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Accident Guide</h3>
          <p className="text-xs text-gray-500 mt-1">Step-by-step instructions for handling an auto accident</p>
        </div>
        
        {/* Videos Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("videos")}
        >
          <MonitorPlay className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Instructional Videos</h3>
          <p className="text-xs text-gray-500 mt-1">Visual guides for accident documentation and procedures</p>
        </div>
        
        {/* Quiz Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("quiz")}
        >
          <Medal className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Knowledge Quiz</h3>
          <p className="text-xs text-gray-500 mt-1">Test your understanding of accident procedures</p>
        </div>
      </div>
    </div>
  );
  
  // Guide section render
  const renderGuide = () => (
    <div className="space-y-4">
      <BackToMenuButton />
      
      <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2 flex items-center gap-2">
        <Car className="h-5 w-5" />
        Auto Accident Response Guide
      </h2>
      
      <Alert className="mb-4 border-red-500 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-800 text-sm">
          If anyone is injured, call 911 immediately. Safety always comes first in any accident situation.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Immediate Steps</CardTitle>
                <CardDescription>First actions after an accident</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Check yourself and others for injuries</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Move to safety if possible (off the road, away from traffic)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Turn on hazard lights and set up warning triangles if available</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Call 911 if there are injuries or significant damage</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                <Camera className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Document Everything</CardTitle>
                <CardDescription>Gather important information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Take photos of all vehicles, damage, license plates, and the accident scene</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Exchange information with other drivers (names, contact info, insurance details)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Get contact information from witnesses</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Note the date, time, weather, and road conditions</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">After the Accident</CardTitle>
                <CardDescription>Important follow-up steps</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">File a police report if one wasn't made at the scene</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Notify your insurance company as soon as possible</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Seek medical attention even if you feel fine - some injuries may not be apparent</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Keep detailed records of all medical treatments, expenses, and communications</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                <FilePenLine className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Insurance Claims</CardTitle>
                <CardDescription>Navigating the claims process</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">File a claim with your insurance company promptly</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Keep detailed records of all communications with insurance companies</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Take photos of damage before repairs are made</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-sm">Get multiple repair estimates if required by your insurer</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  // Videos section render
  const renderVideos = () => (
    <div className="space-y-4">
      <BackToMenuButton />
      
      <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2 flex items-center gap-2">
        <MonitorPlay className="h-5 w-5" />
        Auto Accident Instructional Videos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accidentVideos.map(video => (
          <div key={video.id} className="rounded-lg border border-red-200 overflow-hidden bg-white shadow hover:shadow-md transition-all">
            <div className="relative pb-[56.25%] bg-gray-100">
              {/* Fallback image display with custom styling */}
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-red-50 cursor-pointer" 
                onClick={() => handlePlayVideo(video)}
              >
                <div className="text-center">
                  <MonitorPlay className="h-12 w-12 text-red-400 mx-auto mb-2" />
                  <div className="text-xs text-red-700 font-medium">Auto Accident Training Video</div>
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
  
  // Quiz section render
  const renderQuiz = () => {
    const currentQuestion = autoAccidentQuiz[currentQuizIndex];
    const isQuizCompleted = isAnswerSubmitted && currentQuizIndex === autoAccidentQuiz.length - 1;
    
    return (
      <div className="space-y-4">
        <BackToMenuButton />
        
        <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2 flex items-center gap-2">
          <Medal className="h-5 w-5" />
          Auto Accident Knowledge Quiz
        </h2>
        
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-sm font-normal">
            Question {currentQuizIndex + 1} of {autoAccidentQuiz.length}
          </Badge>
          
          <Badge className="bg-blue-500 hover:bg-blue-500/90">
            Score: {quizScore}/{autoAccidentQuiz.length}
          </Badge>
        </div>
        
        <Progress value={(currentQuizIndex / autoAccidentQuiz.length) * 100} className="mb-4" />
        
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border cursor-pointer transition-colors ${
                  selectedAnswer === index
                    ? isAnswerSubmitted
                      ? index === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : isAnswerSubmitted && index === currentQuestion.correctAnswer
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {isAnswerSubmitted ? (
                      index === currentQuestion.correctAnswer ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : selectedAnswer === index ? (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300"></div>
                      )
                    ) : selectedAnswer === index ? (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                  <span className="ml-3 text-sm">{option}</span>
                </div>
              </div>
            ))}
            
            {showExplanation && (
              <Alert className={`mt-4 ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }`}>
                <div className="flex items-start">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {selectedAnswer === currentQuestion.correctAnswer
                        ? "Correct!"
                        : "Not quite right."}
                    </p>
                    <p className="text-sm mt-1">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!isAnswerSubmitted ? (
              <Button
                className="w-full"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : !isQuizCompleted ? (
              <Button
                className="w-full"
                onClick={handleNextQuestion}
              >
                Next Question <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="w-full space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Trophy className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="ml-2">
                    Quiz complete! Your score: <span className="font-bold">{quizScore}/{autoAccidentQuiz.length}</span>
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRestartQuiz}
                >
                  <Play className="mr-2 h-4 w-4" /> Restart Quiz
                </Button>
                <Button
                  className="w-full"
                  onClick={() => setCurrentSection("menu")}
                >
                  Return to Resources
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Main component render
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-red-500" />
          <h1 className="text-xl font-bold">Auto Accident Guide</h1>
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
            If anyone is injured in an accident, call 911 immediately. These resources are for educational purposes.
          </AlertDescription>
        </Alert>
        
        {currentSection === "menu" && renderMenu()}
        {currentSection === "guide" && renderGuide()}
        {currentSection === "videos" && renderVideos()}
        {currentSection === "quiz" && renderQuiz()}
        
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