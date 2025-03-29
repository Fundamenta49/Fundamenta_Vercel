import { useState } from 'react';
import { useLocation } from 'wouter';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QuizComponent, { QuizQuestion } from '@/components/quiz-component';
import ResourceLinks, { Resource } from '@/components/resource-links';

export default function HealthWellnessCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to health and wellness
  const resources: Resource[] = [
    {
      id: "1",
      title: "Physical Activity Guidelines",
      url: "https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines",
      description: "Official physical activity recommendations for Americans",
      type: "article",
      level: "beginner",
      free: true
    },
    {
      id: "2",
      title: "Meditation for Beginners",
      url: "https://www.youtube.com/c/Headspace",
      description: "Simple guided meditation videos for stress reduction",
      type: "video",
      level: "beginner",
      free: true
    },
    {
      id: "3",
      title: "MyPlate Food Guide",
      url: "https://www.myplate.gov/",
      description: "Nutrition guidance and meal planning resources",
      type: "book",
      level: "beginner",
      free: true
    },
    {
      id: "4",
      title: "r/Fitness",
      url: "https://www.reddit.com/r/Fitness/",
      description: "Community forum for fitness advice and motivation",
      type: "practice",
      level: "intermediate",
      free: true
    },
    {
      id: "5",
      title: "Sleep Calculator",
      url: "https://sleepcalculator.com/",
      description: "Calculate optimal bedtimes based on sleep cycles",
      type: "tool",
      level: "beginner",
      free: true
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
          <Heart className="h-6 w-6 mr-2 text-orange-500" />
          Health & Wellness
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant={activeTab === 'learn' ? 'default' : 'outline'}
          className={activeTab === 'learn' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('learn')}
        >
          Learn
        </Button>
        <Button
          variant={activeTab === 'practice' ? 'default' : 'outline'}
          className={activeTab === 'practice' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('practice')}
        >
          Test Your Knowledge
        </Button>
        <Button
          variant={activeTab === 'resources' ? 'default' : 'outline'}
          className={activeTab === 'resources' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </Button>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction to Health & Wellness</CardTitle>
              <CardDescription>
                Taking care of your physical and mental wellbeing is essential for a balanced, productive life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Health and wellness encompasses physical, mental, and emotional wellbeing. Understanding how to maintain a balanced lifestyle is crucial for long-term health, productivity, and happiness.
              </p>
              <p className="mb-4">
                In this module, you'll learn about nutrition basics, exercise fundamentals, stress management techniques, sleep hygiene, and mindfulness practices. These tools will help you create sustainable habits for a healthier lifestyle.
              </p>
              <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mb-4">
                <h3 className="font-semibold text-amber-800 mb-2">Coming Soon!</h3>
                <p className="text-amber-700">
                  We're currently developing comprehensive health and wellness guides. Check back soon for interactive health assessments and personalized wellness plans!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>5 Pillars of Wellness</CardTitle>
              <CardDescription>
                Core areas to focus on for a balanced, healthy lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">1. Physical Health</h3>
                  <p>Regular exercise, balanced nutrition, adequate sleep, and preventive healthcare create the foundation for wellness. Aim for 150 minutes of moderate activity weekly, eat a variety of whole foods, and prioritize 7-9 hours of quality sleep.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">2. Mental & Emotional Wellbeing</h3>
                  <p>Practicing stress management, mindfulness, and emotional regulation helps build resilience. Consider meditation, journaling, or therapy as tools to support mental health.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">3. Social Connection</h3>
                  <p>Meaningful relationships and community involvement support overall wellbeing. Schedule regular time with friends and family, join clubs or groups with shared interests, and practice active listening.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">4. Purpose & Personal Growth</h3>
                  <p>Setting meaningful goals, learning new skills, and engaging in activities that provide a sense of purpose contributes to life satisfaction. Identify values that matter to you and align your activities accordingly.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">5. Environmental Wellness</h3>
                  <p>Creating supportive physical environments and developing sustainable practices. Organize your living space, spend time in nature, and consider how your lifestyle impacts the broader environment.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about health and wellness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Health and Wellness"
                difficulty="beginner"
                questions={[
                  {
                    id: 1,
                    question: "How much moderate-intensity physical activity is recommended weekly for adults?",
                    options: [
                      "30 minutes once a week", 
                      "At least 150 minutes per week", 
                      "10 minutes per day", 
                      "Only when feeling stressed"
                    ],
                    correctAnswer: 1,
                    explanation: "The CDC and WHO recommend at least 150 minutes of moderate-intensity physical activity per week (about 30 minutes, 5 days a week), plus muscle-strengthening activities on 2 or more days per week."
                  },
                  {
                    id: 2,
                    question: "Which of these is NOT a main food group according to USDA's MyPlate guidelines?",
                    options: [
                      "Fruits", 
                      "Vegetables", 
                      "Proteins", 
                      "Sugars"
                    ],
                    correctAnswer: 3,
                    explanation: "The five main food groups in the USDA's MyPlate guidelines are Fruits, Vegetables, Proteins, Grains, and Dairy. Sugars and added fats are not considered a food group but are recommended to be limited."
                  },
                  {
                    id: 3,
                    question: "What is an effective technique for stress management?",
                    options: [
                      "Consuming caffeine to stay alert", 
                      "Practicing regular mindfulness meditation", 
                      "Avoiding all challenging situations", 
                      "Working longer hours"
                    ],
                    correctAnswer: 1,
                    explanation: "Regular mindfulness meditation has been shown to reduce stress, anxiety, and depression while improving focus and emotional regulation. Even short daily sessions (5-10 minutes) can provide benefits."
                  },
                  {
                    id: 4,
                    question: "How many hours of sleep are generally recommended for adults?",
                    options: [
                      "4-5 hours", 
                      "5-6 hours", 
                      "7-9 hours", 
                      "10-12 hours"
                    ],
                    correctAnswer: 2,
                    explanation: "The National Sleep Foundation recommends that adults get 7-9 hours of quality sleep per night. Consistent sleep schedules, a comfortable environment, and limiting screen time before bed all contribute to better sleep."
                  },
                  {
                    id: 5,
                    question: "Which is generally considered a healthy way to approach nutrition?",
                    options: [
                      "Completely eliminating all carbohydrates", 
                      "Eating only one large meal daily", 
                      "Following strict detox diets monthly", 
                      "Eating a balanced diet with a variety of whole foods"
                    ],
                    correctAnswer: 3,
                    explanation: "A balanced diet containing a variety of whole foods provides the necessary nutrients for optimal health. Most nutritionists recommend emphasizing fruits, vegetables, whole grains, lean proteins, and healthy fats while limiting processed foods, added sugars and excessive salt."
                  }
                ]}
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
          <ResourceLinks 
            subject="Health & Wellness"
            resources={resources}
          />
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}