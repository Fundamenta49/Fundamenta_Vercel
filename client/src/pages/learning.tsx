import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  BookOpen, 
  Code, 
  PenTool, 
  Languages, 
  Calculator,
  Music, 
  GraduationCap,
  ChevronRight,
  BookIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';

interface CourseCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
  new?: boolean;
}

export default function Learning() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);

  // Define course categories with their respective courses
  const coursesByCategory: Record<string, CourseCard[]> = {
    'academics': [
      {
        id: 'economics',
        title: 'Economics',
        description: 'Learn about markets, supply and demand, and economic policies',
        icon: <Calculator className="h-5 w-5" />,
        color: 'bg-orange-500',
        path: '/learning/courses/economics',
        level: 'beginner',
        popular: true
      },
      {
        id: 'mathematics',
        title: 'Mathematics',
        description: 'From algebra to calculus and practical applications',
        icon: <Calculator className="h-5 w-5" />,
        color: 'bg-blue-500',
        path: '/learning/courses/mathematics',
        level: 'intermediate'
      },
      {
        id: 'literature',
        title: 'Literature',
        description: 'Explore classic and contemporary works',
        icon: <BookOpen className="h-5 w-5" />,
        color: 'bg-purple-600',
        path: '/learning/courses/literature',
        level: 'beginner'
      }
    ],
    'professional': [
      {
        id: 'programming',
        title: 'Programming',
        description: 'Learn to code with JavaScript, Python, and more',
        icon: <Code className="h-5 w-5" />,
        color: 'bg-blue-600',
        path: '/learning/courses/programming',
        level: 'beginner',
        popular: true
      },
      {
        id: 'public-speaking',
        title: 'Public Speaking',
        description: 'Build confidence and deliver impactful speeches',
        icon: <PenTool className="h-5 w-5" />,
        color: 'bg-yellow-600',
        path: '/learning/courses/public-speaking',
        level: 'beginner'
      },
      {
        id: 'marketing',
        title: 'Digital Marketing',
        description: 'Master social media, SEO, and online campaigns',
        icon: <GraduationCap className="h-5 w-5" />,
        color: 'bg-green-600',
        path: '/learning/courses/marketing',
        level: 'intermediate',
        new: true
      }
    ],
    'languages': [
      {
        id: 'spanish',
        title: 'Spanish',
        description: 'Learn one of the world\'s most spoken languages',
        icon: <Languages className="h-5 w-5" />,
        color: 'bg-red-500',
        path: '/learning/courses/spanish',
        level: 'beginner',
        popular: true
      },
      {
        id: 'mandarin',
        title: 'Mandarin Chinese',
        description: 'Master the basics of this widely spoken language',
        icon: <Languages className="h-5 w-5" />,
        color: 'bg-yellow-500',
        path: '/learning/courses/mandarin',
        level: 'intermediate'
      },
      {
        id: 'french',
        title: 'French',
        description: 'Learn the language of diplomacy and culture',
        icon: <Languages className="h-5 w-5" />,
        color: 'bg-blue-400',
        path: '/learning/courses/french',
        level: 'beginner'
      }
    ],
    'creative': [
      {
        id: 'photography',
        title: 'Photography',
        description: 'Capture stunning images with any camera',
        icon: <PenTool className="h-5 w-5" />,
        color: 'bg-gray-700',
        path: '/learning/courses/photography',
        level: 'beginner'
      },
      {
        id: 'music',
        title: 'Music Basics',
        description: 'Theory, appreciation, and instrument fundamentals',
        icon: <Music className="h-5 w-5" />,
        color: 'bg-purple-500',
        path: '/learning/courses/music',
        level: 'beginner'
      },
      {
        id: 'creative-writing',
        title: 'Creative Writing',
        description: 'Develop your storytelling and creative expression',
        icon: <PenTool className="h-5 w-5" />,
        color: 'bg-teal-600',
        path: '/learning/courses/creative-writing',
        level: 'beginner',
        new: true
      }
    ]
  };

  // Function to render a course card
  const CourseCard = ({ course }: { course: CourseCard }) => (
    <Card className="h-full transition-all hover:shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <div className={`rounded-full p-2 ${course.color} text-white`}>
            {course.icon}
          </div>
          <div className="flex gap-2">
            {course.popular && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Popular
              </span>
            )}
            {course.new && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                New
              </span>
            )}
            <span className={`px-2 py-1 text-xs rounded-full ${
              course.level === 'beginner' ? 'bg-green-100 text-green-800' :
              course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>
        </div>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button 
          variant="ghost"
          className="w-full justify-between"
          onClick={() => navigate(course.path)}
        >
          Explore Course <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Function to render a category of courses
  const CourseCategory = ({ 
    title, courses 
  }: { 
    title: string; 
    courses: CourseCard[];
  }) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Button variant="link" className="text-orange-500">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <Button 
            onClick={() => setShowChat(!showChat)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <BookIcon className="mr-2 h-4 w-4" />
            Ask Learning Coach
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {Object.entries(coursesByCategory).map(([category, courses]) => (
              <CourseCategory 
                key={category} 
                title={category.charAt(0).toUpperCase() + category.slice(1)} 
                courses={courses} 
              />
            ))}
          </TabsContent>

          <TabsContent value="academics">
            <CourseCategory 
              title="Academic Courses" 
              courses={coursesByCategory.academics} 
            />
          </TabsContent>

          <TabsContent value="professional">
            <CourseCategory 
              title="Professional Development" 
              courses={coursesByCategory.professional} 
            />
          </TabsContent>

          <TabsContent value="languages">
            <CourseCategory 
              title="Language Learning" 
              courses={coursesByCategory.languages} 
            />
          </TabsContent>

          <TabsContent value="creative">
            <CourseCategory 
              title="Creative Skills" 
              courses={coursesByCategory.creative} 
            />
          </TabsContent>
        </Tabs>
      </div>

      {showChat ? (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      ) : (
        <FloatingChat category={LEARNING_CATEGORY} />
      )}
    </div>
  );
}