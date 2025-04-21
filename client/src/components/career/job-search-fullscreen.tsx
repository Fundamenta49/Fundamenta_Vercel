import React, { useState, useEffect } from 'react';
import { X, Search, Briefcase, Building, MapPin, Calendar, ExternalLink, BookmarkPlus, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Job search form schema
const jobSearchSchema = z.object({
  query: z.string().min(1, { message: "Please enter a job title, skill, or company name" }),
  location: z.string().optional(),
  jobType: z.string().optional(),
  datePosted: z.string().optional(),
  experienceLevel: z.string().optional(),
  radius: z.number().min(0).max(100).optional(),
});

type JobSearchFormValues = z.infer<typeof jobSearchSchema>;

// Job interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  datePosted: string;
  jobType: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  experienceLevel: string;
  skills: string[];
  logo?: string;
  isSaved?: boolean;
}

// Mock job data for the fullscreen component
const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA (Remote)",
    salary: "$120,000 - $150,000",
    datePosted: "3 days ago",
    jobType: "Full-time",
    description: "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building user interfaces, implementing responsive designs, and working closely with our design and backend teams.",
    requirements: [
      "5+ years of experience with React, TypeScript, and modern JavaScript",
      "Experience with state management solutions (Redux, Context API)",
      "Proficiency in responsive design and CSS frameworks",
      "Knowledge of web performance optimization techniques"
    ],
    benefits: [
      "Competitive compensation package",
      "Comprehensive health insurance",
      "Flexible work arrangements",
      "Professional development budget"
    ],
    experienceLevel: "Senior",
    skills: ["React", "TypeScript", "Redux", "CSS", "HTML", "JavaScript"],
  },
  {
    id: "job-2",
    title: "Data Analyst",
    company: "Analytics Insights Inc.",
    location: "Chicago, IL (Hybrid)",
    salary: "$85,000 - $105,000",
    datePosted: "1 week ago",
    jobType: "Full-time",
    description: "Join our data team to analyze complex datasets, create visualizations, and provide actionable insights to drive business decisions. You'll work with cross-functional teams and have the opportunity to influence product strategy.",
    requirements: [
      "3+ years of experience in data analysis",
      "Proficiency in SQL, Excel, and data visualization tools",
      "Experience with Python or R for data processing",
      "Strong communication skills for presenting findings"
    ],
    benefits: [
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Paid time off",
      "Education reimbursement"
    ],
    experienceLevel: "Mid-level",
    skills: ["SQL", "Python", "Data Visualization", "Excel", "Statistics"],
  },
  {
    id: "job-3",
    title: "UX/UI Designer",
    company: "Creative Design Studio",
    location: "Austin, TX (On-site)",
    salary: "$90,000 - $110,000",
    datePosted: "2 days ago",
    jobType: "Full-time",
    description: "We're seeking a talented UX/UI Designer to create beautiful and intuitive user experiences for our digital products. You'll be involved in the entire design process from research and wireframing to visual design and prototyping.",
    requirements: [
      "4+ years of experience in UX/UI design",
      "Strong portfolio demonstrating user-centered design solutions",
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Experience conducting user research and usability testing"
    ],
    benefits: [
      "Competitive salary",
      "Health benefits",
      "Flexible work schedule",
      "Creative work environment"
    ],
    experienceLevel: "Mid-level",
    skills: ["UI Design", "UX Research", "Wireframing", "Prototyping", "Figma", "User Testing"],
  },
  {
    id: "job-4",
    title: "Project Manager",
    company: "Global Innovations",
    location: "Remote",
    salary: "$95,000 - $120,000",
    datePosted: "5 days ago",
    jobType: "Full-time",
    description: "We're looking for an experienced Project Manager to lead cross-functional teams in delivering complex projects on time and within budget. You'll be responsible for planning, execution, and stakeholder management.",
    requirements: [
      "5+ years of project management experience",
      "PMP certification preferred",
      "Strong communication and leadership skills",
      "Experience with Agile methodologies"
    ],
    benefits: [
      "Competitive compensation",
      "Health and wellness benefits",
      "Remote work flexibility",
      "Professional development opportunities"
    ],
    experienceLevel: "Senior",
    skills: ["Project Planning", "Agile", "Team Leadership", "Stakeholder Management", "Risk Assessment"],
  },
  {
    id: "job-5",
    title: "Marketing Specialist",
    company: "Brand Elevate",
    location: "New York, NY (Hybrid)",
    salary: "$70,000 - $85,000",
    datePosted: "1 week ago",
    jobType: "Full-time",
    description: "Join our marketing team to develop and implement strategic marketing campaigns across multiple channels. You'll be involved in content creation, social media management, and campaign analytics.",
    requirements: [
      "3+ years of experience in digital marketing",
      "Proficiency in social media platforms and content marketing",
      "Experience with marketing automation tools",
      "Strong analytical skills for campaign optimization"
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Paid time off",
      "Flexible work arrangement"
    ],
    experienceLevel: "Mid-level",
    skills: ["Digital Marketing", "Social Media", "Content Strategy", "SEO", "Analytics"],
  },
];

// Job Search Fullscreen Component
export default function JobSearchFullscreen({ onClose }: { onClose: () => void }) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const jobsPerPage = 5;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const { toast } = useToast();

  // Form setup for job search
  const form = useForm<JobSearchFormValues>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: {
      query: "",
      location: "",
      jobType: "",
      datePosted: "",
      experienceLevel: "",
      radius: 25,
    },
  });

  // Handle job search submission
  const onSubmit = (data: JobSearchFormValues) => {
    setIsLoading(true);
    setCurrentPage(1);
    
    // Simulate API call with mock data filtering
    setTimeout(() => {
      const filtered = jobs.filter(job => {
        const matchQuery = job.title.toLowerCase().includes(data.query.toLowerCase()) || 
                          job.company.toLowerCase().includes(data.query.toLowerCase()) ||
                          job.skills.some(skill => skill.toLowerCase().includes(data.query.toLowerCase()));
        
        const matchLocation = !data.location || job.location.toLowerCase().includes(data.location.toLowerCase());
        const matchJobType = !data.jobType || job.jobType === data.jobType;
        const matchExperience = !data.experienceLevel || job.experienceLevel === data.experienceLevel;
        
        return matchQuery && matchLocation && matchJobType && matchExperience;
      });
      
      setFilteredJobs(filtered);
      setIsLoading(false);
      
      if (filtered.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria for better results.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Found ${filtered.length} matching jobs`,
          description: "Showing most relevant results first.",
        });
      }
    }, 1000);
  };

  // Clear all search filters
  const clearFilters = () => {
    form.reset();
    setActiveFilters([]);
    setFilteredJobs(jobs);
  };

  // Toggle job bookmark/save
  const toggleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast({
        title: "Job removed from saved list",
        description: "You can save jobs again anytime.",
      });
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast({
        title: "Job saved successfully",
        description: "You can view your saved jobs in the 'Saved' tab.",
      });
    }
  };

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Get current page's jobs
  const getCurrentJobs = () => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  };
  
  // View specific job details
  const viewJobDetails = (job: Job) => {
    setSelectedJob(job);
  };

  // Close job details view
  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Job Search</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Left Sidebar - Search & Filters */}
        <div className="md:col-span-1 border-r overflow-y-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Job title, keywords, or company"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="City, state, or remote"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Any job type</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Temporary">Temporary</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Any experience level</SelectItem>
                          <SelectItem value="Entry-level">Entry-level</SelectItem>
                          <SelectItem value="Mid-level">Mid-level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="datePosted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Posted</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Anytime" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Anytime</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="3days">Last 3 days</SelectItem>
                          <SelectItem value="week">Last week</SelectItem>
                          <SelectItem value="month">Last month</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search Jobs"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Form>
          
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <button
                      className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                      onClick={() => setActiveFilters(activeFilters.filter(f => f !== filter))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Job Search Tips */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Job Search Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <ul className="list-disc pl-4 space-y-1">
                <li>Use specific keywords related to your skills</li>
                <li>Search for job titles and alternative titles</li>
                <li>Include certifications and tools you know</li>
                <li>Try different location settings including "Remote"</li>
                <li>Save jobs you're interested in to apply later</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Area */}
        <div className="md:col-span-2 flex flex-col overflow-hidden">
          {selectedJob ? (
            <JobDetails job={selectedJob} onBack={closeJobDetails} onSave={() => toggleSaveJob(selectedJob.id)} isSaved={savedJobs.includes(selectedJob.id)} />
          ) : (
            <>
              {/* Job Results Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                </h2>
                
                <div className="flex items-center gap-2">
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[150px] h-8 text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Date Posted</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Job Listings */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Searching for jobs...</p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No matching jobs found</h3>
                    <p className="text-muted-foreground mt-2">
                      Try adjusting your search criteria or clearing filters.
                    </p>
                    <Button className="mt-4" onClick={clearFilters}>Clear All Filters</Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {getCurrentJobs().map((job) => (
                      <JobListItem 
                        key={job.id} 
                        job={job} 
                        onClick={() => viewJobDetails(job)} 
                        isSaved={savedJobs.includes(job.id)}
                        onToggleSave={() => toggleSaveJob(job.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {filteredJobs.length > 0 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Job List Item Component
const JobListItem = ({ 
  job, 
  onClick, 
  isSaved, 
  onToggleSave 
}: { 
  job: Job; 
  onClick: () => void; 
  isSaved: boolean;
  onToggleSave: () => void;
}) => {
  return (
    <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-base">{job.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <Building className="h-3.5 w-3.5 mr-1" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{job.location}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
          >
            <BookmarkPlus className={cn("h-4 w-4", isSaved ? "fill-yellow-400 text-yellow-400" : "")} />
          </Button>
          <span className="text-sm text-muted-foreground mt-auto">{job.datePosted}</span>
        </div>
      </div>
      
      <div className="mt-3">
        {job.salary && (
          <Badge variant="outline" className="mr-2 bg-green-50">
            {job.salary}
          </Badge>
        )}
        <Badge variant="outline" className="mr-2">
          {job.jobType}
        </Badge>
        <Badge variant="outline">
          {job.experienceLevel}
        </Badge>
      </div>
      
      <div className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {job.description}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-1">
        {job.skills.slice(0, 5).map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {job.skills.length > 5 && (
          <Badge variant="secondary" className="text-xs">
            +{job.skills.length - 5} more
          </Badge>
        )}
      </div>
    </div>
  );
};

// Job Details Component
const JobDetails = ({ 
  job, 
  onBack,
  onSave,
  isSaved
}: { 
  job: Job; 
  onBack: () => void;
  onSave: () => void;
  isSaved: boolean;
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <button
          className="flex items-center text-sm font-medium"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Results
        </button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={onSave}
          >
            <BookmarkPlus className={cn("h-4 w-4", isSaved ? "fill-yellow-400 text-yellow-400" : "")} />
            {isSaved ? "Saved" : "Save Job"}
          </Button>
          
          <Button size="sm">Apply Now</Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{job.title}</h1>
            <div className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{job.location}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Posted {job.datePosted}</span>
            </div>
            
            {job.salary && (
              <Badge className="mt-2 bg-green-50 border-green-200 text-green-700">
                {job.salary}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">{job.jobType}</Badge>
          <Badge variant="outline">{job.experienceLevel}</Badge>
        </div>
        
        {/* Job Details Tabs */}
        <Tabs defaultValue="description" className="mt-6">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium mb-2">Job Description</h3>
              <p className="whitespace-pre-line">{job.description}</p>
              
              <h3 className="text-lg font-medium mt-6 mb-2">Key Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="requirements" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium mb-2">Job Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-primary">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="benefits" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium mb-2">Benefits & Perks</h3>
              {job.benefits ? (
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-green-500">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No benefits information provided by the employer.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="company" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium mb-2">About {job.company}</h3>
              <p>
                {job.company} is a leading company in its industry with a focus on innovation and employee growth.
                For more information, visit the company website or contact them directly.
              </p>
              
              <Button variant="outline" className="mt-4 flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" />
                Visit Company Website
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Similar Jobs Section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Similar Jobs You Might Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_JOBS.filter(j => j.id !== job.id)
              .slice(0, 2)
              .map((similarJob) => (
                <Card key={similarJob.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{similarJob.title}</h4>
                    <div className="text-sm text-muted-foreground mt-1">{similarJob.company}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{similarJob.location}</div>
                    <div className="mt-2 flex gap-1.5">
                      <Badge variant="outline" className="text-xs">{similarJob.jobType}</Badge>
                      {similarJob.salary && (
                        <Badge variant="outline" className="text-xs bg-green-50">{similarJob.salary}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};