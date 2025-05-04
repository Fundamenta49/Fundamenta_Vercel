import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, GitFork, Compass, Lightbulb, BarChart, Brain } from 'lucide-react';
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

export default function DecisionMakingCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Decision Making
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is 'analysis paralysis'?",
      options: [
        "A technique for analyzing complex problems",
        "The tendency to overthink and get stuck when making decisions",
        "A formal decision-making framework",
        "The final step in the decision-making process"
      ],
      correctAnswer: 1,
      explanation: "Analysis paralysis occurs when overthinking a decision leads to delay or inability to take action, often due to fear of making the wrong choice."
    },
    {
      id: 2,
      question: "Which decision-making approach is best for routine, well-structured problems?",
      options: [
        "Intuitive decision-making",
        "Rational decision-making",
        "Creative decision-making",
        "Emotional decision-making"
      ],
      correctAnswer: 1,
      explanation: "Rational decision-making is most appropriate for routine, well-structured problems where clear criteria and processes can be applied systematically."
    },
    {
      id: 3,
      question: "What is a primary benefit of using a decision matrix?",
      options: [
        "It eliminates the need for critical thinking",
        "It makes decisions instantly without your input",
        "It helps you objectively compare options using weighted criteria",
        "It tells you what others would decide in your situation"
      ],
      correctAnswer: 2,
      explanation: "A decision matrix helps you objectively compare different options by evaluating them against multiple criteria that you can weight according to importance."
    },
    {
      id: 4,
      question: "What is the 'sunk cost fallacy' in decision-making?",
      options: [
        "A strategy to recover previous investments",
        "The tendency to continue an endeavor due to previously invested resources",
        "A method for calculating future return on investment",
        "The practice of cutting losses immediately at the first sign of trouble"
      ],
      correctAnswer: 1,
      explanation: "The sunk cost fallacy is the tendency to continue an endeavor due to previously invested resources (time, money, effort) that cannot be recovered, rather than based on the actual future value of the decision."
    },
    {
      id: 5,
      question: "Which of the following is NOT a step in the rational decision-making process?",
      options: [
        "Identifying the problem or opportunity",
        "Consulting with a spiritual advisor",
        "Gathering relevant information",
        "Evaluating alternatives"
      ],
      correctAnswer: 1,
      explanation: "While personal or spiritual guidance may be valuable to some individuals, consulting with a spiritual advisor is not a formal step in the rational decision-making process, which focuses on objective analysis and evaluation."
    },
    {
      id: 6,
      question: "What is 'bounded rationality' in decision-making?",
      options: [
        "Making decisions within strict time limits",
        "The idea that rationality is limited by available information, cognitive limitations, and time constraints",
        "Using only mathematical models to make decisions",
        "Setting clear boundaries before making any decision"
      ],
      correctAnswer: 1,
      explanation: "Bounded rationality, a concept introduced by Herbert Simon, recognizes that human decision-making is limited by the information we have, our cognitive capabilities, and the finite time available to make decisions."
    },
    {
      id: 7,
      question: "What is the primary purpose of a SWOT analysis in decision-making?",
      options: [
        "To predict the exact outcome of a decision",
        "To identify Strengths, Weaknesses, Opportunities, and Threats relevant to a decision",
        "To assign tasks to team members based on their skills",
        "To calculate the financial costs of different options"
      ],
      correctAnswer: 1,
      explanation: "SWOT analysis is a structured planning method used to identify and evaluate the Strengths, Weaknesses, Opportunities, and Threats involved in a project or business decision, providing a comprehensive view of internal and external factors."
    },
    {
      id: 8,
      question: "Which of the following best describes 'satisficing' in decision-making?",
      options: [
        "Finding the absolute best possible solution regardless of time or resources",
        "Accepting the first available option that meets minimum requirements",
        "Making decisions based solely on emotional satisfaction",
        "Consulting with all stakeholders before finalizing a decision"
      ],
      correctAnswer: 1,
      explanation: "Satisficing, a term coined by Herbert Simon, is a decision-making strategy where individuals accept a satisfactory solution that meets their basic criteria rather than searching for an optimal solution. It acknowledges the practical limitations of time and cognitive resources."
    },
    {
      id: 9,
      question: "What is a 'decision tree' primarily used for?",
      options: [
        "Organizing corporate hierarchy",
        "Mapping out possible decisions and their potential consequences",
        "Categorizing different personality types in a team",
        "Creating project timelines"
      ],
      correctAnswer: 1,
      explanation: "A decision tree is a graphical representation of possible solutions to a decision based on certain conditions. It maps out different possible consequences and event outcomes, allowing decision-makers to compare various courses of action and their potential results."
    },
    {
      id: 10,
      question: "What is 'groupthink' in the context of decision-making?",
      options: [
        "A technique for gathering collective wisdom from large groups",
        "The practice of voting on decisions in teams",
        "A psychological phenomenon where desire for harmony leads to irrational decision-making",
        "A formal method for reaching consensus in meetings"
      ],
      correctAnswer: 2,
      explanation: "Groupthink is a psychological phenomenon that occurs within groups where the desire for harmony or conformity results in irrational or dysfunctional decision-making. People may withhold dissenting views to avoid conflict, leading to decisions that aren't fully vetted."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "Smart Choices: A Practical Guide to Making Better Decisions",
      url: "https://www.amazon.com/Smart-Choices-Practical-Making-Decisions/dp/1633691047",
      description: "Book by Hammond, Keeney, and Raiffa on practical decision-making techniques"
    },
    {
      title: "Decision-Making Tools by MindTools",
      url: "https://www.mindtools.com/pages/main/newMN_TED.htm",
      description: "Collection of free decision-making tools and techniques"
    },
    {
      title: "Decisive: How to Make Better Choices in Life and Work",
      url: "https://heathbrothers.com/books/decisive/",
      description: "Book by Chip and Dan Heath exploring cognitive biases and decision strategies"
    },
    {
      title: "Decision Matrix Calculator",
      url: "https://www.decision-making-solutions.com/decision-matrix.html",
      description: "Free online tool for creating decision matrices"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'fundamentals',
      title: 'Decision-Making Fundamentals',
      description: 'Understanding the decision-making process and its importance',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <p>
            Decision-making is the process of identifying and choosing alternatives based on values, 
            preferences, and beliefs. Every decision-making process produces a final choice that may or 
            may not prompt action. Understanding how decisions are made helps us make better choices 
            in both our personal and professional lives.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">The Importance of Decision-Making Skills</h3>
                </div>
                <p className="text-orange-700 text-sm">Key benefits of improving your decision-making abilities</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Developing strong decision-making skills can significantly improve many aspects of your life. Here's how better decision-making can benefit you:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0m0 0l-5.657-5.657m5.657 5.657l5.657-5.657" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Reduced Stress</h4>
                      <p className="text-orange-700 text-sm mt-1">Avoid regret and anxiety over poor choices</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Time Efficiency</h4>
                      <p className="text-orange-700 text-sm mt-1">Save time by avoiding prolonged indecision</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Opportunity Recognition</h4>
                      <p className="text-orange-700 text-sm mt-1">Identify and capitalize on valuable opportunities</p>
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
                      <p className="text-orange-700 text-sm mt-1">Address challenges more effectively and systematically</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Self-Confidence</h4>
                      <p className="text-orange-700 text-sm mt-1">Gain greater confidence in your judgment and abilities</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Better Outcomes</h4>
                      <p className="text-orange-700 text-sm mt-1">Achieve improved results in both personal and professional life</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Types of Decisions</h3>
                </div>
                <p className="text-orange-700 text-sm">Understanding different categories of decisions you face</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Not all decisions are created equal. Understanding the type of decision you're facing can help you choose the right approach:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Programmed vs. Nonprogrammed</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Programmed Decisions</p>
                      <p className="text-gray-600 text-sm mt-1">Routine, structured, and repetitive decisions following established procedures</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Reordering office supplies when inventory is low</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Nonprogrammed Decisions</p>
                      <p className="text-gray-600 text-sm mt-1">Novel, unstructured decisions requiring creative problem-solving</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Making a major career change or starting a business</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Strategic vs. Operational</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Strategic Decisions</p>
                      <p className="text-gray-600 text-sm mt-1">Long-term choices that affect overall direction and goals</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Choosing a college major or buying a home</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Operational Decisions</p>
                      <p className="text-gray-600 text-sm mt-1">Day-to-day choices with short-term impact</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Planning your daily schedule or grocery shopping</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Individual vs. Group</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Individual Decisions</p>
                      <p className="text-gray-600 text-sm mt-1">Made by one person independently</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Personal financial choices or diet changes</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Group Decisions</p>
                      <p className="text-gray-600 text-sm mt-1">Involve collaboration and collective responsibility</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Family vacation planning or team projects</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Certain vs. Uncertain</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Decisions under Certainty</p>
                      <p className="text-gray-600 text-sm mt-1">Have predictable, known outcomes</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Choosing the lowest priced identical item</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <p className="text-gray-700 font-medium">Decisions under Uncertainty</p>
                      <p className="text-gray-600 text-sm mt-1">Have unknown or unpredictable outcomes</p>
                      <p className="text-orange-700 text-sm mt-2 italic">Example: Investing in a startup or changing careers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Decision-Making Approaches</h3>
                </div>
                <p className="text-orange-700 text-sm">Different strategies for different decision situations</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Various approaches to decision-making work best in different contexts. Understanding these approaches helps you select the most appropriate method for your specific situation:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Rational Decision-Making</h4>
                      <p className="text-orange-700 text-sm mt-1">Systematic approach using logical steps and objective criteria</p>
                      <div className="bg-white p-2 rounded mt-2 border border-orange-100 text-xs text-orange-800">
                        <span className="font-medium">Best for:</span> Well-defined problems with clear criteria and alternatives
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Intuitive Decision-Making</h4>
                      <p className="text-orange-700 text-sm mt-1">Relying on experience, instinct, and unconscious pattern recognition</p>
                      <div className="bg-white p-2 rounded mt-2 border border-orange-100 text-xs text-orange-800">
                        <span className="font-medium">Best for:</span> Time-sensitive situations and experts in their field
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Creative Decision-Making</h4>
                      <p className="text-orange-700 text-sm mt-1">Generating innovative solutions through divergent thinking</p>
                      <div className="bg-white p-2 rounded mt-2 border border-orange-100 text-xs text-orange-800">
                        <span className="font-medium">Best for:</span> Novel problems requiring fresh perspectives
                      </div>
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
                      <h4 className="font-medium text-orange-800">Collaborative Decision-Making</h4>
                      <p className="text-orange-700 text-sm mt-1">Involving multiple stakeholders to reach consensus</p>
                      <div className="bg-white p-2 rounded mt-2 border border-orange-100 text-xs text-orange-800">
                        <span className="font-medium">Best for:</span> Complex decisions affecting many people
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Recognition-Primed Decision Model</h4>
                      <p className="text-orange-700 text-sm mt-1">Experts recognize patterns and apply proven solutions</p>
                      <div className="bg-white p-2 rounded mt-2 border border-orange-100 text-xs text-orange-800">
                        <span className="font-medium">Best for:</span> Experienced decision-makers in familiar contexts
                      </div>
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
                  No single approach is best for all situations. Effective decision-makers adapt their approach 
                  based on the nature of the decision, available information, time constraints, and context.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'process',
      title: 'The Decision-Making Process',
      description: 'A step-by-step approach to making better decisions',
      icon: GitFork,
      content: (
        <div className="space-y-4">
          <p>
            While the specific steps may vary depending on the situation and approach, most effective 
            decision-making processes follow a similar pattern. This module outlines a comprehensive step-by-step 
            framework that you can adapt to various situations.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Step 1: Identify the Decision to Be Made</h3>
          <div className="space-y-2">
            <p>
              Clearly define the decision you need to make:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>What exactly needs to be decided?</li>
              <li>What is the scope of the decision?</li>
              <li>Why is this decision necessary?</li>
              <li>What is the timeline for making the decision?</li>
              <li>Who should be involved in the decision-making process?</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="italic">
                Example: "I need to decide which job offer to accept within the next week."
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Step 2: Gather Relevant Information</h3>
          <div className="space-y-2">
            <p>
              Collect data and information necessary to make an informed decision:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Identify what information you need</li>
              <li>Determine reliable sources of information</li>
              <li>Distinguish between facts and assumptions</li>
              <li>Recognize when you have sufficient information</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="italic">
                Example: Research both companies' cultures, growth opportunities, salary/benefits packages, 
                commute times, work-life balance, and speak with current or former employees.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Step 3: Identify Alternatives</h3>
          <div className="space-y-2">
            <p>
              Generate possible options or courses of action:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Brainstorm multiple alternatives</li>
              <li>Consider innovative or unconventional options</li>
              <li>Include the option of doing nothing or delaying the decision</li>
              <li>Combine elements of different options when appropriate</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="italic">
                Example: Accept Job A, accept Job B, negotiate better terms with either company, decline both and 
                continue searching, or ask for more time to decide.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Step 4: Evaluate the Alternatives</h3>
          <div className="space-y-2">
            <p>
              Assess each option against relevant criteria:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Establish evaluation criteria based on your values and goals</li>
              <li>Weight criteria according to importance</li>
              <li>Consider the potential outcomes and consequences of each alternative</li>
              <li>Assess risks and uncertainties</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="italic">
                Example: Create a decision matrix that rates each job offer on salary, growth potential, 
                work-life balance, company stability, alignment with career goals, etc.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Step 5: Make a Choice</h3>
          <div className="space-y-2">
            <p>
              Select the best alternative based on your evaluation:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose the option that best meets your criteria</li>
              <li>Consider your intuition or gut feeling as a check</li>
              <li>Test your decision by imagining having already made it</li>
              <li>Prepare to explain your reasoning to stakeholders</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="italic">
                Example: After evaluating all factors, decide to accept Job B because it offers better long-term 
                growth and aligns more closely with your career goals.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Step 6: Implement the Decision</h3>
          <div className="space-y-2">
            <p>
              Put your decision into action:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Develop an implementation plan</li>
              <li>Communicate your decision to relevant parties</li>
              <li>Allocate necessary resources</li>
              <li>Take concrete actions to execute the decision</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="italic">
                Example: Accept Job B's offer formally, decline Job A politely, give notice to current employer, 
                and prepare for the transition.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Step 7: Evaluate the Results</h3>
          <div className="space-y-2">
            <p>
              Review the outcomes of your decision:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Monitor the consequences of your decision</li>
              <li>Assess whether the decision achieved the desired outcome</li>
              <li>Identify lessons learned for future decisions</li>
              <li>Make adjustments if necessary</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="italic">
                Example: After three months at the new job, evaluate whether your expectations were met and what 
                you might do differently in future job decisions.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              While this process is presented as linear, in reality, decision-making is often iterative. 
              You may need to cycle back to earlier steps as new information emerges or circumstances change.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'tools',
      title: 'Decision-Making Tools',
      description: 'Practical frameworks and techniques for evaluating options',
      icon: Compass,
      content: (
        <div className="space-y-4">
          <p>
            Various tools and techniques can help you make better decisions by structuring your thinking, 
            evaluating options systematically, and reducing bias. This module introduces several practical 
            decision-making tools you can apply in different situations.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Decision Matrix</h3>
                </div>
                <p className="text-orange-700 text-sm">Weighted scoring model for comparing multiple options</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                A decision matrix helps you evaluate and compare multiple options using weighted criteria. This systematic approach is ideal for complex decisions with multiple factors to consider.
              </p>
              
              <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 mb-5">
                <h4 className="font-medium text-orange-800 mb-2">How to Use a Decision Matrix:</h4>
                <ol className="space-y-2 ml-5 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">1</span>
                    <span>Identify the alternatives you're considering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">2</span>
                    <span>Determine the important criteria for your decision</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">3</span>
                    <span>Assign weights to each criterion based on importance (e.g., 1-5 or percentages)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">4</span>
                    <span>Rate each alternative against each criterion (e.g., 1-5 scale)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">5</span>
                    <span>Multiply the ratings by the weights and sum the scores for each alternative</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">6</span>
                    <span>The alternative with the highest score is potentially your best option</span>
                  </li>
                </ol>
              </div>
              
              <div className="overflow-auto rounded-lg border border-orange-100 shadow-sm">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-50 to-[#FFE8CC]">
                      <th className="border-b border-r border-orange-100 p-2 text-orange-800">Criteria</th>
                      <th className="border-b border-r border-orange-100 p-2 text-orange-800">Weight</th>
                      <th className="border-b border-r border-orange-100 p-2 text-orange-800">Option A Score</th>
                      <th className="border-b border-r border-orange-100 p-2 text-orange-800">Option A Weighted</th>
                      <th className="border-b border-r border-orange-100 p-2 text-orange-800">Option B Score</th>
                      <th className="border-b border-orange-100 p-2 text-orange-800">Option B Weighted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-orange-50">
                      <td className="border-b border-r border-orange-100 p-2 text-gray-700">Cost</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">3</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">4</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700 bg-[#FFE8CC]">12</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">2</td>
                      <td className="border-b border-orange-100 p-2 text-center text-gray-700 bg-[#FFE8CC]">6</td>
                    </tr>
                    <tr className="hover:bg-orange-50">
                      <td className="border-b border-r border-orange-100 p-2 text-gray-700">Quality</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">5</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">3</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700 bg-[#FFE8CC]">15</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">5</td>
                      <td className="border-b border-orange-100 p-2 text-center text-gray-700 bg-[#FFE8CC]">25</td>
                    </tr>
                    <tr className="hover:bg-orange-50">
                      <td className="border-b border-r border-orange-100 p-2 text-gray-700">Time</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">4</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">5</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700 bg-[#FFE8CC]">20</td>
                      <td className="border-b border-r border-orange-100 p-2 text-center text-gray-700">3</td>
                      <td className="border-b border-orange-100 p-2 text-center text-gray-700 bg-[#FFE8CC]">12</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-orange-50 to-[#FFE8CC] font-semibold">
                      <td className="border-r border-orange-100 p-2 text-orange-800" colSpan={3}>Total Score</td>
                      <td className="border-r border-orange-100 p-2 text-center text-orange-800">47</td>
                      <td className="border-r border-orange-100 p-2"></td>
                      <td className="p-2 text-center text-orange-800">43</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center gap-2 mt-4 text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">
                  In this example, Option A scores higher (47 vs 43), suggesting it may be the better choice overall.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Pros and Cons List</h3>
                </div>
                <p className="text-orange-700 text-sm">T-Chart method for evaluating a single option</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                A pros and cons list is a simple but powerful way to evaluate a single option or choice. This method helps clarify your thinking by visually organizing the positive and negative aspects.
              </p>
              
              <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 mb-5">
                <h4 className="font-medium text-orange-800 mb-2">How to Create a Pros and Cons List:</h4>
                <ol className="space-y-2 ml-5 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">1</span>
                    <span>Draw a line down the middle of a page</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">2</span>
                    <span>List all the positives (pros) on one side</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">3</span>
                    <span>List all the negatives (cons) on the other side</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">4</span>
                    <span>Consider weighting particularly important factors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center text-orange-600 font-semibold mr-2 flex-shrink-0 mt-0.5">5</span>
                    <span>Compare the overall weight of pros versus cons</span>
                  </li>
                </ol>
              </div>
              
              <div className="shadow-sm rounded-lg overflow-hidden border border-orange-100">
                <div className="bg-gradient-to-r from-orange-50 to-[#FFE8CC] px-4 py-2 border-b border-orange-100">
                  <h4 className="font-medium text-center text-orange-800">Example: Considering a Job Offer</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-5 border-r border-orange-100">
                    <h4 className="font-medium text-center text-orange-800 border-b border-orange-100 pb-2 mb-3">Pros</h4>
                    <ul className="space-y-2">
                      {[
                        "Increases income",
                        "Better benefits package",
                        "More challenging work",
                        "Room for advancement"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-5 bg-[#FFE8CC] bg-opacity-30">
                    <h4 className="font-medium text-center text-orange-800 border-b border-orange-100 pb-2 mb-3">Cons</h4>
                    <ul className="space-y-2">
                      {[
                        "Longer commute",
                        "Less flexible hours",
                        "Uncertain company culture"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">
                  Pros and cons lists work best for relatively straightforward decisions where you need clarity on the tradeoffs involved.
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">SWOT Analysis</h3>
          <div className="space-y-2">
            <p>
              SWOT stands for Strengths, Weaknesses, Opportunities, and Threats:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Strengths:</strong> Internal positive attributes that give you an advantage</li>
              <li><strong>Weaknesses:</strong> Internal negative attributes that put you at a disadvantage</li>
              <li><strong>Opportunities:</strong> External positive factors that you could leverage</li>
              <li><strong>Threats:</strong> External negative factors that could cause problems</li>
            </ul>
            <p className="mt-2">
              This framework helps you consider both internal and external factors affecting your decision, 
              and is especially useful for strategic decisions.
            </p>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Decision Tree</h3>
          <div className="space-y-2">
            <p>
              A decision tree visually maps out possible choices, their consequences, and subsequent decisions:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Start with your initial decision point (the "root")</li>
              <li>Branch out to show different options</li>
              <li>At the end of each branch, show possible outcomes or further decision points</li>
              <li>Assign probabilities and values to outcomes when possible</li>
              <li>Calculate the expected value of each branch</li>
            </ol>
            <p className="mt-2">
              Decision trees are particularly useful for sequential decisions and understanding the potential 
              paths and outcomes of complex choices.
            </p>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Pareto Analysis (80/20 Rule)</h3>
          <p>
            This technique helps identify the most important factors in a decision:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>List all the factors relevant to your decision</li>
            <li>Score or rank them according to importance</li>
            <li>Identify the 20% of factors that account for 80% of the impact</li>
            <li>Focus your decision-making on these vital few factors</li>
          </ul>
          
          <div className="p-4 bg-green-50 rounded-md mt-6">
            <h4 className="font-medium text-green-800">Success Strategy</h4>
            <p className="text-green-800">
              No single tool fits all decisions. Match the tool to the complexity and type of decision you're 
              making. Often, using multiple tools for the same decision can provide additional insights and 
              confidence in your choice.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'biases',
      title: 'Overcoming Cognitive Biases',
      description: 'Recognizing and avoiding common thinking traps',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <p>
            Cognitive biases are systematic errors in thinking that affect the decisions and judgments we make. 
            These biases are often a result of our brain's attempt to simplify information processing. 
            Understanding and being aware of these biases is the first step to overcoming them and making 
            better decisions.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Common Decision-Making Biases</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Confirmation Bias</h4>
              <p className="text-sm">The tendency to search for, interpret, and recall information that confirms our pre-existing beliefs</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Only reading reviews that support your initial impression of a product</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Actively seek contradictory information and consider alternative viewpoints</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Anchoring Bias</h4>
              <p className="text-sm">Over-relying on the first piece of information encountered (the "anchor")</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Judging the value of a house based on the asking price rather than market value</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Consider multiple reference points and evaluate options independently</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Loss Aversion</h4>
              <p className="text-sm">Preferring to avoid losses over acquiring equivalent gains</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Keeping a failing investment because you don't want to "lose" your initial investment</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Focus on future value and opportunities rather than sunk costs</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Availability Heuristic</h4>
              <p className="text-sm">Overestimating the likelihood of events based on how easily examples come to mind</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Fearing air travel after seeing news coverage of a plane crash</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Look for statistical evidence rather than relying on memorable examples</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Status Quo Bias</h4>
              <p className="text-sm">Preferring the current state of affairs and resisting change</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Sticking with the same cell phone provider despite better options elsewhere</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Regularly review alternatives and evaluate the costs of not changing</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Overconfidence Bias</h4>
              <p className="text-sm">Overestimating our own abilities, knowledge, and the precision of our beliefs</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Being certain about an investment's performance without adequate research</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Consider past experiences where you were wrong and admit uncertainty</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Sunk Cost Fallacy</h4>
              <p className="text-sm">Continuing an endeavor due to previously invested resources that cannot be recovered</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Watching a movie to the end despite not enjoying it, because you've already spent time on it</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Make decisions based on future benefits, not past investments</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Bandwagon Effect</h4>
              <p className="text-sm">Adopting beliefs or behaviors because others have done so</p>
              <p className="text-sm mt-2"><strong>Example:</strong> Buying a product because it's trending, not because you need it</p>
              <p className="text-sm mt-2"><strong>How to overcome:</strong> Identify your own values and make decisions aligned with them</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Strategies to Combat Cognitive Biases</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Seek Diverse Perspectives</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Consult people with different backgrounds and viewpoints</li>
                <li>Encourage devil's advocate thinking</li>
                <li>Consider options you initially dismissed</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Use Pre-mortem Analysis</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Imagine your decision has failed and work backwards to identify what went wrong</li>
                <li>Helps identify potential pitfalls before they occur</li>
                <li>Reduces overconfidence and reveals blind spots</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Consider the Opposite</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Deliberately challenge your initial beliefs</li>
                <li>Generate reasons why your intuitive judgment might be wrong</li>
                <li>Look for disconfirming evidence</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Use Decision Tools Systematically</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Apply tools like decision matrices and trees</li>
                <li>Base decisions on objective criteria rather than feelings alone</li>
                <li>Document your decision-making process</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Take Your Time</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Avoid rushed decisions whenever possible</li>
                <li>Sleep on important decisions</li>
                <li>Create distance between information gathering and decision-making</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              Complete elimination of biases is impossible, as they are intrinsic to human cognition. 
              The goal is not perfection, but awareness and mitigation. By recognizing our cognitive 
              tendencies, we can design decision processes that compensate for our natural biases.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'group',
      title: 'Group Decision-Making',
      description: 'Techniques for effective collective decisions',
      icon: BarChart,
      content: (
        <div className="space-y-4">
          <p>
            Many important decisions are made in groups rather than by individuals. Group decision-making 
            can lead to better outcomes through diverse perspectives and pooled expertise, but it also 
            introduces unique challenges. This module explores how to make effective decisions as a group.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Advantages of Group Decision-Making</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>More diverse perspectives and expertise</li>
            <li>Greater acceptance and commitment to decisions</li>
            <li>Reduced risk of overlooking important factors</li>
            <li>Potential for creative synergy and innovative solutions</li>
            <li>Shared responsibility for outcomes</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Challenges of Group Decision-Making</h3>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">Groupthink</h4>
              <p className="text-sm">The tendency for groups to prioritize consensus over critical evaluation</p>
              <p className="text-sm mt-2"><strong>Signs:</strong> Illusion of invulnerability, collective rationalization, self-censorship</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">Social Loafing</h4>
              <p className="text-sm">Individual members reducing their effort when working in groups</p>
              <p className="text-sm mt-2"><strong>Signs:</strong> Reduced participation, deferring responsibility, lack of accountability</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">Conformity Pressure</h4>
              <p className="text-sm">Members feeling pressure to agree with the majority or authority figures</p>
              <p className="text-sm mt-2"><strong>Signs:</strong> Quick agreement, limited debate, hierarchical influence</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">Process Inefficiency</h4>
              <p className="text-sm">Group decision-making can be time-consuming and poorly structured</p>
              <p className="text-sm mt-2"><strong>Signs:</strong> Lengthy meetings, circular discussions, unclear outcomes</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Effective Group Decision-Making Techniques</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Brainstorming</h4>
              <p className="text-sm">Generating many ideas without evaluation</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Separate idea generation from evaluation</li>
                <li>Encourage wild ideas</li>
                <li>Build on others' ideas</li>
                <li>Aim for quantity of ideas</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Nominal Group Technique</h4>
              <p className="text-sm">Structured method for generating and prioritizing ideas</p>
              <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
                <li>Members write down ideas independently</li>
                <li>Ideas are shared one at a time in round-robin fashion</li>
                <li>Group discussion for clarification (not criticism)</li>
                <li>Anonymous voting or ranking of options</li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Delphi Technique</h4>
              <p className="text-sm">Anonymous, iterative process for expert consensus</p>
              <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
                <li>Experts anonymously provide judgments on an issue</li>
                <li>Responses are summarized</li>
                <li>Experts review the summary and revise their judgments</li>
                <li>Process repeats until sufficient consensus is reached</li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Stepladder Technique</h4>
              <p className="text-sm">Gradually integrating members to reduce conformity pressure</p>
              <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
                <li>Core group of two members discusses the problem</li>
                <li>A third member joins, presenting their ideas before hearing the group's thinking</li>
                <li>The expanded group discusses</li>
                <li>Process continues with each new member</li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Multivoting</h4>
              <p className="text-sm">Efficiently narrowing down a large list of options</p>
              <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
                <li>Generate a list of options</li>
                <li>Eliminate duplicates and clarify items</li>
                <li>Each member gets multiple votes (typically 1/3 of total items)</li>
                <li>Items with most votes advance to next round</li>
                <li>Process repeats until manageable number of options remains</li>
              </ol>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Best Practices for Group Decision-Making</h3>
          <div className="space-y-2">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Establish clear roles:</strong> Designate a facilitator, timekeeper, and note-taker</li>
              <li><strong>Set ground rules:</strong> Ensure respectful communication and equal participation</li>
              <li><strong>Define the decision-making method upfront:</strong> Consensus, majority vote, leader decides with input, etc.</li>
              <li><strong>Assign a devil's advocate:</strong> Someone responsible for challenging assumptions</li>
              <li><strong>Use structured processes:</strong> Apply appropriate techniques based on the situation</li>
              <li><strong>Document decisions:</strong> Record the decision, rationale, and implementation steps</li>
              <li><strong>Follow up:</strong> Evaluate the decision and learn from the process</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Continuous Improvement</h4>
            <p className="text-blue-800">
              Like individual decision-making, group decision-making is a skill that improves with practice and 
              reflection. Regularly debrief on the decision-making process itself: What worked well? What could 
              be improved? How can we make better decisions together in the future?
            </p>
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
          <GitFork className="h-6 w-6 mr-2 text-orange-500" />
          Decision Making
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
              <CardTitle>Introduction to Decision Making</CardTitle>
              <CardDescription>
                Learn how to make better choices in your personal and professional life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Every day, we make countless decisions that shape our lives. Some are small and routine, while 
                others are complex and life-changing. The ability to make good decisions is a critical skill that 
                impacts our success, happiness, and well-being.
              </p>
              <p className="mb-4">
                This course will teach you proven frameworks and techniques to improve your decision-making abilities. 
                You'll learn how to clarify your options, evaluate alternatives systematically, avoid common thinking 
                traps, and implement decisions effectively—both individually and in groups.
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
                    <FullScreenDialogBody>
                      {module.content}
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
              <CardTitle>Test Your Decision-Making Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about effective decision making
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Decision Making"
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
              <CardTitle>Decision-Making Resources</CardTitle>
              <CardDescription>
                Helpful books, tools, and websites to improve your decision-making skills
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