import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, BookOpen, ThumbsUp, ThumbsDown, PlayCircle, Mic, CheckCircle, User } from 'lucide-react';

// Interview question categories
const INTERVIEW_CATEGORIES = [
  { id: 'behavioral', name: 'Behavioral', icon: <User className="h-4 w-4" /> },
  { id: 'technical', name: 'Technical', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'situational', name: 'Situational', icon: <MessageSquare className="h-4 w-4" /> }
];

// Sample interview questions
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    category: 'behavioral',
    question: 'Tell me about a time when you had to work under pressure to meet a deadline.',
    tips: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Be specific about your role and contributions',
      'Quantify your results if possible'
    ]
  },
  {
    id: 2,
    category: 'behavioral',
    question: 'Describe a situation where you had to resolve a conflict with a colleague or team member.',
    tips: [
      'Focus on your conflict resolution skills',
      'Emphasize communication and listening',
      'Highlight the positive outcome'
    ]
  },
  {
    id: 3,
    category: 'technical',
    question: 'Explain how you would approach debugging a complex software issue.',
    tips: [
      'Demonstrate your problem-solving methodology',
      'Mention specific tools or techniques you use',
      'Show that you can communicate technical concepts clearly'
    ]
  },
  {
    id: 4,
    category: 'technical',
    question: 'How do you stay updated with new technologies and industry trends?',
    tips: [
      'Mention specific learning resources',
      'Show your passion for continuous learning',
      "Give examples of how you've applied new knowledge"
    ]
  },
  {
    id: 5,
    category: 'situational',
    question: "How would you handle a situation where you disagree with your manager's decision?",
    tips: [
      'Show respect for authority while maintaining integrity',
      'Emphasize constructive communication',
      'Focus on finding common ground and solutions'
    ]
  },
  {
    id: 6,
    category: 'situational',
    question: 'What would you do if you were assigned a project but lacked the necessary skills or knowledge?',
    tips: [
      'Highlight your resourcefulness',
      'Demonstrate your ability to learn quickly',
      'Discuss how you would seek help or resources'
    ]
  }
];

export default function InterviewPractice() {
  const [activeTab, setActiveTab] = useState('questions');
  const [selectedCategory, setSelectedCategory] = useState('behavioral');
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [practicing, setPracticing] = useState(false);
  const [response, setResponse] = useState('');
  
  // Filter questions by category
  const filteredQuestions = SAMPLE_QUESTIONS.filter(
    q => q.category === selectedCategory
  );
  
  // Get selected question details
  const questionDetails = selectedQuestion 
    ? SAMPLE_QUESTIONS.find(q => q.id === selectedQuestion) 
    : null;
  
  // Start practice session
  const startPractice = () => {
    setPracticing(true);
    setResponse('');
  };
  
  // End practice session
  const endPractice = () => {
    setPracticing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Interview Practice</h2>
          <p className="text-muted-foreground">
            Prepare for your next interview with guided practice
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="questions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Questions Library
          </TabsTrigger>
          <TabsTrigger value="mock">
            <Mic className="h-4 w-4 mr-2" />
            Mock Interviews
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <CheckCircle className="h-4 w-4 mr-2" />
            My Progress
          </TabsTrigger>
        </TabsList>
        
        {/* Questions Library Tab */}
        <TabsContent value="questions" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categories</h3>
              <div className="space-y-2">
                {INTERVIEW_CATEGORIES.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedQuestion(null);
                    }}
                  >
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Questions List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Questions</h3>
              <div className="space-y-2">
                {filteredQuestions.map(question => (
                  <Card 
                    key={question.id}
                    className={`cursor-pointer transition-all hover:border-primary ${selectedQuestion === question.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedQuestion(question.id)}
                  >
                    <CardContent className="p-4">
                      <p>{question.question}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Question Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Practice</h3>
              {questionDetails ? (
                <Card>
                  <CardHeader>
                    <Badge className="w-fit mb-2">
                      {INTERVIEW_CATEGORIES.find(c => c.id === questionDetails.category)?.name}
                    </Badge>
                    <CardTitle className="text-lg">{questionDetails.question}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Tips:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {questionDetails.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {practicing ? (
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Type your response here..." 
                          className="min-h-[150px]"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <Button onClick={endPractice} variant="outline">
                            Cancel
                          </Button>
                          <Button disabled={!response.trim()}>
                            Submit for Feedback
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={startPractice}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Practice Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a question</h3>
                    <p className="text-muted-foreground">Choose a question from the list to practice your interview skills.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Mock Interviews Tab */}
        <TabsContent value="mock" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>General Interview</CardTitle>
                <CardDescription>
                  A mix of common interview questions for any position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  10 questions • 30 minutes • Beginner friendly
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Behavioral</span>
                    <span className="text-sm">60%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Situational</span>
                    <span className="text-sm">30%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical</span>
                    <span className="text-sm">10%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Mock Interview</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Interview</CardTitle>
                <CardDescription>
                  Focused on technical skills and problem-solving
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  8 questions • 45 minutes • Intermediate level
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical</span>
                    <span className="text-sm">70%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Problem-solving</span>
                    <span className="text-sm">20%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Behavioral</span>
                    <span className="text-sm">10%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Mock Interview</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Leadership Interview</CardTitle>
                <CardDescription>
                  For management and leadership positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  12 questions • 40 minutes • Advanced level
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Leadership</span>
                    <span className="text-sm">50%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Situational</span>
                    <span className="text-sm">30%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Strategic</span>
                    <span className="text-sm">20%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Mock Interview</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Custom Interview</CardTitle>
                <CardDescription>
                  Build your own interview practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input placeholder="e.g., Software Engineer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Select defaultValue="tech">
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <Select defaultValue="mid">
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid-Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Create Custom Interview</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Practice Progress</CardTitle>
              <CardDescription>
                Track your improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8">
                <p className="text-muted-foreground mb-4">Complete mock interviews to see your progress here.</p>
                <Button>Start a Mock Interview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}