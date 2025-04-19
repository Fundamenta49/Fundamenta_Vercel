import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  BriefcaseBusiness, 
  Heart, 
  Brain, 
  Lightbulb, 
  School, 
  Settings, 
  PenTool, 
  Users, 
  ChevronRight,
  BarChart
} from 'lucide-react';

// RAISEC (Holland Code) assessment questions
// R - Realistic, A - Artistic, I - Investigative, S - Social, E - Enterprising, C - Conventional
const ASSESSMENT_QUESTIONS = [
  // Realistic questions
  {
    id: 1,
    question: "I enjoy working with tools, machines, or my hands",
    category: "realistic"
  },
  {
    id: 2,
    question: "I prefer practical, hands-on problems to theoretical ones",
    category: "realistic"
  },
  {
    id: 3,
    question: "I like building or fixing physical things",
    category: "realistic"
  },
  {
    id: 4,
    question: "I enjoy working outdoors or with plants and animals",
    category: "realistic"
  },
  
  // Artistic questions
  {
    id: 5,
    question: "I enjoy expressing myself creatively",
    category: "artistic"
  },
  {
    id: 6,
    question: "I value aesthetic qualities and artistic expression",
    category: "artistic"
  },
  {
    id: 7,
    question: "I like work that allows me to express my individuality",
    category: "artistic"
  },
  {
    id: 8,
    question: "I enjoy activities that involve visual arts, music, or writing",
    category: "artistic"
  },
  
  // Investigative questions
  {
    id: 9,
    question: "I enjoy learning about complex subjects and solving puzzles",
    category: "investigative"
  },
  {
    id: 10,
    question: "I like analyzing data and finding patterns",
    category: "investigative"
  },
  {
    id: 11,
    question: "I'm curious about how and why things work",
    category: "investigative"
  },
  {
    id: 12,
    question: "I enjoy scientific or mathematical challenges",
    category: "investigative"
  },
  
  // Social questions
  {
    id: 13,
    question: "I enjoy working with and helping people",
    category: "social"
  },
  {
    id: 14,
    question: "I'm good at teaching or explaining things to others",
    category: "social"
  },
  {
    id: 15,
    question: "I care about the wellbeing of others",
    category: "social"
  },
  {
    id: 16,
    question: "I'm interested in community service and social issues",
    category: "social"
  },
  
  // Enterprising questions
  {
    id: 17,
    question: "I enjoy persuading or leading others",
    category: "enterprising"
  },
  {
    id: 18,
    question: "I like taking risks and initiating projects",
    category: "enterprising"
  },
  {
    id: 19,
    question: "I enjoy selling things or promoting ideas",
    category: "enterprising"
  },
  {
    id: 20,
    question: "I aspire to positions of leadership or influence",
    category: "enterprising"
  },
  
  // Conventional questions
  {
    id: 21,
    question: "I enjoy organizing information and maintaining records",
    category: "conventional"
  },
  {
    id: 22,
    question: "I like following established procedures and routines",
    category: "conventional"
  },
  {
    id: 23,
    question: "I'm detail-oriented and methodical in my work",
    category: "conventional"
  },
  {
    id: 24,
    question: "I prefer clear expectations and structured environments",
    category: "conventional"
  }
];

// Career paths based on interests
const CAREER_PATHS = [
  {
    id: 'technology',
    title: 'Technology & Data',
    description: 'Careers focused on computing, programming, and data analysis',
    icon: <Settings className="h-8 w-8" />,
    skills: ['Analytical thinking', 'Problem solving', 'Technical aptitude'],
    careers: ['Software Developer', 'Data Scientist', 'IT Manager', 'Systems Analyst']
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Wellness',
    description: 'Careers focused on health, medicine, and wellness',
    icon: <Heart className="h-8 w-8" />,
    skills: ['Empathy', 'Communication', 'Attention to detail'],
    careers: ['Nurse', 'Physical Therapist', 'Healthcare Administrator', 'Medical Researcher']
  },
  {
    id: 'business',
    title: 'Business & Finance',
    description: 'Careers focused on management, finance, and business operations',
    icon: <BriefcaseBusiness className="h-8 w-8" />,
    skills: ['Analytical thinking', 'Leadership', 'Decision making'],
    careers: ['Financial Analyst', 'Marketing Manager', 'Business Consultant', 'Entrepreneur']
  },
  {
    id: 'creative',
    title: 'Arts & Creative',
    description: 'Careers focused on design, writing, and creative expression',
    icon: <PenTool className="h-8 w-8" />,
    skills: ['Creativity', 'Visual thinking', 'Attention to detail'],
    careers: ['Graphic Designer', 'Content Creator', 'UX/UI Designer', 'Creative Director']
  },
  {
    id: 'education',
    title: 'Education & Research',
    description: 'Careers focused on teaching, training, and academic research',
    icon: <School className="h-8 w-8" />,
    skills: ['Communication', 'Patience', 'Subject expertise'],
    careers: ['Teacher', 'Professor', 'Educational Administrator', 'Academic Researcher']
  },
  {
    id: 'social',
    title: 'Social & Community',
    description: 'Careers focused on helping people and building communities',
    icon: <Users className="h-8 w-8" />,
    skills: ['Empathy', 'Communication', 'Problem solving'],
    careers: ['Social Worker', 'Community Organizer', 'Counselor', 'Nonprofit Manager']
  }
];

export default function CareerAssessment() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);
  
  // Calculate progress
  const progress = (currentQuestion / ASSESSMENT_QUESTIONS.length) * 100;
  
  // Handle answer selection
  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: parseInt(value) });
    
    // Move to next question or show results
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };
  
  // Calculate RAISEC assessment results
  const calculateResults = () => {
    // Calculate RAISEC scores from answers
    const scores = {
      realistic: 0,
      artistic: 0,
      investigative: 0,
      social: 0,
      enterprising: 0,
      conventional: 0
    };
    
    // Calculate score for each RAISEC category
    Object.entries(answers).forEach(([questionId, rating]) => {
      const question = ASSESSMENT_QUESTIONS.find(q => q.id === parseInt(questionId));
      if (question) {
        scores[question.category as keyof typeof scores] += rating;
      }
    });
    
    // Normalize scores (convert to percentages)
    const maxPossibleScore = 20; // 4 questions per category, max rating 5
    const normalizedScores = Object.entries(scores).reduce((acc, [category, score]) => {
      acc[category] = Math.round((score / maxPossibleScore) * 100);
      return acc;
    }, {} as Record<string, number>);
    
    // Determine top 3 categories
    const sortedCategories = Object.entries(normalizedScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 3)
      .map(([category]) => category);
    
    // Map top categories to career paths
    // This is a simplified mapping - a real implementation would have more sophisticated matching
    const categoryToPathMapping: Record<string, string> = {
      realistic: 'technology',
      artistic: 'creative',
      investigative: 'education',
      social: 'social',
      enterprising: 'business',
      conventional: 'technology'
    };
    
    const topPathIds = sortedCategories.map(category => categoryToPathMapping[category]);
    const uniquePathIds = [...new Set(topPathIds)]; // Remove duplicates
    const topPaths = uniquePathIds.map(pathId => 
      CAREER_PATHS.find(path => path.id === pathId)
    ).filter(Boolean) as typeof CAREER_PATHS;
    
    // Create a RAISEC code from the top 3 categories (e.g., "RIC" for Realistic, Investigative, Conventional)
    const raisecCode = sortedCategories
      .map(category => category[0].toUpperCase())
      .join('');
    
    setResultsData({
      topPaths,
      strengths: normalizedScores,
      raisecCode
    });
    
    setShowResults(true);
  };
  
  // Reset assessment
  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResultsData(null);
  };
  
  // Current question
  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Career Assessment</h2>
          <p className="text-muted-foreground">
            Discover your strengths and explore career paths that match your interests
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assessment">
            <Brain className="h-4 w-4 mr-2" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="explore">
            <Lightbulb className="h-4 w-4 mr-2" />
            Explore Careers
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart className="h-4 w-4 mr-2" />
            My Insights
          </TabsTrigger>
        </TabsList>
        
        {/* Assessment Tab */}
        <TabsContent value="assessment" className="space-y-6">
          {!showResults ? (
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <CardTitle>Career Interest Assessment</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-xl font-medium">{question.question}</div>
                  
                  <RadioGroup onValueChange={handleAnswer}>
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="r5" />
                        <Label htmlFor="r5">Strongly Agree</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="r4" />
                        <Label htmlFor="r4">Agree</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="r3" />
                        <Label htmlFor="r3">Neutral</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="r2" />
                        <Label htmlFor="r2">Disagree</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="r1" />
                        <Label htmlFor="r1">Strongly Disagree</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? (
                  <Button onClick={calculateResults}>
                    Finish Assessment
                  </Button>
                ) : (
                  <Button disabled={!(currentQuestion in answers)} onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                    Next
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Career Assessment Results</CardTitle>
                  <CardDescription>
                    Based on your responses, we've identified your Holland Code (RAISEC) and career matches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* RAISEC Code Display */}
                  {resultsData && resultsData.raisecCode && (
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <h3 className="text-lg font-medium mb-2">Your Holland Code</h3>
                      <div className="text-3xl font-bold tracking-wider">{resultsData.raisecCode}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your top interest areas form your unique RAISEC code, which helps identify career paths that match your preferences
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Your RAISEC Profile</h3>
                    <div className="space-y-4">
                      {resultsData && Object.entries(resultsData.strengths).map(([key, value]: [string, any]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="capitalize">{key === 'realistic' ? 'Realistic (R)' : 
                              key === 'artistic' ? 'Artistic (A)' : 
                              key === 'investigative' ? 'Investigative (I)' : 
                              key === 'social' ? 'Social (S)' : 
                              key === 'enterprising' ? 'Enterprising (E)' : 
                              'Conventional (C)'}</span>
                            <span>{value}%</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recommended Career Paths</h3>
                    <div className="space-y-4">
                      {resultsData && resultsData.topPaths.map((path: any) => (
                        <Card key={path.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="flex items-center">
                                  {path.icon}
                                  <span className="ml-2">{path.title}</span>
                                </CardTitle>
                                <CardDescription className="mt-2">
                                  {path.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="grid gap-2">
                              <div>
                                <h4 className="text-sm font-medium">Top Careers</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {path.careers.map((career: string, i: number) => (
                                    <div key={i} className="text-sm rounded-md bg-muted px-2 py-1">
                                      {career}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium">Key Skills</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {path.skills.map((skill: string, i: number) => (
                                    <div key={i} className="text-sm rounded-md bg-muted px-2 py-1">
                                      {skill}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => setActiveTab('explore')}
                            >
                              Explore This Path
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={resetAssessment}
                    className="w-full"
                  >
                    Retake Assessment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Explore Careers Tab */}
        <TabsContent value="explore" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAREER_PATHS.map(path => (
              <Card key={path.id}>
                <CardHeader>
                  <div className="p-2 w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-2">
                    {path.icon}
                  </div>
                  <CardTitle>{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Common Careers</h4>
                      <div className="flex flex-wrap gap-2">
                        {path.careers.slice(0, 2).map((career, i) => (
                          <div key={i} className="text-sm rounded-md bg-muted px-2 py-1">
                            {career}
                          </div>
                        ))}
                        {path.careers.length > 2 && (
                          <div className="text-sm rounded-md bg-muted px-2 py-1">
                            +{path.careers.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill, i) => (
                          <div key={i} className="text-sm rounded-md bg-muted px-2 py-1">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Career Path
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Career Insights</CardTitle>
              <CardDescription>
                Complete assessments to build your career profile and get personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Brain className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-center mb-2">No insights available yet</h3>
              <p className="text-muted-foreground text-center mb-6">Complete the career assessment to unlock personalized insights.</p>
              <Button onClick={() => { setActiveTab('assessment'); resetAssessment(); }}>
                Take Assessment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}