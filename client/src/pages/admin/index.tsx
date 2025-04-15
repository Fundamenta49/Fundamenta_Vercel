import React, { useState } from 'react';
import { AIProviderStatusPanel } from '@/components/admin/ai-provider-status';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { TourResetButton } from '@/components/tour-reset-button';

/**
 * Admin Dashboard Page
 * 
 * This page provides access to admin controls that should only be accessible
 * to authorized personnel. It includes a simple authentication mechanism and
 * various admin panels for system management.
 */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Simple authentication - this should ideally be replaced with proper auth in production
  const adminPassword = 'fundiadmin'; // Very basic, meant only as a simple barrier
  
  const handleAuth = () => {
    if (password === adminPassword) {
      setAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid admin password');
    }
  };
  
  if (!authenticated) {
    return (
      <div className="container mx-auto py-10 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Admin Authentication
            </CardTitle>
            <CardDescription>
              You need administrator privileges to access this area
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Authentication Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Access Admin Panel</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> System Administration
          </CardTitle>
          <CardDescription>
            Advanced controls for managing application systems
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="ai-providers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ai-providers">AI Provider Management</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-providers" className="space-y-4">
          <div className="flex flex-col items-center">
            <AIProviderStatusPanel />
          </div>
        </TabsContent>
        
        <TabsContent value="system-health">
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  This panel will contain system health monitoring tools in the future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>System health monitoring is under development.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="diagnostics">
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Diagnostics</CardTitle>
                <CardDescription>
                  This panel will contain system diagnostic tools in the future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Diagnostic tools are under development.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}