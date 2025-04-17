/**
 * Test Harness Page
 * 
 * This page runs various tests to ensure the application is working correctly.
 */

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { runFrameworkTests } from '@/lib/__tests__/framework-integration';

// Test runner component
const TestRunner: React.FC<{
  name: string;
  description: string;
  runTest: () => boolean | Promise<boolean>;
}> = ({ name, description, runTest }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failure'>('idle');
  const [output, setOutput] = useState<string[]>([]);
  
  // Intercept console logs during test
  const captureConsoleLogs = (fn: () => boolean | Promise<boolean>) => {
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    
    // Override console methods to capture logs
    console.log = (...args) => {
      logs.push(args.join(' '));
    };
    console.error = (...args) => {
      logs.push('ERROR: ' + args.join(' '));
    };
    console.warn = (...args) => {
      logs.push('WARN: ' + args.join(' '));
    };
    console.info = (...args) => {
      logs.push('INFO: ' + args.join(' '));
    };
    
    // Run the test
    try {
      const result = fn();
      
      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      
      setOutput(logs);
      
      // Handle both sync and async test functions
      if (result instanceof Promise) {
        return result.then(success => {
          setStatus(success ? 'success' : 'failure');
          return success;
        });
      } else {
        setStatus(result ? 'success' : 'failure');
        return result;
      }
    } catch (error) {
      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      
      logs.push('EXCEPTION: ' + (error instanceof Error ? error.message : String(error)));
      setOutput(logs);
      setStatus('failure');
      return false;
    }
  };
  
  // Run the test
  const handleRunTest = async () => {
    setStatus('running');
    setOutput([]);
    await captureConsoleLogs(runTest);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{name}</CardTitle>
          <div>
            {status === 'success' && <CheckCircle className="text-green-500 h-6 w-6" />}
            {status === 'failure' && <XCircle className="text-red-500 h-6 w-6" />}
            {status === 'running' && (
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            )}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleRunTest} 
          disabled={status === 'running'}
          variant={status === 'success' ? 'outline' : status === 'failure' ? 'destructive' : 'default'}
          className="mb-4 w-full"
        >
          {status === 'idle' ? 'Run Test' : 
           status === 'running' ? 'Running...' :
           status === 'success' ? 'Run Again' : 'Try Again'}
        </Button>
        
        {output.length > 0 && (
          <div className="bg-slate-50 border rounded-md p-3 max-h-60 overflow-y-auto">
            <pre className="text-xs text-slate-800 whitespace-pre-wrap">
              {output.join('\n')}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main test harness page
export default function TestHarness() {
  const [, navigate] = useLocation();
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <h1 className="text-2xl font-bold">Test Harness</h1>
      </div>
      
      <div className="mb-6">
        <p className="text-muted-foreground">
          Run tests to verify that various parts of the application are working correctly.
        </p>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Framework Integration Tests</h2>
        
        <TestRunner
          name="Educational Frameworks"
          description="Test SEL and Project LIFE frameworks integration"
          runTest={runFrameworkTests}
        />
      </div>
    </div>
  );
}