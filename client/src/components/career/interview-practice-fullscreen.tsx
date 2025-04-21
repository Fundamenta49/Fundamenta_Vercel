import React, { useState, useRef } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle, AlertCircle, Mic, MicOff, Send, ChevronRight, Briefcase, Lightbulb, BookOpen, UserCheck, Award, ListChecks } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Interview practice form schema
const interviewFormSchema = z.object({
  jobTitle: z.string().min(1, { message: "Please enter a job title" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  experienceLevel: z.string().min(1, { message: "Please select your experience level" }),
  questionType: z.string().min(1, { message: "Please select a question type" }),
});

type InterviewFormValues = z.infer<typeof interviewFormSchema>;

// Define question types and categories
interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips?: string[];
  sampleAnswer?: string;
}

// Mock interview questions for the component
const MOCK_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q1",
    question: "Tell me about yourself and your experience.",
    category: "behavioral",
    difficulty: "easy",
    tips: [
      "Focus on professional experiences relevant to the job",
      "Structure your answer: past, present, future",
      "Keep it concise (1-2 minutes)",
      "Highlight key achievements"
    ],
    sampleAnswer: "I'm a frontend developer with 5 years of experience specializing in React and TypeScript. I began my career at TechStart, where I built responsive interfaces for e-commerce platforms. Currently at InnovateCorp, I lead a team of three developers working on a dashboard application that increased user engagement by 40%. I'm passionate about creating intuitive user experiences and looking to apply my skills in a role that focuses on accessibility and performance optimization."
  },
  {
    id: "q2",
    question: "What is your greatest professional achievement?",
    category: "behavioral",
    difficulty: "medium",
    tips: [
      "Choose a specific, measurable achievement",
      "Explain the challenge, action taken, and results (CAR method)",
      "Quantify the impact when possible",
      "Connect it to how you can add value in this role"
    ],
    sampleAnswer: "My greatest professional achievement was leading the redesign of our company's client portal, which had been causing frustration due to its complexity. I initiated user research sessions, created wireframes based on feedback, and coordinated with the development team to implement the new design. The result was a 35% decrease in support tickets, a 28% increase in client engagement, and positive feedback from previously frustrated clients. This experience taught me the importance of user-centered design and cross-functional collaboration."
  },
  {
    id: "q3",
    question: "How do you handle tight deadlines or pressure situations?",
    category: "behavioral",
    difficulty: "medium",
    tips: [
      "Describe your approach to prioritization",
      "Mention specific tools or methods you use",
      "Include a brief example from your experience",
      "Emphasize your ability to maintain quality under pressure"
    ],
    sampleAnswer: "When facing tight deadlines, I first break the project into manageable tasks and prioritize them based on importance and dependencies. I use the Pomodoro technique to maintain focus and a project management tool to track progress. For example, when our team had to deliver a critical update with only half the expected time, I created a streamlined version that delivered the core functionality first, then added secondary features in subsequent releases. This approach allowed us to meet the deadline while maintaining quality, and the client appreciated our transparency about the phased approach."
  },
  {
    id: "q4",
    question: "Describe a situation where you had to resolve a conflict with a colleague.",
    category: "behavioral",
    difficulty: "hard",
    tips: [
      "Choose a genuine conflict that was successfully resolved",
      "Focus equally on the problem and the resolution",
      "Highlight communication and empathy skills",
      "Explain what you learned from the experience"
    ],
    sampleAnswer: "During a website redesign project, my colleague and I had different visions for the user flow. Instead of escalating the disagreement, I suggested we schedule a dedicated meeting to understand each other's perspectives. During the discussion, I realized we had different interpretations of the user research. We agreed to conduct a small usability test with both approaches, which ultimately showed elements of both designs were valuable. We created a hybrid solution that performed better than either of our original concepts. This experience reinforced the importance of data-driven decisions and collaborative problem-solving when faced with creative differences."
  },
  {
    id: "q5",
    question: "What are your strategies for organizing and prioritizing your work?",
    category: "behavioral",
    difficulty: "medium",
    tips: [
      "Mention specific methods or tools you use",
      "Explain how you determine priorities",
      "Include an example of handling competing priorities",
      "Discuss how you maintain flexibility when priorities shift"
    ],
    sampleAnswer: "I use a combination of time-blocking and the Eisenhower matrix to organize my work. Each Friday, I plan the upcoming week by identifying urgent and important tasks first, then schedule focused blocks for deep work. I use Notion to track projects and daily tasks, which helps me stay adaptable when priorities change. For example, when managing multiple client projects at my previous job, I established clear communication channels for urgent requests and maintained buffer time in my schedule to accommodate unexpected work without compromising existing deadlines. This system helped me consistently meet deadlines while maintaining quality across all projects."
  },
  {
    id: "q6",
    question: "In your understanding, what is the difference between a thread and a process?",
    category: "technical",
    difficulty: "medium",
    tips: [
      "Start with clear definitions of both terms",
      "Explain the key differences in terms of memory usage",
      "Mention context switching differences",
      "Include when you might use one over the other"
    ],
    sampleAnswer: "A process is an independent program with its own memory space, while threads are smaller units of execution within a process that share the same memory space. Processes are isolated from each other, providing better security and stability since one crashing process won't affect others. Threads, however, share resources which makes data sharing more efficient but introduces potential synchronization issues. Context switching between threads is faster than between processes because there's no need to switch memory contexts. I would use multiple processes when security and isolation are priorities, and threads when performance and resource sharing are more important, such as in a web server handling multiple concurrent connections."
  },
  {
    id: "q7",
    question: "How would you implement a data structure for a least recently used (LRU) cache?",
    category: "technical",
    difficulty: "hard",
    tips: [
      "Explain the purpose of an LRU cache first",
      "Identify the key operations and their time complexity requirements",
      "Describe the data structures you'd use (often a combination)",
      "Walk through a simple example of how it would work"
    ],
    sampleAnswer: "An LRU cache evicts the least recently used items when it reaches capacity. For an efficient implementation, I'd use a combination of a hash map and a doubly linked list to achieve O(1) time complexity for both lookups and updates. The hash map would store keys and pointers to the corresponding nodes in the linked list, while the linked list would maintain the order of use, with the most recently used items at the head and least recently used at the tail. When accessing an item, I'd retrieve it from the hash map in O(1) time, then move its node to the head of the list. When adding a new item to a full cache, I'd remove the node at the tail (least recently used), remove its entry from the hash map, then add the new item to both structures. This approach ensures constant time operations while maintaining the LRU property."
  },
  {
    id: "q8",
    question: "How would you optimize a website's performance?",
    category: "technical",
    difficulty: "medium",
    tips: [
      "Address both frontend and backend optimizations",
      "Mention specific techniques and tools",
      "Prioritize optimizations based on impact",
      "Include how you would measure improvements"
    ],
    sampleAnswer: "To optimize website performance, I'd start by measuring the current state using tools like Lighthouse and WebPageTest to identify specific bottlenecks. On the frontend, I'd implement lazy loading for images and components, minify and compress assets, use efficient CSS selectors, and implement code splitting to reduce the initial JavaScript payload. I'd also leverage browser caching and a CDN for static assets. For the backend, I'd optimize database queries, implement appropriate caching strategies, and consider using server-side rendering or static generation where appropriate. After implementing these changes, I'd conduct A/B testing to quantify improvements in metrics like Time to Interactive, First Contentful Paint, and overall page load time. In my experience, implementing image optimization and code splitting alone typically yields a 30-40% improvement in load times for content-heavy sites."
  },
  {
    id: "q9",
    question: "Explain the concept of RESTful APIs and their principles.",
    category: "technical",
    difficulty: "easy",
    tips: [
      "Define REST and its purpose",
      "Explain the key constraints/principles",
      "Give examples of proper REST API design",
      "Mention limitations or alternatives if relevant"
    ],
    sampleAnswer: "REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs adhere to key principles including: being stateless, where each request contains all necessary information; using standard HTTP methods appropriately (GET for retrieval, POST for creation, etc.); having resource-based URLs structured around nouns, not verbs; and supporting multiple representations of resources, typically JSON or XML. For example, a well-designed RESTful API for a user management system might use endpoints like GET /users for listing users, POST /users for creating a user, and PUT /users/{id} for updating a specific user. While REST is widely used for its simplicity and scalability, it may not be ideal for all cases. For real-time applications or complex operations, alternatives like GraphQL or gRPC might be more appropriate. REST's strength lies in its stateless nature, which makes it highly cacheable and scalable for distributed systems."
  },
  {
    id: "q10",
    question: "What salary range are you looking for?",
    category: "salary",
    difficulty: "hard",
    tips: [
      "Research industry standards before the interview",
      "Consider your experience level and the location",
      "Give a range rather than a specific number",
      "Focus on total compensation, not just base salary"
    ],
    sampleAnswer: "Based on my research of similar roles in this industry and location, and considering my five years of experience and specialized skills in data analysis, I'm targeting a total compensation range of $85,000 to $100,000. However, I'm also considering the complete package including benefits, growth opportunities, and work-life balance, which are all important factors for me. I'd be interested in hearing more about the compensation structure for this role and how my experience aligns with your expectations."
  },
];

// Interview Practice Fullscreen Component
export default function InterviewPracticeFullscreen({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('setup');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, any>>({});
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'guided' | 'simulation'>('guided');
  const [textAnswer, setTextAnswer] = useState('');
  
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Form setup for interview practice
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      jobTitle: "",
      industry: "",
      experienceLevel: "",
      questionType: "mixed",
    },
  });

  // Generate questions based on form data
  const generateQuestions = (data: InterviewFormValues) => {
    setIsGeneratingQuestion(true);
    
    // Simulate API call with mock data filtering
    setTimeout(() => {
      // Filter questions based on form selection
      let filteredQuestions = [...MOCK_QUESTIONS];
      
      if (data.questionType !== "mixed") {
        filteredQuestions = filteredQuestions.filter(q => q.category === data.questionType);
      }
      
      // Sort and take 5 questions
      filteredQuestions = filteredQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      
      setQuestions(filteredQuestions);
      setCurrentQuestionIndex(0);
      setRecordedAnswers({});
      setFeedback({});
      setActiveTab('practice');
      setIsGeneratingQuestion(false);
      
      toast({
        title: "Interview Practice Ready",
        description: `${filteredQuestions.length} questions prepared for your practice session.`,
      });
    }, 1500);
  };

  // Handle starting and stopping recording
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      stopRecording();
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          // In a real application, you'd send this to your backend for processing
          // For now, we'll just save it with the question ID
          setRecordedAnswers({
            ...recordedAnswers,
            [questions[currentQuestionIndex].id]: audioUrl,
          });
          
          // Stop all tracks from the stream
          stream.getTracks().forEach(track => track.stop());
          
          // Generate feedback after recording
          generateFeedback(questions[currentQuestionIndex].id);
        };
        
        mediaRecorder.start();
        setIsRecording(true);
        
        // Start timer
        const startTime = Date.now();
        timerRef.current = window.setInterval(() => {
          setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        
        toast({
          title: "Recording started",
          description: "Speak clearly and take your time with your answer.",
        });
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to record your answers.",
          variant: "destructive",
        });
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    setRecordingTime(0);
    
    toast({
      title: "Recording stopped",
      description: "Your answer has been saved.",
    });
  };

  // Generate AI feedback for an answer
  const generateFeedback = (questionId: string) => {
    setIsGeneratingFeedback(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock feedback generation
      const question = questions.find(q => q.id === questionId);
      
      const mockFeedback = {
        strengths: [
          "Good structure and clarity in your answer",
          "Effective use of specific examples to illustrate points",
          "Maintained good pace and articulation"
        ],
        improvements: [
          "Consider including more quantifiable results",
          "The answer could be more concise in some sections",
          "Try to connect your experience more directly to the job requirements"
        ],
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        keywordMatch: Math.floor(Math.random() * 40) + 60, // Random match between 60-100
        clarity: Math.floor(Math.random() * 30) + 70,
      };
      
      setFeedback({
        ...feedback,
        [questionId]: mockFeedback
      });
      
      setIsGeneratingFeedback(false);
    }, 2000);
  };

  // Handle text answer submission (for non-recording mode)
  const submitTextAnswer = () => {
    if (!textAnswer.trim()) {
      toast({
        title: "Empty answer",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Save the text answer
    setRecordedAnswers({
      ...recordedAnswers,
      [questions[currentQuestionIndex].id]: textAnswer,
    });
    
    // Generate feedback
    generateFeedback(questions[currentQuestionIndex].id);
    
    // Clear the text area
    setTextAnswer('');
    
    toast({
      title: "Answer submitted",
      description: "Your response has been saved for feedback.",
    });
  };

  // Navigate to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextAnswer('');
    } else {
      // All questions completed
      setActiveTab('review');
      toast({
        title: "Practice completed",
        description: "All questions answered! Review your performance.",
      });
    }
  };

  // Restart the interview practice
  const restartPractice = () => {
    setActiveTab('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setRecordedAnswers({});
    setFeedback({});
    setTextAnswer('');
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Calculate overall score
  const calculateOverallScore = () => {
    if (Object.keys(feedback).length === 0) return 0;
    
    const total = Object.values(feedback).reduce((sum, fb) => sum + fb.score, 0);
    return Math.round(total / Object.keys(feedback).length);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Interview Practice</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="container mx-auto py-4 px-4 md:px-6">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="setup" disabled={activeTab === 'practice' && isRecording}>Setup</TabsTrigger>
              <TabsTrigger 
                value="practice" 
                disabled={questions.length === 0 || (activeTab === 'practice' && isRecording)}
              >
                Practice
              </TabsTrigger>
              <TabsTrigger 
                value="review" 
                disabled={Object.keys(recordedAnswers).length === 0 || (activeTab === 'practice' && isRecording)}
              >
                Review
              </TabsTrigger>
            </TabsList>
            
            {/* Setup Tab */}
            <TabsContent value="setup" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Configure Your Practice</CardTitle>
                    <CardDescription>
                      Customize your interview practice session to match your job search
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(generateQuestions)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Frontend Developer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="technology">Technology</SelectItem>
                                  <SelectItem value="healthcare">Healthcare</SelectItem>
                                  <SelectItem value="finance">Finance</SelectItem>
                                  <SelectItem value="education">Education</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="experienceLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your experience level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                                  <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                                  <SelectItem value="manager">Management Level</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="questionType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question Types</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select question types" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="mixed">Mixed Questions</SelectItem>
                                  <SelectItem value="behavioral">Behavioral Questions</SelectItem>
                                  <SelectItem value="technical">Technical Questions</SelectItem>
                                  <SelectItem value="salary">Salary Questions</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-2">
                          <FormLabel>Practice Mode</FormLabel>
                          <div className="flex rounded-lg overflow-hidden border mt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              className={cn(
                                "flex-1 rounded-none h-10",
                                practiceMode === 'guided' && "bg-primary/10 text-primary"
                              )}
                              onClick={() => setPracticeMode('guided')}
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Guided Practice
                            </Button>
                            <Separator orientation="vertical" />
                            <Button
                              type="button"
                              variant="ghost"
                              className={cn(
                                "flex-1 rounded-none h-10",
                                practiceMode === 'simulation' && "bg-primary/10 text-primary"
                              )}
                              onClick={() => setPracticeMode('simulation')}
                            >
                              <Briefcase className="h-4 w-4 mr-2" />
                              Interview Simulation
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {practiceMode === 'guided' 
                              ? "Guided Practice: See tips and sample answers as you practice." 
                              : "Simulation: Real interview experience without help."}
                          </p>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full mt-6" 
                          disabled={isGeneratingQuestion}
                        >
                          {isGeneratingQuestion ? "Generating Questions..." : "Start Practice Session"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Interview Preparation Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-sm">Research the company</h3>
                            <p className="text-sm text-muted-foreground">
                              Review the company's website, recent news, and social media to understand their mission and culture.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-sm">Practice with the STAR method</h3>
                            <p className="text-sm text-muted-foreground">
                              Structure your answers with Situation, Task, Action, and Result to clearly communicate your experience.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-sm">Prepare questions to ask</h3>
                            <p className="text-sm text-muted-foreground">
                              Have 3-5 thoughtful questions ready that demonstrate your interest in the role and company.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-sm">Practice non-verbal communication</h3>
                            <p className="text-sm text-muted-foreground">
                              Maintain good eye contact, practice your handshake, and be mindful of your posture and body language.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Common Interview Mistakes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Being unprepared for common questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Speaking negatively about previous employers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Providing vague or generic answers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Failing to highlight relevant accomplishments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Not asking thoughtful questions at the end</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Practice Tab */}
            <TabsContent value="practice" className="mt-0">
              {questions.length > 0 && currentQuestion && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card className="h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge variant={
                            currentQuestion.difficulty === 'easy' ? 'outline' : 
                            currentQuestion.difficulty === 'medium' ? 'secondary' : 
                            'destructive'
                          }>
                            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Question {currentQuestionIndex + 1} of {questions.length}
                          </span>
                        </div>
                        <CardTitle className="mt-2">{currentQuestion.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        {practiceMode === 'guided' && (
                          <div className="mb-6 space-y-4">
                            <div>
                              <h3 className="text-sm font-medium flex items-center gap-1.5">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                Tips for This Question
                              </h3>
                              <ul className="mt-2 space-y-1">
                                {currentQuestion.tips?.map((tip, index) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        {recordedAnswers[currentQuestion.id] ? (
                          <>
                            {/* Show recorded answer or text */}
                            <div className="border rounded-lg p-4 bg-muted/30">
                              <h3 className="text-sm font-medium mb-2">Your Answer</h3>
                              {typeof recordedAnswers[currentQuestion.id] === 'string' && 
                               recordedAnswers[currentQuestion.id].startsWith('blob:') ? (
                                // Audio recording
                                <div className="flex items-center gap-2">
                                  <audio 
                                    src={recordedAnswers[currentQuestion.id]} 
                                    controls 
                                    className="w-full"
                                  />
                                </div>
                              ) : (
                                // Text answer
                                <p className="text-sm whitespace-pre-line">
                                  {recordedAnswers[currentQuestion.id]}
                                </p>
                              )}
                            </div>
                            
                            {/* Feedback section */}
                            {feedback[currentQuestion.id] ? (
                              <div className="mt-4 border rounded-lg p-4 bg-green-50">
                                <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                                  <ListChecks className="h-4 w-4 text-green-500" />
                                  Answer Feedback
                                </h3>
                                
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="text-xs font-medium text-green-700">Strengths</h4>
                                    <ul className="mt-1">
                                      {feedback[currentQuestion.id].strengths.map((strength: string, index: number) => (
                                        <li key={index} className="text-xs flex items-start gap-1.5">
                                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                          <span>{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-xs font-medium text-amber-700">Areas for Improvement</h4>
                                    <ul className="mt-1">
                                      {feedback[currentQuestion.id].improvements.map((improvement: string, index: number) => (
                                        <li key={index} className="text-xs flex items-start gap-1.5">
                                          <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                          <span>{improvement}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="pt-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-medium">Overall Score</span>
                                      <span className="text-xs font-bold">{feedback[currentQuestion.id].score}/100</span>
                                    </div>
                                    <Progress 
                                      value={feedback[currentQuestion.id].score} 
                                      className="h-2 mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : isGeneratingFeedback ? (
                              <div className="mt-4 flex items-center justify-center h-20">
                                <div className="flex flex-col items-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                  <p className="mt-2 text-sm text-muted-foreground">Analyzing your answer...</p>
                                </div>
                              </div>
                            ) : null}
                            
                            {/* Navigation controls */}
                            <div className="flex justify-between mt-6">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setRecordedAnswers({
                                    ...recordedAnswers,
                                    [currentQuestion.id]: '',
                                  });
                                  setFeedback({
                                    ...feedback,
                                    [currentQuestion.id]: null,
                                  });
                                }}
                              >
                                Try Again
                              </Button>
                              
                              <Button onClick={goToNextQuestion}>
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Answer input area */}
                            <div className="space-y-4">
                              {isRecording ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                  <div className="relative">
                                    <div className="animate-ping absolute h-16 w-16 rounded-full bg-primary/20"></div>
                                    <div className="relative rounded-full bg-primary p-4">
                                      <Mic className="h-8 w-8 text-white" />
                                    </div>
                                  </div>
                                  <p className="mt-4 text-lg font-bold">{formatTime(recordingTime)}</p>
                                  <p className="text-sm text-muted-foreground mt-1">Recording your answer...</p>
                                </div>
                              ) : (
                                <>
                                  <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium mb-2">Your Answer</h3>
                                    <Textarea
                                      placeholder="Type your answer here..."
                                      className="min-h-[120px]"
                                      value={textAnswer}
                                      onChange={(e) => setTextAnswer(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-3 justify-end">
                                    <Button 
                                      variant="outline" 
                                      className="gap-1.5"
                                      onClick={toggleRecording}
                                    >
                                      <Mic className="h-4 w-4" />
                                      Record Answer
                                    </Button>
                                    
                                    <Button onClick={submitTextAnswer}>
                                      <Send className="mr-1.5 h-4 w-4" />
                                      Submit Answer
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                      
                      {isRecording && (
                        <CardFooter className="flex justify-center border-t pt-4">
                          <Button 
                            variant="destructive" 
                            className="gap-1.5"
                            onClick={stopRecording}
                          >
                            <MicOff className="h-4 w-4" />
                            Stop Recording
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      {practiceMode === 'guided' && currentQuestion.sampleAnswer && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Sample Answer</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm whitespace-pre-line">{currentQuestion.sampleAnswer}</p>
                          </CardContent>
                        </Card>
                      )}
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Interview Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">Completion</span>
                                <span className="text-sm font-medium">
                                  {Object.keys(recordedAnswers).length} of {questions.length} questions
                                </span>
                              </div>
                              <Progress 
                                value={(Object.keys(recordedAnswers).length / questions.length) * 100} 
                                className="h-2"
                              />
                            </div>
                            
                            <div className="pt-2">
                              <h3 className="text-sm font-medium mb-3">Questions</h3>
                              <div className="space-y-2">
                                {questions.map((q, index) => (
                                  <Button
                                    key={q.id}
                                    variant={currentQuestionIndex === index ? "default" : "outline"}
                                    className={cn(
                                      "w-full justify-start text-left",
                                      recordedAnswers[q.id] && "border-green-200 bg-green-50 hover:bg-green-100 text-green-900"
                                    )}
                                    onClick={() => {
                                      if (!isRecording) {
                                        setCurrentQuestionIndex(index);
                                      }
                                    }}
                                    disabled={isRecording}
                                  >
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
                                        <span className="text-xs">{index + 1}</span>
                                      </div>
                                      <span className="truncate max-w-[180px]">
                                        {q.question.length > 30 
                                          ? q.question.substring(0, 30) + '...' 
                                          : q.question
                                        }
                                      </span>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t">
                          <Button 
                            variant="outline" 
                            className="w-full gap-1.5"
                            onClick={restartPractice}
                            disabled={isRecording}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restart Practice
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Review Tab */}
            <TabsContent value="review" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Summary</CardTitle>
                      <CardDescription>
                        Review your overall interview performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(feedback).length > 0 ? (
                        <div className="space-y-6">
                          <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{calculateOverallScore()}</span>
                              </div>
                              <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#eee"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="3"
                                  strokeDasharray={`${calculateOverallScore()}, 100`}
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium mt-2">Overall Score</h3>
                            <p className="text-sm text-muted-foreground">
                              {calculateOverallScore() >= 90 ? 'Excellent performance!' :
                               calculateOverallScore() >= 80 ? 'Great job!' :
                               calculateOverallScore() >= 70 ? 'Good effort!' :
                               'Keep practicing!'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="p-4 flex flex-col items-center">
                                <h3 className="text-sm font-medium">Questions Completed</h3>
                                <p className="text-2xl font-bold mt-2">{Object.keys(recordedAnswers).length}/{questions.length}</p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardContent className="p-4 flex flex-col items-center">
                                <h3 className="text-sm font-medium">Top Scoring Answer</h3>
                                <p className="text-2xl font-bold mt-2">
                                  {Math.max(...Object.values(feedback).map(f => f.score))}
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardContent className="p-4 flex flex-col items-center">
                                <h3 className="text-sm font-medium">Average Score</h3>
                                <p className="text-2xl font-bold mt-2">{calculateOverallScore()}</p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-base font-medium mb-3">Common Feedback Themes</h3>
                            <div className="space-y-2">
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-green-800 mb-1">Strengths</h4>
                                <ul className="space-y-1">
                                  <li className="text-sm flex items-start gap-1.5">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Good use of specific examples to illustrate points</span>
                                  </li>
                                  <li className="text-sm flex items-start gap-1.5">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Clear structure and organization in responses</span>
                                  </li>
                                  <li className="text-sm flex items-start gap-1.5">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Effective communication of relevant skills and experiences</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-amber-800 mb-1">Areas for Improvement</h4>
                                <ul className="space-y-1">
                                  <li className="text-sm flex items-start gap-1.5">
                                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <span>Include more quantifiable results and metrics</span>
                                  </li>
                                  <li className="text-sm flex items-start gap-1.5">
                                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <span>Be more concise in some responses</span>
                                  </li>
                                  <li className="text-sm flex items-start gap-1.5">
                                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <span>Connect experiences more directly to job requirements</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No feedback available</h3>
                          <p className="text-muted-foreground mt-1 max-w-md">
                            Complete at least one question in the practice session to see performance feedback.
                          </p>
                          <Button
                            className="mt-6" 
                            variant="outline" 
                            onClick={() => setActiveTab('practice')}
                          >
                            Return to Practice
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {Object.keys(feedback).length > 0 && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Answer Review</CardTitle>
                        <CardDescription>
                          Review each question and your responses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-6">
                            {questions.map((question, index) => (
                              <div 
                                key={question.id} 
                                className={cn(
                                  "border rounded-lg p-4",
                                  recordedAnswers[question.id] ? "bg-white" : "bg-muted/30"
                                )}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <Badge variant="outline" className="mb-2">Question {index + 1}</Badge>
                                    <h3 className="font-medium">{question.question}</h3>
                                  </div>
                                  {feedback[question.id] && (
                                    <Badge 
                                      className={cn(
                                        "ml-2",
                                        feedback[question.id].score >= 90 ? "bg-green-100 text-green-800 hover:bg-green-100" : 
                                        feedback[question.id].score >= 75 ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : 
                                        feedback[question.id].score >= 60 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
                                        "bg-red-100 text-red-800 hover:bg-red-100"
                                      )}
                                    >
                                      Score: {feedback[question.id].score}
                                    </Badge>
                                  )}
                                </div>
                                
                                {recordedAnswers[question.id] ? (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">Your Answer</h4>
                                    {typeof recordedAnswers[question.id] === 'string' && 
                                     recordedAnswers[question.id].startsWith('blob:') ? (
                                      <div className="flex items-center gap-2">
                                        <audio 
                                          src={recordedAnswers[question.id]} 
                                          controls 
                                          className="w-full"
                                        />
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                                        {recordedAnswers[question.id]}
                                      </p>
                                    )}
                                    
                                    {feedback[question.id] && (
                                      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="text-xs font-medium text-green-700 mb-1">Strengths</h4>
                                          <ul className="space-y-1">
                                            {feedback[question.id].strengths.map((strength: string, i: number) => (
                                              <li key={i} className="text-xs flex items-start gap-1.5">
                                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{strength}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        
                                        <div>
                                          <h4 className="text-xs font-medium text-amber-700 mb-1">
                                            Areas for Improvement
                                          </h4>
                                          <ul className="space-y-1">
                                            {feedback[question.id].improvements.map((improvement: string, i: number) => (
                                              <li key={i} className="text-xs flex items-start gap-1.5">
                                                <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <span>{improvement}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="mt-4 text-sm text-muted-foreground">
                                    <p>You didn't answer this question yet.</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        className="w-full gap-1.5"
                        onClick={restartPractice}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Practice Again
                      </Button>
                      
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-3">Recommended Actions</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <Award className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium">Complete the Interview Mastery Course</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Learn advanced techniques for different interview types
                              </p>
                              <Button size="sm" variant="link" className="h-6 p-0 mt-1">
                                View Course
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
                            <UserCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium">Book a Mock Interview</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Practice with a professional career coach
                              </p>
                              <Button size="sm" variant="link" className="h-6 p-0 mt-1">
                                Book Session
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <BookOpen className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium">Review Interview Guides</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Industry-specific interview preparation materials
                              </p>
                              <Button size="sm" variant="link" className="h-6 p-0 mt-1">
                                View Guides
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};