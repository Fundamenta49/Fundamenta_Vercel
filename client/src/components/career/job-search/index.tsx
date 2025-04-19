import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Building, Clock, Briefcase, ListFilter, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Job interface matching the API response
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

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get selected job details
  const jobDetails = selectedJob ? jobs.find(job => job.id === selectedJob) : null;
  
  // Function to search jobs
  const searchJobs = async () => {
    // Validate inputs
    if (!searchTerm.trim() || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both job title and location.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await axios.post('/api/jobs/search', {
        query: searchTerm,
        location: location,
        sources: ['adzuna'] // Use Adzuna as the primary source
      });

      // Process the jobs data to add missing fields
      const processedJobs = response.data.jobs.map((job: JobListing) => {
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

      setJobs(processedJobs);
      setHasSearched(true);
      
      // Select the first job if available
      if (processedJobs.length > 0) {
        setSelectedJob(processedJobs[0].id);
      }
    } catch (err) {
      console.error("Error searching for jobs:", err);
      setError("Failed to search for jobs. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to search for jobs. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Job Search</h2>
          <p className="text-muted-foreground">
            Find your next career opportunity
          </p>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jobs, skills, or companies..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="pl-8"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center md:col-span-2">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  Job Type
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Date Posted
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  Company
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div>
              <Button 
                className="w-full" 
                onClick={searchJobs}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Jobs
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-destructive p-4 text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Job Results and Details */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Job Listings */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {hasSearched ? (
                jobs.length > 0 ? 
                  `${jobs.length} Jobs Found` : 
                  'No Jobs Found'
              ) : 'Job Listings'}
            </h3>
            {jobs.length > 0 && (
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <span className="text-sm">Sort by: Relevance</span>
              </div>
            )}
          </div>
          
          {/* Loading state */}
          {isSearching && (
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
          {!isSearching && (
            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job: JobListing) => (
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
        <div className="md:col-span-3">
          {isSearching ? (
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
                  {hasSearched && jobs.length > 0 ? 
                    'Select a job to view details' : 
                    'Start your job search'}
                </h3>
                <p className="text-muted-foreground">
                  {hasSearched && jobs.length > 0 ? 
                    'Click on a job listing to see the full description and requirements.' : 
                    'Enter a job title and location to find opportunities.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}