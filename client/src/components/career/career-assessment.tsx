import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

export default function CareerAssessment() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Career Assessment</h2>
      <Alert>
        <GraduationCap className="h-4 w-4" />
        <AlertDescription>
          Career Assessment functionality is being rebuilt. Please check back soon.
        </AlertDescription>
      </Alert>
      <Button>Continue</Button>
    </div>
  );
}