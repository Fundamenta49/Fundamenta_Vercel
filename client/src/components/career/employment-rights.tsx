import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';

export default function EmploymentRights() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Employment Rights</h2>
      <Alert>
        <Scale className="h-4 w-4" />
        <AlertDescription>
          Employment Rights functionality is being rebuilt. Please check back soon.
        </AlertDescription>
      </Alert>
      <Button>Continue</Button>
    </div>
  );
}