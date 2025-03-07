import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import InterviewPractice from "@/components/interview-practice";
import JobSearch from "@/components/job-search";
import SalaryInsights from "@/components/salary-insights";
import EmploymentRights from "@/components/employment-rights";
import RiasecTest from "@/components/riasec-test";
import EmotionalResilienceTracker from "@/components/emotional-resilience-tracker";

export default function Career() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Career Development</h1>

      <Tabs defaultValue="assessment">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="assessment">Career Assessment</TabsTrigger>
            <TabsTrigger value="resilience">EQ & Resilience</TabsTrigger>
            <TabsTrigger value="chat">Career AI Coach</TabsTrigger>
            <TabsTrigger value="search">Job Search</TabsTrigger>
            <TabsTrigger value="salary">Salary Insights</TabsTrigger>
            <TabsTrigger value="interview">Interview Practice</TabsTrigger>
            <TabsTrigger value="rights">Employment Rights</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assessment">
          <RiasecTest />
        </TabsContent>

        <TabsContent value="resilience">
          <EmotionalResilienceTracker />
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

        <TabsContent value="search">
          <JobSearch />
        </TabsContent>

        <TabsContent value="salary">
          <SalaryInsights />
        </TabsContent>

        <TabsContent value="interview">
          <InterviewPractice />
        </TabsContent>

        <TabsContent value="rights">
          <EmploymentRights />
        </TabsContent>
      </Tabs>
    </div>
  );
}