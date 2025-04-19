import React, { useState, useEffect } from "react";
import { MessageSquare, Briefcase, Star, SendHorizonal, RefreshCw, ThumbsUp, ThumbsDown, AlertCircle, Loader2, Copy, PlayCircle, PauseCircle, Mic, X, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// Common industries for interview prep
const INDUSTRIES = [
  { value: "software", label: "Software Development" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance & Banking" },
  { value: "marketing", label: "Marketing & PR" },
  { value: "sales", label: "Sales" },
  { value: "education", label: "Education" },
  { value: "government", label: "Government" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "design", label: "Design & Creative" },
  { value: "legal", label: "Legal" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "construction", label: "Construction" },
];

// Common interview question types
const QUESTION_TYPES = [
  { value: "behavioral", label: "Behavioral" },
  { value: "technical", label: "Technical" },
  { value: "situational", label: "Situational" },
  { value: "leadership", label: "Leadership" },
  { value: "competency", label: "Competency-Based" },
  { value: "stress", label: "Stress-Test" },
  { value: "motivational", label: "Motivational" },
  { value: "teamwork", label: "Teamwork" },
  { value: "ethics", label: "Ethics & Values" },
  { value: "salary", label: "Salary Negotiation" },
];

// Sample of common behavioral questions
const COMMON_QUESTIONS = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "What are your greatest weaknesses?",
  "Why are you interested in working for our company?",
  "Where do you see yourself in 5 years?",
  "Describe a difficult work situation and how you overcame it.",
  "Why are you leaving your current job?",
  "What achievement are you most proud of?",
  "Tell me about a time you had a conflict with a coworker.",
  "How do you handle stress and pressure?",
];

// Interface for analysis results
interface AnalysisResult {
  rating: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  industryTips: string;
}

export default function InterviewPracticeFullscreen() {
  const [jobField, setJobField] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("behavioral");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("practice");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Generate questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: async (jobFieldValue: string) => {
      setIsLoadingQuestions(true);
      const response = await apiRequest("POST", "/api/interview/generate-questions", {
        jobField: jobFieldValue
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedQuestions(data.questions || []);
      if (data.questions && data.questions.length > 0) {
        // Automatically select the first question
        setCurrentQuestion(data.questions[0]);
      }
      setIsLoadingQuestions(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Generate Questions",
        description: error.message || "Please try again or use our common questions.",
      });
      // Fallback to common questions
      setGeneratedQuestions(COMMON_QUESTIONS);
      setIsLoadingQuestions(false);
    }
  });

  // Analyze answer mutation
  const analyzeAnswerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/interview/analyze-answer", {
        answer: userAnswer,
        question: currentQuestion,
        industry: jobField || "general"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze answer");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: "Your answer has been analyzed. Review the feedback below.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze your answer. Please try again.",
      });
    }
  });

  // Generate interview questions when job field changes
  useEffect(() => {
    if (jobField) {
      generateQuestionsMutation.mutate(jobField);
    }
  }, [jobField]);

  // Handle custom question input
  const handleCustomQuestionSubmit = () => {
    if (customQuestion.trim()) {
      setCurrentQuestion(customQuestion);
      setUserAnswer("");
      setAnalysisResult(null);
      toast({
        title: "Question Set",
        description: "Custom question is ready for practice.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Empty Question",
        description: "Please enter a question first.",
      });
    }
  };

  // Select a question from the list
  const handleSelectQuestion = (question: string) => {
    setCurrentQuestion(question);
    setUserAnswer("");
    setAnalysisResult(null);
  };

  // Submit answer for analysis
  const handleSubmitAnswer = () => {
    if (userAnswer.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Answer Too Short",
        description: "Please provide a more detailed answer for better analysis.",
      });
      return;
    }
    
    analyzeAnswerMutation.mutate();
  };

  // Copy suggested answer to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "You can now paste this text elsewhere.",
        });
      },
      (err) => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Please try selecting and copying the text manually.",
        });
      }
    );
  };

  // Toggle speech recording (mock functionality)
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Your answer has been captured.",
      });
      // In a real implementation, we would transcribe the audio to text
      setUserAnswer(`[This is where your transcribed speech would appear. In a fully implemented version, this would contain the text transcribed from your spoken answer to: "${currentQuestion}"]`);
    } else {
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak your answer clearly.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interview Practice</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Prepare for job interviews with AI-powered feedback
          </p>
        </div>
      </div>
      
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
          Practice answering common interview questions and receive professional feedback to improve your responses.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Practice Interview</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Question Bank</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="px-4 py-3 border-b-2 border-primary/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" /> 
                  Interview Settings
                </CardTitle>
                <CardDescription className="text-sm">
                  Configure your practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 py-3">
                <div className="space-y-2">
                  <Label htmlFor="jobField">Job Field/Industry*</Label>
                  <Select
                    value={jobField}
                    onValueChange={setJobField}
                  >
                    <SelectTrigger id="jobField">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select
                    value={questionType}
                    onValueChange={setQuestionType}
                  >
                    <SelectTrigger id="questionType">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customQuestion">Custom Question</Label>
                  <Textarea 
                    id="customQuestion"
                    placeholder="Enter your own interview question..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button 
                    onClick={handleCustomQuestionSubmit} 
                    variant="outline" 
                    className="w-full mt-2"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Use Custom Question
                  </Button>
                </div>
                
                {generatedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <Label>Suggested Questions</Label>
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      {generatedQuestions.map((question, index) => (
                        <div 
                          key={index}
                          className={`p-2 mb-2 rounded-md cursor-pointer text-sm hover:bg-muted ${
                            currentQuestion === question ? 'bg-primary/10 border border-primary/30' : ''
                          }`}
                          onClick={() => handleSelectQuestion(question)}
                        >
                          {question}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
                
                {generateQuestionsMutation.isPending || isLoadingQuestions ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : null}
              </CardContent>
            </Card>
            
            {analysisResult && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
                <CardHeader className="px-4 py-3 border-b-2 border-green-200">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" /> 
                    Your Rating: {analysisResult.rating}/10
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-3">
                  <Progress
                    value={analysisResult.rating * 10}
                    className="h-2 mb-4"
                    indicatorColor={
                      analysisResult.rating >= 8 ? "bg-green-500" :
                      analysisResult.rating >= 6 ? "bg-yellow-500" :
                      "bg-red-500"
                    }
                  />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        Strengths
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysisResult.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-700 dark:text-green-300">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        Areas for Improvement
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysisResult.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-red-700 dark:text-red-300">
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <TabsContent value="practice" className="mt-0 space-y-6">
              <Card>
                <CardHeader className="px-4 py-3 border-b-2 border-primary/20">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" /> 
                    Current Question
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Practice answering this interview question
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4">
                  {currentQuestion ? (
                    <div className="text-lg font-medium p-4 bg-primary/5 rounded-lg border border-primary/20">
                      "{currentQuestion}"
                      <Badge className="ml-2 mt-2">{questionType}</Badge>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <p className="text-muted-foreground">
                        Select an industry and question type to get started, or enter your own custom question.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {currentQuestion && (
                <Card>
                  <CardHeader className="px-4 py-3 border-b-2 border-primary/20">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <SendHorizonal className="h-5 w-5 text-primary" /> 
                      Your Answer
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Record or type your response to the question
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 py-4 space-y-4">
                    <div className="flex justify-between">
                      <Button
                        onClick={toggleRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        className="flex items-center gap-2"
                      >
                        {isRecording ? (
                          <>
                            <PauseCircle className="h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4" />
                            Record Answer
                          </>
                        )}
                      </Button>
                      
                      {userAnswer && (
                        <Button
                          onClick={() => {
                            setUserAnswer("");
                            setAnalysisResult(null);
                          }}
                          variant="ghost"
                          size="icon"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Textarea
                      placeholder="Type or speak your answer to the question above..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="min-h-[200px] font-medium"
                      disabled={isRecording}
                    />
                    
                    <Button
                      onClick={handleSubmitAnswer}
                      className="w-full bg-primary text-white"
                      disabled={!userAnswer.trim() || analyzeAnswerMutation.isPending}
                    >
                      {analyzeAnswerMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Get Feedback
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {analysisResult && (
                <Card>
                  <CardHeader className="px-4 py-3 border-b-2 border-primary/20">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" /> 
                      Suggested Approach
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Here's an example of an effective answer to this question
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 py-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-line">{analysisResult.suggestedAnswer}</p>
                      <Button
                        onClick={() => copyToClipboard(analysisResult.suggestedAnswer)}
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Industry-Specific Tips</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.industryTips}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="questions" className="mt-0 space-y-6">
              <Card>
                <CardHeader className="px-4 py-3 border-b-2 border-primary/20">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" /> 
                    Question Library
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Browse common interview questions by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {QUESTION_TYPES.map((type) => (
                      <div key={type.value} className="space-y-3">
                        <h3 className="font-semibold text-base flex items-center gap-2">
                          <Badge variant="outline">{type.label}</Badge>
                        </h3>
                        <ul className="space-y-2">
                          {/* These would be fetched from the API in a real implementation */}
                          {COMMON_QUESTIONS.slice(0, 3).map((question, idx) => (
                            <li 
                              key={idx} 
                              className="text-sm p-2 hover:bg-muted rounded cursor-pointer border"
                              onClick={() => {
                                setQuestionType(type.value);
                                handleSelectQuestion(question);
                                setActiveTab("practice");
                              }}
                            >
                              {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-base mb-2">Interview Tips</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Research the company thoroughly before your interview.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Prepare specific examples from your experience to demonstrate skills.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Practice your answers out loud to build confidence.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Prepare thoughtful questions to ask your interviewer.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}