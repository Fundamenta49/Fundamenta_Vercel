import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileEdit, Eye, Download, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for resume data
export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    website?: string;
    objective?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    achievements?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
  skills: Array<{
    name: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
    neverExpires?: boolean;
  }>;
}

// Initial empty resume data
const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    objective: '',
  },
  experience: [],
  education: [],
  skills: [],
  certifications: []
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeTab, setActiveTab] = useState('editor');
  const { toast } = useToast();

  // This is a placeholder for the actual optimization function that would use OpenAI
  const optimizeResume = async () => {
    toast({
      title: "Resume optimization",
      description: "Your resume is being analyzed and optimized. This feature uses AI to suggest improvements.",
      duration: 3000,
    });
    
    // In a real implementation, this would call the OpenAI API
    setTimeout(() => {
      toast({
        variant: "success",
        title: "Resume optimized",
        description: "We've analyzed your resume and made suggestions to improve it.",
        duration: 3000,
      });
    }, 2000);
  };

  const handleDownload = () => {
    toast({
      title: "Resume downloaded",
      description: "Your resume has been downloaded as a PDF file.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Resume Builder</h2>
          <p className="text-muted-foreground">
            Create a professional resume with our step-by-step builder
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={optimizeResume} variant="outline" className="gap-1">
            <Sparkles className="h-4 w-4" />
            <span>AI Optimize</span>
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">
                <FileEdit className="h-4 w-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="editor" className="m-0">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Enter your contact details and basic information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-sm font-medium">Full Name</label>
                          <input 
                            type="text"
                            placeholder="John Doe"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-sm font-medium">Email</label>
                          <input 
                            type="email"
                            placeholder="john.doe@example.com"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-sm font-medium">Phone</label>
                          <input 
                            type="tel"
                            placeholder="(123) 456-7890"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-sm font-medium">Location</label>
                          <input 
                            type="text"
                            placeholder="New York, NY"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="mt-4 space-y-1.5">
                        <label className="text-sm font-medium">Professional Summary</label>
                        <textarea 
                          rows={4}
                          placeholder="Brief summary of your professional background and career goals..."
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Work Experience</CardTitle>
                          <CardDescription>
                            Add your work history, starting with your most recent position
                          </CardDescription>
                        </div>
                        <Button size="sm">Add Experience</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-8 text-center border rounded-md border-dashed">
                        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No experience added yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start adding your work history to build your resume
                        </p>
                        <Button>Add Your First Experience</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Education</CardTitle>
                          <CardDescription>
                            Add your educational background
                          </CardDescription>
                        </div>
                        <Button size="sm">Add Education</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-8 text-center border rounded-md border-dashed">
                        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No education added yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add your degrees, certifications, or relevant coursework
                        </p>
                        <Button>Add Your Education</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Skills</CardTitle>
                          <CardDescription>
                            Add relevant skills and proficiency levels
                          </CardDescription>
                        </div>
                        <Button size="sm">Add Skill</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-8 text-center border rounded-md border-dashed">
                        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No skills added yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Highlight your technical and soft skills to stand out
                        </p>
                        <Button>Add Your Skills</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="m-0">
                <div className="border rounded-lg p-6 space-y-6">
                  <div className="text-center space-y-2 pb-4 border-b">
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <div className="flex flex-wrap justify-center gap-x-4 text-sm">
                      <span>New York, NY</span>
                      <span>john.doe@example.com</span>
                      <span>(123) 456-7890</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Professional Summary</h2>
                    <p>
                      Experienced software developer with a passion for creating elegant solutions to complex problems.
                      Skilled in JavaScript, React, and Node.js with a focus on building responsive and user-friendly web applications.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Work Experience</h2>
                    <Separator />
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">Senior Software Developer</h3>
                          <span className="text-sm text-muted-foreground">Jan 2020 - Present</span>
                        </div>
                        <div className="text-sm font-medium">Example Tech Company</div>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>Led the development of a new customer portal using React and TypeScript</li>
                          <li>Implemented CI/CD pipelines that reduced deployment time by 40%</li>
                          <li>Mentored junior developers and conducted code reviews to maintain code quality</li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">Web Developer</h3>
                          <span className="text-sm text-muted-foreground">Jun 2017 - Dec 2019</span>
                        </div>
                        <div className="text-sm font-medium">Previous Company Inc.</div>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>Developed and maintained client websites using JavaScript, HTML, and CSS</li>
                          <li>Collaborated with design team to implement responsive UI components</li>
                          <li>Optimized website performance by improving load times by 30%</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Education</h2>
                    <Separator />
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">Bachelor of Science in Computer Science</h3>
                          <span className="text-sm text-muted-foreground">Sep 2013 - May 2017</span>
                        </div>
                        <div className="text-sm font-medium">University of Example</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Skills</h2>
                    <Separator />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">JavaScript</div>
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">React</div>
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">Node.js</div>
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">TypeScript</div>
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">HTML/CSS</div>
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">Git</div>
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">REST APIs</div>
                      <div className="bg-muted px-2 py-1 rounded-md text-sm">SQL</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6 gap-3">
                  <Button variant="outline" onClick={() => setActiveTab('editor')}>Edit Resume</Button>
                  <Button onClick={handleDownload}>Download PDF</Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}