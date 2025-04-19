import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

export default function JobSearch() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Job Search</h2>
      <Alert>
        <Briefcase className="h-4 w-4" />
        <AlertDescription>
          Job Search functionality is being rebuilt. Please check back soon.
        </AlertDescription>
      </Alert>
      <Button>Continue</Button>
    </div>
  );
}