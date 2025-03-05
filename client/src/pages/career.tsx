import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import ResumeBuilder from "@/components/resume-builder";
import InterviewPractice from "@/components/interview-practice";
import CareerAssessment from "@/components/career-assessment";
import JobSearch from "@/components/job-search";
import SalaryInsights from "@/components/salary-insights";
import EmploymentRights from "@/components/employment-rights";

export default function Career() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Career Development</h1>

      <Tabs defaultValue="assessment">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="assessment">Career Assessment</TabsTrigger>
            <TabsTrigger value="search">Job Search</TabsTrigger>
            <TabsTrigger value="salary">Salary Insights</TabsTrigger>
            <TabsTrigger value="rights">Employment Rights</TabsTrigger>
            <TabsTrigger value="chat">Career Coach</TabsTrigger>
            <TabsTrigger value="resume">Resume Builder</TabsTrigger>
            <TabsTrigger value="interview">Interview Practice</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assessment">
          <CareerAssessment />
        </TabsContent>

        <TabsContent value="search">
          <JobSearch />
        </TabsContent>

        <TabsContent value="salary">
          <SalaryInsights />
        </TabsContent>

        <TabsContent value="rights">
          <EmploymentRights />
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Career AI Coach</CardTitle>
              <CardDescription>
                Get professional guidance for your career journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="career" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume">
          <ResumeBuilder />
        </TabsContent>

        <TabsContent value="interview">
          <InterviewPractice />
        </TabsContent>
      </Tabs>
    </div>
  );
}