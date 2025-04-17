import React from 'react';
import Layout from '@/components/layout';
import SavedQuizzes from '@/components/saved-quizzes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, GraduationCap, BookOpen, PauseCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function SavedQuizzesPage() {
  // In a real implementation, this would come from an auth context or similar
  // For demo purposes, we're using a hardcoded user ID
  const userId = 1;

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link href="/learning">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Learning
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Learning Dashboard</h1>
            <p className="text-muted-foreground mt-1">Pick up where you left off in your learning journey</p>
          </div>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="saved" className="gap-2">
              <PauseCircle className="h-4 w-4" />
              Saved Quizzes
            </TabsTrigger>
            <TabsTrigger value="pathways" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Learning Pathways
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-8">
            <SavedQuizzes userId={userId} />
          </TabsContent>
          
          <TabsContent value="pathways">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-700 mb-2">Learning Pathways</h3>
              <p className="text-blue-600">
                View all your learning pathways and continue your education journey.
              </p>
              <div className="mt-4">
                <Link href="/learning/pathways">
                  <Button>
                    Browse Pathways
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-orange-700 mb-2">Learning Resources</h3>
              <p className="text-orange-600">
                Explore curated resources to help you develop valuable life skills.
              </p>
              <div className="mt-4">
                <Link href="/learning/resources">
                  <Button variant="outline">
                    Browse Resources
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}