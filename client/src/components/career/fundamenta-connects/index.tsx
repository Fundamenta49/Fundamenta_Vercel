import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Info, Network, DollarSign, Search, Building, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
}

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

const FundamentaConnects: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('technology');
  const [activeTab, setActiveTab] = useState('find-jobs');
  const [isLoading, setIsLoading] = useState(false);
  const [jobResults, setJobResults] = useState<JobListing[]>([]);
  const [salaryResults, setSalaryResults] = useState<SalaryInsight | null>(null);
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [salaryJobTitle, setSalaryJobTitle] = useState('');
  const [salaryLocation, setSalaryLocation] = useState('');
  const { toast } = useToast();

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      console.log('Searching for jobs:', { jobTitle, location, industry });
      
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: jobTitle,
          location: location,
          sources: ['adzuna']
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search for jobs');
      }
      
      const data = await response.json();
      setJobResults(data.jobs || []);
      
      if (data.jobs && data.jobs.length === 0) {
        toast({
          title: "No results found",
          description: "Try different keywords or location",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error searching for jobs:', error);
      toast({
        title: "Search failed",
        description: "Unable to search for jobs at this time",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle salary research
  const handleSalaryResearch = async () => {
    try {
      setIsLoading(true);
      
      if (!salaryJobTitle || !salaryLocation) {
        toast({
          title: "Missing information",
          description: "Please enter both job title and location",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch('/api/salary/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: salaryJobTitle,
          location: salaryLocation,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch salary insights');
      }
      
      const data = await response.json();
      setSalaryResults(data);
      
      toast({
        title: "Salary data retrieved",
        description: "Successfully fetched salary insights",
        variant: "default",
      });
    } catch (error) {
      console.error('Error fetching salary insights:', error);
      toast({
        title: "Research failed",
        description: "Unable to retrieve salary data at this time",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-2">
          <Network className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Fundamenta Connects</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Find opportunities and research salary insights - all in one place
        </p>
      </div>

      {/* Info Alert */}
      <div className="px-6 py-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <p className="text-blue-700 dark:text-blue-300">
              Research salary trends and find job opportunities in your field. Switch between tabs to access different features.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-6 py-2">
        <Tabs 
          defaultValue="find-jobs" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="find-jobs" className="flex items-center justify-center">
              <Network className="h-4 w-4 mr-2" />
              Find Jobs
            </TabsTrigger>
            <TabsTrigger value="salary-research" className="flex items-center justify-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Salary Research
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find-jobs">
            <Card className="border rounded-lg">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Network className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Fundamenta Connects</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Discover career opportunities and salary insights tailored to your skills
                  </p>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="job-title" className="block text-sm font-medium mb-2">
                        Job Title or Keywords
                      </label>
                      <Input
                        id="job-title"
                        placeholder="e.g. Software Engineer, Marketing Manager"
                        value={jobTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <Input
                        id="location"
                        placeholder="e.g. New York, Remote"
                        value={location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium mb-2">
                        Industry (Optional)
                      </label>
                      <Select value={industry || "technology"} onValueChange={setIndustry} defaultValue="technology">
                        <SelectTrigger>
                          <SelectValue placeholder="Select an industry (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="hospitality">Hospitality</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleSearch}
                      disabled={!jobTitle.trim() || !location.trim() || isLoading}
                    >
                      {isLoading ? 'Searching...' : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Find Opportunities
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Job Results */}
            {jobResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Job Opportunities</h3>
                <div className="space-y-4">
                  {jobResults.map(job => (
                    <Card key={job.id} className="overflow-hidden hover:border-primary transition-all">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-base font-semibold text-primary">{job.title}</h4>
                            {job.salary && (
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                {job.salary}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{job.company}</span>
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          
                          <p className="text-sm line-clamp-2">{job.description}</p>
                          
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {job.postedDate}
                            </span>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => window.open(job.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="salary-research">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Salary Research</h3>
                <p className="text-muted-foreground mb-4">
                  Research salary ranges for different positions and locations to help with your career planning and negotiations.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="job-title-salary" className="block text-sm font-medium mb-2">
                      Job Title
                    </label>
                    <Input
                      id="job-title-salary"
                      placeholder="e.g. Software Engineer"
                      value={salaryJobTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalaryJobTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location-salary" className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <Input
                      id="location-salary"
                      placeholder="e.g. New York, NY"
                      value={salaryLocation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalaryLocation(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="experience-level" className="block text-sm font-medium mb-2">
                      Experience Level
                    </label>
                    <Select value={experienceLevel || "mid"} onValueChange={setExperienceLevel} defaultValue="mid">
                      <SelectTrigger id="experience-level">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                        <SelectItem value="expert">Expert Level (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleSalaryResearch}
                    disabled={!salaryJobTitle.trim() || !salaryLocation.trim() || isLoading}
                  >
                    {isLoading ? 'Researching...' : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Research Salary
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Salary Results */}
            {salaryResults && (
              <div className="mt-6 space-y-6">
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Salary Insights for {salaryJobTitle}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Median Salary</h4>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {formatCurrency(salaryResults.median)}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Salary Range</h4>
                        <p className="text-lg font-bold text-green-900 dark:text-green-100">
                          {formatCurrency(salaryResults.range[0])} - {formatCurrency(salaryResults.range[1])}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Growth Rate</h4>
                        <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                          {salaryResults.growth}% <span className="text-xs font-normal">annually</span>
                        </p>
                      </div>
                    </div>
                    
                    {salaryResults.education && salaryResults.education.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Education Requirements</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {salaryResults.education.map((item, i) => (
                            <li key={i} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {salaryResults.certifications && salaryResults.certifications.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Recommended Certifications</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {salaryResults.certifications.map((item, i) => (
                            <li key={i} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {salaryResults.stateData && Object.keys(salaryResults.stateData).length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Salary by Location</h3>
                      <div className="space-y-3">
                        {Object.entries(salaryResults.stateData).map(([location, data]) => (
                          <div key={location} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <p className="font-medium">{location}</p>
                              <p className="text-sm text-muted-foreground">
                                Range: {formatCurrency(data.range[0])} - {formatCurrency(data.range[1])}
                              </p>
                            </div>
                            <p className="font-bold text-lg">{formatCurrency(data.median)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FundamentaConnects;