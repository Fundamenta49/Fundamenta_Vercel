import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X, Maximize2, Minimize2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAIEventStore } from '@/lib/ai-event-system';
import { useLocation } from "wouter";

// Define the types of guided paths we offer in post-tour
type GuidePath = 'getting_started' | 'skill_building' | 'financial_planning' | 'career_advancement' | 'wellness_journey' | 'fitness_plans' | 'emergency_prep';

// Define the post-tour engagement paths with stages
// Each path has multiple stages with preloaded content

interface GuideStage {
  message: string;
  options: {
    text: string;
    action: 'next_stage' | 'new_path' | 'end' | 'ai';
    nextStage?: number;
    nextPath?: GuidePath;
  }[];
}

interface GuidePathData {
  title: string;
  description: string;
  stages: GuideStage[];
}

// Track user's onboarding progress
interface OnboardingProgress {
  completedPaths: GuidePath[];
  interactions: number;
  maxFreeInteractions: number;
}

// The preloaded conversation paths
const guidePaths: Record<GuidePath, GuidePathData> = {
  getting_started: {
    title: "Getting Started",
    description: "Let me help you get familiar with Fundamenta!",
    stages: [
      {
        message: "Now that you've completed the tour, what would you like to focus on first? I can help with:",
        options: [
          { text: "How do I navigate between sections?", action: 'next_stage', nextStage: 1 },
          { text: "What features are most popular?", action: 'next_stage', nextStage: 2 },
          { text: "Where should I start my learning journey?", action: 'next_stage', nextStage: 3 },
          { text: "I'd like to explore something else", action: 'end' },
        ]
      },
      {
        message: "Navigation is simple! Use the main menu on the left sidebar to jump between sections. Each section has its own specialized tools and resources. The home dashboard also has quick-access cards for popular features.",
        options: [
          { text: "Can I customize the dashboard?", action: 'next_stage', nextStage: 4 },
          { text: "Show me what's in each section", action: 'next_stage', nextStage: 5 },
          { text: "Got it, thanks!", action: 'end' },
        ]
      },
      {
        message: "Our most popular features are the Life Skills courses, Financial Planning tools, and Career Development resources. Many users also love our Wellness guides and Fitness tracking tools!",
        options: [
          { text: "Tell me about Life Skills", action: 'new_path', nextPath: 'skill_building' },
          { text: "Tell me about Financial Planning", action: 'new_path', nextPath: 'financial_planning' },
          { text: "Tell me about Career Development", action: 'new_path', nextPath: 'career_advancement' },
          { text: "Thanks, I'll explore myself", action: 'end' },
        ]
      },
      {
        message: "Great question! Many users start with the Life Skills section to build practical everyday abilities. Others begin with Financial Planning to organize their budget. What interests you most right now?",
        options: [
          { text: "Life Skills sounds right for me", action: 'new_path', nextPath: 'skill_building' },
          { text: "I need help with finances", action: 'new_path', nextPath: 'financial_planning' },
          { text: "I want to work on my career", action: 'new_path', nextPath: 'career_advancement' },
          { text: "I'm focused on wellness", action: 'new_path', nextPath: 'wellness_journey' },
        ]
      },
      {
        message: "Yes, you can personalize your dashboard! Click on the 'Customize' button in the top-right corner of the dashboard. From there, you can drag and drop widgets, change the layout, and hide sections you don't use often.",
        options: [
          { text: "Can I reset it later?", action: 'next_stage', nextStage: 6 },
          { text: "How do I add new widgets?", action: 'ai' },
          { text: "Perfect, I'll try that!", action: 'end' },
        ]
      },
      {
        message: "Each section has specialized tools: Life Skills has interactive courses, Financial has calculators and planners, Career has resume builders and job search, Wellness has meditation and nutrition guides, and Fitness has workout plans and tracking tools.",
        options: [
          { text: "Take me to Life Skills", action: 'new_path', nextPath: 'skill_building' },
          { text: "Show me the Financial tools", action: 'new_path', nextPath: 'financial_planning' },
          { text: "I'm interested in Wellness", action: 'new_path', nextPath: 'wellness_journey' },
          { text: "Thanks, that's helpful!", action: 'end' },
        ]
      },
      {
        message: "Absolutely! You can reset your dashboard to the default layout anytime by clicking 'Reset Layout' in the Customize menu. All your data will remain safe.",
        options: [
          { text: "Great, thanks for your help!", action: 'end' },
          { text: "I have another question...", action: 'ai' },
        ]
      },
    ]
  },
  skill_building: {
    title: "Life Skills",
    description: "Discover practical skills for everyday life!",
    stages: [
      {
        message: "Life Skills is all about practical knowledge for everyday situations. You'll find courses on cooking, home maintenance, communication, time management, and much more. What interests you most?",
        options: [
          { text: "How do the courses work?", action: 'next_stage', nextStage: 1 },
          { text: "Which skills are most popular?", action: 'next_stage', nextStage: 2 },
          { text: "How do I track my progress?", action: 'next_stage', nextStage: 3 },
          { text: "I'd like to explore another area", action: 'end' },
        ]
      },
      {
        message: "Our courses combine video lessons, interactive exercises, and hands-on practice. Each skill is broken down into bite-sized modules you can complete at your own pace. You'll earn badges as you progress!",
        options: [
          { text: "How long are the courses?", action: 'next_stage', nextStage: 4 },
          { text: "Can I get personalized help?", action: 'next_stage', nextStage: 5 },
          { text: "Show me the course catalog", action: 'ai' },
          { text: "Thanks, I'll check them out!", action: 'end' },
        ]
      },
      {
        message: "Our most popular life skills include Basic Cooking Techniques, Home Maintenance Essentials, Effective Communication, Personal Finance Basics, and Time Management Strategies.",
        options: [
          { text: "Tell me about Cooking courses", action: 'ai' },
          { text: "Tell me about Communication", action: 'ai' },
          { text: "I'll look through the catalog", action: 'end' },
          { text: "Let's explore another area", action: 'end' },
        ]
      },
      {
        message: "Your Life Skills dashboard shows all your courses and completion rates. You can see your earned badges, track daily streaks, and view personalized recommendations based on your interests and progress.",
        options: [
          { text: "Do I earn rewards?", action: 'next_stage', nextStage: 6 },
          { text: "Can I share my progress?", action: 'ai' },
          { text: "That sounds great!", action: 'end' },
        ]
      },
      {
        message: "Most skill modules take 15-30 minutes to complete. Full courses typically have 5-10 modules, so you can complete an entire skill course in just a few hours spread over days or weeks – perfect for busy schedules!",
        options: [
          { text: "Can I pause and resume?", action: 'next_stage', nextStage: 7 },
          { text: "Are there any quick courses?", action: 'ai' },
          { text: "Perfect, that works for me!", action: 'end' },
        ]
      },
      {
        message: "Absolutely! Every course has a 'Get Help' button where you can ask me specific questions. Premium members also get access to live coaching sessions with real experts for personalized guidance.",
        options: [
          { text: "Tell me about Premium", action: 'ai' },
          { text: "That's really helpful", action: 'end' },
          { text: "Let me explore other areas", action: 'end' },
        ]
      },
      {
        message: "Yes! You earn digital badges for completing courses and special achievements for applying skills in real life. Premium members also earn points that can be redeemed for exclusive content and real-world rewards from our partners.",
        options: [
          { text: "What partner rewards?", action: 'ai' },
          { text: "Cool, I'm excited to start!", action: 'end' },
        ]
      },
      {
        message: "Absolutely! You can pause any course and resume exactly where you left off. Your progress is automatically saved, and you'll get gentle reminders to continue if you'd like.",
        options: [
          { text: "Perfect, thanks for explaining!", action: 'end' },
          { text: "I have another question...", action: 'ai' },
        ]
      },
    ]
  },
  financial_planning: {
    title: "Financial Planning",
    description: "Tools and guidance for managing your money!",
    stages: [
      {
        message: "Our Financial Planning section helps you take control of your money with budgeting tools, saving calculators, debt management strategies, and investment guidance. What would you like to know?",
        options: [
          { text: "How do I create a budget?", action: 'next_stage', nextStage: 1 },
          { text: "What savings tools are available?", action: 'next_stage', nextStage: 2 },
          { text: "Can it help with debt management?", action: 'next_stage', nextStage: 3 },
          { text: "I'd like to explore another area", action: 'end' },
        ]
      },
      {
        message: "Creating a budget is easy! Our Budget Wizard walks you through entering your income and expenses, then automatically categorizes everything. You'll get a visual breakdown of your spending and suggestions for improvement.",
        options: [
          { text: "Can I connect my bank accounts?", action: 'next_stage', nextStage: 4 },
          { text: "How secure is my financial data?", action: 'next_stage', nextStage: 5 },
          { text: "Take me to the Budget Wizard", action: 'ai' },
          { text: "Thanks, I'll try it myself", action: 'end' },
        ]
      },
      {
        message: "We have several savings tools: Goal Calculator (how much to save monthly for specific goals), Emergency Fund Planner, Retirement Estimator, and Savings Challenge programs to make saving fun and achievable!",
        options: [
          { text: "Tell me about the Savings Challenge", action: 'ai' },
          { text: "How does the Retirement Estimator work?", action: 'ai' },
          { text: "I'll check these out!", action: 'end' },
        ]
      },
      {
        message: "Yes! Our Debt Reduction Planner helps you list all debts, suggests optimal payment strategies (snowball or avalanche methods), and creates a personalized payoff timeline with progress tracking.",
        options: [
          { text: "What's the snowball method?", action: 'next_stage', nextStage: 6 },
          { text: "Can it help with student loans?", action: 'ai' },
          { text: "This sounds very helpful!", action: 'end' },
        ]
      },
      {
        message: "Premium members can securely connect bank accounts for automatic expense tracking. We use bank-level encryption and never store your login credentials – just like leading financial apps.",
        options: [
          { text: "Tell me more about Premium", action: 'ai' },
          { text: "Can I manually enter transactions?", action: 'next_stage', nextStage: 7 },
          { text: "Thanks, good to know!", action: 'end' },
        ]
      },
      {
        message: "Your financial data is protected with bank-level encryption. We're SOC 2 compliant and never sell your information. You can also use the tools without connecting accounts by entering information manually.",
        options: [
          { text: "That's reassuring", action: 'end' },
          { text: "I have more security questions", action: 'ai' },
        ]
      },
      {
        message: "The debt snowball method focuses on paying off your smallest debts first while maintaining minimum payments on larger ones. This gives you quick wins and motivation! The avalanche method targets highest-interest debts first, saving more money over time.",
        options: [
          { text: "Which method is recommended?", action: 'ai' },
          { text: "Take me to the Debt Planner", action: 'ai' },
          { text: "Thanks, that makes sense!", action: 'end' },
        ]
      },
      {
        message: "Absolutely! Even without connecting accounts, you can manually enter transactions and our system will still categorize them automatically. You'll get all the same insights and recommendations.",
        options: [
          { text: "Perfect, that works for me", action: 'end' },
          { text: "I have another question...", action: 'ai' },
        ]
      },
    ]
  },
  career_advancement: {
    title: "Career Development",
    description: "Tools to help you advance professionally!",
    stages: [
      {
        message: "Our Career Development section helps you land your dream job with resume builders, interview preparation, job search tools, and career path planning. What would you like to explore?",
        options: [
          { text: "Tell me about the Resume Builder", action: 'next_stage', nextStage: 1 },
          { text: "How does Interview Prep work?", action: 'next_stage', nextStage: 2 },
          { text: "Can it help me find jobs?", action: 'next_stage', nextStage: 3 },
          { text: "I'd like to explore another area", action: 'end' },
        ]
      },
      {
        message: "Our AI-powered Resume Builder helps create professional resumes tailored to specific job types. Upload an existing resume for instant analysis, or build one from scratch with our templates and AI suggestions for stronger wording.",
        options: [
          { text: "Can I create multiple versions?", action: 'next_stage', nextStage: 4 },
          { text: "How do I export my resume?", action: 'ai' },
          { text: "Take me to the Resume Builder", action: 'ai' },
          { text: "Thanks, I'll check it out!", action: 'end' },
        ]
      },
      {
        message: "Interview Prep provides practice with common and industry-specific questions. You can record video responses, get AI feedback on your answers, practice with virtual interviewers, and even participate in mock interviews with industry professionals (Premium).",
        options: [
          { text: "What kinds of feedback will I get?", action: 'next_stage', nextStage: 5 },
          { text: "Are there industry-specific questions?", action: 'ai' },
          { text: "This sounds very helpful!", action: 'end' },
        ]
      },
      {
        message: "Yes! Our Job Search tools aggregate listings from major job boards, allow you to save favorites, track applications, and get personalized recommendations based on your skills and interests. Premium members receive enhanced matching with exclusive opportunities.",
        options: [
          { text: "How accurate are the matches?", action: 'ai' },
          { text: "Can it help with networking?", action: 'next_stage', nextStage: 6 },
          { text: "I'll explore the job search!", action: 'end' },
        ]
      },
      {
        message: "Absolutely! You can create and save multiple resume versions tailored to different job types or industries. Our AI helper suggests customizations for specific job descriptions to increase your chances of getting interviews.",
        options: [
          { text: "How many can I create?", action: 'ai' },
          { text: "Does it check for errors?", action: 'next_stage', nextStage: 7 },
          { text: "That's exactly what I need!", action: 'end' },
        ]
      },
      {
        message: "The AI feedback analyzes your content, delivery, and confidence. It checks for filler words, suggests stronger responses, and evaluates your body language and eye contact in video responses. You'll get actionable tips to improve each answer.",
        options: [
          { text: "Can I practice specific scenarios?", action: 'ai' },
          { text: "Take me to Interview Prep", action: 'ai' },
          { text: "This will definitely help me!", action: 'end' },
        ]
      },
      {
        message: "Yes! Our Networking Assistant helps you find connection opportunities, prepare for networking events, and even draft outreach messages. Premium users can join virtual networking events with professionals in their target industries.",
        options: [
          { text: "Tell me more about these events", action: 'ai' },
          { text: "How do I set up my networking profile?", action: 'ai' },
          { text: "Thanks, I'll check this out!", action: 'end' },
        ]
      },
      {
        message: "Yes! The Resume Builder thoroughly checks for spelling and grammar errors, formatting inconsistencies, and overused phrases. It also scans for ATS (Applicant Tracking System) compatibility to ensure your resume gets past automated screenings.",
        options: [
          { text: "That's fantastic!", action: 'end' },
          { text: "I have another question...", action: 'ai' },
        ]
      },
    ]
  },
  wellness_journey: {
    title: "Wellness Journey",
    description: "Resources for mental and emotional wellbeing!",
    stages: [
      {
        message: "Our Wellness Journey section helps you nurture your mental and emotional health with guided meditations, stress management techniques, sleep improvement tools, and mindfulness practices. What interests you?",
        options: [
          { text: "Tell me about meditation guides", action: 'next_stage', nextStage: 1 },
          { text: "How can I manage stress better?", action: 'next_stage', nextStage: 2 },
          { text: "I'm having trouble sleeping", action: 'next_stage', nextStage: 3 },
          { text: "I'd like to explore another area", action: 'end' },
        ]
      },
      {
        message: "Our meditation guides range from 2-minute breathing exercises to 30-minute deep sessions. They're organized by goals (relaxation, focus, sleep, etc.) and experience levels. You can track your meditation streak and total mindful minutes.",
        options: [
          { text: "I'm new to meditation", action: 'next_stage', nextStage: 4 },
          { text: "Can I get reminders?", action: 'ai' },
          { text: "Take me to meditation guides", action: 'ai' },
          { text: "Thanks, I'll explore them!", action: 'end' },
        ]
      },
      {
        message: "Our Stress Management toolkit includes quick relief techniques, a stress journal to identify triggers, guided breathwork, progressive relaxation exercises, and cognitive reframing practices. All backed by research and easy to fit into your day!",
        options: [
          { text: "What's cognitive reframing?", action: 'ai' },
          { text: "Tell me about breathwork", action: 'next_stage', nextStage: 5 },
          { text: "This is exactly what I need!", action: 'end' },
        ]
      },
      {
        message: "Our Sleep Improvement section offers bedtime meditation, white noise and nature sounds, sleep tracking, and science-backed tips for better sleep hygiene. Premium members get detailed sleep cycle analysis with personalized recommendations.",
        options: [
          { text: "How does sleep tracking work?", action: 'ai' },
          { text: "Tell me about sleep hygiene", action: 'next_stage', nextStage: 6 },
          { text: "I'll check out the sleep tools!", action: 'end' },
        ]
      },
      {
        message: "Perfect! Our 'Meditation for Beginners' program starts with just 2 minutes daily and gradually builds your practice. It includes simple guidance, animations for proper posture, and answers to common questions new meditators have.",
        options: [
          { text: "Will it really help me relax?", action: 'next_stage', nextStage: 7 },
          { text: "Start Beginner's Program now", action: 'ai' },
          { text: "I'll try it out, thanks!", action: 'end' },
        ]
      },
      {
        message: "Our guided breathwork includes exercises like 4-7-8 breathing, box breathing, and diaphragmatic breathing. Each comes with animated guides to help you follow along and explanations of when to use each technique for maximum benefit.",
        options: [
          { text: "What's box breathing?", action: 'ai' },
          { text: "Try a quick breathwork session", action: 'ai' },
          { text: "Thanks, I'll explore these!", action: 'end' },
        ]
      },
      {
        message: "Sleep hygiene includes establishing a consistent sleep schedule, creating a restful environment (cool, dark, quiet), avoiding screens before bed, limiting caffeine/alcohol, and developing a relaxing bedtime routine. Our app helps track all these factors!",
        options: [
          { text: "Give me some quick improvements", action: 'ai' },
          { text: "Create a sleep improvement plan", action: 'ai' },
          { text: "This is very helpful, thanks!", action: 'end' },
        ]
      },
      {
        message: "Absolutely! Even brief meditation sessions activate your parasympathetic nervous system, lowering stress hormones and heart rate. Our users report feeling noticeably calmer after just one week of consistent 2-minute sessions.",
        options: [
          { text: "I'm ready to start!", action: 'ai' },
          { text: "I have another question...", action: 'ai' },
          { text: "Thanks for the information!", action: 'end' },
        ]
      },
    ]
  },
  fitness_plans: {
    title: "Fitness Planning",
    description: "Customized workout plans and tracking!",
    stages: [
      {
        message: "Our Fitness section helps you stay active with personalized workout plans, exercise libraries, progress tracking, and nutrition guidance tailored to your goals. What would you like to know?",
        options: [
          { text: "How do personalized plans work?", action: 'next_stage', nextStage: 1 },
          { text: "Tell me about the exercise library", action: 'next_stage', nextStage: 2 },
          { text: "How do I track my progress?", action: 'next_stage', nextStage: 3 },
          { text: "I'd like to explore another area", action: 'end' },
        ]
      },
      {
        message: "Our Workout Planner creates custom routines based on your goals (strength, cardio, flexibility, etc.), available equipment, fitness level, and time constraints. Each plan adapts as you progress to keep you challenged and motivated.",
        options: [
          { text: "I'm a complete beginner", action: 'next_stage', nextStage: 4 },
          { text: "Can I work out at home?", action: 'next_stage', nextStage: 5 },
          { text: "Create a personalized plan", action: 'ai' },
          { text: "I'll explore the planner myself", action: 'end' },
        ]
      },
      {
        message: "Our Exercise Library contains 1000+ exercises with video demonstrations, form tips, and modification options. You can filter by muscle group, equipment needed, difficulty level, or workout type to find exactly what you need.",
        options: [
          { text: "Are there yoga exercises?", action: 'ai' },
          { text: "Show me bodyweight exercises", action: 'ai' },
          { text: "I'll browse the library myself", action: 'end' },
        ]
      },
      {
        message: "Progress tracking lets you log workouts, record weights and reps, track measurements, and see visual progress through charts and graphs. You can set goals, earn achievements, and see your improvement over time.",
        options: [
          { text: "Can I track personal records?", action: 'next_stage', nextStage: 6 },
          { text: "How often should I measure progress?", action: 'ai' },
          { text: "This sounds perfect for me!", action: 'end' },
        ]
      },
      {
        message: "That's perfect! We have special beginner-friendly plans that focus on proper form and gradual progression. They include extra guidance, simpler exercises, and more recovery time to help you build a strong foundation without injury or burnout.",
        options: [
          { text: "How long are beginner workouts?", action: 'next_stage', nextStage: 7 },
          { text: "Create a beginner plan for me", action: 'ai' },
          { text: "Thanks, that's reassuring!", action: 'end' },
        ]
      },
      {
        message: "Absolutely! We have numerous home workout plans requiring minimal or no equipment. You can filter specifically for home-friendly exercises, and our system will create routines using the space and equipment you have available.",
        options: [
          { text: "What if I have small space?", action: 'ai' },
          { text: "Create a home workout plan", action: 'ai' },
          { text: "Great, that works for me!", action: 'end' },
        ]
      },
      {
        message: "Yes! You can track personal records for any exercise. The system automatically highlights when you set a new PR, keeps a history of your best performances, and even suggests which records you might be ready to break in upcoming workouts.",
        options: [
          { text: "Can I share my achievements?", action: 'ai' },
          { text: "View my fitness dashboard", action: 'ai' },
          { text: "That's motivating, thanks!", action: 'end' },
        ]
      },
      {
        message: "Beginner workouts typically start at 20-30 minutes and focus on quality over quantity. They include proper warm-ups, rest periods, and cool-downs. As your fitness improves, you can gradually increase duration and intensity.",
        options: [
          { text: "That sounds manageable!", action: 'end' },
          { text: "I have another question...", action: 'ai' },
        ]
      },
    ]
  },
  emergency_prep: {
    title: "Emergency Preparedness",
    description: "Resources for emergency situations!",
    stages: [
      {
        message: "Our Emergency Preparedness section provides quick access to first aid guides, emergency checklists, disaster preparedness plans, and local emergency resources. What would you like to explore?",
        options: [
          { text: "Tell me about first aid guides", action: 'next_stage', nextStage: 1 },
          { text: "What emergency checklists are available?", action: 'next_stage', nextStage: 2 },
          { text: "How does disaster preparedness work?", action: 'next_stage', nextStage: 3 },
          { text: "I'd like to explore another area", action: 'end' },
        ]
      },
      {
        message: "Our First Aid guides cover common emergencies with step-by-step instructions, illustrations, and video demonstrations. They're designed to be quickly accessible offline and include clear, concise directions for various situations.",
        options: [
          { text: "Are these medically reviewed?", action: 'next_stage', nextStage: 4 },
          { text: "Show me the CPR guide", action: 'ai' },
          { text: "View all first aid guides", action: 'ai' },
          { text: "Thanks for explaining!", action: 'end' },
        ]
      },
      {
        message: "We offer emergency checklists for home safety, car emergency kits, evacuation plans, emergency contact lists, and document preparation. Each checklist is downloadable, printable, and can be customized to your specific needs.",
        options: [
          { text: "Tell me about evacuation plans", action: 'ai' },
          { text: "View home safety checklist", action: 'ai' },
          { text: "I'll check these out!", action: 'end' },
        ]
      },
      {
        message: "Our Disaster Preparedness section helps you create plans for specific scenarios (earthquakes, floods, fires, etc.) based on your location. It includes supply lists, communication plans, shelter information, and recovery resources.",
        options: [
          { text: "How do I create a family plan?", action: 'next_stage', nextStage: 5 },
          { text: "Show disaster risks for my area", action: 'ai' },
          { text: "This is really important!", action: 'end' },
        ]
      },
      {
        message: "Yes! All our first aid content is developed and regularly reviewed by certified emergency medical professionals, follows American Red Cross and American Heart Association guidelines, and is updated to reflect the latest medical recommendations.",
        options: [
          { text: "How often is it updated?", action: 'ai' },
          { text: "That's reassuring, thanks!", action: 'end' },
        ]
      },
      {
        message: "The Family Emergency Plan wizard walks you through creating meeting locations, communication strategies, and role assignments for various scenarios. It generates a shareable plan for all family members with important contacts and procedures.",
        options: [
          { text: "Create my family plan now", action: 'ai' },
          { text: "Tell me more about communication strategies", action: 'ai' },
          { text: "I'll work on this soon, thanks!", action: 'end' },
        ]
      },
    ]
  },
};

export default function PostTourGuide() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { triggerAIEvent } = useAIEventStore();
  
  // State for the post-tour guide
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userName, setUserName] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Current path and stage tracking
  const [currentPath, setCurrentPath] = useState<GuidePath>('getting_started');
  const [currentStage, setCurrentStage] = useState(0);
  
  // Onboarding progress tracking
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress>({
    completedPaths: [],
    interactions: 0,
    maxFreeInteractions: 8, // Limit of free guided interactions
  });
  
  // Check if tour was completed and get user name
  useEffect(() => {
    const checkTourCompletion = () => {
      const hasCompletedTourRecently = localStorage.getItem('tourCompletedTimestamp');
      const tourUserName = localStorage.getItem('tourUserName');
      
      if (hasCompletedTourRecently) {
        const completionTime = parseInt(hasCompletedTourRecently, 10);
        const currentTime = new Date().getTime();
        
        // If tour was completed in the last minute (to catch our 2-second delay)
        if (currentTime - completionTime < 60000) {
          if (tourUserName) {
            setUserName(tourUserName);
          }
          
          // Wait 2 seconds before showing the post-tour guide
          setTimeout(() => {
            setIsActive(true);
          }, 2000);
        }
      }
    };
    
    checkTourCompletion();
    
    // Check for stored progress
    const storedProgress = localStorage.getItem('postTourProgress');
    if (storedProgress) {
      try {
        setOnboardingProgress(JSON.parse(storedProgress));
      } catch (e) {
        console.error('Failed to parse stored onboarding progress');
      }
    }
  }, []);
  
  // Save progress when it changes
  useEffect(() => {
    if (onboardingProgress.interactions > 0) {
      localStorage.setItem('postTourProgress', JSON.stringify(onboardingProgress));
    }
  }, [onboardingProgress]);
  
  // Process the current message to include user name if available
  const processMessage = (message: string): string => {
    if (!userName) return message;
    
    // Include name occasionally (1/3 chance) if available to sound natural
    if (Math.random() < 0.33) {
      const firstName = userName.split(' ')[0];
      const insertPos = message.indexOf('!') + 1 || message.indexOf('.') + 1 || message.indexOf('?') + 1;
      
      if (insertPos > 0 && insertPos < message.length - 10) {
        return message.slice(0, insertPos) + ` ${firstName},` + message.slice(insertPos);
      }
    }
    
    return message;
  };
  
  // Get current stage content
  const getCurrentContent = () => {
    const path = guidePaths[currentPath];
    const stage = path.stages[currentStage];
    
    if (!stage) return null;
    
    return {
      ...stage,
      message: processMessage(stage.message),
    };
  };
  
  // Handle option selection
  const handleOptionSelect = async (option: {
    text: string;
    action: 'next_stage' | 'new_path' | 'end' | 'ai';
    nextStage?: number;
    nextPath?: GuidePath;
  }) => {
    // Track interaction
    const newInteractions = onboardingProgress.interactions + 1;
    const hasExceededFree = newInteractions > onboardingProgress.maxFreeInteractions;
    
    setOnboardingProgress(prev => ({
      ...prev,
      interactions: newInteractions,
    }));
    
    // If exceeded free limit and trying to do guided navigation,
    // redirect to AI with a friendly upgrade prompt
    if (hasExceededFree && option.action !== 'ai' && option.action !== 'end') {
      setIsAIMode(true);
      setShowOptions(false);
      setAiResponse("You've used all your guided navigation sessions! But don't worry, I can still help. What would you like to know about Fundamenta?");
      return;
    }
    
    // Handle different action types
    switch (option.action) {
      case 'next_stage':
        if (option.nextStage !== undefined) {
          setCurrentStage(option.nextStage);
        }
        break;
        
      case 'new_path':
        if (option.nextPath) {
          setCurrentPath(option.nextPath);
          setCurrentStage(0);
          
          // Track completed paths
          if (!onboardingProgress.completedPaths.includes(currentPath)) {
            setOnboardingProgress(prev => ({
              ...prev,
              completedPaths: [...prev.completedPaths, currentPath],
            }));
          }
        }
        break;
        
      case 'end':
        setIsActive(false);
        break;
        
      case 'ai':
        setIsAIMode(true);
        setShowOptions(false);
        setUserQuestion(option.text);
        
        // Process AI request
        handleAIRequest(option.text);
        break;
    }
  };
  
  // Handle AI request
  const handleAIRequest = async (question: string) => {
    setIsLoading(true);
    
    try {
      // Trigger the Fundi AI assistant using the AI event system
      triggerAIEvent({
        type: 'assistant_question',
        payload: {
          question,
          category: currentPath,
          source: 'post_tour_guide'
        }
      });
      
      // Also dispatch a DOM event as a backup method
      const customEvent = new CustomEvent('ai:assistant-question', { 
        detail: { 
          question: question,
          category: currentPath,
          source: 'post_tour_guide'
        } 
      });
      document.dispatchEvent(customEvent);
      
      // Create a custom event specifically for Fundi to open
      const openFundiEvent = new CustomEvent('forceFundiOpen', { 
        detail: { position: { x: 0, y: 0 } }
      });
      window.dispatchEvent(openFundiEvent);
      
      // For now, we'll just close this component as the AI assistant will open
      setIsActive(false);
      
    } catch (error) {
      console.error('Failed to process AI request:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not connect to the assistant. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // For directly typing a question
  const handleSubmitQuestion = () => {
    if (!userQuestion.trim() || isLoading) return;
    
    handleAIRequest(userQuestion);
  };
  
  // Close the guide
  const handleClose = () => {
    setIsActive(false);
  };
  
  if (!isActive) return null;
  
  const currentContent = getCurrentContent();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-[340px] shadow-lg border-2 border-primary/20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">
                {guidePaths[currentPath].title}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 rounded-full"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="py-2">
                  <p className="text-sm leading-relaxed">
                    {currentContent?.message || "How can I help you explore Fundamenta?"}
                  </p>
                </div>

                {aiResponse && (
                  <div className="bg-primary/10 p-3 rounded-lg text-sm">
                    <p>{aiResponse}</p>
                  </div>
                )}

                {/* Options or AI mode */}
                {isAIMode ? (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <Input
                        placeholder="Ask me anything..."
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmitQuestion()}
                        className="text-sm"
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        onClick={handleSubmitQuestion}
                        disabled={!userQuestion.trim() || isLoading}
                        className="shrink-0"
                      >
                        {isLoading ? "..." : "Ask"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  showOptions && currentContent?.options && (
                    <div className="grid gap-2">
                      {currentContent.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start text-sm h-auto py-2 px-3 whitespace-normal"
                          onClick={() => handleOptionSelect(option)}
                          disabled={isLoading}
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  )
                )}

                {/* Progress indicator for guided paths */}
                {!isAIMode && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div>
                      {onboardingProgress.interactions < onboardingProgress.maxFreeInteractions ? (
                        `${onboardingProgress.maxFreeInteractions - onboardingProgress.interactions} guided responses left`
                      ) : (
                        "AI assistant available for more help"
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}