import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Bot, 
  PlayCircle, 
  CheckSquare, 
  CheckCheck, 
  Search, 
  List, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';

const InterviewPractice: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  
  const handleGenerateQuestions = () => {
    console.log('Generating questions for job title:', jobTitle);
    // API call would go here
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Interview Practice</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Prepare for interviews with practice questions and expert tips
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Question Library Card */}
        <Card className="overflow-hidden">
          <div className="bg-blue-100 dark:bg-blue-900 p-4">
            <div className="flex items-center space-x-2">
              <List className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                Question Library
              </h3>
            </div>
            <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
              Browse common interview questions
            </p>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Question Category
                </label>
                <Select defaultValue="general">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Questions</SelectItem>
                    <SelectItem value="behavioral">Behavioral Questions</SelectItem>
                    <SelectItem value="technical">Technical Questions</SelectItem>
                    <SelectItem value="leadership">Leadership Questions</SelectItem>
                    <SelectItem value="situational">Situational Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Browse Questions
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Job-Specific Questions Card */}
        <Card className="overflow-hidden">
          <div className="bg-green-100 dark:bg-green-900 p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-300" />
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-300">
                Job-Specific Questions
              </h3>
            </div>
            <p className="text-green-600 dark:text-green-300 text-sm mt-1">
              Generate questions for your target role
            </p>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="job-title" className="block text-sm font-medium mb-2">
                  Job Title or Field
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="job-title"
                    placeholder="e.g. Software Engineer, Teacher..."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <Button size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                disabled={!jobTitle.trim()}
                onClick={handleGenerateQuestions}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Generate Questions
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* STAR Method Card */}
        <Card className="overflow-hidden">
          <div className="bg-purple-100 dark:bg-purple-900 p-4">
            <div className="flex items-center space-x-2">
              <CheckCheck className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300">
                STAR Method
              </h3>
            </div>
            <p className="text-purple-600 dark:text-purple-300 text-sm mt-1">
              Structure your responses effectively
            </p>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <p className="text-sm">
                The STAR method helps you create structured, compelling responses:
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400 flex-shrink-0">S</span>
                  <span className="text-sm">
                    <span className="font-semibold">ituation</span> - The context
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">T</span>
                  <span className="text-sm">
                    <span className="font-semibold">ask</span> - Your responsibility
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">A</span>
                  <span className="text-sm">
                    <span className="font-semibold">ction</span> - What you did
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-red-600 dark:text-red-400 flex-shrink-0">R</span>
                  <span className="text-sm">
                    <span className="font-semibold">esult</span> - The outcome
                  </span>
                </li>
              </ul>
              
              <Button className="w-full" variant="outline">
                <CheckCheck className="h-4 w-4 mr-2" />
                Use STAR Method
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Mock Interview Card */}
        <Card className="overflow-hidden">
          <div className="bg-indigo-100 dark:bg-indigo-900 p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                Mock Interview
              </h3>
            </div>
            <p className="text-indigo-600 dark:text-indigo-300 text-sm mt-1">
              Simulate a full interview experience
            </p>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <p className="text-sm mb-2">
                Practice with a simulated interview that includes:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">Timed responses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">Industry questions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">AI feedback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">Realistic format</span>
                </li>
              </ul>
              
              <Button className="w-full">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Mock Interview
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Interview Checklist */}
        <Card className="overflow-hidden">
          <div className="bg-cyan-100 dark:bg-cyan-900 p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-300">
                Interview Checklist
              </h3>
            </div>
            <p className="text-cyan-600 dark:text-cyan-300 text-sm mt-1">
              Prepare fully for your interview
            </p>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Track your preparation:</span>
                <span className="text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded">
                  0/12
                </span>
              </div>
              
              <Button className="w-full" variant="outline">
                <CheckSquare className="h-4 w-4 mr-2" />
                View Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Interview Tips */}
        <Card className="overflow-hidden">
          <div className="bg-amber-100 dark:bg-amber-900 p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300">
                Interview Tips
              </h3>
            </div>
            <p className="text-amber-600 dark:text-amber-300 text-sm mt-1">
              Expert advice for interview success
            </p>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="preparation">
                  <AccordionTrigger className="text-sm">Preparation Tips</AccordionTrigger>
                  <AccordionContent>
                    Tips for researching the company and preparing answers to common questions.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="communication">
                  <AccordionTrigger className="text-sm">Communication Skills</AccordionTrigger>
                  <AccordionContent>
                    Tips for clear communication, body language, and active listening.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="followup">
                  <AccordionTrigger className="text-sm">Follow-up Strategy</AccordionTrigger>
                  <AccordionContent>
                    Best practices for following up after the interview.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button className="w-full" variant="outline">
                <ChevronRight className="h-4 w-4 mr-2" />
                View All Tips
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewPractice;