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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, MessageSquare, Video, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const industryQuestions = {
  software: [
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "How do you stay updated with the latest technologies?",
    "Explain a complex technical concept in simple terms.",
  ],
  marketing: [
    "Describe a successful marketing campaign you developed.",
    "How do you measure the success of your marketing initiatives?",
    "How do you adapt your strategy based on market trends?",
  ],
  finance: [
    "How do you analyze financial risks in investments?",
    "Describe a time you identified a financial opportunity.",
    "How do you stay compliant with financial regulations?",
  ],
  general: [
    "Tell me about yourself.",
    "Where do you see yourself in five years?",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to work for this company?",
  ],
};

const confidenceTips = [
  "Maintain good posture - sit up straight and keep shoulders back",
  "Practice active listening and maintain appropriate eye contact",
  "Take deep breaths to stay calm and composed",
  "Use the STAR method for behavioral questions",
  "Prepare relevant examples from your experience",
];

export default function InterviewPractice() {
  const [industry, setIndustry] = useState<keyof typeof industryQuestions>("general");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (answer: string) => {
      const res = await apiRequest("POST", "/api/interview/analyze", {
        answer,
        question: currentQuestion,
        industry,
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Feedback Ready",
        description: "AI has analyzed your response.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze response. Please try again.",
      });
    },
  });

  const handleSelectQuestion = (question: string) => {
    setCurrentQuestion(question);
    setAnswer("");
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
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Questions</SelectItem>
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {industryQuestions[industry].map((question, index) => (
              <Button
                key={index}
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

      <Card>
        <CardHeader>
          <CardTitle>Interview Confidence Tips</CardTitle>
          <CardDescription>
            Follow these tips to improve your interview performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {confidenceTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <ThumbsUp className="h-4 w-4 mt-1 text-green-500" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}