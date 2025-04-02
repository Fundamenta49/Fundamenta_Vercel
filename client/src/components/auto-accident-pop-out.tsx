import React, { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
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

// Define quiz questions
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const autoAccidentQuiz: QuizQuestion[] = [
  {
    question: "What should be your first priority after an auto accident?",
    options: [
      "Taking photos of the damage", 
      "Checking for injuries and ensuring safety", 
      "Calling your insurance company", 
      "Exchanging information with the other driver"
    ],
    correctAnswer: 1,
    explanation: "Safety always comes first. Check for injuries to yourself and others, and move to a safe location if possible."
  },
  {
    question: "When should you call the police after an accident?",
    options: [
      "Only if someone is injured", 
      "Only if the damage exceeds $10,000", 
      "For any accident with injuries, death, or significant property damage", 
      "Only if the other driver is at fault"
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
    id: "video1",
    title: "What to Do Immediately After an Accident",
    description: "Step-by-step guidance on the critical first 15 minutes after a car crash",
    thumbnailUrl: "/accident-video-1.jpg", // Using default image path
    duration: "4:26"
  },
  {
    id: "video2",
    title: "How to Document an Accident Scene Properly",
    description: "Essential tips for gathering evidence that will help your insurance claim",
    thumbnailUrl: "/accident-video-2.jpg", // Using default image path
    duration: "3:15"
  },
  {
    id: "video3",
    title: "Dealing with Insurance Companies After an Accident",
    description: "Expert advice on navigating the claims process for the best outcome",
    thumbnailUrl: "/accident-video-3.jpg", // Using default image path
    duration: "5:42"
  }
];

type SectionType = "menu" | "guide" | "videos" | "quiz";

export default function AutoAccidentPopOut() {
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
  
  // Handle video play action
  const handlePlayVideo = (video: Video) => {
    toast({
      title: `Playing: ${video.title}`,
      description: "This is a demo. In a production environment, this would play the actual video.",
      className: "bg-red-50 border-red-200 text-red-900",
      duration: 3000,
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
    }
  };
  
  // Move to next quiz question
  const handleNextQuestion = () => {
    if (currentQuizIndex < autoAccidentQuiz.length - 1) {
      setCurrentQuizIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
    } else {
      // Quiz completed
      // Could implement more complex completion logic here
    }
  };
  
  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setShowExplanation(false);
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
        Learning Resources
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Guide Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("guide")}
        >
          <FileText className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Step-by-Step Guide</h3>
          <p className="text-xs text-gray-500 mt-1">Detailed instructions for handling an accident</p>
        </div>
        
        {/* Videos Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("videos")}
        >
          <MonitorPlay className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Safety Videos</h3>
          <p className="text-xs text-gray-500 mt-1">Visual guides for emergency procedures</p>
        </div>
        
        {/* Quiz Card */}
        <div 
          className="p-4 rounded-lg border border-red-200 hover:border-red-500 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
          onClick={() => setCurrentSection("quiz")}
        >
          <Medal className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700">Knowledge Quiz</h3>
          <p className="text-xs text-gray-500 mt-1">Test your accident response knowledge</p>
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
        Instructional Videos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accidentVideos.map(video => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative pb-[56.25%] bg-gray-100">
              {/* Fallback image display with custom styling */}
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-red-50 cursor-pointer" 
                onClick={() => handlePlayVideo(video)}
              >
                <div className="text-center">
                  <MonitorPlay className="h-12 w-12 text-red-400 mx-auto mb-2" />
                  <div className="text-xs text-red-700 font-medium">Auto Safety Video</div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/80 hover:bg-white"
                  onClick={() => handlePlayVideo(video)}
                >
                  <Play className="h-6 w-6 text-red-500" />
                  <span className="sr-only">Play video</span>
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <CardHeader className="py-3">
              <CardTitle className="text-base">{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <CardDescription className="text-xs">{video.description}</CardDescription>
            </CardContent>
            <CardFooter className="pt-3 pb-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handlePlayVideo(video)}
              >
                <Play className="h-4 w-4 mr-2" /> Watch Video
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
  
  // Render quiz section
  const renderQuiz = () => (
    <div className="space-y-4">
      <BackToMenuButton />
      
      <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2 flex items-center gap-2">
        <Medal className="h-5 w-5" />
        Auto Safety Knowledge Quiz
      </h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Question {currentQuizIndex + 1} of {autoAccidentQuiz.length}</CardTitle>
            <Badge variant="outline" className="bg-red-50">
              Score: {quizScore}/{autoAccidentQuiz.length}
            </Badge>
          </div>
          <Progress
            value={(currentQuizIndex / autoAccidentQuiz.length) * 100}
            className="h-2 mt-2"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-medium">
              {autoAccidentQuiz[currentQuizIndex].question}
            </h3>
            <div className="space-y-2">
              {autoAccidentQuiz[currentQuizIndex].options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    selectedAnswer === index 
                      ? isAnswerSubmitted 
                        ? index === autoAccidentQuiz[currentQuizIndex].correctAnswer
                          ? "border-green-500 bg-green-50" 
                          : "border-red-500 bg-red-50"
                        : "border-red-500 bg-white" 
                      : "border-gray-200 hover:border-red-200"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center gap-2">
                    {isAnswerSubmitted && index === autoAccidentQuiz[currentQuizIndex].correctAnswer && (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {isAnswerSubmitted && selectedAnswer === index && index !== autoAccidentQuiz[currentQuizIndex].correctAnswer && (
                      <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {showExplanation && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-semibold text-blue-700">Explanation:</h4>
                <p className="text-sm mt-1">{autoAccidentQuiz[currentQuizIndex].explanation}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isAnswerSubmitted ? (
            currentQuizIndex < autoAccidentQuiz.length - 1 ? (
              <Button onClick={handleNextQuestion} className="w-full">
                Next Question <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={resetQuiz} className="w-full">
                Restart Quiz <Trophy className="ml-2 h-4 w-4" />
              </Button>
            )
          ) : (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={selectedAnswer === null}
              className="w-full"
            >
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );

  // Render guide section
  const renderGuide = () => (
    <div className="space-y-6 sm:space-y-8 w-full">
      <BackToMenuButton />
      
      {/* Immediate Steps Section */}
      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">Immediate Steps</h2>
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">1</Badge>
            Safety First
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Check for injuries</strong> to yourself and others. Call 911 immediately if anyone is injured.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Move to safety</strong> if possible. Turn on hazard lights and set up warning triangles/flares if available.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Stay calm</strong> and check for dangers like fire, leaking fuel, or traffic.</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">2</Badge>
            Notify Authorities
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Call local police for any accident involving injuries, death, or significant property damage.</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>In many states, you're legally required to report accidents that exceed a certain damage threshold (usually $500-$2000).</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Stay at the scene until authorities arrive. Leaving the scene of an accident can be considered a hit-and-run.</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">3</Badge>
            Exchange Information
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FilePenLine className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Exchange with other driver(s):</strong> Full name, contact information, insurance company and policy number, driver's license number, license plate number, and vehicle make/model.</span>
            </li>
            <li className="flex items-start gap-2">
              <FilePenLine className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Get witness information:</strong> Names and contact information of any witnesses.</span>
            </li>
            <li className="flex items-start gap-2">
              <FilePenLine className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Police information:</strong> Officer's name, badge number, and how to obtain the accident report.</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Documentation Section */}
      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">Documentation</h2>
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">4</Badge>
            Document the Scene
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Camera className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Take photos</strong> from multiple angles showing:
                <ul className="list-disc pl-4 sm:pl-6 mt-1 space-y-1 text-xs sm:text-sm">
                  <li>Damage to all vehicles involved</li>
                  <li>The entire accident scene, including road conditions</li>
                  <li>License plates of all vehicles</li>
                  <li>Skid marks, debris, or other evidence</li>
                  <li>Traffic signs, signals, or road markings</li>
                </ul>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Take notes</strong> about the accident including:
                <ul className="list-disc pl-4 sm:pl-6 mt-1 space-y-1 text-xs sm:text-sm">
                  <li>Time, date, and exact location</li>
                  <li>Weather and road conditions</li>
                  <li>Direction of travel for each vehicle</li>
                  <li>What you remember happening</li>
                  <li>Names and badge numbers of responding officers</li>
                </ul>
              </span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">5</Badge>
            Accident Diagram
          </h3>
          <p className="text-sm">Create a simple diagram showing:</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Position and direction of all vehicles before, during, and after collision</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Street names, traffic signals, signs, and landmarks</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Direction of travel for each vehicle</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Point of impact</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* After the Accident Section */}
      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">After the Accident</h2>
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">6</Badge>
            Contact Your Insurance
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Contact your insurance company as soon as possible, regardless of fault.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Provide all documentation and information you've collected.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Stick to the facts. Avoid admitting fault or making statements like "I'm sorry."</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Ask about your coverage, deductibles, and next steps in the claims process.</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">7</Badge>
            Seek Medical Attention
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Get checked by a medical professional</strong> even if you don't feel injured. Some injuries may not be immediately apparent.</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Keep detailed records of all medical visits, treatments, and expenses.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Monitor for delayed symptoms like headaches, neck or back pain, and numbness.</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-red-600 border-b pb-2">
            <Badge variant="destructive">8</Badge>
            Follow Up
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="insurance">
              <AccordionTrigger className="text-sm font-medium">Insurance Claims Process</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm">
                  <li>Work with your insurance adjuster to evaluate vehicle damage</li>
                  <li>Get estimates for repairs from approved repair shops</li>
                  <li>Understand your policy's rental car coverage if needed</li>
                  <li>Keep track of all claim numbers and adjuster contact information</li>
                  <li>Follow up regularly on the status of your claim</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="repairs">
              <AccordionTrigger className="text-sm font-medium">Vehicle Repairs</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm">
                  <li>Get written estimates from multiple repair shops</li>
                  <li>Understand which parts will be used (OEM vs. aftermarket)</li>
                  <li>Know your rights regarding choice of repair facility</li>
                  <li>Inspect repairs thoroughly before accepting the vehicle</li>
                  <li>Keep all receipts and documentation of repairs</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="legal">
              <AccordionTrigger className="text-sm font-medium">Legal Considerations</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm">
                  <li>Be aware of your state's statute of limitations for filing claims</li>
                  <li>Consider consulting with an attorney for serious accidents</li>
                  <li>Understand your state's fault determination laws</li>
                  <li>Keep all documentation organized in case legal action is needed</li>
                  <li>Be cautious about signing any releases or settlements without review</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
  
  // Main render function with conditional content
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Car className="h-6 w-6 text-red-500" />
          Auto Accident Response
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          What to do if you're involved in a vehicle accident
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody className="px-2 sm:px-4">
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            In case of a serious accident with injuries, immediately call your local emergency services (911 in the US).
            Your safety and the safety of others should be your top priority.
          </AlertDescription>
        </Alert>
        
        {/* Render content based on current section */}
        {currentSection === "menu" && renderMenu()}
        {currentSection === "guide" && renderGuide()}
        {currentSection === "videos" && renderVideos()}
        {currentSection === "quiz" && renderQuiz()}
      </FullScreenDialogBody>
    </div>
  );
}