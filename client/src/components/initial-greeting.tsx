import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat-interface";
import { Sparkles } from "lucide-react";

interface InitialGreetingProps {
  onComplete: () => void;
}

export default function InitialGreeting({ onComplete }: InitialGreetingProps) {
  const [hasCompletedChat, setHasCompletedChat] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to Fundamenta!
          </CardTitle>
          <CardDescription>
            I'd love to understand you better to create an experience that truly resonates 
            with your personality and preferences. Let's have a brief conversation that will 
            help me customize everything from the interface colors to how I communicate with you. 
            Your responses will shape how the entire app adapts to your unique style!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              onClick={onComplete}
              className="text-muted-foreground"
            >
              Skip personalization →
            </Button>
          </div>
          <ChatInterface 
            category="welcome" 
            onConversationComplete={() => setHasCompletedChat(true)}
          />
          {hasCompletedChat && (
            <div className="mt-6 flex justify-center">
              <Button onClick={onComplete}>
                Continue to Active You
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}