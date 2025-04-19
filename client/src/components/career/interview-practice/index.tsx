import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function InterviewPractice() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Interview Practice</h2>
      <Alert>
        <MessageSquare className="h-4 w-4" />
        <AlertDescription>
          Interview Practice functionality is being rebuilt. Please check back soon.
        </AlertDescription>
      </Alert>
      <Button>Continue</Button>
    </div>
  );
}