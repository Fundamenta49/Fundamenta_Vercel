import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Users, ShieldQuestion, Handshake, MessagesSquare, Scale } from 'lucide-react';
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

export default function ConflictResolutionCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Conflict Resolution
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "Which conflict resolution style seeks to satisfy everyone's concerns?",
      options: [
        "Competing",
        "Accommodating",
        "Compromising",
        "Collaborating"
      ],
      correctAnswer: 3,
      explanation: "Collaborating aims to find a solution that fully satisfies everyone's concerns, creating a win-win outcome."
    },
    {
      id: 2,
      question: "What is active listening?",
      options: [
        "Waiting for your turn to speak",
        "Fully concentrating on, understanding, and responding to the speaker",
        "Finishing the speaker's sentences to show engagement",
        "Providing immediate solutions to problems"
      ],
      correctAnswer: 1,
      explanation: "Active listening involves fully focusing on the speaker, understanding their message, and responding thoughtfully."
    },
    {
      id: 3,
      question: "Which of the following is NOT an effective way to de-escalate a heated conflict?",
      options: [
        "Using 'I' statements to express feelings",
        "Taking a timeout to cool down",
        "Pointing out all the ways the other person is wrong",
        "Finding common ground to build upon"
      ],
      correctAnswer: 2,
      explanation: "Pointing out all the ways someone is wrong typically escalates conflict rather than resolving it. The other options are effective de-escalation techniques."
    },
    {
      id: 4,
      question: "What is the primary purpose of the 'compromising' conflict style?",
      options: [
        "To find a solution where both parties win completely",
        "To sacrifice your needs to maintain the relationship",
        "To find middle ground where each party gets some of what they want",
        "To assert your position regardless of others' needs"
      ],
      correctAnswer: 2,
      explanation: "Compromising involves finding a middle ground where each party gives up something while gaining something else, creating a partial win for everyone involved."
    },
    {
      id: 5,
      question: "Which statement best describes the 'competing' conflict style?",
      options: [
        "Prioritizing relationships over personal goals",
        "Pursuing your concerns at the expense of others",
        "Finding middle ground through give and take",
        "Avoiding the conflict altogether"
      ],
      correctAnswer: 1,
      explanation: "The competing style (also called forcing) involves pursuing your own concerns at the expense of others, using power to win the conflict."
    },
    {
      id: 6,
      question: "What is a 'trigger phrase' in conflict situations?",
      options: [
        "A phrase that helps resolve conflicts quickly",
        "Words or statements that tend to escalate emotions and defensiveness",
        "A technique for changing the subject",
        "A specialized term in conflict mediation"
      ],
      correctAnswer: 1,
      explanation: "Trigger phrases are statements that typically provoke an emotional reaction, escalate tension, and increase defensiveness, such as 'you always' or 'you never'."
    },
    {
      id: 7,
      question: "Which of these is an example of an effective 'I' statement?",
      options: [
        "I think you're being unreasonable about this.",
        "I feel disrespected when meetings start without me being notified.",
        "I want you to stop interrupting me all the time.",
        "I know you're deliberately trying to avoid this topic."
      ],
      correctAnswer: 1,
      explanation: "An effective 'I' statement focuses on expressing your feelings about a specific behavior without accusation. 'I feel disrespected when meetings start without me being notified' follows the format of 'I feel [emotion] when [specific behavior happens].'"
    },
    {
      id: 8,
      question: "What is the 'avoidance' approach to conflict resolution?",
      options: [
        "Addressing conflict head-on with assertive communication",
        "Delaying or ignoring the conflict altogether",
        "Using a neutral third party to facilitate resolution",
        "Finding ways to compete more effectively"
      ],
      correctAnswer: 1,
      explanation: "The avoidance approach involves physically or psychologically removing yourself from the conflict, or postponing dealing with it indefinitely."
    },
    {
      id: 9,
      question: "What is conflict transformation?",
      options: [
        "Changing the topic to avoid conflict",
        "Finding a quick solution to end the conflict",
        "Viewing conflict as an opportunity for growth and positive change",
        "Transforming negative emotions into positive ones"
      ],
      correctAnswer: 2,
      explanation: "Conflict transformation is an approach that views conflict as a potential catalyst for growth and positive social change, focusing not just on resolving the immediate issue but on addressing underlying relationships and structures."
    },
    {
      id: 10,
      question: "What is the most productive mindset to adopt during conflict resolution?",
      options: [
        "Viewing the other person as an opponent to be defeated",
        "Seeing the conflict as a problem to be solved together",
        "Focusing on who started the conflict",
        "Preparing to compromise on everything"
      ],
      correctAnswer: 1,
      explanation: "Viewing the conflict as a shared problem to be solved collaboratively creates the foundation for productive conflict resolution, as it puts both parties on the same side against the problem rather than against each other."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "Crucial Conversations: Tools for Talking When Stakes Are High",
      url: "https://www.vitalsmarts.com/crucial-conversations-book/",
      description: "Book on handling high-stakes conversations effectively"
    },
    {
      title: "Harvard Negotiation Project",
      url: "https://www.pon.harvard.edu/",
      description: "Research on successful negotiation and conflict resolution"
    },
    {
      title: "Conflict Resolution Network",
      url: "http://www.crnhq.org/",
      description: "Tools and training resources for resolving conflicts"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'basics',
      title: 'Understanding Conflict',
      description: 'Learn about the nature of conflict and common causes',
      icon: ShieldQuestion,
      content: (
        <div className="space-y-4">
          <p>
            Conflict is a natural part of human interaction. Understanding the nature of conflict is the first 
            step to resolving it effectively. This module explores what conflict is, why it occurs, and how 
            it can actually lead to positive outcomes when handled appropriately.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <ShieldQuestion className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">What is Conflict?</h3>
                </div>
                <p className="text-orange-700 text-sm">Understanding the nature and dynamics of interpersonal disputes</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Conflict is a disagreement or struggle between people with opposing needs, ideas, beliefs, values, 
                or goals. It can range from minor disagreements to serious disputes that damage relationships.
              </p>
              <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 mt-4">
                <h4 className="font-medium text-orange-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Insight
                </h4>
                <p className="text-orange-800">
                  Conflict itself isn't necessarily negative—it's how we handle conflict that determines whether the 
                  outcome is destructive or constructive. Productive conflict can lead to better solutions, stronger 
                  relationships, and personal growth.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <Users className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Common Causes of Conflict</h3>
                </div>
                <p className="text-orange-700 text-sm">Understanding the root sources of disagreements and disputes</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-orange-800">Poor Communication</h4>
                      <p className="text-orange-700 text-sm mt-1">Misunderstandings, lack of information, or unclear expectations</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-orange-800">Different Values</h4>
                      <p className="text-orange-700 text-sm mt-1">Clashes in personal beliefs, priorities, or cultural backgrounds</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-orange-800">Scarce Resources</h4>
                      <p className="text-orange-700 text-sm mt-1">Competition for limited time, money, space, or attention</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-orange-800">Incompatible Goals</h4>
                      <p className="text-orange-700 text-sm mt-1">Different objectives that can't all be achieved simultaneously</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-orange-800">Relationship Tensions</h4>
                      <p className="text-orange-700 text-sm mt-1">Past conflicts, distrust, or personality differences</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-orange-800">Role Conflicts</h4>
                      <p className="text-orange-700 text-sm mt-1">Unclear responsibilities or expectations in relationships</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <Scale className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Conflict Resolution Styles</h3>
                </div>
                <p className="text-orange-700 text-sm">Different approaches to handling disagreements and disputes</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Each person tends to have a preferred conflict style, though we often use different styles depending on the situation.
                Understanding these styles can help you choose the most effective approach for each conflict:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gradient-to-br from-white to-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-red-800 text-lg">Competing</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>I win, you lose</strong></p>
                  <p className="text-gray-700 mb-3">Assertive and uncooperative approach that prioritizes your concerns over others</p>
                  <div className="bg-white p-3 rounded-lg border border-red-100">
                    <h5 className="font-medium text-red-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      When to use:
                    </h5>
                    <ul className="mt-2 space-y-1 pl-6 list-disc text-gray-700">
                      <li>Quick action is vital</li>
                      <li>Unpopular decisions need to be made</li>
                      <li>When defending against people who take advantage of non-competitive behavior</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-blue-800 text-lg">Accommodating</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>I lose, you win</strong></p>
                  <p className="text-gray-700 mb-3">Unassertive and cooperative approach that neglects your concerns to satisfy others</p>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <h5 className="font-medium text-blue-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      When to use:
                    </h5>
                    <ul className="mt-2 space-y-1 pl-6 list-disc text-gray-700">
                      <li>The issue is more important to others</li>
                      <li>Preserving harmony is critical</li>
                      <li>When building social credits for future issues</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-200 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg">Avoiding</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>No winners, no losers</strong></p>
                  <p className="text-gray-700 mb-3">Unassertive and uncooperative approach that sidesteps or postpones the conflict</p>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      When to use:
                    </h5>
                    <ul className="mt-2 space-y-1 pl-6 list-disc text-gray-700">
                      <li>The issue is trivial</li>
                      <li>Tensions are high and cooling off is needed</li>
                      <li>When more information is needed before addressing the issue</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-yellow-50 p-5 rounded-lg border border-yellow-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-yellow-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-yellow-800 text-lg">Compromising</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>Partial win, partial lose</strong></p>
                  <p className="text-gray-700 mb-3">Moderately assertive and cooperative approach seeking middle ground</p>
                  <div className="bg-white p-3 rounded-lg border border-yellow-100">
                    <h5 className="font-medium text-yellow-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      When to use:
                    </h5>
                    <ul className="mt-2 space-y-1 pl-6 list-disc text-gray-700">
                      <li>Time constraints exist</li>
                      <li>Temporary solutions are needed</li>
                      <li>When both parties have equal power but different goals</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-gradient-to-br from-white to-green-50 p-5 rounded-lg border border-green-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-green-800 text-lg">Collaborating</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>I win, you win</strong></p>
                  <p className="text-gray-700 mb-3">Assertive and cooperative approach working to fully satisfy all concerns</p>
                  <div className="bg-white p-3 rounded-lg border border-green-100">
                    <h5 className="font-medium text-green-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      When to use:
                    </h5>
                    <ul className="mt-2 space-y-1 pl-6 list-disc text-gray-700">
                      <li>Long-term relationships matter</li>
                      <li>Creative solutions are possible</li>
                      <li>When both sets of concerns are too important to be compromised</li>
                      <li>When you want to gain commitment by incorporating others' concerns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'communication',
      title: 'Communication Skills',
      description: 'Master the art of effective communication in conflicts',
      icon: MessagesSquare,
      content: (
        <div className="space-y-4">
          <p>
            Communication is at the heart of conflict resolution. How we express ourselves and listen to others 
            can either escalate or de-escalate conflicts. This module covers essential communication skills for 
            navigating difficult conversations successfully.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12a8 8 0 10-16 0m16 0c0 1.848-.204 3.653-.586 5.4-.193.88-.528 1.688-1.043 2.448M21 6l-3 3m0 0l-3-3m3 3V2" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-blue-800">Active Listening</h3>
                </div>
                <p className="text-blue-700 text-sm">Fully focusing on what others are saying, not just waiting to speak</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Active listening means fully concentrating on what the other person is saying rather than just passively 
                hearing. This powerful skill can transform how conflicts are resolved.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Full Attention</h4>
                      <p className="text-blue-700 text-sm mt-1">Focus completely without planning your response</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Body Language</h4>
                      <p className="text-blue-700 text-sm mt-1">Show you're listening through eye contact and nodding</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Paraphrase</h4>
                      <p className="text-blue-700 text-sm mt-1">Restate what you heard to confirm understanding</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Clarify</h4>
                      <p className="text-blue-700 text-sm mt-1">Ask questions to gather more information and context</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Empathize</h4>
                      <p className="text-blue-700 text-sm mt-1">Acknowledge emotions and validate feelings</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Be Patient</h4>
                      <p className="text-blue-700 text-sm mt-1">Avoid interrupting or jumping to conclusions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-green-800">Using "I" Statements</h3>
                </div>
                <p className="text-green-700 text-sm">Express feelings without blame to reduce defensiveness</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                "I" statements express feelings and concerns without blaming or criticizing. They help the other person hear your perspective without becoming defensive.
              </p>
              
              <div className="bg-[#FFE8CC] p-5 rounded-lg border border-orange-200 mb-5">
                <h4 className="font-medium text-orange-800 flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  "I" Statement Formula
                </h4>
                <p className="text-orange-800 text-lg font-medium italic">
                  "I feel <span className="underline">emotion</span> when <span className="underline">specific situation</span> because <span className="underline">reason</span>."
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                  <h5 className="flex items-center text-red-800 font-medium mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Instead of... (You-focused)
                  </h5>
                  <div className="bg-white p-4 rounded-lg border border-red-100">
                    <p className="text-red-600 font-medium">"You never help with the housework. You're so lazy."</p>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">This approach blames, accuses, and invites defensiveness.</p>
                </div>
                
                <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                  <h5 className="flex items-center text-green-800 font-medium mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Try... (I-focused)
                  </h5>
                  <div className="bg-white p-4 rounded-lg border border-green-100">
                    <p className="text-green-600 font-medium">"I feel overwhelmed when I have to handle all the housework because it leaves me with little time for myself."</p>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">This approach explains your feelings without attacking the other person.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-purple-800">Non-Verbal Communication</h3>
                </div>
                <p className="text-purple-700 text-sm">Your body language speaks louder than words</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Body language often speaks louder than words. In conflict situations, your non-verbal cues can either support resolution or escalate tensions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Facial Expressions</h4>
                      <p className="text-purple-700 text-sm mt-1">Maintain a neutral or open expression</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Body Posture</h4>
                      <p className="text-purple-700 text-sm mt-1">Keep arms uncrossed and face the person</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Tone of Voice</h4>
                      <p className="text-purple-700 text-sm mt-1">Speak calmly with measured speech</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Eye Contact</h4>
                      <p className="text-purple-700 text-sm mt-1">Stay engaged but not intimidating</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">Personal Space</h4>
                      <p className="text-purple-700 text-sm mt-1">Maintain respectful distance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">De-escalation Techniques</h3>
                </div>
                <p className="text-orange-700 text-sm">Methods to calm tense situations and reduce conflict intensity</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                When emotions run high, these techniques can help bring down the temperature and create space for productive conversation.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Speak Calmly</h4>
                      <p className="text-orange-700 text-sm mt-1">Use a slow, steady voice even if the other person is escalated</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 01.001-7.072m9.9 2.829a9 9 0 01-12.728 0" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Lower Volume</h4>
                      <p className="text-orange-700 text-sm mt-1">Speak more quietly rather than raising your voice</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Take Breaths</h4>
                      <p className="text-orange-700 text-sm mt-1">Use deep breathing to manage your own emotions</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Take a Break</h4>
                      <p className="text-orange-700 text-sm mt-1">Suggest a short pause if emotions are running too high</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Validate Feelings</h4>
                      <p className="text-orange-700 text-sm mt-1">Use phrases like "I understand why you might feel that way"</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Find Agreement</h4>
                      <p className="text-orange-700 text-sm mt-1">Focus on areas of common ground before addressing disagreements</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-6">
                <h4 className="font-medium text-yellow-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Note
                </h4>
                <p className="text-yellow-800">
                  Research shows that how something is said often matters more than what is said. Tone, facial expressions, 
                  and body language account for over 90% of emotional communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'resolution',
      title: 'Resolution Strategies',
      description: 'Learn practical approaches to resolving different types of conflicts',
      icon: Handshake,
      content: (
        <div className="space-y-4">
          <p>
            Once you understand the nature of conflict and have developed strong communication skills, you can 
            apply specific strategies to resolve conflicts. This module presents practical approaches that can 
            be adapted to different situations and relationships.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">The Resolution Process</h3>
                </div>
                <p className="text-orange-700 text-sm">A step-by-step framework for effectively resolving conflicts</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Following a structured process can help make conflict resolution more manageable and effective. 
                Here's a proven sequence of steps to work through conflicts systematically:
              </p>
              
              <div className="space-y-4 mt-5">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white rounded-full h-8 w-8 flex items-center justify-center mr-4 border border-orange-200">
                      <span className="text-orange-600 font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Create a Suitable Environment</h4>
                      <p className="text-orange-700 mt-1">Choose a neutral, private space with enough time to talk without interruption</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white rounded-full h-8 w-8 flex items-center justify-center mr-4 border border-orange-200">
                      <span className="text-orange-600 font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Clarify Positions and Interests</h4>
                      <p className="text-orange-700 mt-1">Distinguish between what people say they want (positions) and why they want it (interests)</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white rounded-full h-8 w-8 flex items-center justify-center mr-4 border border-orange-200">
                      <span className="text-orange-600 font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Focus on Interests, Not Positions</h4>
                      <p className="text-orange-700 mt-1">Look beneath surface demands to find underlying needs that might be satisfied in multiple ways</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white rounded-full h-8 w-8 flex items-center justify-center mr-4 border border-orange-200">
                      <span className="text-orange-600 font-semibold">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Generate Multiple Solutions</h4>
                      <p className="text-orange-700 mt-1">Brainstorm options without judgment before evaluating them</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white rounded-full h-8 w-8 flex items-center justify-center mr-4 border border-orange-200">
                      <span className="text-orange-600 font-semibold">5</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Evaluate and Select Solutions</h4>
                      <p className="text-orange-700 mt-1">Use objective criteria to assess options and choose the best approach</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white rounded-full h-8 w-8 flex items-center justify-center mr-4 border border-orange-200">
                      <span className="text-orange-600 font-semibold">6</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Create an Action Plan</h4>
                      <p className="text-orange-700 mt-1">Establish who will do what, by when, and how progress will be measured</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white rounded-full h-8 w-8 flex items-center justify-center mr-4 border border-orange-200">
                      <span className="text-orange-600 font-semibold">7</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Follow Up</h4>
                      <p className="text-orange-700 mt-1">Check in on the implementation and adjust as needed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Negotiation Principles</h3>
                </div>
                <p className="text-orange-700 text-sm">Core concepts for effective negotiation from Harvard's method</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                These principles from the Harvard Negotiation Project provide a foundation for principled negotiation 
                that can help reach mutually beneficial agreements:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Separate People from the Problem</h4>
                      <p className="text-orange-700 text-sm mt-1">Address issues without attacking individuals; be soft on people but hard on problems</p>
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
                      <h4 className="font-medium text-orange-800">Focus on Interests</h4>
                      <p className="text-orange-700 text-sm mt-1">Look for the needs, desires, concerns, and fears behind stated positions</p>
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
                      <h4 className="font-medium text-orange-800">Invent Options for Mutual Gain</h4>
                      <p className="text-orange-700 text-sm mt-1">Expand possibilities before narrowing choices; look for win-win solutions</p>
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
                      <h4 className="font-medium text-orange-800">Use Objective Criteria</h4>
                      <p className="text-orange-700 text-sm mt-1">Base decisions on fair standards, expert opinions, or principles rather than pressure</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 md:col-span-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Know Your BATNA</h4>
                      <p className="text-orange-700 text-sm mt-1">Understand your Best Alternative To a Negotiated Agreement — the course of action you'll take if negotiation fails. A strong BATNA increases your negotiating power.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Mediation Basics</h3>
                </div>
                <p className="text-orange-700 text-sm">When to involve a neutral third party to facilitate resolution</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                When direct negotiation isn't working, a neutral third party mediator can help move the conflict toward resolution. 
                Here's how mediation can help:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Safe Space</h4>
                      <p className="text-orange-700 text-sm mt-1">Creates a neutral environment for open discussion</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Equal Voice</h4>
                      <p className="text-orange-700 text-sm mt-1">Ensures both parties are heard fairly</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Common Ground</h4>
                      <p className="text-orange-700 text-sm mt-1">Helps identify shared interests and values</p>
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
                      <h4 className="font-medium text-orange-800">Idea Generation</h4>
                      <p className="text-orange-700 text-sm mt-1">Facilitates creative brainstorming of solutions</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Forward Focus</h4>
                      <p className="text-orange-700 text-sm mt-1">Maintains focus on resolution rather than blame</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-5 rounded-lg border border-green-100 mt-6">
                <h4 className="font-medium text-green-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Success Strategy
                </h4>
                <p className="text-green-800">
                  The most successful conflict resolution occurs when both parties shift from seeing each other as 
                  opponents to viewing themselves as partners in solving a shared problem.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'difficult',
      title: 'Handling Difficult Situations',
      description: 'Strategies for particularly challenging conflicts',
      icon: Scale,
      content: (
        <div className="space-y-4">
          <p>
            Some conflicts are particularly challenging due to power imbalances, high emotions, cultural differences, 
            or the personalities involved. This module provides specialized strategies for navigating these more 
            difficult situations.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Dealing with Strong Emotions</h3>
                </div>
                <p className="text-orange-700 text-sm">Strategies for when feelings run high in conflicts</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Strong emotions are natural in conflicts but can derail resolution efforts if not managed effectively.
                Here are techniques to handle emotional intensity:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Recognize Emotions</h4>
                      <p className="text-orange-700 text-sm mt-1">Acknowledge feelings without being controlled by them</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Controlled Expression</h4>
                      <p className="text-orange-700 text-sm mt-1">Allow emotional expression in appropriate ways</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Take Breaks</h4>
                      <p className="text-orange-700 text-sm mt-1">Pause when emotions become overwhelming</p>
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
                      <h4 className="font-medium text-orange-800">Grounding Techniques</h4>
                      <p className="text-orange-700 text-sm mt-1">Use deep breathing and focus on physical sensations</p>
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
                      <h4 className="font-medium text-orange-800">Name the Emotion</h4>
                      <p className="text-orange-700 text-sm mt-1">"I notice I'm feeling frustrated right now"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Addressing Power Imbalances</h3>
                </div>
                <p className="text-orange-700 text-sm">Managing conflicts with unequal power dynamics</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Power differences (boss/employee, parent/child, etc.) can complicate conflict resolution.
                These strategies help create more balanced interactions:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Use a Neutral Third Party</h4>
                      <p className="text-orange-700 text-sm mt-1">Consider bringing in a mediator who has no stake in the outcome</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Establish Ground Rules</h4>
                      <p className="text-orange-700 text-sm mt-1">Set clear guidelines for fair participation by all parties</p>
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
                      <h4 className="font-medium text-orange-800">Focus on Objective Standards</h4>
                      <p className="text-orange-700 text-sm mt-1">Use fair principles and mutual interests as decision criteria</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Create a Safe Environment</h4>
                      <p className="text-orange-700 text-sm mt-1">Ensure all parties feel secure in expressing themselves honestly</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FFE8CC] p-4 rounded-lg border border-orange-100 sm:col-span-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800">Acknowledge the Power Difference</h4>
                      <p className="text-orange-700 text-sm mt-1">When appropriate, openly recognize the power dynamic to demonstrate awareness and build trust</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Cross-Cultural Conflict</h3>
          <div className="space-y-4 mt-4">
            <p>
              Cultural differences can lead to misunderstandings and conflicts:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be aware of different communication styles (direct vs. indirect)</li>
              <li>Recognize varying attitudes toward hierarchy and authority</li>
              <li>Understand different approaches to time and deadlines</li>
              <li>Consider collectivist vs. individualist cultural values</li>
              <li>Ask questions to understand cultural context rather than making assumptions</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Dealing with Difficult Personalities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Aggressive Person</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Stay calm and don't match their intensity</li>
                <li>Set clear boundaries on acceptable behavior</li>
                <li>Use timeouts if necessary</li>
                <li>Focus on the issue, not the attacks</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Passive-Aggressive Person</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Address behaviors directly but non-accusatorily</li>
                <li>Create safety for honest expression</li>
                <li>Focus on specific actions, not character</li>
                <li>Be patient but persistent</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Stonewaller</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Take breaks when communication shuts down</li>
                <li>Try different formats (writing vs. talking)</li>
                <li>Use gentle, open-ended questions</li>
                <li>Express the importance of their input</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Victim</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Validate feelings without reinforcing helplessness</li>
                <li>Focus on what can be controlled</li>
                <li>Encourage solution-oriented thinking</li>
                <li>Break problems into manageable pieces</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">When to Step Back</h3>
          <p>
            Sometimes the wisest approach is to recognize when a conflict can't be resolved immediately:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>When safety is at risk (physical or psychological)</li>
            <li>When one party is unwilling to engage in good faith</li>
            <li>When the timing is wrong (e.g., during crisis or extreme stress)</li>
            <li>When professional help is needed (counselor, mediator, lawyer)</li>
          </ul>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              Not all conflicts need to be resolved immediately. Sometimes setting the issue aside temporarily 
              or agreeing to disagree respectfully is the best approach. Choose your battles wisely.
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
          <Users className="h-6 w-6 mr-2 text-orange-500" />
          Conflict Resolution
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
              <CardTitle>Introduction to Conflict Resolution</CardTitle>
              <CardDescription>
                Learn skills to navigate disagreements and build stronger relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Conflict is a natural part of human interaction. Learning to handle conflicts effectively can 
                transform potential relationship damage into opportunities for growth, understanding, and 
                stronger connections.
              </p>
              <p className="mb-4">
                This course teaches practical conflict resolution skills that you can apply in personal relationships, 
                workplace settings, and other situations. You'll learn how to communicate effectively during 
                disagreements, understand different conflict styles, and develop strategies for finding solutions 
                that work for everyone involved.
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
              <CardTitle>Test Your Conflict Resolution Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about resolving conflicts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Conflict Resolution"
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
              <CardTitle>Conflict Resolution Resources</CardTitle>
              <CardDescription>
                Helpful links and tools to improve your conflict resolution skills
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