import React, { useState } from "react";
import { Search, MapPin, Building, Clock, Briefcase, ListFilter, ChevronDown, AlertCircle, Loader2, DollarSign, Network, TrendingUp, Map, GraduationCap, Award, BookOpen, Building2, X } from "lucide-react";
import axios from 'axios';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Job search parameters interface
interface JobSearchParams {
  query: string;
  location: string;
  industry?: string;
  sources: string[];
}

// Job listing interface
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  source: string;
  postedDate: string;
  type?: string;
  requirements?: string[];
  tags?: string[];
}

// Salary insight interface
interface SalaryInsight {
  median: number;
  range: [number, number];
  growth?: number;
  stateData?: Record<string, {
    median: number;
    range: [number, number];
  }>;
  education?: string[];
  certifications?: string[];
}

// Placeholder requirements and tags for jobs that don't have them
const generateRequirements = (title: string): string[] => {
  const commonRequirements = [
    'Excellent communication skills',
    'Problem-solving abilities',
    'Team collaboration'
  ];
  
  if (title.toLowerCase().includes('developer') || title.toLowerCase().includes('engineer')) {
    return [
      'Proficiency in modern programming languages',
      'Experience with web development frameworks',
      'Understanding of software development lifecycle',
      ...commonRequirements
    ];
  } else if (title.toLowerCase().includes('marketing')) {
    return [
      'Experience with digital marketing platforms',
      'Content creation skills',
      'Understanding of marketing analytics',
      ...commonRequirements
    ];
  } else if (title.toLowerCase().includes('manager')) {
    return [
      'Leadership experience',
      'Project management skills',
      'Strategic planning abilities',
      ...commonRequirements
    ];
  }
  
  return commonRequirements;
};

const generateTags = (title: string, description: string): string[] => {
  const tags: string[] = [];
  
  // Extract potential tags from title and description
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('software') || text.includes('developer') || text.includes('programming')) {
    tags.push('Software Development');
  }
  if (text.includes('marketing') || text.includes('brand') || text.includes('content')) {
    tags.push('Marketing');
  }
  if (text.includes('management') || text.includes('manager') || text.includes('leadership')) {
    tags.push('Management');
  }
  if (text.includes('design') || text.includes('ui') || text.includes('ux')) {
    tags.push('Design');
  }
  if (text.includes('data') || text.includes('analytics') || text.includes('analysis')) {
    tags.push('Data');
  }
  if (text.includes('customer') || text.includes('service') || text.includes('support')) {
    tags.push('Customer Service');
  }
  
  // Add at least one tag if none were identified
  if (tags.length === 0) {
    tags.push('Professional');
  }
  
  return tags;
};

// Format currency function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function JobSearchFullscreen() {
  const [activeTab, setActiveTab] = useState<string>("job-search");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [selectedSources] = useState<Record<string, boolean>>({
    indeed: true,
    adzuna: true,
  });
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryInsight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const { toast } = useToast();
  
  // Get selected job details
  const jobDetails = selectedJob ? jobListings.find(job => job.id === selectedJob) : null;

  // Job search mutation
  const searchMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      
      const params: JobSearchParams = {
        query: searchQuery,
        location,
        industry: industry || "all", // Default to all if not selected
        sources: Object.entries(selectedSources)
          .filter(([_, enabled]) => enabled)
          .map(([source]) => source),
      };

      const response = await apiRequest("POST", "/api/jobs/search", params);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to search jobs");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Process the jobs data to add missing fields
      const processedJobs = data.jobs.map((job: JobListing) => {
        return {
          ...job,
          // Set default job type if not provided by the API
          type: job.type || 'Full-time',
          // Generate requirements if not provided
          requirements: job.requirements || generateRequirements(job.title),
          // Generate tags if not provided
          tags: job.tags || generateTags(job.title, job.description)
        };
      });
      
      setJobListings(processedJobs);
      setHasSearched(true);
      
      // Select the first job if available
      if (processedJobs.length > 0) {
        setSelectedJob(processedJobs[0].id);
      }
      
      toast({
        title: "Search Complete",
        description: `Found ${processedJobs.length} matching jobs`,
      });
    },
    onError: (error: Error) => {
      setError("Failed to search for jobs. Please try again later.");
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error.message || "Failed to search jobs. Please try again.",
      });
    }
  });

  // Salary data fetch mutation
  const salaryMutation = useMutation({
    mutationFn: async (jobTitle: string) => {
      const response = await apiRequest("POST", "/api/salary/insights", {
        jobTitle,
        location: location || "United States"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch salary insights");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setSalaryData(data);
      toast({
        title: "Salary Insights Available",
        description: `Showing salary data for ${searchQuery}`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Salary Data Error",
        description: "We couldn't fetch detailed salary information at this time.",
      });
    }
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job title or keywords to search.",
      });
      return;
    }
    
    // Fetch salary insights from API
    salaryMutation.mutate(searchQuery);
    
    // Perform job search
    searchMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job & Salary Explorer</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Find opportunities and research salary insights for your career
          </p>
        </div>
      </div>
      
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <Network className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
          Enter a job title and location to search for active job listings and salary insights.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="job-search" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Find Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="salary-insights" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Salary Research</span>
          </TabsTrigger>
        </TabsList>
        
        <Card className="mb-6">
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" /> 
              Search Parameters
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter details to find jobs or research salary information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3 py-3 sm:px-6 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="searchQuery" className="text-sm sm:text-base">Job Title or Keywords*</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchQuery"
                  placeholder="e.g. Software Engineer, Marketing Manager"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 border-primary/20 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm sm:text-base">Location*</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. New York, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-8 border-primary/20 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm sm:text-base">Industry (Optional)</Label>
              <Select
                value={industry}
                onValueChange={setIndustry}
              >
                <SelectTrigger id="industry" className="border-primary/20 text-sm sm:text-base">
                  <SelectValue placeholder="Select an industry (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="marketing">Marketing & Media</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={searchMutation.isPending || salaryMutation.isPending}
              className="w-full bg-primary text-white hover:bg-primary/90 text-sm sm:text-base py-2 h-auto mt-2"
            >
              {(searchMutation.isPending || salaryMutation.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" /> Search Jobs
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {error && (
          <Alert className="border-destructive bg-destructive/10 mb-6">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <TabsContent value="job-search" className="mt-0">
          {/* Grid for job listings and details */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
            {/* Job Listings */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base">
                  {hasSearched ? (
                    jobListings.length > 0 ? 
                      `${jobListings.length} Jobs Found` : 
                      'No Jobs Found'
                  ) : 'Job Listings'}
                </h3>
                {jobListings.length > 0 && (
                  <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4" />
                    <span className="text-sm">Sort by: Relevance</span>
                  </div>
                )}
              </div>

              {/* Loading state */}
              {searchMutation.isPending && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="p-4">
                        <div className="h-6 bg-muted rounded-md w-3/4"></div>
                        <div className="h-4 bg-muted rounded-md w-1/2 mt-2"></div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex gap-2 mt-2">
                          <div className="h-5 bg-muted rounded-md w-1/4"></div>
                          <div className="h-5 bg-muted rounded-md w-1/4"></div>
                          <div className="h-5 bg-muted rounded-md w-1/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Job listings */}
              {!searchMutation.isPending && (
                <div className="space-y-4">
                  {jobListings.length > 0 ? (
                    jobListings.map((job: JobListing) => (
                      <Card 
                        key={job.id}
                        className={`cursor-pointer transition-all hover:border-primary ${selectedJob === job.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedJob(job.id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Building className="h-3 w-3" /> {job.company}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground gap-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {job.location}
                              </div>
                              {job.type && (
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3" /> {job.type}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {job.postedDate}
                              </div>
                            </div>
                            {job.tags && job.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {job.tags.slice(0, 3).map((tag: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : hasSearched ? (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">No jobs found matching your search criteria.</p>
                      <p className="text-sm mt-2">Try broadening your search or changing your location.</p>
                    </Card>
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">Enter job title and location to search for jobs.</p>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="lg:col-span-3">
              {searchMutation.isPending ? (
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-7 bg-muted rounded-md w-4/5"></div>
                    <div className="h-5 bg-muted rounded-md w-3/5 mt-2"></div>
                    <div className="flex gap-3 mt-4">
                      <div className="h-4 bg-muted rounded-md w-1/4"></div>
                      <div className="h-4 bg-muted rounded-md w-1/4"></div>
                      <div className="h-4 bg-muted rounded-md w-1/4"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-5 bg-muted rounded-md w-full"></div>
                    <div className="h-5 bg-muted rounded-md w-full"></div>
                    <div className="h-5 bg-muted rounded-md w-4/5"></div>
                    <div className="h-5 bg-muted rounded-md w-3/5"></div>
                  </CardContent>
                </Card>
              ) : selectedJob && jobDetails ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{jobDetails.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Building className="h-3 w-3" /> {jobDetails.company}
                    </CardDescription>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {jobDetails.location}
                      </div>
                      {jobDetails.type && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {jobDetails.type}
                        </div>
                      )}
                      {jobDetails.salary && (
                        <div>
                          {jobDetails.salary}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Posted {jobDetails.postedDate}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="description">
                      <TabsList>
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="requirements">Requirements</TabsTrigger>
                        <TabsTrigger value="company">Company</TabsTrigger>
                      </TabsList>
                      <TabsContent value="description" className="space-y-4 pt-4">
                        <p className="whitespace-pre-line">{jobDetails.description}</p>
                        <div className="flex gap-3 mt-4">
                          <Button onClick={() => window.open(jobDetails.url, '_blank')}>
                            Apply Now
                          </Button>
                          <Button variant="outline">
                            Save Job
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="requirements" className="space-y-4 pt-4">
                        {jobDetails.requirements && jobDetails.requirements.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {jobDetails.requirements.map((req: string, index: number) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No specific requirements listed for this position.</p>
                        )}
                      </TabsContent>
                      <TabsContent value="company" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          <h3 className="font-medium">About {jobDetails.company}</h3>
                          <p>Information about {jobDetails.company} is not available at this time.</p>
                          <Button variant="outline" size="sm" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(jobDetails.company)}`, '_blank')}>
                            Research Company
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-10">
                    <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {hasSearched && jobListings.length > 0 ? 
                        'Select a job to view details' : 
                        'Start your job search'}
                    </h3>
                    <p className="text-muted-foreground">
                      {hasSearched && jobListings.length > 0 ? 
                        'Click on a job listing to see the full description and requirements.' : 
                        'Enter a job title and location to find opportunities.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="salary-insights" className="mt-0">
          {salaryData ? (
            <Card>
              <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Salary Insights for {searchQuery}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Comprehensive compensation and market analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-3 py-2 sm:px-6 sm:py-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1 bg-primary/5 p-3 rounded-lg">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Median Salary
                    </h4>
                    <p className="text-xl font-bold">{formatCurrency(salaryData.median)}</p>
                    <p className="text-xs text-muted-foreground">
                      Range: {formatCurrency(salaryData.range[0])} - {formatCurrency(salaryData.range[1])}
                    </p>
                  </div>

                  <div className="space-y-1 bg-primary/5 p-3 rounded-lg">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Growth Rate
                    </h4>
                    <p className="text-xl font-bold">{salaryData.growth ? `${salaryData.growth}%` : 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Annual job growth</p>
                  </div>

                  <div className="space-y-1 bg-primary/5 p-3 rounded-lg">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <Map className="h-4 w-4 text-primary" />
                      Location Data
                    </h4>
                    <p className="text-xl font-bold">{location || 'National'}</p>
                    <p className="text-xs text-muted-foreground">Market comparison basis</p>
                  </div>
                </div>

                {salaryData.education && salaryData.education.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Recommended Education
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {salaryData.education.map((edu, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary-foreground px-2 py-1 rounded-full">
                          {edu}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {salaryData.certifications && salaryData.certifications.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      Valuable Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {salaryData.certifications.map((cert, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary-foreground px-2 py-1 rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {salaryData.stateData && Object.keys(salaryData.stateData).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Regional Salary Comparison
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {Object.entries(salaryData.stateData).slice(0, 6).map(([state, data]) => (
                        <div key={state} className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">{state}</span>: {formatCurrency(data.median)}
                          <div className="text-muted-foreground text-xs">
                            Range: {formatCurrency(data.range[0])} - {formatCurrency(data.range[1])}
                          </div>
                          <div className="mt-1">
                            <Progress 
                              value={(data.median / salaryData.range[1]) * 100} 
                              className="h-1.5" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Career Development Suggestions
                  </h4>
                  <div className="grid gap-4 mt-2 md:grid-cols-2">
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium text-sm">Boost Your Earning Potential</h5>
                      <ul className="mt-2 space-y-1 text-xs">
                        <li className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          Acquire the relevant certifications listed above
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          Develop advanced technical skills specific to your role
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          Consider relocating to a higher-paying region if possible
                        </li>
                      </ul>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium text-sm">Long-term Career Growth</h5>
                      <ul className="mt-2 space-y-1 text-xs">
                        <li className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          Pursue the recommended education pathways
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          Build a professional network in your industry
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          Seek specialized roles or leadership positions over time
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            salaryMutation.isPending ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : salaryMutation.isError ? (
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                <CardHeader>
                  <CardTitle>Error Retrieving Salary Data</CardTitle>
                  <CardDescription>
                    We couldn't find salary information for this search. Please try with more specific job titles.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Search for Salary Insights</CardTitle>
                  <CardDescription>
                    Enter a job title above and click "Find Opportunities" to see detailed salary insights.
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}