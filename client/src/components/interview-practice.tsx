import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, MessageSquare, Video, ThumbsUp, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const industryQuestions = {
  general: [
    "Tell me about yourself.",
    "Where do you see yourself in five years?",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to work for this company?",
  ],
};

// Base interview tips that can be customized
const baseInterviewTips = {
  star: {
    title: "STAR Method",
    shortDesc: "Use the STAR method for behavioral questions",
    fullDesc: `The STAR method is a structured approach to answering behavioral interview questions:

• Situation: Set the scene and context
• Task: Describe what you were responsible for
• Action: Explain exactly what you did
• Result: Share the outcomes of your actions`,
  },
  bodyLanguage: {
    title: "Body Language",
    shortDesc: "Maintain good posture and appropriate eye contact",
    fullDesc: `Key aspects of professional body language:

1. Posture
• Sit straight but relaxed
• Keep shoulders back and chin up
• Avoid crossing arms (appears defensive)

2. Eye Contact
• Maintain natural eye contact 60-70% of the time
• When speaking, look at different faces in the panel
• When listening, focus on the speaker`,
  },
  experience: {
    title: "Experience Examples",
    shortDesc: "Prepare relevant examples from your experience",
    fullDesc: `How to prepare compelling experience examples:

1. Create an Experience Bank
• List 5-7 significant projects/achievements
• Include challenges overcome
• Note measurable results`,
  },
  listening: {
    title: "Active Listening",
    shortDesc: "Practice active listening and thoughtful responses",
    fullDesc: `Active Listening Techniques:

1. During the Question
• Listen completely without interrupting
• Notice key words and themes
• Pay attention to the specific type of example requested`,
  },
};

// Question-specific tips mapping
const getQuestionSpecificTips = (question: string) => {
  const tips = [];

  // Personal introduction question
  if (question.toLowerCase().includes("tell me about yourself")) {
    tips.push({
      ...baseInterviewTips.experience,
      shortDesc: "Structure your personal introduction",
      fullDesc: `How to introduce yourself effectively:

1. Present Structure (60-90 seconds total)
• Start with current role/status (15 seconds)
• Highlight 2-3 key achievements (30 seconds)
• Connect past experience to desired role (15 seconds)
• End with enthusiasm for opportunity (15 seconds)

2. Key Elements to Include
• Relevant skills and experience
• Unique value proposition
• Professional passion/motivation
• Clear connection to role

Remember:
• Stay professional but personable
• Focus on relevant experiences
• Show enthusiasm and confidence
• Practice but don't sound rehearsed`
    });
  }

  // Future goals question
  else if (question.toLowerCase().includes("five years")) {
    tips.push({
      ...baseInterviewTips.experience,
      shortDesc: "Frame your career aspirations",
      fullDesc: `How to discuss your future goals:

1. Structure Your Response
• Start with immediate goals related to the role
• Discuss medium-term development plans
• Share long-term aspirations aligned with company growth

2. Key Points to Cover
• Professional development goals
• Leadership aspirations
• Industry knowledge growth
• Company contribution vision

Remember:
• Show ambition but stay realistic
• Align goals with company trajectory
• Emphasize commitment to growth
• Balance personal and professional goals`
    });
  }

  // Behavioral/project questions
  else if (question.toLowerCase().includes("describe") || question.toLowerCase().includes("how do you")) {
    tips.push({
      ...baseInterviewTips.star,
      fullDesc: `${baseInterviewTips.star.fullDesc}

Example for "${question}":
✓ Situation: Describe the specific context
✓ Task: Explain your responsibility
✓ Action: Detail your specific actions
✓ Result: Share quantifiable outcomes

Tips for this question:
• Choose a relevant, recent example
• Focus on your direct contributions
• Include specific metrics/results
• Highlight key learnings`
    });
  }

  // Add general tips that are always useful
  tips.push({
    ...baseInterviewTips.bodyLanguage,
    fullDesc: `${baseInterviewTips.bodyLanguage.fullDesc}

3. Specific to This Question:
• Use confident, open posture
• Maintain steady eye contact
• Use natural hand gestures to emphasize points
• Show engagement through active listening`
  });

  tips.push({
    ...baseInterviewTips.listening,
    fullDesc: `${baseInterviewTips.listening.fullDesc}

2. For This Question Type:
• Listen for specific requirements
• Take a moment to organize thoughts
• Structure response clearly
• Check understanding if needed`
  });

  return tips;
};

export default function InterviewPractice() {
  const [industry, setIndustry] = useState<keyof typeof industryQuestions>("general");
  const [jobField, setJobField] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [currentTips, setCurrentTips] = useState<any[]>([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string>("");

  const generateQuestionsMutation = useMutation({
    mutationFn: async (field: string) => {
      const res = await apiRequest("POST", "/api/interview/questions", { jobField: field });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setCustomQuestions(data.questions);
      toast({
        title: "Questions Generated",
        description: `Interview questions generated for ${jobField} role.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate questions. Please try again.",
      });
      console.error("Error generating questions:", error);
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (answer: string) => {
      const res = await apiRequest("POST", "/api/interview/analyze", {
        answer,
        question: currentQuestion,
        industry,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze response");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setFeedback(data.feedback);
      toast({
        title: "Feedback Ready",
        description: "AI has analyzed your response.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Unable to analyze response. Please try again later.",
      });
      console.error("Error analyzing interview response:", error);
    },
  });

  const handleSelectQuestion = (question: string) => {
    setCurrentQuestion(question);
    setAnswer("");
    setCurrentTips(getQuestionSpecificTips(question));
    setFeedback("");
  };

  const handleGenerateQuestions = () => {
    if (!jobField.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job field to generate specific questions.",
      });
      return;
    }
    generateQuestionsMutation.mutate(jobField);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Practice</CardTitle>
          <CardDescription>
            Practice answering interview questions and get AI feedback on your responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select
              value={industry}
              onValueChange={(value) => setIndustry(value as keyof typeof industryQuestions)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobField">Custom Job Field</Label>
            <div className="flex gap-2">
              <Input
                id="jobField"
                placeholder="e.g. Executive Chef, Software Engineer, etc."
                value={jobField}
                onChange={(e) => setJobField(e.target.value)}
              />
              <Button
                onClick={handleGenerateQuestions}
                disabled={generateQuestionsMutation.isPending || !jobField.trim()}
              >
                {generateQuestionsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                Generate Questions
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {industryQuestions[industry].map((question, index) => (
              <Button
                key={`general-${index}`}
                variant={currentQuestion === question ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleSelectQuestion(question)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {question}
              </Button>
            ))}

            {customQuestions.map((question, index) => (
              <Button
                key={`custom-${index}`}
                variant={currentQuestion === question ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleSelectQuestion(question)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
            <CardDescription>{currentQuestion}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => analyzeMutation.mutate(answer)}
                disabled={!answer.trim() || analyzeMutation.isPending}
              >
                {analyzeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ThumbsUp className="h-4 w-4 mr-2" />
                )}
                Get Feedback
              </Button>
              <Button variant="outline" disabled>
                <Video className="h-4 w-4 mr-2" />
                Record Video (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentQuestion && feedback && (
        <Card>
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
            <CardDescription>Analysis of your response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{feedback}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Interview Confidence Tips</CardTitle>
          <CardDescription>
            {currentQuestion
              ? "Specific tips for this question type"
              : "Select a question to see tailored tips"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentTips.map((tip, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center justify-between p-3 hover:bg-accent rounded-lg group"
                  onClick={() => setSelectedTip(tip)}
                >
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                    <span>{tip.shortDesc}</span>
                  </div>
                  <Info className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTip?.title}</DialogTitle>
            <DialogDescription>
              <div className="mt-4 whitespace-pre-wrap">{selectedTip?.fullDesc}</div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}