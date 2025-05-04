import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Brain, PenTool, Users, Lightbulb, X, Filter, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import QuizComponent from '@/components/quiz-component';
import { cn } from "@/lib/utils";
import {
  FullScreenDialog,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogClose
} from '@/components/ui/full-screen-dialog';

export default function CriticalThinkingCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Critical Thinking
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "Which of the following is NOT one of the core skills in critical thinking?",
      options: [
        "Analysis",
        "Evaluation", 
        "Memorization",
        "Inference"
      ],
      correctAnswer: 2,
      explanation: "Memorization is not a core critical thinking skill. Critical thinking involves analysis, evaluation, inference, interpretation, explanation, and self-regulation."
    },
    {
      id: 2,
      question: "What is confirmation bias?",
      options: [
        "The tendency to seek information that confirms our existing beliefs",
        "The bias that comes from consulting multiple sources",
        "The tendency to make decisions based on the order in which information is presented",
        "The bias that results from following logical reasoning"
      ],
      correctAnswer: 0,
      explanation: "Confirmation bias is the tendency to seek, interpret, and remember information that confirms our existing beliefs while giving less attention to information that contradicts them."
    },
    {
      id: 3,
      question: "Which approach is most aligned with critical thinking?",
      options: [
        "Accepting information from authority figures without question",
        "Believing the first explanation that makes sense",
        "Evaluating evidence and considering alternative perspectives",
        "Trusting your intuition over evidence"
      ],
      correctAnswer: 2,
      explanation: "Critical thinking involves evaluating evidence objectively and considering multiple perspectives before drawing conclusions, rather than accepting information uncritically."
    },
    {
      id: 4,
      question: "What is the Socratic method?",
      options: [
        "A mathematical formula for solving complex problems",
        "A technique that uses focused questioning to stimulate critical thinking",
        "A memorization strategy for learning new concepts",
        "A method for organizing ideas in written form"
      ],
      correctAnswer: 1,
      explanation: "The Socratic method is a form of cooperative dialogue where individuals are prompted to examine their ideas through focused questioning, helping to stimulate critical thinking and illuminate ideas."
    },
    {
      id: 5,
      question: "Which logical fallacy involves attacking the person making the argument rather than addressing the argument itself?",
      options: [
        "Straw man fallacy",
        "Appeal to authority",
        "Ad hominem fallacy",
        "False dichotomy"
      ],
      correctAnswer: 2,
      explanation: "The ad hominem fallacy occurs when someone attacks the character, motives, or attributes of the person making an argument rather than addressing the substance of the argument itself."
    },
    {
      id: 6,
      question: "What is 'intellectual humility' in critical thinking?",
      options: [
        "The belief that all opinions are equally valid",
        "Recognition of the limits of one's knowledge and openness to new information",
        "Assuming you are wrong about most things",
        "Deferring to experts on all matters"
      ],
      correctAnswer: 1,
      explanation: "Intellectual humility involves recognizing that your knowledge is limited, being open to new evidence and perspectives, and being willing to revise your beliefs when warranted by new information."
    },
    {
      id: 7,
      question: "Which of the following is an example of deductive reasoning?",
      options: [
        "Drawing a general conclusion from specific observations",
        "Making a prediction based on past trends",
        "Applying a general rule to a specific case",
        "Using intuition to solve a problem"
      ],
      correctAnswer: 2,
      explanation: "Deductive reasoning involves applying general rules or principles to specific cases to draw a conclusion. It moves from the general to the specific, unlike inductive reasoning which does the opposite."
    },
    {
      id: 8,
      question: "What is a 'red herring' in an argument?",
      options: [
        "A piece of information that definitively proves a point",
        "An irrelevant topic introduced to divert attention from the original issue",
        "A logical conclusion based on sound premises",
        "A controversial statement designed to provoke emotional response"
      ],
      correctAnswer: 1,
      explanation: "A red herring is a diversionary tactic that involves introducing an irrelevant topic to distract from the original issue being discussed, derailing the argument and avoiding the actual point of contention."
    },
    {
      id: 9,
      question: "Which critical thinking skill involves breaking complex ideas into component parts?",
      options: [
        "Synthesis",
        "Evaluation",
        "Analysis",
        "Inference"
      ],
      correctAnswer: 2,
      explanation: "Analysis involves breaking down complex information or problems into smaller, more manageable parts to understand the relationships between these components and identify patterns or causes."
    },
    {
      id: 10,
      question: "What is 'cognitive dissonance'?",
      options: [
        "The mental state achieved during deep critical thinking",
        "The inability to think critically due to mental fatigue",
        "The psychological discomfort experienced when holding contradictory beliefs",
        "The process of analyzing different perspectives simultaneously"
      ],
      correctAnswer: 2,
      explanation: "Cognitive dissonance is the mental discomfort that results from holding contradictory beliefs, values, or attitudes. People tend to seek consistency in their cognitions, which can sometimes lead to irrational or maladaptive behavior."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "The Critical Thinking Community",
      url: "https://www.criticalthinking.org/",
      description: "Foundation for Critical Thinking resources and research"
    },
    {
      title: "Logical Fallacies",
      url: "https://yourlogicalfallacyis.com/",
      description: "Interactive guide to common logical fallacies"
    },
    {
      title: "How to Think Critically - TED Talk",
      url: "https://www.ted.com/talks/samantha_agoos_5_tips_to_improve_your_critical_thinking",
      description: "5-minute video on improving critical thinking skills"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'foundations',
      title: 'Foundations of Critical Thinking',
      description: 'Understanding the core components of critical thinking',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <p>
            Critical thinking is the intellectually disciplined process of actively conceptualizing, applying, analyzing, 
            synthesizing, and evaluating information to reach an answer or conclusion. This module introduces the 
            fundamental concepts and skills that form the foundation of critical thinking.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Core Elements of Critical Thinking</h3>
                </div>
                <p className="text-orange-700 text-sm">Six fundamental skills for effective analytical thinking</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Critical thinking consists of several interrelated skills that work together to help you evaluate information effectively:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Analysis</h4>
                      <p className="text-orange-700 text-sm mt-1">Breaking down complex information into smaller, manageable parts</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Evaluation</h4>
                      <p className="text-orange-700 text-sm mt-1">Assessing the credibility and logical strength of information</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Inference</h4>
                      <p className="text-orange-700 text-sm mt-1">Drawing reasonable conclusions from available evidence</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Interpretation</h4>
                      <p className="text-orange-700 text-sm mt-1">Understanding and expressing the meaning of information</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Explanation</h4>
                      <p className="text-orange-700 text-sm mt-1">Clearly presenting reasoning and results</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Self-regulation</h4>
                      <p className="text-orange-700 text-sm mt-1">Monitoring and correcting your own thinking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Why Critical Thinking Matters</h3>
                </div>
                <p className="text-orange-700 text-sm">Key benefits in today's information-rich society</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                In our complex world filled with an abundance of information, critical thinking skills have become essential for navigating daily life and making informed decisions:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Better Decisions</h4>
                      <p className="text-orange-700 text-sm mt-1">Make informed choices in personal and professional life</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Resist Manipulation</h4>
                      <p className="text-orange-700 text-sm mt-1">Avoid being misled by misinformation or propaganda</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Problem-Solving</h4>
                      <p className="text-orange-700 text-sm mt-1">Tackle complex problems more systematically and effectively</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Evidence-Based</h4>
                      <p className="text-orange-700 text-sm mt-1">Evaluate claims and arguments based on credible evidence</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 md:col-span-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Personal Confidence</h4>
                      <p className="text-orange-700 text-sm mt-1">Develop intellectual autonomy and self-confidence in your thinking abilities</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-200 mt-6">
                <h4 className="font-medium text-orange-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Insight
                </h4>
                <p className="text-orange-800">
                  Critical thinking is not about being critical in the negative sense. It's about approaching information 
                  with curiosity and disciplined evaluation rather than passive acceptance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cognitive-biases',
      title: 'Recognizing Cognitive Biases',
      description: 'Understanding biases that cloud judgment and decision-making',
      icon: Filter,
      content: (
        <div className="space-y-4">
          <p>
            Cognitive biases are systematic patterns of deviation from norm or rationality in judgment. They create 
            their own subjective reality from their perception of the input. This module helps you identify and 
            overcome common biases that can impair critical thinking.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Common Cognitive Biases</h3>
                </div>
                <p className="text-orange-700 text-sm">Mental shortcuts that can distort thinking and decision-making</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Cognitive biases are systematic errors in thinking that affect our judgments and decisions. They develop as mental shortcuts but can lead to irrational conclusions:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Confirmation Bias</h4>
                  </div>
                  <p className="text-gray-700">The tendency to search for, interpret, and recall information that confirms pre-existing beliefs</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Example: Only reading news sources that align with your political views</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Anchoring Bias</h4>
                  </div>
                  <p className="text-gray-700">Relying too heavily on the first piece of information encountered when making decisions</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Example: A $2,000 watch seems reasonable after looking at a $10,000 watch</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Availability Heuristic</h4>
                  </div>
                  <p className="text-gray-700">Overestimating the likelihood of events based on their availability in memory</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Example: Fearing air travel after hearing about a plane crash in the news</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Dunning-Kruger Effect</h4>
                  </div>
                  <p className="text-gray-700">Overestimating one's abilities when knowledge or competence is low</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Example: A beginner believing they've mastered a skill after basic training</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Overcoming Cognitive Biases</h3>
                </div>
                <p className="text-orange-700 text-sm">Strategies for minimizing the impact of biases on thinking</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                While we can't eliminate cognitive biases completely, we can develop practices to minimize their influence on our thinking and decision-making:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Seek Contrary Evidence</h4>
                      <p className="text-orange-700 text-sm mt-1">Actively search for information that challenges your existing beliefs</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Self-Awareness</h4>
                      <p className="text-orange-700 text-sm mt-1">Recognize your personal biases and blind spots</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Diverse Perspectives</h4>
                      <p className="text-orange-700 text-sm mt-1">Engage with people who think differently than you do</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Intellectual Humility</h4>
                      <p className="text-orange-700 text-sm mt-1">Practice openness to being wrong and willingness to change your mind</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 sm:col-span-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Structured Decision-Making</h4>
                      <p className="text-orange-700 text-sm mt-1">Use formal frameworks and checklists to make important decisions, reducing the opportunity for biases to take over</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-200 mt-6">
                <h4 className="font-medium text-orange-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Note
                </h4>
                <p className="text-orange-800">
                  Everyone has cognitive biases—awareness is the first step to mitigation. Even experts in critical 
                  thinking must constantly work to recognize and overcome their own biases.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'logical-fallacies',
      title: 'Identifying Logical Fallacies',
      description: 'Recognizing common errors in reasoning and argumentation',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <p>
            Logical fallacies are errors in reasoning that undermine the logic of an argument. Recognizing these 
            fallacies helps you evaluate arguments more effectively and construct stronger arguments yourself.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Common Logical Fallacies</h3>
                </div>
                <p className="text-orange-700 text-sm">Frequent errors in reasoning that undermine sound arguments</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Logical fallacies are errors in reasoning that can make arguments appear stronger than they actually are. Recognizing these patterns helps you evaluate information more critically:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Ad Hominem</h4>
                  </div>
                  <p className="text-gray-700">Attacking the person instead of addressing their argument</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>"You can't trust his economic policy because he's never had a real job."</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Straw Man</h4>
                  </div>
                  <p className="text-gray-700">Misrepresenting someone's argument to make it easier to attack</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>"You want better healthcare? So you want complete government control of medicine!"</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">False Dichotomy</h4>
                  </div>
                  <p className="text-gray-700">Presenting only two options when others exist</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>"Either we cut education funding or we go bankrupt."</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Appeal to Authority</h4>
                  </div>
                  <p className="text-gray-700">Claiming something is true because an authority says it is</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>"This famous doctor endorsed this supplement, so it must work."</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm md:col-span-2">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Slippery Slope</h4>
                  </div>
                  <p className="text-gray-700">Asserting that a small first step will inevitably lead to extreme consequences</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm italic flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>"If we ban assault rifles, all guns will eventually be banned."</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Spotting & Countering Fallacies</h3>
                </div>
                <p className="text-orange-700 text-sm">Practical techniques for identifying and addressing logical errors</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Developing your ability to spot logical fallacies takes practice. These strategies will help you identify and respond to fallacious reasoning effectively:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Analyze Structure</h4>
                      <p className="text-orange-700 text-sm mt-1">Focus on the structure of arguments rather than just content</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Examine Evidence</h4>
                      <p className="text-orange-700 text-sm mt-1">Ask what evidence actually supports the conclusion</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Find Assumptions</h4>
                      <p className="text-orange-700 text-sm mt-1">Identify hidden assumptions in the reasoning</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Check Connections</h4>
                      <p className="text-orange-700 text-sm mt-1">Consider whether premises logically connect to conclusions</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 sm:col-span-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Redirection</h4>
                      <p className="text-orange-700 text-sm mt-1">Address fallacies by redirecting discussion back to the actual argument rather than getting sidetracked</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-200 mt-6">
                <h4 className="font-medium text-orange-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Pro Tip
                </h4>
                <p className="text-orange-800">
                  When you spot a fallacy in someone else's argument, pointing it out directly can make them defensive. 
                  Instead, ask questions that help them see the gap in their reasoning.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'application',
      title: 'Practical Applications',
      description: 'Applying critical thinking skills to real-world situations',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <p>
            Critical thinking isn't just theoretical—it's a practical skill for navigating daily life. This module 
            provides frameworks and approaches for applying critical thinking to various contexts and situations.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">The IDEA Framework</h3>
                </div>
                <p className="text-orange-700 text-sm">A systematic approach to critical thinking in any situation</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                The IDEA framework provides a structured approach to critical thinking that you can apply to virtually any decision or evaluation:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center bg-orange-100 rounded-full h-10 w-10 mr-3">
                      <span className="font-bold text-orange-500 text-lg">I</span>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Identify</h4>
                  </div>
                  <p className="text-gray-700">Clearly identify the claim, assertion, or decision that needs to be evaluated</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Example: "What exactly is being claimed in this article about climate change?"</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center bg-orange-100 rounded-full h-10 w-10 mr-3">
                      <span className="font-bold text-orange-500 text-lg">D</span>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Determine</h4>
                  </div>
                  <p className="text-gray-700">Gather and determine what facts, evidence, and perspectives are relevant</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Example: "What scientific studies, data, and expert opinions relate to this climate claim?"</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center bg-orange-100 rounded-full h-10 w-10 mr-3">
                      <span className="font-bold text-orange-500 text-lg">E</span>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Evaluate</h4>
                  </div>
                  <p className="text-gray-700">Critically evaluate the quality, credibility, and logic of the information and arguments</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Example: "Are these climate studies peer-reviewed? Do the conclusions logically follow from the data?"</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center bg-orange-100 rounded-full h-10 w-10 mr-3">
                      <span className="font-bold text-orange-500 text-lg">A</span>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Act</h4>
                  </div>
                  <p className="text-gray-700">Make a decision or form a conclusion based on your reasoned evaluation</p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-orange-100">
                    <p className="text-orange-800 text-sm flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Example: "Based on credible evidence, I'll adjust my lifestyle to reduce my carbon footprint."</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Real-World Applications</h3>
                </div>
                <p className="text-orange-700 text-sm">How to apply critical thinking in different contexts</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Critical thinking is most valuable when applied to real-life situations. Here are strategies for using critical thinking across various aspects of your daily life:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Media & News</h4>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Verify information with multiple credible sources</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Distinguish between facts and opinions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Recognize emotional manipulation techniques</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Consider what information might be missing</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Personal Decisions</h4>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Clarify your goals and values</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Generate multiple alternatives</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Evaluate pros and cons systematically</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Consider long-term implications</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Workplace</h4>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Define problems clearly before solving</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Gather relevant data and expertise</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Challenge group assumptions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Evaluate solutions against objectives</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Social Media</h4>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Be skeptical of viral content</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Check the source and creation date</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Look for context before sharing</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">Be aware of algorithmic bubbles</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-200 mt-6">
                <h4 className="font-medium text-orange-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Success Strategy
                </h4>
                <p className="text-orange-800">
                  Start small by applying critical thinking to one area of your life. As it becomes habitual, expand 
                  to other areas. The skill strengthens with regular practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Brain className="h-6 w-6 mr-2 text-orange-500" />
          Critical Thinking
        </h1>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <div className="flex items-center justify-between">
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'learn' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('learn')}
            >
              <span className="text-sm font-medium">Learn</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'practice' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('practice')}
            >
              <span className="text-sm font-medium">Practice</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'resources' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              <span className="text-sm font-medium">Resources</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction to Critical Thinking</CardTitle>
              <CardDescription>
                Learn how to analyze information, evaluate arguments, and make better decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Critical thinking is the ability to think clearly and rationally about what to believe or do. It's about 
                evaluating information, questioning assumptions, analyzing arguments, and drawing logical conclusions.
              </p>
              <p className="mb-4">
                In today's world of information overload and misinformation, critical thinking skills are more important 
                than ever. This course will help you develop a toolkit for analyzing claims, spotting logical fallacies, 
                overcoming cognitive biases, and making better decisions in all areas of life.
              </p>
            </CardContent>
          </Card>
          
          {/* Course modules as cards with dialogs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <FullScreenDialog key={module.id}>
                  <FullScreenDialogTrigger asChild>
                    <Card className="border-2 border-orange-100 shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                            <Icon className="h-10 w-10 text-orange-500" />
                          </div>
                          <CardTitle className="mb-2">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </FullScreenDialogTrigger>
                  <FullScreenDialogContent themeColor="#f97316">
                    <FullScreenDialogHeader>
                      <div className="flex items-center mb-2">
                        <Icon className="w-6 h-6 mr-2 text-orange-500" />
                        <FullScreenDialogTitle>{module.title}</FullScreenDialogTitle>
                      </div>
                      <FullScreenDialogDescription>{module.description}</FullScreenDialogDescription>
                    </FullScreenDialogHeader>
                    <FullScreenDialogBody className="overflow-y-auto max-h-[70vh] md:max-h-[unset]">
                      <div className="prose prose-orange max-w-none">
                        {module.content}
                      </div>
                    </FullScreenDialogBody>
                    <FullScreenDialogFooter>
                      <Button 
                        variant="outline" 
                        className="mr-auto"
                      >
                        Mark as Complete
                      </Button>
                      <FullScreenDialogClose asChild>
                        <Button>Close</Button>
                      </FullScreenDialogClose>
                    </FullScreenDialogFooter>
                  </FullScreenDialogContent>
                </FullScreenDialog>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Critical Thinking Skills</CardTitle>
              <CardDescription>
                Answer these questions to check your understanding of critical thinking concepts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Critical Thinking"
                difficulty="intermediate"
                questions={QUIZ_QUESTIONS}
                onComplete={(score, total) => {
                  console.log(`Quiz results: ${score}/${total}`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Thinking Resources</CardTitle>
              <CardDescription>
                Useful websites, books, and tools to further develop your critical thinking skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleResourceLinks resources={RESOURCES} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hide Learning Coach button on mobile, show only on SM and larger screens */}
      <div className="mt-8 hidden sm:block">
        <Button 
          onClick={() => setShowChat(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <BookOpenIcon className="mr-2 h-4 w-4" />
          Ask Learning Coach
        </Button>
      </div>

      {/* Only show the pop-out chat when active to prevent duplicate Fundi robots */}
      {showChat && (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}