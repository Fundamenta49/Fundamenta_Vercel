import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFallbackDebug from '@/components/admin/ai-fallback-debug';

const AdminPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="ai-system" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ai-system">AI System</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-system" className="space-y-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>AI System Administration</CardTitle>
              <CardDescription>
                Monitor and control the AI systems powering Fundamenta
              </CardDescription>
            </CardHeader>
          </Card>
          
          <AIFallbackDebug />
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                This section is under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>User management features will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                This section is under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics features will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;