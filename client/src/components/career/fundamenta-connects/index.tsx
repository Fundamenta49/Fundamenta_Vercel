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
import { Info, Network, DollarSign, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FundamentaConnects: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [activeTab, setActiveTab] = useState('find-jobs');

  const handleSearch = () => {
    console.log('Searching for jobs:', { jobTitle, location, industry });
    // API call would go here
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
                        onChange={(e) => setJobTitle(e.target.value)}
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
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium mb-2">
                        Industry (Optional)
                      </label>
                      <Select value={industry} onValueChange={setIndustry}>
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
                      disabled={!jobTitle.trim() || !location.trim()}
                    >
                      <Network className="h-4 w-4 mr-2" />
                      Find Opportunities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location-salary" className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <Input
                      id="location-salary"
                      placeholder="e.g. New York, NY"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="experience-level" className="block text-sm font-medium mb-2">
                      Experience Level
                    </label>
                    <Select>
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
                  
                  <Button className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Research Salary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FundamentaConnects;