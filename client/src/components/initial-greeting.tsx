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
            Before we begin, I'd love to get to know you a little better to create a more
            personalized experience just for you. Let's have a quick chat!
          </CardDescription>
        </CardHeader>
        <CardContent>
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