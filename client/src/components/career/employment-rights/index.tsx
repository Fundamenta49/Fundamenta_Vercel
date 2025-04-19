import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Info } from 'lucide-react';

const EmploymentRights: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-auto bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Employment Rights</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Learn about your rights and protections in the workplace
        </p>
      </div>

      {/* Info Alert */}
      <div className="px-6 py-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <p className="text-blue-700 dark:text-blue-300">
              Understanding your rights as an employee will help you navigate workplace situations and ensure fair treatment.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Employment Rights Resources</h2>
        <p className="text-muted-foreground">Content for Employment Rights section coming soon.</p>
      </div>
    </div>
  );
};

export default EmploymentRights;