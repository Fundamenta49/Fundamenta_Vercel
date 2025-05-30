import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Clock, CalendarClock, ClipboardList, LineChart, Hourglass, CheckCircle, Lightbulb, Target, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import QuizComponent from '@/components/quiz-component';
import { cn } from "@/lib/utils";
import { StandardBadge } from "@/components/ui-standard";
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

export default function TimeManagementCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Time Management
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is the Eisenhower Matrix used for?",
      options: [
        "Financial planning",
        "Prioritizing tasks based on urgency and importance",
        "Setting up calendar events",
        "Managing team workflows"
      ],
      correctAnswer: 1,
      explanation: "The Eisenhower Matrix helps prioritize tasks by categorizing them along two dimensions: urgent/not urgent and important/not important."
    },
    {
      id: 2,
      question: "Which of the following is an example of the Pareto Principle (80/20 rule) in time management?",
      options: [
        "20% of your tasks produce 80% of your results",
        "You should work for 80 minutes, then rest for 20 minutes",
        "80% of people are naturally good at time management",
        "You should spend 20% of your day planning and 80% executing"
      ],
      correctAnswer: 0,
      explanation: "The Pareto Principle suggests that roughly 80% of effects come from 20% of causes. In time management, this means 20% of your tasks typically produce 80% of your results."
    },
    {
      id: 3,
      question: "What is 'time blocking'?",
      options: [
        "Scheduling specific time periods for specific tasks or activities",
        "Completely eliminating distractions during work hours",
        "Taking regular breaks between tasks",
        "Delegating tasks to save time"
      ],
      correctAnswer: 0,
      explanation: "Time blocking is a productivity method where you divide your day into blocks of time, each dedicated to accomplishing a specific task or group of tasks."
    },
    {
      id: 4,
      question: "What is the Pomodoro Technique?",
      options: [
        "Working in short, focused sprints with breaks in between",
        "Completing the hardest tasks at the beginning of the day",
        "Organizing tasks by color coding",
        "Delegating tasks to team members based on their strengths"
      ],
      correctAnswer: 0,
      explanation: "The Pomodoro Technique involves working in focused intervals (typically 25 minutes) followed by short breaks (5 minutes), with longer breaks after completing several work intervals."
    },
    {
      id: 5,
      question: "Which strategy helps combat procrastination?",
      options: [
        "Multitasking to complete more in less time",
        "Setting unrealistic deadlines to push yourself",
        "Breaking large tasks into smaller, manageable steps",
        "Waiting for the perfect moment to begin"
      ],
      correctAnswer: 2,
      explanation: "Breaking large, overwhelming tasks into smaller steps makes them feel more manageable and reduces the psychological resistance that leads to procrastination."
    },
    {
      id: 6,
      question: "What does the acronym 'SMART' refer to in goal setting?",
      options: [
        "Simple, Meaningful, Actionable, Realistic, Timely",
        "Specific, Measurable, Achievable, Relevant, Time-bound",
        "Strategic, Motivational, Accurate, Resourceful, Tactical",
        "Scheduled, Monitored, Assigned, Reviewed, Tracked"
      ],
      correctAnswer: 1,
      explanation: "SMART goals are Specific (clearly defined), Measurable (quantifiable), Achievable (realistic), Relevant (aligned with broader objectives), and Time-bound (with deadlines)."
    },
    {
      id: 7,
      question: "Which of these is NOT an effective strategy for managing digital distractions?",
      options: [
        "Using website blockers during focused work time",
        "Having multiple tabs and applications open for quick task switching",
        "Setting specific times to check email and social media",
        "Putting your phone on 'Do Not Disturb' mode"
      ],
      correctAnswer: 1,
      explanation: "Having multiple tabs and applications open encourages multitasking and increases the likelihood of distraction. The other options help minimize digital interruptions."
    },
    {
      id: 8,
      question: "What is 'time batching'?",
      options: [
        "Scheduling all meetings on one day of the week",
        "Grouping similar tasks together to complete them more efficiently",
        "Setting time limits for how long you'll work on any given task",
        "Adding buffer time between tasks to prevent overrun"
      ],
      correctAnswer: 1,
      explanation: "Time batching involves grouping similar tasks together (like responding to all emails, making all phone calls) to reduce the mental switching costs associated with changing between different types of work."
    },
    {
      id: 9,
      question: "What is the '2-minute rule' in time management?",
      options: [
        "Take a 2-minute break after completing each task",
        "Spend 2 minutes planning before starting any task",
        "If a task takes less than 2 minutes, do it immediately",
        "Set a 2-minute timer when feeling stuck on a task"
      ],
      correctAnswer: 2,
      explanation: "The 2-minute rule, popularized by David Allen in 'Getting Things Done,' states that if a task will take less than 2 minutes to complete, you should do it immediately rather than scheduling it for later."
    },
    {
      id: 10,
      question: "Which of the following best describes 'deep work'?",
      options: [
        "Working late into the night when distractions are minimal",
        "Collaborative brainstorming in intensive team meetings",
        "Professional activity performed in a state of distraction-free concentration",
        "Completing many simple tasks in rapid succession"
      ],
      correctAnswer: 2,
      explanation: "Deep work, a term coined by Cal Newport, refers to professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit, creating new value and improving your skills."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "Pomodoro Technique Official Website",
      url: "https://francescocirillo.com/pages/pomodoro-technique",
      description: "Learn about the popular time management method"
    },
    {
      title: "Deep Work: Rules for Focused Success",
      url: "https://www.calnewport.com/books/deep-work/",
      description: "Book by Cal Newport on achieving focused productivity"
    },
    {
      title: "Todoist",
      url: "https://todoist.com/",
      description: "Popular task management app with prioritization features"
    },
    {
      title: "Time Management for Students",
      url: "https://www.goconqr.com/en/examtime/blog/time-management-for-students/",
      description: "Practical time management tips for academic success"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'foundations',
      title: 'Time Management Fundamentals',
      description: 'Learn the core principles of effective time management',
      icon: Clock,
      content: (
        <div className="space-y-4">
          <p>
            Time is our most limited resource. Effective time management isn't about squeezing more tasks 
            into your day—it's about getting the right things done, making the most of your time, and maintaining 
            a healthy work-life balance.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <Hourglass className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">Why Time Management Matters</h3>
                  <StandardBadge size="sm" sectionTheme="learning" className="ml-2" blurEffect={true}>Benefits</StandardBadge>
                </div>
                <p className="text-orange-700 text-sm">The far-reaching impact of managing your time effectively</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Effective time management is a cornerstone skill that influences every aspect of your life. Good time management allows you to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800">Work Efficiency</h4>
                      <p className="text-orange-700 text-sm mt-1">Accomplish more with less effort by focusing on high-priority tasks</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800">Mental Wellbeing</h4>
                      <p className="text-orange-700 text-sm mt-1">Reduce stress and avoid burnout by managing workload effectively</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800">Better Decisions</h4>
                      <p className="text-orange-700 text-sm mt-1">Improve decision-making abilities when not pressured by time constraints</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800">Life Balance</h4>
                      <p className="text-orange-700 text-sm mt-1">Create more time for things you enjoy by working efficiently</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800">Reliability</h4>
                      <p className="text-orange-700 text-sm mt-1">Follow through on commitments consistently and build trust</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800">Strategic Focus</h4>
                      <p className="text-orange-700 text-sm mt-1">Concentrate on high-value activities that drive meaningful results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-100">
              <Clock className="h-8 w-8 text-red-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-red-800">Common Time Management Challenges</h3>
                  <StandardBadge size="sm" sectionTheme="emergency" className="ml-2" blurEffect={true}>Solutions</StandardBadge>
                </div>
                <p className="text-red-700 text-sm">Recognize and overcome these common obstacles to effective time management</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                        <polyline points="17 2 12 7 7 2"></polyline>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-red-800 text-lg">Procrastination</h4>
                  </div>
                  <p className="text-gray-700 mb-3">Delaying important tasks despite knowing the negative consequences</p>
                  <div className="bg-white p-3 rounded-lg border border-red-100">
                    <h5 className="font-medium text-red-700 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" /> Solution:
                    </h5>
                    <ul className="mt-2 space-y-2 pl-6 list-disc text-gray-700">
                      <li>Break large tasks into smaller, more manageable steps</li>
                      <li>Use the "5-minute rule" - commit to just 5 minutes of work</li>
                      <li>Remove triggers that lead to procrastination</li>
                      <li>Reward yourself for completing difficult tasks</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-red-800 text-lg">Distractions</h4>
                  </div>
                  <p className="text-gray-700 mb-3">External (notifications) and internal (wandering thoughts) interruptions</p>
                  <div className="bg-white p-3 rounded-lg border border-red-100">
                    <h5 className="font-medium text-red-700 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" /> Solution:
                    </h5>
                    <ul className="mt-2 space-y-2 pl-6 list-disc text-gray-700">
                      <li>Create a distraction-free physical environment</li>
                      <li>Use website blockers and app timers</li>
                      <li>Practice focused work sessions (like Pomodoro)</li>
                      <li>Schedule specific times to check emails and messages</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-red-800 text-lg">Poor Prioritization</h4>
                  </div>
                  <p className="text-gray-700 mb-3">Working on low-value activities while neglecting important tasks</p>
                  <div className="bg-white p-3 rounded-lg border border-red-100">
                    <h5 className="font-medium text-red-700 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" /> Solution:
                    </h5>
                    <ul className="mt-2 space-y-2 pl-6 list-disc text-gray-700">
                      <li>Use prioritization frameworks (Eisenhower Matrix)</li>
                      <li>Identify your Most Important Tasks (MITs) daily</li>
                      <li>Consider both urgency and importance</li>
                      <li>Align daily tasks with longer-term goals</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-red-800 text-lg">Overscheduling</h4>
                  </div>
                  <p className="text-gray-700 mb-3">Booking too many commitments without buffer time between activities</p>
                  <div className="bg-white p-3 rounded-lg border border-red-100">
                    <h5 className="font-medium text-red-700 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" /> Solution:
                    </h5>
                    <ul className="mt-2 space-y-2 pl-6 list-disc text-gray-700">
                      <li>Build in transition time between activities</li>
                      <li>Practice saying "no" to low-priority requests</li>
                      <li>Add buffer time for unexpected issues</li>
                      <li>Use time blocking but keep some flexibility</li>
                    </ul>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-white to-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-red-800 text-lg">Perfectionism</h4>
                  </div>
                  <p className="text-gray-700 mb-3">Spending too much time perfecting tasks that don't require such high quality</p>
                  <div className="bg-white p-3 rounded-lg border border-red-100">
                    <h5 className="font-medium text-red-700 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" /> Solution:
                    </h5>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <ul className="space-y-2 pl-6 list-disc text-gray-700">
                        <li>Determine appropriate quality levels for different types of tasks</li>
                        <li>Establish clear completion criteria before starting</li>
                        <li>Set time limits for tasks prone to perfectionism</li>
                      </ul>
                      <ul className="space-y-2 pl-6 list-disc text-gray-700">
                        <li>Remember the 80/20 rule - 80% of value comes from 20% of effort</li>
                        <li>Practice the "good enough" principle for appropriate tasks</li>
                        <li>Focus on progress rather than perfection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-100">
              <Lightbulb className="h-8 w-8 text-emerald-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-emerald-800">Time Management Mindset</h3>
                  <StandardBadge size="sm" sectionTheme="wellness" className="ml-2" blurEffect={true}>Growth</StandardBadge>
                </div>
                <p className="text-emerald-700 text-sm">Developing mental habits that transform your productivity</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Effective time management begins with adopting the right mindset. These mental shifts can fundamentally change how you approach your daily activities:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100 overflow-hidden shadow-sm">
                  <div className="bg-emerald-100/50 px-5 py-3 border-b border-emerald-100">
                    <h4 className="font-medium text-emerald-800">Value Your Time</h4>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-gray-700 text-sm flex-1">
                      Recognize time as your most precious and finite resource. Unlike money, time can never be earned back once spent.
                    </p>
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-emerald-600 text-sm italic">
                        "Time is the coin of your life. Only you can determine how it will be spent." — Carl Sandburg
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100 overflow-hidden shadow-sm">
                  <div className="bg-emerald-100/50 px-5 py-3 border-b border-emerald-100">
                    <h4 className="font-medium text-emerald-800">Be Intentional</h4>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-gray-700 text-sm flex-1">
                      Make conscious choices about how you spend your time rather than letting habits, other people, or notifications dictate your day.
                    </p>
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-emerald-600 text-sm italic">
                        "How we spend our days is, of course, how we spend our lives." — Annie Dillard
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100 overflow-hidden shadow-sm">
                  <div className="bg-emerald-100/50 px-5 py-3 border-b border-emerald-100">
                    <h4 className="font-medium text-emerald-800">Focus on Outcomes</h4>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-gray-700 text-sm flex-1">
                      Measure productivity by results achieved, not by hours worked. A focused hour often accomplishes more than a distracted day.
                    </p>
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-emerald-600 text-sm italic">
                        "It's not about having time, it's about making time." — Unknown
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100 overflow-hidden shadow-sm">
                  <div className="bg-emerald-100/50 px-5 py-3 border-b border-emerald-100">
                    <h4 className="font-medium text-emerald-800">Embrace Imperfection</h4>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-gray-700 text-sm flex-1">
                      Accept that "good enough" is sometimes appropriate. Not every task deserves your maximum effort—save that for what truly matters.
                    </p>
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-emerald-600 text-sm italic">
                        "Perfect is the enemy of good." — Voltaire
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100 overflow-hidden shadow-sm">
                  <div className="bg-emerald-100/50 px-5 py-3 border-b border-emerald-100">
                    <h4 className="font-medium text-emerald-800">Practice Patience</h4>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-gray-700 text-sm flex-1">
                      Time management is a skill that improves with practice. Be patient with yourself as you develop better habits and systems.
                    </p>
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-emerald-600 text-sm italic">
                        "Patience and perseverance have a magical effect before which difficulties disappear and obstacles vanish." — John Quincy Adams
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-5 border border-emerald-200 shadow-inner">
                <h4 className="font-semibold text-emerald-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Key Insight
                </h4>
                <p className="text-emerald-900 mt-2">
                  The ultimate goal of time management isn't to become a productivity machine—it's to create a balanced life where you have time for what truly matters to you while still meeting your responsibilities. Time management is about freedom, not restriction.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prioritization',
      title: 'Prioritization Techniques',
      description: 'Learn how to identify and focus on high-impact tasks',
      icon: ClipboardList,
      content: (
        <div className="space-y-4">
          <p>
            Prioritization is arguably the most important component of time management. It's about ensuring 
            that you're focusing your limited time and energy on the tasks that matter most. This module 
            explores frameworks and techniques to help you prioritize effectively.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Eisenhower Matrix</h3>
          <p>
            This powerful prioritization framework categorizes tasks along two dimensions: importance and urgency.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4 border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-green-100 p-4">
              <h4 className="font-medium">Important & Urgent</h4>
              <p className="text-sm">DO FIRST</p>
              <p className="text-sm mt-2">Crisis tasks, pressing deadlines, emergency situations</p>
            </div>
            
            <div className="bg-blue-100 p-4">
              <h4 className="font-medium">Important & Not Urgent</h4>
              <p className="text-sm">SCHEDULE</p>
              <p className="text-sm mt-2">Planning, relationship building, personal development</p>
            </div>
            
            <div className="bg-yellow-100 p-4">
              <h4 className="font-medium">Not Important & Urgent</h4>
              <p className="text-sm">DELEGATE</p>
              <p className="text-sm mt-2">Some meetings, some emails, some phone calls</p>
            </div>
            
            <div className="bg-red-100 p-4">
              <h4 className="font-medium">Not Important & Not Urgent</h4>
              <p className="text-sm">ELIMINATE</p>
              <p className="text-sm mt-2">Time wasters, trivial tasks, excessive social media</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The Pareto Principle (80/20 Rule)</h3>
          <p>
            This principle suggests that roughly 80% of results come from 20% of efforts. In time management, this means:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Identify the 20% of your tasks that produce 80% of your desired outcomes</li>
            <li>Focus your energy on these high-leverage activities</li>
            <li>Minimize time spent on low-value activities that contribute little to your goals</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">ABC Method</h3>
          <p>
            Categorize your tasks into three priority levels:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">A Tasks</h4>
              <p className="text-sm">High-value activities with significant consequences if not completed</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h4 className="font-medium">B Tasks</h4>
              <p className="text-sm">Medium-value activities with moderate consequences</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">C Tasks</h4>
              <p className="text-sm">Low-value activities with minimal or no consequences</p>
            </div>
          </div>
          <p className="mt-4">
            Always complete A tasks before moving to B tasks, and B tasks before C tasks.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">ABCDE Method</h3>
          <p>
            An extension of the ABC method with additional nuance:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>A:</strong> Must do — Serious consequences if not completed</li>
            <li><strong>B:</strong> Should do — Mild consequences if not completed</li>
            <li><strong>C:</strong> Nice to do — No consequences if not completed</li>
            <li><strong>D:</strong> Delegate — Tasks someone else can do</li>
            <li><strong>E:</strong> Eliminate — Tasks that aren't necessary</li>
          </ul>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              A common mistake is confusing urgency with importance. Just because something feels urgent 
              doesn't mean it's important. Learn to distinguish between the two to avoid spending your 
              time on urgent but unimportant tasks.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'techniques',
      title: 'Productivity Techniques',
      description: 'Practical methods to maximize efficiency and focus',
      icon: Hourglass,
      content: (
        <div className="space-y-6">
          <p className="text-lg">
            Once you've identified your priorities, you need practical techniques to execute them efficiently. 
            This module presents proven productivity methods that can help you manage your time effectively 
            and maintain focus.
          </p>
          
          {/* Pomodoro Technique with enhanced visual design */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
              <Clock className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-orange-800">The Pomodoro Technique</h3>
                  <StandardBadge size="sm" sectionTheme="learning" className="ml-2" blurEffect={true}>Focus</StandardBadge>
                </div>
                <p className="text-orange-700 text-sm">Time-tested method for maintaining concentration and beating procrastination</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="mb-3 text-gray-700">
                    This method uses focused work periods followed by short breaks to maintain high productivity:
                  </p>
                  <ol className="space-y-4 list-none pl-0">
                    <li className="flex items-start gap-3">
                      <div className="bg-orange-100 text-orange-700 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                      <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex-1">Choose a task to work on</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-orange-100 text-orange-700 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                      <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex-1">Set a timer for 25 minutes (one "Pomodoro")</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-orange-100 text-orange-700 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                      <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex-1">Work with complete focus until the timer rings</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-orange-100 text-orange-700 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                      <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex-1">Take a short 5-minute break</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-orange-100 text-orange-700 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                      <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex-1">After 4 Pomodoros, take a longer 15-30 minute break</div>
                    </li>
                  </ol>
                </div>
                <div className="md:w-64 flex-shrink-0 bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2">Benefits</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span className="text-sm">Improved focus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span className="text-sm">Reduced mental fatigue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span className="text-sm">Concrete sense of accomplishment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span className="text-sm">Less distractions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span className="text-sm">Better workload estimation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Blocking with enhanced visual design */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
              <CalendarClock className="h-8 w-8 text-blue-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-blue-800">Time Blocking</h3>
                  <StandardBadge size="sm" sectionTheme="financial" className="ml-2" blurEffect={true}>Structure</StandardBadge>
                </div>
                <p className="text-blue-700 text-sm">Schedule specific blocks of time for specific activities</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4">
                Reserve specific blocks of time for specific activities to create a visual schedule and reduce context switching:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-3">How to Implement:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">1</div>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex-1">Divide your day into blocks (e.g., 30-90 minute segments)</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">2</div>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex-1">Assign specific tasks or categories of work to each block</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">3</div>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex-1">Include blocks for breaks, email, meetings, and deep work</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">4</div>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex-1">Batch similar tasks together when possible</div>
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-3">Benefits:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Creates a clear visual schedule</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Reduces decision fatigue throughout the day</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Helps prevent multitasking and context switching</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Improves time estimation skills</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Creates realistic boundaries for work</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* The 2-Minute Rule with enhanced visual design */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-100">
              <Clock className="h-8 w-8 text-green-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-green-800">The 2-Minute Rule</h3>
                  <StandardBadge size="sm" sectionTheme="wellness" className="ml-2" blurEffect={true}>Quick Wins</StandardBadge>
                </div>
                <p className="text-green-700 text-sm">From David Allen's Getting Things Done methodology</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400 mb-4">
                    <p className="text-lg font-medium text-green-800 italic">
                      "If an action will take less than two minutes, it should be done at the moment it's defined."
                    </p>
                  </div>
                  <p className="text-gray-700">
                    This simple but powerful rule prevents small tasks from piling up and ultimately taking more 
                    time later. It's especially effective for handling email, minor decisions, and small household chores.
                  </p>
                </div>
                <div className="md:w-64 flex-shrink-0 bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Examples:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 bg-green-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800">Responding to a simple email</span>
                    </li>
                    <li className="flex items-start gap-2 bg-green-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800">Filing a document</span>
                    </li>
                    <li className="flex items-start gap-2 bg-green-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800">Making a quick phone call</span>
                    </li>
                    <li className="flex items-start gap-2 bg-green-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800">Putting away items on your desk</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* ABCDE Method with enhanced visual design */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-100">
              <ClipboardList className="h-8 w-8 text-purple-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-purple-800">The ABCDE Method</h3>
                  <StandardBadge size="sm" sectionTheme="career" className="ml-2" blurEffect={true}>Prioritization</StandardBadge>
                </div>
                <p className="text-purple-700 text-sm">A systematic approach to prioritizing your daily tasks</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4">
                Here's how to implement the ABCDE method in your daily routine:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400 flex flex-col items-center">
                  <div className="font-bold text-2xl text-purple-800 mb-2">A</div>
                  <div className="text-center text-sm">Must do</div>
                  <div className="text-center text-xs text-purple-600 mt-1">Critical tasks</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-300 flex flex-col items-center">
                  <div className="font-bold text-2xl text-purple-700 mb-2">B</div>
                  <div className="text-center text-sm">Should do</div>
                  <div className="text-center text-xs text-purple-600 mt-1">Important tasks</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-200 flex flex-col items-center">
                  <div className="font-bold text-2xl text-purple-600 mb-2">C</div>
                  <div className="text-center text-sm">Nice to do</div>
                  <div className="text-center text-xs text-purple-600 mt-1">Minor consequences</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-100 flex flex-col items-center">
                  <div className="font-bold text-2xl text-purple-500 mb-2">D</div>
                  <div className="text-center text-sm">Delegate</div>
                  <div className="text-center text-xs text-purple-600 mt-1">If possible</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-gray-200 flex flex-col items-center">
                  <div className="font-bold text-2xl text-gray-400 mb-2">E</div>
                  <div className="text-center text-sm">Eliminate</div>
                  <div className="text-center text-xs text-purple-600 mt-1">Not necessary</div>
                </div>
              </div>
              <ol className="space-y-3 list-none">
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">1</div>
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-100 flex-1">Before starting your day (or the night before), list everything you need to do</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">2</div>
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-100 flex-1">Assign each task a letter from A to E based on importance and urgency</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">3</div>
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-100 flex-1">Number all A tasks by priority (A1, A2, A3...), then do the same for B and C tasks</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">4</div>
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-100 flex-1">Start with A1 and work your way down the list in order</div>
                </li>
              </ol>
            </div>
          </div>
          
          {/* Eat That Frog with enhanced visual design */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 border-b border-yellow-100">
              <BookOpenIcon className="h-8 w-8 text-yellow-600" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-yellow-800">Eat That Frog</h3>
                  <StandardBadge size="sm" sectionTheme="learning" className="ml-2" blurEffect={true}>First Things First</StandardBadge>
                </div>
                <p className="text-yellow-700 text-sm">Based on Brian Tracy's productivity system</p>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400 mb-4">
                <p className="text-lg font-medium text-yellow-800 italic">
                  "If the first thing you do each morning is to eat a live frog, you can go through the day with the 
                  satisfaction of knowing that it's probably the worst thing that's going to happen to you all day long."
                </p>
                <p className="text-right text-yellow-600 text-sm mt-2">— Mark Twain</p>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-gray-700">
                    Your "frog" is your biggest, most important task—the one you're most likely to procrastinate on. 
                    Do it first thing in the morning when your willpower and energy are highest.
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800">Why it works:</h4>
                      <ul className="mt-2 space-y-3">
                        <li className="flex items-start gap-2 bg-yellow-100/50 p-2 rounded-md">
                          <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-yellow-800">Tackles highest-value tasks first</span>
                        </li>
                        <li className="flex items-start gap-2 bg-yellow-100/50 p-2 rounded-md">
                          <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-yellow-800">Uses peak energy hours productively</span>
                        </li>
                        <li className="flex items-start gap-2 bg-yellow-100/50 p-2 rounded-md">
                          <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-yellow-800">Creates momentum for the rest of the day</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800">Rules to follow:</h4>
                      <ul className="mt-2 space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="bg-yellow-200 text-yellow-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">1</div>
                          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex-1">Identify your most important task</div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="bg-yellow-200 text-yellow-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">2</div>
                          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex-1">Do it first thing, no exceptions</div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="bg-yellow-200 text-yellow-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">3</div>
                          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex-1">Prepare your "frog" the night before</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-green-200 p-2 rounded-full">
                <Lightbulb className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 text-lg">Success Strategy</h4>
                <p className="text-green-800 mt-2">
                  Don't try to implement all of these techniques at once. Choose one that resonates with you, 
                  practice it until it becomes a habit, then consider adding another. Consistency with one technique 
                  is better than inconsistent use of many.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <StandardBadge sectionTheme="wellness" className="font-semibold">Start Small</StandardBadge>
                  <StandardBadge sectionTheme="wellness" className="font-semibold">Be Consistent</StandardBadge>
                  <StandardBadge sectionTheme="wellness" className="font-semibold">Build Habits</StandardBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'planning',
      title: 'Planning and Goal Setting',
      description: 'Creating effective systems for short and long-term success',
      icon: CalendarClock,
      content: (
        <div className="space-y-4">
          <p>
            Planning and goal setting create the foundation for effective time management. Without clear goals, 
            it's impossible to prioritize properly. This module explores how to set meaningful goals and create 
            planning systems that help you achieve them.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-100">
              <Target className="h-8 w-8 text-purple-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-purple-800">SMART Goal Setting</h3>
                  <StandardBadge size="sm" sectionTheme="career" className="ml-2" blurEffect={true}>Precision</StandardBadge>
                </div>
                <p className="text-purple-700 text-sm">A framework for creating effective, actionable goals</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                SMART goals are designed to provide clarity, focus, and motivation while being trackable:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-200 text-purple-800 h-7 w-7 rounded-full flex items-center justify-center font-bold">S</div>
                      <h4 className="font-medium text-purple-800">Specific</h4>
                    </div>
                    <p className="text-purple-900">Clearly defined and precise</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-red-50 p-2 rounded border border-red-100">
                        <span className="font-medium text-red-700">❌ Too vague:</span>
                        <p className="text-red-800">"Get better at math"</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded border border-green-100">
                        <span className="font-medium text-green-700">✅ Specific:</span>
                        <p className="text-green-800">"Improve calculus grade from B- to B+"</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-200 text-purple-800 h-7 w-7 rounded-full flex items-center justify-center font-bold">M</div>
                      <h4 className="font-medium text-purple-800">Measurable</h4>
                    </div>
                    <p className="text-purple-900">Include specific criteria to track progress</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-red-50 p-2 rounded border border-red-100">
                        <span className="font-medium text-red-700">❌ Not measurable:</span>
                        <p className="text-red-800">"Save more money"</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded border border-green-100">
                        <span className="font-medium text-green-700">✅ Measurable:</span>
                        <p className="text-green-800">"Save $500 per month"</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-200 text-purple-800 h-7 w-7 rounded-full flex items-center justify-center font-bold">A</div>
                      <h4 className="font-medium text-purple-800">Achievable</h4>
                    </div>
                    <p className="text-purple-900">Challenging but realistic given your resources</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-red-50 p-2 rounded border border-red-100">
                        <span className="font-medium text-red-700">❌ Unrealistic:</span>
                        <p className="text-red-800">"Run a marathon next week" (as a beginner)</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded border border-green-100">
                        <span className="font-medium text-green-700">✅ Achievable:</span>
                        <p className="text-green-800">"Run a 5K in 8 weeks"</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-200 text-purple-800 h-7 w-7 rounded-full flex items-center justify-center font-bold">R</div>
                      <h4 className="font-medium text-purple-800">Relevant</h4>
                    </div>
                    <p className="text-purple-900">Aligned with your broader objectives and values</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-red-50 p-2 rounded border border-red-100">
                        <span className="font-medium text-red-700">❌ Not aligned:</span>
                        <p className="text-red-800">"Learn to juggle" (if not supporting priorities)</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded border border-green-100">
                        <span className="font-medium text-green-700">✅ Relevant:</span>
                        <p className="text-green-800">"Learn public speaking to advance my career"</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-200 text-purple-800 h-7 w-7 rounded-full flex items-center justify-center font-bold">T</div>
                      <h4 className="font-medium text-purple-800">Time-bound</h4>
                    </div>
                    <p className="text-purple-900">Has a specific deadline or timeframe</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-red-50 p-2 rounded border border-red-100">
                        <span className="font-medium text-red-700">❌ No deadline:</span>
                        <p className="text-red-800">"Someday I'll write a book"</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded border border-green-100">
                        <span className="font-medium text-green-700">✅ Time-bound:</span>
                        <p className="text-green-800">"Complete first draft by December 31st"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
              <CalendarRange className="h-8 w-8 text-blue-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-blue-800">Planning Horizons</h3>
                  <StandardBadge size="sm" sectionTheme="financial" className="ml-2" blurEffect={true}>Structure</StandardBadge>
                </div>
                <p className="text-blue-700 text-sm">Effective planning at multiple time scales</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Planning works best when you coordinate across different time horizons, creating alignment from your daily tasks to your annual goals:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-200 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-bold">Y</div>
                    <h4 className="font-semibold text-blue-800">Annual Planning</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Set 3-5 major goals for the year</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Identify key projects and milestones</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Align with your longer-term vision</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Review and revise quarterly</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-200 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-bold">M</div>
                    <h4 className="font-semibold text-blue-800">Monthly Planning</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Break annual goals into monthly objectives</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Schedule key appointments and deadlines</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Allocate resources and time commitments</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Review progress on larger projects</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-200 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-bold">W</div>
                    <h4 className="font-semibold text-blue-800">Weekly Planning</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Review upcoming week every Sunday or Monday</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Identify 3-5 key priorities for the week</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Schedule blocks of time for important tasks</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Prepare for upcoming meetings and events</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-200 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-bold">D</div>
                    <h4 className="font-semibold text-blue-800">Daily Planning</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Identify 1-3 "must do" tasks for the day</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Review and update your schedule</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Apply prioritization techniques</span>
                    </li>
                    <li className="flex items-start gap-2 bg-blue-100/50 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">Build in buffer time for unexpected issues</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Planning Systems</h3>
          <div className="space-y-2">
            <p>Choose a planning system that works for your lifestyle:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Digital planners:</strong> Calendar apps, task management software, digital notes</li>
              <li><strong>Paper planners:</strong> Bullet journals, day planners, wall calendars</li>
              <li><strong>Hybrid approach:</strong> Combining digital and paper methods for different needs</li>
            </ul>
            <p className="mt-2">
              Regardless of your system, the key is consistency. Review and update your plans regularly.
            </p>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Habit Stacking</h3>
          <p>
            Connect new planning habits to existing routines:
          </p>
          <div className="bg-gray-50 p-4 rounded-md mt-2">
            <p className="italic">
              "After I [current habit], I will [new planning habit]."
            </p>
          </div>
          <p className="mt-2">
            Examples:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>"After I pour my morning coffee, I will review my top three priorities for the day."</li>
            <li>"After I brush my teeth on Sunday evening, I will plan my upcoming week."</li>
          </ul>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              Plans are valuable, but flexibility is essential. Think of your plans as a compass that helps 
              you navigate, not as rigid rules that can't be adjusted when circumstances change.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'habits',
      title: 'Building Better Time Habits',
      description: 'Creating sustainable systems for long-term success',
      icon: LineChart,
      content: (
        <div className="space-y-4">
          <p>
            Time management isn't just about techniques—it's about developing sustainable habits that become 
            automatic over time. This module explores how to build better time habits and overcome common 
            obstacles to productivity.
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-indigo-100">
              <LineChart className="h-8 w-8 text-indigo-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-indigo-800">Understanding Habit Formation</h3>
                  <StandardBadge size="sm" sectionTheme="learning" className="ml-2" blurEffect={true}>Framework</StandardBadge>
                </div>
                <p className="text-indigo-700 text-sm">The four stages of habit formation from "Atomic Habits" by James Clear</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                To build better time management habits, it's important to understand how habits form. According to James Clear's "Atomic Habits," every habit follows a four-stage process:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                  <div className="bg-blue-100 py-3 px-4 border-b border-blue-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-blue-800 text-lg">1. Cue</h4>
                      <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-blue-500 font-bold border border-blue-300">1</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-blue-900">The trigger that initiates the behavior</p>
                    <div className="mt-3 bg-white/60 p-3 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-800 italic">
                        Examples: Time of day, physical location, preceding event, emotional state, other people
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm overflow-hidden">
                  <div className="bg-green-100 py-3 px-4 border-b border-green-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-green-800 text-lg">2. Craving</h4>
                      <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-green-500 font-bold border border-green-300">2</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-green-900">The motivation or desire for the reward</p>
                    <div className="mt-3 bg-white/60 p-3 rounded-md border border-green-200">
                      <p className="text-sm text-green-800 italic">
                        The emotional force that drives your behavior; what you really want is the change in internal state
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 shadow-sm overflow-hidden">
                  <div className="bg-amber-100 py-3 px-4 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-amber-800 text-lg">3. Response</h4>
                      <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-amber-500 font-bold border border-amber-300">3</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-amber-900">The actual habit or action you take</p>
                    <div className="mt-3 bg-white/60 p-3 rounded-md border border-amber-200">
                      <p className="text-sm text-amber-800 italic">
                        The action itself; depends on your motivation and the amount of friction associated with the behavior
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border border-rose-200 shadow-sm overflow-hidden">
                  <div className="bg-rose-100 py-3 px-4 border-b border-rose-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-rose-800 text-lg">4. Reward</h4>
                      <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-rose-500 font-bold border border-rose-300">4</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-rose-900">The benefit gained from performing the habit</p>
                    <div className="mt-3 bg-white/60 p-3 rounded-md border border-rose-200">
                      <p className="text-sm text-rose-800 italic">
                        The end goal of every habit; rewards satisfy your craving and teach you which actions to remember in the future
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-4 border-b border-teal-100">
              <CheckCircle className="h-8 w-8 text-teal-500" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-teal-800">Building Better Time Habits</h3>
                  <StandardBadge size="sm" sectionTheme="wellness" className="ml-2" blurEffect={true}>Strategies</StandardBadge>
                </div>
                <p className="text-teal-700 text-sm">Four powerful methods to create lasting time management habits</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Using James Clear's habit framework, here are four powerful strategies to build effective time management habits that last:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-b from-teal-50 to-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
                  <div className="px-6 py-3 bg-teal-100 border-b border-teal-200">
                    <h4 className="font-semibold text-teal-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Make It Obvious
                    </h4>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-3">Create clear cues that trigger your time management habits:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Set clear implementation intentions ("At 9am, I will review my top priorities for the day")</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Design your environment to support good habits (clear workspace, visible planner)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Use visual cues and reminders (calendar notifications, sticky notes)</span>
                      </li>
                    </ul>
                    <div className="mt-4 bg-teal-50 p-3 rounded-md border border-teal-100">
                      <p className="text-sm text-teal-800 italic">
                        "We don't rise to the level of our goals, we fall to the level of our systems." — James Clear
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-b from-teal-50 to-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
                  <div className="px-6 py-3 bg-teal-100 border-b border-teal-200">
                    <h4 className="font-semibold text-teal-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                      </svg>
                      Make It Attractive
                    </h4>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-3">Increase your desire to perform time management habits:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Use temptation bundling (pair planning tasks with your favorite coffee)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Join a productivity group or find an accountability partner</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Create a motivation ritual before starting your daily planning</span>
                      </li>
                    </ul>
                    <div className="mt-4 bg-teal-50 p-3 rounded-md border border-teal-100">
                      <p className="text-sm text-teal-800 italic">
                        "Habits are the compound interest of self-improvement." — James Clear
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-b from-teal-50 to-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
                  <div className="px-6 py-3 bg-teal-100 border-b border-teal-200">
                    <h4 className="font-semibold text-teal-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"></path>
                      </svg>
                      Make It Easy
                    </h4>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-3">Reduce friction to make time management habits simpler:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Reduce friction (prepare your workspace and tools the night before)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Start with two-minute versions of habits ("I'll just plan for two minutes")</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Automate recurring tasks and use templates for common activities</span>
                      </li>
                    </ul>
                    <div className="mt-4 bg-teal-50 p-3 rounded-md border border-teal-100">
                      <p className="text-sm text-teal-800 italic">
                        "The best way to build a habit is to make it so easy you can't say no." — Leo Babauta
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-b from-teal-50 to-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
                  <div className="px-6 py-3 bg-teal-100 border-b border-teal-200">
                    <h4 className="font-semibold text-teal-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Make It Satisfying
                    </h4>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-3">Create rewards to reinforce your time management habits:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Use immediate rewards after completing planning or time blocks</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Track your time management habits with a visual progress tracker</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-teal-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-800">Never miss twice - if you break your planning streak, get back on track immediately</span>
                      </li>
                    </ul>
                    <div className="mt-4 bg-teal-50 p-3 rounded-md border border-teal-100">
                      <p className="text-sm text-teal-800 italic">
                        "What gets measured gets managed." — Peter Drucker
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-amber-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-amber-800">Breaking Bad Time Habits</h3>
                  <StandardBadge size="sm" sectionTheme="emergency" className="ml-2" blurEffect={true}>Solutions</StandardBadge>
                </div>
                <p className="text-amber-700 text-sm">How to overcome procrastination and other productivity killers</p>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Just as we can apply habit formation principles to build good time habits, we can also use them to break bad ones. Here's how to invert the four laws of habit formation to eliminate time management obstacles:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg overflow-hidden border border-amber-100 shadow-sm">
                  <div className="px-5 py-3 bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-amber-800">Make It Invisible</h4>
                      <div className="bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                          <line x1="2" y1="2" x2="22" y2="22"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700 mb-3">Remove cues that trigger distracting behaviors:</p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">1</span>
                        </div>
                        <span className="text-gray-800">Eliminate distractions from your environment (put your phone in another room)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">2</span>
                        </div>
                        <span className="text-gray-800">Use website blockers to prevent access to distracting sites during focused work time</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">3</span>
                        </div>
                        <span className="text-gray-800">Hide time-wasting apps from your home screen or delete them entirely</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg overflow-hidden border border-amber-100 shadow-sm">
                  <div className="px-5 py-3 bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-amber-800">Make It Unattractive</h4>
                      <div className="bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700 mb-3">Change how you think about unproductive habits:</p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">1</span>
                        </div>
                        <span className="text-gray-800">Reframe your mindset (think "I don't scroll social media during work hours" instead of "I can't")</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">2</span>
                        </div>
                        <span className="text-gray-800">Highlight the benefits of avoiding distractions ("I'll finish earlier and have more free time")</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">3</span>
                        </div>
                        <span className="text-gray-800">Spend time with people who reinforce productive behaviors and good time management</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg overflow-hidden border border-amber-100 shadow-sm">
                  <div className="px-5 py-3 bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-amber-800">Make It Difficult</h4>
                      <div className="bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700 mb-3">Increase friction for unproductive behaviors:</p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">1</span>
                        </div>
                        <span className="text-gray-800">Use commitment devices (like website blockers with password protection)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">2</span>
                        </div>
                        <span className="text-gray-800">Log out of social media and email accounts when focusing on important work</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">3</span>
                        </div>
                        <span className="text-gray-800">Require two-step processes to engage in distracting behaviors</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg overflow-hidden border border-amber-100 shadow-sm">
                  <div className="px-5 py-3 bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-amber-800">Make It Unsatisfying</h4>
                      <div className="bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                          <line x1="9" y1="9" x2="9.01" y2="9"></line>
                          <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700 mb-3">Create immediate negative consequences:</p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">1</span>
                        </div>
                        <span className="text-gray-800">Create a habit contract with consequences (donate to a cause you dislike if you procrastinate)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">2</span>
                        </div>
                        <span className="text-gray-800">Find an accountability partner who will check in on your progress regularly</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="bg-amber-100 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">3</span>
                        </div>
                        <span className="text-gray-800">Use time tracking software to make wasted time visible and immediate</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h5 className="font-medium text-amber-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Pro Tip
                </h5>
                <p className="text-amber-900 mt-2">
                  Don't try to break all your bad time habits at once. Start with the one that has the biggest negative impact on your productivity, master that change, and then move on to the next habit.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-violet-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-violet-50 to-violet-100 px-6 py-4 border-b border-violet-100">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-violet-800">The Power of Identity</h3>
                    <p className="text-violet-600 text-sm">Become the type of person who manages time well</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  The most effective way to change your habits is to focus on who you wish to become, not just what you want to achieve.
                </p>
                
                <div className="mt-4 bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-lg border border-violet-100">
                  <p className="italic text-violet-800 font-medium">
                    "The goal is not to manage time, the goal is to become a person who values time.<br />
                    <br />
                    The goal is not to plan your day, the goal is to become a planner.<br />
                    <br />
                    The goal is not to be productive occasionally, the goal is to become a productive person."
                  </p>
                </div>
                
                <p className="mt-4 text-gray-700">
                  Identity-based habits focus on changing your beliefs about yourself. When you believe you are a certain type of person, you act accordingly.
                </p>
                
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-violet-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-700">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">Start with small wins</span>
                      <p className="text-gray-600 text-sm">Build evidence that you are becoming the type of person who manages time well</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-violet-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-700">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">Reframe your self-talk</span>
                      <p className="text-gray-600 text-sm">Say "I'm the type of person who doesn't miss deadlines" instead of "I need to stop missing deadlines"</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-violet-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-700">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">Join communities</span>
                      <p className="text-gray-600 text-sm">Surround yourself with people who already have the identity you want to build</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">Continuous Improvement</h3>
                    <p className="text-blue-600 text-sm">Small daily improvements lead to remarkable results</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  The goal isn't perfection; it's continuous improvement. This approach, inspired by the Japanese concept of <span className="italic">Kaizen</span>, focuses on getting just a little bit better each day.
                </p>
                
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-64 h-64">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-10"></div>
                      <div className="absolute inset-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20"></div>
                      <div className="absolute inset-6 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-30"></div>
                      <div className="absolute inset-9 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-40"></div>
                      <div className="absolute inset-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-blue-800 font-bold text-lg">1% Better</div>
                          <div className="text-blue-600 text-sm">Every Day</div>
                          <div className="font-bold text-2xl text-blue-900 mt-2">37x</div>
                          <div className="text-blue-600 text-sm">Better in a Year</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-blue-800">
                    <div className="font-medium">The Math of Small Improvements</div>
                    <p className="text-sm mt-1">1.01<sup>365</sup> = 37.8</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      The 2-Minute Rule
                    </h4>
                    <p className="text-gray-700 text-sm mt-1">
                      When you find yourself procrastinating, commit to just 2 minutes of work. Often, starting is the hardest part, but once begun, you're likely to continue.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      The Forgiveness Principle
                    </h4>
                    <p className="text-gray-700 text-sm mt-1">
                      When you slip up (and you will), forgive yourself and get back on track immediately. Consistency over time matters more than perfection.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                      Track Your Progress
                    </h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Keep a journal of your improvements, no matter how small. Seeing your progress over time provides motivation and reinforces your identity as someone who values time.
                    </p>
                  </div>
                </div>
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
          <Clock className="h-6 w-6 mr-2 text-orange-500" />
          Time Management
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
              <CardTitle>Introduction to Time Management</CardTitle>
              <CardDescription>
                Learn strategies to maximize productivity and reduce stress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Effective time management isn't about squeezing more tasks into your day—it's about prioritizing 
                what's important, eliminating time-wasters, and creating systems that help you work more efficiently.
              </p>
              <p className="mb-4">
                This course teaches practical strategies for managing your time effectively, setting meaningful 
                priorities, overcoming procrastination, and building sustainable productivity habits that will serve 
                you in school, work, and personal life.
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
              <CardTitle>Test Your Time Management Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about managing your time effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Time Management"
                difficulty="beginner"
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
              <CardTitle>Time Management Resources</CardTitle>
              <CardDescription>
                Helpful links and tools to improve your time management skills
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