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

const interviewTips = [
  {
    title: "STAR Method",
    shortDesc: "Use the STAR method for behavioral questions",
    fullDesc: `The STAR method is a structured approach to answering behavioral interview questions:

• Situation: Set the scene and context
• Task: Describe what you were responsible for
• Action: Explain exactly what you did
• Result: Share the outcomes of your actions

Example:
Q: "Tell me about a time you handled a difficult project."

STAR Response:
✓ Situation: "At my previous company, we faced a critical client deadline for a complex software implementation."
✓ Task: "I was responsible for coordinating between development and client teams."
✓ Action: "I created a detailed project timeline, held daily stand-ups, and implemented a new communication protocol."
✓ Result: "We delivered the project two days early and the client commended our excellent communication."`,
  },
  {
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
• When listening, focus on the speaker

3. Hand Gestures
• Use open, natural gestures
• Keep hands visible but calm
• Avoid fidgeting or touching face

4. Facial Expressions
• Maintain a pleasant, engaged expression
• Smile naturally when appropriate
• Show active listening through nodding

Practice these in front of a mirror or record yourself to improve!`,
  },
  {
    title: "Experience Examples",
    shortDesc: "Prepare relevant examples from your experience",
    fullDesc: `How to prepare compelling experience examples:

1. Create an Experience Bank
• List 5-7 significant projects/achievements
• Include challenges overcome
• Note measurable results

2. Categories to Cover:
• Leadership
• Problem-solving
• Teamwork
• Conflict resolution
• Technical skills

3. Structure Each Example:
• Context: Brief background
• Challenge: What problem you faced
• Action: Your specific role
• Impact: Quantifiable results

Example Template:
"In my role at [Company], I [action] which resulted in [specific outcome]. This demonstrated my ability to [relevant skill]."

Remember to:
• Use specific numbers and metrics
• Keep examples recent (last 2-3 years)
• Adapt stories to different questions
• Practice telling them concisely`,
  },
  {
    title: "Active Listening",
    shortDesc: "Practice active listening and thoughtful responses",
    fullDesc: `Active Listening Techniques:

1. During the Question
• Listen completely without interrupting
• Notice key words and themes
• Pay attention to the specific type of example requested

2. Before Responding
• Take a brief pause (1-2 seconds)
• If needed, clarify any unclear points
• Structure your response mentally

3. While Responding
• Address all parts of the question
• Use specific examples
• Watch for interviewer cues
• Keep responses focused (2-3 minutes max)

Common Mistakes to Avoid:
• Rushing to answer
• Going off on tangents
• Missing key parts of complex questions
• Not providing specific examples

Pro Tips:
• It's okay to ask for clarification
• Use phrases like "Let me think about that for a moment"
• Confirm you've answered fully: "Does that address your question?"`,
  },
];

export default function InterviewPractice() {
  const [industry, setIndustry] = useState<keyof typeof industryQuestions>("general");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedTip, setSelectedTip] = useState<typeof interviewTips[0] | null>(null);
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
            Click on each tip to learn more about the technique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {interviewTips.map((tip, index) => (
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