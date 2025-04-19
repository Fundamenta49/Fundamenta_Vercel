import React, { useState } from "react";
import { Briefcase, MapPin, Building2, DollarSign, Network, BarChart4, Loader2, TrendingUp, Map, GraduationCap, Award, BookOpen } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Job search parameters interface
interface JobSearchParams {
  query: string;
  location: string;
  industry: string;
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
  const [salaryData, setSalaryData] = useState<SalaryInsight | null>(null);
  
  const { toast } = useToast();

  // Job search mutation
  const searchMutation = useMutation({
    mutationFn: async () => {
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
      setJobListings(data.jobs);
      toast({
        title: "Search Complete",
        description: `Found ${data.jobs.length} matching jobs`,
      });
    },
    onError: (error: Error) => {
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
          Switch between tabs to search for jobs or research salary trends in your industry.
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
              <Input
                id="searchQuery"
                placeholder="e.g. Software Engineer, Marketing Manager"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-primary/20 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
              <Input
                id="location"
                placeholder="e.g. New York, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-primary/20 text-sm sm:text-base"
              />
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
                  <Network className="h-4 w-4 mr-2" /> Find Opportunities
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <TabsContent value="job-search" className="mt-0">
          {jobListings.length > 0 ? (
            <Card>
              <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Opportunities Found
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Discovered {jobListings.length} matching positions for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-3 py-2 sm:px-6 sm:py-4">
                {jobListings.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 sm:p-4 border border-primary/20 bg-white dark:bg-gray-950 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-1 sm:gap-2">
                          <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="line-clamp-2">{job.title}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                          <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          {job.company}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          {job.location}
                        </p>
                        {job.salary && (
                          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            {job.salary}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white border-primary/30 text-primary hover:bg-primary/5 text-xs sm:text-sm py-1 h-auto self-start flex items-center gap-1"
                        onClick={() => window.open(job.url, "_blank")}
                      >
                        View Job <Network className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm line-clamp-3">{job.description}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {job.source}
                        </Badge>
                        <span>Posted: {job.postedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            searchMutation.isPending ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : searchMutation.isError ? (
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                <CardHeader>
                  <CardTitle>Error Finding Jobs</CardTitle>
                  <CardDescription>
                    We couldn't find any matching jobs. Please try adjusting your search.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null
          )}
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
                      <BarChart4 className="h-4 w-4 text-primary" />
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