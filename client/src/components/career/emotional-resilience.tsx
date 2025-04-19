import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

export default function EmotionalResilience() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">EQ & Resilience</h2>
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          Emotional Intelligence & Resilience functionality is being rebuilt. Please check back soon.
        </AlertDescription>
      </Alert>
      <Button>Continue</Button>
    </div>
  );
}