import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { 
  BookOpen, 
  Code, 
  PenTool, 
  Languages, 
  Calculator,
  Music, 
  GraduationCap,
  BookIcon,
  Car,
  Wrench,
  Utensils,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog";

// Define course type
interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
  new?: boolean;
}

// Convert the icon components to match the BookCard component requirements
const Icons = {
  BookOpen: BookOpen as React.ComponentType<{ className?: string }>,
  Code: Code as React.ComponentType<{ className?: string }>,
  PenTool: PenTool as React.ComponentType<{ className?: string }>,
  Languages: Languages as React.ComponentType<{ className?: string }>,
  Calculator: Calculator as React.ComponentType<{ className?: string }>,
  Music: Music as React.ComponentType<{ className?: string }>,
  GraduationCap: GraduationCap as React.ComponentType<{ className?: string }>,
  Car: Car as React.ComponentType<{ className?: string }>,
  Wrench: Wrench as React.ComponentType<{ className?: string }>,
  Utensils: Utensils as React.ComponentType<{ className?: string }>,
  Heart: Heart as React.ComponentType<{ className?: string }>,
};

export default function Learning() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Course expansion states
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  // Group courses by categories
  const LIFE_SKILLS: Course[] = [
    {
      id: 'vehicle-maintenance',
      title: 'Vehicle Maintenance',
      description: 'Learn essential car maintenance skills and save money on repairs',
      icon: Icons.Car,
      path: '/learning/courses/vehicle-maintenance',
      level: 'beginner',
      popular: true
    },
    {
      id: 'home-maintenance',
      title: 'Home Maintenance',
      description: 'Master basic home repairs and maintenance tasks',
      icon: Icons.Wrench,
      path: '/learning/courses/home-maintenance',
      level: 'beginner',
      popular: true
    },
    {
      id: 'cooking-basics',
      title: 'Cooking Basics',
      description: 'Learn fundamental cooking techniques and healthy meal preparation',
      icon: Icons.Utensils,
      path: '/learning/courses/cooking-basics',
      level: 'beginner'
    },
    {
      id: 'public-speaking',
      title: 'Public Speaking',
      description: 'Build confidence and deliver impactful speeches',
      icon: Icons.PenTool,
      path: '/learning/courses/public-speaking',
      level: 'beginner'
    }
  ];
  
  const ACADEMICS: Course[] = [
    {
      id: 'economics',
      title: 'Economics',
      description: 'Learn about markets, supply and demand, and economic policies',
      icon: Icons.Calculator,
      path: '/learning/courses/economics',
      level: 'beginner',
      popular: true
    },
    {
      id: 'mathematics',
      title: 'Mathematics',
      description: 'From algebra to calculus and practical applications',
      icon: Icons.Calculator,
      path: '/learning/courses/mathematics',
      level: 'intermediate'
    },
    {
      id: 'literature',
      title: 'Literature',
      description: 'Explore classic and contemporary works',
      icon: Icons.BookOpen,
      path: '/learning/courses/literature',
      level: 'beginner'
    }
  ];
  
  const PROFESSIONAL: Course[] = [
    {
      id: 'programming',
      title: 'Programming',
      description: 'Learn to code with JavaScript, Python, and more',
      icon: Icons.Code,
      path: '/learning/courses/programming',
      level: 'beginner',
      popular: true
    },
    {
      id: 'marketing',
      title: 'Digital Marketing',
      description: 'Master social media, SEO, and online campaigns',
      icon: Icons.GraduationCap,
      path: '/learning/courses/marketing',
      level: 'intermediate',
      new: true
    }
  ];
  
  const LANGUAGES: Course[] = [
    {
      id: 'spanish',
      title: 'Spanish',
      description: 'Learn one of the world\'s most spoken languages',
      icon: Icons.Languages,
      path: '/learning/courses/spanish',
      level: 'beginner',
      popular: true
    },
    {
      id: 'mandarin',
      title: 'Mandarin Chinese',
      description: 'Master the basics of this widely spoken language',
      icon: Icons.Languages,
      path: '/learning/courses/mandarin',
      level: 'intermediate'
    },
    {
      id: 'french',
      title: 'French',
      description: 'Learn the language of diplomacy and culture',
      icon: Icons.Languages,
      path: '/learning/courses/french',
      level: 'beginner'
    }
  ];
  
  const CREATIVE: Course[] = [
    {
      id: 'photography',
      title: 'Photography',
      description: 'Capture stunning images with any camera',
      icon: Icons.PenTool,
      path: '/learning/courses/photography',
      level: 'beginner'
    },
    {
      id: 'music',
      title: 'Music Basics',
      description: 'Theory, appreciation, and instrument fundamentals',
      icon: Icons.Music,
      path: '/learning/courses/music',
      level: 'beginner'
    },
    {
      id: 'creative-writing',
      title: 'Creative Writing',
      description: 'Develop your storytelling and creative expression',
      icon: Icons.PenTool,
      path: '/learning/courses/creative-writing',
      level: 'beginner',
      new: true
    }
  ];
  
  // Combine all courses, with life skills first as requested
  const COURSES: Course[] = [
    ...LIFE_SKILLS,
    ...ACADEMICS,
    ...PROFESSIONAL,
    ...LANGUAGES,
    ...CREATIVE
  ];

  const handleCardClick = (courseId: string) => {
    // If the card is already expanded, navigate to its path
    if (expandedCourse === courseId) {
      const course = COURSES.find(c => c.id === courseId);
      if (course) {
        navigate(course.path);
      }
    } else {
      // Otherwise just expand it
      setExpandedCourse(courseId);
    }
  };

  // Check sessionStorage for courses to open on mount
  useEffect(() => {
    const openCourse = sessionStorage.getItem('openCourse');
    if (openCourse) {
      handleCardClick(openCourse);
      // Clear after using
      sessionStorage.removeItem('openCourse');
    }
    
    // Listen for AI open section events
    const handleOpenSectionEvent = (event: CustomEvent) => {
      const { route, section } = event.detail;
      // Only handle if this is the current page
      if (route === '/learning') {
        handleCardClick(section);
      }
    };
    
    // Add event listener
    document.addEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    };
  }, []);

  // Create course content components
  const renderCourseContent = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return null;

    return (
      <div className="py-4">
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            course.level === 'beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
          
          {course.popular && (
            <span className="inline-block ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Popular
            </span>
          )}
          
          {course.new && (
            <span className="inline-block ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              New
            </span>
          )}
        </div>
        
        <p className="text-gray-700 mb-6">{course.description}</p>
        
        <Button 
          variant="default"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => navigate(course.path)}
        >
          Start Learning
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Learning Hub
      </h1>
      
      <div className="mx-4 sm:mx-6 mb-6 flex justify-end">
        <Button 
          onClick={() => setShowChat(!showChat)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <BookIcon className="mr-2 h-4 w-4" />
          Ask Learning Coach
        </Button>
      </div>

      {/* Categories with book-style cards */}
      <div className="px-4 sm:px-6">
        {/* Life Skills Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 px-2 py-2 bg-orange-50 text-orange-800 rounded-md border-l-4 border-orange-500">
            Life Skills
          </h2>
          <div ref={carouselRef} className="book-carousel">
            <BookCarousel>
              {LIFE_SKILLS.map((course) => (
                <BookPage key={course.id} id={course.id}>
                  <BookCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    icon={course.icon}
                    isExpanded={expandedCourse === course.id}
                    onToggle={handleCardClick}
                    color="text-orange-500" // Learning section color
                    children={renderCourseContent(course.id)}
                  />
                </BookPage>
              ))}
            </BookCarousel>
          </div>
        </div>
        
        {/* Academic Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 px-2 py-2 bg-blue-50 text-blue-800 rounded-md border-l-4 border-blue-500">
            Academic
          </h2>
          <div className="book-carousel">
            <BookCarousel>
              {ACADEMICS.map((course) => (
                <BookPage key={course.id} id={course.id}>
                  <BookCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    icon={course.icon}
                    isExpanded={expandedCourse === course.id}
                    onToggle={handleCardClick}
                    color="text-blue-500"
                    children={renderCourseContent(course.id)}
                  />
                </BookPage>
              ))}
            </BookCarousel>
          </div>
        </div>
        
        {/* Professional Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 px-2 py-2 bg-green-50 text-green-800 rounded-md border-l-4 border-green-500">
            Professional
          </h2>
          <div className="book-carousel">
            <BookCarousel>
              {PROFESSIONAL.map((course) => (
                <BookPage key={course.id} id={course.id}>
                  <BookCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    icon={course.icon}
                    isExpanded={expandedCourse === course.id}
                    onToggle={handleCardClick}
                    color="text-green-500"
                    children={renderCourseContent(course.id)}
                  />
                </BookPage>
              ))}
            </BookCarousel>
          </div>
        </div>
        
        {/* Languages Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 px-2 py-2 bg-purple-50 text-purple-800 rounded-md border-l-4 border-purple-500">
            Languages
          </h2>
          <div className="book-carousel">
            <BookCarousel>
              {LANGUAGES.map((course) => (
                <BookPage key={course.id} id={course.id}>
                  <BookCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    icon={course.icon}
                    isExpanded={expandedCourse === course.id}
                    onToggle={handleCardClick}
                    color="text-purple-500"
                    children={renderCourseContent(course.id)}
                  />
                </BookPage>
              ))}
            </BookCarousel>
          </div>
        </div>
        
        {/* Creative Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 px-2 py-2 bg-pink-50 text-pink-800 rounded-md border-l-4 border-pink-500">
            Creative
          </h2>
          <div className="book-carousel">
            <BookCarousel>
              {CREATIVE.map((course) => (
                <BookPage key={course.id} id={course.id}>
                  <BookCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    icon={course.icon}
                    isExpanded={expandedCourse === course.id}
                    onToggle={handleCardClick}
                    color="text-pink-500"
                    children={renderCourseContent(course.id)}
                  />
                </BookPage>
              ))}
            </BookCarousel>
          </div>
        </div>
      </div>

      {/* Always show either the pop-out chat or the floating chat */}
      {showChat ? (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      ) : (
        <FloatingChat category={LEARNING_CATEGORY} />
      )}
    </div>
  );
}