import { X, Brain, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ChatRedirect from '@/components/chat-redirect';
import { LEARNING_CATEGORY } from '@/components/chat-interface';

interface LearningCoachPopOutProps {
  onClose: () => void;
}

export default function LearningCoachPopOut({ onClose }: LearningCoachPopOutProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <Card className="shadow-xl border-2 border-orange-200">
        <CardHeader className="p-4 border-b bg-orange-50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-orange-700 flex items-center gap-2">
            <Brain className="h-5 w-5 text-orange-500" />
            Learning Coach
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <Alert className="mb-4 border-orange-500 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-800 text-sm">
              Ask Fundi for help with your learning journey, study strategies, or guidance on any educational topic.
            </AlertDescription>
          </Alert>
          
          <ChatRedirect category={LEARNING_CATEGORY} />
        </CardContent>
      </Card>
    </div>
  );
}