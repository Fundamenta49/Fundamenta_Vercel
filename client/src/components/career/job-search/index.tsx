import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Building, Clock, Briefcase, ListFilter, ChevronDown } from 'lucide-react';

// Placeholder job data
const SAMPLE_JOBS = [
  {
    id: 1,
    title: 'Marketing Coordinator',
    company: 'Global Marketing Inc.',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$45,000 - $60,000',
    posted: '2 days ago',
    description: 'We are looking for a Marketing Coordinator to assist in the planning, execution and optimization of our marketing campaigns.',
    requirements: [
      'Bachelor\'s degree in Marketing or related field',
      '1-3 years of experience in marketing',
      'Excellent communication skills',
      'Experience with social media platforms'
    ],
    tags: ['Marketing', 'Social Media', 'Content Creation']
  },
  {
    id: 2,
    title: 'Junior Web Developer',
    company: 'Tech Solutions LLC',
    location: 'Remote',
    type: 'Full-time',
    salary: '$60,000 - $80,000',
    posted: '5 days ago',
    description: 'Tech Solutions is seeking a passionate Junior Web Developer to join our innovative team.',
    requirements: [
      'Proficiency in HTML, CSS, and JavaScript',
      'Experience with React or similar framework',
      'Understanding of REST APIs',
      'Basic knowledge of Node.js'
    ],
    tags: ['React', 'JavaScript', 'Web Development']
  },
  {
    id: 3,
    title: 'Customer Service Representative',
    company: 'Customer First Corp',
    location: 'Chicago, IL',
    type: 'Part-time',
    salary: '$18 - $22 per hour',
    posted: '1 week ago',
    description: 'Join our customer support team to provide exceptional service to our clients via phone, email, and chat.',
    requirements: [
      'High school diploma or equivalent',
      'Previous customer service experience preferred',
      'Strong communication skills',
      'Basic computer proficiency'
    ],
    tags: ['Customer Service', 'Communication', 'Support']
  }
];

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  
  // Get selected job details
  const jobDetails = selectedJob ? SAMPLE_JOBS.find(job => job.id === selectedJob) : null;
  
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
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Results and Details */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Job Listings */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Job Listings</h3>
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              <span className="text-sm">Sort by: Relevance</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {SAMPLE_JOBS.map(job => (
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
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {job.posted}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Job Details */}
        <div className="md:col-span-3">
          {selectedJob ? (
            <Card>
              <CardHeader>
                <CardTitle>{jobDetails?.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Building className="h-3 w-3" /> {jobDetails?.company}
                </CardDescription>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {jobDetails?.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {jobDetails?.type}
                  </div>
                  <div>
                    {jobDetails?.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Posted {jobDetails?.posted}
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
                    <p>{jobDetails?.description}</p>
                    <div>
                      <Button>Apply Now</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="requirements" className="space-y-4 pt-4">
                    <ul className="list-disc pl-5 space-y-2">
                      {jobDetails?.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="company" className="space-y-4 pt-4">
                    <p>Company information will appear here.</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-10">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a job to view details</h3>
                <p className="text-muted-foreground">Click on a job listing to see the full description and requirements.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}